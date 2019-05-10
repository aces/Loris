<?php declare(strict_types=1);
/**
 * This file contains a class used for sending emails from Loris.
 * It handles all the details of getting setting the email headers,
 * loading a smarty template of the email content, parsing it, and
 * then passes it off to PHP's mail command.
 *
 * Email templates should be in an email/ subdirectory of the smarty
 * template directory.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

/**
 * Email class
 *
 * @category Main
 * @package  Loris
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Email
{
    /**
     * Sends email using templates
     *
     * Every template MUST BEGIN with "Subject: subject text". Put new
     * templates in the subfolder "email" of the Smarty templates folder.
     *
     * @param string $to       email address to send email to
     * @param string $template template to use for email content
     * @param array  $tpl_data template's data for smarty binding
     * @param string $reply_to optional email header
     * @param string $from     optional email header
     * @param string $cc       optional email header
     * @param string $bcc      optional email header
     * @param string $type     optional defaults to plain text
     *
     * @return void
     * @access public
     */
    static function send(
        string $to,
        string $template,
        array $tpl_data = array(),
        string $reply_to = '',
        string $from = '',
        string $cc = '',
        string $bcc = '',
        string $type="text/plain"
    ): void {
        $config   =& NDB_Config::singleton();
        $defaults = $config->getSetting('mail');

        // set defaults
        if (empty($from)) {
            $from = $defaults['From'];
        }
        if (empty($reply_to)) {
            $reply_to = $defaults['Reply-to'];
        }
        // build header
        $headers  = "MIME-Version: 1.0\n";
        $headers .= "Content-type: $type; charset = UTF-8\n";
        $headers .= "Reply-to: $reply_to\n";
        $headers .= "From: $from\n";
        $headers .= "Return-Path: $from\n";
        $headers .= "Content-transfer-encoding: 8bit\n";
        $headers .= "Date: " . date('r', time()) . "\n";
        $headers .= "Message-ID: <"
            . md5(uniqid((string) time()))
            . "@"
            . $config->getSetting('host')
            . "\n";
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
        mail(
            $to,
            $match[1],
            preg_replace("/(?<!\r)\n/s", "\n", $message),
            $headers
        );
    }
}

