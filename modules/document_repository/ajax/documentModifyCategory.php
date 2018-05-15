<?php
/**
 * Document_repository module
 *
 * PHP Version 7
 *
 * @category Ajax
 * @package  Loris
 * @author   Loris Team <loris.info@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

$userSingleton =& User::singleton();
if (!$userSingleton->hasPermission('document_repository_view')
    && !$userSingleton->hasPermission('document_repository_delete')
) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

set_include_path(
    get_include_path().
    ":../../project/libraries:../../php/libraries:"
);
require_once "NDB_Client.class.inc";
require_once "NDB_Config.class.inc";
require_once "Email.class.inc";
$client = new NDB_Client();
$client->initialize("../../project/config.xml");
$factory = NDB_Factory::singleton();
$baseURL = $factory->settings()->getBaseURL();

$config = NDB_Config::singleton();

// create Database object
$DB =& Database::singleton();

$editNotifier = new NDB_Notifier(
    "document_repository",
    "edit"
);

$uploadNotifier = new NDB_Notifier(
    "document_repository",
    "upload"
);

$action = $_POST['action'];

//if user has document repository permission
if ($userSingleton->hasPermission('document_repository_view')
    || $userSingleton->hasPermission('document_repository_delete')
) {
    if ($action == 'edit') {
        $id       = $_POST['idEdit'];
        $category = $_POST['categoryEdit'];
        $name     = $_POST['nameEdit'];
        $comments = $_POST['commentsEdit'];

        if (empty($category) && $category !== '0') {
            header("HTTP/1.1 400 Bad Request");
            exit;
        }

        $values = array(
                   'category_name' => $name,
                   'comments'      => $comments,
                  );

        $DB->update('document_repository_categories', $values, array('id' => $id));

        $msg_data['updatedDocument'] = $baseURL . "/document_repository/";
        $msg_data['document']        = $name;

        $editNotifier->notify($msg_data);
    } else if ($action == 'delete') {
        // delete
        
    }
}
