// #popclip extension for Google Gemini
// name: Gemini Improve Writing
// icon: "iconify:tabler:file-text-ai"
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
//  }, 
// {
//   identifier: prompt, label: 'Improve Writing Prompt', type: string,
//   defaultValue: "",
//   description: 'Enter the prompt template using {input} as a placeholder for the text'
// }
// ]

const axios = require("axios");

async function generateContent(input, options) {
  let prompt;
  if(options.prompt.length === 0){
     prompt="I will give you text content, you will rewrite it and output a better version of my text. Correct spelling, grammar, and punctuation errors in the given text. Keep the meaning the same. Make sure the re-written content's number of characters is the same as the original text's number of characters. Do not alter the original structure and formatting outlined in any way. Only give me the output and nothing else. Now, using the concepts above, re-write the following text. Respond in the same language variety or dialect of the following text:{input}";
  } 
  else{
     prompt=options.prompt;
  }

  prompt=prompt.replace('{input}', input.text);
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
  title: "Gemini Improve Writing",
  after: "paste-result",
  code: async (input, options) => generateContent(input, options),
}];
