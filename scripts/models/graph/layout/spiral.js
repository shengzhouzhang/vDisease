define([

  // Libraries
  "jquery"
  
  
], function($) {

  var spiral = {
  
    initial: function(nodes, edges) {
      
      this.degree(nodes, edges);

      this.position(nodes, { degree: "degree", seed: nodes.length / 100});
    },
    
    degree: function(nodes, edges) {
      
      nodes.forEach(function(node) {
        
        node.degree = 0;
        node.neighbor = [];
      });
      
      edges.forEach(function(edge) {
        
        nodes.forEach(function(node) {
          
          if (edge.source === node.id) {
            
            node.degree++;
            node.neighbor.push(edge.target);
          }
        });
      });
      
      nodes.forEach(function(node) {
        
        var sum = 0;
        
        node.neighbor.forEach(function(x_node) {
          
          nodes.forEach(function(y_node) {
            
            if (x_node === y_node.id) {
              
              sum += y_node.degree;
            }
          });
        });
        
        if (node.degree !== 0)
          node.degree2 = node.degree + sum / node.degree;
        else
          node.degree2 = 0;
      });
      
      this.findMinAndMax(nodes);
    },
    
    findMinAndMax: function(nodes) {
      
      var min, max, min2, max2;
      
      nodes.forEach(function(node) {
        
        if (min === undefined ||
            min > node.degree)
          min = node.degree;
        
        if (min2 === undefined ||
            min2 > node.degree2)
          min2 = node.degree2;
        
        if (max === undefined ||
            max < node.degree)
          max = node.degree;
        
        if (max2 === undefined ||
            max2 < node.degree2)
          max2 = node.degree2;
        
      });
      
      this.min = min;
      this.max = max;
      this.min2 = min2;
      this.max2 = max;
    },
    
    position: function(nodes, options) {
      
      var length = nodes.length;
      var radius = options.radius;
      var seed = options.seed || 1;
      var degree = options.degree || "degree";
      var min, max;
      
      if (degree === "degree2") {
        min = this.min2;
        max = this.max2;
      } else {
        min = this.min;
        max = this.max;
      }
      
      var count = 0;
      var sum = min + max;
      var avg = sum / 2;
      
      //
      nodes.sort(function(a, b) {
        
        return (a[degree] - b[degree]);
      });
      
      var positionX = function() {
        
        return Math.cos(Math.PI * (count+=seed) / length) * (count);
      };
  
      var positionY = function() {
        
        return Math.sin(Math.PI * (count+=seed) / length) * (count);
      };
      
      nodes.forEach(function(node) {
        
        node.x = positionX();
        node.y = positionY();

      });
    },
  };
  
  return spiral;
});