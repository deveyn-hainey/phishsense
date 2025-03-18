function buildAiExplanationCard() {
  var header = CardService.newCardHeader()
    .setTitle("PhishSense")
    .setImageUrl("https://drive.google.com/uc?export=view&id=12bNfhfTQ_pNQtVQkPrzSkltX4HGVBFed");

  var tabSection = buildTabBar("aiExplanation");

  var explainSection = CardService.newCardSection()
    .setHeader("<b>AI Explanation Test</b>");

  // Retrieve explanation from cache
  var explanation = getAiAnalysisFromCache();
  explanation = explanation.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  explanation = formatExplanationForBullets(explanation);

  // Determine classification
  var classification = "Unknown";
  if (explanation.includes("Safe")) classification = "Safe";
  if (explanation.includes("Phishing")) classification = "Phishing";

  if (!explanation || explanation === "No scan results yet. Please scan an email first.") {
    explainSection.addWidget(
      CardService.newTextParagraph().setText("No scan results yet. Please scan an email first.")
    );
  } else {
    explainSection.addWidget(
      CardService.newTextParagraph().setText(explanation)
    );

    // Retrieve last scanned email message ID
    var messageId = getLastScannedMessageId();
    if (messageId) {
      Logger.log("🔹 Storing AI Classification & Explanation in BigQuery for Email ID: " + messageId);

      // Update classification & explanation in BigQuery
      updateClassificationAndExplanationInBigQuery(
        "vertical-shore-436520-a4",
        "email_metadata",
        "user_data_temp",
        messageId,
        classification,
        explanation
      );
    }
  }

  return CardService.newCardBuilder()
    .setHeader(header)
    .addSection(tabSection)
    .addSection(explainSection)
    .build();
}