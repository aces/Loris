import React from 'react';
import type {ReactNode} from 'react';

/** Lay panels out in balanced rows of at most three columns. */
export default function PanelGrid({
  children,
}: {
  children: ReactNode;
}): React.ReactElement | null {
  const panels = React.Children.toArray(children);

  if (panels.length === 0) {
    return null;
  }

  const columnCount = panels.length === 4
    ? 2
    : Math.min(panels.length, 3);

  return (
    <div
      className='acquisition-panels'
      style={{
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
      }}
    >
      {panels}
    </div>
  );
}
