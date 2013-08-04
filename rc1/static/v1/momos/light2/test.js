var testCases0 = [
		{
			functionName : "syncState",
			data : {
				isPlaying:true,
				curPower:Math.random(),
				oldPower:Math.random()*5,
			}
		}];

var testCases1 = [
		{
			functionName : "loadSongInfo",
			data : {
				image : "http://cont-sv5-3.pandora.com/images/public/amz/7/2/0/1/886976911027_500W_500H.jpg",
				title : "Older",
				artist : "Band Of Horses",
				album : "Infinite Arms - 2012/08/09"
			}
		}];

var testCases2 = [
		{
			functionName : "changeBackgroundColor",
			data : {
				rgb: '#000',
			},
		}];
		
var testCases3 = [
 		{
 			functionName : "changeForegroundColor",
			data : {
				rgb: '#333',
			},
 		}];

var testSuite = [testCases0];
// var testSuite = [testCases0,testCases1,testCases2,testCases3];