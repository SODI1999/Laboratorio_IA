import { execSync } from 'node:child_process';

try {
  console.log('Executing backend tests with mvnw.cmd test...');
  execSync('.\\mvnw.cmd test', { cwd: 'backend', stdio: 'inherit' });
  console.log('All backend tests passed successfully!');
} catch (error) {
  console.error('Test run failed:', error.message);
  process.exit(error.status || 1);
}
