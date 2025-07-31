declare module 'pdf2pic' {
  interface ConvertOptions {
    density?: number;
    saveFilename?: string;
    savePath?: string;
    format?: string;
    width?: number;
    height?: number;
  }

  interface ConvertResult {
    name: string;
    size: number;
    path: string;
    page: number;
  }

  interface Converter {
    (pageNumber: number): Promise<ConvertResult>;
  }

  function fromPath(pdfPath: string, options: ConvertOptions): Converter;

  const pdf2pic: {
    fromPath: typeof fromPath;
    default: {
      fromPath: typeof fromPath;
    };
  };

  export = pdf2pic;
}