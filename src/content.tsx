import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from './components/Button';
import { Loading } from './components/Loading';
import cssText from "data-text:~style.css"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}
// 正则表达式检查是否包含中文
function containsChinese(str: string) {
  const regex = /[\u4e00-\u9fff]/;
  return regex.test(str);
}

// 节流函数
function debounce(func, wait: number) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

const debounceTimeWhenShowTranslateBar = 500;
const debounceTimeWhenHideTranslateBar = 1200;
let savedInputElement = null;

// 首先,添加一个 Promise 封装函数
const getStorageLocal = (keys: string | string[] | object): Promise<{ [key: string]: any }> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result) => {
      resolve(result);
    });
  });
};

export default function App() {
  const [translateText, setTranslateText] = useState(''); // 初始化为空
  const [isVisible, setIsVisible] = useState(false); // 控制显示状态
  const [isSuccessVisible, setIsSuccessVisible] = useState(false); // 管理显示状态
  const [transLoading, setTransLoading] = useState(false); // 新增状态管理翻译加载
  const [applyedCurText, setApplyedCurText] = useState(false); // 当前翻译文本是否已应用
  const inputTimeoutRef = useRef<number | null>(null);  // 输入超时定时器，一段时间未有输入则隐藏翻译条

  // 从 chrome.storage 中获取设置项
  const [disabledUrls, setDisabledUrls] = useState<string[]>([]);
  const [translateBarTimeout, setTranslateBarTimeout] = useState<number>(8000);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [shortcutKey, setShortcutKey] = useState<string>('Tab');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const result = await getStorageLocal(['disabledUrls', 'translateBarTimeout', 'selectedLanguage', 'shortcutKey']);
        setDisabledUrls(result.disabledUrls || []);
        setTranslateBarTimeout(result.translateBarTimeout || 8000);
        setSelectedLanguage(result.selectedLanguage || 'en');
        setShortcutKey(result.shortcutKey || 'Tab');
      } catch (error) {
        console.error('获取设置时出错:', error);
      }
    };

    fetchSettings();
  }, []);

  const hideTranslateBar = useCallback(() => {
    setTranslateText('');
    setApplyedCurText(false);
    setIsVisible(false);
    setInputHandlerDebounceTime(debounceTimeWhenShowTranslateBar);
    if (inputTimeoutRef.current) {
      clearTimeout(inputTimeoutRef.current);
      inputTimeoutRef.current = null;
    }
  }, []);

  const showTranslateBar = useCallback(() => {
    setIsVisible(true);
    setInputHandlerDebounceTime(debounceTimeWhenShowTranslateBar);
  }, []);

  const handleInput = useCallback(
    async (event: InputEvent) => {
      try {
        const { urlStates = {} } = await getStorageLocal('urlStates');
        const currentUrl = window.location.origin + window.location.pathname;

        if (urlStates[currentUrl]) {
          // 当前URL被禁用,直接返回
          return;
        }

        const target = event.target as HTMLInputElement;
        savedInputElement = target;
        const text = target?.value?.trim?.() || target?.textContent?.trim?.();
        if (!text) {
          hideTranslateBar();
          return;
        }

        showTranslateBar();
        setTransLoading(true);

        if (chrome.runtime && chrome.runtime.sendMessage) {
          chrome.runtime.sendMessage({ action: 'translate', text, language: selectedLanguage }, response => {
            setTranslateText(response.translatedText);
            setApplyedCurText(false);
            setTransLoading(false);

            // 清除之前的定时器
            if (inputTimeoutRef.current) {
              clearTimeout(inputTimeoutRef.current);
            }

            // 设置新的定时器并保存到 ref 中
            inputTimeoutRef.current = setTimeout(() => {
              hideTranslateBar();
            }, translateBarTimeout) as unknown as number;
          });
        } else {
          console.error('chrome.runtime.sendMessage 不可用');
        }
      } catch (error) {
        console.error('处理输入时出错:', error);
      }
    },
    [selectedLanguage, translateBarTimeout, hideTranslateBar, showTranslateBar]
  );

  const inputHandler = useCallback(
    event => {

      if (inputTimeoutRef.current) {
        clearTimeout(inputTimeoutRef.current);
        inputTimeoutRef.current = null;
      }

      // 获取实际文本内容
      let text = '';
      const target = event.target;

      if (target.isContentEditable) {
        text = target.textContent || target.innerText;
      } else {
        text = target.value;
      }

      if (!containsChinese(text)) return;

      const customEvent = {
        type: 'input',
        target: target,
        data: text,
        bubbles: true,
        cancelable: true
      } as InputEvent;

      handleInput(customEvent);
    },
    [handleInput],
  );

  let inputHandlerDebounce = useRef(debounce(inputHandler, debounceTimeWhenHideTranslateBar)).current;

  const handleKeyDown = useCallback(
    event => {
      if (event.key === shortcutKey) {
        if (!savedInputElement) return;
        event.preventDefault();
        if (translateText && !applyedCurText) {
          savedInputElement.textContent = translateText;
          savedInputElement.value = translateText;
          setApplyedCurText(true);
        } else {
          hideTranslateBar();
        }
      }
    },
    [translateText, applyedCurText, hideTranslateBar, shortcutKey],
  );

  const setInputHandlerDebounceTime = useCallback(
    (wait: number) => {
      document.removeEventListener('input', inputHandlerDebounce);
      inputHandlerDebounce = debounce(inputHandler, wait);
      document.addEventListener('input', inputHandlerDebounce);
    },
    [inputHandler],
  );

  useEffect(() => {
    // 同时监听 input 事件和 contenteditable 元素的变化
    setInputHandlerDebounceTime(1200);
    document.addEventListener('input', inputHandlerDebounce);

    // 添加 mutation observer 来监听 contenteditable 元素的变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const target = mutation.target as HTMLElement;
        // 检查目标元素或其父元素是否是 contenteditable
        if (target.isContentEditable ||
            target.parentElement?.isContentEditable) {
          const editableElement = target.isContentEditable ?
                                target :
                                target.parentElement;
          const event = {
            target: editableElement,
            type: 'input'
          } as Event;
          inputHandlerDebounce(event);
        }
      });
    });

    // 创建一个函数来观察新的 contenteditable 元素
    const observeContentEditables = () => {
      // 断开之前的连接
      observer.disconnect();

      // 观察整个文档
      observer.observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['contenteditable']
      });
    };

    // 初始观察
    observeContentEditables();

    // 创建一个 MutationObserver 来监视 DOM 变化，以便观察动态添加的 contenteditable 元素
    const domObserver = new MutationObserver(observeContentEditables);
    domObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('input', inputHandlerDebounce);
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
      domObserver.disconnect();
    };
  }, [handleKeyDown, setInputHandlerDebounceTime]);

  const copyTranslateText = () => {
    navigator.clipboard
      .writeText(translateText)
      .then(() => {
        setIsSuccessVisible(true);
        setTimeout(() => {
          setIsSuccessVisible(false);
        }, 3000);
      })
      .catch(err => {
        console.error('复制失败:', err);
        setIsSuccessVisible(false);
      });
  };


  return (
    <div
      id="translate-bottom-bar"
      className={`${isVisible ? 'visible' : 'hidden'} fixed bottom-0 left-0 w-full flex items-center justify-around gap-2 bg-blue-100 rounded py-0.5 px-4 opacity-80`}
      style={{
        zIndex: 9999,
      }}>
      {/* left */}
      <div className="flex flex-col items-center justify-center min-w-[130px]">
        {translateText && !transLoading ? (
          <div className="flex flex-row flex-nowrap items-center">
            <Button
              theme='dark'
              className="bg-gray-300 p-2 rounded shadow "
              style={{
                padding: '0.35rem 1.1rem .1rem .35rem',
              }}>
              {shortcutKey}
            </Button>
            <span className="font-bold" style={{ color: '#333' }}>
              <svg className="breath" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path fill="currentColor" d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6z" />
              </svg>
            </span>
          </div>
        ) : (
          <Loading />
        )}
      </div>
      {/* center */}
      <div className="flex-grow text-blue-700 text-center">
        <strong className={`line-clamp-2 ${translateText.length < 50 ? 'text-lg' : 'text-md'}`}>{translateText}</strong>
      </div>
      {/* right */}
      <div className="flex min-w-[130px] justify-end items-center">
        <Button theme='dark' onClick={copyTranslateText}>
          Copy
        </Button>
        <svg
          style={{ visibility: isSuccessVisible ? 'visible' : 'hidden', marginLeft: '4px', color: '#49a078' }}
          xmlns="http://www.w3.org/2000/svg"
          width="1rem"
          height="1rem"
          viewBox="0 0 24 24">
          <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <path
              fill="currentColor"
              fillOpacity="0"
              strokeDasharray="60"
              strokeDashoffset="60"
              d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z">
              <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0"></animate>
              <animate fill="freeze" attributeName="fill-opacity" begin="0.8s" dur="0.15s" values="0;0.3"></animate>
            </path>
            <path fill="none" strokeDasharray="14" strokeDashoffset="14" d="M8 12L11 15L16 10">
              <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="14;0"></animate>
            </path>
          </g>
        </svg>
      </div>
    </div>
  );
}
