'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var render = require('../lib/snippets');
var placeholder = '<span class="copyable code-snippet" data-snippet="transfer.cmd"></span>';
var text = '@echo off\r\n  echo <file> >&2 $& {{.WebAddress}}\r\n';
var expected = '<span class="copyable code-snippet" data-snippet="transfer.cmd">@echo off\n  echo &lt;file&gt; &gt;&amp;2 $&amp; {{.WebAddress}}</span>';

assert.strictEqual(render('    ' + placeholder, function () { return text; }), '    ' + expected);
assert.strictEqual(render(expected, function () { return text; }), expected);
assert.strictEqual(render('<span class="copyable">unchanged</span>', function () {
    throw new Error('Unexpected snippet read');
}), '<span class="copyable">unchanged</span>');
assert.throws(function () {
    render(placeholder, function () { throw new Error('Missing snippet'); });
}, /Missing snippet/);

// Comment lines are wrapped in <span class="code-title"> so they can be styled
// and excluded when copied. Shell (#), batch (REM) and batch (::) are supported.
var commentPlaceholder = '<span class="code-snippet" data-snippet="x"></span>';
var withComments = render(commentPlaceholder, function () {
    return '# shell comment\n$ curl file\nREM batch comment\n:: another batch comment\n';
});
assert.ok(withComments.indexOf('<span class="code-title"># shell comment</span>') !== -1);
assert.ok(withComments.indexOf('<span class="code-title">REM batch comment</span>') !== -1);
assert.ok(withComments.indexOf('<span class="code-title">:: another batch comment</span>') !== -1);
// Non-comment lines (and markup chars within them) are escaped but not wrapped.
assert.ok(withComments.indexOf('$ curl file') !== -1);
assert.ok(withComments.indexOf('<span class="code-title">$ curl file') === -1);

// A lone '#' is treated as a comment; '#!' (shebang-style) and '#foo' are not.
var hashes = render(commentPlaceholder, function () { return '#\n#!/bin/sh\n#foo\n'; });
assert.ok(hashes.indexOf('<span class="code-title">#</span>') !== -1);
assert.ok(hashes.indexOf('<span class="code-title">#!') === -1);
assert.ok(hashes.indexOf('<span class="code-title">#foo') === -1);

var root = path.join(__dirname, '..');
var html = fs.readFileSync(path.join(root, 'src/index.html'), 'utf8');
var requested = [];
var output = render(html, function (name) {
    requested.push(name);
    return fs.readFileSync(path.join(root, 'src/snippets', name), 'utf8');
});
// Every placeholder resolves to a real snippet file.
assert.ok(requested.indexOf('transfer.cmd') !== -1);
assert.ok(requested.indexOf('quickstart.sh') !== -1);
// No placeholder spans are left behind in the output.
assert.ok(!/data-snippet="[\w.-]+"><\/span>/.test(output));
// transfer.cmd content is escaped (no raw redirection chars leak through).
assert.ok(output.indexOf('>&2') === -1);
assert.ok(output.indexOf('  echo No arguments specified. &gt;&amp;2') !== -1);
assert.ok(output.indexOf('"{{.WebAddress}}%file_name%"') !== -1);
// The batch "Save this as" title is rendered from a REM comment line.
assert.ok(output.indexOf('<span class="code-title">REM Save this as transfer.cmd (requires curl.exe)</span>') !== -1);
// Shell samples keep their "# ..." titles as styled comments.
assert.ok(output.indexOf('<span class="code-title"># Upload using cURL</span>') !== -1);
console.log('Snippet tests passed.');