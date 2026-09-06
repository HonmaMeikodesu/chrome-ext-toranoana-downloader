#!/usr/bin/env node

const { writeFileSync } = require("fs");
const { resolve } = require("path");
const { version: packageVersion } = require("../package.json");

const extensionVersion = process.env.EXTENSION_VERSION || packageVersion;
const versionParts = extensionVersion.split(".");
const isValidVersion = versionParts.length >= 1
    && versionParts.length <= 4
    && versionParts.some(part => Number(part) > 0)
    && versionParts.every(part => /^(0|[1-9]\d*)$/.test(part) && Number(part) <= 65535);

if (!isValidVersion) {
    throw new Error(`Invalid Chrome extension version: ${extensionVersion}`);
}

/** @type {chrome.runtime.ManifestV3} */
const mainfestJson = {
    manifest_version: 3,
    name: "Toranoana Downloader",
    description: "downloader for toranoana online hondana",
    version: extensionVersion,
    action: {
        default_icon: "icons/icon128.png",
        default_popup: "dist/index.html"
    },
    permissions: [
        "downloads", "storage", "tabs"
    ],
    host_permissions: [
        "*://*.toraebook.com/*",
        "https://*.amazonaws.com/viewer.toraebook.com/*"
    ],
    content_scripts:
        [
            {
                matches: [
                    "*://books.toraebook.com/toraebook/*"
                    // "http://localhost:8080/*"
                ],
                js: [
                    "dist/content.js"
                ]
            }
        ],
    icons: {
        "16": "icons/icon16.png",
        "32": "icons/icon32.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
    },
    background: {
        "service_worker": "dist/background.js"
    },
    web_accessible_resources: [
        {
            resources: [
                "dist/popup.js"
            ],
            matches: [
                "*://*.toraebook.com/*"
                // "http://localhost:8080/*"
            ]
        }
    ]
}

writeFileSync(resolve(__dirname, "..", "manifest.json"), JSON.stringify(mainfestJson, null, 2));
