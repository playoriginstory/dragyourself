// types/heic2any.d.ts
declare module 'heic2any' {
    const heic2any: (options: {
      blob: Blob;
      toType: string;
    }) => Promise<Blob | Blob[]>;
    export default heic2any;
  }
  