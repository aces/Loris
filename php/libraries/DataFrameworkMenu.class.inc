<?php declare(strict_types=1);

/**
 * This class implements a DataFrameworkMenu, a specific type of
 * menu filter where the front end is generated from React and the
 * data comes from a \LORIS\Data\Provisioner.
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Message\StreamInterface;
use \Psr\Http\Server\RequestHandlerInterface;
/**
 * A DataFrameworkMenu is a type of menu (filterable data table)
 * where the data comes from the LORIS data framework, and the
 * formatting is done by React. They are often used as a landing
 * page for a LORIS module.
 *
 * "Menu" type data tables are pages where data relevant to a specific
 * domain are presented in a table and accompanied by filters as well as
 * a mechanism to navigate from a row in the table to a page with details
 * of that row's specific data instance details. This class's toJSON
 * returns an object containing the data from the LORIS data framework
 * for the table, and the fieldOptions required to build the filters
 * for any dynamic filters.
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
abstract class DataFrameworkMenu extends NDB_Menu_Filter
{

    /**
     * Constructor for a DataFrameworkMenu class. This signature must match
     * the base NDB_Page type in order for LORIS to be able to load the page.
     *
     * @param \LORIS\LorisInstance $loris      The LORIS instance the page is serving
     * @param Module               $module     The test name being accessed
     * @param string               $page       The subtest being accessed (may be an
     *                                         empty string)
     * @param string               $identifier The identifier for the data to load
     *                                         on this page
     * @param string               $commentID  The CommentID to load the data for
     */
    public function __construct(
        \LORIS\LorisInstance $loris,
        \Module $module,
        string $page,
        string $identifier,
        string $commentID
    ) {
        parent::__construct($loris, $module, $page, $identifier, $commentID);

        $this->AjaxModule   = true;
        $this->skipTemplate = true;
    }

    /**
     * Determines which site permission(s) should be used to determine
     * whether or not non-user sites are filtered out. If the user has
     * any of the permissions, non-user sites are *NOT* filtered out.
     * If the result is null, the page does not use site filters at all.
     *
     * @return ?array
     */
    abstract public function allSitePermissionNames() : ?array;


    /**
     * Determines whether the DataProvisioner should filter out rows which
     * do not match the user's project.
     *
     * @return bool true if the data provisioner should filter non-matching projects.
     */
    abstract public function useProjectFilter() : bool;

    /**
     * Items to add to the JSON fieldOptions key, which React components
     * can use for formatting. This is used to send data dependent options
     * to the frontend.
     *
     * @return array An array of data-context sensitive GUI options.
     */
    abstract protected function getFieldOptions() : array;

    /**
     * Return the base Provisioner, without any filters applied.
     *
     * @return \LORIS\Data\Provisioner the basic data provisioner
     */
    abstract public function getBaseDataProvisioner() : \LORIS\Data\Provisioner;

    /**
     * Return a data provisioner of the same type as BaseDataProvisioner, with
     * default LORIS filters applied. A subclass may override this to remove (or
     * change) filters.
     *
     * @return \LORIS\Data\Provisioner a provisioner with default filters added
     */
    public function getDataProvisionerWithFilters() : \LORIS\Data\Provisioner
    {
        $provisioner = $this->getBaseDataProvisioner();

        // UserSiteMatch throws an exception if used on a model without a getCenterID
        // or getCenterIDs function, so we only apply it on sub-classes that
        // specifically say they support it.
        $allSitePerms = $this->allSitePermissionNames();
        if ($allSitePerms != null) {
            $provisioner = $provisioner->filter(
                new \LORIS\Data\Filters\HasAnyPermissionOrUserSiteMatch(
                    $allSitePerms
                )
            );
        }

        if ($this->useProjectFilter()) {
            $provisioner = $provisioner->filter(
                new \LORIS\Data\Filters\UserProjectMatch()
            );
        }
        return $provisioner;
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return string a json encoded string of the headers and data from this table
     */
    public function toJSON(): string
    {
        $table = (new \LORIS\Data\Table())
            ->withDataFrom($this->getDataProvisionerWithFilters());
        $arr   = array_map(
            function ($row) {
                return array_values($row);
            },
            json_decode($table->toJSON(\NDB_Factory::singleton()->user()), true)
        );

        return json_encode(
            [
                'Data'         => $arr,
                'fieldOptions' => $this->getFieldOptions(),
            ]
        );
    }

    /**
     * An NDB_Page can act as both a middleware, or a handler, depending on the
     * context. When treated as a middleware, the page is responsible for setting
     * up any middleware required to access the page. By default, this will
     * implement the page decoration middlewares which is responsible for adding
     * the LORIS menu's/headers/footers/etc.
     * This can be overridden by modules who don't want this behaviour (such
     * as API endpoints).
     *
     * @param ServerRequestInterface  $request The PSR7 request being processed.
     * @param RequestHandlerInterface $handler The handler to handle the request
     *                                         after processing the middleware.
     *
     * @return ResponseInterface the PSR15 response that was generated by the
     * middleware
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        if (($request->getQueryParams()['format'] ?? '') === 'binary') {
            return (new \LORIS\Middleware\Compression())->process(
                $request,
                $handler
            );
        } else {
            return parent::process($request, $handler);
        }
    }

    /**
     * {@inheritDoc}
     *
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return ResponseInterface The PSR15 response for the page.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        if (($request->getQueryParams()['format'] ?? '') === 'binary') {
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "application/octet-stream")
                ->withBody($this->toBinaryStream());
        }
        return parent::handle($request);
    }

    /**
     * Return a PSR7 StreamInterface which streams the data for this table
     * as a binary stream
     *
     * @return StreamInterface Stream of the table data
     */
    public function toBinaryStream(): StreamInterface
    {
        $table = (new \LORIS\Data\Table())
            ->withDataFrom($this->getDataProvisionerWithFilters());
        $rows  = $table->getRows(\NDB_Factory::singleton()->user());
        return new \LORIS\Http\DataIteratorBinaryStream($rows);

    }

    /**
     * Format the user's projects to display the module filter options
     *
     * @param \User $user        User
     * @param bool  $numericKeys If the returned projects keys
     *                           should be numeric (ProjectID) or project name
     *
     * @return array - an associative array of the form (ID|mame => name)
     */
    public function getProjectOptions(
        \User $user,
        bool  $numericKeys = true
    ): array {
        $projects     = $user->getProjects();
        $projectNames = array_map(
            fn($project) => $project->getName(),
            $projects
        );

        if ($numericKeys) {
            $projectIDs = array_map(
                fn($project) => strval($project->getId()),
                $projects
            );
            return array_combine($projectIDs, $projectNames);
        }

        return array_combine($projectNames, $projectNames);
    }

    /**
     * Format the user's cohorts to display the module filter options
     *
     * @param \User $user        User
     * @param bool  $numericKeys If the returned cohorts keys
     *                           should be numeric (CohortID)
     *                           or strings (cohort name)
     *
     * @return array - an associative array of the form (ID => name)
     */
    public function getCohortOptions(
        \User $user,
        bool $numericKeys = true
    ): array {
        $cohortOptions = array_reduce(
            $user->getProjects(),
            fn($cohorts, $project) =>
                $cohorts
                + array_column($project->getCohorts(), 'title', 'cohortId'),
            []
        );

        if (!$numericKeys) {
            $cohortNames = array_values($cohortOptions);
            return array_combine($cohortNames, $cohortNames);
        }

        return $cohortOptions;
    }

    /**
     * Format the user's sites to display the module filter options
     *
     * @param \User $user        User
     * @param bool  $numericKeys If the returned sites keys should be
                                 numeric (CenterID) or strings (site name)
     * @param bool  $studySite   If the returned sites should be study sites only
     *
     * @return array An associative array of the form (ID|name => name)
     */
    public function getSiteOptions(
        \User $user,
        bool $numericKeys = true,
        bool $studySite = true
    ): array {
        // If the user has any of the All Site permissions,
        // get the list of all study sites
        if ($user->hasAnyPermission($this->allSitePermissionNames())) {
            $siteOptions = \Utility::getSiteList($studySite);
        } else {
            $siteOptions = $user->getStudySites();
        }

        if (!$numericKeys) {
            $siteNames = array_values($siteOptions);
            return array_combine($siteNames, $siteNames);
        }

        return $siteOptions;
    }
}

