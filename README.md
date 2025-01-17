# phishsense
Git Repo For PishSense Senior Design

1. Installation to run Appscript:
Install Node.js
If Node.js isn't already installed, download and install it:

Visit Node.js Download Page
Download the LTS version (recommended for most users).
Install Node.js by following the instructions for your operating system.
Once installed, verify the installation:
run:

node -v
npm -v

2. Install clasp
With Node.js installed, use npm to install clasp globally:
run:

npm install -g @google/clasp

After installation, verify it by checking the version:
run:

clasp --version
This should output the installed version of clasp.

3. Authenticate clasp
To use clasp, you need to authenticate it with your Google account:
run:

clasp login

4. Link clasp to an Apps Script Project
If you already have an existing Apps Script project, link it to clasp:

For a New Project:
run:
clasp create --type standalone --title "My New Project"

For an Existing Project:
Navigate to your project directory.
Run:
clasp clone <SCRIPT_ID>

Replace <SCRIPT_ID> with the script ID of your Apps Script project. You can find the script ID in the Apps Script Editor under File > Project Properties.

5. Start Using clasp
You can now use clasp commands, such as:

Push Local Changes to Apps Script:
clasp push

Pull Changes from Apps Script:
clasp pull

Open the Apps Script Editor:
clasp open
