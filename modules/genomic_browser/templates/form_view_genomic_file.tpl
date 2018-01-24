<!-- Main table -->
<div class="row">
{$headerTable}
</div>

<div class="panel panel-default">
    <div class="panel-heading" id="panel-main-heading">
        <h3 class="panel-title">{if $files|@count}{$files|@count} file(s) displayed.</h3>
        {*<span class="pull-right clickable mri-arrow glyphicon glyphicon-chevron-up"></span>*}
    </div> <!-- closing panel-heading div-->
    <div class="panel-body">
        {section name=file loop=$files}
            <div class="col-xs-12 col-md-6 ib_frame">
                <div class="panel panel-default" id="subpanel-{$files[file].GenomicFileID}">
                      <div class="panel-heading" id="mri-panel-{$files[file].GenomicFileID}">
                            <h3 class="panel-title"> 
                              {if $files[file].Filename != ""}{$files[file].Filename} 
                              {else}&nbsp;{/if}</h3>
                            {* <span class="pull-right clickable glyphicon arrow glyphicon-chevron-up" onclick="toggle_mriPanel('{$files[file].GenomicFileID}')"></span> *}
                            <div class="pull-right">
                                <div class="btn-group views">
                                    <a href="{$baseurl}/genomic_browser/ajax/get_genomic_file.php?GenomicFileID={$files[file].FileID}">
                                        <button type="button" 
                                        class="btn btn-default btn-xs ">
                                        <span class="hidden=xs">
                                        &nbsp;&nbsp; Download 
                                        </span>
                                        <span class="pull-right glyphicon glyphicon-download-alt"></span>
                                        &nbsp;&nbsp;
                                      </button>
                                    </a> 
                                </div><!--closing btn-group views div -->
                            </div><!--cloding pull-right div -->
                      </div> <!--closing panel-heading clickable -->
                {*  </div> *}<!--closing row div -->
                      <div class="panel-body">
                      <div class="mri-righttable col-xs-12" id="mri-righttable-{$files[file].GenomicFileID}">
                      <table class="table table-hover table-bordered header-info col-xs-12 dynamictable">
                        <tr>
                            <th class="col-xs-2 info">Analysis Modality</th><td class="col-xs-2">{$files[file].AnalysisModality}</td>
                            <th class="col-xs-2 info">Date Inserted</th>
                            <td class="col-xs-2">
                                {if $files[file].FileInsertDate>0}
                                     {$files[file].FileInsertDate|date_format}
                                {else}&nbsp;
                                {/if}
                            </td>
                        <tr>
                            <th class="col-xs-2 info">Analysis Date</th><td class="col-xs-2">{$files[file].AnalysisDate|date_format}</td>
                            <th class="col-xs-2 info">Analysis Protocol</th><td class="col-xs-2">{$files[file].AnalysisProtocol}</td>
                        <tr>
                            <th class="col-xs-2 info">Category</th><td class="col-xs-2"></b>{$files[file].Category}</b></td>
                            <th class="col-xs-2 info">Normalization</th><td class="col-xs-2">{$files[file].Normalization}</td>
                        </tr>
                        <tr>
                            <th class="col-xs-2 info">Pipeline</th><td class="col-xs-2">{$files[file].Pipeline}</td>
                            <th class="col-xs-2 info">Algorithm</th><td class="col-xs-2">{$files[file].Algorithm}</td>
                        </tr>
                        <tr>
                            <th class="col-xs-2 info">Description</th><td class="col-xs-2">{$files[file].Description}</td>
                            <th class="col-xs-2 info">Caveat</th><td class="col-xs-2">{$files[file].Caveat}</td>
                        </tr>
                        <tr>
                            <th class="col-xs-2 info">FileType</th><td class="col-xs-2">{$files[file].FileType}</td>
                            <th class="col-xs-2 info">FileName</th><td class="col-xs-2">{$files[file].Filename}</td>
                        </tr>
                        <tr>
                            <th class="col-xs-2 info">FileSize (Mb)</th><td class="col-xs-2">{$files[file].FileSize}</td>
                            <th class="col-xs-2 info">Platform</th><td class="col-xs-2">{$files[file].Platform}</td>
                        </tr>
                        <tr>
                            <th class="col-xs-2 info">Batch</th><td class="col-xs-2">{$files[file].Batch}</td>
                            <th class="col-xs-2 info">Source</th><td class="col-xs-2">{$files[file].Source}</td>
                        </tr>
                        <tr>
                            <th class="col-xs-2 info">Notes</th><td class="col-xs-2" colspan="3">{$files[file].Notes}</td>
                        </tr>
                    </table>
                    </div><!--closing mri-righttable -->
                    </div> <!--closing panel-body -->
        </div> <!--panel panel-default -->
    </div> <!--closing ib_frame div-->
    {/section}
</div> <!-- closing panel-body div-->
</div>
    {else}
        <h3>No data selected</h3>
</div>
{/if}
{if $has_permission}</form>{/if} 
