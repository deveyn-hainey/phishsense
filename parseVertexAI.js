function parseVertexAI(response) {
  if (!response || typeof response !== "object") {
    return "Error: Invalid AI response.";
  }
  if (response.error) {
    return "❌ API Error: " + response.error;
  }

  var explanationParts = [];
  if (Array.isArray(response)) {
    for (var i = 0; i < response.length; i++) {
      var candidates = response[i].candidates || [];
      for (var j = 0; j < candidates.length; j++) {
        var candidate = candidates[j];
        if (candidate.content && candidate.content.parts) {
          for (var p = 0; p < candidate.content.parts.length; p++) {
            var text = candidate.content.parts[p].text;
            if (text && text.trim() !== "##") {
              explanationParts.push(text.trim());
            }
          }
        }
      }
    }
  }

  var explanation = explanationParts.join(" ").trim();
  
  if (!explanation) {
    explanation = "No explanation found.";
  }

  // **New Fix**: Remove any remaining hash symbols
  explanation = explanation.replace(/#/g, "");

  // **New Fix**: Properly format the AI output
  explanation = cleanAndFormatExplanation(explanation);
  explanation = fixExplanationFormat(explanation);
  explanation = formatExplanationForBullets(explanation);

  return explanation;
}

function cleanAndFormatExplanation(explanation) {
  if (!explanation) return "No explanation found.";

  // Remove any stray `#` symbols from AI output
  explanation = explanation.replace(/#/g, "");

  // Ensure "Summary" and "Learning Section" are bold, even if formatting varies
  explanation = explanation.replace(/(?:Summary:|## Summary)/g, "<b>Summary:</b>");
  explanation = explanation.replace(/(?:Learning Section:|## Learning Section)/g, "<b>Learning Section:</b>");

  // Convert asterisks (*) at the start of lines to bullet points (•)
  explanation = explanation.replace(/\n\* /g, "\n• ");

  // Convert any **bolded words** to <b>HTML bold</b>
  explanation = explanation.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

  // Ensure proper spacing and replace newlines with <br> for HTML formatting
  explanation = explanation.replace(/\n\n/g, "<br><br>"); // Extra spacing between sections
  explanation = explanation.replace(/\n/g, "<br>"); // Single line breaks

  return explanation.trim();
}



function fixExplanationFormat(explanation) {
  explanation = explanation.replace(/\*\*Summary:\*\*/g, "<b>Summary:</b>");
  explanation = explanation.replace(/\*\*Learning Section:\*\*/g, "<b>Learning Section:</b>");

  // Ensure bullet points with bold labels are formatted correctly
  explanation = explanation.replace(/\* \*\*(.*?)\*\*:/g, "• <b>$1:</b>");

  return explanation;
}

function formatExplanationForBullets(explanation) {
  // Ensure proper spacing between sections
  explanation = explanation.replace(/\*\*Summary:\*\*/, "<b>Summary:</b><br><br>");
  explanation = explanation.replace(/\*\*Learning Section:\*\*/, "<b>Learning Section:</b><br><br>");

  // Convert bullet point labels to bold
  explanation = explanation.replace(/\* \*\*(.*?)\*\*:/g, "• <b>$1:</b>");

  // Remove any stray `#` characters
  explanation = explanation.replace(/#/g, "");

  // Replace newlines with <br> for proper HTML rendering
  explanation = explanation.replace(/\n/g, "<br>");

  return explanation;
}
