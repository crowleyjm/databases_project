function updateMedia(mediaID) {
    var confirmUpdate = confirm("Do you want to update this Media?");
    if(confirmUpdate){
        $.ajax({
            url: '/view_media/'+ mediaID,
            type: 'PUT',
            data: $('#update_media').serialize(),
            success: function(result){
                window.location.replace("./");
                console.log("success");
            }
        });
    }
};