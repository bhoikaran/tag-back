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
  const link = `${window.location.origin}${window.location.pathname.replace("index.html","")}view.html?data=${encoded}`;

  document.getElementById('qrcode').innerHTML = '';
  new QRCode(document.getElementById('qrcode'), {
    text: link,
    width: 200,
    height: 200
  });

  // Wait a bit for QR to render
  setTimeout(() => {
    const img = document.querySelector('#qrcode img');
    if (img) {
      const downloadLink = document.getElementById('downloadLink');
      downloadLink.href = img.src;
      downloadLink.style.display = 'block';
      downloadLink.textContent = 'Download QR Code';
    }
  }, 500);
}
