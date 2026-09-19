import isBrowserEnvironment from "@/environments/frontend/isBrowserEnvironment.ts";
import type { Environment as EnvironmentBase } from "@/common/environment.ts";

export const Environment: typeof EnvironmentBase =
  isBrowserEnvironment(globalThis)
    ? (await import("@/environments/frontend/environment.ts")).Environment
    : (await import("@/environments/backend/environment.ts")).Environment;

export * from "@/base.ts";
