import { spawn } from "node:child_process";
import process from "node:process";

const localPort = "3187";
const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
const baseUrl = externalBaseUrl ?? `http://127.0.0.1:${localPort}`;
const nextBin = "node_modules/next/dist/bin/next";
const playwrightBin = "node_modules/@playwright/test/cli.js";
let server;

function runNode(args, env = process.env) {
  return spawn(process.execPath, args, {
    env,
    stdio: "inherit",
    windowsHide: true,
  });
}

async function waitForServer(url) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server?.exitCode != null) {
      throw new Error(
        `The Next.js test server exited with ${server.exitCode}.`,
      );
    }
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.status < 500) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`The test server did not become ready at ${url}.`);
}

function waitForExit(child) {
  return new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => resolve({ code, signal }));
  });
}

async function stopServer() {
  if (!server || server.exitCode != null) return;
  server.kill("SIGTERM");
  await Promise.race([
    waitForExit(server),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
  if (server.exitCode == null) server.kill("SIGKILL");
}

let exitCode = 1;
try {
  if (!externalBaseUrl) {
    server = runNode([nextBin, "start", "--port", localPort]);
    await waitForServer(baseUrl);
  }
  const tests = runNode([playwrightBin, "test"], {
    ...process.env,
    PLAYWRIGHT_BASE_URL: baseUrl,
  });
  const result = await waitForExit(tests);
  exitCode = result.code ?? 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
} finally {
  await stopServer();
}

process.exitCode = exitCode;
