
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator';


console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

// todo: 免费大模型api翻译

const translator = new GoogleTranslator();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate') {
    translator
      .translate(request.text, 'zh', 'en') // 使用 GoogleTranslator 进行翻译
      .then(translatedText => {
        sendResponse({ translatedText });
      })
      .catch(error => {
        console.error('Translation error:', error);
        sendResponse({ translatedText: '' });
      });
    return true; // 表示异步响应
  }
});

export {}
