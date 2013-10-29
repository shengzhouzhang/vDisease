define([
  
  // Libraries
  "jquery",
  
  // models
  "models/attrs",
  "models/log",
  "models/video",
  "models/graph/graph"
],

function($, attrs, log, video, graph) {
  
  var SEIR = {};
  
  SEIR.start = function() {
    
    this.interval();
  };
  
  SEIR.colors = {
    initial: attrs.color,
    susceptible: "#A0A0A0",
    exposed: "#FFCC00",
    infectious: "#CC0000",
    recovered: "#A0A0A0"
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
    
    // if no infectious nodes given, choose a random node
    if (seir.infectious.length == 0) {
      
      var node = Math.round(Math.random() * this.nodes.length);
      seir.infectious.push(node.toString());
    }
    
    // push every nodes that is not an infectious into susceptible nodes
    this.nodes.forEach(function(node) {
      
      node.timer = 0;
      
      if (seir.exposed.indexOf(node.id) < 0 &&
          seir.infectious.indexOf(node.id) < 0 &&
          seir.recovered.indexOf(node.id) < 0) {
        
        seir.susceptible.push(node.id);
      }
    });
    
    // set edges visable and give a light color
    seir.edges.forEach(function(edge) {
      
      edge.color = seir.colors.susceptible;
      edge.hidden = false;
    });
  };
  
  SEIR.interval = function() {
    
    var index, seir = this;
    
    seir.update();
    
    attrs.interval = setInterval(function() {
      
      if (attrs.isRun === true) {
        
        seir.edges.forEach(function(edge) {
          
          // get infection
          if(seir.infectious.indexOf(edge.source) >= 0 && 
             (index = seir.susceptible.indexOf(edge.target)) >= 0 &&
             Math.random() < (attrs.probability == 0.0 ? edge.probability : attrs.probability)) {
            
            log.write(seir.timer + "\t" + edge.source + "\t" + edge.target);
            
            // remove from susceptible nodes
            seir.susceptible.splice(index, 1);
            
            // push to exposed nodes, edge.target is only the id of the node
            seir.exposed.push(edge.target);
            
            // change edge color
            edge.color = seir.colors.infectious;
          };
        });
        
        // day +1
        seir.timer++;
        
        // infection
        seir.update();
      }
      
    }, attrs.interval * 1000);
  };
  
  SEIR.update = function() {
    
    var index, seir = this;
    
    seir.updateInfo({s: seir.susceptible.length, e: seir.exposed.length, i: seir.infectious.length, r: seir.recovered.length, days: seir.timer});
    
    seir.nodes.forEach(function(node){
      
      if ((index = seir.susceptible.indexOf(node.id)) >= 0) {
        
        //node.color = seir.colors.susceptible;
        node.timer = 0;
        
      } else if ((index = seir.exposed.indexOf(node.id)) >= 0) {
        
        node.color = seir.colors.exposed;
        node.timer++;
        
        if (node.timer >= attrs.exposed_period) {
          
          // remove from exposed nodes, and push into infectious nodes
          seir.exposed.splice(index, 1);
          seir.infectious.push(node.id);
          node.timer = 0;
        }
        
      } else if ((index = seir.infectious.indexOf(node.id)) >= 0) {
        
        node.color = seir.colors.infectious;
        node.timer++;
        
        if (node.timer >= attrs.infectious_period) {
          
          // remove from infectious nodes, and push into recovered nodes
          seir.infectious.splice(index, 1);
          seir.recovered.push(node.id);
          
          node.timer = 0;
        }
        
      } else if ((index = seir.recovered.indexOf(node.id)) >= 0) {
        
        node.color = seir.colors.recovered;
        node.timer = 0;
        
        // change edge's color if the node is recovered
        seir.edges.forEach(function(edge) {
          
          if (edge.source === node.id) {
            edge.color = seir.colors.recovered;
          }
        });
      }
    });
    
    // update graph
    this.graph.updateNodes(seir.nodes, ["color"]);
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
    
    video.capture(options);
  };

  
  return SEIR;
});