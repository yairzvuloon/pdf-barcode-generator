import { createPDFWithBarcodes } from "../index.js";

import barcodes from "./barcodes_example.json" with { type: "json" };;

createPDFWithBarcodes(barcodes);
