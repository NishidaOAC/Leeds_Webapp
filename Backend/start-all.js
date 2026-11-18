// start-all.js - Starts all Leeds Webapp services concurrently
const { fork } = require('child_process');
const path = require('path');
const fs = require('fs');

const services = [
  { name: 'Gateway ', dir: __dirname, file: 'index.js', color: '\x1b[36m', port: 3000 },
  { name: 'Auth    ', dir: path.join(__dirname, 'auth-service'), file: 'index.js', color: '\x1b[34m', port: 3001 },
  { name: 'Invoice ', dir: path.join(__dirname, 'invoice-service'), file: 'index.js', color: '\x1b[32m', port: 3002 },
  { name: 'File    ', dir: path.join(__dirname, 'file-service'), file: 'index.js', color: '\x1b[35m', port: 3003 },
  { name: 'Customer', dir: path.join(__dirname, 'customer-service'), file: 'index.js', color: '\x1b[33m', port: 3004 },
  { name: 'Supplier', dir: path.join(__dirname, 'supplier-service'), file: 'index.js', color: '\x1b[96m', port: 3005 },
];

console.log('\x1b[1m\x1b[32m========================================\x1b[0m');
console.log('\x1b[1m\x1b[32m🚀 Starting Leeds Webapp Microservices\x1b[0m');
console.log('  • Gateway:          http://localhost:3000');
console.log('  • Auth Service:     http://localhost:3001');
console.log('  • Invoice Service:  http://localhost:3002');
console.log('  • File Service:     http://localhost:3003');
console.log('  • Customer Service: http://localhost:3004');
console.log('  • Supplier Service: http://localhost:3005');
console.log('\x1b[1m\x1b[32m========================================\x1b[0m\n');

const children = [];

services.forEach(service => {
  const nodeModulesPath = path.join(service.dir, 'node_modules');
  if (service.dir !== __dirname && !fs.existsSync(nodeModulesPath)) {
    console.warn(`${service.color}[${service.name}]\x1b[33m ⚠️  node_modules not found in ${path.basename(service.dir)}. Run 'npm install' in that folder to enable it.\x1b[0m`);
    return;
  }

  const serviceEnv = { ...process.env };
  serviceEnv.PORT = String(service.port);

  const child = fork(service.file, [], {
    cwd: service.dir,
    env: serviceEnv,
    stdio: ['inherit', 'pipe', 'pipe', 'ipc']
  });

  children.push(child);

  child.stdout.on('data', data => {
    const lines = data.toString().split(/\r?\n/).filter(line => line.trim().length > 0);
    lines.forEach(line => {
      console.log(`${service.color}[${service.name}]\x1b[0m ${line}`);
    });
  });

  child.stderr.on('data', data => {
    const lines = data.toString().split(/\r?\n/).filter(line => line.trim().length > 0);
    lines.forEach(line => {
      const isWarn = line.includes('NOTE:') || line.includes('Warning') || line.includes('(node:') || line.includes('npm');
      const tag = isWarn ? '\x1b[33m [WARN]\x1b[0m' : '\x1b[31m [ERR]\x1b[0m';
      console.error(`${service.color}[${service.name}]\x1b[0m${tag} ${line}`);
    });
  });

  child.on('close', code => {
    // 3221225786 (0xC000013A) is Windows STATUS_CONTROL_C_EXIT, 130 is SIGINT
    const isNormalExit = code === 0 || code === null || code === 130 || code === 3221225786;
    if (!isNormalExit) {
      console.error(`${service.color}[${service.name}]\x1b[31m ❌ Exited with code ${code}\x1b[0m`);
    } else {
      console.log(`${service.color}[${service.name}]\x1b[0m Stopped.`);
    }
  });
});

const cleanup = () => {
  console.log('\n🛑 Shutting down all services...');
  children.forEach(child => {
    try {
      child.kill('SIGTERM');
    } catch (e) {}
  });
  setTimeout(() => process.exit(0), 1000);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
