$(document).ready(function() {
  
  //generateTestCase();
  
  var showEdges = false;
  var start = false;
  
  $("select.layout").change(function() {
  
    attrs.layout = $(this).val();
    
    if (attrs.sigInst !== null) {
      
      attrs.counter = 0;
      
      attrs.sigInst.iterNodes(function(n){
        
        n.x = positionX();
        n.y = positionY();
      });
      
      if (attrs.layout === "ForceAtlas2") {
        
        if (!attrs.forceAtlas2) {

          // enable forceAtlas2
          attrs.sigInst.startForceAtlas2();
          attrs.forceAtlas2 = true;
          
          // hide edges
          if (showEdges) {
            
            attrs.sigInst.iterEdges(function(e) {
              
              e.hidden = true;
            });
            
            if (attrs.layout === "ForceAtlas2" && !attrs.forceAtlas2) {
              
              attrs.sigInst.startForceAtlas2();
              attrs.forceAtlas2 = true;
            }
            
            $("button.showEdges").text("Show Edges");
            showEdges = false;
          }
        }
        
      } else {
        
        if (attrs.forceAtlas2) {
          
          attrs.sigInst.stopForceAtlas2();
          attrs.forceAtlas2 = false;
        }
      }
      
      attrs.sigInst.position(0,0,1).draw();
    }
  });
  
  $("button.showEdges").click(function(event) {
    
    event.preventDefault();
    
    if (attrs.sigInst === undefined || attrs.sigInst === null)
      return;
    
    if (showEdges) {
      
      attrs.sigInst.iterEdges(function(e) {
        
        e.hidden = true;
      });
      
      if (attrs.layout === "ForceAtlas2" && !attrs.forceAtlas2) {
        
        attrs.sigInst.startForceAtlas2();
        attrs.forceAtlas2 = true;
      }
      
      $(this).text("Show Edges");
      showEdges = false;
    } else {
      
      attrs.sigInst.iterEdges(function(e) {
        
        e.hidden = false;
      });
      
      if (attrs.layout === "ForceAtlas2" && attrs.forceAtlas2) {
        
        attrs.sigInst.stopForceAtlas2();
        attrs.forceAtlas2 = false;
      }
      
      $(this).text("Hide Edges");
      showEdges = true;
    }
    
    attrs.sigInst.draw(2, 2, 2);
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
  
  $('#l').slider().on('slide', function(ev){
    
    attrs.l = ev.value;
  });
  
  $('#d').slider().on('slide', function(ev){
    
    attrs.d = ev.value;
  });
  
  $('input[type=file]').bootstrapFileInput();
  
  document.getElementById('file').addEventListener('change', fileSelection, false);
  
  
});

