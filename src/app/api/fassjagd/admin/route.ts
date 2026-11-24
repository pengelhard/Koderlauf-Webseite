import { NextResponse } from "next/server";
import { loadFassjagdAdmin } from "@/lib/fassjagd/load";
import { fassjagdWeekResponse } from "@/lib/fassjagd/card";
import {
  fassjagdAdminSecret,
  isFassjagdAdmin,
  setAdminCookie,
  clearAdminCookie,
} from "@/lib/fassjagd/admin-auth";
import {
  exportOverrides,
  mergeAlias,
  setExcluded,
  setManualFreeze,
  setPersonGroup,
  clearPersonGroup,
} from "@/lib/fassjagd/store";
import {
  hydrateFassjagdFromDb,
  lastFassjagdPersistError,
  persistFassjagdToDb,
} from "@/lib/fassjagd/persist";
import { normalizeVereinKey } from "@/lib/anmeldungen/vereine";

function unauthorized() {
  return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
}

async function payload() {
  const { board, people } = await loadFassjagdAdmin();
  return { board, people, overrides: exportOverrides() };
}

async function savedPayload() {
  const persisted = await persistFassjagdToDb();
  return {
    ok: true as const,
    persisted,
    persistError: persisted ? null : lastFassjagdPersistError(),
    ...(await payload()),
  };
}

async function mutateAndSave(fn: () => void) {
  await hydrateFassjagdFromDb();
  fn();
  return NextResponse.json(await savedPayload());
}

export async function GET() {
  if (!(await isFassjagdAdmin())) return unauthorized();
  return NextResponse.json(await payload());
}

export async function POST(request: Request) {
  const s = fassjagdAdminSecret();
  if (!s) {
    return NextResponse.json(
      { error: "FASSJAGD_ADMIN_SECRET ist nicht gesetzt." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | {
        action?: string;
        password?: string;
        from?: string;
        to?: string;
        name?: string;
        personId?: string;
        group?: string;
      }
    | null;
  const action = body?.action;

  if (action === "login") {
    if (!body?.password || body.password !== s) {
      return NextResponse.json({ error: "Passwort falsch" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    setAdminCookie(res, s);
    return res;
  }

  if (!(await isFassjagdAdmin())) return unauthorized();

  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    clearAdminCookie(res);
    return res;
  }

  if (action === "merge") {
    return mutateAndSave(() =>
      mergeAlias(body?.from ?? "", body?.to ?? "", normalizeVereinKey),
    );
  }

  if (action === "assign-group") {
    return mutateAndSave(() => setPersonGroup(body?.personId ?? "", body?.group ?? ""));
  }

  if (action === "reset-group") {
    return mutateAndSave(() => clearPersonGroup(body?.personId ?? ""));
  }

  if (action === "exclude" || action === "include") {
    return mutateAndSave(() => setExcluded(body?.name ?? "", action === "exclude"));
  }

  if (action === "freeze") {
    await hydrateFassjagdFromDb();
    const data = await payload();
    setManualFreeze(true, { ...data.board, frozen: true, status: "offiziell" });
    const persisted = await persistFassjagdToDb();
    return NextResponse.json({
      ok: true,
      persisted,
      persistError: persisted ? null : lastFassjagdPersistError(),
      ...data,
      board: { ...data.board, frozen: true, status: "offiziell" },
    });
  }

  if (action === "unfreeze") {
    return mutateAndSave(() => setManualFreeze(false, null));
  }

  if (action === "week-image") {
    const { board } = await payload();
    return await fassjagdWeekResponse(board.ranking);
  }

  return NextResponse.json({ error: "Unbekannte Aktion" }, { status: 400 });
}
