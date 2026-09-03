import isBrowserEnvironment from "@/environments/frontend/isBrowserEnvironment.ts";
import type { Loader } from "@/common/types.ts";

export const loader =
  (isBrowserEnvironment(globalThis)
    ? (await import("@/environments/frontend/main.ts")).loader
    : (await import("@/environments/backend/loader.ts"))
      .loader) satisfies Loader<any>;

export * from "@/base.ts";
