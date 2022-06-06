const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class TennisApiHandler {

    static coating_all= ["96","2095","94","1324","2016","92"]
    static inOut_default= ["V", "F"]
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
            .filter(e => e.properties.available)
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
