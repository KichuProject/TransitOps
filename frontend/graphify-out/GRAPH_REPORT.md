# Graph Report - C:\Users\KISHO\OneDrive\Documents\Desktop\TransitOps\TransitOps\frontend  (2026-07-12)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 123 nodes · 324 edges · 10 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fce55e08`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useMockData
- Drivers.jsx
- devDependencies
- dependencies
- MockDataContext.jsx
- package.json
- Login.jsx

## God Nodes (most connected - your core abstractions)
1. `useMockData()` - 29 edges
2. `Button()` - 13 edges
3. `Card()` - 9 edges
4. `Table()` - 9 edges
5. `Badge()` - 8 edges
6. `Input` - 8 edges
7. `Modal()` - 8 edges
8. `EmptyState()` - 7 edges
9. `Select` - 7 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Login()` --references--> `INITIAL_USERS`  [EXTRACTED]
  src/pages/Login.jsx → src/constants/mockData.js
- `Login()` --calls--> `useMockData()`  [EXTRACTED]
  src/pages/Login.jsx → src/context/MockDataContext.jsx
- `MainLayout()` --calls--> `useMockData()`  [EXTRACTED]
  src/components/layout/MainLayout.jsx → src/context/MockDataContext.jsx
- `Sidebar()` --calls--> `useMockData()`  [EXTRACTED]
  src/components/layout/Sidebar.jsx → src/context/MockDataContext.jsx
- `TopNavbar()` --calls--> `useMockData()`  [EXTRACTED]
  src/components/layout/TopNavbar.jsx → src/context/MockDataContext.jsx

## Import Cycles
- None detected.

## Communities (10 total, 0 thin omitted)

### Community 0 - "useMockData"
Cohesion: 0.15
Nodes (18): App(), Breadcrumb(), MainLayout(), Sidebar(), TopNavbar(), Badge(), ToastContainer(), MockDataProvider() (+10 more)

### Community 1 - "Drivers.jsx"
Cohesion: 0.40
Nodes (9): Button(), Card(), ConfirmDialog(), EmptyState(), Input, Modal(), Pagination(), Select (+1 more)

### Community 2 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+11 more)

### Community 3 - "dependencies"
Cohesion: 0.11
Nodes (19): framer-motion, dependencies, framer-motion, react, react-dom, react-hook-form, react-icons, react-router-dom (+11 more)

### Community 4 - "MockDataContext.jsx"
Cohesion: 0.35
Nodes (8): INITIAL_DRIVERS, INITIAL_EXPENSES, INITIAL_FUEL, INITIAL_MAINTENANCE, INITIAL_TRIPS, INITIAL_USERS, INITIAL_VEHICLES, MockDataContext

### Community 5 - "package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 6 - "Login.jsx"
Cohesion: 0.43
Nodes (4): ShinyText(), SpotlightCard(), Login(), NotFound()

## Knowledge Gaps
- **27 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `useMockData()` connect `useMockData` to `Drivers.jsx`, `MockDataContext.jsx`, `Login.jsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._