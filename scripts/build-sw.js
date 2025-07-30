const fs = require('fs');
const path = require('path');

function generateCacheVersion() {
  // Generate version based on current timestamp and git commit (if available)
  const timestamp = Date.now();
  let gitCommit = '';
  
  try {
    const { execSync } = require('child_process');
    gitCommit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    // Git not available or not in git repo, use random string
    gitCommit = Math.random().toString(36).substr(2, 8);
  }
  
  return `${timestamp}-${gitCommit}`;
}

function buildServiceWorker() {
  const swTemplatePath = path.join(__dirname, '..', 'public', 'sw.js');
  const swOutputPath = path.join(__dirname, '..', 'public', 'sw.js');
  
  // Read the service worker template
  let swContent = fs.readFileSync(swTemplatePath, 'utf8');
  
  // Generate new cache version
  const cacheVersion = generateCacheVersion();
  
  // Replace the placeholder with actual version
  swContent = swContent.replace('__CACHE_VERSION__', cacheVersion);
  
  // Write the updated service worker
  fs.writeFileSync(swOutputPath, swContent);
  
  console.log(`✅ Service Worker built with cache version: ${cacheVersion}`);
  
  // Also create a version file for debugging
  const versionInfo = {
    cacheVersion,
    buildTime: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV || 'development'
  };
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'public', 'sw-version.json'),
    JSON.stringify(versionInfo, null, 2)
  );
}

// Run if called directly
if (require.main === module) {
  buildServiceWorker();
}

module.exports = { buildServiceWorker, generateCacheVersion }; 