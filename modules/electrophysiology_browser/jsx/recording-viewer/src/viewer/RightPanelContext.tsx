import React, {createContext, useContext, useMemo, useState} from 'react';

export type RightPanelView = 'annotationForm' | 'eventList' | 'hedEndorsement';

type RightPanelContextValue = {
  rightPanel: RightPanelView | null,
  setRightPanel: (_: RightPanelView | null) => void,
};

const RightPanelContext = createContext<RightPanelContextValue | undefined>(
  undefined
);

/**
 * Own the currently open viewer side panel.
 */
export function RightPanelProvider({
  children,
}: {
  children: React.ReactNode,
}) {
  const [rightPanel, setRightPanel] = useState<RightPanelView | null>(null);
  const value = useMemo(
    () => ({rightPanel, setRightPanel}),
    [rightPanel]
  );

  return (
    <RightPanelContext.Provider value={value}>
      {children}
    </RightPanelContext.Provider>
  );
}

/**
 * Access the currently open viewer side panel.
 */
export function useRightPanel(): RightPanelContextValue {
  const context = useContext(RightPanelContext);
  if (context === undefined) {
    throw new Error('useRightPanel must be used within a RightPanelProvider');
  }
  return context;
}
