'use client';

import React, { useRef, useState } from 'react';
import {
  FileTextIcon,
  NewspaperIcon,
} from 'lucide-react';
import { AnimatePresence, type MotionProps, motion } from 'motion/react';
import {
  useAgent,
  useDataChannel,
  useSessionContext,
  useSessionMessages,
} from '@livekit/components-react';
import { AgentChatTranscript } from '@/components/agents-ui/agent-chat-transcript';
import {
  AgentControlBar,
  type AgentControlBarControls,
} from '@/components/agents-ui/agent-control-bar';
import { NewsOverlay } from '@/components/agents-ui/news-overlay';
import { NewsPanel } from '@/components/agents-ui/news-panel';
import { NotebookPanel } from '@/components/agents-ui/notebook-panel';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { cn } from '@/lib/shadcn/utils';
import { TileLayout } from './tile-view';

const MotionMessage = motion.create(Shimmer);

const BOTTOM_VIEW_MOTION_PROPS: MotionProps = {
  variants: {
    visible: { opacity: 1, translateY: '0%' },
    hidden: { opacity: 0, translateY: '100%' },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: { duration: 0.3, delay: 0.5, ease: 'easeOut' },
};

const SHIMMER_MOTION_PROPS: MotionProps = {
  variants: {
    visible: { opacity: 1, transition: { ease: 'easeIn', duration: 0.5, delay: 0.8 } },
    hidden: { opacity: 0, transition: { ease: 'easeIn', duration: 0.5, delay: 0 } },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
};

export function Fade({
  top = false,
  bottom = false,
  className,
}: {
  top?: boolean;
  bottom?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'from-background pointer-events-none h-4 bg-linear-to-b to-transparent',
        top && 'bg-linear-to-b',
        bottom && 'bg-linear-to-t',
        className
      )}
    />
  );
}

export interface AgentSessionView_01Props {
  preConnectMessage?: string;
  supportsChatInput?: boolean;
  supportsVideoInput?: boolean;
  supportsScreenShare?: boolean;
  isPreConnectBufferEnabled?: boolean;
  audioVisualizerType?: 'bar' | 'wave' | 'grid' | 'radial' | 'aura';
  audioVisualizerColor?: `#${string}`;
  audioVisualizerColorShift?: number;
  audioVisualizerBarCount?: number;
  audioVisualizerGridRowCount?: number;
  audioVisualizerGridColumnCount?: number;
  audioVisualizerRadialBarCount?: number;
  audioVisualizerRadialRadius?: number;
  audioVisualizerWaveLineWidth?: number;
  avatarUrl?: string;
  agentId?: string;
  className?: string;
}

export function AgentSessionView_01({
  preConnectMessage = 'Neha is here for you. Talk about your day, brainstorm ideas, or ask to search...',
  supportsChatInput: _supportsChatInput = false,
  supportsVideoInput: _supportsVideoInput = false,
  supportsScreenShare: _supportsScreenShare = false,
  isPreConnectBufferEnabled: _isPreConnectBufferEnabled = true,
  audioVisualizerType,
  audioVisualizerColor,
  audioVisualizerColorShift,
  audioVisualizerBarCount,
  audioVisualizerGridRowCount,
  audioVisualizerGridColumnCount,
  audioVisualizerRadialBarCount,
  audioVisualizerRadialRadius,
  audioVisualizerWaveLineWidth,
  avatarUrl = '/avatars/livesearch_agent.png',
  agentId = 'search',
  ref,
  className,
  ...props
}: React.ComponentProps<'section'> & AgentSessionView_01Props) {
  const session = useSessionContext();
  const { messages } = useSessionMessages(session);
  const [chatOpen, setChatOpen] = useState(false);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [newsOverlayKey, setNewsOverlayKey] = useState(0);
  const { state: agentState } = useAgent();

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Automatically open the notepad whenever Neha writes notes, thoughts, or collected data
  const onDataMessage = React.useCallback((msg: { payload: Uint8Array }) => {
    try {
      const text = new TextDecoder().decode(msg.payload);
      const data = JSON.parse(text);
      if (data.type === 'notebook_append') {
        setNotebookOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);
  useDataChannel('agent-ui', onDataMessage);

  const controls: AgentControlBarControls = {
    leave: true,
    microphone: true,
    chat: false,
    camera: false,
    screenShare: false,
  };

  return (
    <section
      ref={ref}
      className={cn('bg-background/80 relative z-10 h-full w-full overflow-hidden', className)}
      {...props}
    >
      <div className="absolute inset-0 flex">
        {/* Left Column: Live Transcript */}
        <div className="hidden w-[300px] shrink-0 flex-col border-r border-white/5 lg:flex">
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-cyan-500" />
            </span>
            <h3 className="gradient-text text-[10px] font-bold tracking-widest uppercase">
              Live Transcript
            </h3>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <Fade top className="absolute inset-x-0 top-0 z-10 h-8" />
            <AgentChatTranscript
              agentState={agentState}
              messages={messages}
              className="h-full [&_.is-user>div]:rounded-[18px] [&>div>div]:px-3 [&>div>div]:pt-10"
            />
          </div>
        </div>

        {/* Center Column: Visualizer, Video, Controls */}
        <div className="relative flex flex-1 flex-col h-full overflow-hidden justify-between">
          <Fade top className="absolute inset-x-4 top-0 z-10 h-40 pointer-events-none" />
          <div className="pointer-events-none absolute top-0 bottom-[100px] flex w-full flex-col z-30 lg:hidden">
            <AnimatePresence>
              {chatOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pointer-events-auto flex h-full w-full flex-col gap-4 space-y-3 bg-background/95 backdrop-blur-md p-4"
                >
                  <div
                    ref={scrollAreaRef}
                    className="mask-t-from-10% mask-b-to-90% flex-1 overflow-y-auto px-4"
                  >
                    <AgentChatTranscript
                      agentState={agentState}
                      messages={messages}
                      className="mx-auto max-w-2xl"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Upper Content: TileLayout (Avatar/Visualizer) */}
          <div className="relative flex flex-1 min-h-0 w-full items-center justify-center overflow-hidden">
            <TileLayout
              chatOpen={chatOpen}
              audioVisualizerType={audioVisualizerType}
              audioVisualizerColor={audioVisualizerColor}
              audioVisualizerColorShift={audioVisualizerColorShift}
              audioVisualizerBarCount={audioVisualizerBarCount}
              audioVisualizerGridRowCount={audioVisualizerGridRowCount}
              audioVisualizerGridColumnCount={audioVisualizerGridColumnCount}
              audioVisualizerRadialBarCount={audioVisualizerRadialBarCount}
              audioVisualizerRadialRadius={audioVisualizerRadialRadius}
              audioVisualizerWaveLineWidth={audioVisualizerWaveLineWidth}
              avatarUrl={avatarUrl}
              className={cn('h-full w-full', chatOpen && 'max-lg:hidden')}
            />
          </div>

          {/* Bottom Bar: Microphone & End Call strictly at the bottom */}
          <motion.div
            {...BOTTOM_VIEW_MOTION_PROPS}
            className="mt-auto w-full bg-background/90 border-border/20 relative z-50 flex shrink-0 flex-col items-center justify-center gap-3 border-t p-3 backdrop-blur-md md:p-5"
          >
            {messages.length === 0 && (
              <MotionMessage
                {...SHIMMER_MOTION_PROPS}
                className="text-muted-foreground text-center text-xs md:text-sm"
              >
                {preConnectMessage}
              </MotionMessage>
            )}

            <div className="flex items-center gap-2">
              <AgentControlBar
                controls={controls}
                isConnected={true}
                onDisconnect={() => session.end()}
                onIsChatOpenChange={setChatOpen}
              />
            </div>
          </motion.div>
        </div>

        {/* Right Column: Live News & Notepad */}
        <div className="hidden w-[320px] shrink-0 flex-col gap-3 border-l border-white/5 p-3 xl:flex">
          <div className="flex-1 overflow-hidden">
            <NewsPanel agentId={agentId} />
          </div>
          <button
            onClick={() => setNotebookOpen(!notebookOpen)}
            className={cn(
              'glass neon-glow-border flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-semibold tracking-wider uppercase transition-all hover:bg-white/[0.06]',
              notebookOpen ? 'text-violet-400' : 'text-foreground/40'
            )}
          >
            <FileTextIcon className="size-4" />
            <span className="gradient-text">Notepad</span>
          </button>
        </div>
      </div>

      <NotebookPanel isOpen={notebookOpen} onClose={() => setNotebookOpen(false)} />
      <NewsOverlay key={newsOverlayKey} />

      {/* Floating Action Buttons for Small Screens */}
      <div className="fixed right-3 bottom-36 z-[100] flex flex-col gap-2 xl:hidden">
        <button
          onClick={() => setNewsOverlayKey((k) => k + 1)}
          className="glass flex size-10 items-center justify-center rounded-full"
          title="Show news"
        >
          <NewspaperIcon className="size-4 text-cyan-400" />
        </button>
        <button
          onClick={() => setNotebookOpen(!notebookOpen)}
          className="glass animate-pulse-neon flex size-10 items-center justify-center rounded-full"
          title="Notepad"
        >
          <FileTextIcon className="size-4 text-violet-400" />
        </button>
      </div>
    </section>
  );
}
