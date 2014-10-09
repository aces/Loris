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
                        {foreach from=$form.errors item=error}
                            <div class="col-xs-12">
                                <label class="col-sm-12 error">{$error}<br><br></label>
                            </div>
                        {/foreach}
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-12">
                            <label class="col-sm-12 col-md-4">{$form.mri_file.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.mri_file.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <label class="col-sm-12">Note: file name should be of type .tgz or tar.gz or .zip<br><br></label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-6">
                            <label class="col-sm-12 col-md-4">{$form.CandID.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.CandID.html}</div>
                        </div>
                        <div class="form-group col-sm-6">
                            <label class="col-sm-12 col-md-4">{$form.PSCID.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.PSCID.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-6">
                            <label class="col-sm-12 col-md-4">{$form.VisitLabel.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.VisitLabel.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-6 col-sm-offset-6">
                            <div class="col-sm-6">
                                <input type="submit" name="fire_away" id="upload" value="Upload" class="btn btn-sm btn-primary col-xs-12" />
                            </div>
                            <div class="col-sm-6">
                                <input type="submit" name="filter" id="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12" />
                            </div>
                        </div>
                    </div>
                    {$form.hidden}
                </form>
            </div>
        </div>
    </div>
</div>
    <progress id="progressbar" value="0" max="100"></progress><span id="progresslabel"></span>
    
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
<div class="row">
    <div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
            <div class="table-scroll" id="content">
                <table  class ="table table-hover table-primary table-bordered" border="0" width="100%">
                    <thead>
                    <tr class="info">
                         <th nowrap="nowrap">No.</th>
                            {section name=header loop=$headers}
                                <th nowrap="nowrap">
                                    <a href="main.php?test_name=mri_upload&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}
                                    </a>
                                </th>
                            {/section}
                    </tr>
                    </thead>
                    <tbody>
                    {section name=item loop=$items}
                   
                        <tr>
                            <!-- print out data rows -->
                            
                            {section name=piece loop=$items[item]}
                          
                                {if $items[item][piece].name eq 'Tarchive_Info'}
                                    <td nowrap="nowrap"><a href="main.php?test_name=dicom_archive&subtest=viewDetails&
                                    tarchiveID={$items[item][piece].value}">
                                    View Details</a></td>
                                    
                                {elseif $items[item][piece].name eq 'number_of_mincInserted'}     
                                
                                    {if (!empty($items[item][piece].value)) and $items[item][piece].value >0}
                                        <td nowrap="nowrap">
                                            <a href="main.php?test_name=imaging_browser&DCCID={$items[item][2].value}&filter=true">
                                            {$items[item][piece].value}
                                            </a>
                                        </td>
                                    {else}
                                         <td nowrap="nowrap"> </td>
                                    {/if}
                                    
                                {else}
                                    <td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}">
                                            {$items[item][piece].value} 
                                    </td>
                                {/if}
                            {/section}
                       </tr>
                    {sectionelse}
                    
                    <tr>
                        <td colspan="12">No data found</td>
                    </tr>
                    
                    {/section}
                    </tbody>
                    <!-- end data table -->
                </table>
            </div>
            <a class="left carousel-control"  id="scrollLeft" href="#carousel-example-generic">
                <span class="glyphicon glyphicon-chevron-left"></span>
            </a>
            <a class="right carousel-control" id="scrollRight" href="#carousel-example-generic" data-slide="next">
                <span class="glyphicon glyphicon-chevron-right"></span>
            </a>
        </div>
    </div>
</div>

