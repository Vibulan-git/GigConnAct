const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Resend } = require('resend');

// Import HTML Email Templates
const getMessageEmailHtml = require('./templates/messageTemplate');
const getTopMatchEmailHtml = require('./templates/topMatchTemplate');
const getRadiusEventEmailHtml = require('./templates/radiusEventTemplate');
const getVerificationEmailHtml = require('./templates/verificationTemplate');
const getPasswordResetEmailHtml = require('./templates/passwordResetTemplate');
const getSignInEmailHtml = require('./templates/signInTemplate');

admin.initializeApp();

// Helper to send email via Resend
async function sendEmail({ to, subject, html, headers = {} }) {
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
            html: html,
            headers: headers
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
        let profileContactName = null;
        let profileName = null;
        let profileEmail = null;
        let profileRole = null;

        if (id.startsWith('mus_')) {
            const musDoc = await admin.firestore().collection('musicians').doc(id).get();
            if (musDoc.exists) {
                const musData = musDoc.data();
                userId = musData.creatorId || id.replace(/^mus_/, '');
                profileContactName = musData.contactName;
                profileName = musData.name;
                profileEmail = musData.email;
                profileRole = 'musician';
            } else {
                userId = id.replace(/^mus_/, '');
            }
        } else if (id.startsWith('evt_') || id.startsWith('event_')) {
            const eventDoc = await admin.firestore().collection('events').doc(id).get();
            if (eventDoc.exists) {
                const evtData = eventDoc.data();
                userId = evtData.creatorId || id.replace(/^(evt_|event_)/, '');
                profileContactName = evtData.contactName;
                profileName = evtData.name;
                profileEmail = evtData.email;
                profileRole = 'organizer';
            } else {
                userId = id.replace(/^(evt_|event_)/, '');
            }
        }

        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        let email = profileEmail || null;
        let displayName = null;
        let role = profileRole || 'musician';

        if (userDoc.exists) {
            const data = userDoc.data();
            email = data.email || email;
            role = data.role || role;
            displayName = data.name || data.contactName;
            if (!displayName && (data.firstName || data.lastName)) {
                displayName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
            }
        }

        // Apply fallback hierarchy for name
        let finalName = displayName;
        if (!finalName || finalName.toLowerCase() === 'nutzer' || finalName.toLowerCase() === 'gigconnact nutzer') {
            finalName = profileContactName || profileName || 'Nutzer';
        }

        return {
            email: email,
            name: finalName,
            role: role
        };
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

    const coords = {
        "berlin": { lat: 52.5200, lon: 13.4050 },
        "hamburg": { lat: 53.5511, lon: 9.9937 },
        "münchen": { lat: 48.1351, lon: 11.5820 },
        "muenchen": { lat: 48.1351, lon: 11.5820 },
        "köln": { lat: 50.9375, lon: 6.9603 },
        "koeln": { lat: 50.9375, lon: 6.9603 },
        "frankfurt": { lat: 50.1109, lon: 8.6821 },
        "stuttgart": { lat: 48.7758, lon: 9.1829 },
        "düsseldorf": { lat: 51.2271, lon: 6.7735 },
        "duesseldorf": { lat: 51.2271, lon: 6.7735 },
        "dortmund": { lat: 51.5136, lon: 7.4653 },
        "essen": { lat: 51.4556, lon: 7.0116 },
        "bremen": { lat: 53.0793, lon: 8.8017 },
        "leipzig": { lat: 51.3397, lon: 12.3731 },
        "dresden": { lat: 51.0504, lon: 13.7373 },
        "hannover": { lat: 52.3759, lon: 9.7320 },
        "nürnberg": { lat: 49.4521, lon: 11.0767 },
        "nuernberg": { lat: 49.4521, lon: 11.0767 },
        "augsburg": { lat: 48.3705, lon: 10.8978 },
        "bonn": { lat: 50.7374, lon: 7.0982 },
        "münster": { lat: 51.9607, lon: 7.6261 },
        "muenster": { lat: 51.9607, lon: 7.6261 },
        "karlsruhe": { lat: 49.0069, lon: 8.4037 },
        "mannheim": { lat: 49.4875, lon: 8.4660 }
    };

    function clean(city) {
        return city
            .replace(/\s*\(\d+\)\s*/g, '') // remove zip code in parentheses
            .replace(/\d+/g, '')            // remove any other numbers
            .trim()
            .toLowerCase();
    }

    const cities1 = city1.split(',').map(clean);
    const cities2 = city2.split(',').map(clean);

    let minDistance = Infinity;

    for (const c1 of cities1) {
        for (const c2 of cities2) {
            if (c1 === c2) {
                minDistance = 0;
                continue;
            }

            const p1 = coords[c1];
            const p2 = coords[c2];

            if (p1 && p2) {
                const R = 6371; // km
                const dLat = (p2.lat - p1.lat) * Math.PI / 180;
                const dLon = (p2.lon - p1.lon) * Math.PI / 180;
                const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                          Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
                          Math.sin(dLon/2) * Math.sin(dLon/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                const d = R * c;
                minDistance = Math.min(minDistance, d);
            } else {
                const key = [c1, c2].sort().join("-");
                const distances = {
                    "augsburg-münchen": 80,
                    "augsburg-stuttgart": 150,
                    "augsburg-nürnberg": 140,
                    "münchen-nürnberg": 170,
                    "münchen-stuttgart": 220,
                    "nürnberg-stuttgart": 210
                };
                const d = distances[key] !== undefined ? distances[key] : 250;
                minDistance = Math.min(minDistance, d);
            }
        }
    }

    if (minDistance === Infinity) {
        return 250;
    }
    return minDistance;
}

// Helper to calculate match score matching frontend calculateMatch logic
function calculateMatch(musician, event, searcherRole = 'musician') {
    if (!musician || !event) return 0;

    // 1. Musiker-Typ (25 %)
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
        typeScore = 25;
    }

    // 2. Ort (5 %)
    let ortScore = 0;
    const distance = getEstimatedDistance(musician.location, event.location);
    if (searcherRole === 'musician') {
        if (distance <= (musician.radius || 100)) {
            ortScore = 5;
        }
    } else { // organizer
        const eventRadius = event.radius || 100;
        if (distance <= eventRadius) {
            ortScore = 5;
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

    // 4. Instrumente (10 %)
    let instScore = 0;
    const evInst = event.instruments || [];
    const musInst = musician.instruments || [];
    if (evInst.length > 0) {
        const commonInst = evInst.filter(i => musInst.some(mi => String(mi).toLowerCase() === String(i).toLowerCase()));
        instScore = (commonInst.length / evInst.length) * 10;
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

    // 9. Publikum (5 %)
    let publikumScore = 0;
    const evMinP = event.minPublikum || 0;
    const evMaxP = event.maxPublikum !== undefined ? event.maxPublikum : (event.minPublikum || 500);
    const musMinP = musician.minPublikum || 0;
    const musMaxP = musician.maxPublikum !== undefined ? musician.maxPublikum : (musician.minPublikum || 500);
    if (evMinP >= musMinP && evMaxP <= musMaxP) {
        publikumScore = 5;
    }

    // 10. Weitere Kriterien (5 %)
    let matchesCount = 0;
    const musTech = Array.isArray(musician.technik) ? musician.technik : [musician.technik || "Technik ist noch unklar"];
    const evTech = Array.isArray(event.technik) ? event.technik : [event.technik || "Technik ist noch unklar"];
    if (musTech.includes("Technik vorhanden") && evTech.includes("Technik vorhanden")) {
        matchesCount++;
    }
    if (musTech.includes("Technik ist noch unklar") && evTech.includes("Technik ist noch unklar")) {
        matchesCount++;
    }
    if (evTech.includes("Technik nicht vorhanden") && musTech.includes("Technik vorhanden")) {
        matchesCount++;
    }
    if (musTech.includes("Technik nicht vorhanden") && evTech.includes("Technik vorhanden")) {
        matchesCount++;
    }
    let extraScore = (matchesCount / 3) * 5;

    const totalScore = typeScore + ortScore + genresScore + instScore + durScore + budgetScore + eventTypeScore + dateScore + publikumScore + extraScore;
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

        let senderProfile = null;
        let isSenderMusician = false;
        try {
            const musDoc = await admin.firestore().collection('musicians').doc(latestMessage.senderId).get();
            if (musDoc.exists) {
                senderProfile = musDoc.data();
                isSenderMusician = true;
            } else {
                const evtDoc = await admin.firestore().collection('events').doc(latestMessage.senderId).get();
                if (evtDoc.exists) {
                    senderProfile = evtDoc.data();
                }
            }
        } catch (err) {
            console.error('Error fetching sender profile for chat email:', err);
        }

        const subject = `Neue Nachricht von ${senderName} 💬`;
        const html = getMessageEmailHtml({
            senderName: senderName,
            messageText: latestMessage.text,
            role: recipient.role,
            senderProfile: senderProfile,
            isSenderMusician: isSenderMusician
        });

        await sendEmail({ to: recipient.email, subject, html });
        return null;
    });

// ==========================================
// REGEL 3: Neues Event im Umkreis (Jeden Tag um 17:00 Uhr Berliner Zeit)
// ==========================================
exports.dailyRadiusAlertsCheck = functions
    .region('europe-west3')
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .pubsub.schedule('0 17 * * *')
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
        
        if (newEvents.length === 0) {
            console.log("Keine neuen Events in den letzten 24 Stunden.");
            return null;
        }

        console.log(`Starte täglichen Umkreis-Check um 17:00 Uhr. Neue Events: ${newEvents.length}`);

        const mailPromises = musicians.map(async (musician) => {
            const matchedEvents = [];
            
            newEvents.forEach(event => {
                const distance = getEstimatedDistance(musician.location, event.location);
                const travelRadius = musician.radius || 100; // Default 100km
                if (distance <= travelRadius) {
                    matchedEvents.push({ ...event, distance });
                }
            });

            if (matchedEvents.length > 0) {
                const userDetails = await getUserDetails(musician.id); // musician.id entspricht user.uid
                if (userDetails && userDetails.email) {
                    const subject = `Neues Event in deiner Umgebung! 📍`;
                    const html = getRadiusEventEmailHtml({
                        userName: userDetails.name,
                        matches: matchedEvents
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
                    const subject = `Neue passende Gigs auf GigConnAct (${topMatches.length} Vorschlag${topMatches.length > 1 ? 'e' : ''})`;
                    const html = getTopMatchEmailHtml({
                        userName: userDetails.name,
                        role: 'musician',
                        profileName: musician.name || musician.title || '',
                        matches: topMatches,
                        profileId: musician.id
                    });
                    await sendEmail({ 
                        to: userDetails.email, 
                        subject, 
                        html,
                        headers: {
                            'List-Unsubscribe': '<https://gigconnact.de/#/settings>'
                        }
                    });
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
                        const subject = `Neue passende Musiker für dein Event (${topMatches.length} Profil${topMatches.length > 1 ? 'e' : ''})`;
                        const html = getTopMatchEmailHtml({
                            userName: userDetails.name,
                            role: 'organizer',
                            profileName: event.name || event.title || '',
                            matches: topMatches,
                            profileId: event.id
                        });
                        await sendEmail({ 
                            to: userDetails.email, 
                            subject, 
                            html,
                            headers: {
                                'List-Unsubscribe': '<https://gigconnact.de/#/settings>'
                            }
                        });
                    }
                }
            }
        });

        await Promise.all([...musicianPromises, ...organizerPromises]);
         console.log("Täglicher Match-Check abgeschlossen.");
        return null;
    });

// ==========================================
// REGEL 4: E-Mail Bestätigungslink generieren und senden
// ==========================================
exports.sendCustomVerificationEmail = functions
    .region('europe-west3')
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .https.onCall(async (data, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Bitte melde dich an.');
        }
        
        const email = context.auth.token.email || data.email;
        if (!email) {
            throw new functions.https.HttpsError('invalid-argument', 'Keine E-Mail-Adresse angegeben.');
        }

        try {
            const user = await admin.auth().getUser(context.auth.uid);
            let name = user.displayName || 'GigConnAct Nutzer';
            let role = 'musician';

            // Query user role and name from Firestore
            try {
                const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    role = userData.role || role;
                    name = userData.firstName && userData.lastName 
                        ? `${userData.firstName} ${userData.lastName}` 
                        : (userData.contactName || name);
                }
            } catch (err) {
                console.error("Failed to query user doc for verification email:", err);
            }

            const actionCodeSettings = {
                url: 'https://www.gigconnact.de/#/verify-email',
                handleCodeInApp: false
            };

            const link = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);
            const html = getVerificationEmailHtml({ link, name, role });
            await sendEmail({
                to: email,
                subject: 'Bestätige deine E-Mail-Adresse bei GigConnAct 📧',
                html: html
            });
            return { success: true };
        } catch (error) {
            console.error("Failed to generate/send email verification link:", error);
            throw new functions.https.HttpsError('internal', error.message);
        }
    });

// ==========================================
// REGEL 5: Passwort-Reset-Link generieren und senden
// ==========================================
exports.sendCustomPasswordResetEmail = functions
    .region('europe-west3')
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .https.onCall(async (data, context) => {
        const email = data.email;
        if (!email) {
            throw new functions.https.HttpsError('invalid-argument', 'Keine E-Mail-Adresse angegeben.');
        }

        try {
            const user = await admin.auth().getUserByEmail(email);
            let name = user.displayName || 'GigConnAct Nutzer';
            let role = 'musician';

            // Query user role and name from Firestore
            try {
                const userSnapshot = await admin.firestore().collection('users').where('email', '==', email.toLowerCase()).get();
                if (!userSnapshot.empty) {
                    const userData = userSnapshot.docs[0].data();
                    role = userData.role || role;
                    name = userData.firstName && userData.lastName 
                        ? `${userData.firstName} ${userData.lastName}` 
                        : (userData.contactName || name);
                }
            } catch (err) {
                console.error("Failed to query user doc for password reset email:", err);
            }

            const actionCodeSettings = {
                url: 'https://www.gigconnact.de/#/login',
                handleCodeInApp: false
            };

            const link = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);
            const html = getPasswordResetEmailHtml({ link, name, role });
            await sendEmail({
                to: email,
                subject: 'Passwort zurücksetzen für GigConnAct 🔑',
                html: html
            });
            return { success: true };
        } catch (error) {
            console.error("Failed to generate/send password reset link:", error);
            if (error.code === 'auth/user-not-found') {
                return { success: true, note: 'User not found' };
            }
            throw new functions.https.HttpsError('internal', error.message);
        }
    });

// ==========================================
// REGEL 6: Passwortlose Anmeldung / E-Mail Link generieren und senden
// ==========================================
exports.sendCustomSignInEmail = functions
    .region('europe-west3')
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .https.onCall(async (data, context) => {
        const email = data.email;
        let name = data.name || 'GigConnAct Nutzer';
        const isNewUser = data.isNewUser === true;
        let role = data.role;

        if (!email) {
            throw new functions.https.HttpsError('invalid-argument', 'Keine E-Mail-Adresse angegeben.');
        }

        // Query user role and name from Firestore if existing user
        if (email) {
            try {
                const userSnapshot = await admin.firestore().collection('users').where('email', '==', email.toLowerCase()).get();
                if (!userSnapshot.empty) {
                    const userData = userSnapshot.docs[0].data();
                    role = userData.role || role;
                    name = userData.firstName && userData.lastName 
                        ? `${userData.firstName} ${userData.lastName}` 
                        : (userData.contactName || name);
                }
            } catch (err) {
                console.error("Failed to query user details for email:", err);
            }
        }

        try {
            const actionCodeSettings = {
                url: 'https://www.gigconnact.de/',
                handleCodeInApp: true
            };

            const link = await admin.auth().generateSignInWithEmailLink(email, actionCodeSettings);
            const html = getSignInEmailHtml({ link, name, isNewUser, role });
            
            const subject = isNewUser 
                ? 'Dein Registrierungs-Link für GigConnAct' 
                : 'Dein Anmeldelink für GigConnAct 🔐';

            await sendEmail({
                to: email,
                subject: subject,
                html: html
            });

            return { success: true };
        } catch (error) {
            console.error("Failed to generate/send sign-in link:", error);
            throw new functions.https.HttpsError('internal', error.message);
        }
    });

// ==========================================
// Stripe Checkout Session Creation
// ==========================================
exports.createStripeCheckoutSession = functions
    .region('europe-west3')
    .runWith({ secrets: ['STRIPE_SECRET_KEY'] })
    .https.onCall(async (data, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Bitte melde dich an.');
        }

        const { planKey, baseUrl } = data;
        if (!planKey) {
            throw new functions.https.HttpsError('invalid-argument', 'Kein Tarif (Plan) angegeben.');
        }

        // Map plan keys to Price IDs
        const planPriceMap = {
            'flex': 'price_1U5PcZEOYldr8rIFF1E7EZZ0',
            'plus': 'price_1U68OyEOYldr8rIFWZ5Wolht',
            'pro': 'price_1U68NzEOYldr8rIFk4IGeuy3',
            'premium': 'price_1U5PcZEOYldr8rIFBPlFtXpf'
        };

        const priceId = planPriceMap[planKey];
        if (!priceId) {
            throw new functions.https.HttpsError('invalid-argument', 'Ungültiger Tarif angegeben.');
        }

        const fallbackBaseUrl = 'https://www.gigconnact.de';
        const cleanBaseUrl = (baseUrl && (baseUrl.startsWith('http://localhost') || baseUrl.startsWith('https://'))) 
            ? baseUrl 
            : fallbackBaseUrl;

        try {
            const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
            
            // Get user email, current plan, and customer ID
            const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
            const userData = userDoc.exists ? userDoc.data() : {};
            const email = userData.email || null;
            const stripeCustomerId = userData.stripeCustomerId || null;
            const currentPlan = userData.subscriptionPlan || null;
            const subscriptionId = userData.subscriptionId || null;
            const subscriptionStatus = userData.subscriptionStatus || null;

            const sessionParams = {
                mode: 'subscription',
                line_items: [{
                    price: priceId,
                    quantity: 1,
                }],
                success_url: `${cleanBaseUrl}/#/profile?payment=success`,
                cancel_url: `${cleanBaseUrl}/#/profile?payment=cancel`,
                metadata: {
                    userId: context.auth.uid,
                    planKey: planKey
                }
            };

            if (stripeCustomerId) {
                sessionParams.customer = stripeCustomerId;
            } else if (email) {
                sessionParams.customer_email = email;
            }

            // Check if email has already had a trial by hashing the email and checking in Firestore 'used_trials'
            let hasHadTrial = false;
            if (email) {
                const crypto = require('crypto');
                const emailHash = crypto.createHash('sha256').update(String(email).trim().toLowerCase()).digest('hex');
                const usedTrialDoc = await admin.firestore().collection('used_trials').doc(emailHash).get();
                if (usedTrialDoc.exists) {
                    hasHadTrial = true;
                }
            }

            const disableAllTrialsForTesting = false; // Set to false when ready to re-enable trials!

            // Set trial period dynamically based on the plan configuration:
            // - If the user has never had a trial, they get one.
            // - If the user has an active subscription, and they are changing their plan (Tarifwechsel), they get a trial for the new plan.
            const hasActiveSubscription = subscriptionId && (subscriptionStatus === 'active' || subscriptionStatus === 'trialing');
            const isPlanChange = hasActiveSubscription && currentPlan && currentPlan !== planKey;

            const allowTrial = !disableAllTrialsForTesting && (!hasHadTrial || isPlanChange);

            if (allowTrial) {
                if (planKey === 'premium') {
                    sessionParams.subscription_data = {
                        trial_period_days: 3
                    };
                } else if (planKey === 'flex' || planKey === 'plus' || planKey === 'pro') {
                    sessionParams.subscription_data = {
                        trial_period_days: 1
                    };
                }
            }

            const session = await stripe.checkout.sessions.create(sessionParams);

            return { url: session.url };
        } catch (error) {
            console.error("Stripe Checkout Error:", error);
            throw new functions.https.HttpsError('internal', error.message);
        }
    });

// ==========================================
// Stripe Subscription Cancel State Update
// ==========================================
exports.updateSubscriptionCancelState = functions
    .region('europe-west3')
    .runWith({ secrets: ['STRIPE_SECRET_KEY'] })
    .https.onCall(async (data, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Bitte melde dich an.');
        }

        const { cancelAtPeriodEnd } = data;
        const uid = context.auth.uid;

        try {
            const userDoc = await admin.firestore().collection('users').doc(uid).get();
            if (!userDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Benutzerprofil nicht gefunden.');
            }
            const userData = userDoc.data();
            const subscriptionId = userData.subscriptionId;

            let endStr = null;
            let mocked = false;

            if (subscriptionId) {
                try {
                    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
                    const subscription = await stripe.subscriptions.update(subscriptionId, {
                        cancel_at_period_end: cancelAtPeriodEnd
                    });
                    endStr = new Date(subscription.current_period_end * 1000).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
                } catch (stripeErr) {
                    console.error("Stripe API subscription update failed, falling back to local simulation:", stripeErr);
                    mocked = true;
                    
                    // If the subscription is missing on Stripe (e.g. 'No such subscription' or invalid/test ID), delete subscriptionId in Firestore
                    if (stripeErr.message && (stripeErr.message.includes('No such subscription') || stripeErr.code === 'resource_missing')) {
                        await admin.firestore().collection('users').doc(uid).update({
                            subscriptionId: admin.firestore.FieldValue.delete()
                        });
                    }
                }
            } else {
                mocked = true;
            }

            if (mocked) {
                // Mock/test user: locally calculate access end date
                const end = new Date();
                const plan = userData.subscriptionPlan || 'flex';
                if (plan === 'plus') {
                    end.setDate(end.getDate() + 180);
                } else if (plan === 'pro' || plan === 'premium') {
                    end.setDate(end.getDate() + 365);
                } else {
                    end.setDate(end.getDate() + 30);
                }
                endStr = end.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
            }

            await admin.firestore().collection('users').doc(uid).update({
                subscriptionCancelled: cancelAtPeriodEnd,
                subscriptionEndDate: cancelAtPeriodEnd ? endStr : admin.firestore.FieldValue.delete()
            });

            return {
                success: true,
                mocked: mocked,
                subscriptionCancelled: cancelAtPeriodEnd,
                subscriptionEndDate: cancelAtPeriodEnd ? endStr : null
            };
        } catch (error) {
            console.error("Failed to update subscription cancel state:", error);
            throw new functions.https.HttpsError('internal', error.message || 'Fehler beim Aktualisieren des Kündigungsstatus.');
        }
    });

// ==========================================
// Stripe Subscription Plan In-Place Update
// ==========================================
exports.changeStripeSubscriptionPlan = functions
    .region('europe-west3')
    .runWith({ secrets: ['STRIPE_SECRET_KEY'] })
    .https.onCall(async (data, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Bitte melde dich an.');
        }

        const { planKey } = data;
        if (!planKey) {
            throw new functions.https.HttpsError('invalid-argument', 'Kein Tarif angegeben.');
        }

        const planPriceMap = {
            'flex': 'price_1U5PcZEOYldr8rIFF1E7EZZ0',
            'plus': 'price_1U68OyEOYldr8rIFWZ5Wolht',
            'pro': 'price_1U68NzEOYldr8rIFk4IGeuy3',
            'premium': 'price_1U5PcZEOYldr8rIFBPlFtXpf'
        };

        const priceId = planPriceMap[planKey];
        if (!priceId) {
            throw new functions.https.HttpsError('invalid-argument', 'Ungültiger Tarif angegeben.');
        }

        const uid = context.auth.uid;

        try {
            const userDoc = await admin.firestore().collection('users').doc(uid).get();
            if (!userDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Benutzerprofil nicht gefunden.');
            }
            const userData = userDoc.data();
            const subscriptionId = userData.subscriptionId;

            if (!subscriptionId) {
                // Mock user: Update Firestore locally
                const updateData = {
                    isPremium: true,
                    subscriptionPlan: planKey,
                    subscriptionCancelled: false,
                    subscriptionEndDate: admin.firestore.FieldValue.delete()
                };
                await admin.firestore().collection('users').doc(uid).update(updateData);

                if (userData.profileId && userData.role === 'musician') {
                    await admin.firestore().collection('musicians').doc(userData.profileId).update({
                        isPremium: true,
                        subscriptionPlan: planKey
                    });
                }

                return { success: true, mocked: true };
            }

            const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const subItemId = subscription.items.data[0].id;

            const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
                items: [{
                    id: subItemId,
                    price: priceId,
                }],
                proration_behavior: 'create_prorations'
            });

            const updateData = {
                isPremium: true,
                subscriptionPlan: planKey,
                subscriptionCancelled: updatedSubscription.cancel_at_period_end,
                subscriptionPeriodStart: updatedSubscription.current_period_start,
                subscriptionPeriodEnd: updatedSubscription.current_period_end,
                subscriptionStatus: updatedSubscription.status,
                subscriptionEndDate: updatedSubscription.cancel_at_period_end
                    ? new Date(updatedSubscription.current_period_end * 1000).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : admin.firestore.FieldValue.delete()
            };

            await admin.firestore().collection('users').doc(uid).update(updateData);

            if (userData.profileId && userData.role === 'musician') {
                await admin.firestore().collection('musicians').doc(userData.profileId).update({
                    isPremium: true,
                    subscriptionPlan: planKey
                });
            }

            return {
                success: true,
                mocked: false,
                subscriptionPeriodEnd: updatedSubscription.current_period_end
            };
        } catch (error) {
            console.error("Failed to change Stripe subscription plan in-place:", error);
            throw new functions.https.HttpsError('internal', error.message || 'Fehler beim Wechseln des Tarifs.');
        }
    });

// ==========================================
// Stripe Webhook Handler
// ==========================================
exports.stripeWebhook = functions
    .region('europe-west3')
    .runWith({ secrets: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'RESEND_API_KEY'] })
    .https.onRequest(async (req, res) => {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.error("Webhook signature verification failed:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const metadata = session.metadata || {};

            if (metadata.type === 'mediation_payment') {
                const mediationId = metadata.mediationId;
                const musicianId = metadata.musicianId || null;
                console.log(`Processing successful mediation payment for mediation ID: ${mediationId}, musician: ${musicianId}`);
                try {
                    await releaseMediationContactsInternal(mediationId, musicianId);
                } catch (medErr) {
                    console.error("Failed to release contacts via Stripe Webhook:", medErr);
                    return res.status(500).send("Mediation release failed");
                }
            } else {
                const userId = metadata.userId;
                const planKey = metadata.planKey;

                if (userId && planKey) {
                    try {
                    console.log(`Processing successful subscription for user ${userId}, plan: ${planKey}`);
                    
                    const updateData = {
                        isPremium: true,
                        subscriptionPlan: planKey,
                        subscriptionCancelled: false,
                        subscriptionId: session.subscription || null,
                        stripeCustomerId: session.customer || null,
                        subscriptionEndDate: admin.firestore.FieldValue.delete()
                    };

                    if (session.subscription) {
                        try {
                            const sub = await stripe.subscriptions.retrieve(session.subscription);
                            updateData.subscriptionCreated = sub.created;
                            updateData.subscriptionPeriodStart = sub.current_period_start;
                            updateData.subscriptionPeriodEnd = sub.current_period_end;
                            updateData.subscriptionTrialStart = sub.trial_start || null;
                            updateData.subscriptionTrialEnd = sub.trial_end || null;
                            updateData.subscriptionStatus = sub.status;
                        } catch (subErr) {
                            console.error(`Failed to retrieve Stripe subscription details for ${session.subscription}:`, subErr);
                        }
                    }
                    
                    // Update user doc in Firestore
                    const userRef = admin.firestore().collection('users').doc(userId);
                    
                    // Fetch current user data before updating to retrieve the old subscription ID
                    const userDocBefore = await userRef.get();
                    const oldSubscriptionId = userDocBefore.exists ? (userDocBefore.data().subscriptionId || null) : null;

                    await userRef.update(updateData);

                    // Cancel old subscription if it exists and is different from the new one to prevent double billing
                    if (oldSubscriptionId && oldSubscriptionId !== session.subscription) {
                        try {
                            await stripe.subscriptions.cancel(oldSubscriptionId);
                            console.log(`Cancelled old subscription ${oldSubscriptionId} for user ${userId} due to plan change.`);
                        } catch (cancelErr) {
                            console.error(`Failed to cancel old subscription ${oldSubscriptionId}:`, cancelErr);
                        }
                    }

                    // Also check if there's a musician profile and update it too
                    const userDoc = await userRef.get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        if (userData.profileId && userData.role === 'musician') {
                            await admin.firestore().collection('musicians').doc(userData.profileId).update({
                                isPremium: true,
                                subscriptionPlan: planKey
                            });
                        }
                        
                        // Hash email and save to used_trials to prevent any future trial abuse if they cancel or delete later
                        const email = userData.email;
                        if (email) {
                            const crypto = require('crypto');
                            const emailHash = crypto.createHash('sha256').update(String(email).trim().toLowerCase()).digest('hex');
                            try {
                                await admin.firestore().collection('used_trials').doc(emailHash).set({
                                    hashedAt: admin.firestore.FieldValue.serverTimestamp()
                                });
                                console.log(`Saved trial abuse hash for subscribed user ${userId}`);
                            } catch (hashErr) {
                                console.error(`Error saving trial abuse hash for subscribed user ${userId}:`, hashErr);
                            }
                        }
                    }
                    console.log(`Successfully updated user ${userId} and their profiles to Premium.`);
                } catch (dbErr) {
                    console.error("Failed to update user profile in Firestore after Stripe webhook:", dbErr);
                    return res.status(500).send("Database update failed");
                }
            }
        }
    } else if (event.type === 'customer.subscription.updated') {
            const subscription = event.data.object;
            const userId = subscription.metadata ? subscription.metadata.userId : null;
            if (userId) {
                try {
                    await admin.firestore().collection('users').doc(userId).update({
                        subscriptionPeriodStart: subscription.current_period_start,
                        subscriptionPeriodEnd: subscription.current_period_end,
                        subscriptionTrialStart: subscription.trial_start || null,
                        subscriptionTrialEnd: subscription.trial_end || null,
                        subscriptionStatus: subscription.status,
                        subscriptionCancelled: subscription.cancel_at_period_end
                    });
                    console.log(`Successfully updated subscription timestamps for user ${userId} on customer.subscription.updated`);
                } catch (dbErr) {
                    console.error(`Failed to update user profile in Firestore on customer.subscription.updated:`, dbErr);
                }
            }
        } else if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object;
            // Query user document by Stripe subscription ID
            try {
                const usersSnapshot = await admin.firestore().collection('users')
                    .where('subscriptionId', '==', subscription.id)
                    .get();

                if (!usersSnapshot.empty) {
                    for (const doc of usersSnapshot.docs) {
                        const userId = doc.id;
                        console.log(`Subscription ${subscription.id} deleted. Demoting user ${userId} to free/flex.`);
                        
                        await admin.firestore().collection('users').doc(userId).update({
                            isPremium: false,
                            subscriptionPlan: 'flex',
                            subscriptionId: null
                        });

                        const userData = doc.data();
                        if (userData.profileId && userData.role === 'musician') {
                            await admin.firestore().collection('musicians').doc(userData.profileId).update({
                                isPremium: false,
                                subscriptionPlan: 'flex'
                            });
                        }
                    }
                }
            } catch (dbErr) {
                console.error("Failed to update user profile after subscription deletion webhook:", dbErr);
                return res.status(500).send("Database update failed");
            }
        }

        res.json({ received: true });
    });


// ==========================================
// Auth Trigger: Hash email on deletion to prevent trial abuse
// ==========================================
exports.onUserDeleted = functions.region('europe-west3').auth.user().onDelete(async (user) => {
    const email = user.email;
    if (email) {
        const crypto = require('crypto');
        const emailHash = crypto.createHash('sha256').update(String(email).trim().toLowerCase()).digest('hex');
        try {
            await admin.firestore().collection('used_trials').doc(emailHash).set({
                hashedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`Saved trial abuse hash for deleted user ${user.uid}`);
        } catch (error) {
            console.error(`Error saving trial abuse hash for deleted user ${user.uid}:`, error);
        }
    }
});

// ==========================================
// Stripe Customer Portal Session Generation
// ==========================================
exports.createStripePortalSession = functions.region('europe-west3')
    .runWith({ secrets: ['STRIPE_SECRET_KEY'] })
    .https.onCall(async (data, context) => {
    // 1. Ensure user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Nur angemeldete Nutzer können auf das Zahlungsportal zugreifen.');
    }

    const { baseUrl } = data;
    if (!baseUrl) {
        throw new functions.https.HttpsError('invalid-argument', 'Fehlende return_url (baseUrl).');
    }

    try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

        // 2. Fetch user doc from Firestore
        const userDocRef = admin.firestore().collection('users').doc(context.auth.uid);
        const userDoc = await userDocRef.get();
        if (!userDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Nutzerprofil nicht gefunden.');
        }

        const userData = userDoc.data();
        let stripeCustomerId = userData.stripeCustomerId;

        // 3. Fallback: If no stripeCustomerId stored, search by email in Stripe
        if (!stripeCustomerId) {
            const email = userData.email;
            if (email) {
                const customers = await stripe.customers.list({ email: email.toLowerCase(), limit: 1 });
                if (customers.data.length > 0) {
                    stripeCustomerId = customers.data[0].id;
                    // Cache it in Firestore
                    await userDocRef.update({ stripeCustomerId: stripeCustomerId });
                }
            }
        }

        // 4. If we still don't have a Stripe Customer ID, they have no payment details yet
        if (!stripeCustomerId) {
            throw new functions.https.HttpsError('failed-precondition', 'Keine aktiven Zahlungsdaten bei Stripe gefunden.');
        }

        // 5. Create Billing Portal Session
        const session = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: `${baseUrl}/#/profile`,
        });

        return { url: session.url };

    } catch (error) {
        console.error("Stripe Portal Session Error:", error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

// ==========================================
// REGEL 4: Bestätigungs- & Admin-Mails bei Musiker-Profil-Erstellung
// ==========================================
exports.onMusicianProfileCreated = functions
    .region('europe-west3')
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .firestore.document('musicians/{musicianId}')
    .onCreate(async (snapshot, context) => {
        const musician = snapshot.data();
        if (!snapshot.exists || !musician) return null;

        const userDetails = await getUserDetails(musician.id);
        const email = musician.email || (userDetails ? userDetails.email : null);
        const name = musician.contactName || musician.name || (userDetails ? userDetails.name : 'Nutzer');

        if (email) {
            // 1. Mail an den Musiker
            const musicianSubject = `Willkommen bei GigConnAct! Dein Musiker-Profil wurde erstellt 🎸`;
            const musicianHtml = `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://gigconnact.de/discoball.png" alt="GigConnAct Logo" style="width: 70px; height: 70px; object-fit: contain;">
                    </div>
                    <h2 style="color: #7c3aed; margin-top: 0; font-size: 1.5rem; text-align: center;">Profil erfolgreich erstellt! 🎉</h2>
                    <p>Hallo ${name},</p>
                    <p>Dein Musiker-Profil <strong>"${musician.name}"</strong> ist jetzt online.</p>
                    <p>Veranstalter können dich ab sofort auf unserem Marktplatz finden. Zudem prüfen wir täglich neue Ausschreibungen und informieren dich automatisch über passende Top-Matches in deiner Nähe.</p>
                    <p>Wir wünschen dir viel Erfolg und fantastische Gigs!</p>
                    <p style="margin-top: 25px; text-align: center;">
                        <a href="https://gigconnact.de/#/dashboard?id=${musician.id}" style="background: #7c3aed; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Profil verwalten</a>
                    </p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 15px;">
                    <p style="font-size: 0.8rem; color: #a0aec0; text-align: center;">GigConnAct — Dein Live-Musik Marktplatz</p>
                </div>
            `;
            await sendEmail({ to: email, subject: musicianSubject, html: musicianHtml });
        }

        // 2. Info-Mail an Admin (info@gigconnact.de)
        const adminSubject = `[Admin-Info] Neues Musiker-Profil: ${musician.name}`;
        const adminHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff;">
                <h3 style="color: #7c3aed; margin-top: 0;">Ein neues Musiker-Profil wurde erstellt</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px; font-weight: bold; width: 150px;">Name/Band:</td><td style="padding: 8px;">${musician.name}</td></tr>
                    <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px; font-weight: bold;">Standort:</td><td style="padding: 8px;">${musician.location} (Radius: ${musician.radius || 150} km)</td></tr>
                    <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px; font-weight: bold;">Instrumente:</td><td style="padding: 8px;">${Array.isArray(musician.instruments) ? musician.instruments.join(', ') : (musician.instruments || 'Keine')}</td></tr>
                    <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px; font-weight: bold;">Genres:</td><td style="padding: 8px;">${Array.isArray(musician.genres) ? musician.genres.join(', ') : (musician.genres || 'Keine')}</td></tr>
                    <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px; font-weight: bold;">Gage:</td><td style="padding: 8px;">${musician.minBudget || 0} - ${musician.maxBudget || 5000} €</td></tr>
                    <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px; font-weight: bold;">Kontakt:</td><td style="padding: 8px;">${name} (${email || 'Keine Mail'})</td></tr>
                </table>
            </div>
        `;
        await sendEmail({ to: 'info@gigconnact.de', subject: adminSubject, html: adminHtml });

        return null;
    });

// ==========================================
// REGEL 5: Bestätigungs- & Admin-Mails bei Event-Erstellung
// ==========================================
exports.onEventProfileCreated = functions
    .region('europe-west3')
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .firestore.document('events/{eventId}')
    .onCreate(async (snapshot, context) => {
        const event = snapshot.data();
        if (!snapshot.exists || !event) return null;

        const userDetails = await getUserDetails(event.creatorId);
        const email = event.email || (userDetails ? userDetails.email : null);
        const name = event.contactName || (userDetails ? userDetails.name : 'Veranstalter');

        if (email) {
            // 1. Mail an den Veranstalter
            const eventSubject = `Deine Event-Ausschreibung bei GigConnAct ist online! 🎉`;
            const eventHtml = `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://gigconnact.de/discoball.png" alt="GigConnAct Logo" style="width: 70px; height: 70px; object-fit: contain;">
                    </div>
                    <h2 style="color: #0ea5e9; margin-top: 0; font-size: 1.5rem; text-align: center;">Event erfolgreich ausgeschrieben! 📅</h2>
                    <p>Hallo ${name},</p>
                    <p>deine Ausschreibung für das Event <strong>"${event.name}"</strong> ist jetzt erfolgreich auf unserem Marktplatz online geschaltet.</p>
                    <p>Interessierte Musiker können ab sofort ihr Interesse bekunden. Zudem analysiert unser System bereits die Datenbank, um dir passende Acts vorzuschlagen.</p>
                    <p style="margin-top: 25px; text-align: center;">
                        <a href="https://gigconnact.de/#/dashboard?id=${snapshot.id}" style="background: #0ea5e9; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Ausschreibung verwalten</a>
                    </p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 15px;">
                    <p style="font-size: 0.8rem; color: #a0aec0; text-align: center;">GigConnAct — Dein Live-Musik Marktplatz</p>
                </div>
            `;
            await sendEmail({ to: email, subject: eventSubject, html: eventHtml });
        }

        // 2. Info-Mail an Admin (info@gigconnact.de)
        const adminSubject = `[Admin-Info] Neues Event erstellt: ${event.name}`;
        const adminHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff;">
                <h3 style="color: #0ea5e9; margin-top: 0;">Eine neue Event-Ausschreibung wurde erstellt</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px; font-weight: bold; width: 150px;">Eventname:</td><td style="padding: 8px;">${event.name}</td></tr>
                    <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px; font-weight: bold;">Datum:</td><td style="padding: 8px;">${event.date || (event.dates ? event.dates.join(', ') : 'Keine Angabe')}</td></tr>
                    <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px; font-weight: bold;">Ort:</td><td style="padding: 8px;">${event.location}</td></tr>
                    <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px; font-weight: bold;">Typ:</td><td style="padding: 8px;">${event.type || 'Keine Angabe'}</td></tr>
                    <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px; font-weight: bold;">Vermittlungsanfrage:</td><td style="padding: 8px;">${event.isAgencyRequest ? 'Ja ✅' : 'Nein ❌'}</td></tr>
                    <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px; font-weight: bold;">Kontakt:</td><td style="padding: 8px;">${name} (${email || 'Keine Mail'})</td></tr>
                </table>
            </div>
        `;
        await sendEmail({ to: 'info@gigconnact.de', subject: adminSubject, html: adminHtml });

        return null;
    });

// ==========================================
// REGEL 6: HTTPS Callable zum Senden der Vorschlagsliste an den Veranstalter
// ==========================================
exports.sendRecommendationList = functions
    .region('europe-west3')
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .https.onCall(async (data, context) => {
        const { mediationId, organizerEmail, eventName, musicianIds, baseUrl, subject, customMessage, eventDate } = data;
        if (!mediationId || !organizerEmail || !eventName || !musicianIds || !baseUrl) {
            throw new functions.https.HttpsError('invalid-argument', 'Fehlende Parameter.');
        }

        // Validate calling authorization: either admin is logged in OR it is a valid matching mediation check
        let isAdmin = false;
        if (context.auth) {
            const adminEmails = ['info@gigconnact.de', 'gigconnact@gmail.com'];
            if (adminEmails.includes(context.auth.token.email)) {
                isAdmin = true;
            }
        }

        try {
            // Verify mediation document to prevent unauthorized email spam
            const medDoc = await admin.firestore().collection('mediations').doc(mediationId).get();
            if (!medDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Vermittlung nicht gefunden.');
            }
            const medData = medDoc.data();
            
            // If not admin, the organizerEmail must match the database document to allow calling
            if (!isAdmin && medData.organizerEmail !== organizerEmail) {
                throw new functions.https.HttpsError('permission-denied', 'Keine Berechtigung für diese Aktion.');
            }
            // 2. Musiker-Details laden
            const musicians = [];
            for (const id of musicianIds) {
                const musDoc = await admin.firestore().collection('musicians').doc(id).get();
                if (musDoc.exists) {
                    musicians.push(musDoc.data());
                }
            }

            // 3. E-Mail-Inhalt generieren
            const mailSubject = subject || `Passende Musiker-Vorschläge für dein Event: ${eventName} 🎵`;
            const recommendationLink = `${baseUrl}/#/recommendation/${mediationId}`;

            // Format date helper for email body
            const formatGermanDate = (dateStr) => {
                if (!dateStr) return '';
                const parts = dateStr.split('-');
                if (parts.length === 3) {
                    return `${parts[2]}.${parts[1]}.${parts[0]}`;
                }
                return dateStr;
            };

            const dateDisplay = eventDate ? ` am ${formatGermanDate(eventDate)}` : '';
            const defaultMessage = `Hallo, wir haben eine passende Auswahl an Musikern für dein Event <strong>"${eventName}"</strong>${dateDisplay} zusammengestellt! Klicke auf den Button unten, um dir die Vorschläge anzusehen, Hörproben und Videos anzuhören und deinen Wunsch-Act direkt unverbindlich anzufragen.`;
            const messageHtml = customMessage ? customMessage.replace(/\n/g, '<br>') : defaultMessage;

            const emailHtml = `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://gigconnact.de/discoball.png" alt="GigConnAct Logo" style="width: 70px; height: 70px; object-fit: contain;">
                    </div>
                    <h2 style="color: #2563eb; margin-top: 0; font-size: 1.4rem; text-align: center;">Deine Musiker-Vorschläge sind da! 🎵</h2>
                    <p>Hallo,</p>
                    <p>${messageHtml}</p>
                    
                    <p style="text-align: center; margin-top: 25px;">
                        <a href="${recommendationLink}" style="background: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 4px 10px rgba(37,99,235,0.25);">Meine Vorschläge</a>
                    </p>
                    
                    <p style="font-size: 0.8rem; color: #718096; margin-top: 20px; text-align: center;">
                        Sollte der Button nicht funktionieren, kopiere bitte folgenden Link in deinen Browser:<br>
                        <a href="${recommendationLink}" style="color: #2563eb; word-break: break-all;">${recommendationLink}</a>
                    </p>
                    
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 15px;">
                    <p style="font-size: 0.8rem; color: #a0aec0; text-align: center;">GigConnAct — Dein Live-Musik Marktplatz</p>
                </div>
            `;

            await sendEmail({ 
                to: organizerEmail, 
                subject: mailSubject, 
                html: emailHtml,
                headers: { 'Reply-To': 'info@gigconnact.de' } 
            });

            return { success: true };
        } catch (error) {
            console.error("Error in sendRecommendationList Cloud Function:", error);
            throw new functions.https.HttpsError('internal', error.message);
        }
    });

// Shared internal helper for releasing mediation contacts
async function releaseMediationContactsInternal(mediationId, musicianId = null) {
    const medRef = admin.firestore().collection('mediations').doc(mediationId);
    const medDoc = await medRef.get();
    if (!medDoc.exists) {
        throw new Error('Vermittlung nicht gefunden.');
    }
    const med = medDoc.data();

    const finalMusicianId = musicianId || med.selectedMusicianId;
    if (!finalMusicianId) {
        throw new Error('Kein Musiker ausgewählt.');
    }

    // Check if already completed and contacts released to avoid duplicate emails
    if (med.status === 'completed' && med.paymentStatus === 'paid' && med.contactsReleased === true) {
        console.log(`Mediation ${mediationId} is already completed and contacts released, skipping email sending.`);
        return;
    }

    // Load musician details
    const musDoc = await admin.firestore().collection('musicians').doc(finalMusicianId).get();
    if (!musDoc.exists) {
        throw new Error('Musiker-Profil nicht gefunden.');
    }
    const mus = musDoc.data();

    // Fetch musician user account for email/phone
    const musUserDoc = await admin.firestore().collection('users').doc(mus.creatorId).get();
    const musUser = musUserDoc.exists ? musUserDoc.data() : {};
    const musEmail = musUser.email || mus.email || '';
    const musPhone = musUser.phone || mus.phone || 'Nicht angegeben';
    const musName = mus.name || mus.title || '';

    // Update status to completed and set contactsReleased to true
    const updateData = {
        status: 'completed',
        selectedMusicianId: finalMusicianId,
        paymentStatus: (med.paymentStatus && med.paymentStatus !== 'pending') ? med.paymentStatus : 'paid',
        contactsReleased: true,
        completedAt: new Date().toISOString()
    };
    if (med.musicianStatuses) {
        updateData[`musicianStatuses.${finalMusicianId}`] = 'accepted';
    }
    await medRef.update(updateData);

    // Fetch event details for the email Kachel
    let eventData = null;
    let eventLocation = med.eventLocation || '';
    let formattedDate = '';
    let durationDisplay = '';
    let budgetDisplay = '';
    let techArr = [];

    if (med.eventDate) {
        const dateParts = med.eventDate.split('-');
        formattedDate = dateParts.length === 3 ? `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}` : med.eventDate;
    }

    if (med.eventId) {
        const eventDoc = await admin.firestore().collection('events').doc(med.eventId).get();
        if (eventDoc.exists) {
            eventData = eventDoc.data();
            eventLocation = eventLocation || eventData.location || eventData.ort || '';
            
            // Duration
            const minDur = eventData.minDuration;
            const maxDur = eventData.maxDuration;
            if (minDur !== undefined && minDur !== null) {
                const minStr = String(minDur).replace('.', ',');
                if (maxDur !== undefined && maxDur !== null && maxDur !== minDur) {
                    const maxStr = String(maxDur).replace('.', ',');
                    durationDisplay = `${minStr} - ${maxStr} Stunden`;
                } else {
                    durationDisplay = `${minStr} Stunden`;
                }
            } else {
                let baseDur = String(eventData.duration || eventData.spieldauer || '2 - 4');
                baseDur = baseDur.replace(/ca\.\s*/gi, '').replace(/\s*Stunden\.?/gi, '').trim();
                durationDisplay = `${baseDur} Stunden`;
            }

            // Budget
            const minB = eventData.minBudget !== undefined ? eventData.minBudget : eventData.price;
            const maxB = eventData.maxBudget;
            if (minB !== undefined && minB !== null) {
                const minBStr = typeof minB === 'number' ? minB.toLocaleString('de-DE') : String(minB);
                if (maxB !== undefined && maxB !== null && maxB !== minB) {
                    const maxBStr = typeof maxB === 'number' ? maxB.toLocaleString('de-DE') : String(maxB);
                    budgetDisplay = `${minBStr} - ${maxBStr} €`;
                } else {
                    budgetDisplay = `${minBStr} €`;
                }
            } else {
                budgetDisplay = '0 - 5.000 €';
            }

            // Tech
            techArr = Array.isArray(eventData.technik) 
                ? eventData.technik 
                : (typeof eventData.technik === 'string' && eventData.technik.trim() !== '' ? eventData.technik.split(',').map(s => s.trim()) : []);
        }
    }

    const orgName = eventData ? (eventData.clientName || eventData.contactName || '') : '';
    const clientName = orgName ? orgName.trim().split(' ')[0] : 'Veranstalter';

    // Format musician profile details (10 criteria)
    const musTypeDisplay = mus.type || mus.musicianType || 'Nicht angegeben';
    const musLocationDisplay = mus.location || 'Nicht angegeben';
    const musRadiusDisplay = mus.radius ? `${mus.radius} km` : 'Nicht angegeben';
    const musGenresDisplay = (Array.isArray(mus.genres) ? mus.genres.join(', ') : (mus.genres || 'Nicht angegeben'));
    const musInstrumentsDisplay = (Array.isArray(mus.instruments) ? mus.instruments.join(', ') : (mus.instruments || 'Nicht angegeben'));
    
    let musDurationDisplay = 'Nicht angegeben';
    if (mus.minDuration !== undefined && mus.minDuration !== null) {
        const minStr = String(mus.minDuration).replace('.', ',');
        if (mus.maxDuration !== undefined && mus.maxDuration !== null && mus.maxDuration !== mus.minDuration) {
            const maxStr = String(mus.maxDuration).replace('.', ',');
            musDurationDisplay = `${minStr} - ${maxStr} Stunden`;
        } else {
            musDurationDisplay = `${minStr} Stunden`;
        }
    }

    let musPublikumDisplay = 'Nicht angegeben';
    if (mus.minPublikum !== undefined && mus.minPublikum !== null) {
        if (mus.maxPublikum !== undefined && mus.maxPublikum !== null) {
            musPublikumDisplay = `${mus.minPublikum} - ${mus.maxPublikum} Personen`;
        } else {
            musPublikumDisplay = `${mus.minPublikum} Personen`;
        }
    }

    const musTechArr = Array.isArray(mus.technik) ? mus.technik : (typeof mus.technik === 'string' && mus.technik.trim() !== '' ? mus.technik.split(',').map(s => s.trim()) : []);
    const musTechDisplay = musTechArr.length > 0 ? musTechArr.join(', ') : 'nach Vereinbarung';

    let musGageDisplay = 'Nicht angegeben';
    if (mus.minBudget !== undefined && mus.minBudget !== null) {
        const minBStr = typeof mus.minBudget === 'number' ? mus.minBudget.toLocaleString('de-DE') : String(mus.minBudget);
        if (mus.maxBudget !== undefined && mus.maxBudget !== null && mus.maxBudget !== mus.minBudget) {
            const maxBStr = typeof mus.maxBudget === 'number' ? mus.maxBudget.toLocaleString('de-DE') : String(mus.maxBudget);
            musGageDisplay = `${minBStr} - ${maxBStr} €`;
        } else {
            musGageDisplay = `ab ${minBStr} €`;
        }
    }

    let musAvailDisplay = 'Nicht angegeben';
    if (mus.availability) {
        if (Array.isArray(mus.availability)) {
            musAvailDisplay = mus.availability.join(', ');
        } else if (typeof mus.availability === 'object') {
            const days = [];
            const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
            const weekdaysDe = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
            weekdays.forEach((day, idx) => {
                if (mus.availability[day] && mus.availability[day].available) {
                    days.push(weekdaysDe[idx]);
                }
            });
            if (days.length > 0) {
                musAvailDisplay = days.join(', ');
            }
        }
    }

    // 1. Send email to Organizer
    const organizerSubject = `Vermittlung erfolgreich: Kontaktdaten von ${musName} für "${med.eventName}" 🎉`;
    const organizerHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
            <h2 style="color: #2563eb; margin-top: 0; font-size: 1.4rem;">Kontaktdaten freigeschaltet! 🎉</h2>
            <p>Hallo ${clientName},</p>
            <p>der von Dir ausgewählte Act "${musName}" hat Interesse bekundet, auf Deinem Event "${med.eventName}" zu spielen! Hier sind die Kontaktdaten, damit Ihr die weiteren Details direkt besprechen könnt:</p>
            
            <!-- MUSIKER-KACHEL MIT KONTAKTDATEN -->
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; overflow: hidden; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: left;">
                <div style="background: #2563eb; padding: 15px; color: #ffffff;">
                    <h3 style="margin: 0; font-size: 1.2rem; font-weight: bold; color: #ffffff;">${musName}</h3>
                </div>
                <div style="padding: 15px; font-size: 0.9rem; line-height: 1.5; color: #4a5568;">
                    <p style="margin: 6px 0;"><strong style="width: 140px; display: inline-block;">🎸 Act-Typ:</strong> ${musTypeDisplay}</p>
                    <p style="margin: 6px 0;"><strong style="width: 140px; display: inline-block;">📍 Standort:</strong> ${musLocationDisplay}</p>
                    <p style="margin: 6px 0;"><strong style="width: 140px; display: inline-block;">🚗 Reiseradius:</strong> ${musRadiusDisplay}</p>
                    <p style="margin: 6px 0;"><strong style="width: 140px; display: inline-block;">🎵 Genres:</strong> ${musGenresDisplay}</p>
                    <p style="margin: 6px 0;"><strong style="width: 140px; display: inline-block;">🎻 Instrumente:</strong> ${musInstrumentsDisplay}</p>
                    <p style="margin: 6px 0;"><strong style="width: 140px; display: inline-block;">⏱️ Spielzeit:</strong> ${musDurationDisplay}</p>
                    <p style="margin: 6px 0;"><strong style="width: 140px; display: inline-block;">👥 Publikum:</strong> ${musPublikumDisplay}</p>
                    <p style="margin: 6px 0;"><strong style="width: 140px; display: inline-block;">🎛️ Technik:</strong> ${musTechDisplay}</p>
                    <p style="margin: 6px 0;"><strong style="width: 140px; display: inline-block;">💰 Gage:</strong> ${musGageDisplay}</p>
                    <p style="margin: 6px 0;"><strong style="width: 140px; display: inline-block;">📅 Verfügbarkeit:</strong> ${musAvailDisplay}</p>
                    ${mus.description ? `<p style="margin: 6px 0; font-style: italic; color: #718096; border-top: 1px dashed #e2e8f0; padding-top: 8px;">"${mus.description}"</p>` : ''}
                    
                    <!-- KONTAKTDATEN -->
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #2563eb; background: rgba(37,99,235,0.03); padding: 12px; border-radius: 8px;">
                        <h4 style="margin: 0 0 8px 0; color: #2563eb; font-size: 1rem;">📞 Kontaktdaten des Musikers:</h4>
                        <p style="margin: 4px 0;"><strong>Name:</strong> ${musName}</p>
                        <p style="margin: 4px 0;"><strong>Telefon:</strong> ${musPhone}</p>
                        <p style="margin: 4px 0;"><strong>E-Mail:</strong> <a href="mailto:${musEmail}" style="color: #2563eb; font-weight: bold; text-decoration: none;">${musEmail}</a></p>
                    </div>
                </div>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <div style="text-align: center; margin-top: 20px;">
                <img src="https://gigconnact.de/discoball.png" alt="GigConnAct Logo" style="width: 50px; height: 50px; object-fit: contain;">
            </div>
        </div>
    `;
    await sendEmail({ to: med.organizerEmail, subject: organizerSubject, html: organizerHtml, headers: { 'Reply-To': 'info@gigconnact.de' } });

    // 2. Send email to Musician
    const musicianSubject = `Vermittlung erfolgreich: Kontaktdaten des Veranstalters für "${med.eventName}" 🚀`;
    const musicianHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
            <h2 style="color: #7c3aed; margin-top: 0; font-size: 1.4rem; text-align: center;">Vermittlung erfolgreich! 🎉</h2>
            <p>Hallo ${musName},</p>
            <p>herzlichen Glückwunsch! Die Vermittlung für das Event <strong>"${med.eventName}"</strong> ist erfolgreich abgeschlossen. Bitte nimm zeitnah Kontakt mit dem Veranstalter auf:</p>
            
            <!-- EVENT-KACHEL MIT KONTAKTDATEN -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: left;">
                <div style="background: #7c3aed; padding: 15px; color: #ffffff;">
                    <h3 style="margin: 0; font-size: 1.2rem; font-weight: bold; color: #ffffff;">${med.eventName}</h3>
                </div>
                <div style="padding: 15px; font-size: 0.9rem; line-height: 1.5; color: #4a5568;">
                    <p style="margin: 6px 0;"><span style="font-size: 1.15rem; width: 30px; display: inline-block; text-align: center; vertical-align: middle; margin-right: 0.35rem;">🎉</span> ${eventData ? (eventData.type || eventData.eventType || 'Nicht angegeben') : 'Nicht angegeben'}</p>
                    <p style="margin: 6px 0;"><span style="font-size: 1.15rem; width: 30px; display: inline-block; text-align: center; vertical-align: middle; margin-right: 0.35rem;">📍</span> ${eventLocation}</p>
                    <p style="margin: 6px 0;"><span style="font-size: 1.15rem; width: 30px; display: inline-block; text-align: center; vertical-align: middle; margin-right: 0.35rem;">📅</span> ${formattedDate}</p>
                    <p style="margin: 6px 0;"><span style="font-size: 1.15rem; width: 30px; display: inline-block; text-align: center; vertical-align: middle; margin-right: 0.35rem;">🎸</span> ${eventData ? (Array.isArray(eventData.musicianTypes) ? eventData.musicianTypes.join(', ') : (eventData.musicianTypes || 'Nicht angegeben')) : 'Nicht angegeben'}</p>
                    <p style="margin: 6px 0;"><span style="font-size: 1.15rem; width: 30px; display: inline-block; text-align: center; vertical-align: middle; margin-right: 0.35rem;">🎵</span> ${eventData && eventData.genres ? (Array.isArray(eventData.genres) ? eventData.genres.join(', ') : eventData.genres) : 'Alle'}</p>
                    <p style="margin: 6px 0;"><span style="font-size: 1.15rem; width: 30px; display: inline-block; text-align: center; vertical-align: middle; margin-right: 0.35rem;">🎻</span> ${eventData && eventData.instruments ? (Array.isArray(eventData.instruments) ? eventData.instruments.join(', ') : eventData.instruments) : 'Nicht angegeben'}</p>
                    <p style="margin: 6px 0;"><span style="font-size: 1.15rem; width: 30px; display: inline-block; text-align: center; vertical-align: middle; margin-right: 0.35rem;">⏱️</span> ${durationDisplay}</p>
                    <p style="margin: 6px 0;"><span style="font-size: 1.15rem; width: 30px; display: inline-block; text-align: center; vertical-align: middle; margin-right: 0.35rem;">👥</span> ${eventData && eventData.minPublikum !== undefined && eventData.maxPublikum !== undefined ? `${eventData.minPublikum} - ${eventData.maxPublikum}+ Personen` : '0 - 500+ Personen'}</p>
                    <p style="margin: 6px 0;"><span style="font-size: 1.15rem; width: 30px; display: inline-block; text-align: center; vertical-align: middle; margin-right: 0.35rem;">🎛️</span> ${techArr.length > 0 ? techArr.join(', ') : 'nach Vereinbarung'}</p>
                    <p style="margin: 6px 0;"><span style="font-size: 1.15rem; width: 30px; display: inline-block; text-align: center; vertical-align: middle; margin-right: 0.35rem;">💰</span> ${budgetDisplay}</p>
                    ${eventData && eventData.description ? `<p style="margin: 6px 0; font-style: italic; color: #718096; border-top: 1px dashed #e2e8f0; padding-top: 8px;">"${eventData.description}"</p>` : ''}
                    
                    <!-- KONTAKTDATEN -->
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #7c3aed; background: rgba(124,58,237,0.03); padding: 12px; border-radius: 8px;">
                        <h4 style="margin: 0 0 8px 0; color: #7c3aed; font-size: 1rem;">📞 Kontaktdaten des Veranstalters:</h4>
                        <p style="margin: 4px 0;"><strong>Name:</strong> ${eventData ? (eventData.clientName || eventData.contactName || 'Nicht angegeben') : 'Nicht angegeben'}</p>
                        <p style="margin: 4px 0;"><strong>Telefon:</strong> ${eventData ? (eventData.clientPhone || eventData.phone || 'Nicht angegeben') : 'Nicht angegeben'}</p>
                        <p style="margin: 4px 0;"><strong>E-Mail:</strong> <a href="mailto:${eventData && eventData.clientEmail ? eventData.clientEmail : med.organizerEmail}" style="color: #7c3aed; font-weight: bold; text-decoration: none;">${eventData && eventData.clientEmail ? eventData.clientEmail : med.organizerEmail}</a></p>
                    </div>
                </div>
            </div>
            
            <p>Wir wünschen dir viel Erfolg bei diesem Gig!</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <div style="text-align: center; margin-top: 20px;">
                <img src="https://gigconnact.de/discoball.png" alt="GigConnAct Logo" style="width: 50px; height: 50px; object-fit: contain;">
            </div>
        </div>
    `;
    await sendEmail({ to: musEmail, subject: musicianSubject, html: musicianHtml, headers: { 'Reply-To': 'info@gigconnact.de' } });

    // 3. Send email to Admin
    const adminSubject = `[VERMITTLUNG ERFOLGREICH] ${med.eventName}`;
    const adminHtml = `
        <h3>Erfolgreiche Vermittlung!</h3>
        <p><strong>Event:</strong> ${med.eventName}</p>
        <p><strong>Veranstalter:</strong> ${med.organizerEmail}</p>
        <p><strong>Musiker:</strong> ${musName} (${musEmail})</p>
        <p><strong>Mediation ID:</strong> ${mediationId}</p>
    `;
    await sendEmail({ to: 'info@gigconnact.de', subject: adminSubject, html: adminHtml });
}

// HTTPS Callable for Stripe Checkout Session creation (mediation payment)
exports.createMediationPayment = functions
    .region('europe-west3')
    .runWith({ secrets: ['STRIPE_SECRET_KEY'] })
    .https.onCall(async (data, context) => {
        const { mediationId, musicianId, baseUrl } = data;
        if (!mediationId) {
            throw new functions.https.HttpsError('invalid-argument', 'Fehlende mediationId.');
        }

        let targetUid = context.auth ? context.auth.uid : null;
        if (!targetUid && musicianId) {
            const musDoc = await admin.firestore().collection('musicians').doc(musicianId).get();
            if (musDoc.exists) {
                targetUid = musDoc.data().creatorId || null;
            }
        }

        if (!targetUid) {
            throw new functions.https.HttpsError('unauthenticated', 'Kein gültiger Musiker zugeordnet.');
        }

        const fallbackBaseUrl = 'https://www.gigconnact.de';
        const cleanBaseUrl = (baseUrl && (baseUrl.startsWith('http://localhost') || baseUrl.startsWith('https://'))) 
            ? baseUrl 
            : fallbackBaseUrl;

        try {
            const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
            
            // Get mediation document
            const medDoc = await admin.firestore().collection('mediations').doc(mediationId).get();
            if (!medDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Vermittlung wurde nicht gefunden.');
            }
            const med = medDoc.data();

            // Get user email and subscription plan
            const userDoc = await admin.firestore().collection('users').doc(targetUid).get();
            const userData = userDoc.exists ? userDoc.data() : {};
            const email = userData.email || null;
            const planKey = userData.subscriptionPlan || 'flex';

            // Determine fee based on plan: Flex = 35 €, Plus = 30 €, Pro = 25 €
            let feeAmount = 3500; // default Flex is 35 EUR
            if (planKey === 'plus') {
                feeAmount = 3000; // 30 EUR
            } else if (planKey === 'pro') {
                feeAmount = 2500; // 25 EUR
            } else if (planKey === 'premium') {
                feeAmount = 0; // 0 EUR (should be bypassed in frontend, but safe fallback)
            }

            const sessionParams = {
                mode: 'payment',
                customer_email: email || undefined,
                line_items: [{
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `Vermittlungsprovision: ${med.eventName}`,
                            description: 'Gebühr für die erfolgreiche Vermittlung deines Gigs.',
                        },
                        unit_amount: feeAmount,
                    },
                    quantity: 1,
                }],
                success_url: `${cleanBaseUrl}/#/mediation-response/${mediationId}?musicianId=${musicianId || ''}`,
                cancel_url: `${cleanBaseUrl}/#/mediation-response/${mediationId}?musicianId=${musicianId || ''}`,
                metadata: {
                    type: 'mediation_payment',
                    mediationId: mediationId,
                    musicianId: musicianId || '',
                    userId: context.auth ? context.auth.uid : targetUid
                }
            };

            const session = await stripe.checkout.sessions.create(sessionParams);
            return { url: session.url };
        } catch (error) {
            console.error("Error in createMediationPayment:", error);
            throw new functions.https.HttpsError('internal', error.message);
        }
    });

// HTTPS Callable for releasing mediation contacts (Premium path)
exports.releaseMediationContacts = functions
    .region('europe-west3')
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .https.onCall(async (data, context) => {
        const { mediationId, musicianId } = data;
        if (!mediationId) {
            throw new functions.https.HttpsError('invalid-argument', 'Fehlende mediationId.');
        }

        try {
            await releaseMediationContactsInternal(mediationId, musicianId || null);
            return { success: true };
        } catch (error) {
            console.error("Error in releaseMediationContacts callable:", error);
            throw new functions.https.HttpsError('internal', error.message);
        }
    });

// HTTPS Callable for notifying when a musician declines a mediation request
exports.notifyMediationDeclined = functions
    .region('europe-west3')
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .https.onCall(async (data, context) => {
        const { mediationId } = data;
        if (!mediationId) {
            throw new functions.https.HttpsError('invalid-argument', 'Fehlende mediationId.');
        }

        try {
            const medDoc = await admin.firestore().collection('mediations').doc(mediationId).get();
            if (!medDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Vermittlung nicht gefunden.');
            }
            const med = medDoc.data();
            const subject = `Update zu deinen Musiker-Vorschlägen für: ${med.eventName} 🎵`;
            const recommendationLink = `${data.baseUrl || 'https://www.gigconnact.de'}/#/recommendation/${mediationId}`;

            const emailHtml = `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
                    <h2 style="color: #2563eb; margin-top: 0; font-size: 1.4rem;">Neues Update zu deiner Auswahl 🎵</h2>
                    <p>Hallo,</p>
                    <p>der von dir angefragte Act ist an dem gewünschten Termin leider doch nicht mehr verfügbar.</p>
                    <p>Kein Problem! Du kannst einfach einen anderen passenden Act aus deiner Vorschlagsliste auswählen und anfragen.</p>
                    
                    <p style="text-align: center; margin-top: 25px;">
                        <a href="${recommendationLink}" style="background: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Zurück zur Vorschlagsliste</a>
                    </p>
                    
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 15px;">
                    <p style="font-size: 0.8rem; color: #a0aec0; text-align: center;">GigConnAct — Dein Live-Musik Marktplatz</p>
                </div>
            `;

            await sendEmail({ to: med.organizerEmail, subject: subject, html: emailHtml, headers: { 'Reply-To': 'info@gigconnact.de' } });

            // Send notification to Admin
            const adminSubject = `[VERMITTLUNG ABSAGE] Musiker hat abgesagt für: ${med.eventName}`;
            const adminHtml = `
                <p>Ein Musiker hat ein Vermittlungsangebot abgelehnt.</p>
                <p><strong>Event:</strong> ${med.eventName}</p>
                <p><strong>Veranstalter:</strong> ${med.organizerEmail}</p>
                <p><strong>Mediation ID:</strong> ${mediationId}</p>
            `;
            await sendEmail({ to: 'info@gigconnact.de', subject: adminSubject, html: adminHtml });

            return { success: true };
        } catch (error) {
            console.error("Error in notifyMediationDeclined:", error);
            throw new functions.https.HttpsError('internal', error.message);
        }
    });

// HTTPS Callable for Requesting a Musician Verbindlich (sent by Organizer)
exports.requestMusician = functions
    .region('europe-west3')
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .https.onCall(async (data, context) => {
        const { mediationId, musicianId, baseUrl } = data;
        if (!mediationId || !musicianId || !baseUrl) {
            throw new functions.https.HttpsError('invalid-argument', 'Fehlende Parameter.');
        }

        try {
            const medRef = admin.firestore().collection('mediations').doc(mediationId);
            const medDoc = await medRef.get();
            if (!medDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Vermittlung nicht gefunden.');
            }
            const med = medDoc.data();

            if (med.status === 'completed') {
                throw new functions.https.HttpsError('failed-precondition', 'Diese Vermittlung ist bereits abgeschlossen.');
            }

            const musDoc = await admin.firestore().collection('musicians').doc(musicianId).get();
            if (!musDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Musiker nicht gefunden.');
            }
            const mus = musDoc.data();

            // Fetch musician user details
            const musUserDoc = await admin.firestore().collection('users').doc(mus.creatorId).get();
            const musUser = musUserDoc.exists ? musUserDoc.data() : {};
            const musEmail = musUser.email || mus.email;
            const musName = mus.name || mus.title || 'Musiker';

            if (!musEmail) {
                throw new functions.https.HttpsError('failed-precondition', 'Keine E-Mail-Adresse für den Musiker hinterlegt.');
            }

            // Update mediation document
            const updateData = {
                status: 'pending_availability'
            };
            updateData[`musicianStatuses.${musicianId}`] = 'pending';
            await medRef.update(updateData);

            // Send email to musician
            const dateVal = med.eventDate || '';
            const dateParts = dateVal.split('-');
            const formattedDate = dateParts.length === 3 ? `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}` : dateVal;
            const eventLocation = med.eventLocation || '';

            const responseLink = `${baseUrl}/#/mediation-response/${mediationId}?musicianId=${musicianId}`;
            const subject = `Vermittlungsanfrage für das Event: ${med.eventName}${eventLocation ? ` in ${eventLocation}` : ''}${formattedDate ? ` am ${formattedDate}` : ''}`;
            const emailHtml = `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://gigconnact.de/discoball.png" alt="GigConnAct Logo" style="width: 70px; height: 70px; object-fit: contain;">
                    </div>
                    <h2 style="color: #7c3aed; margin-top: 0; font-size: 1.4rem; text-align: center;">Vermittlungsanfrage erhalten! 🚀</h2>
                    <p>Hallo ${musName},</p>
                    <p>herzlichen Glückwunsch! Du hast eine Vermittlungsanfrage für das Event <strong>"${med.eventName}"</strong>${eventLocation ? ` in <strong>${eventLocation}</strong>` : ''}${formattedDate ? ` am <strong>${formattedDate}</strong>` : ''} erhalten. Hinweis: Dies ist keine Buchungsanfrage. Der Veranstalter hat über GigConnAct-Vermittlungen Interesse bekundet, Deine Kontaktdaten zu erhalten. Möglicherweise erhalten weitere Musiker die gleiche Anfrage.</p>
                    
                    <p>Klicke auf den Button unten, um dir die Details anzusehen. Bei verbindlichem Interesse Deinerseits erhältst Du über einen entsprechenden Bezahllink die Kontaktdaten des Veranstalters. Mit einem Premium-Account entfallen die Vermittlungsgebühren vollständig.</p>
                    
                    <p style="text-align: center; margin-top: 25px;">
                        <a href="${responseLink}" style="background: #7c3aed; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 4px 10px rgba(124,58,237,0.25);">Zur Vermittlungsanfrage</a>
                    </p>
                    
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 15px;">
                    <p style="font-size: 0.8rem; color: #a0aec0; text-align: center;">GigConnAct — Dein Live-Musik Marktplatz</p>
                </div>
            `;

            await sendEmail({ to: musEmail, subject: subject, html: emailHtml, headers: { 'Reply-To': 'info@gigconnact.de' } });

            // Notify Admin
            const adminSubject = `[VERMITTLUNG ANFRAGE] Musiker ${musName} wurde angefragt für: ${med.eventName}`;
            const adminHtml = `
                <p>Der Veranstalter hat eine unverbindliche Anfrage an einen Musiker gesendet.</p>
                <p><strong>Event:</strong> ${med.eventName}</p>
                <p><strong>Veranstalter:</strong> ${med.organizerEmail}</p>
                <p><strong>Musiker:</strong> ${musName} (${musEmail})</p>
                <p><strong>Mediation ID:</strong> ${mediationId}</p>
            `;
            await sendEmail({ to: 'info@gigconnact.de', subject: adminSubject, html: adminHtml });

            return { success: true };
        } catch (error) {
            console.error("Error in requestMusician callable:", error);
            throw new functions.https.HttpsError('internal', error.message);
        }
    });

// HTTPS Callable for Updating Musician Request Status (Declined, No Response)
exports.updateMediationMusicianStatus = functions
    .region('europe-west3')
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .https.onCall(async (data, context) => {
        const { mediationId, musicianId, status, baseUrl } = data;
        if (!mediationId || !musicianId || !status) {
            throw new functions.https.HttpsError('invalid-argument', 'Fehlende Parameter.');
        }

        try {
            const medRef = admin.firestore().collection('mediations').doc(mediationId);
            const medDoc = await medRef.get();
            if (!medDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Vermittlung nicht gefunden.');
            }
            const med = medDoc.data();

            const musDoc = await admin.firestore().collection('musicians').doc(musicianId).get();
            if (!musDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Musiker nicht gefunden.');
            }
            const mus = musDoc.data();
            const musName = mus.name || mus.title || 'Musiker';

            // Update status of this musician request
            const updateData = {};
            updateData[`musicianStatuses.${musicianId}`] = status;
            await medRef.update(updateData);

            const recLink = `${baseUrl || 'https://www.gigconnact.de'}/#/recommendation/${mediationId}`;

            let emailSubject = '';
            let emailHtml = '';

            if (status === 'declined') {
                emailSubject = `Absage zu deiner Musiker-Anfrage für: ${med.eventName} 🎵`;
                emailHtml = `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
                        <h2 style="color: #ef4444; margin-top: 0; font-size: 1.4rem;">Absage erhalten 🤍</h2>
                        <p>Hallo,</p>
                        <p>der Act <strong>"${musName}"</strong> hat deine Buchungsanfrage für das Event <strong>"${med.eventName}"</strong> leider abgelehnt oder ist an dem Termin nicht mehr verfügbar.</p>
                        <p>Du kannst weiterhin andere Acts aus deiner Vorschlagsliste kontaktieren:</p>
                        <p style="text-align: center; margin-top: 25px;">
                            <a href="${recLink}" style="background: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Zurück zur Vorschlagsliste</a>
                        </p>
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 15px;">
                        <p style="font-size: 0.8rem; color: #a0aec0; text-align: center;">GigConnAct — Dein Live-Musik Marktplatz</p>
                    </div>
                `;
            } else if (status === 'no_response') {
                emailSubject = `Keine Rückmeldung von Musiker für: ${med.eventName} ⏳`;
                emailHtml = `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
                        <h2 style="color: #f59e0b; margin-top: 0; font-size: 1.4rem;">Keine Rückmeldung erhalten ⏳</h2>
                        <p>Hallo,</p>
                        <p>der Act <strong>"${musName}"</strong> hat leider nicht auf deine Buchungsanfrage geantwortet. Wir haben die Anfrage zurückgezogen.</p>
                        <p>Du kannst weiterhin andere Acts aus deiner Vorschlagsliste kontaktieren oder eine neue Suche starten:</p>
                        <p style="text-align: center; margin-top: 25px;">
                            <a href="${recLink}" style="background: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Zurück zur Vorschlagsliste</a>
                        </p>
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 15px;">
                        <p style="font-size: 0.8rem; color: #a0aec0; text-align: center;">GigConnAct — Dein Live-Musik Marktplatz</p>
                    </div>
                `;
            }

            if (emailSubject && emailHtml) {
                await sendEmail({ to: med.organizerEmail, subject: emailSubject, html: emailHtml, headers: { 'Reply-To': 'info@gigconnact.de' } });
            }

            // Send notification to Admin
            const adminSubject = `[VERMITTLUNG STATUS] Musiker ${status.toUpperCase()} für: ${med.eventName}`;
            const adminHtml = `
                <p>Statusänderung für Musikeranfrage.</p>
                <p><strong>Event:</strong> ${med.eventName}</p>
                <p><strong>Veranstalter:</strong> ${med.organizerEmail}</p>
                <p><strong>Musiker:</strong> ${musName}</p>
                <p><strong>Neuer Status:</strong> ${status}</p>
                <p><strong>Mediation ID:</strong> ${mediationId}</p>
            `;
            await sendEmail({ to: 'info@gigconnact.de', subject: adminSubject, html: adminHtml });

            return { success: true };
        } catch (error) {
            console.error("Error in updateMediationMusicianStatus callable:", error);
            throw new functions.https.HttpsError('internal', error.message);
        }
    });

// HTTPS Callable for Requesting More Recommendations (sent by Organizer)
exports.requestMoreRecommendations = functions
    .region('europe-west3')
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .https.onCall(async (data, context) => {
        const { mediationId } = data;
        if (!mediationId) {
            throw new functions.https.HttpsError('invalid-argument', 'Fehlende mediationId.');
        }

        try {
            const medDoc = await admin.firestore().collection('mediations').doc(mediationId).get();
            if (!medDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Vermittlung nicht gefunden.');
            }
            const med = medDoc.data();

            const adminSubject = `[WEITERE SUCHE] Veranstalter wünscht weitere Musiker für: ${med.eventName}`;
            const adminHtml = `
                <h3>Weitere Vorschläge gewünscht!</h3>
                <p>Der Veranstalter von Event <strong>"${med.eventName}"</strong> (${med.organizerEmail}) wünscht weitere Musiker-Vorschläge.</p>
                <p>Bitte suche nach zusätzlichen passenden Acts und füge sie der Vorschlagsliste hinzu.</p>
                <p><strong>Mediation ID:</strong> ${mediationId}</p>
            `;
            await sendEmail({ to: 'info@gigconnact.de', subject: adminSubject, html: adminHtml });

            return { success: true };
        } catch (error) {
            console.error("Error in requestMoreRecommendations callable:", error);
            throw new functions.https.HttpsError('internal', error.message);
        }
    });

// HTTPS Callable for Sending Reminder Email to Musician
exports.sendMediationReminder = functions
    .region('europe-west3')
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .https.onCall(async (data, context) => {
        const { mediationId, musicianId, baseUrl } = data;
        if (!mediationId || !musicianId || !baseUrl) {
            throw new functions.https.HttpsError('invalid-argument', 'Fehlende Parameter.');
        }

        try {
            // 1. Fetch mediation details
            const medDoc = await admin.firestore().collection('mediations').doc(mediationId).get();
            if (!medDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Vermittlung nicht gefunden.');
            }
            const med = medDoc.data();

            // 2. Fetch musician details
            const musDoc = await admin.firestore().collection('musicians').doc(musicianId).get();
            if (!musDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Musiker nicht gefunden.');
            }
            const mus = musDoc.data();
            const musName = mus.name || mus.title || 'Musiker';
            const musEmail = mus.email || '';

            // 3. Resolve availability date formatting
            const dateVal = med.eventDate || '';
            const dateParts = dateVal.split('-');
            const formattedDate = dateParts.length === 3 ? `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}` : dateVal;
            const eventLocation = med.eventLocation || '';

            const responseLink = `${baseUrl}/#/mediation-response/${mediationId}?musicianId=${musicianId}`;
            const subject = `Erinnerung: Vermittlungsanfrage für: ${med.eventName}`;
            
            const emailHtml = `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://gigconnact.de/discoball.png" alt="GigConnAct Logo" style="width: 70px; height: 70px; object-fit: contain;">
                    </div>
                    <h2 style="color: #7c3aed; margin-top: 0; font-size: 1.4rem; text-align: center;">Erinnerung an Deine Vermittlungsanfrage! ⏰</h2>
                    <p>Hallo ${musName},</p>
                    <p>du hast eine ausstehende Vermittlungsanfrage für das Event <strong>"${med.eventName}"</strong>${eventLocation ? ` in <strong>${eventLocation}</strong>` : ''}${formattedDate ? ` am <strong>${formattedDate}</strong>` : ''} erhalten, auf die du noch nicht geantwortet hast.</p>
                    
                    <p>Der Veranstalter wartet auf Deine Rückmeldung. Bitte klicke auf den Button unten, um das Event anzusehen und verbindlich zuzusagen oder abzusagen.</p>
                    
                    <p style="text-align: center; margin-top: 25px;">
                        <a href="${responseLink}" style="background: #7c3aed; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 4px 10px rgba(124,58,237,0.25);">Zur Vermittlungsanfrage</a>
                    </p>
                    
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 15px;">
                    <p style="font-size: 0.8rem; color: #a0aec0; text-align: center;">GigConnAct — Dein Live-Musik Marktplatz</p>
                </div>
            `;

            await sendEmail({ to: musEmail, subject: subject, html: emailHtml, headers: { 'Reply-To': 'info@gigconnact.de' } });

            // Notify Admin
            const adminSubject = `[VERMITTLUNG REMINDER] Erinnerung gesendet an ${musName}`;
            const adminHtml = `
                <p>Es wurde eine automatische Erinnerung an den Musiker gesendet.</p>
                <p><strong>Event:</strong> ${med.eventName}</p>
                <p><strong>Musiker:</strong> ${musName} (${musEmail})</p>
                <p><strong>Mediation ID:</strong> ${mediationId}</p>
            `;
            await sendEmail({ to: 'info@gigconnact.de', subject: adminSubject, html: adminHtml });

            return { success: true };
        } catch (error) {
            console.error("Error in sendMediationReminder callable:", error);
            throw new functions.https.HttpsError('internal', error.message);
        }
    });


