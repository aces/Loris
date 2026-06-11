<?php declare(strict_types=1);

/**
 * This file sets up the Edit Help Content page and form.
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Sekaran <sekaranrathi@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\help_editor;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * A class for holding a set of functions to add/update content
 * for all modules
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Sekaran <sekaranrathi@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */

class Edit_Help_Content extends \NDB_Form
{
    /**
     * Determine if user has permission to access this page
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if access is permitted
     */
    #[\Override]
    public function isAccessibleBy(\User $user) : bool
    {
        return $user->hasPermission('context_help');
    }

    /**
     * Handle the incoming request. This extracts URLs of the form
     * /issue_tracker/issue/3 and extracts the issueID so that it's accessible
     * from the rest of the code as a class variable.
     *
     * @param ServerRequestInterface $request The incoming client request
     *
     * @return ResponseInterface The PSR15 response.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $user = $request->getAttribute("user");
        if ($user === null && !($user instanceof \User)) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                "No valid user"
            );
        }
        if (!($this->isAccessibleBy($user))) {
            return new \LORIS\Http\Response\JSON\Forbidden();
        }

        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGet($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                ['GET']
            );
        }
    }

    /**
     * Handle GET requests for attachment.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        $gets = $request->getQueryParams();
        $data = [
            'title'      => null,
            'content'    => 'Under Construction',
            'section'    => isset($gets['section']) ?
                htmlspecialchars(
                    $gets['section'],
                    ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5,
                    'UTF-8',
                    false
                )
                    : null,
            'subsection' => isset($gets['subsection']) ?
                htmlspecialchars(
                    $gets['subsection'],
                    ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5,
                    'UTF-8',
                    false
                )
                    : null,
            'helpid'     => isset($gets['helpID']) ?
                htmlspecialchars(
                    $gets['helpID'],
                    ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5,
                    'UTF-8',
                    false
                )
        : null,
        ];

        if (!empty($data['section'])) {
            try {
                $data['helpid'] = HelpFile::hashToID(md5($data['section']));
            } catch (\NotFound $e) {
            }
        }

        if (!empty($safeSection) && $data['subsection'] != 'undefined') {
            try {
                $data['helpid'] = HelpFile::hashToID(md5($data['subsection']));
            } catch (\NotFound $e) {
            }
        }

        if ($data['helpid']) {
            $help_data          = HelpFile::factory($data['helpid'])->toArray();
            $data['title']      = $help_data['topic'];
            $data['content']    = htmlspecialchars_decode(
                trim(
                    $help_data['content']
                )
            );
            $data['instrument'] = $help_data['instrument'];
            $data['instrumentslist'] = [];
            $instrumentList          = \NDB_BVL_Instrument::getInstrumentNamesList(
                $request->getAttribute("loris")
            );
                   $data['instrumentslist'] =  $instrumentList;

            if ($data['helpid'] =='null') {
                $data['instrumentslist'] =  $instrumentList;
            }
        }

        // case where no help content exists
        if (empty($data['title'])) {
            if (!empty($data['section'])) {
                $data['title'] = str_replace("_", " ", $data['section']);
            }

            // if not module and not instrument, should be a subtest
            if (!empty($data['subsection'])
                && $data['subsection'] != 'undefined'
            ) {
                $data['title'] = str_replace("_", " ", $data['subsection']);
            }
        }

        $data['edit_help_text'] = dgettext('help_editor', 'Edit Help Content');
        $data['display_title']  = !empty($data['title']) ? $data['title'] :
         $data['edit_help_text'];

        $this->tpl_data = $data;
        return (new \LORIS\Http\Response())
            ->withBody(new \LORIS\Http\StringStream($this->display() ?? ""));
    }

    /**
     * GetJSDependencies
     *
     * @return array of javascript files to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/help_editor/js/helpEditorForm.js",
            ]
        );
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb(
                dgettext("help_editor", 'Help Editor'),
                '/help_editor/'
            ),
            new \LORIS\Breadcrumb(
                dgettext("help_editor", 'Edit Help Content'),
                "/help_editor/edit_help_content"
            )
        );
    }
}


