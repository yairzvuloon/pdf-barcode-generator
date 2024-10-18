import fs from "node:fs";
import PDFDocument from "pdfkit";

import { config } from "./config.js";
import { createPageObjects } from "./createPageObjects.js";
import { createDocPage } from "./createDocPage.js";

/**
 * Creates a PDF document with barcodes arranged by price groups.
 * @param {Array<{ code: string, price: number }>} barcodeList - The list of barcodes with their associated prices.
 */
export const createPDFWithBarcodes = (barcodeList) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  const writeStream = fs.createWriteStream(
    `${config.pdfFilePrefix}-${new Date().toISOString()}.pdf`
  );

  doc.pipe(writeStream);

  registerFonts(doc, config.fonsts);

  const pages = createPageObjects(doc, barcodeList);

  generatePDF(doc, pages);

  doc.end();

  // Handle stream events
  writeStream.on("finish", () => {
    console.log("PDF file created successfully.");
  });

  writeStream.on("error", (err) => {
    console.error("Error writing PDF file:", err);
  });
};

/**
 * Registers fonts with the PDF document.
 * @param {PDFKit.PDFDocument} doc - The PDF document instance.
 * @param {Array<{ name: string, path: string }>} fonts - An array of font definitions.
 */
function registerFonts(doc, fonts) {
  fonts.forEach(({ name, path }) => {
    doc.registerFont(name, path);
  });
}

/**
 * Generates the PDF document using the pages array.
 * @param {PDFKit.PDFDocument} doc - The PDF document instance.
 * @param {Array<{ title: string, date: string, items: Array<{ code: string, price: number }> }>} pages - The array of page objects containing page data.
 */
function generatePDF(doc, pages) {
  for (const [pageIndex, page] of pages.entries()) {
    createDocPage(doc, pageIndex, page);
  }
}
