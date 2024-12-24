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
        default_icon: "hello_extensions.png",
        default_popup: "dist/index.html"
    },
    permissions: [
        "downloads"
    ],
    host_permissions: [
        "*://*.toraebook.com/*",
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
