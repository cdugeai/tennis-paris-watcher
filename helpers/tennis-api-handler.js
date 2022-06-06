class TennisApiHandler {

    static coating_all= ["96","2095","94","1324","2016","92"]
    static inOut_default= ["V", "F"]
    static baseUrl= "https://tennis.paris.fr/tennis/jsp/site/Portal.jsp?page=recherche&action=ajax_disponibilite_map"


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
}

module.exports = TennisApiHandler;
