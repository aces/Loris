<div class="row">
<div class="col-sm-9">
<div class="panel panel-primary">
    <div class="panel-heading" onclick="hideFilter(this)">
        Selection Filter 
        <span class="glyphicon arrow glyphicon-chevron-up pull-right"></span>
    </div>
    <div class="panel-body">
        <form method="post" action="/acknowledgements/">
            <div class="row">
                <div class="form-group col-sm-4">
                    <label class="col-sm-12 col-md-4">
                        {$form.full_name.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.full_name.html}
                    </div>
                </div>
                <div class="form-group col-sm-4">
                    <label class="col-sm-12 col-md-4">
                        {$form.citation_name.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.citation_name.html}
                    </div>
                </div>
                <div class="form-group col-sm-4">
                    <label class="col-sm-12 col-md-4">
                        {$form.title.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.title.html}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-4">
                    <label class="col-sm-12 col-md-4">
                        {$form.start_date.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.start_date.html}
                    </div>
                </div>
                <div class="form-group col-sm-4">
                    <label class="col-sm-12 col-md-4">
                        {$form.end_date.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.end_date.html}
                    </div>
                </div>
            </div>
            <br class="visible-xs">
            <div id="advanced-buttons">
                            <div class="col-sm-4 col-md-3 col-xs-12 col-md-offset-6">
                                <input type="submit" name="filter" value="Show Data" id="showdata_advanced_options" class="btn btn-sm btn-primary col-xs-12" />
                            </div>

                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="col-sm-4 col-md-3 col-xs-12">
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/acknowledgements/?reset=true'" />
                            </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
            </div>
        </form>
    </div>
</div>
</div>

<div id="tabs" style="background: white">
    <div class="tab-content">
        <div class="tab-pane active">
            <table class="table table-hover table-primary table-bordered table-unresolved-conflicts dynamictable" border="0">
                <thead>
                    <tr class="info">
                        <th>Citation Policy</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td nowrap="nowrap">
                            <div class="col-sm-12 col-md-12">To come from config file</div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!--  title table with pagination -->
            <table id="LogEntries" border="0" valign="bottom" width="100%">
                <tr>
                    <!-- display pagination links -->
                    <td align="right">{$page_links}</td>
                </tr>
            </table>
                <form method="post" action="/acknowledgements/" name="acknowledgements" id="acknowledgements">
                    <table class="table table-hover table-primary table-bordered table-unresolved-conflicts dynamictable" border="0">
                        <thead>

                            {foreach from=$form.errors item=error}
                            <tr>
                                <td nowrap="nowrap" colspan="6" class="error">{$error}</td>
                            </tr>
                            {/foreach}
                            
                            <tr class="info">
                                    {section name=header loop=$headers}
                                        <th><a href="{$baseurl}/acknowledgements/?filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">
                                            {$headers[header].displayName}
                                        </a></th>
                                    {/section}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">{$form.ordering.html}</div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">{$form.full_name.html}</div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">{$form.citation_name.html}</div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">{$form.title.html}</div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">
                                        <select name="degrees[]" multiple>
                                            <option value="bachelors">Bachelors</option>
                                            <option value="masters">Masters</option>
                                            <option value="phd">PhD</option>
                                            <option value="postdoc">Postdoctoral</option>
                                            <option value="md">MD</option>
                                            <option value="registered_nurse">Registered Nurse</option>
                                        </select>
                                    </div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">{$form.start_date.html}</div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">{$form.end_date.html}</div>
                                </td>
                            </tr>

                            <tr>
                                <td nowrap="nowrap" colspan="4" id="message-area">
                                    
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
                                            {if $items[item][piece].value == "bachelors"}
                                                Bachelors
                                            {elseif $items[item][piece].value == "masters"}
                                                Masters
                                            {elseif $items[item][piece].value == "phd"}
                                                PhD
                                            {elseif $items[item][piece].value == "postdoc"}
                                                Postdoctoral
                                            {elseif $items[item][piece].value == "md"}
                                                MD
                                            {elseif $items[item][piece].value == "registered_nurse"}
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
