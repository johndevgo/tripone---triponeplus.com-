import {
  Activity,
  Building2,
  CalendarClock,
  Database,
  Globe2,
  MailCheck,
  ShieldCheck,
  UserRoundCog,
  Users,
} from "lucide-react";
import Link from "next/link";
import { requirePlatformMember } from "@/lib/platform/admin";
import { formatPlanPrice } from "@/lib/platform/config";
import {
  deleteManagedAccount,
  grantPlatformRole,
  revokePlatformRole,
  sendManagedPasswordReset,
  unsubscribeRetainedContact,
  updateEntitlement,
  updatePlatformSettings,
} from "./actions";

export default async function SuperAdmin({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string; page?: string }>;
}) {
  const query = await searchParams;
  const page = Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1);
  const { admin, user: currentUser } = await requirePlatformMember([
    "super_admin",
  ]);
  const usersResult = await admin.auth.admin.listUsers({ page, perPage: 50 });
  if (usersResult.error) throw usersResult.error;
  const users = usersResult.data.users;
  const userIds = users.map((user) => user.id);
  const [
    settingsResult,
    membersResult,
    entitlementsResult,
    retainedResult,
    auditsResult,
    sitesCount,
    publishedCount,
    businessesCount,
    leadsCount,
    bookingsCount,
    eventsCount,
  ] = await Promise.all([
    admin.from("platform_settings").select("*").eq("id", 1).single(),
    admin.from("platform_members").select("user_id,role,created_at"),
    admin
      .from("account_entitlements")
      .select("user_id,plan_code,status,free_until,annual_price,currency")
      .in("user_id", userIds.length ? userIds : [currentUser.id]),
    admin
      .from("retained_contacts")
      .select("email,last_account_deleted_at,deletion_reason,unsubscribed_at")
      .order("last_account_deleted_at", { ascending: false })
      .limit(20),
    admin
      .from("platform_audit_log")
      .select("id,action,actor_id,target_user_id,details,created_at")
      .order("created_at", { ascending: false })
      .limit(20),
    count(admin, "sites"),
    count(admin, "sites", { column: "status", value: "published" }),
    count(admin, "businesses"),
    count(admin, "leads"),
    count(admin, "bookings"),
    count(admin, "analytics_events"),
  ]);
  if (settingsResult.error) throw settingsResult.error;
  const settings = settingsResult.data;
  const members = new Map(
    (membersResult.data ?? []).map((item) => [item.user_id, item.role]),
  );
  const entitlements = new Map(
    (entitlementsResult.data ?? []).map((item) => [item.user_id, item]),
  );
  const metrics = [
    [Users, "Auth users", usersResult.data.total ?? users.length],
    [Building2, "Businesses", businessesCount],
    [Globe2, "Websites", sitesCount],
    [ShieldCheck, "Published", publishedCount],
    [MailCheck, "Leads", leadsCount],
    [CalendarClock, "Bookings", bookingsCount],
    [Activity, "Tracked events", eventsCount],
  ] as const;
  const totalUsers = usersResult.data.total ?? users.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / 50));

  return (
    <>
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-[#95ee8e]">
            Platform control
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
            TripOne+ command center
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-white/50">
            Real account, website, operations and acquisition signals. No
            invented revenue or vanity metrics.
          </p>
        </div>
        <span className="w-fit rounded-full border border-emerald-300/15 bg-emerald-300/10 px-4 py-2 text-xs text-emerald-100">
          Service-role protected
        </span>
      </div>

      <Notice message={query.message} error={query.error} />

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
        {metrics.map(([Icon, label, value]) => (
          <article className="glass rounded-2xl p-5" key={label}>
            <Icon size={18} className="text-emerald-300" />
            <p className="mt-5 text-2xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-white/40">{label}</p>
          </article>
        ))}
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <section className="glass rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <Database className="text-[#95ee8e]" />
            <div>
              <h2 className="text-xl font-semibold">
                Commercial and retention policy
              </h2>
              <p className="mt-1 text-sm text-white/40">
                These values drive new-account entitlements and public pricing.
              </p>
            </div>
          </div>
          <form
            action={updatePlatformSettings}
            className="mt-6 grid gap-4 sm:grid-cols-2"
          >
            <Field
              label="Free access (years)"
              name="foundingFreeYears"
              type="number"
              defaultValue={settings.founding_free_years}
            />
            <Field
              label="Inactive deletion (days)"
              name="inactivityDays"
              type="number"
              defaultValue={settings.inactivity_days}
            />
            <Field
              label="Annual renewal price"
              name="annualPrice"
              type="number"
              defaultValue={settings.annual_price}
            />
            <Field
              label="Currency"
              name="currency"
              defaultValue={settings.currency}
            />
            <label className="flex items-center gap-3 text-sm text-white/65 sm:col-span-2">
              <input
                name="retentionEnabled"
                type="checkbox"
                defaultChecked={settings.retention_enabled}
                className="size-4 accent-[#5bcd57]"
              />
              Enable daily inactive-account cleanup
            </label>
            <button className="min-h-11 w-fit rounded-xl bg-[#5bcd57] px-5 font-semibold text-[#173028] sm:col-span-2">
              Save platform policy
            </button>
          </form>
          <p className="mt-5 rounded-xl bg-white/[.04] p-4 text-sm text-white/45">
            Current offer: {settings.founding_free_years} years free, then{" "}
            {formatPlanPrice(Number(settings.annual_price), settings.currency)}{" "}
            per year. Accounts become eligible for deletion after{" "}
            {settings.inactivity_days} days without a sign-in.
          </p>
        </section>

        <section className="glass rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <UserRoundCog className="text-[#95ee8e]" />
            <div>
              <h2 className="text-xl font-semibold">Platform access</h2>
              <p className="mt-1 text-sm text-white/40">
                Grant only the minimum operational role.
              </p>
            </div>
          </div>
          <form
            action={grantPlatformRole}
            className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]"
          >
            <input
              name="email"
              type="email"
              required
              placeholder="confirmed-user@example.com"
              className={inputClass}
            />
            <select name="role" className={inputClass} defaultValue="analyst">
              <option className="text-black" value="analyst">
                Analyst
              </option>
              <option className="text-black" value="support">
                Support
              </option>
              <option className="text-black" value="super_admin">
                Super admin
              </option>
            </select>
            <button className="min-h-11 rounded-xl border border-white/15 px-4 text-sm sm:col-span-2">
              Grant role
            </button>
          </form>
          <div className="mt-5 grid gap-2">
            {(membersResult.data ?? []).map((member) => {
              const account = users.find((item) => item.id === member.user_id);
              return (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white/[.04] p-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate text-white/75">
                      {account?.email ?? member.user_id}
                    </p>
                    <p className="mt-1 text-xs capitalize text-white/35">
                      {member.role.replace("_", " ")}
                    </p>
                  </div>
                  {member.user_id !== currentUser.id && (
                    <form action={revokePlatformRole}>
                      <input
                        type="hidden"
                        name="userId"
                        value={member.user_id}
                      />
                      <button className="rounded-lg border border-red-300/15 px-3 py-2 text-xs text-red-100">
                        Remove
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="glass mt-5 overflow-hidden rounded-3xl">
        <div className="border-b border-white/10 p-6">
          <h2 className="text-xl font-semibold">Users and entitlements</h2>
          <p className="mt-1 text-sm text-white/40">
            Up to 50 accounts per page. Passwords are never visible; resets use
            secure email links.
          </p>
        </div>
        <div className="divide-y divide-white/8">
          {users.map((user) => {
            const entitlement = entitlements.get(user.id);
            return (
              <article
                key={user.id}
                className="grid gap-5 p-5 xl:grid-cols-[1fr_1fr_auto] xl:items-center"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {user.email ?? "Email unavailable"}
                  </p>
                  <p className="mt-1 text-xs text-white/35">
                    Joined {date(user.created_at)} · Last sign-in{" "}
                    {user.last_sign_in_at
                      ? date(user.last_sign_in_at)
                      : "never"}
                  </p>
                  {members.has(user.id) && (
                    <span className="mt-2 inline-flex rounded-full bg-[#95ee8e]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#95ee8e]">
                      {members.get(user.id)?.replace("_", " ")}
                    </span>
                  )}
                </div>
                {entitlement ? (
                  <form
                    action={updateEntitlement}
                    className="grid gap-2 sm:grid-cols-[auto_1fr_auto]"
                  >
                    <input type="hidden" name="userId" value={user.id} />
                    <select
                      name="status"
                      defaultValue={entitlement.status}
                      className={inputClass}
                    >
                      {["active", "grace", "expired", "suspended"].map(
                        (status) => (
                          <option
                            className="text-black"
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ),
                      )}
                    </select>
                    <input
                      aria-label={`Free until for ${user.email}`}
                      type="date"
                      name="freeUntil"
                      defaultValue={entitlement.free_until.slice(0, 10)}
                      className={inputClass}
                    />
                    <button className="min-h-10 rounded-lg border border-white/15 px-3 text-xs">
                      Save
                    </button>
                  </form>
                ) : (
                  <p className="text-sm text-amber-100">Entitlement missing</p>
                )}
                <div className="flex flex-wrap gap-2 xl:justify-end">
                  <form action={sendManagedPasswordReset}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button className="min-h-9 rounded-lg border border-white/15 px-3 text-xs">
                      Send reset
                    </button>
                  </form>
                  {user.id !== currentUser.id &&
                    !members.has(user.id) &&
                    user.email && (
                      <details className="relative">
                        <summary className="flex min-h-9 cursor-pointer list-none items-center rounded-lg border border-red-300/15 px-3 text-xs text-red-100">
                          Delete
                        </summary>
                        <form
                          action={deleteManagedAccount}
                          className="absolute right-0 z-10 mt-2 w-72 rounded-2xl border border-red-300/15 bg-[#0a2b22] p-4 shadow-2xl"
                        >
                          <input type="hidden" name="userId" value={user.id} />
                          <p className="text-xs leading-5 text-white/50">
                            Type {user.email} to permanently remove the Auth
                            account, owned records and storage.
                          </p>
                          <input
                            name="confirmation"
                            required
                            className={`${inputClass} mt-3`}
                          />
                          <button className="mt-3 min-h-10 w-full rounded-lg bg-red-300/15 text-xs text-red-100">
                            Delete permanently
                          </button>
                        </form>
                      </details>
                    )}
                </div>
              </article>
            );
          })}
        </div>
        {totalPages > 1 && (
          <nav
            aria-label="User pagination"
            className="flex items-center justify-between border-t border-white/10 p-5 text-sm"
          >
            <Link
              aria-disabled={page <= 1}
              href={
                page <= 1 ? "/super-admin" : `/super-admin?page=${page - 1}`
              }
              className={
                page <= 1
                  ? "pointer-events-none text-white/20"
                  : "text-white/65"
              }
            >
              Previous
            </Link>
            <span className="text-white/35">
              Page {page} of {totalPages}
            </span>
            <Link
              aria-disabled={page >= totalPages}
              href={
                page >= totalPages
                  ? `/super-admin?page=${page}`
                  : `/super-admin?page=${page + 1}`
              }
              className={
                page >= totalPages
                  ? "pointer-events-none text-white/20"
                  : "text-white/65"
              }
            >
              Next
            </Link>
          </nav>
        )}
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <section className="glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold">Opted-in retained contacts</h2>
          <p className="mt-1 text-sm text-white/40">
            Only addresses with explicit communications consent remain after
            account deletion.
          </p>
          <div className="mt-5 grid gap-2">
            {(retainedResult.data ?? []).length ? (
              (retainedResult.data ?? []).map((contact) => (
                <div
                  key={contact.email}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white/[.04] p-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate">{contact.email}</p>
                    <p className="mt-1 text-xs text-white/35">
                      {contact.deletion_reason.replaceAll("_", " ")} ·{" "}
                      {date(contact.last_account_deleted_at)}
                    </p>
                  </div>
                  {!contact.unsubscribed_at && (
                    <form action={unsubscribeRetainedContact}>
                      <input type="hidden" name="email" value={contact.email} />
                      <button className="rounded-lg border border-white/15 px-3 py-2 text-xs">
                        Unsubscribe
                      </button>
                    </form>
                  )}
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-white/35">
                No retained contacts.
              </p>
            )}
          </div>
        </section>
        <section className="glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold">Recent audit activity</h2>
          <p className="mt-1 text-sm text-white/40">
            Immutable operational evidence for privileged actions.
          </p>
          <div className="mt-5 grid gap-2">
            {(auditsResult.data ?? []).length ? (
              (auditsResult.data ?? []).map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl bg-white/[.04] p-3 text-sm"
                >
                  <div className="flex justify-between gap-4">
                    <strong className="font-medium text-white/75">
                      {entry.action}
                    </strong>
                    <span className="text-xs text-white/30">
                      {date(entry.created_at)}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-white/30">
                    Target: {entry.target_user_id ?? "platform"}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-white/35">
                No privileged actions recorded yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

const inputClass =
  "min-h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white";

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string | number;
  type?: string;
}) {
  return (
    <label className="text-sm text-white/65">
      {label}
      <input
        className={`${inputClass} mt-2`}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required
      />
    </label>
  );
}

function Notice({ message, error }: { message?: string; error?: string }) {
  if (!message && !error) return null;
  return (
    <p
      role={error ? "alert" : "status"}
      className={`mt-6 rounded-xl border p-4 text-sm ${error ? "border-red-300/15 bg-red-300/10 text-red-100" : "border-emerald-300/15 bg-emerald-300/10 text-emerald-100"}`}
    >
      {error ?? message}
    </p>
  );
}

function date(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

async function count(
  admin: Awaited<ReturnType<typeof requirePlatformMember>>["admin"],
  table: string,
  filter?: { column: string; value: string },
) {
  let query = admin.from(table).select("id", { count: "exact", head: true });
  if (filter) query = query.eq(filter.column, filter.value);
  const { count: total } = await query;
  return total ?? 0;
}
