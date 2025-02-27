function scanEmail(e) {
  try {
    var messageId = e.parameters.messageId || getLastScannedMessageId(); // Use cached ID if missing

    if (!messageId) {
      throw new Error("No messageId provided and no previous scan found.");
    }

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

    // Run AI analysis to get a fresh response for this email
    var aiResponse = analyzeEmailWithVertexAI(emailData.emailBodyPlain);
    var explanation = parseVertexAI(aiResponse);

    // Store the new AI explanation & message ID in cache
    storeAiAnalysisToCache(explanation, messageId);

    // Update the UI to show the new explanation
    var nav = CardService.newNavigation().updateCard(buildScannedEmailCard(e));

    return CardService.newActionResponseBuilder()
      .setNavigation(nav)
      .build();

  } catch (error) {
    Logger.log("Error in scanEmail: " + error.message);

    // If an error occurs, continue showing the last successful scan result
    var nav = CardService.newNavigation().updateCard(buildScannedEmailCard(e));
    return CardService.newActionResponseBuilder()
      .setNavigation(nav)
      .build();
  }
}
