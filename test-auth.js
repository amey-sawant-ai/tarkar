// Simple test to verify authentication flow
const https = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', (e) => {
      reject(e);
    });
    
    req.end();
  });
}

async function testAuth() {
  try {
    console.log('Testing authentication flow...');
    
    // Test dashboard access
    console.log('\n1. Testing /dashboard (should show loading or redirect)');
    const dashboardResponse = await makeRequest('/dashboard');
    console.log(`Status: ${dashboardResponse.statusCode}`);
    
    if (dashboardResponse.body.includes('Loading')) {
      console.log('✓ Dashboard shows loading state (good!)');
    } else if (dashboardResponse.body.includes('Please log in')) {
      console.log('✓ Dashboard shows login prompt (good!)');
    } else {
      console.log('⚠ Dashboard response unclear');
    }
    
    // Test login access
    console.log('\n2. Testing /login (should show login form)');
    const loginResponse = await makeRequest('/login');
    console.log(`Status: ${loginResponse.statusCode}`);
    
    if (loginResponse.body.includes('Loading')) {
      console.log('✓ Login shows loading state (checking auth)');
    } else if (loginResponse.body.includes('login')) {
      console.log('✓ Login page accessible');
    } else {
      console.log('⚠ Login response unclear');
    }
    
    console.log('\nTest completed!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAuth();