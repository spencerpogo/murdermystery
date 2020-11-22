import { ReactNode, useEffect, useState } from "react";

export function useClientOnly(): boolean {
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => setHasMounted(true), []);

  return hasMounted;
}

export function ClientOnly({ children }: { children: ReactNode }): ReactNode {
  if (useClientOnly()) {
    return children;
  }
  return null;
}
