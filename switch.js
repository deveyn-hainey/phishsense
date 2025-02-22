function switchTab(e) {
  var tabToShow = e.parameters.tab || "thread";
  var nav = CardService.newNavigation();
  if (tabToShow === "explanations") {
    nav.updateCard(buildExplanationsCard(e));
  } else {
    nav.updateCard(buildThreadCard(e));
  }
  return CardService.newActionResponseBuilder()
    .setNavigation(nav)
    .build();
}