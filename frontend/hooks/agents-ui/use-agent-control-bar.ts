import { useCallback, useMemo, useState } from 'react';
import { Track } from 'livekit-client';
import {
  type TrackReference,
  useLocalParticipant,
  useLocalParticipantPermissions,
  useMaybeSessionContext,
  usePersistentUserChoices,
  useSessionContext,
  useTrackToggle,
} from '@livekit/components-react';

const trackSourceToProtocol = (source: Track.Source) => {
  // NOTE: this mapping avoids importing the protocol package as that leads to a significant bundle size increase
  switch (source) {
    case Track.Source.Camera:
      return 1;
    case Track.Source.Microphone:
      return 2;
    case Track.Source.ScreenShare:
      return 3;
    default:
      return 0;
  }
};

export interface PublishPermissions {
  camera: boolean;
  microphone: boolean;
  screenShare: boolean;
  data: boolean;
}

export function usePublishPermissions(): PublishPermissions {
  const localPermissions = useLocalParticipantPermissions();

  const canPublishSource = (source: Track.Source) => {
    return (
      !!localPermissions?.canPublish &&
      (localPermissions.canPublishSources.length === 0 ||
        localPermissions.canPublishSources.includes(trackSourceToProtocol(source)))
    );
  };

  return {
    camera: canPublishSource(Track.Source.Camera),
    microphone: canPublishSource(Track.Source.Microphone),
    screenShare: canPublishSource(Track.Source.ScreenShare),
    data: localPermissions?.canPublishData ?? false,
  };
}

export interface UseInputControlsProps {
  saveUserChoices?: boolean;
  onDisconnect?: () => void;
  onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
}

export interface UseInputControlsReturn {
  microphoneTrack?: TrackReference;
  microphoneToggle: ReturnType<typeof useTrackToggle<Track.Source.Microphone>>;
  cameraToggle: ReturnType<typeof useTrackToggle<Track.Source.Camera>>;
  screenShareToggle: ReturnType<typeof useTrackToggle<Track.Source.ScreenShare>>;
  handleAudioDeviceChange: (deviceId: string) => void;
  handleVideoDeviceChange: (deviceId: string) => void;
  handleMicrophoneDeviceSelectError: (error: Error) => void;
  handleCameraDeviceSelectError: (error: Error) => void;
}

export function useInputControls({
  saveUserChoices = true,
  onDeviceError,
}: UseInputControlsProps = {}): UseInputControlsReturn {
  const session = useMaybeSessionContext();
  const room = session?.room;
  const { isMicrophoneEnabled, localParticipant } = useLocalParticipant({ room });
  const [isMicPending, setIsMicPending] = useState(false);

  const microphoneToggle = useTrackToggle({
    source: Track.Source.Microphone,
    room,
    onDeviceError: (error) => onDeviceError?.({ source: Track.Source.Microphone, error }),
  });

  const cameraToggle = useTrackToggle({
    source: Track.Source.Camera,
    room,
    onDeviceError: (error) => onDeviceError?.({ source: Track.Source.Camera, error }),
  });

  const screenShareToggle = useTrackToggle({
    source: Track.Source.ScreenShare,
    room,
    onDeviceError: (error) => onDeviceError?.({ source: Track.Source.ScreenShare, error }),
  });

  const {
    saveAudioInputEnabled,
    saveVideoInputEnabled,
    saveAudioInputDeviceId,
    saveVideoInputDeviceId,
  } = usePersistentUserChoices({ preventSave: !saveUserChoices });

  const handleAudioDeviceChange = useCallback(
    (deviceId: string) => {
      saveAudioInputDeviceId(deviceId ?? 'default');
    },
    [saveAudioInputDeviceId]
  );

  const handleVideoDeviceChange = useCallback(
    (deviceId: string) => {
      saveVideoInputDeviceId(deviceId ?? 'default');
    },
    [saveVideoInputDeviceId]
  );

  const handleToggleCamera = useCallback(
    async (enabled?: boolean) => {
      if (screenShareToggle.enabled) {
        screenShareToggle.toggle(false);
      }
      await cameraToggle.toggle(enabled);
      // persist video input enabled preference
      saveVideoInputEnabled(!cameraToggle.enabled);
    },
    [cameraToggle, screenShareToggle, saveVideoInputEnabled]
  );

  const handleToggleMicrophone = useCallback(
    async (targetEnabled?: boolean) => {
      if (isMicPending) return undefined;
      setIsMicPending(true);
      try {
        const current =
          typeof isMicrophoneEnabled === 'boolean'
            ? isMicrophoneEnabled
            : (localParticipant ? localParticipant.isMicrophoneEnabled : microphoneToggle.enabled);
        const next = typeof targetEnabled === 'boolean' ? targetEnabled : !current;

        if (localParticipant) {
          await localParticipant.setMicrophoneEnabled(next);
        } else {
          await microphoneToggle.toggle(next);
        }
        saveAudioInputEnabled(next);
        return next;
      } catch (error) {
        console.error('[useInputControls] Failed to toggle microphone:', error);
        onDeviceError?.({ source: Track.Source.Microphone, error: error as Error });
        return undefined;
      } finally {
        setIsMicPending(false);
      }
    },
    [isMicPending, isMicrophoneEnabled, localParticipant, microphoneToggle, onDeviceError, saveAudioInputEnabled]
  );

  const handleToggleScreenShare = useCallback(
    async (enabled?: boolean) => {
      if (cameraToggle.enabled) {
        cameraToggle.toggle(false);
      }
      await screenShareToggle.toggle(enabled);
    },
    [cameraToggle, screenShareToggle]
  );

  const handleMicrophoneDeviceSelectError = useCallback(
    (error: Error) => onDeviceError?.({ source: Track.Source.Microphone, error }),
    [onDeviceError]
  );

  const handleCameraDeviceSelectError = useCallback(
    (error: Error) => onDeviceError?.({ source: Track.Source.Camera, error }),
    [onDeviceError]
  );

  const effectiveMicrophoneTrack = useMemo(() => {
    if (session?.local?.microphoneTrack) {
      return session.local.microphoneTrack;
    }
    const pub = localParticipant?.getTrackPublication(Track.Source.Microphone);
    if (localParticipant && pub) {
      return {
        participant: localParticipant,
        publication: pub,
        source: Track.Source.Microphone,
      } as TrackReference;
    }
    return undefined;
  }, [session, localParticipant]);

  const effectiveMicEnabled =
    typeof isMicrophoneEnabled === 'boolean'
      ? isMicrophoneEnabled
      : (localParticipant?.isMicrophoneEnabled ?? microphoneToggle.enabled);

  const effectiveMicPending = isMicPending || microphoneToggle.pending;

  return {
    microphoneTrack: effectiveMicrophoneTrack,
    cameraToggle: {
      ...cameraToggle,
      toggle: handleToggleCamera,
    },
    microphoneToggle: {
      ...microphoneToggle,
      enabled: effectiveMicEnabled,
      pending: effectiveMicPending,
      toggle: handleToggleMicrophone,
    },
    screenShareToggle: {
      ...screenShareToggle,
      toggle: handleToggleScreenShare,
    },
    handleAudioDeviceChange,
    handleVideoDeviceChange,
    handleMicrophoneDeviceSelectError,
    handleCameraDeviceSelectError,
  };
}
