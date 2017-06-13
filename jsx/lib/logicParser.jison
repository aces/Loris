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
"="                                 return '='
"<>"                                return '<>'
">="                                return '>='
"<="                                return '<='
">"                                 return '>'
"<"                                 return '<'
"if("                               return 'if('
"null"                              return 'null'
"isNaN("                            return 'isNaN('
"min("                              return 'min('
"max("                              return 'max('
"mean("                             return 'mean('
"median("                           return 'median('
"mode("                             return 'mode('
"sum("                              return 'sum('
"stdev("                            return 'stdev('
"var("								return 'var('
"product("                          return 'product('
"curdate()"                         return 'curdate()'
"curdatetime()"                     return 'curdatetime()'
"datediff("                         return 'datediff('
[a-zA-Z0-9_]+("_"[a-zA-Z0-9_]+)?\b  return 'LETTER' /* all functions using letters must be defined BEFORE this to avoid errors  */
"["                                 return '['
"]"                                 return ']'
"\""                                return '"'
":"                                 return ':'
<<EOF>>                             return 'EOF'
.                                   return 'INVALID'

/lex

/* operator associations and precedence */

%left ','
%left '=' '<=' '<' '>' '>=' '<>'
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
    | '"' NUMBER '"'
        {$$ = '' + $2;}
    | '"' NUMBER '-' NUMBER '-' NUMBER '"'
        {$$ = $2 + '-' + $4 + '-' + $6;}
    | '"' NUMBER '-' NUMBER '"'
        {$$ = $2 + '-' + $4;}
    | '"' NUMBER '-' NUMBER '-' LETTER ':' NUMBER ':' LETTER '"'
        {$$ = $2 + '-' + $4 + '-' + $6 + ':' + $8 + ':' + $10;}
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
    | e '=' e
        {$$ = "(function eq (x, y) {return x===y} ) (new Function('return ' + " + $1 + ").call(), new Function('return ' + " + $3 + ").call())";}
    | e '<>' e
        {$$ = "(function neq (x, y) {return x!==y} ) (new Function('return ' + " + $1 + ").call(), new Function('return ' + " + $3 + ").call())";}
    | e '>' e
        {$$ = "(function gt (x, y) {return x>y} ) (new Function('return ' + " + $1 + ").call(), new Function('return ' + " + $3 + ").call())";}
    | e '<' e
        {$$ = "(function lt (x, y) {return x<y} ) (new Function('return ' + " + $1 + ").call(), new Function('return ' + " + $3 + ").call())";}
    | e '>=' e
        {$$ = "(function geq (x, y) {return x>=y} ) (new Function('return ' + " + $1 + ").call(), new Function('return ' + " + $3 + ").call())";}
    | e '<=' e
        {$$ = "(function leq (x, y) {return x<=y} ) (new Function('return ' + " + $1 + ").call(), new Function('return ' + " + $3 + ").call())";}
    | 'isNaN(' e ')'
        {$$ = 'isNaN(' + $2 + ')';}
    | 'if(' e ')'
        {$$ = '(function ifel (x, y, z) {if (x) {return y} else {return z}} ) (' + $2[0] + ',' + $2[1] + ',' +  $2[2] + ')';}
    | e ',' e
        {if (Array.isArray($1)) {
            $1.push($3);
            $$ = $1;
        } else {
            $$ = [$1, $3];
        };}
    | 'min(' e ')'
        {$$ = '(function min (x) {if (Array.isArray(x)) {return Math.min.apply(null, x)} else {return x}}) ([' + $2 + '])';}
    | 'max(' e ')'
        {$$ = '(function max (x) {if (Array.isArray(x)) {return Math.max.apply(null, x)} else {return x}}) ([' + $2 + '])';}
    | 'sum(' e ')'
        {$$ = '(function sum (x) {if (Array.isArray(x)) {return x.reduce((a,b) => Number(a) + Number(b), 0)} else {return x}}) ([' + $2 + '])';}
    | 'mean(' e ')'
        {$$ = '(function mean (x) {if (Array.isArray(x)) {return x.reduce((a,b) => Number(a) + Number(b), 0)/(x.length)} else {return x}}) ([' + $2 + '])';}
    | 'product(' e ')'
        {$$ = '(function prod (x) {if (Array.isArray(x)) {return x.reduce((a,b) => Number(a) * Number(b), 1)} else {return x}})([' + $2 + '])';}
    | 'median(' e ')'
        {$$ = '(function med (x) {if (Array.isArray(x)) {x.sort((a,b) => Number(a) - Number(b)); return (Number(x[Math.floor((x.length-1)/2)]) + Number(x[Math.ceil((x.length-1)/2)]))/2} else {return x}}) ([' + $2 + '])';}
    | 'var(' e ')'
        {$$ = '(function vrn (x) {if (Array.isArray(x)) {var mean = (x.reduce((a,b)=>Number(a)+Number(b),0))/(x.length); var sqDevs=[]; for(i = 0; i<x.length; i++){sqDevs[i] = Math.pow((Number(x[i])-mean),2);}; return sqDevs.reduce((a,b) => Number(a) + Number(b), 0)/(sqDevs.length)} else {return 0}}) ([' + $2 + '])';}
    | 'stdev(' e ')'
        {$$ = '(function std (x) {if (Array.isArray(x)) {var mean = (x.reduce((a,b)=>Number(a)+Number(b),0))/(x.length); var sqDevs=[]; for(i = 0; i<x.length; i++){sqDevs[i] = Math.pow((Number(x[i])-mean),2);}; return Math.sqrt(sqDevs.reduce((a,b) => Number(a) + Number(b), 0)/(sqDevs.length))} else {return 0}}) ([' + $2 + '])';}
    | 'curdate()'
        {var today = new Date(); $$ = today.toISOString().slice(0,10);} 
    | 'curdatetime()'
        {var today = new Date(); $$ = today.toISOString();}
    | 'datediff(' e ')'
        {var signedDiff;
        if ($2[3]==='0') {
            signedDiff = 'Math.abs(' + '(new Date("' + $2[0] + '") - new Date("' +$2[1] + '")' + '))';
        } else {
            signedDiff = '( + new Date("' + $2[0] + '") - new Date("' + $2[1] + '"))'
        }
        var conv = 1;
        if ($2[2] === 'y') {
            conv = 31556952000;
        } else if($2[2] === 'mo') {
            conv = 2630016000;
        } else if($2[2] === 'd') {
            conv = 86400000;
        } else if($2[2] === 'h') {
            conv = 3600000;
        } else if($2[2] === 'm') {
            conv = 60000;
        } else if($2[2] === 's') {
            conv = 1000;
        } else {
            conv = 1;
        }
        $$ = signedDiff + '/' + conv;
        }
    ;
