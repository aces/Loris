<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Recruitment</h3>
        <span class="pull-right clickable glyphicon glyphicon-chevron-up"></span>
        <div class="pull-right">
            <div class="btn-group views">
                <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                    Views
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu pull-right" role="menu">
                    <li class="active"><a data-target="overall-recruitment">View overall recruitment</a></li>
                    <li><a data-target="recruitment-site-breakdown">View site breakdown</a></li>
                    <li><a data-target="recruitment-project-breakdown">View project breakdown</a></li>
                </ul>
            </div>
        </div>
    </div>
    <div class="panel-body">
        <div class="recruitment-panel" id="overall-recruitment">
            {include file='progress_bar.tpl' project=$recruitment["overall"]}
        </div>
        <div class="recruitment-panel hidden" id="recruitment-site-breakdown">
            {if $recruitment['overall']['total_recruitment'] neq 0}
                <div class="col-lg-4 col-md-4 col-sm-4">
                    <div>
                        <h5 class="chart-title">Total recruitment per site</h5>
                        <div id="recruitmentPieChart"></div>
                    </div>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-8">
                    <div>
                        <h5 class="chart-title">Biological sex breakdown by site</h5>
                        <div id="recruitmentBarChart"></div>
                    </div>
                </div>
            {else}
                <p>There have been no candidates registered yet.</p>
            {/if}
        </div>
        <div class="recruitment-panel hidden" id="recruitment-project-breakdown">
        {foreach from=$recruitment key=ID item=project}
            {if $ID != "overall"}
                {include file='progress_bar.tpl' project=$project}
            {/if}
        {/foreach}
        </div>
    </div>
</div>
