function parseNameAndEmail(rawAddress) {
  // Attempt to extract "Name" vs. "email@domain"
  // If no match, fallback to the raw string as email
  var nameRegex = /^(.*)\s<(.*)>$/;
  var match = rawAddress.match(nameRegex);
  if (match) {
    return {
      displayName: match[1].trim(),
      email: match[2].trim()
    };
  } else {
    // No display name found, just return entire string as the email
    return {
      displayName: "",
      email: rawAddress
    };
  }
}