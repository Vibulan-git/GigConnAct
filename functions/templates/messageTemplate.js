/**
 * Template für Direktnachrichten im Chat mit optionaler Profilkachel des Absenders
 */
module.exports = function getMessageEmailHtml({ senderName, messageText, role, senderProfile, isSenderMusician }) {
    const isOrganizer = role === 'organizer';
    const brandColor = isOrganizer ? '#0ea5e9' : '#7c3aed';

    let cardHtml = '';
    if (senderProfile) {
        const m = senderProfile;
        const title = m.title || m.name || 'Unbekannt';
        
        // Resolve image URL
        const photoUrl = isSenderMusician
            ? ((m.photos && m.photos.length > 0 ? m.photos[0] : null) || m.profilePic || m.image || 'https://gigconnact.de/discoball.png')
            : (m.profilePic || (m.photos && m.photos.length > 0 ? m.photos[0] : null) || m.image || 'https://gigconnact.de/discoball.png');
            
        // Location and Date display
        const loc = m.location || 'Ort nach Absprache';
        
        // Date / Availability
        let dateStr = m.date || 'Termin nach Absprache';
        if (m.dates && m.dates.length > 0) {
            dateStr = m.dates.join(', ');
        }
        if (m.availability && m.availability.length > 0) {
            dateStr = m.availability.join(', ');
        }

        // Format Duration
        let durationDisplay = '';
        const minDur = m.minDuration;
        const maxDur = m.maxDuration;
        if (minDur !== undefined && minDur !== null) {
            const minStr = String(minDur).replace('.', ',');
            if (maxDur !== undefined && maxDur !== null && maxDur !== minDur) {
                const maxStr = String(maxDur).replace('.', ',');
                durationDisplay = `${minStr} - ${maxStr} Stunden`;
            } else {
                durationDisplay = `${minStr} Stunden`;
            }
        } else {
            let baseDur = String(m.duration || m.spieldauer || '2 - 4');
            baseDur = baseDur.replace(/ca\.\s*/gi, '').replace(/\s*Stunden\.?/gi, '').trim();
            durationDisplay = `${baseDur} Stunden`;
        }

        // Format Budget / Gage
        let budgetDisplay = '';
        const minB = m.minBudget !== undefined ? m.minBudget : (m.budget || m.price);
        const maxB = m.maxBudget;
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
        const minP = m.minPublikum;
        const maxP = m.maxPublikum;
        let publikumDisplay = 'Nach Vereinbarung';
        if (minP !== undefined && minP !== null) {
            if (maxP !== undefined && maxP !== null) {
                publikumDisplay = `${minP} - ${maxP} Personen`;
            } else {
                publikumDisplay = `${minP}+ Personen`;
            }
        } else if (m.publikum) {
            publikumDisplay = m.publikum;
        }

        // Format Tech / Technik
        const techArr = Array.isArray(m.technik) 
            ? m.technik 
            : (typeof m.technik === 'string' && m.technik.trim() !== '' ? m.technik.split(',').map(s => s.trim()) : []);
        const techDisplay = techArr.length > 0 ? techArr.join(', ') : 'Nach Vereinbarung';

        // Format Instruments
        const instrumentsDisplay = m.instruments && m.instruments.length > 0 ? m.instruments.join(', ') : 'Nach Vereinbarung';

        // Description
        const desc = m.description || m.bio || (isSenderMusician
            ? 'Professionelle Live-Musik für unvergessliche Momente.'
            : 'Wir suchen eine musikalische Begleitung für unser Event.');
        const shortDesc = desc.length > 150 ? desc.substring(0, 150) + '...' : desc;

        const musicianTypes = (Array.isArray(m.musicianTypes) && m.musicianTypes.length > 0) 
            ? m.musicianTypes.join(', ') 
            : (typeof m.musicianTypes === 'string' && m.musicianTypes.trim() !== '' ? m.musicianTypes : (m.musicianType || 'Solo / Band'));

        cardHtml = `
            <div style="margin-top: 30px; border-top: 1px dashed #e2e8f0; padding-top: 25px;">
                <p style="font-size: 0.9rem; font-weight: bold; color: #475569; margin-bottom: 12px; text-align: center;">Profil des Absenders:</p>
                <!-- Event / Musician Card (Kachel) -->
                <div style="border: 1px solid #e2e8f0; border-radius: 18px; background: #ffffff; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.03); font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                    <!-- Card Image -->
                    <div style="width: 100%; height: 180px; background-color: #0f172a; overflow: hidden; text-align: center;">
                        <img src="${photoUrl}" alt="${title}" style="width: 100%; height: 180px; object-fit: cover; display: block;">
                    </div>
                    
                    <!-- Card Body -->
                    <div style="padding: 16px 20px;">
                        <!-- Title -->
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
                            <tr>
                                <td style="font-weight: 800; font-size: 1.15rem; color: #0f172a; line-height: 1.3; font-family: Arial, sans-serif;">
                                    ${title}
                                </td>
                                <td style="text-align: right; width: 85px;">
                                    <span style="background: ${isSenderMusician ? '#7c3aed' : '#2563eb'}; color: #ffffff; padding: 4px 8px; border-radius: 20px; font-size: 0.72rem; font-weight: bold; display: inline-block; white-space: nowrap; font-family: Arial, sans-serif;">
                                        ${isSenderMusician ? 'Musiker' : 'Event'}
                                    </span>
                                </td>
                            </tr>
                        </table>
                        
                        <!-- Details List -->
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; color: #334155; margin-bottom: 12px; line-height: 1.5;">
                            <!-- 1. Ort -->
                            <tr>
                                <td style="padding: 4px 0; width: 22px; vertical-align: top; font-size: 0.9rem;">📍</td>
                                <td style="padding: 4px 0; font-family: Arial, sans-serif;"><b>Ort:</b> ${loc}</td>
                            </tr>
                            
                            <!-- 2. Datum / Verfügbarkeit -->
                            <tr>
                                <td style="padding: 4px 0; width: 22px; vertical-align: top; font-size: 0.9rem;">📅</td>
                                <td style="padding: 4px 0; font-family: Arial, sans-serif;"><b>${isSenderMusician ? 'Verfügbarkeit' : 'Datum'}:</b> ${dateStr}</td>
                            </tr>
                            
                            <!-- 3. Musiker-Typ / Event-Typ -->
                            <tr>
                                <td style="padding: 4px 0; width: 22px; vertical-align: top; font-size: 0.9rem;">🎸</td>
                                <td style="padding: 4px 0; font-family: Arial, sans-serif;">
                                    <b>${isSenderMusician ? 'Musiker-Typ' : 'Event-Typ'}:</b> ${isSenderMusician ? (m.type || m.category || 'Solo / Band') : (m.type || m.eventType || 'Event')}
                                </td>
                            </tr>

                            <!-- 4. Event-Typen (Gesucht) / Gesucht (Musiker-Typen) -->
                            <tr>
                                <td style="padding: 4px 0; width: 22px; vertical-align: top; font-size: 0.9rem;">📋</td>
                                <td style="padding: 4px 0; font-family: Arial, sans-serif;">
                                    <b>${isSenderMusician ? 'Event-Typen (Gesucht)' : 'Gesucht'}:</b> ${isSenderMusician ? (m.eventTypes && m.eventTypes.length > 0 ? m.eventTypes.slice(0, 5).join(', ') : 'Hochzeit, Geburtstag, Firmenfeier') : musicianTypes}
                                </td>
                            </tr>

                            <!-- 5. Genres -->
                            <tr>
                                <td style="padding: 4px 0; width: 22px; vertical-align: top; font-size: 0.9rem;">🎵</td>
                                <td style="padding: 4px 0; font-family: Arial, sans-serif;"><b>Genres:</b> ${m.genres && m.genres.length > 0 ? m.genres.slice(0, 5).join(', ') : 'Nach Absprache'}</td>
                            </tr>

                            <!-- 6. Instrumente -->
                            <tr>
                                <td style="padding: 4px 0; width: 22px; vertical-align: top; font-size: 0.9rem;">🎹</td>
                                <td style="padding: 4px 0; font-family: Arial, sans-serif;"><b>Instrumente:</b> ${instrumentsDisplay}</td>
                            </tr>

                            <!-- 7. Spielzeit -->
                            <tr>
                                <td style="padding: 4px 0; width: 22px; vertical-align: top; font-size: 0.9rem;">⏱️</td>
                                <td style="padding: 4px 0; font-family: Arial, sans-serif;"><b>Spieldauer:</b> ${durationDisplay}</td>
                            </tr>

                            <!-- 8. Publikum -->
                            <tr>
                                <td style="padding: 4px 0; width: 22px; vertical-align: top; font-size: 0.9rem;">👥</td>
                                <td style="padding: 4px 0; font-family: Arial, sans-serif;"><b>Gäste:</b> ${publikumDisplay}</td>
                            </tr>

                            <!-- 9. Technik -->
                            <tr>
                                <td style="padding: 4px 0; width: 22px; vertical-align: top; font-size: 0.9rem;">🎛️</td>
                                <td style="padding: 4px 0; font-family: Arial, sans-serif;"><b>Technik:</b> ${techDisplay}</td>
                            </tr>

                            <!-- 10. Gage / Budget -->
                            <tr>
                                <td style="padding: 4px 0; width: 22px; vertical-align: top; font-size: 0.9rem;">💰</td>
                                <td style="padding: 4px 0; font-family: Arial, sans-serif; font-weight: 600;"><b>${isSenderMusician ? 'Gage' : 'Budget'}:</b> ${budgetDisplay}</td>
                            </tr>
                        </table>
                        
                        <!-- Description / Beschreibung -->
                        <div style="border-top: 1px solid #f1f5f9; padding-top: 10px; font-size: 0.8rem; color: #475569; line-height: 1.4; font-family: Arial, sans-serif;">
                            ${shortDesc}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://gigconnact.de/discoball.png" alt="GigConnAct Logo" style="width: 70px; height: 70px; object-fit: contain;">
            </div>
            <h2 style="color: ${brandColor}; margin-top: 0; font-size: 1.5rem; text-align: center;">Neue Nachricht auf GigConnAct 💬</h2>
            <p>Hallo,</p>
            <p>Du hast eine neue Nachricht von <strong>${senderName}</strong> erhalten:</p>
            <blockquote style="background: #edf2f7; border-left: 4px solid ${brandColor}; padding: 12px; margin: 15px 0; border-radius: 4px; font-style: italic; color: #4a5568;">
                "${messageText}"
            </blockquote>
            
            ${cardHtml}

            <p style="margin-top: 25px; text-align: center;">
                <a href="https://gigconnact.de" style="background: ${brandColor}; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Jetzt antworten</a>
            </p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 15px;">
            <p style="font-size: 0.8rem; color: #a0aec0; text-align: center;">GigConnAct — Dein Live-Musik Marktplatz</p>
        </div>
    `;
};
