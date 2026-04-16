const FormData = require("form-data");
const fs = require("fs");
const aiService = require("../services/aiService");

exports.uploadRAG = async (req, res) => {
  console.log("[ragController] uploadRAG - START");

  try {
    const file = req.file;
    if (!file) {
      console.log("[ragController] uploadRAG - No file uploaded");
      return res.status(400).json({ message: "Please upload a file" });
    }

    console.log("[ragController] uploadRAG - File received:", file.originalname);
    console.log("[ragController] uploadRAG - File path:", file.path);
    console.log("[ragController] uploadRAG - File size:", file.size, "bytes");

    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.path));
    formData.append("target", "quiz");
    formData.append("strategy", "custom");

    console.log("[ragController] uploadRAG - Calling AI service to upload...");

    const response = await aiService.uploadToRAG(formData);

    console.log("[ragController] uploadRAG - Upload successful");

    // Clean up temporary file
    fs.unlinkSync(file.path);
    console.log("[ragController] uploadRAG - Temp file cleaned up");

    res.json(response);
  } catch (error) {
    console.error("[ragController] uploadRAG - ERROR:");
    console.error("[ragController] uploadRAG - Error message:", error.message);
    console.error("[ragController] uploadRAG - Error stack:", error.stack);

    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
        console.log("[ragController] uploadRAG - Temp file cleaned up after error");
      } catch (cleanupErr) {
        console.error("[ragController] uploadRAG - Failed to clean up temp file:", cleanupErr.message);
      }
    }

    res.status(500).json({ message: error.message || "Internal server error while uploading file" });
  }
};
