import { Metadata } from "next";
import ChatIdClient from "./ChatIdClient";

export const metadata: Metadata = {
  title: "Chat ID Finder",
  description: "A simple tool to find your Telegram Chat ID.",
};

export default function ChatIdFinder() {
    return <ChatIdClient />;
}
