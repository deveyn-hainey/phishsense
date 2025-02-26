function analyzeEmailWithVertexAI(emailContent) {
  var projectId = "vertical-shore-436520-a4"; // e.g. "vertical-shore-436520-a4"
  var locationId = "us-central1";
  var modelId = "gemini-1.0-pro-002";

  var apiEndpoint =
    "https://us-central1-aiplatform.googleapis.com/v1/projects/" +
    projectId + "/locations/" + locationId +
    "/publishers/google/models/" + modelId + ":streamGenerateContent";

  var requestBody = {
    contents: [
      {
        role: "user",
        parts: [{
          text: (
            "Analyze the following email message. First you must classify it as 'Phishing' or 'Safe', " +
            "and give a brief reasoning. The reasoning should be formatted as follows: Summary: Which gives a concise answer"+
            " if the email was phishing or safe. Learning Section: Which tell the user how the email is idenitfied as" +
            " Safe or Phishing. " +
            "bold the labels Summary: and Learning Section. Also bold any bullet point topics that are given in the sections "+
            "EMAIL:\n" + emailContent
          )
        }]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 512,
      topP: 1
    }
  };

  var options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + ScriptApp.getOAuthToken()
    },
    payload: JSON.stringify(requestBody),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(apiEndpoint, options);
    var json = JSON.parse(response.getContentText());
    Logger.log("Vertex AI Response: " + response.getContentText());
    return json;
  } catch (error) {
    return { error: "Error analyzing email: " + error.message };
  }
}