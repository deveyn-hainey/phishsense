/**
 * Uploads email metadata and content to an existing BigQuery table.
 *
 * @param {string} projectId The project ID in BigQuery.
 * @param {string} datasetId The dataset ID in BigQuery.
 * @param {string} tableId The table ID in BigQuery.
 * @param {Object[]} emailData Array of email metadata objects.
 */
function uploadEmailDataToBigQuery(projectId, datasetId, tableId, emailData) {
  const rows = [];

  // Map emailData to rows using a traditional loop
  for (var i = 0; i < emailData.length; i++) {
    const data = emailData[i];
    rows.push({
      insertId: data.messageId, // Unique identifier to prevent duplicates
      json: {
        email_id: data.messageId,
        sender: data.sender,
        recipient: data.recipient,
        subject: data.subject,
        date: data.date, // Ensure the date is in TIMESTAMP format
        emailBodyPlain: data.emailBodyPlain,
      },
    });
  }

  try {
    Logger.log('Preparing to insert email data into BigQuery: ' + JSON.stringify(rows));

    // Insert rows into BigQuery table
    const request = { rows: rows };
    const response = BigQuery.Tabledata.insertAll(request, projectId, datasetId, tableId);

    Logger.log('BigQuery Insert Response: ' + JSON.stringify(response));

    // Check for errors in the response
    if (response.insertErrors && response.insertErrors.length > 0) {
      Logger.log('Insert Errors: ' + JSON.stringify(response.insertErrors));
    } else {
      Logger.log('Email content successfully inserted into BigQuery.');
    }
  } catch (err) {
    Logger.log('Error uploading data to BigQuery: ' + err.message);
  }
}