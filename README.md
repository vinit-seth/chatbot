Here is a **professional, polished `README.md`** you can directly paste into your repository.
It clearly states that the project is *inspired by / referenced from* the SaskTel.com chatbot, without implying ownership of SaskTel IP.

---

# 📌 Genesys WebChat Integration (Next.js)

### Modern Customer Support Chatbot — Inspired by the SaskTel.com Implementation

This project is a **Next.js-based integration of the Genesys WebChat widget**, built to replicate and study the core functionality of the chatbot experience found on **SaskTel.com**.
It is **not an official SaskTel product**, but a **technical reference implementation** created for learning, experimentation, and personal portfolio demonstration.

---

## 🚀 Features

### ✅ **Genesys Cloud WebChat Widget**

* Dynamic loading of Genesys widgets (CXBus, WebChat, Rich Media Bridge, etc.)
* Custom chat form injected through `CXBus.command("WebChat.open")`
* Custom event subscriptions:

  * `WebChat.opened`
  * `WebChat.closed`
  * `WebChat.ended`
* Chat state management using **Zustand** (`useChatStore`)

### ✅ **Next.js Integration**

* Scripts dynamically injected into the DOM using a custom `<GenesysProvider />`
* Prevents duplicate widget initialization using `useRef`
* Secure API routing for queue availability checks

### ✅ **Redis Cache + Server API**

* API route `/api/chatbot` checks **Genesys queue availability**
* Caches response for **60 seconds** using Redis (`ManageCachedDataService`)
* Fallback to Genesys REST APIs if cache is cold

### ✅ **Custom UI Behavior**

* Local store to control:

  * Chat open/closed state
  * Chat initialization
* Clean, type-safe interfaces for Genesys CXBus

---

## 🏗️ Project Architecture

### **Frontend (Next.js App)**

* Loads Genesys widget scripts dynamically
* Pushes chat open/close state into Zustand for UI control
* Communicates with backend API for availability checking

### **Backend (API Routes)**

* Securely calls Genesys REST endpoints (`/callbacks/open-for/…` & `estimated-wait-time`)
* Caches responses in Redis
* Logs events using custom logger utilities

### **State Management**

Zustand store manages:

* `cxbus` instance
* `isChatOpen` flag
* `openChat()` wrapper that triggers Genesys WebChat

---

## 📁 Repository Structure

```
/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chatbot/route.ts       # Genesys availability check API
│   │   └── layout.tsx                 # Global providers + script injection
│   ├── components/
│   │   └── GenesysProvider.tsx        # Loads Genesys widget scripts
│   ├── store/
│   │   └── chatStore.ts               # Zustand store for chat state + CXBus
│   ├── lib/
│   │   └── services/cacheManagement/  # Redis caching services
│   └── utils/
│       └── logger.ts                   # Logger wrapper
└── README.md
```

---

## 🧠 Technology Stack

| Layer                | Tech                                   |
| -------------------- | -------------------------------------- |
| **Frontend**         | Next.js, React, TypeScript             |
| **Chat Widget**      | Genesys Cloud WebChat v9               |
| **State Management** | Zustand                                |
| **Backend API**      | Next.js App Router (`route.ts`)        |
| **Caching**          | Redis (TTL = 60s)                      |
| **Logging**          | Custom logger with contextual metadata |

---

## 🔐 Environment Variables

Add the following to `.env.local`:

```
NEXT_PUBLIC_GENESYS_DATA_URL=
NEXT_PUBLIC_GENESYS_ENDPOINT=
NEXT_PUBLIC_GENESYS_API_KEY=
NEXT_PUBLIC_GENESYS_STREAM=

GAPI_BASE_URL=
GAPI_KEY=

REDIS_URL=
```

> ⚠️ *Ensure all Genesys credentials remain private. Do not commit `.env` files.*

---

## 🧪 Running the Project

### Install dependencies

```
npm install
```

### Start development server

```
npm run dev
```

### Build production bundle

```
npm run build
npm start
```

---

## 📌 Important Notes

### 🔹 Educational / Demonstration Purpose Only

This project is **not affiliated with SaskTel** and **does not reuse SaskTel proprietary code**.
It simply **recreates the public-facing behavior** of the SaskTel.com chatbot for learning purposes.

### 🔹 Genesys Credentials

To run WebChat, you must use your own **Genesys Cloud CX** environment & API keys.

### 🔹 Do Not Use in Production Without Review

This implementation loads external scripts and triggers chat interactions.
Please review Genesys & organizational security policies before deploying.

---

## 🧩 Future Enhancements

* Better UI wrapper for chat widget
* Add queue-unavailability banner logic
* Store chat history locally
* Add typing indicator overlay
* Add analytics (Adobe/GTM event tracking)

---

## 🙌 Acknowledgements

* **SaskTel.com** — for providing the inspiration and reference UX
* **Genesys Cloud CX** — for the WebChat widget platform
* **Next.js team** — for an efficient SSR + SPA hybrid framework