# Bing spell check github action

This action uses the Bing spell checker API to correct spelling errors in issue comments. You will need to register for an Azure account to get the key and endpoint to use for this action.

## Inputs
### Required
    The Bing spell check API key. Given when registering the service in Azure.
    The Bing spell check endpoint. Given when registering the service in Azure.
    THe Spell check confidence. How confident should the suggested correction be before update the word. THe default is 80%

## Example usage
The key and endpoint should be be added as envrionment variables
```yaml
uses: actions/bing-spellcheck-github-action@master
with:
  spellchecker-key: ${{ secrets.SPELLCHECKER_KEY }}
  spellchecker-endpoint: ${{ secrets.SPELLCHECKER_ENDPOINT }}
  spellcheck-confidence: 0.90
```

## Package for distribution

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos.  Packaging the action will create a packaged action in the dist folder.

Run prepare

```bash
npm run prepare
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```

## Create a release branch

Users shouldn't consume the action from master since that would be latest code and actions can break compatibility between major versions.

Checkin to the v1 release branch

```bash
git checkout -b v1
git commit -a -m "v1 release"
```

```bash
git push origin v1
```

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Usage

You can now consume the action by referencing the v1 branch

```yaml
uses: actions/javascript-action@v1
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/javascript-action/actions) for runs of this action! :rocket:
