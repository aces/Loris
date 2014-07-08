<script src="js/filterControl.js" type="text/javascript"></script>

<div class="col-md-8 col-sm-8">
    <form>
        <div class="panel panel-primary">
            <div class="panel-heading" onclick="hideFilter();">
                Selection Filter
                <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
                <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
            </div>
            <div class="panel-body" id="panel-body">
                <div class="row">
                    <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2">{$form.Instrument.label}</label>
                        <div class="col-sm-12 col-md-9">{$form.Instrument.html}</div>
                    </div>
                </div>
                <div class="row">    
                    <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2">{$form.PSCID.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.PSCID.html}</div>
                    <!-- </div> -->
                    <!-- <div class="form-group col-sm-4 col-sm-offset-2"> -->
                        <label class="col-sm-12 col-md-1">{$form.site.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.site.html}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2">{$form.CandID.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.CandID.html}</div>
                        <label class="col-sm-12 col-md-1">{$form.visit.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.visit.html}</div>
                    </div>
                    <div class="form-group col-sm-6 col-sm-offset-5 hidden-sm">
                        <div class="col-sm-6 col-xs-12">
                            <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                        </div>
                        <div class="visible-xs col-xs-12"> </div>
                        <div class="visible-xs col-xs-12"> </div>
                        <div class="visible-xs col-xs-12"> </div>
                        <div class="visible-xs col-xs-12"> </div>
                        <div class="col-sm-6 col-xs-12">
                            <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=conflicts_resolve'">
                        </div>
                    </div>
                </div>
                <div class="row visible-sm">
                    <div class="col-sm-6">
                        <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                    </div>
                    <div class="col-sm-6 col-xs-12">
                        <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=conflicts_resolve'">
                    </div>
                </div>
                <input type="hidden" name="test_name" value="conflicts_resolve" />
            </div>
        </div>
    </form>
</div>

<table class="fancytable" border="0">
    {if $form.resolved_total}
        <tr class="nohover">
            <td colspan="5" align="right" style="border: none;" class="nohover">{$form.resolved_total.label}</td>
        </tr>
    {/if}
    <tr>
        <th>Instrument</th>
        <th>DCCID</th>
        <th>PSCID</th>
        <th>Visit Label</th>
        <th>Extra Key Information</th>
        <th>Question</th>
        <th>Corrected Answer</th>
    </tr>

    {foreach from=$resolved_elements_list_names item=resolved_element}
        <tr>
            <td>{$resolved_elements_array[$resolved_element].instrument}</td>
            <td>{$resolved_elements_array[$resolved_element].dccid}</td>
            <td>{$resolved_elements_array[$resolved_element].pscid}</td>
            <td>{$resolved_elements_array[$resolved_element].visit_label}</td>
            <td>{$resolved_elements_array[$resolved_element].field}</td>
            <td nowrap="nowrap" align="right">{$resolved_elements_array[$resolved_element].new_value}</td>
        </tr>
    {foreachelse}
        <tr>
            <td colspan="6"><b>{$form.resolved_status.label}</b></td>
        </tr>
    {/foreach}
</table>

<br>
<div class="table-responsive">
    <form method="post" name="conflicts_resolve" id="conflicts_resolve">
        <table class="table table-hover table-primary table-bordered" border="0">
            <thead>
                {if $form.total}
                    <tr class="nohover">
                        <td colspan="6" align="right" class="nohover">{$form.total.label}</td>
                    </tr>
                {/if}

                {foreach from=$form.errors item=error}
                <tr>
                    <td nowrap="nowrap" colspan="5" class="error">{$error}</td>
                </tr>
                {/foreach}
            	
            	<tr class="info">
                    <th>Instrument</th>
                    <th>DCCID</th>
                    <th>PSCID</th>
                    <th>Visit Label</th>
                    <th>Question</th>
                    <th>Correct Answer</th>
                </tr>
        	</thead>
            <tbody>
                {foreach from=$elements_list_names item=element}
            	<tr>
                    <td>{$elements_array[$element].instrument}</td>
                    <td>{$elements_array[$element].dccid}</td>
                    <td>{$elements_array[$element].pscid}</td>
                    <td>{$elements_array[$element].visit_label}</td>
                    <td>{$elements_array[$element].field}</td>
            		<td nowrap="nowrap" align="right">{$form.$element.html}</td>
            	</tr>
                {foreachelse}
                    <tr>
                        <td colspan="6"><b>{$form.status.label}</b></td>
                    </tr>
            	{/foreach}
                <tr>
                <td nowrap="nowrap" colspan="5">&nbsp;</td>
                        <td nowrap="nowrap">
                <input class="btn btn-sm btn-primary col-md-offset-3" name="fire_away" value="Save" type="submit" />
                <input class="btn btn-sm btn-primary" value="Reset" type="reset" />
                </td>
                </tr>
            </tbody>
        </table>
        {$form.hidden}
    </form>
</div>

