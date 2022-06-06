const tennisParis = require('./tennis-api-handler')

class ScheduleHandler {
    constructor() {
    }

    static async searchUniqueSchedule(uniqueSchedule){


        // Get data to post for this timeslot
        let postData = tennisParis.buildDataToPost(
            uniqueSchedule.time_start,
            uniqueSchedule.time_end,
            uniqueSchedule.date,
            uniqueSchedule.coating,
            uniqueSchedule.inOut);

        //console.log(postData)

        // Obtain the matching courts for this timeslot
        let apiResponse = await tennisParis.postData(postData);
        apiResponse = tennisParis._filterUnique(apiResponse);

        return apiResponse;
    }
}

module.exports = ScheduleHandler;
