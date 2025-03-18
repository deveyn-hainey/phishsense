function buildScannedEmailCard(e) {

  const projectId = 'vertical-shore-436520-a4'; // Your Google Cloud Project ID
  const datasetId = 'email_metadata'; // Your BigQuery dataset ID
  const tableId = 'user_data_temp'; // Your BigQuery table ID

  var header = CardService.newCardHeader()
    .setTitle("PhishSense")
    .setImageUrl("https://drive.google.com/uc?export=view&id=12bNfhfTQ_pNQtVQkPrzSkltX4HGVBFed");

  var tabSection = buildTabBar({ parameters: { tab: "scan", messageMetadata: e.messageMetadata } });
  var messageId = e.messageMetadata.messageId;
  var explanation = getAiAnalysisFromCache() || "No explanation available.";
  var classification = extractClassificationFromExplanation(explanation);

  //updateClassificationAndExplanationInBigQuery(projectId, datasetId, tableId, messageId, classification, explanation)



  var explanationSection = CardService.newCardSection()
    .setHeader("AI Explanation Test")
    .addWidget(CardService.newTextParagraph().setText(explanation));

  var card = CardService.newCardBuilder()
    .setHeader(header)
    .addSection(tabSection)
    .addSection(explanationSection)
    .build();

  return card;
}

function extractClassificationFromExplanation(explanation) {
  if (!explanation || typeof explanation !== "string") {
    return "Unknown"; // Default classification
  }

  // Regular expression to find classification in the "Summary" section
  var match = explanation.match(/Summary:\s*(Safe|Phishing)/i);
  
  if (match) {
    return match[1]; // Returns "Safe" or "Phishing"
  }

  return "Unknown"; // Default classification if not found
}