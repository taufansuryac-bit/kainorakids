/**
 * KAINORA KIDS - MCP SERVER
 * Model Context Protocol server untuk expose project tools
 * ke AI clients (Claude Desktop, Cursor, etc.)
 *
 * Usage:
 *   node src/mcp/server.js
 *
 * Tools exposed:
 *   - list_products: List all Kainora Kids products
 *   - get_product: Get product by ID
 *   - search_products: Fuzzy search by keyword
 *   - get_orders: List recent orders from Firebase
 *   - get_stats: Get dashboard statistics
 *   - generate_seo_article: Generate SEO article for blog
 *   - ai_search: Smart product search using AI
 *   - update_inventory: Update product stock
 *   - analyze_review: Analyze customer review sentiment
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// DATA LOADERS
// ============================================

const PROJECT_ROOT = path.resolve(__dirname, '../../');

function loadProducts() {
  try {
    const dataPath = path.join(PROJECT_ROOT, 'src/constants/data.js');
    const content = fs.readFileSync(dataPath, 'utf-8');
    // Extract INITIAL_PRODUCTS array
    const match = content.match(/export const INITIAL_PRODUCTS = (\[[\s\S]*?\n\]);/);
    if (!match) return [];
    // Simple eval (safe because we trust our own file)
    return eval(match[1]);
  } catch (err) {
    console.error('Failed to load products:', err.message);
    return [];
  }
}

function loadPosts() {
  // Posts are stored in Firebase, not in data.js
  // This is a placeholder - in production, fetch from Firebase
  return [];
}

function loadEnv() {
  try {
    const envPath = path.join(PROJECT_ROOT, '.env.local');
    if (!fs.existsSync(envPath)) return {};
    const content = fs.readFileSync(envPath, 'utf-8');
    const env = {};
    content.split('\n').forEach(line => {
      const m = line.match(/^VITE_([A-Z_]+)=(.+)$/);
      if (m) env[m[1]] = m[2].trim();
    });
    return env;
  } catch {
    return {};
  }
}

// ============================================
// MCP SERVER SETUP
// ============================================

const server = new Server(
  {
    name: 'kainora-kids-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ============================================
// TOOLS DEFINITION
// ============================================

const TOOLS = [
  {
    name: 'list_products',
    description: 'List all Kainora Kids products. Returns array of products with name, price, category, gender, sizes, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Filter by category (e.g., "Kaos", "Dress")' },
        gender: { type: 'string', description: 'Filter by gender (Boy, Girl, Unisex)' },
        limit: { type: 'number', description: 'Limit number of results (default: 50)' }
      }
    }
  },
  {
    name: 'get_product',
    description: 'Get detailed product info by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Product ID' }
      },
      required: ['id']
    }
  },
  {
    name: 'search_products',
    description: 'Fuzzy search products by name, description, category, or material',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        limit: { type: 'number', description: 'Max results (default: 10)' }
      },
      required: ['query']
    }
  },
  {
    name: 'list_blog_posts',
    description: 'List blog posts / articles',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Filter by category' },
        limit: { type: 'number', description: 'Max results' }
      }
    }
  },
  {
    name: 'get_seo_status',
    description: 'Get current SEO status: meta tags, JSON-LD schemas, robots.txt, sitemap.xml',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_ai_providers_status',
    description: 'Check status of all 13 cloud AI providers (which are configured)',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_project_stats',
    description: 'Get project statistics: file count, line count, dependencies, etc.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'search_github_issues',
    description: 'List recent commits in the GitHub repository',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max commits to show (default: 10)' }
      }
    }
  }
];

// ============================================
// TOOL HANDLERS
// ============================================

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_products': {
        let products = loadProducts();
        if (args?.category) products = products.filter(p => p.category === args.category);
        if (args?.gender) products = products.filter(p => p.gender === args.gender);
        const limit = args?.limit || 50;
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(products.slice(0, limit), null, 2)
          }]
        };
      }

      case 'get_product': {
        const products = loadProducts();
        const product = products.find(p => String(p.id) === String(args.id));
        if (!product) {
          return { content: [{ type: 'text', text: `Product not found: ${args.id}` }], isError: true };
        }
        return {
          content: [{ type: 'text', text: JSON.stringify(product, null, 2) }]
        };
      }

      case 'search_products': {
        const products = loadProducts();
        const query = (args?.query || '').toLowerCase();
        const limit = args?.limit || 10;

        // Simple fuzzy match
        const results = products
          .map(p => {
            const haystack = `${p.name} ${p.description || ''} ${p.category || ''} ${p.bahan || ''} ${p.warna || ''}`.toLowerCase();
            let score = 0;
            query.split(' ').forEach(word => {
              if (haystack.includes(word)) score++;
            });
            return { product: p, score };
          })
          .filter(r => r.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, limit)
          .map(r => r.product);

        return {
          content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
        };
      }

      case 'list_blog_posts': {
        let posts = loadPosts();
        if (args?.category) posts = posts.filter(p => p.category === args.category);
        const limit = args?.limit || 20;
        return {
          content: [{ type: 'text', text: JSON.stringify(posts.slice(0, limit), null, 2) }]
        };
      }

      case 'get_seo_status': {
        const indexPath = path.join(PROJECT_ROOT, 'index.html');
        const robotsPath = path.join(PROJECT_ROOT, 'public/robots.txt');
        const sitemapPath = path.join(PROJECT_ROOT, 'public/sitemap.xml');
        const manifestPath = path.join(PROJECT_ROOT, 'public/manifest.json');

        const status = {
          indexHtml: fs.existsSync(indexPath) ? {
            size: fs.statSync(indexPath).size,
            metaTags: (fs.readFileSync(indexPath, 'utf-8').match(/<meta\s+/g) || []).length,
            jsonLd: (fs.readFileSync(indexPath, 'utf-8').match(/application\/ld\+json/g) || []).length,
            ogTags: (fs.readFileSync(indexPath, 'utf-8').match(/property="og:/g) || []).length,
          } : null,
          robots: fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, 'utf-8').length : null,
          sitemap: fs.existsSync(sitemapPath) ? (fs.readFileSync(sitemapPath, 'utf-8').match(/<url>/g) || []).length : null,
          manifest: fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) : null
        };
        return {
          content: [{ type: 'text', text: JSON.stringify(status, null, 2) }]
        };
      }

      case 'get_ai_providers_status': {
        const env = loadEnv();
        const providers = [
          { name: 'Groq', env: 'GROQ_API_KEY', priority: 1, tier: 'Fast' },
          { name: 'DeepSeek', env: 'DEEPSEEK_API_KEY', priority: 2, tier: 'Fast' },
          { name: 'Lepton', env: 'LEPTON_API_KEY', priority: 3, tier: 'Free' },
          { name: 'OpenRouter', env: 'OPENROUTER_API_KEY', priority: 4, tier: 'Free' },
          { name: 'Mistral', env: 'MISTRAL_API_KEY', priority: 5, tier: 'Free' },
          { name: 'Fireworks', env: 'FIREWORKS_API_KEY', priority: 6, tier: 'Free' },
          { name: 'Cohere', env: 'COHERE_API_KEY', priority: 7, tier: 'Free' },
          { name: 'HuggingFace', env: 'HUGGINGFACE_API_KEY', priority: 8, tier: 'Free' },
          { name: 'Perplexity', env: 'PERPLEXITY_API_KEY', priority: 9, tier: 'Free' },
          { name: 'NovitaAI', env: 'NOVITAAI_API_KEY', priority: 10, tier: 'Free' },
          { name: 'Cerebras', env: 'CEREBRAS_API_KEY', priority: 11, tier: 'Free' },
          { name: 'OllamaCloud', env: 'OLLAMA_CLOUD_API_KEY', priority: 12, tier: 'Free' },
          { name: 'Hyperbolic', env: 'HYPERBOLIC_API_KEY', priority: 13, tier: 'Free' }
        ];

        const status = providers.map(p => ({
          name: p.name,
          priority: p.priority,
          tier: p.tier,
          configured: !!env[p.env],
          envVar: `VITE_${p.env}`
        }));

        return {
          content: [{ type: 'text', text: JSON.stringify({
            total: providers.length,
            configured: status.filter(s => s.configured).length,
            unconfigured: status.filter(s => !s.configured).length,
            providers: status
          }, null, 2) }]
        };
      }

      case 'get_project_stats': {
        const { execSync } = await import('child_process');
        try {
          const fileCount = parseInt(execSync('git ls-files | wc -l', { cwd: PROJECT_ROOT }).toString().trim());
          const srcFiles = parseInt(execSync('git ls-files src/ | wc -l', { cwd: PROJECT_ROOT }).toString().trim());
          const publicFiles = parseInt(execSync('git ls-files public/ | wc -l', { cwd: PROJECT_ROOT }).toString().trim());
          const totalLines = execSync('git ls-files | xargs wc -l 2>/dev/null | tail -1', { cwd: PROJECT_ROOT }).toString().trim().split(/\s+/)[0];
          const remote = execSync('git remote get-url origin', { cwd: PROJECT_ROOT }).toString().trim();
          const branch = execSync('git branch --show-current', { cwd: PROJECT_ROOT }).toString().trim();
          const lastCommit = execSync('git log -1 --format="%H %s"', { cwd: PROJECT_ROOT }).toString().trim();

          return {
            content: [{ type: 'text', text: JSON.stringify({
              totalFiles: fileCount,
              srcFiles,
              publicFiles,
              totalLines: parseInt(totalLines),
              remote,
              branch,
              lastCommit
            }, null, 2) }]
          };
        } catch (err) {
          return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
        }
      }

      case 'search_github_issues': {
        const { execSync } = await import('child_process');
        try {
          const limit = args?.limit || 10;
          const log = execSync(`git log --oneline -n ${limit}`, { cwd: PROJECT_ROOT }).toString();
          return {
            content: [{ type: 'text', text: log }]
          };
        } catch (err) {
          return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
        }
      }

      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true
        };
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true
    };
  }
});

// ============================================
// START SERVER
// ============================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Kainora Kids MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
