document.addEventListener('DOMContentLoaded', async () => {
    // Get logged in student name from localStorage
    const loggedInStudent = localStorage.getItem('loggedInStudent');
    if (!loggedInStudent) {
        // Redirect to login if no student logged in
        window.location.href = 'index.html';
        return;
    }

    // Initialize data in localStorage if not present (same as teacher.js)
    if (!localStorage.getItem('attendanceData')) {
        const initialData = {
            'Jane Doe': [
                { date: '2023-10-26', subject: 'Math', status: 'Present' },
                { date: '2023-10-25', subject: 'Science', status: 'Absent' },
                { date: '2023-10-24', subject: 'Math', status: 'Present' },
                { date: '2023-10-23', subject: 'English', status: 'Leave' },
                { date: '2023-10-22', subject: 'Math', status: 'Present' }
            ],
            'John Smith': [
                { date: '2023-10-26', subject: 'Math', status: 'Absent' },
                { date: '2023-10-25', subject: 'English', status: 'Present' }
            ]
        };
        localStorage.setItem('attendanceData', JSON.stringify(initialData));
    }

    const allAttendanceData = JSON.parse(localStorage.getItem('attendanceData'));
    const studentData = {
        name: loggedInStudent,
        attendance: allAttendanceData[loggedInStudent] || []
    };

    let presentCount = 0;
    let absentCount = 0;
    let totalCount = studentData.attendance.length;

    const tableBody = document.querySelector('#attendanceTable tbody');
    
    studentData.attendance.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td class="${record.status.toLowerCase()}-status">${record.status}</td>
        `;
        tableBody.appendChild(row);

        if (record.status === 'Present') presentCount++;
        if (record.status === 'Absent') absentCount++;
    });

    const percentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(2) : 0;
    document.getElementById('presentCount').textContent = presentCount;
    document.getElementById('absentCount').textContent = absentCount;
    document.getElementById('totalPercentage').textContent = `${percentage}%`;

    document.getElementById('logoutBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
