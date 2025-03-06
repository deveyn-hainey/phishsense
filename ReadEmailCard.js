function buildReadEmailSection(e) {
  var section = CardService.newCardSection()
    .setHeader("Email Metadata");

  if (!e || !e.messageMetadata || !e.messageMetadata.messageId) {
    section.addWidget(
      CardService.newTextParagraph()
        .setText("No message selected or no messageId found.")
    );
    return section;
  }

  var messageId = e.messageMetadata.messageId;
  var message = GmailApp.getMessageById(messageId);

  // Basic metadata
  var sender = message.getFrom();
  var recipient = message.getTo();
  var subject = message.getSubject();
  var dateStr = message.getDate().toISOString();
  var preview = message.getPlainBody().substring(0, 300);

  uploadEmailDataToBigQuery(emailData);
  
  section.addWidget(
    CardService.newTextParagraph().setText(
      "<b>Sender:</b> " + sender +
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

   // upload to bigquery
  uploadEmailDataToBigQuery(emailData);
}