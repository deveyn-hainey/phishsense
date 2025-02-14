/**
 * Returns the array of cards that should be rendered for the current
 * email thread and uploads the email metadata to BigQuery.
 *
 * @param {Object} e The data provided by the Gmail UI.
 * @return {Card[]}
 */
function buildAddOn(e) {
  try {
    // 1) Grant permission to read the message
    var accessToken = e.messageMetadata.accessToken;
    GmailApp.setCurrentMessageAccessToken(accessToken);

    // 2) Extract metadata
    const messageId = e.messageMetadata.messageId;
    const message = GmailApp.getMessageById(messageId);
    const emailData = {
      messageId: messageId,
      sender: message.getFrom(),
      recipient: message.getTo(),
      subject: message.getSubject(),
      date: message.getDate().toISOString(),
      emailBodyPlain: message.getPlainBody() || "No plain text body available."
    };

    // 3) Build a section to show the email data
    var metadataSection = CardService.newCardSection()
      .setHeader("<b>Email Metadata</b>")
      .addWidget(CardService.newTextParagraph().setText(
        "<b>Sender:</b> " + emailData.sender +
        "\n<b>Recipient:</b> " + emailData.recipient +
        "\n<b>Subject:</b> " + emailData.subject +
        "\n<b>Date:</b> " + emailData.date
      ))
      .addWidget(CardService.newTextParagraph().setText(
        "<b>Content Preview: </b>\n" + emailData.emailBodyPlain.substring(0, 500)
      ));

    // 4) Create a "Scan Email" button that calls scanEmail
    var scanButtonAction = CardService.newAction()
      .setFunctionName("scanEmail")
      // Pass the messageId (or entire data) as parameters
      .setParameters({ messageId: emailData.messageId });
    
    var scanButton = CardService.newTextButton()
      .setText("Scan Email")
      .setOnClickAction(scanButtonAction);

    metadataSection.addWidget(scanButton);

    // 5) Build and return the card with just the metadata & button
    var card = CardService.newCardBuilder()
      .setHeader(
        CardService.newCardHeader()
          .setTitle("PhishSense")
          .setImageUrl("https://drive.google.com/uc?export=view&id=12bNfhfTQ_pNQtVQkPrzSkltX4HGVBFed")
      )
      .addSection(metadataSection)
      .build();

    return [card];

  } catch (error) {
    // Capture both the error message and the full stack trace
    Logger.log("Error in buildAddOn: " + error.message);
    Logger.log("Stack: " + error.stack);
    return showErrorCard(error.message);
  }
}

/**
 * Builds and returns a Card to display the given error message.
 *
 * @param {string} errorMessage - The error message to display.
 * @return {Card}
 */
function showErrorCard(errorMessage) {
  return CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Error"))
    .addSection(
      CardService.newCardSection()
        .addWidget(
          CardService.newTextParagraph()
            .setText("An error occurred: " + errorMessage)
        )
    )
    .build();
}
