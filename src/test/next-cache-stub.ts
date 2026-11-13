/**
 * `next/cache` only loads inside the Next runtime. Tests want deterministic, uncached calls,
 * so `unstable_cache` becomes a passthrough.
 */
export function unstable_cache<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>
): (...args: TArgs) => Promise<TResult> {
  return fn;
}
