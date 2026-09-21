/**
 * Template für die Feedback-Mail 3 Monate nach Account-Erstellung
 * "Wie gefällt Dir GigConnAct?" (Sterne-System 1-5)
 */
module.exports = function getPlatformFeedbackEmailHtml({
    recipientName,
    role,
    userId,
    baseUrl = 'https://gigconnact.de'
}) {
    const isOrganizer = role === 'organizer';
    const brandColor = isOrganizer ? '#2563eb' : '#7c3aed';
    const cleanRecipient = recipientName && recipientName.trim() ? recipientName.trim() : 'Hallo';

    // Build 5 star rating links
    const starsHtml = [1, 2, 3, 4, 5].map(stars => {
        const link = `${baseUrl}/#/feedback?type=platform&userId=${userId}&role=${role}&stars=${stars}`;
        return `
            <a href="${link}" style="text-decoration: none; display: inline-block; margin: 0 4px; padding: 10px 14px; background: #fef3c7; border: 1.5px solid #f59e0b; border-radius: 12px; font-size: 1.4rem; color: #d97706; transition: transform 0.2s;" title="${stars} von 5 Sternen">
                ★ <span style="font-size: 0.95rem; font-weight: 800; color: #b45309;">${stars}</span>
            </a>
        `;
    }).join('');

    return `
        <div style="font-family: Arial, Helvetica, sans-serif; padding: 24px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background: #f8fafc; line-height: 1.5;">
            <!-- Brand Logo Header -->
            <div style="text-align: center; margin-bottom: 24px;">
                <img src="https://gigconnact.de/discoball.png" alt="GigConnAct Logo" style="width: 70px; height: 70px; object-fit: contain;">
            </div>

            <!-- Main Heading Card -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <h2 style="color: ${brandColor}; margin-top: 0; font-size: 1.35rem; text-align: center; font-weight: 800; line-height: 1.35;">
                    3 Monate GigConnAct – Wie gefällt es Dir? ⭐
                </h2>

                <p style="font-size: 1rem; color: #334155; margin-top: 16px;">
                    Hallo ${cleanRecipient},
                </p>

                <p style="font-size: 1rem; color: #334155; line-height: 1.6;">
                    Du bist nun schon seit <strong>3 Monaten</strong> Teil der GigConnAct-Community! Wir hoffen, Du konntest bereits wertvolle Kontakte knüpfen und tolle Gigs erleben.
                </p>

                <p style="font-size: 0.98rem; color: #475569; line-height: 1.6;">
                    Uns liegt Deine Zufriedenheit sehr am Herzen. Wie bewertest Du Deine bisherige Erfahrung mit GigConnAct?
                </p>

                <!-- Interactive Star Rating Container -->
                <div style="background: #fafafa; border: 1px solid #f1f5f9; border-radius: 14px; padding: 20px 16px; margin: 24px 0; text-align: center;">
                    <p style="font-weight: 800; font-size: 0.95rem; color: #334155; margin-top: 0; margin-bottom: 14px;">
                        Klicke auf Deine Sterne-Bewertung:
                    </p>
                    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 8px;">
                        ${starsHtml}
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #94a3b8; max-width: 320px; margin: 10px auto 0;">
                        <span>1 = Unzufrieden</span>
                        <span>5 = Absolut begeistert</span>
                    </div>
                </div>

                <p style="font-size: 0.88rem; color: #64748b; text-align: center; margin: 16px 0 0;">
                    Vielen Dank für Deine kurze Bewertung! Dein Feedback hilft uns, GigConnAct jeden Tag noch besser zu machen.
                </p>
            </div>

            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 24px; margin-bottom: 14px;">
            <p style="font-size: 0.78rem; color: #94a3b8; text-align: center; margin: 0;">
                GigConnAct — Dein Live-Musik Marktplatz &bull; <a href="https://gigconnact.de" style="color: #64748b; text-decoration: none;">gigconnact.de</a>
            </p>
        </div>
    `;
};
