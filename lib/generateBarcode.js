import { createCanvas } from "canvas";
import JsBarcode from "jsbarcode";

// Function to generate a high-resolution Code 128 barcode and return it as a buffer
export const generateBarcode = (code, barcodeWidth, barcodeHeight) => {
  // Create a canvas with the desired dimensions
  const canvas = createCanvas(barcodeWidth, barcodeHeight);

  // Generate the Code 128 barcode
  JsBarcode(canvas, code, {
    format: "CODE128",
    width: barcodeWidth / (code.length * 11), // Adjust module width to fit desired barcode width
    height: barcodeHeight,
    displayValue: false,
    margin: 0,
  });

  return canvas.toBuffer("image/png");
};
