{literal}
<style type="text/css">

</style>
<script type="text/javascript" src="js/modules/mustache.js"></script>

<script id="json_data" type="text/json">
    {/literal}{$File_categories|json_encode}{literal}
</script>
<script id="isFiltered" type="text/json">
    {
        "filtered": {/literal}
                        {if isset($filtered)}
                            true
                        {else}
                            false
                        {/if}
                    {literal}
    }
</script>

<script id="dir" type="x-tmpl-mustache">
    <tr id="{{ id }}a" {{ #parentID }}class="{{ parentID }}a directoryRow" style="display:none"{{ /parentID }}>
        <td class="fileColumn">
            {{ #depth }}
                {{ #first }}
                    <div class="spacer" style="border-left: none;"> </div>
                {{ /first }}
                {{ ^first }}
                    <div class="spacer"> </div>
                {{ /first }}
            {{ /depth }}
            {{ #indent }}
                <div class="fileDDD">
                    <span style="padding: 8px" class='directory glyphicon glyphicon-chevron-right' data-container="body" data-toggle="popover" data-placement="right" data-content="{{ Comment }}">
                        {{ name }}
                    </span>
                </div>
            {{ /indent }}
            {{ ^indent }}
                <span style="padding: 8px" class='directory glyphicon glyphicon-chevron-right' data-container="body" data-toggle="popover" data-placement="right" data-content="{{ Comment }}">
                    {{ name }}
                </span>
            {{ /indent }}
        </td>
        <td colspan="9"></td>
    </tr>
</script>
<script id="file" type="x-tmpl-mustache">
    <tr class="{{ parentID }}a" {{ ^filtered }}style="display:none" {{ /filtered }}>
        <td class="blah fileColumn">
            {{ #depth }}
                {{ #first }}
                    <div class="spacer" style="border-left: none;"> </div>
                {{ /first }}
                {{ ^first }}
                    <div class="spacer"> </div>
                {{ /first }}
            {{ /depth }}
            <div {{ ^filtered }}class="fileDDD"{{ /filtered }}><div style="padding-top: 8px">
                <a href="AjaxHelper.php?Module=document_repository&script=GetFile.php&File={{ Data_dir }}" target="_blank" download="{{ File_name }}">
                        {{ File_name }}
                </a>({{ File_size }})
            </div></div>
        </td>
        <td>
            {{ version }}
        </td>
        <td>
            {{ File_type }}
        </td>
        <td>
            {{ Instrument }}
        </td>
        <td>
            {{ uploaded_by }}
        </td>
        <td>
            {{ For_site }}
        </td>
        <td>
            {{ comments }}
        </td>
        <td>
            {{ Date_uploaded }}
        </td>
        <td nowrap="nowrap">
            <a href="#" id="{{ record_id }}" class="theeditlink">Edit</a>
        </td>
        <td nowrap="nowrap">
            <a href="#" id="{{ record_id }}" class="thedeletelink">Delete</a>
        </td>
    </tr>
</script>
{/literal}

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
                                <button type="button" name = "upload" class = "btn btn-sm btn-primary col-xs-12" data-toggle="modal" data-target="#fileUploadModal">Upload File</button>
                            </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="col-sm-2">
                                <button type="button" name = "addCategory" class = "btn btn-sm btn-primary col-xs-12" data-toggle="modal" data-target="#addCategoryModal">Add Category</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
</div>

<center>
    <button class="btn btn-lg btn-primary loading"><span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Loading...</button>
</center>

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

{assign "find" array(' ','>','(',')')}
{assign "replaceFind" array('_','_','_','_')}

<table id="dirTable" class="table dynamictable">
    <thead>
        {section name=header loop=$headers}
            <th class="info" nowrap="nowrap" class="accordionHeaders">
                {if $headers[header].displayName == "Edit" || $headers[header].displayName == "Delete"}
                    {$headers[header].displayName}
                {else}
                    <a href="main.php?openAccordion=true&test_name=document_repository&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}" class = "sortHeaders">
                        {$headers[header].displayName}
                    </a>
                {/if}
            </th>
        {/section}
    </thead>
    <tbody id="dir-tree">

    </tbody>
</table>

<div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                <h3 class="modal-title" id="myModalLabel">Please Confirm</h3>
            </div>
            <div class="modal-body">
                <p>
                    <span class="ui-icon ui-icon-trash" style="float:left; margin:0 7px 50px 0;"></span>
                    Are you sure you want to delete this file?
                </p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="postDelete" role="button" aria-disabled="false" data-dismiss="modal">Yes</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="addCategoryModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                <h3 class="modal-title" id="myModalLabel">Upload File</h3>
            </div>
            <form id="addCategoryForm" action="AjaxHelper.php?Module=document_repository&script=addCategory.php" method="POST">
                <div class="modal-body">
                    <div class="row">
                        <div class="col-xs-12">
                            <p>What category would you like to add?</p>
                        </div>
                        <div id="addCategoryCategory" class="col-xs-12 form-group">
                            <label class="col-xs-4">
                                Category Name:<font color="red"><sup> *</sup></font>
                            </label>
                            <div class="col-xs-8">
                                <input type="text" name="category_name" class="form-control input-sm" />
                            </div>
                            <div id="categoryAddError" class="col-xs-8 col-xs-offset-4 form-error" style="display:none;">
                                Category is required
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-4">
                                Parent:
                            </label>
                            <div class="col-xs-8">
                                <select name="parent_id" id="parent_id" class="form-control input-sm">
                                    <option value=" "> </option>
                                    {foreach from = $File_categories item=val key=k}
                                        {if $val != "Any"}
                                                <option value={$k}>{$val.CategoryName}</option>
                                            {/if}
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-4">
                                Comments:
                            </label>
                            <div class="col-xs-8">
                                <input type="text" name="comments" class="form-control input-sm"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="postCategory" role="button" aria-disabled="false">Add</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal fade" id="fileUploadModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                <h3 class="modal-title" id="myModalLabel">Upload File</h3>
            </div>
            <form name = "uploadForm" id = "uploadForm" method = "POST" enctype="multipart/form-data" action="AjaxHelper.php?Module=document_repository&script=documentEditUpload.php">
                <div class="modal-body">
                    <div class="row">
                        <div class = "upload-error col-xs-12">
                            <p style = "color: #f33;">
                                <span class="ui-icon ui-icon-alert" style = "float:left;"></span>
                                Please enter all required (*) fields.
                            </p>
                        </div>
                        <div class = "file-error col-xs-12">
                            <p style = "color: #f33;">
                                <span class="ui-icon ui-icon-alert" style = "float:left;"></span>
                                Please choose a file to upload.
                            </p>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label for="category" class="col-xs-4">Category<font color="red"><sup> *</sup></font></label>
                            <div class="col-xs-8">
                                <select name="category" id = "category" class = "form-fields form-control input-sm">
                                    <option value=" "> </option>
                                    {foreach from = $File_categories item=val key=k}
                                        {if $val != "Any"}
                                            <option value={$k}>{$val.CategoryName}</option>
                                    {/if}
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-4" for="site">Site<font color="red"><sup> *</sup></font></label>
                            <div class="col-xs-8">
                                <select name="site" id = "site" class = "form-fields form-control input-sm">
                                <option value=" "> </option>
                                    {foreach from = $Sites item=val key=k}
                                        <option value={$k}>{$val}</option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-4" for="instrument">Instrument</label>
                            <div class="col-xs-8">
                                <select name="instrument" id = "instrument" class = "form-fields form-control input-sm">
                                <option value=""> </option>
                                    {foreach from = $Instruments item=val key=k}
                                        <option value={$k}>{$val}</option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-4" for="pscid">PSCID</label>
                            <div class="col-xs-8">
                                <input type="text" size = "27" name="pscid" id="pscid" class="ui-corner-all form-fields form-control input-sm" />
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-4" for="visit">Visit label</label>
                            <div class="col-xs-8">
                                <input type="text" size = "27" name="visit" id="visit" class="ui-corner-all form-fields form-control input-sm" />
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-4" for="comments">Comments</label>
                            <div class="col-xs-8">
                                <textarea cols = "20" rows = "3" name="comments" id="comments" style = "border: 2px inset;" class="ui-corner-all form-fields form-control input-sm"> </textarea><p></p>
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-4" for="file">File<font color="red"><sup> *</sup></font></label>
                            <div class="col-xs-8">
                                <input type="file" name="file" class="fileUpload" id="file" style = "margin-left: 1em;"/>
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-4" for="version">Version</label>
                            <div class="col-xs-8">
                                <input type="text" size = "27" name="version" id="version" class="ui-corner-all form-fields form-control input-sm" />
                            </div>
                        </div>
                        <input type="hidden" name = "user" id = "user" value = "{$User}">
                        <input type="hidden" name = "action" id = "action" value = "upload">
                        <input type="hidden" id="MAX_FILE_SIZE" name="MAX_FILE_SIZE" value="100000000" />
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" id = "uploadButton" role="button" aria-disabled="false">Upload</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</div>


<!--The Edit Dialog-->
<div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                <h3 class="modal-title" id="myModalLabel">Edit File</h3>
            </div>
            <form name = "editForm" id = "editForm" method = "post">
                <div class="modal-body">
                    <div class="row">
                        <div id="editFileCategory" class="col-xs-12 form-group">
                            <label class="col-xs-4" for="category">Category<font color="red"><sup> *</sup></font></label>
                            <div class="col-xs-8">
                                <select name="category" id = "categoryEdit" class = "form-fields form-control input-sm">
                                    <option value=""> </option>
                                    {foreach from = $File_categories item=val key=k}
                                        {if $val != "Any"}
                                            <option value={$k}>{$val.CategoryName}</option>
                                        {/if}
                                    {/foreach}
                                </select>
                            </div>
                            <div id="categoryEditError" class="col-xs-8 col-xs-offset-4 form-error" style="display:none;">
                                Category is required
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-4" for="site">Site</label>
                            <div class="col-xs-8">
                                <select name="site" id = "siteEdit" class = "form-fields form-control input-sm">
                                    <option value=""> </option>
                                    {foreach from = $Sites item=val key=k}
                                        <option value={$k}>{$val}</option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-4" for="instrument">
                                Instrument
                            </label>
                            <div class="col-xs-8">
                                <select name="instrument" id = "instrumentEdit" class = "form-fields form-control input-sm">
                                    <option value=""> </option>
                                    {foreach from = $Instruments item=val key=k}
                                        <option value={$k}>{$val}</option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-4" for="pscid">PSCID</label>
                            <div class="col-xs-8">
                                <input type="text" size = "27" name="pscid" id="pscidEdit" class="ui-corner-all form-fields form-control input-sm" />
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-4" for="visit">Visit label</label>
                            <div class="col-xs-8">
                                <input type="text" size = "27" name="visit" id="visitEdit" class="ui-corner-all form-fields form-control input-sm" />
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-4" for="comments">Comments</label>
                            <div class="col-xs-8">
                                <textarea cols = "20" rows = "3" name="comments" id="commentsEdit" style = "border: 2px inset;" class="ui-corner-all form-fields form-control input-sm"></textarea>
                            </div>
                        </div>
                        <div class="col-xs-12 form-group">
                            <label class="col-xs-4" for="version">Version</label>
                            <div class="col-xs-8">
                                <input type="text" size = "27" name="version" id="versionEdit" class="ui-corner-all form-fields form-control input-sm" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" id = "postEdit" role="button" aria-disabled="false">Edit</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                </div>
                <input type="hidden" name = "action" id = "actionEdit" value = "edit">
            </form>
        </div>
    </div>
</div>

</br>

</table>
</div>
