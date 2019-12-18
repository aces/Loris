<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Study Progression</h3>
        <span class="pull-right clickable glyphicon glyphicon-chevron-up"></span>
        <div class="pull-right">
            <div class="btn-group views">
                <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                    Views
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu pull-right" role="menu">
                    <li class="active"><a data-target="scans-line-chart-panel">View scans per site</a></li>
                    <li><a data-target="recruitment-line-chart-panel">View recruitment per site</a></li>
                </ul>
            </div>
        </div>
    </div>
    <div class="panel-body">
        <div id="scans-line-chart-panel">
            <h5 class="chart-title">Scan sessions per site</h5>
            {if $total_scans neq 0}
                <div id="scanChart"></div>
            {else}
                <p>There have been no scans yet.</p>
            {/if}
        </div>
        <div id="recruitment-line-chart-panel" class="hidden">
            <h5 class="chart-title">Recruitment per site</h5>
            {if $recruitment['overall']['total_recruitment'] neq 0}
                <div id="recruitmentChart"></div>
            {else}
                <p>There have been no candidates registered yet.</p>
            {/if}
        </div>
    </div>
</div>
<small><i>Note that the Recruitment and Study Progression charts include data from ineligible, excluded, and consent withdrawn candidates.</i></small>
