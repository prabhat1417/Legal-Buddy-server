// import axios from "axios";
// import OpenAI from "openai";

// const categories = [
//   "Divorce and child custody",
//   "Property and real estate",
//   "Check bounce & money recovery",
//   "employment issues",
//   "consumer protection",
//   "civil matters",
//   "cyber crime",
//   "company & startups",
//   "other legal problem",
//   "criminal matter",
//   "RERA consultation",
// ];

// async function categoryRecommendation(userQuery) {
//   try {

//     console.log("recommending category for: " + userQuery);
    
//     const categoriesString = categories.join(", ");
//     const prompt =
//       `From the given category listed here:\n${categoriesString}\n` +
//       `Choose the category which best matches the input query from the user.\n` +
//       `Input query: ${userQuery}. \n remember you just have to output one or two from the given categories no extra sentence is needed.`;

//     const openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//     });
    
//     const response = await openai.completions.create({
//       model: "text-davinci-003",
//       prompt: prompt,
//       temperature: 0.9,
//       max_tokens: 60,
//       top_p: 1,
//       frequency_penalty: 0,
//       presence_penalty: 0.6,
//       stop: [" User:", " Legal Buddy:"],
//     });

//     if (response.status === 200) {
//       // const recommendation = response.data.result;
//       console.log(response);
//       return recommendation;
//     } else {
//       throw new Error(
//         `API request failed with status code: ${response.status}`
//       );
//     }
//   } catch (error) {
//     if (error.response) {
//       // The request was made, but the server responded with an error status
//       console.error("Error response data:", error.response.data);
//       console.error("Error response status:", error.response.status);
//       console.error("Error response headers:", error.response.headers);
//     } else if (error.request) {
//       // The request was made, but there was no response from the server
//       console.error("No response from the server:", error.request);
//     } else {
//       // Something else went wrong
//       console.error("Error:", error.message);
//     }
//     throw error;
//   }
// }

// export default categoryRecommendation;
