define(function (require, exports, module) {
    var Engine = require('famous/core/Engine');
    var MainScreen = require('views/MainScreen');
    var Lightbox = require('famous/views/Lightbox');
    var Transform = require('famous/core/Transform');

    var mainContext = Engine.createContext();
    mainContext.setPerspective(600);
    this.mainScreen = new MainScreen();
    this.lightbox = new Lightbox({
        inTransform: Transform.translate(0, window.innerHeight),
        showTransform: Transform.translate(0,0, 1),
        outTransform: Transform.translate(0, window.innerHeight, -1),
        inOpacity: 0,
        showOpacity: 1,
        outOpacity: 1
    });
    mainContext.add(this.lightbox);
   	this.lightbox.show(this.mainScreen);
});

function loadNotes(items) {
	var slidesData = items.map(function(item){
		return {
			fileTitle: item.fileTitle,
			remoteURL: item.imageUrl,
			notes: item.note
		};
	});
	main.setSlides(slidesData);
}

function setCurrentPage(num) {
	main.getCurSlidesView().scrollToPage(num-1);
}
