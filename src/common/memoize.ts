// deno-lint-ignore-file no-slow-types no-slow-types
type MemoizeContext = ClassGetterDecoratorContext | ClassMethodDecoratorContext;

type MemoizeArgument<Args extends unknown[] = unknown[]> =
  | ((...args: Args) => string | symbol)
  | string
  | symbol;

function jsonReplacer(_key: unknown, value: unknown): unknown {
  switch (typeof value) {
    case "bigint":
      return {
        __type: "bigint",
        value: value.toString(),
      };
    default:
      return value;
  }
}

function getMemoizeKey(
  contextName: string | symbol,
  contextType: "getter" | "method",
  cacheName: MemoizeArgument | undefined,
  args: unknown[],
): string | symbol {
  switch (typeof cacheName) {
    case "string":
    case "symbol":
      return cacheName;
    case "function":
      return cacheName(...args);
    default:
      return contextType === "method"
        ? Symbol(`memoize:${String(contextName)}:${JSON.stringify(args)}`)
        : Symbol(`memoize:${String(contextName)}`);
  }
}

/**
 * Memoizes the result of a class getter or method.
 *
 * The first result computed for a given cache key is stored directly on
 * the instance. Subsequent calls using the same key return the cached value
 * without executing the decorated getter or method again.
 *
 * For methods, arguments are used to distinguish cached values.
 * For getters, a single cached value is associated with the getter.
 *
 * @param cacheName - Optional cache key.
 *
 * A string or symbol can be used as a fixed cache key. A function can be
 * used to generate a cache key from the method arguments.
 *
 * @returns A class getter or method decorator.
 *
 * @example
 * ```ts
 * class Example {
 *   @memoize()
 *   get value() {
 *     return expensiveOperation();
 *   }
 * }
 * ```
 *
 * @example
 * Using a custom cache key:
 * ```ts
 * class Example {
 *   @memoize((id: string) => `user:${id}`)
 *   getUser(id: string) {
 *     return loadUser(id);
 *   }
 * }
 * ```
 *
 * @example
 * Using a fixed cache key:
 * ```ts
 * class Example {
 *   @memoize("value")
 *   getValue() {
 *     return expensiveOperation();
 *   }
 * }
 * ```
 */
export function memoize(cacheName?: MemoizeArgument) {
  return function <T, Args extends unknown[]>(
    getter: (...args: Args) => T,
    context: MemoizeContext,
  ) {
    const keyMap: Map<string, string | symbol> = new Map();

    const getterKey: string | symbol | undefined = context.kind === "getter"
      ? getMemoizeKey(context.name, context.kind, cacheName, [])
      : undefined;

    return function (this: any, ...args: Args): T {
      let key: string | symbol;

      if (context.kind === "method") {
        const mapKey = JSON.stringify(args, jsonReplacer);

        let methodKey = keyMap.get(mapKey);

        if (methodKey === undefined) {
          methodKey = getMemoizeKey(
            context.name,
            context.kind,
            cacheName,
            args,
          );

          keyMap.set(mapKey, methodKey);
        }

        key = methodKey;
      } else {
        key = getterKey!;
      }

      if (!Object.hasOwn(this, key)) {
        this[key] = getter.call(this, ...args);
      }

      return this[key];
    };
  };
}
