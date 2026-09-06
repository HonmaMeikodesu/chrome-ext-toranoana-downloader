// File APIs reject C0 controls in addition to the visible Windows-reserved characters.
// eslint-disable-next-line no-control-regex
const INVALID_WINDOWS_FILE_NAME_CHARS = /[<>:"/\\|?*\u0000-\u001F\u007F]/g;
const WINDOWS_RESERVED_FILE_NAME = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i;
const MAX_PATH_SEGMENT_LENGTH = 120;

/**
 * Reads a double-quoted JavaScript string constant without executing the
 * surrounding script. The viewer currently emits JSON-compatible string
 * literals, including Unicode escape sequences such as \uXXXX.
 */
export function readJavaScriptStringConstant(source: string, name: string): string {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = source.match(new RegExp(`\\bconst\\s+${escapedName}\\s*=\\s*("(?:\\\\.|[^"\\\\])*")\\s*;`));

    if (!match) return "";

    try {
        return JSON.parse(match[1]);
    } catch (error) {
        console.warn(`[Toranoana Downloader] Could not decode viewer metadata constant ${name}.`, error);
        return match[1]
            .slice(1, -1)
            .replace(/\\u([0-9a-fA-F]{4})/g, (_, codeUnit: string) => String.fromCharCode(Number.parseInt(codeUnit, 16)));
    }
}

/**
 * Produces exactly one portable directory-name segment. Viewer metadata is
 * external input and must never be allowed to turn into an absolute or nested
 * path when passed to chrome.downloads.download().
 */
export function sanitizeDownloadPathSegment(value: string, fallback = "book"): string {
    let result = value
        .normalize("NFC")
        .replace(INVALID_WINDOWS_FILE_NAME_CHARS, "_")
        .trim()
        .replace(/[. ]+$/g, "");

    if (!result || result === "." || result === "..") result = fallback;
    if (WINDOWS_RESERVED_FILE_NAME.test(result)) result = `_${result}`;

    result = Array.from(result).slice(0, MAX_PATH_SEGMENT_LENGTH).join("").replace(/[. ]+$/g, "");

    return result || fallback;
}
