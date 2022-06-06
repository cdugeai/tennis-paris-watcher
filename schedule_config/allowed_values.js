const ALLOWED_VALUES = {
    covering: {
        'covered': 'V',
        'not-covered': 'F'
    },
    coating: {
        'Gazon synthétique': 96,
        'Résine':2095,
        'Terre battue': 94,
        'Béton poreux': 1324,
        'Bitume': 2016,
        'Synthétique': 92
    },
    day: {
        "sunday": 0,
        "monday": 1,
        "tuesday": 2,
        "wednesday": 3,
        "thursday": 4,
        "friday": 5,
        "saturday": 6,
    }
}

module.exports = ALLOWED_VALUES;
