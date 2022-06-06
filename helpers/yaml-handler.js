const yaml = require('js-yaml');
const fs   = require('fs');
const ALLOWED_VALUES= require('../schedule_config/allowed_values')


class YamlHandler {
    constructor() {
    }

    /**
     * Get all schedules from the loaded yaml data
     * @param yamlData_ yaml data from the loadAndTransform function
     * @returns {FlatArray<(boolean|*)[], 1>[]} Array of all enabled schedules
     */
    static getAllSchedules(yamlData_){
        return [
            yamlData_.watch.unique,
            yamlData_.watch.recurrent
        ]
            .flat()
            .filter(s=>s.enabled);

    }

    static loadAndTransform(filepath, transformShowDiff=true) {
        // Get document, or throw exception on error
        try {
            let doc = yaml.load(fs.readFileSync(filepath, 'utf8'));
            doc = this.transformData(doc, transformShowDiff);
            return doc;
        } catch (e) {
            console.log(e);
        }

    }

    /**
     * Transforms some fields of the data according to the mapping table in 'schedule_config/allowed_values'
     * - coating: coating name -> coating id
     * - inOut: covering of the court
     * - day: day of recurrent schedule
     * @param data
     * @param showDiff
     * @returns {*}
     */
    static transformData(data, showDiff= true){
        let schedulesUnique = data.watch.unique;
        let schedulesRecurrent = data.watch.recurrent;

        let replaceValues = (schedules, mappingValues_covering, mappingValues_coating, mappingValues_days) => {

            return schedules.map(schedule => {

                if (showDiff) console.log("::transform-old-value:")
                if (showDiff) console.log(schedule)

                // Replace covering values with mapping
                if (schedule.inOut) {
                    schedule.inOut = schedule.inOut.map(e => mappingValues_covering[e]);
                    if (schedule.inOut.filter(e=> !e).length>0) throw new Error("Unknown inOut value in yml. Allowed values are: "+JSON.stringify(Object.keys(mappingValues_covering)))

                }

                // Replace coating values with mapping
                if (schedule.coating) {
                    schedule.coating = schedule.coating.map(e => mappingValues_coating[e]);
                    if (schedule.coating.filter(e=> !e).length>0) throw new Error("Unknown coating value in yml. Allowed values are: "+JSON.stringify(Object.keys(mappingValues_coating)))

                }

                // Replace day values with mapping
                if (schedule.day) {
                    schedule.day = mappingValues_days[schedule.day];
                    if (!schedule.day) throw new Error("Unknown day value in yml. Allowed values are: "+JSON.stringify(Object.keys(mappingValues_days)))

                }

                if (showDiff) console.log("::transform-new-value:")
                if (showDiff) console.log(schedule)

                return schedule;
            })
        }

        data.watch.unique = replaceValues(schedulesUnique, ALLOWED_VALUES.covering, ALLOWED_VALUES.coating, ALLOWED_VALUES.day);
        data.watch.recurrent = replaceValues(schedulesRecurrent, ALLOWED_VALUES.covering, ALLOWED_VALUES.coating, ALLOWED_VALUES.day);

        return data;
    }

}

module.exports = YamlHandler;
