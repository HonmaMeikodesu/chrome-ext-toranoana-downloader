import assert from "node:assert/strict";
import { readJavaScriptStringConstant, sanitizeDownloadPathSegment } from "../src/utils/text.ts";

const viewerScript = String.raw`
    const p7 = "\u4f60\u597d";
    const p8 = "name";
`;

assert.equal(readJavaScriptStringConstant(viewerScript, "p7"), "你好");
assert.equal(readJavaScriptStringConstant(viewerScript, "p8"), "name");
assert.equal(readJavaScriptStringConstant(viewerScript, "missing"), "");

const safeSegment = sanitizeDownloadPathSegment(String.raw`\u4f60\nested/name:*?`);
assert.doesNotMatch(safeSegment, /[\\/]/);
assert.ok(safeSegment.length <= 120);
assert.equal(sanitizeDownloadPathSegment("CON"), "_CON");
assert.equal(sanitizeDownloadPathSegment("..."), "book");

console.log("text utility tests passed");
