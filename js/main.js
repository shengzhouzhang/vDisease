$(document).ready(function() {
  
  //generateTestCase();
  var start = false;
  
  $("select.layout").change(function() {
  
    attrs.layout = $(this).val();
    
    if (attrs.sigInst !== null) {
      
      switch (attrs.layout) {
          
        case "ForceAtlas2 (LinLin Mode)":
          attrs.strongGravityMode = false;
          attrs.linLogMode = false;
          attrs.edgeWeightInfluence = 1;
          break;
        case "ForceAtlas2 (Strong Gravity)":
          attrs.strongGravityMode = true;
          attrs.linLogMode = true;
          attrs.edgeWeightInfluence = 1;
          break;
        default:
          attrs.strongGravityMode = false;
          attrs.linLogMode = true;
          attrs.edgeWeightInfluence = 1;
          break;
      }
      
      if (attrs.layout === "ForceAtlas2" || 
          attrs.layout === "ForceAtlas2 (LinLin Mode)" ||
          attrs.layout === "ForceAtlas2 (Strong Gravity)") {
        
        console.log(attrs.layout);
        
        if (!attrs.forceAtlas2) {
        
          attrs.counter = 0;
          
          attrs.sigInst.iterNodes(function(n){
            
            n.x = positionX();
            n.y = positionY();
          });
          
          attrs.sigInst.startForceAtlas2({
            strongGravityMode: attrs.strongGravityMode,
            linLogMode: attrs.linLogMode,
            edgeWeightInfluence: attrs.edgeWeightInfluence
          });
          
          attrs.forceAtlas2 = true;
          
        } else {
          
          attrs.sigInst.changeSettings({
            strongGravityMode: attrs.strongGravityMode,
            gravity: attrs.gravity,
            linLogMode: attrs.linLogMode,
            edgeWeightInfluence: attrs.edgeWeightInfluence
          });
        }
      } else {
        
        attrs.counter = 0;
        
        console.log(attrs.layout);
        
        attrs.sigInst.iterNodes(function(n){
          
          n.x = positionX();
          n.y = positionY();
        });
        
        if (attrs.forceAtlas2) {
          
          attrs.sigInst.changeSettings({
            strongGravityMode: attrs.strongGravityMode,
            gravity: attrs.gravity,
            linLogMode: attrs.linLogMode,
            edgeWeightInfluence: attrs.edgeWeightInfluence
          });
          
          attrs.sigInst.stopForceAtlas2();
          attrs.forceAtlas2 = false;
        }
        
        attrs.sigInst.position(0,0,1).draw();
      }
    }
  });
  
  $("#showEdges input").change(function(event){
    
    event.preventDefault();
    
    if (attrs.showEdges) {
      
      attrs.showEdges = false;
    } else {
      
      attrs.showEdges = true;
    }
    
    if (attrs.sigInst !== undefined && attrs.sigInst !== null) {
      
      attrs.sigInst.iterEdges(function(e) {
        
        e.hidden = !attrs.showEdges;
      });
      
      if (attrs.showEdges) {
        
        if (attrs.forceAtlas2) {
          
          attrs.sigInst.stopForceAtlas2();
          attrs.forceAtlas2 = false;
        }

      } else {
        
        if (!attrs.forceAtlas2) {
          
          attrs.sigInst.startForceAtlas2({
            strongGravityMode: attrs.strongGravityMode,
            linLogMode: attrs.linLogMode,
            edgeWeightInfluence: attrs.edgeWeightInfluence
          });
          
          attrs.forceAtlas2 = true;
        }
      }
      
      attrs.sigInst.draw(2, 2, 2);
    }
  });
  
  $("#forceLabels input").change(function(event) {
  
    event.preventDefault();
    
    if (attrs.forceLables) {
      
      attrs.forceLables = false;
    } else {
      
      attrs.forceLables = true;
    }
    
    if (attrs.sigInst !== undefined && attrs.sigInst !== null) {
      
      attrs.sigInst.iterNodes(function(n){
        
        n.forceLabel = attrs.forceLables;
        
      });
      
      attrs.sigInst.draw();
    }
  });
  
  // rescale button
  $("button.rescale").click(function(event) {
      
    event.preventDefault();
    
    if (attrs.sigInst === undefined || attrs.sigInst === null)
      return;
    
    attrs.sigInst.position(0,0,1).draw();
  });
  
  // start infection button
  
  
  $("button.start").click(function(event) {
    
    event.preventDefault();
    
    if (attrs.sigInst === undefined || attrs.sigInst === null)
      return;
    
    if (!start) {
      
      affect(attrs.sigInst, {inits: ["81"]});
      start = true;
    }
    
  });

  $('#g').slider().on('slide', function(ev){
    
    attrs.gravity = ev.value;
    
    attrs.sigInst.changeSettings({
      strongGravityMode: attrs.strongGravityMode,
      gravity: attrs.gravity,
      linLogMode: attrs.linLogMode,
      edgeWeightInfluence: attrs.edgeWeightInfluence
    });
  });
  
  $('#w').slider().on('slide', function(ev){
    
    attrs.edgeWeightInfluence = ev.value;
    
    attrs.sigInst.changeSettings({
      strongGravityMode: attrs.strongGravityMode,
      gravity: attrs.gravity,
      linLogMode: attrs.linLogMode,
      edgeWeightInfluence: attrs.edgeWeightInfluence
    });
  });
  
  $('#l').slider().on('slide', function(ev){
    
    attrs.l = ev.value;
  });
  
  $('#d').slider().on('slide', function(ev){
    
    attrs.d = ev.value;
  });
  
  $('#i').slider().on('slide', function(ev){
    
    attrs.interval = ev.value * 1000;
  });
  
  $('input[type=file]').bootstrapFileInput();
  
  document.getElementById('file').addEventListener('change', fileSelection, false);
  
  
});

