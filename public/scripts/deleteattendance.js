function deleteAttendance(id){
    var confirmDelete = confirm("Do you want to delete this Attendance?");
    if(confirmDelete){
        $.ajax({
            url: '/attendances/'+ id,
            type: 'DELETE',
            success: function(result){
                window.location.reload(true);
            }
        });
    }
};