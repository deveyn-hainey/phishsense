function testBigQueryInsert() {
  const projectId = 'vertical-shore-436520-a4';
  const datasetId = 'email_metadata';
  const tableId = 'results';

  // Ensure only the correct fields are sent
  var testEmailData = [{
    email_id: "test-email-12345",
    date: new Date().toISOString() // Include date
  }];

  Logger.log("🔹 Inserting email metadata into BigQuery...");
  uploadEmailDataToBigQuery(projectId, datasetId, tableId, testEmailData);

  // Mock AI-generated explanation - Ensure it's stored as JSON
  var testEmailId = "test-email-12345"; 
  var testExplanation = JSON.stringify({
    summary: "This email is Safe. It is a legitimate notification from Spectrum regarding a job application.",
    learning_section: [
      "Sender: The email comes from '@spectrum.com,' a legitimate domain associated with Spectrum.",
      "Content: The email content is professional and consistent with the application process.",
      "Links: The email contains links to Spectrum's official website.",
      "Unsubscribe Option: The email includes an unsubscribe link.",
      "No Urgent Action Required: The email doesn't pressure the recipient."
    ],
    conclusion: "Overall, the email exhibits characteristics of a legitimate communication from Spectrum."
  });

  storeAiAnalysisToCache(testExplanation, testEmailId);

  Logger.log("🔹 Extracting and uploading classification...");
  processAndUploadAiAnalysis();

  Logger.log("✅ Test data insertion complete.");
}

function insertClassificationAndExplanationInBigQuery(projectId, datasetId, tableId, emailId, classification, explanation, date) {
  try {
    var rows = [{
      json: {
        email_id: emailId,
        classification: classification,
        explanation: JSON.stringify(explanation), // Ensure explanation is stringified
        date: date
      }
    }];

    var request = {
      rows: rows
    };

    var response = BigQuery.Tabledata.insertAll(request, projectId, datasetId, tableId);
    
    if (response.insertErrors) {
      Logger.log("❌ Insertion Errors: " + JSON.stringify(response.insertErrors));
    } else {
      Logger.log("✅ Successfully inserted classification & explanation into BigQuery.");
    }
    
  } catch (error) {
    Logger.log("❌ Error inserting classification & explanation into BigQuery: " + error.message);
  }
}
function processAndUploadAiAnalysis() {
  const projectId = 'vertical-shore-436520-a4';
  const datasetId = 'email_metadata';
  const tableId = 'results';

  var explanation = getAiAnalysisFromCache();
  var emailId = getLastScannedMessageId();
  var date = new Date().toISOString(); 

  if (!explanation || !emailId) {
    Logger.log("❌ No AI analysis explanation or email_id found in cache.");
    return;
  }

  var classification = extractClassificationFromExplanation(explanation);

  Logger.log("🔹 Extracted classification: " + classification);
  Logger.log("🔹 Uploading classification and explanation to BigQuery...");

  insertClassificationAndExplanationInBigQuery(projectId, datasetId, tableId, emailId, classification, explanation, date);

  Logger.log("✅ Classification and explanation uploaded to BigQuery.");
}

function extractClassificationFromExplanation(explanation) {
  if (!explanation) {
    Logger.log("❌ Explanation is missing or undefined.");
    return "Unknown";
  }

  try {
    var parsedExplanation;
    
    // First convert explanation to string if needed
    var explanationString = typeof explanation === "string" ? explanation : JSON.stringify(explanation);
    
    // Now parse the string
    try {
      parsedExplanation = JSON.parse(explanationString);
    } catch (e) {
      Logger.log("❌ Explanation is not valid JSON: " + explanationString);
      return "Unknown";
    }

    // Ensure parsedExplanation is an object
    if (typeof parsedExplanation !== "object" || parsedExplanation === null) {
      Logger.log("❌ Parsed explanation is not a valid object: " + JSON.stringify(parsedExplanation));
      return "Unknown";
    }

    // Extract summary - force string conversion
    var summary = "";
    if (parsedExplanation.summary) {
      summary = String(parsedExplanation.summary).trim(); // Force string conversion
    }

    if (!summary) {
      Logger.log("❌ Summary is missing in explanation: " + JSON.stringify(parsedExplanation));
      return "Unknown";
    }

    Logger.log("🔹 Extracted summary: " + summary);

    // Extract the first 10 words for classification
    var words = summary.split(/\s+/);
    var first10Words = words.slice(0, 10).join(" ").trim();
    Logger.log("🔹 First 10 words of summary: " + first10Words);

    // Convert to lowercase for matching
    var first10WordsLower = first10Words.toLowerCase();

    // Use indexOf instead of includes (ES5 compatible)
    if (first10WordsLower.indexOf("safe") > -1) {
      return "Safe";
    } else if (first10WordsLower.indexOf("phishing") > -1) {
      return "Phishing";
    }

  } catch (error) {
    Logger.log("❌ Error processing explanation JSON: " + error.message);
  }

  return "Unknown";
}
