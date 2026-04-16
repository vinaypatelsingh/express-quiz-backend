const axios = require("axios");

const BASE_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

// Helper to extract meaningful error info from axios errors
const extractAxiosError = (error) => {
  if (error.response) {
    // The Python API responded with an error status
    return {
      status: error.response.status,
      data: error.response.data,
      message: error.response.data?.detail || error.response.data?.message || error.message || "Unknown API error",
    };
  } else if (error.request) {
    // No response received - Python API might be down
    return {
      status: null,
      data: null,
      message: "Python API is not reachable. Make sure the FastAPI server is running on " + BASE_URL,
    };
  } else {
    return {
      status: null,
      data: null,
      message: error.message || "Unknown error occurred",
    };
  }
};

// Generate Quiz
exports.generateQuiz = async (data) => {
  const url = `${BASE_URL}/api/quiz`;
  console.log("[aiService] generateQuiz - Calling Python API:", url);
  console.log("[aiService] generateQuiz - Request data:", JSON.stringify(data, null, 2));

  try {
    const res = await axios.post(url, data);
    console.log("[aiService] generateQuiz - Response status:", res.status);
    console.log("[aiService] generateQuiz - Response data keys:", Object.keys(res.data));
    return res.data;
  } catch (error) {
    const errInfo = extractAxiosError(error);
    console.error("[aiService] generateQuiz - ERROR:");
    console.error("[aiService] generateQuiz - Status:", errInfo.status);
    console.error("[aiService] generateQuiz - Message:", errInfo.message);
    console.error("[aiService] generateQuiz - Response data:", JSON.stringify(errInfo.data, null, 2));
    // Re-throw with a meaningful message so the controller can forward it
    const err = new Error(errInfo.message);
    err.statusCode = errInfo.status;
    throw err;
  }
};

// Generate Feedback
exports.generateFeedback = async (data) => {
  const url = `${BASE_URL}/api/quiz/feedback`;
  console.log("[aiService] generateFeedback - Calling Python API:", url);
  console.log("[aiService] generateFeedback - Request data:", JSON.stringify(data, null, 2));

  try {
    // data should include assessmentId, score, answers, and explanationsUsedCount
    const res = await axios.post(url, data);
    console.log("[aiService] generateFeedback - Response status:", res.status);
    return res.data;
  } catch (error) {
    const errInfo = extractAxiosError(error);
    console.error("[aiService] generateFeedback - ERROR:");
    console.error("[aiService] generateFeedback - Status:", errInfo.status);
    console.error("[aiService] generateFeedback - Message:", errInfo.message);
    console.error("[aiService] generateFeedback - Response data:", JSON.stringify(errInfo.data, null, 2));
    const err = new Error(errInfo.message);
    err.statusCode = errInfo.status;
    throw err;
  }
};

// Upload to RAG
exports.uploadToRAG = async (formData) => {
  const url = `${BASE_URL}/api/upload`;
  console.log("[aiService] uploadToRAG - Calling Python API:", url);

  try {
    const res = await axios.post(url, formData, {
      headers: formData.getHeaders(),
    });
    console.log("[aiService] uploadToRAG - Response status:", res.status);
    return res.data;
  } catch (error) {
    const errInfo = extractAxiosError(error);
    console.error("[aiService] uploadToRAG - ERROR:");
    console.error("[aiService] uploadToRAG - Status:", errInfo.status);
    console.error("[aiService] uploadToRAG - Message:", errInfo.message);
    console.error("[aiService] uploadToRAG - Response data:", JSON.stringify(errInfo.data, null, 2));
    const err = new Error(errInfo.message);
    err.statusCode = errInfo.status;
    throw err;
  }
};
