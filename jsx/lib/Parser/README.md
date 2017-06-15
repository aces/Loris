# Parser

The Parser provides a human readable syntax for front end equation building.

This Readme breaks down the different parts of the Parser and lists syntax rules.

# Prerequisites for Development

 * [momentJS](https://momentjs.com/)
 * [Jison](jison.org) (only required for changes in syntax)

 Note that end users do not require Jison, only the Jison-generated parser file.
 
# Development and Use

### Syntax and Operator Changes
Changing syntax (or adding unary/binary operators) requires changes to `jison/logicParser.jison`. 
Tokens are defined at the top, precedence and assertions are set below that, 
and finally the grammar itself is defined below that. 
See Jison documentation for grammar and Flex pattern matchign specifications.

After your changes are made run `jison jison/logicParser.jison` and replace `js/logicParser.js` with the outputted file.

### Function Changes
To add or edit functions, simply edit `js/Functions.js`.

### Evaluator Changes
To add new types of operations, add a case to the switch statement in `js/Evaluator.js`.

### Unit Testing
Tests can be added to `Loris/test/js-tests/Parser.test.js`. Run tests with `npm run tests:unit:js:watch`.

### Use
At the top of your JS file add `import { Evaluator } from './jsx/lib/Parser';` (change the path based on your directory location).

Call `Evaluator(LOGIC_STRING)` to evaluate an equation.

# Syntax
Note that all whitespace (spaces or tabs) is ignored in the parser.

### Value Inputs
| Type              	| Syntax                 	| Notes                                              	|
|-------------------	|------------------------	|----------------------------------------------------	|
| number            	| 1; 900; 123.456          	|                                                    	|
| text              	| "this is my text!_123" 	| empty text is supported; ' can be used instead of " 	|
| variable          	| [my_variable_name]     	|                                                    	|
| nested expression 	| (expression)           	|                                                    	|

### Constants
| Constant           	| Syntax 	|
|--------------------	|--------	|
| null               	| null   	|
| true               	| true   	|
| false              	| false  	|
| Euler's number (e) 	| E      	|
| pi                 	| PI     	|

### Numerical Operations
| Operation 	| Syntax 	| Notes                                                             	|
|-----------	|--------	|--------------------------------------------------------------------   |
| add       	| a + b  	| can be used to concatenate strings                                  	|
| subtract  	| a - b  	|                                                                    	|
| negate    	| - a    	|                                                                    	|
| multiply  	| a * b  	|                                                                     	|
| divide    	| a / b  	| cannot divide by 0                                                	|
| exponent  	| a ^ b  	|                                                                     	|
| percentage  	| a %   	| divides the value of a by 100                                         |
| factorial  	| a !   	| returns a factorial; supports 0 or positive numbers divisible by 0.5  |

### Boolean/Comparison Operations (returns true or false)
| Operation        	| Syntax  	| Notes                            	|
|------------------	|---------	|----------------------------------	|
| equivalency      	| a = b   	|                                  	|
| inequivalency    	| a <> b  	|                                  	|
| greater than     	| a > b   	|                                  	|
| less than        	| a < b   	|                                  	|
| greater or equal 	| a >= b  	|                                  	|
| less or equal    	| a <= b  	|                                  	|
| and              	| a and b 	| returns true if a and b are true 	|
| or               	| a or b  	| returns true if a or b is true   	|
| not              	| not a   	| returns true if a is false       	|

### If Logic
| Operation 	| Syntax       	| Notes                                                                            	|
|-----------	|--------------	|----------------------------------------------------------------------------------	|
| if        	| if(cond,x,y) 	| If the condition 'cond' evaluates to true, x is returned. If not, y is returned. 	|

### Functions
| Operation          	| Syntax               	| Notes                                                                                	|
|--------------------	|----------------------	|--------------------------------------------------------------------------------------	|
| not a number       	| isNaN(a)             	| returns true if a is not a number                                                    	|
| modulo             	| mod(a, b)            	| returns the remainder of a / b                                                       	|
| round              	| round(a, b)          	| rounds a to b decimal places; note all rounding functions support trailing 0s        	|
| round up           	| roundup(a, b)        	| rounds a up to b decimal places                                                      	|
| round down         	| rounddown(a,b)       	| rounds a down to b decimal places                                                    	|
| square root        	| sqrt(a)              	|                                                                                      	|
| absolute value     	| abs(a)               	| returns the positive value of a                                                      	|
| minimum            	| min(a,b,c,d...)      	| returns the smallest value of its arguments                                          	|
| maximum            	| max(a,b,c,d...)      	| returns the largest value of its arguments                                           	|
| mean               	| mean(a,b,c,d...)     	| returns the average value of its arguments                                           	|
| median             	| median(a,b,c,d...)   	| sorts its arguments in ascending order and returns the median                        	|
| sum                	| sum(a,b,c,d...)      	| returns the sum of its arguments                                                     	|
| product            	| product(a,b,c,d...)  	| returns the product of its arguments                                                 	|
| variance           	| variance(a,b,c,d...) 	| returns the population variance of its arguments                                     	|
| standard deviation 	| stdev(a,b,c,d...)    	| returns the population standard deviation (square root of variance) of its arguments 	|

### Date Operations
| Operation       	| Syntax                                        	|
|-----------------	|-----------------------------------------------	|
| date difference 	| datediff(date1, date2, units, format, signed) 	|

| Argument     	| Syntax                                	| Notes                                                                                                                                     	|
|--------------	|---------------------------------------	|-------------------------------------------------------------------------------------------------------------------------------------------	|
| date         	| "YYYY-MM-DD HH:MM:SS" or "YYYY-MM-DD" 	| valid formats for date include YMD (default/ISO standard), MDY, DMY; note that time is optional                                           	|
|              	| "YYYY-MM" or "MM-YYYY"                   	| note that day and time together are optional for all formats                                                                               	|
|              	| "YYYY"                                	| note that month, day, and time together are optional for all formats                                                                      	|
| units        	| "y","M","d","h","m","s"               	| specifies the return value unit: years, months, days, hours, minutes, and seconds respectively. Any other input will return milliseconds. 	|
| format       	| "ymd", "mdy". "dmy"                   	| YMD is default                                                                                                                            	|
| signed       	| true/false                            	| if true, negative differences will be allowed. if false, the difference will always be positive                                           	|
| return value 	|                                       	| returns date1 - date 2 in the specified unit                                                                                              	|
