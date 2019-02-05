<div class="row">
<div class="col-sm-9">
<div class="panel panel-primary">
    <div class="panel-heading" onclick="hideFilter(this)">
        Selection Filter
        <label class="advancedOptions" id="advanced-label" style="display:none">(Advanced Options)</label>
        <span class="glyphicon arrow glyphicon-chevron-up pull-right"></span>
    </div>
    <div class="panel-body">
        <form method="post" action="{$baseurl}/candidate_list/">
            <div class="row">
                <div class="form-group col-sm-4">
                    <label class="col-sm-12 col-md-4">
                        {$form.PSCID.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.PSCID.html}
                    </div>
                </div>
                <div class="form-group col-sm-4">
                    <label class="col-sm-12 col-md-4">
                        {$form.DCCID.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.DCCID.html}
                    </div>
                </div>
                <div class="form-group col-sm-4">
                    <label class="col-sm-12 col-md-4">
                        {$form.Visit_label.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.Visit_label.html}
                    </div>
                </div>
            </div>
            <div class="row">
                {if count($form.centerID.options) > 1}
                <div class="form-group col-sm-4">
                    <label class="col-sm-12 col-md-4">
                        {$form.centerID.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.centerID.html}
                    </div>
                </div>
                {/if}
                <div class="form-group col-sm-4">
                    <label class="col-sm-12 col-md-4">
                        {$form.SubprojectID.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.SubprojectID.html}
                    </div>
                </div>
                {if $form.ProjectID}
                    <div class="form-group col-sm-4">
                       <label class="col-sm-12 col-md-4">
                            {$form.ProjectID.label}
                       </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.ProjectID.html}
                    </div>
                  </div>
             {/if}
                <div class="form-group col-sm-4">
                    <label class="col-sm-12 col-md-4">
                        {$form.Entity_type.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.Entity_type.html}
                    </div>
                </div>
            </div>
            <div class="advancedOptions" id="advanced-options" style="display:none">
                <div class="row">
                    <div class="form-group col-sm-4">
                       <label class="col-sm-12 col-md-4">
                        {$form.scan_done.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.scan_done.html}
                    </div>
                  </div>
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-4">
                            {$form.Participant_Status.label}
                        </label>
                        <div class="col-sm-12 col-md-8">
                            {$form.Participant_Status.html}
                        </div>
                    </div>
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-4">
                            {$form.dob.label}
                        </label>
                        <div class="col-sm-12 col-md-8">
                            {$form.dob.html}
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-4">
                            {$form.sex.label}
                        </label>
                        <div class="col-sm-12 col-md-8">
                            {$form.sex.html}
                        </div>
                    </div>
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-4">
                            {$form.Visit_Count.label}
                        </label>
                        <div class="col-sm-12 col-md-8">
                            {$form.Visit_Count.html}
                        </div>
                    </div>
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-4">
                            {$form.Feedback.label}
                        </label>
                        <div class="col-sm-12 col-md-8">
                            {$form.Feedback.html}
                        </div>
                    </div>

                </div>
                <div class="row">
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-4">
                            {$form.Latest_Visit_Status.label}
                        </label>
                        <div class="col-sm-12 col-md-8">
                            {$form.Latest_Visit_Status.html}
                        </div>
                    </div>
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-4">
                            {$form.edc.label}
                        </label>
                        <div class="col-sm-12 col-md-8">
                            {$form.edc.html}
                        </div>
                    </div>
                </div>
            </div>
            <br class="visible-xs">
            <div id="advanced-buttons">
                <!-- <div class="form-group col-sm-6 col-sm-offset-6"> -->
                        <!-- <div class="col-sm-6"> -->
                            <div class="col-sm-4 col-md-3 col-xs-12 col-md-offset-3">
                                <input type="submit" name="filter" value="Show Data" id="showdata_advanced_options" class="btn btn-sm btn-primary col-xs-12" />
                            </div>

                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="col-sm-4 col-md-3 col-xs-12">
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/candidate_list/?reset=true'" />
                            </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="col-sm-4 col-md-3 col-xs-12">
                                <input type="button" name="advanced" value="Advanced" class="btn btn-sm btn-primary col-xs-12 advanced-buttons" onclick="toggleMe()" />
                                <input type="button" name="advanced" value="Basic" class="btn btn-sm btn-primary col-xs-12 advanced-buttons" onclick="toggleMe()" style="display:none;" />
                            </div>
                        <!-- </div> -->
                    <!-- </div> -->
            </div>
        </form>
    </div>
</div>
</div>
<div id="openprofile"></div>
</div>
<div id="datatable"></div>
