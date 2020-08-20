<?php
/*
 * This tool is designed to generate code coverage reports for the unit testing suite of LORIS.
 *
 * Please run this command from the tools directory -- var/www/loris/tools
 *
 * First, this tool will run all the unit tests on the particular branch. This will automatically
 * generate HTML reports (configured in the phpunit.xml file). Then, the generated files will be
 * moved to the directory "htdocs/log/codeCoverage/<date>", where the date value is the current date. Finally,
 * all the HTML reports are edited to include the date they were generated at the top of the page.
 *
 * To view the generated HTML reports, go to https://<your-loris-url>/log/codeCoverage/<date>/index.html.
 * This will take you to the main coverage page. From here, you may navigate to the dashboard or
 * to the pages for the individual classes under the php/libraries directory.
 *

*/
//Running unit test suite and generating HTML reports
exec("docker-compose run -T --rm unit-tests vendor/bin/phpunit --configuration test/phpunit-coverage.xml --testsuite LorisUnitTests", $output, $status);
if ($status != 0) {
    echo PHP_EOL . "The unit tests did not execute correctly" . PHP_EOL;
}
else {
    echo "The unit test suite passed with no errors" . PHP_EOL;
}
echo end($output) . PHP_EOL;

//Changing the read/write permissions for the code coverage reports
exec("sudo chmod -R 777 ../htdocs/log/codeCoverage", $output, $status);
if ($status != 0) {
    echo "The read/write permissions of the code coverage reports were not properly changed" . PHP_EOL;
}
else {
    echo "The read/write permissions of the code coverage reports were properly changed" . PHP_EOL;
}

//Adding date to the html reports
echo "Editing html files....";
$date = date("Y-m-d");
exec("sudo mkdir ../htdocs/log/codeCoverage/$date");
exec ("sudo chmod -R 777 ../htdocs/log/codeCoverage/$date");
$files = glob('../htdocs/log/codeCoverage/*.{html}', GLOB_BRACE);
foreach ($files as $filename) {
    $file = fopen($filename, "r+");
    $basename = basename($filename);
    $newfile = fopen("../htdocs/log/codeCoverage/$date/$basename", "w");
    if (strpos($filename, "dashboard.html") !== false){
        while (!feof($file)) {
            $line = fgets($file);
            if (strpos($line, "<h2>Classes</h2>") !== false) {
                $line = "     <br><h2>Classes <p>Calculated on: <script>document.write(new Date(document.lastModified).toLocaleDateString());</script></p></h2></br>";
            }
            fwrite($newfile, $line);
        }
    }
    else {
        while (!feof($file)) {
            $line = fgets($file);
            if (strpos($line, "<strong>Code Coverage</strong>") !== false) {
                $line = "     <br><td colspan=\"10\"><div align=\"center\"><strong>Code Coverage <p>Calculated on: <script>document.write(new Date(document.lastModified).toLocaleDateString());</script></p></strong></div></td></br>";
            }
            fwrite($newfile, $line);
        }
    }
    fclose($file);
    fclose($newfile);
    unlink($filename);
}
rename("../htdocs/log/codeCoverage/.css", "../htdocs/log/codeCoverage/$date/.css");
rename("../htdocs/log/codeCoverage/.fonts", "../htdocs/log/codeCoverage/$date/.fonts");
rename("../htdocs/log/codeCoverage/.js", "../htdocs/log/codeCoverage/$date/.js");

echo "done\n";

echo "******************************************************************
  To view the generated reports, navigate to:
  <loris-url>/log/codeCoverage/$date/index.html
******************************************************************";
?>

