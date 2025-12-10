"use client";

import { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chatStore';
import "../../globals.css";

declare global {
  interface Window {
    _genesys: any;
    CXBus: any;
  }
}

const GenesysProvider = () => {
  const setCxbus = useChatStore((state) => state.setCxbus);
  const toggleChat = useChatStore((state) => state.toggleChat);

  // 1. ADD A REF TO PREVENT DOUBLE INITIALIZATION IN STRICT MODE
  const initialized = useRef(false);

  useEffect(() => {
    // 2. THE GUARD: If we've already run this effect, do nothing.
    if (initialized.current) {
      return;
    }
    // Mark as initialized so this effect doesn't run again on remount.
    initialized.current = true;


    const genesysSetupScript = `
          window._genesys = {
            widgets: {
              main: {
                debug: true,
                theme: 'light',
                lang: 'en',
                i18n: {
                  en: { webchat: {ChatTitle: ''} }
                },
                plugins: ["cx-webchat"]
              },
              webchat: {
                transport: {
                  dataURL: "${process.env.NEXT_PUBLIC_GENESYS_DATA_URL}",
                  type: 'pureengage-v3-rest',
                  endpoint: "${process.env.NEXT_PUBLIC_GENESYS_ENDPOINT}",
                  headers: { 'x-api-key': "${process.env.NEXT_PUBLIC_GENESYS_API_KEY}"},
                  stream: "${process.env.NEXT_PUBLIC_GENESYS_STREAM}",
                },
                chatButton: {enabled: false},
                emojis: true,
              },
            onReady: function(CXBus){
              console.log('Genesys onReady triggered. Dispatching custom event.');
              const event = new CustomEvent('genesys-cxbus-ready',{detail: CXBus});
              document.dispatchEvent(event);
            }
          }
        };
        `;
    const configScript = document.createElement('script');
    configScript.id = 'genesys-config-setup';
    configScript.innerHTML = genesysSetupScript;
    document.body.appendChild(configScript);

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => {
          console.log(`Loaded script: ${src}`);
          resolve();
        }
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      })

    const initGenesys = async () => {
      try {
        await loadScript('https://apps.cac1.pure.cloud/widgets/9.0.017.27/plugins/widgets-core.min.js');
        await loadScript('https://apps.cac1.pure.cloud/widgets/9.0.017.27/widgets.min.js');
        await loadScript('https://apps.cac1.pure.cloud/widgets/9.0.017.27/plugins/webchat.min.js');
        // await loadScript('https://apps.cac1.pure.cloud/widgets/9.0.017.27/plugins/toaster.min.js');
        // await loadScript('https://apps.cac1.pure.cloud/widgets/9.0.017.27/plugins/webchatservice.min.js');
        await loadScript('https://apps.cac1.pure.cloud/widgets/9.0.017.27/plugins/richmediabridge.min.js');
        await loadScript('https://apps.cac1.pure.cloud/widgets/9.0.017.27/plugins/webchatservicenextgen.mod.js');
        // await loadScript('https://apps.cac1.pure.cloud/widgets/9.0.017.27/plugins/windowmanager.min.js');
        // await loadScript('https://apps.cac1.pure.cloud/widgets/9.0.017.27/plugins/pure-engage-v3-rest-transport.mod.js');
      } catch (error) {
        console.error(error);
      }
    };
    initGenesys();

    const handleCxbusReady = (event: Event) => {
      console.log('Genesys CXBus is ready, received by React component.');
      const customEvent = event as CustomEvent;
      const CXBus = customEvent.detail;

      setCxbus(CXBus);

      CXBus.subscribe('WebChat.opened', () => toggleChat(true));
      CXBus.subscribe('WebChat.closed', () => toggleChat(false));
      CXBus.subscribe('WebChat.ended', () => toggleChat(false));

      // setCxbus(CXBus);
    };
    document.addEventListener('genesys-cxbus-ready', handleCxbusReady);

    return () => {
      document.removeEventListener('genesys-cxbus-ready', handleCxbusReady);
    };
  }, [setCxbus, toggleChat]);

  return null;
};

export default GenesysProvider;
