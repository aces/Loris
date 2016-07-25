<?php
$data = xdebug_get_code_coverage();
xdebug_stop_code_coverage(false);

$t = time();
$fp = fopen("selenium.coverage." . $t . ".xml", "w");
fprintf($fp, '<?xml version="1.0" encoding="UTF-8"?>');
fprintf($fp, "\n<coverage generated=\"$t\">\n");
fprintf($fp, "\t<project timestamp=\"$t\">\n");
foreach ($data as $file => $lines) {
    fprintf($fp, "\t\t<file name=\"$file\">\n");
    foreach ($lines as $rowNum => $value) {
        if ($value == 1) {
            fprintf($fp, "\t\t\t<line num=\"$rowNum\" type=\"stmt\" count=\"1\"/>\n");
        }
    }
    fprintf($fp, "\t\t</file>\n");

}
fprintf($fp, "\t</project>\n");
fprintf($fp, "</coverage>\n");
fclose($fp);
