<?php
/*
 * This tool is designed to generate code coverage reports for the
 * unit testing suite of LORIS.
 *
 * Please run this command from the tools directory -- var/www/loris/tools
 *
 * First, this tool will run all the unit tests on the particular branch.
 * This will automatically generate HTML reports (configured in phpunit.xml).
 * Then, the generated files will be moved to the directory
 * "htdocs/log/codeCoverage/<date>", where the date value is the current date.
 * Finally, all the HTML reports are edited to include the date that
 * they were generated at the top of the page.
 *
 * To view the generated HTML reports, go to:
 * https://<your-loris-url>/log/codeCoverage/<date>/index.html.
 * This will take you to the main coverage page. From here, you may navigate
 * to the dashboard or to the pages for the individual classes under
 * the php/libraries directory.
 *
*/

/*
 * Step 1: Running unit test suite and generating HTML reports
 *
 * The unit test suite is run with the --coverage-html tag,
 * which is configured to generate the HTML reports
 */
error_reporting(E_ERROR);

exec(
    "npm run tests:unit -- --coverage-html htdocs/log/codeCoverage",
    $output,
    $status
);
if ($status != 0) {
    echo PHP_EOL . "The unit tests did not execute correctly" . PHP_EOL;
} else {
    echo "The unit test suite passed with no errors" . PHP_EOL;
}
echo end($output) . PHP_EOL;

/*
 * Step 2: Change the read/write permissions of the HTML files
 */
exec("sudo chmod -R 777 ../htdocs/log/codeCoverage", $output, $status);
if ($status != 0) {
    echo "The read/write permissions of the code coverage reports "
        ."were not properly changed"
        . PHP_EOL;
} else {
    echo "The read/write permissions of the code coverage reports "
        . "were properly changed"
        . PHP_EOL;
}

/*
 * Step 3: Editing the HTML files and moving them to a new directory
 *
 * All HTML reports are edited to include the date they were generated
 * at the top of the page.
 * The index.html file and all other library-specific files are also edited
 * to make the total percentages bold at the top of the page.
 */

//The HTML XPath for the header elements that are being edited
$headerPath    = "/html/body/div/table/thead/tr[1]/td[2]/div";
$dashboardPath = "/html/body/div/div[1]/div/h2";

//Arrays of XPath values for all the values that are being bolded
$toBoldIndexArray = [
    "/html/body/div/table/tbody/tr[1]/td[3]/div",
    "/html/body/div/table/tbody/tr[1]/td[4]/div",
    "/html/body/div/table/tbody/tr[1]/td[6]/div",
    "/html/body/div/table/tbody/tr[1]/td[7]/div",
    "/html/body/div/table/tbody/tr[1]/td[9]/div",
    "/html/body/div/table/tbody/tr[1]/td[10]/div"
];
$toBoldArray      = [
    "/html/body/div/table/tbody/tr[1]/td[3]/div",
    "/html/body/div/table/tbody/tr[1]/td[4]/div",
    "/html/body/div/table/tbody/tr[1]/td[6]/div",
    "/html/body/div/table/tbody/tr[1]/td[7]/div",
    "/html/body/div/table/tbody/tr[1]/td[10]/div",
    "/html/body/div/table/tbody/tr[1]/td[11]/div"
];

echo "Editing html files....";

//Getting the date and making a new directory
$date        = date("Y-m-d");
$mkdirStatus = mkdir("../htdocs/log/codeCoverage/$date");
//$chmodStatus = chmod("../htdocs/log/codeCoverage/$date", 0777);
if ($mkdirStatus == 0) {
    echo "The ../htdocs/log/codeCoverage/$date directory was not properly created"
        . PHP_EOL;
}

//Getting all the generated reports and looping through them
$files = glob('../htdocs/log/codeCoverage/*.{html}', GLOB_BRACE);
foreach ($files as $filename) {
    $dom = new DOMDocument();
    $dom->loadHTMLFile($filename);
    $xPath    = new DOMXPath($dom);
    $basename = basename($filename);
    $newfile  = fopen("../htdocs/log/codeCoverage/$date/$basename", "w");
    //For the dashboard page: Adding the date to the header
    if (strpos($filename, "dashboard.html") !== false) {
        $dashboardHtml = "<h2>Classes <p>Calculated on: "
            ."<script>document.write(new Date(document.lastModified).toLocaleDateString());"
            ."</script></p></h2>";
        $header        = $xPath->query($dashboardPath)->item(0);
        $pHeader       = $header->parentNode;

        $newDom = new DOMDocument();
        $newDom->loadHTML($dashboardHtml);
        $newEl        = $newDom->documentElement;
        $importedNode = $dom->importNode($newEl, true);

        $pHeader->insertBefore($importedNode, $header->nextSibling);
        $header->nodeValue = "";
    } else {
        //For all other pages: Add date to the header and bold values at the top
        $html    = "<div align=\"center\"><strong>Code Coverage <p>Calculated on: "
            ."<script>document.write(new Date(document.lastModified)."
            ."toLocaleDateString());</script></p></strong></div>";
        $header  = $xPath->query($headerPath)->item(0);
        $pHeader = $header->parentNode;

        $tempDom = new DOMDocument();
        $tempDom->loadHTML($html);
        $newEl        = $tempDom->documentElement;
        $importedNode = $dom->importNode($newEl, true);

        $pHeader->insertBefore($importedNode, $header->nextSibling);
        $header->nodeValue = "";

        if (strpos($filename, "index.html") !== false) {
            foreach ($toBoldIndexArray as $path) {
                $element = $xPath->query($path)->item(0);
                $text    = trim($element->nodeValue);
                $element->parentNode
                    ->insertBefore(
                        $dom->createElement('strong', $text), $element
                    );
                $element->nodeValue = "";
            }
        } else {
            foreach ($toBoldArray as $path) {
                $element = $xPath->query($path)->item(0);
                $text    = trim($element->nodeValue);
                $element->parentNode
                    ->insertBefore(
                        $dom->createElement('strong', $text), $element
                    );
                $element->nodeValue = "";
            }
        }
    }
    //Saving the reports in the new directory and deleting the old files
    $dom->saveHTMLFile("../htdocs/log/codeCoverage/$date/$basename");
    fclose($newfile);
    unlink($filename);
}
rename("../htdocs/log/codeCoverage/.css", "../htdocs/log/codeCoverage/$date/.css");
rename(
    "../htdocs/log/codeCoverage/.fonts",
    "../htdocs/log/codeCoverage/$date/.fonts"
);
$status3 = rename(
    "../htdocs/log/codeCoverage/.js",
    "../htdocs/log/codeCoverage/$date/.js");
if ($status3 == 0) {
    echo "Rename didn't work".PHP_EOL;
}
echo "done\n";

echo "******************************************************************
  To view the generated reports, navigate to:
  <loris-url>/log/codeCoverage/$date/index.html
******************************************************************";
