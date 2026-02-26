import fs from 'fs';
import path from 'path';

const EXTERNAL_URLS = [
  {
    name: 'Aging Biohacking',
    url: 'https://www.agingbiohacking.com/',
  },
  {
    name: 'Exomind',
    url: 'https://exomindmiamibeach.com/',
  }
];

let cachedContent = '';

async function fetchExternalContent() {
  if (cachedContent) return cachedContent;

  let content = '\n\n=== EXTERNAL WEBSITE CONTENT ===\n';
  
  for (const site of EXTERNAL_URLS) {
    try {
      console.log(`Fetching content from ${site.url}...`);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(site.url, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; IMW-Chatbot/1.0)'
        }
      });
      
      clearTimeout(timeout);
      
      if (response.ok) {
        const html = await response.text();
        // Extract text content from HTML
        const text = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .substring(0, 8000); // Limit content size
        
        content += `\n--- Content from ${site.name} (${site.url}) ---\n`;
        content += text + '\n';
      }
    } catch (error) {
      console.error(`Error fetching ${site.url}:`, error.message);
      content += `\n--- ${site.name} ---\n(Content could not be loaded. Please refer to ${site.url})\n`;
    }
  }

  cachedContent = content;
  return content;
}

export async function getWebsiteContext() {
  const jsonDir = path.join(process.cwd(), 'json', 'en');
  let contextText = '';

  try {
    const readDirRecursive = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          readDirRecursive(fullPath);
        } else if (fullPath.endsWith('.json')) {
          try {
            const data = fs.readFileSync(fullPath, 'utf8');
            const parsed = JSON.parse(data);
            contextText += `\n--- Content from ${file} ---\n`;
            contextText += JSON.stringify(parsed, null, 2);
          } catch (e) {
            console.error(`Error reading ${fullPath}:`, e);
          }
        }
      }
    };

    if (fs.existsSync(jsonDir)) {
      readDirRecursive(jsonDir);
    }
  } catch (error) {
    console.error('Error loading website context:', error);
  }

  // Add external website content
  try {
    const externalContent = await fetchExternalContent();
    contextText += externalContent;
  } catch (e) {
    console.error('Error fetching external content:', e);
  }

  return contextText;
}
