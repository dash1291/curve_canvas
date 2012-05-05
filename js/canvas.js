/*
 * Define a global canvas object
 * everything else should be tied to this object to prevent namespace pollution
*/

function init() {
  window.canvas = new canvas( "canvas", 360, 480 );
}

canvas = function( container, height, width ) {
  this.state = false;
  this.height = height;
  this.width = width;
  this.resizing = { 'right': false, 'down': false };
  this.current_pos = { 'x': 0, 'y': 0 };
  this.buffer = [];
  this.lastdrawn = null;

  // Initialize the canvas element object
  this.container = container = document.getElementById( container );
  this.container._model = this;
  context = this.context = container.getContext( '2d' );
  context.strokeStyle = "#000000";
  context.lineJoin = "round";
  context.lineWidth = "1";
  document.captureEvents( Event.MOUSEMOVE );
  container.onmousemove = this.mouseMove;
  container.onmouseup = this.mouseUp;
  container.onmousedown = this.mouseDown;
  container.onmouseout = this.mouseOut;
  
};

canvas.prototype.drawNew = function( x, y ) {
  lastdrawnX = this.lastdrawn.x;
  lastdrawnY = this.lastdrawn.y;
  context = this.context;
  context.moveTo( lastdrawnX, lastdrawnY );
  context.lineTo( x, y );
  context.closePath();
  context.stroke();
  this.lastdrawn = { 'x': x, 'y': y };
};

canvas.prototype.drawEnd = function() {
  this.buffer = []; //Clear the buffer
};

canvas.prototype.drawStart = function() {
  this.interval = setTimeout( this.drawBuffer, 100 );
};

canvas.prototype.loadImage = function() {

};

canvas.prototype.changeCursor = function( type ) {
   switch( type ) {
    case 'normal':
      this.container.style.cursor = 'crosshair';
      break;
    case 'right-resize':
      this.container.style.cursor = 'e-resize';
      break;
    case 'down-resize':
      this.container.style.cursor = 's-resize';
      break;
    case 'down-right-resize':
      this.container.style.cursor = 'se-resize';
      break;
  }
};

canvas.prototype.mouseOut = function() {
  _this = this._model;
  _this.state = false;
  _this.lastdrawn = null;
  _this.drawEnd();
  _this.state = _this.resizing.down = _this.resizing.right = false;
};

canvas.prototype.mouseUp = function(){
  _this = this._model;
  _this.state = false;
  _this.lastdrawn = null;
  _this.drawEnd();
};

canvas.prototype.mouseDown = function(){
  _this = this._model;
  _this.state = true;
  var resize = _this.isResizing();
  if( resize ) {
    switch( resize ) {
      case 'right':
       _this.resizing.right = true;
       break;
      case 'down':
        _this.resizing.down = true;
        break;
    }
  }
  else {
    _this.resizing.down = _this.resizing.right = false;
  }
};

canvas.prototype.isResizing = function() {
  x = this.current_pos.x;
  y = this.current_pos.y;
  if( x > this.width + 5 && y < this.height ) {
    return 'right';
    if( y > this.height + 5 ) {
      this.changeCursor( 'down-right-resize' );
      return 'down-right';
    }
  }
  else if( y > this.height + 5 && x < this.width ) {
    return 'down';
  }
  else {
    return false;
  }
};

canvas.prototype.mouseMove = function( e ){
  var _this = this._model; // Get reference to the global canvas object that binds this canvas element
  _this.current_pos.x = x = e.pageX;
  _this.current_pos.y = y = e.pageY;
  if( _this.state ) {
    if( _this.lastdrawn ) {
      _this.drawNew( x - 7, y - 7 );
    }
    else {
      _this.lastdrawn = { 'x': x - 7, 'y': y - 7 };
    }
  }
  resize = _this.isResizing();
  if( resize ) {
    switch( resize ) {
      case 'right':
        _this.changeCursor( 'right-resize' );
        if( _this.resizing.right ) {
          _this.width = this.width = x;
        }
        break;
      case 'down':
        _this.changeCursor( 'down-resize' );
        if( _this.resizing.down ) {
          _this.height = this.height = y;
        }
        break;
      case 'down-right':
        _this.changeCursor( 'down-right-resize' );
        break;
    }
  }
  else {
    _this.changeCursor( 'normal' );
  }
};
