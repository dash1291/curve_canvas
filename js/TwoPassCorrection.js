/**
 * Implementation for TwoPassCorrection algorithm
 * Accepts path as the array of points, length of patches and length of joints
 * Returns the smoothened path as the array of points
**/

TwoPassCorrection = function( path, patchlength, jointlength  ) {
  this.path = path;
  this.patchlength = patchlength;
  this.jointlength = jointlength;
};

/**
 * Return `path` array of the smoothened curve
**/
TwoPassCorrection.prototype.smooth = function( path ) {
  var n = path.length;
  for( point in path ) {
    x += point.x;
    y += point.y;
  }
  var avgX = x / n;
  var avgY = y / n;
  var avgpoint = { 'x': avgX, 'y': avgX };
  return new Circular( [ path[0], avgpoint, path[n-1] ], n );

};

TwoPassCorrection.prototype.twopass = function() {
  var joints = [];
  var count = this.path.length;
  var N = count / this.patchlength;
  var i = 0;
  while( point[i] ) {
    if( i + N < count ) {
      this.smooth( this.path.slice( i, i + N + 1 ) );
      joints.push( i + N );
    }
    else {
      this.smooth( this.path.slice( i, count + 1 ) );
      joints.push( i );
    }
    i += N;
  }
  
  i = 0;
  var p1 = 0, p2 = 0;
  var l = this.jointlength / 2;
  for( i in joints ) {
    p1 = i - l;
    p2 = i + l;
    this.smooth( this.path.slice( p1, p2 + 1 ) );
  }
};
