define(function (require, exports, module) {
    // ----------------------------
    //   parse function
    // ----------------------------

    function parse(fileEntry, fileTitle, callback){
        var reader = new FileReader();
        console.log('parse')

        reader.onloadend = function(e){
            var htmlSource = e.target.result;
            var result = [];
            var slidesData = $('<demobo>'+htmlSource+'</demobo>').find('.slide');
            _.each(slidesData, function(data){
                var notes = $(data).find('>.slide-notes').text();
                if(! notes) notes = 'notes';
                var url = $(data).find('>.slide-content').css('background-image');
                url = url.replace("url(", "");
                url = url.replace("&format=png&showText=0)", "&format=svg&showText=1");
                //var pageId = dataUrl.match(/pageid=\w*&/)[0].substring(7).replace('&',"");
                result.push({notes: notes, remoteURL: url, fileEntry: fileEntry, fileTitle: fileTitle});
            });
            if(callback) callback(result);
        };
        fileEntry.file(function(file){
            reader.readAsText(file);
        }, function(e){
            console.log("Err when converting fileEntry");
        });
    }
    // ----------------------------
    //   Helper
    // ----------------------------

    var Helper = {
        // -------------- get localURL function
        getLocalUrl: function(url, id, callback){
            if(callback) setTimeout(function(){
                callback(url);
            }, 10);
        },
        // ----------------------------
        //   read link function
        // ----------------------------

        readEmbedLink: function (embedLink, fileTitle, callback) {
            if (fileTitle === "What is de Mobo?") {
                $.getJSON("./assets/slidesData2.json", function (slides) {
                    console.log(slides.slides);
                    callback(slides.slides);
                });
            } else {
                $.getJSON("./assets/slidesData.json", function (slides) {
                    console.log(slides.slides);
                    callback(slides.slides);
                });
            }
        }
    };

    module.exports = Helper;
});