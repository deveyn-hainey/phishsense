function parseVertexAI(response) {
  if (!response || typeof response !== "object") {
    return "Error: Invalid AI response.";
  }

  // ✅ Handle API errors
  if (response.error) {
    return "❌ API Error: " + response.error;
  }

  var classification = " See Below:";
  var explanationParts = [];
  var blockedBySafety = false;
  var safetyMessage = "";

  // ✅ Iterate through all candidates
  if (Array.isArray(response)) {
    for (var i = 0; i < response.length; i++) {
      var candidates = response[i].candidates || [];
      
      for (var j = 0; j < candidates.length; j++) {
        var candidate = candidates[j];

        // ✅ Handle safety block
        if (candidate.finishReason === "SAFETY" && candidate.safetyRatings) {
          blockedBySafety = true;
          safetyMessage = "⚠️ AI response was blocked due to safety concerns. Categories detected: ";
          
          var safetyCategories = [];
          for (var k = 0; k < candidate.safetyRatings.length; k++) {
            var rating = candidate.safetyRatings[k];
            if (rating.blocked) {
              safetyCategories.push(rating.category.replace("HARM_CATEGORY_", "").replace("_", " ").toLowerCase());
            }
          }
          safetyMessage += safetyCategories.join(", ");
          break;
        }

        // ✅ Collect and merge all text parts
        if (candidate.content && candidate.content.parts) {
          for (var p = 0; p < candidate.content.parts.length; p++) {
            var textPart = candidate.content.parts[p].text;
            if (typeof textPart === "string" && textPart.trim() !== "##") { // Filter out placeholders
              explanationParts.push(textPart.trim());
            }
          }
        }
      }
    }
  }

  // ✅ Merge all explanation parts into a single response
  var explanation = explanationParts.join(" ").trim();

  // ✅ Ensure explanation is always a string
  if (!explanation || typeof explanation !== "string") {
    explanation = "AI did not provide a clear explanation.";
  }

  // ✅ Fix incorrect bullet formatting
  explanation = explanation
    .replace(/\*\s/g, "- ")  // Replace `* ` with `- ` for cleaner bullet points
    .replace(/\*\*/g, "")  // Remove any extra `**` that may appear incorrectly
    .replace(/-\s\*\*/g, "- **")  // Ensure proper bolding after bullet replacements
    .replace(/\n-\s+/g, "\n- ")  // Fix spacing issues in bullet points
    .trim();

  Logger.log("Final Explanation: " + explanation);
  //Logger.log("Type of Explanation: " + typeof explanation);

  // ✅ Ensure explanation is a string before using `.includes()`
  if (typeof explanation !== "string") {
    explanation = String(explanation); // Convert to string
  }

  // ✅ Construct final user-friendly message
  if (blockedBySafety) {
    return safetyMessage;
  } else {
    return classification + "\n\nExplanation:\n" + explanation;
  }
}
