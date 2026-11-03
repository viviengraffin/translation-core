import { TranslationNamespaces } from "@/base.ts";

export default new TranslationNamespaces(["test"], {
    hello: async ()=>(await import("./hello/main.ts")).default,
    test: async ()=>(await import("./test/main.ts")).default,
});