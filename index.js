const core = require('@actions/core');
const github = require('@actions/github');
const { SpellCheckClient } = require("@azure/cognitiveservices-spellcheck");
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");

// most @actions toolkit packages have async methods
async function run() {
  try {
    const spellcheckKey = core.getInput("spellchecker-key");
    const spellcheckEndpoint = core.getInput("spellchecker-endpoint");
    const spellcheckConfidence = core.getInput("spellchecker-confidence");
    const githubSecret = core.getInput("github-secret");
  
    const octokit = new github.GitHub(githubSecret);
    const comment = github.context.payload.comment;
    const cognitiveServiceCredentials = new CognitiveServicesCredentials(
      spellcheckKey
    );
    const client = new SpellCheckClient(cognitiveServiceCredentials, {
      endpoint: spellcheckEndpoint
    });

    if (comment) {
      const options = {
        mode: "proof",
        pragma: "no-cache"
      };

      if(comment.body.length > 10000) {
        core.setFailed('The length of the text exceeds the max (10,000) amount of allowed characters');
        return;
      }
console.log(comment.body)
      await client
      .spellChecker(comment.body, options)
      .then(result => {
        let correctedComment = comment.body;
        console.log("result.flaggedTokens",result.flaggedTokens);
        result.flaggedTokens.forEach(flaggedToken => {
          if(flaggedToken.suggestions) {
            console.log("flaggedToken.suggestions", flaggedToken.suggestions)
            if(flaggedToken.suggestions[0].score >= spellcheckConfidence ) {
              correctedComment = comment.body.replace(flaggedToken.token, flaggedToken.suggestions[0].suggestion)
            }
          }
        });
        //Update the comment with the corrected spelling
         octokit.issues.updateComment({
          owner: github.context.actor,
          repo: github.context.payload.repository.name,
          comment_id: comment.id,
          body: correctedComment
        });
      })
      .catch(err => {
        console.log("An error occurred:", err);
        core.setFailed(err);
      });


    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
