import { describe, expect, it } from "vitest";

import { CONTACT_CONFIG } from "@/config/site";
import { getContactChannels, type ContactSettings } from "@/lib/contact";

const base: ContactSettings = {
  email: "m36125265@gmail.com",
  telegramUrl: "https://t.me/MahmoudCodeX",
  telegramHandle: "@MahmoudCodeX",
  publicPhoneApproved: false,
  phoneNumber: "",
};

const byId = (cfg: ContactSettings, id: string) => getContactChannels(cfg).find((c) => c.id === id);

describe("contact channels", () => {
  it("shows exactly four channels: WhatsApp, Telegram, Phone, Email", () => {
    expect(getContactChannels(base).map((c) => c.id)).toEqual(["whatsapp", "telegram", "phone", "email"]);
  });

  it("email opens mailto:m36125265@gmail.com", () => {
    expect(byId(base, "email")?.href).toBe("mailto:m36125265@gmail.com");
  });

  it("telegram opens https://t.me/MahmoudCodeX", () => {
    expect(byId(base, "telegram")?.href).toBe("https://t.me/MahmoudCodeX");
  });

  it("keeps WhatsApp and Phone inactive until approved, even if a number is set", () => {
    const cfg = { ...base, phoneNumber: "+20 100 000 0000" };
    expect(byId(cfg, "whatsapp")?.href).toBeNull();
    expect(byId(cfg, "phone")?.href).toBeNull();
  });

  it("activates wa.me and tel: links once approved", () => {
    const cfg = { ...base, publicPhoneApproved: true, phoneNumber: "+20 100 000 0000" };
    expect(byId(cfg, "whatsapp")?.href).toBe("https://wa.me/201000000000");
    expect(byId(cfg, "phone")?.href).toBe("tel:+201000000000");
  });

  it("the live site config does not publish a phone number yet", () => {
    expect(CONTACT_CONFIG.publicPhoneApproved).toBe(false);
    expect(CONTACT_CONFIG.phoneNumber).toBe("");
  });
});
