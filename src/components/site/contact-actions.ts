import { toast } from "sonner";

import { CONTACT_CONFIG } from "@/config/site";
import { getContactChannels, type ContactChannel } from "@/lib/contact";

export const CHANNELS = getContactChannels(CONTACT_CONFIG);

export function notifyPending(channel: ContactChannel) {
  toast(`${channel.label} isn't available yet`, {
    description: "It will be switched on once a parent or guardian approves public contact. Try Telegram or email for now.",
  });
}

export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(CONTACT_CONFIG.email);
    toast.success("Email copied", { description: CONTACT_CONFIG.email });
  } catch {
    toast.error("Couldn't copy automatically", { description: CONTACT_CONFIG.email });
  }
}

export function linkProps(channel: ContactChannel) {
  return channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
