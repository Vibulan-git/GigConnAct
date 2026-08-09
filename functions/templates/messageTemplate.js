/**
 * Template für Direktnachrichten im Chat
 * Hier kannst du den Text und das Layout der E-Mail für neue Nachrichten anpassen.
 */
module.exports = function getMessageEmailHtml({ senderName, messageText }) {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
            <h2 style="color: #7c3aed; margin-top: 0; font-size: 1.5rem;">Neue Nachricht auf GigConnAct 💬</h2>
            <p>Hallo,</p>
            <p>Du hast eine neue Nachricht von <strong>${senderName}</strong> erhalten:</p>
            <blockquote style="background: #edf2f7; border-left: 4px solid #7c3aed; padding: 12px; margin: 15px 0; border-radius: 4px; font-style: italic; color: #4a5568;">
                "${messageText}"
            </blockquote>
            <p style="margin-top: 25px;">
                <a href="https://gigconnact.de" style="background: #7c3aed; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Jetzt antworten</a>
            </p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 15px;">
            <p style="font-size: 0.8rem; color: #a0aec0; text-align: center;">GigConnAct — Dein Live-Musik Marktplatz</p>
        </div>
    `;
};
