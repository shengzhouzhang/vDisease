define([

  // Libraries
  "jquery"
  
  
], function($) {

  var degree = {
  
    initial: function(nodes, edges) {
      
      this.degree(nodes, edges);
      
      this.position(nodes, { degree: "degree2" });
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
      
      var positionX = function(radius) {
        
        return Math.cos(Math.PI * (count++) / length) * radius;
      };
  
      var positionY = function(radius) {
        
        return Math.sin(Math.PI * (count++) / length) * radius;
      };
      
      var sum = min + max;
      var avg = sum / 2;
      
      nodes.forEach(function(node) {
        
        node.x = positionX((sum - node[degree]));
        node.y = positionY((sum - node[degree]));

      });
    },
    
    
  };
  
  return degree;
});