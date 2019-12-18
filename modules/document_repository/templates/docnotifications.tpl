    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">Document Repository Notifications</h3>
            <span class="pull-right clickable glyphicon glyphicon-chevron-up"></span>
        </div>
        <!-- /.panel-heading -->
        <div class="panel-body">
            <div class="list-group document-repository-item">
                {foreach from=$notifications item=link}
                    <a href="/document_repository/Files/{$link.Data_dir}"
                       download="{$link.File_name}" class="list-group-item">
                        {if $link.new eq 1}
                            <span class="pull-left new-flag">NEW</span>
                        {/if}
                        <span class="pull-right text-muted small">Uploaded: {$link.Date_uploaded}</span>
                        <br>
                        {$link.File_name}
                    </a>
                {/foreach}
            </div>
            <!-- /.list-group -->
            <a href="{$baseURL}/document_repository/" class="btn btn-default btn-block">Document Repository
                <span class="glyphicon glyphicon-chevron-right"></span></a>
        </div>
        <!-- /.panel-body -->
    </div>
