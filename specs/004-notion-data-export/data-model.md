# Data Model: Notion Data Export

**Feature Branch**: `004-notion-data-export`
**Date**: 2026-03-15

## Entities

### ExportSnapshot

Represents a single complete export run.

| Field | Type | Description |
|-------|------|-------------|
| timestamp | string (ISO 8601) | When the export started |
| directoryName | string | Timestamped directory name (YYYY-MM-DD-HHMMSS) |
| workspaceId | string | Notion workspace ID |
| pageCount | number | Total pages exported |
| databaseCount | number | Total databases exported |
| assetCount | number | Total assets downloaded |
| status | "complete" \| "failed" | Export completion status |

**Output**: `data/notion/{YYYY-MM-DD-HHMMSS}/export-manifest.json`

---

### Page

A Notion page with content and metadata.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Notion page ID |
| title | string | Page title (from title property) |
| parentId | string \| null | Parent page or database ID |
| parentType | "workspace" \| "page" \| "database" | Type of parent |
| createdTime | string (ISO 8601) | Creation timestamp |
| lastEditedTime | string (ISO 8601) | Last edit timestamp |
| createdBy | string | User name or ID |
| lastEditedBy | string | User name or ID |
| url | string | Original Notion URL |
| archived | boolean | Whether page is archived |

**Output**: Markdown file with YAML frontmatter containing metadata, body containing converted content.

**Example**:
```markdown
---
notion_id: "abc123-def456"
title: "Episode Planning"
parent_id: "xyz789"
parent_type: "page"
created_time: "2026-01-15T10:30:00Z"
last_edited_time: "2026-03-10T14:22:00Z"
created_by: "John Doe"
last_edited_by: "Jane Smith"
notion_url: "https://notion.so/abc123def456"
---

# Episode Planning

Page content in Markdown...
```

---

### Database

A Notion database with schema and entries.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Notion database ID |
| title | string | Database title |
| parentId | string \| null | Parent page or workspace ID |
| parentType | "workspace" \| "page" | Type of parent |
| createdTime | string (ISO 8601) | Creation timestamp |
| lastEditedTime | string (ISO 8601) | Last edit timestamp |
| properties | object | Schema definition (property name → type + config) |
| rowCount | number | Number of entries |

**Output**:
- `_schema.json` — Database schema with property definitions
- One Markdown file per row (database entry) with properties as frontmatter

**Schema example**:
```json
{
  "notion_id": "db-abc123",
  "title": "Guest Tracker",
  "properties": {
    "Name": { "type": "title" },
    "Episode": { "type": "relation", "relation_database_id": "db-xyz789" },
    "Status": { "type": "select", "options": ["Confirmed", "Pending", "Declined"] },
    "Record Date": { "type": "date" }
  },
  "row_count": 42
}
```

---

### Asset

An embedded image, file, or attachment.

| Field | Type | Description |
|-------|------|-------------|
| blockId | string | Block ID containing the asset |
| sourceUrl | string | Original URL (Notion-hosted or external) |
| sourceType | "file" \| "external" | Whether Notion-hosted or external link |
| localPath | string | Relative path to downloaded file |
| filename | string | Saved filename |
| mimeType | string \| null | Content type if available |
| parentPageId | string | Page containing this asset |

**Output**: Binary file in `_assets/` directory alongside parent page. Asset manifest in `_assets/_manifest.json`.

---

### Comment

A page-level or block-level discussion comment.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Comment ID |
| parentPageId | string | Page this comment belongs to |
| parentBlockId | string \| null | Specific block (null for page-level) |
| author | string | User name |
| createdTime | string (ISO 8601) | When comment was posted |
| richText | array | Notion rich text content |
| plainText | string | Plain text content |

**Output**: `_comments.json` alongside each page's Markdown file.

**Example**:
```json
[
  {
    "id": "comment-abc",
    "parent_block_id": null,
    "author": "John Doe",
    "created_time": "2026-02-20T09:15:00Z",
    "text": "Should we include tasting notes for this episode?"
  }
]
```

---

### LinkedDatabase

A database view referencing a source database.

| Field | Type | Description |
|-------|------|-------------|
| blockId | string | Block ID of the linked database |
| sourceDatabaseId | string | ID of the original database |
| parentPageId | string | Page containing this linked view |

**Output**: Recorded as a reference in the page's Markdown (link to source database's export location).

---

### SyncedBlock

A block whose content is synced from another location.

| Field | Type | Description |
|-------|------|-------------|
| blockId | string | Block ID of the synced block |
| syncedFrom | string \| null | Source block ID (null if this IS the original) |
| parentPageId | string | Page containing this block |

**Output**: Content resolved from the original source block and included inline. A metadata comment notes the sync relationship.

## Directory Structure

```
data/notion/
└── 2026-03-15-143022/                    # Timestamped snapshot
    ├── export-manifest.json              # Export metadata and counts
    ├── _users.json                       # Workspace users lookup
    ├── Page Title/                       # Top-level page
    │   ├── index.md                      # Page content + frontmatter
    │   ├── _comments.json                # Page comments (if any)
    │   ├── _assets/                      # Downloaded images/files
    │   │   ├── _manifest.json            # Asset metadata
    │   │   ├── image1.png
    │   │   └── document.pdf
    │   └── Subpage Title/                # Nested child page
    │       ├── index.md
    │       └── _comments.json
    ├── Database Title/                   # Top-level database
    │   ├── _schema.json                  # Database schema
    │   ├── Row Title 1.md                # Database entry
    │   ├── Row Title 2.md
    │   └── _assets/
    └── Another Page/
        └── index.md
```

## Relationships

```
Workspace
 ├── Page (1:N)
 │    ├── Page (recursive children, 1:N)
 │    ├── Comment (1:N)
 │    ├── Asset (1:N)
 │    ├── SyncedBlock (1:N, resolved from source)
 │    └── LinkedDatabase (1:N, references Database)
 └── Database (1:N)
      ├── DatabaseEntry/Page (1:N, each row is a Page)
      └── Schema (1:1)
```
