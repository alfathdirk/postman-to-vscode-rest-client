#!/usr/bin/env node

const convert = require('../lib.js');
const { cwd } = require('process');
const fileArg = process.argv.slice(2)[0];
const fs = require('fs');
let pathDir = cwd()+ '/' + fileArg;
try {
    // console.log(fileArg);
    let readFile = fs.readFileSync(pathDir, 'utf8');
    convert(JSON.parse(readFile).item);
} catch (error) {
    console.error('error on convert', error.message);
}