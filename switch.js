function switchTab(e) {
  var tabToShow = e.parameters.tab || "readEmail";

  var nav = CardService.newNavigation();
  if (tabToShow === "aiExplanation") {
    nav.updateCard(buildAiExplanationCard());
  } else {
    nav.updateCard(buildReadEmailCard(e));
  }

  return CardService.newActionResponseBuilder()
    .setNavigation(nav)
    .build();
}