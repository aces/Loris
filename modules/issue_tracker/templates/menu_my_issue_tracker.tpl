{literal}
    <script type="text/javascript">
        function hideFilter() {
            $("#panel-body").toggle();
            $("#down").toggle();
            $("#up").toggle();
        }
    </script>
{/literal}

<div class="row">
    <div class="col-sm-12">
        <div class="panel panel-primary">
            <div class="panel-heading" onclick="hideFilter();">
                Selection Filter
                <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none"
                      id="down">
                </span>
                <span class="glyphicon glyphicon-chevron-up pull-right"
                      id="up">
                </span>
            </div>
            <div class="panel-body" id="panel-body">
                <form method="post" action="{$baseurl}/issue_tracker/my_issue_tracker/">
                    <div class="row">
                        <div class="form-group col-sm-4">
                            <label class="col-sm-12 col-md-4">
                                {$form.keyword.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.keyword.html}
                            </div>
                        </div>
                        <div class="form-group col-sm-4">
                            <label class="col-sm-12 col-md-4">
                                {$form.issueID.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.issueID.html}
                            </div>
                        </div>
                        <div class="form-group col-sm-4">
                            <label class="col-sm-12 col-md-4">
                                {$form.status.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.status.html}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-4">
                            <label class="col-sm-12 col-md-4">
                                {$form.module.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.module.html}
                            </div>
                        </div>
                        <div class="form-group col-sm-4">
                            <label class="col-sm-12 col-md-4">
                                {$form.category.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.category.html}
                            </div>
                        </div>
                        <div class="form-group col-sm-4">
                            <label class="col-sm-12 col-md-4">
                                {$form.priority.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.priority.html}
                            </div>
                        </div>

                    </div>
                    <div class="row">
                        <div class="form-group col-sm-4">
                            <label class="col-sm-12 col-md-4">
                                {$form.site.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.site.html}
                            </div>
                        </div>
                        <div class="form-group col-sm-4">
                            <label class="col-sm-12 col-md-4">
                                {$form.reporter.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.reporter.html}
                            </div>
                        </div>

                    </div>
                    <div class="row">


                    </div>
                    <div class="row">
                        <div class="form-group col-sm-4">
                            <label class="col-sm-12 col-md-4">
                                {$form.minDate.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.minDate.html}
                            </div>
                        </div>
                        <div class="form-group col-sm-4">
                            <label class="col-sm-12 col-md-4">
                                {$form.maxDate.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.maxDate.html}
                            </div>
                        </div>
                        <div class="form-group col-sm-4">
                            <label class="col-sm-12 col-md-4">
                                {*{$form.watching.label}*}
                                &nbsp;
                            </label>
                            <div class="col-sm-12 col-md-8">
                                <b>{$form.watching.html}</b>
                            </div>
                        </div>
                    </div>
                    <div class="'row">
                        <hr>
                    </div>
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
                                {$form.visitLabel.label}
                            </label>
                            <div class="col-sm-12 col-md-8">
                                {$form.visitLabel.html}
                            </div>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="form-group col-sm-4 col-md-2 col-xs-12">
                          <a class="btn btn-sm btn-primary col-xs-12"
                             href="{$baseurl}/issue_tracker/issue/0"
                          >Add Issue</a>
                        </div>
                        <div class="form-group col-sm-4 col-md-2 col-xs-12 col-sm-offset-2 col-md-offset-5">
                            <input type="submit"
                                   class="btn btn-sm btn-primary col-xs-12"
                                   name="filter"
                                   value="Show Data"></div>
                        <div class="form-group col-sm-4 col-md-2 col-xs-12">
                            <input type="button"
                                   name="reset"
                                   value="Clear Form"
                                   class="btn btn-sm btn-primary col-xs-12"
                                   onclick="location.href='{$baseurl}/issue_tracker/my_issue_tracker/?reset=true'"/></div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-sm-12">
        <div id="tabs" style="background: white">
            <ul class="nav nav-tabs">
                <li class="statsTab"><a class="statsTabLink" id="onLoad" href="{$baseurl}/issue_tracker/">All Active
                        Issues</a></li>
                <li class="statsTab"><a class="statsTabLink"
                                        href="{$baseurl}/issue_tracker/resolved_issue_tracker/">Closed
                        Issues</a></li>
                <li class="statsTab active"><a class="statsTabLink"
                                        href="{$baseurl}/issue_tracker/my_issue_tracker/">My Issues</a></li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane active">
                    <div>
                        <!--  title table with pagination -->
                        <table id="LogEntries" border="0" valign="bottom" width="100%">
                            <tr>
                                <!-- display pagination links -->
                                <td align="right" id="pageLinks"></td>
                            </tr>
                        </table>
                        <div id="datatable">
                            <script>
                                loris.hiddenHeaders = {(empty($hiddenHeaders))? [] : $hiddenHeaders };
                                var table = RDynamicDataTable({
                                    "DataURL": "{$baseurl}/issue_tracker/my_issue_tracker/?format=json",
                                    "getFormattedCell": formatColumn
                                });
                                ReactDOM.render(table, document.getElementById("datatable"));
                            </script>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
