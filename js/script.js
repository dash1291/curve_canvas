var state = false;
var canvas = null;
cnvWidth = 480;
cnvHeight = 360;
function init(){
  canvas = document.getElementById("canvas");
  document.captureEvents(Event.MOUSEMOVE)
  canvas.onmousemove = mouseMove;
  canvas.onmouseup = mouseUp;
  canvas.onmousedown = mouseDown;
}
function changeCursor(type) {
   switch(type) {
    case 'normal':
      canvas.style.cursor = 'auto';
      break;
    case 'right-resize':
      canvas.style.cursor = 'e-resize';
      break;
    case 'down-resize':
      canvas.style.cursor = 's-resize';
      break;
    case 'down-right-resize':
      canvas.style.cursor = 'se-resize';
      break;
  }
}
function mouseUp(){
  state = false;
}

function mouseDown(){
  state = true;
}

function mouseMove(e){
  x = e.pageX;
  y = e.pageY;
  /*if(state){
    var canvas = document.getElementById("canvas");
    if(canvas.getContext){
      var context = canvas.getContext('2d');
      context.fillRect(x,y,2,2);
    }
  }*/
  if(x > cnvWidth-3 && x <= cnvWidth && y < cnvHeight) {
    changeCursor('right-resize');
    if(y > cnvHeight-3) {
      changeCursor('down-right-resize');
    }
  }
  else if(y > cnvHeight-3 && y < cnvHeight && x < cnvWidth) {
    changeCursor('down-resize');
  }
  else {
    changeCursor('normal');
  }
 
}
