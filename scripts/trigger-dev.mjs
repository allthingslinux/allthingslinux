#!/usr/bin/env node

import { readFileSync } from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJsonPath = join(__dirname, '..', 'package.json');

// Read and parse package.json
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

// Get the version from either dependencies or devDependencies
const triggerVersion =
  packageJson.dependencies?.['@trigger.dev/sdk'] ||
  packageJson.devDependencies?.['@trigger.dev/build'] ||
  packageJson.devDependencies?.['@trigger.dev/sdk'];

if (!triggerVersion) {
  console.error(
    '❌ Could not find @trigger.dev/sdk or @trigger.dev/build in package.json'
  );
  process.exit(1);
}

// Extract the version (remove ^ or ~ if present)
const cleanVersion = triggerVersion.replace(/^[\^~]/, '');

console.log(`📦 Using Trigger.dev version: ${cleanVersion}`);

// Get the command (dev, deploy, etc.) from command line arguments
const command = process.argv[2] || 'dev';
const additionalArgs = process.argv.slice(3);

// Construct the npx command
const npxCommand = `trigger.dev@${cleanVersion}`;
const args = [npxCommand, command, ...additionalArgs];

console.log(
  `🚀 Running: npx ${npxCommand} ${command} ${additionalArgs.join(' ')}`
);

// Spawn the process
const child = spawn('npx', args, {
  stdio: 'inherit',
  shell: true,
});

// Handle process exit
child.on('close', (code) => {
  process.exit(code);
});

child.on('error', (error) => {
  console.error('❌ Failed to start trigger.dev:', error);
  process.exit(1);
});
