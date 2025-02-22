function buildThreadCard(e) {
  // Top card header: small icon + "PhishSense"
  var header = CardService.newCardHeader()
    .setTitle("PhishSense")
    .setImageUrl("https://drive.google.com/uc?export=view&id=12bNfhfTQ_pNQtVQkPrzSkltX4HGVBFed"); // Your small circle icon

  // The tab bar at the top
  var tabSection = buildTabBar("thread");

  // Section #1: "In this thread" (participants)
  var participantsSection = CardService.newCardSection()
    .setHeader("In this thread");

if (e && e.messageMetadata && e.messageMetadata.messageId) {
    var messageId = e.messageMetadata.messageId;
    var message = GmailApp.getMessageById(messageId);

    // 1) "From"
    var rawFrom = message.getFrom(); // e.g. "Deveyn Hainey <devynnhainey@gmail.com>"
    var parsedFrom = parseNameAndEmail(rawFrom);
    // Use an avatar or placeholder image
    var fromAvatar = "https://drive.google.com/uc?export=view&id=1Jysk5630Cc0E-HFjybBfJGKygxO8zTp2";

    participantsSection.addWidget(
      buildParticipantWidget(parsedFrom.displayName, parsedFrom.email, fromAvatar)
    );

    // 2) "To" - might contain multiple addresses
    var rawTo = message.getTo(); // e.g. "GitHub <noreply@github.com>"
    // If multiple addresses, split them. Otherwise just parse one.
    var toAddresses = rawTo.split(",");
    toAddresses.forEach(function(addr) {
      var trimmed = addr.trim();
      var parsedTo = parseNameAndEmail(trimmed);
      // Use an avatar or placeholder
      var toAvatar = "https://drive.google.com/uc?export=view&id=1Jysk5630Cc0E-HFjybBfJGKygxO8zTp2";

      participantsSection.addWidget(
        buildParticipantWidget(parsedTo.displayName, parsedTo.email, toAvatar)
      );
    });

  } else {
    // Fallback if no message
    participantsSection.addWidget(
      CardService.newTextParagraph().setText("No message ID found.")
    );
  }

  // Section #2: "Email Metadata"
  var metadataSection = CardService.newCardSection()
    .setHeader("Email Metadata");

  if (e && e.messageMetadata && e.messageMetadata.messageId) {
    var messageId = e.messageMetadata.messageId;
    var message = GmailApp.getMessageById(messageId);

    // Grab metadata
    var sender = message.getFrom();
    var recipient = message.getTo();
    var subject = message.getSubject();
    var dateStr = message.getDate().toISOString();
    var preview = message.getPlainBody().substring(0, 300);

    // Show metadata
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

    // "Scan Email" button in pink
    var scanAction = CardService.newAction()
      .setFunctionName("scanEmail")
      .setParameters({ messageId: messageId });

    var scanButton = CardService.newTextButton()
      .setText("Scan Email")
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor("#b51887") // pink
      .setOnClickAction(scanAction);

    metadataSection.addWidget(scanButton);
  }

  // Build the final card
  var card = CardService.newCardBuilder()
    .setHeader(header)
    .addSection(tabSection)
    .addSection(participantsSection)
    .addSection(metadataSection)
    .build();

  return card;
}
