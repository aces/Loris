/* using JISON Lexical analysis with Flex pattern matching (http://dinosaur.compilertools.net/flex/flex_11.html) */

/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                                 /* skip whitespace */
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
"constPi"                           return 'constPi'
"constE"                            return 'constE'
","                                 return ','
"round("                            return 'round('
"roundup("                          return 'roundup('
"rounddown("                        return 'rounddown('
"mod("                              return 'mod('
"integer("                          return 'integer('
"sqrt("                             return 'sqrt('
"abs("                              return 'abs('
"eq("                               return 'eq('
"neq("                              return 'neq('
"gt("                               return 'gt('
"lt("                               return 'lt('
"geq("                              return 'geq('
"leq("                              return 'leq('
"if("                               return 'if('
"null"                              return 'null'
"isNaN("                            return 'isNaN('
[a-zA-Z0-9_]+("_"[a-zA-Z0-9_]+)?\b  return 'LETTER' /* all functions using letters must be defined BEFORE this to avoid errors  */
"["                                 return '['
"]"                                 return ']'
"\""                                return '"'
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
        {$$ = '(' + $1 + ')' + '*' + '(' + $3 + ')';}
    | e '/' e
        {$$ = '(' + $1 + ')' + '/' + '(' + $3 + ')';}
    | e '^' e
        {$$ = 'Math.pow(' + $1 + ',' + $3 + ')';} 
    | e '%'
        {$$ = '(' + $1 + ')' + '/100';}
    | '-' e %prec UMINUS
        {$$ = '(0-(' + $2 + '))';}
    | '(' e ')'
        {$$ = '(' + $2 + ')';}
    | NUMBER
        {$$ = yytext;}
    | '[' LETTER ']'
        {$$ = 'this.' + $2;}
    | '"' LETTER '"'
        {$$ = '' + $2;}
    | '""'
        {$$ = '';}
    | null
        {$$ = null;}
    | constE
        {$$ = 'Math.E';}
    | constPi
        {$$ = 'Math.PI';}
    | 'round(' e ',' e ')'
        {$$ = 'Number((' + $2 + ').toFixed(' + $4 + '))';}
    | 'roundup(' e ')'
        {$$ = 'Math.ceil(' + $2 + ')';}
    | 'rounddown(' e ')'
        {$$ = 'Math.floor(' + $2 + ')';}
    | 'integer(' e ')'
        {$$ = 'Math.round(' + $2 + ')';}
    | 'mod(' e ',' e ')'
        {$$ = '(' + $2 + ')' + '%' + '(' + $4 + ')';}
    | 'sqrt(' e ')'
        {$$ = 'Math.sqrt(' + $2 + ')';}
    | 'abs(' e ')'
        {$$ = 'Math.abs(' + $2 + ')';}
    | 'eq(' e ',' e ')'
        {$$ = (function eq (x, y) {return x===y} ) ( /* inputs are processed on the fly here to avoid accidental inequality  */
            new Function('return ' + $2).call(),
            new Function('return ' + $4).call());}
    | 'neq(' e ',' e ')'
        {$$ = (function eq (x, y) {return x!==y} ) (
            new Function('return ' + $2).call(),
            new Function('return ' + $4).call());}
    | 'gt(' e ',' e ')'
        {$$ = (function eq (x, y) {return x>y} ) (
            new Function('return ' + $2).call(),
            new Function('return ' + $4).call());}
    | 'lt(' e ',' e ')'
        {$$ = (function eq (x, y) {return x<y} ) (
            new Function('return ' + $2).call(),
            new Function('return ' + $4).call());}
    | 'geq(' e ',' e ')'
        {$$ = (function eq (x, y) {return x>=y} ) (
            new Function('return ' + $2).call(),
            new Function('return ' + $4).call());}
    | 'leq(' e ',' e ')'
        {$$ = (function eq (x, y) {return x<=y} ) (
            new Function('return ' + $2).call(),
            new Function('return ' + $4).call());}
    | 'isNaN(' e ')'
        {$$ = isNaN($2);}
    | 'if(' e ',' e ',' e ')'
        {if ($2) {$$ = $4} else {$$ = $6};}    
    ;
