<?php
/**
 * This file contains the Parser class
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Behavioural
 * @author   Unknown <example@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

namespace LORIS\LorisScript;

use \Exception;
/**
 * Parser
 *
 * @category Main
 * @package  Behavioural
 * @author   Unknown <example@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Parser
{
    private $_expression;
    private $_tokens;
    private $_offset;

    /**
     * TODO:
     *
     * @param expression $expression TODO
     *
     * @return TODO
     */
    function __construct($expression)
    {
        $this->_expression = $expression;
        $this->_tokens     = Lexer::lex($expression);
        $this->_offset     = 0;
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parse()
    {
        $ast = $this->parseBoolTerm();
        if ($ast === false) {
            throw new Exception("Cannot parse expression.");
        }
        if ($this->_offset < count($this->_tokens)) {
            throw new Exception(
                "Unexpected token(s) after: " .
                substr($this->_expression, $this->_offset)
            );
        }
        return $ast;
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function next()
    {
        $this->_offset += 1;
        if ($this->_offset > count($this->_tokens)) {
            throw new Exception("Invalid expression ending: " . $this->_expression);
        }
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function getBacktrack()
    {
        return $this->_offset;
    }

    /**
     * TODO:
     *
     * @param backtrack $backtrack TODO
     *
     * @return TODO
     */
    function backtrack($backtrack)
    {
        $this->_offset = $backtrack;
    }

    /**
     * TODO:
     *
     * @param token $token TODO
     *
     * @return TODO
     */
    function expect($token)
    {
        if ($this->_offset >= count($this->_tokens)) {
            return false;
        }
        $currentTok = $this->_tokens[$this->_offset];
        if ($currentTok['token'] !== $token) {
            return false;
        }
        return $currentTok['match'];
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseBoolTerm()
    {
        $bt   = $this->getBacktrack();
        $left = $this->parseUnaryBool();
        $filt = array_values(array_filter(["and", "or"], array($this, 'expect')));
        if (count($filt) === 0) {
            return $left;
        }
        $this->next();
        $op    = $filt[0];
        $right = $this->parseBoolTerm();
        if ($right === false) {
            $this->backtrack($bt);
            return false;
        }
        return array(
                'tag'  => 'BinaryOp',
                'op'   => $op,
                'args' => array(
                           $left,
                           $right,
                          ),
               );
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseUnaryBool()
    {
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
                'tag'  => 'UnaryOp',
                'op'   => $op,
                'args' => array($arg),
               );
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseBoolComp()
    {
        $bt   = $this->getBacktrack();
        $left = $this->parseNumTerm();
        $filt = array_values(
            array_filter(
                [
                 "=",
                 "<",
                 ">",
                 "<>",
                 "<=",
                 ">=",
                ],
                array(
                 $this,
                 'expect',
                )
            )
        );
        if (count($filt) === 0) {
            return $left;
        }
        $this->next();
        $op    = $filt[0];
        $right = $this->parseBoolComp();
        if ($right === false) {
            $this->backtrack($bt);
            return false;
        }
        return array(
                'tag'  => 'BinaryOp',
                'op'   => $op,
                'args' => array(
                           $left,
                           $right,
                          ),
               );
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseNumTerm()
    {
        $bt   = $this->getBacktrack();
        $left = $this->parseNumFactor();
        $filt = array_values(array_filter(["+", "-"], array($this, 'expect')));
        if (count($filt) === 0) {
            return $left;
        }
        $this->next();
        $op    = $filt[0];
        $right = $this->parseNumTerm();
        if ($right === false) {
            $this->backtrack($bt);
            return false;
        }
        return array(
                'tag'  => 'BinaryOp',
                'op'   => $op,
                'args' => array(
                           $left,
                           $right,
                          ),
               );
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseNumFactor()
    {
        $bt   = $this->getBacktrack();
        $left = $this->parseNumPower();
        $filt = array_values(array_filter(["*", "/"], array($this, 'expect')));
        if (count($filt) === 0) {
            return $left;
        }
        $this->next();
        $op    = $filt[0];
        $right = $this->parseNumFactor();
        if ($right === false) {
            $this->backtrack($bt);
            return false;
        }
        return array(
                'tag'  => 'BinaryOp',
                'op'   => $op,
                'args' => array(
                           $left,
                           $right,
                          ),
               );
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseNumPower()
    {
        $bt   = $this->getBacktrack();
        $left = $this->parseUnaryFact();
        $op   = $this->expect("^");
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
                'tag'  => 'BinaryOp',
                'op'   => $op,
                'args' => array(
                           $left,
                           $right,
                          ),
               );
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseUnaryFact()
    {
        $arg = $this->parseUnaryPercent();
        $op  = $this->expect("!");
        if ($op === false) {
            return $arg;
        }
        $this->next();
        return array(
                'tag'  => 'UnaryOp',
                'op'   => $op,
                'args' => array($arg),
               );
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseUnaryPercent()
    {
        $arg = $this->parseUnaryMinus();
        $op  = $this->expect("%");
        if ($op === false) {
            return $arg;
        }
        $this->next();
        return array(
                'tag'  => 'UnaryOp',
                'op'   => $op,
                'args' => array($arg),
               );
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseUnaryMinus()
    {
        $op = $this->expect("-");
        if ($op === false) {
            return $this->parseTerminal();
        }
        $this->next();
        $arg = $this->parseTerminal();
        return array(
                'tag'  => 'UnaryOp',
                'op'   => $op,
                'args' => array($arg),
               );
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseTerminal()
    {
        return (
            $this->parseFuncCall() ?:
            $this->parseVariable() ?:
            $this->parseNested() ?:
            $this->parseNumber() ?:
            $this->parseString() ?:
            $this->parseConstant()
        );
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseNested()
    {
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

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseNumber()
    {
        $num = $this->expect("NUMBER");
        if ($num === false) {
            return false;
        }
        $this->next();
        return array(
                'tag'  => 'Number',
                'args' => array($num),
               );
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseString()
    {
        $str = $this->expect("STRING");
        if ($str === false) {
            $str =$this->expect("ESTRING");
            if ($str === false) {
                return false;
            }
            $this->next();
            return array(
                    'tag'  => 'EString',
                    'args' => array($str),
                   );
        }
        $this->next();
        return array(
                'tag'  => 'String',
                'args' => array($str),
               );
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseConstant()
    {
        $filt = array_values(
            array_filter(
                [
                 "false",
                 "true",
                 "null",
                 "E",
                 "PI",
                ],
                array(
                 $this,
                 'expect',
                )
            )
        );
        if (count($filt) === 0) {
            return false;
        }
        $this->next();
        return array(
                'tag'  => 'Constant',
                'args' => array($filt[0]),
               );
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseFuncCall()
    {
        $bt   = $this->getBacktrack();
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
                'tag'  => 'FuncApplication',
                'args' => array(
                           $func,
                           $args,
                          ),
               );
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseArguments()
    {
        $bt  = $this->getBacktrack();
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

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseVariable()
    {
        $sym = $this->parseVarSymbol();
        if ($sym === false) {
            return false;
        }
        $var       = $sym['var'];
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
                    'tag'  => 'Variable',
                    'args' => array($var),
                   );
        }
        return array(
                'tag'  => 'NestedVariable',
                'args' => array(
                           $var,
                           $accessors,
                          ),
               );
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseVarSymbol()
    {
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
        return array(
                'var' => $var,
                'num' => $nest,
               );
    }

    /**
     * TODO:
     *
     * @return TODO
     */
    function parseNestedVar()
    {
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
