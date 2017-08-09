<?php
    class Lexer {
        private static $terminals = array(
            "/^null/" => "null",
            "/^true/" => "true",
            "/^false/" => "false",
            "/^E/" => "E",
            "/^PI/" => "PI",
            "/^\d+(\.\d+)?\b/" => "NUMBER",
            "/^[*]/" => "*",
            "/^\//" => "/",
            "/^[-]/" => "-",
            "/^[+]/" => "+",
            "/^\^/" => "^",
            "/^[=]/" => "=",
            "/^[!]/" => "!",
            "/^[%]/" => "%",
            "/^\(/" => "(",
            "/^\)/" => ")",
            "/^[,]/" => ",",
            "/^\<\>/" => "<>",
            "/^\<[=]/" => "<=",
            "/^\>[=]/" => ">=",
            "/^\</" => "<",
            "/^\>/" => ">",
            "/^and/" => "and",
            "/^or/" => "or",
            "/^not/" => "not",
            "/^[_a-zA-Z0-9]\w*/" => "VARIABLE",
            "/^\"[^\"]*\"/" => "ESTRING",
            "/^\'[^\']*\'/" => "STRING",
            "/^\[/" => "[",
            "/^\]/" => "]",
            "/^[\t ]*/" => null, // Skip spaces and tabs
        );
        static function match($expression, $offset) {
            $substr = substr($expression, $offset);
            foreach(static::$terminals as $pattern => $token) {
                if (preg_match($pattern, $substr, $matches)) {
                    return array(
                        'match' => $matches[0],
                        'token' => $token,
                    );
                }
            }
            return false;
        }
        static function lex($expression) {
            $tokens = array();
            $offset = 0;
            while($offset < strlen($expression)) {
                $matched = static::match($expression, $offset);
                if ($matched === false) {
                    throw new Exception("Unexpected token after: " . substr($expression, $offset));
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
