const path = require("node:path");
const { spawn } = require("node:child_process");

const npmCli = process.env.npm_execpath;

if (!npmCli) {
  console.error("Run the development servers with `npm run dev` from the project root.");
  process.exit(1);
}

const apps = [
  {
    name: "frontend",
    workspace: "frontend-src",
  },
  {
    name: "backend",
    workspace: "backend-src",
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
  const child = spawn(process.execPath, [npmCli, "run", "dev", `--workspace=${app.workspace}`], {
    cwd: __dirname,
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
