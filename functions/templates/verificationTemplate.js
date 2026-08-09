/**
 * Template für E-Mail-Verifizierung
 */
module.exports = function getVerificationEmailHtml({ link, name }) {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
            <h2 style="color: #7c3aed; margin-top: 0; font-size: 1.5rem;">Bestätige deine E-Mail-Adresse bei GigConnAct 📧</h2>
            <p>Hallo ${name},</p>
            <p>vielen Dank für deine Registrierung auf GigConnAct! Bitte bestätige deine E-Mail-Adresse, um deinen Account vollständig zu aktivieren und alle Funktionen nutzen zu können.</p>
            <p style="margin-top: 25px;">
                <a href="${link}" style="background: #7c3aed; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">E-Mail-Adresse bestätigen</a>
            </p>
            <p style="font-size: 0.85rem; color: #718096; margin-top: 20px;">
                Sollte der Button nicht funktionieren, kopiere bitte folgenden Link in deinen Browser:<br>
                <a href="${link}" style="color: #7c3aed; word-break: break-all;">${link}</a>
            </p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 15px;">
            <p style="font-size: 0.8rem; color: #a0aec0; text-align: center;">GigConnAct — Dein Live-Musik Marktplatz</p>
        </div>
    `;
};
