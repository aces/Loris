<div id="data_entry">
<h2 class="statsH2">Data Entry Statistics  {if $CurrentProject} for {$CurrentProject.Name} {/if}</h2>
<script type="text/javascript" src="js/modules/form_stats_behavioural.js"></script>
{html_options id="BehaviouralProject" options=$Projects name="BehaviouralProject" selected=$CurrentProject.ID}
<button class="btn btn-primary btn-sm" onClick="updateBehaviouralTab()">Submit Query</button>
<br><br>

<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
  <div class="carousel-inner">
    <div class="col-xs-10 col-xs-offset-1" id="content" style="overflow-y:auto">
      <table class="table table-primary table-bordered">
          <thead>
              <tr class="info">
                  <th rowspan="2">Visit</th>
                  {foreach from=$Centers item=center key=centername}
                      <th id='{$center.LongName}' colspan="3" onclick="hideStats(this)">
                          {$center.LongName}  
                          <a href='main.php?test_name=statistics_site&CenterID={$center.NumericID}&ProjectID={$CurrentProject.ID}'>(Per instrument stats)</a>
                      </th>
                  {/foreach}
                 <!--  <th colspan="3" id='total'>Total</th>
                  <th rowspan="2"></th> -->
              </tr>
              <tr class="info">
                  {foreach from=$Centers item=center}
                   <th class='{$center.LongName}'>Completed</th>
                   <th class='{$center.LongName}'>Created</th>
                   <th>% Completion</th>
                  {/foreach}
                   {* Total isn't in the visits array, so we need to manually add its header *}
                   <!-- <th class='total'>Completed</th>
                   <th class='total'>Created</th>
                   <th>% Completion</th> -->
                </tr>
          </thead>
          <tbody>
              {foreach from=$Visits item=visit}
                  <tr>
                      <td>{$visit|upper}</td>
                      {foreach from=$Centers item=center key=centername}
                          <td class='{$center.LongName}'>{$behaviour[$center.ID][$visit].complete|default:"0"}</td>
                          <td class='{$center.LongName}'>{$behaviour[$center.ID][$visit].total|default:"0"}</td>
                          <td>{$behaviour[$center.ID][$visit].percent|default:"0"}%</td>
                      {/foreach}
                      <!-- <td class="total">{$behaviour[$center.ID].all.complete|default:"0"}</td>
                      <td class="total">{$behaviour[$center.ID].all.total|default:"0"}</td>
                      <td class="total">{$behaviour[$center.ID].all.percent|default:"0"}%</td>
                      <td> <a href='main.php?test_name=statistics_site&CenterID={$center.NumericID}&ProjectID={$CurrentProject.ID}'>Please Click Here</a></td> -->
                   </tr>
              {/foreach}
              <tr>
                  <td>Total</td>
                  {foreach from=$Centers item=center key=centername}
                      <td class='{$center.LongName}'>{$behaviour[$center.ID].all.complete|default:"0"}</td>
                      <td class='{$center.LongName}'>{$behaviour[$center.ID].all.total|default:"0"}</td>
                      <td class="total">{$behaviour[$center.ID].all.percent|default:"0"}%</td>
                  {/foreach}
              </tr>
          </tbody>
      </table>
    </div>
    <a class="left carousel-control"  id="scrollLeft" href="#carousel-example-generic">
      <span class="glyphicon glyphicon-chevron-left"></span>
    </a>
    <a class="right carousel-control" id="scrollRight" href="#carousel-example-generic" data-slide="next">
      <span class="glyphicon glyphicon-chevron-right"></span>
    </a>
  </div>
</div>

<b><a href='main.php?test_name=statistics_site&CenterID={$CurrentSite.ID}&ProjectID={$CurrentProject.ID}'>Click here for breakdown per participant {if $CurrentSite} for {$CurrentSite.Name} {/if} {if $CurrentProject} {$CurrentProject.Name} {/if}</a></b>

<h2 class="statsH2">Double Data Entry Statistics:</h2>
<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
  <div class="carousel-inner">
    <div class="col-xs-10 col-xs-offset-1" id="contentDD" style="overflow-y:auto">
      <table class="table table-primary table-bordered">
        <thead>
            <tr class="info">
                <th rowspan="2">Site</th>
                {foreach from=$Visits item=visit}
                    <th colspan="3" id="{$visit}" onclick="showStats(this)">{$visit|upper}</th>
                {/foreach}
                <th class="stats-active" colspan="3" id="totalDD" onclick="hideStats(this)">Total</th>
                <th rowspan="2">Per instrument stats</th>
            </tr>
            <tr class="info">
                {foreach from=$Visits item=visit}
                 <th class="{$visit}">Completed</th>
                 <th class="{$visit}">Created</th>
                 <th>% Completion</th>
                {/foreach}
                 {* Total isn't in the visits array, so we need to manually add its header *}
                 <th class="totalDD">Completed</th>
                 <th class="totalDD">Created</th>
                 <th>% Completion</th>
              </tr>
        </thead>
        <tbody>
            {foreach from=$Centers item=center key=centername}
                 <tr>
                    <td>{$center.LongName}</td>
                    {foreach from=$Visits item=visit}
                        <td class="{$visit}">{$dde[$center.ID][$visit].complete|default:"0"}</td>
                        <td class="{$visit}">{$dde[$center.ID][$visit].total|default:"0"}</td>
                        <td>{$dde[$center.ID][$visit].percent|default:"0"}%</td>
                    {/foreach}
                    <td class="totalDD">{$dde[$center.ID].all.complete|default:"0"}</td>
                    <td class="totalDD">{$dde[$center.ID].all.total|default:"0"}</td>
                    <td>{$dde[$center.ID].all.percent|default:"0"}%</td>
                    <td> <a href='main.php?test_name=statistics_dd_site&CenterID={$center.NumericID}&ProjectID={$CurrentProject.ID}'>Please Click Here</a></td>
                 </tr>
             {/foreach}
        </tbody>
      </table>
    </div>
    <a class="left carousel-control"  id="scrollLeftDD" href="#carousel-example-generic">
      <span class="glyphicon glyphicon-chevron-left"></span>
    </a>
    <a class="right carousel-control" id="scrollRightDD" href="#carousel-example-generic" data-slide="next">
      <span class="glyphicon glyphicon-chevron-right"></span>
    </a>
  </div>
</div>

<br />
</div>

<b><a href='main.php?test_name=statistics_dd_site&CenterID={$CurrentSite.ID}&ProjectID={$CurrentProject.ID}'>Click here for breakdown per participant for {if $CurrentSite} for {$CurrentSite.Name} {/if} {if $CurrentProject} {$CurrentProject.Name} {/if}</a></b>

<br />
        {$InstrumentsTable}
</div>

