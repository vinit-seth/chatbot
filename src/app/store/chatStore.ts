import { create } from "zustand";

// Define the shape of the Genesys CXBus object for type safety
interface CXBus {
  command: (command: string, data?: any) => any;
  subscribe: (topic: string, handler: (data: any) => void) => void;
  registerPlugin: (name: string) => any;
}

interface ChatState {
  isChatOpen: boolean;
  cxbus: CXBus | null;
  toggleChat: (isOpen: boolean) => void;
  setCxbus: (bus: CXBus) => void;
  openChat: () => void;
}

// Create the form definition based on the old project's configuration
const consumerChatForm = {
  wrapper: "<div class='row'></div>",
  inputs: [
    {
      id: "cx_webchat_form_firstname",
      name: "firstname",
      maxlength: "100",
      placeholder: "Your Name",
      label: "NAME",
      type: "text",
      validate: (event: any, form: any, input: { val: () => any }) => {
        if (!input) return false;
        return !!input.val();
      },
      wrapper: `<div class="input-wrapper">
                      {label}
                      {input}
                </div>`,
    },
    {
      id: "cx_webchat_form_email",
      name: "email",
      maxlength: "100",
      placeholder: "yourname@sasktel.net",
      label: "EMAIL ADDRESS",
      type: "text",
      validate: (event: any, form: any, input: { val: () => string }) => {
        if (!input || !input.val()) return false;
        const validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return validRegex.test(input.val());
      },
      wrapper: `<div class="input-wrapper">
                    {label}
                    {input}
                </div>`,
    },
    {
      id: "cx_webchat_form_accountnumber",
      name: "IVR_CEN",
      maxlength: "10",
      placeholder: "5555555555",
      label: "CONTACT NUMBER (OPTIONAL)",
      wrapper: `<div class="input-wrapper">
                    {label}
                    {input}
                </div>`,
    },
    {
      id: "cx_webchat_form_transcriptflag",
      name: "transcriptflag",
      type: "checkbox",
      checked: true,
      label: "PLEASE SEND CHAT TRANSCRIPT",
      wrapper: `<div class="input-wrapper-checkbox">
                    {input}
                    {label}
                </div>`,
    },
  ],
};

export const useChatStore = create<ChatState>((set, get) => ({
  isChatOpen: false,
  cxbus: null,
  toggleChat: (isOpen) => set({ isChatOpen: isOpen }),
  setCxbus: (bus) => set({ cxbus: bus }),
  openChat: () => {
    const { cxbus } = get();
    if (cxbus) {
      cxbus.command("WebChat.open", {
        formJSON: consumerChatForm,
      });
      set({ isChatOpen: true });
    } else {
      console.error("Genesys CXBus not initialized.");
    }
  },
}));