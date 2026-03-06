#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const PACKAGES_ROOT = path.join(__dirname, '../../../packages');
const WEB_CONTENT_DIR = path.join(__dirname, '../content');

// Domain packages to copy content from
const DOMAINS = [
  'computer-science',
  'mathematics',
  'engineering',
  'creativity',
  'game-shows',
  'security',
  'cryptography',
];

// Create content directory if it doesn't exist
if (!fs.existsSync(WEB_CONTENT_DIR)) {
  fs.mkdirSync(WEB_CONTENT_DIR, { recursive: true });
}

console.log('Copying content files to web package...');

for (const domain of DOMAINS) {
  const sourceDir = path.join(PACKAGES_ROOT, domain, 'content');
  const targetDir = path.join(WEB_CONTENT_DIR, domain);

  if (!fs.existsSync(sourceDir)) {
    console.warn(`Warning: ${sourceDir} does not exist, skipping...`);
    continue;
  }

  // Create target directory
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Copy all .md files
  const files = fs.readdirSync(sourceDir).filter((file) => file.endsWith('.md'));

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    fs.copyFileSync(sourcePath, targetPath);
  }

  console.log(`  ✓ Copied ${files.length} files from ${domain}`);
}

console.log('Content copy complete!');
