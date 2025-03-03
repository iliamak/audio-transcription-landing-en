<?php
// Prevent direct access to this file if not coming from form submission
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    exit("Direct access not permitted");
}

// Get form data
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Your email settings
$to = "your-email@example.com"; // Change this to your email address
$subject = "New Whitelist Registration";
$message = "New user has joined the whitelist: " . $email;
$headers = "From: noreply@audiotext.example.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Auto-reply message to user
$userSubject = "Welcome to AudioText Early Access";
$userMessage = "Hello,\n\n";
$userMessage .= "Thank you for joining the AudioText early access whitelist! We're excited to have you on board.\n\n";
$userMessage .= "We'll keep you updated about our launch and you'll be among the first to try our affordable audio transcription service.\n\n";
$userMessage .= "Best regards,\nThe AudioText Team";
$userHeaders = "From: AudioText <noreply@audiotext.example.com>\r\n";
$userHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Try to send email to admin
$adminMailSuccess = mail($to, $subject, $message, $headers);

// Try to send confirmation email to user
$userMailSuccess = mail($email, $userSubject, $userMessage, $userHeaders);

// Return JSON response
if ($adminMailSuccess && $userMailSuccess) {
    echo json_encode(['success' => true]);
} else {
    // For security, don't specify which mail failed
    echo json_encode(['success' => false, 'message' => 'Failed to send email. Please try again later.']);
}
