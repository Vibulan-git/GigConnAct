[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$euro = [char]0x20AC
$ue = [char]0xFC
$ae = [char]0xE4
$sz = [char]0xDF
$oe = [char]0xF6
$camera = [char]0xD83D + [char]0xDCF7
$clapper = [char]0xD83C + [char]0xDFAC

function Replace-Regex-Utf8($path, $regexPattern, $replacement) {
    $encoding = [System.Text.Encoding]::UTF8
    $content = [System.IO.File]::ReadAllText($path, $encoding)
    
    $normalizedContent = $content -replace "`r`n", "`n"
    $normalizedPattern = $regexPattern -replace "`r`n", "`n"
    $normalizedReplacement = $replacement -replace "`r`n", "`n"
    
    if ($normalizedContent -match $normalizedPattern) {
        $normalizedContent = [regex]::Replace($normalizedContent, $normalizedPattern, $normalizedReplacement)
        $finalContent = $normalizedContent -replace "`n", "`r`n"
        $utf8NoBom = [System.Text.UTF8Encoding]::new($false)
        [System.IO.File]::WriteAllText($path, $finalContent, $utf8NoBom)
        Write-Host "Replaced successfully in $path"
    } else {
        Write-Warning "Regex not matched in $path"
    }
}

$appPath = "C:\Users\vibul\OneDrive\Dokumente\GitHub\GetYourGig\app.js"

# 1. Organizer view: Remove Dashboard statistics card (My Events page)
$regexStats = '(?s)(container\.innerHTML\s*=\s*`\s*<div class="portal-layout"[^>]*?>)\s*<!-- Integrated Dashboard Header -->\s*<div class="profile-section-card" style="margin-bottom:0;">.*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*(?=<!-- Active Events -->)'
$replaceStats = '$1'
Replace-Regex-Utf8 $appPath $regexStats $replaceStats

# 2. Organizer view: Rename "Aktive Event-Ausschreibungen" to "Aktive Events"
$regexActiveEventsText = 'Aktive Event-Ausschreibungen \(\$\{activeEvents\.length\}\)'
$replaceActiveEventsText = 'Aktive Events (${activeEvents.length})'
Replace-Regex-Utf8 $appPath $regexActiveEventsText $replaceActiveEventsText

# 3. Organizer view: Neues Event erstellen button color to blue
$regexNewEventBtn = 'id="btn-create-event-modal" style="margin:0; background: #7c3aed; border-color: #7c3aed; color: #ffffff;"'
$replaceNewEventBtn = 'id="btn-create-event-modal" style="margin:0; background: #2563eb; border-color: #2563eb; color: #ffffff;"'
Replace-Regex-Utf8 $appPath $regexNewEventBtn $replaceNewEventBtn

# 4. Profile view: Rename company label to "Organisation"
$regexOrgLabel = '<label style="color: \$\{themeColor\} !important; font-weight: 800 !important; font-size:0\.8rem; display:block; margin-bottom:0\.3rem;">Unternehmen / Organisation<\/label>'
$replaceOrgLabel = '<label style="color: ${themeColor} !important; font-weight: 800 !important; font-size:0.8rem; display:block; margin-bottom:0.3rem;">Organisation</label>'
Replace-Regex-Utf8 $appPath $regexOrgLabel $replaceOrgLabel

# 5. Profile view: Remove times block
$regexTimesBlock = '(?s)\s*<div style="display: flex; gap: 1rem; margin-bottom: 1\.5rem; flex-wrap: wrap;">\s*<div class="form-group" style="flex: 0 0 150px; width: 150px;">.*?id="prof-event-starttime".*?<\/div>\s*<\/div>\s*'
$replaceTimesBlock = ''
Replace-Regex-Utf8 $appPath $regexTimesBlock $replaceTimesBlock

# 6. Profile view save: Make start/end time save conditional on input elements being present
$regexSaveTime = '(?s)u\.eventStartTime = document\.getElementById\(''prof-event-starttime''\)\.value;\s*u\.eventEndTime = document\.getElementById\(''prof-event-endtime''\)\.value;'
$replaceSaveTime = 'const startEl = document.getElementById(''prof-event-starttime''); const endEl = document.getElementById(''prof-event-endtime''); if (startEl) u.eventStartTime = startEl.value; if (endEl) u.eventEndTime = endEl.value;'
Replace-Regex-Utf8 $appPath $regexSaveTime $replaceSaveTime

# 7. Magic link login buttons: Text to "Jetzt anmelden" and background color based on role
$regex3_email = '\[Jetzt als \$\{roleText\} anmelden\]'
$replace3_email = '[Jetzt anmelden]'
Replace-Regex-Utf8 $appPath $regex3_email $replace3_email

$regex3_btn = '(?s)<button type="button" class="btn btn-primary btn-magic-action" data-email="\$\{email\}" data-action="login" style="width: 100%; background: linear-gradient\(135deg, #7c3aed 0%, #2563eb 100%\); font-weight: 800; border: none; padding: 0.7rem; border-radius: 8px;">\s*Jetzt als \$\{roleText\} anmelden\s*<\/button>'
$replace3_btn = '<button type="button" class="btn btn-primary btn-magic-action" data-email="${email}" data-action="login" style="width: 100%; background: ${user.role === ''musician'' ? ''#7c3aed'' : ''#2563eb''}; font-weight: 800; border: none; padding: 0.7rem; border-radius: 8px;">Jetzt anmelden</button>'
Replace-Regex-Utf8 $appPath $regex3_btn $replace3_btn

# 8. Subscription Cards Redesign - Registration page
$regexRegCards = '(?s)<div class="subscription-cards">\s*<div class="subscription-card active" data-plan="flex" data-price="9\.99">.*?<\/div>\s*<\/div>\s*(?=<input type="hidden" name="selectedPlan" id="input-selected-plan")'
$replaceRegCards = '
                        <div class="subscription-cards">
                            <div class="subscription-card active" data-plan="flex" data-price="9.99">
                                <div class="selected-badge">Beliebt</div>
                                <h5>Flex</h5>
                                <div class="price">9,99 ' + $euro + ' <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
                                <ul class="plan-features">
                                    <li><i class="fa-solid fa-circle-check"></i> Kontakt zu ALLEN Veranstaltern</li>
                                    <li><i class="fa-solid fa-circle-check"></i> 1 Monat Vertragslaufzeit</li>
                                    <li><i class="fa-solid fa-circle-check"></i> Jederzeit k' + $ue + 'ndbar (in Testphase)</li>
                                </ul>
                                <div class="subscription-gift-box">
                                    <i class="fa-solid fa-gift"></i>
                                    <div>
                                        <div class="gift-title">1. Monat kostenlos</div>
                                        <div class="gift-sub">Keine Kosten zum Start</div>
                                    </div>
                                </div>
                                <div style="display: flex; justify-content: center; margin-top: 0.8rem; width: 100%;">
                                    <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">Ausgew' + $ae + 'hlt</button>
                                </div>
                            </div>
                            <div class="subscription-card" data-plan="plus" data-price="7.99">
                                <div class="selected-badge">Spare 20 %</div>
                                <h5>Plus</h5>
                                <div class="price">7,99 ' + $euro + ' <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
                                <ul class="plan-features">
                                    <li><i class="fa-solid fa-circle-check"></i> Kontakt zu ALLEN Veranstaltern</li>
                                    <li><i class="fa-solid fa-circle-check"></i> 6 Monate Vertragslaufzeit</li>
                                    <li><i class="fa-solid fa-circle-check"></i> Jederzeit k' + $ue + 'ndbar (in Testphase)</li>
                                </ul>
                                <div class="subscription-gift-box">
                                    <i class="fa-solid fa-gift"></i>
                                    <div>
                                        <div class="gift-title">1. Monat kostenlos</div>
                                        <div class="gift-sub">Keine Kosten zum Start</div>
                                    </div>
                                </div>
                                <div style="display: flex; justify-content: center; margin-top: 0.8rem; width: 100%;">
                                    <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">Ausw' + $ae + 'hlen</button>
                                </div>
                            </div>
                            <div class="subscription-card" data-plan="pro" data-price="5.99">
                                <div class="selected-badge">Spare 40 %</div>
                                <h5>Pro</h5>
                                <div class="price">5,99 ' + $euro + ' <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
                                <ul class="plan-features">
                                    <li><i class="fa-solid fa-circle-check"></i> Kontakt zu ALLEN Veranstaltern</li>
                                    <li><i class="fa-solid fa-circle-check"></i> 12 Monate Vertragslaufzeit</li>
                                    <li><i class="fa-solid fa-circle-check"></i> Jederzeit k' + $ue + 'ndbar (in Testphase)</li>
                                </ul>
                                <div class="subscription-gift-box">
                                    <i class="fa-solid fa-gift"></i>
                                    <div>
                                        <div class="gift-title">1. Monat kostenlos</div>
                                        <div class="gift-sub">Keine Kosten zum Start</div>
                                    </div>
                                </div>
                                <div style="display: flex; justify-content: center; margin-top: 0.8rem; width: 100%;">
                                    <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">Ausw' + $ae + 'hlen</button>
                                </div>
                            </div>
                            <div class="subscription-card" data-plan="premium" data-price="4.99">
                                <div class="selected-badge" style="background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%) !important;">Spare 59 %</div>
                                <h5>Premium</h5>
                                <div class="price">4,99 ' + $euro + ' <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
                                <ul class="plan-features">
                                    <li><i class="fa-solid fa-circle-check"></i> Kontakt zu ALLEN Veranstaltern</li>
                                    <li><i class="fa-solid fa-circle-check"></i> 12 Monate Vertragslaufzeit</li>
                                    <li><i class="fa-solid fa-circle-info"></i> Code erforderlich</li>
                                </ul>
                                <div class="subscription-gift-box">
                                    <i class="fa-solid fa-gift"></i>
                                    <div>
                                        <div class="gift-title">3 Monate kostenlos</div>
                                        <div class="gift-sub">Instagram-Story Aktion</div>
                                    </div>
                                </div>
                                <div style="display: flex; justify-content: center; margin-top: 0.8rem; width: 100%;">
                                    <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">Ausw' + $ae + 'hlen</button>
                                </div>
                            </div>
                        </div>'
Replace-Regex-Utf8 $appPath $regexRegCards $replaceRegCards

# 9. Subscription Cards listener - Registration page
$regexRegListener = '(?s)card\.classList\.add\(''active''\);\s*const plan = card\.getAttribute\(''data-plan''\);\s*if \(selectedPlanInput\) selectedPlanInput\.value = plan;'
$replaceRegListener = '
            card.classList.add(''active'');
            const plan = card.getAttribute(''data-plan'');
            if (selectedPlanInput) selectedPlanInput.value = plan;

            // Dynamically update card buttons text in registration
            subCards.forEach(c => {
                const btn = c.querySelector(''.btn-sub-select'');
                if (btn) {
                    btn.textContent = c.classList.contains(''active'') ? ''Ausgew' + $ae + 'hlt'' : ''Ausw' + $ae + 'hlen'';
                }
            });'
Replace-Regex-Utf8 $appPath $regexRegListener $replaceRegListener

# 10. Subscription Cards Redesign - Profile Edit page
$regexProfCards = '(?s)<div class="subscription-cards" style="margin-bottom: 1\.5rem;">\s*<div class="subscription-card \$\{activePlan === ''flex''.*?<\/div>\s*<\/div>\s*(?=<div id="profile-promo-code-box")'
$replaceProfCards = '
                    <div class="subscription-cards" style="margin-bottom: 1.5rem;">
                        <div class="subscription-card ${activePlan === ''flex'' ? ''active'' : ''}" data-plan="flex" data-price="9.99">
                            <div class="selected-badge">Beliebt</div>
                            <h5>Flex</h5>
                            <div class="price">9,99 ' + $euro + ' <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
                            <ul class="plan-features" style="font-size: 0.7rem; margin-top: 0.6rem;">
                                <li><i class="fa-solid fa-circle-check"></i> Kontakt zu ALLEN Veranstaltern</li>
                                <li><i class="fa-solid fa-circle-check"></i> 1 Monat Vertragslaufzeit</li>
                            </ul>
                            <div class="subscription-gift-box">
                                <i class="fa-solid fa-gift"></i>
                                <div>
                                    <div class="gift-title">1. Monat kostenlos</div>
                                    <div class="gift-sub">Keine Kosten zum Start</div>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: center; margin-top: 0.8rem; width: 100%;">
                                <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">${activePlan === ''flex'' ? ''Aktueller Tarif'' : (selectedPlan === ''flex'' ? ''Ausgew' + $ae + 'hlt'' : ''Ausw' + $ae + 'hlen'')}</button>
                            </div>
                        </div>
                        <div class="subscription-card ${activePlan === ''plus'' ? ''active'' : ''}" data-plan="plus" data-price="7.99">
                            <div class="selected-badge">Spare 20 %</div>
                            <h5>Plus</h5>
                            <div class="price">7,99 ' + $euro + ' <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
                            <ul class="plan-features" style="font-size: 0.7rem; margin-top: 0.6rem;">
                                <li><i class="fa-solid fa-circle-check"></i> Kontakt zu ALLEN Veranstaltern</li>
                                <li><i class="fa-solid fa-circle-check"></i> 6 Monate Vertragslaufzeit</li>
                            </ul>
                            <div class="subscription-gift-box">
                                <i class="fa-solid fa-gift"></i>
                                <div>
                                    <div class="gift-title">1. Monat kostenlos</div>
                                    <div class="gift-sub">Keine Kosten zum Start</div>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: center; margin-top: 0.8rem; width: 100%;">
                                <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">${activePlan === ''plus'' ? ''Aktueller Tarif'' : (selectedPlan === ''plus'' ? ''Ausgew' + $ae + 'hlt'' : ''Ausw' + $ae + 'hlen'')}</button>
                            </div>
                        </div>
                        <div class="subscription-card ${activePlan === ''pro'' ? ''active'' : ''}" data-plan="pro" data-price="5.99">
                            <div class="selected-badge">Spare 40 %</div>
                            <h5>Pro</h5>
                            <div class="price">5,99 ' + $euro + ' <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
                            <ul class="plan-features" style="font-size: 0.7rem; margin-top: 0.6rem;">
                                <li><i class="fa-solid fa-circle-check"></i> Kontakt zu ALLEN Veranstaltern</li>
                                <li><i class="fa-solid fa-circle-check"></i> 12 Monate Vertragslaufzeit</li>
                            </ul>
                            <div class="subscription-gift-box">
                                <i class="fa-solid fa-gift"></i>
                                <div>
                                    <div class="gift-title">1. Monat kostenlos</div>
                                    <div class="gift-sub">Keine Kosten zum Start</div>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: center; margin-top: 0.8rem; width: 100%;">
                                <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">${activePlan === ''pro'' ? ''Aktueller Tarif'' : (selectedPlan === ''pro'' ? ''Ausgew' + $ae + 'hlt'' : ''Ausw' + $ae + 'hlen'')}</button>
                            </div>
                        </div>
                        <div class="subscription-card ${activePlan === ''premium'' ? ''active'' : ''}" data-plan="premium" data-price="4.99">
                            <div class="selected-badge" style="background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%) !important;">Spare 59 %</div>
                            <h5>Premium</h5>
                            <div class="price">4,99 ' + $euro + ' <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
                            <ul class="plan-features" style="font-size: 0.7rem; margin-top: 0.6rem;">
                                <li><i class="fa-solid fa-circle-check"></i> Kontakt zu ALLEN Veranstaltern</li>
                                <li><i class="fa-solid fa-circle-check"></i> 12 Monate Vertragslaufzeit</li>
                            </ul>
                            <div class="subscription-gift-box">
                                <i class="fa-solid fa-gift"></i>
                                <div>
                                    <div class="gift-title">3 Monate kostenlos</div>
                                    <div class="gift-sub">Instagram-Story Aktion</div>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: center; margin-top: 0.8rem; width: 100%;">
                                <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">${activePlan === ''premium'' ? ''Aktueller Tarif'' : (selectedPlan === ''premium'' ? ''Ausgew' + $ae + 'hlt'' : ''Ausw' + $ae + 'hlen'')}</button>
                            </div>
                        </div>
                    </div>'
Replace-Regex-Utf8 $appPath $regexProfCards $replaceProfCards

# 11. Subscription Cards listener - Profile Edit page
$regexProfListener = '(?s)card\.classList\.add\(''active''\);\s*selectedPlan = card\.getAttribute\(''data-plan''\);\s*if \(selectedPlan === ''premium'' && !isPromoApplied\) \{'
$replaceProfListener = '
                card.classList.add(''active'');
                selectedPlan = card.getAttribute(''data-plan'');

                // Dynamically update card buttons text in profile edit
                subCards.forEach(c => {
                    const btn = c.querySelector(''.btn-sub-select'');
                    if (btn) {
                        const plan = c.getAttribute(''data-plan'');
                        btn.textContent = plan === activePlan
                            ? ''Aktueller Tarif''
                            : (c.classList.contains(''active'') ? ''Ausgew' + $ae + 'hlt'' : ''Ausw' + $ae + 'hlen'');
                    }
                });

                if (selectedPlan === ''premium'' && !isPromoApplied) {'
Replace-Regex-Utf8 $appPath $regexProfListener $replaceProfListener

# 12. Remove availability description text
$regexDesc = '(?s)<label>Verf.gbarkeiten<\/label>\s*<p style="font-size:0\.7rem; color:var\(--text-muted\); margin-bottom: 0\.5rem; line-height: 1\.3;">.*?Montag - Donnerstag ist.*?<\/p>'
$replaceDesc = "<label>Verf$($ue)gbarkeiten</label>"
Replace-Regex-Utf8 $appPath $regexDesc $replaceDesc

# 13. Remove "von" text from availability times
$regexVon = '(?s)<span>von<\/span>\s*<input type="time" name="availStart_\$\{day\.key\}" value="\$\{day\.minTime\}">'
$replaceVon = '<input type="time" name="availStart_${day.key}" value="${day.minTime}">'
Replace-Regex-Utf8 $appPath $regexVon $replaceVon

# 14. Label updates: "Spieldauer" to "Spieldauer (Std.)" and "Gage" to "Gage (€)" in musician fields
$regexMusDuration = '<label>Spieldauer<\/label>'
$replaceMusDuration = '<label>Spieldauer (Std.)</label>'
Replace-Regex-Utf8 $appPath $regexMusDuration $replaceMusDuration

$regexMusBudget = '<label>Gage<\/label>'
$replaceMusBudget = '<label>Gage (' + $euro + ')</label>'
Replace-Regex-Utf8 $appPath $regexMusBudget $replaceMusBudget

# 15. Label updates: "Spieldauer (Spielzeit)" to "Spieldauer (Std.)" and "Gage / Budget Spanne" to "Gage (€)" in organizer fields
$regexOrgDuration = '<label>Spieldauer \(Spielzeit\)</label>'
$replaceOrgDuration = '<label>Spieldauer (Std.)</label>'
Replace-Regex-Utf8 $appPath $regexOrgDuration $replaceOrgDuration

$regexOrgBudget = '(?s)<label>Gage\s*\/\s*Budget\s*Spanne<\/label>'
$replaceOrgBudget = '<label>Gage (' + $euro + ')</label>'
Replace-Regex-Utf8 $appPath $regexOrgBudget $replaceOrgBudget

# 16. Media Add buttons update: Change text "+ Foto hinzufügen" and "+ Video hinzufügen" to just "+" inside all 4 places

# Place 1: Musician Edit modal
$regexMediaMusEditPhoto = '(?s)<label style="font-weight: 700; font-size: 0\.85rem; display: inline-flex; align-items: center; gap: 0\.3rem;">.. Bilder \(max\. 3\) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var\(--text-muted\); font-size: 0\.75rem;" title="Erlaubte Formate: JPG, JPEG, PNG, GIF, WEBP&#10;Maximale Gr..e: 5 MB"><\/i><\/label>\s*<button type="button" id="btn-modal-add-photo" class="btn btn-sm btn-glass" style="margin:0; padding:0\.2rem 0\.6rem; font-size:0\.7rem; border-color: rgba\(34, 197, 94, 0\.3\); color:#22c55e;">\s*<i class="fa-solid fa-plus"><\/i> Foto hinzuf.gen\s*<\/button>'
$replaceMediaMusEditPhoto = '<label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">' + $camera + ' Bilder (max.3) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: JPG, JPEG, PNG, GIF, WEBP&#10;Maximale Gr' + $oe + 'sse: 5 MB"></i></label>' + "`n" + '                            <button type="button" id="btn-modal-add-photo" class="btn btn-sm btn-glass" style="margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(34, 197, 94, 0.3); color:#22c55e; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;" title="Foto hinzuf' + $ue + 'gen"><i class="fa-solid fa-plus"></i></button>'
Replace-Regex-Utf8 $appPath $regexMediaMusEditPhoto $replaceMediaMusEditPhoto

$regexMediaMusEditVideo = '(?s)<label style="font-weight: 700; font-size: 0\.85rem; display: inline-flex; align-items: center; gap: 0\.3rem;">.. Video \(max\. 1\) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var\(--text-muted\); font-size: 0\.75rem;" title="Erlaubte Formate: MP4, MOV, WebM, OGG, MKV&#10;Maximale Gr..e: 20 MB"><\/i><\/label>\s*<button type="button" id="btn-modal-add-video" class="btn btn-sm btn-glass" style="margin:0; padding:0\.2rem 0\.6rem; font-size:0\.7rem; border-color: rgba\(124, 58, 237, 0\.3\); color:#a855f7;">\s*<i class="fa-solid fa-plus"><\/i> Video hinzuf.gen\s*<\/button>'
$replaceMediaMusEditVideo = '<label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">' + $clapper + ' Video (max.1) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: MP4, MOV, WebM, OGG, MKV&#10;Maximale Gr' + $oe + 'sse: 20 MB"></i></label>' + "`n" + '                            <button type="button" id="btn-modal-add-video" class="btn btn-sm btn-glass" style="margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(124, 58, 237, 0.3); color:#a855f7; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;" title="Video hinzuf' + $ue + 'gen"><i class="fa-solid fa-plus"></i></button>'
Replace-Regex-Utf8 $appPath $regexMediaMusEditVideo $replaceMediaMusEditVideo

# Place 2: Event Edit modal
$regexMediaEventEditPhoto = '(?s)<label style="font-weight: 700; font-size: 0\.85rem; display: inline-flex; align-items: center; gap: 0\.3rem;">.. Bilder \(max\. 3\) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var\(--text-muted\); font-size: 0\.75rem;" title="Erlaubte Formate: JPG, JPEG, PNG, GIF, WEBP&#10;Maximale Gr..e: 5 MB"><\/i><\/label>\s*<button type="button" id="btn-event-modal-add-photo" class="btn btn-sm btn-glass" style="margin:0; padding:0\.2rem 0\.6rem; font-size:0\.7rem; border-color: rgba\(34, 197, 94, 0\.3\); color:#22c55e;">\s*<i class="fa-solid fa-plus"><\/i> Foto hinzuf.gen\s*<\/button>'
$replaceMediaEventEditPhoto = '<label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">' + $camera + ' Bilder (max.3) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: JPG, JPEG, PNG, GIF, WEBP&#10;Maximale Gr' + $oe + 'sse: 5 MB"></i></label>' + "`n" + '                            <button type="button" id="btn-event-modal-add-photo" class="btn btn-sm btn-glass" style="margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(34, 197, 94, 0.3); color:#22c55e; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;" title="Foto hinzuf' + $ue + 'gen"><i class="fa-solid fa-plus"></i></button>'
Replace-Regex-Utf8 $appPath $regexMediaEventEditPhoto $replaceMediaEventEditPhoto

$regexMediaEventEditVideo = '(?s)<label style="font-weight: 700; font-size: 0\.85rem; display: inline-flex; align-items: center; gap: 0\.3rem;">.. Video \(max\. 1\) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var\(--text-muted\); font-size: 0\.75rem;" title="Erlaubte Formate: MP4, MOV, WebM, OGG, MKV&#10;Maximale Gr..e: 20 MB"><\/i><\/label>\s*<button type="button" id="btn-event-modal-add-video" class="btn btn-sm btn-glass" style="margin:0; padding:0\.2rem 0\.6rem; font-size:0\.7rem; border-color: rgba\(124, 58, 237, 0\.3\); color:#a855f7;">\s*<i class="fa-solid fa-plus"><\/i> Video hinzuf.gen\s*<\/button>'
$replaceMediaEventEditVideo = '<label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">' + $clapper + ' Video (max.1) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: MP4, MOV, WebM, OGG, MKV&#10;Maximale Gr' + $oe + 'sse: 20 MB"></i></label>' + "`n" + '                            <button type="button" id="btn-event-modal-add-video" class="btn btn-sm btn-glass" style="margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(124, 58, 237, 0.3); color:#a855f7; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;" title="Video hinzuf' + $ue + 'gen"><i class="fa-solid fa-plus"></i></button>'
Replace-Regex-Utf8 $appPath $regexMediaEventEditVideo $replaceMediaEventEditVideo

# Place 3: Musician registration
$regexMediaMusRegPhoto = '(?s)<label style="font-weight: 700; font-size: 0\.85rem; display: inline-flex; align-items: center; gap: 0\.3rem;">.. Bilder \(max\. 3\) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var\(--text-muted\); font-size: 0\.75rem;" title="Erlaubte Formate: JPG, JPEG, PNG, GIF, WEBP&#10;Maximale Gr..e: 5 MB"><\/i><\/label>\s*<button type="button" onclick="window\.addRegMedia\(''musician'', ''photo''\)" class="btn btn-sm btn-glass" style="margin:0; padding:0\.2rem 0\.6rem; font-size:0\.7rem; border-color: rgba\(34, 197, 94, 0\.3\); color:#22c55e;">\s*<i class="fa-solid fa-plus"><\/i> Foto hinzuf.gen\s*<\/button>'
$replaceMediaMusRegPhoto = '<label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">' + $camera + ' Bilder (max.3) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: JPG, JPEG, PNG, GIF, WEBP&#10;Maximale Gr' + $oe + 'sse: 5 MB"></i></label>' + "`n" + '                                <button type="button" onclick="window.addRegMedia(''musician'', ''photo'')" class="btn btn-sm btn-glass" style="margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(34, 197, 94, 0.3); color:#22c55e; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;" title="Foto hinzuf' + $ue + 'gen"><i class="fa-solid fa-plus"></i></button>'
Replace-Regex-Utf8 $appPath $regexMediaMusRegPhoto $replaceMediaMusRegPhoto

$regexMediaMusRegVideo = '(?s)<label style="font-weight: 700; font-size: 0\.85rem; display: inline-flex; align-items: center; gap: 0\.3rem;">.. Video \(max\. 1\) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var\(--text-muted\); font-size: 0\.75rem;" title="Erlaubte Formate: MP4, MOV, WebM, OGG, MKV&#10;Maximale Gr..e: 20 MB"><\/i><\/label>\s*<button type="button" onclick="window\.addRegMedia\(''musician'', ''video''\)" class="btn btn-sm btn-glass" style="margin:0; padding:0\.2rem 0\.6rem; font-size:0\.7rem; border-color: rgba\(124, 58, 237, 0\.3\); color:#a855f7;">\s*<i class="fa-solid fa-plus"><\/i> Video hinzuf.gen\s*<\/button>'
$replaceMediaMusRegVideo = '<label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">' + $clapper + ' Video (max.1) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: MP4, MOV, WebM, OGG, MKV&#10;Maximale Gr' + $oe + 'sse: 20 MB"></i></label>' + "`n" + '                                <button type="button" onclick="window.addRegMedia(''musician'', ''video'')" class="btn btn-sm btn-glass" style="margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(124, 58, 237, 0.3); color:#a855f7; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;" title="Video hinzuf' + $ue + 'gen"><i class="fa-solid fa-plus"></i></button>'
Replace-Regex-Utf8 $appPath $regexMediaMusRegVideo $replaceMediaMusRegVideo

# Place 4: Organizer registration
$regexMediaOrgRegPhoto = '(?s)<label style="font-weight: 700; font-size: 0\.85rem; display: inline-flex; align-items: center; gap: 0\.3rem;">.. Bilder \(max\. 3\) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var\(--text-muted\); font-size: 0\.75rem;" title="Erlaubte Formate: JPG, JPEG, PNG, GIF, WEBP&#10;Maximale Gr..e: 5 MB"><\/i><\/label>\s*<button type="button" onclick="window\.addRegMedia\(''organizer'', ''photo''\)" class="btn btn-sm btn-glass" style="margin:0; padding:0\.2rem 0\.6rem; font-size:0\.7rem; border-color: rgba\(34, 197, 94, 0\.3\); color:#22c55e;">\s*<i class="fa-solid fa-plus"><\/i> Foto hinzuf.gen\s*<\/button>'
$replaceMediaOrgRegPhoto = '<label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">' + $camera + ' Bilder (max.3) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: JPG, JPEG, PNG, GIF, WEBP&#10;Maximale Gr' + $oe + 'sse: 5 MB"></i></label>' + "`n" + '                                <button type="button" onclick="window.addRegMedia(''organizer'', ''photo'')" class="btn btn-sm btn-glass" style="margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(34, 197, 94, 0.3); color:#22c55e; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;" title="Foto hinzuf' + $ue + 'gen"><i class="fa-solid fa-plus"></i></button>'
Replace-Regex-Utf8 $appPath $regexMediaOrgRegPhoto $replaceMediaOrgRegPhoto

$regexMediaOrgRegVideo = '(?s)<label style="font-weight: 700; font-size: 0\.85rem; display: inline-flex; align-items: center; gap: 0\.3rem;">.. Video \(max\. 1\) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var\(--text-muted\); font-size: 0\.75rem;" title="Erlaubte Formate: MP4, MOV, WebM, OGG, MKV&#10;Maximale Gr..e: 20 MB"><\/i><\/label>\s*<button type="button" onclick="window\.addRegMedia\(''organizer'', ''video''\)" class="btn btn-sm btn-glass" style="margin:0; padding:0\.2rem 0\.6rem; font-size:0\.7rem; border-color: rgba\(124, 58, 237, 0\.3\); color:#a855f7;">\s*<i class="fa-solid fa-plus"><\/i> Video hinzuf.gen\s*<\/button>'
$replaceMediaOrgRegVideo = '<label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">' + $clapper + ' Video (max.1) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: MP4, MOV, WebM, OGG, MKV&#10;Maximale Gr' + $oe + 'sse: 20 MB"></i></label>' + "`n" + '                                <button type="button" onclick="window.addRegMedia(''organizer'', ''video'')" class="btn btn-sm btn-glass" style="margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(124, 58, 237, 0.3); color:#a855f7; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;" title="Video hinzuf' + $ue + 'gen"><i class="fa-solid fa-plus"></i></button>'
Replace-Regex-Utf8 $appPath $regexMediaOrgRegVideo $replaceMediaOrgRegVideo


$cssPath = "C:\Users\vibul\OneDrive\Dokumente\GitHub\GetYourGig\style.css"

# 17. Revert active card background in style.css to prevent purple background highlight
$regexCssActive = '(?s)\.subscription-card\.active\s*\{.*?\}'
$replaceCssActive = @'
.subscription-card.active {
    border-color: #a855f7 !important;
    background: transparent !important;
    box-shadow: 0 0 25px rgba(168, 85, 247, 0.65) !important;
}
'@
Replace-Regex-Utf8 $cssPath $regexCssActive $replaceCssActive

# 18. Append helper styles to style.css if they don't exist yet
$cssContent = [System.IO.File]::ReadAllText($cssPath, [System.Text.Encoding]::UTF8)
$extraCss = @'

/* Helper styles for new subscription cards */
.subscription-gift-box {
    background: rgba(168, 85, 247, 0.04);
    border: 1px solid rgba(168, 85, 247, 0.12);
    border-radius: 8px;
    padding: 0.4rem 0.6rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.6rem;
    box-sizing: border-box;
    text-align: left;
}
.subscription-gift-box i {
    font-size: 1rem;
    color: #a855f7;
}
.subscription-gift-box .gift-title {
    font-size: 0.72rem;
    font-weight: 700;
    color: #a855f7;
}
.subscription-gift-box .gift-sub {
    font-size: 0.58rem;
    color: var(--text-muted);
}
.btn-sub-select {
    background: #6d28d9 !important;
    border-color: #6d28d9 !important;
    color: #ffffff !important;
    transition: all 0.2s ease;
}
.btn-sub-select:hover {
    background: #5b21b6 !important;
    border-color: #5b21b6 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(109, 40, 217, 0.3);
}
'@

if (-not $cssContent.Contains(".subscription-gift-box")) {
    $cssContent = $cssContent + $extraCss
    $utf8NoBom = [System.Text.UTF8Encoding]::new($false)
    [System.IO.File]::WriteAllText($cssPath, $cssContent, $utf8NoBom)
    Write-Host "Appended new classes to style.css"
}

# 19. Update mobile media query rule in style.css to display subscription cards vertically (1 column) on smartphones
$regexCssMedia = '(?s)@media\s*\(max-width:\s*600px\)\s*\{\s*\.subscription-cards\s*\{\s*grid-template-columns:\s*1fr\s*!important;\s*\}\s*\}'
$replaceCssMedia = @'
@media (max-width: 768px) {
    .subscription-cards {
        grid-template-columns: 1fr !important;
    }
}
'@
Replace-Regex-Utf8 $cssPath $regexCssMedia $replaceCssMedia
