document.getElementById('generateBtn').addEventListener('click', generateQR);

function getBaseUrl() {
  // Get the repository name from the path
  const pathSegments = window.location.pathname.split('/');
  const repoName = pathSegments[pathSegments.length - 2] || 'tag-back';
  
  // Check if we're on GitHub Pages
  if (window.location.hostname.includes('github.io')) {
    return `https://${window.location.hostname}/${repoName}/`;
  }
  
  // Local development
  return window.location.href.split('index.html')[0];
}

function generateQR() {
  // Check if QRCode is available
  if (typeof QRCode === 'undefined') {
    document.getElementById('qrcode').innerHTML = '<p style="color: red;">Error: QR Code library not loaded. Please refresh the page.</p>';
    return;
  }

  const owner = document.getElementById('owner').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const item = document.getElementById('item').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!owner || !contact || !item) {
    alert("Please fill all required fields!");
    return;
  }

  const data = { owner, contact, item, message };
  const encoded = btoa(JSON.stringify(data));
  
  // Get the correct base URL
  const baseUrl = getBaseUrl();
  const link = `${baseUrl}view.html?data=${encoded}`;

  // Clear previous QR code
  const qrcodeElement = document.getElementById('qrcode');
  qrcodeElement.innerHTML = '';
  
  try {
    console.log('Generating QR code for URL:', link); // Debug log
    
    // Create new QR code with error handling
    const qr = new QRCode(qrcodeElement, {
      text: link,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
      quietZone: 15
    });

    // Setup download link
    const setupDownloadLink = () => {
      const img = qrcodeElement.querySelector('img');
      if (img) {
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = img.src;
        downloadLink.style.display = 'inline-flex';
      } else {
        console.error('QR code image element not found');
        throw new Error('QR code image not generated');
      }
    };

    // Try multiple times to set up download link
    let attempts = 0;
    const maxAttempts = 5;
    const checkInterval = setInterval(() => {
      try {
        setupDownloadLink();
        clearInterval(checkInterval);
      } catch (err) {
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.error('Failed to set up download link after multiple attempts');
          qrcodeElement.innerHTML = '<p style="color: red;">Error: Failed to generate QR code. Please try again.</p>';
        }
      }
    }, 100);

  } catch (error) {
    console.error('Error generating QR code:', error);
    qrcodeElement.innerHTML = '<p style="color: red;">Error generating QR code. Please try again.</p>';
  }
}
