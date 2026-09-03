export default function isBrowserEnvironment(
  value: typeof globalThis,
): value is typeof globalThis & { window: Window } {
  return "window" in value;
}
