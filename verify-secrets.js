#!/usr/bin/env node

/**
 * GitHub Secrets Verification Script
 * Run this locally to verify your secrets are correct before deployment
 */

const https = require('https');

// Test configuration
const secrets = {
  VERCEL_TOKEN: process.env.VERCEL_TOKEN || 'LvnGGCvbdZZbQ6beoRTbzWxh',
  VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID || 'prj_ksnL9nMswJjhIRuNWVAgvTDPmqqp',
  RENDER_API_KEY: process.env.RENDER_API_KEY || ''
};

async function testVercelToken() {
  console.log('🔍 Testing Vercel Token...');
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.vercel.com',
      path: '/v2/user',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secrets.VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Vercel Token is valid');
          resolve(true);
        } else {
          console.log('❌ Vercel Token is invalid');
          console.log('Response:', data);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('❌ Vercel Token test failed:', err.message);
      resolve(false);
    });

    req.end();
  });
}

async function testVercelProject() {
  console.log('🔍 Testing Vercel Project ID...');
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.vercel.com',
      path: `/v8/projects/${secrets.VERCEL_PROJECT_ID}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secrets.VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const project = JSON.parse(data);
          console.log('✅ Vercel Project ID is valid');
          console.log(`   Project: ${project.name}`);
          console.log(`   Domain: ${project.alias?.[0]?.domain || 'No domain assigned'}`);
          resolve(true);
        } else {
          console.log('❌ Vercel Project ID is invalid');
          console.log('Response:', data);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('❌ Vercel Project test failed:', err.message);
      resolve(false);
    });

    req.end();
  });
}

async function testRenderAPI() {
  if (!secrets.RENDER_API_KEY) {
    console.log('⚠️  Skipping Render API test (no key provided)');
    return true;
  }

  console.log('🔍 Testing Render API Key...');
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.render.com',
      path: '/v1/owners',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secrets.RENDER_API_KEY}`,
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Render API Key is valid');
          resolve(true);
        } else {
          console.log('❌ Render API Key is invalid');
          console.log('Response:', data);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('❌ Render API test failed:', err.message);
      resolve(false);
    });

    req.end();
  });
}

async function runVerification() {
  console.log('🚀 Starting GitHub Secrets Verification\n');
  
  console.log('📋 Current Configuration:');
  console.log(`   VERCEL_TOKEN: ${secrets.VERCEL_TOKEN.substring(0, 8)}...`);
  console.log(`   VERCEL_PROJECT_ID: ${secrets.VERCEL_PROJECT_ID}`);
  console.log(`   RENDER_API_KEY: ${secrets.RENDER_API_KEY ? 'Set' : 'Not set'}\n`);

  const results = await Promise.all([
    testVercelToken(),
    testVercelProject(),
    testRenderAPI()
  ]);

  const allPassed = results.every(result => result);
  
  console.log('\n📊 Verification Results:');
  console.log(`   Vercel Token: ${results[0] ? '✅' : '❌'}`);
  console.log(`   Vercel Project: ${results[1] ? '✅' : '❌'}`);
  console.log(`   Render API: ${results[2] ? '✅' : '❌'}`);
  
  if (allPassed) {
    console.log('\n🎉 All secrets are valid! Ready for deployment.');
  } else {
    console.log('\n⚠️  Some secrets are invalid. Please update them in GitHub.');
  }
  
  return allPassed;
}

if (require.main === module) {
  runVerification().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runVerification };