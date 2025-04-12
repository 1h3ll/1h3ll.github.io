function login() {
  const password = document.getElementById('password').value;
  const storedHash = localStorage.getItem('passwordHash');
  const notesDiv = document.getElementById('notes');
  const loginDiv = document.getElementById('login');

  // First-time setup: Save password hash
  if (!storedHash) {
    const hash = CryptoJS.SHA256(password).toString();
    localStorage.setItem('passwordHash', hash);
    notesDiv.style.display = 'block';
    loginDiv.style.display = 'none';
    return;
  }

  // Existing user: Validate password
  const inputHash = CryptoJS.SHA256(password).toString();
  if (inputHash === storedHash) {
    // Decrypt notes (if they exist)
    const encryptedNotes = localStorage.getItem('encryptedNotes');
    if (encryptedNotes) {
      try {
        const decrypted = CryptoJS.AES.decrypt(encryptedNotes, password).toString(CryptoJS.enc.Utf8);
        document.getElementById('editor').value = decrypted;
      } catch (e) {
        document.getElementById('error').textContent = "Decryption failed.";
      }
    }
    notesDiv.style.display = 'block';
    loginDiv.style.display = 'none';
  } else {
    document.getElementById('error').textContent = "Wrong password.";
  }
}

function saveNotes() {
  const password = document.getElementById('password').value;
  const notes = document.getElementById('editor').value;
  // Encrypt notes with password
  const encrypted = CryptoJS.AES.encrypt(notes, password).toString();
  localStorage.setItem('encryptedNotes', encrypted);
}
