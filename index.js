const core = require('@actions/core');
const github = require('@actions/github');
const { SpellCheckClient } = require("@azure/cognitiveservices-spellcheck");
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");

// most @actions toolkit packages have async methods
async function run() {
  try {
    console.log("Started the index")
    const spellcheckKey = core.getInput("spellchecker-key");
    const spellcheckEndpoint = core.getInput("spellchecker-endpoint");
    const spellcheckConfidence = core.getInput("spellchecker-confidence");
    const githubSecret = core.getInput("github-secret");
  
    const octokit = new github.GitHub(githubSecret);
    const comment = github.context.payload.comment;
  
    console.log("comment", comment);

    const cognitiveServiceCredentials = new CognitiveServicesCredentials(
      spellcheckKey
    );
    const client = new SpellCheckClient(cognitiveServiceCredentials, {
      endpoint: spellcheckEndpoint
    });

    if (comment) {
      let newCommentBody;
      
      const options = {
        mode: "proof",
        pragma: "no-cache"
      };

      client
      .spellChecker(comment.body, options)
      .then(result => {
        console.log("result", result);
        result.flaggedTokens.forEach(flaggedToken => {
          if(flaggedToken.suggestions) {
            if(flaggedToken.suggestions[0].score >= spellcheckConfidence ) {
              comment.body.replace(flaggedToken.token, flaggedToken.suggestions[0].suggestion)
            }
          }
        });
        //Take results and update string
        //For each update check if the suggestions is greater than 75%
        //updated the words in the text
        newCommentBody = "Hello world";
      })
      .catch(err => {
        console.log("An error occurred:");
        console.error(err);
      });

      //Update the comment with the corrected spelling
      await octokit.issues.updateComment({
        owner: github.context.actor,
        repo: github.context.payload.repository.name,
        comment_id: comment.id,
        body: comment.body
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
