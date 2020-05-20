#!/usr/bin/env node

'use strict';

var markdownLinkCheck = require('markdown-link-check');
var fs = require("fs");
var glob = require("glob");
var path = require("path");
var chalk = require("chalk");

var files = glob.sync("**/*.md", {
    ignore: [
        "node_modules/**/*.md", 
        "vendor/**/*.md", 
        "docs/wiki/_DELETED/**/*.md", 
        "docs/deprecated_wiki/**/*.md",
        "docs/CentOS-install.md",
        "docs/Ubuntu-install.md"
    ]
})

var config = JSON.parse(fs.readFileSync("test/.markdown-link-check.json"));
config.timeout = '30s'

files.forEach(function(file) {
  var markdown = fs.readFileSync(file).toString();
  let opts = Object.assign({}, config);  
  opts.baseUrl = 'file://' + path.dirname(path.resolve(file));

  markdownLinkCheck(markdown, opts, function (err, results) {
    let file_printed = false;
    if (err) {
        console.error('Error', err);
        return;
    }

    results.forEach(function (result) {
        if((result.status === "dead" || result.status === "error") && result.statusCode != 429) {
	    if(!file_printed) {
                console.log(chalk.green("Reading: " + file));
                file_printed = true;
            }
            if (result.statusCode == 500) {
                console.log(chalk.yellow("Server error on target: " + result.link));
            } else {
                console.log(chalk.red("Dead: " + result.link));
            }
        }
    });
  });
});
