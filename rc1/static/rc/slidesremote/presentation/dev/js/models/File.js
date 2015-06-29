define(function(require, exports, module) {

    var File  = Backbone.Model.extend({
        initialize: function(options){
            //this.data = options;
        },
        getFileSizeInM: function(){
            var fs = this.get('fileSize');
            return fs?Math.floor(fs/1000000)+'M':'';
        },
        getTimeAgo: function() {
            var d = new Date(this.get('modifiedDate').split('.')[0]);
            return d.toLocaleString();
        },
        getTitle: function() {
            return this.get('title');
        },
        getTemplateData: function(){
            return {
                title: this.getTitle(),
                iconLink: this.get('iconLink'),
                fileSize: this.get('fileSize'),
                fileSizeInM: this.getFileSizeInM(),
                timeAgo: this.getTimeAgo()
            };
        }
    });

//    File = Backbone.UniqueModel(File, 'Menu', 'localStorage');
    module.exports = File;
});