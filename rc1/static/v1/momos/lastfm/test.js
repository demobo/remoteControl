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
			data : {
				image : "http://cont-sv5-3.pandora.com/images/public/amz/7/2/0/1/886976911027_500W_500H.jpg",
				title : "Older Older Ogyer gy Older Older",
				artist : "Band Of Horses Band Of Horses",
				album : "Infinite Arms - 2012/08/09"
			}
		}, {
			functionName : "loadChannelList",
			data : [ {
				title : "我的私人兆赫"
			}, {
				title : "我的红心兆赫"
			}, {
				title : "旅行~songtaste~ MHz",
				selected : true
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
		},
		{
			functionName : "setCurrentChannel",
			data : 1
		}];
var testSuite = [testCases1,testCases2,testCases3];
