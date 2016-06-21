<div class="panel panel-primary">
    <div class="panel-heading">
        <a role="button" data-toggle="collapse" href="#selection-filter" aria-expanded="true" aria-controls="selection-filter">
              Selection Filter
              <span class="glyphicon glyphicon-chevron-down pull-right"></span>
              <!--<span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>-->
            </a>
    </div>

    <div id="selection-filter" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
        <div class="panel-body" id="panel-body">
            <form method="post" action="/videos/">
                <div class="row">
                    <div class="col-md-10 col-lg-6 col-md-offset-1 col-lg-offset-3">
                        <div class="row">
                            <div class="form-group col-sm-6">
                                <label class="col-md-4">{$form.PSCID.label}</label>
                                <div class="col-md-8">{$form.PSCID.html}</div>
                            </div>
                            <div class="form-group col-sm-6">
                                <label class="col-md-4">{$form.Instrument.label}</label>
                                <div class="col-md-8">{$form.Instrument.html}</div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-sm-6">
                                <label class="col-md-4">{$form.visitLabel.label}</label>
                                <div class="col-md-8">{$form.visitLabel.html}</div>
                            </div>
                            <div class="form-group col-sm-6">
                                <label class="col-md-4">{$form.For_site.label}</label>
                                <div class="col-md-8">{$form.For_site.html}</div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="btn-group-loris">
                                    <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary btn-loris" />
                                    <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary btn-loris" onclick="location.href='?reset=true'"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        </form>
    </div>
</div>