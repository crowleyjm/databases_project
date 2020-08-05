function updateVisit(museumID) {
    var confirmUpdate = confirm("Do you want to update this Visit?");
    if(confirmUpdate){
        $.ajax({
            url: '/view_visits/'+ museumID,
            type: 'PUT',
            data: $('#update_visit').serialize(),
            success: function(result){
                window.location.replace("./");
                console.log("success");
            }
        });
    }
};