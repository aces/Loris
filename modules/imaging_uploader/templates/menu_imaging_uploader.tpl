{if $upload_success}
    <p>Upload Successful<br/></p>
{/if}

{if $dicom_success}
    <p>Dicoms Are inserted<br/></p>
{/if}

{if $minc_success}
    <p>Mincs Are inserted<br/></p>
{/if}

<br />

<div class="row">
    <div class="col-sm-10 col-md-8">
        <div class="panel panel-primary">
            <div class="panel-heading" onclick="hideFilter();">
                Upload a New File
            </div>
            <div class="panel-body" id="panel-body">
                <form method="post" name="mri_upload" id="mri_upload" enctype="multipart/form-data">
                    <div class="row">
                        {section name=error loop=$error_message}
                            <div class="col-xs-12">
                                <label class="col-sm-12 error">
                                    {$error_message[error]}
                                    <br><br>
                                </label>
                            </div>
                        {/section}
                    </div>
                    <div class="row">
                        {foreach from=$form.errors item=error}
                            <div class="col-xs-12">
                                <label class="col-sm-12 error">
                                    {$error}
                                    <br><br>
                                </label>
                            </div>
                        {/foreach}
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-12">
                            <label class="col-sm-4">
                                {$form.mri_file.label}
                            </label>
                            <div id="file-input" class="col-sm-8">
                                {$form.mri_file.html}
                            </div>
                            <div id="file-progress" class="col-sm-8" style="display:none">
                                <div class="progress">
                                    <div id="progressbar" class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">
                                    </div>
                                    <div id="progresslabel">
                                        0%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <label class="col-sm-12">
                                Note: file name should be of type .tgz or tar.gz or .zip
                                <br><br>
                            </label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-6">
                            <label class="col-sm-12 col-md-4">
                                {$form.CandID.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.CandID.html}
                            </div>
                        </div>
                        <div class="form-group col-sm-6">
                            <label class="col-sm-12 col-md-4">
                                {$form.PSCID.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.PSCID.html}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-6">
                            <label class="col-sm-12 col-md-4">
                                {$form.Visit_label.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.Visit_label.html}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-6">
                            <label class="col-sm-12 col-md-4">
                                {$form.IsPhantom.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.IsPhantom.html}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-6 col-sm-offset-6">
                            <div class="col-sm-4">
                                <input type="submit" name="fire_away" id="upload" value="Upload" class="btn btn-sm btn-primary col-xs-12 submit-button" />
                            </div>
                            <div class="col-sm-4">
                                <input type="submit" name="filter" id="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12 submit-button" />
                            </div>
                            <div class="col-sm-4">
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/imaging_uploader/?reset=true'" />
                            </div>
                        </div>
                    </div>
                    {$form.hidden}
                </form>
            </div>
        </div>
    </div>
</div>
{*  This section is commented out because the functionality is not currently
    in the backend
    This functionality is expected to be implemented in future releases of LORIS
<table>
    <tr>
        <td id='hide' style="font-weight: bold; display: block;" >
            -Hide log file
        </td>
        <td id='show' style="font-weight: bold; display: none;" >
            +Show log file
        </td>
    </tr>
    <tr>
        <td>
            <div id="log_box"></div>
        </td>
    </tr>
</table>
*}

<div class="row">
    <div class="col-sm-10 col-md-8">
        <div class="panel panel-primary">
            <div class="panel-heading" onclick="hideFilter();">
                Log viewer
            </div>
            <div class="panel-body" id="panel-body">

                    <div class="row">
                        <div class="form-group col-sm-5">
                            <label class="col-sm-4 col-md-4">
                                Logs to display:
                            </label>
                            <div class="col-sm-5 col-md-5">
                                {$form.LogType.html}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        {$form.UploadLogs.html}
                    </div>
             </div>
        </div>
   </div>
</div>
