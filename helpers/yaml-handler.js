const yaml = require('js-yaml');
const fs   = require('fs');
const ALLOWED_VALUES= require('../schedule_config/allowed_values')


class YamlHandler {
    constructor() {
    }

    static load(filepath) {
        // Get document, or throw exception on error
        try {
            let doc = yaml.load(fs.readFileSync(filepath, 'utf8'));
            console.log(JSON.stringify(doc, null, 4))
            doc = this.transformDataUnique(doc);
            console.log(JSON.stringify(doc, null, 4))
            return doc;
        } catch (e) {
            console.log(e);
        }

    }

    static transformDataUnique(data){
        let schedulesUnique = data.watch.unique;
        let schedulesRecurrent = data.watch.recurrent;

        let replaceValues = (schedules, mappingValues_covering, mappingValues_coating) => {

            return schedules.map(schedule => {

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

                return schedule;
            })
        }

        data.watch.unique = replaceValues(schedulesUnique, ALLOWED_VALUES.covering, ALLOWED_VALUES.coating);
        data.watch.recurrent = replaceValues(schedulesRecurrent, ALLOWED_VALUES.covering, ALLOWED_VALUES.coating);

        return data;
    }

}

module.exports = YamlHandler;
