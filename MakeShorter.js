// #popclip extension for Google Gemini
// name: Gemini Make Shorter
// icon: "iconify:mdi:file-minus"
// language: javascript
// module: true
// entitlements: [network]
// options: [{
//   identifier: apikey, label: API Key, type: string,
//   description: 'Obtain API key from Google Cloud Console'
// },
// {
//    identifier: model, label: 'model', type: multiple,
//    values:['gemini-1.5-flash-latest','gemini-1.5-pro-latest','gemini-1.0-pro']
//  }, {
//   identifier: prompt, label: 'Make Shorter Prompt', type: string,
//   defaultValue: "I'll give you a text. You'll rewrite it and output it more concise, while keep the original meaning. Only give me the output and nothing else.Now, with the rules above, re-write the following text. Respond in the same language of the text:\n{input}",
//   description: 'Enter the prompt template using {input} as a placeholder for the text'
// }]

const axios = require("axios");

async function generateContent(input, options) {
  const prompt=options.prompt.replace('{input}', input.text);
  const requestBody = {
    "contents": [{
      "parts": [
        {"text": prompt}
      ]
    }],
    "safetySettings": [
      {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_ONLY_HIGH"
      }
    ],
    "generationConfig": {
      "stopSequences": [
        "Title"
      ],
      "temperature": 1.0,
      "maxOutputTokens": 8192,
      "topP": 0.95,
      "topK": 64
    }
  };

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${options.model}:generateContent?key=${options.apikey}`,
      requestBody,
      { headers: { 'Content-Type': 'application/json' } }
    );

    const generatedText = response.data.candidates[0].content.parts.map(part => part.text).join('\n');
    const outputText = input.text + "\n\n" + generatedText
    return outputText;
  } catch (error) {
    console.error("Error generating content:", error);
    return input.text + "\n\n" + "Error generating content: " + error.message;
  }
}

exports.actions = [{
  title: "Gemini Make Shorter",
  after: "paste-result",
  code: async (input, options) => generateContent(input, options),
}];
