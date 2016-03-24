  <div class="row">
    <div id="tabs">
      <ul class="nav nav-tabs">
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/">Profiles</a></li>
        <li class="statsTab active"><a class="statsTabLink" id="onLoad"><strong>Files</strong></a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/?submenu=gwas_browser">GWAS</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/?submenu=snp_browser">SNP</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/?submenu=cnv_browser">CNV</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/?submenu=cpg_browser">Methylation</a></li>
      </ul>
      <br>
    </div>
  </div>
  <form method="post" name="genomic_upload" id="genomic_upload" enctype="multipart/form-data"> 
    <div class="row">
      <div class="col-sm-10 col-md-8">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Genomic File Filters
          </div>
          <div class="panel-body" id="panel-body">
            <div class="row">
              <div class="form-group col-sm-5">
                <label class="col-sm-12 col-md-3">
                  {$form.genomic_file_type.label}
                </label>
                <div class="col-sm-12 col-md-9">
                  {$form.genomic_file_type.html}
                </div>
              </div>
              <div class="form-group col-sm-7">
                <label class="col-sm-3">
                  {$form.file_name.label}
                </label>
                <div id="file-input" class="col-sm-9">
                  {$form.file_name.html}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-sm-5">
                <label class="col-sm-12 col-md-3">
                  {$form.date_inserted.label}
                </label>
                <div class="col-sm-12 col-md-9">
                  {$form.date_inserted.html}
                </div>
              </div>
              <div class="form-group col-sm-7">
                <label class="col-sm-12 col-md-3">
                  {$form.description.label}
                </label>
                <div class="col-sm-12 col-md-9">
                  {$form.description.html}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-sm-5">
                <label class="col-sm-12 col-md-3">
                  {$form.caveat.label}
                </label>
                <div class="col-sm-12 col-md-9">
                  {$form.caveat.html}
                </div>
              </div>
              <div class="form-group col-sm-7">
                <label class="col-sm-12 col-md-3">
                  {$form.notes.label}
                </label>
                <div class="col-sm-12 col-md-9">
                  {$form.notes.html}
                </div>
              </div>
            </div>
            {$form.hidden}
          </div>
        </div>
      </div>
      <div class="form-group col-sm-4">
        <div class="row"><!--fixed vertical space-->
          <div class="form-group col-md-12">
            <br><br><br><br><br>
          </div>
        </div>
        <div class="row">
          <div class="form-group col-sm-12">
            <label class="col-sm-4 col-md-3">
              {$form.Show_Brief_Results.label}
            </label>
            <div class="col-sm-8 col-md-8">
              {$form.Show_Brief_Results.html}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="form-group col-sm-12">
            <div class="col-sm-6 col-xs-12 col-md-6">
              <input type="submit" name="filter" value="Show data" id="showdata" class="btn btn-sm btn-primary col-xs-12"/>
            </div>
            <div class="visible-xs col-xs-12"> </div>
              <div class="visible-xs col-xs-12"> </div>
                <div class="col-sm-6 col-xs-12 col-md-6">
                  <button type="button" name = "upload" class = "btn btn-sm btn-primary col-xs-12" data-toggle="modal" data-target="#fileUploadModal">Upload File</button>
                </div>
              </div>
            </div>
            <div class="form-group col-sm-12">
              <div class="row">
                <div class="col-sm-6">
                  <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='/genomic_browser/?submenu=genomic_file_uploader&reset=true'" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
  <div id="datatable"></div>
</div>
<!-- File upload modal dialog -->
<div class="modal fade" id="fileUploadModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                <h3 class="modal-title" id="myModalLabel">Upload File</h3>
            </div>
            <form name="uploadForm" id="uploadForm" enctype="multipart/form-data" method="POST">
                <div class="modal-body">
                    <div class="row">
                        <div class="col-xs-12 form-group">
                            <label for="fileType" class="col-xs-3">File Type :<font color="red"><sup> *</sup></font></label>
                            <div class="col-xs-9">
                                <select name="fileType" id="fileType" class="form-fields form-control input-sm">
                                    <option value=" "> </option>
                                    {foreach from = $genomic_file_type item=val key=k}
                                        {if $val != "Any"}
                                            <option value={$k}>{$val}</option>
                                    {/if}
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-3" for="description">Description : </label>
                            <div class="col-xs-9">
                                <textarea cols="20" rows="3" name="description" id="description" style="border: 2px inset;" class="ui-corner-all form-fields form-control input-sm"> </textarea>
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-3" for="fileData">Data File :<font color="red"><sup> *</sup></font></label>
                            <div class="col-xs-9">
                                <input type="hidden" id="MAX_FILE_SIZE" name="MAX_FILE_SIZE" value="{$max_file_size}" />
                                <input type="file" name="fileData" class="fileUpload" id="fileData" style = "margin-left: 1em;"/>
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-3" for="fileMapping">Mapping File :</label>
                            <div class="col-xs-9">
                                <input type="hidden" id="MAX_FILE_SIZE" name="MAX_FILE_SIZE" value="{$max_file_size}" />
                                <input type="file" name="fileMapping" class="fileUpload" id="fileMapping" style = "margin-left: 1em;"/>
                            </div>
                        </div>
                        <div class="form-group col-sm-12">
                            <label class="col-xs-3"></label>
                            <div class="col-xs-9">
                               <input class="user-success" id="pscidColumn" name="pscidColumn" type="checkbox"> Use PSCID in column headers.
                            </div>
                        </div>
                        <input type="hidden" name = "user" id = "user" value = "{$user}">
                        <div class="form-group col-sm-12">
                            <div id="progress" style='width: 100%'>
                                <div id="progressBar" class="progress-bar progress-bar-female" role="progressbar" style="height: 20px">
                                </div>
                            </div>
                            <p id="uploadStatus"></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" id="uploadButton" role="button" aria-disabled="false" disabled="disabled">Upload</button>
                    <button class="btn btn-default" id="cancelButton" role="reset" type="reset" data-dismiss="modal">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</div>
<style>
.progress {
    height: 40px;
    margin-bottom: 0px;
}
.progress-bar-female {
    background-color: #2FA4E7;
}
</style>
<script>
    var table = RDynamicDataTable({
        "DataURL" : "{$baseurl}/genomic_browser/?submenu=genomic_file_uploader&format=json",
        "getFormattedCell" : formatColumn,
        "freezeColumn" : "file_name"
    });
 
    React.render(table, document.getElementById("datatable"));

(function() {

    var fileSelected = false;
    var fileTypeSelected = false;

    function handleUploadSubmit(event) {
        event.preventDefault();

        var formData = new FormData($(this)[0]);

        var xhr = new XMLHttpRequest(); 
        xhr.previous_text = '';
        xhr.onerror = function() { console.error("[XHR] Fatal Error."); };
        xhr.onreadystatechange = function() {
            try{
                console.log(xhr.readyState);
                switch (xhr.readyState) {
                    case 0:
                        console.log('0: request not initialized');
                        console.log(this);
                        break;
                    case 1:
                        console.log('1: server connection established');
                        console.log(this);
                        break;
                    case 2:
                        console.log('2: request received');
                        console.log(this);
                        break;
                    case 3:
                        console.log('3: processing request');
                        console.log(this);
                    
                        var new_response = xhr.responseText.substring(xhr.previous_text.length);
                        var result = JSON.parse( new_response );
                        console.log(result);
                            
                        document.getElementById("uploadStatus").innerHTML = result.message + '';
                        document.getElementById('progressBar').style.width = result.progress + "%";
                        if (result.error != undefined) {
                            document.getElementById('progressBar').style.backgroundColor = 'red';
                        }
                            
                        xhr.previous_text = xhr.responseText;
                        break;
                    case 4:
                        console.log('4: request finished and response is ready');
                        $('#uploadButton').attr('disabled', 'disabled');
                        console.log(this);
                        break;
                    default:
                        console.log('?');
                        break;
                }
            }
            catch (e){
                console.error("[XHR STATECHANGE] Exception: " + e);
            }                     
        };
        xhr.open("POST", "{$baseurl}/AjaxHelper.php?Module=genomic_browser&script=genomic_file_upload.php", true);
        xhr.send(formData);
    }

    function resetValue() {
        this.value = null;
    }

    document.getElementById('uploadForm').addEventListener(
        'submit', handleUploadSubmit, true
    );

    var input = document.getElementById('fileData');

    input.onclick = function () {
        // Use to reset the value so onChange triggers.
        this.value = null;
    };

    input.onchange = function () {

        fileSelected = this.value.trim().length > 0;

        if (fileSelected && fileTypeSelected) {
            $('#uploadButton').removeAttr("disabled");
        } else {
            $('#uploadButton').attr('disabled', 'disabled');
        }

    };

    var input = document.getElementById('fileMapping');

    input.onclick = function () {
        // Use to reset the value so onChange triggers.
        this.value = null;
    };
    input.onchange = function () {

        fileSelected = this.value.trim().length > 0;

        if (fileSelected && fileTypeSelected) {
            $('#uploadButton').removeAttr("disabled");
        } else {
            $('#uploadButton').attr('disabled', 'disabled');
        }

    };

    var input = document.getElementById('fileType');

    input.onchange = function () {

        fileTypeSelected = this.value.trim().length > 0;

        if (fileSelected && fileTypeSelected) {
            $('#uploadButton').removeAttr("disabled");
        } else {
            $('#uploadButton').attr('disabled', 'disabled');
        }
    };

    var input = document.getElementById('cancelButton');
    input.onclick = function () {
        document.getElementById('fileData').innerHTML = "";
        document.getElementById('fileMapping').innerHTML = "";
        document.getElementById('fileType').value = " ";
        document.getElementById('description').value = "";
        document.getElementById('pscidColumn').checked = false;
    };

})();
</script>

