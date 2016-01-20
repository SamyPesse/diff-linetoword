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
        } else if (lineType == '\\') {
            // ignore
        } else {
            newHunk.before += lineContent + '\n';
            newHunk.after += lineContent + '\n';
        }
    });

    return newHunk;
}

// Convert a hunk to a patch sring
function hunkToPatchString(hunk, options) {
    var changes = JsDiff.diffWordsWithSpace(hunk.before, hunk.after);
    var patch = options.header.replace('%s', '@@ -' + hunk.oldStart + ',' + hunk.oldLines+' +' + hunk.newStart + ',' + hunk.newLines + ' @@');

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
        header: '%s\n',
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
