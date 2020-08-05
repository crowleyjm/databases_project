function deleteVisit(id){
    var confirmDelete = confirm("Do you want to delete this Visit?");
    if(confirmDelete){
        $.ajax({
            url: '/delete_visit/'+ id,
            type: 'DELETE',
            success: function(result){
                window.location.reload(true);
            }
        });
    }
};