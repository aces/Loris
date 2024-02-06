<?php
/**
 * This file sets up the Edit Help Content page and form.
 *
 * PHP Version 7
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
    function _hasAccess(\User $user) : bool
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
        if (!($this->_hasAccess($user))) {
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
                htmlspecialchars($gets['section']) : null,
            'subsection' => isset($gets['subsection']) ?
                htmlspecialchars($gets['subsection']) : null,
            'helpid'     => isset($gets['helpID']) ?
                htmlspecialchars($gets['helpID']) : null,
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
            $help_data       = HelpFile::factory($data['helpid'])->toArray();
            $data['title']   = $help_data['topic'];
            $data['content'] = htmlspecialchars_decode(trim($help_data['content']));
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
}


