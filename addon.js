function buildAddOn(e) {
  try {
    // Allow reading the email body
    if (e && e.messageMetadata && e.messageMetadata.accessToken) {
      GmailApp.setCurrentMessageAccessToken(e.messageMetadata.accessToken);
    }

    // Determine which tab is requested
    // Default = "readEmail"
    var activeTab = (e.parameters && e.parameters.tab) 
      ? e.parameters.tab 
      : "readEmail";

    // Return the appropriate card
    if (activeTab === "aiExplanation") {
      return [ buildAiExplanationCard() ];
    } else {
      // Default tab
      return [ buildReadEmailCard(e) ];
    }

  } catch (error) {
    Logger.log("Error in buildAddOn: " + error.message);
    return showErrorCard(error.message);
  }
}