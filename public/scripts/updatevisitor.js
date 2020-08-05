function updateVisitor(VisitorID) {
    var confirmUpdate = confirm("Do you want to update this Visitor?");
    if(confirmUpdate){
        $.ajax({
            url: '/view_visitors/'+ VisitorID,
            type: 'PUT',
            data: $('#update_visitor').serialize(),
            success: function(result){
                window.location.replace("./");
                console.log("success");
            }
        });
    }
};