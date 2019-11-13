<?php
namespace LORIS\Middleware;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\MiddlewareInterface;
use \Psr\Http\Server\RequestHandlerInterface;

use LORIS\StudyEntities\Candidate\CandID;

class UserPageDecorationMiddleware implements MiddlewareInterface
{
    protected $JSFiles;
    protected $CSSFiles;
    protected $Config;
    protected $BaseURL;
    protected $PageName;

    public function __construct(
        \User $user,
        string $baseurl,
        string $pagename,
        \NDB_Config $config,
        array $JS,
        array $CSS
    ) {

        $this->JSFiles  = $JS;
        $this->CSSFiles = $CSS;
        $this->Config   = $config;
        $this->BaseURL  = $baseurl;
        $this->PageName = $pagename;
        $this->user     = $user;
    }

    /**
     * Displays a page to an logged in user, adding the necessary
     * header/footer/etc page decorations.
     *
     * @param ServerRequestInterface  $request The incoming request
     * @param RequestHandlerInterface $handler The handler to decorate
     *
     * @return ResponseInterface a PSR15 response of handler, after adding decorations.
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler) : ResponseInterface
    {
        ob_start();
        // Set the page template variables
        // $user is set by the page base router
        $user     = $request->getAttribute("user");
        $tpl_data = array(
                     'test_name' => $this->PageName,
                    );

        // Basic page outline variables
        $tpl_data += array(
                      'study_title' => $this->Config->getSetting('title'),
                      'baseurl'     => $this->BaseURL,
                      'tabs'        => \NDB_Config::getMenuTabs(),
                      'currentyear' => date('Y'),
                      'sandbox'     => ($this->Config->getSetting("sandbox") === '1'),
                     );

        $get = $request->getQueryParams();
        $tpl_data['sessionID']   = $get['sessionID'] ?? '';
        $tpl_data['commentID']   = $get['commentID'] ?? '';
        $tpl_data['dynamictabs'] = $get['dynamictabs'] ?? '';

        $candID = $request->getAttribute("CandID");
        if ($candID == null && !empty($get['candID'])) {
            $candID = $get['candID'];
        }
        if ($candID != null) {
            $candID    = new CandID($candID);
            $candidate = \Candidate::singleton($candID);

            $tpl_data['candidate'] = $candidate->getData();
        }
        $tpl_data['candID'] = $candID ?? '';

        $timepoint = $request->getAttribute("TimePoint");
        if (!empty($timepoint)) {
            $tpl_data['timePoint'] = $timepoint->getData();
        }

        // Stuff that probably shouldn't be here, but exists because it was in
        // main.php

        // I don't think anyone uses this. It's not really supported
        $tpl_data['css'] = $this->Config->getSetting('css');

        $page = $request->getAttribute("pageclass");
        if (method_exists($page, 'getFeedbackPanel')
            && $user->hasPermission('bvl_feedback')
            && $candID !== null
        ) {
            $tpl_data['feedback_panel'] = $page->getFeedbackPanel(
                $candID,
                $get['sessionID'] ?? null
            );

            $tpl_data['bvl_feedback'] = \NDB_BVL_Feedback::bvlFeedbackPossible(
                $this->PageName
            );
        }

        // This shouldn't exist. (And if it does, it shouldn't reference
        // mantis..)
        $tpl_data['issue_tracker_url'] = $this->Config->getSetting('issue_tracker_url');

        // We're back in the territory of stuff that belongs here..

        // Variables that get passed along to the LorisHelper javascript object.
        $tpl_data['studyParams'] = array(
                                    'useEDC'      => $this->Config->getSetting('useEDC'),
                                    'useProband'  => $this->Config->getSetting(
                                        'useProband'
                                    ),
                                    'useFamilyID' => $this->Config->getSetting(
                                        'useFamilyID'
                                    ),
                                    'useConsent'  => $this->Config->getSetting(
                                        'useConsent'
                                    ),
                                   );
        $tpl_data['jsonParams']  = json_encode(
            array(
             'BaseURL'   => $this->BaseURL,
             'TestName'  => $tpl_data['test_name'] ?? '',
             'Subtest'   => $tpl_data['subtest'] ?? '',
             'CandID'    => $tpl_data['candID'] ?? '',
             'SessionID' => $tpl_data['sessionID'] ?? '',
             'CommentID' => $tpl_data['commentID'] ?? '',
            )
        );

        // User related template variables that used to be in main.php.
        $site_arr    = $this->user->getData('CenterIDs');
        $site        = array();
        $isStudySite = array();
        foreach ($site_arr as $key => $val) {
            $site[$key]        = & \Site::singleton($val);
            $isStudySite[$key] = $site[$key]->isStudySite();
        }

        $oneIsStudySite   = in_array("1", $isStudySite);
        $tpl_data['user'] = $this->user->getData();
        $tpl_data['user']['permissions']          = $this->user->getPermissions();
        $tpl_data['user']['user_from_study_site'] = $oneIsStudySite;
        $tpl_data['userNumSites']         = count($site_arr);
        $tpl_data['user']['SitesTooltip'] = str_replace(
            ";",
            "<br/>",
            $this->user->getData('Sites')
        );

        $tpl_data['hasHelpEditPermission'] = $this->user->hasPermission(
            'context_help'
        );

        // FIXME: This should be array_filter
        $realPerms = array();
        foreach ($this->user->getPermissions() as $permName => $hasPerm) {
            if ($hasPerm === true) {
                $realPerms[] = $permName;
            }
        }
        $tpl_data['userPerms'] = $realPerms;

        //Display the footer links, as specified in the config file
        $links = $this->Config->getExternalLinks('FooterLink');

        $tpl_data['links'] = array();
        foreach ($links as $label => $url) {
            $WindowName = md5($url);

            $tpl_data['links'][] = array(
                                    'url'        => $url,
                                    'label'      => $label,
                                    'windowName' => $WindowName,
                                   );
        }

        // Handle needs to be called before formaction, because handle potentially
        // calls setup which modifies the $page->FormAction value (ie in the imaging
        // browser)
        $undecorated = $handler->handle($request);
        $contenttype = $undecorated->getHeaderLine("Content-Type");
        if ($contenttype != "" && strpos($contenttype, "text/html") === false) {
            // FIXME: This should explicitly check for text/html instead of implicitly treating
            // no content type as text/html, but most of our code doesn't add an appropriate
            // content type right now, so we default to assuming HTML.
            return $undecorated;
        }

        // This should be moved out of the middleware and into the modules that need it,
        // but is currently required for backwards compatibility.
        // This should also come after the above call to handle() in order for updated data
        // on the controlPanel to be properly displayed.
        if (method_exists($page, 'getControlPanel')) {
            $tpl_data['control_panel'] = $page->getControlPanel();
        }

        // This seems to only be used in imaging_browser, it can probably be
        // moved to properly use OOP.
        $tpl_data['FormAction'] = $page->FormAction ?? '';

        if ($page instanceof \NDB_Page) {
            $tpl_data['breadcrumbs'] = $page->getBreadcrumbs();
        }

        // Assign the console template variable as the very, very last thing.
        $tpl_data['console'] = htmlspecialchars(ob_get_contents());
        ob_end_clean();

        // Finally, the actual content and render it..
        $tpl_data += array(
                      'jsfiles'   => $this->JSFiles,
                      'cssfiles'  => $this->CSSFiles,
                      'workspace' => $undecorated->getBody(),
                     );

        $smarty = new \Smarty_neurodb;
        $smarty->assign($tpl_data);
        return $undecorated->withBody(new \LORIS\Http\StringStream($smarty->fetch("main.tpl")));
    }
}
