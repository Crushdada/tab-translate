import '@/style.css';
import { Switch } from '@/lib/shardcn-coms/Switch';

import type { ComponentPropsWithoutRef } from 'react';
import { useState, useEffect } from 'react';

const notificationOptions = {
  type: 'basic',
  iconUrl: chrome.runtime.getURL('icon.png'),
  title: '注入内容脚本错误',
  message: '你不能在这里注入脚本！',
} as const;

import logo from "data-base64:~assets/icon.png"

const Popup = () => {
  const isLight = false
  // { https://ui.shadcn.com/docs/components/switch : false }
  const [urlStates, setUrlStates] = useState<Record<string, boolean>>({}); // disabled cache, 为true则当前url不启用
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [translateBarTimeout, setTranslateBarTimeout] = useState<number>(8000);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [shortcutKey, setShortcutKey] = useState<string>('Tab');


  useEffect(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const url = new URL(tabs[0].url!).origin + new URL(tabs[0].url!).pathname;
      setCurrentUrl(url);
      chrome.storage.local.get(['urlStates', 'translateBarTimeout', 'selectedLanguage', 'shortcutKey'], (result) => {
        setUrlStates(result.urlStates || {});
        setTranslateBarTimeout(result.translateBarTimeout || 8000);
        setSelectedLanguage(result.selectedLanguage || 'en');
        setShortcutKey(result.shortcutKey || 'Tab');
      });
    });
  }, []);

  const injectContentScript = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    if (tab.url!.startsWith('about:') || tab.url!.startsWith('chrome:')) {
      chrome.notifications.create('inject-error', notificationOptions);
    }

    await chrome.scripting
      .executeScript({
        target: { tabId: tab.id! },
        files: ['/content-runtime/index.iife.js'],
      })
      .catch(err => {
        if (err.message.includes('Cannot access a chrome:// URL')) {
          chrome.notifications.create('inject-error', notificationOptions);
        }
      });
  };

  const handleToggleEnable = () => {
    const newUrlStates = {
      ...urlStates,
      [currentUrl]: !urlStates[currentUrl]
    };
    setUrlStates(newUrlStates);
    chrome.storage.local.set({ urlStates: newUrlStates });
  };

  const handleTranslateBarTimeoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTimeout = Number(event.target.value);
    setTranslateBarTimeout(newTimeout);
    chrome.storage.local.set({ translateBarTimeout: newTimeout });
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    chrome.storage.local.set({ selectedLanguage: newLanguage });
  };

  const handleShortcutKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newShortcutKey = event.target.value;
    setShortcutKey(newShortcutKey);
    chrome.storage.local.set({ shortcutKey: newShortcutKey });
  };

  return (
    <div className={`p-4 ${isLight ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'}`}
    style={{width: '280px'}}>
      <header className="flex flex-col items-center mb-4">
        <img
          src={logo}
          className="rounded-md w-10 h-10 mr-1"
          alt="logo"
          onError={(e) => {
            console.error('图片加载失败');
            e.currentTarget.style.display = 'none';
          }}
        />
        <h1 className="text-xl font-bold flex items-center">
          Tab Translate 设置
        </h1>
      </header>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="font-medium">在当前页面启用：</label>
          <Switch
            checked={!urlStates[currentUrl]}
            onCheckedChange={handleToggleEnable}
          />
        </div>
        <div className="flex justify-between">
          {/* <button
            className={`px-4 py-2 rounded ${isLight ? 'bg-blue-500 text-white' : 'bg-blue-400 text-gray-800'} hover:opacity-90`}
            onClick={injectContentScript}
          >
            注入脚本
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Popup;
