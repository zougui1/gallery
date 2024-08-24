declare module 'imghash' {
  function hash(filePath: string, bitSize?: number | undefined): Promise<string>;

  export = { hash };
}
