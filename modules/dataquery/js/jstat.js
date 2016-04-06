/**
 * jStat - JavaScript Statistical Library
 * Copyright (c) 2011
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php */
this.j$ = this.jStat = (function( Math, undefined ) {

	// for quick reference
var slice = Array.prototype.slice,
	toString = Object.prototype.toString,

	// calculate correction for IEEE error
	calcRdx = function( n, m ) {
		var val = n > m ? n : m;
		return Math.pow( 10, 17 - ~~( Math.log((( val > 0 ) ? val : -val )) * Math.LOG10E ));
	},

	// test if array
	isArray = Array.isArray || function( arg ) {
		return toString.call( arg ) === '[object Array]';
	},

	// test if function
	isFunction = function( arg ) {
		return toString.call( arg ) === '[object Function]';
	},

	// test if number
	isNumber = function( arg ) {
		return toString.call( arg ) === '[object Number]' && !isNaN( arg );
	};

// global function
function jStat() {
	return new jStat.fn.init( arguments );
}

// extend jStat prototype
jStat.fn = jStat.prototype = {
	constructor : jStat,
	init : function( args ) {
		var i = 0;
		// if first argument is an array, must be vector or matrix
		if ( isArray( args[0] )) {
			// check if matrix
			if ( isArray( args[0][0] )) {
				// itterating over each is faster than this.push.apply( this, args[0] );
				for ( ; i < args[0].length; i++ ) {
					this[i] = args[0][i];
				}
				this.length = args[0].length;
			// so must be vector
			} else {
				this[0] = args[0];
				this.length = 1;
			}
		// if first argument is number, assume creation of sequence
		} else if ( isNumber( args[0] )) {
			this[0] = jStat.seq.apply( null, args );
			this.length = 1;
		// unexpected argument value, return empty jStat object
		} else {
			this[0] = [];
			this.length = 1;
		}
		return this;
	},

	// default length
	length : 0,

	// return clean array
	toArray : function() {
		return ( this.length > 1 ) ?
			slice.call( this )
		: slice.call( this )[0];
	},

	// only to be used internally
	push : [].push,
	sort : [].sort,
	splice : [].splice
};

// for later instantiation
jStat.fn.init.prototype = jStat.fn;

// utility functions
jStat.utils = {
	calcRdx : calcRdx,
	isArray : isArray,
	isFunction : isFunction,
	isNumber : isNumber
};

// create method for easy extension
jStat.extend = function( obj ) {
	var args = slice.call( arguments ),
		i = 1, j;
	if ( args.length === 1 ) {
		for ( j in obj ) {
			jStat[j] = obj[j];
		}
		return this;
	}
	for ( ; i < args.length; i++ ) {
		for ( j in args[i] ) obj[j] = args[i][j];
	}
	return obj;
};

// static methods
jStat.extend({

	// Returns the number of rows in the matrix
	rows : function( arr ) {
		return arr.length || 1;
	},

	// Returns the number of columns in the matrix
	cols : function( arr ) {
		return arr[0].length || 1;
	},

	// Returns the dimensions of the object { rows: i, cols: j }
	dimensions : function( arr ) {
		return {
			rows : jStat.rows( arr ),
			cols : jStat.cols( arr )
		};
	},

	// Returns a specified row as a vector
	// stupid simple, but here to complete the set of methods
	row : function( arr, index ) {
		return arr[ index ];
	},

	// Returns the specified column as a vector
	col : function( arr, index ) {
		var column = new Array( arr.length ),
			i = 0;
		for ( ; i < arr.length; i++ ) {
			column[i] = [ arr[i][index] ];
		}
		return column;
	},

	// Returns the diagonal of the matrix
	diag : function( arr ) {
		var row = 0,
			nrow = jStat.rows( arr ),
			res = new Array( nrow );
		for ( ; row < nrow; row++ ) {
			res[row] = [ arr[row][row] ];
		}
		return res;
	},

	// Returns the anti-diagonal of the matrix
	antidiag : function( arr ) {
		var nrow = jStat.rows( arr ) - 1,
			res = new Array( nrow ),
			i = 0;
		for ( ; nrow >= 0; nrow--, i++ ) {
			res[i] = [ arr[i][nrow] ];
		}
		return res;
	},

	// transpose a matrix or array
	transpose : function( arr ) {
		var obj = [],
			i = 0,
			rows, cols, j;
		// make sure arr is in matrix format
		if ( !isArray( arr[0] )) arr = [ arr ];
		rows = arr.length;
		cols = arr[0].length;
		for ( ; i < cols; i++ ) {
			obj.push( new Array( rows ));
			for ( j = 0; j < rows; j++ ) {
				obj[i][j] = arr[j][i];
			}
		}
		// if obj is vector, return only single array
		return ( obj.length === 1 ) ? obj[0] : obj;
	},

	// map a function to an array or array of arrays
	// toAlter is an internal variable
	map : function( arr, func, toAlter ) {
		var row = 0,
			nrow, ncol, res, col;
		if ( !isArray( arr[0] )) arr = [ arr ];
		nrow = arr.length;
		ncol = arr[0].length;
		res = toAlter ? arr : new Array( nrow );
		for ( ; row < nrow; row++ ) {
			// if the row doesn't exist, create it
			if ( !res[row] ) res[row] = new Array( ncol );
			for ( col = 0; col < ncol; col++ )
				res[row][col] = func( arr[row][col], row, col );
		}
		return ( res.length === 1 ) ? res[0] : res;
	},

	// destructively alter an array
	alter : function( arr, func ) {
		return jStat.map( arr, func, true );
	},

	// generate a rows x cols matrix according to the supplied function
	create : function ( rows, cols, func ) {
		var res = new Array( rows ), i, j;
		if ( isFunction( cols )) {
			func = cols;
			cols = rows;
		}
		for ( i = 0; i < rows; i++ ) {
			res[i] = new Array( cols );
			for ( j = 0; j < cols; j++ ) {
				res[i][j] = func( i, j );
			}
		}
		return res;
	},

	// generate a rows x cols matrix of zeros
	zeros : function( rows, cols ) {
		if ( !isNumber( cols )) cols = rows;
		return jStat.create( rows, cols, function() { return 0; });
	},

	// generate a rows x cols matrix of ones
	ones : function( rows, cols ) {
		if ( !isNumber( cols )) cols = rows;
		return jStat.create( rows, cols, function() { return 1; });
	},

	// generate a rows x cols matrix of uniformly random numbers
	rand : function( rows, cols ) {
		if ( !isNumber( cols )) cols = rows;
		return jStat.create( rows, cols, function() { return Math.random(); });
	},

	// generate an identity matrix of size row x cols
	identity : function( rows, cols ) {
		if ( !isNumber( cols )) cols = rows;
		return jStat.create( rows, cols, function( i, j ) { return ( i === j ) ? 1 : 0; });
	},

	// Tests whether a matrix is symmetric
	symmetric : function( arr ) {
		var issymmetric = true,
			row = 0,
			size = arr.length, col;
		if ( arr.length !== arr[0].length ) return false;
		for ( ; row < size; row++ ) {
			for ( col = 0; col < size; col++ ) {
				if ( arr[col][row] !== arr[row][col] ) return false;
			}
		}
		return true;
	},

	// set all values to zero
	clear : function( arr ) {
		return jStat.alter( arr, function() { return 0; });
	},

	// generate sequence
	seq : function( min, max, length, func ) {
		if ( !isFunction( func )) func = false;
		var arr = [],
			hival = calcRdx( min, max ),
			step = ( max * hival - min * hival ) / (( length - 1 ) * hival ),
			current = min,
			cnt = 0;
		// current is assigned using a technique to compensate for IEEE error
		for ( ; current <= max; cnt++, current = ( min * hival + step * hival * cnt ) / hival )
			arr.push(( func ? func( current, cnt ) : current ));
		return arr;
	}
});

// extend jStat.fn with methods that have no argument
(function( funcs ) {
	for ( var i = 0; i < funcs.length; i++ ) (function( passfunc ) {
		jStat.fn[ passfunc ] = function( func ) {
			var tmpthis = this,
				results;
			// check for callback
			if ( func ) {
				setTimeout( function() {
					func.call( tmpthis, jStat.fn[ passfunc ].call( tmpthis ));
				}, 15 );
				return this;
			}
			results = jStat[ passfunc ]( this );
			return isArray( results ) ? jStat( results ) : results;
		};
	})( funcs[i] );
})( 'transpose clear norm symmetric rows cols dimensions diag antidiag'.split( ' ' ));

// extend jStat.fn with simple shortcut methods
(function( funcs ) {
	for ( var i = 0; i < funcs.length; i++ ) (function( passfunc ) {
		jStat.fn[ passfunc ] = function() {
			return jStat( jStat[ passfunc ].apply( null, arguments ));
		};
	})( funcs[i] );
})( 'create zeros ones rand identity'.split( ' ' ));

// extend jStat.fn
jStat.extend( jStat.fn, {

	// Returns a specified row as a vector
	row : function( index ) {
		return jStat( jStat.row( this, index ));
	},

	// Returns the specified column as a vector
	col : function( index ) {
		return jStat( jStat.col( this, index ));
	},

	// map a function to a matrix or vector
	map : function( func, toAlter ) {
		return jStat( jStat.map( this, func, toAlter ));
	},

	// destructively alter an array
	alter : function( func ) {
		jStat.alter( this, func );
		return this;
	}
});

// exposing jStat
return jStat;

})( Math );
(function( jStat, Math ) {

// for quick reference
var calcRdx = jStat.utils.calcRdx,
	isFunction = jStat.utils.isFunction,

	// ascending functions for sort
	ascNum = function( a, b ) { return a - b; };

jStat.extend({

	// sum of an array
	sum : function( arr ) {
		var sum = 0,
			i = arr.length,
			tmp;
		while ( --i >= 0 ) {
			// TODO: find better way to perform this correction
			tmp = calcRdx( sum, arr[i] );
			sum = (( sum * tmp ) + ( arr[i] * tmp )) / tmp;
		}
		return sum;
	},

	// sum squared
	sumsqrd : function( arr ) {
		var sum = 0,
			i = arr.length;
		while ( --i >= 0 ) sum += arr[i] * arr[i];
		return sum;
	},

	// sum of squares for error (SSE)
	sumsqerr : function( arr ) {
		var mean = jStat.mean( arr ),
			sum = 0,
			i = arr.length,
			tmp;
		while ( --i >= 0 ) {
			tmp = arr[i] - mean;
			sum += tmp * tmp;
		}
		return sum;
	},

	// product of an array
	product : function( arr ) {
		var prod = 1,
			i = arr.length;
		while ( --i >= 0 ) prod *= arr[i];
		return prod;
	},

	// minimum value of an array
	min : function( arr ) {
		var low = arr[0],
			i = 0;
		while ( ++i < arr.length )
			if ( arr[i] < low ) low = arr[i];
		return low;
	},

	// maximum value of an array
	max : function( arr ) {
		var high = arr[0],
			i = 0;
		while ( ++i < arr.length )
			if ( arr[i] > high ) high = arr[i];
		return high;
	},

	// mean value of an array
	mean : function( arr ) {
		return jStat.sum( arr ) / arr.length;
	},

	// mean squared error
	meansqerr : function( arr ) {
		return jStat.sumsqerr( arr ) / arr.length;
	},

	// geometric mean of an array
	geomean : function( arr ) {
		return Math.pow( jStat.product( arr ), 1 / arr.length );
	},

	// median of an array
	median : function( arr ) {
		var arrlen = arr.length,
			_arr = arr.slice().sort( ascNum );
		// check if array is even or odd, then return the appropriate
		return !( arrlen & 1 )
			? ( _arr[( arrlen / 2 ) - 1 ] + _arr[( arrlen / 2 )]) / 2
		: _arr[( arrlen / 2 ) | 0 ];
	},

	// cumulative sum of an array
	cumsum : function( arr ) {
		var len = arr.length,
			sums = new Array( len ),
			i = 1;
		sums[0] = arr[0];
		for ( ; i < len; i++ ) {
			sums[i] = sums[i - 1] + arr[i];
		}
		return sums;
	},

	// successive differences of a sequence
	diff : function( arr ) {
		var diffs = [],
			arrLen = arr.length,
			i = 1;
		for ( i = 1; i < arrLen; i++ ) {
			diffs.push( arr[i] - arr[i-1]);
		}
		return diffs;
	},

	// mode of an array
	// if there are multiple modes of an array, just returns false
	// is this the appropriate way of handling it?
	mode : function( arr ) {
		var arrLen = arr.length,
			_arr = arr.slice().sort( ascNum ),
			count = 1,
			maxCount = 0,
			numMaxCount = 0,
			i = 0,
			maxNum;
		for ( ; i < arrLen; i++ ) {
			if ( _arr[ i ] === _arr[ i + 1 ] ) {
				count++;
			} else {
				if ( count > maxCount ) {
					maxNum = _arr[i];
					maxCount = count;
					count = 1;
					numMaxCount = 0;
				} else {
					// are there multiple max counts
					if ( count === maxCount ) {
						numMaxCount++;
					// count is less than max count, so reset values
					} else {
						count = 1;
					}
				}
			}
		}
		return ( numMaxCount === 0 ) ? maxNum : false;
	},

	// range of an array
	range : function( arr ) {
		var _arr = arr.slice().sort( ascNum );
		return _arr[ _arr.length - 1 ] - _arr[0];
	},

	// variance of an array
	// flag indicates population vs sample
	variance : function( arr, flag ) {
		return jStat.sumsqerr( arr ) / ( arr.length - ( flag ? 1 : 0 ));
	},

	// standard deviation of an array
	// flag indicates population vs sample
	stdev : function( arr, flag ) {
		return Math.sqrt( jStat.variance( arr, flag ));
	},

	// mean deviation (mean absolute deviation) of an array
	meandev : function( arr ) {
		var devSum = 0,
			mean = jStat.mean( arr ),
			i = arr.length - 1;
		for ( ; i >= 0; i-- ) {
			devSum += Math.abs( arr[i] - mean );
		}
		return devSum / arr.length;
	},

	// median deviation (median absolute deviation) of an array
	meddev : function( arr ) {
		var devSum = 0,
			median = jStat.median( arr ),
			i = arr.length - 1;
		for ( ; i >= 0; i-- ) {
			devSum += Math.abs( arr[i] - median );
		}
		return devSum / arr.length;
	},

	// coefficient of variation
	coeffvar : function( arr ) {
		return jStat.stdev( arr ) / jStat.mean( arr );
	},

	// quartiles of an array
	quartiles : function( arr ) {
		var arrlen = arr.length,
			_arr = arr.slice().sort( ascNum );
		return [
			_arr[ Math.round(( arrlen ) / 4 ) - 1 ],
			_arr[ Math.round(( arrlen ) / 2 ) - 1 ],
			_arr[ Math.round(( arrlen ) * 3 / 4 ) - 1 ]
		];
	},

	// covariance of two arrays
	covariance : function( arr1, arr2 ) {
		var u = jStat.mean( arr1 ),
			v = jStat.mean( arr2 ),
			sq_dev = [],
			arr1Len = arr1.length,
			i = 0;
		for ( ; i < arr1Len; i++ ) {
			sq_dev[i] = ( arr1[i] - u ) * ( arr2[i] - v );
		}
		return jStat.sum( sq_dev ) / arr1Len;
	},

	// population correlation coefficient
	corrcoeff : function( arr1, arr2 ) {
		return jStat.covariance( arr1, arr2 ) / jStat.stdev( arr1, 1 ) / jStat.stdev( arr2, 1 );
	}
});

// extend jStat.fn with methods which don't require arguments and work on columns
(function( funcs ) {
	for ( var i = 0; i < funcs.length; i++ ) (function( passfunc ) {
		// if a matrix is passed, automatically assume operation should be done on the columns
		jStat.fn[ passfunc ] = function( fullbool, func ) {
			var arr = [],
				i = 0,
				tmpthis = this;
			// assignment reassignation depending on how parameters were passed in
			if ( isFunction( fullbool )) {
				func = fullbool;
				fullbool = false;
			}
			// check if a callback was passed with the function
			if ( func ) {
				setTimeout( function() {
					func.call( tmpthis, jStat.fn[ passfunc ].call( tmpthis, fullbool ));
				}, 15 );
				return this;
			}
			// check if matrix and run calculations
			if ( this.length > 1 ) {
				tmpthis = fullbool === true ? this : this.transpose();
				for ( ; i < tmpthis.length; i++ )
					arr[i] = jStat[ passfunc ]( tmpthis[i] );
				return fullbool === true ? jStat[ passfunc ]( arr ) : arr;
			}
			return jStat[ passfunc ]( this[0] );
		};
	})( funcs[i] );
})( 'sum sumsqrd sumsqerr product min max mean meansqerr geomean median cumsum diff mode range variance stdev meandev meddev coeffvar quartiles'.split( ' ' ));

}( this.jStat, Math ));
// Special functions //
(function( jStat, Math ) {

// Evaluates the continued fraction for incomplete beta function by modified Lentz's method.
function betacf( x, a, b ) {
	var fpmin = 1e-30,
		m = 1,
		m2, aa, c, d, del, h, qab, qam, qap;
	// These q's will be used in factors that occur in the coefficients
	qab = a + b;
	qap = a + 1;
	qam = a - 1;
	c = 1;
	d = 1 - qab * x / qap;
	if( Math.abs( d ) < fpmin ) d = fpmin;
	d = 1 / d;
	h = d;
	for ( ; m <= 100; m++ ) {
		m2 = 2 * m;
		aa = m * ( b - m ) * x / ( ( qam + m2 ) * ( a + m2 ) );
		// One step (the even one) of the recurrence
		d = 1 + aa * d;
		if( Math.abs( d ) < fpmin ) d = fpmin;
		c = 1 + aa / c;
		if( Math.abs( c ) < fpmin ) c = fpmin;
		d = 1 / d;
		h *= d * c;
		aa = -( a + m ) * ( qab + m ) * x / ( ( a + m2 ) * ( qap + m2 ) );
		// Next step of the recurrence (the odd one)
		d = 1 + aa * d;
		if( Math.abs( d ) < fpmin ) d = fpmin;
		c = 1 + aa / c;
		if( Math.abs( c ) < fpmin ) c = fpmin;
		d = 1 / d;
		del = d * c;
		h *= del;
		if( Math.abs( del - 1.0 ) < 3e-7 ) break;
	}
	return h;
}

// extending static jStat methods
jStat.extend({

	// Log-gamma function
	gammaln : function( x ) {
		var j = 0,
			cof = [
				76.18009172947146, -86.50532032941677, 24.01409824083091,
				-1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5
			],
			ser = 1.000000000190015,
			xx, y, tmp;
		tmp = ( y = xx = x ) + 5.5;
		tmp -= ( xx + 0.5 ) * Math.log( tmp );
		for ( ; j < 6; j++ ) ser += cof[j] / ++y;
		return Math.log( 2.5066282746310005 * ser / xx) - tmp;
	},

	// gamma of x
	gammafn : function( x ) {
		var p = [
				-1.716185138865495, 24.76565080557592, -379.80425647094563,
				629.3311553128184, 866.9662027904133, -31451.272968848367,
				-36144.413418691176, 66456.14382024054
			],
			q = [
				-30.8402300119739, 315.35062697960416, -1015.1563674902192,
				-3107.771671572311, 22538.118420980151, 4755.8462775278811,
				-134659.9598649693, -115132.2596755535
			],
			fact = false,
			n = 0,
			xden = 0,
			xnum = 0,
			y = x,
			i, z, yi, res, sum, ysq;
		if( y <= 0 ) {
			res = y % 1 + 3.6e-16;
			if ( res ) {
				fact = (!( y & 1 ) ? 1 : -1 ) * Math.PI / Math.sin( Math.PI * res );
				y = 1 - y;
			} else {
				return Infinity;
			}
		}
		yi = y;
		if ( y < 1 ) {
			z = y++;
		} else {
			z = ( y -= n = ( y | 0 ) - 1 ) - 1;
		}
		for ( i = 0; i < 8; ++i ) {
			xnum = ( xnum + p[i] ) * z;
			xden = xden * z + q[i];
		}
		res = xnum / xden + 1;
		if ( yi < y ) {
			res /= yi;
		} else if ( yi > y ) {
			for ( i = 0; i < n; ++i ) {
				res *= y;
				y++;
			}
		}
		if ( fact ) {
			res = fact / res;
		}
		return res;
	},

	// lower incomplete gamma function P(a,x)
	gammap : function( a, x ) {
		var aln = jStat.gammaln( a ),
			ap = a,
			sum = 1 / a,
			del = sum,
			b = x + 1 - a,
			c = 1 / 1.0e-30,
			d = 1 / b,
			h = d,
			i = 1,
			// calculate maximum number of itterations required for a
			ITMAX = -~( Math.log(( a >= 1 ) ? a : 1 / a ) * 8.5 + a * 0.4 + 17 ),
			an, endval;
		if ( x < 0 || a <= 0 ) {
			return NaN;
		} else if ( x < a + 1 ) {
			for ( ; i <= ITMAX; i++ ) {
				sum += del *= x / ++ap;
			}
			return sum * Math.exp( -x + a * Math.log( x ) - ( aln ));
		}
		for ( ; i <= ITMAX; i++ ) {
			an = -i * ( i - a );
			b += 2;
			d = an * d + b;
			c = b + an / c;
			d = 1 / d;
			h *= d * c;
		}
		return 1 - h * Math.exp( -x + a * Math.log( x ) - ( aln ));
	},

	// natural log factorial of n
	factorialln : function( n ) {
		return n < 0 ? NaN : jStat.gammaln( n + 1 );
	},

	// factorial of n
	factorial : function( n ) {
		return n < 0 ? NaN : jStat.gammafn( n + 1 );
	},

	// combinations of n, m
	combination : function( n, m ) {
		// make sure n or m don't exceed the upper limit of usable values
		return ( n > 170 || m > 170 ) ?
			Math.exp( jStat.combinationln( n, m )) :
		( jStat.factorial( n ) / jStat.factorial( m )) / jStat.factorial( n - m );
	},
	
	combinationln : function( n, m ){
		return  jStat.factorialln( n ) - jStat.factorialln( m ) - jStat.factorialln( n - m );
	},

	// permutations of n, m
	permutation : function( n, m ) {
		return jStat.factorial( n ) / jStat.factorial( n - m );
	},

	// beta function
	betafn : function( x, y ) {
		// ensure arguments are positive
		if ( x <= 0 || y <= 0 ) return undefined;
		// make sure x + y doesn't exceed the upper limit of usable values
		return ( x + y > 170 ) ?
			Math.exp( jStat.betaln( x, y )) :
		jStat.gammafn( x ) * jStat.gammafn( y ) / jStat.gammafn( x + y );
	},
	
	// natural logarithm of beta function
	betaln : function( x, y ) {
		return jStat.gammaln( x ) + jStat.gammaln( y ) - jStat.gammaln( x + y );
	},

	// Returns the inverse incomplte gamma function
	gammapinv : function( p, a ) {
		var j = 0,
			a1 = a - 1,
			EPS = 1e-8,
			gln = jStat.gammaln( a ),
			x, err, t, u, pp, lna1, afac;
		if( p >= 1 ) return Math.max( 100, a + 100 * Math.sqrt( a ) );
		if( p <= 0 ) return 0;
		if( a > 1 ) {
			lna1 = Math.log( a1 );
			afac = Math.exp( a1 * ( lna1 - 1 ) - gln );
			pp = ( p < 0.5 ) ? p : 1 - p;
			t = Math.sqrt( -2 * Math.log( pp ));
			x = ( 2.30753 + t * 0.27061 ) / ( 1 + t * ( 0.99229 + t * 0.04481 )) - t;
			if( p < 0.5 ) x = -x;
			x = Math.max( 1e-3, a * Math.pow( 1 - 1 / ( 9 * a ) - x / ( 3 * Math.sqrt( a )), 3 ));
		} else {
			t = 1 - a * ( 0.253 + a * 0.12 );
			if( p < t ) x = Math.pow( p / t, 1 / a);
			else x = 1 - Math.log( 1 - ( p - t ) / ( 1 - t ));
		}
		for( ; j < 12; j++ ) {
			if( x <= 0 ) return 0;
			err = jStat.gammap( a, x ) - p;
			if( a > 1 ) t = afac * Math.exp( -( x - a1 ) + a1 * ( Math.log( x ) - lna1 ));
			else t = Math.exp( -x + a1 * Math.log( x ) - gln );
			u = err / t;
			x -= ( t = u / ( 1 - 0.5 * Math.min( 1, u * ( ( a - 1 ) / x - 1 ))));
			if( x <= 0 ) x = 0.5 * ( x + t );
			if( Math.abs( t ) < EPS * x ) break;
		}
		return x;
	},

	// Returns the error function erf(x)
	erf : function( x ) {
		var cof = [
				-1.3026537197817094, 6.4196979235649026e-1, 1.9476473204185836e-2,
				-9.561514786808631e-3, -9.46595344482036e-4, 3.66839497852761e-4,
				4.2523324806907e-5, -2.0278578112534e-5, -1.624290004647e-6,
				1.303655835580e-6, 1.5626441722e-8, -8.5238095915e-8,
				6.529054439e-9, 5.059343495e-9, -9.91364156e-10,
				-2.27365122e-10, 9.6467911e-11, 2.394038e-12,
				-6.886027e-12, 8.94487e-13, 3.13092e-13,
				-1.12708e-13, 3.81e-16, 7.106e-15,
				-1.523e-15, -9.4e-17, 1.21e-16,
				-2.8e-17
			],
			j = cof.length - 1,
			isneg = false,
			d = 0,
			dd = 0,
			t, ty, tmp, res;
		if( x < 0 ) {
			x = -x;
			isneg = true;
		}
		t = 2 / ( 2 + x );
		ty = 4 * t - 2;
		for( ; j > 0; j-- ) {
			tmp = d;
			d = ty * d - dd + cof[j];
			dd = tmp;
		}
		res = t * Math.exp( -x*x + 0.5 * ( cof[0] + ty * d ) - dd );
		return ( isneg ) ? res - 1 : 1 - res;
	},

	// Returns the complmentary error function erfc(x)
	erfc : function( x ) {
		return 1 - jStat.erf( x );
	},

	// Returns the inverse of the complementary error function
	erfcinv : function( p ) {
		var j = 0,
			x, err, t, pp;
		if( p >= 2 ) return -100;
		if( p <= 0 ) return 100;
		pp = ( p < 1 ) ? p : 2 - p;
		t = Math.sqrt( -2 * Math.log( pp / 2 ));
		x = -0.70711 * (( 2.30753 + t * 0.27061 ) / ( 1 + t * ( 0.99229 + t * 0.04481)) - t );
		for( ; j < 2; j++ ) {
			err = jStat.erfc( x ) - pp;
			x += err / ( 1.12837916709551257 * Math.exp( -x * x ) - x * err );
		}
		return ( p < 1 ) ? x : -x;
	},

	// Returns the inverse of the incomplete beta function
	incompleteBetaInv : function( p, a, b ) {
		var EPS = 1e-8,
			a1 = a - 1,
			b1 = b - 1,
			j = 0,
			lna, lnb, pp, t, u, err, x, al, h, w, afac;
		if( p <= 0 ) return 0;
		if( p >= 1 ) return 1;
		if( a >= 1 && b >= 1 ) {
			pp = ( p < 0.5 ) ? p : 1 - p;
			t = Math.sqrt( -2 * Math.log( pp ));
			x = ( 2.30753 + t * 0.27061 ) / ( 1 + t* ( 0.99229 + t * 0.04481 )) - t;
			if( p < 0.5 ) x = -x;
			al = ( x * x - 3 ) / 6;
			h = 2 / ( 1 / ( 2 * a - 1 )  + 1 / ( 2 * b - 1 ));
			w = ( x * Math.sqrt( al + h ) / h ) - ( 1 / ( 2 * b - 1 ) - 1 / ( 2 * a - 1 )) * ( al + 5 / 6 - 2 / ( 3 * h ));
			x = a / ( a + b * Math.exp( 2 * w ));
		} else {
			lna = Math.log( a / ( a + b ));
			lnb = Math.log( b / ( a + b ));
			t = Math.exp( a * lna ) / a;
			u = Math.exp( b * lnb ) / b;
			w = t + u;
			if( p < t / w) x = Math.pow( a * w * p, 1 / a );
			else x = 1 - Math.pow( b * w * ( 1 - p ), 1 / b );
		}
		afac = -jStat.gammaln( a ) - jStat.gammaln( b ) + jStat.gammaln( a + b );
		for( ; j < 10; j++ ) {
			if( x === 0 || x === 1) return x;
			err = jStat.incompleteBeta( x, a, b ) - p;
			t = Math.exp( a1 * Math.log( x ) + b1 * Math.log( 1 - x ) + afac );
			u = err / t;
			x -= ( t = u / ( 1 - 0.5 * Math.min( 1, u * ( a1 / x - b1 / ( 1 - x )))));
			if( x <= 0 ) x = 0.5 * ( x + t );
			if( x >= 1 ) x = 0.5 * ( x + t + 1 );
			if( Math.abs( t ) < EPS * x && j > 0 ) break;
		}
		return x;
	},

	// Returns the incomplete beta function I_x(a,b)
	incompleteBeta : function( x, a, b ) {
		// Factors in front of the continued fraction.
		var bt = ( x === 0 || x === 1 ) ?  0 :
			Math.exp(jStat.gammaln( a + b ) - jStat.gammaln( a ) -
			jStat.gammaln( b ) + a * Math.log( x ) + b *
			Math.log( 1 - x ));
		if( x < 0 || x > 1 ) return false;
		if( x < ( a + 1 ) / ( a + b + 2 ) )
			// Use continued fraction directly.
			return bt * betacf( x, a, b ) / a;
		// else use continued fraction after making the symmetry transformation.
		return 1 - bt * betacf( 1 - x, b, a ) / b;
	},

	// Returns a normal deviate (mu=0, sigma=1).
	// If n and m are specified it returns a object of normal deviates.
	randn : function( n, m ) {
		var u, v, x, y, q, mat;
		if ( !m ) m = n;
		if( n ) {
			return jStat.create( n, m, function() { return jStat.randn(); });
		}
		do {
			u = Math.random();
			v = 1.7156 * ( Math.random() - 0.5 );
			x = u - 0.449871;
			y = Math.abs( v ) + 0.386595;
			q = x*x + y * ( 0.19600 * y - 0.25472 * x );
		} while( q > 0.27597 && ( q > 0.27846 || v*v > -4 * Math.log( u ) * u*u ));
		return v / u;
	},

	// Returns a gamma deviate by the method of Marsaglia and Tsang.
	randg : function( shape, n, m ) {
		var oalph = shape,
			a1, a2, u, v, x, mat;
		if ( !m ) m = n;
		if ( !shape ) shape = 1;
		if( n ) {
			mat = jStat.zeros( n,m );
			mat.alter(function() { return jStat.randg( shape ); });
			return mat;
		}
		if( shape < 1 ) shape += 1;
		a1 = shape - 1 / 3;
		a2 = 1 / Math.sqrt( 9 * a1 );
		do {
			do {
				x = jStat.randn();
				v = 1 + a2 * x;
			} while( v <= 0 );
			v = v * v * v;
			u = Math.random();
		} while( u > 1 - 0.331 * Math.pow( x, 4 ) &&
			Math.log( u ) > 0.5 * x*x + a1 * ( 1 - v + Math.log( v ) ));
		// alpha > 1
		if( shape == oalph ) return a1 * v;
		// alpha < 1
		do { u = Math.random(); } while( u === 0 );
		return Math.pow( u, 1 / oalph ) * a1 * v;
	}
});

// making use of static methods on the instance
(function( funcs ) {
	for ( var i = 0; i < funcs.length; i++ ) (function( passfunc ) {
		jStat.fn[ passfunc ] = function() {
			return jStat( jStat.map( this, function( value ) { return jStat[ passfunc ]( value ); }));
		};
	})( funcs[i] );
})( 'gammaln gammafn factorial factorialln'.split( ' ' ));

(function( funcs ) {
	for ( var i = 0; i < funcs.length; i++ ) (function( passfunc ) {
		jStat.fn[ passfunc ] = function() {
			return jStat( jStat[ passfunc ].apply( null, arguments ));
		};
	})( funcs[i] );
})( 'randn'.split( ' ' ));

})( this.jStat, Math );
(function( jStat, Math ) {

// generate all distribution instance methods
(function( list ) {
	for ( var i = 0; i < list.length; i++ ) (function( func ) {
		// distribution instance method
		jStat[ func ] = function( a, b, c ) {
			if (!( this instanceof arguments.callee )) return new arguments.callee( a, b, c );
			this._a = a;
			this._b = b;
			this._c = c;
			return this;
		};
		// distribution method to be used on a jStat instance
		jStat.fn[ func ] = function( a, b, c ) {
			var newthis = jStat[ func ]( a, b, c );
			newthis.data = this;
			return newthis;
		};
		// sample instance method
		jStat[ func ].prototype.sample = function( arr ) {
			var a = this._a,
				b = this._b,
				c = this._c;
			if ( arr )
				return jStat.alter( arr, function() {
					return jStat[ func ].sample( a, b, c );
				});
			else
				return jStat[ func ].sample( a, b, c );
		};
		// generate the pdf, cdf and inv instance methods
		(function( vals ) {
			for ( var i = 0; i < vals.length; i++ ) (function( fnfunc ) {
				jStat[ func ].prototype[ fnfunc ] = function( x ) {
					var a = this._a,
						b = this._b,
						c = this._c;
					if ( isNaN( x )) {
						return jStat.fn.map.call( this.data, function( x ) {
							return jStat[ func ][ fnfunc ]( x, a, b, c );
						});
					}
					return jStat[ func ][ fnfunc ]( x, a, b, c );
				};
			})( vals[ i ]);
		})( 'pdf cdf inv'.split( ' ' ));
		// generate the mean, median, mode and variance instance methods
		(function( vals ) {
			for ( var i = 0; i < vals.length; i++ ) (function( fnfunc ) {
				jStat[ func ].prototype[ fnfunc ] = function() {
					return jStat[ func ][ fnfunc ]( this._a, this._b, this._c );
				};
			})( vals[ i ]);
		})( 'mean median mode variance'.split( ' ' ));
	})( list[ i ]);
})((
	'beta centralF cauchy chisquare exponential gamma invgamma kumaraswamy lognormal normal ' +
	'pareto studentt weibull uniform  binomial negbin hypgeom poisson triangular'
).split( ' ' ));



// extend beta function with static methods
jStat.extend( jStat.beta, {
	pdf : function( x, alpha, beta ) {
		return (x > 1 || x < 0) ? 0 : ( Math.pow( x, alpha - 1 ) * Math.pow( 1 - x, beta - 1 )) / jStat.betafn( alpha, beta );
	},

	cdf : function( x, alpha, beta ) {
		return (x > 1 || x < 0) ? (x > 1) * 1 : jStat.incompleteBeta( x, alpha, beta );
	},

	inv : function( x, alpha, beta ) {
		return jStat.incompleteBetaInv( x, alpha, beta );
	},

	mean : function( alpha, beta ) {
		return alpha / ( alpha + beta );
	},

	median : function( alpha, beta ) {
		// TODO: implement beta median
	},

	mode : function( alpha, beta ) {
		return ( alpha * beta ) / ( Math.pow( alpha + beta, 2 ) * ( alpha + beta + 1 ));
	},

	// return a random sample
	sample : function( alpha, beta ) {
		var u = jStat.randg( alpha );
		return u / ( u + jStat.randg( beta ));
	},

	variance : function( alpha, beta ) {
		return ( alpha * beta ) / ( Math.pow( alpha + beta, 2 ) * ( alpha + beta + 1 ));
	}
});

// extend F function with static methods
jStat.extend( jStat.centralF, {
	pdf : function( x, df1, df2 ) {
		return  ( x >= 0) ?  
			Math.sqrt( ( Math.pow( df1 * x, df1) * Math.pow( df2, df2 ) ) / ( Math.pow(df1 * x + df2, df1 + df2 ) ) ) / ( x * jStat.betafn( df1/2, df2/2 ) ) : undefined;
		
	},

	cdf : function( x, df1, df2 ) {
		return jStat.incompleteBeta( ( df1 * x ) / ( df1 * x + df2 ), df1 / 2, df2 / 2 );
	},

	inv : function( x, df1, df2 ) {
		return df2 / (df1 * ( 1 / jStat.incompleteBetaInv( x, df1 / 2, df2 / 2 ) - 1 ) );
	},

	mean : function( df1, df2 ) {
		return ( df2 > 2 ) ? df2 / ( df2 - 2 ) : undefined;
	},

	mode : function( df1, df2 ) {
		return ( df1 > 2) ? ( df2 * ( df1 - 2 ) ) / ( df1 * ( df2 + 2 ) ) : undefined;
	},

	// return a random sample
	sample : function( df1, df2 ) {
		var x1 = jStat.randg( df1 / 2 ) * 2;
		var x2 = jStat.randg( df2 / 2 ) * 2;
		return ( x1 / df1 ) / ( x2 / df2 );
	},

	variance : function( df1, df2 ) {
		return ( df2 > 4 ) ? 2 * df2 * df2 * ( df1 + df2 - 2) / ( df1 * ( df2 - 2 ) * ( df2 - 2 ) * ( df2 - 4 ) ): undefined;
	}
});


// extend cauchy function with static methods
jStat.extend( jStat.cauchy, {
	pdf : function( x, local, scale ) {
		return ( scale / ( Math.pow( x - local, 2 ) + Math.pow( scale, 2 ))) / Math.PI;
	},

	cdf : function( x, local, scale ) {
		return Math.atan(( x - local) / scale ) / Math.PI + 0.5;
	},

	inv : function( p, local, scale ) {
		return local + scale * Math.tan( Math.PI * ( p - 0.5 ));
	},

	median: function( local, scale ) {
		return local;
	},

	mode : function( local, scale ) {
		return local;
	},

	sample : function( local, scale ) {
		return jStat.randn() * Math.sqrt( 1 / ( 2 * jStat.randg( 0.5 ))) * scale + local;
	}
});



// extend chisquare function with static methods
jStat.extend( jStat.chisquare, {
	pdf : function( x, dof ) {
		return Math.exp(( dof / 2 - 1 ) * Math.log( x ) - x / 2 - ( dof / 2 ) * Math.log( 2 ) - jStat.gammaln( dof / 2 ));
	},

	cdf : function( x, dof ) {
		return jStat.gammap( dof / 2, x / 2 );
	},

	inv : function( p, dof ) {
		return 2 * jStat.gammapinv( p, 0.5 * dof );
	},

	mean : function( dof ) {
		return dof;
	},

	//TODO: this is an approximation (is there a better way?)
	median : function( dof ) {
		return dof * Math.pow( 1 - ( 2 / ( 9 * dof )), 3 );
	},

	mode : function( dof ) {
		return ( dof - 2 > 0 ) ? dof - 2 : 0;
	},

	sample : function( dof ) {
		return jStat.randg( dof / 2 ) * 2;
	},

	variance: function( dof ) {
		return 2 * dof;
	}
});



// extend exponential function with static methods
jStat.extend( jStat.exponential, {
	pdf : function( x, rate ) {
		return x < 0 ? 0 : rate * Math.exp( -rate * x );
	},

	cdf : function( x, rate ) {
		return x < 0 ? 0 : 1 - Math.exp( -rate * x );
	},

	inv : function( p, rate ) {
		return -Math.log( 1 - p ) / rate;
	},

	mean : function( rate ) {
		return 1 / rate;
	},

	median : function ( rate ) {
		return ( 1 / rate ) * Math.log( 2 );
	},

	mode : function( rate ) {
		return 0;
	},

	sample : function( rate ) {
		return -1 / rate * Math.log( Math.random());
	},

	variance : function( rate ) {
		return Math.pow( rate, -2 );
	}
});



// extend gamma function with static methods
jStat.extend( jStat.gamma, {
	pdf : function( x, shape, scale ) {
		return Math.exp(( shape - 1 ) * Math.log( x ) - x / scale - jStat.gammaln( shape ) - shape * Math.log( scale ));
	},

	cdf : function( x, shape, scale ) {
		return jStat.gammap( shape, x / scale );
	},

	inv : function( p, shape, scale ) {
		return jStat.gammapinv( p, shape ) * scale;
	},

	mean : function( shape, scale ) {
		return shape * scale;
	},

	mode : function( shape, scale ) {
		if( shape > 1 ) return ( shape - 1 ) * scale;
		return undefined;
	},

	sample : function( shape, scale ) {
		return jStat.randg( shape ) * scale;
	},

	variance: function( shape, scale ) {
		return shape * scale * scale;
	}
});

// extend inverse gamma function with static methods
jStat.extend( jStat.invgamma, {
	pdf : function( x, shape, scale ) {
		return Math.exp( -( shape + 1 ) * Math.log( x ) - scale/x - jStat.gammaln( shape ) + shape * Math.log( scale ) );
	},

	cdf : function( x, shape, scale ) {
		return 1 - jStat.gammap( shape, scale / x );
	},

	inv : function( p, shape, scale ) {
		return scale / jStat.gammapinv( 1 - p, shape );
	},

	mean : function( shape, scale ) {
		return ( shape > 1 ) ? scale / ( shape - 1 ) : undefined;
	},

	mode : function( shape, scale ) {
		return scale / ( shape + 1 );
	},

	sample : function( shape, scale ) {
		return scale / jStat.randg( shape );
	},

	variance: function( shape, scale ) {
		return (shape > 2) ? scale * scale / ( ( shape - 1 ) * ( shape - 1) * ( shape - 2 ) ): undefined;
	}
});


// extend kumaraswamy function with static methods
jStat.extend( jStat.kumaraswamy, {
	pdf : function( x, alpha, beta ) {
		return Math.exp( Math.log( alpha ) + Math.log( beta ) + ( alpha - 1 ) * Math.log( x ) + ( beta - 1 ) * Math.log( 1 - Math.pow( x, alpha )));
	},

	cdf : function( x, alpha, beta ) {
		return ( 1 - Math.pow( 1 - Math.pow( x, alpha ), beta ));
	},

	mean : function( alpha, beta ) {
		return ( beta * jStat.gammafn( 1 + 1 / alpha ) * jStat.gammafn( beta )) / ( jStat.gammafn( 1 + 1 / alpha + beta ));
	},

	median : function( alpha, beta ) {
		return Math.pow( 1 - Math.pow( 2, -1 / beta ), 1 / alpha );
	},

	mode : function( alpha, beta ) {
		return ( alpha >= 1 && beta >= 1 && ( alpha !== 1 && beta !== 1 )) ? Math.pow(( alpha - 1 ) / ( alpha * beta - 1 ), 1 / alpha ) : undefined;
	},

	variance: function( alpha, beta ) {
		// TODO: complete this
	}
});



// extend lognormal function with static methods
jStat.extend( jStat.lognormal, {
	pdf : function( x, mu, sigma ) {
		return Math.exp(-Math.log( x ) - 0.5 * Math.log( 2 * Math.PI ) - Math.log( sigma ) - Math.pow( Math.log( x ) - mu, 2 ) / ( 2 * sigma * sigma ));
	},

	cdf : function( x, mu, sigma ) {
		return 0.5 + ( 0.5 * jStat.erf(( Math.log( x ) - mu ) / Math.sqrt( 2 * sigma * sigma )));
	},

	inv : function( p, mu, sigma ) {
		return Math.exp( -1.41421356237309505 * sigma * jStat.erfcinv( 2 * p ) + mu );
	},

	mean : function( mu, sigma ) {
		return Math.exp( mu + sigma * sigma / 2);
	},

	median : function( mu, sigma ) {
		return Math.exp( mu );
	},

	mode : function( mu, sigma ) {
		return Math.exp( mu - sigma * sigma );
	},

	sample : function( mu, sigma ) {
		return Math.exp( jStat.randn() * sigma + mu );
	},

	variance : function( mu, sigma ) {
		return ( Math.exp( sigma * sigma ) - 1 ) * Math.exp( 2 * mu + sigma * sigma );
	}
});



// extend normal function with static methods
jStat.extend( jStat.normal, {
	pdf : function( x, mean, std ) {
		return Math.exp( -0.5 * Math.log( 2 * Math.PI ) - Math.log( std ) - Math.pow( x - mean, 2 ) / ( 2 * std * std ));
	},

	cdf : function( x, mean, std ) {
		return 0.5 * ( 1 + jStat.erf(( x - mean ) / Math.sqrt( 2 * std * std )));
	},

	inv : function( p, mean, std ) {
		return -1.41421356237309505 * std * jStat.erfcinv( 2 * p ) + mean;
	},

	mean : function( mean, std ) {
		return mean;
	},

	median : function( mean, std ) {
		return mean;
	},

	mode : function ( mean, std ) {
		return mean;
	},

	sample : function( mean, std ) {
		return jStat.randn() * std + mean;
	},

	variance : function( mean, std ) {
		return std * std;
	}
});



// extend pareto function with static methods
jStat.extend( jStat.pareto, {
	pdf : function( x, scale, shape ) {
		return ( x > scale ) ? ( shape * Math.pow( scale, shape )) / Math.pow( x, shape + 1 ) : undefined;
	},

	cdf : function( x, scale, shape ) {
		return 1 - Math.pow( scale / x, shape );
	},

	mean : function( scale, shape ) {
		return ( shape > 1 ) ? ( shape * Math.pow( scale, shape )) / ( shape - 1 ) : undefined;
	},

	median : function( scale, shape ) {
		return scale * ( shape * Math.SQRT2 );
	},

	mode : function( scale, shape ) {
		return scale;
	},

	variance : function( scale, shape ) {
		return ( shape > 2 ) ? ( scale*scale * shape ) / ( Math.pow( shape - 1, 2 ) * ( shape - 2 )) : undefined;
	}
});



// extend studentt function with static methods
jStat.extend( jStat.studentt, {
	pdf : function( x, dof ) {
		return ( jStat.gammafn(( dof + 1 ) / 2 ) / ( Math.sqrt( dof * Math.PI ) * jStat.gammafn( dof / 2 ))) * Math.pow( 1 + (( x*x ) / dof ), -(( dof + 1 ) / 2 ));
	},

	cdf : function( x, dof ) {
		var dof2 = dof / 2;
		return jStat.incompleteBeta(( x + Math.sqrt( x * x + dof )) / ( 2 * Math.sqrt( x * x + dof )), dof2, dof2 );
	},

	inv : function( p, dof ) {
		var x = jStat.incompleteBetaInv( 2 * Math.min( p, 1 - p ), 0.5 * dof, 0.5 );
		x = Math.sqrt( dof * ( 1 - x ) / x );
		return ( p > 0 ) ? x : -x;
	},

	mean : function( dof ) {
		return ( dof > 1 ) ? 0 : undefined;
	},

	median : function ( dof ) {
		return 0;
	},

	mode : function( dof ) {
		return 0;
	},

	sample : function( dof ) {
		return jStat.randn() * Math.sqrt( dof / ( 2 * jStat.randg( dof / 2)));
	},

	variance : function( dof ) {
		return ( dof  > 2 ) ? dof / ( dof - 2 ) : ( dof > 1 ) ? Infinity : undefined;
	}
});



// extend weibull function with static methods
jStat.extend( jStat.weibull, {
	pdf : function( x, scale, shape ) {
		return x < 0 ? 0 : ( shape / scale ) * Math.pow(( x / scale ),( shape - 1 )) * Math.exp(-( Math.pow(( x / scale ), shape )));
	},

	cdf : function( x, scale, shape ) {
		return x < 0 ? 0 : 1 - Math.exp( -Math.pow(( x / scale ), shape ));
	},

	inv : function( p, scale, shape ) {
		return scale * Math.pow( -Math.log( 1 - p ), 1 / shape );
	},

	mean : function( scale, shape ) {
		return scale * jStat.gammafn( 1 + 1 / shape );
	},

	median : function( scale, shape ) {
		return scale * Math.pow( Math.log( 2 ), 1 / shape );
	},

	mode : function( scale, shape ) {
		return ( shape > 1 ) ? scale * Math.pow(( shape - 1 ) / shape, 1 / shape ) : undefined;
	},

	sample : function( scale, shape ) {
		return scale * Math.pow( -Math.log( Math.random()), 1 / shape );
	},

	variance : function( scale, shape ) {
		return scale * scale * jStat.gammafn( 1 + 2 / shape ) - Math.pow( this.mean( scale, shape ), 2 );
	}
});



// extend uniform function with static methods
jStat.extend( jStat.uniform, {
	pdf : function( x, a, b ) {
		return ( x < a || x > b ) ? 0 : 1 / ( b - a );
	},

	cdf : function( x, a, b ) {
		if ( x < a ) {
			return 0;
		} else if ( x < b ) {
			return ( x - a ) / ( b - a );
		}
		return 1;
	},

	mean : function( a, b ) {
		return 0.5 * ( a + b );
	},

	median : function( a, b ) {
		return jStat.mean( a, b );
	},

	mode : function( a, b ) {
		// TODO: complete this
	},

	sample : function( a, b ) {
		return ( a / 2 + b / 2 ) + ( b / 2 - a / 2) * ( 2 * Math.random() - 1);
	},

	variance : function( a, b ) {
		return Math.pow( b - a, 2 ) / 12;
	}
});



// extend uniform function with static methods
jStat.extend( jStat.binomial, {
	pdf : function( k, n, p ) {
		return ( p === 0 || p === 1 ) ?
			(( n * p ) === k ? 1 : 0 ) :
		jStat.combination( n, k ) * Math.pow( p, k ) * Math.pow( 1 - p, n - k );
	},

	cdf : function( x, n, p ) {
		var binomarr = [],
			k = 0;
		if ( x < 0 ) {
			return 0;
		}
		if ( x < n ) {
			for ( ; k <= x; k++ ) {
				binomarr[ k ] = jStat.binomial.pdf( k, n, p );
			}
			return jStat.sum( binomarr );
		}
		return 1;
	}
});



// extend uniform function with static methods
jStat.extend( jStat.negbin, {
	pdf : function( k, r, p ) {
		return k !== k | 0
			? false
		: k < 0
			? 0
		: jStat.combination( k + r - 1, k ) * Math.pow( 1 - p, r ) * Math.pow( p, k );
	},

	cdf : function( x, r, p ) {
		var sum = 0,
			k = 0;
		if ( x < 0 ) return 0;
		for ( ; k <= x; k++ ) {
			sum += jStat.negbin.pdf( k, r, p );
		}
		return sum;
	}
});



// extend uniform function with static methods
jStat.extend( jStat.hypgeom, {
	pdf : function( k, N, m, n ) {
		return k !== k | 0
			? false
		: ( k < 0)
			? 0
		: jStat.combination( m, k ) * jStat.combination( N - m , n - k ) / jStat.combination( N, n );
	},

	cdf : function( x, N, m, n ) {
		var sum = 0,
			k = 0;
		if ( x < 0 ) return 0;
		for ( ; k <= x; k++ ) {
			sum += jStat.hypgeom.pdf( k, N, m, n );
		}
		return sum;
	}
});



// extend uniform function with static methods
jStat.extend( jStat.poisson, {
	pdf : function( k, l ) {
		return Math.pow( l, k ) * Math.exp( -l ) / jStat.factorial( k );
	},

	cdf : function( x, l ) {
		var sumarr = [],
			k = 0;
		if ( x < 0 ) return 0;
		for ( ; k <= x; k++ ) {
			sumarr.push(jStat.poisson.pdf( k, l ));
		}
		return jStat.sum(sumarr);
	},

	mean : function( l ) {
		return l;
	},

	variance : function( l ) {
		return l;
	},

	sample : function( l ) {
		var p = 1, k = 0, L = Math.exp(-l);
		do {
			k++;
			p *= Math.random();
		} while (p > L);
		return k - 1;
	}
});

// extend triangular function with static methods
jStat.extend( jStat.triangular, {
	pdf : function( x, a, b, c ) {
		return ( b <= a || c < a || c > b )
			? undefined
		: ( x < a || x > b )
			? 0
		: ( x <= c )
			? ( 2 * ( x - a )) / (( b - a ) * ( c - a ))
		: ( 2 * ( b - x )) / (( b - a ) * ( b - c ));
	},

	cdf : function( x, a, b, c ) {
		if ( b <= a || c < a || c > b )
			return undefined;
		if ( x < a ) {
			return 0;
		} else {
			if ( x <= c )
				return Math.pow( x - a, 2 ) / (( b - a ) * ( c - a ));
			return 1 - Math.pow( b - x, 2 ) / (( b - a ) * ( b - c ));
		}
		// never reach this
		return 1;
	},

	mean : function( a, b, c ) {
		return ( a + b + c ) / 3;
	},

	median : function( a, b, c ) {
		if ( c <= ( a + b ) / 2 ) {
			return b - Math.sqrt(( b - a ) * ( b - c )) / Math.sqrt( 2 );
		} else if ( c > ( a + b ) / 2 ) {
			return a + Math.sqrt(( b - a ) * ( c - a )) / Math.sqrt( 2 );
		}
	},

	mode : function( a, b, c ) {
		return c;
	},

	sample : function( a, b, c ) {
		var u = Math.random();
		return u < (( c - a ) / ( b - a )) ?
			a + Math.sqrt( u * ( b - a ) * ( c - a )) : b - Math.sqrt(( 1 - u ) * ( b - a ) * ( b - c ));
	},

	variance : function( a, b, c ) {
		return ( a * a + b * b + c * c - a * b - a * c - b * c ) / 18;
	}
});

})( this.jStat, Math );
/* Provides functions for the solution of linear system of equations, integration, extrapolation,
 * interpolation, eigenvalue problems, differential equations and PCA analysis. */

(function( jStat, Math ) {

var push = Array.prototype.push,
	isArray = jStat.utils.isArray;

jStat.extend({

	// add a vector/matrix to a vector/matrix or scalar
	add : function( arr, arg ) {
		// check if arg is a vector or scalar
		if ( isArray( arg )) {
			if ( !isArray( arg[0] )) arg = [ arg ];
			return jStat.map( arr, function( value, row, col ) { return value + arg[row][col]; });
		}
		return jStat.map( arr, function( value ) { return value + arg; });
	},

	// subtract a vector or scalar from the vector
	subtract : function( arr, arg ) {
		// check if arg is a vector or scalar
		if ( isArray( arg )) {
			if ( !isArray( arg[0] )) arg = [ arg ];
			return jStat.map( arr, function( value, row, col ) { return value - arg[row][col] || 0; });
		}
		return jStat.map( arr, function( value ) { return value - arg; });
	},

	// matrix division
	divide : function( arr, arg ) {
		if ( isArray( arg )) {
			if ( !isArray( arg[0] )) arg = [ arg ];
			return jStat.multiply( arr, jStat.inv( arg ));
		}
		return jStat.map( arr, function( value ) { return value / arg; });
	},

	// matrix multiplication
	multiply : function( arr, arg ) {
		var row, col, nrescols, sum,
			nrow = arr.length,
			ncol = arr[0].length,
			res = jStat.zeros( nrow, nrescols = ( isArray( arg )) ? arg[0].length : ncol ),
			rescols = 0;
		if ( isArray( arg )) {
			for ( ; rescols < nrescols; rescols++ ) {
				for ( row = 0; row < nrow; row++ ) {
					sum = 0;
					for ( col = 0; col < ncol; col++ )
						sum += arr[row][col] * arg[col][rescols];
					res[row][rescols] = sum;
				}
			}
			return ( nrow === 1 && rescols === 1 ) ? res[0][0] : res;
		}
		return jStat.map( arr, function( value ) { return value * arg; });
	},

	// Returns the dot product of two matricies
	dot : function( arr, arg ) {
		if ( !isArray( arr[0] )) arr = [ arr ];
		if ( !isArray( arg[0] )) arg = [ arg ];
			// convert column to row vector
		var left = ( arr[0].length === 1 && arr.length !== 1 ) ? jStat.transpose( arr ) : arr,
			right = ( arg[0].length === 1 && arg.length !== 1 ) ? jStat.transpose( arg ) : arg,
			res = [],
			row = 0,
			nrow = left.length,
			ncol = left[0].length,
			sum, col;
		for ( ; row < nrow; row++ ) {
			res[row] = [];
			sum = 0;
			for ( col = 0; col < ncol; col++ )
				sum += left[row][col] * right[row][col];
			res[row] = sum;
		}
		return ( res.length === 1 ) ? res[0] : res;
	},

	// raise every element by a scalar
	pow : function( arr, arg ) {
		return jStat.map( arr, function( value ) { return Math.pow( value, arg ); });
	},

	// generate the absolute values of the vector
	abs : function( arr ) {
		return jStat.map( arr, function( value ) { return Math.abs( value ); });
	},

	// TODO: make compatible with matrices
	// computes the p-norm of the vector
	norm : function( arr, p ) {
		var nnorm = 0,
			i = 0;
		// check the p-value of the norm, and set for most common case
		if ( isNaN( p )) p = 2;
		// check if multi-dimensional array, and make vector correction
		if ( isArray( arr[0] )) arr = arr[0];
		// vector norm
		for (; i < arr.length; i++ ) {
			nnorm += Math.pow( Math.abs( arr[i] ), p );
		}
		return Math.pow( nnorm, 1 / p );
	},

	// TODO: make compatible with matrices
	// computes the angle between two vectors in rads
	angle : function( arr, arg ) {
		return Math.acos( jStat.dot( arr, arg ) / ( jStat.norm( arr ) * jStat.norm( arg )));
	},

	// augment one matrix by another
	aug : function( a, b ) {
		var newarr = a.slice(),
			i = 0;
		for ( ; i < newarr.length; i++ ) {
			push.apply( newarr[i], b[i] );
		}
		return newarr;
	},

	inv : function( a ) {
		var rows = a.length,
			cols = a[0].length,
			b = jStat.identity( rows, cols ),
			c = jStat.gauss_jordan( a, b ),
			obj = [],
			i = 0,
			j;
		for ( ; i < rows; i++ ) {
			obj[i] = [];
			for ( j = cols - 1; j < c[0].length; j++ )
				obj[i][j - cols] = c[i][j];
		}
		return obj;
	},

	// calculate the determinant of a matrix
	det : function( a ) {
		var alen = a.length,
			alend = alen * 2,
			vals = new Array( alend ),
			rowshift = alen - 1,
			colshift = alend - 1,
			mrow = rowshift - alen + 1,
			mcol = colshift,
			i = 0,
			result = 0,
			j;
		// check for special 2x2 case
		if ( alen === 2 ) {
			return a[0][0] * a[1][1] - a[0][1] * a[1][0];
		}
		for (; i < alend; i++ ) {
			vals[i] = 1;
		}
		for ( i = 0; i < alen; i++ ) {
			for ( j = 0; j < alen; j++ ) {
				vals[( mrow < 0 ) ? mrow + alen : mrow ] *= a[i][j];
				vals[( mcol < alen ) ? mcol + alen : mcol ] *= a[i][j];
				mrow++;
				mcol--;
			}
			mrow = --rowshift - alen + 1;
			mcol = --colshift;
		}
		for ( i = 0; i < alen; i++ ) {
			result += vals[i];
		}
		for (; i < alend; i++ ) {
			result -= vals[i];
		}
		return result;
	},

	gauss_elimination : function( a, b ) {
		var i = 0,
			j = 0,
			n = a.length,
			m = a[0].length,
			factor = 1,
			sum = 0,
			x = [],
			maug, pivot, temp, k;
		a = jStat.aug( a, b );
		maug = a[0].length;
		for( ; i < n; i++ ) {
			pivot = a[i][i];
			j = i;
			for ( k = i + 1; k < m; k++ ) {
				if ( pivot < Math.abs( a[k][i] )) {
					pivot = a[k][i];
					j = k;
				}
			}
			if ( j != i ) {
				for( k = 0; k < maug; k++ ) {
					temp = a[i][k];
					a[i][k] = a[j][k];
					a[j][k] = temp;
				}
			}
			for ( j = i + 1; j < n; j++ ) {
				factor = a[j][i] / a[i][i];
				for( k = i; k < maug; k++) {
					a[j][k] = a[j][k] - factor * a[i][k];
				}
			}
		}
		for ( i = n - 1; i >= 0; i-- ) {
			sum = 0;
			for ( j = i + 1; j<= n - 1; j++ ) {
				sum = x[j] * a[i][j];
			}
			x[i] =( a[i][maug - 1] - sum ) / a[i][i];
		}
		return x;
	},

	gauss_jordan : function( a, b ) {
		var i = 0,
			j = 0,
			n = a.length,
			m = a[0].length,
			factor = 1,
			sum = 0,
			X=[],
			temp, pivot, maug, k;
		a = jStat.aug( a, b );
		maug = a[0].length;
		for ( ; i < n; i++ ) {
			pivot = a[i][i];
			j = i;
			for ( k = i+1;k< m;k++) {
				if( pivot < Math.abs( a[k][i] )) {
					pivot = a[k][i];
					j = k;
				}
			}
			if ( j != i ) {
				for ( ; k < maug; k++ ) {
					temp = a[i][k];
					a[i][k] = a[j][k];
					a[j][k] = temp;
				}
			}
			for ( j = 0; j < n; j++ ) {
				if ( i != j ) {
					factor = a[j][i] / a[i][i];
					for ( k = i; k<maug; k++ ) {
						a[j][k] = a[j][k] - factor * a[i][k];
					}
				}
			}
		}
		for ( i = 0; i < n; i++ ) {
			factor = a[i][i];
			for( k = 0; k < maug; k++ ) {
				a[i][k] = a[i][k] / factor;
			}
		}
		return a;
	},

	lu : function( a, b ) {
		//TODO
	},

	cholesky : function( a, b ) {
		//TODO
	},

	gauss_jacobi : function( a, b, x, r ) {
		var i = 0,
			j = 0,
			n = a.length,
			l = [],
			u = [],
			d = [],
			xv, c, h, xk;
		for ( ; i < n; i++ ) {
			l[i] = [];
			u[i] = [];
			d[i] = [];
			for ( j = 0; j < n; j++ ) {
				if ( i > j ) {
					l[i][j] = a[i][j];
					u[i][j] = d[i][j] = 0;
				} else if ( i < j ) {
					u[i][j] = a[i][j];
					l[i][j] = d[i][j] = 0;
				} else {
					d[i][j] = a[i][j];
					l[i][j] = u[i][j] = 0;
				}
			}
		}
		h = jStat.multiply( jStat.multiply( jStat.inv( d ), jStat.add( l, u )), -1 );
		c = jStat.multiply( jStat.inv( d ), b );
		xv = x;
		xk = jStat.add( jStat.multiply( h, x ), c );
		i = 2;
		while ( Math.abs( jStat.norm( jStat.subtract( xk,xv ))) > r ) {
			xv = xk;
			xk = jStat.add( jStat.multiply( h, xv ), c );
			i++;
		}
		return xk;
	},

	gauss_seidel : function( a, b, x, r ) {
		var i = 0,
			n = a.length,
			l = [],
			u = [],
			d = [],
			j, xv, c, h, xk;
		for ( ; i < n; i++ ) {
			l[i] = [];
			u[i] = [];
			d[i] = [];
			for ( j = 0; j < n; j++) {
				if ( i > j ) {
					l[i][j] = a[i][j];
					u[i][j] = d[i][j] = 0;
				} else if ( i < j ) {
					u[i][j] = a[i][j];
					l[i][j] = d[i][j] = 0;
				} else {
					d[i][j] = a[i][j];
					l[i][j] = u[i][j] = 0;
				}
			}
		}
		h = jStat.multiply( jStat.multiply( jStat.inv( jStat.add( d, l )), u ), -1 );
		c = jStat.multiply( jStat.inv( jStat.add( d, l )), b );
		xv = x;
		xk = jStat.add( jStat.multiply( h, x ), c );
		i = 2;
		while ( Math.abs( jStat.norm( jStat.subtract( xk, xv ))) > r ) {
			xv = xk;
			xk = jStat.add( jStat.multiply( h, xv ), c );
			i = i + 1;
		}
		return xk;
	},

	SOR : function( a, b, x, r, w ) {
		var i = 0,
			n = a.length,
			l = [],
			u = [],
			d = [],
			j, xv, c, h, xk;
		for ( ; i < n; i++ ) {
			l[i] = [];
			u[i] = [];
			d[i] = [];
			for ( j = 0; j < n; j++ ) {
				if ( i > j ) {
					l[i][j] = a[i][j];
					u[i][j] = d[i][j] = 0;
				} else if ( i < j ) {
					u[i][j] = a[i][j];
					l[i][j] = d[i][j] = 0;
				} else {
					d[i][j] = a[i][j];
					l[i][j] = u[i][j] = 0;
				}
			}
		}
		h = jStat.multiply( jStat.inv( jStat.add( d, jStat.multiply( l, w ))), jStat.subtract( jStat.multiply( d, 1 - w ), jStat.multiply( u, w )));
		c = jStat.multiply( jStat.multiply( jStat.inv( jStat.add( d, jStat.multiply( l, w ))), b ), w );
		xv = x;
		xk = jStat.add( jStat.multiply( h, x ), c );
		i = 2;
		while ( Math.abs( jStat.norm( jStat.subtract( xk, xv ))) > r ) {
			xv = xk;
			xk = jStat.add( jStat.multiply( h, xv ), c );
			i++;
		}
		return xk;
	},

	householder : function( a ) {
		var m = a.length,
			n = a[0].length,
			i = 0,
			w = [],
			p = [],
			alpha, r, k, j, factor;
		for ( ; i < m - 1; i++ ) {
			alpha = 0;
			for ( j = i + 1; j < n; j++ )
				alpha += ( a[j][i] * a[j][i] );
			factor = ( a[i + 1][i] > 0 ) ? -1 : 1;
			alpha = factor * Math.sqrt( alpha );
			r = Math.sqrt(((( alpha * alpha ) - a[i + 1][i] * alpha ) / 2 ));
			w = jStat.zeros( m, 1 );
			w[i + 1][0] = ( a[i + 1][i] - alpha ) / ( 2 * r );
			for ( k = i + 2; k < m; k++ ) w[k][0] = a[k][i] / ( 2 * r );
			p = jStat.subtract( jStat.identity( m, n ), jStat.multiply( jStat.multiply(w, jStat.transpose( w )), 2 ));
			a = jStat.multiply( p, jStat.multiply( a, p ));
		}
		return a;
	},

	// TODO: not working properly.
	QR : function( a, b ) {
		var m = a.length,
			n = a[0].length,
			i = 0,
			w = [],
			p = [],
			x = [],
			j, alpha, r, k, factor,sum;
		for ( ; i < m - 1; i++ ) {
			alpha = 0;
			for ( j = i + 1; j < n; j++ )
				alpha += ( a[j][i] * a[j][i] );
			factor = ( a[i + 1][i] > 0 ) ? -1 : 1;
			alpha = factor * Math.sqrt( alpha );
			r = Math.sqrt(((( alpha * alpha ) - a[i + 1][i] * alpha ) / 2 ));
			w = jStat.zeros( m, 1 );
			w[i + 1][0] = ( a[i + 1][i] - alpha ) / ( 2 * r );
			for ( k = i + 2; k < m; k++ ) w[k][0] = a[k][i] / ( 2 * r );
			p = jStat.subtract( jStat.identity( m, n ), jStat.multiply( jStat.multiply( w, jStat.transpose( w )), 2));
			a = jStat.multiply( p, a );
			b = jStat.multiply( p, b );
		}
		for ( i = m - 1; i >= 0; i-- ) {
			sum = 0;
			for ( j = i + 1; j <= n - 1; j++ )
				sum = x[j] * a[i][j];
			x[i] = b[i][0] / a[i][i];
		}
		return x;
	},

	jacobi : function( a ) {
		var condition = 1,
			count = 0,
			n = a.length,
			e = jStat.identity( n, n ),
			ev = [],
			b, i, j, p, q, maxim, theta, s;
		// condition === 1 only if tolerance is not reached
		while ( condition === 1 ) {
			count++;
			maxim = a[0][1];
			p = 0;
			q = 1;
			for ( i = 0; i < n; i++ ) {
				for ( j = 0; j < n; j++ ) {
					if ( i != j ) {
						if ( maxim < Math.abs( a[i][j] )) {
							maxim = Math.abs( a[i][j] );
							p = i;
							q = j;
						}
					}
				}
			}
			if ( a[p][p] === a[q][q] )
				theta = ( a[p][q] > 0 ) ? Math.PI / 4 : -Math.PI / 4;
			else
				theta = Math.atan( 2 * a[p][q] / ( a[p][p] - a[q][q] )) / 2;
			s = jStat.identity( n, n );
			s[p][p] = Math.cos( theta );
			s[p][q] = -Math.sin( theta );
			s[q][p] = Math.sin( theta );
			s[q][q] = Math.cos( theta );
			// eigen vector matrix
			e = jStat.multiply( e, s );
			b = jStat.multiply( jStat.multiply( jStat.inv( s ), a ), s );
			a = b;
			condition = 0;
			for ( i = 1; i < n; i++ ) {
				for ( j = 1; j < n; j++ ) {
					if ( i != j && Math.abs( a[i][j]) > 0.001 ) {
						condition = 1;
					}
				}
			}
		}
		for( i = 0; i < n; i++ ) ev.push( a[i][i] );
		//returns both the eigenvalue and eigenmatrix
		return [e, ev];
	},

	rungekutta : function( f, h, p, t_j, u_j, order ) {
		var k1, k2, u_j1, k3, k4;
		if ( order === 2 ) {
			while ( t_j <= p ) {
				k1 = h * f( t_j, u_j );
				k2 = h * f( t_j + h, u_j + k1 );
				u_j1 = u_j + ( k1 + k2 ) / 2;
				u_j = u_j1;
				t_j = t_j + h;
			}
		}
		if ( order === 4 ) {
			while ( t_j <= p ) {
				k1 = h * f( t_j, u_j);
				k2 = h * f( t_j + h / 2, u_j + k1 / 2 );
				k3 = h * f( t_j + h / 2, u_j + k2 / 2);
				k4 = h * f( t_j +h, u_j + k3 );
				u_j1 = u_j + ( k1 + 2 * k2 + 2 * k3 + k4 ) / 6;
				u_j = u_j1;
				t_j = t_j + h;
			}
		}
		return u_j;
	},

	romberg : function( f, a, b, order ) {
		var i = 0,
			h = ( b - a ) / 2,
			x = [],
			h1 = [],
			g = [],
			m, a1, j, k, I, d;
		while ( i < order / 2 ) {
			I = f( a );
			for ( j = a, k = 0; j <= b; j = j + h, k++ ) x[k] = j;
			m = x.length;
			for ( j = 1; j < m - 1; j++ ) {
				I += ((( j % 2 ) !== 0 ) ? 4 : 2 ) * f( x[j] );
			}
			I = ( h / 3 ) * ( I + f( b ));
			g[i] = I;
			h /= 2;
			i++;
		}
		a1 = g.length;
		m = 1;
		while ( a1 !== 1 ) {
			for ( j = 0; j < a1 - 1; j++ )
				h1[j] = (( Math.pow( 4, m )) * g[j + 1] - g[j] ) / ( Math.pow( 4, m ) - 1 );
			a1 = h1.length;
			g = h1;
			h1 = [];
			m++;
		}
		return g;
	},

	richardson : function( X, f, x, h ) {
		function pos( X, x ) {
			var i = 0,
				n = X.length,
				p;
			for ( ; i < n; i++ )
				if ( X[i] === x ) p = i;
			return p;
		}
		var n = X.length,
			h_min = Math.abs( x - X[pos( X, x ) + 1] ),
			i = 0,
			g = [],
			h1 = [],
			y1, y2, m, a, j;
		while ( h >= h_min ) {
			y1 = pos( X, x + h );
			y2 = pos( X, x );
			g[i] = ( f[y1] - 2 * f[y2] + f[2 * y2 - y1]) / ( h * h );
			h /= 2;
			i++;
		}
		a = g.length;
		m = 1;
		while ( a != 1 ) {
			for ( j = 0; j < a - 1; j++ )
				h1[j] = (( Math.pow( 4, m )) * g[j + 1] - g[j]) / ( Math.pow( 4, m ) - 1 );
			a = h1.length;
			g = h1;
			h1 = [];
			m++;
		}
		return g;
	},

	simpson : function( f, a, b, n ) {
		var h = ( b - a ) / n,
			I = f( a ),
			x = [],
			j = a,
			k = 0,
			i = 1,
			m;
		for ( ; j <= b; j = j + h, k++ )
			x[k] = j;
		m = x.length;
		for ( ; i < m - 1; i++ ) {
			I += (( i % 2 !== 0 ) ? 4 : 2 ) * f( x[i] );
		}
		return ( h / 3 ) * ( I + f( b ));
	},

	hermite : function( X, F, dF, value ) {
		var n = X.length,
			p = 0,
			i = 0,
			l = [],
			dl = [],
			A = [],
			B = [],
			j;
		for ( ; i < n; i++) {
			l[i] = 1;
			for ( j = 0; j < n; j++ ) {
				if ( i != j ) l[i] *= ( value - X[j] ) / ( X[i] - X[j] );
			}
			dl[i] = 0;
			for ( j = 0; j < n; j++ ) {
				if ( i != j ) dl[i] += 1 / (X [i] - X[j] );
			}
			A[i] = ( 1 - 2 * ( value - X[i] ) * dl[i] ) * ( l[i] * l[i] );
			B[i] = ( value - X[i] ) * ( l[i] * l[i] );
			p += ( A[i] * F[i] + B[i] * dF[i] );
		}
		return p;
	},

	lagrange : function( X, F, value ) {
		var p = 0,
			i = 0,
			j, l,
		n = X.length;
		for ( ; i < n; i++ ) {
			l = F[i];
			for ( j = 0; j < n; j++ ) {
				// calculating the lagrange polynomial L_i
				if ( i != j ) l *= ( value - X[j] ) / ( X[i] - X[j] );
			}
			// adding the lagrange polynomials found above
			p += l;
		}
		return p;
	},

	cubic_spline : function( X, F, value ) {
		var n = X.length,
			i = 0, j,
			A = [],
			B = [],
			alpha = [],
			c = [],
			h = [],
			b = [],
			d = [];
		for ( ; i < n - 1; i++ )
			h[i] = X[i + 1] - X[i];
		alpha[0] = 0;
		for ( i = 1; i < n - 1; i++ )
			alpha[i] = ( 3 / h[i] ) * ( F[i + 1] - F[i] ) - ( 3 / h[i-1] ) * ( F[i] - F[i-1] );
		for ( i = 1; i < n - 1; i++ ) {
			A[i] = [];
			B[i] = [];
			A[i][i-1] = h[i-1];
			A[i][i] = 2 * ( h[i - 1] + h[i] );
			A[i][i+1] = h[i];
			B[i][0] = alpha[i];
		}
		c = jStat.multiply( jStat.inv( A ), B );
		for ( j = 0; j < n - 1; j++ ) {
			b[j] = ( F[j + 1] - F[j] ) / h[j] - h[j] * ( c[j + 1][0] + 2 * c[j][0] ) / 3;
			d[j] = ( c[j + 1][0] - c[j][0] ) / ( 3 * h[j] );
		}
		for ( j = 0; j < n; j++ ) {
			if ( X[j] > value ) break;
		}
		j -= 1;
		return F[j] + ( value - X[j] ) * b[j] + jStat.sq( value-X[j] ) * c[j] + ( value - X[j] ) * jStat.sq( value - X[j] ) * d[j];
	},

	gauss_quadrature : function() {
		//TODO
	},

	PCA : function( X ) {
		var m = X.length,
			n = X[0].length,
			flag = false,
			i = 0,
			j, temp1,
			u = [],
			D = [],
			result = [],
			temp2 = [],
			Y = [],
			Bt = [],
			B = [],
			C = [],
			V = [],
			Vt = [];
		for ( i = 0; i < m; i++ ) {
			u[i] = jStat.sum( X[i] ) / n;
		}
		for ( i = 0; i < n; i++ ) {
			B[i] = [];
			for( j = 0; j < m; j++ ) {
				B[i][j] = X[j][i] - u[j];
			}
		}
		B = jStat.transpose( B );
		for ( i = 0; i < m; i++ ) {
			C[i] = [];
			for ( j = 0; j < m; j++ ) {
				C[i][j] = ( jStat.dot( [B[i]], [B[j]] )) / ( n - 1 );
			}
		}
		result = jStat.jacobi( C );
		V = result[0];
		D = result[1];
		Vt = jStat.transpose( V );
		for ( i = 0; i < D.length; i++ ) {
			for ( j = i; j < D.length; j++ ) {
				if( D[i] < D[j] )  {
					temp1 = D[i];
					D[i] = D[j];
					D[j] = temp1;
					temp2 = Vt[i];
					Vt[i] = Vt[j];
					Vt[j] = temp2;
				}
			}
		}
		Bt = jStat.transpose( B );
		for ( i = 0; i < m; i++ ) {
			Y[i] = [];
			for ( j = 0; j < Bt.length; j++ ) {
				Y[i][j] = jStat.dot( [Vt[i]], [Bt[j]] );
			}
		}
		return [X, D, Vt, Y];
	}
});

// extend jStat.fn with methods that require one argument
(function( funcs ) {
	for ( var i = 0; i < funcs.length; i++ ) (function( passfunc ) {
		jStat.fn[ passfunc ] = function( arg, func ) {
			var tmpthis = this;
			// check for callback
			if ( func ) {
				setTimeout( function() {
					func.call( tmpthis, jStat.fn[ passfunc ].call( tmpthis, arg ));
				}, 15 );
				return this;
			}
			return jStat( jStat[ passfunc ]( this, arg ));
		};
	}( funcs[i] ));
}( 'add divide multiply subtract dot pow abs angle'.split( ' ' )));

}( this.jStat, Math ));
