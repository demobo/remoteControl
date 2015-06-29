define(function(require, exports, module) {
    var Slide1  = Backbone.Model.extend({
        //dataUrl: 'http://www.hdwallpapers.in/walls/abstract_color_background_picture_8016-wide.jpg',
        getDataUrl: function(){
//            var pageid = this.get('id');
//            //https://docs.google.com/feeds/download/presentations/Export?id=1qNlB-0z0i7yz1Mz9mYpPTenlUtfp6rQXZafQeO7EFxw&exportFormat=svg&pageid=g10a04d2f_0_5
//            var link = "https://docs.google.com/feeds/download/presentations/Export?id="+
//            this.get('fileId') + "&exportFormat=svg"+"&pageid="+ pageid;
//            console.log(link)
//            Helper.readSVGLink(link, pageid, function(dataUrl, fileEntry){
//                console.log(dataUrl);
//                this.set("dataUrl", dataUrl);
//                this.set("fileEntry", fileEntry);
//            }.bind(this))
        }
    })
//        prepareModel: function(attributes){
//            if(attributes.exportLinks && window.configs.dev !== undefined){
//                var link = options.exportLinks['application/pdf'];
//                var svgLink = link.slice(0,link.lastIndexOf('pdf'))+'svg&pageid='+options.id;
//                Helper.readSVGLink(svgLink, function(link){this.src = link}.bind(this));
//
//            }else{
//                this.set('src', attributes.dataUrl);
//                this.id = options.id;
//                this.note = options.note;
//                console.log(this.id, this.src ,"???????");
//            }
//        }
//    });
    Slide1 = Backbone.UniqueModel(Slide1, 'Slide1', 'localStorage');
    //Slide.bind('remove')
    module.exports = Slide1;
});