document.addEventListener('DOMContentLoaded', async () => {
    // Initialize students data in localStorage if not present
    if (!localStorage.getItem('students')) {
        localStorage.setItem('students', JSON.stringify([]));
    }
    if (!localStorage.getItem('attendanceData')) {
        localStorage.setItem('attendanceData', JSON.stringify({}));
    }

    let students = JSON.parse(localStorage.getItem('students'));
    let allAttendanceData = JSON.parse(localStorage.getItem('attendanceData'));

    const tableHead = document.querySelector('#attendanceTable thead');
    const tableBody = document.querySelector('#attendanceTable tbody');
    const addStudentBtn = document.getElementById('addStudentBtn');
    const studentNameInput = document.getElementById('studentName');
    const studentDOBInput = document.getElementById('studentDOB');
    const monthSelector = document.getElementById('monthSelector');

    // Populate month selector with last 12 months
    const now = new Date();
    for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const option = document.createElement('option');
        option.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        option.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        monthSelector.appendChild(option);
    }
    monthSelector.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Render attendance table like Google Sheets
    function renderAttendance() {
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        // Use selected month from monthSelector
        const selectedMonth = monthSelector.value;
        const [year, monthStr] = selectedMonth.split('-');
        const month = parseInt(monthStr, 10) - 1;
        const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Month header row
        const monthRow = document.createElement('tr');
        monthRow.innerHTML = `<th colspan="${daysInMonth + 2}" style="text-align: center; font-size: 1.5em;">${monthName} ${year}</th>`;
        tableHead.appendChild(monthRow);

        // Header row
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>S.No</th><th>Student</th>';
        for (let day = 1; day <= daysInMonth; day++) {
            headerRow.innerHTML += `<th>${day}</th>`;
        }
        tableHead.appendChild(headerRow);

        // Body rows for each student
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${index + 1}</td><td>${student.name}</td>`;
            const data = allAttendanceData[student.name] || [];
            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = new Date(year, month, day).toISOString().split('T')[0];
                const record = data.find(d => d.date === dateStr);
                const status = record ? record.status : (day % 7 === 0 ? 'Leave' : 'Absent');
                const dayOfWeek = new Date(year, month, day).getDay();
                const isSunday = dayOfWeek === 0;
                const classes = `status-selector ${status.toLowerCase()} ${isSunday ? 'sunday' : ''}`.trim();
                row.innerHTML += `
                    <td>
                        <select class="${classes}" data-student="${student.name}" data-date="${dateStr}">
                            <option value="Present" ${status === 'Present' ? 'selected' : ''}>P</option>
                            <option value="Absent" ${status === 'Absent' ? 'selected' : ''}>A</option>
                            <option value="Leave" ${status === 'Leave' ? 'selected' : ''}>L</option>
                        </select>
                    </td>
                `;
            }
            tableBody.appendChild(row);
        });

        // Update summary cards
        document.getElementById('totalStudents').textContent = students.length;

        // Calculate average attendance percentage
        let totalDays = 0;
        let totalPresent = 0;
        students.forEach(student => {
            const data = allAttendanceData[student.name] || [];
            data.forEach(record => {
                if (record.status === 'Present') totalPresent++;
                totalDays++;
            });
        });
        const averageAttendance = totalDays > 0 ? ((totalPresent / totalDays) * 100).toFixed(2) : '0.00';
        document.getElementById('averageAttendance').textContent = `${averageAttendance}%`;

        // Check if month has ended and show monthly report
        const now = new Date();
        const lastDayOfMonth = new Date(year, month + 1, 0);
        if (now > lastDayOfMonth) {
            const reportBody = document.querySelector('#reportTable tbody');
            reportBody.innerHTML = '';
            students.forEach(student => {
                const data = allAttendanceData[student.name] || [];
                let totalWorkingDays = 0;
                let presentDays = 0;
                for (let day = 1; day <= daysInMonth; day++) {
                    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
                    const record = data.find(d => d.date === dateStr);
                    const dayOfWeek = new Date(year, month, day).getDay();
                    const status = record ? record.status : (dayOfWeek === 0 ? 'Leave' : 'Absent');
                    if (status !== 'Leave') {
                        totalWorkingDays++;
                        if (status === 'Present') presentDays++;
                    }
                }
                const percentage = totalWorkingDays > 0 ? ((presentDays / totalWorkingDays) * 100).toFixed(2) : '0.00';
                const row = document.createElement('tr');
                row.innerHTML = `<td>${student.name}</td><td>${totalWorkingDays}</td><td>${presentDays}</td><td>${percentage}%</td>`;
                reportBody.appendChild(row);
            });
            document.getElementById('monthlyReport').style.display = 'block';
        } else {
            document.getElementById('monthlyReport').style.display = 'none';
        }
    }

    renderAttendance();

    // Add student button click handler
    addStudentBtn.addEventListener('click', () => {
        const name = studentNameInput.value.trim();
        const dob = studentDOBInput.value;
        if (!name || !dob) {
            alert('Please enter both name and date of birth.');
            return;
        }
        if (students.length >= 100) {
            alert('Maximum 100 students allowed.');
            return;
        }
        if (students.some(s => s.name.toLowerCase() === name.toLowerCase())) {
            alert('Student with this name already exists.');
            return;
        }
        students.push({ name, dob });
        students.sort((a, b) => a.name.localeCompare(b.name));
        localStorage.setItem('students', JSON.stringify(students));

        // Initialize attendance for the selected month as Absent
        const [year, monthStr] = monthSelector.value.split('-');
        const month = parseInt(monthStr, 10) - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const records = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = new Date(year, month, day).toISOString().split('T')[0];
            records.push({ date: dateStr, status: day % 7 === 0 ? 'Leave' : 'Absent' });
        }
        allAttendanceData[name] = records;
        localStorage.setItem('attendanceData', JSON.stringify(allAttendanceData));

        studentNameInput.value = '';
        studentDOBInput.value = '';
        renderAttendance();
        alert('Student added successfully.');
    });

    // Update attendance status on change
    tableBody.addEventListener('change', (e) => {
        if (e.target.classList.contains('status-selector')) {
            const studentName = e.target.dataset.student;
            const date = e.target.dataset.date;
            const newStatus = e.target.value;
            const records = allAttendanceData[studentName] || [];
            const record = records.find(r => r.date === date);
            if (record) {
                record.status = newStatus;
            } else {
                records.push({ date, status: newStatus });
            }
            allAttendanceData[studentName] = records;
            localStorage.setItem('attendanceData', JSON.stringify(allAttendanceData));

            // Update the class for color change
            e.target.classList.remove('present', 'absent', 'leave');
            e.target.classList.add(newStatus.toLowerCase());
        }
    });

    // Re-render attendance when month changes
    monthSelector.addEventListener('change', () => {
        renderAttendance();
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
