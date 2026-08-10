/**
 * Template für Events im Umkreis eines Musikers
 */
module.exports = function getRadiusEventEmailHtml({ musicianName, event, distance, role }) {
    const isOrganizer = role === 'organizer';
    const brandColor = isOrganizer ? '#0ea5e9' : '#7c3aed';
    
    const title = event.title || event.name || 'Neuer Gig';
    const genres = (event.genres || []).join(', ') || 'Keine Genres angegeben';
    const budget = event.budget ? `${event.budget} €` : (event.minBudget ? `${event.minBudget} €` : 'Auf Anfrage');
    const dateStr = event.date || 'Termin nach Absprache';

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
                <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; color: #4a5568;">
                    <tr>
                        <td style="padding: 6px 0; width: 120px; font-weight: bold; vertical-align: top;">📍 Ort:</td>
                        <td style="padding: 6px 0;">${event.location || 'Ort nach Absprache'} (ca. ${distance} km von dir entfernt)</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">📅 Datum:</td>
                        <td style="padding: 6px 0;">${dateStr}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">🎵 Genres:</td>
                        <td style="padding: 6px 0;">${genres}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">💰 Budget:</td>
                        <td style="padding: 6px 0;">${budget}</td>
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
