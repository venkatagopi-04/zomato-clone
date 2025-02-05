const express = require("express");
const multer = require("multer");
const { ImageAnnotatorClient } = require("@google-cloud/vision");

const router = express.Router();

// Set up Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Google Vision API client
const client = new ImageAnnotatorClient();

// Route for detecting food from an image
router.post("/detect-food", upload.single("image"), async (req, res) => {
    console.log("image routes called");
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        // Process the image with Google Vision API
        const [result] = await client.labelDetection(req.file.buffer);
        const labels = result.labelAnnotations;

        if (labels.length > 0) {
            return res.json({
                label1: labels[0].description,
                confidence1: labels[0].score,
                label2: labels[1].description,
                confidence2: labels[1].score,
            });
        } else {
            return res.status(404).json({ error: "No labels detected." });
        }
    } catch (err) {
        console.error("Error detecting food:", err);
        res.status(500).json({ error: "Error processing image." });
    }
    
});

module.exports = router;
