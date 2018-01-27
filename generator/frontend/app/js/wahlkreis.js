import BarChart from './barChart';
import BarChart2 from './barChart2';
class Wahlkreis {
  constructor(){}

  getBarChart(data, router){
    if(!this.barChart) {
      this.barChart = new BarChart(data, router);
      return null;
    }
    return this.barChart;
  }
  getBarChart2(data, router){
    if(!this.barChart2) {
      this.barChart2 = new BarChart2(data, router);
      return null;
    }
    return this.barChart2;
  }
}
export default Wahlkreis;
