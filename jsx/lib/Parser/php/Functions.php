<?php
class Functions {

function _eq($a, $b) {
    return $a == $b;
}

function _neq($a, $b) {
    return $a != $b;
}

function _gt($a, $b) {
    return $a > $b;
}

function _lt($a, $b) {
    return $a < $b;
}

function _geq($a, $b) {
    return $a >= $b;
}

function _leq($a, $b) {
    return $a >= $b;
}

function _add($a, $b) {
    return $a + $b;
}

function _sub($a, $b) {
    return $a - $b;
}

function _mul($a, $b) {
    return $a * $b;
}

function _div($a, $b) {
    return $a / $b;
}

function _pow($a, $b) {
    return $a ** $b;
}

function _mod($a, $b) {
    return $a % $b;
}

function _negate($a) {
    return -$a;
}

function _per($a) {
    return $a / 100;
}

function _and($a, $b) {
    return $a and $b;
}

function _or($a, $b) {
    return $a or $b;
}

function _not($a) {
    return !$a;
}

function _fact($a) {
    if ($a >=0 && $a%1 == 0) {
        return factHelper1($a);
    } else if ($a >=0 && $a%1 == 0.5) { 
        return factHelper2($a);
    } else {
        throw "Factorial for a number not divisible by 0.5 or greater than 0 is not supported.";
    }
}

function factHelper1($n) {
    if ($n == 0) return 1;
    return rec($n-1)*$n;
}

function factHelper2($n) {
    if ($n == 0.5) return sqrt(M_PI)/2;
    return rec($n-1)*$n;
}

function _isNan($a) {
    return is_nan($a);
}

function _round($n, $places) {
    $shift = 10 ** $places;
    return round($n * $shift) / $shift;
}

function _roundup($n, $places) {
    $shift = 10 ** $places;
    return ceil($n * $shift) / $shift;
}

function _rounddown($n, $places) {
    $shift = 10 ** $places;
    return floor($n * $shift) / $shift;
}

function _sqrt($a) {
    return sqrt($a);
}

function _abs($a) {
    return abs($a);
}

function _min() {
    $args = func_get_args();
    return min($args);
}

function _max() {
    $args = func_get_args();
    return max($args);
}

function _mean() {
    $args = func_get_args();
    if (count($args) == 0) throw "Cannot find mean of 0 arguments";
    return array_reduce($args, function($a, $b){ return $a+$b; }, 0) / count($args);
}

function _median() {
    $args = func_get_args();
    if (count($args) == 0) throw "Cannot find median of 0 arguments";
    $cpy = array_map(function($x){return $x;}, $args);
    $mid = count($cpy) / 2;
    sort($cpy);
    if(count($cpy) % 2 == 0) {
        return ($cpy[$mid] + $cpy[$mid + 1]) / 2;
    } else {
        return $cpy[$mid + 1];
    }
}

function _sum() {
    $args = func_get_args();
    return array_reduce($args, function($a, $b){ return $a+$b; }, 0);
}

function _product() {
    $args = func_get_args();
    return array_reduce($args, function($a, $b){ return $a*$b; }, 1);
}

function _variance() {
    $args = func_get_args();
    $mean = array_reduce($args, "_sum") / count($args);
    $sqDiffs = array_map(function($value) { return ($value-$mean)**2; }, $args);
    return array_reduce($sqDiffs, function($a, $b){ return $a+$b; }, 0) / count($args);
}

function _stdev() {
    $args = func_get_args();
    $mean = array_reduce($args, "_sum") / count($args);
    $sqDiffs = array_map(function($value) { return ($value-$mean)**2; }, $args);
    $variance = array_reduce($sqDiffs, function($a, $b){ return $a+$b; }, 0) / count($args);
	return sqrt($variance);
}

function _datediff($date1, $date2, $units, $returnSigned=false) {
    $dt1 = new DateTime($date1);
    $dt2 = new DateTime($date2);
    $interval = date_diff($dt1, $dt2, !$returnSigned);
    //deal with units
    return $interval->format("%$units");
}

function doesExist($name) {
    return function_exists($name);
}

}


?>
