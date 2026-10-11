<?php declare(strict_types=1);

/**
 * Unit test for the publication module's submission notification email
 * template.
 *
 * PHP Version 8
 *
 * @category Tests
 * @package  Main
 * @author   Cryptoteep <bigmommyta@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
use PHPUnit\Framework\TestCase;

/**
 * Tests that the text of the "publication submission" notification email
 * correctly identifies who submitted the proposal, instead of reading like
 * a confirmation sent to the submitter themselves.
 *
 * See https://github.com/aces/Loris/issues/10852 : a user who enabled
 * "notify me of new publication submissions" received an email that read
 * as if *they* had submitted the proposal, even when a different user was
 * the actual submitter.
 *
 * @category Tests
 * @package  Main
 * @author   Cryptoteep <bigmommyta@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class PublicationSubmissionNotificationTemplateTest extends TestCase
{
    /**
     * Path to the smarty template under test.
     *
     * @var string
     */
    private string $_templatePath;

    /**
     * Sets up the path to the template file before each test.
     *
     * @return void
     */
    function setUp(): void
    {
        parent::setUp();
        $this->_templatePath = __DIR__
            . '/../../smarty/templates/email/notifier_publication_submission.tpl';
    }

    /**
     * Renders the raw template using the same {$Var} substitution syntax
     * used by Smarty, without requiring a full Smarty/DB bootstrap.
     *
     * @param array<string,string> $vars variables to substitute
     *
     * @return string the rendered template
     */
    private function _renderTemplate(array $vars): string
    {
        $template = file_get_contents($this->_templatePath);
        $this->assertIsString(
            $template,
            'Could not read notifier_publication_submission.tpl'
        );

        foreach ($vars as $name => $value) {
            $template = str_replace('{$' . $name . '}', $value, $template);
        }

        return $template;
    }

    /**
     * Ensures the rendered notification attributes the submission to the
     * actual submitting user, not to whoever receives the notification.
     *
     * @return void
     */
    function testNotificationAttributesSubmissionToSubmitter(): void
    {
        $rendered = $this->_renderTemplate(
            [
                'Title'       => 'A Great Study Of Things',
                'Date'        => '2026-07-10',
                'User'        => 'Jane Submitter',
                'ProjectName' => 'MyProject',
            ]
        );

        $this->assertStringContainsString(
            'submitted by Jane Submitter',
            $rendered,
            'Notification email must name the user who actually submitted '.
            'the proposal.'
        );
    }

    /**
     * Ensures the notification no longer reads as a first-person
     * confirmation to the recipient (the bug from issue #10852), which
     * misled notified users into thinking they were the submitter.
     *
     * @return void
     */
    function testNotificationIsNotWordedAsSubmitterConfirmation(): void
    {
        $rendered = $this->_renderTemplate(
            [
                'Title'       => 'A Great Study Of Things',
                'Date'        => '2026-07-10',
                'User'        => 'Jane Submitter',
                'ProjectName' => 'MyProject',
            ]
        );

        $this->assertStringNotContainsStringIgnoringCase(
            'this is to confirm',
            $rendered,
            'Notification email should not be worded as a confirmation to '.
            'the recipient, since the recipient is not necessarily the '.
            'user who submitted the proposal.'
        );
    }

    /**
     * Ensures the template still exposes all placeholders expected by the
     * data assembled in modules/publication/ajax/FileUpload.php::notify().
     *
     * @return void
     */
    function testNotificationUsesExpectedPlaceholders(): void
    {
        $template = file_get_contents($this->_templatePath);
        $this->assertIsString($template);

        foreach (['Title', 'Date', 'User', 'ProjectName'] as $placeholder) {
            $this->assertStringContainsString(
                '{$' . $placeholder . '}',
                $template,
                "Template is missing the {\$$placeholder} placeholder."
            );
        }
    }
}
