import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type TeaModalContextValue = {
  selectedTeaId: string | null;
  openTea: (id: string) => void;
  closeTea: () => void;
};

const TeaModalContext = createContext<TeaModalContextValue | null>(null);

export function TeaModalProvider({ children }: { children: React.ReactNode }) {
  const [selectedTeaId, setSelectedTeaId] = useState<string | null>(null);

  const openTea = useCallback((id: string) => {
    setSelectedTeaId(id);
  }, []);

  const closeTea = useCallback(() => {
    setSelectedTeaId(null);
  }, []);

  const value = useMemo(
    () => ({ selectedTeaId, openTea, closeTea }),
    [selectedTeaId, openTea, closeTea],
  );

  return <TeaModalContext.Provider value={value}>{children}</TeaModalContext.Provider>;
}

export function useTeaModal() {
  const ctx = useContext(TeaModalContext);
  if (!ctx) {
    throw new Error('useTeaModal must be used within TeaModalProvider');
  }
  return ctx;
}
