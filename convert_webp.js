const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processImages() {
    const files = fs.readdirSync(__dirname);
    const imageFiles = files.filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));

    const convertedMap = {};

    for (const file of imageFiles) {
        const ext = path.extname(file);
        const basename = path.basename(file, ext);
        const targetFile = `${basename}.webp`;

        let quality = 90;
        let pInfo = null;

        while (quality > 10) {
            const buffer = await sharp(file)
                .webp({ quality: quality })
                .toBuffer();

            if (buffer.length <= 100 * 1024 || quality <= 15) {
                fs.writeFileSync(targetFile, buffer);
                console.log(`Converted ${file} -> ${targetFile} (${(buffer.length / 1024).toFixed(2)} KB, quality ${quality})`);
                convertedMap[file] = targetFile;
                break;
            }
            quality -= 5;
        }
    }

    // Now replace inside HTML and CSS files
    const replaceFiles = files.filter(f => f.endsWith('.html') || f.endsWith('.css'));
    for (const textFile of replaceFiles) {
        let content = fs.readFileSync(textFile, 'utf-8');
        let originalContent = content;

        for (const [oldName, newName] of Object.entries(convertedMap)) {
            content = content.split(oldName).join(newName);
        }

        if (content !== originalContent) {
            fs.writeFileSync(textFile, content, 'utf-8');
            console.log(`Updated references in ${textFile}`);
        }
    }
}

processImages().catch(err => console.error(err));
