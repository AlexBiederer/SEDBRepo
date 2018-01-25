import * as d3 from 'd3';
import parteiToAbk from './parteiToAbk';
import parteiToColor from './parteiToColor';

class BarChart {

  constructor(data, router) {
    this.router = router;
    this.svg = d3.select("#barChart");
    this.margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    };

    this.width = +(window.innerWidth / 2.5) - this.margin.left - this.margin.right;
    this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom;
    this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    this.chartArea = this.g.append("g");

    this.tooltip = d3.select("#wahlkreis")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("border", "1px solid grey")
      .style("border-radius", "3px")
      .style("text-align", "center")
      .style("padding", "8px 0")
      .style("width", "250px")
      .style("background-color", "#fff")
      .style("color", "#333")
      .text("Test")
      .attr("class", "tooltipBarChart");

    this.x0 = d3.scaleBand()
      .rangeRound([0, this.width])
      .paddingInner(0.1);

    this.x1 = d3.scaleBand()
      .padding(0.05);

    this.y = d3.scaleLinear()
      .rangeRound([this.height, 0]);


    this.keys = ["numzweitstimmenproz", "numzweitstimmenproz13"];
    data = data.map(d => {
      d.numzweitstimmenproz13 = (+d.numzweitstimmenproz - +d.diffzweitstimmenproz).toFixed(2);
      d.numzweitstimmenabs13 = (+d.numzweitstimmenabs - +d.diffzweitstimmenabs);
      return d;
    });

    this.x0.domain(data.map(function(d) {
      return parteiToAbk[d.partei];
    }));
    this.x1.domain(this.keys).rangeRound([0, this.x0.bandwidth()]);
    this.y.domain([0, d3.max(data, function(d) {
      return d3.max(this.keys, function(key) {
        return +d[key];
      });
    }.bind(this))]).nice();


    this.g.append("g")
      .attr("class", "x-axis")
      .attr("stroke-width", 1.5)
      .attr("font-weight", "bold")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.x0));

    this.g.append("g")
      .attr("stroke-width", 1.5)
      .attr("class", "y-axis")
      .attr("font-weight", "bold")
      .call(d3.axisLeft(this.y).tickFormat(d => d + "%"));

    var legend = this.g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(this.keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
      });

    legend.append("rect")
      .attr("x", this.width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", "#000")
      .attr("fill-opacity", (d, i) => i ? 0.5 : 1);

    legend.append("text")
      .attr("x", this.width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text((d, i) => i ? "Bundestagswahl 2013" : "Bundestagswahl 2017");
    this.update(data);
  }

  update(data) {
    const that = this;
    data = data.map(d => {
      d.numzweitstimmenproz13 = (+d.numzweitstimmenproz - +d.diffzweitstimmenproz).toFixed(2);
      d.numzweitstimmenabs13 = (+d.numzweitstimmenabs - +d.diffzweitstimmenabs);
      return d;
    });

    this.x0.domain(data.map(function(d) {
      return parteiToAbk[d.partei];
    }));
    this.x1.domain(this.keys).rangeRound([0, this.x0.bandwidth()]);
    this.y.domain([0, 10 + d3.max(data, function(d) {
      return d3.max(this.keys, function(key) {
        return +d[key];
      });
    }.bind(this))]).nice();
    d3.select(".x-axis").call(d3.axisBottom(this.x0));
    d3.select(".y-axis").call(d3.axisLeft(this.y).tickFormat(d => d + "%"))

    var t = d3.transition()
      .duration(1000)
      .ease(d3.easeLinear);

    that.chartArea.selectAll("g")
      .remove()
      .exit()
      .data(data)
      .enter().append("g")
      .on("mouseover", d => {
        const top = (d3.event.clientY - 10);
        const left = (d3.event.clientX + 10);
        that.tooltip
          .style("top", `${top}px`)
          .style("left", `${left}px`)
        const vorzeichen1 = d.diffzweitstimmenproz >= 0 ? "+" : "",
          vorzeichen2 = d.diffzweitstimmenabs >= 0 ? "+" : "";

        that.tooltip
          .style("visibility", "visible")
          .html(`<b>${parteiToAbk[d.partei]}</b><br>
            <b>Stimmen (%): </b>${d.numzweitstimmenproz} % (${vorzeichen1}${d.diffzweitstimmenproz} %)<br>
            <b>Anzahl Stimmen: </b>${d.numzweitstimmenabs} (${vorzeichen2}${d.diffzweitstimmenabs})
           `);

      })
      .on("mousemove", _ => {
        console.log(d3.event);
        const top = (d3.event.clientY - 80);
        const left = (d3.event.clientX + 10);
        that.tooltip
          .style("top", `${top}px`)
          .style("left", `${left}px`)
      })
      .on("mouseout", _ => {
        that.tooltip
          .style("visibility", "hidden")
      })
      .attr("transform", function(d) {
        return "translate(" + that.x0(parteiToAbk[d.partei]) + ",0)";
      })
      .selectAll("rect")
      .remove().exit()
      .data(function(d) {
        return that.keys.map(function(key) {
          return {
            key: key,
            value: d[key],
            partei: parteiToAbk[d.partei],
            anzahlStimmen: key === "numzweitstimmenproz13" ? d.numzweitstimmenabs13 : d.numzweitstimmenabs,
            jahr: key === "numzweitstimmenproz13" ? 2013 : 2017,
            data: d
          };
        });
      })
      .enter().append("rect")
      .attr("transform", function(d) {
        return "translate(" + [that.x1(d.key), that.height] + ")"
      })
      .attr("width", (that.x1.bandwidth() + 5))
      .attr("height", 0)
      .attr("fill", d => parteiToColor[d.partei])
      .attr("fill-opacity", d => {
        return d.jahr === 2013 ? 0.5 : 1
      });
    that.chartArea.selectAll("rect").transition(t).attr("height", function(d) {
      return that.height - that.y(d.value);
    }).attr("transform", function(d) {
      return "translate(" + [that.x1(d.key), that.y(d.value)] + ")"
    });
  }

}

export default BarChart;
