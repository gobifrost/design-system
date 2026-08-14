/// <reference types="vite/client" />

declare module "bifrost" {
  import type { ComponentType, PropsWithChildren } from "react";

  interface BifrostProviderProps {
    baseUrl: string;
    token: string;
    orgScope: string | null;
    appId: string | null;
    theme: "light" | "dark";
    supportsTheme?: boolean;
    onLogout: () => void;
  }

  export const BifrostProvider: ComponentType<PropsWithChildren<BifrostProviderProps>>;

  export interface BifrostContextValue {
    theme: "light" | "dark";
    setTheme: (theme: "light" | "dark") => void;
    toggleTheme: () => void;
    supportsTheme: boolean;
  }

  export function useBifrostContext(): BifrostContextValue;
}
