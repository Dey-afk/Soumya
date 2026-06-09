const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// API: Load Google Drive folder
app.get("/folder", async (req, res) => {
    const folderLink = req.query.link;
    if (!folderLink) return res.status(400).json({ error: "Missing folder link" });

    const folderIdMatch = folderLink.match(/[-\w]{25,}/);
    if (!folderIdMatch) return res.status(400).json({ error: "Invalid folder link" });

    const folderId = folderIdMatch[0];

    try {
        const url = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
        const response = await fetch(url);
        const html = await response.text();

        const regex = /href="https:\/\/drive\.google\.com\/file\/d\/(.*?)\//g;
        let match;
        const files = [];

        while ((match = regex.exec(html)) !== null) {
            files.push({
                id: match[1],
                name: "Drive File"
            });
        }

        res.json(files);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load folder" });
    }
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});