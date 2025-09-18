document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;

    // In a real app, send this data to a backend API
    // and receive a token or session status.
    // Example: fetch('/api/login', { method: 'POST', body: JSON.stringify({username, password, userType}) })
    
    // For this example, we'll use a simple check
    if (username === 'student' && password === '123' && userType === 'student') {
        localStorage.setItem('loggedInStudent', 'student');
        window.location.href = 'studentdashboard.html';
    } else if (username === 'teacher' && password === '123' && userType === 'teacher') {
        window.location.href = 'teacherdashboard.html';
    } else {
        document.getElementById('message').textContent = 'Invalid credentials.';
    }
});     
