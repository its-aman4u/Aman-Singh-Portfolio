import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { killPortProcess } from 'kill-port-process';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
const PORT = 3000;
const HOST = '0.0.0.0';
const MAX_MEMORY = 4096; // MB

async function cleanup() {
  try {
    // Kill any process using our port
    await killPortProcess(PORT);
    console.log(`✓ Cleaned up port ${PORT}`);
  } catch (error) {
    console.warn(`Warning: Could not clean up port ${PORT}:`, error.message);
  }
}

async function startServer() {
  try {
    await cleanup();

    const env = {
      ...process.env,
      NODE_ENV: 'development',
      NODE_OPTIONS: `--max-old-space-size=${MAX_MEMORY}`,
      FORCE_COLOR: '1'
    };

    const npxPath = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    
    const devProcess = spawn(npxPath, [
      'astro',
      'dev',
      '--host',
      HOST,
      '--port',
      PORT.toString(),
      '--no-telemetry'
    ], {
      env,
      stdio: 'inherit',
      cwd: __dirname,
      shell: true
    });

    // Handle process events
    devProcess.on('error', (error) => {
      console.error('Failed to start development server:', error);
      process.exit(1);
    });

    devProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Development server exited with code ${code}`);
        process.exit(code);
      }
    });

    // Handle termination signals
    const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`\nReceived ${signal}, cleaning up...`);
        await cleanup();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start development server:', error);
    process.exit(1);
  }
}

// Start the development server
startServer().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
