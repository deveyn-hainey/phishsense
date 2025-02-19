function buildTabBar(activeTab) {
  var tabSection = CardService.newCardSection();

  // --- "In this thread" button ---
  var threadAction = CardService.newAction()
    .setFunctionName("switchTab")
    .setParameters({ tab: "thread" });

  var threadBtn = CardService.newTextButton()
    .setText("In this thread")
    .setOnClickAction(threadAction)
    .setTextButtonStyle(CardService.TextButtonStyle.TEXT);

  if (activeTab === "thread") {
    threadBtn
      .setText("In this thread (active)")
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor("#4285F4"); // Google blue
  }

  // --- "AI Explanation" button ---
  var analysisAction = CardService.newAction()
    .setFunctionName("switchTab")
    .setParameters({ tab: "analysis" });

  var analysisBtn = CardService.newTextButton()
    .setText("AI Explanation")
    .setOnClickAction(analysisAction)
    .setTextButtonStyle(CardService.TextButtonStyle.TEXT);

  if (activeTab === "analysis") {
    analysisBtn
      .setText("AI Explanation (active)")
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor("#4285F4");
  }

  // Place them side by side
  var buttonSet = CardService.newButtonSet()
    .addButton(threadBtn)
    .addButton(analysisBtn);

  tabSection.addWidget(buttonSet);
  return tabSection;
}