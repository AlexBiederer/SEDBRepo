import BarChart from './barChart';
class Wahlkreis {
  constructor(){
  }
  getBarChart(data){
    if(!this.barChart) {
      this.barChart = new BarChart(data);
      return null;
    }
    return this.barChart;
  }
}
export default Wahlkreis;
