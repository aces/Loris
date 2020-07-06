<?php
/**
 * This file contains code for editing context help section
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Sekaran <sekaranrathi@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\help_editor;

use LORIS\publication\Module;

/**
 * This file contains code for editing context help section
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Sekaran <sekaranrathi@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class Help_Editor extends \NDB_Menu_Filter implements \JsonSerializable
{
    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @param Module $module     The test name being accessed
     * @param string $page       The subtest being accessed (may be an empty string)
     * @param string $identifier The identifier for the data to load on this page
     * @param string $commentID  The CommentID to load the data for
     */
    function __construct(
        \Module $module,
        string $page,
        string $identifier,
        string $commentID
    ) {
        parent::__construct($module, $page, $identifier, $commentID);
        $this->skipTemplate = true;
        $this->AjaxModule   = true;
    }

    /**
     *  Checking user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('context_help');
    }

    /**
     * Gets the data source for this menu filter.
     *
     * @return \LORIS\Data\Provisioner
     */
    function getDataProvisioner() : \LORIS\Data\Provisioner
    {
        return new HelpRowProvisioner();
    }

    /**
     * Converts the results of this menu filter
     * to be retrieved with ?format=json
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        $table = (new \LORIS\Data\Table())
            ->withDataFrom($this->getDataProvisioner());
        $arr   = array_map(
            function ($row) {
                return array_values($row);
            },
            json_decode(json_encode($table), true)
        );
        return $arr;
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/help_editor/js/help_editor.js"]
        );
    }
}

