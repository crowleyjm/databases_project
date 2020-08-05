function updateTour(tourID) {
    var confirmUpdate = confirm("Do you want to update this tour?");
    if(confirmUpdate){
        $.ajax({
            url: '/view_tours/'+ tourID,
            type: 'PUT',
            data: $('#update_tour').serialize(),
            success: function(result){
                window.location.replace("./");
                console.log("success");
            }
        });
    }
};