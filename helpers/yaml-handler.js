const yaml = require('js-yaml');
const fs   = require('fs');


class YamlHandler {
    constructor() {
    }

    static load(filepath) {
        // Get document, or throw exception on error
        try {
            const doc = yaml.load(fs.readFileSync(filepath, 'utf8'));
            return doc;
        } catch (e) {
            console.log(e);
        }

    }

}

module.exports = YamlHandler;
