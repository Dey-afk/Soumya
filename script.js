<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Secure Image Gallery</title>
  <script src="https://apis.google.com/js/api.js"></script>
  <style>
    body { font-family: Arial; padding: 20px; }
    .gallery { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 20px; }
    .gallery div { text-align: center; }
    .admin-panel { margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; display: none; }
    button { padding: 5px 10px; cursor: pointer; }
    input { padding: 5px; margin-right: 5px; }
    img { object-fit: cover; border-radius: 5px; }
  </style>
</head>
<body>

<h1>Secure Image Gallery</h1>

<!-- Admin Login -->
<div id="loginDiv">
  <p>Admin Login:</p>
  <input type="password" id="adminPassword" placeholder="Enter Admin Password">
  <button onclick="checkPassword()">Login</button>
</div>

<!-- Admin Panel -->
<div id="adminPanel" class="admin-panel">
  <h2>Admin Panel</h2>
  <button onclick="initGoogleAuth()">Connect Google Drive</button>
  <button onclick="loadDriveImages()">Load Images from Drive</button>
</div>

<!-- Gallery -->
<div class="gallery" id="gallery"></div>

<script>
  // ----- Admin password -----
  const ADMIN_PASSWORD = "Admin123";

  let images = []; // Gallery images
  let gapiInited = false;

  // HTML elements
  const gallery = document.getElementById("gallery");
  const adminPanel = document.getElementById("adminPanel");
  const loginDiv = document.getElementById("loginDiv");

  // ----- Check admin password -----
  function checkPassword() {
    const input = document.getElementById("adminPassword").value;
    if (input === ADMIN_PASSWORD) {
      adminPanel.style.display = "block";
      loginDiv.style.display = "none";
      alert("Welcome, Admin!");
    } else {
      alert("Incorrect password!");
    }
  }

  // ----- Render gallery -----
  function renderGallery() {
    gallery.innerHTML = "";
    if (!images || images.length === 0) {
      gallery.innerHTML = "<p>No images loaded.</p>";
      return;
    }

    images.forEach(file => {
      const imageUrl = `https://drive.google.com/uc?id=${file.id}`;
      const card = document.createElement("div");
      card.innerHTML = `
        <img src="${imageUrl}" alt="${file.name}" width="300">
        <p>${file.name}</p>
      `;
      gallery.appendChild(card);
    });
  }

  // ----- Initialize Google API -----
  function initGoogleAuth() {
    gapi.load('client:auth2', async () => {
      await gapi.client.init({
        apiKey: 'YOUR_API_KEY', // Replace with your API key
        clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com', // Replace with your Client ID
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        scope: "https://www.googleapis.com/auth/drive.readonly"
      });
      gapiInited = true;
      alert("Google API initialized. Please authorize to load Drive images.");
    });
  }

  // ----- Load images from Google Drive -----
  async function loadDriveImages() {
    if (!gapiInited) {
      alert("Initialize Google API first!");
      return;
    }

    try {
      // Sign in user
      await gapi.auth2.getAuthInstance().signIn();

      // List image files in Drive
      const response = await gapi.client.drive.files.list({
        q: "mimeType contains 'image/'",
        fields: "files(id, name)"
      });

      images = response.result.files;
      renderGallery();
      alert("Images loaded from Drive!");
    } catch (err) {
      console.error(err);
      alert("Failed to load images from Google Drive.");
    }
  }

  // ----- Initial empty render -----
  renderGallery();
</script>

</body>
</html>