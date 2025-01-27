/**
 * Test function to verify BigQuery uploads with sample email data.
 */
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

