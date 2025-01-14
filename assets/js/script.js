// JavaScript to support SVG handling and image conversion
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('imageInput');
const imageNameInput = document.getElementById('imageName');
let currentResizeFactor = 1.0;
let originalFileName = '';
let activePopup = null;

function showTemporaryMessage(message, duration = 2000) {
    if (activePopup) {
        clearTimeout(activePopup.timeoutId);
        document.body.removeChild(activePopup.alertDiv);
        activePopup = null;
    }

    const alertDiv = document.createElement('div');
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.bottom = '20px';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translateX(-50%)';
    alertDiv.style.backgroundColor = '#28a745';
    alertDiv.style.color = 'white';
    alertDiv.style.padding = '10px 20px';
    alertDiv.style.borderRadius = '5px';
    alertDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    alertDiv.style.zIndex = '1000';
    document.body.appendChild(alertDiv);

    const timeoutId = setTimeout(() => {
        document.body.removeChild(alertDiv);
        activePopup = null;
    }, duration);

    activePopup = { alertDiv, timeoutId };
}

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.backgroundColor = '#e9ecef';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.backgroundColor = '';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.backgroundColor = '';
    fileInput.files = e.dataTransfer.files;
    if (fileInput.files.length) {
        originalFileName = fileInput.files[0].name;
        imageNameInput.value = originalFileName.split('.').slice(0, -1).join('.');
        showTemporaryMessage('File upload completed successfully!');
    } else {
        showTemporaryMessage('No file uploaded. Please try again.', 3000);
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
        originalFileName = fileInput.files[0].name;
        imageNameInput.value = originalFileName.split('.').slice(0, -1).join('.');
        showTemporaryMessage('File upload completed successfully!');
    } else {
        showTemporaryMessage('No file selected. Please try again.', 3000);
    }
});

function resizeImage(change) {
    currentResizeFactor = Math.max(0.1, currentResizeFactor + change);
    document.getElementById('resizeFactor').textContent = `${Math.round(currentResizeFactor * 100)}%`;
}

function showNameChange() {
    const newName = imageNameInput.value.trim();
    if (!originalFileName) {
        alert('No image selected!');
        return;
    }
    if (!newName) {
        alert('Please enter a new name for the image.');
        return;
    }
    alert(`Image name will change from '${originalFileName.split('.').slice(0, -1).join('.')}' to '${newName}'`);
}

function convertImage() {
    function showThankYouMessage() {
        showTemporaryMessage('Thank you for using the Image Converter! - Developer Gowtham', 3000);
    }
    const formatSelect = document.getElementById('formatSelect');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    if (!fileInput.files.length) {
        alert('Please upload an image file!');
        return;
    }

    const file = fileInput.files[0];
    const newName = imageNameInput.value.trim();

    if (!newName) {
        alert('Please provide a valid name for the image.');
        return;
    }

    const format = formatSelect.value;

    if (file.type === 'image/svg+xml' && format === 'svg') {
        const reader = new FileReader();
        reader.onload = () => {
            const link = document.createElement('a');
            link.href = reader.result;
            link.download = `${newName}.svg`;
            link.click();
            showTemporaryMessage(`SVG file renamed to '${newName}.svg' and downloaded successfully!`);
        };
        reader.readAsDataURL(file);
        return;
    }

    const img = new Image();

    img.onload = () => {
        canvas.width = img.width * currentResizeFactor;
        canvas.height = img.height * currentResizeFactor;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const dataURL = canvas.toDataURL(`image/${format}`);
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `${newName}.${format}`;
        link.click();

        showTemporaryMessage(`Image name changed from '${originalFileName}' to '${newName}.${format}' and downloaded successfully!`);
        showThankYouMessage();
    };

    img.src = URL.createObjectURL(file);
}

// Initialize emailjs
(function () {
    emailjs.init("hdueE7bUifAPG9EJh"); // Replace with your Public Key
})();

// Example to programmatically show the popup
const successPopup = document.getElementById('successPopup');
const myModal = successPopup ? new bootstrap.Modal(successPopup) : null;

// Function to send email
function sendEmail(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Template parameters for emailjs
    const templateParams = {
        to_name: "gowtham", // Recipient name
        from_name: name, // Sender name
        from_email: email, // Sender email
        message: message, // Message content
        reply_to: email // Reply-to email address
    };

    // Send email using emailjs
    emailjs.send("service_hiqcowq", "template_b0yggtu", templateParams)
        .then(() => {
            // Show success popup or alert
            if (myModal) {
                myModal.show();
            } else {
                alert("Email Sent Successfully!");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Failed to send the email. Check the console for details.");
        });

    // Reset the form
    document.getElementById("contactForm").reset();
}
