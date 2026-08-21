const admin = require('firebase-admin');
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const db = admin.firestore();
db.collection('events').get().then(snap => {
    snap.forEach(doc => {
        const d = doc.data();
        if (d.name && d.name.includes('Mia')) {
            console.log("FOUND EVENT:", doc.id, JSON.stringify(d, null, 2));
        }
    });
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
