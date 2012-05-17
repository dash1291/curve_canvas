/**
 * Implementation of MovingAverages for curve fitting
**/

MovingAverageFitter = function( path, span ) {
  this.path = path;
  this.output = [];
  this.span = span;
  this.filterX();
}

MovingAverageFitter.prototype.filterX = function() {
  var spanhalf_orig = ( this.span - 1 ) / 2;
  var xS = 0, yS = 0;
  var spanhalf_dyn = spanhalf_orig;
  for( i in this.path ) {
    if( i < spanhalf_orig ) { spanhalf_dyn = i; }
    if( i > ( this.path.length - spanhalf_orig -1  ) ) {
      spanhalf_dyn = this.path.length - i - 1;
    }
    var x = 0,y = 0, j = 0, tmpX = 0, tmpY = 0;
    for( j=1; j<=spanhalf_dyn; j++ ) {
      p1 = i-j;
      p2 = Number(i)+j;
      tmpX = this.path[p1].x + this.path[p2].x;
      tmpY = this.path[p1].y + this.path[p2].y;
      x += tmpX;
      y += tmpY;
    }
    x += this.path[i].x;
    y += this.path[i].y;
    xS = x / ( ( spanhalf_dyn * 2 ) + 1 );
    yS = y / ( ( spanhalf_dyn * 2 ) + 1 );
    this.output.push( { 'x': xS, 'y': yS } );
    spanhalf_dyn = spanhalf_orig;
  }
};

MovingAverageFitter.prototype.getOutputPath = function() {
  return this.output;
};
