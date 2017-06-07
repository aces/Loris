TO INSTALL JISON (FROM LORIS ROOT)
$: sudo npm install --save-dev jison

TO GENERATE PARSER RUN
$: jison logicParser.jison

TO RUN PARSER FROM COMMAND LINE RUN
$: echo $EQUATION.AS.STRING$ > testcalc
$: node logicParser.js testcalc

TO ACCESS PARSER FROM JS CODE ACCESS evaluate(logicString, context) function from InstrumentLogicParser.js
logicString: operation(s) as string
context: object with variable definitions
returns result as a number

NUMERICAL OPERATIONS (whitespace automatically ignored):
order of operations: PEMDAS (standard)
e = expression

SUM:                                                                e + e
SUBTRACT:                                                           e - e
MULTIPLY:                                                           e * e
DIVIDE:                                                             e / e
EXPONENT:                                                           e ^ e
PERCENTAGE:                                                         e %
PARENTHESES                                                         ( e )
NUMBER:                                                             e
VARIABLE:                                                           [variableName]
EULER'S NUMBER:                                                     E
PI:                                                                 PI
ROUND TO x DECIMAL PLACES (note x: can also be an expression):      ROUND( e , x )
ROUND UP:                                                           ROUNDUP( e )
ROUND DOWN:                                                         ROUNDDOWN( e )
ROUND TO NEAREST WHOLE NUMBER:                                      INTEGER( e )
MODULO:                                                             MOD( e , e )
SQUARE ROOT:                                                        SQRT( e )
ABSOLUTE VALUE:                                                     ABS( e )

BOOLEAN OPERATIONS:
e = expression

EQUALITY:                                                           EQ( e , e )
                                                                    returns true if both sides are equal, false if not
INEQUALITY:                                                         NEQ( e , e )
                                                                    returns true if both sides are inequal, false if not
GREATER THAN:                                                       GT( e1 , e2 )
                                                                    returns true if e1 > e2, false if not
LESS THAN:                                                          LT( e1 , e2 )
                                                                    returns true if e1 < e2. false it not
GREATER THAN OR EQUAL TO:                                           GEQ( e1 , e2 )
                                                                    returns true if e1 >= e2, false if not
LESS THAN OR EQUAL TO:                                              LEQ( e1, e2 )
                                                                    returns true if e1 <= e2, false if not
