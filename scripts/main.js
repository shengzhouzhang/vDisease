require([
  
  "jquery",
  "bootstrap",
  "slider",
  "switcher",
  
  "models/log",
  //"models/video",
  //"models/svg",
  "models/attrs",
  "models/file",
  "models/seir",
  "models/graph/graph",
  "models/graph/size",
  "models/graph/layout/spiral",
  "models/graph/layout/circle"
  
],

function($, bootstrap, slider, switcher, log, attrs, file, seir, graph, size, spiral, circle) {


  $(document).ready(function() {
    
    attrs.screencapture = true;
    
    var hasLoaded = false;

    var nodes, edges;
    
    // load file
    
    $("#fileInput").change(function(event) {
      
      var fileData = event.target.files[0]; // FileList object
      
      var reader = new FileReader();
      
      reader.onloadend = function(event) {

        //console.log(event.target);
        var data = event.target.result;
        var result = file.parseFile(data);
        
        nodes = result.nodes;
        edges = result.edges;
        
        graph.initial(nodes, edges, {});
        
        hasLoaded = true;
        
        $("form.navbar-form").removeClass("open");
      };
      
      // Read in the image file as a data URL.
      reader.readAsText(fileData);
    });
    
    $("form.navbar-form ul.file a").click(function(event) {
      
      event.preventDefault();
      
      var val = $(this).attr("value");
      
      if (!val) {
        
        $('#fileInput').click();
        return;
      }
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
    var hasStarted = false;
    attrs.isRun = false;

    if (localStorage.initialNodes != undefined)
      $("#infectiousInput").val(localStorage.initialNodes);
    
    $("button.run").click(function(event) {
      
      event.preventDefault();
      
      if (hasLoaded) {
        
        if (!attrs.isRun && !hasStarted) {
          
          graph.stopForceAtlas2();
          
          seir.initial(graph, {
            inits: {
              susceptible: [],
              exposed: [],
              infectious: file.parseIDs($("#infectiousInput").val()),
              recovered: []
            }, 
            nodes: nodes, 
            edges: edges, 
            options: {}
          });

          localStorage.initialNodes = $("#infectiousInput").val();
          
          seir.start();
          hasStarted = true;
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
        
        $(layoutButton).html(attrs.layout + ' <span class="caret"></span>');
        
        switch (attrs.layout) {
            
          case "Spiral":
            graph.stopForceAtlas2();
            spiral.initial(nodes, edges);
            graph.updateNodes(nodes, ["x", "y"]);
            graph.draw();
            break;
          case "Circle":
            graph.stopForceAtlas2();
            circle.initial(nodes);
            graph.updateNodes(nodes, ["x", "y"]);
            graph.draw();
            break;
          case "ForceAtlas2 (LinLin Mode)":
            attrs.strongGravityMode = false;
            attrs.linLogMode = false;
            attrs.edgeWeightInfluence = 1;
            graph.startForceAtlas2();
            break;
          case "ForceAtlas2 (Strong Gravity)":
            attrs.strongGravityMode = true;
            attrs.linLogMode = true;
            attrs.edgeWeightInfluence = 1;
            graph.startForceAtlas2();
            break;
          default:
            attrs.strongGravityMode = false;
            attrs.linLogMode = true;
            attrs.edgeWeightInfluence = 1;
            circle.initial(nodes);
            graph.updateNodes(nodes, ["x", "y"]);
            graph.startForceAtlas2();
            break;
         }
      }
    });
    
    // stop button
    $("button.stop").click(function(event) {
      
      event.preventDefault();
      
      location.reload();
    });
    
    $("#download").click(function(event) {
    
      event.preventDefault();
      
      var link = document.createElement("a");
      link.download = "log.txt";
      link.href = "data:text/plain;base64," + btoa(log.download());

      link.click();
    });
    
    // radio button
    switcher("#showEdges input").change(function(event){
      
      console.log("showEdges: " + !attrs.showEdges);
      
      event.preventDefault();
        
      if (attrs.showEdges) 
        attrs.showEdges = false;
      else  
        attrs.showEdges = true;
      
      if (hasLoaded) {
        
        if (attrs.showEdges)
          graph.showEdges();
        else  
          graph.hideEdges(); 
        
        graph.draw();
      }
    });
    
    switcher("#forceLabels input").change(function(event) {
      
      event.preventDefault();
      
      if (attrs.forceLables) {
        
        attrs.forceLables = false;
      } else {
        
        attrs.forceLables = true;
      }
      
      if (hasLoaded) {
        
        if (attrs.forceLables)
          graph.showLabels();
        else 
          graph.hideLabels();
        
        graph.draw();
      }
    });
    
    switcher('.radioDegree').on('switch-change', function (e, data) {
      
      $('.radioDegree').bootstrapSwitch('toggleRadioStateAllowUncheck', true);
      
      var id = $(data.el).attr("id");
      var value = data.value;
      var i;
      
      if (id == "degree" && value) {
        
        size.applyDegree(nodes, edges);
        
        graph.updateNodes(nodes, ["size"]);
        graph.draw();
        return;
      }
      
      if (id == "vdegree" && value) {
        
        size.applyDegree2(nodes, edges);
        
        graph.updateNodes(nodes, ["size"]);
        graph.draw();
        return;
      }
      
      size.applyDefaultSize(nodes);
      
      graph.updateNodes(nodes, ["size"]);
      graph.draw();
      
    });
    
    slider("#exposed_period").noUiSlider({
      range: [1, 10],
      start: attrs.exposed_period > 0 ? ( attrs.exposed_period < 10 ? attrs.exposed_period : 10 ) : 1,
      handles: 1,
      serialization: {
        to: [$('#exposed_period_input')]
        ,resolution: 1
      },
      slide: function() {
        
        attrs.exposed_period = $(this).val();
        attrs.save();
      }
    });
    
    slider("#infectious_period").noUiSlider({
      range: [1, 10],
      start: attrs.infectious_period > 0 ? ( attrs.infectious_period < 10 ? attrs.infectious_period : 10 ) : 1,
      handles: 1,
      serialization: {
        to: [$('#infectious_period_input')]
        ,resolution: 1
      },
      slide: function() {
        
        attrs.infectious_period = $(this).val();
        attrs.save();
      }
    });
    
    slider("#visualize_speed").noUiSlider({
      range: [1, 10],
      start: attrs.interval > 0 ? ( attrs.interval < 10 ? attrs.interval : 10 ) : 1,
      handles: 1,
      serialization: {
        to: [$('#visualize_speed_input')]
        ,resolution: 1
      },
      slide: function() {
        
        attrs.interval = $(this).val();
        attrs.save();
      }
    });
    
    slider("#affect_probability").noUiSlider({
      range: [0, 1],
      start: attrs.probability > 0 ? ( attrs.probability < 10 ? attrs.probability : 10 ) : 1,
      handles: 1,
      serialization: {
        to: [$('#affect_probability_input')]
        ,resolution: .001
      },
      slide: function() {
        
        attrs.probability = $(this).val();
        attrs.save();
      }
    });

    $('#affect_probability_input').change(function() {

        attrs.probability = Number($(this).val());
        attrs.save();
    });
    
    var last, current;
    slider("#replay_slider").noUiSlider({
      range: [0, 99],
      start: 0,
      step: 1,
      handles: 1,
      serialization: {
        to: [$('#replay_slider_input')]
        ,resolution: 1
      },
      slide: function() {
        
        if ((current = parseInt($(this).val())) != last) {
          
          graph.replay(current);
          last = current;
        }
      }
    });
    
    $("#video").click(function() {
      
      if (!seir.timer)
        return;
      
      var options = {
        range: [0, 99],
        start: 0,
        step: 1,
        handles: 1,
        serialization: {
          to: [$('#replay_slider_input')]
          ,resolution: 1
        },
        slide: function() {
          
          if ((current = parseInt($(this).val())) != last) {
            
            graph.replay(current);
            last = current;
          }
        }
      };
        
      function updateSlider( slider, newOptions ){
        var settings = $.extend({}, options, newOptions),
            current = slider.val();
        return slider.empty().noUiSlider(settings).val(current, true);
      }
      
      updateSlider(slider("#replay_slider"), {
        range: [0, seir.timer]
      });
    });
    
    $("#svgDownload").click(function(event) {
      
      event.preventDefault();
      
      var link = document.createElement("a");
      link.download = "day_" + current + ".svg";
      link.href = "data:image/svg+xml," + $("#replay").html();


      link.click();
    });

    $("#svgDownload").tooltip({title: "Download Image File"})

    $("#svgDownloadAll").click(function(event) {

      event.preventDefault();

      var link = document.createElement("a");
      var zip = new JSZip();
      var svgList = graph.dump();

      svgList.forEach(function(svg, index) {
        zip.file("day_" + index + ".svg", svg);
      });
      var zipStream = zip.generate();
      link.href = "data:application/zip;base64," + zipStream;
      link.click();
    });

    $("#svgDownloadAll").tooltip({title: "Download Image Zip File"})
  });
  
});