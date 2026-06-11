"use client";

import dynamic from "next/dynamic";

const DynamicChatBot = dynamic(() => import("./ChatBot"), { ssr: false });

export default function ChatBotWrapper() {
  return <DynamicChatBot />;
}
