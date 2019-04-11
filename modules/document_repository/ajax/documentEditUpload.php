<?php
/**
  * Document_repository module
  *
  * PHP Version 7
  *
  * @category Test
  * @package  Loris
  * @author   Loris Team <loris.info@mcin.ca>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
$userSingleton =& \User::singleton();
if (!$userSingleton->hasPermission('document_repository_view')
    && !$userSingleton->hasPermission('document_repository_delete')
) {
    http_response_code(403);
    exit;
}
$factory = \NDB_Factory::singleton();
$baseURL = $factory->settings()->getBaseURL();

$config = $factory->config();
$base   = $config->getSetting('base');
$name   = $userSingleton->getUsername();

$DB = $factory->database();

$editNotifier = new NDB_Notifier(
    "document_repository",
    "edit"
);

$uploadNotifier = new NDB_Notifier(
    "document_repository",
    "upload"
);

$action = $_POST['action'] ?? null;

//if user has document repository permission
if ($userSingleton->hasPermission('document_repository_view')
    || $userSingleton->hasPermission('document_repository_delete')
) {
    if ($action == 'upload') {
        $category   = $_POST['category']; // required
        $site       = $_POST['site']       !== '' ? $_POST['site'] : null;
        $instrument = $_POST['instrument'] !== '' ? $_POST['instrument'] : null;
        $pscid      = $_POST['pscid']      !== '' ? $_POST['pscid'] : null;
        $visit      = $_POST['visit']      !== '' ? $_POST['visit'] : null;
        $comments   = $_POST['comments']   !== '' ? $_POST['comments'] : null;
        $version    = $_POST['version']    !== '' ? $_POST['version'] : null;

        $fileSize = $_FILES["file"]["size"];
        $fileName = $_FILES["file"]["name"];
        $fileType = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);

        $uploadPath = "$base/modules/document_repository/user_uploads/$name/";
        $fullPath   = $uploadPath . $fileName;

        // $category is a string representation of an ID, and so should be at
        // least equal to zero.
        if (intval($category) < 0) {
            throw new LorisException(
                "'Category' parameter must be a positive integer."
            );
        }

        // Check to see if $fullPath is writable. If not, throw an error. If it
        // doesn't exist, create an uploads folder for the logged-in user.
        if (!is_writable($fullPath)) {
            if (file_exists($fullPath)) {
                throw new LorisException(
                    "User uploads path in Document Repository is not writable."
                );
            }
            mkdir($fullPath, 0770);
        }

        // Copy the uploaded file to the user's upload folder if possible.
        // Insert a record of the file into the document_repository table
        if (!move_uploaded_file(
            $_FILES['file']['tmp_name'],
            $fullPath . $fileName
        )
        ) {
            throw new LorisException(
                'ERROR: Could not upload file. Contact your administrator.'
            );
        } else {
            $success = $DB->insert(
                'document_repository',
                array(
                 'File_category' => $category,
                 'For_site'      => $site,
                 'comments'      => $comments,
                 'version'       => $version,
                 'File_name'     => $fileName,
                 'File_size'     => $fileSize,
                 'Data_dir'      => "$name/$fileName", // e.g. 'admin/file.png'
                 'uploaded_by'   => $name,
                 'Instrument'    => $instrument,
                 'PSCID'         => $pscid,
                 'visitLabel'    => $visit,
                 'File_type'     => $fileType,
                )
            );
            $msg_data['newDocument']
                = $baseURL . "/document_repository/";
            $msg_data['document']    = $fileName;

            $uploadNotifier->notify($msg_data);

            http_response_code(303);
            header('Location:' . $baseURL . '/document_repository/');
        }
    } else if ($action == 'edit') {
        $id         = $_POST['idEdit'];
        $category   = $_POST['categoryEdit'];
        $instrument = $_POST['instrumentEdit'];
        $site       = $_POST['siteEdit'];
        $pscid      = $_POST['pscidEdit'];
        $visit      = $_POST['visitEdit'];
        $comments   = $_POST['commentsEdit'];
        $version    = $_POST['versionEdit'];

        // $category is a string representation of an ID, and so should be at
        // least equal to zero
        if (intval($category) < 0) {
            throw new LorisException(
                "Category parameter must be a positive integer."
            );
        }

        $values = array(
                   'File_category' => $category,
                   'Instrument'    => $instrument,
                   'For_site'      => $site,
                   'PSCID'         => $pscid,
                   'visitLabel'    => $visit,
                   'comments'      => $comments,
                   'version'       => $version,
                  );
        $DB->update('document_repository', $values, array('record_id' => $id));

        $fileName = $DB->pselectOne(
            "select File_name from document_repository where record_id=:record_id",
            array('record_id' => $id)
        );
        $msg_data['updatedDocument'] = $baseURL . "/document_repository/";
        $msg_data['document']        = $fileName;

        $editNotifier->notify($msg_data);
    }
}

?>
