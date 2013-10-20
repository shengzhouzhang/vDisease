function SEIR(graph, options) {
  
  this.susceptible = [];
  this.exposed = [];
  this.infectious = [];
  this.recovered = [];
  
  this.timer = 0;
  this.graph = graph;
  this.nodes = options.nodes;
  this.edges = options.edges;
  
  this.initial(options.inits);
};

SEIR.prototype.start = function() {
  
  this.interval();
};

SEIR.prototype.initial = function (data) {
  
  var seir = this;
  
  for (var item in data) {
    
    data[item].forEach(function(node) {
      
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
  
  this.nodes.forEach(function(node) {
  
    if (seir.exposed.indexOf(node) < 0 &&
        seir.infectious.indexOf(node) < 0 &&
        seir.recovered.indexOf(node) < 0) {
      
      seir.susceptible.push(node);
    }
  });
};

SEIR.prototype.interval = function() {
  
  var index, seir = this;
  
  seir.run();
  
  attrs.interval = setInterval(function() {
    
    if (attrs.isRun === true) {
      
      seir.edges.forEach(function(edge) {
        
        if(seir.infectious.indexOf(edge[0]) >= 0 && 
           (index = seir.susceptible.indexOf(edge[1])) >= 0 &&
           Math.random() < edge[2]) {
          
          seir.susceptible.splice(index, 1);
          seir.exposed.push(edge[1]);
        };
      });
      
      seir.timer++;
      
      // infection
      seir.run();
    }
    
  }, attrs.interval);
};

SEIR.prototype.run = function() {
  
  var index, seir = this;
  
  seir.updateInfo({s: susceptible.length, e: exposed.length, i: infectious.length, r: recovered.length, days: this.timer});
  
  this.graph.update({
    susceptible: this.susceptible,
    exposed: this.exposed,
    infectious: this.infectious,
    recovered: this.recovered
  });
  
  this.graph.draw();
};

SEIR.prototype.updateInfo = function(options) {
  
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
    
    $("ul.images").append('<li><a href="' + url + '" target="_blank">image_day_' + options.days + '</a></li>')
  }
};