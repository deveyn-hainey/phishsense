function analyzeEmailWithVertexAI(emailContent) {
  var projectId = "vertical-shore-436520-a4";  // Your GCP Project ID
  var locationId = "us-central1";
  var modelId = "gemini-1.0-pro-002";

  var apiEndpoint = "https://us-central1-aiplatform.googleapis.com/v1/projects/" + projectId +
                      "/locations/" + locationId + 
                      "/publishers/google/models/" + modelId + 
                      ":streamGenerateContent";

  //Logger.log("API Endpoint: " + apiEndpoint);

  var requestBody = {
    contents: [
      { role: "user", parts: [{ text: "Analyze the following email message and classify it as either 'Phishing' or 'Safe'. Then give a valid reasoning sentence justifying your classification. Make sure reponses are under 6500 characters and are complete sentences. Respond in this format: Say if it's [Phishing or Safe] then explain: [Detailed reason]\n\nHere is the email content:\n" + emailContent }] }
    ],
    generationConfig: { temperature: 0.2, maxOutputTokens: 512, topP: 1, seed: 0 }
  };

  var options = {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
    payload: JSON.stringify(requestBody),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(apiEndpoint, options);
    var responseText = response.getContentText();
    Logger.log("Full Response: " + responseText);

    var jsonResponse = JSON.parse(responseText);

    return jsonResponse; // ✅ Return full JSON response for further processing

  } catch (error) {
    Logger.log("Error calling Vertex AI: " + error.message);
    return { error: "Error analyzing email: " + error.message };
  }
}
