function buildTabBar(e) {
  var activeTab = e.parameters && e.parameters.tab ? e.parameters.tab : "thread"; // Default to "thread"

  var threadAction = CardService.newAction()
    .setFunctionName("switchTab")
    .setParameters({ tab: "thread", messageId: e.messageMetadata ? e.messageMetadata.messageId : "" });

  var scanAction = CardService.newAction()
    .setFunctionName("switchTab")  // Ensure switching works
    .setParameters({ tab: "scan", messageId: e.messageMetadata ? e.messageMetadata.messageId : "" });

  var threadBtn = CardService.newTextButton()
    .setText("In this thread")
    .setOnClickAction(threadAction)
    .setTextButtonStyle(activeTab === "thread" ? CardService.TextButtonStyle.FILLED : CardService.TextButtonStyle.OUTLINED)
    .setBackgroundColor(activeTab === "thread" ? "#b51887" : "#ffffff");

  var scanBtn = CardService.newTextButton()
    .setText("Scan Email")
    .setOnClickAction(scanAction)
    .setTextButtonStyle(activeTab === "scan" ? CardService.TextButtonStyle.FILLED : CardService.TextButtonStyle.OUTLINED)
    .setBackgroundColor(activeTab === "scan" ? "#b51887" : "#ffffff");

  var buttonSet = CardService.newButtonSet()
    .addButton(threadBtn)
    .addButton(scanBtn);

  return CardService.newCardSection().addWidget(buttonSet);
}