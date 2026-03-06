# job-scraper

A configurable web scraper for job listings, driven by YAML connector files. It navigates job portals, handles pagination, extracts job details, and exports everything to a formatted `.xlsx` report.

## Requirements

- [Bun](https://bun.sh) v1.3+
- [Chromium](https://www.chromium.org/) (installed via Playwright)

## Installation

```bash
bun install
bunx playwright install chromium
```

## Configuration

### 1. `find_job.json`

This file tells the scraper **which connectors to run** and **what to search for**. Create it at the root of the project based on the example:

```bash
cp find_job.example.json find_job.json
```

Then edit it:

```json
[
  { "id": "nttdata", "term": "developer" },
  { "id": "nexti",   "term": "backend" }
]
```

Each entry must match the `id` of an existing connector in `src/connectors/`. The `term` field (and any other fields you add) are used as placeholders in the connector YAML — `{{term}}` in the YAML will be replaced with the value from this file.

> `find_job.json` is gitignored so your search terms stay private.

---

### 2. Connector YAML

Connectors live in `src/connectors/` and describe how to scrape a specific job portal. Each connector is a `.yml` file with the following structure:

```yaml
id: my-connector

jobList:
  mainPage: https://example.com/jobs

  # Steps executed before pagination (search, dismiss cookies, etc.)
  steps:
    - name: Dismiss cookie banner
      action:
        type: click
        timeout: 1000        # optional: wait up to 1000ms before clicking
      locator:
        frame:               # optional: if the element is inside an iframe
          value: "#cookie-iframe"
        strategy: role
        role: button
        options:
          name: Decline

    - name: Fill search term
      action:
        type: fill
        value: "{{term}}"    # replaced by find_job.json at runtime
      locator:
        strategy: placeholder
        value: Search jobs...

    - name: Submit
      action:
        type: click
      locator:
        strategy: role
        role: button
        options:
          name: Search

  pagination:
    startPage: 1
    extractStep:
      name: Get job links
      action:
        type: attribute
        value: href           # HTML attribute to extract
      locator:
        strategy: css
        value: "a.job-link"

    nextPageStep:
      name: Go to next page
      action:
        type: click
      locator:
        strategy: text
        value: "{{next_page}}" # replaced automatically with the next page number

jobInfo:
  # Steps executed on each job detail page before extracting info
  steps:
    - name: Dismiss cookie banner
      action:
        type: click
        timeout: 1000
      locator:
        frame:
          value: "#cookie-iframe"
        strategy: role
        role: button
        options:
          name: Decline

  # Fields to extract from each job detail page
  infos:
    - name: Description         # becomes the column name in the Excel report
      action:
        type: inner_text
      locator:
        strategy: css
        value: ".job-description"
```

#### Locator strategies

| Strategy      | Description                            | Required fields         |
|---------------|----------------------------------------|-------------------------|
| `css`         | CSS selector                           | `value`                 |
| `role`        | ARIA role                              | `role`, `options.name`  |
| `placeholder` | Input placeholder text                 | `value`                 |
| `text`        | Exact visible text                     | `value`                 |

#### Action types

| Action       | Description                                      |
|--------------|--------------------------------------------------|
| `click`      | Clicks the element (errors are silently ignored) |
| `fill`       | Types a value into an input field                |
| `inner_text` | Extracts the visible text content                |
| `get_value`  | Extracts the `.value` of an input element        |
| `attribute`  | Extracts an HTML attribute (e.g. `href`)         |

---

## Running

```bash
# Run the scraper
bun run scrape

# Run in dev mode (headed browser, slow motion)
bun run scrape:dev
```

The output is saved to `reports.xlsx` at the root of the project, with one sheet per connector.

---

## Testing

```bash
# Unit tests only (Bun)
bun run test:unit

# E2E tests only (Playwright)
bun run test:e2e

# E2E in headed mode (watch the browser)
bun run test:e2e:headed

# E2E with Playwright UI
bun run test:e2e:ui

# Run all tests
bun run test
```

---

## Adding a new connector

1. Create `src/connectors/my-site.yml` following the structure above
2. Add an entry to your `find_job.json`:
   ```json
   { "id": "my-site", "term": "your search term" }
   ```
3. Run `bun run scrape` to test it

For a working reference, see [`src/connectors/nttdata.yml`](src/connectors/nttdata.yml).
