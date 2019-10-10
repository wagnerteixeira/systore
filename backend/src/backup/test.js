var mongoBackup = require("./mongodb_backup.js");
var gdrive = require("./gdrive");
var backupDir = mongoBackup.dbAutoBackUp();
backupDir.then(res => {
  console.log(
    `newBackupPath: ${res.newBackupPath} newBackupDir: ${res.newBackupDir}`
  );
  gdrive.uploadBackup(res.newBackupDir, res.newBackupPath);
});
