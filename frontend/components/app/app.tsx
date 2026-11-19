'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { TokenSource } from 'livekit-client';
import { useSession, useSessionContext } from '@livekit/components-react';
import { WarningIcon } from '@phosphor-icons/react/dist/ssr';
import type { AppConfig } from '@/app-config';
import { AgentSessionProvider } from '@/components/agents-ui/agent-session-provider';
import { StartAudioButton } from '@/components/agents-ui/start-audio-button';
import { ViewController } from '@/components/app/view-controller';
import { Toaster } from '@/components/ui/sonner';
import { useAgentErrors } from '@/hooks/useAgentErrors';
import { useDebugMode } from '@/hooks/useDebug';
import { getSandboxTokenSource } from '@/lib/utils';

export interface AgentDefinition {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  icon: string;
  themeColor: `#${string}`;
  badgeColor: string;
  glowColor: string;
  agentName: string;
  visualizerType: 'bar' | 'wave' | 'grid' | 'radial' | 'aura';
}

export const AGENTS: AgentDefinition[] = [
  {
    id: 'search',
    name: 'Neha – Your Personal AI Companion',
    title: 'Neha – Your Personal AI Companion',
    description:
      "Feeling alone? You can always talk to me. Let's explore the world together! I'm Neha, your personal AI companion, here to chat, discover new ideas, and explore anything you're curious about.",
    avatar: '/avatars/livesearch_agent.png',
    icon: 'Heart',
    themeColor: '#3b82f6',
    badgeColor: 'bg-blue-600/30 text-blue-400',
    glowColor: 'from-blue-600/30 via-blue-600/10 to-transparent',
    agentName: 'livesearch-agent',
    visualizerType: 'aura',
  },
];

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';

interface AppSetupProps {
  selectedAgent: AgentDefinition | null;
}

function AppSetup({ selectedAgent }: AppSetupProps) {
  useDebugMode({ enabled: IN_DEVELOPMENT });
  useAgentErrors();

  const { isConnected, room } = useSessionContext();

  useEffect(() => {
    if (isConnected && room && selectedAgent) {
      const agentId = selectedAgent.id;
      console.log('[AppSetup] Connected to room with Neha LiveSearch:', agentId);

      const encoder = new TextEncoder();
      const payload = JSON.stringify({ type: 'selected-agent', agentId });
      const data = encoder.encode(payload);

      room.localParticipant
        .publishData(data, {
          reliable: true,
          topic: 'agent-ui',
        })
        .catch((err) => {
          console.error('[AppSetup] Failed to publish selected-agent data packet:', err);
        });
    }
  }, [isConnected, room, selectedAgent]);

  return null;
}

interface AppProps {
  appConfig: AppConfig;
}

export function App({ appConfig }: AppProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition | null>(AGENTS[0]);
  const selectedAgentRef = useRef<AgentDefinition | null>(AGENTS[0]);

  const tokenSource = useMemo(() => {
    if (typeof process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT === 'string') {
      return getSandboxTokenSource(appConfig, () => selectedAgentRef.current?.agentName);
    }
    return TokenSource.custom(async () => {
      try {
        const activeAgent = selectedAgentRef.current || AGENTS[0];
        const agentId = activeAgent.id;
        const agentName = activeAgent.agentName || 'livesearch-agent';

        console.log('[token] fetching token for Neha agent:', agentId, 'name:', agentName);

        const res = await fetch('/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            room_config: { agents: [{ agentName: agentName, agent_name: agentName }] },
            selectedAgent: agentId,
          }),
        });
        return await res.json();
      } catch (error) {
        console.error('Error fetching connection details:', error);
        throw new Error('Error fetching connection details!');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appConfig]);

  const session = useSession(
    tokenSource,
    selectedAgent?.agentName
      ? { agentName: selectedAgent.agentName }
      : { agentName: 'livesearch-agent' }
  );

  const handleStartCallWithAgent = (
    agent: AgentDefinition,
    startFn: () => void
  ) => {
    selectedAgentRef.current = agent;
    setSelectedAgent(agent);
    setTimeout(() => {
      startFn();
    }, 50);
  };

  return (
    <AgentSessionProvider session={session}>
      <AppSetup selectedAgent={selectedAgent} />
      <main className="min-h-screen w-full">
        <ViewController
          appConfig={appConfig}
          selectedAgent={selectedAgent}
          onSelectAgent={(agent, startFn) =>
            handleStartCallWithAgent(agent, startFn)
          }
        />
      </main>
      <StartAudioButton label="Start Audio" />
      <Toaster
        icons={{
          warning: <WarningIcon weight="bold" />,
        }}
        position="top-center"
        className="toaster group"
        style={
          {
            '--normal-bg': 'var(--popover)',
            '--normal-text': 'var(--popover-foreground)',
            '--normal-border': 'var(--border)',
          } as React.CSSProperties
        }
      />
    </AgentSessionProvider>
  );
}
