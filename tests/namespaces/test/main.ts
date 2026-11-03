export default {
  fr: async () => (await import("./fr.ts")).default,
  en: async () => (await import("./en.ts")).default,
};
