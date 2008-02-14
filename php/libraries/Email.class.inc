<?php
require_once "PEAR.php";

/**
 * Email class
 * @package main
 */
class Email extends PEAR
{
    /**
     * Sends email using templates
     *
     * Every template MUST BEGIN with "Subject: subject text". Put new 
     * templates in the subfolder "email" of the Smarty templates folder.
     * Subjects CAN be assigned using Smarty.
     *
     * @param string   $to email addresses to send email to 
     * @param string   $subject email's subject
     * @param string   $template template to use
     * @param array    $tpl_data template's data
     * @param string   $reply_to optional
     * @param string   $from optional
     * @param string   $cc optional
     * @param string   $bcc optional
     * @return void
     * @access public
     * @static
     */
    function send($to, $template, $tpl_data = array(), $reply_to = '', $from = '', $cc = '', $bcc = '')
    {
        $config =& NDB_Config::singleton();
        $defaults = $config->getSetting('headers');

        // set defaults
        if (empty($from)) {
            $from = $defaults['From'];
    	}
        if (empty($reply_to)) {
            $reply_to = $defaults['Reply-to'];
	    }

	    // build header
	    $headers  = "MIME-Version: 1.0\n";
	    $headers .= "Content-type: text/plain; charset = iso-8859-1\n";
        $headers .= "Reply-to: $reply_to\n";
        $headers .= "From: $from\n";
        $headers .= "Return-Path: $from\n";
	    $headers .= "Content-transfer-encoding: 8bit\n";
        $headers .= "Date: " . date('r', time()) . "\n";
	    $headers .= "Message-ID: <" . md5(uniqid(time())) . "@" . $config->getSetting('host') . "\n";
        $headers .= "X-Sender: $from\n";
	    $headers .= "X-Mailer: PHP\n";
	    $headers .= "X-Priority: 3\n";
	    $headers .= "X-MSMail-Priority: Normal\n";
	    $headers .= "X-MimeOLE: " . $defaults['X-MimeOLE'] . "\n";

        // optional headers
        if (!empty($cc)) {
            $headers .= "Cc: $cc\n";
        }
        if (!empty($bcc)) {
            $headers .= "Bcc: $bcc\n";
        }

        // populate the template
    	$smarty = new Smarty_neurodb;
        $smarty->assign($tpl_data);
        $message = $smarty->fetch('email/' . $template);

        // get the subject
        preg_match('/^Subject: (.*)/', $message, $match);

        // get rid of the subject from the message body
        $message = preg_replace('/^Subject: .*/', '', $message);

        // send the email
        @mail($to, $match[1], preg_replace("/(?<!\r)\n/s", "\n", $message), $headers);
    }
}
?>