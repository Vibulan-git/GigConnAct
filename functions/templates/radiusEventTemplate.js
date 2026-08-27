/**
 * Template für Events im Umkreis eines Musikers
 */
module.exports = function getRadiusEventEmailHtml({ userName, matches }) {
    const brandColor = '#7c3aed';
    const themeColor = '#7c3aed';
    
    const listHtml = matches.map(event => {
        const title = event.title || event.name || 'Neuer Gig';
        const dateStr = event.date || 'Termin nach Absprache';
        
        // Location and distance
        const loc = event.location || 'Deutschlandweit';
        const locDisplay = `${loc} (ca. ${Math.round(event.distance)} km von dir entfernt)`;

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
        const maxB = event.maxBudget !== undefined ? event.maxBudget : event.budgetMax;
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

        // Format Audience / Publikum
        const minP = event.minPublikum;
        const maxP = event.maxPublikum;
        let publikumDisplay = '50 - 150 Personen';
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
        const instrumentsDisplay = event.instruments && event.instruments.length > 0 ? event.instruments.join(', ') : 'Gesang, Gitarre';

        // Description
        const desc = event.description || '';
        const shortDesc = desc.length > 300 ? desc.substring(0, 300) + '...' : desc;

        return `
            <!-- Event Card -->
            <div style="border: 1px solid #e2e8f0; border-radius: 18px; background: #ffffff; margin-bottom: 24px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.03); font-family: Arial, sans-serif; max-width: 550px; margin-left: auto; margin-right: auto;">
                
                <!-- Card Body -->
                <div style="padding: 20px 24px;">
                    <!-- Title -->
                    <h3 style="margin-top: 0; color: #0f172a; font-size: 1.25rem; font-weight: 800; border-bottom: 1px solid #edf2f7; padding-bottom: 8px; margin-bottom: 12px; font-family: Arial, sans-serif;">
                        ${title}
                    </h3>
                    
                    <!-- Media Notice -->
                    <div style="margin-top: 10px; margin-bottom: 15px; font-size: 0.8rem; font-style: italic; color: #475569; font-family: Arial, sans-serif; text-align: center; background: #f1f5f9; padding: 8px 12px; border-radius: 8px; border: 1px dashed #cbd5e1;">
                        📷 🎥 🎵 Fotos, Videos & Hörproben sind direkt auf GigConnAct abrufbar.
                    </div>

                    <!-- Details List (No text labels, just icons) -->
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; color: #334155; margin-bottom: 16px; line-height: 1.6;">
                        <!-- 1. Ort -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">📍</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">${locDisplay}</td>
                        </tr>
                        <!-- 2. Datum -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">📅</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">${dateStr}</td>
                        </tr>
                        <!-- 3. Event-Typ -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">🎸</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">${event.type || event.eventType || 'Event'}</td>
                        </tr>
                        <!-- 4. Gesucht (Musiker-Typen) -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">📋</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">${musicianTypes}</td>
                        </tr>
                        <!-- 5. Genres -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">🎵</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">${event.genres && event.genres.length > 0 ? event.genres.join(', ') : 'Nach Absprache'}</td>
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
                        <!-- 10. Budget -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">💰</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif; font-weight: 600;">${budgetDisplay}</td>
                        </tr>
                    </table>
                    
                    <!-- Description -->
                    ${shortDesc ? `
                    <div style="border-top: 1px solid #f1f5f9; padding-top: 14px; font-size: 0.84rem; color: #475569; line-height: 1.5; font-family: Arial, sans-serif; margin-bottom: 16px;">
                        ${shortDesc}
                    </div>
                    ` : ''}

                    <!-- Direct Link Button -->
                    <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 14px;">
                        <a href="https://gigconnact.de/#/events?id=${event.id}" style="background: ${brandColor}; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 0.85rem; display: inline-block; box-shadow: 0 3px 8px rgba(0,0,0,0.1); width: calc(100% - 40px); box-sizing: border-box;">
                            Profil anzeigen
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background: #f8fafc;">
            <!-- Brand Logo Header -->
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://gigconnact.de/discoball.png" alt="GigConnAct Logo" style="width: 70px; height: 70px; object-fit: contain;">
            </div>
            
            <h2 style="color: ${brandColor}; margin-top: 0; font-size: 1.4rem; text-align: center; font-weight: bold;">Neues Event in deiner Umgebung! 📍</h2>
            
            <p style="font-size: 0.95rem; line-height: 1.5; color: #334155;">Hallo <strong>${userName}</strong>,</p>
            <p style="font-size: 0.95rem; line-height: 1.5; color: #334155; margin-top: -8px;">folgende neue Events wurden in deinem angegebenen Umkreis auf dem Markt veröffentlicht:</p>
            
            <div style="margin: 24px 0;">
                ${listHtml}
            </div>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 15px;">
            <p style="font-size: 0.78rem; color: #94a3b8; text-align: center; margin: 0;">GigConnAct — Dein Live-Musik Marktplatz</p>
        </div>
    `;
};
