/* using JISON Lexical analysis with Flex pattern matching (http://dinosaur.compilertools.net/flex/flex_11.html) */

/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                                 /* skip whitespace */
"null"                              return 'null'
"true"                              return 'true'
"false"                             return 'false'
"E"                                 return 'E'
"PI"                                return 'PI'
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
"<>"								return '<>'
"<="								return '<='
">="								return '>='
"<"                                 return '<'
">"                                 return '>'
"and"                               return 'and'
"or"                                return 'or'
"not"                               return 'not'
[_a-zA-Z0-9]\w*                     return 'VARIABLE'
"\""[^"]*"\""                       return 'ESTRING'
"'"[^']*"'"                         return 'STRING'
"["                                 return '['
"]"                                 return ']'
<<EOF>>                             return 'EOF'
.                                   return 'INVALID'

/lex

/* operator associations and precedence */

%left 'and' 'or'
%right 'not'
%left '=' '<' '>' '<>' '<=' '>='
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

constant
    : 'E'
        { $$ = Math.E; } //
    | 'PI'
        { $$ = Math.PI; } //
    ;

accessors
    : '[' variable ']' accessors
        { $$ = [$2].concat($4); } //
    | '[' variable '(' NUMBER ')' ']' accessors
        { $$ = [$2].concat($4, $7); } //
    | '[' variable '(' variable ')' ']' accessors
        { $$ = [$2].concat($4, $7); } //
    | '[' variable '(' NUMBER ')' ']'
        { $$ = [$2].concat($4); } //
    | '[' variable '(' variable ')' ']'
        { $$ = [$2].concat($4); } //
    | '[' variable ']'
        { $$ = [$2]; }
    ;
e
    : e '=' e
        { $$ = {tag: 'BinaryOp', op: 'eq', args: [$1, $3]}; } //
    | e '<' e
        { $$ = {tag: 'BinaryOp', op: 'lt', args: [$1, $3]}; }
    | e '>' e
        { $$ = {tag: 'BinaryOp', op: 'gt', args: [$1, $3]}; }
    | e '<>' e
        { $$ = {tag: 'BinaryOp', op: 'neq', args: [$1, $3]}; }
    | e '<=' e
        { $$ = {tag: 'BinaryOp', op: 'leq', args: [$1, $3]}; }
    | e '>=' e
        { $$ = {tag: 'BinaryOp', op: 'geq', args: [$1, $3]}; }
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
    | e 'and' e
        { $$ = {tag: 'BinaryOp', op: 'and', args: [$1, $3]}; }
    | e 'or' e
        { $$ = {tag: 'BinaryOp', op: 'or', args: [$1, $3]}; }
    | 'not' e
        { $$ = {tag: 'UnaryOp', op: 'not', args: [$2]}; }
	| e '%'
        { $$ = {tag: 'UnaryOp', op: 'per', args: [$1]}; }
    | e '!'
        { $$ = {tag: 'UnaryOp', op: 'fact', args: [$1]}; }
    | '-' e %prec UMINUS
        { $$ = {tag: 'UnaryOp', op: 'negate', args: [$2]}; }
    | '(' e ')'
        { $$ = {tag: 'NestedExpression', args: [$2]}; }
    | variable '(' arguments ')'
        { $$ = {tag: 'FuncApplication', args:[$1, $3]}; }
    | "[" variable "]" accessors
        { $$ = {tag: 'NestedVariables', args: [$2, $4]}; }
    | "[" variable "]"
        { $$ = {tag: 'Variable', args: [$2]}; }
    | "[" variable "(" NUMBER ")" "]" accessors
        { $$ = {tag: 'NestedVariables', args: [$2, [$4]]}; }
    | "[" variable "(" variable ")" "]" accessors
        { $$ = {tag: 'NestedVariables', args: [$2, [$4]]}; }
    | "[" variable "(" NUMBER ")" "]"
        { $$ = {tag: 'NestedVariables', args: [$2, [$4]]}; }
    | "[" variable "(" variable ")" "]"
        { $$ = {tag: 'NestedVariables', args: [$2, [$4]]}; }
	| constant
        { $$ = {tag: 'Literal', args: [$1]}; }
    | NUMBER
        { $$ = {tag: 'Literal', args: [Number(yytext)]}; }
    | STRING
        { $$ = {tag: 'String', args: [yytext]}; }
    | ESTRING
        { $$ = {tag: 'String', args: [yytext]}; }
    | 'false'
        { $$ = {tag: 'Literal', args: [false]}; }
    | 'true'
        { $$ = {tag: 'Literal', args: [true]}; }
    | 'null'
        { $$ = {tag: 'Literal', args: [null]}; }
    ;
