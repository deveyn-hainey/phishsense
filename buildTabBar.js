function buildTabBar(activeTab) {
  var threadAction = CardService.newAction()
    .setFunctionName("switchTab")
    .setParameters({ tab: "thread" });
  var explanationAction = CardService.newAction()
    .setFunctionName("switchTab")
    .setParameters({ tab: "explanations" });

  // "In this thread"
  var threadBtn = CardService.newTextButton()
    .setText("In this thread")
    .setOnClickAction(threadAction)
    .setTextButtonStyle(CardService.TextButtonStyle.TEXT);

  if (activeTab === "thread") {
    threadBtn
      .setText("In this thread")
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor("#b51887"); // pink
  }

  // "Explanations"
  var explanationBtn = CardService.newTextButton()
    .setText("Explanations")
    .setOnClickAction(explanationAction)
    .setTextButtonStyle(CardService.TextButtonStyle.TEXT);

  if (activeTab === "explanations") {
    explanationBtn
      .setText("Explanations")
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor("#b51887");
  }

  // Put both in a single row
  var buttonSet = CardService.newButtonSet()
    .addButton(threadBtn)
    .addButton(explanationBtn);

  return CardService.newCardSection().addWidget(buttonSet);
}