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
    
    // Split by commas in case there are multiple locations
    const cities1 = city1.split(',').map(c => c.trim().toLowerCase());
    const cities2 = city2.split(',').map(c => c.trim().toLowerCase());
    
    let minDistance = 250;
    
    for (const c1 of cities1) {
        for (const c2 of cities2) {
            if (c1 === c2) {
                minDistance = Math.min(minDistance, 0);
                continue;
            }
            
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
    
    return minDistance;
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
                        distance: distance,
                        role: 'musician'
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
                        matches: topMatches
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
                            matches: topMatches
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
            
            // Get user email
            const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
            const email = userDoc.exists ? userDoc.data().email : null;

            const sessionParams = {
                mode: 'subscription',
                customer_email: email || undefined,
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

            const disableAllTrialsForTesting = true; // Set to false when ready to re-enable trials!

            // Set trial period dynamically based on the plan configuration if they haven't had a trial yet
            if (!disableAllTrialsForTesting && !hasHadTrial) {
                if (planKey === 'premium') {
                    sessionParams.subscription_data = {
                        trial_period_days: 90
                    };
                } else if (planKey === 'flex' || planKey === 'plus' || planKey === 'pro') {
                    sessionParams.subscription_data = {
                        trial_period_days: 30
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
// Stripe Webhook Handler
// ==========================================
exports.stripeWebhook = functions
    .region('europe-west3')
    .runWith({ secrets: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'] })
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
            const userId = session.metadata.userId;
            const planKey = session.metadata.planKey;

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
                    await userRef.update(updateData);

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
                    }
                    console.log(`Successfully updated user ${userId} and their profiles to Premium.`);
                } catch (dbErr) {
                    console.error("Failed to update user profile in Firestore after Stripe webhook:", dbErr);
                    return res.status(500).send("Database update failed");
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
exports.createStripePortalSession = functions.region('europe-west3').https.onCall(async (data, context) => {
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

