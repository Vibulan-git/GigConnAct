/**
 * Template für Events im Umkreis eines Musikers
 */
module.exports = function getRadiusEventEmailHtml({ musicianName, event, distance, role }) {
    const isOrganizer = role === 'organizer';
    const brandColor = isOrganizer ? '#0ea5e9' : '#7c3aed';
    
    const title = event.title || event.name || 'Neuer Gig';
    const dateStr = event.date || 'Termin nach Absprache';
    
    // Location and distance
    const loc = event.location || 'Ort nach Absprache';
    const locDisplay = `${loc} (ca. ${distance} km von dir entfernt)`;

    // Format Duration display
    let durationDisplay = '';
    const minDur = event.minDuration;
    const maxDur = event.maxDuration;
    if (minDur !== undefined && minDur !== null) {
        const minStr = String(minDur).replace('.', ',');
        if (maxDur !== undefined && maxDur !== null && maxDur !== minDur) {
            const maxStr = String(maxDur).replace('.', ',');
            durationDisplay = `${minStr} - ${maxStr} Stunden`;
        } else {
            durationDisplay = `${minStr} Stunden`;
        }
    } else {
        let baseDur = String(event.duration || event.spieldauer || '2 - 4');
        baseDur = baseDur.replace(/ca\.\s*/gi, '').replace(/\s*Stunden\.?/gi, '').trim();
        durationDisplay = `${baseDur} Stunden`;
    }

    // Format Budget / Gage display
    let budgetDisplay = '';
    const minB = event.minBudget !== undefined ? event.minBudget : (event.budget || event.price);
    const maxB = event.maxBudget;
    if (minB !== undefined && minB !== null) {
        const minBStr = typeof minB === 'number' ? minB.toLocaleString('de-DE') : String(minB);
        if (maxB !== undefined && maxB !== null && maxB !== minB) {
            const maxBStr = typeof maxB === 'number' ? maxB.toLocaleString('de-DE') : String(maxB);
            budgetDisplay = `${minBStr} - ${maxBStr} €`;
        } else {
            budgetDisplay = `${minBStr} €`;
        }
    } else {
        budgetDisplay = 'Auf Anfrage';
    }

    // Format Audience / Publikum
    const minP = event.minPublikum;
    const maxP = event.maxPublikum;
    let publikumDisplay = 'Nach Vereinbarung';
    if (minP !== undefined && minP !== null) {
        if (maxP !== undefined && maxP !== null) {
            publikumDisplay = `${minP} - ${maxP} Personen`;
        } else {
            publikumDisplay = `${minP}+ Personen`;
        }
    } else if (event.publikum) {
        publikumDisplay = event.publikum;
    }

    // Format Tech / Technik
    const techArr = Array.isArray(event.technik) 
        ? event.technik 
        : (typeof event.technik === 'string' && event.technik.trim() !== '' ? event.technik.split(',').map(s => s.trim()) : []);
    const techDisplay = techArr.length > 0 ? techArr.join(', ') : 'Nach Vereinbarung';

    // Format Musician types
    const musicianTypes = (Array.isArray(event.musicianTypes) && event.musicianTypes.length > 0) 
        ? event.musicianTypes.join(', ') 
        : (typeof event.musicianTypes === 'string' && event.musicianTypes.trim() !== '' ? event.musicianTypes : (event.musicianType || 'Solo / Band'));

    // Format Instruments
    const instrumentsDisplay = event.instruments && event.instruments.length > 0 ? event.instruments.join(', ') : 'Nach Vereinbarung';

    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://gigconnact.de/discoball.png" alt="GigConnAct Logo" style="width: 70px; height: 70px; object-fit: contain;">
            </div>
            <h2 style="color: ${brandColor}; margin-top: 0; font-size: 1.5rem; text-align: center;">Neuer Gig in deiner Umgebung! 📍</h2>
            <p>Hallo <strong>${musicianName}</strong>,</p>
            <p>ein neues Event wurde in deinem angegebenen Reise-Radius auf dem Markt veröffentlicht:</p>
            
            <div style="padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1a202c; font-size: 1.25rem; font-weight: bold; border-bottom: 1px solid #edf2f7; padding-bottom: 8px; margin-bottom: 12px;">${title}</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; color: #4a5568; line-height: 1.5;">
                    <!-- 1. Ort -->
                    <tr>
                        <td style="padding: 6px 0; width: 140px; font-weight: bold; vertical-align: top;">📍 Ort:</td>
                        <td style="padding: 6px 0;">${locDisplay}</td>
                    </tr>
                    <!-- 2. Datum -->
                    <tr>
                        <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">📅 Datum:</td>
                        <td style="padding: 6px 0;">${dateStr}</td>
                    </tr>
                    <!-- 3. Event-Typ -->
                    <tr>
                        <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">🎸 Event-Typ:</td>
                        <td style="padding: 6px 0;">${event.type || event.eventType || 'Event'}</td>
                    </tr>
                    <!-- 4. Gesucht (Musiker-Typen) -->
                    <tr>
                        <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">📋 Gesucht:</td>
                        <td style="padding: 6px 0;">${musicianTypes}</td>
                    </tr>
                    <!-- 5. Genres -->
                    <tr>
                        <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">🎵 Genres:</td>
                        <td style="padding: 6px 0;">${event.genres && event.genres.length > 0 ? event.genres.join(', ') : 'Nach Absprache'}</td>
                    </tr>
                    <!-- 6. Instrumente -->
                    <tr>
                        <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">🎹 Instrumente:</td>
                        <td style="padding: 6px 0;">${instrumentsDisplay}</td>
                    </tr>
                    <!-- 7. Spielzeit -->
                    <tr>
                        <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">⏱️ Spielzeit:</td>
                        <td style="padding: 6px 0;">${durationDisplay}</td>
                    </tr>
                    <!-- 8. Publikum -->
                    <tr>
                        <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">👥 Gäste:</td>
                        <td style="padding: 6px 0;">${publikumDisplay}</td>
                    </tr>
                    <!-- 9. Technik -->
                    <tr>
                        <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">🎛️ Technik:</td>
                        <td style="padding: 6px 0;">${techDisplay}</td>
                    </tr>
                    <!-- 10. Budget -->
                    <tr>
                        <td style="padding: 6px 0; font-weight: bold; vertical-align: top; color: #000;">💰 Budget:</td>
                        <td style="padding: 6px 0; font-weight: 600;">${budgetDisplay}</td>
                    </tr>
                </table>
            </div>
            
            <p style="margin-top: 25px;">
                <a href="https://gigconnact.de" style="background: ${brandColor}; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Details ansehen & bewerben</a>
            </p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 15px;">
            <p style="font-size: 0.8rem; color: #a0aec0; text-align: center;">GigConnAct — Dein Live-Musik Marktplatz</p>
        </div>
    `;
};
