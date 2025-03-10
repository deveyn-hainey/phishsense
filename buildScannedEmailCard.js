function buildScannedEmailCard(e) {
  var header = CardService.newCardHeader()
    .setTitle("PhishSense")
    .setImageUrl("https://drive.google.com/uc?export=view&id=12bNfhfTQ_pNQtVQkPrzSkltX4HGVBFed");

  var tabSection = buildTabBar({ parameters: { tab: "scan", messageMetadata: e.messageMetadata } });

  var explanation = getAiAnalysisFromCache() || "No explanation available.";

  var explanationSection = CardService.newCardSection()
    .setHeader("AI Explanation Test")
    .addWidget(CardService.newTextParagraph().setText(explanation));

  var card = CardService.newCardBuilder()
    .setHeader(header)
    .addSection(tabSection)
    .addSection(explanationSection)
    .build();

  return card; //test
}


function buildScannedEmailCard(e) {
  const projectId = 'vertical-shore-436520-a4'; // Google Cloud Project ID
  const datasetId = 'email_metadata'; // BigQuery dataset ID
  const tableId = 'user_data'; // BigQuery table ID

  var header = CardService.newCardHeader()
    .setTitle("PhishSense")
    .setImageUrl("https://drive.google.com/uc?export=view&id=12bNfhfTQ_pNQtVQkPrzSkltX4HGVBFed");

  var tabSection = buildTabBar({ parameters: { tab: "scan", messageMetadata: e.messageMetadata } });

  var explanation = getAiAnalysisFromCache() || "No explanation available.";
  
  if (explanation.includes("Safe")) classification = "Safe";
  if (explanation.includes("Phishing")) classification = "Phishing";

  var explanationSection = CardService.newCardSection()
    .setHeader("AI Explanation Test")
    .addWidget(CardService.newTextParagraph().setText(explanation));

  var messageId = getLastScannedMessageId();
  if (messageId) {

    // Prepare the data for BigQuery
    var emailData = [{
      messageId: messageId,
      classification: classification,
      explanation: explanation
    }];

    // Upload classification & explanation to BigQuery
    updateClassificationAndExplanationInBigQuery(
      projectId, datasetId, tableId, messageId, classification, explanation
    );
  }


  var card = CardService.newCardBuilder()
    .setHeader(header)
    .addSection(tabSection)
    .addSection(explanationSection)
    .build();

  return card;
}

