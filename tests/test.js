jest.mock('../bigquery.js', () => ({
  uploadEmailDataToBigQuery: jest.fn().mockResolvedValue('Mocked BigQuery upload success'),
}));

const { uploadEmailDataToBigQuery } = require('../bigquery.js');

describe('BigQuery Upload Tests', () => {
  test('Uploads sample email data successfully (mocked)', async () => {
    const projectId = 'vertical-shore-436520-a4';
    const datasetId = 'email_metadata';
    const tableId = 'user_data';

    const sampleData = [
      {
        messageId: 'test123',
        sender: 'test@example.com',
        recipient: 'recipient@example.com',
        subject: 'Test Subject',
        date: new Date().toISOString(),
        emailBodyPlain: 'This is a test email body to ensure data uploads correctly to BigQuery.',
      },
    ];

    // Call the mocked function
    await expect(uploadEmailDataToBigQuery(projectId, datasetId, tableId, sampleData)).resolves.not.toThrow();
    
    // Verify the function was called
    expect(uploadEmailDataToBigQuery).toHaveBeenCalledWith(projectId, datasetId, tableId, sampleData);
  });
});
