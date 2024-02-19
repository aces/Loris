<?php
/**
 * This file loads the Edit file page
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Document_Repository
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\document_repository;
/**
 * Create the form for document_repository/edit page
 *
 * @category Loris
 * @package  Document_Repository
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Edit extends \NDB_Page
{
    public $skipTemplate = true;
    /**
     * Check user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('document_repository_edit');
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        $label = ucwords(str_replace('_', ' ', $this->name));
        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb($label, "/$this->name"),
            new \LORIS\Breadcrumb(
                'Edit',
                "/" . $_GET['lorispath']
            )
        );
    }

    /**
     * Add Javascript dependencies
     *
     * @return array The list of Javascript files this page depends on
     */
    function getJSDependencies(): array
    {
        return [
            '/document_repository/js/editFormIndex.js'
        ];
    }
}
