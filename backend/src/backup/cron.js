var CronJob = require("cron").CronJob;
var Cron = require("./backupTask");
console.log(Cron.backupTask);

exports.default = new CronJob({
  cronTime: "0 30 19 * * *",
  onTick: function() {
    Cron.backupTask();
  },
  start: true,
  onComplete: () => console.log("Complete backup"),
  timeZone: "America/Sao_Paulo"
});

new CronJob({
  cronTime: "0 0 13 * * *",
  onTick: function() {
    Cron.backupTask();
  },
  start: true,
  onComplete: () => console.log("Complete backup"),
  timeZone: "America/Sao_Paulo"
});
