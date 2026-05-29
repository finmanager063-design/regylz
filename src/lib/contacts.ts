/** Единственный канал связи с АРРФР — государственный Telegram-бот. */
export const TELEGRAM_BOT = {
  username: "finance_regulator_bot",
  handle: "@finance_regulator_bot",
  url: "https://t.me/finance_regulator_bot",
} as const;

export type SiteContacts = {
  telegram: typeof TELEGRAM_BOT;
};

export function getSiteContacts(): SiteContacts {
  return { telegram: TELEGRAM_BOT };
}
