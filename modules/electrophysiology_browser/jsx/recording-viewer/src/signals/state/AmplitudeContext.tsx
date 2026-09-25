import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type AmplitudeContextValue = {
  amplitudeScale: number,
  scaleAmplitude: (_: number) => void,
  resetAmplitude: () => void,
};

const AmplitudeContext = createContext<AmplitudeContextValue | undefined>(
  undefined
);

/**
 * Own the amplitude scale used by the signal viewer.
 */
export function AmplitudeProvider({children}: {
  children: React.ReactNode,
}) {
  const [amplitudeScale, setAmplitudeScale] = useState(1);

  const scaleAmplitude = useCallback((factor: number) => {
    setAmplitudeScale((scale) => scale * factor);
  }, []);

  const resetAmplitude = useCallback(() => {
    setAmplitudeScale(1);
  }, []);

  const value = useMemo(() => ({
    amplitudeScale,
    scaleAmplitude,
    resetAmplitude,
  }), [amplitudeScale, resetAmplitude, scaleAmplitude]);

  return (
    <AmplitudeContext.Provider value={value}>
      {children}
    </AmplitudeContext.Provider>
  );
}

/**
 * Access the amplitude scale shared by the signal viewer.
 */
export function useAmplitude(): AmplitudeContextValue {
  const context = useContext(AmplitudeContext);
  if (context === undefined) {
    throw new Error('useAmplitude must be used within an AmplitudeProvider');
  }
  return context;
}
