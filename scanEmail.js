function scanEmail(e) {
  try {
    var messageId = e.parameters && e.parameters.messageId;
    if (!messageId) {
      throw new Error("No messageId passed to scanEmail.");
    }

    // Grant access again for safety
    GmailApp.setCurrentMessageAccessToken(e.messageMetadata.accessToken);

    // Get the message
    var message = GmailApp.getMessageById(messageId);
    var emailData = {
      messageId: messageId,
      sender: message.getFrom(),
      recipient: message.getTo(),
      subject: message.getSubject(),
      date: message.getDate().toISOString(),
      emailBodyPlain: message.getPlainBody() || "No plain text."
    };

    // 1) Analyze with Vertex AI
    var aiResponse = analyzeEmailWithVertexAI(emailData.emailBodyPlain);
    var explanation = parseVertexAI(aiResponse);

    // 2) Store the explanation in user properties
    storeAiAnalysisToCache(explanation);

    // 3) (optional) Upload to BigQuery
    uploadEmailDataToBigQuery(
      "vertical-shore-436520-a4",    // e.g. "vertical-shore-436520-a4"
      "email_metadata",    // e.g. "email_metadata"
      "user_data",      // e.g. "user_data"
      [ emailData ]
    );

    // 4) Navigate to the AI Explanation tab
    var nav = CardService.newNavigation()
      .updateCard(buildAiExplanationCard());

    return CardService.newActionResponseBuilder()
      .setNavigation(nav)
      .build();

  } catch (error) {
    Logger.log("Error in scanEmail: " + error.message);
    Logger.log("Stack: " + error.stack);
    return showErrorCard(error.message);
  }
}