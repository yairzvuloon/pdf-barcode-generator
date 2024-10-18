import { createCanvas } from "canvas";
import JsBarcode from "jsbarcode";

// Function to generate a high-resolution Code 128 barcode and return it as a buffer
export const generateBarcode = (code, barcodeWidth, barcodeHeight) => {
  // Create a higher-resolution canvas
  const scaleFactor = 3; // Adjust the scale factor as needed
  const canvas = createCanvas(
    barcodeWidth * scaleFactor,
    barcodeHeight * scaleFactor
  );
  const ctx = canvas.getContext("2d");

  // Disable image smoothing for sharp edges
  ctx.imageSmoothingEnabled = false;

  // Generate the barcode
  JsBarcode(canvas, code, {
    format: "CODE128",
    width: scaleFactor * (barcodeWidth / (code.length * 11)), // Adjust module width
    height: barcodeHeight * scaleFactor,
    displayValue: false,
    margin: 0,
  });

  // Downscale the image to the desired size
  const finalCanvas = createCanvas(barcodeWidth, barcodeHeight);
  const finalCtx = finalCanvas.getContext("2d");
  finalCtx.imageSmoothingEnabled = false; // Disable smoothing to keep edges sharp
  finalCtx.drawImage(canvas, 0, 0, barcodeWidth, barcodeHeight);

  return finalCanvas.toBuffer("image/png");
};
