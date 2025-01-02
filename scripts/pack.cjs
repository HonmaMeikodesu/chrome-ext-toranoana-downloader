#!/usr/bin/env node
const { mkdir, readFile, rm, cp } = require("fs/promises");
const { values } = require("lodash");
const { resolve } = require("path");
const bz = require("bestzip");

const outputDirName = resolve(__dirname, "../output");
const artifactName = resolve(__dirname, "../artifact.zip");

const clean = async () => {
    await rm(outputDirName, { recursive: true, force: true });
    await rm(artifactName, { force: true });
}

const pack = async () => {
    await mkdir(outputDirName);
    const rootDir = resolve(__dirname, "../");
    const manifestPath = "manifest.json";
    /** @type {string[]} */
    const targets = [manifestPath];
    /** @type {chrome.runtime.ManifestV3} */
    const manifestJson = JSON.parse((await readFile(resolve(rootDir, manifestPath))).toString());

    const { action, content_scripts, background, web_accessible_resources } = manifestJson;

    const { default_popup } = action || {};

    targets.push(default_popup);

    content_scripts?.forEach(script => {
        script?.js?.forEach(js => {
            targets.push(js);
        })
    });

    web_accessible_resources?.forEach(resource => {
        resource?.resources?.forEach(res => {
            targets.push(res);
        })
    });

    const backgroundScripts = values(background);

    backgroundScripts?.forEach(script => {
        targets.push(script);
    })

    targets.push("icons");

    await Promise.all(targets.map(async item => {
        return await cp(resolve(rootDir, item), resolve(outputDirName, item), { recursive: true });
    }));
    
    await bz({
        source: "*",
        destination: artifactName,
        cwd: outputDirName
    });
}

clean().then(() => {
    return pack();
});

