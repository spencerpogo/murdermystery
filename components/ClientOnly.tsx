import { ReactNode, useEffect, useState } from "react";

export function useClientOnly() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => setHasMounted(true));

  return hasMounted;
}

export function ClientOnly({ children }: { children: ReactNode }) {
  if (useClientOnly()) {
    return children;
  } else {
    return null;
  }
}
