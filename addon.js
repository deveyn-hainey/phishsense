function buildAddOn(e) {
  // Let the add-on read the email body:
  if (e && e.messageMetadata && e.messageMetadata.accessToken) {
    GmailApp.setCurrentMessageAccessToken(e.messageMetadata.accessToken);
  }

  // Decide which tab. Default "thread".
  var activeTab = (e.parameters && e.parameters.tab) ? e.parameters.tab : "thread";

  if (activeTab === "explanations") {
    return [ buildExplanationsCard(e) ];
  } else {
    return [ buildThreadCard(e) ];
  }
}