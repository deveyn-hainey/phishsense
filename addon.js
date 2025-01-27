/**
 * Returns the array of cards that should be rendered for the current
 * e-mail thread and uploads the email metadata to BigQuery.
 *
 * @param {Object} e The data provided by the Gmail UI.
 * @return {Card[]}
 */
function buildAddOn(e) {
  var projectId = 'vertical-shore-436520-a4'; // Your Google Cloud Project ID
  var datasetId = 'email_metadata'; // Your BigQuery dataset ID
  var tableId = 'user_data'; // Your BigQuery table ID

  try {
    // Activate temporary Gmail add-on scopes
    var accessToken = e.messageMetadata.accessToken;
    GmailApp.setCurrentMessageAccessToken(accessToken);

    // Extract email metadata
    const messageId = e.messageMetadata.messageId;
    const message = GmailApp.getMessageById(messageId);

    const emailData = [
      {
        messageId: messageId,
        sender: message.getFrom(),
        recipient: message.getTo(),
        subject: message.getSubject(),
        date: message.getDate().toISOString(), // Convert to TIMESTAMP format
        emailBodyPlain: message.getPlainBody() || 'No plain text body available.', // Fallback value
      },
    ];

    // Upload email metadata and content to BigQuery
    uploadEmailDataToBigQuery(projectId, datasetId, tableId, emailData);

    // Build the Gmail Add-on card
    const metadataSection = CardService.newCardSection()
      .setHeader('<b>Email Metadata</b>')
      .addWidget(CardService.newTextParagraph().setText(
        '<b>Sender: </b>' + emailData[0].sender +
        '\n<b>Recipient: </b>' + emailData[0].recipient +
        '\n<b>Subject: </b>' + emailData[0].subject +
        '\n<b>Date: </b>' + emailData[0].date
      ))
      .addWidget(CardService.newTextParagraph().setText('<b>Content Preview: </b>\n' + emailData[0].emailBodyPlain.substring(0, 500)));

    var card = CardService.newCardBuilder()
      .setHeader(CardService.newCardHeader()
        .setTitle('PhishSense')
        .setImageUrl('https://drive.google.com/uc?export=view&id=12bNfhfTQ_pNQtVQkPrzSkltX4HGVBFed'))
      .addSection(metadataSection)
      .build();

    return [card];

  } catch (error) {
    Logger.log('Error in buildAddOn: ' + error.message);
    return [CardService.newCardBuilder()
      .setHeader(CardService.newCardHeader().setTitle('Error'))
      .addSection(CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText('An error occurred: ' + error.message)))
      .build()];
  }
}
