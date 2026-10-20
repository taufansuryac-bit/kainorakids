# 🔌 Kainora Kids MCP Server

Model Context Protocol (MCP) server untuk expose project tools ke AI clients (Claude Desktop, Cursor, dll).

## 🛠️ Tools Yang Tersedia

| Tool | Deskripsi |
|------|-----------|
| `list_products` | List semua produk Kainora Kids (filter by category/gender) |
| `get_product` | Get detail produk by ID |
| `search_products` | Fuzzy search produk by keyword |
| `list_blog_posts` | List artikel blog |
| `get_seo_status` | Get SEO status (meta tags, JSON-LD, robots, sitemap) |
| `get_ai_providers_status` | Check status 13 cloud AI providers |
| `get_project_stats` | Project statistics (files, lines, git) |
| `search_github_issues` | List recent git commits |

## 📦 Install

```bash
cd tools/mcp
npm install
```

## 🚀 Run

```bash
# Standalone
npm run mcp

# Dev mode (auto-reload)
npm run mcp:dev
```

## 🔧 Setup di Claude Desktop

Edit file `claude_desktop_config.json` (atau settings):

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "kainora-kids": {
      "command": "node",
      "args": [
        "D:/Developer/KAINORA KIDS WEBSITE/kainorakids-web/tools/mcp/server.js"
      ]
    }
  }
}
```

Restart Claude Desktop → MCP akan aktif.

## 🔧 Setup di Cursor

Edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "kainora-kids": {
      "command": "node",
      "args": [
        "D:/Developer/KAINORA KIDS WEBSITE/kainorakids-web/tools/mcp/server.js"
      ]
    }
  }
}
```

## 💡 Contoh Penggunaan

Setelah MCP aktif, kamu bisa nanya di Claude Desktop:

> "Tampilkan 5 produk Kainora Kids termahal untuk kategori Dress"

> "Cek SEO status project ini"

> "Provider AI mana yang sudah configured?"

> "Ada commit apa saja minggu ini?"

## 🔐 Security

- MCP server **HANYA baca** data (read-only)
- Tidak expose API keys ke client
- File access terbatas ke project directory

## 📁 File Structure

```
tools/mcp/
├── package.json    # MCP server config
├── server.js       # Main server
└── README.md       # This file
```
