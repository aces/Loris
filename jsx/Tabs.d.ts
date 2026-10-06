import {ComponentType, ReactNode} from 'react';

type TabsProps = {
  tabs: {id: string, label: ReactNode}[],
  defaultTab?: string,
  updateURL?: boolean,
  onTabChange?: (tabId: string) => void,
  children?: ReactNode,
};

export const Tabs: ComponentType<TabsProps>;
export const VerticalTabs: ComponentType<TabsProps>;
export const TabPane: ComponentType<{
  TabId: string,
  Title?: string,
  activeTab?: string,
  children?: ReactNode,
}>;
