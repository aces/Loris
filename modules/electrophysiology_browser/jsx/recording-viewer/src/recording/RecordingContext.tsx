import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

export type RecordingMetadata = {
  chunksURL: string,
  channelDelimiter: string,
  samplingFrequency: string,
  eegMontageName: string,
  physioFileID: number,
  shapes: number[][],
  validSamples: number[],
  timeInterval: [number, number],
  signalRange: [number, number],
  recordingHasHED: boolean,
};

type RecordingContextValue = RecordingMetadata & {
  limit: number,
  setLimit: (limit: number) => void,
};

const RecordingContext = createContext<RecordingContextValue | undefined>(
  undefined
);

/** Expose recording-level inputs and the viewer's channel-page size. */
export function RecordingProvider({children, metadata, initialLimit}: {
  children: React.ReactNode,
  metadata: RecordingMetadata,
  initialLimit: number,
}) {
  const [limit, setLimit] = useState(initialLimit);
  const value = useMemo(() => ({
    ...metadata,
    limit,
    setLimit,
  }), [metadata, limit]);

  return (
    <RecordingContext.Provider value={value}>
      {children}
    </RecordingContext.Provider>
  );
}

/** Access metadata for the recording displayed by this viewer. */
export function useRecording(): RecordingContextValue {
  const context = useContext(RecordingContext);
  if (context === undefined) {
    throw new Error('useRecording must be used within a RecordingProvider');
  }
  return context;
}
