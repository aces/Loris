<link rel="stylesheet" href="css/jquery-ui-1.10.4.custom.css" type="text/css"/>
<script src="js/jquery/jquery-ui-1.10.4.custom.min.js"></script>
<script src="js/feedback_bvl_popup.js"></script>
<script src ="js/jasny-bootstrap-all.js"></script>
<link rel="stylesheet" href="css/jasny-bootstrap-all.css" type="text/css" />

<!-- <div class ="ui-responsive-panel" data-role="panel" id="right-panel" data-position-fixed="true" data-display="push" data-position="right"> -->
<div class="navmenu navmenu-default navmenu-fixed-right offcanvas">
    <div id="accordion">
        <h3>Candidate Overview</h3>
        <div>
            <table border="0" valign="top" width="100%" class="listColorCoded">
                <tr>
                    <th nowrap="nowrap">QC Class</th>
                    {if $sessionID!=""}
                        <th nowrap="nowrap">Instrument</th>
                    {else}
                        <th nowrap="nowrap">Visit</th>
                    {/if}
                    <th nowrap="nowrap"># Threads</th>
                </tr>
                {section name=record loop=$thread_summary_data}
                    <tr>
                        <td nowrap="nowrap">{$thread_summary_data[record].QC_Class}</td>
                        {if $sessionID!=""}
                            <td nowrap="nowrap">
                                {if $thread_summary_data[record].CommentID != $commentID}
                                <a target="GUI" href="main.php?test_name={$thread_summary_data[record].Instrument}&candID={$candID}&sessionID={$sessionID}&commentID={$thread_summary_data[record].CommentID}">
                                    {/if}
                                    {$thread_summary_data[record].Instrument}</a></td>
                        {else}
                            <td nowrap="nowrap"><a target="GUI" href="main.php?test_name=instrument_list&candID={$candID}&sessionID={$thread_summary_data[record].SessionID}">{$thread_summary_data[record].Visit}</a></td>
                        {/if}
                        <td nowrap="nowrap">{$thread_summary_data[record].No_Threads}</td>
                    </tr>
                    {sectionelse}
                    <tr><td colspan="7">No feedback</td></tr>
                {/section}
            </table>

        </div>
        <h3>Current Thread Status</h3>
        <div>

        </div>
        <h3>Add New Feedback</h3>
        <div>

        </div>
    </div><!-- accordion -->

</div>
<!-- </div><!-- /panel -->

