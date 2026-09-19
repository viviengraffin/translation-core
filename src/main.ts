import isBrowserEnvironment from "@/environments/frontend/isBrowserEnvironment.ts";
import type { Environment as EnvironmentBase } from "@/common/environment.ts";

/*
export const loader =
  (isBrowserEnvironment(globalThis)
    ? (await import("@/environments/frontend/main.ts")).loader
    : (await import("@/environments/backend/loader.ts"))
      .loader) satisfies Loader<any>;
*/

export const Environment: typeof EnvironmentBase =
  isBrowserEnvironment(globalThis)
    ? (await import("@/environments/frontend/environment.ts")).Environment
    : (await import("@/environments/backend/environment.ts")).Environment;

export * from "@/base.ts";
