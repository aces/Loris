TO GENERATE PARSER RUN
$: jison logicParser.jison

TO RUN PARSER FROM COMMAND LINE RUN
$: echo $EQUATION.AS.STRING$ > testcalc
$: node logicParser.js testcalc

TO ACCESS PARSER FROM JS CODE ACCESS parse(...) command from InstrumentLogicParser.js
