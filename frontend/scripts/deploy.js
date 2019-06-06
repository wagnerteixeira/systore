const result = require('dotenv').config();
if (result.error) {
  throw result.error;
}

const util = require('util');
const exec = util.promisify(require('child_process').exec);

console.log(result.parsed);

let new_version = '101';
let old_version = '100';

/*console.log(process.env.SSH_PASS);

const { spawn, execSync } = require('child_process');

let stdout = execSync('ls');
console.log(stdout.toString());

*/

async function main() {
  let out = [];
  console.log('deleting old files');
  //delete old files
  var result = await exec('rm -rf build');

  if (result.stderr) {
    console.error(`error: ${result.stderr}`);
  }
  out.push(result.stdout);
  console.log('old files deleted');
  console.log('building project');
  //build project
  result = await exec('yarn run build && rm build/static/**/*.map');

  if (result.stderr) {
    console.error(`error: ${result.stderr}`);
  }
  out.push(result.stdout);
  console.log('project build');
  if (old_version !== '') {
    console.log('moving old files in server');
    //remove files from server
    result = await exec(
      `sshpass -p ${process.env.SSH_PASS} ssh -o StrictHostKeyChecking=no ${
        process.env.SSH_USER
      }@${
        process.env.SSH_ADDRESS
      } "cd /var/www/systore_conv && mv -f build build_${old_version}"`
    );

    if (result.stderr) {
      console.error(`error: ${result.stderr}`);
    }
    out.push(result.stdout);
    console.log('files from server deleted');
  }
  console.log('uploading new files');
  //upload new files
  result = await exec(
    `sshpass -p ${
      process.env.SSH_PASS
    } scp -o StrictHostKeyChecking=no -r build ${process.env.SSH_USER}@${
      process.env.SSH_ADDRESS
    }:/var/www/systore_conv`
  );

  if (result.stderr) {
    console.error(`error: ${result.stderr}`);
  }
  out.push(result.stdout);
  console.log('new files uploaded');
  console.log('done.');
  console.log(out);
}

main();
