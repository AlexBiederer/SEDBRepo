 import * as d3 from 'd3';

 const query = "../../complete.json";


 d3.json(query,
   data => {
     console.log(data);
   });
