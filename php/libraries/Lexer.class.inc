<?php
/**
 * This file contains the Lexer class
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
 * Lexer
 *
 * @category Main
 * @package  Behavioural
 * @author   Unknown <example@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Lexer
{
    private static $_terminals = array(
                                  "/^null/"            => "null",
                                  "/^true/"            => "true",
                                  "/^false/"           => "false",
                                  "/^E/"               => "E",
                                  "/^PI/"              => "PI",
                                  "/^\d+(\.\d+)?\b/"   => "NUMBER",
                                  "/^[*]/"             => "*",
                                  "/^\//"              => "/",
                                  "/^[-]/"             => "-",
                                  "/^[+]/"             => "+",
                                  "/^\^/"              => "^",
                                  "/^[=]/"             => "=",
                                  "/^[!]/"             => "!",
                                  "/^[%]/"             => "%",
                                  "/^\(/"              => "(",
                                  "/^\)/"              => ")",
                                  "/^[,]/"             => ",",
                                  "/^\<\>/"            => "<>",
                                  "/^\<[=]/"           => "<=",
                                  "/^\>[=]/"           => ">=",
                                  "/^\</"              => "<",
                                  "/^\>/"              => ">",
                                  "/^and/"             => "and",
                                  "/^or/"              => "or",
                                  "/^not/"             => "not",
                                  "/^[_a-zA-Z0-9]\w*/" => "VARIABLE",
                                  "/^\"[^\"]*\"/"      => "ESTRING",
                                  "/^\'[^\']*\'/"      => "STRING",
                                  "/^\[/"              => "[",
                                  "/^\]/"              => "]",
                                  // Skip spaces and tabs
                                  "/^[\t ]*/"          => null,
                                 );
    /**
     * TODO:
     *
     * @param expression $expression TODO
     * @param offset     $offset     TODO
     *
     * @return TODO
     */
    static function match($expression, $offset)
    {
        $substr = substr($expression, $offset);
        foreach (static::$_terminals as $pattern => $token) {
            if (preg_match($pattern, $substr, $matches)) {
                return array(
                        'match' => $matches[0],
                        'token' => $token,
                       );
            }
        }
        return false;
    }

    /**
     * TODO:
     *
     * @param expression $expression TODO
     *
     * @return TODO
     */
    static function lex($expression)
    {
        $tokens = array();
        $offset = 0;
        while ($offset < strlen($expression)) {
            $matched = static::match($expression, $offset);
            if ($matched === false) {
                throw new Exception(
                    "Unexpected token after: " . substr($expression, $offset)
                );
            }
            // Skip spaces and tabs
            if ($matched['token'] !== null) {
                $tokens[] = $matched;
            }
            $offset += strlen($matched['match']);
        }
        return $tokens;
    }
}
?>
