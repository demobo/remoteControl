var testCases1 = [
		{
			functionName : "syncState",
			data : {isPlaying: true, volume: 70}
		}];
var testCases2 = [
 		{
 			functionName : "syncState",
 			data : {isPlaying: false, volume: 20}
 		}];

var testCases3 = [
		{
			functionName : "loadSongInfo",
			data : [{
				image : "http://cont-sv5-3.pandora.com/images/public/amz/7/2/0/1/886976911027_500W_500H.jpg",
				title : "Older",
				artist : "Band Of Horses",
				album : "Infinite"
			},{
				image : "http://cont-sv5-3.pandora.com/images/public/amz/7/2/0/1/886976911027_500W_500H.jpg",
				title : "Another Song",
				artist : "Akon",
				album : "Arms"
			}]
		}, {
			functionName : "loadChannelList",
			data : [ {
				title : "station 1"
			}, {
				title : "station 1"
			}, {
				title : "station 1",
			}, {
				title : "station 1"
			}, {
				title : "station 1"
			}, {
				title : "station 1 MHz"
			} ]
		}, {
			functionName : "loadPinBoard",
			data : [ {
				title : "我的私人兆赫"
			}, {
				title : "我的红心兆赫"
			}, {
				title : "旅行~songtaste~ MHz"
			}, {
				title : "奥迪Q3驾驭简洁 MHz"
			}, {
				title : "咖啡 MHz"
			}, {
				title : "张悬城市地图 MHz"
			}, {
				title : "华语 MHz"
			}, {
				title : "古典 MHz"
			} ]
		}];
var testSuite = [testCases1,testCases2,testCases3];

