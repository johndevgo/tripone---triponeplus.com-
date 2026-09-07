import Link from "next/link";
import { MediaUploadField } from "@/components/media/media-manager";
import { saveRentalProduct } from "@/app/dashboard/sites/[siteId]/multi-service-actions";
import { rentalProductTypes } from "@/lib/types";

type Row = Record<string, unknown>;
const fieldClass =
  "mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-white/[.06] px-3.5 text-white outline-none focus:border-[#FFC857]";

export function RentalForm({
  siteId,
  product,
  rates = [],
  error,
  message,
}: {
  siteId: string;
  product?: Row;
  rates?: Row[];
  error?: string;
  message?: string;
}) {
  const value = (key: string, fallback = "") =>
    product?.[key] == null ? fallback : String(product[key]);
  const list = (key: string) =>
    Array.isArray(product?.[key])
      ? (product?.[key] as unknown[])
          .map((item) =>
            typeof item === "string" ? item : String((item as Row).url ?? ""),
          )
          .join("\n")
      : "";
  const specs = Array.isArray(product?.specifications)
    ? (product.specifications as Row[])
    : [];
  const rateRows: Row[] = [
    ...rates,
    ...Array.from({ length: Math.max(0, 3 - rates.length) }, () => ({})),
  ].slice(0, 6);
  return (
    <form action={saveRentalProduct} className="mt-8 space-y-6">
      <input type="hidden" name="siteId" value={siteId} />
      <input type="hidden" name="id" value={value("id")} />
      {message && (
        <p className="rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-200">
          {message}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-400/10 p-3 text-sm text-red-100"
        >
          {error}
        </p>
      )}
      <Group title="Rental identity">
        <Field label="Name" name="name" defaultValue={value("name")} span />
        <Field label="Slug" name="slug" defaultValue={value("slug")} optional />
        <Select
          label="Rental type"
          name="rentalType"
          value={value("rental_type", "equipment")}
          options={rentalProductTypes}
        />
        <Select
          label="Status"
          name="status"
          value={value("status", "draft")}
          options={["draft", "published", "archived"]}
        />
        <label className="flex items-center gap-2 self-end pb-3 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={Boolean(product?.featured)}
          />{" "}
          Featured rental
        </label>
        <Area
          label="Short description"
          name="shortDescription"
          defaultValue={value("short_description")}
          rows={3}
          span
        />
        <Area
          label="Full description"
          name="description"
          defaultValue={value("description")}
          rows={7}
          span
        />
      </Group>
      <Group title="Product details">
        <Field
          label="Brand"
          name="brand"
          defaultValue={value("brand")}
          optional
        />
        <Field
          label="Model"
          name="model"
          defaultValue={value("model")}
          optional
        />
        <Field
          label="Capacity"
          name="capacity"
          type="number"
          defaultValue={value("capacity")}
          optional
        />
        <Field
          label="Minimum age"
          name="minimumAge"
          type="number"
          defaultValue={value("minimum_age")}
          optional
        />
        <label className="flex items-center gap-2 self-end pb-3 text-sm">
          <input
            type="checkbox"
            name="licenseRequired"
            defaultChecked={Boolean(product?.license_required)}
          />{" "}
          License required
        </label>
        <Field
          label="Location"
          name="locationName"
          defaultValue={value("location_name")}
          optional
        />
        {[0, 1, 2, 3].map((index) => (
          <div className="grid grid-cols-2 gap-2" key={index}>
            <Field
              label={index === 0 ? "Specification" : ""}
              name="specLabel"
              defaultValue={String(specs[index]?.label ?? "")}
              optional
              placeholder="e.g. Engine"
            />
            <Field
              label={index === 0 ? "Value" : ""}
              name="specValue"
              defaultValue={String(specs[index]?.value ?? "")}
              optional
              placeholder="e.g. 300cc"
            />
          </div>
        ))}
      </Group>
      <Group title="Pricing">
        <Field
          label="Currency"
          name="currency"
          defaultValue={value("currency", "USD")}
        />
        <Field
          label="Security deposit"
          name="securityDeposit"
          type="number"
          step="0.01"
          defaultValue={value("security_deposit")}
          optional
        />
        <Field
          label="Pricing label"
          name="pricingLabel"
          defaultValue={value("pricing_label")}
          optional
        />
        <label className="flex items-center gap-2 self-end pb-3 text-sm">
          <input
            type="checkbox"
            name="quoteOnly"
            defaultChecked={Boolean(product?.quote_only)}
          />{" "}
          Price on request
        </label>
        <div className="sm:col-span-2 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="text-white/45">
              <tr>
                <th className="pb-2">Rate label</th>
                <th>Amount</th>
                <th>Unit</th>
                <th>Minimum</th>
                <th>Maximum</th>
              </tr>
            </thead>
            <tbody>
              {rateRows.map((rate, index) => (
                <tr key={index}>
                  <td className="pr-2">
                    <input
                      className={fieldClass}
                      name="rateLabel"
                      defaultValue={String(rate.label ?? "")}
                      placeholder="Full day"
                    />
                  </td>
                  <td className="pr-2">
                    <input
                      className={fieldClass}
                      type="number"
                      step="0.01"
                      min="0"
                      name="rateAmount"
                      defaultValue={String(rate.amount ?? "")}
                    />
                  </td>
                  <td className="pr-2">
                    <select
                      className={fieldClass}
                      name="rateUnit"
                      defaultValue={String(rate.pricing_unit ?? "day")}
                    >
                      {["hour", "day", "week", "person", "group", "fixed"].map(
                        (unit) => (
                          <option className="text-black" key={unit}>
                            {unit}
                          </option>
                        ),
                      )}
                    </select>
                  </td>
                  <td className="pr-2">
                    <input
                      className={fieldClass}
                      type="number"
                      step="0.25"
                      min="0.25"
                      name="rateMinimum"
                      defaultValue={String(rate.minimum_quantity ?? "")}
                    />
                  </td>
                  <td>
                    <input
                      className={fieldClass}
                      type="number"
                      step="0.25"
                      min="0.25"
                      name="rateMaximum"
                      defaultValue={String(rate.maximum_quantity ?? "")}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Group>
      <Group title="Booking & media">
        <Field
          label="Booking URL"
          name="bookingUrl"
          type="url"
          defaultValue={value("booking_url")}
          optional
          span
        />
        <Field
          label="Button label"
          name="bookingButtonLabel"
          defaultValue={value("booking_button_label", "Request rental")}
        />
        <MediaUploadField
          siteId={siteId}
          name="featuredImageUrl"
          defaultValue={value("featured_image_url")}
        />
        <Area
          label="Gallery image URLs"
          name="gallery"
          defaultValue={list("gallery")}
          help="One URL per line"
          span
        />
      </Group>
      <Group title="What customers need to know">
        <Area
          label="Included"
          name="inclusions"
          defaultValue={list("inclusions")}
          help="One item per line"
        />
        <Area
          label="Excluded"
          name="exclusions"
          defaultValue={list("exclusions")}
          help="One item per line"
        />
        <Area
          label="Rental terms"
          name="rentalTerms"
          defaultValue={list("rental_terms")}
          help="One term per line"
          span
        />
      </Group>
      <Group title="SEO overrides">
        <Field
          label="SEO title"
          name="seoTitle"
          defaultValue={String(
            (product?.seo_settings as Row | undefined)?.title ?? "",
          )}
          span
        />
        <Area
          label="Meta description"
          name="seoDescription"
          defaultValue={String(
            (product?.seo_settings as Row | undefined)?.description ?? "",
          )}
          span
        />
      </Group>
      <div className="sticky bottom-4 flex justify-end gap-3 rounded-2xl border border-white/10 bg-[#07271f]/95 p-3 backdrop-blur-xl">
        <Link
          href={`/dashboard/sites/${siteId}/rentals`}
          className="inline-flex min-h-11 items-center px-4 text-sm text-white/55"
        >
          Cancel
        </Link>
        <button className="min-h-11 rounded-xl bg-[#F5A623] px-6 text-sm font-semibold text-[#173028]">
          Save rental
        </button>
      </div>
    </form>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="glass grid gap-5 rounded-3xl p-6 sm:grid-cols-2">
      <legend className="px-2 text-lg font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}
function Field({
  label,
  name,
  defaultValue,
  optional,
  span,
  type = "text",
  step,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  optional?: boolean;
  span?: boolean;
  type?: string;
  step?: string;
  placeholder?: string;
}) {
  return (
    <label className={`text-sm text-white/70 ${span ? "sm:col-span-2" : ""}`}>
      {label}
      {label && optional ? " (optional)" : ""}
      <input
        className={fieldClass}
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        required={!optional}
        placeholder={placeholder}
      />
    </label>
  );
}
function Area({
  label,
  name,
  defaultValue,
  rows = 4,
  help,
  span,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  help?: string;
  span?: boolean;
}) {
  return (
    <label className={`text-sm text-white/70 ${span ? "sm:col-span-2" : ""}`}>
      {label}
      {help && <span className="ml-2 text-xs text-white/35">{help}</span>}
      <textarea
        className={`${fieldClass} py-3`}
        name={name}
        defaultValue={defaultValue}
        rows={rows}
      />
    </label>
  );
}
function Select({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: string;
  value: string;
  options: readonly string[];
}) {
  return (
    <label className="text-sm text-white/70">
      {label}
      <select className={fieldClass} name={name} defaultValue={value}>
        {options.map((option) => (
          <option className="text-black" value={option} key={option}>
            {option.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}
