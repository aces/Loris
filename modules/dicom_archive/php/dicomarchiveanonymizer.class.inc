<?php declare(strict_types=1);

/**
 * This class implements a data mapper which anonymizes Patient Name
 * or patient ID in the DICOM Archive based on the LORIS configuration.
 *
 * PHP Version 8
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\dicom_archive;
use \LORIS\Data\{Mapper, DataInstance
};

/**
 * A DICOMArchiveAnonymizer is a \LORIS\Data\Mapper which anonymizes improperly
 * labeled rows in the dicom archive table.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class DICOMArchiveAnonymizer implements Mapper
{
    /**
     * Maps the Patient Name and Patient ID to 'INVALID - HIDDEN' if it doesn't
     * meet the regular expressions defined in the LORIS configuration for valid
     * patient names or ids.
     *
     * @param \User                    $user     The user this data is being mapped
     *                                           for.
     * @param \LORIS\Data\DataInstance $resource The unanonymized data being mapped.
     *
     * @return \LORIS\Data\DataInstance the anonymized data
     */
    public function map(
        \User $user,
        DataInstance $resource
    ) : DataInstance {

        static $config = null;
        if ($config === null) {
            $config = \NDB_Config::singleton()->getSetting("imaging_modules");
        }

        $newrow = json_decode(json_encode($resource), true);
        if (!is_array($newrow)) {
            throw new \Exception("Error converting DataInstance to array");
        }

        // escape any forward slashes
        $pNameRegex      = preg_replace(
            '/\//',
            '\/',
            $config['patientNameRegex']
        );
        $legoPhanRegex   = preg_replace(
            '/\//',
            '\/',
            $config['LegoPhantomRegex']
        );
        $livingPhanRegex = preg_replace(
            '/\//',
            '\/',
            $config['LivingPhantomRegex']
        );
        $pIDRegex        = preg_replace(
            '/\//',
            '\/',
            $config['patientIDRegex']
        );

        if ($newrow['IsPhantom'] === 'Y') {
            $isValid = preg_match("/$legoPhanRegex/", $newrow['patientName'])
                || preg_match("/$livingPhanRegex/", $newrow['patientName']);
        } elseif ($newrow['IsPhantom'] === 'N') {
            $isValid = preg_match("/$pNameRegex/", $newrow['patientName']);
        } else {
            // if scan was uploaded via non-imaging uploader method
            // run patient name through all regex validations
            $isValid = preg_match("/$legoPhanRegex/", $newrow['patientName'])
                || preg_match("/$livingPhanRegex/", $newrow['patientName'])
                || preg_match("/$pNameRegex/", $newrow['patientName']);
        }

        if (!$isValid) {
            $newrow['patientName'] = dgettext('dicom_archive', 'INVALID - HIDDEN');
        }
        if (!preg_match("/$pIDRegex/", $newrow['patientID'] ?? '')) {
            $newrow['patientID'] = dgettext('dicom_archive', 'INVALID - HIDDEN');
        }

        if (!$resource instanceof \LORIS\StudyEntities\SiteHaver) {
            '@phan-var object $resource';
            return new DICOMArchiveRowWithoutSession(
                $newrow,
                $resource->CreatedBy()
            );
        } else {
            '@phan-var object $resource';
            return new DICOMArchiveRowWithSession(
                $newrow,
                $resource->getCenterID(),
                $resource->getProjectID(),
                $resource->getSessionID(),
                $resource->CreatedBy()
            );
        }
    }
}
