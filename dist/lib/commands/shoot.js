'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var getPort = require('get-port');
var simpleGit = require('simple-git');
var fail = require('../helpers/fail.js');
var print = require('../helpers/print.js');
var readConfig = require('../helpers/read-config.js');
var renderer = require('../renderer.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var getPort__default = /*#__PURE__*/_interopDefaultLegacy(getPort);
var simpleGit__default = /*#__PURE__*/_interopDefaultLegacy(simpleGit);

const MAIN_BRANCHES = new Set(["main", "master"]);
async function shootCommand(options) {
    const config = await readConfig.readConfig(options.config);
    const port = await getPort__default['default']();
    let stopRenderer = async () => { };
    let screenshotPaths;
    try {
        stopRenderer = await renderer.startRenderer({
            ...config,
            port,
        });
        screenshotPaths = await config.shooter.shoot(`http://localhost:${port}`);
    }
    catch (e) {
        return fail.fail(`${e}`);
    }
    finally {
        await stopRenderer();
    }
    if (options.push) {
        const git = simpleGit__default['default']();
        await git.addConfig("user.name", "🤖 ViteShot");
        await git.addConfig("user.email", "viteshot-bot@zenc.io");
        await git.add(screenshotPaths);
        const status = await git.status();
        const branch = await git.branch();
        if (status.files.length > 0) {
            if (MAIN_BRANCHES.has(branch.current)) {
                return fail.fail(`🚨 Screenshots have changed on ${branch.current}!`);
            }
            await git.stash();
            await git.pull();
            await git.stash(["pop"]);
            await git.add(screenshotPaths);
            await git.commit("📸 Updated screenshots");
            await git.push();
            print.info("⚠️ Screenshots have been updated.");
        }
        else {
            print.info("✅ Screenshots have not changed.");
        }
    }
    print.info("All done.");
    return process.exit(0);
}

exports.shootCommand = shootCommand;
