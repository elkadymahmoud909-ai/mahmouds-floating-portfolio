export type ContactId = "whatsapp" | "telegram" | "phone" | "email";

export type ContactChannel = {
  id: ContactId;
  label: string;
  /** Real destination, or null while the channel is not approved / configured. */
  href: string | null;
  external: boolean;
  /** Short value shown in the UI. */
  display: string;
};

export type ContactSettings = {
  email: string;
  telegramUrl: string;
  telegramHandle: string;
  publicPhoneApproved: boolean;
  phoneNumber: string;
};

function phoneDigits(raw: string) {
  return raw.replace(/[^\d]/g, "");
}

/** Builds the four contact channels. Phone and WhatsApp stay null until approved. */
export function getContactChannels(cfg: ContactSettings): ContactChannel[] {
  const digits = phoneDigits(cfg.phoneNumber);
  const phoneActive = cfg.publicPhoneApproved && digits.length >= 8;
  const pending = "Awaiting approval";

  return [
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: phoneActive ? `https://wa.me/${digits}` : null,
      external: true,
      display: phoneActive ? "Chat on WhatsApp" : pending,
    },
    {
      id: "telegram",
      label: "Telegram",
      href: cfg.telegramUrl,
      external: true,
      display: cfg.telegramHandle,
    },
    {
      id: "phone",
      label: "Phone",
      href: phoneActive ? `tel:+${digits}` : null,
      external: false,
      display: phoneActive ? `+${digits}` : pending,
    },
    {
      id: "email",
      label: "Email",
      href: `mailto:${cfg.email}`,
      external: false,
      display: cfg.email,
    },
  ];
}
