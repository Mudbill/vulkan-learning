declare global {
  interface ArrayBufferConstructor {
    fromAddress: (ptr: bigint, size: number) => ArrayBuffer;
    getAddress: (data: ArrayBuffer) => bigint;
  }
}
export {};
