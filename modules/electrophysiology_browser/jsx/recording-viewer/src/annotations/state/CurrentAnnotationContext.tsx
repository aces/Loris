import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import {RecordingEvent} from '../../domain/types';

type CurrentAnnotationContextValue = {
  currentAnnotation: RecordingEvent | null,
  setCurrentAnnotation: React.Dispatch<React.SetStateAction<RecordingEvent | null>>,
};

const CurrentAnnotationContext =
  createContext<CurrentAnnotationContextValue | null>(null);

/** Current annotation provider component. */
export function CurrentAnnotationProvider({children}: {
  children: React.ReactNode,
}) {
  const [currentAnnotation, setCurrentAnnotation] = useState<RecordingEvent | null>(null);
  const value = useMemo(() => ({
    currentAnnotation,
    setCurrentAnnotation,
  }), [currentAnnotation]);

  return (
    <CurrentAnnotationContext.Provider value={value}>
      {children}
    </CurrentAnnotationContext.Provider>
  );
}

/** Use current annotation. */
export const useCurrentAnnotation = (): CurrentAnnotationContextValue => {
  const context = useContext(CurrentAnnotationContext);
  if (!context) {
    throw new Error(
      'useCurrentAnnotation must be used within a CurrentAnnotationProvider'
    );
  }
  return context;
};
