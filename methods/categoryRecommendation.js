import axios from "axios";

const categories = [
  "Divorce and child custody",
  "Property and real estate",
  "Check bounce & money recovery",
  "employment issues",
  "consumer protection",
  "civil matters",
  "cyber crime",
  "company & startups",
  "other legal problem",
  "criminal matter",
  "RERA consultation",
];

async function categoryRecommendation(userQuery) {
  try {
    const apiUrl = process.env.OPEN_AI_API_URL;

    // Join the categories array into a single string
    const categoriesString = categories.join(", ");

    const prompt =
      `From the given category listed here:\n${categoriesString}\n` +
      `Choose the category which best matches the input query from the user.\n` +
      `Input query: ${userQuery}`;

    const response = await axios.post(apiUrl, prompt);

    if (response.status === 200) {
      const recommendation = response.data.result;
      return recommendation;
    } else {
      throw new Error(
        `API request failed with status code: ${response.status}`
      );
    }
  } catch (error) {
    if (error.response) {
      // The request was made, but the server responded with an error status
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made, but there was no response from the server
      console.error("No response from the server:", error.request);
    } else {
      // Something else went wrong
      console.error("Error:", error.message);
    }
    throw error;
  }
}

export default categoryRecommendation;
