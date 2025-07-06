#!/usr/bin/env node

console.log('🔍 Render Environment Debug Script');
console.log('===================================');

// Check current directory
const path = require('path');
console.log('\n📁 Current Directory:', process.cwd());
console.log('📁 Directory Contents:');
try {
  const fs = require('fs');
  const files = fs.readdirSync('.');
  files.forEach(file => {
    const stats = fs.statSync(file);
    console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
  });
} catch (error) {
  console.log('❌ Error reading directory:', error.message);
}

// Check if package.json exists
console.log('\n📦 Package.json Check:');
try {
  const packagePath = path.join(process.cwd(), 'package.json');
  const exists = require('fs').existsSync(packagePath);
  console.log('Package.json exists:', exists);
  
  if (exists) {
    const packageJson = require(packagePath);
    console.log('Package name:', packageJson.name);
    console.log('Dependencies count:', Object.keys(packageJson.dependencies || {}).length);
    console.log('DevDependencies count:', Object.keys(packageJson.devDependencies || {}).length);
  }
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Check if node_modules exists
console.log('\n📦 Node Modules Check:');
try {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  const exists = require('fs').existsSync(nodeModulesPath);
  console.log('Node_modules exists:', exists);
  
  if (exists) {
    const expressPath = path.join(nodeModulesPath, 'express');
    const expressExists = require('fs').existsSync(expressPath);
    console.log('Express module exists:', expressExists);
  }
} catch (error) {
  console.log('❌ Error checking node_modules:', error.message);
}

// Check environment variables
console.log('\n🌍 Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('PWD:', process.env.PWD);
console.log('NPM_CONFIG_PREFIX:', process.env.NPM_CONFIG_PREFIX);

// Try to require express
console.log('\n🔧 Testing Express Import:');
try {
  const express = require('express');
  console.log('✅ Express imported successfully');
  console.log('Express version:', express.version || 'unknown');
} catch (error) {
  console.log('❌ Express import failed:', error.message);
  console.log('Error code:', error.code);
}

console.log('\n🏁 Debug script completed'); 