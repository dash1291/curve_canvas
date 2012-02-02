var state = false;
var canvas = null;
function init(){
  canvas = document.getElementById("canvas");
  document.captureEvents(Event.MOUSEMOVE)
  canvas.onmousemove = mouseMove;
  canvas.onmouseup = mouseUp;
  canvas.onmousedown = mouseDown;
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
  if(state){
    var canvas = document.getElementById("canvas");
    if(canvas.getContext){
      var context = canvas.getContext('2d');
      context.fillRect(x,y,2,2);
    }
  }
}
