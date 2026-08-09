const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Resend } = require('resend');

// Import HTML Email Templates
const getMessageEmailHtml = require('./templates/messageTemplate');
const getTopMatchEmailHtml = require('./templates/topMatchTemplate');
const getRadiusEventEmailHtml = require('./templates/radiusEventTemplate');

admin.initializeApp();

// Helper to send email via Resend
async function sendEmail({ to, subject, html }) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error("Resend API Key is not set in process.env.RESEND_API_KEY");
            return;
        }
        const resend = new Resend(apiKey);
        const data = await resend.emails.send({
            from: 'GigConnAct <noreply@gigconnact.de>',
            to: to,
            subject: subject,
            html: html
        });
        console.log("Email sent successfully to", to, data);
    } catch (error) {
        console.error("Failed to send email to", to, error);
    }
}

// Helper to fetch user details (email and display name) by ID (supports musician, event, or user ID)
async function getUserDetails(id) {
    try {
        if (!id) return null;
        let userId = id;

        if (id.startsWith('mus_')) {
            const musDoc = await admin.firestore().collection('musicians').doc(id).get();
            if (musDoc.exists) {
                userId = musDoc.data().creatorId;
            } else {
                userId = id.replace(/^mus_/, '');
            }
        } else if (id.startsWith('evt_') || id.startsWith('event_')) {
            const eventDoc = await admin.firestore().collection('events').doc(id).get();
            if (eventDoc.exists) {
                userId = eventDoc.data().creatorId;
            } else {
                userId = id.replace(/^(evt_|event_)/, '');
            }
        }

        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        if (userDoc.exists) {
            const data = userDoc.data();
            return {
                email: data.email || null,
                name: data.name || data.contactName || 'Nutzer'
            };
        }
    } catch (e) {
        console.error("Failed to fetch user details:", e);
    }
    return null;
}

// Helper to resolve the display name for a participant ID (musician name, event name, or user name)
async function getDisplayName(id) {
    try {
        if (!id) return 'Nutzer';
        if (id.startsWith('mus_')) {
            const musDoc = await admin.firestore().collection('musicians').doc(id).get();
            if (musDoc.exists) return musDoc.data().name || 'Musiker';
        } else if (id.startsWith('evt_') || id.startsWith('event_')) {
            const eventDoc = await admin.firestore().collection('events').doc(id).get();
            if (eventDoc.exists) return eventDoc.data().name || 'Veranstaltung';
        }
        const userDoc = await admin.firestore().collection('users').doc(id).get();
        if (userDoc.exists) {
            const data = userDoc.data();
            return data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : (data.contactName || 'Nutzer');
        }
    } catch (e) {
        console.error("Failed to fetch display name:", e);
    }
    return 'Nutzer';
}

// Helper to calculate estimated distance between two cities (mockup mapping matching frontend)
function getEstimatedDistance(city1, city2) {
    if (!city1 || !city2) return 250;
    const c1 = city1.trim().toLowerCase();
    const c2 = city2.trim().toLowerCase();
    if (c1 === c2) return 0;
    
    const key = [c1, c2].sort().join("-");
    const distances = {
        "augsburg-münchen": 80,
        "augsburg-stuttgart": 150,
        "augsburg-nürnberg": 140,
        "münchen-nürnberg": 170,
        "münchen-stuttgart": 220,
        "nürnberg-stuttgart": 210
    };
    return distances[key] !== undefined ? distances[key] : 250;
}

// Helper to calculate match score matching frontend calculateMatch logic
function calculateMatch(musician, event, searcherRole = 'musician') {
    if (!musician || !event) return 0;

    // 1. Musiker-Typ (20 %)
    let typeScore = 0;
    const eventTypesRaw = event.musicianTypes || [];
    const eventTypes = Array.isArray(eventTypesRaw) 
        ? eventTypesRaw.map(t => String(t).trim().toLowerCase())
        : (typeof eventTypesRaw === 'string' ? eventTypesRaw.split(',').map(t => t.trim().toLowerCase()) : []);

    const musTypesRaw = musician.type || musician.musicianTypes || '';
    const musTypes = Array.isArray(musTypesRaw)
        ? musTypesRaw.map(t => String(t).trim().toLowerCase())
        : (typeof musTypesRaw === 'string' ? musTypesRaw.split(',').map(t => t.trim().toLowerCase()) : []);

    if (eventTypes.some(t => musTypes.includes(t))) {
        typeScore = 20;
    }

    // 2. Ort (10 %)
    let ortScore = 0;
    const distance = getEstimatedDistance(musician.location, event.location);
    if (searcherRole === 'musician') {
        if (distance <= (musician.radius || 100)) {
            ortScore = 10;
        }
    } else { // organizer
        const eventRadius = event.radius || 100;
        if (distance <= eventRadius) {
            ortScore = 10;
        }
    }

    // 3. Genres (20 %)
    let genresScore = 0;
    const evGenres = event.genres || [];
    const musGenres = musician.genres || [];
    if (evGenres.length > 0) {
        const commonGenres = evGenres.filter(g => musGenres.some(mg => String(mg).toLowerCase() === String(g).toLowerCase()));
        genresScore = (commonGenres.length / evGenres.length) * 20;
    }

    // 4. Instrumente (5 %)
    let instScore = 0;
    const evInst = event.instruments || [];
    const musInst = musician.instruments || [];
    if (evInst.length > 0) {
        const commonInst = evInst.filter(i => musInst.some(mi => String(mi).toLowerCase() === String(i).toLowerCase()));
        instScore = (commonInst.length / evInst.length) * 5;
    }

    // 5. Spielzeit (5 %)
    let durScore = 0;
    const evMinD = event.minDuration !== undefined ? event.minDuration : (event.duration || 0);
    const evMaxD = event.maxDuration !== undefined ? event.maxDuration : (event.duration || 24);
    const musMinD = musician.minDuration !== undefined ? musician.minDuration : 0;
    const musMaxD = musician.maxDuration || 24;
    
    if (searcherRole === 'musician') {
        if (evMaxD >= musMinD && evMinD <= musMaxD) durScore = 5;
    } else {
        if (evMinD >= musMinD && evMaxD <= musMaxD) durScore = 5;
    }

    // 6. Gage (5 %)
    let budgetScore = 0;
    const evMinB = event.minBudget !== undefined ? event.minBudget : (event.budget || 0);
    const evMaxB = event.maxBudget !== undefined ? event.maxBudget : (event.budget || 5000);
    const musMinB = musician.minBudget || 0;
    const musMaxB = musician.maxBudget !== undefined ? musician.maxBudget : (musician.minBudget || 5000);

    if (searcherRole === 'musician') {
        if (evMaxB >= musMinB && evMinB <= musMaxB) budgetScore = 5;
    } else {
        if (evMinB >= musMinB && evMaxB <= musMaxB) budgetScore = 5;
    }

    // 7. Event-Typ (20 %)
    let eventTypeScore = 0;
    const musEventTypesRaw = musician.eventTypes || [];
    const musEventTypes = Array.isArray(musEventTypesRaw)
        ? musEventTypesRaw.map(t => String(t).trim().toLowerCase())
        : (typeof musEventTypesRaw === 'string' ? musEventTypesRaw.split(',').map(t => t.trim().toLowerCase()) : []);

    const evType = event.type || event.eventType || '';
    let evTypes = event.eventTypes;
    if (!evTypes) {
        evTypes = Array.isArray(evType)
            ? evType.map(t => String(t).trim().toLowerCase())
            : (typeof evType === 'string' ? evType.split(',').map(s => s.trim().toLowerCase()) : []);
    } else {
        evTypes = Array.isArray(evTypes)
            ? evTypes.map(t => String(t).trim().toLowerCase())
            : (typeof evTypes === 'string' ? evTypes.split(',').map(s => s.trim().toLowerCase()) : []);
    }

    if (evTypes.some(t => musEventTypes.includes(t.toLowerCase()))) {
        eventTypeScore = 20;
    }

    // 8. Verfügbarkeit / Datum (5 %) - Default 5%
    let dateScore = 5; 

    const totalScore = typeScore + ortScore + genresScore + instScore + durScore + budgetScore + eventTypeScore + dateScore;
    return Math.round(totalScore);
}

// ==========================================
// REGEL 1: Neue Nachricht im Postfach
// ==========================================
exports.onNewChatMessage = functions
    .region('europe-west3')
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .firestore.document('chats/{chatId}')
    .onWrite(async (change, context) => {
        const before = change.before.exists ? change.before.data() : null;
        const after = change.after.exists ? change.after.data() : null;

        if (!after) return null; // Chat gelöscht

        const messagesBefore = before ? (before.messages || []) : [];
        const messagesAfter = after.messages || [];

        // Keine neuen Nachrichten hinzugefügt
        if (messagesAfter.length <= messagesBefore.length) return null;

        const latestMessage = messagesAfter[messagesAfter.length - 1];

        // Systemnachrichten ignorieren
        if (!latestMessage.senderId || latestMessage.senderName === 'System' || latestMessage.senderId === 'system') return null;

        // Empfänger ermitteln (die andere Partei im Chat)
        const recipientId = after.participants 
            ? after.participants.find(id => id !== latestMessage.senderId)
            : ((latestMessage.senderId === after.musicianId) ? after.organizerId : after.musicianId);

        const recipient = await getUserDetails(recipientId);
        if (!recipient || !recipient.email) {
            console.warn(`Kein Empfänger-Email für ID gefunden: ${recipientId}`);
            return null;
        }

        const senderName = await getDisplayName(latestMessage.senderId);

        const subject = `Neue Nachricht von ${senderName} 💬`;
        const html = getMessageEmailHtml({
            senderName: senderName,
            messageText: latestMessage.text
        });

        await sendEmail({ to: recipient.email, subject, html });
        return null;
    });

// ==========================================
// REGEL 3: Neues Event im Umkreis (Nur für Musiker)
// ==========================================
exports.onNewEventRadiusAlert = functions
    .region('europe-west3')
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .firestore.document('events/{eventId}')
    .onCreate(async (snapshot, context) => {
        const event = snapshot.data();
        if (!event || event.isActive === false) return null;

        // Alle Musiker laden
        const musiciansSnapshot = await admin.firestore().collection('musicians').get();
        const musicians = [];
        musiciansSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.isActive !== false) {
                musicians.push(data);
            }
        });

        const mailPromises = musicians.map(async (musician) => {
            // Distanz berechnen
            const distance = getEstimatedDistance(musician.location, event.location);
            const travelRadius = musician.radius || 100; // Default 100km

            // Liegt das Event im Radius des Musikers?
            if (distance <= travelRadius) {
                const userDetails = await getUserDetails(musician.id); // musician.id entspricht user.uid
                if (userDetails && userDetails.email) {
                    const subject = `Neuer Gig in deiner Umgebung! 📍 (${event.title || 'Neues Event'})`;
                    const html = getRadiusEventEmailHtml({
                        musicianName: userDetails.name,
                        event: event,
                        distance: distance
                    });
                    return sendEmail({ to: userDetails.email, subject, html });
                }
            }
            return null;
        });

        await Promise.all(mailPromises);
        return null;
    });

// ==========================================
// REGEL 2: Täglicher Top-Match Check (Jeden Tag um 08:00 Uhr Berliner Zeit)
// ==========================================
exports.dailyTopMatchesCheck = functions
    .region('europe-west3')
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .pubsub.schedule('0 8 * * *')
    .timeZone('Europe/Berlin')
    .onRun(async (context) => {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // 1. Alle aktiven Musiker und Events laden
        const musiciansSnapshot = await admin.firestore().collection('musicians').get();
        const eventsSnapshot = await admin.firestore().collection('events').get();

        const musicians = [];
        musiciansSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.isActive !== false) musicians.push(data);
        });

        const events = [];
        eventsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.isActive !== false) events.push(data);
        });

        // Neue Gigs (in den letzten 24 Stunden erstellt)
        const newEvents = events.filter(e => e.createdAt && new Date(e.createdAt) >= oneDayAgo);
        
        // Neue Musiker (in den letzten 24 Stunden erstellt)
        const newMusicians = musicians.filter(m => m.createdAt && new Date(m.createdAt) >= oneDayAgo);

        console.log(`Starte täglichen Match-Check. Neue Events: ${newEvents.length}, Neue Musiker: ${newMusicians.length}`);

        // A. Neue Top-Matches für Musiker ermitteln (neue Events der letzten 24h mit Score >= 70)
        const musicianPromises = musicians.map(async (musician) => {
            const topMatches = [];
            newEvents.forEach(event => {
                const score = calculateMatch(musician, event, 'musician');
                if (score >= 70) {
                    topMatches.push({ ...event, matchScore: score });
                }
            });

            if (topMatches.length > 0) {
                const userDetails = await getUserDetails(musician.id);
                if (userDetails && userDetails.email) {
                    const subject = `Deine neuen Top-Matches heute! 🌟 (${topMatches.length} Treffer)`;
                    const html = getTopMatchEmailHtml({
                        userName: userDetails.name,
                        role: 'musician',
                        matches: topMatches
                    });
                    await sendEmail({ to: userDetails.email, subject, html });
                }
            }
        });

        // B. Neue Top-Matches für Veranstalter ermitteln (neue Musiker der letzten 24h mit Score >= 70)
        const organizerPromises = events.map(async (event) => {
            const topMatches = [];
            newMusicians.forEach(musician => {
                const score = calculateMatch(musician, event, 'organizer');
                if (score >= 70) {
                    topMatches.push({ ...musician, matchScore: score });
                }
            });

            if (topMatches.length > 0) {
                // Event-Creator-E-Mail laden
                const creatorId = event.creatorId;
                if (creatorId) {
                    const userDetails = await getUserDetails(creatorId);
                    if (userDetails && userDetails.email) {
                        const subject = `Neue passende Musiker für dein Event! 🌟 (${topMatches.length} Profile)`;
                        const html = getTopMatchEmailHtml({
                            userName: userDetails.name,
                            role: 'organizer',
                            matches: topMatches
                        });
                        await sendEmail({ to: userDetails.email, subject, html });
                    }
                }
            }
        });

        await Promise.all([...musicianPromises, ...organizerPromises]);
         console.log("Täglicher Match-Check abgeschlossen.");
        return null;
    });

// Trigger redeploy to force hash update: 2026-08-09T13:10
