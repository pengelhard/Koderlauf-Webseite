import assert from "node:assert/strict";
import test from "node:test";
import { getSiteUrlFromHost, hostFromHeaders } from "./site-url.ts";

function headerMap(values: Record<string, string | null>) {
  return {
    get(name: string) {
      return values[name.toLowerCase()] ?? null;
    },
  };
}

test("Testdomain-Host schlägt vercel.app x-forwarded-host", () => {
  const host = hostFromHeaders(
    headerMap({
      host: "test.koderlauf.de",
      "x-forwarded-host": "koderlauf-git-main-example.vercel.app",
    }),
  );
  assert.equal(host, "test.koderlauf.de");
  assert.equal(getSiteUrlFromHost(host), "https://test.koderlauf.de");
});

test("Production-Host bleibt koderlauf.de", () => {
  assert.equal(getSiteUrlFromHost("koderlauf.de"), "https://koderlauf.de");
  assert.equal(getSiteUrlFromHost("www.koderlauf.de"), "https://koderlauf.de");
});
