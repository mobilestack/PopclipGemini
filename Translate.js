// #popclip extension for Google Gemini
// name: Gemini Translate
// icon: "iconify:mingcute:translate-line"
// language: javascript
// module: true
// entitlements: [network]
// options: [{
//   identifier: apikey, label: API Key, type: string,
//   description: 'Obtain API key from Google Cloud Console'
// },
// {
//    identifier: model, label: 'model', type: multiple,
//    values:['gemini-1.5-pro-002', 'gemini-1.5-flash-002', 'gemini-1.5-flash-latest','gemini-1.5-pro-latest','gemini-1.0-pro']
//  }, {
//   identifier: prompt, label: 'Translate Prompt', type: string,
//   defaultValue: "I will give you a text, and you will translate it to {lang} language. If the text is already in {lang} language, then translate it to Chinese. Do not alter the original structure and formatting outlined in any way. Only give the output in the final single language, do not show any indicator of the target language name or anything else. Now, according to above mentioned rules, translate the following text: \n\n{input}",
//   description: 'Enter the prompt template using {input} {lang} as a placeholder for the text'
// },{
//    identifier: tolang, label: 'Language', type: multiple,
//    values:['English','Chinese','Russian','French','Português','Spanish'],
//    description: 'The language to be translated'
// }]

const axios = require("axios");

async function generateContent(input, options) {
  const prompt=options.prompt.replace('{input}', input.text).replace('{lang}',options.tolang);
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
    return generatedText;
  } catch (error) {
    console.error("Error generating content:", error);
    return "Error generating content: " + error.message;
  }
}

exports.actions = [{
  title: "Gemini Translate",
  after: "paste-result",
  code: async (input, options) => generateContent(input, options),
}];
