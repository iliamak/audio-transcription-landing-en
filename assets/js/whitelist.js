document.addEventListener('DOMContentLoaded', function() {
  const whitelistForm = document.getElementById('whitelist-form');
  const emailInput = document.getElementById('email');
  const spotsCounter = document.getElementById('spots-counter');
  const formContainer = document.getElementById('form-container');
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  const fullMessage = document.getElementById('full-message');
  const closedMessage = document.getElementById('closed-message');
  
  // Initial spots available (max 15)
  let spotsAvailable = 15;
  
  // Check local storage for spots count
  if(localStorage.getItem('spotsAvailable')) {
    spotsAvailable = parseInt(localStorage.getItem('spotsAvailable'));
  }
  
  // Update counter display
  function updateCounter() {
    spotsCounter.textContent = spotsAvailable;
    localStorage.setItem('spotsAvailable', spotsAvailable);
    
    // If no spots left, show full message
    if(spotsAvailable <= 0) {
      formContainer.style.display = 'none';
      fullMessage.style.display = 'block';
    }
  }
  
  // Check if registration period is over (4 days from launch)
  function checkRegistrationPeriod() {
    // Get launch date from localStorage or set it if not exists
    let launchDate = localStorage.getItem('launchDate');
    if(!launchDate) {
      launchDate = new Date().toISOString();
      localStorage.setItem('launchDate', launchDate);
    }
    
    const launchTime = new Date(launchDate).getTime();
    const currentTime = new Date().getTime();
    const fourDaysInMs = 4 * 24 * 60 * 60 * 1000;
    
    if(currentTime - launchTime > fourDaysInMs) {
      formContainer.style.display = 'none';
      fullMessage.style.display = 'none';
      closedMessage.style.display = 'block';
      return true;
    }
    
    return false;
  }
  
  // Email validation function
  function isValidEmail(email) {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Handle form submission
  if(whitelistForm) {
    whitelistForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Hide any previous messages
      successMessage.style.display = 'none';
      errorMessage.style.display = 'none';
      
      // Check if registration is closed
      if(checkRegistrationPeriod()) {
        return;
      }
      
      // Check if spots are available
      if(spotsAvailable <= 0) {
        return;
      }
      
      // Validate email
      const email = emailInput.value.trim();
      if(!isValidEmail(email)) {
        errorMessage.textContent = 'Please enter a valid email address.';
        errorMessage.style.display = 'block';
        return;
      }
      
      // Here you would typically send the data to your backend
      // For demo purposes, we'll just simulate a successful submission
      
      // Simulate API call with timeout
      setTimeout(() => {
        // Decrease available spots
        spotsAvailable--;
        updateCounter();
        
        // Show success message
        formContainer.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Clear form
        whitelistForm.reset();
        
        // In a real implementation, you would send an email notification here
        console.log('Simulated email sent to user:', email);
        console.log('Simulated email sent to owner: New whitelist registration:', email);
      }, 1000);
    });
  }
  
  // Initialize page
  updateCounter();
  checkRegistrationPeriod();
});