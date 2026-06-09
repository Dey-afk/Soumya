// server.js
const express = require("express");
const fetch = require("node-fetch"); // npm install node-fetch
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/**
 * GET /folder?link=FOLDER_LINK
 * Returns JSON array of files in the public folder
 */
app.get("/folder", async (req, res) => {
    const folderLink = req.query.link;
    if (!folderLink) return res.status(400).json({ error: "Missing folder link" });

    const folderIdMatch = folderLink.match(/[-\w]{25,}/);
    if (!folderIdMatch) return res.status(400).json({ error: "Invalid folder link" });

    const folderId = folderIdMatch[0];

    try {
        // Embedded folder view page
        const url = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
        const response = await fetch(url);
        const html = await response.text();

        // Extract file IDs from embedded folder HTML
        const regex = /href="https:\/\/drive\.google\.com\/file\/d\/(.*?)\//g;
        let match;
        const files = [];

        while ((match = regex.exec(html)) !== null) {
            const id = match[1];
            files.push({
                id,
                name: "Drive File" // Optional: You could parse name if needed
            });
        }

        if (files.length === 0) return res.status(404).json({ error: "No files found or folder not public" });

        res.json(files);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch folder" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));