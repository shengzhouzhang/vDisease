define([
  
  // Libraries
  "jquery",
  
  "models/graph/svg"
],

function($, svg) {

  return {
  
    data: [],
    
    svg: null,
    
    capture: function(sigInst, timestamp) {
      
      if (attrs.screencapture && timestamp >= 0) {

        this.data.push(svg.snapshot(sigInst, timestamp));
        
        if (this.data.length == 1)
          this.draw(0);
      }
    },
    
    draw: function(index) {
      
      if (this.data.length > index) {
        $("#replay").html(this.data[index]);
      }
      console.log(this.data.length + " " + index);
    }
  };
});