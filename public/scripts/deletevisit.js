function deleteVisit(museumid, visitorid, visitdate) {
    var confirmDelete = confirm("Do you want to delete this Visit?");
    if (confirmDelete) {
        $.ajax({
            url: '/delete_visit/museumID=' + museumid + '&visitorID=' + visitorid + '&visitDate=' + visitdate,
            type: 'DELETE',
            success: function (result) {
                window.location.reload(true);
            }
        });
    }
};