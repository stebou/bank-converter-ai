declare module 'pdf-poppler' {
  interface ConvertOptions {
    format?: string;
    out_dir?: string;
    out_prefix?: string;
    page?: number;
    single_file?: boolean;
    resolution?: number;
  }

  function convert(pdfPath: string, options: ConvertOptions): Promise<string[]>;

  export { convert };
}