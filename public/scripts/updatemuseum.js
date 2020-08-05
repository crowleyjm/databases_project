function updateMuseum(museumID) {
    var confirmUpdate = confirm("Do you want to update this Museum?");
    if(confirmUpdate){
        $.ajax({
            url: '/view_museums/'+ museumID,
            type: 'PUT',
            data: $('#update_museum').serialize(),
            success: function(result){
                window.location.replace("./");
                console.log("success");
            }
        });
    }
};