function buildAnalysisCard() {
  // This header has the “open in new tab” link
  var header = CardService.newCardHeader()
    .setTitle("PhishSense")
    .setImageUrl("https://drive.google.com/uc?export=view&id=12bNfhfTQ_pNQtVQkPrzSkltX4HGVBFed")
    .setOpenLink(
      // Clicking the icon opens a phishing info page
      CardService.newOpenLink()
        .setUrl("https://your-phishing-info-page.com")
        .setOpenAs(CardService.OpenAs.FULL_SIZE)
    );

  // Tab bar
  var tabSection = buildTabBar("analysis"); // highlight “AI Output” tab

  // Main section for showing AI analysis
  var analysisSection = CardService.newCardSection()
    .setHeader("<b>Email Analysis</b>");

  // Retrieve previously stored AI explanation from user properties
  var explanation = getAiAnalysisFromCache();
  if (!explanation) {
    // If no explanation stored yet, show an empty-state illustration
    analysisSection.addWidget(
      CardService.newImage().setImageUrl("https://drive.google.com/uc?export=view&id=12bNfhfTQ_pNQtVQkPrzSkltX4HGVBFed")
    );
    analysisSection.addWidget(
      CardService.newTextParagraph()
        .setText("No analysis yet. Please scan an email first.")
    );
  } else {
    // If we have an explanation, show it
    analysisSection.addWidget(
      CardService.newTextParagraph()
        .setText(explanation)
    );
  }

  // Build final card
  var card = CardService.newCardBuilder()
    .setHeader(header)
    .addSection(tabSection)
    .addSection(analysisSection)
    .build();
  return card;
}
