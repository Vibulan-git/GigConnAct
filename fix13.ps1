[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$euro = [char]0x20AC
$ue = [char]0xFC
$ae = [char]0xE4
$sz = [char]0xDF
$oe = [char]0xF6
$camera = [char]0xD83D + [char]0xDCF7
$clapper = [char]0xD83C + [char]0xDFAC

function Replace-Regex-Ansi($path, $regexPattern, $replacement) {
    $encoding = [System.Text.Encoding]::GetEncoding(1252)
    $content = [System.IO.File]::ReadAllText($path, $encoding)
    
    $normalizedContent = $content -replace "`r`n", "`n"
    $normalizedPattern = $regexPattern -replace "`r`n", "`n"
    $normalizedReplacement = $replacement -replace "`r`n", "`n"
    
    if ($normalizedContent -match $normalizedPattern) {
        $normalizedContent = [regex]::Replace($normalizedContent, $normalizedPattern, $normalizedReplacement)
        $finalContent = $normalizedContent -replace "`n", "`r`n"
        [System.IO.File]::WriteAllText($path, $finalContent, $encoding)
        Write-Host "Replaced successfully in $path"
    } else {
        Write-Warning "Regex not matched in $path"
    }
}

$appPath = "C:\Users\vibul\OneDrive\Dokumente\GitHub\GetYourGig\app.js"

# 1. Remove availability description text
$regexDesc = '(?s)<label>Verf.gbarkeiten<\/label>\s*<p style="font-size:0\.7rem; color:var\(--text-muted\); margin-bottom: 0\.5rem; line-height: 1\.3;">.*?Montag - Donnerstag ist.*?<\/p>'
$replaceDesc = "<label>Verf$($ue)gbarkeiten</label>"
Replace-Regex-Ansi $appPath $regexDesc $replaceDesc

# 2. Place 1: Musician Edit modal Photo button
$regexMediaMusEditPhoto = '(?s)<label style="font-weight: 700; font-size: 0\.85rem; display: inline-flex; align-items: center; gap: 0\.3rem;">.. Bilder \(max\. 3\).*?<\/label>\s*<button type="button" id="btn-modal-add-photo" class="btn btn-sm btn-glass".*?>\s*<i class="fa-solid fa-plus"><\/i> Foto hinzuf.gen\s*<\/button>'
$replaceMediaMusEditPhoto = "<label style=`"font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;`">$($camera) Bilder (max.3) <i class=`"fa-solid fa-circle-info`" style=`"cursor: pointer; color: var(--text-muted); font-size: 0.75rem;`" title=`"Erlaubte Formate: JPG, JPEG, PNG, GIF, WEBP&#10;Maximale Gr$($oe)sse: 5 MB``></i></label>`n                            <button type=`"button`" id=`"btn-modal-add-photo`" class=`"btn btn-sm btn-glass`" style=`"margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(34, 197, 94, 0.3); color:#22c55e; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;`" title=`"Foto hinzuf$($ue)gen``><i class=`"fa-solid fa-plus``></i></button>"
Replace-Regex-Ansi $appPath $regexMediaMusEditPhoto $replaceMediaMusEditPhoto

# Place 1: Musician Edit modal Video button
$regexMediaMusEditVideo = '(?s)<label style="font-weight: 700; font-size: 0\.85rem; display: inline-flex; align-items: center; gap: 0\.3rem;">.. Video \(max\. 1\).*?<\/label>\s*<button type="button" id="btn-modal-add-video" class="btn btn-sm btn-glass".*?>\s*<i class="fa-solid fa-plus"><\/i> Video hinzuf.gen\s*<\/button>'
$replaceMediaMusEditVideo = "<label style=`"font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;`">$($clapper) Video (max.1) <i class=`"fa-solid fa-circle-info`" style=`"cursor: pointer; color: var(--text-muted); font-size: 0.75rem;`" title=`"Erlaubte Formate: MP4, MOV, WebM, OGG, MKV&#10;Maximale Gr$($oe)sse: 20 MB``></i></label>`n                            <button type=`"button`" id=`"btn-modal-add-video`" class=`"btn btn-sm btn-glass`" style=`"margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(124, 58, 237, 0.3); color:#a855f7; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;`" title=`"Video hinzuf$($ue)gen``><i class=`"fa-solid fa-plus``></i></button>"
Replace-Regex-Ansi $appPath $regexMediaMusEditVideo $replaceMediaMusEditVideo

# Place 2: Event Edit modal Photo button
$regexMediaEventEditPhoto = '(?s)<label style="font-weight: 700; font-size: 0\.85rem; display: inline-flex; align-items: center; gap: 0\.3rem;">.. Bilder \(max\. 3\).*?<\/label>\s*<button type="button" id="btn-event-modal-add-photo" class="btn btn-sm btn-glass".*?>\s*<i class="fa-solid fa-plus"><\/i> Foto hinzuf.gen\s*<\/button>'
$replaceMediaEventEditPhoto = "<label style=`"font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;`">$($camera) Bilder (max.3) <i class=`"fa-solid fa-circle-info`" style=`"cursor: pointer; color: var(--text-muted); font-size: 0.75rem;`" title=`"Erlaubte Formate: JPG, JPEG, PNG, GIF, WEBP&#10;Maximale Gr$($oe)sse: 5 MB``></i></label>`n                            <button type=`"button`" id=`"btn-event-modal-add-photo`" class=`"btn btn-sm btn-glass`" style=`"margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(34, 197, 94, 0.3); color:#22c55e; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;`" title=`"Foto hinzuf$($ue)gen``><i class=`"fa-solid fa-plus``></i></button>"
Replace-Regex-Ansi $appPath $regexMediaEventEditPhoto $replaceMediaEventEditPhoto

# Place 2: Event Edit modal Video button
$regexMediaEventEditVideo = '(?s)<label style="font-weight: 700; font-size: 0\.85rem; display: inline-flex; align-items: center; gap: 0\.3rem;">.. Video \(max\. 1\).*?<\/label>\s*<button type="button" id="btn-event-modal-add-video" class="btn btn-sm btn-glass".*?>\s*<i class="fa-solid fa-plus"><\/i> Video hinzuf.gen\s*<\/button>'
$replaceMediaEventEditVideo = "<label style=`"font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;`">$($clapper) Video (max.1) <i class=`"fa-solid fa-circle-info`" style=`"cursor: pointer; color: var(--text-muted); font-size: 0.75rem;`" title=`"Erlaubte Formate: MP4, MOV, WebM, OGG, MKV&#10;Maximale Gr$($oe)sse: 20 MB``></i></label>`n                            <button type=`"button`" id=`"btn-event-modal-add-video`" class=`"btn btn-sm btn-glass`" style=`"margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(124, 58, 237, 0.3); color:#a855f7; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;`" title=`"Video hinzuf$($ue)gen``><i class=`"fa-solid fa-plus``></i></button>"
Replace-Regex-Ansi $appPath $regexMediaEventEditVideo $replaceMediaEventEditVideo

# Place 3: Musician registration Photo button
$regexMediaMusRegPhoto = '(?s)<label style="font-weight: 700; font-size: 0\.85rem; display: inline-flex; align-items: center; gap: 0\.3rem;">.. Bilder \(max\. 3\).*?<\/label>\s*<button type="button" onclick="window\.addRegMedia\(''musician'', ''photo''\)" class="btn btn-sm btn-glass".*?>\s*<i class="fa-solid fa-plus"><\/i> Foto hinzuf.gen\s*<\/button>'
$replaceMediaMusRegPhoto = "<label style=`"font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;`">$($camera) Bilder (max.3) <i class=`"fa-solid fa-circle-info`" style=`"cursor: pointer; color: var(--text-muted); font-size: 0.75rem;`" title=`"Erlaubte Formate: JPG, JPEG, PNG, GIF, WEBP&#10;Maximale Gr$($oe)sse: 5 MB``></i></label>`n                                <button type=`"button`" onclick=`"window.addRegMedia('musician', 'photo')`" class=`"btn btn-sm btn-glass`" style=`"margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(34, 197, 94, 0.3); color:#22c55e; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;`" title=`"Foto hinzuf$($ue)gen``><i class=`"fa-solid fa-plus``></i></button>"
Replace-Regex-Ansi $appPath $regexMediaMusRegPhoto $replaceMediaMusRegPhoto

# Place 3: Musician registration Video button
$regexMediaMusRegVideo = '(?s)<label style="font-weight: 700; font-size: 0\.85rem; display: inline-flex; align-items: center; gap: 0\.3rem;">.. Video \(max\. 1\).*?<\/label>\s*<button type="button" onclick="window\.addRegMedia\(''musician'', ''video''\)" class="btn btn-sm btn-glass".*?>\s*<i class="fa-solid fa-plus"><\/i> Video hinzuf.gen\s*<\/button>'
$replaceMediaMusRegVideo = "<label style=`"font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;`">$($clapper) Video (max.1) <i class=`"fa-solid fa-circle-info`" style=`"cursor: pointer; color: var(--text-muted); font-size: 0.75rem;`" title=`"Erlaubte Formate: MP4, MOV, WebM, OGG, MKV&#10;Maximale Gr$($oe)sse: 20 MB``></i></label>`n                                <button type=`"button`" onclick=`"window.addRegMedia('musician', 'video')`" class=`"btn btn-sm btn-glass`" style=`"margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(124, 58, 237, 0.3); color:#a855f7; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;`" title=`"Video hinzuf$($ue)gen``><i class=`"fa-solid fa-plus``></i></button>"
Replace-Regex-Ansi $appPath $regexMediaMusRegVideo $replaceMediaMusRegVideo

# Place 4: Organizer registration Photo button
$regexMediaOrgRegPhoto = '(?s)<label style="font-weight: 700; font-size: 0\.85rem; display: inline-flex; align-items: center; gap: 0\.3rem;">.. Bilder \(max\. 3\).*?<\/label>\s*<button type="button" onclick="window\.addRegMedia\(''organizer'', ''photo''\)" class="btn btn-sm btn-glass".*?>\s*<i class="fa-solid fa-plus"><\/i> Foto hinzuf.gen\s*<\/button>'
$replaceMediaOrgRegPhoto = "<label style=`"font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;`">$($camera) Bilder (max.3) <i class=`"fa-solid fa-circle-info`" style=`"cursor: pointer; color: var(--text-muted); font-size: 0.75rem;`" title=`"Erlaubte Formate: JPG, JPEG, PNG, GIF, WEBP&#10;Maximale Gr$($oe)sse: 5 MB``></i></label>`n                                <button type=`"button`" onclick=`"window.addRegMedia('organizer', 'photo')`" class=`"btn btn-sm btn-glass`" style=`"margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(34, 197, 94, 0.3); color:#22c55e; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;`" title=`"Foto hinzuf$($ue)gen``><i class=`"fa-solid fa-plus``></i></button>"
Replace-Regex-Ansi $appPath $regexMediaOrgRegPhoto $replaceMediaOrgRegPhoto

# Place 4: Organizer registration Video button
$regexMediaOrgRegVideo = '(?s)<label style="font-weight: 700; font-size: 0\.85rem; display: inline-flex; align-items: center; gap: 0\.3rem;">.. Video \(max\. 1\).*?<\/label>\s*<button type="button" onclick="window\.addRegMedia\(''organizer'', ''video''\)" class="btn btn-sm btn-glass".*?>\s*<i class="fa-solid fa-plus"><\/i> Video hinzuf.gen\s*<\/button>'
$replaceMediaOrgRegVideo = "<label style=`"font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;`">$($clapper) Video (max.1) <i class=`"fa-solid fa-circle-info`" style=`"cursor: pointer; color: var(--text-muted); font-size: 0.75rem;`" title=`"Erlaubte Formate: MP4, MOV, WebM, OGG, MKV&#10;Maximale Gr$($oe)sse: 20 MB``></i></label>`n                                <button type=`"button`" onclick=`"window.addRegMedia('organizer', 'video')`" class=`"btn btn-sm btn-glass`" style=`"margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(124, 58, 237, 0.3); color:#a855f7; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;`" title=`"Video hinzuf$($ue)gen``><i class=`"fa-solid fa-plus``></i></button>"
Replace-Regex-Ansi $appPath $regexMediaOrgRegVideo $replaceMediaOrgRegVideo
