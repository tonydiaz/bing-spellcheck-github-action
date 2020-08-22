# Bing spell check github action

This action uses the Bing spell checker API to correct spelling errors in issue comments. You will need to register for an Microsoft Azure account to get the Bing spell check key and endpoint to use for this action. 

## Inputs

### Required:
  **SPELLCHECKER_KEY** - The Bing spell check API key. Given when registering the service in Azure.
  **SPELLCHECKER_ENDPOINT** - The Bing spell check endpoint. Given when registering the service in Azure.
  **GITHUB_TOKEN** - Auto-created token from github for actions
  Provide a spell check confidence value. How confident should the suggested correction be to update the word? The default is 80%

## Example usage
The key and endpoint should be be added as environment variables
```yaml
uses: tonydiaz/bing-spellcheck-github-action@main
with:
  spellchecker-key: ${{ secrets.SPELLCHECKER_KEY }}
  spellchecker-endpoint: ${{ secrets.SPELLCHECKER_ENDPOINT }}
  spellcheck-confidence: 0.90
  github-secret: ${{ secrets.GITHUB_TOKEN }}
```

## Github Actions hackathon

This was created for the Github actions hackathon. Entry here:
https://dev.to/tonydiaz/azure-spell-checker-github-action-26pc