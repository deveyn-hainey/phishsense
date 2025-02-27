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

  return card;
}
