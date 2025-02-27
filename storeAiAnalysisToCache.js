function storeAiAnalysisToCache(explanation, messageId) {
  var userProps = PropertiesService.getUserProperties();
  userProps.setProperty("phishSense_ai_explanation", explanation);
  userProps.setProperty("phishSense_last_message_id", messageId); // Store the last scanned email ID
}

function getAiAnalysisFromCache() {
  var userProps = PropertiesService.getUserProperties();
  return userProps.getProperty("phishSense_ai_explanation") || "";
}

function getLastScannedMessageId() {
  var userProps = PropertiesService.getUserProperties();
  return userProps.getProperty("phishSense_last_message_id") || "";
}


