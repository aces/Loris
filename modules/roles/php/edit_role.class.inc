<?php
/**
 * The role page
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Roles
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\roles;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Implements the role page
 *
 * @category Main
 * @package  Roles
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Edit_Role extends \NDB_Form
{
    /**
     * Determines whether this form is in edit or create mode.
     *
     * @return boolean true if in create mode, false otherwise.
     */
    function isCreatingNewRole()
    {
        return $this->identifier == '';
    }

    /**
     * Controls who's got access to this page.
     *
     * @param \User $editor The user who is accessing this page
     *
     * @return bool true if user has access, false otherwise.
     */
    function _hasAccess(\User $editor) : bool
    {
        return ($editor->hasPermission('role_edit')
                || $editor->hasPermission('role_view'));
    }

    /**
     * Computes the initial values this page will be filled with.
     *
     * @return array the default values for the initial state of this page.
     */
    function _getDefaults()
    {
        $defaults = [];

        // if role already exists
        if (!$this->isCreatingNewRole()) {

            // get the role and associated permissions
            $role = \Role::factory($this->identifier);

            // Role attributes
            $defaults = $role->asArray();

            // An array of each field that requires front-end sanitization
            $fieldsThatAreStrings = [
                'Code',
                'Name',
                'Description',
            ];
            // Prevent Javascript injection on all fields
            foreach ($fieldsThatAreStrings as $fieldName) {
                // this check prevents PHP Notices
                if (!empty($defaults[$fieldName])) {
                    $defaults[$fieldName] = htmlspecialchars($defaults[$fieldName]);
                }
            }
        }
        return $defaults;
    }

    /**
     * Processes the data entered in the form.
     *
     * @param array $values values entered in the form.
     *
     * @return void
     */
    function _process($values)
    {
        // attribute the code as snakecase version of name
        // -> lowercase + underscores as separator
        if ($this->isCreatingNewRole()) {
            $values['Code'] = \Role::generateCodeFromName($values['Name']);
        }

        // add other
        $values['Name']        = trim($values['Name']);
        $values['Description'] = trim($values['Description']);

        // -----------------------------------

        // make the set
        $set = [];
        foreach ($values as $key => $value) {
            $set[$key] = $value;
        }

        // update the user
        if ($this->isCreatingNewRole()) {
            // insert a new role
            \Role::insert($set);

        } else {
            // update the user
            $role = \Role::factory($this->identifier);
            $role->update($set);
        }


        // // update send
        // $factory = \NDB_Factory::singleton();
        // $baseURL = $factory->settings()->getBaseURL();
        // // send the user an email
        // if (!empty($send)) {
        //     $config = $factory->config();

        //     // send the user an email
        //     $msg_data          = [];
        //     $msg_data['study'] = $config->getSetting('title');
        //     $msg_data['url']   = $baseURL;
        //     $msg_data['realname'] = $values['Real_name'];
        //     $msg_data['username'] = $user->getUsername();
        //     if (isset($values['Password_hash'])) {
        //         $msg_data['password'] = $values['Password_hash'];
        //     }
        //     $template = (is_null($this->identifier))
        //         ? 'new_user.tpl' : 'edit_user.tpl';
        //     \Email::send($values['Email'], $template, $msg_data);
        //     unset($msg_data);
        // }
        // $this->tpl_data['success'] = true;
        // $username = $values['UserID'] ?? '';
        // if ($this->isCreatingNewRole()) {
        //     $this->redirect = $baseURL
        //         . "/user_accounts/edit_user/"
        //         . $username;
        // }
    }

    /**
     * The edit_role page overrides the default handler in order to handle URLs for
     * both editing users, and creating them. It extracts the identifier if
     * appropriate and handles the redirection if needed.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR15 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $matches = [];
        preg_match('#.*/edit_role/(.*)#', $request->getUri()->getPath(), $matches);
        if (!empty($matches[1])) {
            $this->identifier = $matches[1];
        }
        $response = parent::handle($request);
        if (!empty($this->redirect)) {
            return $response
                ->withStatus(303)
                ->withHeader("Location", $this->redirect);
        }
        return $response;
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @suppress PhanTypeInvalidArrayKeyLiteral
     *
     * @return void
     */
    function setup()
    {
        parent::setup();

        // Role Code
        $this->addScoreColumn('Code', 'Code');

        // Role name

        // The supplied pattern is:
        //   - must have at least one non-whitespace characters
        //   - once leading and trailing spaces are stripped, the field should
        //       not exceed 120 chars
        $onInvalidMsg
            = "this.setCustomValidity('Role Name is required and "
            . "should not exceed 120 characters')";
        $this->addBasicText(
            'Name',
            'Name',
            [],
            [
                'oninvalid' => $onInvalidMsg,
                'onchange'  => "this.setCustomValidity('')",
                'pattern'   => '^\s*\S.{0,119}\s*$',
                'required'  => true,
            ]
        );

        // Role Description

        // The supplied pattern is:
        //   - must have at least one non-whitespace characters
        //   - once leading and trailing spaces are stripped, the field should
        //       not exceed 120 chars
        $onInvalidMsg
            = "this.setCustomValidity('Role Description is required and "
            . "should not exceed 120 characters')";
        $this->addBasicText(
            'Description',
            'Description',
            [],
            [
                'oninvalid' => $onInvalidMsg,
                'onchange'  => "this.setCustomValidity('')",
                'pattern'   => '^\s*\S.{0,119}\s*$',
                'required'  => true,
            ]
            );

        // unique key and password rules
        $this->form->addFormRule([&$this, '_validateEditRole']);
    }

    /**
     * Validates the data entered in the edit role form.
     *
     * @param array $values what the user entered on the form.
     *
     * @return array $errors all the errors found.
     */
    function _validateEditRole($values)
    {
        $errors = [];

        // ------------------------------------------
        // validate

        $newCode    = \Role::generateCodeFromName($values['Name']);
        $roleExists = \Role::exists($newCode);
        if ($this->isCreatingNewRole() && $roleExists) {
            $errors['Name'] = "A role named '" . $values['Name']
                . "' with code '" . $newCode . "' already exists.";
        }

        // errors
        return $errors;
    }
}