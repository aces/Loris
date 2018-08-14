<?php
/**
 * Contains the base code to use for all NeuroDB forms
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
/**
 * Base Form class that is overwritten by specific form pages
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_Form extends NDB_Page
{
    /**
     * Stores the template
     *
     * @var    string
     * @access private
     */
    var $template;

    /**
     * Redirect URL
     *
     * @var    string
     * @access private
     */
    var $redirect;

    /**
     * Separates the group elements
     *
     * @var    string
     * @access private
     */
    var $_GUIDelimiter = "&nbsp;\n";

    /**
     * Generates a new form instance and runs the appropriate method
     *
     * @param string $name       Identifies the form
     * @param string $page       Identifies the page to show
     * @param string $identifier Variables passed to form
     *
     * @return void
     */
    static function &factory($name, $page, $identifier)
    {
        // check that the form class exists
        if (class_exists("NDB_Form_$name")) {
            $class = "NDB_Form_$name";
        } else {
            throw new Exception("The form class ($name) is not defined.");
        }

        // create a new menu object
        try {
            if (isset($_REQUEST['test_name'])) {
                $module = \Module::factory($_REQUEST['test_name']);
            } else {
                $module = \Module::factory($name);
            }
        } catch(\LorisModuleMissingException $e) {
            $module = new Module($name, "");
        }

        // create a form instance
        $obj = new $class($module, $page, $identifier, '', 'test_form');

        $obj->registerDefaultFilter();

        $access = $obj->_hasAccess();

        // check that user has access
        if ($access == false) {
            throw new Exception("You do not have access to this page.", 403);
        }

        if (method_exists($obj, $page)) {
            $success       = $obj->$page();
            $obj->template = $page;
        } elseif (method_exists($obj, $name)) {
            $success       = $obj->$name();
            $obj->template = $name;
        } else {
            throw new Exception("Form does not exist: $name $page", 404);
        }

        $factory  = NDB_Factory::singleton();
        $settings = $factory->settings();
        $obj->setTemplateVar('baseurl', $settings->getBaseURL());

        return $obj;
    }

    /**
     * By default, trim all fields on the form before any processing/validation
     * is done. Derived classes can override this behavior if needed.
     *
     * @return void
     * @access public
     */
    function registerDefaultFilter()
    {
        $this->form->applyFilter('__ALL__', 'trim');
    }


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
        if ($this->form->validate()) {
            $this->form->process(array(&$this, "_save"));
        }
    }

    /**
     * Add a hidden CSRF token to every form.  This prevents requests
     * being forged by other domains by piggy-backing on a user's active
     * session.
     *
     * @return void
     * @access public
     */
    function setup()
    {
        $this::_setCSRFToken();
        $this->addHidden(
            // Double underscores are used here as fields with double underscores
            // are automatically unset in the _save function below.
            '__csrfToken',
            $_COOKIE['__csrfToken']
        );
    }

    /**
     * Creates a new random token to be stored in the csrf_tokens table.  These
     * are checked against form submissions to assure that the request
     * was not forged from another domain.
     *
     * @return none
     */
    private function _setCSRFToken(): void
    {
        // Create db connection
        $db =& \Database::singleton();

        // Generate random string to use as CSRF token
        $success   = true;
        $csrfToken = $this::generateRandomString(64);
        try {
            $db->insert(
                'csrf_tokens',
                array(
                 'Token'        => $csrfToken,
                 'CreatedAt'    => date("Y-m-d H:i:s"), // today in MySQL format
                 'PhpSessionID' => session_id(),
                )
            );
        } catch (DatabaseException $e) {
            throw new LorisException(
                'Could not insert CSRF token into '
                . 'database. '
                . $e
            );
            http_response_code(500);
        }

        // This should have the Secure flag but is likely to break our automated
        // test environment.  When we resolve that issue, that flag should be
        // added here.
        setcookie(
            '__csrfToken',
            $csrfToken
        );
    }

    /**
     * Generates a random string of a specified length.  String will be
     * alphanumeric as given by the alphabets.  This string is generated by
     * PHP random_int so can be considered sufficiently random for secure
     * functionality.
     *
     * @param int $length The length of the string to generate.
     *
     * @return string The random alphanumeric string of length $length.
     */
    function generateRandomString(int $length): string
    {
        $string        = '';
        $codeAlphabet  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $codeAlphabet .= "abcdefghijklmnopqrstuvwxyz";
        $codeAlphabet .= "0123456789";
        $max           = strlen($codeAlphabet);

        for ($i = 0; $i < $length; $i++) {
            $string .= $codeAlphabet[random_int(0, $max-1)];
        }

        return $string;
    }


    /**
     * Preprocesses the array of values to be saved into the database.  Also
     * checks the valdity of CSRF tokens.  Further processing of data is aborted
     * if CSRF token is invalid.
     *
     * @param array $values the array of values ready to be passed to
     *                      a Database::replace call as the set array
     *
     * @return void
     */
    function _save($values)
    {

        // Validate CSRF token, if one is present.  In the future they should be
        // included with every state-changing request (usually POST requests
        // but LORIS does not always conform to this).  For now this will check
        // only that when a CSRF token is sent that it is well-formed and
        // accurate but will not enforce failure if one is not present.
        // TODO Once CSRF tokens are enforced universally across LORIS, any
        // state-changing request wihtout a valid CSRF token should be rejected.
        // TODO This only validates CSRF tokens present in POST bodies
        // A different approach is neded for AJAX (i.e. headers)

        $token = $values['__csrfToken'] ?? null;
        if (!is_null($token)) {
            $validCSRFToken = true;
            $db      =& \Database::singleton();
            $results = $db->pselect(
                'SELECT PhpSessionID,CreatedAt '
                . 'FROM csrf_tokens '
                . 'WHERE Token =:token',
                array('token' => $token)
            );
            if (empty($results)) {
                error_log(
                    'Submitted CSRF token does not exist in the database.'
                );
                $validCSRFToken = false;
            } else {
                $storedSessionID     = $results[0]['PhpSessionID'];
                $timeOfTokenCreation = $results[0]['CreatedAt'];
                // Session ID stored in the DB does not match the current session.
                // Should not occur organically, i.e. this case is likely a case of
                // someone attempting to replay a token meant for another user's
                // session.
                print_r($results);
                if ($storedSessionID !== session_id()) {
                    error_log(
                        'ERROR: Submitted CSRF token was issued from a '
                        . 'session that does not match the value in the database. '
                        . 'Possible hacking attempt.'
                    );
                    $validCSRFToken = false;
                }
                // Check if the CSRF token was created in the last day.  If not, it
                // is expired and the request is rejected.
                if (strtotime("now") > $timeOfTokenCreation + strtotime("+1 day")) {
                    error_log(
                        'Submitted CSRF token is expired (more than one day 
                        old.'
                    );
                    $validCSRFToken = false;
                }
            }
        }

        // Unset boilerplate variables even with a bad CSRF token just to be
        // safe.
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

        // TODO The code should be refactored so that $validCSRFToken is
        // always set.  This is just a provisional measure until CSRF validation
        // is implemented everywhere in LORIS.
        if (isset($validCSRFToken) && !$validCSRFToken) {
            http_response_code(400);
            die("Malformed CSRF token. Exiting.");
        }
        $this->_process($values);
    }

    /**
     * Processes the values and saves to database. Usually overridden
     * by form instance.
     *
     * @param array $values form values
     *
     * @return void
     */
    function _process($values)
    {
        return true;
    }

    /**
     * A form extends the basic page handler to call save() on a POST request.
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

        return (new \Zend\Diactoros\Response())
            ->withBody(new \LORIS\Http\StringStream($this->display() ?? ""));
    }
}
?>
