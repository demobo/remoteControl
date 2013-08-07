function rnd(start, end){
    return Math.floor(Math.random() * (end - start) + start);
}

var testCases1 = [
		{
			functionName : "syncState",
			data : {
				isPlaying:true,
				curPower:Math.random()*1.2,
				oldPower:Math.random(),
			}
		}];

var testCases2 = [
		{
			functionName : "loadSongInfo",
			data : {
				image : "http://cont-sv5-3.pandora.com/images/public/amz/7/2/0/1/886976911027_500W_500H.jpg",
				title : "Older",
				artist : "Band Of Horses",
				album : "Infinite Arms - 2012/08/09"
			}
		}];

var testCases3 = [{
	functionName : "syncState",
	data : {
		isPlaying : true,
		curPower : Math.random() * 1.2,
		oldPower : Math.random(),
		color : {
			r : rnd(0, 255),
			g : rnd(0, 255),
			b : rnd(0, 255),
		},
		pattern : 1,
	}
}];

var testCases4 = [{
	functionName : "syncState",
	data : {
		isPlaying : true,
		curPower : Math.random() * 1.2,
		oldPower : Math.random(),
		color : {
			r : rnd(0, 255),
			g : rnd(0, 255),
			b : rnd(0, 255),
		},
		pattern : 0,
	}
}];

var testSuite = [testCases1,testCases2,testCases3,testCases4];
// var testSuite = [testCases1,testCases2];