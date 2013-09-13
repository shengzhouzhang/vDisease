function affect(sigInst, options) {
  
  var inits = options.inits;
  var susceptible = [];
  var exposed = [];
  var infectious = [];
  var recovered = [];
  var i, index;
  
  var update = function() {
    
    sigInst.iterNodes(function(node){
      
      if ((index = susceptible.indexOf(node.id)) >= 0) {
        
        node.color = "green";
        node.attr.timer = 0;
      
      } else if ((index = exposed.indexOf(node.id)) >= 0) {
        
        node.color = "yellow";
        node.attr.timer++;
        
        if (node.attr.timer >= node.attr.l) {
          
          exposed.splice(index, 1);
          infectious.push(node.id);
          node.attr.timer = 0;
        }
        
      } else if ((index = infectious.indexOf(node.id)) >= 0) {
        
        node.color = "red";
        node.attr.timer++;
        
        if (node.attr.timer >= node.attr.d) {
          
          infectious.splice(index, 1);
          recovered.push(node.id);
          node.attr.timer = 0;
        }
        
      } else if ((index = recovered.indexOf(node.id)) >= 0) {
        
        node.color = "grey";
        node.attr.timer = 0;
      }
      
    }).draw(2, 2, 2);
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
  
  update();
  
  setInterval(function() {
    
    sigInst.iterEdges(function(e) {
      
      if(infectious.indexOf(e.source) >= 0 && 
         (index = susceptible.indexOf(e.target)) >= 0 &&
         Math.random() < e.attr.probability) {
        
        susceptible.splice(index, 1);
        exposed.push(e.target);
      }
    });
    
    update();
    
    //console.log(susceptible.length + exposed.length + infectious.length + recovered.length);
    
  }, 2000);
  
}