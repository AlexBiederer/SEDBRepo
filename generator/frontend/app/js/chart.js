import * as d3 from 'd3';


class Chart {
  constructor(root, config){
    this.config = Object.assign(CHART_DEFAULTS, config);
    this.outerSVG = d3.select(root).append('svg').attr('width', +this.config.width).attr('height', +this.config.height);
  }
}

const CHART_DEFAULTS = {
  width: 860,
  height: 400
};
export default Chart;
