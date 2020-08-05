function deleteMuseum(museumID){
    var confirmDelete = confirm("Do you want to delete this Museum?");
    if(confirmDelete){
        $.ajax({
            url: '/delete_museum/'+ museumID,
            type: 'DELETE',
            success: function(result){
                window.location.reload(true);
            }
        });
    }
};