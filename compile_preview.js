const fs = require('fs');
const path = require('path');

function compile() {
    try {
        const root = __dirname;
        let indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
        const styleCss = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
        const appJs = fs.readFileSync(path.join(root, 'app_v23.js'), 'utf8');

        // Replace stylesheet link with inline style block
        const stylesheetRegex = /<link\s+rel=["']stylesheet["']\s+href=["']style\.css.*?["']>/i;
        indexHtml = indexHtml.replace(stylesheetRegex, `<style>\n${styleCss}\n</style>`);

        // Replace script link with inline script block
        const scriptRegex = /<script\s+src=["']app_v23\.js.*?["']><\/script>/i;
        indexHtml = indexHtml.replace(scriptRegex, `<script>\n${appJs}\n</script>`);

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
