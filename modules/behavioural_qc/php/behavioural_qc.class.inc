<?php
/**
 * This is a file called used by the behavioural qc browser
 * auto-complete to retrieve candidates for a given
 * instrument and/or visit.
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Loris
 * @author   Evan McIlroy <evanmcilroy@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\behavioural_qc;
/**
 * This is a file called used by the behavioural qc browser
 * auto-complete to retrieve candidates for a given
 * instrument and/or visit.
 *
 * @category Behavioural
 * @package  Loris
 * @author   Evan McIlroy <evanmcilroy@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
class Behavioural_QC extends \NDB_Form
{
    public $skipTemplate = true; // stops from looking for a smarty template

    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('behavioural_quality_control_view');
    }

    /**
     * Add Javascript dependencies
     *
     * @return array The list of Javascript files this page depends on
     */
    function getJSDependencies(): array
    {
        return [
            '/behavioural_qc/js/behaviouralQCIndex.js',
        ];
    }

    /**
     * Add CSS dependencies
     *
     * @return array The list of CSS files this page depends on
     */
    function getCSSDependencies(): array
    {
        return [
            '/behavioural_qc/css/behavioural_qc.css'
        ];
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
                'Behavioural Quality Control',
                '/behavioural_qc'
            )
        );
    }
}
