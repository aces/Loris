<?php
/**
 * Examiner module menu filter form
 *
 * PHP Version 5
 *
 * @category Clinical
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
namespace LORIS\examiner;

/**
 * Examiner module menu filter form
 *
 * PHP Version 5
 *
 * @category Clinical
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */

class Examiner extends \DataFrameworkMenu
{
    public $skipTemplate  = true;
    var $useCertification = false;

    /**
     * Checks if the user has access to examiner menu filter
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'examiner_view',
                'examiner_multisite',
            ]
        );
    }
    /**
     * Tells the base class that this page's provisioner can support the
     * HasAnyPermissionOrUserSiteMatch filter.
     *
     * @return ?array of site permissions or null
     */
    public function allSitePermissionNames() : ?array
    {
        return null;
    }
     public function toJSON(): string
   {
                  $config        = \NDB_Config::singleton();
       $certification = $config->getSetting('Certification');

       if (isset($certification['EnableCertification'])) {
           $this->useCertification = $certification['EnableCertification'];
      }

          $json_new = json_decode(parent::toJSON(),true);
          $json_new["useCertification"] = ($this->useCertification == 1) ? true : false;
          return json_encode($json_new);
   }    
    /**
     * {@inheritDoc}
     *
     * @return array
     */
    protected function getFieldOptions() : array
    {
        $yesNoOptions = [
            '1' => 'Yes',
            '0'  => 'No',
        ];
        $user = \User::singleton();

        // Get site options
        if ($user->hasPermission('examiner_multisite')) {
            // get the list of study sites - to be replaced by the Site object
            $sites = \Utility::getSiteList();
        } else {
            // allow only to view own site data
            $sites = $user->getStudySites();
        }

        return [
		'radiologists' => $yesNoOptions,
                'sites'        => $sites,

        ];

    }
        public function useProjectFilter() : bool
    {
        return false;
	}
    /**
     * {@inheritDoc}
     *
     * @return \Loris\Data\Provisioner
     */
    public function getBaseDataProvisioner(): \LORIS\Data\Provisioner
    {
        return new ExaminerProvisioner();
    }
    /**
     * Include the index examiner javascript dependency
     *
     * @return array
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/examiner/js/examinerIndex.js",
            ]
        );
    }    
}    

