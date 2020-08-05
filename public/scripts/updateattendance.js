function updateAttendance(tourID) {
    var confirmUpdate = confirm("Do you want to update this Attendance?");
    if(confirmUpdate){
        $.ajax({
            url: '/view_attendances/'+ tourID,
            type: 'PUT',
            data: $('#update_attendance').serialize(),
            success: function(result){
                window.location.replace("./");
                console.log("success");
            }
        });
    }
};