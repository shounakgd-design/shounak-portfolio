const path = require("node:path");
const { spawn } = require("node:child_process");

const apps = [
  {
    name: "frontend",
    cwd: path.join(__dirname, "frontend-src"),
    script: path.join(__dirname, "frontend-src", "node_modules", "vite", "bin", "vite.js"),
  },
  {
    name: "backend",
    cwd: path.join(__dirname, "backend-src"),
    script: path.join(__dirname, "backend-src", "node_modules", "nodemon", "bin", "nodemon.js"),
    args: ["server.js"],
  },
];

const children = [];
let stopping = false;

function stop(code) {
  if (stopping) {
    return;
  }

  stopping = true;
  process.exitCode = code;
  for (const child of children) {
    child.kill();
  }
}

for (const app of apps) {
  const child = spawn(process.execPath, [app.script, ...(app.args || [])], {
    cwd: app.cwd,
    stdio: "inherit",
  });

  children.push(child);
  child.on("error", (error) => {
    console.error(`Failed to start ${app.name}:`, error);
    stop(1);
  });
  child.on("exit", (code) => {
    if (!stopping) {
      stop(code === 0 ? 0 : code || 1);
    }
  });
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));
