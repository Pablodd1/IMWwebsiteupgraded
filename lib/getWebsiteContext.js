import fs from 'fs';
import path from 'path';

export function getWebsiteContext() {
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

  return contextText;
}
