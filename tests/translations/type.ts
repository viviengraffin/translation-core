export type TranslationType = {
  hello?: {
    world?: string;
    people?: (params: { name: string }) => string;
    universe?: string;
  };
};
