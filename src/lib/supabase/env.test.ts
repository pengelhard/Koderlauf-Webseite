import assert from "node:assert/strict";
import test from "node:test";
import {
  hasAdminSupabaseConfig,
  hasPublicSupabaseConfig,
  supabasePublishableKey,
  supabaseSecretKey,
  supabaseUrl,
} from "./env.ts";

function restore(prev: NodeJS.ProcessEnv, keys: string[]) {
  for (const key of keys) {
    const value = prev[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

test("liest Publishable-Key aus ANON oder PUBLISHABLE", () => {
  const prev = { ...process.env };
  try {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://rrhcoelbplyiwczzkrjl.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "sb_publishable_test";
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    assert.equal(supabaseUrl(), "https://rrhcoelbplyiwczzkrjl.supabase.co");
    assert.equal(supabasePublishableKey(), "sb_publishable_test");
    assert.equal(hasPublicSupabaseConfig(), true);

    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_neu";
    assert.equal(supabasePublishableKey(), "sb_publishable_neu");

    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://placeholder.supabase.co";
    assert.equal(hasPublicSupabaseConfig(), false);
  } finally {
    restore(prev, [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ]);
  }
});

test("Secret-Key nur serverseitig", () => {
  const prev = { ...process.env };
  try {
    delete process.env.SUPABASE_SECRET_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    assert.equal(supabaseSecretKey(), null);
    assert.equal(hasAdminSupabaseConfig(), false);
    process.env.SUPABASE_SERVICE_ROLE_KEY = "legacy-service";
    assert.equal(supabaseSecretKey(), "legacy-service");
    process.env.SUPABASE_SECRET_KEY = "sb_secret_x";
    assert.equal(supabaseSecretKey(), "sb_secret_x");
  } finally {
    restore(prev, ["SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY"]);
  }
});
