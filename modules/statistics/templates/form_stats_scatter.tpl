<div id="scatter">
<script type="text/javascript" src="js/jquery.csv.js"></script>
<script type="text/javascript" src="js/scatterplot.js"></script>
<form>
<fieldset>
    <legend>Candidate Filters</legend>
    <div>
        Site: {html_options options=$Sites name="site" selected=$CurrentSite.ID id="GraphSite"}
        Administration:
            <select name="Administration" id="Administration">
                <option value="">Any</option>
                <option value="All">All</option>
                <option value="Partial">Partial</option>
                <option value="None">None</option>
            </select>
        Visit Label:
            <select name="Visit_label" id="Visit_label">
                <option value="">All</option>
                {foreach from=$Visits item=name key=val}
                <option value="{$name}">{$name}</option>
                {/foreach}
            </select>
    </div>
</fieldset>
<fieldset>
    <legend>Y Axis</legend>
    <div>
        Instrument:
            <select name="InstrumentY" onChange="changeFieldOptions('y')" id="instrumenty">
            {foreach from=$all_instruments item=name key=val}
                <option value="{$val}">{$name}</option>
            {/foreach}
            </select>
        Field:
            <select name="FieldY" id="fieldy">
               <option value="{$onChange}">{$onChange}</option> 
            </select>
    </div>
</fieldset>
<fieldset>
    <legend>X Axis</legend>
    <div>
        Instrument:
            <select name="InstrumentX" onChange="changeFieldOptions('x')" id="instrumentx">
            {foreach from=$all_instruments item=name key=val}
                <option value="{$val}">{$name}</option>
            {/foreach}
            </select>
        Field: <select name="FieldX" id="fieldx"></select>
    </div>
</fieldset>
<fieldset>
    <legend>Scatterplot</legend>
    <input type="button" value="Update chart" onClick="CreateScatterplot();" />
    <div id="scatterplot" style="width: 800px; height: 600px; margin: 0 auto"></div>

</fieldset>
</form>
</div>

