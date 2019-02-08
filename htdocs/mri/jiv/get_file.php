<?php
/**
 * Controls access to files on the filesystem. This script should ensure that
 * only files relative to the paths specified in the config.xml are accessible.
 * By calling new NDB_Client(), it also makes sure that the user is logged in to
 * Loris.
 *
 * It also does validation to make sure said paths are specified and not set to /
 * for security reasons.
 *
 * Used by MRI Browser and (old) Data Query GUI.
 *
 * PHP Version 5
 *
 *  @category Loris
 *  @package  MRI
 *  @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 *  @license  Loris license
 *  @link     https://github.com/aces/Loris-Trunk
 */

require_once __DIR__ . "/../../../vendor/autoload.php";
// Since we're sending binary data, we don't want PHP to print errors or warnings
// inline. They'll still show up in the Apache logs.
ini_set("display_errors", "Off");

// Ensures the user is logged in, and parses the config file.
$client = new NDB_Client();
if ($client->initialize("../../../project/config.xml") == false) {
    http_response_code(401);
    echo "User is not authenticated.";
    return;
}

// Checks that config settings are set
$config   = \NDB_Config::singleton();
$paths    = $config->getSetting('paths');
$pipeline = $config->getSetting('imaging_pipeline');

$imagePath    = $paths['imagePath'];
$DownloadPath = $paths['DownloadPath'];
$tarchivePath = $pipeline['tarchiveLibraryDir'];
// Basic config validation
if (!validConfigPaths(
    array(
     $imagePath,
     $DownloadPath,
     $tarchivePath,
    )
)) {
    http_response_code(500);
    return;
}

// Resolve the filename before doing anything.
$File = Utility::resolvePath($_GET['file']);
if (!validDownloadPath($File)) {
    http_response_code(400);
    return;
}

// Find the extension
$path_parts = pathinfo($File);
$FileExt    = $path_parts['extension'];
$FileBase   = $path_parts['basename'];

//make sure that we have a .nii.gz image if FileExt equal gz
if (strcmp($FileExt, "gz") == 0) {
    $path_subparts = pathinfo($path_parts['filename']);
    if (strcmp($path_subparts['extension'], "nii")==0) {
        $FileExt = "nii.gz";
    }
}
unset($path_parts);

// If basename of $File starts with "DCM_", prefix automatically
// inserted by the LORIS-MRI pipeline, identify it as $FileExt:
// "DICOMTAR"
// Caveat: this is not a real file extension, but a LORIS-MRI
// convention to identify archived DICOMs
if (strpos($FileBase, "DCM_") === 0) {
    $FileExt = "DICOMTAR";
}

/* Determine and construct the appropriate download path for the requested file
 * name based on its extension.
 */
$DownloadFilename = '';
switch($FileExt) {
case 'mnc':
    $FullPath         = $imagePath . '/' . $File;
    $MimeType         = "application/x-minc";
    $DownloadFilename = basename($File);
    break;
case 'nii':
    $FullPath         = $imagePath . '/' . $File;
    $MimeType         = "application/x-nifti";
    $DownloadFilename = basename($File);
    break;
case 'nii.gz':
    $FullPath         = $imagePath . '/' . $File;
    $MimeType         = "application/x-nifti-gz";
    $DownloadFilename = basename($File);
    break;
case 'png':
    $FullPath = $imagePath . '/' . $File;
    $MimeType = "image/png";
    break;
case 'jpg':
    $FullPath = $imagePath . '/' . $File;
    $MimeType = "image/jpeg";
    break;
case 'header':
case 'raw_byte.gz':
    // JIVs are relative to imagePath for historical reasons
    // And they don't have a real mime type.
    $FullPath = $imagePath . '/' . $File;
    $MimeType = 'application/octet-stream';
    break;
case 'xml':
    $FullPath         = $imagePath . '/' . $File;
    $MimeType         = 'application/xml';
    $DownloadFilename = basename($File);
    break;
case 'nrrd':
    $FullPath         = $imagePath . '/' . $File;
    $MimeType         = 'image/vnd.nrrd';
    $DownloadFilename = basename($File);
    break;
case 'DICOMTAR':
    // ADD case for DICOMTAR
    $FullPath         = $tarchivePath . '/' . $File;
    $MimeType         = 'application/x-tar';
    $DownloadFilename = basename($File);
    $PatientName      = $_GET['patientName'] ?? '';
    break;
default:
    $FullPath         = $DownloadPath . '/' . $File;
    $MimeType         = 'application/octet-stream';
    $DownloadFilename = basename($File);
    break;
}

// Make sure file exists.
if (!file_exists($FullPath)) {
    error_log("ERROR: Requested file $FullPath does not exist");
    http_response_code(404);
    return;
}

// Build and send the response with the file data.
header("Content-type: $MimeType");

// Build filename and send attachment Content-Disposition header for files that
// should be downloaded rather than displayed, i.e. png, jpg, header, and
// raw_byte.gz files.
if (!empty($DownloadFilename)) {
    // Prepend the patient name to the beginning of the file name.
    if ($FileExt === 'DICOMTAR' && !empty($PatientName)) {
        /* Format: $Filename_$PatientName.extension
         *
         * basename() is used around $PatientName to prevent the use of
         * relative path traversal characters.
         */

        $DownloadFilename = basename($PatientName) .
            '_' .
            pathinfo($DownloadFilename, PATHINFO_FILENAME) .
            '.' .
            pathinfo($DownloadFilename, PATHINFO_EXTENSION);

    }
    header("Content-Disposition: attachment; filename=$DownloadFilename");
}
$fp = fopen($FullPath, 'r');
fpassthru($fp);
fclose($fp);

/**
 * Checks that config settings used are not empty and not the root dir.
 *
 * @param array $paths The values to validate.
 *
 * @return bool
 */
function validConfigPaths(array $paths): bool
{
    foreach ($paths as $p) {
        if (empty($p)) {
            throw new \LorisException(
                'Config paths are not initialized. Please ensure that valid paths ' .
                'are set for imagePath, downloadPath and tarchiveLibraryDir'
            );
            return false;
        }
        if ($p === '/') {
            throw new \LorisException(
                'Config path invalid. Paths cannot be set to root, i.e., `/`' .
                ' Please verify your path settings for imagePath, ' .
                'downloadPath and tarchiveLibraryDir.'
            );
            return false;
        }
    }
    return true;
}

/**
 * Check that the requested download path does not have the '..' sequence and
 * that it has an intelligible file extension.
 *
 * @param string $path The requested file.
 *
 * @return bool Whether the path passes the validation criteria.
 */
function validDownloadPath($path): bool
{
    // Extra sanity checks, just in case something went wrong with path
    // resolution.
    if (strpos($path, '.') === false) {
        error_log('ERROR: Invalid filename. Could not determine file type');
        return false;
    }
    // Make sure that the user isn't trying to break out of the $path by
    // using a relative filename.
    // No need to check for '/' since all downloads are relative to $imagePath or
    // $DownloadPath
    if (strpos($path, "..") !== false) {
        error_log(
            'ERROR: Invalid filename. Contains path traversal characters'
        );
        return false;
    }
    return true;
}