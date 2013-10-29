define([
  
  // Libraries
  "jquery"
],

function($) {

  return {
  
    data: [],
    
    capture: function(options) {
      
      if (attrs.screencapture && options.days >= 1) {
        
        if (!this.nodes)
          this.nodes = document.getElementById("sigma_nodes_1");
        
        if (!this.edges)
          this.edges = document.getElementById("sigma_edges_1");
        
        var combines = document.createElement('canvas');
        
        combines.width = this.nodes.width;
        combines.height = this.nodes.height;
        
        combines.getContext("2d").drawImage(this.nodes, 0, 0);
        combines.getContext("2d").drawImage(this.edges, 0, 0);
        
        this.data.push(combines.toDataURL("image/png"));
        
        if (this.data.length == 1)
          this.draw(0);
      }
    },
    
    draw: function(index) {
      
      if (this.data.length > index) {
        $("#replay").attr("src", this.data[index]);
      }
    }
  };
});