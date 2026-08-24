/**
 * Template für die täglichen Top-Matches
 */
module.exports = function getTopMatchEmailHtml({ userName, role, profileName, matches, profileId }) {
    const isOrganizer = role === 'organizer';
    const brandColor = isOrganizer ? '#0ea5e9' : '#7c3aed';
    const themeColor = isOrganizer ? '#2563eb' : '#7c3aed';
    
    // Helper to clean Base64 images to avoid bloating email size (Gmail cuts off above 102KB)
    const cleanPhotoUrl = (url) => {
        if (!url || typeof url !== 'string') return 'https://gigconnact.de/discoball.png';
        if (url.startsWith('data:image/')) {
            return 'https://gigconnact.de/discoball.png';
        }
        return url;
    };
    
    const listHtml = matches.map(m => {
        const title = m.title || m.name || 'Unbekannt';
        const matchColor = '#10b981';
        
        // Resolve card image and clean Base64 data URLs:
        const rawPhotoUrl = isOrganizer 
            ? (m.profilePic || (m.photos && m.photos.length > 0 ? m.photos[0] : null) || m.image || 'https://gigconnact.de/discoball.png')
            : ((m.photos && m.photos.length > 0 ? m.photos[0] : null) || m.image || 'https://gigconnact.de/discoball.png');
        const photoUrl = cleanPhotoUrl(rawPhotoUrl);
        
        // Location and Date display
        const loc = m.location || 'Deutschlandweit';
        
        // Format Date / Availability display
        let dateStr = m.date || 'Termin nach Absprache';
        if (m.dates && m.dates.length > 0) {
            dateStr = m.dates.join(', ');
        }
        if (m.availability && m.availability.length > 0) {
            dateStr = m.availability.join(', ');
        }
 
        // Format Duration display
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
 
        // Format Budget / Gage display
        let budgetDisplay = '';
        const minB = m.minBudget !== undefined ? m.minBudget : (m.budget || m.price);
        const maxB = m.maxBudget !== undefined ? m.maxBudget : m.budgetMax;
        if (minB !== undefined && minB !== null) {
            const minBStr = typeof minB === 'number' ? minB.toLocaleString('de-DE') : String(minB);
            if (maxB !== undefined && maxB !== null && maxB !== minB) {
                const maxBStr = typeof maxB === 'number' ? maxB.toLocaleString('de-DE') : String(maxB);
                budgetDisplay = `${minBStr} - ${maxBStr} €`;
            } else {
                budgetDisplay = `${minBStr} €`;
            }
        } else {
            budgetDisplay = isOrganizer ? 'Auf Anfrage' : '0 - 5.000 €';
        }
        
        // Format Audience / Publikum
        const minP = m.minPublikum;
        const maxP = m.maxPublikum;
        let publikumDisplay = isOrganizer ? '0 - 500+ Personen' : '50 - 150 Personen';
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
        const instrumentsDisplay = m.instruments && m.instruments.length > 0 
            ? m.instruments.join(', ') 
            : (isOrganizer ? 'Nach Vereinbarung' : 'Gesang, Gitarre');

        // Description snippet (limit raised to 350 for more information)
        const desc = m.description || m.bio || (isOrganizer 
            ? 'Professionelle Live-Musik für unvergessliche Momente.' 
            : 'Wir suchen eine musikalische Begleitung für unser Event.');
        const shortDesc = desc.length > 350 ? desc.substring(0, 350) + '...' : desc;
 
        const musicianTypes = (Array.isArray(m.musicianTypes) && m.musicianTypes.length > 0) 
            ? m.musicianTypes.join(', ') 
            : (typeof m.musicianTypes === 'string' && m.musicianTypes.trim() !== '' ? m.musicianTypes : (m.musicianType || 'Solo / Band'));
 
        return `
            <!-- Event / Musician Card (Kachel) -->
            <div style="border: 1px solid #e2e8f0; border-radius: 18px; background: #ffffff; margin-bottom: 24px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.03); font-family: Arial, sans-serif; max-width: 550px; margin-left: auto; margin-right: auto;">
                <!-- Card Image -->
                <div style="width: 100%; height: 210px; background-color: #0f172a; overflow: hidden; text-align: center;">
                    <img src="${photoUrl}" alt="${title}" style="width: 100%; height: 210px; object-fit: cover; display: block; margin: 0 auto;">
                </div>
                
                <!-- Card Body -->
                <div style="padding: 20px 24px;">
                    <!-- Title and Match Badge -->
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px;">
                        <tr>
                            <td style="font-weight: 800; font-size: 1.25rem; color: #0f172a; line-height: 1.3; font-family: Arial, sans-serif; vertical-align: middle;">
                                ${title}
                            </td>
                            <td style="text-align: right; vertical-align: middle; width: 95px; padding-left: 10px;">
                                <span style="background: ${matchColor}; color: #ffffff; padding: 5px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: bold; display: inline-block; white-space: nowrap; font-family: Arial, sans-serif; box-shadow: 0 2px 5px rgba(16,185,129,0.25);">
                                    ${m.matchScore}% Match
                                </span>
                            </td>
                        </tr>
                    </table>
                    
                    <!-- Media Notice -->
                    <div style="margin-top: 10px; margin-bottom: 15px; font-size: 0.8rem; font-style: italic; color: #475569; font-family: Arial, sans-serif; text-align: center; background: #f1f5f9; padding: 8px 12px; border-radius: 8px; border: 1px dashed #cbd5e1;">
                        📷 🎥 🎵 Fotos, Videos & Hörproben sind direkt auf GigConnAct abrufbar.
                    </div>

                    <!-- Details List -->
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; color: #334155; margin-bottom: 16px; line-height: 1.6;">
                        <!-- 1. Ort -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">📍</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">${loc}</td>
                        </tr>

                        <!-- 2. Datum / Verfügbarkeit -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">📅</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">${dateStr}</td>
                        </tr>

                        <!-- 3. Musiker-Typ / Event-Typ -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">🎸</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">
                                ${isOrganizer ? (m.type || m.category || 'Solo / Band') : (m.type || m.eventType || 'Event')}
                            </td>
                        </tr>

                        <!-- 4. Event-Typen (Gesucht) / Gesucht (Musiker-Typen) -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">📋</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">
                                ${isOrganizer ? (m.eventTypes && m.eventTypes.length > 0 ? m.eventTypes.join(', ') : 'Hochzeit, Geburtstag, Firmenfeier') : musicianTypes}
                            </td>
                        </tr>

                        <!-- 5. Genres -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">🎵</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">${m.genres && m.genres.length > 0 ? m.genres.join(', ') : 'Nach Absprache'}</td>
                        </tr>

                        <!-- 6. Instrumente -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">🥁</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">${instrumentsDisplay}</td>
                        </tr>

                        <!-- 7. Spielzeit -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">🕒</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">${durationDisplay}</td>
                        </tr>

                        <!-- 8. Publikum -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">👥</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">${publikumDisplay}</td>
                        </tr>

                        <!-- 9. Technik -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">🔊</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">${techDisplay}</td>
                        </tr>

                        <!-- 10. Gage / Budget -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">💰</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif; font-weight: 600;">${budgetDisplay}</td>
                        </tr>
                    </table>
                    
                    <!-- Description / Beschreibung -->
                    <div style="border-top: 1px solid #f1f5f9; padding-top: 14px; font-size: 0.84rem; color: #475569; line-height: 1.5; font-family: Arial, sans-serif; margin-bottom: 16px;">
                        ${shortDesc}
                    </div>
 
                    <!-- Direct Link Button inside Card -->
                    <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 14px;">
                        <a href="https://gigconnact.de/#/${isOrganizer ? 'musicians' : 'events'}?id=${m.id}${isOrganizer ? (profileId ? `&eventId=${profileId}` : '') : (profileId ? `&musicianId=${profileId}` : '')}" style="background: ${themeColor}; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 0.85rem; display: inline-block; box-shadow: 0 3px 8px rgba(0,0,0,0.1); width: calc(100% - 40px); box-sizing: border-box;">
                            ${isOrganizer ? 'Zum Profil' : 'Zum Event-Profil'}
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
 
    const pName = profileName || (isOrganizer ? 'dein Event' : 'dein Profil');
    const headingText = isOrganizer 
        ? `Neue passende Musiker für dein Event "${pName}"! 🌟` 
        : `Deine neuen Top-Matches für "${pName}"! 🌟`;
    const subHeadingText = isOrganizer 
        ? `wir haben neue passende Musiker-Profile der letzten 24 Stunden auf dem Markt für dein Event <strong>"${pName}"</strong> gefunden:`
        : `wir haben neue Top-Matches der letzten 24 Stunden auf dem Markt für <strong>"${pName}"</strong> gefunden:`;
 
    return `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background: #f8fafc;">
            <!-- Brand Logo Header -->
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://gigconnact.de/discoball.png" alt="GigConnAct Logo" style="width: 70px; height: 70px; object-fit: contain;">
            </div>
            
            <h2 style="color: ${themeColor}; margin-top: 0; font-size: 1.4rem; text-align: center; font-weight: bold;">${headingText}</h2>
            
            <p style="font-size: 0.95rem; line-height: 1.5; color: #334155;">Hallo <strong>${userName}</strong>,</p>
            <p style="font-size: 0.95rem; line-height: 1.5; color: #334155; margin-top: -8px;">${subHeadingText}</p>
            
            <div style="margin: 24px 0;">
                ${listHtml}
            </div>
            
            <p style="margin-top: 25px; text-align: center;">
                <a href="${isOrganizer ? 'https://gigconnact.de/#/musicians' : 'https://gigconnact.de/#/events'}" style="background: ${themeColor}; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 0.9rem; display: inline-block; box-shadow: 0 4px 10px rgba(124,58,237,0.25);">Jetzt auf GigConnAct ansehen</a>
            </p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 15px;">
            <p style="font-size: 0.78rem; color: #94a3b8; text-align: center; margin: 0;">GigConnAct — Dein Live-Musik Marktplatz</p>
            <p style="font-size: 0.72rem; color: #cbd5e1; text-align: center; margin-top: 10px; font-family: Arial, sans-serif;">
                Du möchtest diese täglichen Updates nicht mehr erhalten? 
                <a href="https://gigconnact.de/#/settings" style="color: ${themeColor}; text-decoration: underline;">Hier abbestellen</a>.
            </p>
        </div>
    `;
};
