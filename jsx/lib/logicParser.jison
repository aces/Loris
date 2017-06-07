/* using JISON Lexical analysis with Flex pattern matching (http://dinosaur.compilertools.net/flex/flex_11.html) */

/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b                return 'NUMBER'
"*"                                 return '*'
"/"                                 return '/'
"-"                                 return '-'
"+"                                 return '+'
"^"                                 return '^'
"!"                                 return '!'
"%"                                 return '%'
"("                                 return '('
")"                                 return ')'
"PI"                                return 'PI'
"E"                                 return 'E'
","                                 return ','
"ROUND("                            return 'ROUND('
"ROUNDUP("                          return 'ROUNDUP('
"ROUNDDOWN("                        return 'ROUNDDOWN('
"MOD("                              return 'MOD('
"INTEGER("                          return 'INTEGER('
"SQRT("                             return 'SQRT('
"ABS("                              return 'ABS('
"EQ("                               return 'EQ('
"NEQ("                              return 'NEQ('
"GT("                               return 'GT('
"LT("                               return 'LT('
"GEQ("                              return 'GEQ('
"LEQ("                              return 'LEQ('
[a-zA-Z0-9_]+("_"[a-zA-Z0-9_]+)?\b  return 'LETTER'
"["                                 return '['
"]"                                 return ']'
<<EOF>>                             return 'EOF'
.                                   return 'INVALID'

/lex

/* operator associations and precedence */

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
        { typeof console !== 'undefined' ? console.log($1) : print($1);
          return $1; }
    ;

e
    : e '+' e
        {$$ = $1 + '+' + $3;}
    | e '-' e
        {$$ = $1 + '-' + $3;}
    | e '*' e
        {$$ = $1 + '*' + $3;}
    | e '/' e
        {$$ = $1 + '/' + $3;}
    | e '^' e
        {$$ = 'Math.pow(' + $1 + ',' + $3 + ')';} 
    | e '%'
        {$$ = $1 + '/100';}
    | '-' e %prec UMINUS
        {$$ = '(0-' + $2 + ')';}
    | '(' e ')'
        {$$ = '(' + $2 + ')';}
    | NUMBER
        {$$ = yytext;}
    | '[' LETTER ']'
        {$$ = 'this.' + $2;}
    | E
        {$$ = 'Math.E';}
    | PI
        {$$ = 'Math.PI';}
    | 'ROUND(' e ',' e ')'
        {$$ = 'Number((' + $2 + ').toFixed(' + $4 + '))';}
    | 'ROUNDUP(' e ')'
        {$$ = 'Math.ceil(' + $2 + ')';}
    | 'ROUNDDOWN(' e ')'
        {$$ = 'Math.floor(' + $2 + ')';}
    | 'INTEGER(' e ')'
        {$$ = 'Math.round(' + $2 + ')';}
    | 'MOD(' e ',' e ')'
        {$$ = '(' + $2 + ')' + '%' + $4;}
    | 'SQRT(' e ')'
        {$$ = 'Math.sqrt(' + $2 + ')';}
    | 'ABS(' e ')'
        {$$ = 'Math.abs(' + $2 + ')';}
    | 'EQ(' e ',' e ')'
        {$$ = (function eq (x, y) {return x===y} ) (
            new Function('return ' + $2).call(),
            new Function('return ' + $4).call());}
    | 'NEQ(' e ',' e ')'
        {$$ = (function eq (x, y) {return x!==y} ) (
            new Function('return ' + $2).call(),
            new Function('return ' + $4).call());}
    | 'GT(' e ',' e ')'
        {$$ = (function eq (x, y) {return x>y} ) (
            new Function('return ' + $2).call(),
            new Function('return ' + $4).call());}
    | 'LT(' e ',' e ')'
        {$$ = (function eq (x, y) {return x<y} ) (
            new Function('return ' + $2).call(),
            new Function('return ' + $4).call());}
    | 'GEQ(' e ',' e ')'
        {$$ = (function eq (x, y) {return x>=y} ) (
            new Function('return ' + $2).call(),
            new Function('return ' + $4).call());}
    | 'LEQ(' e ',' e ')'
        {$$ = (function eq (x, y) {return x<=y} ) (
            new Function('return ' + $2).call(),
            new Function('return ' + $4).call());}
    ;
