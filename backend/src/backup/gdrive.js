const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
var archiver = require("archiver");

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/drive.metadata",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive"
];

const backupFolderId = "1h95khEL8axPSQAAQbY3yX_Lzohx4yCH4";
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = `${__dirname}/token.json`;
const CREDENTIALS_PATH = `${__dirname}/credentials.json`;

const test = () => {
  // Load client secrets from a local file.
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), listFiles);
  });
};

//test();

const uploadBackup = async (folderName, folderPath) => {
  var archive = archiver.create("zip", {});
  var fileName = `${folderPath}.zip`;
  var output = fs.createWriteStream(fileName);
  archive.pipe(output);
  console.log("zip file");
  await archive.directory(folderPath).finalize();

  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Drive API.
    console.log("upload file");
    authorize(JSON.parse(content), _uploadBackup, [fileName, folderName]);
  });
};

const _uploadBackup = (auth, fileName, folderName) => {
  console.log(`auth: ${auth} fileName ${fileName}`);
  const drive = google.drive({ version: "v3", auth });
  const media = {
    mimeType: "application/zip",
    body: fs.createReadStream(fileName)
  };

  const fileMetadata = {
    name: `${folderName}.zip`,
    parents: [backupFolderId]
  };

  const requestBody = {
    name: fileName,
    mimeType: "application/zip"
  };

  drive.files.create(
    {
      resource: fileMetadata,
      // requestBody: requestBody,
      media: media,
      fields: "id"
    },
    function(err, file) {
      console.log(`${JSON.stringify(file, null, 2)}`);
      if (err) {
        // Handle error
        console.error(err);
      } else {
        //if (callback) callback(file.data.id);
      }
    }
  );
};
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, paramsCallback) {
  console.log(`autorize ${credentials} ${callback} ${paramsCallback}`);

  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      if (paramsCallback)
        return getAccessToken(oAuth2Client, callback, ...paramsCallback);
      else return getAccessToken(oAuth2Client, callback);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    if (paramsCallback) callback(oAuth2Client, ...paramsCallback);
    else callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback, paramsCallback) {
  console.log(`getAccessToken ${oAuth2Client} ${callback} ${paramsCallback}`);
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      console.log(`paramCallback ${JSON.stringify(paramsCallback)}`);
      callback(oAuth2Client, ...paramsCallback);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  const drive = google.drive({ version: "v3", auth });
  drive.files.list(
    {
      pageSize: 10,
      fields: "nextPageToken, files(id, name)"
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const files = res.data.files;
      if (files.length) {
        console.log("Files:");
        files.map(file => {
          console.log(`${file.name} (${file.id})`);
        });
      } else {
        console.log("No files found.");
      }
    }
  );
}

exports.uploadBackup = uploadBackup;
