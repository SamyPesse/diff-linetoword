var assert = require('assert');
var diffLineToWord = require('../');

describe('diff-linetoword', function() {

    it('should correctly output a word-diff', function() {
        var PATCH = "@@ -2,6 +2,10 @@\n All notable changes to this project will be documented in this file.\n This project adheres to [Semantic Versioning](http://semver.org/).\n \n+## 2.6.7\n+- Fix bug with filenames including spaces\n+- Add Turkish and Catalan translations\n+\n ## 2.6.6\n - Fix custom CSS that are generated by plugins for PDF output\n ";
        assert.equal(diffLineToWord(PATCH), "@@ -2,6 +2,10 @@\nAll notable changes to this project will be documented in this file.\nThis project adheres to [Semantic Versioning](http://semver.org/).\n\n## 2.6.{+7\n- Fix bug with filenames including spaces\n- Add Turkish and Catalan translations\n\n## 2.+}6{+.6+}\n- Fix custom CSS that are generated by plugins for PDF output\n\n");
    });

    it('should correctly output a word-diff (2)', function() {
        var PATCH = "@@ -8,7 +8,7 @@ GitBook\n \n GitBook is a command line tool (and Node.js library) for building beautiful books using GitHub/Git and Markdown (or AsciiDoc). Here is an example: [Learn Javascript](https://www.gitbook.com/book/GitBookIO/javascript).\n \n-You can publish and host book easily online using [gitbook.com](https://www.gitbook.com). A desktop editor is [also available](https://www.gitbook.com/editor).\n+You can publish and host books easily online using [gitbook.com](https://www.gitbook.com). A desktop editor is [also available](https://www.gitbook.com/editor).\n \n Check out the [GitBook Community Slack Channel](https://slack.gitbook.com), Stay updated by following [@GitBookIO](https://twitter.com/GitBookIO) on Twitter or [GitBook](https://www.facebook.com/gitbookcom) on Facebook.\n ";
        assert.equal(diffLineToWord(PATCH), "@@ -8,7 +8,7 @@\n\nGitBook is a command line tool (and Node.js library) for building beautiful books using GitHub/Git and Markdown (or AsciiDoc). Here is an example: [Learn Javascript](https://www.gitbook.com/book/GitBookIO/javascript).\n\nYou can publish and host [-book-]{+books+} easily online using [gitbook.com](https://www.gitbook.com). A desktop editor is [also available](https://www.gitbook.com/editor).\n\nCheck out the [GitBook Community Slack Channel](https://slack.gitbook.com), Stay updated by following [@GitBookIO](https://twitter.com/GitBookIO) on Twitter or [GitBook](https://www.facebook.com/gitbookcom) on Facebook.\n\n");
    });

    it('should correctly handle newline', function() {
        var PATCH = "@@ -1 +1 @@\n-Hello world. cool?\n\\ No newline at end of file\n+Hello. cool? Awesome!\n\\ No newline at end of file\n"
        assert.equal(diffLineToWord(PATCH), "@@ -1,1 +1,1 @@\nHello[- world-]. cool?{+ Awesome!+}\n");
    });

    it('should correctly return html', function() {
        var PATCH = "@@ -1 +1 @@\n-Hello world. cool?\n\\ No newline at end of file\n+Hello. cool? Awesome!\n\\ No newline at end of file\n"
        assert.equal(diffLineToWord.html(PATCH), '<span class="diff-header">@@ -1,1 +1,1 @@</span>Hello<span class="diff-removed"> world</span>. cool?<span class="diff-added"> Awesome!</span>\n');
    });
});

