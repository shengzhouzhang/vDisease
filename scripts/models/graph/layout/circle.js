define([
  
  // Libraries
  "jquery"
  
],

function($) {
  
  var circle = {};
  
  circle.initial = function(nodes) {
    
    var circle = this;
    
    var count = 0, radius = 200;
    
    nodes.forEach(function(node) {
      
      node.x = circle.positionX(count++, nodes.length, radius);
      node.y = circle.positionY(count++, nodes.length, radius);
    });
  };
  
  circle.positionX = function(count, length, radius) {
    
    return Math.cos(Math.PI * count / length) * radius;
  };
  
  circle.positionY = function(count, length, radius) {
    
    return Math.sin(Math.PI * count / length) * radius;
  };

  return circle;
});