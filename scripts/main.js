require([
  
  "jquery",
  "bootstrap",
  "slider",
  "switcher",
  
  "models/log",
  "models/attrs",
  "models/file",
  "models/seir",
  "models/graph/graph",
  "models/graph/layout/degree",
  "models/graph/layout/spiral",
  "models/graph/layout/circle"
  
],

function($, bootstrap, slider, switcher, log, attrs, file, seir, graph, degree, spiral, circle) {


  $(document).ready(function() {
    
    attrs.screencapture = true;
    
    var hasLoaded = false;

    var nodes, edges;
    
    // load file
    $("form.navbar-form ul.file a").click(function(event) {
      
      event.preventDefault();
      
      var val = $(this).attr("value");
      var fileName;
      
      fileName = val + ".txt";
      
      if (!hasLoaded) {
        
        $.ajax({
          type: "GET",
          url: "text/" + fileName,
          dataType: "text",
          success: function(data) {
            
            var result = file.parseFile(data);
            
            nodes = result.nodes;
            edges = result.edges;
            
            graph.initial(nodes, edges, {});
            
            hasLoaded = true;
          },
          error: function(err) {
            
            console.log(err);
          }
        });
        
        $("form.navbar-form").removeClass("open");
      }
    });
    
    // start button
    var isStarted = false;
    attrs.isRun = false;
    
    $("button.run").click(function(event) {
      
      event.preventDefault();
      
      if (hasLoaded) {
        
        var susceptible = [];
        var exposed = [];
        var recovered = [];
        var infectious = file.parseIDs($("#infectiousInput").val());
        
        if (!attrs.isRun && !isStarted) {
          
          graph.stopForceAtlas2();
          
          seir.initial(graph, {
            inits: {
              susceptible: susceptible,
              exposed: exposed,
              infectious: infectious,
              recovered: recovered
            }, 
            nodes: nodes, 
            edges: edges, 
            options: {}
          });
          
          seir.start();
        };
        
        attrs.isRun = !attrs.isRun;
        
        if (attrs.isRun) {
          
          $(this).html('<span class="glyphicon glyphicon-pause"></span> pause');
        } else {
          
          $(this).html('<span class="glyphicon glyphicon-play"></span> run');
        }
      }
    });
    
    // layout button
    $("div.layout a").click(function(event) {
      
      event.preventDefault();
      
      attrs.layout = $(this).attr("value");
      
      if (hasLoaded) {
        
        if (graph.hasStartedForceAtlas2) {
          
          //graph.stopForceAtlas2();
        }
        
        console.log(attrs.layout);
        
        switch (attrs.layout) {
            
          case "ForceAtlas2 (LinLin Mode)":
            attrs.strongGravityMode = false;
            attrs.linLogMode = false;
            attrs.edgeWeightInfluence = 1;
            circle.initial(nodes);
            graph.updateNodes(nodes);
            graph.initialForceAtlas2(nodes);
            break;
          case "ForceAtlas2 (Strong Gravity)":
            attrs.strongGravityMode = true;
            attrs.linLogMode = true;
            attrs.edgeWeightInfluence = 1;
            circle.initial(nodes);
            graph.updateNodes(nodes);
            graph.initialForceAtlas2(nodes);
            break;
          case "Degree":
            degree.initial(nodes, edges);
            graph.updateNodes(nodes);
            break;
          case "Spiral":
            spiral.initial(nodes, edges);
            graph.updateNodes(nodes);
            break;
          case "Circle":
            circle.initial(nodes);
            graph.updateNodes(nodes);
            break;
          default:
            attrs.strongGravityMode = false;
            attrs.linLogMode = true;
            attrs.edgeWeightInfluence = 1;
            circle.initial(nodes);
            graph.updateNodes(nodes);
            graph.initialForceAtlas2(nodes);
            break;
         }
        
        //graph.updateNodes(nodes);
        
        if (attrs.layout.toLowerCase().indexOf("forceatlas2") !== -1) {
          
          graph.startForceAtlas2();
          
        } else {
          
          graph.draw();
        }

      }
    });
    
    /*
    // stop button
    $("button.stop").click(function(event) {
      
      event.preventDefault();
      
      $("div.canvas").html('<div id="canvas"></div>');
      
      if (attrs.interval)
        clearTimeout(attrs.interval);
      
      hasLoaded = false;
      
      delete attrs.interval;
    });
    */
    
    // radio button
    switcher("#showEdges input").change(function(event){
      
      console.log("showEdges: " + !attrs.showEdges);
      
      event.preventDefault();
        
        if (attrs.showEdges) {
          
          attrs.showEdges = false;
        } else {
          
          attrs.showEdges = true;
        }
      
      if (hasLoaded) {
        
        if (attrs.showEdges) {
          
          graph.showEdges();
          
        } else {
          
          graph.hideEdges(); 
        }
        
        graph.draw();
      }
    });
    
    switcher("#forceLabels input").change(function(event) {
      
      event.preventDefault();
      
      if (attrs.forceLables) {
        
        attrs.forceLables = false;
        //$("div#canvas").removeClass("showbg");
      } else {
        
        attrs.forceLables = true;
        //$("div#canvas").addClass("showbg");
      }
      
      if (hasLoaded) {
        
        if (attrs.forceLables)
          graph.showLabels();
        else 
          graph.hideLabels();
        
        graph.draw();
      }
    });
    
    /*
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
    */
    
    slider('#l').slider().on('slide', function(ev){
      
      attrs.l = ev.value;
      console.log(attrs.l);
    });
    
    slider('#d').slider().on('slide', function(ev){
      
      attrs.d = ev.value;
      console.log(attrs.d);
    });
    
    slider('#i').slider().on('slide', function(ev){
      
      attrs.interval = ev.value * 1000;
      console.log(attrs.interval);
    });
    
    //generateTestCase();
  });
  
});