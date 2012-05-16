/**
 * Implementation for TwoPassCorrection algorithm
 * Accepts path as the array of points, length of patches and length of joints
 * Returns the smoothened path as the array of points
**/

TwoPassCorrection = function( path, patchlength, jointlength  ) {
  this.path = path;
  this.patchlength = patchlength;
  this.jointlength = jointlength;
  this.twopass();
};

/**
 * Return `path` array of the smoothened curve
**/
TwoPassCorrection.prototype.smooth = function( path ) {
  var n = path.length;
  var newpath = path;
  for( point in path ) {
    x += path[point].x;
    y += path[point].y;
  }
  var avgX = x / n;
  var avgY = y / n;
  var avgpoint = { 'x': avgX, 'y': avgY };
  console.log(path);
  var circular = new Circular( [ path[0], avgpoint, path[n-1] ], n );
  for( point in path ) {
    x = path[point].x;
    newpath[point].x = x;
    newpath[point].y = circular.Y(x, circular.centre, circular.radius );
  }
  return path;
};

TwoPassCorrection.prototype.twopass = function() {
  var joints = [];
  var output = [];
  var count = this.path.length;
  var i = 0;
  while( this.path[i] ) {
    if( i + this.patchlength < count ) {
      output = output.concat( this.smooth( this.path.slice( i, i + this.patchlength ) ) );
      joints = joints.concat( [i + this.patchlength] );
    }
    else {
      output = output.concat( this.smooth( this.path.slice( i, count ) ) );
    }
    i += this.patchlength;
  }
  i = 0;
  /*var p1 = 0, p2 = 0;
  var l = Math.round( this.jointlength / 2 );
  for( i in joints ) {
    p1 = joints[i] - l;
    if( joints[i] + l < count ) {
      p2 = joints[i] + l;
    }
    else {
      p2 = count;
    }
    var tmp = this.smooth( output.slice( p1, p2 ) );
    output = this.reconstruct( output, tmp, p1, p2 );
  }*/
  return output;
};

TwoPassCorrection.prototype.reconstruct = function( inputPath, newPath, offset, end ) {
  for( var i=offset; i<end; i++ ) {
    inputPath[i] = newPath[i];
  }
  return inputPath;
};
