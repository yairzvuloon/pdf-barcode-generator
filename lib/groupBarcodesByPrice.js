/**
 * Groups the barcodes by their price.
 * @param {Array<{ code: string, price: number }>} barcodeList - The list of barcodes with prices.
 * @returns {{ [key: string]: Array<{ code: string, price: number }> }} - An object mapping prices to arrays of barcode items.
 */
export function groupBarcodesByPrice(barcodeList) {
  const barcodesByPrice = {};

  barcodeList.forEach((item) => {
    const key = item.price.toString();

    if (!barcodesByPrice[key]) {
      barcodesByPrice[key] = [];
    }

    barcodesByPrice[key].push(item);
  });

  return barcodesByPrice;
}
