function sendFakeEmails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  var recipient = "luluhoran361@gmail.com"; // Change this to your test email
  
  for (var i = 1; i < data.length; i++) { // Start from row 1 (skip headers)
    var fakeSender = data[i][0]; // Assuming column A has the fake email
    var subject = "Test Email from " + fakeSender;
    var body = "This is a test email sent from a fake sender: " + fakeSender;

    GmailApp.sendEmail(recipient, subject, body, {
      name: fakeSender // This makes it look like it's from the fake sender
    });
  }
}

