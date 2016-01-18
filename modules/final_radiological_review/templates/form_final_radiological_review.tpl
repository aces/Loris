<form method="post" name="new_final_review" id="final_review">
    {if $conflicts}
    <ul class="error">
    {foreach from=$conflicts item=conflict}
        <li>{$conflict}</li>
        {/foreach}
    </ul>
    {/if}
    <h3>General Information</h3>
    <div class="col-sm-8 col-md-6 col-xs-12">
        <div class="col-xs-12">
            <label class="col-xs-6">{$form.PSCID.label}</label>
            <div class="col-xs-6">{$form.PSCID.html}</div>
        </div>
        <div class="col-xs-12">
            <label class="col-xs-6">{$form.CandID.label}</label>
            <div class="col-xs-6">{$form.CandID.html}</div>
        </div>
        <div class="col-xs-12">
            <label class="col-xs-6">{$form.Visit_label.label}</label>
            <div class="col-xs-6">{$form.Visit_label.html}</div>
        </div>
        <div class="col-xs-12">
            <label class="col-xs-6">{$form.DICOM_Folder_Name.label}</label>
            <div class="col-xs-6">{$form.DICOM_Folder_Name.html}</div>
        </div>
        <div class="col-xs-12">
            <label class="col-xs-6">Go to:</label>
            <div class="col-xs-6">
                <a href="{$baseurl}/imaging_browser/viewSession/?sessionID={$form.SessionID.html}" target="_blank">Imaging Browser</a>
            </div>
            <div class="col-xs-6 col-xs-offset-6">
                <a href="{$baseurl}/{$form.CandID.html}/{$form.SessionID.html}/radiology_review/?commentID={$form.CommentID.html}" target="_blank">Original Radiology Review</a>
            </div>
        </div>
    </div>
<div class="row">
    <div class="col-xs-12">
        <h3>Review Values</h3>
    </div>
</div>
        <table width="80%" class="table table-hover table-primary table-bordered dynamictable">
            <thead>
                <tr class="info">
                    <th>Field</th>
                    <th colspan="2">Project Reviews</th>
                    <th>Site Review</th>
                </tr>
                <tr class="info">
                    <th>&nbsp;</th>
                    <th>Final Review</th>
                    <th>Extra Review</th>
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{$form.Final_Examiner.label}</td>
                    <td>{$form.Final_Examiner.html}</td>
                    <td>{$form.Final_Examiner2.html}</td>
                    <td>{$form.Original_Examiner.html}</td>
                </tr>
                <tr>
                    <td>{$form.Review_Done.label}</td>
                    <td>{$form.Review_Done.html}</td>
                    <td>{$form.Review_Done2.html}</td>
                    <td>{$form.Original_Scan_Done.html}</td>
                </tr>
                <tr>
                    <td>{$form.Final_Review_Results.label}</td>
                    <td>{$form.Final_Review_Results.html}</td>
                    <td>{$form.Final_Review_Results2.html}</td>
                    <td>{$form.Original_Review_Results.html}</td>
                </tr>
                <tr>
                    <td>{$form.Final_Exclusionary.label}</td>
                    <td>{$form.Final_Exclusionary.html}</td>
                    <td>{$form.Final_Exclusionary2.html}</td>
                    <td>{$form.Original_Exclusionary.html}</td>
                </tr>
                <tr>
                    <td>{$form.SAS.label}</td>
                    <td>{$form.SAS.html}</td>
                    <td>{$form.SAS2.html}</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>{$form.PVS.label}</td>
                    <td>{$form.PVS.html}</td>
                    <td>{$form.PVS2.html}</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>{$form.Final_Incidental_Findings.label}</td>
                    <td>{$form.Final_Incidental_Findings.html}</td>
                    <td>{$form.Final_Incidental_Findings2.html}</td>
                    <td>{$form.Original_Incidental_Findings.html}</td>
                </tr>
                <tr>
                    <td>{$form.Finalized.label}</td>
                    <td>{$form.Finalized.html}</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            </tbody>
        </table>
    <input type="submit" class="btn btn-sm btn-primary col-xs-4 col-sm-2" name="fire_away" value="Save" />
    {$form.hidden}
<!--/form-->
<div class="row">
<div class="col-xs-12">
    <h3>Change Log</h3>
</div>
</div>
    <table class="table table-hover table-primary table-bordered dynamictable">
        <thead>
            <tr class="info">
                <th>Time</th>
                <th>User</th>
                <th>Field</th>
                <th>Old Value</th>
                <th>New Value</th>
            </tr>
        </thead>
        <tbody>
            {$form.history.html}
        </tbody>
    </table>
</form>
