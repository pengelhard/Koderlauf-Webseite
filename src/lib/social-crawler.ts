/** Crawler, die Link-Vorschauen holen (WhatsApp nutzt facebookexternalhit). */
const SOCIAL_CRAWLER =
  /facebookexternalhit|Facebot|WhatsApp|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot|Pinterest|Iframely/i;

export function isSocialCrawler(userAgent: string | null | undefined): boolean {
  return Boolean(userAgent && SOCIAL_CRAWLER.test(userAgent));
}
