/**
 * Template für die 4-wöchige Erinnerungsmail an Veranstalter mit Vermittlungsanfrage
 * "In … Monaten ist Dein Event XY. Hast Du schon Deinen passenden Act gefunden?"
 */
module.exports = function getMediationOrganizerReminderEmailHtml({
    clientName,
    eventName,
    eventDateFormatted,
    timeRemainingText,
    recommendationLink
}) {
    const brandColor = '#2563eb';
    const salutation = clientName && clientName.trim() ? `Hallo ${clientName.trim()}` : 'Hallo';
    const dateLine = eventDateFormatted ? ` am <strong>${eventDateFormatted}</strong>` : '';

    return `
        <div style="font-family: Arial, Helvetica, sans-serif; padding: 24px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background: #f8fafc; line-height: 1.5;">
            <!-- Brand Logo Header -->
            <div style="text-align: center; margin-bottom: 24px;">
                <img src="https://gigconnact.de/discoball.png" alt="GigConnAct Logo" style="width: 70px; height: 70px; object-fit: contain;">
            </div>

            <!-- Main Heading Card -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <h2 style="color: ${brandColor}; margin-top: 0; font-size: 1.35rem; text-align: center; font-weight: 800; line-height: 1.35;">
                    In ${timeRemainingText} ist Dein Event "${eventName}"! ⏰
                </h2>

                <p style="font-size: 1rem; color: #334155; margin-top: 16px;">
                    ${salutation},
                </p>

                <p style="font-size: 1rem; color: #334155; line-height: 1.6;">
                    In <strong>${timeRemainingText}</strong> findet bereits Dein Event <strong>"${eventName}"</strong>${dateLine} statt.
                </p>

                <div style="background: rgba(37, 99, 235, 0.07); border-left: 4px solid ${brandColor}; padding: 14px 16px; border-radius: 0 8px 8px 0; margin: 20px 0;">
                    <p style="font-size: 1.05rem; font-weight: 800; color: ${brandColor}; margin: 0;">
                        Hast Du schon Deinen passenden Act gefunden? 🎶
                    </p>
                </div>

                <p style="font-size: 0.95rem; color: #475569; line-height: 1.6;">
                    Deine persönliche Auswahl an passenden Musikern findest Du nach wie vor <a href="${recommendationLink}" style="color: ${brandColor}; font-weight: 700; text-decoration: underline;">hier</a>. Sieh Dir jetzt die aktuellen Vorschläge an und frage Deinen Wunsch-Act direkt unverbindlich an.
                </p>

                <!-- Call to Action Button -->
                <div style="text-align: center; margin-top: 28px; margin-bottom: 12px;">
                    <a href="${recommendationLink}" style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 1rem; display: inline-block; box-shadow: 0 4px 14px rgba(37,99,235,0.35); text-align: center;">
                        Aktuelle Musiker-Vorschläge ansehen
                    </a>
                </div>

                <!-- Fallback URL Link -->
                <p style="font-size: 0.78rem; color: #94a3b8; text-align: center; margin-top: 22px; word-break: break-all;">
                    Sollte der Button nicht funktionieren, kopiere diesen Link in Deinen Browser:<br>
                    <a href="${recommendationLink}" style="color: ${brandColor}; text-decoration: underline;">${recommendationLink}</a>
                </p>
            </div>

            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 24px; margin-bottom: 14px;">
            <p style="font-size: 0.78rem; color: #94a3b8; text-align: center; margin: 0;">
                GigConnAct — Dein Live-Musik Marktplatz &bull; <a href="https://gigconnact.de" style="color: #64748b; text-decoration: none;">gigconnact.de</a>
            </p>
        </div>
    `;
};
