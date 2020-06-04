<?php
/**
 * This class over-rides the NDB_Menu_Filter class by including the functionality
 * of saving/processing the form.
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Menu_Filter_Form Class
 *
 * This class over-rides the NDB_Menu_Filter class by including the functionality
 * to save/process the form.
 *
 * @category Behavioural
 * @package  Main
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

class NDB_Menu_Filter_Form extends NDB_Menu_Filter
{


    /**
     * Saves the form
     *
     * Attempts to validate the form (using the defined rules) and
     * saves the validated data into the database
     *
     * @return void
     * @access public
     */
    function save()
    {
        if (!isset($_REQUEST['filter'])
            && isset($_REQUEST['fire_away'])
            || !empty($_REQUEST['fire_away'])
        ) {
            if ($this->form->validate()) {
                $this->form->process(array(&$this, "_save"));
            }
        }
    }



    /**
     * Preprocesses the array of values to be saved into the database
     *
     * @param array $values the array of values ready to be passed to a
     *                      Database::replace call as the set array
     *
     * @return void
     * @access private
     */
    function _save($values)
    {
        unset(
            $values['test_name'],
            $values['subtest'],
            $values['identifier'],
            $values['fire_away']
        );

        // clear any fields starting with __
        foreach (array_keys($values) AS $key) {
            if (strpos($key, '__') === 0) {
                unset($values[$key]);
            }
        }

        $this->_process($values);
    }


    /**
     * Processes the values and saves to database
     *
     * @param array $values form values
     *
     * @return bool true if successful
     */
    function _process($values)
    {
        return true;
    }

    /**
     * An NDB_Menu_Filter_Form, like an NDB_Form extends the basic page
     * handler to call save() on a POST request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The PSR15 response to the request.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $this->setup();
        if ($request->getMethod() === "POST") {
            $this->save();
        }
        return parent::handle($request);
    }

}

