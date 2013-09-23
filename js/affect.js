function affect(sigInst, options) {
  
  var inits = options.inits;
  var susceptible = [];
  var exposed = [];
  var infectious = [];
  var recovered = [];
  var i, index;
  var timer = 0;
  
  var update = function() {
    
    updateInfo({s: susceptible.length, e: exposed.length, i: infectious.length, r: recovered.length, days: timer});
    
    sigInst.iterNodes(function(node){
      
      if ((index = susceptible.indexOf(node.id)) >= 0) {
        
        node.color = "green";
        node.attr.timer = 0;
      
      } else if ((index = exposed.indexOf(node.id)) >= 0) {
        
        node.color = "#FFCC00";
        node.attr.timer++;
        
        if (node.attr.timer >= attrs.l) {
          
          exposed.splice(index, 1);
          infectious.push(node.id);
          node.attr.timer = 0;
        }
        
      } else if ((index = infectious.indexOf(node.id)) >= 0) {
        
        node.color = "#CC0000";
        node.attr.timer++;
        
        if (node.attr.timer >= attrs.d) {
          
          infectious.splice(index, 1);
          recovered.push(node.id);
          node.attr.timer = 0;
        }
        
      } else if ((index = recovered.indexOf(node.id)) >= 0) {
        
        node.color = "#3399CC";
        node.attr.timer = 0;
      }
      
    });
    
    sigInst.draw();
  };
  
  // initial attributes
  inits.forEach(function(node) {
  
    infectious.push(node)
  });
  
  sigInst.iterNodes(function(node){
    
    if (infectious.indexOf(node.id) < 0) {
      
      susceptible.push(node.id);
    }
  });
  
  // start infection
  update();
  
  setInterval(function() {
    
    if (attrs.stop != 2) {
      
      sigInst.iterEdges(function(e) {
        
        if(infectious.indexOf(e.source) >= 0 && 
           (index = susceptible.indexOf(e.target)) >= 0 &&
           Math.random() < e.attr.probability) {
          
          susceptible.splice(index, 1);
          exposed.push(e.target);
        }
      });
      
      timer++;
      
      // infection
      update();
    }
    
  }, attrs.interval);
}

function updateInfo(options) {
  
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
};