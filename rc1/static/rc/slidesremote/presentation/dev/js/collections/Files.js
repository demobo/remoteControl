define(function(require, exports, module) {
    var File = require('models/File');
    var setting = require('configs/Setting');

    var Files = Backbone.Collection.extend({
        model: File,
        // url:  function(){
            // return './assets/data.json';
        // },
        parse: function(response, options){
            var result = [];
            _.each(response.items, function(fileData){
                if(fileData.mimeType === "application/vnd.google-apps.presentation"){
                    result.push(fileData);
                }
            });
            return result;
        }
    });
    module.exports = Files;
});