/**
 * Template für Anmeldung per E-Mail-Link
 */
module.exports = function getSignInEmailHtml({ link, name, isNewUser, role }) {
    const isOrganizer = role === 'organizer';
    const brandColor = isOrganizer ? '#0ea5e9' : '#7c3aed';
    const salutation = (!name || name === 'Nutzer' || name === 'GigConnAct Nutzer') ? 'Hallo,' : `Hallo ${name},`;
    
    const title = isNewUser ? 'Dein Registrierungs-Link für GigConnAct 🚀' : 'Dein Anmeldelink für GigConnAct 🔐';
    const body = isNewUser
        ? `vielen Dank für deine Registrierung auf GigConnAct! Klicke auf den folgenden Button, um deine Registrierung abzuschließen und dich direkt anzumelden:`
        : `klicke auf den folgenden Button, um dich sicher und passwortlos in deinen GigConnAct-Account einzuloggen:`;
    const btnText = isNewUser ? 'Registrierung abschließen' : 'Direkt einloggen';

    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://gigconnact.de/discoball.png" alt="GigConnAct Logo" style="width: 70px; height: 70px; object-fit: contain;">
            </div>
            <h2 style="color: ${brandColor}; margin-top: 0; font-size: 1.5rem; text-align: center;">${title}</h2>
            <p>${salutation}</p>
            <p>${body}</p>
            <p style="margin-top: 25px;">
                <a href="${link}" style="background: ${brandColor}; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">${btnText}</a>
            </p>
            <p style="font-size: 0.85rem; color: #718096; margin-top: 20px;">
                Sollte der Button nicht funktionieren, kopiere bitte folgenden Link in deinen Browser:<br>
                <a href="${link}" style="color: ${brandColor}; word-break: break-all;">${link}</a>
            </p>
            <p style="font-size: 0.85rem; color: #718096; margin-top: 15px;">
                Dieser Link ist aus Sicherheitsgründen nur für kurze Zeit gültig.
            </p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 15px;">
            <p style="font-size: 0.8rem; color: #a0aec0; text-align: center;">GigConnAct — Dein Live-Musik Marktplatz</p>
        </div>
    `;
};
