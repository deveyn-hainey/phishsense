function buildExplanationsCard(e) {
  var header = CardService.newCardHeader()
    .setTitle("PhishSense")
    .setImageUrl("https://drive.google.com/uc?export=view&id=12bNfhfTQ_pNQtVQkPrzSkltX4HGVBFed");

  // Tab bar
  var tabSection = buildTabBar("explanations");

  // Main content
  var contentSection = CardService.newCardSection()
    .setHeader("Explanations");

  // Suppose we store the AI explanation in user props
  var explanation = getAiAnalysisFromCache();
  if (!explanation) {
    // Show an empty state illustration
    contentSection.addWidget(
      CardService.newImage()
        .setImageUrl("https://drive.google.com/uc?export=view&id=12bNfhfTQ_pNQtVQkPrzSkltX4HGVBFed")  // e.g. big placeholder image
        .setAltText("No explanations yet")
    );
    contentSection.addWidget(
      CardService.newTextParagraph()
        .setText("No explanations yet\nPhishSense creates AI explanations so you never worry phishing")
    );

    // A “Scan to Start” button (if you want scanning from here too)
    // We pass the same messageId if available
    var messageId = (e && e.messageMetadata) ? e.messageMetadata.messageId : "";
    var scanAction = CardService.newAction()
      .setFunctionName("scanEmail")
      .setParameters({ messageId: messageId });

    var scanButton = CardService.newTextButton()
      .setText("Scan to Start")
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor("#4285F4")
      .setOnClickAction(scanAction);

    contentSection.addWidget(scanButton);

  } else {
    // Show the AI explanation
    contentSection.addWidget(
      CardService.newTextParagraph()
        .setText(explanation)
    );
  }

  var card = CardService.newCardBuilder()
    .setHeader(header)
    .addSection(tabSection)
    .addSection(contentSection)
    .build();

  return card;
}

