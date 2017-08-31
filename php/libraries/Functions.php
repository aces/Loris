<?php

namespace LorisScript;

function factHelper1 ($n) {
    if ($n == 0) return 1;
    return factHelper1($n-1)*$n;
}

function factHelper2 ($n) {
    if ($n == 0.5) return sqrt(M_PI)/2;
    return factHelper2($n-1)*$n;
}

function getFunctions() {
    return array(
		'_eq' => function ($a, $b) {
			return $a == $b;
		},
		'_neq' => function ($a, $b) {
			return $a != $b;
		},
		'_gt' => function ($a, $b) {
			return $a > $b;
		},
		'_lt' => function ($a, $b) {
			return $a < $b;
		},
		'_geq' => function ($a, $b) {
			return $a >= $b;
		},
		'_leq' => function ($a, $b) {
			return $a >= $b;
		},
		'_add' => function ($a, $b) {
			return $a + $b;
		},
		'_sub' => function ($a, $b) {
			return $a - $b;
		},
		'_mul' => function ($a, $b) {
			return $a * $b;
		},
		'_div' => function ($a, $b) {
			return $a / $b;
		},
		'_pow' => function ($a, $b) {
			return $a ** $b;
		},
		'_mod' => function ($a, $b) {
			return $a % $b;
		},
		'_negate' => function ($a) {
			return -$a;
		},
		'_per' => function ($a) {
			return $a / 100;
		},
		'_and' => function ($a, $b) {
			return $a and $b;
		},
		'_or' => function ($a, $b) {
			return $a or $b;
		},
		'_not' => function ($a) {
			return !$a;
		},
		'_fact' => function ($a) {
			if ($a >=0 && $a%1 == 0) {
				return factHelper1($a);
			} else if ($a >=0 && $a%1 == 0.5) {
				return factHelper2($a);
			} else {
				throw "Factorial for a number not divisible by 0.5 or greater than 0 is not supported.";
			}
		},
		'_factHelper1' => function ($n) {
			if ($n == 0) return 1;
			return rec($n-1)*$n;
		},
		'_factHelper2' => function ($n) {
			if ($n == 0.5) return sqrt(M_PI)/2;
			return rec($n-1)*$n;
		},
		'_isNan' => function ($a) {
            if (is_numeric($a)) {
                return false;
            } else return true;
		},
		'_round' => function ($n, $places = 0) {
			$shift = 10 ** $places;
			return round($n * $shift) / $shift;
		},
		'_roundup' => function ($n, $places = 0) {
            $shift = 10 ** $places;
    	    return ceil($n * $shift) / $shift;
    	},
    	'_rounddown' => function ($n, $places = 0) {
    	    $shift = 10 ** $places;
    	    return floor($n * $shift) / $shift;
    	},
    	'_sqrt' => function ($a) {
    	    return sqrt($a);
    	},
    	'_abs' => function ($a) {
    	    return abs($a);
    	},
    	'_min' => function () {
    	    $args = func_get_args();
    	    return min($args);
    	},
    	'_max' => function () {
    	    $args = func_get_args();
    	    return max($args);
    	},
    	'_mean' => function () {
    	    $args = func_get_args();
    	    if (count($args) == 0) throw "Cannot find mean of 0 arguments";
    	    return array_reduce($args, function($a, $b){ return $a+$b; }, 0) / count($args);
    	},
    	'_median' => function () {
    	    $args = func_get_args();
    	    if (count($args) == 0) throw "Cannot find median of 0 arguments";
    	    $cpy = array_map(function($x){return $x;}, $args);
    	    $mid = count($cpy) / 2;
    	    sort($cpy);
    	    if(count($cpy) % 2 == 0) {
    	        return ($cpy[$mid] + $cpy[$mid - 1]) / 2;
    	    } else {
    	        return $cpy[$mid];
    	    }
    	},
    	'_sum' => function () {
    	    $args = func_get_args();
    	    return array_reduce($args, function($a, $b){ return $a+$b; }, 0);
    	},
    	'_product' => function () {
    	    $args = func_get_args();
    	    return array_reduce($args, function($a, $b){ return $a*$b; }, 1);
    	},
    	'_variance' => function () {
    	    $args = func_get_args();
            if (count($args) == 0) return 0;
            $mean = array_reduce($args, function($a, $b){ return $a+$b; }, 0) / count($args);
            $sqDiffs = array_map(function($value) use ($mean) { return ($value-$mean)**2; }, $args);
            return array_reduce($sqDiffs, function($a, $b){ return $a+$b; }, 0) / count($args); 
        },
    	'_stdev' => function () {
    	    $args = func_get_args();
            if (count($args) == 0) return 0;
    	    $mean = array_reduce($args, function($a, $b){ return $a+$b; }, 0) / count($args); 
            $sqDiffs = array_map(function($value) use ($mean) { return ($value-$mean)**2; }, $args);
    	    $variance = array_reduce($sqDiffs, function($a, $b){ return $a+$b; }, 0) / count($args);
  	        return sqrt($variance);
    	},
    	'_datediff' => function ($date1, $date2, $units, $returnSigned=false) {
    	    $dt1 = new \DateTime($date1);
    	    $dt2 = new \DateTime($date2);
    	    $interval = date_diff($dt1, $dt2, !$returnSigned);
    	    $res;
            if ($units === 'y' || $units === 'Y') {
        	    $res = ($interval->format("%y")+$interval->format("%m")/12+$interval->format("%d")/365);
            } else if ($units === 'm' || $units === 'M') {
                $res = ($interval->format("%y")*12+$interval->format("%m")+$interval->format("%d")/30.44);
            } else if ($units === 'd' || $units === 'D') {
                $res = ($interval->format("%y")*365+$interval->format("%m")*30.44+$interval->format("%d"));
            } else {
                return 0;
            }
            if (!$returnSigned) {
                $res = abs($res);
            }
            return $res;
    	}
	);
}

function getBinary() {
    $FUNCTIONS = getFunctions();
    return array(
    	'_+' => $FUNCTIONS['_add'],
    	'_-' => $FUNCTIONS['_sub'],
    	'_=' => $FUNCTIONS['_eq'],
    	'_<>' => $FUNCTIONS['_neq'],
    	'_>' => $FUNCTIONS['_gt'],
    	'_<' => $FUNCTIONS['_lt'],
    	'_>=' => $FUNCTIONS['_geq'],
    	'_<=' => $FUNCTIONS['_leq'],
    	'_*' => $FUNCTIONS['_mul'],
    	'_/' => $FUNCTIONS['_div'],
    	'_^' => $FUNCTIONS['_pow'],
    	'_and' => $FUNCTIONS['_and'],
    	'_or' => $FUNCTIONS['_or']
	);
}

function getUnary() {
    $FUNCTIONS = getFunctions();
    return array(
    	'_!' => $FUNCTIONS['_fact'],
    	'_%' => $FUNCTIONS['_per'],
    	'_not' => $FUNCTIONS['_not'],
        '_-' => $FUNCTIONS['_negate'],
	);
}
?>
