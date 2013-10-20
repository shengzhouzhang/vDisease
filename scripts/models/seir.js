define([
  
  // Libraries
  "jquery",
  
  // models
  "models/log",
  "models/graph/graph"
],

function($, log, graph) {
  
  var SEIR = {};
  
  SEIR.start = function() {
    
    this.interval();
  };
  
  SEIR.initial = function (graph, options) {
    
    this.susceptible = [];
    this.exposed = [];
    this.infectious = [];
    this.recovered = [];
    this.graph = graph;
    
    this.timer = 0;
    this.nodes = options.nodes;
    this.edges = options.edges;
    
    console.log(this.nodes[0]);
    
    this.inits = options.inits;
    
    var seir = this;
    
    for (var item in this.inits) {
      
      this.inits[item].forEach(function(node) {
        
        if (node !== "") {
          
          switch(item) {
              
            case "susceptible":
              seir.susceptible.push(node);
              break;
            case "exposed":
              seir.exposed.push(node);
              break;
            case "infectious":
              seir.infectious.push(node);
              break;
            case "recovered":
              seir.recovered.push(node);
              break;
            default:
              break;
          }
        }
      });
    }
    
    if (seir.infectious.length == 0) {
      
      console.log("no initial infectious nodes.");
      return;
    }
    
    this.nodes.forEach(function(node) {
      
      node.timer = 0;
      
      if (seir.exposed.indexOf(node.id) < 0 &&
          seir.infectious.indexOf(node.id) < 0 &&
          seir.recovered.indexOf(node.id) < 0) {
        
        seir.susceptible.push(node.id);
      }
    });
  };
  
  SEIR.interval = function() {
    
    var index, seir = this;
    
    seir.update();
    
    attrs.interval = setInterval(function() {
      
      if (attrs.isRun === true) {
        
        seir.edges.forEach(function(edge) {
          
          if(seir.infectious.indexOf(edge.source) >= 0 && 
             (index = seir.susceptible.indexOf(edge.target)) >= 0 &&
             Math.random() < edge.probability) {
            
            log.write(seir.timer + "\t" + edge.source + "\t" + edge.target);
            
            seir.susceptible.splice(index, 1);
            seir.exposed.push(edge.target);
            edge.hidden = false;
            
          };
        });
        
        seir.timer++;
        
        // infection
        seir.update();
      }
      
    }, attrs.interval);
  };
  
  SEIR.update = function() {
    
    var index, seir = this;
    
    seir.updateInfo({s: seir.susceptible.length, e: seir.exposed.length, i: seir.infectious.length, r: seir.recovered.length, days: seir.timer});
    
    seir.nodes.forEach(function(node){
      
      if ((index = seir.susceptible.indexOf(node.id)) >= 0) {
        
        node.color = "green";
        node.timer = 0;
        
      } else if ((index = seir.exposed.indexOf(node.id)) >= 0) {
        
        node.color = "#FFCC00";
        node.timer++;
        
        if (node.timer >= attrs.l) {
          
          seir.exposed.splice(index, 1);
          seir.infectious.push(node.id);
          node.timer = 0;
        }
        
      } else if ((index = seir.infectious.indexOf(node.id)) >= 0) {
        
        node.color = "#CC0000";
        node.timer++;
        
        if (node.timer >= attrs.d) {
          
          seir.infectious.splice(index, 1);
          seir.recovered.push(node.id);
          
          node.timer = 0;
        }
        
      } else if ((index = seir.recovered.indexOf(node.id)) >= 0) {
        
        node.color = "#3399CC";
        node.timer = 0;
        
        seir.edges.forEach(function(edge) {
          
          if (edge.source === node.id) {
            edge.hidden = true;
          }
        });
      }
    });
    
    console.log(seir.nodes[0]);
    this.graph.updateNodes(seir.nodes);
    this.graph.updateEdges(seir.edges);
    
    this.graph.draw();
  };
  
  SEIR.updateInfo = function(options) {
    
    if (options.nodes !== undefined)
      $("#nodes").html(options.nodes);
    
    if (options.edges !== undefined)
      $("#edges").html(options.edges);
    
    if (options.days !== undefined)
      $("#days").html(options.days);
    
    if (options.s !== undefined)
      $("#susceptible").html(options.s);
    
    if (options.e !== undefined)
      $("#exposed").html(options.e);
    
    if (options.i !== undefined)
      $("#infectious").html(options.i);
    
    if (options.r !== undefined)
      $("#recovered").html(options.r);
    
    if (attrs.screencapture && options.days >= 1) {
      
      var nodes = document.getElementById("sigma_nodes_1");
      var url = nodes.toDataURL('image/png');
      
      $("ul.images").append('<li><a href="' + url + '" target="_blank">image_day_' + options.days + '</a></li>');
      
      var stream = log.download();
      
      $("#logs").attr("href", "data:application/octet-stream," + encodeURIComponent(stream));
    }
  };

  
  return SEIR;
});