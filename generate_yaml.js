const fs = require('fs');
const path = require('path');
const loader = require('./functions/node_modules/firebase-functions/lib/runtime/loader');
const manifest = require('./functions/node_modules/firebase-functions/lib/runtime/manifest');

async function run() {
  const stack = await loader.loadStack('./functions');
  const wire = manifest.stackToWire(stack);
  fs.writeFileSync('./functions/functions.yaml', JSON.stringify(wire, null, 2));
  console.log('Successfully wrote functions.yaml');
}
run().catch(console.error);
