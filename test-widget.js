/**
 * prepAI Widget Test Suite
 * Run with: node test-widget.js
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const testConfig = {
  widgetFiles: ['public/widget/config.json', 'public/widget/embed.js', 'public/widget/styles.css'],
  widgetRoutes: ['src/app/widget/interface/page.tsx'],
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testFileExists(filePath) {
  try {
    const exists = fs.existsSync(filePath);
    const stats = exists ? fs.statSync(filePath) : null;
    return {
      exists,
      size: stats ? stats.size : 0,
      isFile: stats ? stats.isFile() : false,
    };
  } catch (error) {
    return { exists: false, size: 0, isFile: false, error: error.message };
  }
}

function testFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return {
      success: true,
      content,
      length: content.length,
      isEmpty: content.trim().length === 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

function testConfigValidation(configPath) {
  const result = testFileContent(configPath);
  if (!result.success) {
    return { valid: false, error: result.error };
  }

  try {
    const config = JSON.parse(result.content);
    const requiredFields = ['widget', 'features', 'ui', 'api'];
    const missingFields = requiredFields.filter(field => !config[field]);

    return {
      valid: missingFields.length === 0,
      missingFields,
      config,
    };
  } catch (error) {
    return { valid: false, error: `JSON parse error: ${error.message}` };
  }
}

function testJavaScriptSyntax(jsPath) {
  const result = testFileContent(jsPath);
  if (!result.success) {
    return { valid: false, error: result.error };
  }

  try {
    // Basic syntax check - try to parse as JavaScript
    eval('(function() { "use strict"; ' + result.content + ' })');
    return { valid: true };
  } catch (error) {
    return { valid: false, error: `JavaScript syntax error: ${error.message}` };
  }
}

function testCSSSyntax(cssPath) {
  const result = testFileContent(cssPath);
  if (!result.success) {
    return { valid: false, error: result.error };
  }

  // Basic CSS validation
  const cssContent = result.content;
  const hasValidSelectors = /[.#]?\w+\s*\{/.test(cssContent);
  const hasValidProperties = /:\s*[^;]+;/.test(cssContent);
  const hasValidStructure = cssContent.includes('{') && cssContent.includes('}');

  return {
    valid: hasValidSelectors && hasValidProperties && hasValidStructure,
    hasSelectors: hasValidSelectors,
    hasProperties: hasValidProperties,
    hasStructure: hasValidStructure,
  };
}

function testReactComponent(componentPath) {
  const result = testFileContent(componentPath);
  if (!result.success) {
    return { valid: false, error: result.error };
  }

  const content = result.content;
  const hasReactImport = content.includes("'use client'") || content.includes('import React');
  const hasExport = content.includes('export default');
  const hasJSX = content.includes('<div') || content.includes('<button');
  const hasState = content.includes('useState') || content.includes('useEffect');

  return {
    valid: hasReactImport && hasExport && hasJSX,
    hasReactImport,
    hasExport,
    hasJSX,
    hasState,
  };
}

// Main test runner
function runTests() {
  log('🧪 prepAI Widget Test Suite', 'blue');
  log('=' * 50, 'blue');

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  // Test 1: File Existence
  log('\n📁 Testing File Existence:', 'yellow');
  testConfig.widgetFiles.forEach(filePath => {
    totalTests++;
    const result = testFileExists(filePath);

    if (result.exists && result.isFile && result.size > 0) {
      log(`✅ ${filePath} - ${result.size} bytes`, 'green');
      passedTests++;
    } else {
      log(`❌ ${filePath} - ${result.exists ? 'empty' : 'missing'}`, 'red');
      failedTests++;
    }
  });

  // Test 2: Configuration Validation
  log('\n⚙️ Testing Configuration:', 'yellow');
  totalTests++;
  const configTest = testConfigValidation('public/widget/config.json');
  if (configTest.valid) {
    log('✅ Configuration is valid', 'green');
    passedTests++;
  } else {
    log(`❌ Configuration error: ${configTest.error}`, 'red');
    failedTests++;
  }

  // Test 3: JavaScript Syntax
  log('\n🔧 Testing JavaScript Syntax:', 'yellow');
  totalTests++;
  const jsTest = testJavaScriptSyntax('public/widget/embed.js');
  if (jsTest.valid) {
    log('✅ JavaScript syntax is valid', 'green');
    passedTests++;
  } else {
    log(`❌ JavaScript syntax error: ${jsTest.error}`, 'red');
    failedTests++;
  }

  // Test 4: CSS Syntax
  log('\n🎨 Testing CSS Syntax:', 'yellow');
  totalTests++;
  const cssTest = testCSSSyntax('public/widget/styles.css');
  if (cssTest.valid) {
    log('✅ CSS syntax is valid', 'green');
    passedTests++;
  } else {
    log(`❌ CSS syntax error: ${cssTest.error}`, 'red');
    failedTests++;
  }

  // Test 5: React Component
  log('\n⚛️ Testing React Component:', 'yellow');
  totalTests++;
  const reactTest = testReactComponent('src/app/widget/interface/page.tsx');
  if (reactTest.valid) {
    log('✅ React component is valid', 'green');
    passedTests++;
  } else {
    log(`❌ React component error: ${reactTest.error}`, 'red');
    failedTests++;
  }

  // Test 6: Widget API Functions
  log('\n🔌 Testing Widget API Functions:', 'yellow');
  const embedContent = testFileContent('public/widget/embed.js');
  if (embedContent.success) {
    const apiFunctions = [
      'prepAIInit',
      'open: openWidget',
      'close: closeWidget',
      'startInterview: startInterview',
      'uploadResume: uploadResume',
      'getAnalytics: getAnalytics',
    ];

    apiFunctions.forEach(func => {
      totalTests++;
      if (embedContent.content.includes(func)) {
        log(`✅ ${func} function found`, 'green');
        passedTests++;
      } else {
        log(`❌ ${func} function missing`, 'red');
        failedTests++;
      }
    });
  }

  // Test 7: Message Types
  log('\n📨 Testing Message Types:', 'yellow');
  const messageTypes = [
    'WIDGET_READY',
    'INTERVIEW_STARTED',
    'INTERVIEW_COMPLETED',
    'RESUME_UPLOADED',
    'OPEN_WIDGET',
    'CLOSE_WIDGET',
    'START_INTERVIEW',
    'UPLOAD_RESUME',
  ];

  messageTypes.forEach(type => {
    totalTests++;
    const foundInEmbed = embedContent.success && embedContent.content.includes(type);
    const foundInInterface =
      testFileContent('src/app/widget/interface/page.tsx').success &&
      testFileContent('src/app/widget/interface/page.tsx').content.includes(type);

    if (foundInEmbed || foundInInterface) {
      log(`✅ ${type} message type found`, 'green');
      passedTests++;
    } else {
      log(`❌ ${type} message type missing`, 'red');
      failedTests++;
    }
  });

  // Summary
  log('\n📊 Test Summary:', 'blue');
  log('=' * 30, 'blue');
  log(`Total Tests: ${totalTests}`, 'blue');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  log(
    `Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`,
    passedTests === totalTests ? 'green' : 'yellow'
  );

  if (failedTests === 0) {
    log('\n🎉 All tests passed! Widget is ready for testing.', 'green');
  } else {
    log('\n⚠️ Some tests failed. Please fix the issues above.', 'yellow');
  }

  return { total: totalTests, passed: passedTests, failed: failedTests };
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
