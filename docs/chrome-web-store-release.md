# Chrome Web Store automated releases

The GitHub Actions workflow in `.github/workflows/chrome-web-store.yml` builds every push and pull request targeting `main`. It uploads and submits a package to the Chrome Web Store only when:

- a tag such as `v1.0.1` is pushed; or
- the workflow is started manually with a valid Chrome extension version.

The version from the tag or manual input is injected into `manifest.json` during the build. It must contain one to four dot-separated integers and must be greater than zero.

## One-time Google setup

1. Create or select a Google Cloud project and enable the Chrome Web Store API.
2. Create a Google Cloud service account.
3. Add that service account's email under **Chrome Web Store Developer Dashboard → Account → Service account**.
4. Configure GitHub Actions Workload Identity Federation for this repository and allow it to impersonate that service account.
5. Make sure the existing Chrome Web Store item has its Store listing, Privacy, and Distribution settings completed. The item must have been created in the Developer Dashboard before this workflow can update it.

Google's authentication action documents the Workload Identity Federation setup:
https://github.com/google-github-actions/auth#workload-identity-federation

## GitHub configuration

Create a GitHub environment named `chrome-web-store`. Add these environment variables to it:

| Variable | Value |
| --- | --- |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Full Workload Identity Provider resource name |
| `GCP_SERVICE_ACCOUNT` | Service account email |
| `CHROME_WEB_STORE_PUBLISHER_ID` | Publisher ID from the Chrome Web Store Developer Dashboard |
| `CHROME_WEB_STORE_EXTENSION_ID` | ID of the existing store item |

An optional required-reviewer rule can be added to the environment if publishing should require a final human approval.

## Release

Create and push a version tag greater than the version currently published in the store:

```sh
git tag v1.0.1
git push origin v1.0.1
```

The workflow will build `artifact.zip`, upload it through Chrome Web Store API V2, wait for processing, and submit it for review. With `DEFAULT_PUBLISH`, Google publishes it automatically after approval. Store review itself cannot be bypassed by GitHub Actions.
