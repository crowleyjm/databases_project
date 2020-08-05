function deleteTour(tourID){
    var confirmDelete = confirm("Do you want to delete this Tour?");
    if(confirmDelete){
        $.ajax({
            url: '/delete_tour/'+ tourID,
            type: 'DELETE',
            success: function(result){
                window.location.reload(true);
            }
        });
    }
};