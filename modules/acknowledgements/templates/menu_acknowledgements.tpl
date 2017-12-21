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
                <div class="form-group col-sm-4">
                    <label class="col-sm-12 col-md-4">
                        {$form.present.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.present.html}
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
            <table class="table table-hover table-primary table-bordered table-acknowledgements dynamictable" border="0">
                <thead>
                    <tr class="info">
                        <th>Citation Policy</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td nowrap="nowrap">
                            <div class="col-sm-12 col-md-12">{$citation_policy}</div>
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
                                    <div class="col-sm-12 col-md-12">{$form.addordering.html}</div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">{$form.addfull_name.html}</div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">{$form.addcitation_name.html}</div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">
                                        <select name="addaffiliations[]" multiple>
                                            <option value="douglas">Douglas</option>
                                            <option value="mcgill">McGill</option>
                                        </select>
                                    </div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">
                                        <select name="adddegrees[]" multiple>
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
                                    <div class="col-sm-12 col-md-12">
                                        <select name="addroles[]" multiple>
                                            <option value="investigators">Investigators</option>
                                            <option value="project_administration">Project Administration</option>
                                            <option value="database_management">Database Management</option>
                                            <option value="interview_data_collection">Interview Data Collection</option>
                                            <option value="data_analyses">Data Analyses</option>
                                            <option value="mri_acquisition">MRI Acquisition</option>
                                            <option value="data_entry">Data Entry</option>
                                            <option value="clinical_evaluation">Clinical Evaluation</option>
                                            <option value="database_programming">Database Programming</option>
                                            <option value="imaging_processing_and_evaluation">Imaging Processing and Evaluation</option>
                                            <option value="genetic_analysis_and_biochemical_assays">Genetic Analysis and Biochemical Assays</option>
                                            <option value="randomization_and_pharmacy_allocation">Randomization and Pharmacy Allocation</option>
                                            <option value="consultants">Consultants</option>
                                            <option value="lp_csf_collection">LP/CSF collection</option>
                                        </select>
                                    </div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">{$form.addstart_date.html}</div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">{$form.addend_date.html}</div>
                                </td>
                                <td nowrap="nowrap">
                                    <div class="col-sm-12 col-md-12">{$form.addpresent.html}</div>
                                </td>
                            </tr>

                            <tr>
                                <td nowrap="nowrap" colspan="8" id="message-area">
                                    
                                </td>
                                <td nowrap="nowrap">
                                    <input class="btn btn-sm btn-primary" name="fire_away" value="Save" type="submit" />
                                    <input class="btn btn-sm btn-primary" value="Reset" type="reset" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </div>
         <br>
         <div id="datatable" />
    </div>
</div>
<script>
var table = RDynamicDataTable({
    "DataURL" : "{$baseurl}/acknowledgements/?format=json",
    "getFormattedCell" : formatAcknowledgementsColumn

});
ReactDOM.render(table, document.getElementById("datatable"));
</script>
