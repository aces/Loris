<?php
/**
 * Implements the LORIS request account page.
 *
 * PHP version 5
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
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user has access
     */
    function _hasAccess()
    {
        return true;
    }

    /**
     * Sets up the form elements on the page.
     *
     * @return none
     */
    function setup()
    {
        $this->addBasicText(
            "firstname",
            "First name",
            array("placeholder" => "First Name")
        );
        $this->addBasicText(
            "lastname",
            "Last name",
            array("placeholder" => "Last Name")
        );
        $this->addBasicText(
            "from",
            "Email address",
            array("placeholder" => "Email address")
        );
        $this->addSelect(
            "site",
            "Site",
            array_merge(
                ["" => "Choose your site:"],
                \Utility::getSiteList()
            )
        );
        $this->addCheckbox("examiner", "Examiner role", array());
        $this->addCheckbox("radiologist", "Radiologist", array());
    }

    /**
     * _validate validates the data that was submitted by the user
     *
     * @param array $values The values that were submitted to the page.
     *
     * @return a (possibly empty) array of errors
     */
    function _validate($values)
    {
        $errors = array();
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

        // Is this still required? It seems to be from the old captcha
        // method?
        if (isset($_SESSION['tntcon'])
            && md5($_REQUEST['verif_box']).'a4xn' != $_SESSION['tntcon']
        ) {
            $errors[] = 'The verification code is incorrect';
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
     * @return none
     */
    function _process($values)
    {
        $DB        = \Database::singleton();
        $name      = htmlspecialchars($values["firstname"], ENT_QUOTES);
        $lastname  = htmlspecialchars($values["lastname"], ENT_QUOTES);
        $from      = htmlspecialchars($values["from"], ENT_QUOTES);
        $verif_box = htmlspecialchars($values["verif_box"], ENT_QUOTES);
        $site      = htmlspecialchars($values["site"], ENT_QUOTES);
        // check to see if verificaton code was correct
        // if verification code was correct send the message and show this page
        $fullname = "$name $lastname";
        $vals     = array(
                     'UserID'           => $from,
                     'Real_name'        => $fullname,
                     'First_name'       => $name,
                     'Last_name'        => $lastname,
                     'Pending_approval' => 'Y',
                     'Email'            => $from,
                     'CenterID'         => $site,
                    );

        if ($values['examiner']=='on') {
            $rad = $values['radiologist'] == 'on';

            //insert in DB as inactive until account approved
            $DB->insert(
                'examiners',
                array(
                 'full_name'        => $fullname,
                 'centerID'         => $site,
                 'radiologist'      => $rad,
                 'active'           => 'N',
                 'pending_approval' => 'Y',
                )
            );
        }
        // check email address' uniqueness
        $result = $DB->pselectOne(
            "SELECT COUNT(*) FROM users WHERE Email = :VEmail",
            array('VEmail' => $from)
        );
        if ($result == 0) {
            // insert into db only if email address if it doesnt exist
            $DB->insert('users', $vals);
        }
        // Show success message even if email already exists for security reasons
        $this->tpl_data['success'] = true;
        unset($_SESSION['tntcon']);
        // Verify reCAPTCHA
        if (isset($values['g-recaptcha-response']) && isset($reCAPTCHAPrivate)) {
            $recaptcha = new \ReCaptcha\ReCaptcha($reCAPTCHAPrivate);
            $resp      = $recaptcha->verify(
                $values['g-recaptcha-response'],
                $_SERVER['REMOTE_ADDR']
            );
            if (!$resp->isSuccess()) {
                $errors         = $resp->getErrorCodes();
                $err['captcha'] = 'Please complete the reCaptcha!';
            }
        }
    }
}

