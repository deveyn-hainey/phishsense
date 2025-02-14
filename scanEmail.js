function scanEmail(e) {
  try {
    // 1) Re-grant access to the current message
    var accessToken = e.messageMetadata.accessToken; 
    GmailApp.setCurrentMessageAccessToken(accessToken);

    // 2) Grab the messageId passed by buildAddOn
    var messageId = e.commonEventObject.parameters.messageId;
    var message = GmailApp.getMessageById(messageId);

    // 3) Prepare the data for BigQuery/AI
    var emailBodyPlain = message.getPlainBody() || "No plain text body available.";
    var emailData = [{
      messageId: messageId,
      sender: message.getFrom(),
      recipient: message.getTo(),
      subject: message.getSubject(),
      date: message.getDate().toISOString(),
      emailBodyPlain: emailBodyPlain
    }];

    // (Optional) Upload to BigQuery
    uploadEmailDataToBigQuery(
      "vertical-shore-436520-a4", // projectId
      "email_metadata",          // datasetId
      "user_data",               // tableId
      emailData
    );

    // 4) Call Vertex AI and parse the result
    var rawAIResponse = analyzeEmailWithVertexAI(emailBodyPlain);
    var analysisRaw = parseVertexAI(rawAIResponse); 
    var analysisResult = String(analysisRaw); // <--- ensure it’s a string

    // 6) Build a new section with the AI outcome
    var analysisSection = CardService.newCardSection()
      .setHeader("<b>AI Phishing Analysis</b>")
      .addWidget(CardService.newTextParagraph().setText("<b>Explanation: </b>" + analysisResult));

    // 7) Build a new card that replaces the old one
    var card = CardService.newCardBuilder()
      .setHeader(
        CardService.newCardHeader()
          .setTitle("PhishSense Scan Results")
          .setImageUrl("https://drive.google.com/uc?export=view&id=12bNfhfTQ_pNQtVQkPrzSkltX4HGVBFed")
      )
      .addSection(analysisSection)
      .build();

    // 8) Return an ActionResponse that pushes the new card
    return CardService.newActionResponseBuilder()
      .setNavigation(
        CardService.newNavigation().pushCard(card)
      )
      .build();

  } catch (error) {
    Logger.log("Error in scanEmail: " + error.message);
    return CardService.newActionResponseBuilder()
      .setNavigation(
        CardService.newNavigation().pushCard(showErrorCard(error.message))
      )
      .build();
  }
}
