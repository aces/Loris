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
// $Id: RequiredIf.inc,v 3.1 2004/04/15 15:12:22 jharlap Exp $

require_once 'HTML/QuickForm/Rule.php';

/**
 * Rule to require an element only if another element matches a given value
 * 
 * The most common usage for this is to have one [checkbox] element
 * that "turns on" a set of other elements. Note that the first
 * element is required if the second element matches the target value.
 *
 * @example Given an element fieldA which is required unless fieldA_not_administered is set to 1...
 * require_once('RequiredIf.inc');
 * $form->registerRule('requiredIf', null, 'HTML_QuickForm_Rule_RequiredIf', 'RequiredIf.inc');
 * $form->addRule(array('fieldA', 'fieldA_not_administered'), 'fieldA is required or fieldA_not_administered must be 1',
 *                'requiredIf', array('operator'=>'!=', 'value'=>1));
 * // here's the really messy bit - add the controlled field (first in the array of elements) name
 * // into the quickform object's list of required fields or else it won't work properly
.* // we're assuming that $this is an NDB_BVL_Instrument object...
 * $this->setRequired('fieldA');
 * 
 * @access public
 * @package HTML_QuickForm
 * @version $Revision: 3.1 $
 */
class HTML_QuickForm_Rule_RequiredIf extends HTML_QuickForm_Rule
{

    // define the set of valid operators
    var $validOperators = array('==', '===', '!=', '<>', '!==', '<', '>', '<=', '>=');

    /**
     * performs the RequiredIf validation
     * note that it will print() if you use it badly
     *
     * @param array $elements the two element array - [0] is the
     * element, [1] is the controller
     * @param array $format   the optional array containing elements 'operator' and 'value'
     * @return boolean
     * @access public
     */
    function validate($elements, $format)
    {
        // make sure $format is a properly structure array
        if(!is_array($elements) || count($elements) != 2) {
            print "RequiredIf rule expects two elements\n";
            return false;
        }

        // default operator and value to != ''
        if(empty($format['operator'])) $format['operator'] = '!=';
        if(!isset($format['value']))    $format['value']    = '';

        // confirm that the operator is in the set of valid operators
        if(!in_array($format['operator'], $this->validOperators)) {
            print "operator is not a valid operator from the set ".join(', ', $this->validOperators);
            return false;
        }

        // create the comparison function, based on the defined operator
        $compareFunction = create_function('$a,$b', "return (\$a $format[operator] \$b);");

        // check the case where the controller operator value is true
        if($compareFunction($elements[1], $format['value'])) {
            return $elements[0] != '';
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
