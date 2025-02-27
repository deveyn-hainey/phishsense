function switchTab(e) {
  var tabToShow = e.parameters.tab || "thread";
  var nav = CardService.newNavigation();

  if (tabToShow === "scan") {
    return scanEmail(e); // Ensure we always scan the latest email
  } else {
    nav.updateCard(buildThreadCard(e));
  }

  return CardService.newActionResponseBuilder()
    .setNavigation(nav)
    .build();
}
