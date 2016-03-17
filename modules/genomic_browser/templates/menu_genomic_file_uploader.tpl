<div class="row">
    <div class="col-sm-10 col-md-8">
        <div class="panel panel-primary">
            <div class="panel-heading" onclick="hideFilter();">
                Upload a New File
            </div>
            <div class="panel-body" id="panel-body">
                <form method="post" name="mri_upload" id="mri_upload" enctype="multipart/form-data"> 
                    <div class="row">
                        <div class="form-group col-sm-12">
                            <label class="col-sm-4">
                                {$form.file_name.label}
                            </label>
                            <div id="file-input" class="col-sm-8">
                                {$form.file_name.html}
                            </div>
                        </div>
                        <div class="form-group col-sm-6">
                            <label class="col-sm-12 col-md-4">
                                {$form.genomic_file_type.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.genomic_file_type.html}
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
                                {$form.description.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.description.html}
                            </div>
                        </div>
                        <div class="form-group col-sm-6">
                            <label class="col-sm-12 col-md-4">
                                {$form.date_inserted.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.date_inserted.html}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-6">
                            <label class="col-sm-12 col-md-4">
                                {$form.notes.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.notes.html}
                            </div>
                        <div class="form-group col-sm-6">
                            <label class="col-sm-12 col-md-4">
                                {$form.caveat.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.caveat.html}
                            </div>
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
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/genomic_browser/?submenu=genomic_file_uploader&reset=true'" />
                            </div>
                        </div>
                    </div>
                    {$form.hidden}
                </form>
            </div>
        </div>
    </div>
</div>
<div id="datatable" />
<script>
var table = RDynamicDataTable({
    "DataURL" : "{$baseurl}/genomic_browser/?submenu=genomic_file_uploader&format=json",
    "getFormattedCell" : formatColumn,
    "freezeColumn" : "file_name"
});

React.render(table, document.getElementById("datatable"));
</script>
