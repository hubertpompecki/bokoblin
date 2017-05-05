#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const execSync = require('child_process').execSync;
const commandExistsSync = require('command-exists').sync;

let functionNameValue
let roleResourceValue

program
  .arguments('<functionName> <roleResource>')
  .action((functionName, roleResource) => {
    functionNameValue = functionName
    roleResourceValue = roleResource
  })

program.parse(process.argv)

if (typeof functionNameValue === 'undefined') {
  console.error('Error: No function name given!');
  process.exit(1);
}

if (typeof roleResourceValue === 'undefined') {
  console.error('Error: No role resource given!');
  process.exit(1);
}

console.log('Generating new local lambda function: ' + functionNameValue)

//--- Directory setup ---//
console.log('Creating directory')
// generate new directory
fs.mkdirSync(functionNameValue)
fs.mkdirSync(`${functionNameValue}/app`)
// copy template files
fs.createReadStream('./templates/webpack.config.js').pipe(fs.createWriteStream(`${functionNameValue}/webpack.config.js`))
fs.createReadStream('./templates/component.js').pipe(fs.createWriteStream(`${functionNameValue}/app/component.js`))
fs.createReadStream('./templates/flowconfig').pipe(fs.createWriteStream(`${functionNameValue}/.flowconfig`))
fs.createReadStream('./templates/gitignore').pipe(fs.createWriteStream(`${functionNameValue}/app/component.js`))

//--- Setting up package.json ---//
console.log('Setting up package.json')
json = {
  name: functionNameValue,
  version: '1.0.0',
  license: 'ISC',
  scripts: {
    "build": "webpack",
    "test": "webpack && jasmine",
    "push": `webpack && jasmine && zip -j -r component.zip build/* && (aws lambda create-function --function-name ${functionNameValue} --runtime nodejs6.10 --role ${roleResourceValue} --handler component.process --zip-file fileb://./component.zip 2> /dev/null || aws lambda update-function-code --function-name ${functionNameValue} --zip-file fileb://./component.zip) && rm component.zip`
  }
}
fs.writeFileSync(`${functionNameValue}/package.json`, JSON.stringify(json, null, 2))


//--- Installing dependencies ---//
console.log('Installing dependencies')
let packageManagerCommand

if (commandExistsSync('yarn')) packageManagerCommand = 'yarn add'
else if (commandExistsSync('npm')) packageManagerCommand = 'npm install'
else {
  console.log('Package manager not found')
  process.exit(1)
}

execSync(`${packageManagerCommand} --dev babel-core@6.24.1 babel-loader babel-polyfill babel-preset-env babel-preset-flow flow-bin jasmine webpack@2.4.1`, { cwd: `${functionNameValue}` }, (error, stdout, stderr) => {
  console.log(stdout)  
  console.log(stderr)  
  if (err) console.log('Error occured: ', err)
})
