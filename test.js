/**
 * Test function to verify BigQuery uploads with sample email data.
 
function testBigQueryUpload() {
  const projectId = 'vertical-shore-436520-a4'; // Your Google Cloud Project ID
  const datasetId = 'email_metadata'; // Your BigQuery dataset ID
  const tableId = 'user_data'; // Your BigQuery table ID

  const sampleData = [
    {
      messageId: 'test123',
      sender: 'test@example.com',
      recipient: 'recipient@example.com',
      subject: 'Test Subject',
      date: new Date().toISOString(), // Ensure it matches the TIMESTAMP format
      emailBodyPlain: 'This is a test email body to ensure data uploads correctly to BigQuery.',
    },
  ];

  uploadEmailDataToBigQuery(projectId, datasetId, tableId, sampleData);
  
}
*/
function testVertexAIIntegration() {
  try {
    // Simulate email data exactly as it is received in the add-on
    const emailData = [
      {
        messageId: "test123",
        sender: "markhospital@gmail.com",  // Mimicking phishing email sender
        recipient: "hollandthy@gmail.com",
        subject: "URGENT: Your account has been compromised! Please press the link and reset your password",
        date: new Date().toISOString(),
        emailBodyPlain: "Hello, your account has been compromised! Please reset your password"
      }
    ];

    // Extract email body (simulating how the add-on works)
    const emailBody = emailData[0].emailBodyPlain;

    // 1) Call the AI function with simulated data
    const aiResponse = analyzeEmailWithVertexAI(emailBody);

    // 2) Parse AI response
    const parsedResponseAny = parseVertexAI(aiResponse);

    // 3) Force it to a string to avoid `.includes()` errors
    const parsedResponse = String(parsedResponseAny);

    Logger.log("Full Explanation: " + parsedResponse);

  } catch (error) {
    // 6) If there's an error, log it and the stack
    Logger.log("Error in testVertexAIIntegration: " + error.message);
    Logger.log("Stack: " + error.stack);
  }
}

