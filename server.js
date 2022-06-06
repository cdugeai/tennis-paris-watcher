const yaml = require('./helpers/yaml-handler')



let doc = yaml.load('watch.yml')
console.log(doc.watch.unique[1]);
