function deleteMedia(mediaID){
    var confirmDelete = confirm("Do you want to delete this Media?");
    if(confirmDelete){
        $.ajax({
            url: '/delete_media/'+ mediaID,
            type: 'DELETE',
            success: function(result){
                window.location.reload(true);
            }
        });
    }
};