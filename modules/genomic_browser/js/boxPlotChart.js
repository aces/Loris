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
d3.csv(loris.BaseURL + "/genomic_browser/ajax/getDistByAllele.php?snpId=" + snpId, function(error, csv) {
  if (error) throw error;
  var cpg_name = "";
  var keyedData = {};
  var labels = [];
  var genders = ['Male', 'Female'];

  csv.forEach(function(x, i) {
    var c = x.cpg_num - 1,
        n = x.cpg_name,
        // e = Number(x.alleles_num),
        e = x.Alleles,
        g = x.Gender,
        key = [e,g],
        s = parseFloat(x.BetaValue),
        l = x.Alleles,
        d = keyedData[key];

    if (!d) {
      cpg_name = n;
      d = keyedData[key] = [];
    }

    d.push(s);

    if (s > max) max = s;
    if (s < min) min = s;
  });

  chart.domain([0, 1]);
  labels = Object.keys(keyedData);
  data   = Object.keys(keyedData).map(function(k) {return keyedData[k];});

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
  
  //var chart_title = d3.select(".modal-body").append('h3')
  //    .text(cpg_name);
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
