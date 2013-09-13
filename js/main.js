$(document).ready(function() {
  
  //generateTestCase();
  
  $('input[type=file]').bootstrapFileInput();
  
  document.getElementById('file').addEventListener('change', fileSelection, false);
});

