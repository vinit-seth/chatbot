"use client";

import React from 'react';
import { useChatStore } from '@/app/store/chatStore';
import ChatIcon from '../atoms/ChatIcon';

const ChatLauncher = () => {
    const { openChat, isChatOpen } = useChatStore();

    // Only render the button if the chat window is not already open.
    if (isChatOpen) {
        return null;
    }

    return (
        <button onClick={openChat} aria-label="Open chat">
            <ChatIcon />
        </button>
    );
};

export default ChatLauncher;
