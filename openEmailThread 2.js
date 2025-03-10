function openEmailThread(e) {
  var messageId = e.parameters.messageId;
  if (!messageId) {
    return CardService.newUniversalActionResponseBuilder()
      .setOpenLink(CardService.newOpenLink().setUrl("https://mail.google.com/mail/u/0/#inbox"))
      .build();
  }

  var emailThreadUrl = "https://mail.google.com/mail/u/0/#inbox/" + messageId;

  return CardService.newUniversalActionResponseBuilder()
    .setOpenLink(CardService.newOpenLink().setUrl(emailThreadUrl))
    .build();
}
