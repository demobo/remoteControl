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
			functionName : "loadPlaylistCollection",
			data : [{"title":"錢櫃KTV Top 20"},{"title":"加州紅KTV Top 20"},{"title":"2013 新歌精選 Top 20"}]
		},
		{
			functionName : "setResultTitle",
			data : "錢櫃KTV Top 20"
		},
		{
			functionName : "loadVideoCollection",
			data : [{"title":"【高清】121110非诚勿扰 陈晓东力挺好友 骆琦遭摇","image":"http://cdn3.rd.io/album/0/b/f/00000000001eafb0/4/square-200.jpg"},{"title":"","image":"http://cdn3.rd.io/album/5/d/4/00000000001da4d5/2/square-200.jpg"},{"title":"Blak And Blu (Deluxe Version) fasasd afew fafafacdsaf faeadsf ","image":"http://cdn3.rd.io/album/0/8/9/00000000001fb980/1/square-200.jpg"},{"title":"Penny Black","image":"http://cdn3.rd.io/album/7/5/b/00000000001eeb57/1/square-200.jpg"},{"title":"III (Deluxe)","image":"http://cdn3.rd.io/album/f/4/8/00000000001fc84f/1/square-200.jpg"},{"title":"We Don't Even Live Here [Deluxe Edition]","image":"http://cdn3.rd.io/album/8/5/b/00000000001eeb58/2/square-200.jpg"},{"title":"good kid, m.A.A.d city","image":"http://cdn3.rd.io/album/e/7/7/00000000001eb77e/5/square-200.jpg"},{"title":"Free Dimensional","image":"http://cdn3.rd.io/album/0/a/b/00000000001efba0/2/square-200.jpg"},{"title":"Apocryphon","image":"http://cdn3.rd.io/album/8/c/0/00000000001f20c8/2/square-200.jpg"},{"title":"Local Business","image":"http://cdn3.rd.io/album/a/d/d/00000000001e2dda/1/square-200.jpg"},{"title":"Banks","image":"http://cdn3.rd.io/album/5/3/f/00000000001dff35/2/square-200.jpg"},{"title":"Ghost","image":"http://cdn3.rd.io/album/4/7/4/00000000001e8474/1/square-200.jpg"},{"title":"House of Gold & Bones Part 1","image":"http://cdn3.rd.io/album/7/2/9/00000000001ef927/1/square-200.jpg"},{"title":"Until Now (Deluxe Version)","image":"http://cdn3.rd.io/album/5/9/9/00000000001e2995/2/square-200.jpg"},{"title":"Book Burner","image":"http://cdn3.rd.io/album/c/0/e/00000000001e7e0c/1/square-200.jpg"},{"title":"Draw the Line (Deluxe)","image":"http://cdn3.rd.io/album/8/8/e/00000000001f6e88/1/square-200.jpg"},{"title":"Lost Songs","image":"http://cdn3.rd.io/album/f/2/2/00000000001e822f/2/square-200.jpg"},{"title":"The Man With The Iron Fists","image":"http://cdn3.rd.io/album/b/c/1/00000000001f21cb/2/square-200.jpg"},{"title":"Les Is More","image":"http://cdn3.rd.io/album/0/d/d/00000000001e7dd0/1/square-200.jpg"},{"title":"The Lateness Of the Hour (Deluxe Edition)","image":"http://cdn3.rd.io/album/9/2/f/00000000001f1f29/2/square-200.jpg"}]
		},
		{
			functionName : "loadNowPlaying",
			data : [{"title":"【高清】121110非诚勿扰 陈晓东力挺好友 骆琦遭摇","image":"http://cdn3.rd.io/album/0/b/f/00000000001eafb0/4/square-200.jpg"},{"title":"","image":"http://cdn3.rd.io/album/5/d/4/00000000001da4d5/2/square-200.jpg"},{"title":"Blak And Blu (Deluxe Version) fasasd afew fafafacdsaf faeadsf ","image":"http://cdn3.rd.io/album/0/8/9/00000000001fb980/1/square-200.jpg"},{"title":"Penny Black","image":"http://cdn3.rd.io/album/7/5/b/00000000001eeb57/1/square-200.jpg"},{"title":"III (Deluxe)","image":"http://cdn3.rd.io/album/f/4/8/00000000001fc84f/1/square-200.jpg"},{"title":"We Don't Even Live Here [Deluxe Edition]","image":"http://cdn3.rd.io/album/8/5/b/00000000001eeb58/2/square-200.jpg"},{"title":"good kid, m.A.A.d city","image":"http://cdn3.rd.io/album/e/7/7/00000000001eb77e/5/square-200.jpg"},{"title":"Free Dimensional","image":"http://cdn3.rd.io/album/0/a/b/00000000001efba0/2/square-200.jpg"},{"title":"Apocryphon","image":"http://cdn3.rd.io/album/8/c/0/00000000001f20c8/2/square-200.jpg"},{"title":"Local Business","image":"http://cdn3.rd.io/album/a/d/d/00000000001e2dda/1/square-200.jpg"},{"title":"Banks","image":"http://cdn3.rd.io/album/5/3/f/00000000001dff35/2/square-200.jpg"},{"title":"Ghost","image":"http://cdn3.rd.io/album/4/7/4/00000000001e8474/1/square-200.jpg"},{"title":"House of Gold & Bones Part 1","image":"http://cdn3.rd.io/album/7/2/9/00000000001ef927/1/square-200.jpg"},{"title":"Until Now (Deluxe Version)","image":"http://cdn3.rd.io/album/5/9/9/00000000001e2995/2/square-200.jpg"},{"title":"Book Burner","image":"http://cdn3.rd.io/album/c/0/e/00000000001e7e0c/1/square-200.jpg"},{"title":"Draw the Line (Deluxe)","image":"http://cdn3.rd.io/album/8/8/e/00000000001f6e88/1/square-200.jpg"},{"title":"Lost Songs","image":"http://cdn3.rd.io/album/f/2/2/00000000001e822f/2/square-200.jpg"},{"title":"The Man With The Iron Fists","image":"http://cdn3.rd.io/album/b/c/1/00000000001f21cb/2/square-200.jpg"},{"title":"Les Is More","image":"http://cdn3.rd.io/album/0/d/d/00000000001e7dd0/1/square-200.jpg"},{"title":"The Lateness Of the Hour (Deluxe Edition)","image":"http://cdn3.rd.io/album/9/2/f/00000000001f1f29/2/square-200.jpg"}]
		},
		{
			functionName : "syncState",
			data : {isPlaying: true, volume: 100, count: 28, index: 3}
		}];
var testSuite = [testCases1,testCases2,testCases3];
