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

  explanation = fixExplanationFormat(explanation);
  return explanation
}

function fixExplanationFormat(explanation) {
  explanation = explanation.replace(/\*\*Summary:\*\*/, "<b>Summary:<b>");

  explanation = explanation.replace("## Learning Section:", "<b>Learning Section:<b>");

  explanation = explanation.replace(/\* \*\*(.*?)\*\*:/g, "* $1:");


  return explanation;
}

function formatExplanationForBullets(explanation) {
  // Insert newline before any '* '
  explanation = explanation.replace(/([^>\n])\* /g, "$1\n* ");
  // Replace '* ' with bullet
  explanation = explanation.replace(/\* /g, "• ");
  // Convert newlines to <br>
  explanation = explanation.replace(/\n/g, "<br>");
  return explanation;
}
