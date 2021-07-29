<?php
declare(strict_types = 1);

/**
 * This file features the code for adding a new data request
 */

namespace LORIS\dqt;

use phpDocumentor\Reflection\Types\Boolean;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Creates the form to add a data request
 *
 * PHP Version 7
 *
 * @package Loris
 * @author  Laetitia Fesselier <laetitia.fesselier@mcin.ca>
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link    https://github.com/aces/Loris
 */
class Data_Request extends \NDB_Form
{
    private $_error;
    public $skipTemplate = true;
    private $_sendEmail  = true;
    private $_approvalLetter;
    private $_emailRecipient = 'cbig.mni@mcgill.ca';

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @return void
     */
    function setup()
    {
        parent::setup();
        $user = \User::singleton();
        $this->fieldOptions = [
            'email'  => $user->getData('Email'),
            'userID' => $user->getID(),
        ];
    }

    /**
     * Check user access permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        // check user permissions
        return $user->hasPermission('dataquery_view');
    }

    /**
     * Handle the incoming request for a data request.
     *
     * @param ServerRequestInterface $request The incoming client request
     *
     * @return ResponseInterface The PSR15 response.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        if ($request->getMethod() === "POST") {
            $this->form->addFormRule([&$this, '_validateNewDataRequest']);
            $this->save();
            if (!empty($this->_error)) {
                return (new \LORIS\Http\Response())
                    ->withHeader("Content-Type", "application/json")
                    ->withStatus(400)
                    ->withBody(
                        new \LORIS\Http\StringStream(
                            json_encode($this->_error)
                        )
                    );
            }

            $result = [];
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "application/json")
                ->withStatus(201)
                ->withHeader("Allow", "POST")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode($result)
                    )
                );
        }

        return parent::handle($request);
    }


    /**
     * Validate function
     *
     * @param array $values the value
     *
     * @return array $errors
     */
    function _validateNewDataRequest($values): array
    {
        $this->_error = null;
        $errors       = [];

        if (empty($values['email'])) {
            $errors['email'] = 'Email field is required.';
        }

        if (!filter_var($values['email'], FILTER_VALIDATE_EMAIL) ) {
            return ['email' => 'The email address is not valid.'];
        }

        if (!isset($values['institution']) || empty($values['institution'])) {
            $errors['institution'] = 'Institution field is required.';
        }

        if (isset($values['coinvestigators'])) {
            $coinvestigators = json_decode($values['coinvestigators']);
            foreach ($coinvestigators as $coinvestigator) {
                if (empty($coinvestigator->name)
                    || empty($coinvestigator->institution)
                    || empty($coinvestigator->email)
                ) {
                    $errors['coinvestigator']
                        = 'All co-investigator fields must be filled.';
                }

                if (!filter_var($coinvestigator->email, FILTER_VALIDATE_EMAIL) ) {
                    $errors['coinvestigator']
                        = 'One of the co-investigator email address is not valid.';
                }
            }
        }

        if (!isset($values['researchTitle']) || empty($values['researchTitle'])) {
            $errors['researchTitle'] = 'Research Title field is required.';
        }

        if (!isset($values['materialsRequested'])
            || empty($values['materialsRequested'])
        ) {
            $errors['materialsRequested'] = 'Materials requested field is required.';
        }

        if (isset($_FILES['approvalLetter'])) {
            $approvalLetter = $_FILES['approvalLetter'];

            if (!isset($approvalLetter['tmp_name'])
                || empty($approvalLetter['tmp_name'])
            ) {
                $errors['approvalLetter']
                    = 'The server is not configured to receive a file this large.';
            }

            $allowedExtensions = ['pdf'];
            $extension         = strtolower(
                pathinfo(
                    $approvalLetter['name'],
                    PATHINFO_EXTENSION
                )
            );
            if (!in_array($extension, $allowedExtensions)) {
                $errors['approvalLetter'] = 'That extension is not allowed!';
            }

            if (!isset($errors['approvalLetter'])) {
                $this->_approvalLetter = $approvalLetter;
            }
        }

        if (!empty($errors)) {
            $this->_error = reset($errors);
        }

        return $errors;
    }

    /**
     * Processes the values and saves to database
     *
     * @param array $values form values
     *
     * @return void
     */
    function _process($values): void
    {
        // Change empty strings to null before passing as arguments.
        foreach ($values as $key => $value) {
            if (empty($value)) {
                $values[$key] = null;
            }
        }

        /* Create the data request.
         * Use form values when present, otherwise default to null.
         */
        $db    = \NDB_Factory::singleton()->database();
        $entry = [
            'institution'              => $values['institution'],
            'research_title'           => $values['researchTitle'],
            'research_summary'         => $values['researchSummary'],
            'requires_ethics_approval' => $values['requiresEthicsApproval'] ??
                'false',
            'reb_name'                 => $values['rebName'],
            'reb_location'             => $values['rebLocation'],
            'ethics_approval_received' => $values['ethicsApprovalReceived'] ??
                'false',
            'materials_requested'      => $values['materialsRequested']
        ];

        if (isset($values['userID']) && $values['userID'] !== null) {
            $entry['userID'] = $values['userID'];
        } else {
            $entry['email'] = $values['email'];
        }

        if (!empty($this->_approvalLetter)) {
            // Move file from tmp to download directory.
            $path = $this->getDownloadPath($this->_approvalLetter['tmp_name']);
            $file = join($path) . '/' . $this->_approvalLetter['name'];
            if (move_uploaded_file($this->_approvalLetter['tmp_name'], $file)) {
                $entry['approval_letter']
                    = $path['path'] . $this->_approvalLetter['name'];;
            }
        }

        try {
            $db->beginTransaction();
            $db->insert(
                'data_requests',
                $entry
            );
            $db->unsafeupdate(
                'data_requests',
                ['coinvestigators' => $values['coinvestigators']],
                ['ID' => $db->getLastInsertId()]
            );

            $db->commit();

            if ($this->_sendEmail && !empty($this->_emailRecipient)) {
                if (isset($values['userID']) && $values['userID'] !== null) {
                    $query = "SELECT Email FROM `users` WHERE ID=:id";
                    $email = $db->pselectOne($query, ['id' => $values['userID']]);
                } else {
                    $email = $values['email'];
                }

                $template = "../../../project/templates/dqt_data_request.tpl";

                $tpl_data            = $entry;
                $tpl_data['email']   = $email;
                $tpl_data['message']
                    = 'A new specimen request has been issued on CBIGR:';
                if (isset($tpl_data['approval_letter'])) {
                    $path = explode('/', $tpl_data['approval_letter']);
                    $path = array_map(urlencode, $path);
                    $tpl_data['approval_letter'] = join('/', $path);
                }

                \Email::send(
                    $this->_emailRecipient,
                    $template,
                    $tpl_data,
                    '',
                    '',
                    '',
                    '',
                    'text/html'
                );
            }

        } catch (\DatabaseException $e) {
            $db->rollBack();
            error_log($e->getMessage());
            throw new \LorisException(
                'Could not write to the Database'
            );
        }
    }

    /**
     * Gets the full_path
     * of where the approval letters will be stored.
     *
     * @param string $filePath the path to the file.
     *
     * @return array An array containing the base path and relative path of the files
     * @throws \LorisException
     */
    function getDownloadPath(string $filePath): array
    {
        $config       = \NDB_Factory::singleton()->config();
        $download_dir = trim(
            rtrim(
                $config->getSetting('DataRequestPath'),
                '/'
            )
        );

        if (!is_dir($download_dir)) {
            mkdir($download_dir, 0770, true);
        }

        if (is_writable($download_dir)) {
            $path      = '/data_request_' . hash_file('sha256', $filePath) . '/';
            $full_path = $download_dir . $path;
            if (!is_dir($full_path)) {
                mkdir($full_path, 0770, true);
            }
            return [
                'base' => $download_dir,
                'path' => $path,
            ];
        } else {
            throw new \LorisException(
                'Download directory not writable.'
            );
        }
    }
}
