const axios = require('axios');

export async function translateText(content, senderLanguage, receiverLanguage) {
  try {
    const response = await axios.post('http://localhost:8000/translate/text-to-text', {
      text: content,
      src_lang: senderLanguage,
      tgt_lang: receiverLanguage,
    });

    return response.data.translated_text;

  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

