const tennisParis = require('./tennis-api-handler')

class ScheduleHandler {
    constructor() {
    }

    static async searchSchedule(schedule) {

        // If the schedule contains the key "date", it is a 'recurrent' schedule
        let isScheduleRecurrent = (schedule.day) ? true :false;
        let dateStr;

        // If schedule recurrent
        if (isScheduleRecurrent) {
            // If schedule is reccurent,
            // first have to find the date of the next occuring day
            let targetDayId = schedule.day;
            let targetDay = new Date();

            while (targetDay.getDay() !== targetDayId) {
                targetDay.setDate(targetDay.getDate()+1)
            }

            dateStr = targetDay.toLocaleDateString('fr');
        } else {
            // Else, if the schedule is of type 'unique', the date is specified in the config
            dateStr = schedule.date;

        }


        // Get data to post for this timeslot
        let postData = tennisParis.buildDataToPost(
            schedule.time_start,
            schedule.time_end,
            dateStr,
            schedule.coating,
            schedule.inOut);


        // Obtain the matching courts for this timeslot
        let apiResponse = await tennisParis.postData(postData);
        // filter unique (error from paris tennis api)
        apiResponse = tennisParis._filterUnique(apiResponse);

        return apiResponse;



    }
    
}

module.exports = ScheduleHandler;
