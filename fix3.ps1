$appPath = "C:\Users\vibul\OneDrive\Dokumente\GitHub\GetYourGig\app.js"
$appContent = [System.IO.File]::ReadAllText($appPath, [System.Text.Encoding]::UTF8)

# 1. "Aktive Musiker-Profile" soll lila sein.
$target1 = '<h3 style="margin:0;"><i class="fa-solid fa-guitar text-purple"></i> Aktive Musiker-Profile (${activeMusicians.length})</h3>'
$replace1 = '<h3 style="margin:0; color:var(--color-purple);"><i class="fa-solid fa-guitar"></i> Aktive Musiker-Profile (${activeMusicians.length})</h3>'

# 2. "Änderungen speichern" bei den persönlichen Kontakten soll mittiger in der Kachel sein.
$target2 = @'
                    <div style="display: flex; justify-content: flex-end;">
                        <button type="submit" class="btn btn-primary" style="margin:0; background: ${themeBtnBg}; border-color: ${themeBtnBorder};">
                            <i class="fa-solid fa-floppy-disk"></i> Änderungen speichern
                        </button>
                    </div>
'@
$replace2 = @'
                    <div style="display: flex; justify-content: center;">
                        <button type="submit" class="btn btn-primary" style="margin:0; background: ${themeBtnBg}; border-color: ${themeBtnBorder};">
                            <i class="fa-solid fa-floppy-disk"></i> Änderungen speichern
                        </button>
                    </div>
'@

# 3 & 4. Das Wort "geblurrt" kann weg bei der Telefonnummer. Das Ankreuzfeld vergrößern. (Profile Page)
$target3 = @'
                            <div style="display: flex; align-items: center; gap: 0.4rem; margin-top: 0.4rem;">
                                <input type="checkbox" id="prof-hidephone" ${u.hidePhone ? 'checked' : ''} style="cursor: pointer; width: auto; margin: 0;">
                                <label for="prof-hidephone" style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted); cursor: pointer; margin: 0;">Telefonnummer verbergen (geblurrt)</label>
                            </div>
'@
$replace3 = @'
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.4rem;">
                                <input type="checkbox" id="prof-hidephone" ${u.hidePhone ? 'checked' : ''} style="cursor: pointer; width: auto; margin: 0; scale: 1.3; transform-origin: left center; margin-right: 0.15rem;">
                                <label for="prof-hidephone" style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted); cursor: pointer; margin: 0;">Telefonnummer verbergen</label>
                            </div>
'@

# 3 & 4. Das Wort "geblurrt" kann weg bei der Telefonnummer. Das Ankreuzfeld vergrößern. (Registration Page)
$target4 = @'
                            <div style="display: flex; align-items: center; gap: 0.4rem; margin-top: 0.4rem;">
                                <input type="checkbox" name="hidePhone" id="input-reg-hidephone" style="width: auto; margin: 0; cursor: pointer;">
                                <label for="input-reg-hidephone" style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted); cursor: pointer; margin: 0;">Telefonnummer verbergen (geblurrt)</label>
                            </div>
'@
$replace4 = @'
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.4rem;">
                                <input type="checkbox" name="hidePhone" id="input-reg-hidephone" style="width: auto; margin: 0; cursor: pointer; scale: 1.3; transform-origin: left center; margin-right: 0.15rem;">
                                <label for="input-reg-hidephone" style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted); cursor: pointer; margin: 0;">Telefonnummer verbergen</label>
                            </div>
'@

# 6. Die Kachel "Kontoverwaltung" kann weg.
$target6 = @'
            <div class="profile-section-card" style="border: 1px solid rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.01);">
                <h3 style="margin-top: 0; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.5rem; color: var(--color-red); border-bottom: 1px solid rgba(239, 68, 68, 0.15); padding-bottom: 0.6rem;">
                    <i class="fa-solid fa-triangle-exclamation"></i> Kontoverwaltung
                </h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.2rem;">Möchtest du dich von deinem aktuellen Gerät abmelden?</p>
                <div style="display: flex; justify-content: flex-start;">
                    <button class="btn btn-glass" id="btn-profile-logout" style="margin:0; color: #ffffff; border-color: rgba(239, 68, 68, 0.6); background: var(--color-red);">
                        <i class="fa-solid fa-right-from-bracket"></i> Ausloggen & Abmelden
                    </button>
                </div>
            </div>
'@
$replace6 = ''

# Helper to normalize line endings and perform replacement
function Replace-Block($content, $target, $replacement) {
    $normalizedContent = $content -replace "`r`n", "`n"
    $normalizedTarget = $target -replace "`r`n", "`n"
    $normalizedReplacement = $replacement -replace "`r`n", "`n"
    
    if ($normalizedContent.Contains($normalizedTarget)) {
        $targetCRLF = $target -replace "`r`n", "`n" -replace "`n", "`r`n"
        $targetLF = $target -replace "`r`n", "`n"
        
        $replacementCRLF = $replacement -replace "`r`n", "`n" -replace "`n", "`r`n"
        $replacementLF = $replacement -replace "`r`n", "`n"
        
        if ($content.Contains($targetCRLF)) {
            return $content.Replace($targetCRLF, $replacementCRLF)
        } elseif ($content.Contains($targetLF)) {
            return $content.Replace($targetLF, $replacementLF)
        } else {
            return $normalizedContent.Replace($normalizedTarget, $normalizedReplacement)
        }
    } else {
        Write-Warning "Target not found: $($target.Substring(0, [Math]::Min(50, $target.Length)))"
        return $content
    }
}

$appContent = Replace-Block $appContent $target1 $replace1
$appContent = Replace-Block $appContent $target2 $replace2
$appContent = Replace-Block $appContent $target3 $replace3
$appContent = Replace-Block $appContent $target4 $replace4
$appContent = Replace-Block $appContent $target6 $replace6

[System.IO.File]::WriteAllText($appPath, $appContent, [System.Text.Encoding]::UTF8)
Write-Host "Successfully updated app.js"


# 5. Die 3 Icons oben in der Leiste sollen so groß sein wie die vom Filter.
$cssPath = "C:\Users\vibul\OneDrive\Dokumente\GitHub\GetYourGig\style.css"
$cssContent = [System.IO.File]::ReadAllText($cssPath, [System.Text.Encoding]::UTF8)

# Select-String showed us .nav-icon-btn default size is around line 4582:
$targetCss1 = @'
.nav-icon-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-size: 1.15rem;
    cursor: pointer;
}
'@
$replaceCss1 = @'
.nav-icon-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 0.95rem;
    cursor: pointer;
}
'@

# .profile-avatar-btn default size is around line 1851:
$targetCss2 = @'
.profile-avatar-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid var(--border-glass);
    transition: all var(--transition-fast);
    font-size: 1.3rem;
}
'@
$replaceCss2 = @'
.profile-avatar-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid var(--border-glass);
    transition: all var(--transition-fast);
    font-size: 0.95rem;
}
'@

$cssContent = Replace-Block $cssContent $targetCss1 $replaceCss1
$cssContent = Replace-Block $cssContent $targetCss2 $replaceCss2

[System.IO.File]::WriteAllText($cssPath, $cssContent, [System.Text.Encoding]::UTF8)
Write-Host "Successfully updated style.css"
