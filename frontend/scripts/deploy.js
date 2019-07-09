const result = require('dotenv').config();
if (result.error) {
  throw result.error;
}

const util = require('util');
const exec = util.promisify(require('child_process').exec);

//console.log(result.parsed);

let new_version = '102';
let old_version = '104';

let prod = 'n';

/*console.log(process.env.SSH_PASS);

const { spawn, execSync } = require('child_process');

let stdout = execSync('ls');
console.log(stdout.toString());

*/

async function main() {
  let out = [];
  let repo = prod === 'y' ? 'systore_conv' : 'systore_homolog';
  if (prod === 'y')
    console.log(
      `Gerando uma versão de produção com versão anterior ${old_version}`
    );
  else console.log('Gerando uma versão de homologação');
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
      } "cd /var/www/${repo} && mv -f build build_${old_version}"`
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
    }:/var/www/${repo}`
  );

  if (result.stderr) {
    console.error(`error: ${result.stderr}`);
  }
  out.push(result.stdout);
  console.log('new files uploaded');
  console.log('done.');
  console.log(out);
}

console.log('Esse é um deploy de produção y/n');

process.stdin.on('readable', () => {
  // reads what is being typed.
  let variable = process.stdin.read();
  // trying to read
  variable = variable.toString().replace(/\n/, '');
  variable = variable.replace(/\r/, '');
  if (variable.toLowerCase() === 'y') prod = 'y';
  else old_version = '';

  main();
});
