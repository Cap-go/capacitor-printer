import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { Capacitor } from '@capacitor/core';
import { Printer } from '@capgo/capacitor-printer';

// Show status message
function showStatus(message, isError = false) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = isError ? 'error' : 'success';
  status.style.display = 'block';
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}

// Print HTML content
window.printHtml = async function() {
  try {
    const html = document.getElementById('htmlContent').value;
    await Printer.printHtml({
      name: 'HTML Document',
      html: html
    });
    showStatus('Print dialog opened successfully!');
  } catch (error) {
    console.error('Error printing HTML:', error);
    showStatus('Error: ' + error.message, true);
  }
};

// Print current web view
window.printWebView = async function() {
  try {
    await Printer.printWebView({
      name: 'Web Page'
    });
    showStatus('Print dialog opened successfully!');
  } catch (error) {
    console.error('Error printing web view:', error);
    showStatus('Error: ' + error.message, true);
  }
};

// Print base64 image (small red square)
window.printBase64Image = async function() {
  try {
    // A small red square PNG (100x100)
    const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

    await Printer.printBase64({
      name: 'Test Image',
      data: base64Image,
      mimeType: 'image/png'
    });
    showStatus('Print dialog opened successfully!');
  } catch (error) {
    console.error('Error printing base64 image:', error);
    showStatus('Error: ' + error.message, true);
  }
};

// Print base64 PDF (minimal PDF)
window.printBase64Pdf = async function() {
  try {
    // Minimal PDF with "Hello World"
    const base64Pdf = 'JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL1Jlc291cmNlczw8L0ZvbnQ8PC9GMSA1IDAgUj4+Pj4vTWVkaWFCb3hbMCAwIDYxMiA3OTJdL0NvbnRlbnRzIDQgMCBSPj4KZW5kb2JqCjQgMCBvYmoKPDwvTGVuZ3RoIDQ0Pj4Kc3RyZWFtCkJUCi9GMSA0OCBUZgoxMCAxMCBUZAooSGVsbG8gV29ybGQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKNiAwIG9iago8PC9Qcm9kdWNlcihQREYuanMgdjIuMC4xMDYpL0NyZWF0aW9uRGF0ZShEOjIwMjMwMTAxMTIwMDAwWik+PgplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMzM2IDAwMDAwIG4gCjAwMDAwMDAyODcgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMTI0IDAwMDAwIG4gCjAwMDAwMDAyMTYgMDAwMDAgbiAKMDAwMDAwMDM4NSAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNy9Sb290IDEgMCBSL0luZm8gNiAwIFI+PgpzdGFydHhyZWYKNDY5CiUlRU9GCg==';

    await Printer.printBase64({
      name: 'Test PDF',
      data: base64Pdf,
      mimeType: 'application/pdf'
    });
    showStatus('Print dialog opened successfully!');
  } catch (error) {
    console.error('Error printing base64 PDF:', error);
    showStatus('Error: ' + error.message, true);
  }
};

console.log('Capacitor Printer Example App Ready!');

if (Capacitor.isNativePlatform()) {
  CapacitorUpdater.notifyAppReady().catch((error) => {
    console.error('Capgo notifyAppReady failed', error);
  });
}
