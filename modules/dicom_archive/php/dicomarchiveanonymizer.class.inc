<?php
/**
 * This class implements a data mapper which anonymizes Patient Name
 * or patient ID in the DICOM Archive based on the LORIS configuration.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\dicom_archive;

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
class DICOMArchiveAnonymizer implements \LORIS\Data\Mapper
{
    /**
     * Maps the Patient Name and Patient ID to 'INVALID - HIDDEN' if it doesn't
     * meet the regular expressions defined in the LORIS configuration for valid
     * patient names or ids.
     *
     * @param \User                $user     The user this data is being mapped for
     * @param \LORIS\Data\Instance $resource The unanonymized data being mapped.
     *
     * @return \LORIS\Data\Instance the anonymized data
     */
    public function map(
        \User $user,
        \LORIS\Data\Instance $resource
    ) : \LORIS\Data\Instance {

        static $config = null;
        if ($config === null) {
            $config = \NDB_Config::singleton()->getSetting("imaging_modules");
        }

        $newrow = $resource->ToArray();
        $cid    = $resource->getCenterID();

        if (!preg_match($config['patientNameRegex'], $newrow['Patient Name'])
            && !preg_match($config['LegoPhantomRegex'], $newrow['Patient Name'])
            && !preg_match($config['LivingPhantomRegex'], $newrow['Patient Name'])
        ) {
            $newrow['Patient Name'] = 'INVALID - HIDDEN';
        }
        if (!preg_match($config['patientIDRegex'], $newrow['Patient ID'])) {
            $newrow['Patient ID'] = 'INVALID - HIDDEN';
        }
        return new DICOMArchiveRow($newrow, $cid);
    }
}
