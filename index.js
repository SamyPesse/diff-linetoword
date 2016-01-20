var JsDiff = require('diff');
var _ = require('lodash');

// Convert a hunk into a {before,after} object
function splitHunk(hunk) {
    var newHunk = {
        oldStart: hunk.oldStart,
        oldLines: hunk.oldLines,
        newStart: hunk.newStart,
        newLines: hunk.newLines,
        before: '',
        after: ''
    };

    _.each(hunk.lines, function(line) {
        var lineContent = line.slice(1);
        var lineType = line[0];

        if (lineType == '+') {
            newHunk.after += lineContent + '\n';
        } else if (lineType == '-') {
            newHunk.before += lineContent + '\n';
        } else {
            newHunk.before += lineContent + '\n';
            newHunk.after += lineContent + '\n';
        }
    });

    return newHunk;
}

// Convert a hunk to a patch sring
function hunkToPatchString(hunk, options) {
    var changes = JsDiff.diffWords(hunk.before, hunk.after);
    var patch = '@@ -' + hunk.oldStart + ',' + hunk.oldLines+' +' + hunk.newStart + ',' + hunk.newLines + ' @@\n';

    _.each(changes, function(change) {
        if (change.added) {
            patch = patch + options.added.replace('%s', change.value);
        } else if (change.removed) {
            patch = patch + options.removed.replace('%s', change.value);
        } else {
            patch = patch + change.value;
        }
    })

    return patch;
}

// Convert a line-diff patch to a word-diff patch
function convertToWordDiff(patch, options) {
    options = _.defaults(options || {}, {
        added: '{+%s+}',
        removed: '[-%s-]'
    });

    if (_.isString(patch)) patch = JsDiff.parsePatch(patch)[0];


    return _.chain(patch.hunks)
        .map(function(hunk) {
            hunk = splitHunk(hunk);
            return hunkToPatchString(hunk, options);
        })
        .join('\n\n')
        .value();
}

module.exports = convertToWordDiff;
