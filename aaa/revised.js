
    
   var fs = require('fs');
    
   var args = process.argv.splice(2);
   var fileDirectory = args[0] || './IMG/commodity';
    
   if (fs.existsSync(fileDirectory)) {
       var files = fs.readdirSync(fileDirectory);
    	var num = 2
       files.forEach(function(file) {
           var filePath = fileDirectory + "/" + file;
           
           if (/\.png$/.test(file)) {
           	
               var fileName = num + ".png";
               num++
  

    
               var newFilePath = fileDirectory + "/" + fileName;
    
               fs.rename(filePath, newFilePath, function(err) {
                   if (err) throw err;
    
                   console.log(fileName + ' ok~');
               });
           }
       });
    
   } else {
       console.log(fileDirectory + "  Not Found!");
   }