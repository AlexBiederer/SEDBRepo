/**
 * PieChart für die Sitzverteilung im Bundestag
 * @author Felix Schwarzmeier
 */
import * as d3 from 'd3';
import parteiToColor from './parteiToColor';
import parteiToAbk from './parteiToAbk';


class PieChart {
  constructor(root, config) {
    this.config = config;
    this.config.width = $("#pieRoot").width();
    this.config.height = 300;
    this.outerSVG = d3.select(root).append('svg').attr('width', +this.config.width).attr('height', +this.config.height);
    this.radius = 260;
    //Math.min(this.config.width, this.config.height) * 0.65;
    this.innerSVG = this.outerSVG.append("g")
      .attr("transform", "translate(" + this.config.width / 2.1 + "," + this.config.height  + ")");
    this.pie = d3.pie()
      .sort(null)
      .value(d => this.config.value ? d[this.config.value] : null).startAngle(-90 * (Math.PI / 180))
      .endAngle(90 * (Math.PI / 180));
    this.arc = d3.arc()
      .outerRadius(this.radius - 10)
      .innerRadius(100);
    this.arcOver = d3.arc()
      .innerRadius(100)
      .outerRadius(this.radius);
    this.label = d3.arc()
      .outerRadius(this.radius + 100)
      .innerRadius(100);
    d3.json("db/query/bundestag_sitze", data => this.render(data));
  }
  render(data) {

    const union = {
      partei: "Union",
      name: "Union",
      abk: "Union",
      sitze: 0
    };
    const data2 = [];
    data.forEach(d => {
      $("#sitzeTableBody").append(`
        <tr>
        <td>${d.name} <b>(${parteiToAbk[d.name]})</b></td>
        <td>${d.sitze}</td>
        </tr>
      `);
      d.abk = parteiToAbk[d.name];
      if (d.partei === 0 || d.partei === 4) { // CDU or CSU
        union.sitze += +d.sitze;
      } else {
        data2.push(d);
      }
    });
    // Add "union"
    data2.unshift(union);
    const chart = this;
    let arc = chart.innerSVG.selectAll(".arc")
      .data(chart.pie(data2))
      .enter().append("g")
      .attr("class", "arc");

    arc.append("polyline").transition().delay(function(d, i) {
      return (i + 1) * chart.config.durationInit;
    }).attr("points", function(d) {
      var c = chart.arc.centroid(d),
        x = c[0],
        y = c[1],
        // pythagorean theorem for hypotenuse
        h = Math.sqrt(x * x + y * y),
        startX = (x / h * (chart.radius - 10)),
        startY = (y / h * (chart.radius - 10)),
        endX = (x / h * (chart.radius + 5)),
        endY = (y / h * (chart.radius ));
      return `${startX},${startY} ${endX}, ${endY} ${endX}, ${endY}`;
    });

    arc.append("path")
      .on("mouseover", function(d) {
        d3.select(this).transition()
          .duration(chart.config.durationMouse)
          .attr("d", chart.arcOver);
      })
      .on("mouseout", function(d) {
        d3.select(this).transition()
          .duration(chart.config.durationMouse)
          .attr("d", chart.arc);
      })
      //  .attr("d", chart.path)
      .attr("fill", function(d) {
        return parteiToColor[+d.data.partei];
      }).transition().delay(function(d, i) {
        return i * chart.config.durationInit;
      }).duration(chart.config.durationInit)
      .attrTween('d', function(d) {
        var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
        return function(t) {
          d.endAngle = i(t);
          return chart.arc(d)
        }
      });

    arc.append("text")
      .attr("transform", function(d) {
        return "translate(" + chart.label.centroid(d) + ")";
      })
      .attr("dy", "1em")
      .style("font-weight","bold")
      .attr("fill", d => d.data.partei !== 5 ? "white" : "black").transition().delay(function(d, i) {
        return (i + 1) * chart.config.durationInit;
      })
      .text(function(d) {
        return `${d.data.sitze}`;
      });


    arc.append("text").attr("transform", function(d) {
      var c = chart.arc.centroid(d),
        x = c[0],
        y = c[1],
        // pythagorean theorem for hypotenuse
        h = Math.sqrt(x * x + y * y);
      return "translate(" + (x / h * (chart.radius + 20)) + ',' +
        (y / h * (chart.radius + 10)) + ")";
    }).attr("text-anchor", "middle").attr("fill", "#333").style("font-weight","bold").transition().delay(function(d, i) {
      return (i + 1) * chart.config.durationInit;
    }).text(d => d.data.abk);


    chart.innerSVG.append("text")
      .attr("text-anchor", "middle")
      .attr('font-size', '2em')
      .attr('fill', "#333")
      .attr("y", -20)
      .style("font-weight", 500)
      .transition().delay(function(d, i) {
        return chart.config.durationInit * data.length;
      })
      .text(`${data.reduce((total, currentVal) => total + +currentVal.sitze,0)} Sitze`);
  }
}
export default PieChart;
