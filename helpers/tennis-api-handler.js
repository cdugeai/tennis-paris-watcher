const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const ALLOWED_VALUES = require('../schedule_config/allowed_values')

class TennisApiHandler {

    static coating_all= Object.values(ALLOWED_VALUES.coating)
    static inOut_default= Object.values(ALLOWED_VALUES.covering)
    static apiBaseUrl= "https://tennis.paris.fr/tennis/jsp/site/Portal.jsp?page=recherche&action=ajax_disponibilite_map"
    static planningBaseUrl = "https://tennis.paris.fr/tennis/jsp/site/Portal.jsp?page=recherche&view=planning&name_tennis="


    constructor() {
    }

    static buildDataToPost(
        hour_start,
        hour_end,
        date,
        coating= this.coating_all,
        inOut= this.inOut_default
        ){

        return {
            hourRange: `${hour_start}-${hour_end}`,
            when: date,
            selCoating: coating,
            selInOut: inOut
        }

    }

    static async postData(postData){

        // Actual parameters sent to the API
        console.log("USED PARAMETERS: "+JSON.stringify(postData))

        // ## Building the data to post (application/x-www-form-urlencoded format)
        let params = new URLSearchParams();

        // Attributes that contains array
        let arrayAttributes = ['selCoating', 'selInOut'];
        for (let attribute in postData) {
            let dataValue = postData[attribute]

            // If the attribute is an array
            if (arrayAttributes.includes(attribute)) {
                // Add each element of this array in the url
                dataValue.forEach(e=> {
                    params.append(attribute, e);
                })
            } else {
                // Else, simply add the element in the url
                params.append(attribute, dataValue)
            }
        }

        // ## Posting the data
        const response = await fetch(this.apiBaseUrl, {
            method: 'POST',
            body: params.toString(),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        const data = await response.json();
        return data;
    }

    // Is this court covered
    static courtIsCovered(court){
        return court._airCvt
    }

    // Is this court lighted
    static courtIsLighted(court){
        return court._airEcl
    }

    // Remove some features if a feature with the same name already exists
    static _filterUnique(apiJson){

        let features = apiJson.features;
        //console.log(features.length)
        function onlyUnique(value, index, self) {
            let name = value.properties.general._nomSrtm;

            return self.map(e=>e.properties.general._nomSrtm).indexOf(name) === index;
        }
        features = features.filter(onlyUnique);
        //console.log(features.length)
        apiJson.features = features;
        return apiJson;
    }


    // Get available courts
    static getAvailableCourts(apiJson){
        let apiJsonAvailable = Object.assign({}, apiJson);
        apiJsonAvailable.features = apiJson.features
            .filter(e => e.properties.available)
        return apiJsonAvailable
    }

    // Select some properties, and add url to detailed planning
    static prettifyCourts(apiJson){
        return apiJson.features
            .map(e2 => e2.properties.general)
            .map(e3 => {
                return {
                    name: e3._nomSrtm,
                    url: this.planningBaseUrl+e3._nomSrtm,
                    address: e3._adresse + " " + e3._codePostal
                }
            })
    }
}

module.exports = TennisApiHandler;
