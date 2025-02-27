function buildThreadCard(e) {
  var header = CardService.newCardHeader()
    .setTitle("PhishSense")
    .setImageUrl("https://drive.google.com/uc?export=view&id=12bNfhfTQ_pNQtVQkPrzSkltX4HGVBFed");

  var tabSection = buildTabBar(e);

  var participantsSection = CardService.newCardSection()
    .setHeader("In this thread");

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

  var metadataSection = CardService.newCardSection()
    .setHeader("Email Metadata");

  if (e && e.messageMetadata && e.messageMetadata.messageId) {
    var messageId = e.messageMetadata.messageId;
    var message = GmailApp.getMessageById(messageId);

    var sender = message.getFrom();
    var recipient = message.getTo();
    var subject = message.getSubject();
    var dateStr = message.getDate().toISOString();
    var preview = message.getPlainBody().substring(0, 300);

    metadataSection.addWidget(
      CardService.newTextParagraph().setText(
        "<b>Sender:</b> " + sender +
        "\n<b>Recipient:</b> " + recipient +
        "\n<b>Subject:</b> " + subject +
        "\n<b>Date:</b> " + dateStr
      )
    );
    metadataSection.addWidget(
      CardService.newTextParagraph().setText(
        "<b>Content Preview:</b>\n" + preview
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
