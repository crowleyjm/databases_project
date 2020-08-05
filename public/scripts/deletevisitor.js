function deleteVisitor(visitorID){
    var confirmDelete = confirm("Do you want to delete this Visitor?");
    if(confirmDelete){
        $.ajax({
            url: '/delete_visitor/'+ visitorID,
            type: 'DELETE',
            success: function(result){
                window.location.reload(true);
            }
        });
    }
};