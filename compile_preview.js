const fs = require('fs');
const path = require('path');

function compile() {
    try {
        const root = __dirname;
        let indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

        // Add preload tag for video as in original preview if needed
        if (!indexHtml.includes('<link rel="preload" href="hochzeit.mp4" as="video" type="video/mp4">')) {
            indexHtml = indexHtml.replace(
                '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
                '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link rel="preload" href="hochzeit.mp4" as="video" type="video/mp4">'
            );
        }

        // Write to preview.html and gigconnact_preview.html
        fs.writeFileSync(path.join(root, 'preview.html'), indexHtml, 'utf8');
        fs.writeFileSync(path.join(root, 'gigconnact_preview.html'), indexHtml, 'utf8');

        console.log('Successfully generated preview.html and gigconnact_preview.html!');
    } catch (err) {
        console.error('Compilation failed:', err);
    }
}

compile();
