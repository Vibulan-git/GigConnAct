/**
 * Template für die täglichen Top-Matches
 */
module.exports = function getTopMatchEmailHtml({ userName, role, matches }) {
    const isOrganizer = role === 'organizer';
    const brandColor = isOrganizer ? '#0ea5e9' : '#7c3aed';
    const themeColor = isOrganizer ? '#2563eb' : '#7c3aed';
    
    const listHtml = matches.map(m => {
        const title = m.title || m.name || 'Unbekannt';
        const details = m.type || (m.instruments ? m.instruments.join(', ') : (m.genres ? m.genres.join(', ') : ''));
        const matchColor = '#10b981';
        
        // Resolve card image:
        // For events, we ignore profilePic (which might be the organizer's personal photo) and use event photos/image.
        // Fallback is always the discoball logo.
        const photoUrl = isOrganizer 
            ? (m.profilePic || (m.photos && m.photos.length > 0 ? m.photos[0] : null) || m.image || 'https://gigconnact.de/discoball.png')
            : ((m.photos && m.photos.length > 0 ? m.photos[0] : null) || m.image || 'https://gigconnact.de/discoball.png');
        
        // Location and Date display
        const loc = m.location || 'Ort nach Absprache';
        
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
        
        // Description snippet
        const desc = m.description || m.bio || (isOrganizer 
            ? 'Professionelle Live-Musik für unvergessliche Momente.' 
            : 'Wir suchen eine musikalische Begleitung für unser Event.');
        const shortDesc = desc.length > 150 ? desc.substring(0, 150) + '...' : desc;

        const musicianTypes = (Array.isArray(m.musicianTypes) && m.musicianTypes.length > 0) 
            ? m.musicianTypes.join(', ') 
            : (typeof m.musicianTypes === 'string' && m.musicianTypes.trim() !== '' ? m.musicianTypes : (m.musicianType || 'Solo / Band'));

        return `
            <!-- Event / Musician Card (Kachel) -->
            <div style="border: 1px solid #e2e8f0; border-radius: 18px; background: #ffffff; margin-bottom: 24px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.03); font-family: Arial, sans-serif; max-width: 550px; margin-left: auto; margin-right: auto;">
                <!-- Card Image -->
                <div style="width: 100%; height: 210px; background-color: #0f172a; overflow: hidden; text-align: center;">
                    <img src="${photoUrl}" alt="${title}" style="width: 100%; height: 210px; object-fit: cover; display: block;">
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
                    
                    <!-- Details List -->
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; color: #334155; margin-bottom: 16px; line-height: 1.6;">
                        <!-- Location (Ort) -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">📍</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">${loc}</td>
                        </tr>
                        
                        <!-- Event-Art or Musiker-Typ -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">🎸</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">
                                ${isOrganizer 
                                    ? `Typ: ${m.type || m.category || 'Solo / Band'}` 
                                    : `Gesucht: ${musicianTypes}`
                                }
                            </td>
                        </tr>
                        
                        <!-- Date (Datum / Verfügbarkeit) -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">📅</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">${dateStr}</td>
                        </tr>
                        
                        <!-- Genres -->
                        ${m.genres && m.genres.length > 0 ? `
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">🎵</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">${m.genres.join(', ')}</td>
                        </tr>` : ''}
                        
                        <!-- Instruments (Instrumente) -->
                        ${m.instruments && m.instruments.length > 0 ? `
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">🎹</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">${m.instruments.join(', ')}</td>
                        </tr>` : ''}
                        
                        <!-- Duration (Spieldauer) -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">⏱️</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif;">${durationDisplay}</td>
                        </tr>
                        
                        <!-- Budget / Gage -->
                        <tr>
                            <td style="padding: 5px 0; width: 26px; vertical-align: top; font-size: 1rem;">💰</td>
                            <td style="padding: 5px 0; font-family: Arial, sans-serif; font-weight: 600;">${budgetDisplay}</td>
                        </tr>
                    </table>
                    
                    <!-- Description / Beschreibung -->
                    <div style="border-top: 1px solid #f1f5f9; padding-top: 14px; font-size: 0.84rem; color: #475569; line-height: 1.5; font-family: Arial, sans-serif;">
                        ${shortDesc}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const headingText = isOrganizer ? 'Neue passende Musiker für dein Event! 🌟' : 'Deine neuen Top-Matches heute! 🌟';
    const subHeadingText = isOrganizer 
        ? 'wir haben neue passende Musiker-Profile der letzten 24 Stunden auf dem Markt für dein Event gefunden:'
        : 'wir haben neue Top-Matches der letzten 24 Stunden auf dem Markt für dich gefunden:';

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
                <a href="https://gigconnact.de" style="background: ${themeColor}; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 0.9rem; display: inline-block; box-shadow: 0 4px 10px rgba(124,58,237,0.25);">Jetzt auf GigConnAct ansehen</a>
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
