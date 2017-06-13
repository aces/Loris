/* using JISON Lexical analysis with Flex pattern matching (http://dinosaur.compilertools.net/flex/flex_11.html) */

/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                                 /* skip whitespace */
"null"                              return 'null'
"true"                              return 'true'
"false"                             return 'false'
\d+("."\d+)?\b                      return 'NUMBER'
"*"                                 return '*'
"/"                                 return '/'
"-"                                 return '-'
"+"                                 return '+'
"^"                                 return '^'
"="                                 return '='
"!"                                 return '!'
"%"                                 return '%'
"("                                 return '('
")"                                 return ')'
","                                 return ','
[_a-zA-Z]\w*                        return 'VARIABLE'
"\""[^"]*"\""                       return 'ESTRING'
"'"[^']*"'"                         return 'STRING'
"["                                 return '['
"]"                                 return ']'
<<EOF>>                             return 'EOF'
.                                   return 'INVALID'

/lex

/* operator associations and precedence */

%left '='
%left '+' '-'
%left '*' '/'
%left '^'
%right '!'
%right '%'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : e EOF
        { return $1; }
    ;

arguments
    : e ',' arguments
        { $$ = [$1].concat($3); }
    | e
        { $$ = [$1]; }
    ;

variable
    : VARIABLE
        { $$ = yytext; }
    ;
e
    : e '=' e
        { $$ = {tag: 'BinaryOp', op: 'eq', args: [$1, $3]}; }
    | e '+' e
        { $$ = {tag: 'BinaryOp', op: 'add', args: [$1, $3]}; }
    | e '-' e
        { $$ = {tag: 'BinaryOp', op: 'sub', args: [$1, $3]}; }
    | e '*' e
        { $$ = {tag: 'BinaryOp', op: 'mul', args: [$1, $3]}; }
    | e '/' e
        { $$ = {tag: 'BinaryOp', op: 'div', args: [$1, $3]}; }
    | e '^' e
        { $$ = {tag: 'BinaryOp', op: 'pow', args: [$1, $3]}; }
    | e '%' e
        { $$ = {tag: 'BinaryOp', op: 'mod', args: [$1, $3]}; }
    | '-' e %prec UMINUS
        { $$ = {tag: 'UnaryOp', op: 'negate', args: [$2]}; }
    | '(' e ')'
        { $$ = {tag: 'NestedExpression', args: [$2]}; }
    | variable '(' arguments ')'
        { $$ = {tag: 'FuncApplication', args:[$1, $3]}; }
    | "[" variable "]"
        { $$ = {tag: 'Variable', args: [$2]}; }
    | NUMBER
        { $$ = {tag: 'Literal', args: [Number(yytext)]}; }
    | STRING
        { $$ = {tag: 'Literal', args: [String(yytext)]}; }
    | ESTRING
        { $$ = {tag: 'EscapedString', args: [String(yytext)]}; }
    | 'false'
        { $$ = {tag: 'Literal', args: [false]}; }
    | 'true'
        { $$ = {tag: 'Literal', args: [true]}; }
    | 'null'
        { $$ = {tag: 'Literal', args: [null]}; }
    ;
