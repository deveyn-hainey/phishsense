function buildThreadCard() {
  // A simple header with no “open in new tab” link
  var header = CardService.newCardHeader()
    .setTitle("PhishSense")
    .setImageUrl("https://drive.google.com/uc?export=view&id=12bNfhfTQ_pNQtVQkPrzSkltX4HGVBFed"); // e.g. a public Drive link

  // Tab bar (simulated) at the top
  var tabSection = buildTabBar("thread"); // highlight “In this thread” tab

  // A section showing the user a "Scan Email" button
  var scanSection = CardService.newCardSection()
    .setHeader("<b>Scan Email</b>")
    .addWidget(
      CardService.newTextParagraph()
        .setText("Click 'Scan Email' to analyze this message. Results will show on the 'AI Output' tab.")
    );

  // Button that triggers the actual scanning
  var scanButtonAction = CardService.newAction()
    .setFunctionName("scanEmail");
    // We’ll parse e.parameters in scanEmail to get messageId

  var scanButton = CardService.newTextButton()
    .setText("Scan Email")
    .setOnClickAction(scanButtonAction);

  scanSection.addWidget(scanButton);

  // Build and return the card
  var card = CardService.newCardBuilder()
    .setHeader(header)
    .addSection(tabSection)
    .addSection(scanSection)
    .build();
  return card;
}
