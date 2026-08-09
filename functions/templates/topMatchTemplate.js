/**
 * Template für die täglichen Top-Matches
 */
module.exports = function getTopMatchEmailHtml({ userName, role, matches }) {
    const isOrganizer = role === 'organizer';
    const brandColor = isOrganizer ? '#0ea5e9' : '#7c3aed';
    
    const listHtml = matches.map(m => {
        const title = m.title || m.name || 'Unbekannt';
        const details = m.type || (m.instruments ? m.instruments.join(', ') : '');
        const matchColor = '#10b981';
        
        return `
            <div style="padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff; margin-bottom: 12px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="font-weight: bold; font-size: 1.05rem; color: #1a202c;">${title}</td>
                        <td style="text-align: right; width: 100px;">
                            <span style="background: ${matchColor}; color: #fff; padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; display: inline-block;">
                                ${m.matchScore}% Match
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="font-size: 0.88rem; color: #4a5568; padding-top: 4px;">
                            📍 ${m.location || 'Ort nach Absprache'} ${m.date ? ` • 📅 ${m.date}` : ''}
                        </td>
                    </tr>
                    ${details ? `
                    <tr>
                        <td colspan="2" style="font-size: 0.82rem; color: #718096; padding-top: 6px;">
                            <strong>Genre/Instrumente:</strong> ${details}
                        </td>
                    </tr>` : ''}
                </table>
            </div>
        `;
    }).join('');

    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
            <h2 style="color: ${brandColor}; margin-top: 0; font-size: 1.5rem;">Deine täglichen Top-Matches 🌟</h2>
            <p>Hallo <strong>${userName}</strong>,</p>
            <p>wir haben neue Top-Matches der letzten 24 Stunden auf dem Markt für dich gefunden:</p>
            
            <div style="margin: 20px 0;">
                ${listHtml}
            </div>
            
            <p style="margin-top: 25px;">
                <a href="https://gigconnact.de" style="background: ${brandColor}; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Jetzt auf GigConnAct ansehen</a>
            </p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 15px;">
            <p style="font-size: 0.8rem; color: #a0aec0; text-align: center;">GigConnAct — Dein Live-Musik Marktplatz</p>
        </div>
    `;
};
