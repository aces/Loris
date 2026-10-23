import React from 'react';
import LorisPanel from 'jsx/Panel';

type PanelProps = Omit<React.ComponentProps<typeof LorisPanel>, 'title'> & {
  title?: React.ReactNode;
};

/** LORIS panel with its runtime-supported title type exposed to TypeScript. */
const Panel = LorisPanel as React.ComponentType<PanelProps>;

export default Panel;
