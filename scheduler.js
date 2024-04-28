const schedule = require("node-schedule");
const axios = require("axios");

const scheduleJobs = new Map();

function onSprinkler(url){
   try{
    axios
    .get(url)
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
   }
   catch(err){
    console.log(err)
   }
}
function jober(name) {
  if (name[name.length - 1] == "M") {
    console.log("One");
    onSprinkler("http://192.168.70.216/one");
  } 
  else 
  onSprinkler("http://192.168.70.216/two");

  console.log("job being done", name, new Date());
}

function scheduler(jobName, timeString) {
  const oldJob = scheduleJobs.get(jobName);
  if (oldJob) {
    oldJob.cancel();
    scheduleJobs.delete(jobName);
  }
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const scheduledTime = new Date();
  scheduledTime.setHours(hours);
  scheduledTime.setMinutes(minutes);
  scheduledTime.setSeconds(seconds);
  const job = schedule.scheduleJob(jobName, scheduledTime, () =>
    jober(jobName)
  );
  scheduleJobs.set(jobName, job);
  console.log(`job with ${jobName} is created for ${scheduledTime}`);
}
function unSchedule(jobName){
  const oldJob = scheduleJobs.get(jobName);
  if (oldJob) {
    console.log("Deleting",jobName)
    oldJob.cancel();
    scheduleJobs.delete(jobName);
  }
}

module.exports = { scheduler,unSchedule };
