function uploadEmailDataToBigQuery(projectId, datasetId, tableId, emailData) {
  if (!emailData || !Array.isArray(emailData) || emailData.length === 0) {
    Logger.log("No email data provided for BigQuery upload. Function exited.");
    return; // Exit the function if emailData is invalid
  }

  const rows = [];

  // Map emailData to rows using a loop
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
    // Insert rows into BigQuery table
    const request = { rows: rows };
    const response = BigQuery.Tabledata.insertAll(request, projectId, datasetId, tableId);
    
    // Log response for debugging
    Logger.log("BigQuery Insert Response: " + JSON.stringify(response));

    // Check if there are any insertion errors
    if (response.insertErrors) {
      Logger.log("Insertion Errors: " + JSON.stringify(response.insertErrors));
    } else {
      Logger.log("Data inserted successfully into BigQuery.");
    }
  } catch (err) {
    Logger.log("Error inserting into BigQuery: " + err.toString());
  }
}

function insertClassificationAndExplanationInBigQuery(projectId, datasetId, tableId, messageId, classification, explanation) {
  try {
    // Ensure values are properly escaped
    messageId = escapeStringForSQL(messageId);
    classification = escapeStringForSQL(classification);
    explanation = escapeStringForSQL(explanation);

    // Construct the INSERT query
    var insertQuery = "INSERT INTO `" + projectId + "." + datasetId + "." + tableId + "` " +
                      "(messageId, classification, explanation) VALUES ('" + messageId + "', '" + classification + "', '" + explanation + "');";

    // Execute the query
    var bigquery = BigQuery;
    var queryJob = bigquery.query(insertQuery);

    Logger.log("✅ Successfully inserted classification & explanation into BigQuery.");
    return queryJob;
  } catch (error) {
    Logger.log("❌ Error inserting classification & explanation into BigQuery: " + error.message);
  }
}


