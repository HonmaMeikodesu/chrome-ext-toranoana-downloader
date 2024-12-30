#!/usr/bin/env node

const { writeFileSync } = require("fs");
const { resolve } = require("path");

/** @type {chrome.runtime.ManifestV3} */
const mainfestJson = {
    manifest_version: 3,
    name: "Toranoana Downloader",
    description: "downloader for toranoana online hondana",
    version: "1.0",
    action: {
        default_icon: "icons/icon128.png",
        default_popup: "dist/index.html"
    },
    permissions: [
        "downloads"
    ],
    host_permissions: [
        "*://*.toraebook.com/*",
        "https://*.amazonaws.com/viewer.toraebook.com/*"
    ],
    content_scripts:
        [
            {
                matches: [
                    "*://books.toraebook.com/toraebook/*",
                    "http://localhost:8080/*"
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
            matches: ["*://*.toraebook.com/*", "http://localhost:8080/*"]
        }
    ]
}

writeFileSync(resolve(__dirname, "..", "manifest.json"), JSON.stringify(mainfestJson, null, 2));
