<?
// load the client
require_once 'NDB_Client.class.inc';
$client = new NDB_Client;

$client->initialize();

$filename = $_REQUEST['filename'];
$config =& NDB_Config::singleton();
$filePaths = $config->getSetting('paths');
$dataPath = $filePaths['data'];
$allowed_files=array('nihpd_public_release_images_native_t1_A_to_M.tar', 
                     'nihpd_public_release_images_cls_lob_mask_xfm.tar',
                     'nihpd_public_release_images_native_pd.tar',
                     'nihpd_public_release_images_native_t1_N_to_Z.tar',
                     'nihpd_public_release_images_native_t2.tar',
                     'nihpd_public_release_images_stx_pd_tal_A_to_M.tar',
                     'nihpd_public_release_images_stx_pd_tal_N_to_Z.tar',
                     'nihpd_public_release_images_stx_t1_tal_A_to_M.tar',
                     'nihpd_public_release_images_stx_t1_tal_N_to_Z.tar',
                     'nihpd_public_release_images_stx_t2_tal_A_to_M.tar',
                     'nihpd_public_release_images_stx_t2_tal_N_to_Z.tar',
                     'nihpd_public_release_images_nifti_cls_lob_mask_xfm.tar.gz',
                     'nihpd_public_release_images_nifti_native_pd_A_to_E.tar.gz',
                     'nihpd_public_release_images_nifti_native_pd_F_to_Q.tar.gz',
                     'nihpd_public_release_images_nifti_native_pd_R_to_Z.tar.gz',
                     'nihpd_public_release_images_nifti_native_t1_A_to_E.tar.gz',
                     'nihpd_public_release_images_nifti_native_t1_F_to_Q.tar.gz',
                     'nihpd_public_release_images_nifti_native_t1_R_to_Z.tar.gz',
                     'nihpd_public_release_images_nifti_native_t2_A_to_E.tar.gz',
                     'nihpd_public_release_images_nifti_native_t2_F_to_Q.tar.gz',
                     'nihpd_public_release_images_nifti_native_t2_R_to_Z.tar.gz',
                     'nihpd_public_release_images_nifti_stx_pd_A_to_E.tar.gz',
                     'nihpd_public_release_images_nifti_stx_pd_F_to_Q.tar.gz',
                     'nihpd_public_release_images_nifti_stx_pd_R_to_Z.tar.gz',
                     'nihpd_public_release_images_nifti_stx_t1_A_to_E.tar.gz',
                     'nihpd_public_release_images_nifti_stx_t1_F_to_Q.tar.gz',
                     'nihpd_public_release_images_nifti_stx_t1_R_to_Z.tar.gz',
                     'nihpd_public_release_images_nifti_stx_t2_A_to_E.tar.gz',
                     'nihpd_public_release_images_nifti_stx_t2_F_to_Q.tar.gz',
                     'nihpd_public_release_images_nifti_stx_t2_R_to_Z.tar.gz'
                     );

if(in_array($filename, $allowed_files)) {
    
    // setup for download
    header("Expires: 0");
    header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
    header("Pragma: public");
    
    header('Content-Type: application/force-download');
    header('Content-Length: '.filesize($filename));
    header('Content-disposition: attachment; filename='.$filename);
    
    $loggedInUser =& User::singleton();
    $downloadingUserID = $loggedInUser->getData('ID');
   
    // Add field download time or change the download date format to include the time.
    $downloadDate = date("Y-m-d G:i");
    
    $DB->insert('user_logs', array('Filename'=>$filename, 'UserID'=>$downloadingUserID, 'Download_Date'=>$downloadDate));
    
    $handle = fopen ($dataPath.'/'.$filename, "r");
    fpassthru($handle);
    exit(0);
} else {
    print "You cannot download that file.</br>\n";
}
?>
