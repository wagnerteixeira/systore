var fs = require("fs");
var _ = require("lodash");
var exec = require("child_process").exec;
var dbOptions = {
  host: "localhost",
  port: 27017,
  database: "systore",
  autoBackup: true,
  removeOldBackup: true,
  keepLastDaysBackup: 2,
  autoBackupPath: "./" // i.e. /var/database-backup/
};
/* return date object */
const stringToDate = function(dateString) {
  return new Date(dateString);
};
/* return if variable is empty or not. */
const empty = function(mixedVar) {
  var undef, key, i, len;
  var emptyValues = [undef, null, false, 0, "", "0"];
  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixedVar === emptyValues[i]) {
      return true;
    }
  }
  if (typeof mixedVar === "object") {
    for (key in mixedVar) {
      return false;
    }
    return true;
  }
  return false;
};
// Auto backup script
exports.dbAutoBackUp = () => {
  // check for auto backup is enabled or disabled
  if (dbOptions.autoBackup == true) {
    var date = new Date();
    var beforeDate, oldBackupDir, oldBackupPath;
    currentDate = stringToDate(date); // Current date
    var newBackupDir =
      currentDate.getFullYear() +
      "_" +
      (currentDate.getMonth() + 1) +
      "_" +
      currentDate.getDate() +
      "_" +
      currentDate.getHours() +
      "_" +
      currentDate.getMinutes() +
      "_" +
      currentDate.getSeconds();
    var newBackupPath = dbOptions.autoBackupPath + "mongodump_" + newBackupDir; // New backup path for current backup process
    // check for remove old backup after keeping # of days given in configuration
    if (dbOptions.removeOldBackup == true) {
      beforeDate = _.clone(currentDate);
      beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup); // Substract number of days to keep backup and remove old backup
      oldBackupDir =
        beforeDate.getFullYear() +
        "-" +
        (beforeDate.getMonth() + 1) +
        "-" +
        beforeDate.getDate();
      oldBackupPath = dbOptions.autoBackupPath + "mongodump-" + oldBackupDir; // old backup(after keeping # of days)
    }
    var cmd =
      "mongodump --host " +
      dbOptions.host +
      " --port " +
      dbOptions.port +
      " --db " +
      dbOptions.database +
      //  " --username " +
      //  dbOptions.user +
      //  " --password " +
      //dbOptions.pass +
      " --out " +
      newBackupPath; // Command for mongodb dump process
    exec(cmd, function(error, stdout, stderr) {
      if (empty(error)) {
        // check for remove old backup after keeping # of days given in configuration
        if (dbOptions.removeOldBackup == true) {
          if (fs.existsSync(oldBackupPath)) {
            exec("rm -rf " + oldBackupPath, function(err) {});
          }
        }
      }
    });
  }
};
