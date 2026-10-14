/**
 * Safe JSON parser utility that handles both native parsed JSON objects/arrays (PostgreSQL Json columns)
 * and legacy stringified JSON gracefully without throwing exceptions.
 */
export function parseJsonField<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === "object") {
    return value as T;
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return (parsed ?? fallback) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}
