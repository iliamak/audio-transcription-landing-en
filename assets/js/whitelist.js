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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Send email using EmailJS
  async function sendEmail(email) {
    try {
      // Current date and time for the templates
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString();
      const formattedTime = currentDate.toLocaleTimeString();
      
      // Get the registration count (15 - available spots)
      const registrationCount = 15 - spotsAvailable;
      
      // Send notification to admin
      const adminResponse = await emailjs.send(
        "service_btmfez1", // Service ID
        "template_63fn6z6", // Template ID
        {
          email: email,
          system_date: formattedDate,
          system_time: formattedTime,
          registration_count: registrationCount + 1, // Adding this registration
          message_type: "admin_notification" // Flag to differentiate message types in the template
        }
      );
      
      // Send confirmation to user
      const userResponse = await emailjs.send(
        "service_btmfez1", // Service ID
        "template_63fn6z6", // Template ID
        {
          to_email: email,
          system_date: formattedDate,
          message_type: "user_confirmation" // Flag to differentiate message types in the template
        }
      );
      
      // Check if both emails were sent successfully
      return adminResponse.status === 200 && userResponse.status === 200;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
  
  // Handle form submission
  if(whitelistForm) {
    whitelistForm.addEventListener('submit', async function(e) {
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
      
      // Disable submit button and show loading state
      const submitButton = whitelistForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
      
      // Send email
      const emailSent = await sendEmail(email);
      
      if (emailSent) {
        // Decrease available spots
        spotsAvailable--;
        updateCounter();
        
        // Show success message
        formContainer.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Clear form
        whitelistForm.reset();
      } else {
        // Show error message
        errorMessage.textContent = 'Failed to send email. Please try again later.';
        errorMessage.style.display = 'block';
        
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }
  
  // Initialize page
  updateCounter();
  checkRegistrationPeriod();
});