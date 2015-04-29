#!/usr/bin/env node

/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2015, Nicolas Riesco and others as credited in the AUTHORS file
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 */

var fs = require('fs')
var path = require("path");
var marked = require('marked');
var exec = require('child_process').exec;

var projectPath = path.join(path.dirname(__dirname));
var docPath = path.join(projectPath, 'doc');
var mdFile = path.join(projectPath, 'README.md');
var outFile = path.join(docPath, 'output', 'index.html');

// Create the index.html file from the readme.md file of github repository using nb convert and marked
fs.readFile(mdFile, 'utf8', function(err, md) {
  if (err) {
    return console.log(err);
  };
  // Create the empty html template with nbconvert from empty notebook
  var nbConvertCmd = "ipython nbconvert --template 'doc/templates/ipython' 'doc/templates/empty_md.ipynb' --stdout"
  exec(nbConvertCmd,
    function(error, stdout, stderr) {
      console.log('Updating html template with nbconvert: ');
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      // Paste the html content created with marked inside the html template and write to index.html
      var result = stdout.replace(/MARKDOWN_GOES_HERE/g, marked(md));
      fs.writeFile(outFile, result, 'utf8', function(err) {
        if (err) return console.log(err);
      });
    });
});
