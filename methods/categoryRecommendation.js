const categories = [
  "Criminal Defense",
  "Divorce & Child Custody",
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
    console.log("recommending category for: " + userQuery);

    const categoriesString = categories.join(", ");
    const prompt =
      `From the given category listed here:\n${categoriesString}\n` +
      `Choose the category which best matches the input query from the user.\n` +
      `Input query: ${userQuery}. \n remember you just have to output one or two from the given categories no extra sentence is needed.`;

    const API_KEY = process.env.OPENAI_API_KEY;
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
      }),
    };
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );

    const data = await response.json();
    console.log(data.choices[0].message.content);
    const result = data.choices[0].message.content;
    return result;

    // if (response.status === 200) {
    //   // const recommendation = response.data.result;
    //   console.log(response);
    //   return recommendation;
    // } else {
    //   throw new Error(`API request failed with status code: ${response}`);
    // }
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

async function botResponse(message) {
  try {
    console.log("replying for message: " + message);

    const categoriesString = categories.join(", ");
    const prompt =
      `Note the given category listed here:\n${categoriesString}\n` +
      `You are a chatbot named 'Legistrive' and reply and behave as Legistrive chatbot. User will send message in Input Query as shown\n` +
      `Input query: ${message}. \n remember you will only reply if the message is relevant from the listed category as user want to know info about legal things. Try to reply in less than 500 token`;

    const API_KEY = process.env.OPENAI_API_KEY;
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 700,
      }),
    };
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );

    const data = await response.json();
    const result = data.choices[0].message.content;
    return result;

    // if (response.status === 200) {
    //   // const recommendation = response.data.result;
    //   console.log(response);
    //   return recommendation;
    // } else {
    //   throw new Error(`API request failed with status code: ${response}`);
    // }
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

export { botResponse, categoryRecommendation};
