<?php
    namespace LorisScript;

    class Parser {
        private $expression;
        private $tokens;
        private $offset;
        function __construct($expression) {
            $this->expression = $expression;
            $this->tokens = Lexer::lex($expression);
            $this->offset = 0;
        }
        function parse() {
            $ast = $this->parseBoolTerm();
            if ($ast === false) {
                throw new Exception("Cannot parse expression.");
            }
            if ($this->offset < count($this->tokens)) {
                throw new Exception("Unexpected token(s) after: " . substr($this->expression, $this->offset));
            }
            return $ast;
        }
        function next() {
            $this->offset += 1;
            if ($this->offset > count($this->tokens)) {
                throw new Exception("Invalid expression ending: " . $this->expression);
            }
        }
        function getBacktrack() {
          return $this->offset;
        }
        function backtrack($backtrack) {
          $this->offset = $backtrack;
        }
        function expect($token) {
            if ($this->offset >= count($this->tokens)) {
                return false;
            }
            $currentTok = $this->tokens[$this->offset];
            if ($currentTok['token'] !== $token) {
                return false;
            }
            return $currentTok['match'];
        }
        function parseBoolTerm() {
            $bt = $this->getBacktrack();
            $left = $this->parseUnaryBool();
            $filt = array_values(array_filter(["and","or"], array($this, 'expect')));
            if (count($filt) === 0) {
                return $left;
            }
            $this->next();
            $op = $filt[0];
            $right = $this->parseBoolTerm();
            if ($right === false) {
                $this->backtrack($bt);
                return false;
            }
            return array(
                'tag' => 'BinaryOp',
                'op' => $op,
                'args' => array($left, $right),
            );
        }
        function parseUnaryBool() {
            $bt = $this->getBacktrack();
            $op = $this->expect("not");
            if ($op === false) {
                return $this->parseBoolComp();
            }
            $this->next();
            $arg = $this->parseBoolComp();
            if ($arg === false) {
                $this->backtrack($bt);
                return false;
            }
            return array(
                'tag' => 'UnaryOp',
                'op' => $op,
                'args' => array($arg),
            );
        }
        function parseBoolComp() {
            $bt = $this->getBacktrack();
            $left = $this->parseNumTerm();
            $filt = array_values(array_filter(["=", "<", ">", "<>", "<=", ">="], array($this, 'expect')));
            if (count($filt) === 0) {
                return $left;
            }
            $this->next();
            $op = $filt[0];
            $right = $this->parseBoolComp();
            if ($right === false) {
                $this->backtrack($bt);
                return false;
            }
            return array(
                'tag' => 'BinaryOp',
                'op' => $op,
                'args' => array($left, $right),
            );
        }
        function parseNumTerm() {
            $bt = $this->getBacktrack();
            $left = $this->parseNumFactor();
            $filt = array_values(array_filter(["+", "-"], array($this, 'expect')));
            if (count($filt) === 0) {
                return $left;
            }
            $this->next();
            $op = $filt[0];
            $right = $this->parseNumTerm();
            if ($right === false) {
                $this->backtrack($bt);
                return false;
            }
            return array(
                'tag' => 'BinaryOp',
                'op' => $op,
                'args' => array($left, $right),
            );
        }
        function parseNumFactor() {
            $bt = $this->getBacktrack();
            $left = $this->parseNumPower();
            $filt = array_values(array_filter(["*", "/"], array($this, 'expect')));
            if (count($filt) === 0) {
                return $left;
            }
            $this->next();
            $op = $filt[0];
            $right = $this->parseNumFactor();
            if ($right === false) {
                $this->backtrack($bt);
                return false;
            }
            return array(
                'tag' => 'BinaryOp',
                'op' => $op,
                'args' => array($left, $right),
            );
        }
        function parseNumPower() {
            $bt = $this->getBacktrack();
            $left = $this->parseUnaryFact();
            $op = $this->expect("^");
            if ($op === false) {
                return $left;
                }
            $this->next();
            $right = $this->parseNumPower();
            if ($right === false) {
                $this->backtrack($bt);
                return false;
            }
            return array(
                'tag' => 'BinaryOp',
                'op' => $op,
                'args' => array($left, $right),
            );
        }
        function parseUnaryFact() {
            $arg = $this->parseUnaryPercent();
            $op = $this->expect("!");
            if ($op === false) {
                return $arg;
            }
            $this->next();
            return array(
                'tag' => 'UnaryOp',
                'op' => $op,
                'args' => array($arg),
            );
        }
        function parseUnaryPercent() {
            $arg = $this->parseUnaryMinus();
            $op = $this->expect("%");
            if ($op === false) {
                return $arg;
            }
            $this->next();
            return array(
                'tag' => 'UnaryOp',
                'op' => $op,
                'args' => array($arg),
            );
        }
        function parseUnaryMinus() {
            $op = $this->expect("-");
            if ($op === false) {
                return $this->parseTerminal();
            }
            $this->next();
            $arg = $this->parseTerminal();
            return array(
                'tag' => 'UnaryOp',
                'op' => $op,
                'args' => array($arg),
            );
        }
        function parseTerminal() {
            return (
                $this->parseFuncCall() ?:
                $this->parseVariable() ?:
                $this->parseNested() ?:
                $this->parseNumber() ?:
                $this->parseString() ?:
                $this->parseConstant()
            );
        }
        function parseNested() {
            $bt = $this->getBacktrack();
            if ($this->expect("(") === false) {
                return false;
            }
            $this->next();
            $expr = $this->parseBoolTerm();
            if ($expr === false) {
                $this->backtrack($bt);
                return false;
            }
            if ($this->expect(")") === false) {
                $this->backtrack($bt);
                return false;
            }
            $this->next();
            return $expr;
        }
        function parseNumber() {
            $num = $this->expect("NUMBER");
            if ($num === false) {
                return false;
            }
            $this->next();
            return array(
                'tag' => 'Number',
                'args' => array($num),
            );
        }
        function parseString() {
            $str = $this->expect("STRING");
            if ($str === false) {
                $str =$this->expect("ESTRING");
                if ($str === false) {
                    return false;
                }
                $this->next();
                return array(
                    'tag' => 'EString',
                    'args' => array($str),
                );
            }
            $this->next();
            return array(
                'tag' => 'String',
                'args' => array($str),
            );
        }
        function parseConstant() {
            $filt = array_values(array_filter(["false", "true", "null", "E", "PI"], array($this, 'expect')));
            if (count($filt) === 0) {
                return false;
            }
            $this->next();
            return array(
                'tag' => 'Constant',
                'args' => array($filt[0]),
            );
        }
        function parseFuncCall() {
            $bt = $this->getBacktrack();
            $func = $this->expect("VARIABLE");
            if ($func === false) {
                return false;
            }
            $this->next();
            if ($this->expect("(") === false) {
                $this->backtrack($bt);
                return false;
            }
            $this->next();
            $args = $this->parseArguments();
            if ($this->expect(")") === false) {
                $this->backtrack($bt);
                return false;
            }
            $this->next();
            return array(
                'tag' => 'FuncApplication',
                'args' => array($func, $args),
            );
        }
        function parseArguments() {
            $bt = $this->getBacktrack();
            $arg = $this->parseBoolTerm();
            if ($arg === false) {
                return [];
            }
            if ($this->expect(",") === false) {
                return [$arg];
            }
            $this->next();
            $nextArgs = $this->parseArguments();
            if ($nextArgs === false) {
                $this->backtrack($bt);
                return false;
            }
            return array_merge([$arg], $nextArgs);;
        }
        function parseVariable() {
            $sym = $this->parseVarSymbol();
            if ($sym === false) {
                return false;
            }
            $var = $sym['var'];
            $accessors = isset($sym['num']) ? [$sym['num']] : [];
            while ($access = $this->parseVarSymbol()) {
                if (isset($access['var'])) {
                    $accessors[] = $access['var'];
                }
                if (isset($access['num'])) {
                    $accessors[] = $access['num'];
                }
            };
            if (count($accessors) === 0) {
                return array(
                    'tag' => 'Variable',
                    'args' => array($var),
                );
            }
            return array(
                'tag' => 'NestedVariable',
                'args' => array($var, $accessors),
            );
        }
        function parseVarSymbol() {
            $bt = $this->getBacktrack();
            if ($this->expect("[") === false) {
                return false;
            }
            $this->next();
            $var = $this->expect("VARIABLE");
            if ($var === false) {
                $this->backtrack($bt);
                return false;
            }
            $this->next();
            $nest = $this->parseNestedVar();
            if ($this->expect("]") === false) {
                $this->backtrack($bt);
                return false;
            }
            $this->next();
            if ($nest === false) {
                return array('var' => $var);
            }
            return array('var' => $var, 'num' => $nest);
        }
        function parseNestedVar() {
            $bt = $this->getBacktrack();
            if ($this->expect("(") === false) {
                $this->backtrack($bt);
                return false;
            }
            $this->next();
            $nest = $this->expect("NUMBER");
            if ($nest === false) {
                $nest = $this->expect("VARIABLE");
                if ($nest === false) {
                    $this->backtrack($bt);
                    return false;
                }
            }
            $this->next();
            if ($this->expect(")") === false) {
                $this->backtrack($bt);
                return false;
            }
            $this->next();
            return $nest;
        }
    }
?>
