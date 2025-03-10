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

function openDashboard() {
  var userEmail = Session.getActiveUser().getEmail();  // Get user email

  var dashboardUrl = "https://your-dashboard.web.app/?email=" + userEmail; // No encodeURIComponent

  return CardService.newUniversalActionResponseBuilder()
    .setOpenLink(CardService.newOpenLink().setUrl(dashboardUrl))
    .build();
}


