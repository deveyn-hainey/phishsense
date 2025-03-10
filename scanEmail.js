function scanEmail(e) {
  try {
    var messageId = e.parameters.messageId || getLastScannedMessageId();
    if (!messageId) throw new Error("No messageId provided and no previous scan found.");

    GmailApp.setCurrentMessageAccessToken(e.messageMetadata.accessToken);
    var message = GmailApp.getMessageById(messageId);

    var emailData = {
      messageId: messageId,
      sender: message.getFrom(),
      recipient: message.getTo(),
      subject: message.getSubject(),
      date: message.getDate().toISOString(),
      emailBodyPlain: message.getPlainBody() || "No plain text."
    };

    // Run AI analysis to classify email
    var aiResponse = analyzeEmailWithVertexAI(emailData.emailBodyPlain);
    var explanation = parseVertexAI(aiResponse);

    Logger.log("🔹 AI Explanation: " + explanation);

    // Extract classification based on keywords in explanation
    var classification = "Unknown";
    if (explanation.includes("Safe")) classification = "Safe";
    if (explanation.includes("Phishing")) classification = "Phishing";

    Logger.log(" Final Classification: " + classification);

    //  Add classification & explanation to email data
    emailData.classification = classification;
    emailData.explanation = explanation;

    //  Upload full email data to BigQuery
    uploadEmailDataToBigQuery("vertical-shore-436520-a4", "email_metadata", "user_data", [emailData]);

    storeAiAnalysisToCache(explanation, messageId);

    var nav = CardService.newNavigation().updateCard(buildScannedEmailCard(e));

    return CardService.newActionResponseBuilder()
      .setNavigation(nav)
      .build();

  } catch (error) {
    Logger.log("❌ Error in scanEmail: " + error.message);

    var nav = CardService.newNavigation().updateCard(buildScannedEmailCard(e));
    return CardService.newActionResponseBuilder()
      .setNavigation(nav)
      .build();
  }
}
