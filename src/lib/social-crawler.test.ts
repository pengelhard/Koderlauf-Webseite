import assert from "node:assert/strict";
import test from "node:test";
import { isSocialCrawler } from "./social-crawler.ts";

test("WhatsApp und Facebook-Crawler erkennen", () => {
  assert.equal(isSocialCrawler("facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"), true);
  assert.equal(isSocialCrawler("WhatsApp/10.2.1"), true);
  assert.equal(isSocialCrawler("Mozilla/5.0 (iPhone) Safari"), false);
  assert.equal(isSocialCrawler(null), false);
});
