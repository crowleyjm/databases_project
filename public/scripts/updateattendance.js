function updateAttendance(tourID, visitorID) {
    var confirmUpdate = confirm("Do you want to update this Attendance?");
    if (confirmUpdate) {
        $.ajax({
            url: '/view_attendances/tourId=' + tourID + '&visitorID=' + visitorID,
            type: 'PUT',
            data: $('#update_attendance').serialize(),
            success: function (result) {
                window.location.replace("./");
                console.log("success");
            }
        });
    }
};