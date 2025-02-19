function storeAiAnalysisToCache(explanation) {
  var userProps = PropertiesService.getUserProperties();
  userProps.setProperty("phishSense_ai_explanation", explanation);
}

function getAiAnalysisFromCache() {
  var userProps = PropertiesService.getUserProperties();
  return userProps.getProperty("phishSense_ai_explanation") || "";
}