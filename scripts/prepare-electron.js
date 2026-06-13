/**
 * Prepare the Next.js standalone build for Electron packaging.
 * This script runs after `next build` and before `electron-builder`.
 * It ensures the standalone output has everything needed to run inside Electron.
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const standaloneDir = path.join(projectRoot, '.next', 'standalone');
const staticDir = path.join(projectRoot, '.next', 'static');
const publicDir = path.join(projectRoot, 'public');

console.log('📦 Preparing Electron build...');

// Verify standalone output exists
if (!fs.existsSync(standaloneDir)) {
  console.error('❌ .next/standalone not found. Run "next build" first.');
  process.exit(1);
}

// Copy static files into standalone
const destStatic = path.join(standaloneDir, '.next', 'static');
if (fs.existsSync(staticDir)) {
  copyDirSync(staticDir, destStatic);
  console.log('✅ Copied .next/static → standalone/.next/static');
}

// Copy public folder into standalone
const destPublic = path.join(standaloneDir, 'public');
if (fs.existsSync(publicDir)) {
  copyDirSync(publicDir, destPublic);
  console.log('✅ Copied public → standalone/public');
}

console.log('✅ Electron build preparation complete!');

// Recursive directory copy
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
