function buildParticipantWidget(name, email, avatarUrl) {
  // Create an icon for the left side
  var iconImage = CardService.newIconImage().setIconUrl(avatarUrl);

  // Build the decorated text
  var decorated = CardService.newDecoratedText()
    .setStartIcon(iconImage)
    .setTopLabel(name)   // The person's name on top
    .setText(email)      // The email below
    .setWrapText(true);

  return decorated;
}