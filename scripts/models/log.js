define([


], function() {

  var log = {
    
    logs: [],
    
    write: function(msg) {

      this.logs.push(msg);
    },
    
    print: function() {
     
     console.log(JSON.stringify(this.logs)); 
    },
    
    download: function() {
      
      var stream = this.logs.join("\r\n");

      console.log(JSON.stringify(stream));
      return stream;
    }
  };

  return log;
});

