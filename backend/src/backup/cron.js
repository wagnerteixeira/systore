var CronJob = require("cron").CronJob;
var Cron = require("./backupTask");
console.log(Cron.backupTask);

exports.default = new CronJob({
  cronTime: "0 28 00 * * *",
  onTick: function() {
    Cron.backupTask();
  },
  start: true,
  onComplete: () => console.log("Complete backup"),
  timeZone: "America/Sao_Paulo"
});
