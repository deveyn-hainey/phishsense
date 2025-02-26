function buildAiExplanationCard() {
  var header = CardService.newCardHeader()
    .setTitle("PhishSense")
    .setImageUrl("https://drive.google.com/uc?export=view&id=12bNfhfTQ_pNQtVQkPrzSkltX4HGVBFed");

  // Another tab bar
  var tabSection = buildTabBar("aiExplanation");

  // Main section: show the explanation
  var explainSection = CardService.newCardSection()
    .setHeader("<b>AI Explanation Test</b>");

  var explanation = getAiAnalysisFromCache();
  explanation = explanation.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

  explanation = formatExplanationForBullets(explanation);
  //explanation = fixExplanationFormat(explanation);

  // Convert newlines (\n) to <br> so they appear as line breaks
  //explanation = explanation.replace(/\n/g, "<br>");

  if (!explanation) {
    explainSection.addWidget(
      CardService.newTextParagraph()
        .setText("No scan results yet. Please scan an email first.")
    );
  } else {
    // Show the AI text
    explainSection.addWidget(
      CardService.newTextParagraph()
        .setText(explanation)
    );
  }

  var card = CardService.newCardBuilder()
    .setHeader(header)
    .addSection(tabSection)
    .addSection(explainSection)
    .build();

  return card;
}