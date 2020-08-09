function deleteAttendance(tourid, visitorid) {
    var confirmDelete = confirm("Do you want to delete this Attendance?");
    if (confirmDelete) {
        $.ajax({
            url: '/delete_attendance/tourID=' + tourid + '&visitorID=' + visitorid,
            type: 'DELETE',
            success: function (result) {
                window.location.reload(true);
            }
        });
    }
};