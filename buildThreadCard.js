function buildThreadCard(e) {
  const projectId = 'vertical-shore-436520-a4'; // Your Google Cloud Project ID
  const datasetId = 'email_metadata'; // Your BigQuery dataset ID
  const tableId = 'user_data'; // Your BigQuery table ID

  var header = CardService.newCardHeader()
    .setTitle("PhishSense")
    .setImageUrl("https://drive.google.com/uc?export=view&id=12bNfhfTQ_pNQtVQkPrzSkltX4HGVBFed");

  var tabSection = buildTabBar(e);
  var participantsSection = CardService.newCardSection().setHeader("In this thread");

  if (e && e.messageMetadata && e.messageMetadata.messageId) {
    var messageId = e.messageMetadata.messageId;
    var message = GmailApp.getMessageById(messageId);

    var rawFrom = message.getFrom();
    var parsedFrom = parseNameAndEmail(rawFrom);
    var fromAvatar = "https://drive.google.com/uc?export=view&id=1Jysk5630Cc0E-HFjybBfJGKygxO8zTp2";

    participantsSection.addWidget(
      buildParticipantWidget(parsedFrom.displayName, parsedFrom.email, fromAvatar)
    );

    var rawTo = message.getTo();
    var toAddresses = rawTo.split(",");
    toAddresses.forEach(function(addr) {
      var parsedTo = parseNameAndEmail(addr.trim());
      var toAvatar = "https://drive.google.com/uc?export=view&id=1Jysk5630Cc0E-HFjybBfJGKygxO8zTp2";

      participantsSection.addWidget(
        buildParticipantWidget(parsedTo.displayName, parsedTo.email, toAvatar)
      );
    });
  } else {
    participantsSection.addWidget(
      CardService.newTextParagraph().setText("No message ID found.")
    );
  }

  var metadataSection = CardService.newCardSection().setHeader("Email Metadata");

  if (e && e.messageMetadata && e.messageMetadata.messageId) {
    var messageId = e.messageMetadata.messageId;
    var message = GmailApp.getMessageById(messageId);

    var emailData = [{
      messageId: messageId,
      sender: message.getFrom(),
      recipient: message.getTo(),
      subject: message.getSubject(),
      date: message.getDate().toISOString(),
      emailBodyPlain: message.getPlainBody().substring(0, 300) // Store only a preview
    }];

    Logger.log("🔹 Calling uploadEmailDataToBigQuery with: " + JSON.stringify(emailData));

    // ✅ Call the upload function when the user is in "In This Thread"
    uploadEmailDataToBigQuery(projectId, datasetId, tableId, emailData);

    metadataSection.addWidget(
      CardService.newTextParagraph().setText(
        "<b>Sender:</b> " + emailData[0].sender +
        "\n<b>Recipient:</b> " + emailData[0].recipient +
        "\n<b>Subject:</b> " + emailData[0].subject +
        "\n<b>Date:</b> " + emailData[0].date
      )
    );
    metadataSection.addWidget(
      CardService.newTextParagraph().setText(
        "<b>Content Preview:</b>\n" + emailData[0].emailBodyPlain
      )
    );
  }

  var card = CardService.newCardBuilder()
    .setHeader(header)
    .addSection(tabSection)
    .addSection(participantsSection)
    .addSection(metadataSection)
    .build();

  return card;
}
