/*
 * Define a global canvas object
 * everything else should be tied to this object to prevent namespace pollution
*/

function init() {
  window.canvas = new canvas( "canvas", 360, 480 );
}

canvas = function( container, height, width ) {
  this.state = false;
  this.tempPath = [];
  this.height = height;
  this.width = width;
  this.resizing = { 'right': false, 'down': false };
  this.current_pos = { 'x': 0, 'y': 0 };
  this.buffer = [];
  this.lastdrawn = null;
  this.history = [];
  this.historyIndex = -1;
  this.spanLength = 11;

  // Initialize the canvas element object
  this.container = container = document.getElementById( container );
  this.container._model = this;
  context = container.getContext( '2d' );
  context.strokeStyle = "#000000";
  context.lineJoin = "round";
  context.lineWidth = "2";
  this.context = context;
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
  context.beginPath();
  context.moveTo( lastdrawnX, lastdrawnY );
  context.lineTo( x, y );
  context.stroke();
  context.closePath();
};

canvas.prototype.newHistory = function( path ) {
  this.history = this.history.slice( 0, this.historyIndex + 1 );
  this.history.push( path );
  this.historyIndex++;
};

canvas.prototype.undo = function( ) {
  if( this.historyIndex > -1 ) {
    var path = this.history[ this.historyIndex ];
    this.destroyPath( path );
    this.historyIndex--;
    if( this.historyIndex > -1 ) {
      path = this.history[ this.historyIndex ];
      this.drawPath( path, 'green' );
    }
  }
  this.lastdrawn = null;
};

canvas.prototype.redo = function() {
  if( this.historyIndex < this.history.length - 1 ) {
    if( this.historyIndex > -1 ) {
      var path = this.history[ this.historyIndex ];
      //this.destroyPath( path );
    }
    path = this.history[ ++this.historyIndex ];
    this.drawPath( path, 'green' );
  }
  this.lastdrawn = null;
};

canvas.prototype.setSpan = function( spanElement ) {
  span = spanElement.value;
  if( span % 2 == 0 ) {
    span = span - 1;
  }
  this.spanLength = span;
  spanElement.value = span;
};

canvas.prototype.drawEnd = function() {
  this.buffer = []; //Clear the buffer
  clearTimeout( this.interval );
};

canvas.prototype.drawPath = function( path, color ) {
  if( this.lastdrawn == null ) {
    this.lastdrawn = path[0];
  }
  if( typeof color == 'string' ) {
    this.context.strokeStyle = color;
  }
  else {
    this.context.strokeStyle = "#000000";
  }
  for( i in path ) {
    x = path[i].x;
    y = path[i].y;
    this.drawNew( x, y );
    this.lastdrawn = { 'x': x, 'y': y };
  }
};

canvas.prototype.drawBuffer = function() {
  _this = window.canvas;
  _this.drawPath( _this.buffer );
  _this.buffer = [];
  _this.interval = setTimeout( _this.drawBuffer, 20 );
};

canvas.prototype.smoothTempPath = function() {
  //var smoothPath = new TwoPassCorrection( this.tempPath, 3, 3 );
  //console.log('out: ');console.log(smoothPath);
  //console.log('in: ');console.log(this.tempPath);
  //this.destroyTempPath();
  //this.drawPath( smoothPath )
  if( this.tempPath.length > 1 ) {
    this.destroyPath( this.tempPath );
    var smoothPath = new MovingAverageFitter( this.tempPath, this.spanLength ).getOutputPath();
    this.lastdrawn = this.tempPath[0];
    this.drawPath( smoothPath, 'green' );
    this.newHistory( smoothPath );
  }
};

canvas.prototype.destroyPath = function( path ) {
  this.lastdrawn = path[0];
  this.context.lineWidth = 3.5;
  this.drawPath( path, 'white' );
  this.context.lineWidth = 2;
  this.lastdrawn = null;
}

canvas.prototype.updateColor = function( context ) {

}

canvas.prototype.drawStart = function() {
  this.lastdrawn = { 'x': this.current_pos.x - 7, 'y': this.current_pos.y - 7 };
  this.interval = setTimeout( this.drawBuffer, 10 );
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
  _this.lastdrawn = null;
  _this.drawEnd();
  _this.state = _this.resizing.down = _this.resizing.right = false;
  if( _this.state == true ) {
    _this.state = false;
    _this.smoothTempPath();
    _this.tempPath = [];
  }
};

canvas.prototype.mouseUp = function(){
  _this = this._model;
  _this.state = false;
  _this.lastdrawn = null;
  _this.drawEnd();
  _this.smoothTempPath();
  _this.tempPath = [];
};

canvas.prototype.mouseDown = function(){
  _this = this._model;
  _this.state = true;
  _this.drawStart();
  var x = _this.current_pos.x;
  var y = _this.current_pos.y;
  var point = { 'x': x - 7, 'y': y - 7 }; 
  _this.buffer.push( point );
  _this.tempPath.push( point );
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
    var point =  { 'x': x - 7, 'y': y - 7 };
    _this.buffer.push( point );
    _this.tempPath.push( point );
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
