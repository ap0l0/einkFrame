$(document).ready(function() {

    //Reloading Images
    $("#reload-images").click(function(){
        $(document.body).css({'cursor' : 'wait'});
        $.ajax({
            type: "GET",
            url: '/api/reload-images',
           // data: "check",
            success: function(data){
                setTimeout(function(){
                     $(document.body).css({'cursor' : 'default'});
                     alert('Images Reloaded'); 
                     location.reload();
                     
                    }, 3000);
                
            }
        });
    }); 
    
  
    //Delete Image
    $(".delete-image").click(function(){
        var image_id = $(this).attr('id'); 
        var image_id = image_id.slice(3);
        $(document.body).css({'cursor' : 'wait'});
        $.ajax({
            type: "GET",
            url: '/api/delete-image/' + image_id,
           // data: "check",
            success: function(data){
                setTimeout(function(){
                     $(document.body).css({'cursor' : 'default'});
                     alert(data); 
                     location.reload();
                    }, 300);
                
            }
        });
    }); 

});