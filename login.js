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
        localStorage.setItem('loggedInStudent', username);
        window.location.href = 'studentdashboard.html';
    } else if (username === 'teacher' && password === '123' && userType === 'teacher') {
        window.location.href = 'teacherdashboard.html';
    } else {
        document.getElementById('message').textContent = 'Invalid credentials.';
    }
});     
/*document.getElementById('loginForm').addEventListener('submit', function(event) {
    // Form submission ko rokne ke liye
    event.preventDefault(); 

    // Input fields se values nikalna
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    // Login logic
    if (username === 'admin' && password === 'admin123') {
        // Sahi credentials hone par
        messageDiv.textContent = 'Login successful!';
        messageDiv.style.color = 'green';
        
        // Yahaan aap user ko naye page par redirect kar sakte hain
        // window.location.href = "dashboard.html"; 
    } else {
        // Galat credentials hone par
        messageDiv.textContent = 'Invalid username or password.';
        messageDiv.style.color = 'red';
    }
}); */