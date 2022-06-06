const yaml = require('./helpers/yaml-handler')
const tennisParis = require('./helpers/tennis-api-handler')
const scheduleFinder = require('./helpers/schedule-handler')


const CONFIG = {
}



async function main() {

    // Load yaml config file
    let yamlData = yaml.loadAndTransform('watch.yml', false)


    let all_schedules = yaml.getAllSchedules(yamlData);
    //console.log(all_schedules)


    for (schedule of all_schedules) {

        console.log(">> SCHEDULE: "+schedule.name)
        let apiResponse = await scheduleFinder.searchSchedule(schedule)

        let availableCourts = tennisParis.getAvailableCourts(apiResponse);
        let prettyCourts = tennisParis.prettifyCourts(availableCourts)

        //console.log(prettyCourts)

        console.log(`Available slots for schedule ${schedule.name}: ${prettyCourts.length}`)
    }


}



main();
