# diff-linetoword

[![Build Status](https://travis-ci.org/SamyPesse/diff-linetoword.svg?branch=master)](https://travis-ci.org/SamyPesse/diff-linetoword)

Convert line diff to word diff.

### Installation

```
$ npm install diff-linetoword
```

### Usage

```js
var diffLineToWord = require('diff-linetoword');

var patch = diffLineToWord('@@ -8,7 +8,7 @@  ....');
```
Options can be passed as a second argument: `added` and `removed` to change the markup of the diff.

Example to output HTML:

```js
var htmlPatch = diffLineToWord('@@ -8,7 +8,7 @@  ....', {
    added: '<span class="added">%s</span>',
    removed: '<span class="removed">%s</span>'
});
```
