<?php
/**
 * Utility class tests
 *
 * @category Tests
 * @package  Test
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */


/**
 * Unit test for Utility class
 *
 * @category Tests
 * @package  Main
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class UtilityTest extends PHPUnit_Framework_TestCase
{

    /**
     * Test testUpdateStudyDescriptionPassingSecurityCheckString()
     *          insure no breaking and test cases are valid.
     * @covers Utility::updateStudyDescriptionPassingSecurityCheckString
     * @return void
     */
    public function testUpdateStudyDescriptionPassingSecurityCheckString() {
        $result = \Utility::updateStudyDescriptionPassingSecurityCheckString("Example Study Description<script>alert('Pwned!');</script>", 3);
        $message = "<p>Example Study Description</p><script>alert('Pwned!');</script>";
        $this->assertThat(
            $result,
            $this->logicalNot(
                $this->equalTo($message)
            )
        );
        $this->assertEquals("<p>Example Study Description</p>\n", $result, "assertEquals passed");
        $this->assertNotEmpty($result, "assertNotEmpty has passed!");
        $result = \Utility::updateStudyDescriptionPassingSecurityCheckString(null, 3);
        $this->assertEquals("", $result, "assertEquals passed");

    }

    /**
     * Test testGetWhiteListingString()
     *          insure no breaking and test cares are valid.
     * @covers Utility::getWhiteListingString
     * @return void
     */
    public function testGetWhiteListingString() {
        $whitelist_tag_rules = array("html", "body", "a", "br", "em", "hr", "i", "li", "ol", "p", "s", "span", "table", "tr", "td", "u", "ul");
        $whitelist_tag_attributes_rules = array("class", "id", "style");
        $value = \Utility::getWhiteListingString("<p>Example Study Description</p><script>alert('Pwned!');</script><img src='img.jpg'>", $whitelist_tag_rules, $whitelist_tag_attributes_rules);
        $this->assertEquals("<p>Example Study Description</p>\n", $value, "assertEquals passed");
        $this->assertNotEmpty($value, "assertNotEmpty has passed!");
        $value = \Utility::getWhiteListingString(null, $whitelist_tag_rules, $whitelist_tag_attributes_rules);
        $this->assertEquals("", $value, "assertEquals passed");
    }
}