/**
 * Implementation of MovingAverages for curve fitting
**/

MovingAverageFitter = function( path, span ) {
  this.path = path;
  this.span = span;
}

MovingAverageFitter.prototype.filterX = function() {
  var spanhalf_orig = ( this.span - 1 ) / 2;
  var spanhalf_dyn = spanhalf_orig;
  for( i in this.path ) {
    if( i < spanhalf_orig ) { spanhalf_dyn = i; }
    if( i > ( this.path.length - spanhalf_orig - 1 ) ) {
      spanhalf_dyn = this.path.length - i - 1;
    }
    var x = 0, tmp = 0;
    for( var j=0; j<spanhalf_dyn; j++ ) {
      tmp = this.path[i - j].x + this.path[i + j].x ;
      x += tmp;
    }
    this.path[i].x = x / ( ( spanhalf_dyn * 2 ) + 1 );
    spanhalf_dyn = spanhalf_orig;
  }
};

MovingAverageFitter.prototype.filterY = function() {
  var spanhalf_orig = ( this.span - 1 ) / 2;
  var spanhalf_dyn = spanhalf_orig;
  for( i in this.path ) {
    if( i < spanhalf_orig ) { spanhalf_dyn = i; }
    if( i > ( this.path.length - spanhalf_orig - 1 ) ) {
      spanhalf_dyn = this.path.length - i - 1;
    }
    var y = 0, tmp = 0;
    for( var j=0; j<spanhalf_dyn; j++ ) {
      tmp = this.path[i - j].y + this.path[i + j].y;
      y += tmp;
    }
    this.path[i].y = y / ( ( spanhalf_dyn * 2 ) + 1 );
    spanhalf_dyn = spanhalf_orig;
  }
};

MovingAverageFitter.prototype.getOutputPath = function() {
  return this.path;
};
