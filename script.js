document.getElementById('generateBtn').addEventListener('click', generateQR);

function generateQR() {
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
  
  // Get the base URL that works both locally and on GitHub Pages
  let baseUrl = window.location.href;
  // Remove index.html or any file name from the end
  baseUrl = baseUrl.split('/').slice(0, -1).join('/') + '/';
  const link = `${baseUrl}view.html?data=${encoded}`;

  // Clear previous QR code
  const qrcodeElement = document.getElementById('qrcode');
  qrcodeElement.innerHTML = '';
  
  try {
    // Create new QR code with error handling
    new QRCode(qrcodeElement, {
      text: link,
      width: 200,
      height: 200,
      correctLevel: QRCode.CorrectLevel.H
    });

    // Wait a bit for QR to render
    setTimeout(() => {
      const img = document.querySelector('#qrcode img');
      if (img) {
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = img.src;
        downloadLink.style.display = 'inline-flex';
      } else {
        console.error('QR code image not generated');
      }
    }, 100);
  } catch (error) {
    console.error('Error generating QR code:', error);
    qrcodeElement.innerHTML = '<p style="color: red;">Error generating QR code. Please try again.</p>';
  }
}
