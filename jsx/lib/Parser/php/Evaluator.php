<?php
include 'Functions.php';
include 'logicParser.php';

class Evaluator {

function evalAST($tree, $scope) {
    $functions = new Functions;
    switch($tree['tag']) {
        case 'String':
            return substr((string)$tree['args'][0],1,-1);
        case 'Literal':
            return $tree['args'][0];
        case 'Variable':
            if (defined($scope[$tree['args'][0]])) {
                return $scope[$tree['args'][0]];
            }
            throw `Unbound variable: {$tree['args'][0]}`;
        case 'NestedVariable':
            if (defined($scope[$tree['args'][0]])) {
                $res = $scope[$tree['args'][0]];
                $i = 0;
                for($i; $i < count($tree['args'][1]); $i++) {
                    if (!defined($res[$tree['args'][1][i]]))
                        throw `Unbound sub-variableL {$tree['args'][1][i]}`;
                }
                return $res;
            }
            throw `Unbound variable: {$tree['args'][0]}`;
        case 'FuncApplication':
            if ($tree['args'][0] == 'if') {
                if (evalAST($tree['args'][1][0], $scope)) {
                    return evalAST($tree['args'][1][1]);
                }
                return evalAST($tree['args'][1][2]);
            }
            if (!$functions->doesExist('_'.$tree['args'][0])) {
                throw `{$tree['args'][0]} is not a defined function.`;
            }
            $funcArgs = array_map(function($a){return evalAST($a, $scope);},$tree['args'][1]);
            $funcName = '_'.$tree['args'][0];
            return $functions->$funcName(...$funcArgs);
        case 'NestedExpression':
            return evalAST($tree['args'][0], $scope);
        case 'UnaryOp':
            $funcName = '_'.$tree['op'];
            return $functions->$funcName(evalAST($tree['args'][0],$scope));
        case 'BinaryOp':
            $funcArgs = array_map(function($a){return evalAST($a, $scope);}, $tree['args']);
            $funcName = '_'.$tree['op'];
            return $functions->$funcName(...$funcArgs);
    }
}

function Evaluator($stringExpression, $scope) {
    $parser = new logicParser;
    $tree = $parser->parse($stringExpression);
    return evalAST($tree, $scope);
}
}
?>
