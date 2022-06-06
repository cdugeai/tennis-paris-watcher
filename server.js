const yaml = require('./helpers/yaml-handler')
const tennisParis = require('./helpers/tennis-api-handler')



const CONFIG = {
}



async function main() {

    // Load yaml config file
    let doc = yaml.load('watch.yml')

    // Work on this timeslot
    let schedule1 = doc.watch.unique[1];
    console.log(schedule1);

    // Get data to post for this timeslot
    let postData = tennisParis.buildDataToPost(schedule1.time_start, schedule1.time_end, schedule1.date);
    //console.log(postData)

    // Obtain the matching courts for this timeslot
    let apiResponse = await tennisParis.postData(postData);
    //apiResponse = tennisParis._filterUnique(apiResponse);

    let availableCourts = tennisParis.getAvailableCourts(apiResponse);
    let prettyCourts = tennisParis.prettifyCourts(availableCourts)

    console.log(prettyCourts)

}



main();
