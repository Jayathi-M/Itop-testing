# Xception AI — Frontend Dev Notes

## Stack
- React 18 + TypeScript (TSX)
- Plain CSS modules (no Tailwind)
- React Router v6
- FontAwesome (`@fortawesome/fontawesome-free`)

## Project Structure
```
Frontend/src/
  assets/                  — Logo.svg etc.
  components/Layout/
    Header/Header.tsx       — Returns null (logo/profile moved to Sidebar)
    Sidebar/Sidebar.tsx     — Main nav + all fly-out panels
    Sidebar/Sidebar.css
  layouts/
    Mainlayout.tsx
    Mainlayout.css          — .layout__header { display: none }
  pages/
    UsersList/
      UsersList.tsx / .css  — Users table with Existing/Pending tabs
      NewUser/NewUser.tsx / .css
      EditUser/EditUser.tsx / .css
    Masters/                — (empty — pages to be built)
  router/Approuter.tsx
```

---

## Sidebar Architecture

### Icon rail (72px, #4361EE)
- Logo at top
- Nav buttons stacked: icon + label, `flex-direction: column`
- All icons `color: #ffffff`
- Active state: `background: rgba(250,251,255,0.15)`
- Footer: settings, bell (with red dot), help, avatar (profile dropdown)

### Fly-out panels (all use `.cfg-panel`, 272px wide)
Clicking a nav icon toggles one panel; all others close.

| Nav item | Panel title | State var |
|---|---|---|
| Config | Configuration Center | `cfgOpen` |
| Users | User Management | `usmOpen` |
| Exceptions | Exceptions (Audit) | `auditOpen` |
| Masters | Masters | `mastersOpen` |

### Panel structure (cfg-panel)
**Note: `cfg-panel__head` is currently commented out in all panels — no title/back button is rendered.**
```
.cfg-panel
  <!-- cfg-panel__head commented out -->
  .cfg-panel__body
    .cfg-group       — one per section
      .cfg-group__label
      NavLink.cfg-item  — each item (icon + text)
        .cfg-item__icon
        .cfg-item__text
```

### Masters panel items (MASTERS_GROUPS)
```
Group label: Master Tables
  Master List       → /masters/table/plant
  Table master      → /masters/table/employee
  Groups            → /masters/table/role
  Dashboard Builder → /masters/table/report-template
  Report Builder    → /masters/table/workflow
  Audit Trail       → /masters/table/list-master
```
Single-level cfg-panel, no sub-panel. All routes render `<Placeholderpage>`.

### UMS panel groups
```
User Management: UsersList (/userslist), Role (/role), Approvals (/approvals)
```

### Config panel groups
```
Core Settings:      System, Plant, Asset
Business Logic:     Business Rules, Templates, Workflows
Reporting & Access: Dashboards, Reports, Users
```

### Audit panel items
```
Dashboard, Queue, Record Review, Report, Agent Logs, Audit Trail
```

---

## UsersList Page (`/userslist`)

### Layout (sticky)
- `.ul-page` — `display:flex; flex-direction:column; height:100%; overflow:hidden`
- `.ul-topbar` — sticky, edge-to-edge via `margin: -20px -24px 16px -24px`
- `.ul-card` — `flex:1; display:flex; flex-direction:column`
- `.ul-toolbar` — `flex-shrink:0` (sticky)
- `.ul-table-wrap` — `flex:1; overflow-y:auto` (only this scrolls)
- `thead th` — `position:sticky; top:0`
- `.ul-pagination` — `flex-shrink:0` (sticky at bottom)

### Tabs
- Existing Users — shows MOCK_USERS (7 rows), three-dot action menu (Edit / Delete)
- Pending Invites — shows MOCK_PENDING (8 rows), eye icon action (no border)

### Pagination
Single flex row: `← Previous | page numbers (flex:1 centered) | Next → | Rows per page [dropdown]`
Rows per page options: 5, 10, 15, 20, 25

### Search
Searches ALL columns — name, userId, email, plant, group, role, status (existing); name, userId, plant, group, role (pending)

### Status badges
- Active — green filled pill
- Locked — orange text, no bg
- Inactive — gray text, no bg
- Pending — orange filled pill with border

### Eye button (pending tab)
`border: none; background: none` — no border visible

---

## NewUser Page (`/userslist/new`)

### Layout
Single white card (`border-radius:12px`, `border:#eaecf0`, `shadow`) — fills the page.
- Sticky header: "Add New User" (18px semibold) + subtitle (12px #475467) + X close button
- Scrollable body with inner card
- Sticky footer: Cancel + Create User buttons

### Collapsible sections (gray header + chevron)
1. **Type of creation** — Creation* (select) + Employee ID* (select) — full width
2. **User Information** — First/Middle/Last Name (3-col), Gender + Work Email (2-col)
3. **Organization Details** — Language/Dept (2-col), TimeZone(clock icon)/Org(building icon) (2-col), Company/Plant (2-col)
4. **Access & Permissions** — Roles + Modules (2-col)
5. **Group** — flat checkbox list (Plant A–D), saves to `checkedPlants` state

### Field styling
- Input: `padding: 10px 14px`, `border: #d0d5dd`, `border-radius: 8px`, `shadow-xs`
- Select: custom chevron overlay (`.nu-select-icon`), `appearance: none`
- Labels: 14px medium #344054
- Placeholder: #667085

### Data persistence
Saves to `localStorage('users')`, sets `localStorage('nu_success')` flag, navigates to `/userslist`

---

## Masters Pages (`/masters/table/*`)

All 8 masters routes currently render `<Placeholderpage title="..." />`. Pages are yet to be built.

| Route | Placeholder title |
|---|---|
| `/masters/table/plant` | Plant |
| `/masters/table/employee` | Employee_Master |
| `/masters/table/role` | Role |
| `/masters/table/report-template` | Report_Template |
| `/masters/table/workflow` | Workflow |
| `/masters/table/list-master` | List_Master |
| `/masters/table/dashboard` | Dashboard |
| `/masters/table/service` | Service |

Figma reference node: **484-55715**
Design shows: table with S.NO., Field Name, Label Name, Field type, Field length, Default Value, Created by, Created date, Actions columns.

---

## CSS Naming Conventions
- Page shells: `ul-` (UsersList), `nu-` (NewUser)
- Sidebar: `sb__` (icon rail), `cfg-` (fly-out panels)
- All CSS is kebab-case

## Key CSS Patterns

### Edge-to-edge topbar (breaks out of page padding)
```css
.ul-topbar {
  margin: -20px -24px 16px -24px;
  padding: 12px 24px;
}
```

### Sticky layout (only tbody scrolls)
```css
.page { height:100%; display:flex; flex-direction:column; overflow:hidden; }
.card { flex:1; display:flex; flex-direction:column; min-height:0; }
.table-wrap { flex:1; overflow-y:auto; min-height:0; }
thead th { position:sticky; top:0; z-index:1; }
.pagination { flex-shrink:0; }
```

### Custom select (no native arrow)
```css
.select { appearance: none; padding-right: 36px; }
.select-icon { position:absolute; right:10px; pointer-events:none; }
```

---

## Routes Summary
```
/                        Login
/home, /dashboard        DashboardPage
/userslist               UsersList
/userslist/new           NewUser
/userslist/edit/:id      EditUser
/role                    Role
/audit/queue             AuditQueue
/audit/record-review     RecordReviewList
/audit/record-review/:id RecordReviewDetails
/audit/report            Report
/audit/agent-logs        AgentLogs
/audit/audit-trail       WorkflowAuditTrail
/configurations/system   Systemconfiguration
/masters/table/*         Placeholderpage (8 routes, pages TBD)
```

---

## Figma Design Nodes (reference)
| Page | Node ID |
|---|---|
| Sidebar | 432-54582 |
| UsersList | 432-51819 |
| Pending Invites tab | 432-53145 |
| New User | 432-54108 |
| Masters page | 484-55715 |

---

## Preferences & Decisions
- No Tailwind — plain CSS only
- No component libraries — all SVG icons inline
- `React.ReactElement` not `JSX.Element` (avoids namespace error)
- Rows per page is a `<select>` dropdown (not segmented tabs)
- Masters panel uses `cfg-panel` (same as Config/UMS/Audit) — single level, no sub-panel
- All `cfg-panel__head` blocks are commented out — panels have no visible title/back button
- Eye button in Pending tab has `border:none` (no visible border)
- Search covers ALL columns in both tabs
