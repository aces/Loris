<link rel="stylesheet" href="{$baseurl}/GetCSS.php?Module=genomic_browser&file=lite_viewer.css">
<div class="col-sm-12">
  <div class="row">
    <div id="tabs">
      <ul class="nav nav-tabs">
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/">Profiles</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/?submenu=gwas_browser">GWAS</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/?submenu=snp_browser">SNP</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/?submenu=cnv_browser">CNV</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/?submenu=cpg_browser">Methylation</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/?submenu=genomic_file_uploader">Files</a></li>
        <li class="statsTab active"><a class="statsTabLink" id="onLoad"><strong>Viewer</strong></a></li>
      </ul>
      <br>
    </div>
  </div>
  <div class="row">
    <div class="tab-content">
      <div class="tab-pane active">
        <div class="col-sm-12">
          <div class="row">
            <div id="filters-div">
              <div class="panel panel-primary">
                <div class="panel-heading panel-clickable" onclick="hideFilterCoord();">
                  Coordinates selection
                  <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-coord"></span>
                  <span class="glyphicon glyphicon-chevron-up pull-right" id="up-coord"></span>
                </div>
                <div class="panel-body" id="panel-body-coord">
                  <div class="row">
                    <div class="form-group col-sm-12">
                      <label class="col-sm-12 col-md-1 col-lg-1" data-toggle="tooltip" title="Choose your chromosome">
                        {$form.Chromosome.label}
                      </label>
                      <div class="col-sm-12 col-md-1 col-lg-1">
                        {$form.Chromosome.html}
                      </div>
                      <label class="col-sm-12 col-md-1 col-lg-1">
                        {$form.StartLoc.label}
                      </label>
                      <div class="col-sm-12 col-md-2 col-lg-2">
                        {$form.StartLoc.html}
                      </div>
                      <label class="col-sm-12 col-md-1 col-lg-1">
                        {$form.EndLoc.label}
                      </label>
                      <div class="col-sm-12 col-md-2 col-lg-2">
                        {$form.EndLoc.html}
                      </div>
                      <label class="col-sm-12 col-md-1 col-lg-1">
                        {$form.Strand.label}
                      </label>
                      <div class="col-sm-12 col-md-1 col-lg-1">
                        {$form.Strand.html}
                      </div>
                    </div>
                    <div class="form-group col-sm-12">
                      <div class="col-sm-2 col-xs-6 col-md-2">
                        <input type="button" id="update" value="Show data" onclick="showData()" class="btn btn-sm btn-primary col-xs-12"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12">
          <div class="row">
            <div id="chart-div-2">
              <div class="panel panel-primary">
                <div class="panel-heading panel-clickable" onclick="hideFilterCoord();">
                  Chart
                  <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-coord"></span>
                  <span class="glyphicon glyphicon-chevron-up pull-right" id="up-coord"></span>
                </div>
                <div class="panel-body" id="panel-body-coord">
                  <div id="chart-placeholder-2" class="chart-placeholder"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <h4 class="modal-title" id="myModalLabel">Modal title</h4>
      </div>
      <div class="modal-body">
{literal}
<style>
#myModal .modal-dialog {
  width: 800px;
}

.box .title { font-size: 14px; font-weight: bold; }
.box .subtitle { fill: #999; }
.box {
  font: 10px sans-serif;
}

.box line,
.box rect,
.box circle {
  fill: #fff;
  stroke: #000;
  stroke-width: 1.5px;
}

.box .center {
  stroke-dasharray: 3,3;
}

.box .outlier {
  fill: none;
  stroke: #ccc;
}
</style>
<script>

var margin = {top: 10, right: 50, bottom: 20, left: 50},
    width = 120 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var min = Infinity,
    max = -Infinity;

var chart = d3.box()
    .whiskers(iqr(1.5))
    .width(width)
    .height(height);
function update (snpId) {
d3.csv(loris.BaseURL + "/genomic_browser/ajax/getDistByAllele.php?snp=" + snpId, function(error, csv) {
  if (error) throw error;

  var data = [];
  var labels = [];

  csv.forEach(function(x, i) {
    var e = Math.floor(x.Expt - 1),
        r = Math.floor(x.Run - 1),
        s = Math.floor(x.Speed),
        l = x.Label,
        d = data[e];
    if (!d) {
      d = data[e] = [s];
      labels[e] = l;
    } else {
      d.push(s);
    }
    if (s > max) max = s;
    if (s < min) min = s;
  });

  chart.domain([min, max]);

  var boxes = d3.select(".modal-body").selectAll("svg")
      .data(data)
    .enter().append("svg")
      .attr("class", "box")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(chart);

  var title = d3.select(".modal-body").selectAll("svg").append("text")
      .data(labels)
      .text(function (d) {return d;})
      .attr("class", "box-title")
      .attr("x", (width + margin.left + margin.right)/2)
      .attr("y", height + margin.bottom + margin.top)
      .attr("text-anchor","middle");
  
});
}

// Returns a function to compute the interquartile range.
function iqr(k) {
  return function(d, i) {
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2],
        iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
  };
}
</script>
{/literal}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
