'use strict';

// Replaces <span ... data-snippet="name"></span> placeholders with the escaped
// contents of src/snippets/<name>. Comment lines inside a snippet are wrapped in
// <span class="code-title"> so they can be styled (and excluded when copied).
//
// Recognised comment markers (first non-space characters on a line):
//   #     shell / curl samples (e.g. "# Upload using cURL", "#comment", "#   huh")
//   REM   Windows batch files (e.g. "REM Save this as transfer.cmd")
//   @REM  Windows batch files (echo-suppressed form)
//   ::    Windows batch files (alternate comment form)
var COMMENT = /^(\s*)(#.*|@?REM(?:\s.*|)|::.*)$/i;

function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderSnippet(text) {
    var normalized = text.replace(/\r\n/g, '\n').replace(/\n$/, '');
    return normalized.split('\n').map(function (line) {
        var match = COMMENT.exec(line);
        if (!match) {
            return escapeHtml(line);
        }
        return match[1] + '<span class="code-title">' + escapeHtml(match[2]) + '</span>';
    }).join('\n');
}

module.exports = function (html, readSnippet) {
    return html.replace(/(<span\b[^>]*\bdata-snippet="([\w.-]+)"[^>]*>)[\s\S]*?<\/span>/g, function (_, opening, name) {
        return opening + renderSnippet(readSnippet(name)) + '</span>';
    });
};