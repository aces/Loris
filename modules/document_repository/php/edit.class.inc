<?php
/**
 * This file contains the NDB_Form_document_repository class
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Document_Repository
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\document_repository;

/**
 * Creates the form for document_repository/edit page
 *
 * @category Loris
 * @package  Document_Repository
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Edit extends \NDB_Form
{
    public $skipTemplate = true;

    /**
     * Entry point for /document_repository/edit/
     * Checks if file id is provided and otherwise redirects to
     * /document_repository/ page
     *
     * @return void
     */
    function setup()
    {
        parent::setup();

        $db      = \Database::singleton();
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();

        $idDocFile = $_GET['id'];

        // Check if document file exists,
        //if not redirect to /document_repository/ page
        if (isset($idDocFile)) {
            $result = $db->pselectRow(
                "SELECT record_id FROM document_repository WHERE record_id = :mid",
                array('mid' => $idDocFile)
            );
            if (count($result) < 1) {
                header('Location: ' . $baseURL . '/document_repository/');
            }
        } else {
            header('Location: ' . $baseURL . '/document_repository/');
        }
    }

    /**
     * Include additional JS files:
     *  1. editForm.js - reactified form to update repository
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies(): array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/document_repository/js/editFormIndex.js"]
        );
    }
    /**
     * Check user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('document_repository_delete');
    }

}
