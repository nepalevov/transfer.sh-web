'use strict';

$(document).ready(function() {

    // Smooth scrolling
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });

    // Terminal typing animation
    var $terminalCode = $('#terminal .code-wrapper');
    if ($terminalCode.length && typeof require === 'function') {
        try {
            var builder = require('typewriter');

            // Capture the original lines (text) and the comment spans (html) before clearing.
            var rawText = $terminalCode.get(0).textContent;
            var lines = rawText.split('\n').map(function (l) { return l.trim(); });

            $terminalCode.empty();

            // Hide the #web inner content (keeping its box for layout) until typing finishes.
            var $webContent = $('#web').children().css('opacity', 0);
            var $learnMore = $('.btn-home').css({ opacity: 0, 'pointer-events': 'none' });

            var typer = builder($terminalCode.get(0))
                .withAccuracy(100)
                .withMinimumSpeed(50)
                .withMaximumSpeed(200)
                .build();

            function escapeHtml(s) {
                return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }

            // Classify each non-empty line and drive the sequence.
            lines.forEach(function (line) {
                if (line === '') {
                    typer.put('\n');
                } else if (/^#\s/.test(line)) {
                    // Comment line (e.g. "# Upload using cURL"): appears instantly, preserves styling
                    typer.put('<span class="code-title">' + escapeHtml(line) + '</span>\n');
                    typer.wait(100);
                } else if (line.indexOf('$') === 0 || /^#{2,}/.test(line)) {
                    // Command line ("$ ...") and progress bar ("#### 100.0%"): typed character by character.
                    typer.type(escapeHtml(line));
                    typer.put('\n');
                    typer.wait(100);
                } else {
                    // Result / URL line: appears all at once.
                    typer.put(escapeHtml(line) + '\n');
                    typer.wait(100);
                }
            });

            // Reveal the web upload section once all typing is complete.
            typer.wait(0, function () {
                $webContent.css('opacity', 1);
                $learnMore.css('pointer-events', '').fadeTo(300, 1);
            });
        } catch (e) {
            $terminalCode.text($terminalCode.get(0).textContent);
            $('#web').children().css('opacity', 1);
            $('.btn-home').css({ opacity: 1, 'pointer-events': '' });
        }    } else {
        // Typewriter unavailable: reveal the CSS-hidden content so nothing stays blank.
        $('#terminal .code-wrapper, #web > *').css('opacity', 1);
        $('.btn-home').css({ opacity: 1, 'pointer-events': '' });    }


});

(function() {
    var files = Array();
    var queue = Array();

    $(window).bind('beforeunload', function(){
        if (queue.length===0)  {
            return;
        }

        return 'There are still ' + queue.length + ' files being uploaded.';
    });

    function deleteFile(baseURL) {
        var deleteModal = $('.delete-modal');
        if (deleteModal.hasClass('show')) {
            deleteModal.removeClass('show');
        } else {
            deleteModal.addClass('show');
        }

        deleteModal.find('input[placeholder]').each(function () {
            $(this).attr('size', $(this).attr('placeholder').length);
        });

        $('#confirm-delete').on('click', function (event) {
            event.stopPropagation();
            event.preventDefault();
            var deletionToken = $('#deletion-token').val();
            if (deletionToken.length > 0) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            deleteModal.find('#web').html('<span style="clear:both">File deleted</span>');
                            deleteModal.find('#error').html('')
                        } else {
                            deleteModal.find('#error').html('<span>Error (' + xhr.status + ') during deletion of file</span>');
                        }
                    }
                };

                // start deletion
                xhr.open('DELETE', baseURL + '/' + deletionToken, true);
                xhr.send();
            }
        });
    }

    function upload(file) {
        $('.browse').addClass('uploading');

        var li = $('<li style="clear:both;"/><br/><br/>');

        li.append($('<hr/>'));
        li.append($('<div><div class="upload-progress"><span></span><div class="bar" style="width:0%;">####################################################</div></div><p>Uploading... ' + file.name + '</p></div>'));
        $(li).appendTo($('.queue'));

        var xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', function(e) {
            var pc = parseInt((e.loaded / e.total * 100));
            $('.upload-progress', $(li)).show();
            $('.upload-progress .bar', $(li)).css('width', pc + '%');
            $('.upload-progress span', $(li)).empty().append(pc + '%');

        }, false);

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                $('#web').addClass('uploading');
                if (xhr.status === 200) {
                    var deletionToken = xhr.getResponseHeader('X-Url-Delete').split('/').pop();
                    var url = $('<p></p>').text(xhr.responseText).html();
                    $(li).html('<hr/><a target="_blank" href="' + url + '">' + url + '</a><br/><br/>' +
                        '<span class="code-title"># Deletion token</span><br/>' + deletionToken);
                } else {
                    $(li).html('<hr/><span>Error (' + xhr.status + ') during upload of file ' + file.name + '</span>');
                }

                // file uploaded successfully, remove from queue
                var index = queue.indexOf(xhr);
                if (index > -1) {
                    queue.splice(index, 1);
                }

                files.push(URI($('<p></p>').text(xhr.responseText.replace('\n', '')).html()).path());

                $('.download-zip').attr('href', URI('(' + files.join(',') + ').zip').absoluteTo(location.href).toString());
                $('.download-tar').attr('href', URI('(' + files.join(',') + ').tar.gz').absoluteTo(location.href).toString());

                $('.all-files').addClass('show');
            }
        };

        // should queue all uploads.
        queue.push(xhr);

        // start upload
        xhr.open('PUT', './' + file.name, true);
        xhr.send(file);
    }

    // Upload handlers (drag/drop, paste, browse, file input) only make sense on the
    // home/upload page. Download pages (<body id="download">) contain draggable
    // elements like the preview image and QR code — binding these there would turn an
    // accidental image self-drag into a stray PUT. Gate everything behind this check.
    if ($('body').attr('id') !== 'download' && $('#web').length) {

        $(document).bind('dragenter', function(event) {
            event.preventDefault();
        }).bind('dragover', function(event) {
            event.preventDefault();
            // show drop indicator
            $('#terminal').addClass('dragged');
            $('#web').addClass('dragged');
        }).bind('dragleave', function() {
            $('#terminal').removeClass('dragged');
            $('#web').removeClass('dragged');

        }).bind('drop dragdrop', function(event) {
            $('#terminal').removeClass('dragged');
            $('#web').removeClass('dragged');

            var files = event.originalEvent.dataTransfer.files;

            $.each(files, function(index, file) {
                if (file instanceof Blob) {
                    upload(file);
                }
            });

            event.stopPropagation();
            event.preventDefault();
        });

        $(document).bind('paste', function(event) {
            $.each(event.originalEvent.clipboardData.files, function(index, file) {
                upload(file);
            });
        });

        $('a.browse').on('click', function() {
            $('input[type=file]').click();
            return (false);
        });

        $('input[type=file]').on('change', function() {
            $.each(this.files, function(index, file) {
                if (file instanceof Blob) {
                    upload(file);
                }
            });
        });

    }

    $('a#fire-delete').on('click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        deleteFile($(this).attr('href'));
    });

    // Copy-to-clipboard for marked elements.
    // Mark any element with class "copyable" to make it copyable.
    // A copy button is injected next to each marked element.
    (function() {
        function copyText(text) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                return navigator.clipboard.writeText(text);
            }
            return new Promise(function(resolve, reject) {
                var ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.top = '-9999px';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                try {
                    document.execCommand('copy') ? resolve() : reject();
                } catch (err) {
                    reject(err);
                } finally {
                    document.body.removeChild(ta);
                }
            });
        }

        function flash(btn, label, cls) {
            var original = btn.textContent;
            btn.textContent = label;
            if (cls) {
                btn.classList.add(cls);
            }
            setTimeout(function() {
                btn.textContent = original;
                if (cls) {
                    btn.classList.remove(cls);
                }
            }, 1500);
        }

        // Returns the copyable text of a snippet: everything except comment
        // lines (rendered as .code-title), with surrounding blank lines trimmed.
        function copyableText(target) {
            var clone = target.cloneNode(true);
            var comments = clone.querySelectorAll('.code-title');
            for (var i = 0; i < comments.length; i++) {
                comments[i].parentNode.removeChild(comments[i]);
            }
            return clone.textContent
                .split('\n')
                .map(function(line) { return line.trim(); })
                .filter(function(line) { return line !== ''; })
                .join('\n');
        }

        var targets = document.querySelectorAll('.copyable');
        for (var i = 0; i < targets.length; i++) {
            (function(target) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'copy-cmd-btn';
                btn.setAttribute('aria-label', 'Copy to clipboard');
                btn.textContent = 'copy';

                btn.addEventListener('click', function() {
                    var text = copyableText(target);
                    copyText(text).then(function() {
                        flash(btn, 'copied!', 'copied');
                    }, function() {
                        flash(btn, 'error');
                    });
                }, false);

                var container = target.closest ? target.closest('.code-wrapper') : null;
                (container || target.parentNode).appendChild(btn);
            })(targets[i]);
        }
    })();

})();
