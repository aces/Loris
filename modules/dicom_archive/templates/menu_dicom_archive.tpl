<!-- selection filter -->
<div id="dicomFilterTable"></div>
<div class="row">
    <div class="col-xs-12 col-md-5">
    <!-- listing of visits -->

    {if $numTimepoints}
      {$numTimepoints} subject timepoint(s) selected.<br><br>
    {/if}
    </div>
    <div id="pageLinks" class="pull-right">
    </div>
    <script>
    var pageLinks = RPaginationLinks(
        {
                    RowsPerPage : {$rowsPerPage|default:10},
                    Total: {$numTimepoints|default:0},
                    onChangePage: function(pageNum) {
                        location.href="{$baseurl}/main.php?test_name=dicom_archive&pageID=" + pageNum
                    },
                    Active: {$pageID}
        }
        );
    var filterTable = RDICOMFilterTable(
        {
            Sites: {$Sites|@json_encode},
            FilterValues: {$filterValuesJSON}
        }
    );
    React.render(pageLinks, document.getElementById("pageLinks"));
    React.render(filterTable, document.getElementById("dicomFilterTable"));
    </script>


    <table class="dynamictable table table-hover table-primary table-bordered">
        <thead>
        <tr class="info">
    	<th>No.</th>
    {section name=header loop=$headers}
            <th nowrap="nowrap">
                <a href="main.php?test_name=dicom_archive&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a>
            </th>
    {/section}
        </tr>
        </thead>
        <tbody>
        <tr>
    {section name=item loop=$items}
    {section name=piece loop=$items[item]}
        <td{if $items[item][piece].name == "Transfer_Status"} class="{$items[item][piece].class}"{elseif $items[item][piece].class == "error"} class="{$items[item][piece].class}"{/if}>
            {if $items[item][piece].name == "Metadata"}
            <a href="main.php?test_name=dicom_archive&subtest=viewDetails&tarchiveID={$items[item][piece].tarchiveID}&backURL={$backURL|escape:"url"}">{$items[item][piece].value}</a>
            {elseif $items[item][piece].name == "MRI_Browser"}
                {if $items[item][piece].sessionID != ""}
            <a href="main.php?test_name=imaging_browser&subtest=viewSession&sessionID={$items[item][piece].sessionID}&outputType=native&backURL={$backURL|escape:"url"}">{$items[item][piece].value}</a>{else}&nbsp;{/if}
            {else}
                 {$items[item][piece].value}
            {/if}
        </td>
    {/section}
    </tr>
    {sectionelse}
        <tr><td colspan="8">Nothing found</td></tr>
    {/section}
    </tbody>
    </table>
</div>
