<?php
/**
 * Implements the LORIS request account page.
 *
 * PHP version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\login;

/**
 * Implements the LORIS request account page.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class RequestAccount extends \NDB_Form
{
    /**
     * Sets up the form elements on the page.
     *
     * @return void
     */
    function setup()
    {
        $this->tpl_data['page_title']  = 'Request Account';
        $this->tpl_data['captcha_key'] = \NDB_Factory::singleton()
            ->config()
            ->getSetting('reCAPTCHAPublic');
        $this->tpl_data['nonce']       = base64_encode(
            random_bytes(16)
        );

        $this->addBasicText(
            "firstname",
            "First name",
            [],
            [
                "placeholder" => "First Name",
                "required"    => true,
            ]
        );
        $this->addBasicText(
            "lastname",
            "Last name",
            [],
            [
                "placeholder" => "Last Name",
                "required"    => true,
            ]
        );
        $this->addBasicText(
            "from",
            "Email address",
            [],
            [
                "placeholder" => "Email address",
                "required"    => true,
            ]
        );

        //merging array using + sign to avoid reindexing of keys which
        //occurs when array_merge() is used
        $this->addSelect(
            "site",
            "Site",
            ["" => "Choose your site:"] + \Utility::getSiteList(),
            ["required" => true]
        );
        $this->addSelect(
            "project",
            "Project",
            ["" => "Choose your project:"] + \Utility::getProjectList(),
            ["required" => true]
        );
        $this->addCheckbox("examiner", "Examiner role", []);
        $this->addCheckbox("radiologist", "Radiologist", []);

        $this->form->addFormRule([&$this, '_validate']);
    }

    /**
     * _validate validates the data that was submitted by the user
     *
     * @param array $values The values that were submitted to the page.
     *
     * @return array a (possibly empty) array of errors
     *
     * @see https://github.com/google/recaptcha
     */
    function _validate($values): array
    {
        $errors = [];
        // Verify reCAPTCHA
        $reCAPTCHAPrivate = \NDB_Factory::singleton()
            ->config()
            ->getSetting('reCAPTCHAPrivate') ?? '';

        // Only validate reCAPTCHA if a private key exists.
        if (!empty($reCAPTCHAPrivate)) {
            $resp = (new \ReCaptcha\ReCaptcha($reCAPTCHAPrivate))
                ->verify(
                    $values['g-recaptcha-response'] ?? '',
                    $_SERVER['REMOTE_ADDR']
                );
            // FIXME This leverages the error handling for the "site" text field.
            // It should be done using its own error block.
            if (!$resp->isSuccess()) {
                $errors['site'] = "reCAPTCHA failed. Reason: "
                    . implode(', ', $resp->getErrorCodes());
            }
        }

        // FIXME: These error checks are direct ports from when the request
        // account page was a standalone php script (with the ridiculous
        // "name must be at least 3 characters" check removed, because some
        // people don't have three character long names..) The "required" checks
        // should probably be replaced with a required rule.
        if (empty($values['firstname'])) {
            $errors['firstname'] = "First name is required!";
        }
        if (empty($values['lastname'])) {
            $errors['lastname'] = "Last name is required!";
        }
        if (empty($values['from'])) {
            $errors['from'] = "Please provide a valid email!";
        } else if (!filter_var($_REQUEST['from'], FILTER_VALIDATE_EMAIL) ) {
            $errors['from'] = 'Please provide a valid email!';
        }

        if (empty($values['site'])) {
            $errors['site'] = "Please choose a site!";
        }
        if (empty($values['project'])) {
            $errors['project'] = "Please choose a project!";
        }

        // I don't think this is required because insert uses prepared statements,
        // but I'm keeping it for now because it doesn't do any harm (unlike the
        // len > 3 check). Little Bobby Tables will just have to sign
        // up using a table alias. - Dave
        //
        // For each fields, check if quotes or if some HTML/PHP
        // tags have been entered
        foreach ($values as $field => $value) {
            if (preg_match('/["]/', html_entity_decode($value))) {
                $errors[$field] = "You can't use quotes in $field";
            }
            if (strlen($value) > strlen(strip_tags($value))) {
                $errors[$field] = "You can't use tags in $field";
            }
        }

        return $errors;
    }

    /**
     * _process inserts the new account with a pending flag after
     * the input has been validated.
     *
     * @param array $values The values that were submitted to the page.
     *
     * @return void
     */
    function _process($values)
    {
        $factory  = \NDB_Factory::singleton();
        $DB       = $factory->database();
        $name     = trim(htmlspecialchars($_REQUEST["firstname"], ENT_QUOTES));
        $lastname = trim(htmlspecialchars($_REQUEST["lastname"], ENT_QUOTES));
        $from     = trim(htmlspecialchars($_REQUEST["from"], ENT_QUOTES));
        $site     = $_REQUEST["site"];
        $project  = $_REQUEST["project"];
        $fullname = $name." ".$lastname;

        $vals = [
            'UserID'           => $from,
            'Real_name'        => $fullname,
            'First_name'       => $name,
            'Last_name'        => $lastname,
            'Pending_approval' => 'Y',
            'Email'            => $from,
        ];

        // check email address' uniqueness
        $result = $DB->pselectOne(
            "SELECT COUNT(*) FROM users WHERE Email=:VEmail OR UserID=:VEmail",
            ['VEmail' => $from]
        );

        $user_id = null;

        if ($result == 0) {
            // insert into DB only if email address doesn't exist
            $DB->insert('users', $vals);
            // Get the ID of the new user and insert into user_psc_rel
            $user_id = $DB->getLastInsertId();

            // verify site exists
            $siteList = \Utility::getSiteList();
            if (!is_null($site) && array_key_exists($site, $siteList)) {
                $DB->insert(
                    'user_psc_rel',
                    [
                        'UserID'   => $user_id,
                        'CenterID' => $site,
                    ]
                );
            }

            // verify project exists
            $projectList = \Utility::getProjectList();
            if (!is_null($project) && array_key_exists($project, $projectList)) {
                $DB->insert(
                    'user_project_rel',
                    [
                        'UserID'    => $user_id,
                        'ProjectID' => $project,
                    ]
                );
            }

            $examinerCheck    = $_REQUEST['examiner'] ?? 'off';
            $radiologistCheck = $_REQUEST['radiologist'] ?? 'off';

            if ($examinerCheck == 'on') {
                $rad = 0;
                if ($radiologistCheck == 'on') {
                    $rad = 1;
                }
                //insert in DB as inactive until account approved
                $examinerID = $DB->pselect(
                    "SELECT e.examinerID
                 FROM examiners e
                 WHERE e.full_name=:fn",
                    ["fn" => $fullname]
                );

                // If examiner not in table add him
                if (empty($examinerID)) {
                    $DB->insert(
                        'examiners',
                        [
                            'full_name'   => $fullname,
                            'radiologist' => $rad,
                            'userID'      => $user_id,
                        ]
                    );
                    $examinerID = $DB->getLastInsertID();
                    $DB->insert(
                        'examiners_psc_rel',
                        [
                            'examinerID'       => $examinerID,
                            'centerID'         => $site,
                            'active'           => 'Y',
                            'pending_approval' => 'Y',
                        ]
                    );
                }
            }
        }

        // Verify reCAPTCHA
        $err = array();
        if (isset($values['g-recaptcha-response']) && isset($reCAPTCHAPrivate)) {
            $recaptcha = new \ReCaptcha\ReCaptcha($reCAPTCHAPrivate);
            $resp      = $recaptcha->verify(
                $values['g-recaptcha-response'],
                $_SERVER['REMOTE_ADDR']
            );
            if (!$resp->isSuccess()) {
                $err['captcha'] = 'Please complete the reCaptcha!';
            }
        }
        // Send an email to the administrator informing them that a user has
        // requested an account.
        if (empty($err) && empty($errors)) {
            $config    = \NDB_Factory::singleton()->config();
            $studyName = $config->getSetting('title');

            \Email::send(
                $config->getSetting('mail')['From'],
                'request_account.tpl',
                array(
                    'Study'     => $studyName,
                    'UserID'    => $from,
                    'Real_name' => $fullname,
                    'Email'     => $from,
                ),
            );
        }
        // Show success message even if email already exists for security reasons
        $this->tpl_data['success'] = true;
    }
}
