"use client";

import ChatLauncher from "./components/organisms/ChatLauncher";

export default function HomePage() {
  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", minHeight: "100vh", width: "100%", backgroundColor: "#f9fafb", padding: "2rem", fontSize: "1.25rem", }}>
      <ChatLauncher />
      <p>Need help? Click the button above to chat with us!</p>
    </main>
  );
}