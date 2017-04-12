<div class="row">
    <div class="col-lg-8">
        <div class="panel panel-primary">
            <div class="panel-body">
                <div>
                    <a id="btn-back" class="btn btn-sm btn-primary" href="/acknowledgements/">Back to Acknowledgements</a>
                    <span class="pull-right">
                        <a id="btn-add-default-data" class="btn btn-sm btn-danger" href="#/" style="display:none;">Add Default Data</a>
                    </span>
                </div>
                <br/>
                <br/>
                <br/>
                <form id="select-center-form" method="GET" action="/acknowledgements">
                    <input type="hidden" name="submenu" value="admin"/>
                    <div class="row">
                        <div class="col-lg-8 col-sm-8">
                            <select id="select-center" name="centerId" class="form-control">
                                <option id="select-center-prompt" value="0">Select a Site</option>
                                <option id="select-center-prompt" value="-1">All Sites</option>
                            </select>
                        </div>
                        <div class="col-lg-4 col-sm-4 col-xs-12">
                            <input type="submit" value="Select Site" class="btn btn-sm btn-primary form-control"/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</diV>
<div id="all-center-row" class="row" style="display: none;">
    All Sites
    <div class="col-lg-4" id="all-center-affiliation">
    </div>
    <div class="col-lg-4" id="all-center-degree">
    </div>
    <div class="col-lg-4" id="all-center-role">
    </div>
</div>
<div id="default-row" class="row">
    <div class="col-lg-4" id="container-affiliation">
    </div>
    <div class="col-lg-4" id="container-degree">
    </div>
    <div class="col-lg-4" id="container-role">
    </div>
</div>
<script src="/acknowledgements/js/admin_FormAdd.js"></script>
<script src="/acknowledgements/js/admin_Row.js"></script>
<script src="/acknowledgements/js/admin_TBody.js"></script>
<script src="/acknowledgements/js/admin_Table.js"></script>
<script src="/acknowledgements/js/admin_main.js"></script>