function getCurrentDomain(){
  return document.domain?document.domain:window.location.hostname;
}

function showDemobo(){
  var demoboCover = document.createElement('div');
  demoboCover.setAttribute('id','demoboCover');
  demoboCover.style.zIndex = '9999' ;
  demoboCover.style.textAlign = 'center' ;
  demoboCover.style.position = 'fixed' ;
  demoboCover.style.width = '100%' ;
  demoboCover.style.height = '100%' ;
  demoboCover.style.top = '0';
  demoboCover.style.left = '0';
  demoboCover.style.backgroundColor = 'rgba(0,0,0,0.6)';

  document.body.appendChild(demoboCover);

  demobo.renderQR('demoboCover',1);
  var temp = document.querySelector('#demoboCover > img') ;
  temp.style.position = 'relative';
  temp.style.top = '30%';
}

function hideDemobo(){
  var temp = document.getElementById('demoboCover');
  if (temp) {
    temp.parentNode.removeChild(temp);
  }
}

function toggleDemobo(){
  var a = document.getElementById('demoboCover');
  if (a){
    hideDemobo();
  }else{
    showDemobo();
  }
}
