/**
 * Implementation for TwoPassCorrection algorithm
**/

TwoPassCorrection = function( path ) {
  
};

/**
 * Return `path` array of the smoothened curve
**/
TwoPassCorrection.prototype.smooth = function( path ) {
  n = path.length;
  for( point in path ) {
    x += point.x;
    y += point.y;
  }
  avgX = x / n;
  avgY = y / n;
  
  

};

TwoPassCorrection.prototype.twopass = function() {

};

