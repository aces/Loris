<div class="col-sm-12">
    <div class="col-md-8 col-sm-8">
        <form method="post" action="main.php?test_name=acknowledgements">
            <div class="panel panel-primary">
                <div class="panel-heading" onclick="hideFilter();">
                    Selection Filter
                    <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
                    <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
                </div>
                <div class="panel-body" id="panel-body">
                    <div class="row">
                        <div class="form-group col-sm-4">
                            <label class="col-sm-12 col-md-4">{$form.first_name.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.first_name.html}</div>
                            <label class="col-sm-12 col-md-4">{$form.title.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.title.html}</div>
                            <label class="col-sm-12 col-md-4">{$form.title.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.title.html}</div>
                        </div>
                    </div>
                    <div class="row">    
                        <div class="form-group col-sm-4">
                            <label class="col-sm-12 col-md-4">{$form.middle_name.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.middle_name.html}</div>
                            <label class="col-sm-12 col-md-4">{$form.start_date.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.start_date.html}</div>
                            <label class="col-sm-12 col-md-4">{$form.start_date.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.start_date.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-4">
                            <label class="col-sm-12 col-md-4">{$form.last_name.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.last_name.html}</div>
                            <label class="col-sm-12 col-md-4">{$form.end_date.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.end_date.html}</div>
                            <label class="col-sm-12 col-md-4">{$form.start_date.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.start_date.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-6 col-sm-offset-6 hidden-sm">
                            <div class="col-sm-5 col-xs-12">
                                <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                            </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="col-sm-5 col-xs-12">
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=acknowledgements&reset=true'">
                            </div>
                        </div>
                    </div>
                    <div class="row visible-sm">
                        <div class="col-sm-6">
                            <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                        </div>
                        <div class="col-sm-6 col-xs-12">
                            <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=acknowledgements&reset=true'">
                        </div>
                    </div>
                    <input type="hidden" name="test_name" value="acknowledgements" />
                </div>
            </div>
        </form>
    </div>
</div>

<div id="tabs" style="background: white">
    <div class="tab-content">
        <div class="tab-pane active">
            <!--  title table with pagination -->
            <table id="LogEntries" border="0" valign="bottom" width="100%">
                <tr>
                    <!-- display pagination links -->
                    <td align="right">{$page_links}</td>
                </tr>
            </table>
                <form method="post" action="main.php?test_name=acknowledgements" name="acknowledgements" id="acknowledgements">
                    <table class="table table-hover table-primary table-bordered table-unresolved-conflicts dynamictable" border="0">
                        <thead>

                            {foreach from=$form.errors item=error}
                            <tr>
                                <td nowrap="nowrap" colspan="6" class="error">{$error}</td>
                            </tr>
                            {/foreach}
                            
                            <tr class="info">
                                    {section name=header loop=$headers}
                                        <th><a href="main.php?test_name=&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">
                                            {$headers[header].displayName}
                                        </a></th>
                                    {/section}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">{$form.first_name.html}</div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">{$form.middle_name.html}</div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">{$form.last_name.html}</div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">{$form.title.html}</div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">{$form.start_date.html}</div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">{$form.end_date.html}</div>
                                </td>
                            </tr>

                            <tr>
                                <td nowrap="nowrap" colspan="5" id="message-area">
                                    
                                </td>
                                <td nowrap="nowrap">
                                    <input class="btn btn-sm btn-primary col-md-offset-6" name="fire_away" value="Save" type="submit" />
                                    <input class="btn btn-sm btn-primary" value="Reset" type="reset" />
                                </td>
                            </tr>
                            {section name=item loop=$items}
                            <tr>
                                {section name=piece loop=$items[item]}
                                    {if $items[item][piece].name != ""}
                                        <td>
                                            {if $items[item][piece].value == "bac"}
                                                Bachelors
                                            {elseif $items[item][piece].value == "doc"}
                                                Doctor
                                            {elseif $items[item][piece].value == "mas"}
                                                Masters
                                            {elseif $items[item][piece].value == "phd"}
                                                PHD
                                            {elseif $items[item][piece].value == "pos"}
                                                Postdoctoral
                                            {elseif $items[item][piece].value == "rn"}
                                                Registered Nurse
                                            {else}
                                                {$items[item][piece].value}
                                            {/if}
                                        </td>
                                    {/if}
                                {/section}
                            </tr>
                            {sectionelse}
                                <tr>
                                    <tr><td colspan="6">You're not alone.</td></tr>
                                </tr>
                            {/section}
                        </tbody>
                    </table>
                </form>
            </div>
        </div>
    </div>
</div>
