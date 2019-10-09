var CronJob = require("cron").CronJob;
var Cron = require("./mongodb_backup.js");
new CronJob(
  "30 19 0 * * *",
  function() {
    Cron.dbAutoBackUp();
  },
  null,
  true,
  "America/New_York"
);
