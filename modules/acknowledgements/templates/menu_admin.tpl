<div class="row">
    <div class="col-lg-8">
        <div class="panel panel-primary">
            <div class="panel-body">
                <a id="btn-back" class="btn btn-sm btn-primary" href="/acknowledgements/">Back to Acknowledgements</a>
                <br/>
                <br/>
                <br/>
                <form method="GET" action="/acknowledgements">
                    <input type="hidden" name="submenu" value="admin"/>
                    <div class="row">
                        <div class="col-lg-8 col-sm-8">
                            <select id="select-center" name="center_id" class="form-control">
                                <option id="select-center-prompt" value="0">Select a Center</option>
                            </select>
                        </div>
                        <div class="col-lg-4 col-sm-4 col-xs-12">
                            <input type="submit" value="Select Center" class="btn btn-sm btn-primary form-control"/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</diV>
<div class="row">
    <div class="col-lg-4" id="container-affiliation">
    </div>
    <div class="col-lg-4" id="container-degree">
    </div>
    <div class="col-lg-4" id="container-role">
    </div>
</div>
<script src="/acknowledgements/js/admin_Row.js"></script>
<script src="/acknowledgements/js/admin_TBody.js"></script>
<script src="/acknowledgements/js/admin_Table.js"></script>
<script src="/acknowledgements/js/admin_main.js"></script>