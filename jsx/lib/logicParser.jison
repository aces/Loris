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
    | e '!'
        {
          if ($1 >= 0 && $1%1 == 0) {
              $$ = '(function fact (n) { return n==0 ? 1 : fact(n-1) * n })(' + $1 + ')';
          } else if ($1 >= 0 && $1%1 == 0.5) {
              $$ = '(function fact (n) { return n==0.5 ? Math.sqrt(Math.PI)/2 : fact(n-1) * n })(' + $1 + ')';
          } else {
              $$ = '0'; //NEED TO REPLACE THIS WITH ERROR
          }
        }
    | e '%'
        {$$ = $1 + '/100';}
    | '-' e %prec UMINUS
        {$$ = '(0-' + $2 + ')';}
    | '(' e ')'
        {$$ = '' + $2;}
    | NUMBER
        {$$ = '' + Number(yytext);}
    | '[' LETTER ']'
        {$$ = '$' + $2;}
    | E
        {$$ = 'Math.E';}
    | PI
        {$$ = 'Math.PI';}
    | 'ROUND(' e ',' e ')'
        {$$ = $2 + '.toFixed(' + $4 + ')';}
    | 'ROUNDUP(' e ')'
        {$$ = 'Math.ceil(' + $2 + ')';}
    | 'ROUNDDOWN(' e ')'
        {$$ = 'Math.floor(' + $2 + ')';}
    | 'INTEGER(' e ')'
        {$$ = $2 + '.toFixed(0)';}
    | 'MOD(' e ',' e ')'
        {$$ = $2 + '%' + $4;}
    | 'SQRT(' e ')'
        {$$ = 'Math.sqrt(' + $2 + ')';}
    ;

