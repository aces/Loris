{literal}   
<script language="javascript" type="text/javascript">
    function hideFilter(){
        $("#panel-body").toggle();
        $("#down").toggle();
        $("#up").toggle();
    }
</script>
{/literal}

<div class="col-md-6 col-sm-8">
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
                        <div class="col-sm-12 col-md-8">{$form.Instrument.html}</div>
                    </div>
                </div>
                <div class="row">    
                    <div class="form-group col-sm-5">
                        <label class="col-sm-12 col-md-4">{$form.PSCID.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.PSCID.html}</div>
                    </div>
                    <div class="form-group col-sm-4 col-sm-offset-2">
                        <label class="col-sm-12 col-md-3">{$form.site.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.site.html}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-5">
                        <label class="col-sm-12 col-md-4">{$form.CandID.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.CandID.html}</div>
                    </div>
                    <div class="form-group col-sm-6 col-sm-offset-1 hidden-sm">
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

<br>
<form method="post" name="conflicts_resolve" id="conflicts_resolve">
<table class="fancytable" border="0">

    {if $form.total}
        <tr class="nohover">
            <td colspan="5" align="right" style="border: none;" class="nohover">{$form.total.label}</td>
        </tr>
    {/if}

    {foreach from=$form.errors item=error}
    <tr>
        <td nowrap="nowrap" colspan="5" class="error">{$error}</td>
    </tr>
    {/foreach}
	
	<tr>
        <th>Instrument</th>
        <th>DCCID</th>
        <th>PSCID</th>
        <th>Visit Label</th>
        <th>Question</th>
        <th>Correct Answer</th>
    </tr>
	

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
        <input class="button" name="fire_away" value="Save" type="submit" />
        <input class="button" value="Reset" type="reset" />
        </td>
        </tr>


</table>
{$form.hidden}
</form>

