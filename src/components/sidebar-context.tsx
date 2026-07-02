'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
  toggleCollapsed: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggleCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}
