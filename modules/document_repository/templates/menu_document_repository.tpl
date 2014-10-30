<div class="row">
<div class="col-sm-12">
    <div class="col-xs-12">
        <form method="post" action="main.php?filtered=true&test_name=document_repository" id = "filterForm">
            <div class="panel panel-primary">
                <div class="panel-heading" onclick="hideFilter();">
                    Selection Filter
                    <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
                    <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
                </div>
                <div class="panel-body" id="panel-body">
                    <div class="row">
                        <div class="form-group col-sm-12">
                            <label class="col-sm-12 col-md-1">{$form.File_name.label}</label>
                            <div class="col-sm-12 col-md-3">{$form.File_name.html}</div>
                            <label class="col-sm-12 col-md-1">{$form.version.label}</label>
                            <div class="col-sm-12 col-md-3">{$form.version.html}</div>
                            <label class="col-sm-12 col-md-1">{$form.uploaded_by.label}</label>
                            <div class="col-sm-12 col-md-3">{$form.uploaded_by.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-12">
                            <label class="col-sm-12 col-md-1">{$form.File_type.label}</label>
                            <div class="col-sm-12 col-md-3">{$form.File_type.html}</div>
                            <label class="col-sm-12 col-md-1">{$form.For_site.label}</label>
                            <div class="col-sm-12 col-md-3">{$form.For_site.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group">
                            <div class="col-sm-2 col-sm-offset-4">
                                <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12" />
                            </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="col-sm-2">
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=document_repository&reset=true'" />
                            </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="col-sm-2">
                                <button id = "upload" name = "upload" class = "btn btn-sm btn-primary col-xs-12">Upload File</button>
                            </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="col-sm-2">
                                <button id = "addCategory" name = "addCategory" class = "btn btn-sm btn-primary col-xs-12" onclick="return false;">Add Category</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
</div>
                
<div class = "ui-accordion ui-widget ui-helper-reset">
<table border="0" width="80%" id = "accordionTable" class="docRepository" data-open = "{$openAccordion}">
<tr>
    {section name=header loop=$headers}
        <th nowrap="nowrap" class="accordionHeaders">
            {if $headers[header].displayName == "Edit" || $headers[header].displayName == "Delete"}
                {$headers[header].displayName}
            {else}
                <a href="main.php?openAccordion=true&test_name=document_repository&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}" class = "sortHeaders">
                    {$headers[header].displayName}
                </a>
            {/if}
        </th>
    {/section}
</tr>

{assign "find" array(' ','>','(',')')}
{assign "replace" array('_','_','_','_')}
<div id="accordion" class="ui-accordion ui-widget ui-helper-reset ui-accordion-icons" role="tablist">
{foreach from=$File_categories item=val key=k}
    {if $val != "Any"}
        <tr>
                <td nowrap="nowrap" colspan = "11">
                    <h3 id = "header_{$File_categories[$k].CategoryName|replace:$find:$replace}" class="categories_header ui-accordion-header ui-helper-reset  ui-state-default ui-corner-all" style="background-color: #e0dde2; padding: 3px;" align="left">{$File_categories[$k].CategoryName}
                        <span class="tip">...
                            <span id="categorycomment{$k}" class="categorycomments" name="headercomment_{$File_categories[$k].CategoryName|replace:$find:$replace}" contenteditable="true">
                                {$File_categories[$k].Comment}
                            </span>
                </span>
            </h3>
        </tr>
        {section name=file loop=$File_categories[$k].Files}
            {assign var="FileDetails" value=$File_categories[$k].Files[file]}
            <tr class="categories categories_{$File_categories[$k].CategoryName|replace:$find:$replace} ui-accordion ui-widget ui-helper-reset ui-accordion-icons">
                <td class="File_name" nowrap="nowrap">
                    <a href="AjaxHelper.php?Module=document_repository&script=GetFile.php&File={$FileDetails.Data_dir}" target="_blank" download="{$FileDetails.File_name}">{$FileDetails.File_name}</a> ({$FileDetails.File_size})
                </td>
                <td class="version" nowrap="nowrap">{$FileDetails.version}</td>
                <td class="File_type" nowrap="nowrap">{$FileDetails.File_type}</td>
                <td class="Instrument" nowrap="nowrap">{$FileDetails.Instrument}</td>
                <td class="uploaded_by" nowrap="nowrap">{$FileDetails.uploaded_by}</td>
                <td class="For_site" nowrap="nowrap">{$FileDetails.For_site}</td>
                <td class="comments" nowrap="nowrap">{$FileDetails.comments}</td>
                <td class="Date_uploaded" nowrap="nowrap">{$FileDetails.Date_uploaded}</td>
                <td nowrap="nowrap">
                    <a href="#" id="{$FileDetails.record_id}" class="theeditlink">Edit</a>
                </td>
                <td nowrap="nowrap">
                    <a href="#" id="{$FileDetails.record_id}" class="thedeletelink">Delete</a>
                </td>
            </tr>
        {/section}
    {/if}
{/foreach}
</div> <!--end of toggle div-->

<div class = "dialog">
<div class = "sure" title="Please Confirm" >
    <p>
        <span class="ui-icon ui-icon-trash" style="float:left; margin:0 7px 50px 0;"></span>
	    Are you sure you want to delete this file?
    </p>
</div>
</div>


<form id="addCategory" action="AjaxHelper.php?Module=document_repository&script=addCategory.php" method="POST">
<div class = "addCategory" title="Add Category">
    <p>
        What category would you like to add?
    </p>

<fieldset id="addCategoryForm" style = "border: none; width:125px !important; height:150px !important;">
	Category Name: <input type="text" name="category_name" />
	<br>
	Parent: 
        <select name="parent_id" id="parent_id">
        <option value=" "> </option>
            {foreach from = $File_categories item=val key=k}
                {if $val != "Any"}
                        <option value={$k}>{$val.CategoryName}</option>
                    {/if}
            {/foreach}
        </select>
	<br>
	Comments: <input type="text" name="comments" />
</fieldset>
</div>
</form>
</div>


<div id="uploadArea" class = "dialog-form" style = "border-style: solid; border-color: #7c7781; border-width:1px; margin: 1em !important; width:390px !important; height:auto !important;" title="Upload new file">
<form name = "uploadForm" id = "uploadForm" method = "POST" enctype="multipart/form-data" action="AjaxHelper.php?Module=document_repository&script=documentEditUpload.php">
<div class = "upload-error">
    <p style = "color: #f33;">
	    <span class="ui-icon ui-icon-alert" style = "float:left;"></span>
	    Please enter all required (*) fields.
    </p>
</div>
<div class = "file-error">
    <p style = "color: #f33;">
	    <span class="ui-icon ui-icon-alert" style = "float:left;"></span>
	    Please choose a file to upload.
</p>
</div>

<fieldset style = "border: none;">
	<label for="category">Category<font color="red"><sup> *</sup></font></label>
	<select name="category" id = "category" class = "form-fields">
	<option value=" "> </option>
	    {foreach from = $File_categories item=val key=k}
	        {if $val != "Any"}
 		        <option value={$k}>{$val.CategoryName}</option>
		{/if}
	    {/foreach}
	</select>
	</br></br>
	<label for="site">Site<font color="red"><sup> *</sup></font></label>
	<select name="site" id = "site" class = "form-fields">
	<option value=" "> </option>
	    {foreach from = $Sites item=val key=k}
	        <option value={$k}>{$val}</option>
	    {/foreach}
	</select>
	</br></br>
        <label for="instrument">Instrument<font color="red"><sup> *</sup></font></label>
        <select name="instrument" id = "instrument" class = "form-fields">
        <option value=""> </option>
            {foreach from = $Instruments item=val key=k}
                <option value={$k}>{$val}</option>
            {/foreach}
        </select>
        </br></br>
	<label for="pscid">PSCID</label>
	<input type="text" size = "27" name="pscid" id="pscid" class="ui-corner-all form-fields" /></br></br>
	<label for="visit">Visit label</label>
	<input type="text" size = "27" name="visit" id="visit" class="ui-corner-all form-fields" /></br></br>
	<label for="comments">Comments</label>
	<textarea cols = "20" rows = "3" name="comments" id="comments" style = "border: 2px inset;" class="ui-corner-all form-fields"> </textarea><p></p><br></br>
	<label for="file">File<font color="red"><sup> *</sup></font></label>
	<span class="file-wrapper">
  		<input type="file" name="file" id="file" style = "margin-left: 1em;"/>
  	<span class="button-file ui-button-text ui-widget ui-state-default ui-corner-all ui-button-text-only" role = "button" aria-disabled = "false" style = "margin-left:10.5em; padding: 0.5em;">Choose file</span>
	<span class="fileName"></span>
    </span>
    </br></br>
	<label for="version">Version</label>
	<input type="text" size = "27" name="version" id="version" class="ui-corner-all form-fields" /></br></br>
	<input type="hidden" name = "user" id = "user" value = "{$User}">
	<input type="hidden" name = "action" id = "action" value = "upload">
	<input type="hidden" id="MAX_FILE_SIZE" name="MAX_FILE_SIZE" value="100000000" />
	</fieldset>
	</br></br>
	<div class="ui-dialog-buttonset dialog">
	<button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" id = "cancelButton" role="button" aria-disabled="false" style = "float:right;"><span class="ui-button-text">Cancel</span></button>
	<button type="submit" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" id = "uploadButton" role="button" aria-disabled="false" style = "float:right;"><span class="ui-button-text">Upload</span></button>
	</div>
</form>
</div>


<!--The Edit Dialog-->
<div class = "dialog-form-edit dialog" style = "border-style: solid; border-color: #7c7781; border-width:1px; margin: 1em !important; width:390px !important; height:300px !important;" title="Edit file">
<p class="validateTips"></p>

<form name = "editForm" id = "editForm" method = "post"> 
<fieldset style = "border: none;">
	<label for="category">Category</label>
	<select name="category" id = "categoryEdit" class = "form-fields">
	<option value=""> </option>
	    {foreach from = $File_categories item=val key=k}
            {if $val != "Any"}
        	    <option value={$k}>{$val.CategoryName}</option>
        	{/if}
	    {/foreach}
	</select>
	</br></br>
	<label for="site">Site</label>
	<select name="site" id = "siteEdit" class = "form-fields">
	<option value=""> </option>
	    {foreach from = $Sites item=val key=k}
	        <option value={$k}>{$val}</option>
	    {/foreach}
	</select>
	</br></br>
        <label for="instrument">Instrument<font color="red"><sup> *</sup></font></label>
        <select name="instrument" id = "instrumentEdit" class = "form-fields">
        <option value=""> </option>
            {foreach from = $Instruments item=val key=k}
                <option value={$k}>{$val}</option>
            {/foreach}
        </select>
        </br></br>
        <label for="pscid">PSCID</label>
        <input type="text" size = "27" name="pscid" id="pscidEdit" class="ui-corner-all form-fields" /></br></br>
        <label for="visit">Visit label</label>
        <input type="text" size = "27" name="visit" id="visitEdit" class="ui-corner-all form-fields" /></br></br>
        <label for="comments">Comments</label>
        <textarea cols = "20" rows = "3" name="comments" id="commentsEdit" style = "border: 2px inset;" class="ui-corner-all form-fields"> </textarea><p></p><br></br>
        <label for="version">Version</label>
        <input type="text" size = "27" name="version" id="versionEdit" class="ui-corner-all form-fields" /></br></br>
	    <input type="hidden" name = "action" id = "actionEdit" value = "edit">
</fieldset>
</form>
</div>

<div class = "upload-success">
    <p>
	    <span class="ui-icon ui-icon-circle-check" style = "float:left;"></span>
	    The file was successfully uploaded. Loading changes in 3 seconds...
    </p>
</div>

<div class = "edit-success">
    <p>
	    <span class="ui-icon ui-icon-circle-check" style = "float:left;"></span>
	    The file was successfully modified. Loading changes in 3 seconds...
    </p>
</div>

<div class = "delete-success">
    <p>
	    <span class="ui-icon ui-icon-circle-check" style = "float:left;"></span>
	    The file was successfully deleted. Loading changes in 3 seconds...
    </p>
</div>

<div class = "add-success">
    <p>
            <span class="ui-icon ui-icon-circle-check" style = "float:left;"></span>
            New category successfully added! Loading changes in 3 seconds...
    </p>
</div>

<div class = "no-files">
    <p>
	    <span class="ui-icon ui-icon-info" style = "float:left;"></span>
	    No files were found.
    </p>
</div>

</br>

</table>
</div>
