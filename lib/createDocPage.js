import { config } from "./config.js";
import { generateBarcode } from "./generateBarcode.js";

/**
 * Creates a page in the PDF document with the provided content.
 * @param {PDFKit.PDFDocument} doc
 * @param {number} pageIndex - The index of the current page.
 * @param {{ title: string, date: string, items: Array<{ code: string, price: number }> }} page - The current page data.
 */
export function createDocPage(doc, pageIndex, page) {
  const shouldAddPage = pageIndex > 0;

  if (shouldAddPage) {
    doc.addPage();
  }

  const currentY = addPageHeader(doc, page.date, page.title);

  addBarcodesToPage(doc, page, currentY);

  const pageNumber = pageIndex + 1;

  addPageFooter(doc, pageNumber);
}

/**
 * Adds a header to the current page of the PDF document and returns the new Y position.
 * @param {PDFKit.PDFDocument} doc - The PDF document instance.
 * @param {string} date - The formatted date to display.
 * @param {string} title - The title to display (e.g., price group).
 * @returns {number} - The Y position after the header.
 */
function addPageHeader(doc, date, title) {
  const topMargin = doc.page.margins.top;

  // Set the starting Y position
  let currentY = topMargin;

  doc.font("Roboto-Bold").fontSize(12);
  doc.text(date, doc.page.margins.left, currentY, {
    align: "left",
  });

  currentY += doc.currentLineHeight();

  doc.font("Roboto-Bold").fontSize(16);
  doc.text(title, doc.page.margins.left, currentY, {
    align: "center",
  });

  currentY += doc.currentLineHeight() + 10; // Add extra spacing after the header

  // Move the document's Y position to the current Y
  doc.y = currentY;

  return currentY;
}

/**
 * Adds a footer to the current page of the PDF document.
 * @param {PDFKit.PDFDocument} doc - The PDF document instance.
 * @param {number} pageNumber - The current page number.
 */
function addPageFooter(doc, pageNumber) {
  const bottomMargin = doc.page.margins.bottom;
  doc.font("Roboto").fontSize(12);

  const pageNumberText = pageNumber.toString(); // Only the page number
  const textWidth = doc.widthOfString(pageNumberText);
  const xPosition = (doc.page.width - textWidth) / 2;
  const yPosition = doc.page.height - bottomMargin - 20; // Adjusted for better positioning

  doc.text(pageNumberText, xPosition, yPosition, {
    align: "left",
  });
}

/**
 * Adds barcodes to the page of the PDF document.
 * @param {PDFKit.PDFDocument} doc
 * @param {{ title: string, date: string, items: Array<{ code: string, price: number }> }} page - The current page.
 * @param {number} currentY - The starting Y position after the header.
 */
function addBarcodesToPage(doc, page, currentY) {
  const { columnWidth, numColumns } = config.getPageDimensions(doc);
  const { barcodeWidth, barcodeHeight, textHeight, verticalSpacing } =
    config.getBarcodeDimension();

  // Iterate over items on the current page
  page.items.forEach((item, index) => {
    const column = index % numColumns;
    const row = Math.floor(index / numColumns);

    const xPosition =
      doc.page.margins.left +
      column * columnWidth +
      (columnWidth - barcodeWidth) / 2;

    const yPosition =
      currentY + row * (barcodeHeight + textHeight + verticalSpacing);

    // Generate barcode image
    const barcodeImageBuffer = generateBarcode(
      item.code,
      barcodeWidth,
      barcodeHeight
    );

    // Add barcode image to the PDF
    doc.image(barcodeImageBuffer, xPosition, yPosition, {
      width: barcodeWidth,
      height: barcodeHeight,
    });

    // Add barcode number under the image
    doc
      .font("Roboto")
      .fontSize(12)
      .text(item.code, xPosition, yPosition + barcodeHeight, {
        width: barcodeWidth,
        align: "center",
      });
  });
}
