const fs = require("fs");
const cwd = require("process").cwd();
const path = require("path");
const exec = require("child_process").execSync;

const appPath = path.normalize(cwd.slice(0, cwd.lastIndexOf("node_modules")));

const packageJsonPath = path.join(appPath, "package.json");

if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

  if (packageJson.scripts && packageJson.scripts.postinstall) {
    const pkgManager = shouldUseYarn() ? "yarn" : "npm";
    try {
      exec(`${pkgManager} run postinstall`, { cwd: appPath });
    } catch (error) {
      console.log("errr status is: ", error.status);
      console.log("\nerrr message is: ", error.message);
      console.log("\nstdout is: ", error.stdout.toString());
      console.log("\nstderr is: ", error.stderr.toString());
      console.log("\n\n\n");
    }
  }
}

function shouldUseYarn() {
  try {
    exec("yarnpkg --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}
