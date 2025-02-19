function buildReadEmailCard(e) {
  var header = CardService.newCardHeader()
    .setTitle("PhishSense")
    .setImageUrl("https://drive.google.com/uc?export=view&id=12bNfhfTQ_pNQtVQkPrzSkltX4HGVBFe");

  // Build a top "tab bar"
  var tabSection = buildTabBar("readEmail");

  // We can’t read message ID from e.parameters in the FIRST load
  // so we look at e.messageMetadata, if available.
  var messageId = e && e.messageMetadata 
    ? e.messageMetadata.messageId 
    : null;

  var section = CardService.newCardSection()
    .setHeader("<b>Email Metadata</b>");

  if (!messageId) {
    // If no message ID is available, show a placeholder
    section.addWidget(
      CardService.newTextParagraph()
        .setText("No message selected or no messageId found.")
    );
  } else {
    // Fetch the actual message
    var message = GmailApp.getMessageById(messageId);
    var from = message.getFrom();
    var recipient = message.getTo();
    var subject = message.getSubject();
    var dateStr = message.getDate().toISOString();
    var preview = message.getPlainBody().substring(0, 300);

    // Display metadata
    section.addWidget(
      CardService.newTextParagraph().setText(
        "<b>Sender:</b> " + from +
        "\n<b>Recipient:</b> " + recipient +
        "\n<b>Subject:</b> " + subject +
        "\n<b>Date:</b> " + dateStr
      )
    );
    section.addWidget(
      CardService.newTextParagraph().setText(
        "<b>Content Preview:</b>\n" + preview
      )
    );

    // "Scan Email" button
    var scanButtonAction = CardService.newAction()
      .setFunctionName("scanEmail")
      .setParameters({ messageId: messageId });

    var scanButton = CardService.newTextButton()
      .setText("Scan Email")
      .setOnClickAction(scanButtonAction);

    section.addWidget(scanButton);
  }

  // Build final card
  var card = CardService.newCardBuilder()
    .setHeader(header)
    .addSection(tabSection)
    .addSection(section)
    .build();

  return card;
}