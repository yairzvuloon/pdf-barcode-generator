import { config } from "./config.js";
import { formatDate } from "./formatDate.js";
import { groupBarcodesByPrice } from "./groupBarcodesByPrice.js";

/**
 *  @param {PDFKit.PDFDocument} doc - The PDF document instance.
 *  @param {Array<{ code: string, price: number }>} barcodeList - The list of barcodes with their associated prices.
 *  @returns {Array<{ title: string, date: string, items: Array<{ code: string, price: number }> }>} pages - The array of page objects containing page data.
 */
export function createPageObjects(doc, barcodeList) {
  const currentDate = new Date();
  const { year, month } = formatDate(currentDate);

  const { pageHeight } = config.getPageDimensions(doc);

  const { barcodeHeight, textHeight, verticalSpacing, headerHeight } =
    config.getBarcodeDimension();

  const barcodesByPrice = groupBarcodesByPrice(barcodeList);

  const sortedPrices = Object.keys(barcodesByPrice)
    .map(Number)
    .sort((a, b) => a - b);

  const pages = [];

  for (const price of sortedPrices) {
    const items = barcodesByPrice[price];
    const { numColumns } = config.getPageDimensions(doc);

    const itemsPerColumn = calculateItemsPerColumn({
      pageHeight,
      headerHeight,
      barcodeHeight,
      textHeight,
      verticalSpacing,
    });

    const itemsPerPage = itemsPerColumn * numColumns;

    const pricePagesNumber = Math.ceil(items.length / itemsPerPage);

    for (const pricePageIndex of [...Array(pricePagesNumber).keys()]) {
      // Get the items for the current page
      const startIndex = pricePageIndex * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const itemsForPage = items.slice(startIndex, endIndex);

      // Create a page object
      pages.push({
        title: `Price: ₪${price}`,
        date: `${month} ${year}`,
        items: itemsForPage,
      });
    }
  }

  return pages;
}

/**
 * Calculates the number of items that can fit per column on a page.
 * @param {Object} params - Parameters for calculation.
 * @param {number} params.pageHeight - The height of the page content area.
 * @param {number} params.headerHeight - The height of the header.
 * @param {number} params.barcodeHeight - The height of the barcode image.
 * @param {number} params.textHeight - The height of the text below the barcode.
 * @param {number} params.verticalSpacing - The vertical spacing between barcodes.
 * @returns {number} - The number of items per column.
 */
function calculateItemsPerColumn({
  pageHeight,
  headerHeight,
  barcodeHeight,
  textHeight,
  verticalSpacing,
}) {
  // Calculate items per column based on barcode dimensions
  return Math.floor(
    (pageHeight - headerHeight) / (barcodeHeight + textHeight + verticalSpacing)
  );
}
