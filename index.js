const core = require('@actions/core');
const github = require('@actions/github');
// const http = require('@actions/http-client');
const { SpellCheckClient } = require("@azure/cognitiveservices-spellcheck");
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");

// most @actions toolkit packages have async methods
async function run() {
  try {
    console.log("Started the index")
    const spellcheckKey = core.getInput("spellchecker-key");
    const spellcheckEndpoint = core.getInput("spellchecker-endpoint");
    const githubSecret = core.getInput("github-secret");
  
    const octokit = new github.GitHub(githubSecret);
    const comment = {
      body:"Hello worlld"
    };//github.context.payload.comment;
    console.log("endpoint", spellcheckEndpoint);

    const cognitiveServiceCredentials = new CognitiveServicesCredentials(
      spellcheckKey
    );
    const client = new SpellCheckClient(cognitiveServiceCredentials, {
      endpoint: spellcheckEndpoint
    });

    if (comment) {
      const text = comment.body;
      console.log('text', text);
      let newCommentBody;
      
      const options = {
        mode: "proof",
        pragma: "no-cache"
      };

      client
      .spellChecker("Bill Gatos", options)
      .then(result => {
        console.log("The result is: ", result);
        result.flaggedTokens.forEach(flaggedToken => {
          flaggedToken.suggestions.forEach(suggestion => {
            console.log(suggestion);
          });
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

      //Call Bing API with Text
      // const _http = new http.HttpClient();
      // _http.requestOptions = {
      //   headers: {
      //     'Ocp-Apim-Subscription-Key': spellcheckKey
      //   }
      // }
      // console.log('_http.requestOptions', _http.requestOptions);
      // let response = await _http.postJson(spellcheckEndpoint, JSON.stringify({text: text}));
      // console.log('response', response);
      
      //Update the comment with the corrected spelling
      // await octokit.issues.updateComment({
      //   owner: github.context.actor,
      //   repo: github.context.payload.repository.name,
      //   comment_id: comment.id,
      //   body: newCommentBody
      // });
    }

    // const ms = core.getInput('milliseconds');
    // core.info(`Waiting ${ms} milliseconds ...`);

    // core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    // await wait(parseInt(ms));
    // core.info((new Date()).toTimeString());

    // core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
