export const config = {
  pdfFilePrefix: "barcodes",
  fonsts: [
    { name: "Roboto", path: "fonts/Roboto-Regular.ttf" },
    { name: "Roboto-Bold", path: "fonts/Roboto-Bold.ttf" },
  ],
  /**
   * Retrieves the dimensions of the PDF page, accounting for margins.
   * @param {PDFKit.PDFDocument} doc - The PDF document instance.
   * @returns {{ pageWidth: number, pageHeight: number, numColumns: number, columnWidth: number }} - The width and height of the page content area.
   */
  getPageDimensions(doc) {
    const pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const pageHeight =
      doc.page.height - doc.page.margins.top - doc.page.margins.bottom;

    const numColumns = 2; // Number of columns per page

    const columnWidth = pageWidth / numColumns;

    return {
      numColumns,
      columnWidth,
      pageWidth,
      pageHeight,
    };
  },
  /**
   * Provides the dimensions and spacing for barcodes and related elements.
   * @returns {{ barcodeWidth: number, barcodeHeight: number, textHeight: number, verticalSpacing: number, headerHeight: number }} - The dimensions and spacing values.
   */
  getBarcodeDimension() {
    return {
      barcodeWidth: 200, // Adjusted barcode width in pixels
      barcodeHeight: 100, // Adjusted barcode height in pixels
      textHeight: 15,
      verticalSpacing: 10,
      headerHeight: 60,
    };
  },
};
