# AgriLink — Role-Based Data Entry & Output Spec (UX/UI + Dedup)

Goal: A mobile-first, bilingual (TH/EN), accessible (WCAG AA), high-performance (Lighthouse ≥ 90) role-based system for data entry and output views across Farmer, Buyer, Inspector, and Admin. Tech: React + Tailwind + shadcn/ui (FE), Node/Express + Prisma + PostgreSQL (BE). Timezone: Asia/Bangkok. Units: °C and %RH.

Contents
- Roles & Forms Matrix (fields, types, required, ranges, defaults)
- UX Rules (must implement)
- Navigation & Wireflow per role
- UI Spec per screen (shadcn/ui, states: empty/loading/error/success)
- Validation & Error Copy (TH/EN) + Zod rules
- Output Views per role + Acceptance Criteria
- Code Architecture for dedup (files to create/refactor)
- API Contracts (type-safe) with TS types
- Test Plan (Unit/Integration/E2E) and edge cases
- Dedup Report (what to remove/merge + impacts)

---

## 1) Roles & Forms Matrix

Legend: R=Required, O=Optional, Type: string/number/date/file/enum, Range/Rules and Default values included.

### Farmer

| Field | Key | Type | R/O | Range/Rules | Default |
|---|---|---|---|---|---|
| Farm | farmId | string (UUID) | R | must exist in farms | — |
| Lot | lotId | string (UUID) | O (R if selecting existing) | if creating new, derive later | — |
| Produce | produce | enum('Longan','Durian','Mango','Banana','Other') or string (<=64) | R | trim, not empty | — |
| Harvest Date | harvestDate | date (ISO) | R | <= today, TZ=Asia/Bangkok | today |
| Quantity | quantityKg | number | R | 0.1–100000 kg, 1 decimal | 1.0 |
| Pre-cool Temp | precoolTempC | number | O | -30…50 °C | — |
| Storage Temp | storageTempC | number | O | -30…50 °C | — |
| Storage Humidity | storageHumPct | number | O | 0…100 %RH | — |
| Notes | notes | string | O | <= 500 chars | — |
| Photos | photos | file[] | O | jpg/png ≤ 10MB each, ≤ 10 files | — |

Shows: My Lots, Last Updated, Latest Temp/Hum, Certificates per Lot, Related Alerts

### Buyer

| Field | Key | Type | R/O | Range/Rules | Default |
|---|---|---|---|---|---|
| Product | product | enum/string | R | <=64 | — |
| Grade | grade | enum('A','B','C','Custom') | R | — | 'A' |
| Quantity | quantityKg | number | R | 1–1,000,000 kg | — |
| Delivery Window | deliveryFrom | date | R | >= today | today |
| Delivery Window End | deliveryTo | date | R | >= deliveryFrom | +7d |
| Destination | destination | string | R | <= 120 chars | — |
| Company | company | string | R | <= 80 | — |
| Contact | contact | string | R | phone/email format | — |

Shows: Quotes received, Order status, Shipment ETA, Temp excursion summary

### Inspector

| Field | Key | Type | R/O | Range/Rules | Default |
|---|---|---|---|---|---|
| Lot | lotId or lotPublicId | string | R | must exist | — |
| Defects # | defects | integer | R | ≥ 0 | 0 |
| Grade | grade | enum('A','B','C','Reject') | R | — | 'A' |
| Notes | notes | string | O | <= 500 | — |
| Photos | photos | file[] | O | jpg/png ≤ 10MB each | — |
| Certificate Type | certType | enum('GAP','Organic','Custom') | O | shown in “Advanced” | — |
| Issuer | issuer | string | O | <= 80 | — |
| Issued At | issuedAt | date | O | <= today | today |
| Expires At | expiresAt | date | O | >= issuedAt | +1y |

Shows: Daily/Weekly KPI, Defect trend, Certificates per Lot/Farm

### Admin

| Field | Key | Type | R/O | Range/Rules | Default |
|---|---|---|---|---|---|
| User Email | email | string | R | email format | — |
| Name | name | string | R | <= 80 | — |
| Role | role | enum('FARMER','BUYER','INSPECTOR','ADMIN') | R | — | 'FARMER' |
| Device Name | deviceName | string | O | <= 64 | — |
| Sensor API Key | apiKey | string | O | <= 128 | — |
| Farm Ownership | farmId | string | O | farm exists | — |
| Lot Ownership | lotId | string | O | lot exists | — |

Shows: System Health, Audit Log, Error Rates, Users/Devices overview

---

## 2) UX Rules (must implement)

- Mobile-first: Single-column forms on mobile; clear section headers.
- Inline Validation: Validate on blur and on submit; short actionable messages (TH/EN).
- Progressive Disclosure: Hide advanced options under “Advanced” toggle.
- Tap target ≥ 44px; correct focus order; complete aria-labels and role attributes.
- Consistent Copy & Icons: Menu/buttons/status must match in TH/EN.
- Feedback: Skeletons for loading; disabled + spinner on submit; toast on success/error.
- Undo/Guard: Confirm before destructive changes; prevent double submit by disabling and debouncing.

---

## 3) Navigation & Wireflow (text)

Top bar: Home, Marketplace, Logistics, Support/QA, Dashboards, Pilot, Language Toggle (TH/EN)

Shortcuts by role:
- Farmer → Create Lot (1 tap), Add Event, Print QR
- Buyer → Create RFQ, View Quotes, Place Order
- Inspector → New Inspection, Upload Certificate
- Admin → Users, Devices, Audit

Flows:
- Farmer: Create Lot → Add Pre-cool Event → Print QR
  1) Tap “Create Lot” → Form opens (Farm, Produce, Harvest Date, Qty, optional Temps).
  2) Inline validation; submit shows spinner; success toast; navigate to Lot detail.
  3) Tap “Add Event” → Pre-cool event sheet (temp/hum/notes/when/place) → submit.
  4) Tap “Print QR” → opens QR dialog → print/download.

- Buyer: Create RFQ → Receive Quote → Confirm Order
  1) Tap “Create RFQ” → form (Product, Grade, Qty, Delivery Window, Destination, Company, Contact).
  2) Submit → RFQ created; navigate to Quotes tab (auto-refresh/polling).
  3) Select quote → “Place Order” → confirm dialog → success toast; order detail.

- Inspector: New Inspection → Upload Certificate → See KPI
  1) Tap “New Inspection” → form (Lot, Defects, Grade, Notes, Photos).
  2) Submit → success toast → option “Upload Certificate” (Advanced fields or certificate tab).
  3) Go to KPI dashboard → see widgets, filter by date; a11y-friendly charts.

- Admin: Register Device → Bind to Lot → Monitor feed
  1) Tap “Devices” → “Register Device” → enter Device Name, API Key.
  2) “Bind to Lot” → select Lot; confirm; success toast.
  3) System Health dashboard shows device online and recent readings.

---

## 4) UI Spec (components & states)

Use shadcn/ui components where available: Form, Input, Textarea, Select, DatePicker, Dropzone/Uploader, Card, Table, Tabs, Dialog/Sheet, Toast, Alert, Badge, Pagination, Skeleton.

Reusable patterns:
- <FormField/>: label + help + error + required indicator.
- <DataTable/>: sortable, paginated, responsive table.
- <KpiCard/>: label, value, delta, tooltip.
- <Uploader/>: size/type limits, preview.
- <Charts/>: line/bar with aria-label and descriptions.

Screen specs (high level):
- Farmer Dashboard: KpiCard (Lots, Last Update), DataTable (My Lots), Buttons: Add Event, Print QR. States: empty (copy: TH/EN), loading (Skeleton), error (Alert), success (Toast).
- Create Lot Form: Form + Input/Select/DatePicker/Textarea/Uploader; Advanced collapsible for optional temps; SubmitBar with primary action.
- Buyer RFQ/Quotes/Orders: Tabs with 3 tables; Filter + Export; Badges for status.
- Inspector KPI: Grid of KpiCards; Charts for Avg-Temp and Defects by day; Certificate list with download.
- Admin Users/Devices/Audit: DataTable for each; Device Registration dialog; Audit filters by entity/actor/date.

State copy (examples):
- Empty TH: “ยังไม่มีข้อมูล” / EN: “No data yet”
- Loading TH: “กำลังโหลด...” / EN: “Loading...”
- Error TH: “เกิดข้อผิดพลาด กรุณาลองใหม่” / EN: “Something went wrong. Please try again.”
- Success TH: “บันทึกสำเร็จ” / EN: “Saved successfully”

---

## 5) Validation & Error Copy (Zod + TH/EN)

Shared rules (frontend & backend):
- tempC: number().min(-30).max(50)
- humPct: number().min(0).max(100)
- defects: number().int().min(0)
- file: union(pdf/jpg/png).size ≤ 10MB
- dates TZ: Asia/Bangkok; validate logical order (from ≤ to)

Error Dictionary (TH/EN):
- Temperature must be between -30 and 50 °C
  - TH: “อุณหภูมิต้องอยู่ระหว่าง -30 ถึง 50 °C”
  - EN: “Temperature must be between -30 and 50 °C”
- Humidity must be between 0 and 100 %RH
  - TH: “ความชื้นต้องอยู่ระหว่าง 0 ถึง 100 %RH”
  - EN: “Humidity must be between 0 and 100 %RH”
- Quantity must be positive
  - TH: “ปริมาณต้องมากกว่า 0”
  - EN: “Quantity must be greater than 0”
- Required field
  - TH: “จำเป็นต้องกรอก”
  - EN: “This field is required”
- Invalid email
  - TH: “อีเมลไม่ถูกต้อง”
  - EN: “Invalid email address”
- File too large (max 10MB)
  - TH: “ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB)”
  - EN: “File is too large (max 10MB)”

Example Zod schemas (TypeScript):

```ts
import { z } from 'zod'

export const lotSchema = z.object({
  farmId: z.string().uuid(),
  produce: z.string().min(1).max(64),
  harvestDate: z.string().datetime(),
  quantityKg: z.number().min(0.1).max(100000),
  precoolTempC: z.number().min(-30).max(50).optional(),
  storageTempC: z.number().min(-30).max(50).optional(),
  storageHumPct: z.number().min(0).max(100).optional(),
  notes: z.string().max(500).optional(),
})

export const rfqSchema = z.object({
  product: z.string().min(1).max(64),
  grade: z.enum(['A','B','C','Custom']),
  quantityKg: z.number().min(1).max(1_000_000),
  deliveryFrom: z.string().datetime(),
  deliveryTo: z.string().datetime(),
  destination: z.string().min(1).max(120),
  company: z.string().min(1).max(80),
  contact: z.string().min(3).max(120),
})

export const inspectionSchema = z.object({
  lotId: z.string().min(1),
  defects: z.number().int().min(0),
  grade: z.enum(['A','B','C','Reject']),
  notes: z.string().max(500).optional(),
})
```

---

## 6) Output Views per role + Acceptance Criteria

Farmer:
- DataTable “My Lots” (columns: Lot, Produce, Status, Last Updated, QR)
- KpiCard: Latest Temp/Hum (per lot)
- Actions: Add Event, Print QR
- Acceptance: complete main task ≤ 3 taps; no horizontal scroll; read primary values ≤ 3 sec.

Buyer:
- Unified table RFQ/Quote/Order with status badges; filters; export CSV.
- Acceptance: create RFQ ≤ 3 taps; find latest quote ≤ 3 sec.

Inspector:
- KPI cards: Total Inspections, Defects, Defect Rate, Temp Excursions
- Charts: Avg-Temp & Defects by day (ARIA-described)
- Certificate list with download
- Acceptance: record inspection ≤ 3 taps; KPI visible ≤ 3 sec.

Admin:
- Users/Devices tables; Device Registration dialog; Audit Log with filters.
- Acceptance: register device ≤ 3 taps; audit search ≤ 3 sec.

---

## 7) API Contracts (type-safe)

Auth header: Authorization: Bearer <token> (RBAC enforced). All times ISO 8601 (Asia/Bangkok for business logic).

Endpoints (summary):

| Endpoint | Method | Roles | Body | Response |
|---|---|---|---|---|
| POST /api/lots | POST | FARMER, ADMIN | { farmId, produce, harvestDate, quantityKg, precoolTempC?, storageTempC?, storageHumPct?, notes? } | { id, publicId, ... }
| POST /api/lots/:id/events | POST | FARMER, ADMIN | { type, tempC?, humPct?, note?, at?, place? } | { id, ... }
| GET /api/public/lot/:publicId | GET | PUBLIC | — | { lot, events[] }
| POST /api/rfq | POST | BUYER | { product, grade, quantityKg, deliveryFrom, deliveryTo, destination, company, contact } | { id, ... }
| GET /api/rfq/:id/quotes | GET | BUYER | — | [{ id, price, currency, validUntil, vendor }]
| POST /api/orders | POST | BUYER | { rfqId, quoteId } | { id, status }
| POST /api/qa/inspections | POST | INSPECTOR, ADMIN | { lotId|lotPublicId, defects, grade, notes? } | { id }
| GET /api/qa/kpi | GET | INSPECTOR, ADMIN | { lotPublicId?, from, to } | { totals, series }
| POST /api/certificates | POST (multipart) | INSPECTOR, ADMIN | fields: { type, issuer, issuedAt, expiresAt, farmId|lotPublicId }, file: pdf/jpg/png | { id, url }
| POST /api/devices | POST | ADMIN | { deviceName, apiKey } | { id }
| POST /api/devices/:id/bind | POST | ADMIN | { lotId } | { ok }
| GET /api/audit | GET | ADMIN | { entity?, actor?, from?, to? } | { items, nextCursor? }

TypeScript types (shared):

```ts
export type Role = 'FARMER'|'BUYER'|'INSPECTOR'|'ADMIN'

export interface Lot { id: string; publicId: string; farmId: string; produce: string; harvestDate: string; quantityKg: number; }
export interface LotEvent { id: string; lotId: string; type: 'temperature'|'note'; tempC?: number; humPct?: number; note?: string; at: string; place?: string }
export interface RFQ { id: string; product: string; grade: string; quantityKg: number; deliveryFrom: string; deliveryTo: string; destination: string; company: string; contact: string }
export interface Quote { id: string; rfqId: string; price: number; currency: string; validUntil: string; vendor: string }
export interface Order { id: string; rfqId: string; quoteId: string; status: 'PLACED'|'CONFIRMED'|'SHIPPED'|'DELIVERED'|'CANCELLED' }
export interface Inspection { id: string; lotId: string; defects: number; grade: 'A'|'B'|'C'|'Reject'; notes?: string }
```

---

## 8) Code Architecture (dedup)

Frontend (apps/frontend/src):
- schemas/ (Zod)
  - lot.ts, rfq.ts, inspection.ts, certificate.ts, user.ts, device.ts
- components/form/
  - FormField.tsx, FieldGroup.tsx, SubmitBar.tsx
- components/data/
  - DataTable.tsx, KpiCard.tsx, Charts.tsx
- components/uploader/
  - Uploader.tsx (Dropzone wrapper with size/type limits, preview)
- hooks/
  - useFormPersist.ts, usePaginatedList.ts, useUpload.ts, useToastErrors.ts
- locales/
  - en.json, th.json (no hardcoded UI strings)
- utils/
  - api.ts (all HTTP), i18n.ts, constants.ts (thresholds, limits), date.ts (TZ helpers)
- pages/
  - Farmer/*, Buyer/*, Inspector/*, Admin/* (thin pages using reusable components)

Backend (apps/backend/src):
- services/* (lots.ts, rfq.ts, qa.ts, certificates.ts, devices.ts, audit.ts)
- routes/* thin controllers calling services
- prisma/* schema & migrations

Refactor rules:
- All forms use shared <FormField/> and shared Zod schemas.
- No duplicate fetch logic—everything through utils/api.ts with centralized error handling and token refresh.
- Constants in utils/constants.ts; date/tz helpers in utils/date.ts.
- Graphs and tables must be generic components.

Definition of Done for Dedup: a code search for duplicate fetch wrappers or schema definitions should return ≤ 1 occurrence.

Performance & A11y:
- Code-split per role dashboard (lazy routes); preconnect to API & fonts; responsive images; aria-* on charts; focus management in dialogs.

---

## 9) Test Plan

Unit:
- Zod schemas: valid/invalid cases per field (temp ranges, humidity, defects, emails, file sizes).
- Utils: date normalization (Asia/Bangkok), api error mapping, i18n key resolution.

Integration:
- Submit/response against key endpoints (mock server). Verify RBAC enforcement.
- File upload size/type handling with multipart.

E2E (mobile viewport):
- Farmer Create Lot → Add Event → Print QR.
- Buyer Create RFQ → View Quotes → Place Order.
- Inspector New Inspection → Upload Certificate → View KPI.
- Admin Register Device → Bind Lot → Monitor.

Edge cases:
- temp out of range; file >10MB; network drop mid-submit; token expiration; language toggle mid-flow; timezone conversion around midnight.

---

## 10) Dedup Report (planned changes)

To Remove/Combine/Refactor:
- Duplicate ad-hoc form components → replace with components/form/FormField.tsx and FieldGroup.tsx.
- Any repeated fetch wrappers in pages → consolidate to utils/api.ts.
- Hardcoded UI strings in pages → move to locales/{en,th}.json and access via i18n.
- Repeated table/chart markup → components/data/{DataTable,Charts}.tsx.

Impacts:
- Pages become thinner and easier to test; unit tests target schemas and components, not each page separately.
- Translation keys enable consistent copy and easier updates.

Links (existing/new):
- Existing: apps/frontend/src/utils/api.ts (keep as the single HTTP client)
- New: apps/frontend/src/schemas/*, components/form/*, components/data/*, locales/*, hooks/*

---

## Example i18n Keys (extract)

en.json
```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "loading": "Loading...",
    "noData": "No data yet",
    "errorGeneric": "Something went wrong. Please try again.",
    "saved": "Saved successfully"
  },
  "farmer": {
    "createLot": "Create Lot",
    "addEvent": "Add Event",
    "printQR": "Print QR"
  }
}
```

th.json
```json
{
  "common": {
    "save": "บันทึก",
    "cancel": "ยกเลิก",
    "delete": "ลบ",
    "loading": "กำลังโหลด...",
    "noData": "ยังไม่มีข้อมูล",
    "errorGeneric": "เกิดข้อผิดพลาด กรุณาลองใหม่",
    "saved": "บันทึกสำเร็จ"
  },
  "farmer": {
    "createLot": "สร้างล็อต",
    "addEvent": "เพิ่มเหตุการณ์",
    "printQR": "พิมพ์ QR"
  }
}
```

---

## Notes

- All date inputs/outputs should normalize to Asia/Bangkok; store UTC in DB, convert in UI.
- Temperature unit: °C; Humidity: %RH.
- Enforce RBAC in UI (hide/disable with rationale) and API (middlewares).
- Maintain Lighthouse Mobile ≥ 90 via route-level code-splitting, lazy data queries, preconnect, and image optimization.
