export function getEnv(name: string): string | undefined {
  if (process === undefined) {
    throw new Error("getEnv need to be start in backend environnment");
  }

  return process.env[name];
}
