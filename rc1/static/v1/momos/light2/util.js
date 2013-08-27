function circle(size, theme, i) {
	return $('<div onclick="javascript:this.parentNode.removeChild(this);changeShape()" class="draggable '
			+ size
			+ '"><svg xmlns="http://www.w3.org/2000/svg" version="1.1"><circle cx="50%" cy="50%" r="47%" stroke="'
			+ theme[0] + '" stroke-width="3" fill="' + theme[1]
			+ '"/></svg></div>');
}
function square(size, theme, i) {
	return $('<div onclick="javascript:this.parentNode.removeChild(this);changeShape()" class="draggable '
			+ size
			+ '"><svg xmlns="http://www.w3.org/2000/svg" version="1.1"><rect width="90%" height="90%" x="3" y="3" stroke="'
			+ theme[0] + '" stroke-width="3" fill="' + theme[1]
			+ '"/></svg></div>');
}
function image(size, theme, i) {
	return $('<div class="draggable '
			+ size
			+ '"><img width="95%" height="95%" style="border:solid 3px '
			+ theme[1]
			+ ';" src="http://www.taylorpictures.net/albums/other/instagram/thumb_'
			+ pad(i + "", 3) + '.jpg"></div>');
}
function text(size, theme, i) {
	var link = [ 'http://www.google.com', 'http://www.facebook.com',
			'tel:4158125971' ];
	var title = [ 'Google', 'Facebook', '(415)812-5971' ];
	return $('<div class="draggable large"><a href="' + link[i % 3] + '">'
			+ title[i % 3] + '</a></div>');
}
function pad(str, max) {
	return str.length < max ? pad("0" + str, max) : str;
}