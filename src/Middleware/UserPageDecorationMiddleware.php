<?php
namespace LORIS\Middleware;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\{MiddlewareInterface, RequestHandlerInterface};

class UserPageDecorationMiddleware implements MiddlewareInterface {
    protected $JSFiles;
    protected $CSSFiles;
    protected $Config;
    protected $BaseURL;
    protected $PageName;

    public function __construct(\User $user, string $baseurl, string $pagename, \NDB_Config $config, array $JS, array $CSS) {
        $this->JSFiles = $JS;
        $this->CSSFiles = $CSS;
        $this->Config = $config;
        $this->BaseURL = $baseurl;
        $this->PageName = $pagename;
        $this->user = $user;
    }

    /**
     * Displays a page to an anonymous (not logged in) user.
     *
     * @param array $get  The GET parameters from the request.
     * @param array $post The POST parameters from the request.
     *
     * @return string the page content
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler) : ResponseInterface { 
        ob_start();
        // Set the page template variables
        $tpl_data = array(
                     'test_name' => $this->PageName,
                    );

        // Basic page outline variables
        $tpl_data += array(
                      'study_title' => $this->Config->getSetting('title'),
                      'baseurl'     => $this->BaseURL,
                      'tabs'        => \NDB_Config::getMenuTabs(),
                      'crumbs'      => (new \NDB_Breadcrumb())->getBreadcrumb(),
                      'currentyear' => date('Y'),
                      'sandbox'     => ($this->Config->getSetting("sandbox") === '1'),
                     );


        $get = $request->getQueryParams();
        $tpl_data['candID']      = $get['candID'] ?? '';
        $tpl_data['sessionID']   = $get['sessionID'] ?? '';
        $tpl_data['commentID']   = $get['commentID'] ?? '';
        $tpl_data['dynamictabs'] = $get['dynamictabs'] ?? '';

        if (!empty($get['candID'])) {
            $candidate = \Candidate::singleton($get['candID']);

            $tpl_data['candidate'] = $candidate->getData();
        }

        // Stuff that probably shouldn't be here, but exists because it was in
        // main.php

        // This seems to only be used in imaging_browser, it can probably be
        // moved to properly use OOP.
        $tpl_data['formaction'] = $this->FormAction ?? '';
        // Doesn't appear to be used
        $tpl_data['lastURL'] = $_SESSION['State']->getLastURL();
        // I don't think anyone uses this. It's not really supported
        $tpl_data['css'] = $this->Config->getSetting('css');


        // This should be moved out of the middleware and into the modules that need it,
        // but is currently required for backwards compatibility.
        $page = $request->getAttribute("pageclass");
        if (method_exists($page, 'getControlPanel')) {
            $tpl_data['control_panel'] = $page->getControlPanel();
        }
        if (method_exists($page, 'getFeedbackPanel')
            && $user->hasPermission('bvl_feedback')
        ) {
            $tpl_data['feedback_panel'] = $page->getFeedbackPanel(
                $get['candID'],
                $get['sessionID'] ?? null
            );

            $tpl_data['bvl_feedback'] = NDB_BVL_Feedback::bvlFeedbackPossible(
                $this->page
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
                                        'ConsentModule'
                                    )['useConsent'],
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
        $site_arr = $this->user->getData('CenterIDs');
        foreach ($site_arr as $key=>$val) {
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

        $undecorated = $handler->handle($request);
        // Finally, the actual content and render it..
        $tpl_data += array(
                      'jsfiles'   => $this->JSFiles,
                      'cssfiles'  => $this->CSSFiles,
                      'workspace' => $undecorated->getBody(),
                     );

        // Assign the console template variable as the very, very last thing.
        $tpl_data['console'] = htmlspecialchars(ob_get_contents());
        ob_end_clean();

        $undecorated = $handler->handle($request);
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
