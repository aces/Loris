<?php
/* vim: set expandtab tabstop=4 shiftwidth=4: */
// +----------------------------------------------------------------------+
// | PHP version 4.0                                                      |
// +----------------------------------------------------------------------+
// | Copyright (c) 1997-2003 The PHP Group                                |
// +----------------------------------------------------------------------+
// | This source file is subject to version 2.0 of the PHP license,       |
// | that is bundled with this package in the file LICENSE, and is        |
// | available at through the world-wide-web at                           |
// | http://www.php.net/license/2_02.txt.                                 |
// | If you did not receive a copy of the PHP license and are unable to   |
// | obtain it through the world-wide-web, please send a note to          |
// | license@php.net so we can mail you a copy immediately.               |
// +----------------------------------------------------------------------+
// | Author: Alexey Borzov <avb@php.net>                                  |
// +----------------------------------------------------------------------+
//
// $Id: RequiredIfGroup.inc,v 3.0 2004/03/25 20:33:34 jharlap Exp $

require_once 'HTML/QuickForm/Rule.php';

/**
 * Rule to require an element only if another element matches a given
 * value - applicable to groups
 * 
 * The most common usage for this is to have one [checkbox] element
 * that "turns on" a set of other elements.
 * 
 * @access public
 * @package HTML_QuickForm
 * @version $Revision: 3.0 $
 */
class HTML_QuickForm_Rule_RequiredIfGroup extends HTML_QuickForm_Rule
{

    // define the set of valid operators
    var $validOperators = array('==', '===', '!=', '<>', '!==', '<', '>', '<=', '>=');

    function validate($group, $format)
    {
        // make sure $format is a properly structure array
        if(!is_array($format)
           || !isset($format['element'])
           || !isset($format['controller'])
           ) {
            return array($group, "format argument must be an array, containing keys 'element' and 'controller', and optionally 'operator' and 'value'");
        }
        
        // default operator and value to != ''
        if(empty($format['operator'])) $format['operator'] = '!=';
        if(empty($format['value']))    $format['value']    = '';

        // confirm that the operator is in the set of valid operators
        if(!in_array($format['operator'], $this->validOperators)) {
            return false;
        }

        // create the comparison function, based on the defined operator
        $compareFunction = create_function('$a,$b', "return (\$a $format[operator] \$b);");

        // check the case where the controller operator value is true
        if($compareFunction($group[$format['controller']], $format['value'])) {
            return $group[$format['element']] != '';
        }

        // if controller operator value is false, validate true
        return true;
    }


    function getValidationScript($options = null)
    {
        /*
        $operator = $this->_findOperator($operator);
        if ('==' != $operator && '!=' != $operator) {
            $check = "!(Number({jsVar}[0]) {$operator} Number({jsVar}[1]))";
        } else {
            $check = "!({jsVar}[0] {$operator} {jsVar}[1])";
        }
        return array('', "'' != {jsVar}[0] && {$check}");
        */
    }
}
?>
