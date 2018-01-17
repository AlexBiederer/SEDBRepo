import BarChart from './barChart';
class Wahlkreis {
  constructor(){
  }
  getBarChart(data, router){
    if(!this.barChart) {
      this.barChart = new BarChart(data, router);
      return null;
    }
    return this.barChart;
  }
}
export default Wahlkreis;
