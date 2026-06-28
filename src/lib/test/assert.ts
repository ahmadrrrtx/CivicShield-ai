export function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

export function assertEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(`${message} Expected: ${String(expected)} Received: ${String(actual)}`);
  }
}
