<?php
/**
 * Imaging browser MRI Feedback class file.
 *
 * PHP Version 5
 *
 * @category MRI
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\imaging_browser;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Imaging browser MRI Feedback class
 *
 * This class provides the GUI for the feedback MRI comments pop up window.
 *
 * @category MRI
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

class Feedback_MRI_Popup extends \NDB_Page
{
    protected $tpl_data;
    public $skipTemplate = true;
    private int $file_id;
    private int $session_id;
    private \User $user;

    /**
     * Load the required variables in order to check that the  user
     * has access to the session.
     *
     * @param \User                  $user    The user to load the resources for
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @throws \NotFound If the session id is non-numerical
     * @throws \LorisException  If the session is not found
     *
     * @return void
     */
    public function loadResources(
        \User $user, ServerRequestInterface $request
    ) : void {

        $path    = $request->getUri()->getPath();
        $matches = [];

        if (preg_match('#fileID=(\d+)#', $path, $matches) === 1) {
            $file_id = intval($matches[1]);
            try {
                new \LORIS\Image($file_id);
                $this->file_id = $file_id;
            } catch (\LorisException $e) {
                throw new \NotFound("Invalid FileID");
            }
        } elseif (preg_match('#sessionID=(\d+)#', $path, $matches) === 1) {
            $session_id = intval($matches[1]);
            try {
                \NDB_Factory::singleton()->timepoint(
                    new \SessionID(strval($session_id))
                );
                $this->session_id = $session_id;
            } catch (\LorisException $e) {
                throw new \NotFound("Invalid SessionID");
            }
        } else {
            throw new \NotFound("Invalid Parameters");
        }

        $this->user = $user;
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        $pageID = isset($this->file_id)
            ? "fileID=$this->file_id" : "sessionID=$this->session_id";

        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb(
                "Feedback MRI Popup",
                "/imaging_browser/$this->page/$pageID"
            )
        );
    }

    /**
     * An NDB_Page can act as both a middleware, or a handler, depending on the
     * context. When treated as a handler, an NDB_Page calls display() and
     * converts the output to a PSR7 stream.
     *
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return ResponseInterface The PSR15 response for the page.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $this->logger->debug("NDB_Page handle called");

        $this->setup();

        if ($request->getMethod() == 'POST') {
            $this->saveData($request->getParsedBody());
        }

        return (new \LORIS\Http\Response())
            ->withBody(new \LORIS\Http\StringStream($this->display() ?? ""));
    }

    /**
     * Determine whether the user has permission to view the imaging_browser page
     *
     * @param \User $user User object
     *
     * @return bool whether the user hass access
     */
    function _hasAccess(\User $user): bool
    {
        return $user->hasAnyPermission(
            [
                'imaging_browser_view_allsites',
                'imaging_browser_phantom_allsites',
                'imaging_browser_phantom_ownsite',
            ]
        ) || (
            $user->hasStudySite()
            && $user->hasPermission('imaging_browser_view_site')
        );
    }

    /**
     *  Gets data for the feedback popup template
     *
     * @return array ($subjectData) with data for the template
     */
    function getData() : array
    {
        $DB       = $this->loris->getDatabaseConnection();
        $tpl_data = [
            'has_permission' => $this->user->hasPermission('imaging_browser_qc'),
        ];

        // instantiate feedback mri object
        $feedbackObj = new \FeedbackMRI(
            $this->file_id ?? null,
            isset($this->session_id)
                ? new \SessionID(strval($this->session_id)) : null,
        );

        // get identifier of subject/volume
        if ($feedbackObj->fileID) {
            $query = "SELECT c.CandID AS DCCID, c.PSCID, s.Visit_label,
                             s.CohortID, f.File AS File_name, st.Scan_type
                      FROM files AS f, session AS s, candidate AS c,
                           mri_scan_type AS st
                      WHERE f.FileID=:FID
                          AND f.SessionID=s.ID
                          AND s.CandID=c.CandID
                          AND f.AcquisitionProtocolID=st.ID
                          AND s.Active='Y'";

            $qparams = ['FID' => $feedbackObj->fileID];
        } elseif ($feedbackObj->sessionID) {
            $query = "SELECT c.CandID, c.PSCID, s.Visit_label, s.CohortID
                FROM session AS s, candidate AS c
              WHERE s.ID=:SID AND s.CandID=c.CandID AND s.Active='Y'";

            $qparams = ['SID' => $feedbackObj->sessionID];
        } else {
            $query = "SELECT c.CandID FROM session AS s, candidate AS c
                WHERE s.ID=:SID AND s.CandID=c.CandID AND s.Active='Y'";

            $qparams = ['SID' => $this->session_id];
        }
        $result = iterator_to_array($DB->pselect($query, $qparams));
        if (count($result) > 0) {
            $i = 0;
            foreach ($result[0] as $key => $value) {
                $tpl_data['identifier'][$i]['name']  = str_replace('_', ' ', $key);
                $tpl_data['identifier'][$i]['value'] = $value;
                $i++;
            }
        }

        // get the currently saved feedbackObj
        $saved_comments = $feedbackObj->getComments();

        // get the list of comment types
        $comment_types = $feedbackObj->getAllCommentTypes();

        // loop through the comment types
        $i = 0;
        foreach ($comment_types AS $comment_type_id => $comment_array) {
            $tpl_data['comment'][$i] = [];
            $CommentTpl =& $tpl_data['comment'][$i];

            // get the status select field value if it exists
            if (!empty($comment_array['field'])
                && ($feedbackObj->objectType == 'volume')
            ) {
                if ($this->user->hasPermission('imaging_browser_qc')) {
                    $CommentTpl['select_name']        = $comment_array['field'];
                    $CommentTpl['select_value_array'] = $comment_array['values'];
                }
                $CommentTpl['selected'] = $feedbackObj
                    ->getMRIValue(
                        $comment_array['field']
                    );
            }

            if (is_array($comment_array)) {
                $CommentTpl['name'] = $comment_array['name'];
            }

            // get the list of predefined feedbackObj for the current type
            $predefined_comments = $feedbackObj->getAllPredefinedComments(
                $comment_type_id
            );

            // loop through the predefined feedbackObj
            $j = 0;
            foreach ($predefined_comments
                     AS $predefined_comment_id => $predefined_comment_text
            ) {
                $CommentTpl['predefined'][$j] = [];
                $PredefinedTpl =& $CommentTpl['predefined'][$j];
                // print a form element
                $PredefinedTpl['id'] = $predefined_comment_id;
                $PredefinedTpl['predefined_text']
                    = $predefined_comment_text['Comment'];

                // print the comment text
                $Saved = $saved_comments[$comment_type_id] ?? [];
                if ($Saved['predefined'][$predefined_comment_id] ?? false) {
                    $CommentTpl['predefined'][$j]['checked'] = true;
                }
                $j++;
            }

            // print a form element for a free-form comment
            $CommentTpl['type']       = $comment_type_id;
            $CommentTpl['saved_text']
                = $saved_comments[$comment_type_id]['text'] ?? '';
            $i++;
        }

        return $tpl_data;
    }

    /**
     * Saves data from the feedback popup
     *
     * @param array $values values of the POST request
     *
     * @return void
     */
    public function saveData(array $values)
    {
        // instantiate feedback mri object
        $feedbackObj = new \FeedbackMRI(
            $this->file_id ?? null,
            isset($this->session_id)
                ? new \SessionID(strval($this->session_id)) : null,
        );
        // clear all predefined comments
        $feedbackObj->clearAllComments();

        // set selected predefined comments
        if (isset($values['savecomments']['predefined'])) {
            $predefined = array_map(
                function ($row) {
                    return intval($row);
                },
                \Utility::asArray($values['savecomments']['predefined']),
            );
            $feedbackObj->setPredefinedComments($predefined);
        }

        // save all textual comments but only if there is an entry [sebas]
        foreach (\Utility::asArray($values['savecomments']['text'])
            as $comment_type_id => $comment_message
        ) {
            if (trim($comment_message)) {
                $feedbackObj->addTextComment(
                    trim($comment_message),
                    $comment_type_id
                );
            }
        }

        // save all comment status fields
        if (isset($values['saveCommentStatusField'])
            && is_array($values['saveCommentStatusField'])
        ) {
            foreach ($values['saveCommentStatusField'] as $status_field => $value) {
                $feedbackObj->setMRIValue($status_field, $value);
            }
        }
    }

    /**
     * Generates the HTML to display the feedback popup
     *
     * @return string
     * @access public
     */
    function display(): string
    {
        $this->tpl_data = $this->getData();

        $smarty = new \Smarty_NeuroDB("imaging_browser");

        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("form_feedback_mri_popup.tpl");
        return $html;
    }

}
