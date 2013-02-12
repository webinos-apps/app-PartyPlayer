#!/usr/bin/env node
/*
 * Code contributed to the webinos project.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * (C) Copyright 2012, TNO
 */

var ID3 = require('id3');
var fs = require('fs');
var path = require('path');
var Canvas = require('canvas');
var argv = require('optimist').argv;

var DEFAULT_COVER = '../apps/library/album-art-unknown.png';

var argv = require('optimist')
    .usage('Usage: indexer.js --lib=<folder containing the media items> [--defaultCover=' + DEFAULT_COVER + ']')
    .demand(['lib'])
    .argv;
    
var filenames = fs.readdirSync(argv.lib);

var defaultCover;

if (argv.defaultCover) {
    defaultCover = fs.readFileSync(artv.defaultCover)
} else {
    defaultCover = fs.readFileSync(DEFAULT_COVER);
}

var items = new Array;

for (var i in filenames) {
    if (filenames[i].indexOf('.mp3', filenames[i].length - '.mp3'.length) !== -1) {
        var file = fs.readFileSync(path.join(argv.lib, filenames[i]));
    
        var id3 = new ID3(file);
        var cover;
        
        id3.parse();

        try {
            if (id3.get('picture')) {
                // resize it
                // note: webinos constraints frame size (and thus image) to 64kbytes
                var canvas = new Canvas(140, 140);
                var ctx = canvas.getContext('2d');
                var img = new Canvas.Image;
                img.src = id3.get('picture').data;
                ctx.drawImage(img, 0, 0, 140, 140);
                cover = canvas.toBuffer();
            } else {
                cover = defaultCover;
            }
        } catch (err) {
            console.log('Error getting album art from: ' + filenames[i] + ' - ignoring the album art for this file.')
        }
    
        var item = {
            filename: filenames[i],
            artist: id3.get('artist'),
            title: id3.get('title'),
            album: id3.get('album'),
            cover: 'data:image/png;base64,' + cover.toString('base64')
        }

        items.push(item);
    }
}

fs.writeFileSync(path.join(argv.lib, 'index.json'), JSON.stringify(items));
