const yaml = require('./helpers/yaml-handler')
const tennisParis = require('./helpers/tennis-api-handler')
const scheduleFinder = require('./helpers/schedule-handler')


const CONFIG = {
}



async function main() {

    // Load yaml config file
    let doc = yaml.load('./schedule_config/watch.yml')

    // Work on this timeslot
    let schedule1 = doc.watch.recurrent[0];
    console.log(schedule1);

    let apiResponse = await scheduleFinder.searchSchedule(schedule1)

    let availableCourts = tennisParis.getAvailableCourts(apiResponse);
    let prettyCourts = tennisParis.prettifyCourts(availableCourts)

    console.log(prettyCourts)

}



main();
