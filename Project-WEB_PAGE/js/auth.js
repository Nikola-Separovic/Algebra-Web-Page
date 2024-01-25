
document.addEventListener('DOMContentLoaded', function () {
  const loginLink = document.getElementById('loginLink');
  const logoutLink = document.getElementById('logoutLink');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const curriculumLink = document.getElementById('curriculumLink');
  const loginModal = $('#loginModal'); // jQuery object for login modal
  const registerModal = $('#registerModal'); // jQuery object for register modal
  
  // Check if the user is already logged in
  updateUIBasedOnLoginStatus();
  
  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!validateEmail(username)) {
      alert('Please enter a valid Gmail address.');
      return;
    }    
    
    try {
      const response = await fetch('https://www.fulek.com/data/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });    
      
      if (response.ok) {
        const data = await response.json();// Inserted 2 lines for JWT token to be stored
        localStorage.setItem('isLoggedIn', 'true'); 
        localStorage.setItem('jwtToken', data.token); // Storing the JWT token
        updateUIBasedOnLoginStatus();
        loginModal.modal('hide');
      } else {  
        alert('Login failed. Please check your credentials.');
      }    
    } catch (error) {  
      alert('An error occurred during login. Please try again.');
    }    
  });    
  
  registerForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!validateEmail(username)) {
      alert('Please enter a valid Gmail address.');
      return;
    }    
    
    try {
      const response = await fetch('https://www.fulek.com/data/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });    
      
      if (response.ok) {
        alert('Registration successful. You can now log in.');
        registerModal.modal('hide');
        loginModal.modal('show');
      } else {  
        alert('Registration failed. Please try again.');
      }    
    } catch (error) {  
      alert('An error occurred during registration. Please try again.');
    }    
  });    
  
  function removeBackdropAndScrollLock() {
    $('.modal-backdrop').remove(); // Remove modal backdrop
    $('body').removeClass('modal-open'); // Remove the 'modal-open' class from body
    $('body').css('overflow', ''); // Reset the overflow property of body
  }     
  if (logoutLink) {
    logoutLink.addEventListener('click', function (event) {
      event.preventDefault();
      localStorage.removeItem('isLoggedIn');
      updateUIBasedOnLoginStatus();
      alert('You have been logged out.');
    });    
  }    
  loginModal.on('hidden.bs.modal', function () {
    removeBackdropAndScrollLock();
});

registerModal.on('hidden.bs.modal', function () {
    removeBackdropAndScrollLock();
});
  
      function validateEmail(email) {
        return email.includes('@') && email.includes('.');
      }
      function updateUIBasedOnLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        curriculumLink.style.display = isLoggedIn ? 'block' : 'none';
    
        if (isLoggedIn) {
            loginLink.style.display = 'none';
            logoutLink.style.display = 'block';
        } else {
            loginLink.style.display = 'block';
            logoutLink.style.display = 'none';
        }
      }
      
    });
