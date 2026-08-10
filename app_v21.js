// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCuGm5JDhKwFILPrgxz3iQftTBUFGpb8qo",
    authDomain: "gigconnact.firebaseapp.com",
    projectId: "gigconnact",
    storageBucket: "gigconnact.firebasestorage.app",
    messagingSenderId: "539302141767",
    appId: "1:539302141767:web:435e2716fc1936dc327662",
    measurementId: "G-7M91GD63PQ"
};

// Initialize Firebase (Compat)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

window.gcaPromoCodes = [
    "GCA-VNT-BUA", "GCA-2G0-0GI", "GCA-YIW-MV8", "GCA-PJB-CT4", "GCA-85P-YBH", "GCA-1Y7-KS9", "GCA-MYJ-VJH", "GCA-I9W-M9M", "GCA-5KD-S2B", "GCA-1SK-IVL",
    "GCA-QTX-2XD", "GCA-EQ5-WF8", "GCA-020-IQJ", "GCA-S04-VJR", "GCA-SXT-7LE", "GCA-QNJ-FHE", "GCA-3L6-UA2", "GCA-854-9ZL", "GCA-UUW-J7Q", "GCA-9YN-F7K",
    "GCA-XYW-2EJ", "GCA-UOX-U0Q", "GCA-I47-K96", "GCA-8Q4-UMZ", "GCA-UYL-QAM", "GCA-O91-AAL", "GCA-HBC-M4F", "GCA-OFA-OK4", "GCA-RZI-1CZ", "GCA-9C5-TCX",
    "GCA-G09-7SD", "GCA-2XA-PMV", "GCA-4H1-PK1", "GCA-CTU-HQE", "GCA-90T-3VQ", "GCA-GOL-H44", "GCA-0E9-X24", "GCA-07D-Q37", "GCA-KDX-O6M", "GCA-T1M-EEO",
    "GCA-E9U-J1W", "GCA-X3V-I69", "GCA-5KI-U4E", "GCA-585-O13", "GCA-0PU-YQ6", "GCA-2NG-TZD", "GCA-7VY-8PU", "GCA-69V-KC0", "GCA-3PF-QMW", "GCA-EAB-LX0",
    "GCA-YL8-ZZU", "GCA-NQ7-UYN", "GCA-DXB-SAR", "GCA-ILL-QSX", "GCA-0RT-ZED", "GCA-TIJ-7JO", "GCA-5WO-49W", "GCA-OHI-EOQ", "GCA-E0D-DNM", "GCA-BYM-8C9",
    "GCA-QO6-KGK", "GCA-BZD-UIH", "GCA-IQR-ISN", "GCA-3SJ-9RS", "GCA-CUE-PXL", "GCA-SX1-1Y3", "GCA-KTM-9CN", "GCA-Z3K-7RB", "GCA-DW5-L20", "GCA-M15-4OX",
    "GCA-K06-B0K", "GCA-SJD-9IK", "GCA-71V-YKS", "GCA-GD1-050", "GCA-ZVN-CVG", "GCA-R1D-9TZ", "GCA-IK8-UWM", "GCA-S3X-DMT", "GCA-UPS-HDW", "GCA-PP6-CI9",
    "GCA-7JC-4US", "GCA-LVO-0RB", "GCA-RCM-17C", "GCA-3D4-9YC", "GCA-BQQ-487", "GCA-GB6-MH3", "GCA-SVA-2N3", "GCA-PR2-0Y8", "GCA-B0E-Y3Y", "GCA-I1C-UEL",
    "GCA-AXF-BAA", "GCA-3P8-1V1", "GCA-EF5-EFR", "GCA-N9R-A9S", "GCA-05P-T02", "GCA-OE6-OA8", "GCA-WT2-WOC", "GCA-FGG-O2F", "GCA-AYO-VX6", "GCA-A7D-YTY"
];

var state = null;

const mockPhotoUrls = [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1484755560693-a4074577af3a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80'
];

const mockVideoSources = [
    { title: 'Live Performance Highlights', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { title: 'Auftritt Showreel & Trailer', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
    { title: 'Unplugged Live Session', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' }
];

window.registrationMedia = {
    musician: {
        photos: ['https://picsum.photos/id/453/400/300'],
        videos: [{ title: 'Live Performance Highlights', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }],
        audios: [{ title: 'Live Medley Demo', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }]
    },
    organizer: {
        photos: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'],
        videos: [{ title: 'Live Performance Highlights', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }],
        audios: []
    }
};

window.updateRegMediaPreview = function(role) {
    const photosContainer = document.getElementById(`reg-${role}-photos-preview`);
    const videosContainer = document.getElementById(`reg-${role}-videos-preview`);
    const audiosContainer = document.getElementById(`reg-${role}-audios-preview`);

    const photos = window.registrationMedia[role].photos;
    const videos = window.registrationMedia[role].videos;
    const audios = window.registrationMedia[role].audios || [];

    if (photosContainer) {
        photosContainer.innerHTML = photos.length === 0 
            ? `<span style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">Keine Bilder hinzugefügt</span>`
            : photos.map((p, idx) => {
                if (p === 'loading') {
                    return `
                        <div style="position: relative; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center;">
                            <i class="fa-solid fa-circle-notch fa-spin" style="color: #a855f7; font-size: 1.2rem;"></i>
                        </div>
                    `;
                }
                return `
                    <div style="position: relative; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                        <img src="${p}" style="width:100%; height:100%; object-fit:cover;">
                        <button type="button" onclick="window.deleteRegMedia('${role}', 'photo', ${idx})" style="position: absolute; top: 1px; right: 1px; background: rgba(239, 68, 68, 0.85); border: none; color: #fff; width: 15px; height: 15px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.5rem;"><i class="fa-solid fa-times"></i></button>
                    </div>
                `;
            }).join('');
    }

    if (videosContainer) {
        videosContainer.innerHTML = videos.length === 0
            ? `<span style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">Keine Videos hinzugefügt</span>`
            : videos.map((v, idx) => {
                if (v.url === 'loading') {
                    return `
                        <div style="position: relative; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center;" title="${v.title}">
                            <i class="fa-solid fa-circle-notch fa-spin" style="color: #a855f7; font-size: 1.2rem;"></i>
                        </div>
                    `;
                }
                return `
                    <div style="position: relative; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: #000; display:flex; align-items:center; justify-content:center;" title="${v.title}">
                        <i class="fa-solid fa-file-video" style="color: #a855f7; font-size: 1.1rem;"></i>
                        <button type="button" onclick="window.deleteRegMedia('${role}', 'video', ${idx})" style="position: absolute; top: 1px; right: 1px; background: rgba(239, 68, 68, 0.85); border: none; color: #fff; width: 15px; height: 15px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.5rem;"><i class="fa-solid fa-times"></i></button>
                    </div>
                `;
            }).join('');
    }

    if (audiosContainer) {
        audiosContainer.innerHTML = audios.length === 0
            ? `<span style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">Keine Audios hinzugefügt</span>`
            : audios.map((a, idx) => {
                if (a.url === 'loading') {
                    return `
                        <div style="position: relative; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center;" title="${a.title}">
                            <i class="fa-solid fa-circle-notch fa-spin" style="color: #06b6d4; font-size: 1.2rem;"></i>
                        </div>
                    `;
                }
                return `
                    <div style="position: relative; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: #1e1b4b; display:flex; align-items:center; justify-content:center;" title="${a.title || 'Audio'}">
                        <i class="fa-solid fa-music" style="color: #06b6d4; font-size: 1.1rem;"></i>
                        <button type="button" onclick="window.deleteRegMedia('${role}', 'audio', ${idx})" style="position: absolute; top: 1px; right: 1px; background: rgba(239, 68, 68, 0.85); border: none; color: #fff; width: 15px; height: 15px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.5rem;"><i class="fa-solid fa-times"></i></button>
                    </div>
                `;
            }).join('');
    }
};

function validateAndProcessAudio(file, callback, errorCallback) {
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/m4a', 'audio/x-m4a', 'audio/mp4'];
    const maxSize = 100 * 1024 * 1024; // 100 MB

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a)$/i)) {
        showToast({
            title: "Fehler beim Audioupload ❌",
            message: "Ungültiges Dateiformat. Erlaubt sind MP3, WAV und M4A."
        });
        if (errorCallback) errorCallback();
        return;
    }

    if (file.size > maxSize) {
        showToast({
            title: "Fehler beim Audioupload ❌",
            message: "Die Datei ist zu groß. Maximale Größe ist 100 MB (deine Datei: " + (file.size / (1024 * 1024)).toFixed(2) + " MB)."
        });
        if (errorCallback) errorCallback();
        return;
    }

    const audioElement = document.createElement('audio');
    audioElement.src = URL.createObjectURL(file);
    audioElement.onloadedmetadata = async function() {
        URL.revokeObjectURL(audioElement.src);
        const duration = audioElement.duration;
        if (duration > 600) { // 10 minutes
            showToast({
                title: "Audio zu lang 🎵",
                message: "Die Audio-Datei darf maximal 10 Minuten lang sein (deine Datei: " + Math.floor(duration / 60) + " Min. " + Math.round(duration % 60) + " Sek.)."
            });
            if (errorCallback) errorCallback();
            return;
        }

        const titleWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        
        showToast({
            title: "Audio wird verarbeitet...",
            message: "Bitte warten..."
        });

        let url = null;
        let uploadErrorDetail = null;
        if (typeof firebase !== 'undefined' && firebase.storage) {
            try {
                const userId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : 'anonymous';
                const storageRef = firebase.storage().ref();
                const fileRef = storageRef.child(`audios/${userId}/${Date.now()}_${file.name}`);
                const snapshot = await fileRef.put(file);
                url = await snapshot.ref.getDownloadURL();
            } catch (storageError) {
                console.warn("Firebase Storage failed, falling back to data/blob URL:", storageError);
                uploadErrorDetail = storageError.message || storageError;
            }
        }

        if (!url) {
            // Fallback: If under 1.5MB, convert to data URL (so it stores permanently in firestore)
            if (file.size < 1.5 * 1024 * 1024) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    showToast({
                        title: "Audio geladen ✅",
                        message: "Lokale Kopie der Audio-Datei wurde geladen."
                    });
                    callback({ title: titleWithoutExt, url: e.target.result });
                };
                reader.readAsDataURL(file);
                return;
            } else {
                // If it is larger, use Blob URL (will play in current session, but won't persist)
                url = URL.createObjectURL(file);
                showToast({
                    title: "Audio geladen ⚠️",
                    message: "Firebase Storage fehlgeschlagen. Nur in dieser Sitzung abspielbar: " + (uploadErrorDetail || "Kein aktiver Storage-Dienst.")
                });
            }
        } else {
            showToast({
                title: "Audio hochgeladen ✅",
                message: "Die Audio-Datei wurde erfolgreich gespeichert."
            });
        }

        callback({ title: titleWithoutExt, url: url });
    };
    audioElement.onerror = function() {
        showToast({
            title: "Fehler beim Audioupload ❌",
            message: "Die Audio-Datei konnte nicht geladen oder analysiert werden."
        });
    };
}

window.addRegMedia = function(role, type) {
    const listKey = type === 'photo' ? 'photos' : type === 'video' ? 'videos' : 'audios';
    const list = window.registrationMedia[role][listKey];
    const limit = type === 'photo' 
        ? 5 
        : type === 'video' 
            ? 3 
            : 3;
    if (list.length >= limit) {
        showToast({
            title: type === 'photo' ? "Fotos-Limit erreicht 📷" : type === 'video' ? "Video-Limit erreicht 🎬" : "Audio-Limit erreicht 🎵",
            message: type === 'photo' 
                ? `Es sind maximal ${limit} Fotos erlaubt.` 
                : type === 'video' 
                    ? `Es sind maximal ${limit} Videos erlaubt.` 
                    : `Es sind maximal ${limit} Audio-Dateien erlaubt.`
        });
        return;
    }
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    
    if (type === 'photo') {
        fileInput.accept = 'image/png, image/jpeg, image/webp';
        fileInput.addEventListener('change', () => {
            const files = Array.from(fileInput.files);
            if (files.length === 0) return;
            const remaining = limit - list.length;
            if (remaining <= 0) return;
            const toProcess = files.slice(0, remaining);
            if (files.length > remaining) {
                showToast({
                    title: "Limit-Hinweis ⚠️",
                    message: `Es wurden nur die ersten ${remaining} Fotos ausgewählt, um das Limit nicht zu überschreiten.`
                });
            }
            toProcess.forEach(file => {
                const placeholderIdx = list.length;
                list.push('loading');
                window.updateRegMediaPreview(role);
                validateAndProcessPhoto(file, (dataUrl) => {
                    list[placeholderIdx] = dataUrl;
                    window.updateRegMediaPreview(role);
                }, () => {
                    const idx = list.indexOf('loading');
                    if (idx !== -1) list.splice(idx, 1);
                    window.updateRegMediaPreview(role);
                });
            });
        });
    } else if (type === 'video') {
        fileInput.accept = 'video/mp4, video/quicktime, video/webm';
        fileInput.addEventListener('change', () => {
            const files = Array.from(fileInput.files);
            if (files.length === 0) return;
            const remaining = limit - list.length;
            if (remaining <= 0) return;
            const toProcess = files.slice(0, remaining);
            if (files.length > remaining) {
                showToast({
                    title: "Limit-Hinweis ⚠️",
                    message: `Es wurden nur die ersten ${remaining} Videos ausgewählt, um das Limit nicht zu überschreiten.`
                });
            }
            toProcess.forEach(file => {
                const placeholderIdx = list.length;
                list.push({ url: 'loading', title: file.name });
                window.updateRegMediaPreview(role);
                validateAndProcessVideo(file, (videoUrl) => {
                    list[placeholderIdx] = { url: videoUrl, title: file.name };
                    window.updateRegMediaPreview(role);
                }, () => {
                    const idx = list.findIndex(v => v.url === 'loading');
                    if (idx !== -1) list.splice(idx, 1);
                    window.updateRegMediaPreview(role);
                });
            });
        });
    } else {
        fileInput.accept = 'audio/mpeg, audio/mp3, audio/wav, audio/x-wav, audio/m4a, audio/x-m4a, audio/mp4';
        fileInput.addEventListener('change', () => {
            const files = Array.from(fileInput.files);
            if (files.length === 0) return;
            const remaining = limit - list.length;
            if (remaining <= 0) return;
            const toProcess = files.slice(0, remaining);
            if (files.length > remaining) {
                showToast({
                    title: "Limit-Hinweis ⚠️",
                    message: `Es wurden nur die ersten ${remaining} Audios ausgewählt, um das Limit nicht zu überschreiten.`
                });
            }
            toProcess.forEach(file => {
                const placeholderIdx = list.length;
                list.push({ url: 'loading', title: file.name });
                window.updateRegMediaPreview(role);
                validateAndProcessAudio(file, (audioObj) => {
                    list[placeholderIdx] = audioObj;
                    window.updateRegMediaPreview(role);
                }, () => {
                    const idx = list.findIndex(a => a.url === 'loading');
                    if (idx !== -1) list.splice(idx, 1);
                    window.updateRegMediaPreview(role);
                });
            });
        });
    }
    fileInput.style.display = 'none';
    fileInput.click();
};

window.deleteRegMedia = function(role, type, idx) {
    const listKey = type === 'photo' ? 'photos' : type === 'video' ? 'videos' : 'audios';
    const list = window.registrationMedia[role][listKey];
    list.splice(idx, 1);
    window.updateRegMediaPreview(role);
};
window.toggleSelectAll = function(gridId, linkEl) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const checkboxes = grid.querySelectorAll('input[type="checkbox"]');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    const allSelected = checkedCount === checkboxes.length;
    checkboxes.forEach(cb => {
        cb.checked = !allSelected;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
    });
    linkEl.textContent = allSelected ? 'Alle auswählen' : 'Alle abwählen';
};

window.slideComboGallery = function(itemId, direction) {
    const s = document.getElementById('combo-slider-' + itemId);
    if (!s) return;
    const slidesCount = s.children.length;
    if (slidesCount <= 0) return;
    let cur = parseInt(s.getAttribute('data-idx') || '0');
    cur = (cur + direction + slidesCount) % slidesCount;
    s.style.transform = 'translateX(-' + (cur * 100) + '%)';
    s.setAttribute('data-idx', cur);
    const counter = s.parentElement.querySelector('.tile-gallery-counter');
    if (counter) {
        const activeSlide = s.children[cur];
        const isPhoto = activeSlide.querySelector('img');
        const isVideo = activeSlide.querySelector('video');
        const isAudio = activeSlide.querySelector('audio');
        if (isPhoto) {
            let photoIdx = 1;
            for (let i = 0; i < cur; i++) {
                if (s.children[i].querySelector('img')) photoIdx++;
            }
            let totalPhotos = 0;
            for (let i = 0; i < slidesCount; i++) {
                if (s.children[i].querySelector('img')) totalPhotos++;
            }
            counter.innerText = '📷 ' + photoIdx + ' / ' + totalPhotos;
        } else if (isVideo) {
            let videoIdx = 1;
            for (let i = 0; i < cur; i++) {
                if (s.children[i].querySelector('video')) videoIdx++;
            }
            let totalVideos = 0;
            for (let i = 0; i < slidesCount; i++) {
                if (s.children[i].querySelector('video')) totalVideos++;
            }
            counter.innerText = '🎬 Video ' + videoIdx + ' / ' + totalVideos;
        } else if (isAudio) {
            let audioIdx = 1;
            for (let i = 0; i < cur; i++) {
                if (s.children[i].querySelector('audio')) audioIdx++;
            }
            let totalAudios = 0;
            for (let i = 0; i < slidesCount; i++) {
                if (s.children[i].querySelector('audio')) totalAudios++;
            }
            counter.innerText = '🎵 Audio ' + audioIdx + ' / ' + totalAudios;
        } else {
            counter.innerHTML = '📝 Info';
        }
    }

    // Update pagination dots if they exist
    const dotsContainer = document.getElementById('combo-dots-' + itemId);
    if (dotsContainer) {
        const dots = dotsContainer.children;
        const themeColor = dotsContainer.getAttribute('data-theme') || '#7c3aed';
        for (let i = 0; i < dots.length; i++) {
            if (i === cur) {
                dots[i].classList.add('active');
                dots[i].style.background = themeColor;
                dots[i].style.opacity = '1';
                dots[i].style.transform = 'scale(1.2)';
            } else {
                dots[i].classList.remove('active');
                dots[i].style.background = 'var(--text-muted)';
                dots[i].style.opacity = '0.4';
                dots[i].style.transform = 'scale(1)';
            }
        }
    }
};

/* -------------------------------------------------------------
 * GigConnAct - Single Unified Application Script
 * Combines mockData, state management, matching logic, and UI
 * rendering in a single non-module file to bypass CORS restrictions
 * when running directly from the local file system (file:/// protocol).
 * ------------------------------------------------------------- */

// ==========================================
// GLOBALLY ACCESSIBLE MEDIA ACTIONS (VIDEO, AUDIO)
// ==========================================

window.playVideoModal = function(url) {
    if (window.showToast) {
        showToast({
            title: "Video wird geladen",
            message: "Das Video-Demo startet jetzt im Player..."
        });
    }

    const modal = document.createElement('div');
    modal.className = 'custom-video-modal-overlay';
    modal.style = "position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:9999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(8px);";
    modal.onclick = () => modal.remove();
    
    const container = document.createElement('div');
    container.style = "width:90%; max-width:800px; background:var(--bg-card); border:1px solid var(--border-glass); border-radius:12px; padding:1rem; position:relative; box-shadow:var(--shadow-premium);";
    container.onclick = (e) => e.stopPropagation();
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeBtn.style = "position:absolute; top:-15px; right:-15px; background:var(--color-purple); color:#fff; border:none; border-radius:50%; width:32px; height:32px; cursor:pointer; font-size:1.1rem; box-shadow:0 4px 8px rgba(0,0,0,0.3); z-index:10000; display:flex; align-items:center; justify-content:center;";
    closeBtn.onclick = () => modal.remove();
    
    container.appendChild(closeBtn);
    
    const frameContainer = document.createElement('div');
    frameContainer.style = "position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:8px;";
    
    const iframe = document.createElement('iframe');
    iframe.style = "position:absolute; top:0; left:0; width:100%; height:100%; border:none;";
    iframe.src = "https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1";
    iframe.allow = "autoplay; encrypted-media";
    iframe.allowFullscreen = true;
    
    frameContainer.appendChild(iframe);
    container.appendChild(frameContainer);
    modal.appendChild(container);
    document.body.appendChild(modal);
};

window.toggleAudioTrack = function(item, audioUrl) {
    const audio = item.querySelector('.hidden-audio-player');
    const icon = item.querySelector('.play-icon');
    
    document.querySelectorAll('.hidden-audio-player').forEach(player => {
        if (player !== audio) {
            player.pause();
            const parent = player.closest('.audio-gallery-item');
            if (parent) {
                const pIcon = parent.querySelector('.play-icon');
                if (pIcon) {
                    pIcon.className = 'fa-solid fa-play play-icon text-purple';
                }
            }
        }
    });
    
    if (audio.paused) {
        audio.play();
        icon.className = 'fa-solid fa-pause play-icon text-green';
    } else {
        audio.pause();
        icon.className = 'fa-solid fa-play play-icon text-purple';
    }
};

window.unlockListing = function(targetId, targetName) {
    if (!state.currentUser) {
        showModal('auth');
        return;
    }
    if (state.currentUser.role !== 'musician') return;
    
    if (state.currentUser.isPremium) return; // already premium
    
    if (state.currentUser.credits > 0) {
        // Show a custom confirmation dialog
        const modal = document.createElement('div');
        modal.className = 'custom-video-modal-overlay';
        modal.style = "position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:9999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(6px);";
        
        modal.innerHTML = `
            <div style="width:90%; max-width:400px; background:var(--bg-card); border:1px solid var(--border-glass); border-radius:12px; padding:1.5rem; position:relative; box-shadow:var(--shadow-premium); text-align:center;">
                <i class="fa-solid fa-coins" style="font-size:3rem; color:#FFD700; margin-bottom:1rem;"></i>
                <h4 style="font-family:var(--font-heading); font-size:1.2rem; margin-bottom:0.5rem; color:var(--text-main);">Kontaktdaten freischalten?</h4>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.5rem;">
                    Möchtest du die Kontaktdaten für <strong>${targetName}</strong> freischalten? Dies kostet dich 1 Credit.<br><br>
                    <span style="font-weight:700; color:var(--text-main);">Deine verbleibenden Credits: ${state.currentUser.credits}</span>
                </p>
                <div style="display:flex; gap:1rem; justify-content:center;">
                    <button class="btn btn-sm btn-glass" id="btn-cancel-unlock" style="margin:0;">Abbrechen</button>
                    <button class="btn btn-sm btn-primary" id="btn-confirm-unlock" style="margin:0; background:var(--color-green); border-color:var(--color-green); color:#000; font-weight:700;">1 Credit ausgeben</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('#btn-cancel-unlock').addEventListener('click', () => modal.remove());
        modal.querySelector('#btn-confirm-unlock').addEventListener('click', async () => {
            const res = await state.unlockContact(targetId);
            modal.remove();
            if (res.success) {
                showToast({
                    title: "Kontaktdaten freigeschaltet! 🪙",
                    message: `Du hast die Kontaktdaten von ${targetName} erfolgreich freigeschaltet.`
                });
                updateNavbar();
                const currentHash = window.location.hash;
                if ((currentHash.includes('events') || currentHash.includes('musicians')) && typeof window.marketApplyFilters === 'function') {
                    window.marketApplyFilters();
                } else if (currentHash.includes('matches') && typeof window.matchesUpdate === 'function') {
                    window.matchesUpdate();
                } else {
                    window.handleRouting();
                }
            }
        });
    } else {
        // Track pending unlock ID and open Premium Modal
        state.pendingUnlockListingId = targetId;
        showModal('premium');
    }
};

window.normalizeCityName = function(city) {
    if (!city) return '';
    let normalized = city.trim();
    
    const addZip = (loc) => {
        if (!loc) return '';
        if (/\(\d{5}\)/.test(loc)) return loc;
        const cleanLoc = loc.toLowerCase();
        const match = popularGermanCities.find(c => {
            const cityName = c.split(' (')[0].toLowerCase();
            return cityName === cleanLoc;
        });
        return match || loc;
    };

    if (normalized.toLowerCase() === 'köln') return addZip('Köln');
    if (normalized.toLowerCase() === 'münchen') return addZip('München');
    if (normalized.toLowerCase() === 'nürnberg') return addZip('Nürnberg');
    if (normalized.toLowerCase() === 'düsseldorf') return addZip('Düsseldorf');
    
    const parts = normalized.split(', ').map(word => {
        const lw = word.toLowerCase();
        if (lw === 'köln') return 'Köln';
        if (lw === 'münchen') return 'München';
        if (lw === 'nürnberg') return 'Nürnberg';
        if (lw === 'düsseldorf') return 'Düsseldorf';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    
    return addZip(parts.join(', '));
};

// ==========================================
// 1. MOCK DATA & CONSTANTS
// ==========================================

const initialMusicians = [
    {
        id: "mus_1",
        name: "The Neon Beats",
        bluffName: "Heisse Elektro-Pop Coverband",
        type: "Band",
        location: "Hamburg",
        radius: 150, // in km
        genres: ["Pop", "Electro", "Rock"],
        instruments: ["Gesang", "Synthesizer", "E-Gitarre", "Schlagzeug"],
        minDuration: 2,
        maxDuration: 4, // in hours
        minBudget: 1200,
        maxBudget: 2500, // EUR
        eventTypes: ["Bar/Kneipe/Club", "Festival", "Firmenfeier", "Hochzeit – Party"],
        availability: ["Friday", "Saturday"],
        description: "Wir bringen jeden Dancefloor zum Glühen! Mit unserem einzigartigen Elektro-Pop Sound und Covers der 80er, 90er und heutigen Hits im modernen Gewand. Eigene PA- und Lichttechnik ist immer inklusive.",
        contactName: "Maximilian Schmidt",
        phone: "+49 176 12345678",
        hidePhone: true,
        email: "contact@neonbeats.de",
        isPremium: false,
        credits: 50,
        socialLinks: {
            spotify: "https://spotify.com/artist/neonbeats",
            youtube: "https://youtube.com/c/neonbeats",
            instagram: "https://instagram.com/neonbeats"
        },
        photos: ["https://picsum.photos/id/453/400/300", "https://picsum.photos/id/280/400/300"],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        audio: [],
        technik: ["Technik vorhanden"],
        applications: [
            { eventId: "evt_1", status: "booked" },
            { eventId: "evt_2", status: "contacted" },
            { eventId: "evt_3", status: "contacted" }
        ]
    },
    {
        id: "mus_2",
        name: "Clara Lichtblick",
        bluffName: "Klassische & Pop-Pianistin",
        type: "Solo",
        location: "München",
        radius: 80,
        genres: ["Klassik", "Pop", "Jazz"],
        instruments: ["Klavier", "Keyboard"],
        minDuration: 1,
        maxDuration: 3,
        minBudget: 450,
        maxBudget: 800,
        eventTypes: ["Hochzeit - Trauung", "Firmenfeier", "Geburtstag"],
        availability: ["Saturday", "Sunday"],
        description: "Elegante Hintergrundmusik am Klavier für Ihre Trauung, den Sektempfang oder ein festliches Dinner. Ich spiele sowohl klassische Meisterwerke als auch moderne Pop-Balladen im sanften Klavier-Arrangement. Keyboard bringe ich bei Bedarf mit.",
        contactName: "Clara Weber",
        phone: "+49 152 98765432",
        hidePhone: true,
        email: "clara.piano@gmx.de",
        isPremium: false,
        socialLinks: {
            spotify: "",
            youtube: "https://youtube.com/c/clarapiano",
            instagram: "https://instagram.com/clara_lichtblick"
        },
        photos: ["https://picsum.photos/id/1082/400/300"],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        audio: [],
        technik: ["Technik nicht vorhanden"]
    },
    {
        id: "mus_3",
        name: "DJ Soundwave",
        bluffName: "Professional Club & Event DJ",
        type: "DJ",
        location: "Köln",
        radius: 200,
        genres: ["Electro", "HipHop", "Charts", "Pop"],
        instruments: ["Turntables", "Mischpult"],
        minDuration: 4,
        maxDuration: 8,
        minBudget: 850,
        maxBudget: 1500,
        eventTypes: ["Bar/Kneipe/Club", "Firmenfeier", "Hochzeit – Party", "Geburtstag"],
        availability: ["Friday", "Saturday", "Sunday"],
        description: "Seit 10 Jahren als DJ auf Hochzeiten, Firmenfeiern und in Clubs unterwegs. Professionelle High-End Licht- und Tontechnik für Events bis 300 Personen bringe ich komplett selbst mit.",
        contactName: "Andreas Richter",
        phone: "+49 171 55566677",
        hidePhone: true,
        email: "dj.soundwave@web.de",
        isPremium: true,
        socialLinks: {
            spotify: "https://spotify.com/artist/djsoundwave",
            youtube: "",
            instagram: "https://instagram.com/dj_soundwave"
        },
        photos: ["https://picsum.photos/id/342/400/300"],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        audio: [],
        technik: ["Technik vorhanden"]
    },
    {
        id: "mus_4",
        name: "Acoustic Duo Breeze",
        bluffName: "Charmantes Akustik-Duo",
        type: "Duo",
        location: "Frankfurt",
        radius: 120,
        genres: ["Pop", "Jazz", "Folk"],
        instruments: ["Akustikgitarre", "Gesang", "Cajon"],
        minDuration: 2,
        maxDuration: 3.5,
        minBudget: 700,
        maxBudget: 1200,
        eventTypes: ["Hochzeit - Trauung", "Firmenfeier", "Geburtstag", "Festival"],
        availability: ["Saturday", "Sunday", "Thursday"],
        description: "Zweistimmiger Gesang, feine Akustikgitarren-Klänge und sanfte Rhythmen. Wir bieten den perfekten Soundtrack für chillige Sommerevents, Gartenpartys oder romantische Trauungen. Kompakte Akustikanlage ist vorhanden.",
        contactName: "Sarah & Ben",
        phone: "+49 160 88877799",
        hidePhone: true,
        email: "acoustic.breeze@outlook.de",
        isPremium: true,
        socialLinks: {
            spotify: "",
            youtube: "https://youtube.com/c/acousticbreeze",
            instagram: "https://instagram.com/acoustic_breeze"
        },
        photos: ["https://picsum.photos/id/325/400/300"],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        audio: [],
        technik: ["Technik vorhanden"]
    },
    {
        id: "mus_5",
        name: "Blackwood Syndicate",
        bluffName: "Klassische Rock & Hard Rock Coverband",
        type: "Band",
        location: "Berlin",
        radius: 150,
        genres: ["Rock", "Metal", "Blues"],
        instruments: ["Gesang", "E-Gitarre", "Bass", "Schlagzeug"],
        minDuration: 3,
        maxDuration: 5,
        minBudget: 1800,
        maxBudget: 3000,
        eventTypes: ["Bar/Kneipe/Club", "Festival", "Firmenfeier"],
        availability: ["Friday", "Saturday"],
        description: "Echte Rock-Klassiker und harte Riffs von AC/DC bis Led Zeppelin. Wir spielen 100% live, energetisch und laut. Ton- und Lichtanlage (PA) müssen vom Veranstalter gestellt werden.",
        contactName: "Thorsten Müller",
        phone: "+49 170 44433322",
        hidePhone: true,
        email: "info@blackwood-rock.de",
        isPremium: true,
        socialLinks: {
            spotify: "https://spotify.com/artist/blackwood",
            youtube: "https://youtube.com/c/blackwood",
            instagram: "https://instagram.com/blackwood_rock"
        },
        photos: ["https://picsum.photos/id/109/400/300"],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        audio: [],
        technik: ["Technik nicht vorhanden"]
    },
    {
        id: "mus_6",
        name: "Sax & Soul (Leo Berg)",
        bluffName: "Premium Jazz-Saxophonist",
        type: "Solo",
        location: "Stuttgart",
        radius: 100,
        genres: ["Jazz", "Blues", "Pop"],
        instruments: ["Saxophon", "Gesang"],
        minDuration: 1.5,
        maxDuration: 3,
        minBudget: 350,
        maxBudget: 600,
        eventTypes: ["Sommerfest", "Firmenfeier", "Hochzeit – Party", "Jubiläum"],
        availability: ["Saturday", "Sunday", "Wednesday"],
        description: "Sinnliche Saxophonklänge und samtige Vocals. Begleitung beim Sektempfang, Dinnermusik oder als Live-Highlight zu Lounge-Beats. Professionelle, platzsparende Beschallungsanlage vorhanden.",
        contactName: "Leo Berg",
        phone: "+49 157 77788899",
        email: "leo.sax@gmx.net",
        isPremium: false,
        socialLinks: {
            spotify: "",
            youtube: "",
            instagram: "https://instagram.com/leo_sax_soul"
        },
        photos: ["https://picsum.photos/id/357/400/300"],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        audio: [],
        technik: ["Technik vorhanden"]
    },
    {
        id: "mus_zero",
        name: "Leo Null",
        bluffName: "Gitarrist & SÄnger (0 Credits Demo)",
        type: "Solo",
        location: "Bremen",
        radius: 100,
        genres: ["Pop", "Rock"],
        instruments: ["Gitarre", "Gesang"],
        minDuration: 3,
        maxDuration: 3,
        minBudget: 250,
        maxBudget: 250,
        eventTypes: ["Geburtstag", "Hochzeit – Party"],
        availability: ["Saturday", "Sunday"],
        description: "Demo-Musiker-Account mit 0 Credits zum Testen des Bezahlfensters.",
        contactName: "Leo Null",
        phone: "+49 170 00000000",
        email: "zero@musician.de",
        isPremium: false,
        credits: 0,
        socialLinks: { spotify: "", youtube: "", instagram: "" },
        photos: ["https://picsum.photos/id/111/400/300"],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        audio: [],
        technik: ["Technik vorhanden"]
    },
    {
        id: "mus_five",
        name: "Fynn Fünf",
        bluffName: "Singer-Songwriter (5 Credits Demo)",
        type: "Solo",
        location: "Dortmund",
        radius: 100,
        genres: ["Folk", "Pop"],
        instruments: ["Akustikgitarre", "Gesang"],
        minDuration: 2,
        maxDuration: 4,
        minBudget: 500,
        maxBudget: 800,
        eventTypes: ["Firmenfeier", "Geburtstag"],
        availability: ["Friday", "Saturday"],
        description: "Demo-Musiker-Account mit 5 Credits zum Testen der Einzelfreischaltung.",
        contactName: "Fynn Fünf",
        phone: "+49 175 55555555",
        email: "five@musician.de",
        isPremium: false,
        credits: 5,
        socialLinks: { spotify: "", youtube: "", instagram: "" },
        photos: ["https://picsum.photos/id/280/400/300"],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        audio: [],
        technik: ["Technik nicht vorhanden"]
    },
    {
        id: "mus_7",
        name: "The Munich Jazz Syndicate",
        bluffName: "Klassisches Jazz- & Swing-Quintett",
        type: "Band",
        location: "München",
        radius: 150,
        genres: ["Jazz", "Blues", "Soul"],
        instruments: ["Saxophon", "Klavier", "Kontrabass", "Schlagzeug", "Gesang"],
        minDuration: 2,
        maxDuration: 5,
        minBudget: 1500,
        maxBudget: 2800,
        eventTypes: ["Firmenfeier", "Jubiläum", "Hochzeit – Party", "Festival"],
        availability: ["Friday", "Saturday", "Sunday"],
        description: "Bringen Sie das goldene Zeitalter des Jazz auf Ihr Event. Von sanfter Lounge-Hintergrundmusik zum Sektempfang bis hin zu treibenden Swing-Rhythmen, die Ihre Gäste auf die Tanzfläche locken. Professioneller Sound garantiert.",
        contactName: "Marcus Huber",
        phone: "+49 172 11223344",
        hidePhone: true,
        email: "info@munich-jazz-syndicate.de",
        isPremium: true,
        credits: 40,
        socialLinks: { spotify: "https://spotify.com", youtube: "https://youtube.com", instagram: "https://instagram.com" },
        photos: [
            "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=400&q=80"
        ],
        videos: [
            { title: "Live at Munich Jazz Club", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
        ],
        audio: [
            { title: "Fly Me To The Moon (Demo)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
            { title: "Take Five (Instrumental)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }
        ],
        technik: ["Technik vorhanden"]
    },
    {
        id: "mus_8",
        name: "Lara & the Strings",
        bluffName: "Modernes Akustik-Trio mit Cello",
        type: "Trio",
        location: "Berlin",
        radius: 120,
        genres: ["Pop", "Acoustic", "Charts"],
        instruments: ["Gesang", "Akustikgitarre", "Violoncello"],
        minDuration: 1.5,
        maxDuration: 4,
        minBudget: 950,
        maxBudget: 1800,
        eventTypes: ["Hochzeit - Trauung", "Firmenfeier", "Geburtstag", "Gartenparty"],
        availability: ["Friday", "Saturday", "Sunday"],
        description: "Durch die seltene Kombination aus kraftvollem Gesang, Akustikgitarre und warmen Celloklängen verleihen wir bekannten Pophits und Klassikern eine ganz persönliche Note. Ideal für Hochzeiten und gehobene Events.",
        contactName: "Lara Meier",
        phone: "+49 176 99887766",
        hidePhone: true,
        email: "lara.strings@gmx.de",
        isPremium: true,
        credits: 30,
        socialLinks: { spotify: "", youtube: "", instagram: "https://instagram.com" },
        photos: [
            "https://images.unsplash.com/photo-1525417071002-5ee4e6bb44f7?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1487180142328-054b783fc471?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
        ],
        videos: [
            { title: "Wedding Showreel 2025", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" }
        ],
        audio: [
            { title: "Perfect - Acoustic Cover", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
            { title: "Chasing Cars - Cello Version", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }
        ],
        technik: ["Technik vorhanden"]
    },
    {
        id: "mus_9",
        name: "Electric Violin Show",
        bluffName: "Atemberaubende E-Violinen Performance",
        type: "Solo",
        location: "Frankfurt",
        radius: 150,
        genres: ["Electro", "Classic", "House"],
        instruments: ["E-Violine", "Synthesizer"],
        minDuration: 1,
        maxDuration: 2.5,
        minBudget: 700,
        maxBudget: 1400,
        eventTypes: ["Firmenfeier", "Festival", "Club-Show", "Produktpräsentation"],
        availability: ["Thursday", "Friday", "Saturday"],
        description: "Hochenergetische Fusion aus klassischer Geige und modernen elektronischen Beats. Die perfekte Show als packendes Opening, Highlight-Act zwischen Gängen oder pulsierender Live-Act neben dem DJ.",
        contactName: "Elena Vlasova",
        phone: "+49 151 44556677",
        hidePhone: true,
        email: "violin.electric@web.de",
        isPremium: false,
        credits: 25,
        socialLinks: { spotify: "https://spotify.com", youtube: "https://youtube.com", instagram: "https://instagram.com" },
        photos: [
            "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80"
        ],
        videos: [
            { title: "Club Performance Live", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" }
        ],
        audio: [
            { title: "Cyber Classical (Original Mix)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" }
        ],
        technik: ["Technik vorhanden"]
    },
    {
        id: "mus_10",
        name: "DJane Melody (Vanessa)",
        bluffName: "Premium DJane für Hochzeiten & Firmenevents",
        type: "DJ",
        location: "Hamburg",
        radius: 200,
        genres: ["Charts", "House", "Retro", "HipHop"],
        instruments: ["Turntables", "Mischpult"],
        minDuration: 4,
        maxDuration: 10,
        minBudget: 800,
        maxBudget: 1600,
        eventTypes: ["Hochzeit – Party", "Firmenfeier", "Geburtstag", "Club-Gig"],
        availability: ["Friday", "Saturday", "Sunday"],
        description: "Bester Club-Sound & feine Partyklassiker nahtlos gemixt. Mit feinem Gespür für die Tanzfläche und exzellenter Sound- und Lichtanlage verwandle ich Ihr Event in eine ausgelassene Party. Musikwünsche sind willkommen!",
        contactName: "Vanessa König",
        phone: "+49 173 55566677",
        hidePhone: true,
        email: "vanessa.melody@gmail.com",
        isPremium: true,
        credits: 50,
        socialLinks: { spotify: "", youtube: "", instagram: "https://instagram.com" },
        photos: [
            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80"
        ],
        videos: [
            { title: "Promo Mix Video 2025", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
        ],
        audio: [
            { title: "Deep House Warmup Set", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
            { title: "90s vs 2000s Party Mix", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" }
        ],
        technik: ["Technik vorhanden"]
    },
    {
        id: "mus_11",
        name: "The Rock N Rollers",
        bluffName: "Hochenergetische 50s & 60s Rock'n'Roll Band",
        type: "Band",
        location: "Stuttgart",
        radius: 150,
        genres: ["Rock", "Retro", "Blues"],
        instruments: ["Gesang", "E-Gitarre", "Kontrabass", "Schlagzeug", "Klavier"],
        minDuration: 2,
        maxDuration: 4.5,
        minBudget: 1600,
        maxBudget: 3200,
        eventTypes: ["Firmenfeier", "Stadtfest", "Hochzeit – Party", "Geburtstag"],
        availability: ["Friday", "Saturday"],
        description: "Wir bringen den rohen, ehrlichen Groove der Ära von Elvis Presley, Chuck Berry und den Beatles auf Ihre Bühne. 100% tanzbar, handgemacht und mit authentischen Outfits. Eigene Ton- und Lichttechnik vorhanden.",
        contactName: "Dieter Schulz",
        phone: "+49 170 33344455",
        hidePhone: true,
        email: "booking@rocknrollers.de",
        isPremium: false,
        credits: 35,
        socialLinks: { spotify: "https://spotify.com", youtube: "https://youtube.com", instagram: "https://instagram.com" },
        photos: [
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1487180142328-054b783fc471?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80"
        ],
        videos: [
            { title: "Live at Rockabilly Night", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" }
        ],
        audio: [
            { title: "Johnny B. Goode (Cover)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
            { title: "Jailhouse Rock (Cover)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" }
        ],
        technik: ["Technik vorhanden"]
    },
    {
        id: "mus_12",
        name: "Marc & Sophie Duo",
        bluffName: "Gefühlvolles Akustik- & Gesangsduo",
        type: "Duo",
        location: "Köln",
        radius: 100,
        genres: ["Pop", "Charts", "Soul"],
        instruments: ["Gesang", "Klavier", "Gitarre"],
        minDuration: 1.5,
        maxDuration: 4,
        minBudget: 750,
        maxBudget: 1350,
        eventTypes: ["Hochzeit - Trauung", "Sektempfang", "Geburtstag", "Firmenfeier"],
        availability: ["Saturday", "Sunday", "Friday"],
        description: "Gänsehautmomente bei Ihrer Trauung oder elegante Unplugged-Hintergrundmusik für Ihr Firmenevent. Mit zweistimmigem Gesang und feiner instrumentaler Untermalung schaffen wir eine einzigartige Atmosphäre.",
        contactName: "Sophie Wagner",
        phone: "+49 162 44455566",
        hidePhone: true,
        email: "marc.sophie@gmx.net",
        isPremium: true,
        credits: 45,
        socialLinks: { spotify: "", youtube: "https://youtube.com", instagram: "https://instagram.com" },
        photos: [
            "https://images.unsplash.com/photo-1525417071002-5ee4e6bb44f7?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=400&q=80"
        ],
        videos: [
            { title: "Wedding Trauung Live", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" }
        ],
        audio: [
            { title: "You Are The Reason (Live)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
            { title: "Hallelujah (Trauungs-Version)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }
        ],
        technik: ["Technik vorhanden"]
    },
    {
        id: "mus_13",
        name: "Brass Power Band",
        bluffName: "Energetische Brass-, Funk- & Soul-Combo",
        type: "Band",
        location: "Hannover",
        radius: 130,
        genres: ["Funk", "Soul", "Pop"],
        instruments: ["Trompete", "Posaune", "Saxophon", "Schlagzeug", "Bass"],
        minDuration: 1.5,
        maxDuration: 3,
        minBudget: 1700,
        maxBudget: 3000,
        eventTypes: ["Stadtfest", "Festival", "Firmenfeier", "Hochzeit – Party"],
        availability: ["Friday", "Saturday", "Sunday"],
        description: "Fette Bläsersätze und ein unaufhaltsamer Groove! Wir interpretieren Funk-Klassiker sowie moderne Chart-Hits in mitreißenden Brass-Arrangements neu. Hoher Spaßfaktor und Tanzgarantie!",
        contactName: "Christian Keller",
        phone: "+49 179 88899900",
        hidePhone: true,
        email: "brass.power@outlook.com",
        isPremium: false,
        credits: 30,
        socialLinks: { spotify: "", youtube: "", instagram: "https://instagram.com" },
        photos: [
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80"
        ],
        videos: [
            { title: "Live at Summer Brass Festival", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
        ],
        audio: [
            { title: "Uptown Funk (Brass Cover)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
            { title: "Septembers Horns (Instrumental)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
        ],
        technik: ["Technik nicht vorhanden"]
    },
    {
        id: "mus_14",
        name: "Elena Petrov - Harfenklänge",
        bluffName: "Virtuose Solo-Harfenistin",
        type: "Solo",
        location: "Dresden",
        radius: 90,
        genres: ["Klassik", "Folk", "Charts"],
        instruments: ["Harfe"],
        minDuration: 1,
        maxDuration: 3,
        minBudget: 480,
        maxBudget: 900,
        eventTypes: ["Hochzeit - Trauung", "Sektempfang", "Vernissage", "Hintergrundmusik"],
        availability: ["Saturday", "Sunday"],
        description: "Zauberhafte, elegante Klänge für ganz besondere Anlässe. Neben klassischen Meilensteinen spiele ich auch romantische Filmmusik (z.B. Amélie, Disney) und moderne Liebeslieder im verträumten Harfen-Stil.",
        contactName: "Elena Petrov",
        phone: "+49 157 55544433",
        hidePhone: true,
        email: "elena.harp@gmx.de",
        isPremium: false,
        credits: 20,
        socialLinks: { spotify: "", youtube: "https://youtube.com", instagram: "" },
        photos: [
            "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=400&q=80"
        ],
        videos: [
            { title: "Harfe Live Performance", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" }
        ],
        audio: [
            { title: "Canon in D (Harp Cover)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
            { title: "River Flows In You (Harp Version)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" }
        ],
        technik: ["Technik nicht vorhanden"]
    },
    {
        id: "mus_15",
        name: "The Blues Project",
        bluffName: "Grooviges Blues- & Soul-Trio",
        type: "Trio",
        location: "Hamburg",
        radius: 110,
        genres: ["Blues", "Rock", "Folk"],
        instruments: ["E-Gitarre", "Bass", "Schlagzeug", "Mundharmonika"],
        minDuration: 2,
        maxDuration: 4.5,
        minBudget: 1000,
        maxBudget: 1900,
        eventTypes: ["Bar/Kneipe/Club", "Firmenfeier", "Geburtstag", "Sommerfest"],
        availability: ["Friday", "Saturday", "Thursday"],
        description: "Handgemachter, rauer Blues mit einer Extraportion Soul. Von tiefen Delta-Blues-Klängen bis hin zu treibendem Chicago-Blues zum Tanzen. Eigene kleine PA-Anlage ist für Events bis 100 Personen vorhanden.",
        contactName: "Thomas Korb",
        phone: "+49 171 77766655",
        hidePhone: true,
        email: "booking@bluesproject.de",
        isPremium: true,
        credits: 35,
        socialLinks: { spotify: "https://spotify.com", youtube: "", instagram: "https://instagram.com" },
        photos: [
            "https://images.unsplash.com/photo-1487180142328-054b783fc471?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80"
        ],
        videos: [
            { title: "Live at Hamburg Blues Night", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" }
        ],
        audio: [
            { title: "Sweet Home Chicago (Cover)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" }
        ],
        technik: ["Technik vorhanden"]
    },
    {
        id: "mus_16",
        name: "Folk & Beyond",
        bluffName: "Kreatives Indie-Folk & Americana Duo",
        type: "Duo",
        location: "Berlin",
        radius: 140,
        genres: ["Folk", "Pop", "Country"],
        instruments: ["Banjo", "Akustikgitarre", "Gesang", "Mandoline"],
        minDuration: 1.5,
        maxDuration: 4,
        minBudget: 780,
        maxBudget: 1300,
        eventTypes: ["Hochzeit - Trauung", "Gartenparty", "Firmenfeier", "Festival"],
        availability: ["Saturday", "Sunday", "Friday"],
        description: "Mehrstimmiger Gesang kombiniert mit Banjo, Gitarre und Mandoline. Wir entführen Ihre Gäste in die weiten Welten des Folk-Pops und bringen mitreißende Rythmen auf Ihre Garten- oder Hochzeitsfeier.",
        contactName: "Claas & Lisa",
        phone: "+49 160 55566688",
        hidePhone: true,
        email: "folk.beyond@outlook.de",
        isPremium: false,
        credits: 25,
        socialLinks: { spotify: "", youtube: "https://youtube.com", instagram: "https://instagram.com" },
        photos: [
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1487180142328-054b783fc471?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1525417071002-5ee4e6bb44f7?auto=format&fit=crop&w=400&q=80"
        ],
        videos: [
            { title: "Unplugged Forest Session", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
        ],
        audio: [
            { title: "Ho Hey (Folk Cover)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
            { title: "Wagon Wheel (Cover)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" }
        ],
        technik: ["Technik vorhanden"]
    }
];

const initialEvents = [
    {
        id: "evt_1",
        name: "Traumhochzeit am See",
        type: "Hochzeit - Trauung",
        organizerType: "Privater Veranstalter",
        company: "Privatperson",
        date: "2026-08-15",
        eventStartTime: "14:00",
        eventEndTime: "17:00",
        location: "Köln",
        genres: ["Pop", "Klassik"],
        instruments: ["Klavier", "Gesang"],
        minDuration: 1.5,
        maxDuration: 3,
        duration: 2,
        minBudget: 800,
        maxBudget: 1200,
        budget: 950,
        musicianTypes: ["Solo", "Duo"],
        description: "Für unsere kirchliche Trauung und den anschließenden Sektempfang direkt am See suchen wir eine gefühlvolle musikalische Untermalung (Klavier & Gesang). Gewünscht sind ca. 3 Lieder während der Zeremonie und 1.5 Stunden Hintergrundmusik beim Empfang.",
        contactName: "Julia & Michael",
        phone: "+49 173 11122233",
        hidePhone: true,
        email: "julia.michael.wedding2026@gmail.com",
        isOnline: true,
        creatorId: "org_1",
        technik: ["Technik vorhanden"],
        photos: ["https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"]
    },
    {
        id: "evt_2",
        name: "Sommerfestival Stadtstrand",
        type: "Festival",
        organizerType: "Festivalveranstalter",
        company: "Eventagentur SommerSonne",
        date: "2026-09-05",
        eventStartTime: "17:00",
        eventEndTime: "23:00",
        location: "München",
        genres: ["Electro", "Pop"],
        instruments: ["Synthesizer", "Turntables", "Gesang"],
        minDuration: 4,
        maxDuration: 6,
        duration: 4,
        minBudget: 2000,
        maxBudget: 3000,
        budget: 2500,
        musicianTypes: ["Band", "DJ"],
        description: "Großes Sommer-Event am Stadtstrand! Wir suchen eine energiegeladene Live-Band oder einen DJ, der für fette Beats und Sommerstimmung sorgt. PA-Anlage und Bühne sind vorhanden. Verpflegung wird gestellt.",
        contactName: "Eventagentur SommerSonne",
        phone: "+49 89 9876540",
        hidePhone: true,
        email: "info@sommersonne-events.de",
        isOnline: true,
        creatorId: "org_2",
        technik: ["Technik vorhanden"],
        photos: ["https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"]
    },
    {
        id: "evt_3",
        name: "Firmenjubiläum TechCorp",
        type: "Firmenfeier",
        organizerType: "Firma",
        company: "TechCorp GmbH",
        date: "2026-10-20",
        eventStartTime: "19:00",
        eventEndTime: "22:00",
        location: "Düsseldorf",
        genres: ["Jazz", "Pop", "Rock"],
        instruments: ["Schlagzeug", "E-Gitarre", "Bass", "Saxophon"],
        minDuration: 3,
        maxDuration: 5,
        duration: 3,
        minBudget: 1200,
        maxBudget: 1800,
        budget: 1500,
        musicianTypes: ["Band", "Duo"],
        description: "Wir feiern unser 10-jähriges Bestehen und suchen eine Band für den Abend. Zuerst gediegener Jazz zum Dinner, danach Pop/Rock-Klassiker zum Tanzen. Licht/Ton muss mitgebracht werden.",
        contactName: "Sandra Meier (TechCorp HR)",
        phone: "+49 911 445566",
        hidePhone: true,
        email: "s.meier@techcorp.de",
        isOnline: true,
        creatorId: "org_3",
        technik: ["Technik nicht vorhanden"],
        photos: ["https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"]
    },
    {
        id: "evt_4",
        name: "Electronic Beach Party",
        type: "Bar/Kneipe/Club",
        organizerType: "Event-Agentur",
        company: "Club Seeufer Frankfurt",
        date: "2026-09-12",
        eventStartTime: "20:00",
        eventEndTime: "01:00",
        location: "Frankfurt",
        genres: ["Electro"],
        instruments: ["Turntables", "Mischpult"],
        minDuration: 3.5,
        maxDuration: 5,
        duration: 4,
        minBudget: 600,
        maxBudget: 900,
        budget: 800,
        musicianTypes: ["DJ"],
        description: "Wir veranstalten unser alljährliches Open Air am See und suchen einen professionellen Club-DJ für fette EDM, House & Techno-Beats. Sound- & Lichtanlage sind komplett vorhanden.",
        contactName: "Club Seeufer Frankfurt",
        phone: "+49 69 555666",
        hidePhone: true,
        email: "booking@seeufer-frankfurt.de",
        isOnline: true,
        creatorId: "org_4",
        technik: ["Technik vorhanden"],
        photos: ["https://images.unsplash.com/photo-1484755560693-a4074577af3a?auto=format&fit=crop&w=800&q=80"],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"]
    },
    {
        id: "evt_5",
        name: "50. Geburtstag im Gewölbekeller",
        type: "Geburtstag",
        organizerType: "Privater Veranstalter",
        company: "Privatperson",
        date: "2026-09-26",
        eventStartTime: "18:00",
        eventEndTime: "23:00",
        location: "Stuttgart",
        genres: ["Rock", "Pop", "Schlager"],
        instruments: ["E-Gitarre", "Gesang", "Keyboard"],
        minDuration: 4,
        maxDuration: 6,
        duration: 5,
        minBudget: 400,
        maxBudget: 600,
        budget: 600,
        musicianTypes: ["Duo", "Solo", "Band"],
        description: "Zu meinem 50. Geburtstag suche ich ein Akustik-Duo oder einen Solo-Musiker, der alte Rock- und Popklassiker spielt und für gute Laune im Kellergewölbe sorgt. Platz ist begrenzt, Strom vorhanden.",
        contactName: "Thomas Wagner",
        phone: "+49 172 77766655",
        hidePhone: true,
        email: "thomas.wagner50@web.de",
        isOnline: true,
        creatorId: "org_5",
        technik: ["Technik nicht vorhanden"],
        photos: ["https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80"],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"]
    }
];

const genresList = ["Pop", "Rock", "Electro", "Jazz", "Klassik", "Folk", "HipHop", "Metal", "Schlager", "Country", "Blues"];
const instrumentsList = ["Gesang", "Klavier", "Keyboard", "Synthesizer", "Turntables", "Akustikgitarre", "E-Gitarre", "Bass", "Schlagzeug", "Cajon", "Saxophon", "Violine", "Flöte"];
const eventTypesList = ['Geburtstag', 'Hochzeit – Trauung', 'Hochzeit - Sektempfang', 'Hochzeit – Party', 'Polterabend', 'Firmenfeier', 'Sommerfest', 'Öffentliches Event', 'Stadtfest', 'Kirmes', 'Karnevalsparty', 'Oktoberfest', 'Schützenfest', 'Vereinsfest', 'Sportveranstaltung', 'Jubiläum', 'Festival', 'Konzert', 'Bar/Kneipe/Club', 'Sonstige'];
const musicianTypesList = ["Band", "Solo", "DJ", "Duo", "Orchestre", "Trio"];

// ==========================================
// 1.5 DATA GENERATORS (FOR 100 DEMO PROFILES)
// ==========================================

function generateRemainingMusicians(existing) {
    const targetCount = 50;
    if (existing.length >= targetCount) return existing;
    
    const musicians = [...existing];
    const firstNames = ["Lukas", "Jonas", "Sarah", "Emma", "Tim", "Ben", "Nina", "Leon", "David", "Felix", "Julia", "Laura", "Anna", "Maximilian", "Paul", "Sophia", "Clara", "Jakob", "Marie", "Alexander"];
    const lastNames = ["Müller", "Schmidt", "Weber", "Fischer", "Meyer", "Wagner", "Schulz", "Becker", "Hoffmann", "Schäfer", "Koch", "Bauer", "Richter", "Klein", "Wolf", "Neumann", "Lange"];
    const adjectives = ["Neon", "Cosmic", "Velvet", "Rusty", "Silent", "Golden", "Electric", "Midnight", "Crimson", "Royal", "Sweet", "Acoustic", "Vintage", "Sonic"];
    const nouns = ["Beats", "Rebels", "Strings", "Keys", "Vibers", "Dials", "Waves", "Project", "Trio", "Collective", "Horizon", "Sound", "Groove", "Melody"];
    const genresPool = ["Pop", "Rock", "Electro", "Jazz", "Klassik", "Schlager", "HipHop", "Blues", "Metal"];
    const instrumentsPool = ["E-Gitarre", "Akustikgitarre", "Klavier", "Keyboard", "Schlagzeug", "Gesang", "Bass", "Saxophon"];
    const locationsPool = ["München", "Augsburg", "Nürnberg", "Stuttgart", "Hamburg", "Köln", "Frankfurt", "Düsseldorf", "Berlin"];
    const typesPool = ["Band", "Solo", "DJ", "Duo"];
    const daysPool = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const eventTypesPool = ['Geburtstag', 'Hochzeit – Trauung', 'Hochzeit - Sektempfang', 'Hochzeit – Party', 'Polterabend', 'Firmenfeier', 'Sommerfest', 'Öffentliches Event', 'Stadtfest', 'Kirmes', 'Karnevalsparty', 'Oktoberfest', 'Schützenfest', 'Vereinsfest', 'Sportveranstaltung', 'Jubiläum', 'Festival', 'Konzert', 'Bar/Kneipe/Club', 'Sonstige'];
    const techPool = ["Technik vorhanden", "Technik ist noch unklar", "Technik nicht vorhanden"];

    for (let i = existing.length; i < targetCount; i++) {
        const type = typesPool[Math.floor(Math.random() * typesPool.length)];
        const location = locationsPool[Math.floor(Math.random() * locationsPool.length)];
        const contactName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        
        let name = "";
        let bluffName = "";
        if (type === "Band" || type === "Duo") {
            name = `The ${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
            bluffName = `Professionelle ${genresPool[Math.floor(Math.random() * genresPool.length)]}-${type}`;
        } else {
            name = contactName;
            bluffName = type === "DJ" ? `Erfahrener Event-DJ` : `Akustik-Solo-Künstler`;
        }

        const genresCount = Math.floor(Math.random() * 2) + 2;
        const genres = [];
        while (genres.length < genresCount) {
            const g = genresPool[Math.floor(Math.random() * genresPool.length)];
            if (!genres.includes(g)) genres.push(g);
        }

        const instrumentsCount = Math.floor(Math.random() * 2) + 1;
        const instruments = [];
        while (instruments.length < instrumentsCount) {
            const ins = instrumentsPool[Math.floor(Math.random() * instrumentsPool.length)];
            if (!instruments.includes(ins)) instruments.push(ins);
        }

        const availCount = Math.floor(Math.random() * 2) + 2;
        const availability = [];
        while (availability.length < availCount) {
            const day = daysPool[Math.floor(Math.random() * daysPool.length)];
            if (!availability.includes(day)) availability.push(day);
        }

        const minDuration = Math.floor(Math.random() * 2) + 1;
        const maxDuration = minDuration + Math.floor(Math.random() * 3) + 1;
        const minBudget = Math.floor(Math.random() * 8) * 100 + 200;
        const maxBudget = minBudget + Math.floor(Math.random() * 15) * 100 + 300;
        const technik = [techPool[Math.floor(Math.random() * techPool.length)]];

        // Select 1 to 3 random event types from pool
        const numEvents = Math.floor(Math.random() * 3) + 1;
        const eventTypes = [];
        while (eventTypes.length < numEvents) {
            const et = eventTypesPool[Math.floor(Math.random() * eventTypesPool.length)];
            if (!eventTypes.includes(et)) eventTypes.push(et);
        }

        musicians.push({
            id: `mus_gen_${i}`,
            name,
            bluffName,
            type,
            location,
            radius: Math.floor(Math.random() * 3) * 50 + 50,
            genres,
            instruments,
            minDuration,
            maxDuration,
            minBudget,
            maxBudget,
            eventTypes,
            availability,
            description: `Hallo, wir sind ${name}! Mit viel Herzblut und Leidenschaft spielen wir ${genres.join(" & ")} für Ihre Veranstaltung in ${location} und Umgebung. Kontaktieren Sie uns gerne!`,
            contactName,
            phone: `+49 176 ${Math.floor(10000000 + Math.random() * 90000000)}`,
            email: `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`,
            isPremium: Math.random() > 0.5,
            socialLinks: { spotify: "", youtube: "", instagram: "" },
            photos: [`https://picsum.photos/id/${(i * 17) % 500 + 100}/400/300`],
            videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
            audio: [],
            technik,
            createdAt: new Date(Date.now() - i * 6 * 60 * 60 * 1000).toISOString()
        });
    }
    return musicians;
}

function generateRemainingEvents(existing) {
    const targetCount = 50;
    if (existing.length >= targetCount) return existing;

    const events = [...existing];
    const firstNames = ["Lukas", "Jonas", "Sarah", "Emma", "Tim", "Ben", "Nina", "Leon", "David", "Felix", "Julia", "Laura", "Anna", "Maximilian", "Paul", "Sophia"];
    const lastNames = ["Müller", "Schmidt", "Weber", "Fischer", "Meyer", "Wagner", "Schulz", "Becker", "Hoffmann", "Schäfer"];
    const locationsPool = ["München", "Augsburg", "Nürnberg", "Stuttgart", "Hamburg", "Köln", "Frankfurt", "Düsseldorf", "Berlin"];
    const eventTypesPool = ['Geburtstag', 'Hochzeit – Trauung', 'Hochzeit - Sektempfang', 'Hochzeit – Party', 'Polterabend', 'Firmenfeier', 'Sommerfest', 'Öffentliches Event', 'Stadtfest', 'Kirmes', 'Karnevalsparty', 'Oktoberfest', 'Schützenfest', 'Vereinsfest', 'Sportveranstaltung', 'Jubiläum', 'Festival', 'Konzert', 'Bar/Kneipe/Club', 'Sonstige'];
    const eventAdjectives = ["Große", "Gemütliche", "Exklusive", "Traditionelle", "Stimmungsvolle", "Moderne"];
    const genresPool = ["Pop", "Rock", "Electro", "Jazz", "Klassik", "Schlager"];
    const instrumentsPool = ["E-Gitarre", "Akustikgitarre", "Klavier", "Keyboard", "Schlagzeug", "Gesang"];
    const musicianTypesPool = ["Band", "DJ", "Solo", "Duo"];
    const orgTypesPool = ["Privater Veranstalter", "Firma", "Verein", "Event-Agentur", "Festivalveranstalter"];
    const techPool = ["Technik vorhanden", "Technik ist noch unklar", "Technik nicht vorhanden"];

    for (let i = existing.length; i < targetCount; i++) {
        const location = locationsPool[Math.floor(Math.random() * locationsPool.length)];
        const eventType = eventTypesPool[Math.floor(Math.random() * eventTypesPool.length)];
        const contactName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        const organizerType = orgTypesPool[Math.floor(Math.random() * orgTypesPool.length)];
        
        let eventName = "";
        if (eventType.includes("Hochzeit")) {
            eventName = `Traumhochzeit von ${firstNames[Math.floor(Math.random() * firstNames.length)]} & ${firstNames[Math.floor(Math.random() * firstNames.length)]}`;
        } else {
            eventName = `${eventAdjectives[Math.floor(Math.random() * eventAdjectives.length)]} ${eventType} in ${location}`;
        }

        const genresCount = Math.floor(Math.random() * 2) + 1;
        const genres = [];
        while (genres.length < genresCount) {
            const g = genresPool[Math.floor(Math.random() * genresPool.length)];
            if (!genres.includes(g)) genres.push(g);
        }

        const instrumentsCount = Math.floor(Math.random() * 2) + 1;
        const instruments = [];
        while (instruments.length < instrumentsCount) {
            const ins = instrumentsPool[Math.floor(Math.random() * instrumentsPool.length)];
            if (!instruments.includes(ins)) instruments.push(ins);
        }

        const minDuration = Math.floor(Math.random() * 2) + 1;
        const maxDuration = minDuration + Math.floor(Math.random() * 3) + 1;
        const minBudget = Math.floor(Math.random() * 8) * 100 + 200;
        const maxBudget = minBudget + Math.floor(Math.random() * 15) * 100 + 300;
        const technik = [techPool[Math.floor(Math.random() * techPool.length)]];
        
        const futureDays = Math.floor(Math.random() * 180) + 10;
        const date = new Date(Date.now() + futureDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const hoursPool = [
            { start: "14:00", end: "17:00" },
            { start: "15:00", end: "18:30" },
            { start: "16:00", end: "19:00" },
            { start: "17:00", end: "21:00" },
            { start: "18:00", end: "22:00" },
            { start: "19:00", end: "23:00" },
            { start: "20:00", end: "00:00" }
        ];
        const timeChoice = hoursPool[Math.floor(Math.random() * hoursPool.length)];
        const eventStartTime = timeChoice.start;
        const eventEndTime = timeChoice.end;

        let generatedCompany = "Privatperson";
        if (organizerType !== "Privater Veranstalter") {
            const orgNames = {
                "Firma": ["TechCorp GmbH", "Müller & Söhne KG", "InnoWave Solutions", "FutureMedia Group", "Hansa Logistik"],
                "Verein": ["Musikverein e.V.", "Kulturverein Regenbogen", "Sportfreunde 1920", "Stadtjugendring", "Förderverein Kunst"],
                "Event-Agentur": ["SommerSonne Events", "StarGigs Agency", "GoldenMoment Weddings", "BlueMoon Entertainment", "Epic Events"],
                "Festivalveranstalter": ["BeachBeat Festival Group", "Rock am See GmbH", "JazzTime e.V.", "CityFestivals UG", "SoundScape Productions"],
                "Sonstige": ["Kulturamt", "Bürgerhaus e.V.", "Stadtmarketing GmbH"]
            };
            const list = orgNames[organizerType] || ["Event Organisation"];
            generatedCompany = list[Math.floor(Math.random() * list.length)];
        }

        const minPublikum = [20, 50, 100, 150, 200, 300][Math.floor(Math.random() * 6)];
        const maxPublikum = minPublikum + [30, 50, 100, 200][Math.floor(Math.random() * 4)];
        const publikum = `${minPublikum} - ${maxPublikum}`;
        const duration = parseFloat(((minDuration + maxDuration) / 2).toFixed(1));

        events.push({
            id: `evt_gen_${i}`,
            name: eventName,
            type: eventType,
            date,
            eventStartTime,
            eventEndTime,
            location,
            genres,
            instruments,
            minDuration,
            maxDuration,
            duration,
            minBudget,
            maxBudget,
            budget: minBudget,
            minPublikum,
            maxPublikum,
            publikum,
            technik,
            organizerType,
            company: generatedCompany,
            musicianTypes: [musicianTypesPool[Math.floor(Math.random() * musicianTypesPool.length)]],
            description: `Für unsere Veranstaltung '${eventName}' suchen wir einen passenden Live-Act. Wir freuen uns auf eure Bewerbung!`,
            contactName,
            phone: `+49 176 ${Math.floor(10000000 + Math.random() * 90000000)}`,
            email: `event_${i}@example.com`,
            isOnline: true,
            photos: [`https://images.unsplash.com/photo-${[
                '1511671782779-c97d3d27a1d4',
                '1470225620780-dba8ba36b745',
                '1514525253161-7a46d19cd819',
                '1484755560693-a4074577af3a',
                '1465847899084-d164df4dedc6'
            ][i % 5]}?auto=format&fit=crop&w=800&q=80`],
            videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
            creatorId: `org_gen_${i}`,
            createdAt: new Date(Date.now() - i * 6 * 60 * 60 * 1000).toISOString()
        });
    }
    return events;
}

// ==========================================
// 2. STATE MANAGER
// ==========================================

class StateManager {
    constructor() {
        this.listeners = [];
        this.currentUser = null;
        this.musicians = [];
        this.events = [];
        this.chats = [];
        try {
            const storedRead = localStorage.getItem('GigConnAct_read_chats');
            this.readChats = storedRead ? JSON.parse(storedRead) : [];
        } catch (e) {
            this.readChats = [];
        }
        this.interests = [];
        this.favorites = [];
        this.initialLoadDone = false;
        this.initFirebaseData();
    }

    async initFirebaseData() {
        try {
            await this.loadStateFromFirestore();
            this.setupAuthListener();
            this.handleSignInWithEmailLink();
            await this.handleGoogleRedirectResult();
        } catch (e) {
            console.error("Firebase init failed, falling back to mock localStorage:", e);
            this.loadState();
            this.initialLoadDone = true;
            this.notify();
        }
    }

    async loadStateFromFirestore() {
        // 1. Seed database if empty
        const musSnapshot = await db.collection('musicians').limit(1).get();
        const evtSnapshot = await db.collection('events').limit(1).get();
        
        if (musSnapshot.empty || evtSnapshot.empty) {
            console.log("Firestore collection(s) empty. Seeding initial data...");
            this.loadState();
            
            if (musSnapshot.empty) {
                const seedMus = this.musicians.map(m => db.collection('musicians').doc(m.id).set(m));
                await Promise.all(seedMus);
            }
            
            if (evtSnapshot.empty) {
                const seedEvt = this.events.map(e => db.collection('events').doc(e.id).set(e));
                await Promise.all(seedEvt);
            }

            const chatsSnapshot = await db.collection('chats').limit(1).get();
            if (chatsSnapshot.empty) {
                const seedChats = this.chats.map(c => db.collection('chats').doc(c.id).set(c));
                await Promise.all(seedChats);
            }
            
            console.log("Database seeded successfully!");
            this.initialLoadDone = true;
            this.notify();
            return;
        }

        // 2. Real-time snapshot listeners
        let musiciansLoaded = false;
        let eventsLoaded = false;
        let chatsLoaded = false;
        let interestsLoaded = false;
        
        const checkInitialLoad = () => {
            if (musiciansLoaded && eventsLoaded && chatsLoaded && interestsLoaded && !this.initialLoadDone) {
                console.log("[DEBUG] Firestore initial load completed!");
                this.initialLoadDone = true;
                this.notify();
            }
        };

        db.collection('musicians').onSnapshot(snapshot => {
            const list = [];
            snapshot.forEach(doc => list.push(doc.data()));
            this.musicians = list;
            this.updateVersion = (this.updateVersion || 0) + 1;
            musiciansLoaded = true;
            this.notify();
            checkInitialLoad();
        }, err => {
            console.error("Musicians snapshot error:", err);
            musiciansLoaded = true;
            checkInitialLoad();
        });

        db.collection('events').onSnapshot(snapshot => {
            const list = [];
            snapshot.forEach(doc => list.push(doc.data()));
            this.events = list;
            this.updateVersion = (this.updateVersion || 0) + 1;
            eventsLoaded = true;
            this.notify();
            checkInitialLoad();
        }, err => {
            console.error("Events snapshot error:", err);
            eventsLoaded = true;
            checkInitialLoad();
        });

        db.collection('chats').onSnapshot(snapshot => {
            const list = [];
            snapshot.forEach(doc => list.push(doc.data()));
            this.chats = list;
            this.updateVersion = (this.updateVersion || 0) + 1;
            chatsLoaded = true;
            this.notify();
            checkInitialLoad();
        }, err => {
            console.error("Chats snapshot error:", err);
            chatsLoaded = true;
            checkInitialLoad();
        });

        db.collection('interests').onSnapshot(snapshot => {
            const list = [];
            snapshot.forEach(doc => list.push(doc.data()));
            this.interests = list;
            this.updateVersion = (this.updateVersion || 0) + 1;
            interestsLoaded = true;
            this.notify();
            checkInitialLoad();
        }, err => {
            console.error("Interests snapshot error:", err);
            interestsLoaded = true;
            checkInitialLoad();
        });
    }

    setupAuthListener() {
        auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                console.log("Firebase user logged in:", firebaseUser.email);
                const userDocRef = db.collection('users').doc(firebaseUser.uid);
                
                userDocRef.onSnapshot(async (doc) => {
                    if (doc.exists) {
                        this.currentUser = doc.data();
                        if (this.currentUser.role === 'musician') {
                            this.activeMusicianId = this.activeMusicianId && this.musicians.some(m => m.id === this.activeMusicianId)
                                ? this.activeMusicianId
                                : (this.musicians.find(m => m.creatorId === this.currentUser.id)?.id || this.currentUser.profileId || null);
                        } else if (this.currentUser.role === 'organizer') {
                            this.activeEventId = this.activeEventId && this.events.some(e => e.id === this.activeEventId)
                                ? this.activeEventId
                                : (this.events.find(e => e.creatorId === this.currentUser.id)?.id || null);
                        }
                        this.notify();
                    } else {
                        console.warn("Logged in user has no document in Firestore 'users' collection.");
                        // Failsafe: Automatically open registration modal for user to complete registration!
                        window.googleRegistrationUser = firebaseUser;
                        setTimeout(() => {
                            showModal('auth');
                            const registerForm = document.getElementById('auth-register-form');
                            if (registerForm) {
                                if (registerForm.elements.email) {
                                    registerForm.elements.email.value = firebaseUser.email || '';
                                    registerForm.elements.email.disabled = true;
                                    registerForm.elements.email.style.background = 'rgba(255,255,255,0.05)';
                                    registerForm.elements.email.style.cursor = 'not-allowed';
                                }
                                if (registerForm.elements.fullName && firebaseUser.displayName) {
                                    registerForm.elements.fullName.value = firebaseUser.displayName;
                                }
                            }
                            const registerTabBtn = document.getElementById('tab-register-btn');
                            if (registerTabBtn) registerTabBtn.click();
                            
                            showToast({
                                title: "Registrierung abschließen",
                                message: "Bitte vervollständige deine Angaben, um deinen Account zu erstellen."
                            });
                        }, 500);
                    }
                }, async (err) => {
                    console.error("User doc snapshot error, falling back to HTTP get():", err);
                    try {
                        const doc = await userDocRef.get();
                        if (doc.exists) {
                            this.currentUser = doc.data();
                            if (this.currentUser.role === 'musician') {
                                this.activeMusicianId = this.activeMusicianId && this.musicians.some(m => m.id === this.activeMusicianId)
                                    ? this.activeMusicianId
                                    : (this.musicians.find(m => m.creatorId === this.currentUser.id)?.id || this.currentUser.profileId || null);
                            } else if (this.currentUser.role === 'organizer') {
                                this.activeEventId = this.activeEventId && this.events.some(e => e.id === this.activeEventId)
                                    ? this.activeEventId
                                    : (this.events.find(e => e.creatorId === this.currentUser.id)?.id || null);
                            }
                            this.notify();
                        } else {
                            console.warn("Logged in user has no document in Firestore 'users' collection (HTTP fallback).");
                            window.googleRegistrationUser = firebaseUser;
                            showModal('auth');
                            const registerForm = document.getElementById('auth-register-form');
                            if (registerForm) {
                                if (registerForm.elements.email) {
                                    registerForm.elements.email.value = firebaseUser.email || '';
                                    registerForm.elements.email.disabled = true;
                                    registerForm.elements.email.style.background = 'rgba(255,255,255,0.05)';
                                    registerForm.elements.email.style.cursor = 'not-allowed';
                                }
                                if (registerForm.elements.fullName && firebaseUser.displayName) {
                                    registerForm.elements.fullName.value = firebaseUser.displayName;
                                }
                            }
                            const registerTabBtn = document.getElementById('tab-register-btn');
                            if (registerTabBtn) registerTabBtn.click();
                        }
                    } catch (getErr) {
                        console.error("User doc fallback get() failed:", getErr);
                        showToast({
                            title: "Datenbank-Verbindungsfehler",
                            message: "Das Profil konnte nicht geladen werden. Bitte prüfe deine Internetverbindung."
                        });
                    }
                });
            } else {
                console.log("No Firebase user logged in.");
                this.currentUser = null;
                this.notify();
            }
        });
    }

    async handleSignInWithEmailLink() {
        if (auth.isSignInWithEmailLink(window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                email = window.prompt('Bitte gib deine E-Mail-Adresse zur Bestätigung ein:');
            }
            if (!email) return;

            showToast({
                title: "Anmeldung läuft... 🔄",
                message: "Dein Anmeldelink wird verifiziert."
            });

            try {
                const result = await auth.signInWithEmailLink(email, window.location.href);
                window.localStorage.removeItem('emailForSignIn');
                const user = result.user;

                const urlParams = new URLSearchParams(window.location.search);
                const userDoc = await db.collection('users').doc(user.uid).get();

                if (userDoc.exists) {
                    console.log("Existing user signed in successfully!");
                    window.history.replaceState({}, document.title, window.location.pathname);
                } else {
                    const pendingRegStr = window.localStorage.getItem('GigConnAct_pending_registration');
                    const pendingReg = pendingRegStr ? JSON.parse(pendingRegStr) : null;

                    if (pendingReg && pendingReg.email.toLowerCase() === email.toLowerCase()) {
                        console.log("Completing registration for new user:", email);
                        const profileId = pendingReg.role === 'musician' ? 'mus_' + user.uid : 'evt_' + user.uid;
                        
                        const newUser = {
                            id: user.uid,
                            role: pendingReg.role,
                            firstName: pendingReg.firstName,
                            lastName: pendingReg.lastName,
                            company: pendingReg.company || "Privatperson",
                            organizerType: pendingReg.organizerType || "",
                            phone: pendingReg.phone,
                            hidePhone: pendingReg.hidePhone || false,
                            email: pendingReg.email,
                            profileId: profileId,
                            isPremium: pendingReg.role === "musician" ? pendingReg.sepaConsent : true,
                            successfulGigs: 0,
                            contactRequests: 0,
                            favorites: [],
                            interests: []
                        };

                        await db.collection('users').doc(user.uid).set(newUser);

                        if (pendingReg.role === 'musician') {
                            const newMusician = {
                                id: profileId,
                                name: pendingReg.bandName,
                                bluffName: `Anonyme/r ${pendingReg.musicianType} (${pendingReg.genres[0] || 'Musik'})`,
                                type: pendingReg.musicianType,
                                location: pendingReg.locations ? pendingReg.locations.join(', ') : (pendingReg.location || 'München'),
                                locations: pendingReg.locations || [pendingReg.location || 'München'],
                                radius: parseInt(pendingReg.radius) || 50,
                                genres: pendingReg.genres,
                                instruments: pendingReg.instruments,
                                minDuration: parseFloat(pendingReg.minDuration) || 1,
                                maxDuration: parseFloat(pendingReg.maxDuration) || 3,
                                minBudget: parseFloat(pendingReg.minBudget) || 150,
                                maxBudget: parseFloat(pendingReg.maxBudget) || 1000,
                                eventTypes: pendingReg.eventTypes,
                                availability: pendingReg.availability,
                                minPublikum: parseInt(pendingReg.minPublikum) || 0,
                                maxPublikum: parseInt(pendingReg.maxPublikum) || 500,
                                description: pendingReg.description,
                                technik: pendingReg.technik || ["Technik ist noch unklar"],
                                company: newUser.company || "Privatperson",
                                contactName: `${newUser.firstName} ${newUser.lastName}`,
                                phone: newUser.phone,
                                hidePhone: pendingReg.hidePhone || false,
                                email: newUser.email,
                                isPremium: newUser.isPremium,
                                subscriptionPlan: pendingReg.subscriptionPlan || "flex",
                                credits: 5,
                                unlockedContacts: [],
                                socialLinks: { spotify: "", youtube: "", instagram: "" },
                                photos: pendingReg.photos || [],
                                videos: pendingReg.videos || [],
                                audio: [],
                                creatorId: user.uid
                            };
                            await db.collection('musicians').doc(profileId).set(newMusician);
                        } else {
                            const newEvent = {
                                id: profileId,
                                name: pendingReg.eventName,
                                type: pendingReg.orgEventTypes ? pendingReg.orgEventTypes[0] : "",
                                eventTypes: pendingReg.orgEventTypes || [],
                                date: pendingReg.eventDates ? pendingReg.eventDates[0] : "",
                                dates: pendingReg.eventDates || [],
                                eventStartTime: pendingReg.eventStartTime || "18:00",
                                eventEndTime: pendingReg.eventEndTime || "22:00",
                                location: pendingReg.orgLocations ? pendingReg.orgLocations.join(', ') : "",
                                locations: pendingReg.orgLocations || [],
                                genres: pendingReg.orgGenres || [],
                                instruments: pendingReg.orgInstruments || [],
                                minDuration: parseFloat(pendingReg.orgMinDuration) || 2.0,
                                maxDuration: parseFloat(pendingReg.orgMaxDuration) || 4.0,
                                duration: parseFloat(pendingReg.orgMinDuration) || 2.0,
                                minPublikum: parseInt(pendingReg.orgMinPublikum) || 50,
                                maxPublikum: parseInt(pendingReg.orgMaxPublikum) || 150,
                                publikum: `${pendingReg.orgMinPublikum || 50} - ${pendingReg.orgMaxPublikum || 150}`,
                                minBudget: parseFloat(pendingReg.orgMinBudget) || 300,
                                maxBudget: parseFloat(pendingReg.orgMaxBudget) || 800,
                                budget: parseFloat(pendingReg.orgMinBudget) || 300,
                                description: pendingReg.orgDescription || "",
                                technik: pendingReg.technik || ["Technik ist noch unklar"],
                                company: newUser.company || "Privatperson",
                                organizerType: newUser.organizerType || "Privater Veranstalter",
                                contactName: `${newUser.firstName} ${newUser.lastName}`,
                                phone: newUser.phone,
                                hidePhone: pendingReg.hidePhone || false,
                                email: newUser.email,
                                isOnline: true,
                                creatorId: user.uid
                            };
                            await db.collection('events').doc(profileId).set(newEvent);
                        }
                        window.localStorage.removeItem('GigConnAct_pending_registration');
                        showToast({
                            title: "Registrierung abgeschlossen! 🎉",
                            message: "Dein Profil wurde erfolgreich erstellt."
                        });
                    } else {
                        console.log("Creating default user profile on the fly...");
                        const role = urlParams.get('role') || 'musician';
                        const profileId = role === 'musician' ? 'mus_' + user.uid : 'evt_' + user.uid;
                        
                        const newUser = {
                            id: user.uid,
                            role: role,
                            firstName: role === 'musician' ? 'Demo-Musiker' : 'Demo-Veranstalter',
                            lastName: 'Gast',
                            company: 'Privatperson',
                            organizerType: role === 'organizer' ? 'Privater Veranstalter' : '',
                            phone: '+49 170 1234567',
                            email: email,
                            profileId: profileId,
                            isPremium: true,
                            subscriptionPlan: 'flex',
                            credits: role === 'musician' ? 5 : 0,
                            unlockedContacts: [],
                            successfulGigs: 0,
                            contactRequests: 0,
                            favorites: [],
                            interests: []
                        };

                        await db.collection('users').doc(user.uid).set(newUser);
                        
                        if (role === 'musician') {
                            const newMusician = {
                                id: profileId,
                                name: "Demo Musiker",
                                bluffName: "Akustik-Solo-Künstler",
                                type: "Solo",
                                location: "München",
                                locations: ["München"],
                                radius: 100,
                                genres: ["Pop", "Rock"],
                                instruments: ["Gesang", "Akustikgitarre"],
                                minDuration: 1,
                                maxDuration: 3,
                                minBudget: 150,
                                maxBudget: 1000,
                                eventTypes: ["Geburtstag", "Sommerfest"],
                                availability: {
                                    friday: { available: true, startTime: '18:00', endTime: '23:59' },
                                    saturday: { available: true, startTime: '00:01', endTime: '23:59' }
                                },
                                minPublikum: 0,
                                maxPublikum: 500,
                                description: "Professioneller Solo-Künstler für Events aller Art.",
                                technik: ["Technik vorhanden"],
                                company: "Privatperson",
                                contactName: "Demo-Musiker Gast",
                                phone: "+49 170 1234567",
                                email: email,
                                isPremium: false,
                                subscriptionPlan: "flex",
                                credits: 5,
                                unlockedContacts: [],
                                socialLinks: { spotify: "", youtube: "", instagram: "" },
                                photos: [],
                                videos: [],
                                audio: [],
                                creatorId: user.uid
                            };
                            await db.collection('musicians').doc(profileId).set(newMusician);
                        } else {
                            const newEvent = {
                                id: profileId,
                                name: "Demo Veranstaltung",
                                type: "Geburtstag",
                                eventTypes: ["Geburtstag"],
                                date: "2026-08-15",
                                dates: ["2026-08-15"],
                                location: "München",
                                locations: ["München"],
                                genres: ["Pop", "Rock"],
                                instruments: ["Gesang", "Akustikgitarre"],
                                minDuration: 2.0,
                                maxDuration: 4.0,
                                duration: 4.0,
                                minPublikum: 50,
                                maxPublikum: 150,
                                publikum: "50 - 150",
                                minBudget: 300,
                                maxBudget: 800,
                                description: "Private Feier in München. Wir suchen einen netten Live-Act.",
                                technik: ["Technik ist noch unklar"],
                                company: "Privatperson",
                                organizerType: "Privater Veranstalter",
                                contactName: "Demo-Veranstalter Gast",
                                phone: "+49 170 1234567",
                                email: email,
                                isOnline: true,
                                creatorId: user.uid
                            };
                            await db.collection('events').doc(profileId).set(newEvent);
                        }
                    }
                }
                window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
                navigateAfterLogin();
            } catch (err) {
                console.error("Sign in link verification failed:", err);
                showToast({
                    title: "Anmeldung fehlgeschlagen ❌",
                    message: "Der Link ist ungültig oder abgelaufen."
                });
            }
        }
    }

    async handleGoogleRedirectResult() {
        try {
            const result = await auth.getRedirectResult();
            if (result && result.user) {
                const user = result.user;
                console.log("Google redirect sign-in successful:", user.email);
                
                const userDoc = await db.collection('users').doc(user.uid).get();
                if (!userDoc.exists) {
                    // NEW USER: Redirect to register page!
                    window.googleRegistrationUser = user;
                    
                    // Switch to register tab and prefill
                    setTimeout(() => {
                        showModal('auth');
                        const registerForm = document.getElementById('auth-register-form');
                        if (registerForm) {
                            if (registerForm.elements.email) {
                                registerForm.elements.email.value = user.email || '';
                                registerForm.elements.email.disabled = true;
                                registerForm.elements.email.style.background = 'rgba(255,255,255,0.05)';
                                registerForm.elements.email.style.cursor = 'not-allowed';
                            }
                            if (registerForm.elements.fullName && user.displayName) {
                                registerForm.elements.fullName.value = user.displayName;
                            }
                        }
                        const registerTabBtn = document.getElementById('tab-register-btn');
                        if (registerTabBtn) registerTabBtn.click();
                        
                        showToast({
                            title: "Google-Konto verknüpft!",
                            message: "Bitte vervollständige deine Angaben, um die Registrierung abzuschließen."
                        });
                    }, 500);
                } else {
                    // EXISTING USER: Logged in!
                    showToast({
                        title: "Erfolgreich angemeldet!",
                        message: `Willkommen zurück, ${user.displayName || user.email}!`
                    });
                    handleRouting();
                }
            }
        } catch (err) {
            console.error("Google Redirect Result Error:", err);
            showToast({
                title: "Google-Anmeldung fehlgeschlagen",
                message: err.message || "Es gab ein Problem bei der Anmeldung."
            });
        }
    }

    loadState() {
        try {
            const storedUser = localStorage.getItem('GigConnAct_current_user');
            this.currentUser = storedUser ? JSON.parse(storedUser) : null;
            if (this.currentUser && this.currentUser.role === 'musician') {
                if (this.currentUser.credits === undefined) this.currentUser.credits = 5;
                if (this.currentUser.unlockedContacts === undefined) this.currentUser.unlockedContacts = [];
            }
        } catch (e) {
            this.currentUser = null;
        }

        try {
            const storedMusicians = localStorage.getItem('GigConnAct_musicians');
            const parsed = storedMusicians ? JSON.parse(storedMusicians) : [];
            const filtered = Array.isArray(parsed) ? parsed.filter(m => m.id && !m.id.startsWith('mus_gen_')) : [];
            let base = filtered.length > 0 ? filtered : [...initialMusicians];
            initialMusicians.forEach(init => {
                if (!base.some(m => m.id === init.id)) {
                    base.push(init);
                }
            });
            this.musicians = generateRemainingMusicians(base).map(m => {
                if (m.id && m.id.startsWith('mus_gen_') && m.maxBudget === undefined) {
                    m.minDuration = m.minDuration || 2;
                    m.maxDuration = m.maxDuration || 4;
                    m.minBudget = m.minBudget || 300;
                    m.maxBudget = m.minBudget + 500;
                }
                if (m.technik && !Array.isArray(m.technik)) {
                    m.technik = [m.technik];
                } else if (!m.technik) {
                    m.technik = ["Technik ist noch unklar"];
                }
                if (["mus_1", "mus_3", "mus_5"].includes(m.id)) {
                    m.hidePhone = true;
                } else if (m.id && m.id.startsWith('mus_gen_')) {
                    const idxNum = parseInt(m.id.replace('mus_gen_', ''));
                    if (idxNum % 4 === 0) {
                        m.hidePhone = true;
                    }
                }
                return m;
            });
        } catch (e) {
            this.musicians = generateRemainingMusicians(initialMusicians);
        }

        try {
            const storedEvents = localStorage.getItem('GigConnAct_events');
            const parsed = storedEvents ? JSON.parse(storedEvents) : [];
            const filtered = Array.isArray(parsed) ? parsed.filter(e => e.id && !e.id.startsWith('evt_gen_')) : [];
            let base = filtered.length > 0 ? filtered : [...initialEvents];
            initialEvents.forEach(init => {
                if (!base.some(e => e.id === init.id)) {
                    base.push(init);
                }
            });
            this.events = generateRemainingEvents(base).map(e => {
                if (!e.eventStartTime) {
                    const hoursPool = [
                        { start: "14:00", end: "17:00" },
                        { start: "15:00", end: "18:30" },
                        { start: "16:00", end: "19:00" },
                        { start: "17:00", end: "21:00" },
                        { start: "18:00", end: "22:00" },
                        { start: "19:00", end: "23:00" },
                        { start: "20:00", end: "00:00" }
                    ];
                    const timeChoice = hoursPool[Math.floor(Math.random() * hoursPool.length)];
                    e.eventStartTime = timeChoice.start;
                    e.eventEndTime = timeChoice.end;
                }
                if (e.id && e.id.startsWith('evt_gen_')) {
                    if (e.minBudget === undefined) {
                        e.minBudget = e.budget || 300;
                        e.maxBudget = e.minBudget + 500;
                    }
                    if (e.minDuration === undefined) {
                        e.minDuration = e.duration || 2;
                        e.maxDuration = e.minDuration + 2;
                    }
                }
                if (e.technik && !Array.isArray(e.technik)) {
                    e.technik = [e.technik];
                } else if (!e.technik) {
                    e.technik = ["Technik ist noch unklar"];
                }
                if (e.duration === undefined || e.duration === null) {
                    e.duration = e.minDuration !== undefined ? e.minDuration : 2;
                }
                if (e.budget === undefined || e.budget === null) {
                    e.budget = e.minBudget !== undefined ? e.minBudget : 300;
                }
                if (e.minPublikum === undefined || e.minPublikum === null) {
                    e.minPublikum = [20, 50, 100, 150, 200, 300][Math.floor(Math.random() * 6)];
                    e.maxPublikum = e.minPublikum + [30, 50, 100, 200][Math.floor(Math.random() * 4)];
                    e.publikum = `${e.minPublikum} - ${e.maxPublikum}`;
                }
                if (["evt_1", "evt_3", "evt_5"].includes(e.id)) {
                    e.hidePhone = true;
                } else if (e.id && e.id.startsWith('evt_gen_')) {
                    const idxNum = parseInt(e.id.replace('evt_gen_', ''));
                    if (idxNum % 4 === 0) {
                        e.hidePhone = true;
                    }
                }
                return e;
            });
        } catch (err) {
            this.events = generateRemainingEvents(initialEvents).map(e => {
                if (!e.eventStartTime) {
                    const hoursPool = [
                        { start: "14:00", end: "17:00" },
                        { start: "15:00", end: "18:30" },
                        { start: "16:00", end: "19:00" },
                        { start: "17:00", end: "21:00" },
                        { start: "18:00", end: "22:00" },
                        { start: "19:00", end: "23:00" },
                        { start: "20:00", end: "00:00" }
                    ];
                    const timeChoice = hoursPool[Math.floor(Math.random() * hoursPool.length)];
                    e.eventStartTime = timeChoice.start;
                    e.eventEndTime = timeChoice.end;
                }
                if (e.duration === undefined || e.duration === null) {
                    e.duration = e.minDuration !== undefined ? e.minDuration : 2;
                }
                if (e.budget === undefined || e.budget === null) {
                    e.budget = e.minBudget !== undefined ? e.minBudget : 300;
                }
                if (e.minPublikum === undefined || e.minPublikum === null) {
                    e.minPublikum = [20, 50, 100, 150, 200, 300][Math.floor(Math.random() * 6)];
                    e.maxPublikum = e.minPublikum + [30, 50, 100, 200][Math.floor(Math.random() * 4)];
                    e.publikum = `${e.minPublikum} - ${e.maxPublikum}`;
                }
                return e;
            });
        }

        try {
            const storedChats = localStorage.getItem('GigConnAct_chats');
            const parsed = storedChats ? JSON.parse(storedChats) : [];
            this.chats = (Array.isArray(parsed) && parsed.length > 0) ? parsed : this.getInitialChats();
        } catch (e) {
            this.chats = this.getInitialChats();
        }

        try {
            const storedRead = localStorage.getItem('GigConnAct_read_chats');
            this.readChats = storedRead ? JSON.parse(storedRead) : [];
        } catch (e) {
            this.readChats = [];
        }

        try {
            const storedInterests = localStorage.getItem('GigConnAct_interests');
            this.interests = storedInterests ? JSON.parse(storedInterests) : [];
        } catch (e) {
            this.interests = [];
        }

        try {
            const storedFavorites = localStorage.getItem('GigConnAct_favorites');
            this.favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
        } catch (e) {
            this.favorites = [];
        }

        this.musicians.forEach((m, idx) => {
            if (!m.createdAt) m.createdAt = new Date(Date.now() - idx * 2 * 60 * 60 * 1000).toISOString();
            if (!m.creatorId) m.creatorId = m.id;
        });
        this.events.forEach((e, idx) => {
            if (!e.createdAt) e.createdAt = new Date(Date.now() - idx * 2 * 60 * 60 * 1000).toISOString();
            if (!e.creatorId) e.creatorId = e.creatorId || "org_1";
        });

        const juliaEvents = this.events.filter(e => e.creatorId === "org_1");
        if (juliaEvents.length === 1) {
            const first = juliaEvents[0];
            const second = {
                ...JSON.parse(JSON.stringify(first)),
                id: "evt_julia_canceled",
                name: "Gartenparty Sommerfest (Abgesagt)",
                date: "2026-07-28",
                isCanceled: true,
                musicianFound: false
            };
            const third = {
                ...JSON.parse(JSON.stringify(first)),
                id: "evt_julia_active",
                name: "Geburtstagsfeier 30. (Aktiv)",
                date: "2026-08-30",
                isCanceled: false,
                musicianFound: false
            };
            this.events.push(second, third);
            juliaEvents.push(second, third);
        }

        if (juliaEvents.length >= 3) {
            juliaEvents[0].musicianFound = true;
        }

        const contactMusicians = this.musicians.filter(m => m.creatorId === "mus_1");
        if (contactMusicians.length === 1) {
            const first = contactMusicians[0];
            const second = {
                ...JSON.parse(JSON.stringify(first)),
                id: "mus_1_dup",
                name: "Neon Beats Acoustic",
                type: "Solo",
                bluffName: "Acoustic Pop-Sänger & Gitarrist",
                minBudget: 400,
                genres: ["Pop", "Rock", "Singer-Songwriter"],
                isActive: true
            };
            this.musicians.push(second);
            contactMusicians.push(second);
        }

        contactMusicians.forEach((m, mIdx) => {
            if (!m.applications || m.applications.length < 10) {
                m.applications = [];
                const availableEvents = this.events.slice(0, 15);
                for (let i = 0; i < 10; i++) {
                    const event = availableEvents[i];
                    if (event) {
                        const status = i < 3 ? "booked" : i < 5 ? "declined" : "contacted";
                        m.applications.push({
                            eventId: event.id,
                            status: status
                        });
                    }
                }
            }
        });
        
        const techOptions = ["Technik vorhanden", "Technik ist noch unklar", "Technik nicht vorhanden"];
        this.musicians.forEach(m => {
            if (!m.company) m.company = "Privatperson";
            if (!m.technik) m.technik = techOptions[Math.floor(Math.random() * techOptions.length)];
        });
        this.events.forEach(e => {
            if (!e.company) e.company = "Event Organisation";
            if (!e.technik) e.technik = techOptions[Math.floor(Math.random() * techOptions.length)];
            if (e.duration === undefined || e.duration === null) e.duration = e.minDuration !== undefined ? e.minDuration : 2;
            if (e.budget === undefined || e.budget === null) e.budget = e.minBudget !== undefined ? e.minBudget : 300;
            if (e.minPublikum === undefined || e.minPublikum === null) {
                e.minPublikum = [20, 50, 100, 150, 200, 300][Math.floor(Math.random() * 6)];
                e.maxPublikum = e.minPublikum + [30, 50, 100, 200][Math.floor(Math.random() * 4)];
                e.publikum = `${e.minPublikum} - ${e.maxPublikum}`;
            }
        });

        if (this.currentUser) {
            if (this.currentUser.role === 'musician') {
                this.activeMusicianId = this.activeMusicianId && this.musicians.some(m => m.id === this.activeMusicianId)
                    ? this.activeMusicianId
                    : (this.musicians.find(m => m.creatorId === this.currentUser.id)?.id || this.currentUser.profileId || null);
            } else if (this.currentUser.role === 'organizer') {
                this.activeEventId = this.activeEventId && this.events.some(e => e.id === this.activeEventId)
                    ? this.activeEventId
                    : (this.events.find(e => e.creatorId === this.currentUser.id)?.id || null);
            }
            this.runDailyMatchCheck();
        }
    }

    saveState() {
        try {
            if (this.currentUser) {
                localStorage.setItem('GigConnAct_current_user', JSON.stringify(this.currentUser));
            } else {
                localStorage.removeItem('GigConnAct_current_user');
            }
            localStorage.setItem('GigConnAct_musicians', JSON.stringify(this.musicians));
            localStorage.setItem('GigConnAct_events', JSON.stringify(this.events));
            localStorage.setItem('GigConnAct_chats', JSON.stringify(this.chats));
            localStorage.setItem('GigConnAct_read_chats', JSON.stringify(this.readChats));
            localStorage.setItem('GigConnAct_interests', JSON.stringify(this.interests || []));
            localStorage.setItem('GigConnAct_favorites', JSON.stringify(this.favorites || []));
        } catch (e) {
            console.warn("Storage write failed or blocked:", e);
        }
    }

    runDailyMatchCheck() {
        if (!this.currentUser) return;
        const todayStr = new Date().toISOString().split('T')[0];
        const checkKey = `GigConnAct_last_match_check_${this.currentUser.id}`;
        const lastCheckDate = localStorage.getItem(checkKey);
        
        if (lastCheckDate !== todayStr) {
            console.log("Running daily match check for", this.currentUser.id);
            let myProfiles = [];
            if (this.currentUser.role === 'musician') {
                myProfiles = this.musicians.filter(m => m.creatorId === this.currentUser.id);
            } else {
                myProfiles = this.events.filter(e => e.creatorId === this.currentUser.id);
            }
            const candidates = this.currentUser.role === 'musician' 
                ? this.events.filter(e => e.isCanceled !== true && e.musicianFound !== true)
                : this.musicians.filter(m => m.isActive !== false);
                
            const matchesKey = `GigConnAct_matches_list_${this.currentUser.id}`;
            const unreadKey = `GigConnAct_unread_matches_${this.currentUser.id}`;
            
            let matchedIds = [];
            try {
                const storedMatchesRaw = localStorage.getItem(matchesKey);
                matchedIds = storedMatchesRaw ? JSON.parse(storedMatchesRaw) : [];
            } catch(e){}
            
            const currentDayMatches = [...matchedIds];
            const newMatchesThisDay = [];
            
            myProfiles.forEach(myProf => {
                candidates.forEach(cand => {
                    if (currentDayMatches.includes(cand.id)) return;
                    
                    let score = 0;
                    if (this.currentUser.role === 'musician') {
                        score = calculateMatch(myProf, cand, 'musician').score;
                    } else {
                        score = calculateMatch(cand, myProf, 'organizer').score;
                    }
                    
                    if (score >= 40) {
                        currentDayMatches.push(cand.id);
                        newMatchesThisDay.push(cand.id);
                    }
                });
            });
            
            if (newMatchesThisDay.length > 0) {
                let storedUnread = [];
                try {
                    const storedUnreadRaw = localStorage.getItem(unreadKey);
                    storedUnread = storedUnreadRaw ? JSON.parse(storedUnreadRaw) : [];
                } catch(e){}
                
                storedUnread = [...storedUnread, ...newMatchesThisDay];
                localStorage.setItem(unreadKey, JSON.stringify(storedUnread));
            }
            
            localStorage.setItem(matchesKey, JSON.stringify(currentDayMatches));
            localStorage.setItem(checkKey, todayStr);
        }
    }

    getUnreadMatches() {
        if (!this.currentUser) return [];
        const unreadKey = `GigConnAct_unread_matches_${this.currentUser.id}`;
        try {
            const storedUnreadRaw = localStorage.getItem(unreadKey);
            return storedUnreadRaw ? JSON.parse(storedUnreadRaw) : [];
        } catch (e) {
            return [];
        }
    }

    clearUnreadMatches() {
        if (!this.currentUser) return;
        const unreadKey = `GigConnAct_unread_matches_${this.currentUser.id}`;
        localStorage.setItem(unreadKey, JSON.stringify([]));
        this.notify();
    }

    isChatUnread(chat) {
        if (!this.currentUser) return false;
        if (!chat) return false;
        if ((this.readChats || []).includes(chat.id)) return false;

        // Gather all participant IDs of the current user
        const userParticipantIds = [this.currentUser.id];
        if (this.currentUser.role === 'musician') {
            const profiles = this.musicians.filter(m => m.creatorId === this.currentUser.id);
            profiles.forEach(m => userParticipantIds.push(m.id));
            if (this.currentUser.profileId) {
                userParticipantIds.push(this.currentUser.profileId);
            }
        } else {
            const userEvents = this.events.filter(e => e.creatorId === this.currentUser.id);
            userEvents.forEach(e => userParticipantIds.push(e.id));
        }

        // Check if the current user is a participant
        if (!chat.participants || !chat.participants.some(pid => userParticipantIds.includes(pid))) {
            return false;
        }

        // Check if the last message was sent by someone else
        if (chat.messages && chat.messages.length > 0) {
            const lastMsg = chat.messages[chat.messages.length - 1];
            if (userParticipantIds.includes(lastMsg.senderId)) {
                return false;
            }
        }
        return true;
    }

    getUnreadCount() {
        if (!this.currentUser) return 0;
        const chatsList = this.chats || [];
        return chatsList.filter(c => this.isChatUnread(c)).length;
    }

    getChatsForUser(userId) {
        if (!this.chats) return [];
        return this.chats.filter(c => 
            c.participants && c.participants.includes(userId)
        ).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    addEvent(eventData) {
        if (!this.currentUser) return { success: false };
        const id = 'evt_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const newEvent = {
            id: id,
            creatorId: this.currentUser.id,
            createdAt: new Date().toISOString(),
            isActive: true,
            ...eventData
        };

        if (!this.events.some(e => e.id === id)) {
            this.events.push(newEvent);
        }

        db.collection('events').doc(id).set(newEvent)
            .catch(err => {
                console.error("addEvent Firestore write failed:", err);
                this.events = this.events.filter(e => e.id !== id);
                this.notify();
                showToast({
                    title: "Fehler beim Speichern ⚠️",
                    message: "Berechtigungsfehler oder Netzwerkfehler: " + err.message,
                    type: "error"
                });
            });

        this.notify();
        return { success: true };
    }

    updateEvent(eventId, updatedData) {
        const idx = this.events.findIndex(e => e.id === eventId);
        if (idx !== -1) {
            this.events[idx] = { ...this.events[idx], ...updatedData };
        }
        db.collection('events').doc(eventId).update(updatedData)
            .catch(err => {
                console.error("updateEvent Firestore write failed:", err);
                showToast({
                    title: "Fehler beim Aktualisieren ⚠️",
                    message: "Firestore-Berechtigung verweigert: " + err.message,
                    type: "error"
                });
            });
        this.notify();
        return { success: true };
    }

    deleteEvent(eventId) {
        db.collection('events').doc(eventId).delete()
            .catch(err => console.error("deleteEvent Firestore write failed:", err));
        return { success: true };
    }

    toggleEventActive(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            const nextActive = event.isActive === false ? true : false;
            db.collection('events').doc(eventId).update({ isActive: nextActive })
                .catch(err => console.error("toggleEventActive Firestore write failed:", err));
            event.isActive = nextActive;
            return { success: true, isActive: nextActive };
        }
        return { success: false };
    }

    addMusician(musicianData) {
        if (!this.currentUser) return { success: false };
        const id = 'mus_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const newMusician = {
            id: id,
            creatorId: this.currentUser.id,
            createdAt: new Date().toISOString(),
            photos: [],
            videos: [],
            audio: [],
            socialLinks: { spotify: "", youtube: "", instagram: "" },
            isActive: true,
            ...musicianData
        };

        if (!this.musicians.some(m => m.id === id)) {
            this.musicians.push(newMusician);
        }

        db.collection('musicians').doc(id).set(newMusician)
            .catch(err => {
                console.error("addMusician Firestore write failed:", err);
                this.musicians = this.musicians.filter(m => m.id !== id);
                this.notify();
                showToast({
                    title: "Fehler beim Speichern ⚠️",
                    message: "Berechtigungsfehler (z. B. Limit auf ein Profil) oder Netzwerkfehler: " + err.message,
                    type: "error"
                });
            });

        this.notify();
        return { success: true };
    }

    updateMusician(musicianId, updatedData) {
        const idx = this.musicians.findIndex(m => m.id === musicianId);
        if (idx !== -1) {
            this.musicians[idx] = { ...this.musicians[idx], ...updatedData };
        }
        db.collection('musicians').doc(musicianId).update(updatedData)
            .catch(err => {
                console.error("updateMusician Firestore write failed:", err);
                showToast({
                    title: "Fehler beim Aktualisieren ⚠️",
                    message: "Firestore-Berechtigung verweigert: " + err.message,
                    type: "error"
                });
            });
        this.notify();
        return { success: true };
    }

    async addMusicianApplication(musicianId, eventId) {
        if (!musicianId || !eventId) return { success: false };
        const musician = this.musicians.find(m => m.id === musicianId);
        if (!musician) return { success: false };
        const apps = musician.applications ? [...musician.applications] : [];
        if (!apps.some(a => a.eventId === eventId)) {
            apps.push({ eventId: eventId, status: 'contacted' });
            return this.updateMusician(musicianId, { applications: apps });
        }
        return { success: true };
    }

    async acceptMusicianRequest(musicianId, eventId) {
        if (!musicianId || !eventId) return { success: false };
        const interestId = `int_${musicianId}_${eventId}`;
        const interestRef = db.collection('interests').doc(interestId);
        const doc = await interestRef.get();
        if (doc.exists) {
            await interestRef.update({ organizerInterested: true, organizerNoInterest: false });
        } else {
            await interestRef.set({
                id: interestId,
                eventId: eventId,
                musicianId: musicianId,
                musicianInterested: true,
                organizerInterested: true,
                organizerNoInterest: false
            });
        }
        return { success: true };
    }

    async declineMusicianRequest(musicianId, eventId) {
        if (!musicianId || !eventId) return { success: false };
        const interestId = `int_${musicianId}_${eventId}`;
        const interestRef = db.collection('interests').doc(interestId);
        const doc = await interestRef.get();
        if (doc.exists) {
            await interestRef.update({ organizerNoInterest: true });
        } else {
            await interestRef.set({
                id: interestId,
                eventId: eventId,
                musicianId: musicianId,
                musicianInterested: true,
                organizerInterested: false,
                organizerNoInterest: true
            });
        }
        return { success: true };
    }

    deleteMusician(musicianId) {
        db.collection('musicians').doc(musicianId).delete()
            .catch(err => console.error("deleteMusician Firestore write failed:", err));
        return { success: true };
    }

    toggleMusicianActive(musicianId) {
        const musician = this.musicians.find(m => m.id === musicianId);
        if (musician) {
            const nextActive = musician.isActive === false ? true : false;
            db.collection('musicians').doc(musicianId).update({ isActive: nextActive })
                .catch(err => console.error("toggleMusicianActive Firestore write failed:", err));
            musician.isActive = nextActive;
            return { success: true, isActive: nextActive };
        }
        return { success: false };
    }

    logout() {
        auth.signOut().catch(err => console.error("Firebase signOut failed:", err));
        this.currentUser = null;
        this.notify();
    }

        isUnlocked(targetId) {
        if (!this.currentUser) return false;
        
        // Find if this is the user's own profile or event
        const isOwn = (this.musicians || []).some(m => m.id === targetId && m.creatorId === this.currentUser.id) ||
                      (this.events || []).some(e => e.id === targetId && e.creatorId === this.currentUser.id) ||
                      this.currentUser.profileId === targetId;
        if (isOwn) return true;
        
        // If organizer, unlimited unlock
        if (this.currentUser.role === 'organizer') return true;
        
        // Otherwise check unlocked list
        const unlockedList = this.currentUser.unlockedContacts || [];
        return unlockedList.includes(targetId);
    }

    async unlockContact(targetId) {
        if (!this.currentUser) return { success: false };
        if (this.isUnlocked(targetId)) return { success: true };
        
        if (this.currentUser.role === 'musician') {
            const credits = this.currentUser.credits || 0;
            if (credits < 1) return { success: false, message: "Nicht genÃ¼gend Credits." };
            
            this.currentUser.credits = credits - 1;
            if (!this.currentUser.unlockedContacts) this.currentUser.unlockedContacts = [];
            this.currentUser.unlockedContacts.push(targetId);
            
            // Save to Firestore & local storage
            db.collection('users').doc(this.currentUser.id).update({
                credits: this.currentUser.credits,
                unlockedContacts: this.currentUser.unlockedContacts
            }).catch(err => console.error("unlockContact Firestore update failed:", err));
            
            // Sync local storage
            const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
            const idx = registeredUsers.findIndex(usr => usr.id === this.currentUser.id);
            if (idx !== -1) {
                registeredUsers[idx].credits = this.currentUser.credits;
                registeredUsers[idx].unlockedContacts = this.currentUser.unlockedContacts;
                localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));
            }
            localStorage.setItem('GigConnAct_current_user', JSON.stringify(this.currentUser));
            
            this.notify();
            return { success: true };
        }
        return { success: false };
    }

    markChatAsRead(chatId) {
        if (!this.readChats) this.readChats = [];
        if (!this.readChats.includes(chatId)) {
            this.readChats.push(chatId);
            this.notify();
        }
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notify() {
        console.log("[DEBUG] State notify() triggered. activeMusicianId:", this.activeMusicianId, "activeEventId:", this.activeEventId);
        
        // Dynamically correct activeMusicianId and activeEventId if collections are loaded and there's a mismatch
        if (this.currentUser) {
            if (this.currentUser.role === 'musician' && this.musicians && this.musicians.length > 0) {
                const userProfiles = this.musicians.filter(m => m.creatorId === this.currentUser.id);
                if (userProfiles.length > 0) {
                    const isValid = userProfiles.some(m => m.id === this.activeMusicianId);
                    if (!isValid) {
                        console.log("[DEBUG] Correcting activeMusicianId from", this.activeMusicianId, "to", userProfiles[0].id);
                        this.activeMusicianId = userProfiles[0].id;
                        this.saveState();
                    }
                }
            } else if (this.currentUser.role === 'organizer' && this.events && this.events.length > 0) {
                const userEvents = this.events.filter(e => e.creatorId === this.currentUser.id);
                if (userEvents.length > 0) {
                    const isValid = userEvents.some(e => e.id === this.activeEventId);
                    if (!isValid) {
                        console.log("[DEBUG] Correcting activeEventId from", this.activeEventId, "to", userEvents[0].id);
                        this.activeEventId = userEvents[0].id;
                        this.saveState();
                    }
                }
            }
        }

        this.runDailyMatchCheck();
        this.saveState();
        this.listeners.forEach(callback => callback(this));
        document.dispatchEvent(new CustomEvent('user-state-changed'));
    }

    toggleFavorite(id) {
        if (!this.currentUser) return false;
        let favs = this.currentUser.favorites || [];
        const idx = favs.indexOf(id);
        if (idx === -1) {
            favs = [...favs, id];
        } else {
            favs = favs.filter(x => x !== id);
        }
        this.currentUser.favorites = favs;
        db.collection('users').doc(this.currentUser.id).update({ favorites: favs })
            .catch(err => console.error("toggleFavorite failed:", err));
        return true;
    }

    isFavorite(id) {
        if (!this.currentUser || !this.currentUser.favorites) return false;
        return this.currentUser.favorites.includes(id);
    }

    async initiateContact(targetId, targetName, eventId) {
        if (!this.currentUser) return { success: false, redirectAuth: true };
        
        const recipientId = eventId || targetId;
        const senderId = this.currentUser.role === 'musician' 
            ? (this.activeMusicianId || this.currentUser.profileId) 
            : (this.activeEventId || this.currentUser.id);

        let chat = this.chats.find(c => 
            c.participants.includes(senderId) && c.participants.includes(recipientId)
        );

        const newId = chat ? chat.id : "chat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);

        if (!chat) {
            chat = {
                id: newId,
                participants: [senderId, recipientId],
                messages: [],
                updatedAt: new Date().toISOString(),
                initiatorId: senderId
            };
            try {
                await db.collection('chats').doc(newId).set(chat);
            } catch (err) {
                console.error("initiateContact failed to create chat:", err);
            }
        }
        
        const newContactRequests = (this.currentUser.contactRequests || 0) + 1;
        try {
            await db.collection('users').doc(this.currentUser.id).update({
                contactRequests: newContactRequests
            });
        } catch (err) {
            console.error("initiateContact failed to update user requests:", err);
        }

        return { success: true, chatId: newId };
    }

    async sendMessage(recipientId, text, eventId) {
        if (!this.currentUser) return { success: false, message: "Bitte melde dich an." };
        const senderId = this.currentUser.role === 'musician' 
            ? (this.activeMusicianId || this.currentUser.profileId) 
            : (this.activeEventId || this.currentUser.id);
        
        if (!senderId) {
            return { success: false, message: "Kein aktives Absender-Profil gefunden. Bitte wähle ein Profil aus." };
        }
        if (!recipientId) {
            return { success: false, message: "Kein Empfänger für diesen Chat definiert." };
        }

        let chat = this.chats.find(c => 
            c.participants.includes(senderId) && c.participants.includes(recipientId)
        );

        const newId = chat ? chat.id : "chat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
        
        const newMessage = {
            senderId: senderId,
            text: text,
            timestamp: new Date().toISOString()
        };

        if (!chat) {
            chat = {
                id: newId,
                participants: [senderId, recipientId],
                messages: [newMessage],
                updatedAt: new Date().toISOString(),
                initiatorId: senderId
            };
            if (eventId) chat.eventId = eventId;
            try {
                await db.collection('chats').doc(newId).set(chat);
            } catch (err) {
                console.error("sendMessage failed to create chat:", err);
                return { success: false, message: "Fehler beim Erstellen des Chats: " + err.message };
            }
        } else {
            const updatedMessages = [...(chat.messages || []), newMessage];
            try {
                await db.collection('chats').doc(newId).update({
                    messages: updatedMessages,
                    updatedAt: new Date().toISOString()
                });
            } catch (err) {
                console.error("sendMessage failed to update chat:", err);
                return { success: false, message: "Fehler beim Senden der Nachricht: " + err.message };
            }
        }

        if (!this.readChats.includes(newId)) {
            this.readChats.push(newId);
            this.notify();
        }

        return { success: true, chatId: newId };
    }

    async addSystemNotification(recipientId, text) {
        let chat = this.chats.find(c => c.participants.includes(recipientId) && c.participants.includes("system"));
        const newId = chat ? chat.id : "chat_sys_" + Math.random().toString(36).substr(2, 9);
        
        const newMessage = {
            senderId: "system",
            text,
            timestamp: new Date().toISOString()
        };

        if (!chat) {
            chat = {
                id: newId,
                participants: [recipientId, "system"],
                messages: [newMessage],
                updatedAt: new Date().toISOString()
            };
            try {
                await db.collection('chats').doc(newId).set(chat);
            } catch (err) {
                console.error("addSystemNotification failed to create chat:", err);
            }
        } else {
            const updatedMessages = [...chat.messages, newMessage];
            try {
                await db.collection('chats').doc(newId).update({
                    messages: updatedMessages,
                    updatedAt: new Date().toISOString()
                });
            } catch (err) {
                console.error("addSystemNotification failed to update chat:", err);
            }
        }
        
        this.readChats = this.readChats.filter(id => id !== newId);
        
        const user = this.currentUser;
        if (user) {
            if (typeof window.addMockEmail === 'function') {
                window.addMockEmail(
                    `Systembenachrichtigung: ${text.length > 40 ? text.substring(0, 40) + '...' : text}`,
                    `GigConnAct System <system@gigconnact.de>`,
                    `Hallo ${user.firstName},\n\ndu hast eine neue Systembenachrichtigung in deinem GigConnAct-Postfach erhalten:\n\n"${text}"`
                );
            }
        }
    }

    getInitialChats() {
        return [
            {
                id: "chat_demo_1",
                participants: ["mus_1", "org_1"],
                messages: [
                    { senderId: "org_1", text: "Hallo! Wir finden euren Sound absolut genial. Hätten ihr Zeit, bei unserer Hochzeit zu spielen?", timestamp: "2026-07-12T14:30:00Z" },
                    { senderId: "mus_1", text: "Hallo Julia! Vielen Dank für die Anfrage. Der 15. August 2026 passt uns super. Welche Art von Songs wünscht ihr euch?", timestamp: "2026-07-12T15:15:00Z" },
                    { senderId: "org_1", text: "Hauptsächlich Pop-Cover für die Party am Abend und etwas Ruhiges für den Sektempfang. Das Budget liegt bei ca. 800-1000 EUR.", timestamp: "2026-07-12T16:00:00Z" }
                ],
                updatedAt: "2026-07-12T16:00:00Z"
            }
        ];
    }

    async loginAsDemoUser(email) {
        const snapshot = await db.collection('users').where('email', '==', email.toLowerCase()).limit(1).get();
        if (!snapshot.empty) {
            this.currentUser = snapshot.docs[0].data();
            if (this.currentUser.role === 'musician') {
                this.activeMusicianId = this.activeMusicianId && this.musicians.some(m => m.id === this.activeMusicianId)
                    ? this.activeMusicianId
                    : (this.musicians.find(m => m.creatorId === this.currentUser.id)?.id || this.currentUser.profileId || null);
            } else {
                this.activeEventId = this.events.find(e => e.creatorId === this.currentUser.id)?.id || null;
            }
            this.notify();
            return { success: true };
        } else {
            const mockUid = "demo_" + Date.now();
            const profileId = "mus_" + mockUid;
            const newUser = {
                id: mockUid,
                role: 'musician',
                firstName: 'Demo-Musiker',
                lastName: 'Gast',
                company: 'Privatperson',
                phone: '+49 170 1234567',
                email: email,
                profileId: profileId,
                isPremium: true,
                credits: 5,
                unlockedContacts: [],
                successfulGigs: 0,
                contactRequests: 0,
                favorites: [],
                interests: []
            };
            await db.collection('users').doc(mockUid).set(newUser);
            
            const newMusician = {
                id: profileId,
                name: "Demo Musiker",
                bluffName: "Akustik-Solo-Künstler",
                type: "Solo",
                location: "München",
                locations: ["München"],
                radius: 100,
                genres: ["Pop", "Rock"],
                instruments: ["Gesang", "Akustikgitarre"],
                minDuration: 1,
                maxDuration: 3,
                minBudget: 150,
                maxBudget: 1000,
                eventTypes: ["Geburtstag", "Sommerfest"],
                availability: {
                    friday: { available: true, startTime: '18:00', endTime: '23:59' },
                    saturday: { available: true, startTime: '00:01', endTime: '23:59' }
                },
                minPublikum: 0,
                maxPublikum: 500,
                description: "Professioneller Solo-Künstler für Events aller Art.",
                technik: ["Technik vorhanden"],
                company: "Privatperson",
                contactName: "Demo-Musiker Gast",
                phone: "+49 170 1234567",
                email: email,
                isPremium: false,
                subscriptionPlan: "flex",
                credits: 5,
                unlockedContacts: [],
                socialLinks: { spotify: "", youtube: "", instagram: "" },
                photos: [],
                videos: [],
                audio: [],
                creatorId: mockUid
            };
            await db.collection('musicians').doc(profileId).set(newMusician);
            
            this.currentUser = newUser;
            this.notify();
            return { success: true };
        }
    }

    async registerOnTheFly(email, role) {
        const mockUid = "demo_" + Date.now();
        const profileId = role === 'musician' ? 'mus_' + mockUid : 'evt_' + mockUid;
        
        const newUser = {
            id: mockUid,
            role: role,
            firstName: role === 'musician' ? 'Demo-Musiker' : 'Demo-Veranstalter',
            lastName: 'Gast',
            company: 'Privatperson',
            organizerType: role === 'organizer' ? 'Privater Veranstalter' : '',
            phone: '+49 170 1234567',
            email: email,
            profileId: profileId,
            isPremium: true,
            credits: role === 'musician' ? 5 : 0,
            unlockedContacts: [],
            successfulGigs: 0,
            contactRequests: 0,
            favorites: [],
            interests: []
        };

        try {
            await db.collection('users').doc(mockUid).set(newUser);
            
            if (role === 'musician') {
                const newMusician = {
                    id: profileId,
                    name: "Demo Musiker",
                    bluffName: "Akustik-Solo-Künstler",
                    type: "Solo",
                    location: "München",
                    locations: ["München"],
                    radius: 100,
                    genres: ["Pop", "Rock"],
                    instruments: ["Gesang", "Akustikgitarre"],
                    minDuration: 1,
                    maxDuration: 3,
                    minBudget: 150,
                    maxBudget: 1000,
                    eventTypes: ["Geburtstag", "Sommerfest"],
                    availability: {
                        friday: { available: true, startTime: '18:00', endTime: '23:59' },
                        saturday: { available: true, startTime: '00:01', endTime: '23:59' }
                    },
                    minPublikum: 0,
                    maxPublikum: 500,
                    description: "Professioneller Solo-Künstler für Events aller Art.",
                    technik: ["Technik vorhanden"],
                    company: "Privatperson",
                    contactName: "Demo-Musiker Gast",
                    phone: "+49 170 1234567",
                    email: email,
                    isPremium: false,
                    subscriptionPlan: "flex",
                    credits: 5,
                    unlockedContacts: [],
                    socialLinks: { spotify: "", youtube: "", instagram: "" },
                    photos: [],
                    videos: [],
                    audio: [],
                    creatorId: mockUid
                };
                await db.collection('musicians').doc(profileId).set(newMusician);
            } else {
                const newEvent = {
                    id: profileId,
                    name: "Demo Veranstaltung",
                    type: "Geburtstag",
                    eventTypes: ["Geburtstag"],
                    date: "2026-08-15",
                    dates: ["2026-08-15"],
                    location: "München",
                    locations: ["München"],
                    genres: ["Pop", "Rock"],
                    instruments: ["Gesang", "Akustikgitarre"],
                    minDuration: 2.0,
                    maxDuration: 4.0,
                    duration: 4.0,
                    minPublikum: 50,
                    maxPublikum: 150,
                    publikum: "50 - 150",
                    minBudget: 300,
                    maxBudget: 800,
                    description: "Private Feier in München. Wir suchen einen netten Live-Act.",
                    technik: ["Technik ist noch unklar"],
                    company: "Privatperson",
                    organizerType: "Privater Veranstalter",
                    contactName: "Demo-Veranstalter Gast",
                    phone: "+49 170 1234567",
                    email: email,
                    isOnline: true,
                    creatorId: mockUid
                };
                await db.collection('events').doc(profileId).set(newEvent);
            }
            this.currentUser = newUser;
            this.notify();
            return { success: true };
        } catch (err) {
            console.error("registerOnTheFly failed:", err);
            return { success: false, message: err.message };
        }
    }

    async registerPasswordless(payload) {
        try {
            const emailLower = payload.email.toLowerCase();
            const emailExistsLocal = this.musicians.some(m => m.email && m.email.toLowerCase() === emailLower) || 
                                     this.events.some(e => e.email && e.email.toLowerCase() === emailLower);
            
            const snapshot = await db.collection('users').where('email', '==', payload.email).get();
            if (emailExistsLocal || !snapshot.empty) {
                return { success: false, message: "Diese E-Mail-Adresse wird bereits verwendet." };
            }

            const sendCustomSignInEmail = firebase.app().functions('europe-west3').httpsCallable('sendCustomSignInEmail');
            await sendCustomSignInEmail({
                email: payload.email,
                name: payload.firstName ? `${payload.firstName} ${payload.lastName}` : (payload.contactName || 'Nutzer'),
                isNewUser: true,
                role: payload.role
            });

            window.localStorage.setItem('emailForSignIn', payload.email);
            window.localStorage.setItem('GigConnAct_pending_registration', JSON.stringify(payload));
            return { success: true };
        } catch (err) {
            console.error("registerPasswordless failed:", err);
            return { success: false, message: err.message || "Registrierung fehlgeschlagen." };
        }
    }

    async loginPasswordless(email) {
        try {
            const emailLower = email.toLowerCase();
            const emailExistsLocal = this.musicians.some(m => m.email && m.email.toLowerCase() === emailLower) || 
                                     this.events.some(e => e.email && e.email.toLowerCase() === emailLower);
            
            const snapshot = await db.collection('users').where('email', '==', email).get();
            const isExisting = emailExistsLocal || !snapshot.empty;
            
            if (!isExisting) {
                return { success: false, message: "Diese E-Mail-Adresse ist nicht registriert. Bitte erstelle zuerst ein Konto unter 'Registrieren'." };
            }

            const sendCustomSignInEmail = firebase.app().functions('europe-west3').httpsCallable('sendCustomSignInEmail');
            await sendCustomSignInEmail({
                email: email,
                name: 'Nutzer', // Will load actual name dynamically in backend
                isNewUser: false
            });

            window.localStorage.setItem('emailForSignIn', email);
            return { success: true, isNewUser: false };
        } catch (err) {
            console.error("loginPasswordless failed:", err);
            return { success: false, message: err.message || "Fehler beim Generieren des Anmeldelinks." };
        }
    }

    async confirmPendingRegistration() {
        const pendingRegStr = window.localStorage.getItem('GigConnAct_pending_registration');
        const pendingReg = pendingRegStr ? JSON.parse(pendingRegStr) : null;
        if (!pendingReg) return { success: false, message: "Keine ausstehende Registrierung gefunden." };

        const email = pendingReg.email.toLowerCase();
        // Create user in users and musicians/events
        const mockUid = "demo_" + Date.now();
        const profileId = pendingReg.role === 'musician' ? 'mus_' + mockUid : 'evt_' + mockUid;

        const newUser = {
            id: mockUid,
            role: pendingReg.role,
            firstName: pendingReg.firstName,
            lastName: pendingReg.lastName,
            company: pendingReg.company || "Privatperson",
            organizerType: pendingReg.organizerType || "",
            phone: pendingReg.phone,
            hidePhone: pendingReg.hidePhone || false,
            email: pendingReg.email,
            profileId: profileId,
            isPremium: pendingReg.role === "musician" ? pendingReg.sepaConsent : true,
            successfulGigs: 0,
            contactRequests: 0,
            favorites: [],
            interests: []
        };

        try {
            await db.collection('users').doc(mockUid).set(newUser);

            if (pendingReg.role === 'musician') {
                const newMusician = {
                    id: profileId,
                    name: pendingReg.bandName,
                    bluffName: `Anonyme/r ${pendingReg.musicianType} (${pendingReg.genres[0] || 'Musik'})`,
                    type: pendingReg.musicianType,
                    location: pendingReg.locations ? pendingReg.locations.join(', ') : (pendingReg.location || 'München'),
                    locations: pendingReg.locations || [pendingReg.location || 'München'],
                    radius: parseInt(pendingReg.radius) || 50,
                    genres: pendingReg.genres,
                    instruments: pendingReg.instruments,
                    minDuration: parseFloat(pendingReg.minDuration) || 1,
                    maxDuration: parseFloat(pendingReg.maxDuration) || 3,
                    minBudget: parseFloat(pendingReg.minBudget) || 150,
                    maxBudget: parseFloat(pendingReg.maxBudget) || 1000,
                    eventTypes: pendingReg.eventTypes,
                    availability: pendingReg.availability,
                    minPublikum: parseInt(pendingReg.minPublikum) || 0,
                    maxPublikum: parseInt(pendingReg.maxPublikum) || 500,
                    description: pendingReg.description,
                    technik: pendingReg.technik || ["Technik ist noch unklar"],
                    company: newUser.company || "Privatperson",
                    contactName: `${newUser.firstName} ${newUser.lastName}`,
                    phone: newUser.phone,
                    hidePhone: pendingReg.hidePhone || false,
                    email: newUser.email,
                    isPremium: newUser.isPremium,
                    subscriptionPlan: pendingReg.subscriptionPlan || "flex",
                    credits: 5,
                    unlockedContacts: [],
                    socialLinks: { spotify: "", youtube: "", instagram: "" },
                    photos: pendingReg.photos || [],
                    videos: pendingReg.videos || [],
                    audio: [],
                    creatorId: mockUid
                };
                await db.collection('musicians').doc(profileId).set(newMusician);
            } else {
                const newEvent = {
                    id: profileId,
                    name: pendingReg.eventName,
                    type: pendingReg.orgEventTypes ? pendingReg.orgEventTypes[0] : "",
                    eventTypes: pendingReg.orgEventTypes || [],
                    date: pendingReg.eventDates ? pendingReg.eventDates[0] : "",
                    dates: pendingReg.eventDates || [],
                    eventStartTime: pendingReg.eventStartTime || "18:00",
                    eventEndTime: pendingReg.eventEndTime || "22:00",
                    location: pendingReg.orgLocations ? pendingReg.orgLocations.join(', ') : "",
                    locations: pendingReg.orgLocations || [],
                    genres: pendingReg.orgGenres || [],
                    instruments: pendingReg.orgInstruments || [],
                    minDuration: parseFloat(pendingReg.orgMinDuration) || 2.0,
                    maxDuration: parseFloat(pendingReg.orgMaxDuration) || 4.0,
                    duration: parseFloat(pendingReg.orgMinDuration) || 2.0,
                    minPublikum: parseInt(pendingReg.orgMinPublikum) || 50,
                    maxPublikum: parseInt(pendingReg.orgMaxPublikum) || 150,
                    publikum: `${pendingReg.orgMinPublikum || 50} - ${pendingReg.orgMaxPublikum || 150}`,
                    minBudget: parseFloat(pendingReg.orgMinBudget) || 300,
                    maxBudget: parseFloat(pendingReg.orgMaxBudget) || 800,
                    budget: parseFloat(pendingReg.orgMinBudget) || 300,
                    description: pendingReg.orgDescription || "",
                    technik: pendingReg.technik || ["Technik ist noch unklar"],
                    company: newUser.company || "Privatperson",
                    organizerType: newUser.organizerType || "Privater Veranstalter",
                    contactName: `${newUser.firstName} ${newUser.lastName}`,
                    phone: newUser.phone,
                    hidePhone: pendingReg.hidePhone || false,
                    email: newUser.email,
                    isOnline: true,
                    creatorId: mockUid
                };
                await db.collection('events').doc(profileId).set(newEvent);
            }
            window.localStorage.removeItem('GigConnAct_pending_registration');
            this.currentUser = newUser;
            this.notify();
            return { success: true };
        } catch (err) {
            console.error("confirmPendingRegistration failed:", err);
            return { success: false, message: err.message };
        }
    }
}


/* StateManager clean */

// ==========================================
// 3. MATCHING LOGIC
// ==========================================

function getEstimatedDistance(city1, city2) {
    const c1 = city1.trim().toLowerCase();
    const c2 = city2.trim().toLowerCase();
    if (c1 === c2) return 0;
    
    const key = [c1, c2].sort().join("-");
    const distances = {
        "augsburg-münchen": 80,
        "augsburg-stuttgart": 150,
        "augsburg-nürnberg": 140,
        "münchen-nürnberg": 170,
        "münchen-stuttgart": 220,
        "nürnberg-stuttgart": 210
    };
    return distances[key] !== undefined ? distances[key] : 250;
}

function getWeekdayFromDate(dateStr) {
    const date = new Date(dateStr);
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekdays[date.getDay()];
}

function expandList(arr) {
    if (!arr) return [];
    const sourceArr = Array.isArray(arr) ? arr : [arr];
    let result = [];
    sourceArr.forEach(item => {
        const s = String(item).trim();
        const sLower = s.toLowerCase();
        if (sLower === 'klavier/piano') {
            result.push('klavier');
        } else if (sLower === 'percussion/cajón' || sLower === 'percussion/cajon' || sLower === 'cajon') {
            result.push('percussion');
        } else if (sLower === 'r&b/soul') {
            result.push('r&b');
            result.push('soul');
        } else {
            result.push(sLower);
        }
    });
    return result;
}

function calculateMatch(musician, event, searcherRole = 'musician') {
    if (!musician || !event) {
        return { score: 0, breakdown: {}, matchedCount: 0 };
    }

    // 1. Musiker-Typ (20 %)
    let typeScore = 0;
    const eventTypesRaw = event.musicianTypes || [];
    const eventTypes = Array.isArray(eventTypesRaw) 
        ? eventTypesRaw.map(t => String(t).trim().toLowerCase())
        : (typeof eventTypesRaw === 'string' ? eventTypesRaw.split(',').map(t => t.trim().toLowerCase()) : []);

    const musTypesRaw = musician.type || musician.musicianTypes || '';
    const musTypes = Array.isArray(musTypesRaw)
        ? musTypesRaw.map(t => String(t).trim().toLowerCase())
        : (typeof musTypesRaw === 'string' ? musTypesRaw.split(',').map(t => t.trim().toLowerCase()) : []);

    if (eventTypes.some(t => musTypes.includes(t))) {
        typeScore = 20;
    }

    // 2. Ort (10 %)
    let ortScore = 0;
    const distance = getEstimatedDistance(musician.location, event.location);
    if (searcherRole === 'musician') {
        if (distance <= (musician.radius || 100)) {
            ortScore = 10;
        }
    } else { // organizer
        const eventRadius = event.radius || 100;
        if (distance <= eventRadius) {
            ortScore = 10;
        }
    }

    // 3. Genres (20 %)
    let genresScore = 0;
    const evGenres = expandList(event.genres);
    const musGenres = expandList(musician.genres);
    if (evGenres.length > 0) {
        const commonGenres = evGenres.filter(g => musGenres.includes(g));
        genresScore = (commonGenres.length / evGenres.length) * 20;
    }

    // 4. Instrumente (5 %)
    let instScore = 0;
    const evInst = expandList(event.instruments);
    const musInst = expandList(musician.instruments);
    if (evInst.length > 0) {
        const commonInst = evInst.filter(i => musInst.includes(i));
        instScore = (commonInst.length / evInst.length) * 5;
    }

    // 5. Spielzeit (5 %)
    let durScore = 0;
    const evMinD = event.minDuration !== undefined ? event.minDuration : (event.duration || 0);
    const evMaxD = event.maxDuration !== undefined ? event.maxDuration : (event.duration || 24);
    const musMinD = musician.minDuration !== undefined ? musician.minDuration : 0;
    const musMaxD = musician.maxDuration || 24;
    
    if (searcherRole === 'musician') {
        if (evMaxD >= musMinD && evMinD <= musMaxD) {
            durScore = 5;
        }
    } else { // organizer
        if (evMinD >= musMinD && evMaxD <= musMaxD) {
            durScore = 5;
        }
    }

    // 6. Gage (5 %)
    let budgetScore = 0;
    const evMinB = event.minBudget !== undefined ? event.minBudget : (event.budget || 0);
    const evMaxB = event.maxBudget !== undefined ? event.maxBudget : (event.budget || 5000);
    const musMinB = musician.minBudget || 0;
    const musMaxB = musician.maxBudget !== undefined ? musician.maxBudget : (musician.minBudget || 5000);

    if (searcherRole === 'musician') {
        if (evMaxB >= musMinB && evMinB <= musMaxB) {
            budgetScore = 5;
        }
    } else { // organizer
        if (evMinB >= musMinB && evMaxB <= musMaxB) {
            budgetScore = 5;
        }
    }

    // 7. Event-Typ (20 %)
    let eventTypeScore = 0;
    const musEventTypesRaw = musician.eventTypes || [];
    const musEventTypes = Array.isArray(musEventTypesRaw)
        ? musEventTypesRaw.map(t => String(t).trim().toLowerCase())
        : (typeof musEventTypesRaw === 'string' ? musEventTypesRaw.split(',').map(t => t.trim().toLowerCase()) : []);

    const evType = event.type || event.eventType || '';
    let evTypes = event.eventTypes;
    if (!evTypes) {
        evTypes = Array.isArray(evType)
            ? evType.map(t => String(t).trim().toLowerCase())
            : (typeof evType === 'string' ? evType.split(',').map(s => s.trim().toLowerCase()) : []);
    } else {
        evTypes = Array.isArray(evTypes)
            ? evTypes.map(t => String(t).trim().toLowerCase())
            : (typeof evTypes === 'string' ? evTypes.split(',').map(s => s.trim().toLowerCase()) : []);
    }

    if (evTypes.some(t => musEventTypes.includes(t.toLowerCase()))) {
        eventTypeScore = 20;
    }

    // 8. Verfügbarkeit / Datum (5 %)
    let dateScore = 0;
    let isAvailable = false;
    if (musician.availability) {
        if (Array.isArray(musician.availability)) {
            if (musician.availability.includes(event.date)) {
                isAvailable = true;
            } else {
                const eventWeekday = getWeekdayFromDate(event.date);
                if (musician.availability.includes(eventWeekday)) {
                    isAvailable = true;
                }
            }
        } else if (typeof musician.availability === 'object') {
            const eventWeekday = getWeekdayFromDate(event.date).toLowerCase();
            if (musician.availability[eventWeekday] !== undefined) {
                isAvailable = !!musician.availability[eventWeekday].available;
            } else {
                const isModified = musician.availability.modifiedDates && musician.availability.modifiedDates.includes(event.date);
                if (musician.availability.defaultState === 'all-selected') {
                    isAvailable = !isModified;
                } else {
                    isAvailable = isModified;
                }
            }
        }
    }
    if (isAvailable) {
        dateScore = 5;
    }

    // 9. Publikum (10 %)
    let publikumScore = 0;
    const evMinP = event.minPublikum || 0;
    const evMaxP = event.maxPublikum !== undefined ? event.maxPublikum : (event.minPublikum || 500);
    const musMinP = musician.minPublikum || 0;
    const musMaxP = musician.maxPublikum !== undefined ? musician.maxPublikum : (musician.minPublikum || 500);
    if (evMinP >= musMinP && evMaxP <= musMaxP) {
        publikumScore = 10;
    }

    // 10. Weitere Kriterien (5 %)
    let matchesCount = 0;
    const musTech = Array.isArray(musician.technik) ? musician.technik : [musician.technik || "Technik ist noch unklar"];
    const evTech = Array.isArray(event.technik) ? event.technik : [event.technik || "Technik ist noch unklar"];
    const possibleTech = ["Technik vorhanden", "Technik ist noch unklar", "Technik nicht vorhanden"];
    possibleTech.forEach(opt => {
        if (musTech.includes(opt) && evTech.includes(opt)) {
            matchesCount++;
        }
    });
    
    let extraScore = (matchesCount / 3) * 5;
    const totalScore = Math.round(typeScore + ortScore + genresScore + instScore + durScore + budgetScore + eventTypeScore + dateScore + publikumScore + extraScore);

    const breakdown = {
        type: typeScore > 0,
        ort: ortScore > 0,
        genres: genresScore > 0,
        instruments: instScore > 0,
        duration: durScore > 0,
        budget: budgetScore > 0,
        eventType: eventTypeScore > 0,
        date: dateScore > 0,
        publikum: publikumScore > 0,
        extra: extraScore > 0
    };

    return {
        score: Math.min(100, Math.max(0, totalScore)),
        breakdown,
        matchedCount: typeScore > 0 ? 1 : 0
    };
}

function checkAndNotifyMatches(stateManager, showToastCallback) {
    if (!stateManager.currentUser) return;

    const userRole = stateManager.currentUser.role;
    const userId = stateManager.currentUser.id;
    const userProfileId = stateManager.currentUser.profileId;

    if (userRole === "musician") {
        const musician = stateManager.musicians.find(m => m.id === userProfileId);
        if (!musician) return;

        stateManager.events.forEach(event => {
            const match = calculateMatch(musician, event, 'musician');
            if (match.score > 49) {
                const chats = stateManager.getChatsForUser(userId);
                const hasSystemChat = chats.some(c => c.participants.includes("system") && c.participants.includes(musician.id));
                
                let alreadyNotified = false;
                if (hasSystemChat) {
                    const systemChat = chats.find(c => c.participants.includes("system") && c.participants.includes(musician.id));
                    alreadyNotified = systemChat.messages.some(m => m.text.includes(event.name) || m.text.includes(event.id));
                }

                if (!alreadyNotified) {
                    const messageText = `🚨 GIG-MATCH ALERT (${match.score}% Übereinstimmung): Das Event '${event.name}' in ${event.location} am ${event.date} passt hervorragend zu Ihrem Profil! (ID: ${event.id})`;
                    stateManager.addSystemNotification(musician.id, messageText);
                    
                    /*
                    if (showToastCallback) {
                        showToastCallback({
                            title: `Neues passendes Event! (${match.score}%)`,
                            message: `'${event.name}' entspricht Ihren Filtern.`,
                            actionTab: "postbox"
                        });
                    }
                    */
                }
            }
        });
    } else if (userRole === "organizer") {
        const myEvents = stateManager.events.filter(e => e.creatorId === userId);
        myEvents.forEach(event => {
            stateManager.musicians.forEach(musician => {
                const match = calculateMatch(musician, event, 'organizer');
                if (match.score > 49) {
                    const chats = stateManager.getChatsForUser(event.id);
                    const hasSystemChat = chats.some(c => c.participants.includes("system") && c.participants.includes(event.id));
                    
                    let alreadyNotified = false;
                    if (hasSystemChat) {
                        const systemChat = chats.find(c => c.participants.includes("system") && c.participants.includes(event.id));
                        alreadyNotified = systemChat.messages.some(m => m.text.includes(musician.name) || m.text.includes(musician.id));
                    }

                    if (!alreadyNotified) {
                        const messageText = `🚨 MUSIKER-MATCH ALERT (${match.score}% Übereinstimmung): Der Musiker/die Band '${musician.name}' passt optimal zu Ihrem Event '${event.name}'. (ID: ${musician.id})`;
                        stateManager.addSystemNotification(event.id, messageText);

                        /*
                        if (showToastCallback) {
                            showToastCallback({
                                title: `Passender Musiker gefunden! (${match.score}%)`,
                                message: `'${musician.name}' passt zu Ihrer Veranstaltung.`,
                                actionTab: "postbox"
                            });
                        }
                        */
                    }
                }
            });
        });
    }
}

// ==========================================
// 4. UI COMPONENT RENDERING
// ==========================================

function showToast(options) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon"><i class="fa-solid fa-bell"></i></div>
        <div class="toast-body">
            <div class="toast-title">${options.title}</div>
            <div class="toast-message">${options.message}</div>
        </div>
        <button class="toast-close"><i class="fa-solid fa-xmark"></i></button>
    `;

    toast.addEventListener('click', (e) => {
        if (e.target.closest('.toast-close')) {
            toast.remove();
            return;
        }
        if (options.actionTab && window.appNavigate) {
            window.appNavigate(options.actionTab);
            toast.remove();
        }
    });

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s forwards';
        setTimeout(() => toast.remove(), 500);
    }, 6000);
}
window.showToast = showToast;

function renderHeroTabContent(isMusician) {
    if (isMusician) {
        return `
            <div class="hero-benefit-cards" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.2rem; text-align: left; margin-top: 1.4rem;">
                
                <div style="background: rgba(124, 58, 237, 0.14); border: 1.5px solid rgba(168, 85, 247, 0.45); border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);">
                    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                        <i class="fa-solid fa-circle-check" style="color: #a855f7; font-size: 1.2rem;"></i>
                        <h4 style="color: #a855f7; font-weight: 900; margin: 0; font-size: 1rem;">Kostenloser Zugang zu Events</h4>
                    </div>
                    <p style="margin: 0; font-size: 0.84rem; color: #000000; font-weight: 600; line-height: 1.45; padding-left: 1.8rem;">Hochzeiten, Geburtstage, Firmenfeiern, Kirmes, Gartenpartys etc.</p>
                </div>

                <div style="background: rgba(124, 58, 237, 0.14); border: 1.5px solid rgba(168, 85, 247, 0.45); border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);">
                    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                        <i class="fa-solid fa-circle-check" style="color: #a855f7; font-size: 1.2rem;"></i>
                        <h4 style="color: #a855f7; font-weight: 900; margin: 0; font-size: 1rem;">Passende Events</h4>
                    </div>
                    <p style="margin: 0; font-size: 0.84rem; color: #000000; font-weight: 600; line-height: 1.45; padding-left: 1.8rem;">Event-Art, Entfernung, Gage, VerfÜgbarkeit etc.</p>
                </div>

                <div style="background: rgba(124, 58, 237, 0.14); border: 1.5px solid rgba(168, 85, 247, 0.45); border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);">
                    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                        <i class="fa-solid fa-circle-check" style="color: #a855f7; font-size: 1.2rem;"></i>
                        <h4 style="color: #a855f7; font-weight: 900; margin: 0; font-size: 1rem;">Direkter Kontakt zu Veranstaltern</h4>
                    </div>
                    <p style="margin: 0; font-size: 0.84rem; color: #000000; font-weight: 600; line-height: 1.45; padding-left: 1.8rem;">Telefonnummern, Mail-Adressen, Nachrichten im GigConnAct-Postfach</p>
                </div>

                <div style="background: rgba(124, 58, 237, 0.14); border: 1.5px solid rgba(168, 85, 247, 0.45); border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);">
                    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                        <i class="fa-solid fa-circle-check" style="color: #a855f7; font-size: 1.2rem;"></i>
                        <h4 style="color: #a855f7; font-weight: 900; margin: 0; font-size: 1rem;">Interessante Anfragen</h4>
                    </div>
                    <p style="margin: 0; font-size: 0.84rem; color: #000000; font-weight: 600; line-height: 1.45; padding-left: 1.8rem;">Nicht nur Anfragen an Veranstalter senden – sondern auch erhalten</p>
                </div>

                <div style="background: rgba(124, 58, 237, 0.14); border: 1.5px solid rgba(168, 85, 247, 0.45); border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);">
                    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                        <i class="fa-solid fa-circle-check" style="color: #a855f7; font-size: 1.2rem;"></i>
                        <h4 style="color: #a855f7; font-weight: 900; margin: 0; font-size: 1rem;">Top-VorschlÄge</h4>
                    </div>
                    <p style="margin: 0; font-size: 0.84rem; color: #000000; font-weight: 600; line-height: 1.45; padding-left: 1.8rem;">Automatische Empfehlungen von GigConnAct zu Events</p>
                </div>

                <div style="background: rgba(124, 58, 237, 0.14); border: 1.5px solid rgba(168, 85, 247, 0.45); border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);">
                    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                        <i class="fa-solid fa-circle-check" style="color: #a855f7; font-size: 1.2rem;"></i>
                        <h4 style="color: #a855f7; font-weight: 900; margin: 0; font-size: 1rem;">Schnelle Anmeldung</h4>
                    </div>
                    <p style="margin: 0; font-size: 0.84rem; color: #000000; font-weight: 600; line-height: 1.45; padding-left: 1.8rem;">Anlegen des Musiker-Profils ohne Passwort</p>
                </div>

                <div style="background: rgba(124, 58, 237, 0.14); border: 1.5px solid rgba(168, 85, 247, 0.45); border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);">
                    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                        <i class="fa-solid fa-circle-check" style="color: #a855f7; font-size: 1.2rem;"></i>
                        <h4 style="color: #a855f7; font-weight: 900; margin: 0; font-size: 1rem;">Keine Provisionskosten</h4>
                    </div>
                    <p style="margin: 0; font-size: 0.84rem; color: #000000; font-weight: 600; line-height: 1.45; padding-left: 1.8rem;">Preiswertes Abo-Modell (jederzeit kÜndbar)</p>
                </div>

            </div>
        `;
    } else {
        return `
            <div class="hero-benefit-cards" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.2rem; text-align: left; margin-top: 1.4rem;">
                
                <div style="background: rgba(37, 99, 235, 0.14); border: 1.5px solid rgba(96, 165, 250, 0.45); border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);">
                    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                        <i class="fa-solid fa-circle-check" style="color: #38bdf8; font-size: 1.2rem;"></i>
                        <h4 style="color: #38bdf8; font-weight: 900; margin: 0; font-size: 1rem;">Kostenloser Zugang zu Musikern</h4>
                    </div>
                    <p style="margin: 0; font-size: 0.84rem; color: #000000; font-weight: 600; line-height: 1.45; padding-left: 1.8rem;">Coverbands, Bands, DJs, Duos, Trios, Gitarristen, SÄnger etc.</p>
                </div>

                <div style="background: rgba(37, 99, 235, 0.14); border: 1.5px solid rgba(96, 165, 250, 0.45); border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);">
                    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                        <i class="fa-solid fa-circle-check" style="color: #38bdf8; font-size: 1.2rem;"></i>
                        <h4 style="color: #38bdf8; font-weight: 900; margin: 0; font-size: 1rem;">Passende Musiker</h4>
                    </div>
                    <p style="margin: 0; font-size: 0.84rem; color: #000000; font-weight: 600; line-height: 1.45; padding-left: 1.8rem;">Musiker-Typ, Budget, Genre, Spieldauer etc.</p>
                </div>

                <div style="background: rgba(37, 99, 235, 0.14); border: 1.5px solid rgba(96, 165, 250, 0.45); border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);">
                    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                        <i class="fa-solid fa-circle-check" style="color: #38bdf8; font-size: 1.2rem;"></i>
                        <h4 style="color: #38bdf8; font-weight: 900; margin: 0; font-size: 1rem;">Direkter Kontakt zu Musikern</h4>
                    </div>
                    <p style="margin: 0; font-size: 0.84rem; color: #000000; font-weight: 600; line-height: 1.45; padding-left: 1.8rem;">Telefonnummern, Mail-Adressen, Nachrichten im GigConnAct-Postfach</p>
                </div>

                <div style="background: rgba(37, 99, 235, 0.14); border: 1.5px solid rgba(96, 165, 250, 0.45); border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);">
                    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                        <i class="fa-solid fa-circle-check" style="color: #38bdf8; font-size: 1.2rem;"></i>
                        <h4 style="color: #38bdf8; font-weight: 900; margin: 0; font-size: 1rem;">Interessante Anfragen</h4>
                    </div>
                    <p style="margin: 0; font-size: 0.84rem; color: #000000; font-weight: 600; line-height: 1.45; padding-left: 1.8rem;">Nicht nur Anfragen an Musiker senden – sondern auch erhalten</p>
                </div>

                <div style="background: rgba(37, 99, 235, 0.14); border: 1.5px solid rgba(96, 165, 250, 0.45); border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);">
                    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                        <i class="fa-solid fa-circle-check" style="color: #38bdf8; font-size: 1.2rem;"></i>
                        <h4 style="color: #38bdf8; font-weight: 900; margin: 0; font-size: 1rem;">Top-VorschlÄge</h4>
                    </div>
                    <p style="margin: 0; font-size: 0.84rem; color: #000000; font-weight: 600; line-height: 1.45; padding-left: 1.8rem;">Automatische Empfehlungen von GigConnAct zu Musikern</p>
                </div>

                <div style="background: rgba(37, 99, 235, 0.14); border: 1.5px solid rgba(96, 165, 250, 0.45); border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);">
                    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                        <i class="fa-solid fa-circle-check" style="color: #38bdf8; font-size: 1.2rem;"></i>
                        <h4 style="color: #38bdf8; font-weight: 900; margin: 0; font-size: 1rem;">Schnelle Anmeldung</h4>
                    </div>
                    <p style="margin: 0; font-size: 0.84rem; color: #000000; font-weight: 600; line-height: 1.45; padding-left: 1.8rem;">Anlegen des Veranstalter-Profils ohne Passwort</p>
                </div>

                <div style="background: rgba(37, 99, 235, 0.14); border: 1.5px solid rgba(96, 165, 250, 0.45); border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);">
                    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                        <i class="fa-solid fa-circle-check" style="color: #38bdf8; font-size: 1.2rem;"></i>
                        <h4 style="color: #38bdf8; font-weight: 900; margin: 0; font-size: 1rem;">Keine Provisionskosten</h4>
                    </div>
                    <p style="margin: 0; font-size: 0.84rem; color: #000000; font-weight: 600; line-height: 1.45; padding-left: 1.8rem;">Oder andere versteckte Kosten</p>
                </div>

            </div>
        `;
    }
}

function renderLandingPage(container, onNavigate) {
    window.onNavigate = onNavigate;
    const isUserLoggedIn = !!state.currentUser;

    const urlParams = new URLSearchParams(window.location.search);
    const forceFirstVisit = urlParams.get('firstvisit') === 'true' || urlParams.get('reset') === 'true';
    if (forceFirstVisit) {
        localStorage.removeItem('gigmatch_homepage_visited');
    }

    const hasVisited = localStorage.getItem('gigmatch_homepage_visited');
    const isFirstVisit = !hasVisited;

    const logoClass = isFirstVisit ? 'first-visit-disco' : 'animate-hero-logo';
    const textClass = isFirstVisit ? 'animate-hero-text first-visit-text' : 'animate-hero-text';

    if (isFirstVisit) {
        localStorage.setItem('gigmatch_homepage_visited', 'true');
    }

    const bottomCtaButtonHtml = isUserLoggedIn 
        ? `<button class="btn" id="btn-bottom-dashboard-trigger" style="background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); border: 1.5px solid rgba(255,255,255,0.15); color: #ffffff; padding: 0.95rem 2.4rem; font-weight: 800; font-size: 1.15rem; border-radius: 15px; box-shadow: none; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; display: inline-flex; align-items: center; gap: 0.6rem; white-space: nowrap;" onmouseover="this.style.transform='scale(1.03)';" onmouseout="this.style.transform='scale(1)';">
               <i class="fa-solid fa-gauge-high"></i> Mein Dashboard
           </button>`
        : ``;

    container.innerHTML = `
        <div class="landing-page-wrapper" style="position: relative; overflow: hidden; padding-bottom: 5rem; margin: 0; width: 100%;">
            
            <!-- 1. Fullscreen 100vh Hero Background Video Section -->
            <div class="landing-hero" style="position: relative; width: 100%; height: 100vh; height: 100dvh; display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center; overflow: hidden; margin: 0; padding: 22vh 1.5rem 9rem; border-bottom: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.5); background-color: #0d0e12;">
                
                <!-- Seamless Dual Background Videos (Scaled to crop out Capcut watermark and cross-fade) -->
                <video id="hero-bg-video-1" autoplay muted playsinline preload="auto" style="position: absolute; top: -12%; left: -12%; width: 124%; height: 124%; object-fit: cover; z-index: 2; opacity: 1; transition: opacity 1.5s ease-in-out;">
                    <source src="hochzeit.mp4" type="video/mp4">
                </video>
                <video id="hero-bg-video-2" muted playsinline preload="auto" style="position: absolute; top: -12%; left: -12%; width: 124%; height: 124%; object-fit: cover; z-index: 1; opacity: 0; transition: opacity 1.5s ease-in-out;">
                </video>

                <!-- Dark overlay gradient -->
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(15, 23, 42, 0.78) 0%, rgba(30, 58, 138, 0.72) 50%, rgba(124, 58, 237, 0.68) 100%); z-index: 2;"></div>

                <!-- 1/3: Large Logo -->
                <div class="brand-logo-center" style="position: relative; z-index: 3; width: 100%; max-width: 600px; display: flex; align-items: center; justify-content: center; gap: 1rem; filter: drop-shadow(0 10px 25px rgba(0,0,0,0.5)); margin: 0 auto; padding: 0 0.8rem; box-sizing: border-box;">
                    <!-- Large SVG Disco Ball -->
                    <svg id="hero-logo-svg" class="${logoClass}" viewBox="0 0 100 100" style="width: clamp(2.8rem, 7.5vw, 4.8rem); height: clamp(2.8rem, 7.5vw, 4.8rem); flex-shrink: 0; overflow: visible; opacity: 1;">
                      <defs>
                        <radialGradient id="sphereGradLarge" cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stop-color="#ffffff" />
                          <stop offset="40%" stop-color="#a78bfa" />
                          <stop offset="75%" stop-color="#6d28d9" />
                          <stop offset="100%" stop-color="#1e40af" />
                        </radialGradient>
                        <filter id="glowLarge" x="-30%" y="-30%" width="160%" height="160%">
                          <feGaussianBlur stdDeviation="2.5" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      <g class="spinning-disco-ball">
                          <circle cx="50" cy="50" r="40" fill="url(#sphereGradLarge)" />
                          <!-- Grid arcs -->
                          <path d="M 10 50 A 40 40 0 0 0 90 50 A 40 40 0 0 0 10 50" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="0.8" />
                          <path d="M 11.5 40 A 40 30 0 0 0 88.5 40" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                          <path d="M 15 30 A 40 20 0 0 0 85 30" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                          <path d="M 21.8 20 A 40 10 0 0 0 78.2 20" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                          <path d="M 11.5 60 A 40 30 0 0 1 88.5 60" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                          <path d="M 15 70 A 40 20 0 0 1 85 70" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                          <path d="M 21.8 80 A 40 10 0 0 1 78.2 80" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                          <path d="M 50 10 A 40 40 0 0 0 50 90" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="0.8" />
                          <path d="M 50 10 A 30 40 0 0 0 50 90" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                          <path d="M 50 10 A 20 40 0 0 0 50 90" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                          <path d="M 50 10 A 10 40 0 0 0 50 90" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                          <path d="M 50 10 A 30 40 0 0 1 50 90" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                          <path d="M 50 10 A 20 40 0 0 1 50 90" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                          <path d="M 50 10 A 10 40 0 0 1 50 90" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                      </g>
                      <!-- Sparkles -->
                      <g transform="translate(22, 25)" filter="url(#glowLarge)"><polygon class="sparkle-1" points="0,-8 2,-2 8,0 2,2 0,8 -2,2 -8,0 -2,-2" fill="#ffffff" /></g>
                      <g transform="translate(75, 30)" filter="url(#glowLarge)"><polygon class="sparkle-2" points="0,-6 1.5,-1.5 6,0 1.5,1.5 0,6 -1.5,1.5 -6,0 -1.5,-1.5" fill="#ffffff" /></g>
                      <g transform="translate(68, 68)" filter="url(#glowLarge)"><polygon class="sparkle-3" points="0,-7 1.8,-1.8 7,0 1.8,1.8 0,7 -1.8,1.8 -7,0 -1.8,-1.8" fill="#ffffff" /></g>
                    </svg>
                    <div class="${textClass}" style="font-family: var(--font-heading); font-size: clamp(2.4rem, 6.5vw, 4.2rem); font-weight: 900; letter-spacing: -1.5px; display: flex; white-space: nowrap; background: linear-gradient(135deg, #6d28d9 0%, #1e40af 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        GigConnAct
                    </div>
                </div>
<!-- 2/3: CTA Buttons -->
                <div class="hero-cta-buttons" style="position: relative; z-index: 3; margin: 0; gap: 2rem;">
                    <button class="btn" id="btn-hero-musician" style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); border: 2px solid #a855f7; color: #ffffff; padding: 1.5rem; font-weight: 800; border-radius: 20px; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.55); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.4rem; min-width: 210px; min-height: 165px;" onmouseover="this.style.transform='scale(1.04)';" onmouseout="this.style.transform='scale(1)';">
                        <i class="fa-solid fa-guitar" style="font-size: 3.2rem;"></i>
                        <span style="font-size: 1.5rem; font-weight: 800; display: block; line-height: 1.2;">Musiker</span>
                        <span style="font-size: 0.85rem; font-weight: 500; display: block; opacity: 0.85; text-transform: none; line-height: 1;">Ich suche Gigs</span>
                    </button>
                    <button class="btn" id="btn-hero-organizer" style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); border: 2px solid #60a5fa; color: #ffffff; padding: 1.5rem; font-weight: 800; border-radius: 20px; box-shadow: 0 10px 30px rgba(37, 99, 235, 0.55); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.4rem; min-width: 210px; min-height: 165px;" onmouseover="this.style.transform='scale(1.04)';" onmouseout="this.style.transform='scale(1)';">
                        <i class="fa-solid fa-calendar-check" style="font-size: 3.2rem;"></i>
                        <span style="font-size: 1.5rem; font-weight: 800; display: block; line-height: 1.2;">Veranstalter</span>
                        <span style="font-size: 0.85rem; font-weight: 500; display: block; opacity: 0.85; text-transform: none; line-height: 1;">Ich suche Acts</span>
                    </button>
                </div>

                <!-- 3/3: Headline + Description text block -->
                <div style="position: relative; z-index: 3; max-width: 1000px; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 0.6rem; margin: 0;">
                    <h1 style="font-family: var(--font-heading); font-size: clamp(1.2rem, 5.8vw, 3.2rem); font-weight: 900; line-height: 1.2; letter-spacing: -0.5px; margin: 0; color: #ffffff; text-shadow: 0 4px 20px rgba(0,0,0,0.8); white-space: nowrap;">
                        Wir vermitteln Live-Musik.
                    </h1>
                    <p style="font-size: clamp(0.78rem, 2.2vw, 1.25rem); color: rgba(255,255,255,0.95); font-weight: 500; line-height: 1.5; max-width: 800px; margin: 0 auto; text-shadow: 0 2px 10px rgba(0,0,0,0.7);">
                        Hochzeiten, Geburtstage, Firmenfeiern & Co.<br>GigConnAct verbindet Musiker und Veranstalter.
                    </p>
                </div>
            </div>

            <!-- 2. SECTION 2: Event-Profile -->
            <div style="max-width: 1400px; margin: 0 auto; padding: 3rem 1.5rem 0;">
                
                <!-- Headline: Event-Markt -->
                <div style="text-align: center; margin-bottom: 2.0rem; padding: 0 1rem;">
                    <h2 onclick="window.onNavigate('events')" style="font-family: var(--font-heading); font-size: clamp(2.2rem, 5.8vw, 4.2rem); font-weight: 900; color: #0f172a; margin: 0; line-height: 1.15; letter-spacing: -1.5px; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='#7c3aed'; this.querySelector('.arrow-icon').style.transform='translateX(6px)';" onmouseout="this.style.color='#0f172a'; this.querySelector('.arrow-icon').style.transform='translateX(0)';">
                        Der Event-Markt<br>
                        <span style="color: #7c3aed; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap;">Für Musiker<i class="fa-solid fa-arrow-right-long arrow-icon" style="font-size: 0.55em; transition: transform 0.2s; vertical-align: middle;"></i></span>
                    </h2>
                </div>

                <!-- Subtitle: Category Icons -->
                <div style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 0.5rem; font-family: var(--font-body); font-size: clamp(0.85rem, 2vw, 1.05rem); font-weight: 600; color: #475569; margin-bottom: 2.2rem;">
                    <span><i class="fa-solid fa-heart" style="color: #7c3aed; margin-right: 0.35rem;"></i> Hochzeit</span>
                    <span style="color: #cbd5e1; margin: 0 0.4rem;">•</span>
                    <span><i class="fa-solid fa-cake-candles" style="color: #7c3aed; margin-right: 0.35rem;"></i> Geburtstag</span>
                    <span style="color: #cbd5e1; margin: 0 0.4rem;">•</span>
                    <span><i class="fa-solid fa-music" style="color: #7c3aed; margin-right: 0.35rem;"></i> Festival</span>
                    <span style="color: #cbd5e1; margin: 0 0.4rem;">•</span>
                    <span><i class="fa-solid fa-building" style="color: #7c3aed; margin-right: 0.35rem;"></i> Firmenfeier</span>
                    <span style="color: #cbd5e1; margin: 0 0.4rem;">•</span>
                    <span><i class="fa-solid fa-city" style="color: #7c3aed; margin-right: 0.35rem;"></i> Kirmes</span>
                    <span style="color: #cbd5e1; margin: 0 0.4rem;">•</span>
                    <span style="color: #7c3aed; font-weight: 900; font-size: 1.6rem; letter-spacing: 2px; line-height: 1; vertical-align: middle; display: inline-flex; align-items: center; padding-bottom: 5px;">...</span>
                </div>

                <!-- Carousel: Events -->
                <div class="carousel-container" style="margin-bottom: 1.5rem;">
                    <div class="carousel-viewport">
                        <div class="carousel-track theme-musician" id="carousel-track-events">
                            ${renderMarketGridHTML(state.events.slice(0, 9), true, true)}
                        </div>
                    </div>
                </div>

                <!-- Pagination Dots: Events -->
                <div class="carousel-dots-container" style="margin-bottom: 2.2rem;">
                    <div class="carousel-dots" id="carousel-dots-events">
                        <span class="carousel-dot active" onclick="jumpToCarouselSlide('events', 0)"></span>
                        <span class="carousel-dot" onclick="jumpToCarouselSlide('events', 1)"></span>
                        <span class="carousel-dot" onclick="jumpToCarouselSlide('events', 2)"></span>
                        <span class="carousel-dot" onclick="jumpToCarouselSlide('events', 3)"></span>
                        <span class="carousel-dot" onclick="jumpToCarouselSlide('events', 4)"></span>
                    </div>
                </div>

                <!-- Marquee: Event-Logos -->
                <div class="logo-marquee-wrapper theme-events-marquee" style="margin-bottom: 3.5rem;">
                    <div class="logo-marquee-track">
                        <!-- First Copy of 10 Event/Venue/Club Logos -->
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 170 45" width="170" height="45" xmlns="http://www.w3.org/2000/svg"><path d="M8,32 L8,18 L12,18 L12,22 L16,22 L16,18 L20,18 L20,22 L24,22 L24,18 L28,18 L28,32 Z" fill="#94a3b8" /><path d="M14,32 L14,26 L22,26 L22,32 Z" fill="#1e293b" /><polygon points="18,10 24,15 12,15" fill="#f43f5e" /><text x="35" y="27" font-family="'Georgia', serif" font-size="14" font-weight="bold" fill="#ffffff" letter-spacing="0.5">SCHLOSSBERG</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 165 45" width="165" height="45" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad-royal-1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#fbbf24" /><stop offset="100%" stop-color="#f59e0b" /></linearGradient></defs><path d="M10,28 L13,15 L18,20 L23,12 L28,20 L33,15 L36,28 Z" fill="url(#grad-royal-1)" /><circle cx="23" cy="8" r="2" fill="url(#grad-royal-1)" /><text x="45" y="26" font-family="'Times New Roman', serif" font-size="18" font-weight="bold" fill="url(#grad-royal-1)" letter-spacing="1.5">ROYAL</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><path d="M10,10 L32,10 L32,25 C32,35 21,40 21,40 C21,40 10,35 10,25 Z" fill="#1d4ed8" stroke="#ffffff" stroke-width="1.5" /><path d="M15,10 L18,10 L18,31 C16,29 15,27 15,25 Z" fill="#ffffff" /><path d="M24,10 L27,10 L27,31 C25,29 24,27 24,25 Z" fill="#ffffff" /><text x="40" y="26" font-family="'Arial Black', Impact, sans-serif" font-size="15" fill="#ffffff" letter-spacing="-0.5">SV KICKERS</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 155 45" width="155" height="45" xmlns="http://www.w3.org/2000/svg"><path d="M10,35 L28,35 L22,12 L16,12 Z" fill="#f97316" /><line x1="20" y1="12" x2="35" y2="5" stroke="#f97316" stroke-width="2" /><line x1="32" y1="6" x2="32" y2="18" stroke="#64748b" stroke-width="1" /><text x="42" y="27" font-family="'Impact', 'Arial Black', sans-serif" font-size="17" fill="#ffffff" letter-spacing="0.5">WERFT</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="22" r="14" fill="none" stroke="#10b981" stroke-width="3" /><circle cx="22" cy="22" r="8" fill="none" stroke="#f59e0b" stroke-width="3" /><circle cx="22" cy="22" r="2" fill="#ef4444" /><text x="44" y="26" font-family="sans-serif" font-size="15" font-weight="800" fill="#10b981" letter-spacing="0.5">KULTUR<tspan fill="#f59e0b">V.</tspan></text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><polygon points="22,8 34,22 22,36 10,22" fill="none" stroke="#fbbf24" stroke-width="2" /><polygon points="22,13 30,22 22,31 14,22" fill="#fbbf24" /><text x="44" y="26" font-family="'Courier New', Courier, monospace" font-size="16" font-weight="bold" fill="#ffffff" letter-spacing="2">GALA-PRO</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 170 45" width="170" height="45" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="22" r="16" fill="#047857" /><path d="M17,20 Q22,12 27,20 M19,25 Q22,18 25,25" fill="none" stroke="#fbbf24" stroke-width="2" /><text x="46" y="26" font-family="'Georgia', serif" font-size="15" font-weight="bold" fill="#fbbf24">Biergarten</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="10" width="8" height="25" fill="#3b82f6" /><rect x="18" y="15" width="8" height="20" fill="#3b82f6" opacity="0.8" /><rect x="28" y="20" width="8" height="15" fill="#3b82f6" opacity="0.6" /><text x="42" y="27" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="800" fill="#ffffff" letter-spacing="1">MESSE<tspan fill="#3b82f6">W</tspan></text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 170 45" width="170" height="45" xmlns="http://www.w3.org/2000/svg"><path d="M12,12 C12,18 16,22 20,22 L20,32 L15,32 L15,34 L25,34 L25,32 L20,32 L20,22 C24,22 28,18 28,12 Z" fill="none" stroke="#84cc16" stroke-width="1.5" /><circle cx="20" cy="10" r="4" fill="#fbbf24" /><text x="36" y="26" font-family="Georgia, serif" font-size="16" fill="#84cc16">Sonnenhang</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 155 45" width="155" height="45" xmlns="http://www.w3.org/2000/svg"><polygon points="8,10 16,10 12,24" fill="#ec4899" /><polygon points="16,10 24,10 20,24" fill="#3b82f6" /><polygon points="24,10 32,10 28,24" fill="#eab308" /><line x1="6" y1="10" x2="34" y2="10" stroke="#ffffff" stroke-width="1.5" /><text x="40" y="26" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff">Stadtfest</text></svg>
                        </div>
                        
                        <!-- Second Copy of 10 Event/Venue/Club Logos (for seamless looping) -->
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 170 45" width="170" height="45" xmlns="http://www.w3.org/2000/svg"><path d="M8,32 L8,18 L12,18 L12,22 L16,22 L16,18 L20,18 L20,22 L24,22 L24,18 L28,18 L28,32 Z" fill="#94a3b8" /><path d="M14,32 L14,26 L22,26 L22,32 Z" fill="#1e293b" /><polygon points="18,10 24,15 12,15" fill="#f43f5e" /><text x="35" y="27" font-family="'Georgia', serif" font-size="14" font-weight="bold" fill="#ffffff" letter-spacing="0.5">SCHLOSSBERG</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 165 45" width="165" height="45" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad-royal-2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#fbbf24" /><stop offset="100%" stop-color="#f59e0b" /></linearGradient></defs><path d="M10,28 L13,15 L18,20 L23,12 L28,20 L33,15 L36,28 Z" fill="url(#grad-royal-2)" /><circle cx="23" cy="8" r="2" fill="url(#grad-royal-2)" /><text x="45" y="26" font-family="'Times New Roman', serif" font-size="18" font-weight="bold" fill="url(#grad-royal-2)" letter-spacing="1.5">ROYAL</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><path d="M10,10 L32,10 L32,25 C32,35 21,40 21,40 C21,40 10,35 10,25 Z" fill="#1d4ed8" stroke="#ffffff" stroke-width="1.5" /><path d="M15,10 L18,10 L18,31 C16,29 15,27 15,25 Z" fill="#ffffff" /><path d="M24,10 L27,10 L27,31 C25,29 24,27 24,25 Z" fill="#ffffff" /><text x="40" y="26" font-family="'Arial Black', Impact, sans-serif" font-size="15" fill="#ffffff" letter-spacing="-0.5">SV KICKERS</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 155 45" width="155" height="45" xmlns="http://www.w3.org/2000/svg"><path d="M10,35 L28,35 L22,12 L16,12 Z" fill="#f97316" /><line x1="20" y1="12" x2="35" y2="5" stroke="#f97316" stroke-width="2" /><line x1="32" y1="6" x2="32" y2="18" stroke="#64748b" stroke-width="1" /><text x="42" y="27" font-family="'Impact', 'Arial Black', sans-serif" font-size="17" fill="#ffffff" letter-spacing="0.5">WERFT</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="22" r="14" fill="none" stroke="#10b981" stroke-width="3" /><circle cx="22" cy="22" r="8" fill="none" stroke="#f59e0b" stroke-width="3" /><circle cx="22" cy="22" r="2" fill="#ef4444" /><text x="44" y="26" font-family="sans-serif" font-size="15" font-weight="800" fill="#10b981" letter-spacing="0.5">KULTUR<tspan fill="#f59e0b">V.</tspan></text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><polygon points="22,8 34,22 22,36 10,22" fill="none" stroke="#fbbf24" stroke-width="2" /><polygon points="22,13 30,22 22,31 14,22" fill="#fbbf24" /><text x="44" y="26" font-family="'Courier New', Courier, monospace" font-size="16" font-weight="bold" fill="#ffffff" letter-spacing="2">GALA-PRO</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 170 45" width="170" height="45" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="22" r="16" fill="#047857" /><path d="M17,20 Q22,12 27,20 M19,25 Q22,18 25,25" fill="none" stroke="#fbbf24" stroke-width="2" /><text x="46" y="26" font-family="'Georgia', serif" font-size="15" font-weight="bold" fill="#fbbf24">Biergarten</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="10" width="8" height="25" fill="#3b82f6" /><rect x="18" y="15" width="8" height="20" fill="#3b82f6" opacity="0.8" /><rect x="28" y="20" width="8" height="15" fill="#3b82f6" opacity="0.6" /><text x="42" y="27" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="800" fill="#ffffff" letter-spacing="1">MESSE<tspan fill="#3b82f6">W</tspan></text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 170 45" width="170" height="45" xmlns="http://www.w3.org/2000/svg"><path d="M12,12 C12,18 16,22 20,22 L20,32 L15,32 L15,34 L25,34 L25,32 L20,32 L20,22 C24,22 28,18 28,12 Z" fill="none" stroke="#84cc16" stroke-width="1.5" /><circle cx="20" cy="10" r="4" fill="#fbbf24" /><text x="36" y="26" font-family="Georgia, serif" font-size="16" fill="#84cc16">Sonnenhang</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 155 45" width="155" height="45" xmlns="http://www.w3.org/2000/svg"><polygon points="8,10 16,10 12,24" fill="#ec4899" /><polygon points="16,10 24,10 20,24" fill="#3b82f6" /><polygon points="24,10 32,10 28,24" fill="#eab308" /><line x1="6" y1="10" x2="34" y2="10" stroke="#ffffff" stroke-width="1.5" /><text x="40" y="26" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff">Stadtfest</text></svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. SECTION 1: Musiker-Profile -->
            <div style="max-width: 1400px; margin: 0 auto; padding: 1.5rem 1.5rem 0;">
                
                <!-- Headline: Musiker-Markt -->
                <div style="text-align: center; margin-bottom: 2.0rem; padding: 0 1rem;">
                    <h2 onclick="window.onNavigate('musicians')" style="font-family: var(--font-heading); font-size: clamp(2.2rem, 5.8vw, 4.2rem); font-weight: 900; color: #0f172a; margin: 0; line-height: 1.15; letter-spacing: -1.5px; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='#2563eb'; this.querySelector('.arrow-icon').style.transform='translateX(6px)';" onmouseout="this.style.color='#0f172a'; this.querySelector('.arrow-icon').style.transform='translateX(0)';">
                        Der Musiker-Markt<br>
                        <span style="color: #2563eb; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap;">Für Veranstalter<i class="fa-solid fa-arrow-right-long arrow-icon" style="font-size: 0.55em; transition: transform 0.2s; vertical-align: middle;"></i></span>
                    </h2>
                </div>

                <!-- Subtitle: Category Icons -->
                <div style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 0.5rem; font-family: var(--font-body); font-size: clamp(0.85rem, 2vw, 1.05rem); font-weight: 600; color: #475569; margin-bottom: 2.2rem;">
                    <span><i class="fa-solid fa-microphone" style="color: #2563eb; margin-right: 0.35rem;"></i> Sänger</span>
                    <span style="color: #cbd5e1; margin: 0 0.4rem;">•</span>
                    <span><i class="fa-solid fa-users" style="color: #2563eb; margin-right: 0.35rem;"></i> Band</span>
                    <span style="color: #cbd5e1; margin: 0 0.4rem;">•</span>
                    <span><i class="fa-solid fa-headphones" style="color: #2563eb; margin-right: 0.35rem;"></i> DJ</span>
                    <span style="color: #cbd5e1; margin: 0 0.4rem;">•</span>
                    <span><i class="fa-solid fa-guitar" style="color: #2563eb; margin-right: 0.35rem;"></i> Solokünstler</span>
                    <span style="color: #cbd5e1; margin: 0 0.4rem;">•</span>
                    <span><i class="fa-solid fa-user-group" style="color: #2563eb; margin-right: 0.35rem;"></i> Duo</span>
                    <span style="color: #cbd5e1; margin: 0 0.4rem;">•</span>
                    <span style="color: #2563eb; font-weight: 900; font-size: 1.6rem; letter-spacing: 2px; line-height: 1; vertical-align: middle; display: inline-flex; align-items: center; padding-bottom: 5px;">...</span>
                </div>

                <!-- Carousel: Musiker -->
                <div class="carousel-container" style="margin-bottom: 1.5rem;">
                    <div class="carousel-viewport">
                        <div class="carousel-track theme-organizer" id="carousel-track-musicians">
                            ${renderMarketGridHTML(state.musicians.slice(0, 9), false, true)}
                        </div>
                    </div>
                </div>

                <!-- Pagination Dots: Musiker -->
                <div class="carousel-dots-container" style="margin-bottom: 2.2rem;">
                    <div class="carousel-dots" id="carousel-dots-musicians">
                        <span class="carousel-dot active" onclick="jumpToCarouselSlide('musicians', 0)"></span>
                        <span class="carousel-dot" onclick="jumpToCarouselSlide('musicians', 1)"></span>
                        <span class="carousel-dot" onclick="jumpToCarouselSlide('musicians', 2)"></span>
                        <span class="carousel-dot" onclick="jumpToCarouselSlide('musicians', 3)"></span>
                        <span class="carousel-dot" onclick="jumpToCarouselSlide('musicians', 4)"></span>
                    </div>
                </div>

                <!-- Marquee: Band-Logos -->
                <div class="logo-marquee-wrapper theme-musicians-marquee" style="margin-bottom: 3.5rem;">
                    <div class="logo-marquee-track">
                        <!-- First Copy of 10 Band Logos -->
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad-rockers-1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff007f" /><stop offset="100%" stop-color="#7c3aed" /></linearGradient></defs><polygon points="5,5 155,2 150,40 10,43" fill="#111111" stroke="url(#grad-rockers-1)" stroke-width="2"/><path d="M 22,12 L 32,12 L 24,24 L 32,24 L 18,36 L 24,20 L 18,20 Z" fill="#ff007f" /><text x="40" y="29" font-family="'Impact', 'Arial Black', sans-serif" font-size="18" font-weight="bold" fill="#ffffff" letter-spacing="1">THE ROCKERS</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 170 45" width="170" height="45" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="166" height="41" rx="8" fill="#000000" stroke="#00ffcc" stroke-width="2" /><line x1="15" y1="12" x2="15" y2="33" stroke="#00ffcc" stroke-width="3" /><line x1="21" y1="8" x2="21" y2="37" stroke="#00ffcc" stroke-width="3" /><line x1="27" y1="16" x2="27" y2="29" stroke="#00ffcc" stroke-width="3" /><line x1="33" y1="6" x2="33" y2="39" stroke="#00ffcc" stroke-width="3" /><text x="42" y="28" font-family="'Courier New', monospace" font-size="16" font-weight="900" fill="#ffffff" letter-spacing="0.5">HYPERACTIVE</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 165 45" width="165" height="45" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="22" r="18" fill="#1e293b" stroke="#e2e8f0" stroke-width="1" /><path d="M18,12 L18,26 A6,6 0 1,1 12,20 L16,20 Z" fill="#fbbf24" /><path d="M26,10 L26,24 A4,4 0 1,1 22,20 L24,20 Z" fill="#3b82f6" /><text x="48" y="27" font-family="'Georgia', serif" font-size="16" font-style="italic" font-weight="bold" fill="#fbbf24">Blue Note Jazz</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><path d="M5,22 Q20,5 35,22 T65,22" fill="none" stroke="#f472b6" stroke-width="3" stroke-linecap="round" /><path d="M15,22 Q30,35 45,22 T75,22" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" /><text x="80" y="28" font-family="'Montserrat', sans-serif" font-size="15" font-weight="300" fill="#ffffff" letter-spacing="1.5">VOCAL</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad-kings-1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fbbf24" /><stop offset="100%" stop-color="#b45309" /></linearGradient></defs><path d="M10,32 L10,18 L16,24 L22,14 L28,24 L34,18 L34,32 Z" fill="url(#grad-kings-1)" /><rect x="8" y="32" width="28" height="6" fill="#ffffff" /><rect x="13" y="32" width="2" height="4" fill="#000000" /><rect x="18" y="32" width="2" height="4" fill="#000000" /><rect x="23" y="32" width="2" height="4" fill="#000000" /><rect x="28" y="32" width="2" height="4" fill="#000000" /><text x="44" y="27" font-family="'Cinzel', serif, Times" font-size="14" font-weight="bold" fill="url(#grad-kings-1)" letter-spacing="1">KINGS</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="22" r="16" fill="#222222" stroke="#a855f7" stroke-width="2"/><circle cx="22" cy="22" r="10" fill="#333333" stroke="#a855f7" stroke-width="1.5"/><circle cx="22" cy="22" r="4" fill="#a855f7"/><text x="46" y="28" font-family="Helvetica, Arial, sans-serif" font-size="18" font-weight="900" fill="#ffffff" letter-spacing="-0.5">BEAT<tspan fill="#a855f7">MS</tspan></text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 155 45" width="155" height="45" xmlns="http://www.w3.org/2000/svg"><path d="M10,22 L20,22 L24,10 L28,34 L32,18 L36,26 L40,22 L50,22" fill="none" stroke="#ec4899" stroke-width="3" stroke-linejoin="round" /><text x="56" y="27" font-family="sans-serif" font-size="16" font-weight="800" fill="#ec4899">ELECTRO</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 170 45" width="170" height="45" xmlns="http://www.w3.org/2000/svg"><path d="M15,10 C18,12 18,18 15,20 C12,22 12,28 15,30" fill="none" stroke="#fb923c" stroke-width="2" /><path d="M25,10 C22,12 22,18 25,20 C28,22 28,28 25,30" fill="none" stroke="#fb923c" stroke-width="2" /><line x1="20" y1="5" x2="20" y2="38" stroke="#fb923c" stroke-width="1.5" /><text x="35" y="26" font-family="Times New Roman, serif" font-size="16" font-weight="bold" fill="#ffffff">String Ensemble</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad-melody-1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#3b82f6" /><stop offset="100%" stop-color="#8b5cf6" /></linearGradient></defs><path d="M22,35 C28,35 28,26 23,26 C15,26 18,35 22,35 Z M22,35 L22,8 Q27,8 27,15 Q22,20 22,24" fill="none" stroke="url(#grad-melody-1)" stroke-width="3" /><text x="40" y="27" font-family="'Trebuchet MS', sans-serif" font-size="15" font-weight="bold" fill="url(#grad-melody-1)">MelodyMakers</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 155 45" width="155" height="45" xmlns="http://www.w3.org/2000/svg"><path d="M10,12 C18,8 28,8 36,12 C40,24 30,36 23,40 C16,36 6,24 10,12 Z" fill="#84cc16" opacity="0.8" /><text x="45" y="26" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#ffffff">acoustic<tspan fill="#84cc16">duo</tspan></text></svg>
                        </div>
                        
                        <!-- Second Copy of 10 Band Logos (for seamless looping) -->
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad-rockers-2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff007f" /><stop offset="100%" stop-color="#7c3aed" /></linearGradient></defs><polygon points="5,5 155,2 150,40 10,43" fill="#111111" stroke="url(#grad-rockers-2)" stroke-width="2"/><path d="M 22,12 L 32,12 L 24,24 L 32,24 L 18,36 L 24,20 L 18,20 Z" fill="#ff007f" /><text x="40" y="29" font-family="'Impact', 'Arial Black', sans-serif" font-size="18" font-weight="bold" fill="#ffffff" letter-spacing="1">THE ROCKERS</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 170 45" width="170" height="45" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="166" height="41" rx="8" fill="#000000" stroke="#00ffcc" stroke-width="2" /><line x1="15" y1="12" x2="15" y2="33" stroke="#00ffcc" stroke-width="3" /><line x1="21" y1="8" x2="21" y2="37" stroke="#00ffcc" stroke-width="3" /><line x1="27" y1="16" x2="27" y2="29" stroke="#00ffcc" stroke-width="3" /><line x1="33" y1="6" x2="33" y2="39" stroke="#00ffcc" stroke-width="3" /><text x="42" y="28" font-family="'Courier New', monospace" font-size="16" font-weight="900" fill="#ffffff" letter-spacing="0.5">HYPERACTIVE</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 165 45" width="165" height="45" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="22" r="18" fill="#1e293b" stroke="#e2e8f0" stroke-width="1" /><path d="M18,12 L18,26 A6,6 0 1,1 12,20 L16,20 Z" fill="#fbbf24" /><path d="M26,10 L26,24 A4,4 0 1,1 22,20 L24,20 Z" fill="#3b82f6" /><text x="48" y="27" font-family="'Georgia', serif" font-size="16" font-style="italic" font-weight="bold" fill="#fbbf24">Blue Note Jazz</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><path d="M5,22 Q20,5 35,22 T65,22" fill="none" stroke="#f472b6" stroke-width="3" stroke-linecap="round" /><path d="M15,22 Q30,35 45,22 T75,22" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" /><text x="80" y="28" font-family="'Montserrat', sans-serif" font-size="15" font-weight="300" fill="#ffffff" letter-spacing="1.5">VOCAL</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad-kings-2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fbbf24" /><stop offset="100%" stop-color="#b45309" /></linearGradient></defs><path d="M10,32 L10,18 L16,24 L22,14 L28,24 L34,18 L34,32 Z" fill="url(#grad-kings-2)" /><rect x="8" y="32" width="28" height="6" fill="#ffffff" /><rect x="13" y="32" width="2" height="4" fill="#000000" /><rect x="18" y="32" width="2" height="4" fill="#000000" /><rect x="23" y="32" width="2" height="4" fill="#000000" /><rect x="28" y="32" width="2" height="4" fill="#000000" /><text x="44" y="27" font-family="'Cinzel', serif, Times" font-size="14" font-weight="bold" fill="url(#grad-kings-2)" letter-spacing="1">KINGS</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="22" r="16" fill="#222222" stroke="#a855f7" stroke-width="2"/><circle cx="22" cy="22" r="10" fill="#333333" stroke="#a855f7" stroke-width="1.5"/><circle cx="22" cy="22" r="4" fill="#a855f7"/><text x="46" y="28" font-family="Helvetica, Arial, sans-serif" font-size="18" font-weight="900" fill="#ffffff" letter-spacing="-0.5">BEAT<tspan fill="#a855f7">MS</tspan></text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 155 45" width="155" height="45" xmlns="http://www.w3.org/2000/svg"><path d="M10,22 L20,22 L24,10 L28,34 L32,18 L36,26 L40,22 L50,22" fill="none" stroke="#ec4899" stroke-width="3" stroke-linejoin="round" /><text x="56" y="27" font-family="sans-serif" font-size="16" font-weight="800" fill="#ec4899">ELECTRO</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 170 45" width="170" height="45" xmlns="http://www.w3.org/2000/svg"><path d="M15,10 C18,12 18,18 15,20 C12,22 12,28 15,30" fill="none" stroke="#fb923c" stroke-width="2" /><path d="M25,10 C22,12 22,18 25,20 C28,22 28,28 25,30" fill="none" stroke="#fb923c" stroke-width="2" /><line x1="20" y1="5" x2="20" y2="38" stroke="#fb923c" stroke-width="1.5" /><text x="35" y="26" font-family="Times New Roman, serif" font-size="16" font-weight="bold" fill="#ffffff">String Ensemble</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 160 45" width="160" height="45" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad-melody-2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#3b82f6" /><stop offset="100%" stop-color="#8b5cf6" /></linearGradient></defs><path d="M22,35 C28,35 28,26 23,26 C15,26 18,35 22,35 Z M22,35 L22,8 Q27,8 27,15 Q22,20 22,24" fill="none" stroke="url(#grad-melody-2)" stroke-width="3" /><text x="40" y="27" font-family="'Trebuchet MS', sans-serif" font-size="15" font-weight="bold" fill="url(#grad-melody-2)">MelodyMakers</text></svg>
                        </div>
                        <div class="partner-logo-badge">
                            <svg viewBox="0 0 155 45" width="155" height="45" xmlns="http://www.w3.org/2000/svg"><path d="M10,12 C18,8 28,8 36,12 C40,24 30,36 23,40 C16,36 6,24 10,12 Z" fill="#84cc16" opacity="0.8" /><text x="45" y="26" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#ffffff">acoustic<tspan fill="#84cc16">duo</tspan></text></svg>
                        </div>
                    </div>
                </div>
            </div>


            <!-- 3.5. EVENT TYPES SECTION -->
            <div style="max-width: 1400px; margin: 5rem auto 3rem; padding: 0 1.5rem; text-align: center;">
                <div style="text-align: center; margin-bottom: 2.5rem; padding: 0 1rem;">
                    <h2 style="font-family: var(--font-heading); font-size: clamp(2.2rem, 5vw, 3.8rem); font-weight: 900; color: #7c3aed; margin: 0 0 0.2rem; line-height: 1.15; letter-spacing: -1.2px;">
                        Live-Musik
                    </h2>
                    <div style="font-family: var(--font-heading); font-size: clamp(2.2rem, 5vw, 3.8rem); font-weight: 900; color: #2563eb; line-height: 1.15; letter-spacing: -1px;">
                        für jedes Event.
                    </div>
                </div>
                
                <!-- Horizontal row of event type cards -->
                <div class="event-types-grid" style="display: flex; gap: 1.2rem; flex-wrap: wrap; justify-content: center; margin-bottom: 1.5rem;">
                    
                    <!-- Card 1: Hochzeiten -->
                    <div class="event-type-card card-purple">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(124, 58, 237, 0.08); display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(167, 139, 250, 0.35);">
                            <i class="fa-solid fa-ring" style="color: #7c3aed; font-size: 1.5rem;"></i>
                        </div>
                        <span style="font-size: 0.88rem; font-weight: 800; color: var(--text-main); line-height: 1.2;">Hochzeiten</span>
                    </div>

                    <!-- Card 2: Geburtstage -->
                    <div class="event-type-card card-blue">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(96, 165, 250, 0.35);">
                            <i class="fa-solid fa-cake-candles" style="color: #2563eb; font-size: 1.5rem;"></i>
                        </div>
                        <span style="font-size: 0.88rem; font-weight: 800; color: var(--text-main); line-height: 1.2;">Geburtstage</span>
                    </div>

                    <!-- Card 3: Firmenfeiern -->
                    <div class="event-type-card card-purple">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(124, 58, 237, 0.08); display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(167, 139, 250, 0.35);">
                            <i class="fa-solid fa-briefcase" style="color: #7c3aed; font-size: 1.5rem;"></i>
                        </div>
                        <span style="font-size: 0.88rem; font-weight: 800; color: var(--text-main); line-height: 1.2;">Firmenfeiern</span>
                    </div>

                    <!-- Card 4: Stadtfeste -->
                    <div class="event-type-card card-blue">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(96, 165, 250, 0.35);">
                            <i class="fa-solid fa-city" style="color: #2563eb; font-size: 1.3rem;"></i>
                        </div>
                        <span style="font-size: 0.88rem; font-weight: 800; color: var(--text-main); line-height: 1.2;">Stadtfeste</span>
                    </div>

                    <!-- Card 5: Private Feiern -->
                    <div class="event-type-card card-purple">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(124, 58, 237, 0.08); display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(167, 139, 250, 0.35);">
                            <i class="fa-solid fa-gifts" style="color: #7c3aed; font-size: 1.5rem;"></i>
                        </div>
                        <span style="font-size: 0.88rem; font-weight: 800; color: var(--text-main); line-height: 1.2;">Private Feiern</span>
                    </div>

                    <!-- Card 6: Non-clickable ... dots -->
                    <div class="event-type-card card-blue" style="cursor: default;">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(96, 165, 250, 0.35);">
                            <span style="font-size: 1.8rem; font-weight: 900; background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent; line-height: 1; letter-spacing: 1px; display: inline-block; padding-bottom: 8px;">...</span>
                        </div>
                        <span style="font-size: 0.88rem; font-weight: 800; color: var(--text-main); line-height: 1.2;">Und Co.</span>
                    </div>

                </div>
            </div>

            <!-- 4. SECTION 3 & 4: Vorteile für Musiker & Veranstalter (Split-Layout on laptops) -->
            <div style="max-width: 1400px; margin: 0 auto; padding: 2rem 1.5rem 0;">
                <div class="benefits-container-split" style="gap: 2rem;">
                    
                    <!-- Left column: Musiker benefits -->
                    <div class="benefit-split-card card-musician">
                        <div>
                            <!-- Header badge -->
                            <div style="background: rgba(124, 58, 237, 0.1); color: #7c3aed; border-radius: 20px; padding: 0.45rem 1rem; font-size: 0.88rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 1.2rem; text-transform: uppercase;">
                                <i class="fa-solid fa-guitar"></i> Für Musiker
                            </div>
                            
                            <!-- Title and Illustration Row -->
                            <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                                <h3 style="font-family: var(--font-heading); font-size: clamp(1.5rem, 2.8vw, 2.0rem); font-weight: 900; color: var(--text-main); margin: 0; line-height: 1.25; text-align: left;">
                                    <span style="color: #7c3aed;">Mehr Gigs.</span><br><span style="white-space: nowrap;">Mehr Einnahmen.</span>
                                </h3>
                                <!-- Illustration: guitar + music notes -->
                                <div style="width: 76px; height: 76px; background: rgba(124, 58, 237, 0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0;">
                                    <i class="fa-solid fa-guitar" style="font-size: 2.2rem; color: #7c3aed; transform: rotate(-15deg);"></i>
                                </div>
                            </div>

                            <!-- List stack -->
                            <div style="display: flex; flex-direction: column; gap: 0.8rem; width: 100%;">
                                
                                <!-- Item 1 -->
                                <div style="display: flex; align-items: center; gap: 1rem; min-height: 54px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(124, 58, 237, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(167, 139, 250, 0.35);">
                                        <i class="fa-solid fa-store" style="color: #7c3aed; font-size: 1.0rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.05rem; text-align: left; font-family: var(--font-body);">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: #7c3aed;">
                                            01 Kostenloser Zugang
                                        </div>
                                        <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">
                                            Zum Event-Markt
                                        </div>
                                        <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500; line-height: 1.35;">
                                            Hochzeiten, Feiern, Festival ...
                                        </div>
                                    </div>
                                </div>

                                <!-- Arrow 1 -->
                                <div style="display: flex; align-items: center; justify-content: center; width: 38px; margin: -0.2rem 0; color: rgba(124, 58, 237, 0.65); font-size: 1.25rem; height: 20px; flex-shrink: 0;">
                                    <i class="fa-solid fa-arrow-down"></i>
                                </div>

                                <!-- Item 2 -->
                                <div style="display: flex; align-items: center; gap: 1rem; min-height: 54px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(124, 58, 237, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(167, 139, 250, 0.35);">
                                        <i class="fa-solid fa-sliders" style="color: #7c3aed; font-size: 1.0rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.05rem; text-align: left; font-family: var(--font-body);">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: #7c3aed;">
                                            02 Passende Events
                                        </div>
                                        <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">
                                            Durch Filter-Logik
                                        </div>
                                        <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500; line-height: 1.35;">
                                            Event-Typ, Entfernung, Gage ...
                                        </div>
                                    </div>
                                </div>

                                <!-- Arrow 2 -->
                                <div style="display: flex; align-items: center; justify-content: center; width: 38px; margin: -0.2rem 0; color: rgba(124, 58, 237, 0.65); font-size: 1.25rem; height: 20px; flex-shrink: 0;">
                                    <i class="fa-solid fa-arrow-down"></i>
                                </div>

                                <!-- Item 3 -->
                                <div style="display: flex; align-items: center; gap: 1rem; min-height: 54px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(124, 58, 237, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(167, 139, 250, 0.35);">
                                        <i class="fa-solid fa-bolt" style="color: #7c3aed; font-size: 1.0rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.05rem; text-align: left; font-family: var(--font-body);">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: #7c3aed;">
                                            03 Schnelle Anmeldung
                                        </div>
                                        <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">
                                            Anlegen eines Musiker-Profils
                                        </div>
                                        <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500; line-height: 1.35;">
                                            Ohne Passwort
                                        </div>
                                    </div>
                                </div>

                                <!-- Arrow 3 -->
                                <div style="display: flex; align-items: center; justify-content: center; width: 38px; margin: -0.2rem 0; color: rgba(124, 58, 237, 0.65); font-size: 1.25rem; height: 20px; flex-shrink: 0;">
                                    <i class="fa-solid fa-arrow-down"></i>
                                </div>

                                <!-- Item 4 -->
                                <div style="display: flex; align-items: center; gap: 1rem; min-height: 54px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(124, 58, 237, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(167, 139, 250, 0.35);">
                                        <i class="fa-solid fa-percent" style="color: #7c3aed; font-size: 1.0rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.05rem; text-align: left; font-family: var(--font-body);">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: #7c3aed;">
                                            04 Keine Provisionskosten
                                        </div>
                                        <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">
                                            Preiswertes Abo-Modell
                                        </div>
                                        <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500; line-height: 1.35;">
                                            Jederzeit kündbar
                                        </div>
                                    </div>
                                </div>

                                <!-- Arrow 4 -->
                                <div style="display: flex; align-items: center; justify-content: center; width: 38px; margin: -0.2rem 0; color: rgba(124, 58, 237, 0.65); font-size: 1.25rem; height: 20px; flex-shrink: 0;">
                                    <i class="fa-solid fa-arrow-down"></i>
                                </div>

                                <!-- Item 5 -->
                                <div style="display: flex; align-items: center; gap: 1rem; min-height: 54px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(124, 58, 237, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(167, 139, 250, 0.35);">
                                        <i class="fa-solid fa-star" style="color: #7c3aed; font-size: 1.0rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.05rem; text-align: left; font-family: var(--font-body);">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: #7c3aed;">
                                            05 Top-Vorschläge
                                        </div>
                                        <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">
                                            Durch Matching-Logik
                                        </div>
                                        <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500; line-height: 1.35;">
                                            Automatische Event-Empfehlungen
                                        </div>
                                    </div>
                                </div>

                                <!-- Arrow 5 -->
                                <div style="display: flex; align-items: center; justify-content: center; width: 38px; margin: -0.2rem 0; color: rgba(124, 58, 237, 0.65); font-size: 1.25rem; height: 20px; flex-shrink: 0;">
                                    <i class="fa-solid fa-arrow-down"></i>
                                </div>

                                <!-- Item 6 -->
                                <div style="display: flex; align-items: center; gap: 1rem; min-height: 54px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(124, 58, 237, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(167, 139, 250, 0.35);">
                                        <i class="fa-solid fa-comments" style="color: #7c3aed; font-size: 1.0rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.05rem; text-align: left; font-family: var(--font-body);">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: #7c3aed;">
                                            06  Direkter Kontakt
                                        </div>
                                        <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">
                                            Zu Veranstaltern der Events
                                        </div>
                                        <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500; line-height: 1.35;">
                                            Name, Telefon, Mail, Nachricht ...
                                        </div>
                                    </div>
                                </div>

                                <!-- Button: Hier geht's zum Event-Markt -->
                                <div style="margin-top: 1.5rem; text-align: center; width: 100%;">
                                    <button id="btn-benefits-to-events" class="btn-homepage-market theme-musician" style="width: 100%; box-sizing: border-box; margin: 0;">
                                        Hier geht's zum Event-Markt <i class="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <!-- Right column: Veranstalter benefits -->
                    <div class="benefit-split-card card-organizer">
                        <div>
                            <!-- Header badge -->
                            <div style="background: rgba(37, 99, 235, 0.1); color: #2563eb; border-radius: 20px; padding: 0.45rem 1rem; font-size: 0.88rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 1.2rem; text-transform: uppercase;">
                                <i class="fa-solid fa-building"></i> Für Veranstalter
                            </div>
                            
                            <!-- Title and Illustration Row -->
                            <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                                <h3 style="font-family: var(--font-heading); font-size: clamp(1.5rem, 2.8vw, 2.0rem); font-weight: 900; color: var(--text-main); margin: 0; line-height: 1.25; text-align: left;">
                                    <span style="color: #0f172a;">Dein Event.</span><br><span style="color: #2563eb;">Dein Act.</span>
                                </h3>
                                <!-- Illustration: calendar -->
                                <div style="width: 76px; height: 76px; background: rgba(37, 99, 235, 0.08); border-radius: 18px; display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0;">
                                    <i class="fa-solid fa-calendar-days" style="font-size: 2rem; color: #2563eb;"></i>
                                </div>
                            </div>

                            <!-- List stack -->
                            <div style="display: flex; flex-direction: column; gap: 0.8rem; width: 100%;">
                                
                                <!-- Item 1 -->
                                <div style="display: flex; align-items: center; gap: 1rem; min-height: 54px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(96, 165, 250, 0.35);">
                                        <i class="fa-solid fa-users" style="color: #2563eb; font-size: 1.0rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.05rem; text-align: left; font-family: var(--font-body);">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: #2563eb;">
                                            01 Kostenloser Zugang
                                        </div>
                                        <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">
                                            Zu Musikern
                                        </div>
                                        <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500; line-height: 1.35;">
                                            Coverbands, Bands, DJs, Duos, Trios, Gitarristen, Sänger etc.
                                        </div>
                                    </div>
                                </div>

                                <!-- Arrow 1 -->
                                <div style="display: flex; align-items: center; justify-content: center; width: 38px; margin: -0.2rem 0; color: rgba(37, 99, 235, 0.65); font-size: 1.25rem; height: 20px; flex-shrink: 0;">
                                    <i class="fa-solid fa-arrow-down"></i>
                                </div>

                                <!-- Item 2 -->
                                <div style="display: flex; align-items: center; gap: 1rem; min-height: 54px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(96, 165, 250, 0.35);">
                                        <i class="fa-solid fa-sliders" style="color: #2563eb; font-size: 1.0rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.05rem; text-align: left; font-family: var(--font-body);">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: #2563eb;">
                                            02 Passende Musiker
                                        </div>
                                        <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">
                                            Durch Filter-Logik
                                        </div>
                                        <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500; line-height: 1.35;">
                                            Musiker-Typ, Budget, Genre, Spieldauer etc.
                                        </div>
                                    </div>
                                </div>

                                <!-- Arrow 2 -->
                                <div style="display: flex; align-items: center; justify-content: center; width: 38px; margin: -0.2rem 0; color: rgba(37, 99, 235, 0.65); font-size: 1.25rem; height: 20px; flex-shrink: 0;">
                                    <i class="fa-solid fa-arrow-down"></i>
                                </div>

                                <!-- Item 3 -->
                                <div style="display: flex; align-items: center; gap: 1rem; min-height: 54px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(96, 165, 250, 0.35);">
                                        <i class="fa-solid fa-comments" style="color: #2563eb; font-size: 1.0rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.05rem; text-align: left; font-family: var(--font-body);">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: #2563eb;">
                                            03 Direkter Kontakt
                                        </div>
                                        <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">
                                            Zu Musikern
                                        </div>
                                        <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500; line-height: 1.35;">
                                            Name, Telefon, Mail, Nachricht ...
                                        </div>
                                    </div>
                                </div>

                                <!-- Arrow 3 -->
                                <div style="display: flex; align-items: center; justify-content: center; width: 38px; margin: -0.2rem 0; color: rgba(37, 99, 235, 0.65); font-size: 1.25rem; height: 20px; flex-shrink: 0;">
                                    <i class="fa-solid fa-arrow-down"></i>
                                </div>

                                <!-- Item 4 -->
                                <div style="display: flex; align-items: center; gap: 1rem; min-height: 54px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(96, 165, 250, 0.35);">
                                        <i class="fa-solid fa-star" style="color: #2563eb; font-size: 1.0rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.05rem; text-align: left; font-family: var(--font-body);">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: #2563eb;">
                                            04 Top-Vorschläge
                                        </div>
                                        <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">
                                            Durch Matching-Logik
                                        </div>
                                        <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500; line-height: 1.35;">
                                            Automatische Empfehlungen von GigConnAct
                                        </div>
                                    </div>
                                </div>

                                <!-- Arrow 4 -->
                                <div style="display: flex; align-items: center; justify-content: center; width: 38px; margin: -0.2rem 0; color: rgba(37, 99, 235, 0.65); font-size: 1.25rem; height: 20px; flex-shrink: 0;">
                                    <i class="fa-solid fa-arrow-down"></i>
                                </div>

                                <!-- Item 5 -->
                                <div style="display: flex; align-items: center; gap: 1rem; min-height: 54px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(96, 165, 250, 0.35);">
                                        <i class="fa-solid fa-bolt" style="color: #2563eb; font-size: 1.0rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.05rem; text-align: left; font-family: var(--font-body);">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: #2563eb;">
                                            05 Schnelle Anmeldung
                                        </div>
                                        <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">
                                            Anlegen eines Veranstalter-Profils
                                        </div>
                                        <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500; line-height: 1.35;">
                                            Ohne Passwort
                                        </div>
                                    </div>
                                </div>

                                <!-- Arrow 5 -->
                                <div style="display: flex; align-items: center; justify-content: center; width: 38px; margin: -0.2rem 0; color: rgba(37, 99, 235, 0.65); font-size: 1.25rem; height: 20px; flex-shrink: 0;">
                                    <i class="fa-solid fa-arrow-down"></i>
                                </div>

                                <!-- Item 6 -->
                                <div style="display: flex; align-items: center; gap: 1rem; min-height: 54px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(96, 165, 250, 0.35);">
                                        <i class="fa-solid fa-percent" style="color: #2563eb; font-size: 1.0rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.05rem; text-align: left; font-family: var(--font-body);">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: #2563eb;">
                                            06 Keine Provisionskosten
                                        </div>
                                        <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">
                                            Oder andere versteckte Kosten
                                        </div>
                                        <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500; line-height: 1.35;">
                                            Kostenlose Vermittlung für Veranstalter
                                        </div>
                                    </div>
                                </div>

                                <!-- Button: Hier geht's zum Musiker-Markt -->
                                <div style="margin-top: 1.5rem; text-align: center; width: 100%;">
                                    <button id="btn-benefits-to-musicians" class="btn-homepage-market theme-organizer" style="width: 100%; box-sizing: border-box; margin: 0;">
                                        Hier geht's zum Musiker-Markt <i class="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
<!-- Founder Title: „Airbnb für Live-Musik“ -->
            <div style="max-width: 900px; margin: 6rem auto -4rem; padding: 0 1.5rem; text-align: center;">
                <h2 style="font-family: var(--font-heading); font-size: clamp(1.8rem, 4.8vw, 3.5rem); font-weight: 900; background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent; margin: 0; line-height: 1.15; letter-spacing: -1.2px; text-transform: none;">
                    „Airbnb für Live-Musik“
                </h2>
            </div>

            <!-- 5.5. FOUNDER STORY SECTION -->
            <div style="max-width: 900px; margin: 6rem auto 0; padding: 0 1.5rem;">
                <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 24px; display: flex; flex-wrap: wrap; overflow: hidden; backdrop-filter: blur(12px); box-shadow: var(--shadow-glass);">
                    <!-- Left column: Image filling the space -->
                    <div style="flex: 1 1 300px; position: relative; min-height: 320px;">
                        <img src="founder.jpg" alt="Vibulan Sivanathan" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <!-- Right column: Text with padding -->
                    <div style="flex: 1.5 1 400px; padding: 3rem 2.5rem; display: flex; flex-direction: column; justify-content: center; gap: 1.2rem; text-align: left;">
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                            <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0;">Vibulan Sivanathan</h3>
                            <div style="display: flex; flex-direction: column; gap: 0.15rem; font-size: 0.95rem; font-weight: 700; letter-spacing: 0.3px;">
                                <span style="color: var(--text-muted);">Gründer von GigConnAct</span>
                                <span style="color: var(--text-muted);">Sänger von <a href="https://miamipink.de/" target="_blank" rel="noopener noreferrer" style="color: var(--text-muted); text-decoration: underline; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.85';" onmouseout="this.style.opacity='1';">MIAMI PINK</a></span>
                            </div>
                        </div>
                        <p style="font-size: 1.05rem; font-style: italic; color: var(--text-muted); line-height: 1.6; margin: 0; position: relative; padding-left: 1.2rem; border-left: 3px solid transparent; border-image: linear-gradient(to bottom, #7c3aed, #2563eb) 1;">
                            Als Musiker und Eventmanager kenne ich beide Seiten nur zu gut. Ich weiß, wie schwierig es sein kann, passende Gigs zu finden – und genauso herausfordernd ist es für Veranstalter, den richtigen Musiker zu entdecken und ihn unkompliziert zu kontaktieren. Genau aus diesem Problem heraus ist GigConnAct entstanden – das „Airbnb für Live-Musik“.
                        </p>
                    </div>
                </div>
            </div>

            <!-- 6. BOTTOM CALL-TO-ACTION SECTION -->
            ${bottomCtaButtonHtml ? `
            <div style="max-width: 1400px; margin: 6rem auto 0; padding: 0 1.5rem; text-align: center;">
                ${bottomCtaButtonHtml}
            </div>
            ` : ''}

            <!-- 7. FOOTER / IMPRESSUM -->
            <footer style="margin-top: 6rem; border-top: 1px solid var(--border-glass); padding: 4rem 1.5rem; text-align: center;">
                <div style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; align-items: center;">
                    <!-- Brand / Name with SVG Disco Ball -->
                    <div style="display: flex; align-items: center; gap: 0.6rem; justify-content: center; margin-bottom: 0.5rem;">
                        <!-- SVG Disco Ball -->
                        <svg viewBox="0 0 100 100" style="width: 28px; height: 28px; flex-shrink: 0; filter: drop-shadow(0 2px 6px rgba(124,58,237,0.15));">
                          <defs>
                            <radialGradient id="sphereGradFooter" cx="35%" cy="35%" r="65%">
                              <stop offset="0%" stop-color="#ffffff" />
                              <stop offset="40%" stop-color="#a78bfa" />
                              <stop offset="75%" stop-color="#6d28d9" />
                              <stop offset="100%" stop-color="#1e40af" />
                            </radialGradient>
                            <filter id="glowFooter" x="-20%" y="-20%" width="140%" height="140%">
                              <feGaussianBlur stdDeviation="1.2" result="blur" />
                              <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                          </defs>
                          <g class="spinning-disco-ball">
                              <circle cx="50" cy="50" r="40" fill="url(#sphereGradFooter)" />
                              <!-- Grid arcs -->
                              <path d="M 10 50 A 40 40 0 0 0 90 50 A 40 40 0 0 0 10 50" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="0.8" />
                              <path d="M 11.5 40 A 40 30 0 0 0 88.5 40" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                              <path d="M 15 30 A 40 20 0 0 0 85 30" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                              <path d="M 21.8 20 A 40 10 0 0 0 78.2 20" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                              <path d="M 11.5 60 A 40 30 0 0 1 88.5 60" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                              <path d="M 15 70 A 40 20 0 0 1 85 70" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                              <path d="M 21.8 80 A 40 10 0 0 1 78.2 80" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                              <path d="M 50 10 A 40 40 0 0 0 50 90" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="0.8" />
                              <path d="M 50 10 A 30 40 0 0 0 50 90" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                              <path d="M 50 10 A 20 40 0 0 0 50 90" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                              <path d="M 50 10 A 10 40 0 0 0 50 90" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                              <path d="M 50 10 A 30 40 0 0 1 50 90" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                              <path d="M 50 10 A 20 40 0 0 1 50 90" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                              <path d="M 50 10 A 10 40 0 0 1 50 90" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
                          </g>
                          <!-- Sparkles -->
                          <g class="sparkle-1" transform="translate(22, 25)" filter="url(#glowFooter)"><polygon points="0,-8 2,-2 8,0 2,2 0,8 -2,2 -8,0 -2,-2" fill="#ffffff" /></g>
                          <g class="sparkle-2" transform="translate(75, 30)" filter="url(#glowFooter)"><polygon points="0,-6 1.5,-1.5 6,0 1.5,1.5 0,6 -1.5,1.5 -6,0 -1.5,-1.5" fill="#ffffff" /></g>
                          <g class="sparkle-3" transform="translate(68, 68)" filter="url(#glowFooter)"><polygon points="0,-7 1.8,-1.8 7,0 1.8,1.8 0,7 -1.8,1.8 -7,0 -1.8,-1.8" fill="#ffffff" /></g>
                        </svg>
                        <div style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 900; background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">
                            GigConnAct
                        </div>
                    </div>
                    <!-- Impressum Info -->
                    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.5rem; font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; font-weight: 500;">
                        <div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 0.2rem;">
                            <a href="#/impressum" style="font-weight: 700; color: var(--text-main); font-size: 0.95rem; text-decoration: none;" onmouseover="this.style.color='var(--color-purple)';" onmouseout="this.style.color='var(--text-main)';">Impressum</a>
                            <span style="color: rgba(255,255,255,0.15);">&bull;</span>
                            <a href="#/datenschutz" style="font-weight: 700; color: var(--text-main); font-size: 0.95rem; text-decoration: none;" onmouseover="this.style.color='var(--color-purple)';" onmouseout="this.style.color='var(--text-main)';">Datenschutz</a>
                        </div>
                        <span>GigConnAct &bull; Montanusstraße 49 &bull; 51065 Köln</span>
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem;">
                            <span>Tel: <a href="tel:+4915788703998" style="color: var(--text-muted); text-decoration: none; font-weight: 600;" onmouseover="this.style.color='var(--color-purple)';" onmouseout="this.style.color='var(--text-muted)';">+49 15788703998</a></span>
                            <span>E-Mail: <a href="mailto:info@gigconnact.de" style="color: var(--text-muted); text-decoration: none; font-weight: 600;" onmouseover="this.style.color='var(--color-purple)';" onmouseout="this.style.color='var(--text-muted)';">info@gigconnact.de</a></span>
                        </div>
                    </div>
                    <!-- Copyright -->
                    <div style="font-size: 0.8rem; color: rgba(15, 23, 42, 0.4); margin-top: 1.5rem; font-weight: 500;">
                        &copy; 2026 GigConnAct. Alle Rechte vorbehalten.
                    </div>
                </div>
            </footer>

        </div>
    `;

        // Ensure hero logo is active and visible
    const heroLogo = document.getElementById('hero-logo-svg');
    if (heroLogo) {
        heroLogo.style.opacity = '1';
    }

    document.getElementById('btn-hero-musician')?.addEventListener('click', () => {
        onNavigate('events');
    });

    document.getElementById('btn-hero-organizer')?.addEventListener('click', () => {
        onNavigate('musicians');
    });

    document.getElementById('btn-benefits-to-events')?.addEventListener('click', () => {
        onNavigate('events');
    });

    document.getElementById('btn-benefits-to-musicians')?.addEventListener('click', () => {
        onNavigate('musicians');
    });

    // Add listeners for bottom buttons
    document.getElementById('btn-bottom-login-trigger')?.addEventListener('click', () => {
        showModal('auth', () => { navigateAfterLogin(); });
    });
    document.getElementById('btn-bottom-dashboard-trigger')?.addEventListener('click', () => {
        onNavigate('dashboard');
    });

    // Initialize carousels and reset position
    window.carouselPositions = { musicians: 0, events: 0, 'benefits-musician': 0, 'benefits-organizer': 0 };
    if (typeof initCarouselTouch === 'function') {
        initCarouselTouch('musicians');
        initCarouselTouch('events');
        initCarouselTouch('benefits-musician');
        initCarouselTouch('benefits-organizer');
    }
    if (typeof updateCarouselDots === 'function') {
        updateCarouselDots('musicians', 0);
        updateCarouselDots('events', 0);
    }

    // Video cycling logic (Seamless swap & cross-fade, avoiding Capcut outro)
    const heroVideos = [
        'hochzeit.mp4',
        'gartenparty.mp4',
        'firmenfeier.mp4',
        'konzert.mp4'
    ];
    let currentVideoIndex = 0;
    const v1 = container.querySelector('#hero-bg-video-1');
    const v2 = container.querySelector('#hero-bg-video-2');

    if (v1 && v2) {
        // Optimization: Defer preloading the next video in v2 until v1 has started playing.
        // This ensures 100% of bandwidth goes to loading the first background video quickly!
        const preloadNextVideo = () => {
            if (!v2.src || v2.src === '' || v2.src === window.location.href) {
                v2.src = heroVideos[1];
                v2.load();
            }
            v1.removeEventListener('playing', preloadNextVideo);
        };
        v1.addEventListener('playing', preloadNextVideo);
        // Fallback: If playing doesn't trigger, preload after 5 seconds
        setTimeout(preloadNextVideo, 5000);

        const transitionDuration = 1500; // 1.5s fade transition
        let isTransitioning = false;

        const startCrossfade = function(activePlayer, hiddenPlayer) {
            if (isTransitioning) return;
            isTransitioning = true;

            // Start playing the hidden player
            hiddenPlayer.play().then(() => {
                // Monitor frames to ensure we only fade after a frame has actually rendered!
                const startFadeWhenReady = () => {
                    if (hiddenPlayer.currentTime > 0) {
                        // Cross-fade opacity
                        hiddenPlayer.style.opacity = '1';
                        activePlayer.style.opacity = '0';

                        // After CSS transition finishes (1.5s)
                        setTimeout(() => {
                            // Swap z-indexes: hidden player becomes foreground
                            hiddenPlayer.style.zIndex = '2';
                            activePlayer.style.zIndex = '1';

                            // Preload the next video in activePlayer (which is now in background/hidden)
                            currentVideoIndex = (currentVideoIndex + 1) % heroVideos.length;
                            const nextIndex = (currentVideoIndex + 1) % heroVideos.length;

                            activePlayer.src = heroVideos[nextIndex];
                            activePlayer.load();

                            isTransitioning = false;

                            // Start monitoring the new active player
                            monitorPlayer(hiddenPlayer, activePlayer);
                        }, transitionDuration);
                    } else {
                        // Check again on next frame
                        requestAnimationFrame(startFadeWhenReady);
                    }
                };
                requestAnimationFrame(startFadeWhenReady);
            }).catch(err => {
                console.log("Play failed, fallback:", err);
                isTransitioning = false;
                // Try again in 2 seconds
                setTimeout(() => monitorPlayer(activePlayer, hiddenPlayer), 2000);
            });
        };

        const monitorPlayer = function(activePlayer, hiddenPlayer) {
            const onTimeUpdate = () => {
                const duration = activePlayer.duration;
                // Transition 2.5 seconds early to avoid CapCut outro watermark
                if (duration && activePlayer.currentTime >= Math.max(duration - 2.5, 3)) {
                    activePlayer.removeEventListener('timeupdate', onTimeUpdate);
                    activePlayer.removeEventListener('ended', onEnded);
                    startCrossfade(activePlayer, hiddenPlayer);
                }
            };

            const onEnded = () => {
                activePlayer.removeEventListener('timeupdate', onTimeUpdate);
                activePlayer.removeEventListener('ended', onEnded);
                startCrossfade(activePlayer, hiddenPlayer);
            };

            activePlayer.addEventListener('timeupdate', onTimeUpdate);
            activePlayer.addEventListener('ended', onEnded);
        };

        // Monitor the initial active player (v1)
        monitorPlayer(v1, v2);
    }
}


function getSelectOptions(list, selectedValues = []) {
    return list.map(item => `
        <option value="${item}" ${selectedValues.includes(item) ? 'selected' : ''}>${item}</option>
    `).join('');
}

function renderMatchDial(score) {
    const isOrganizer = state && state.currentUser && state.currentUser.role === 'organizer';
    
    let badgeColor = isOrganizer ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' : 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)';
    let textColor = '#ffffff';
    
    if (score >= 85) {
        badgeColor = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        textColor = '#ffffff';
    }

    return `
        <div class="match-score-container" style="display:flex; flex-direction:column; align-items:center;">
            <div style="background: ${badgeColor}; color: ${textColor}; padding: 0.35rem 0.45rem; border-radius: 10px; font-weight: 700; border: 1px solid rgba(255,255,255,0.25); text-align:center; min-width: 50px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.1;">
                <span style="font-size: 1.05rem; font-weight: 900;">${score}%</span>
                <span style="font-size: 0.5rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; opacity: 0.95; margin-top: 1px;">Match</span>
            </div>
        </div>
    `;
}

const popularGermanCities = [
    "Berlin (10115)", "Hamburg (20095)", "München (80331)", "Köln (50667)", "Frankfurt am Main (60311)", "Stuttgart (70173)", "Düsseldorf (40210)", "Dortmund (44135)", "Essen (45127)", "Leipzig (04109)", "Bremen (28195)", "Dresden (01067)", "Hannover (30159)", "Nürnberg (90402)", "Duisburg (47051)", "Bochum (44787)", "Wuppertal (42103)", "Bielefeld (33602)", "Bonn (53111)", "Münster (48143)", "Karlsruhe (76133)", "Mannheim (68161)", "Augsburg (86150)", "Wiesbaden (65183)", "Gelsenkirchen (45879)", "Mönchengladbach (41061)", "Braunschweig (38100)", "Chemnitz (09111)", "Aachen (52062)", "Kiel (24103)", "Halle (Saale) (06108)", "Magdeburg (39104)", "Freiburg im Breisgau (79098)", "Krefeld (47798)", "Lübeck (23552)", "Oberhausen (46045)", "Erfurt (99084)", "Mainz (55116)", "Rostock (18055)", "Kassel (34117)", "Hagen (58095)", "Hamm (59065)", "Saarbrücken (66111)", "Mülheim an der Ruhr (45468)", "Potsdam (14467)", "Ludwigshafen am Rhein (67059)", "Oldenburg (26122)", "Leverkusen (51373)", "Osnabrück (49074)", "Solingen (42651)", "Heidelberg (69117)", "Herne (44623)", "Neuss (41460)", "Darmstadt (64283)", "Paderborn (33098)", "Regensburg (93047)", "Ingolstadt (85049)", "Würzburg (97070)", "Fürth (90762)", "Wolfsburg (38440)", "Offenbach am Main (63065)", "Ulm (89073)", "Heilbronn (74072)", "Pforzheim (75175)", "Göttingen (37073)", "Bottrop (46236)", "Recklinghausen (45657)", "Reutlingen (72764)", "Koblenz (56068)", "Bergisch Gladbach (51465)", "Remscheid (42853)", "Bremerhaven (27568)", "Jena (07743)", "Trier (54290)", "Erlangen (91052)", "Moers (47441)", "Siegen (57072)", "Hildesheim (31134)", "Salzgitter (38226)", "Cottbus (03046)", "Kaiserslautern (67655)", "Witten (58452)", "Gütersloh (33330)", "Schwerin (19053)", "Gera (07545)", "Bad Homburg (61348)", "Marl (45768)", "Flensburg (24937)", "Lünen (44532)", "Villingen-Schwenningen (78048)", "Ratingen (40878)", "Neu-Isenburg (63263)", "Bad Salzuflen (32105)", "Tübingen (72070)", "Minden (32423)", "Worms (67547)", "Konstanz (78462)", "Wilhelmshaven (26382)", "Velbert (42549)", "Norderstedt (22846)", "Stein (90547)", "Castrop-Rauxel (44575)", "Delmenhorst (27749)", "Viersen (41747)", "Gladbeck (45964)", "Marburg (35037)", "Rheine (48431)", "Troisdorf (53840)", "Dorsten (46282)", "Lüneburg (21335)", "Detmold (32756)", "Bayreuth (95444)", "Arnsberg (59755)", "Lippstadt (59555)", "Landshut (84028)", "Dinslaken (46535)", "Plauen (08523)", "Weimar (99423)", "Neuwied (56564)", "Ibbenbüren (49479)", "Gießen (35390)", "Passau (94032)", "Freising (85354)", "Freital (01705)", "Frankfurt (Oder) (15230)", "Ravensburg (88212)", "Rosenheim (83022)", "Stralsund (18439)", "Lörrach (79539)", "Schweinfurt (97421)", "Baden-Baden (76530)", "Offenburg (77652)", "Stendal (39576)", "Heidenheim (89518)", "Garmisch-Partenkirchen (82467)", "Memmingen (87700)", "Dachau (85221)", "Kempten (Allgäu) (87435)", "Görlitz (02826)", "Bautzen (02625)", "Sindelfingen (71063)", "Goch (47574)", "Kleve (47533)", "Wesel (46483)", "Kevelaer (47623)", "Kempen (47906)", "Nettetal (41334)"
];

function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1  // deletion
                    )
                );
            }
        }
    }
}

function normalizeStringForSearch(str) {
    if (!str) return '';
    return str.toLowerCase()
        .replace(/ä/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u')
        .replace(/ß/g, 'ss')
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getFuzzyScore(query, target) {
    const q = normalizeStringForSearch(query);
    const t = normalizeStringForSearch(target);
    
    if (t.startsWith(q)) return 100 + q.length;
    
    const idx = t.indexOf(q);
    if (idx !== -1) return 80 - idx;
    
    const dist = levenshteinDistance(q, t);
    if (q.length >= 3 && dist <= 2) {
        return 50 - dist;
    }
    
    return 0;
}

function initDualSlider(containerId, minInputId, maxInputId, trackId, displayId, unit, isPrice, parentElement = document) {
    const container = parentElement.querySelector('#' + containerId) || document.getElementById(containerId);
    if (!container) return;
    const minInput = parentElement.querySelector('#' + minInputId) || document.getElementById(minInputId);
    const maxInput = parentElement.querySelector('#' + maxInputId) || document.getElementById(maxInputId);
    const track = parentElement.querySelector('#' + trackId) || document.getElementById(trackId);
    const display = parentElement.querySelector('#' + displayId) || document.getElementById(displayId);

    function updateSlider() {
        let minVal = parseFloat(minInput.value);
        let maxVal = parseFloat(maxInput.value);

        if (minVal > maxVal) {
            const temp = minVal;
            minVal = maxVal;
            maxVal = temp;
        }

        const percentMin = ((minVal - minInput.min) / (minInput.max - minInput.min)) * 100;
        const percentMax = ((maxVal - maxInput.min) / (maxInput.max - minInput.min)) * 100;

        if (track) {
            track.style.left = percentMin + '%';
            track.style.width = (percentMax - percentMin) + '%';
        }

        if (display) {
            if (isPrice) {
                if (maxVal >= 5000) {
                    display.textContent = `${minVal.toLocaleString('de-DE')} - 5.000+ €`;
                } else {
                    display.textContent = `${minVal.toLocaleString('de-DE')} - ${maxVal.toLocaleString('de-DE')} €`;
                }
            } else if (unit === 'Std.') {
                display.textContent = `${minVal.toFixed(1).replace('.', ',')} - ${maxVal.toFixed(1).replace('.', ',')} Std.`;
            } else if (unit === 'Personen') {
                if (maxVal >= 500) {
                    display.textContent = `${minVal} - 500+ Personen`;
                } else {
                    display.textContent = `${minVal} - ${maxVal} Personen`;
                }
            } else {
                display.textContent = `${minVal} - ${maxVal} ${unit}`;
            }
        }
    }

    minInput.addEventListener('input', updateSlider);
    maxInput.addEventListener('input', updateSlider);
    updateSlider();
}

function setupLocationAutocomplete(input, onSelect) {
    if (!input) return;
    
    let wrapper = input.parentElement;
    if (wrapper && (window.getComputedStyle(wrapper).display === 'flex' || wrapper.style.display === 'flex')) {
        const relativeWrapper = document.createElement('div');
        relativeWrapper.style.position = 'relative';
        relativeWrapper.style.flex = '1';
        relativeWrapper.style.display = 'flex';
        relativeWrapper.style.flexDirection = 'column';
        
        wrapper.insertBefore(relativeWrapper, input);
        relativeWrapper.appendChild(input);
        input.style.width = '100%';
        wrapper = relativeWrapper;
    } else {
        if (wrapper) {
            wrapper.style.position = 'relative';
        }
    }

    let debounceTimer;
    let suggestionsContainer = document.createElement('div');
    let extraClass = '';
    if (input.id === 'input-mus-location-search') {
        extraClass = ' musician-suggestions';
    } else if (input.id === 'input-org-location-search') {
        extraClass = ' organizer-suggestions';
    }
    suggestionsContainer.className = 'autocomplete-suggestions hidden' + extraClass;
    wrapper.appendChild(suggestionsContainer);

    let activeIndex = -1;
    if (input.value) input.dataset.lastValidVal = input.value;

    function selectSuggestion(item) {
        const val = item.getAttribute('data-val');
        input.value = '';
        suggestionsContainer.classList.add('hidden');
        activeIndex = -1;
        input.dataset.lastValidVal = val;
        if (onSelect) {
            onSelect(val);
        } else {
            input.value = val;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.classList.add('hidden');
            activeIndex = -1;
            return;
        }

        debounceTimer = setTimeout(async () => {
            try {
                // 1. Get local fuzzy matches (error-tolerant, e.g. Koln -> Köln)
                const localMatches = [];
                popularGermanCities.forEach(city => {
                    const score = getFuzzyScore(query, city);
                    if (score > 0) {
                        localMatches.push({
                            name: city,
                            label: city,
                            score: score
                        });
                    }
                });

                // Sort local matches by score descending
                localMatches.sort((a, b) => b.score - a.score);

                // 2. Fetch from Nominatim API (Germany only, settlements)
                let apiMatches = [];
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=de&addressdetails=1&featuretype=settlement&limit=10`, {
                        headers: { 'Accept-Language': 'de' }
                    });
                    const data = await response.json();
                    if (data && data.length > 0) {
                        apiMatches = data.map(item => {
                            const addr = item.address;
                            const cityName = addr.city || addr.town || addr.village || addr.municipality || item.name;
                            const displayZip = addr.postcode;
                            const displayCity = displayZip ? `${cityName} (${displayZip})` : cityName;
                            const state = addr.state ? `, ${addr.state}` : '';
                            return {
                                name: displayCity,
                                label: displayZip ? `${displayCity}${state}` : `${cityName}${state}`
                            };
                        });
                    }
                } catch (apiErr) {
                    console.warn("Nominatim API lookup failed, falling back to local matches: ", apiErr);
                }

                // 3. Combine both lists, deduplicate by city name (case-insensitive)
                const combined = [];
                const seen = new Set();

                // Prioritize local matches first
                localMatches.forEach(m => {
                    const key = m.name.toLowerCase();
                    if (!seen.has(key)) {
                        seen.add(key);
                        combined.push({ name: m.name, label: m.label });
                    }
                });

                // Add API matches if they aren't already included
                apiMatches.forEach(m => {
                    const key = m.name.toLowerCase();
                    if (!seen.has(key)) {
                        seen.add(key);
                        combined.push(m);
                    }
                });

                // Limit suggestions to exactly 5
                const finalSuggestions = combined.slice(0, 5);

                if (finalSuggestions.length === 0) {
                    suggestionsContainer.innerHTML = '';
                    suggestionsContainer.classList.add('hidden');
                    activeIndex = -1;
                    return;
                }

                suggestionsContainer.innerHTML = finalSuggestions.map((item, index) => {
                    return `
                        <div class="autocomplete-suggestion" data-val="${item.name}" data-index="${index}">
                            <i class="fa-solid fa-map-marker-alt"></i>
                            <span>${item.label}</span>
                        </div>
                    `;
                }).join('');

                suggestionsContainer.classList.remove('hidden');
                activeIndex = -1;

                suggestionsContainer.querySelectorAll('.autocomplete-suggestion').forEach(item => {
                    item.addEventListener('click', () => {
                        selectSuggestion(item);
                    });
                });

            } catch (err) {
                console.error("Autocomplete error: ", err);
            }
        }, 250);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const items = suggestionsContainer.querySelectorAll('.autocomplete-suggestion');
            if (!suggestionsContainer.classList.contains('hidden') && items.length > 0) {
                const targetIndex = activeIndex >= 0 ? activeIndex : 0;
                selectSuggestion(items[targetIndex]);
            } else {
                const val = input.value.trim();
                if (val) {
                    const matchedCity = popularGermanCities.find(c => {
                        const cityName = c.split(' (')[0].toLowerCase();
                        return cityName === val.toLowerCase() || c.toLowerCase() === val.toLowerCase();
                    });
                    if (matchedCity) {
                        input.dataset.lastValidVal = matchedCity;
                        if (onSelect) {
                            onSelect(matchedCity);
                            input.value = '';
                        } else {
                            input.value = matchedCity;
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                            input.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    } else {
                        if (onSelect) {
                            input.value = '';
                        } else {
                            input.value = input.dataset.lastValidVal || '';
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                            input.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        showToast({
                            title: "Ort ungültig",
                            message: "Bitte wähle einen Ort aus den Vorschlägen aus."
                        });
                    }
                }
            }
            suggestionsContainer.classList.add('hidden');
        } else {
            const items = suggestionsContainer.querySelectorAll('.autocomplete-suggestion');
            if (suggestionsContainer.classList.contains('hidden') || items.length === 0) {
                return;
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeIndex = (activeIndex + 1) % items.length;
                updateActiveSuggestion(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeIndex = (activeIndex - 1 + items.length) % items.length;
                updateActiveSuggestion(items);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                suggestionsContainer.classList.add('hidden');
                activeIndex = -1;
            }
        }
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
            const val = input.value.trim();
            if (!val) {
                input.dataset.lastValidVal = '';
                if (!onSelect) {
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
                return;
            }
            
            const matchedCity = popularGermanCities.find(c => {
                const cityName = c.split(' (')[0].toLowerCase();
                return cityName === val.toLowerCase() || c.toLowerCase() === val.toLowerCase();
            });
            if (matchedCity) {
                input.dataset.lastValidVal = matchedCity;
                if (onSelect) {
                    onSelect(matchedCity);
                    input.value = '';
                } else {
                    input.value = matchedCity;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            } else {
                const firstItem = suggestionsContainer.querySelector('.autocomplete-suggestion');
                if (firstItem && !suggestionsContainer.classList.contains('hidden')) {
                    const firstVal = firstItem.getAttribute('data-val');
                    input.dataset.lastValidVal = firstVal;
                    if (onSelect) {
                        onSelect(firstVal);
                        input.value = '';
                    } else {
                        input.value = firstVal;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                } else {
                    if (onSelect) {
                        input.value = '';
                    } else {
                        input.value = input.dataset.lastValidVal || '';
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                        showToast({
                            title: "Ort ungültig",
                            message: "Bitte wähle einen Ort aus den Vorschlägen aus."
                        });
                    }
                }
            }
            suggestionsContainer.classList.add('hidden');
        }, 300);
    });

    function updateActiveSuggestion(items) {
        items.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('active');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target !== input && e.target !== suggestionsContainer && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.classList.add('hidden');
            activeIndex = -1;
        }
    });
}

function initAllLocationAutocompletes() {
    document.querySelectorAll('input[name="location"], input[name="musLocation"], input[name="orgLocation"], #input-mus-location-search, #input-org-location-search, #filter-location, #filter-location-m').forEach(input => {
        if (!input.dataset.autocompleteBound) {
            setupLocationAutocomplete(input);
            input.dataset.autocompleteBound = "true";
        }
    });
}

function renderMarket(container, type, onNavigate) {
    const isEvents = type === 'events';
    const title = isEvents ? 'Event-Markt für Musiker' : 'Musiker-Markt für Veranstalter';

    const items = isEvents ? state.events : state.musicians;
    
    let selectedFilterDates = [];
    let currentFilterCalDate = new Date(2026, 6, 1); // July 2026
    let showOnlyTopMatches = false;
    let showOnlyFavorites = false;

    container.innerHTML = `
        <div class="market-page ${isEvents ? 'theme-musician' : 'theme-organizer'}" style="max-width: 1520px; margin: 0 auto; padding: 1.5rem 1rem 5rem; box-sizing: border-box;">
            
            <div class="market-controls-row" style="display: flex; align-items: center; gap: 0.35rem; margin-bottom: 0.75rem; flex-wrap: nowrap; justify-content: flex-start; width: 100%; box-sizing: border-box; overflow-x: auto; padding: 0.5rem 0px; -webkit-overflow-scrolling: touch;">
                
                <!-- 1. Ergebnisse als Zahl + Label at the very left -->
                <div style="display: flex; align-items: center; gap: 0.7rem; flex-shrink: 0; padding-right: 0.5rem; padding-left: 1.5rem;">
                    <div id="market-results-count" style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 900; color: #ffffff; text-align: center; padding: 0.2rem 0.55rem; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); border-radius: 20px; min-width: 32px; white-space: nowrap; margin: 0; line-height: 1.2;">
                        ${items.length}
                    </div>
                    <span id="market-title-label" style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 900; color: #ffffff; white-space: nowrap; letter-spacing: -0.3px; line-height: 1.1; vertical-align: middle;">
                        ${isEvents ? 'Event-Markt' : 'Musiker-Markt'}
                    </span>
                </div>

                <!-- 2. Filter -->
                <button class="market-filter-mobile-toggle" id="btn-toggle-mobile-filters" style="margin: 0; display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; padding: 0; border-radius: 50%; flex-shrink: 0; cursor: pointer; margin-left: auto;" title="Filter öffnen">
                    <i class="fa-solid fa-sliders" style="font-size: 1.05rem; margin: 0;"></i>
                </button>
 
                <!-- 3. Stern (Nur Top-Matches anzeigen) -->
                <button class="market-control-toggle" id="btn-toggle-market-top-matches" style="margin: 0; display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; padding: 0; border-radius: 50%; cursor: pointer; transition: all 0.3s; flex-shrink: 0;" title="Nur Top-Matches anzeigen">
                    <i class="fa-solid fa-star" style="font-size: 1.05rem; margin: 0;"></i>
                </button>

                <!-- 4. Herz (Nur Favoriten anzeigen) -->
                <button class="market-control-toggle" id="btn-toggle-market-favorites" style="margin: 0 0.5rem 0 0; display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; padding: 0; border-radius: 50%; cursor: pointer; transition: all 0.3s; flex-shrink: 0;" title="Nur Favoriten anzeigen">
                    <i class="fa-solid fa-heart" style="font-size: 1.05rem; margin: 0;"></i>
                </button>
            </div>

            <!-- Main Layout: Left Sticky Sidebar Filters + Center Content -->
            <div class="market-layout-container">
                
                <!-- Left Sidebar Filters (Responsive Wrapper) -->
                <div id="market-filters-wrapper" class="market-filter-card">
                                        <div class="filter-header-sticky" style="display: flex; align-items: center; position: relative; width: calc(100% - 1.2rem) !important;">
                        <!-- Left: Title -->
                        <span class="filter-header-title" style="flex: 1; text-align: left; font-family: var(--font-heading); font-weight: 900; font-size: 1.1rem; letter-spacing: -0.3px;">
                            Filter
                        </span>
                        
                        <!-- Center: Sort and Reset -->
                        <div class="filter-header-controls" style="display: flex; align-items: center; gap: 1.2rem; justify-content: center; flex: 1;">
                            <!-- 2. Sortierung inside Filter Sidebar Header -->
                            <div class="market-sort-container-round" style="width: 42px !important; height: 42px !important; display: flex !important; align-items: center !important; justify-content: center !important; border-radius: 50% !important; flex-shrink: 0; position: relative; margin: 0; cursor: pointer; transition: all 0.2s;">
                                <i class="fa-solid fa-arrow-down-wide-short" style="color: #ffffff; font-size: 1.05rem; pointer-events: none;"></i>
                                <select id="sort-select" style="position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; -webkit-appearance: none; -moz-appearance: none; appearance: none; margin: 0; z-index: 5;">
                                    <option value="match">Match-Faktor absteigend</option>
                                    <option value="newest">Neueste zuerst</option>
                                    <option value="price">Günstig zuerst</option>
                                    <option value="distance">Nächste zuerst</option>
                                    <option value="name">Name (A-Z)</option>
                                </select>
                            </div>
                            
                            <button id="btn-reset-filters" class="btn-reset-round" title="Filter zurücksetzen" style="margin: 0; width: 42px; height: 42px;">
                                <i class="fa-solid fa-rotate-left"></i>
                            </button>
                        </div>
                        
                                                <!-- Right: Mobile Close Button -->
                        <div class="filter-header-close-wrapper" style="flex: 1; display: flex; justify-content: flex-end;">
                            <button id="btn-close-filters-m" class="btn-close-filters-m" style="margin: 0; width: 42px; height: 42px;" title="Filter anwenden">
                                <i class="fa-solid fa-check"></i>
                            </button>
                        </div>
                    </div>
                    
                    ${isEvents ? `
                        <!-- 10 Event-Markt Filter + Suchbegriffe mit tag-pill-checkboxes & dual range sliders -->
                        <div style="display: flex; flex-direction: column; gap: 0.8rem; padding: 1rem;">
                            
                            <!-- SUCHBEGRIFFE FELD (WEISSES EINGABEFELD) -->
                            <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #7c3aed; margin-bottom: 0.35rem;">Suchbegriffe</label>
                                <input type="text" id="filter-keyword" placeholder="z.B. Hochzeit, Sax, Rock..." class="form-input" style="width: 100% !important; max-width: 100% !important; min-width: 0 !important; box-sizing: border-box !important; display: block !important; padding: 0.55rem; border-radius: 8px; border: 1px solid #cbd5e1; background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                                    <label style="font-size: 0.85rem; font-weight: 900; color: #7c3aed; margin: 0;">Event-Typ</label>
                                    <div style="display: flex; gap: 0.5rem; font-size: 0.75rem; font-weight: 700;">
                                        <span onclick="window.toggleAllFilterCheckboxes(this, true)" style="color: #7c3aed; cursor: pointer; text-decoration: underline;">alle auswählen</span>
                                    </div>
                                </div>
                                <div class="checkbox-tag-grid" id="filter-event-type-grid">
                                    ${['Geburtstag', 'Hochzeit – Trauung', 'Hochzeit - Sektempfang', 'Hochzeit – Party', 'Polterabend', 'Firmenfeier', 'Sommerfest', 'Öffentliches Event', 'Stadtfest', 'Kirmes', 'Karnevalsparty', 'Oktoberfest', 'Schützenfest', 'Vereinsfest', 'Sportveranstaltung', 'Jubiläum', 'Festival', 'Konzert', 'Bar/Kneipe/Club', 'Sonstige'].map(t => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterEventTypes" value="${t}" checked checked>
                                            <span>${t}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #7c3aed; margin-bottom: 0.35rem;">Datum / Kalender</label>
                                <div class="filter-calendar-widget" id="filter-calendar-widget">
                                    <div class="filter-calendar-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                        <button type="button" class="btn-cal-prev" id="btn-filter-cal-prev" style="background: none; border: none; cursor: pointer; color: #64748b; padding: 0.2rem 0.5rem;"><i class="fa-solid fa-chevron-left"></i></button>
                                        <span id="filter-calendar-month-year" style="font-weight: 800; font-size: 0.85rem; color: #0f172a;">Juli 2026</span>
                                        <button type="button" class="btn-cal-next" id="btn-filter-cal-next" style="background: none; border: none; cursor: pointer; color: #64748b; padding: 0.2rem 0.5rem;"><i class="fa-solid fa-chevron-right"></i></button>
                                    </div>
                                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 0.7rem; font-weight: 800; color: #64748b; margin-bottom: 0.35rem;">
                                        <div>Mo</div><div>Di</div><div>Mi</div><div>Do</div><div>Fr</div><div>Sa</div><div>So</div>
                                    </div>
                                    <div id="filter-calendar-days-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;"></div>
                                    <div id="filter-selected-dates-preview" style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.6rem;"></div>
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #7c3aed; margin-bottom: 0.35rem;">Ort / PLZ</label>
                                <input type="text" id="filter-location" placeholder="z.B. Köln" class="form-input" style="width: 100% !important; max-width: 100% !important; min-width: 0 !important; box-sizing: border-box !important; display: block !important; padding: 0.55rem; border-radius: 8px; border: 1px solid #cbd5e1; background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                                    <label style="font-size: 0.85rem; font-weight: 900; color: #7c3aed; margin: 0;">Genres</label>
                                    <div style="display: flex; gap: 0.5rem; font-size: 0.75rem; font-weight: 700;">
                                        <span onclick="window.toggleAllFilterCheckboxes(this, true)" style="color: #7c3aed; cursor: pointer; text-decoration: underline;">alle auswählen</span>
                                    </div>
                                </div>
                                <div class="checkbox-tag-grid" id="filter-genres-grid">
                                    ${['Pop', 'Rock', 'Schlager', 'Funk', 'Charts', 'Evergreens', 'Dance', 'Elektronisch', 'Jazz', 'Latin', 'R&B', 'Soul', 'Hip Hop', 'Rap', 'Punk', 'Metal', 'Alternative', 'Indie', '60er', '70er', '80er', '90er', '2000er', '2010er', 'Afrobeat', 'Blues', 'Gospel', 'Country', 'Folk', 'K-Pop', 'Klassisch', 'Sonstige'].map(g => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterGenres" value="${g}" checked>
                                            <span>${g}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                                    <label style="font-size: 0.85rem; font-weight: 900; color: #7c3aed; margin: 0;">Instrumente</label>
                                    <div style="display: flex; gap: 0.5rem; font-size: 0.75rem; font-weight: 700;">
                                        <span onclick="window.toggleAllFilterCheckboxes(this, true)" style="color: #7c3aed; cursor: pointer; text-decoration: underline;">alle auswählen</span>
                                    </div>
                                </div>
                                <div class="checkbox-tag-grid" id="filter-instruments-grid">
                                    ${['Akustik', 'Gesang', 'Gitarre', 'Klavier', 'Bass', 'Schlagzeug', 'Percussion', 'Saxophon', 'Trompete', 'Geige', 'Cello', 'Harfe', 'Sonstige'].map(ins => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterInstruments" value="${ins}" checked>
                                            <span>${ins}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div class="slider-value-display">
                                    <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #7c3aed; margin-bottom: 0.35rem;">Spieldauer (Std.)</label>
                                    <span id="val-filter-duration" style="font-size: 0.85rem; font-weight: 700; color: #7c3aed;">0,5 - 10,0 Std.</span>
                                </div>
                                <div class="dual-range-slider" id="slider-filter-duration-container">
                                    <div class="dual-range-track"></div>
                                    <div class="dual-range-active-track" id="track-filter-duration"></div>
                                    <input type="range" class="form-input" id="input-filter-duration-min" min="0.5" max="10" step="0.5" value="0.5">
                                    <input type="range" class="form-input" id="input-filter-duration-max" min="0.5" max="10" step="0.5" value="10.0">
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div class="slider-value-display">
                                    <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #7c3aed; margin-bottom: 0.35rem;">Budget (€)</label>
                                    <span id="val-filter-budget" style="font-size: 0.85rem; font-weight: 700; color: #7c3aed;">0 - 5.000+ €</span>
                                </div>
                                <div class="dual-range-slider" id="slider-filter-budget-container">
                                    <div class="dual-range-track"></div>
                                    <div class="dual-range-active-track" id="track-filter-budget"></div>
                                    <input type="range" class="form-input" id="input-filter-budget-min" min="0" max="5000" step="100" value="0">
                                    <input type="range" class="form-input" id="input-filter-budget-max" min="0" max="5000" step="100" value="5000">
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div class="slider-value-display">
                                    <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #7c3aed; margin-bottom: 0.35rem;">Gäste (Anzahl)</label>
                                    <span id="val-filter-publikum" style="font-size: 0.85rem; font-weight: 700; color: #7c3aed;">0 - 500+</span>
                                </div>
                                <div class="dual-range-slider" id="slider-filter-publikum-container">
                                    <div class="dual-range-track"></div>
                                    <div class="dual-range-active-track" id="track-filter-publikum"></div>
                                    <input type="range" class="form-input" id="input-filter-publikum-min" min="0" max="500" step="50" value="0">
                                    <input type="range" class="form-input" id="input-filter-publikum-max" min="0" max="500" step="50" value="500">
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                                    <label style="font-size: 0.85rem; font-weight: 900; color: #7c3aed; margin: 0;">Technik</label>
                                    <div style="display: flex; gap: 0.5rem; font-size: 0.75rem; font-weight: 700;">
                                        <span onclick="window.toggleAllFilterCheckboxes(this, true)" style="color: #7c3aed; cursor: pointer; text-decoration: underline;">alle auswählen</span>
                                    </div>
                                </div>
                                <div class="checkbox-tag-grid" id="filter-technik-grid">
                                    ${['Technik vorhanden', 'Technik ist noch unklar', 'Technik nicht vorhanden'].map(t => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterTechnik" value="${t}" checked>
                                            <span>${t}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                        </div>
                    ` : `
                        <!-- 10 Musiker-Markt Filter + Suchbegriffe mit tag-pill-checkboxes & dual range sliders -->
                        <div style="display: flex; flex-direction: column; gap: 0.8rem; padding: 1rem;">
                            
                            <!-- SUCHBEGRIFFE FELD (WEISSES EINGABEFELD) -->
                            <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #2563eb; margin-bottom: 0.35rem;">Suchbegriffe</label>
                                <input type="text" id="filter-keyword-m" placeholder="z.B. Acoustic, Sax, Pop..." class="form-input" style="width: 100% !important; max-width: 100% !important; min-width: 0 !important; box-sizing: border-box !important; display: block !important; padding: 0.55rem; border-radius: 8px; border: 1px solid #cbd5e1; background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                                    <label style="font-size: 0.85rem; font-weight: 900; color: #2563eb; margin: 0;">Musiker-Typ</label>
                                    <div style="display: flex; gap: 0.5rem; font-size: 0.75rem; font-weight: 700;">
                                        <span onclick="window.toggleAllFilterCheckboxes(this, true)" style="color: #2563eb; cursor: pointer; text-decoration: underline;">alle auswählen</span>
                                    </div>
                                </div>
                                <div class="checkbox-tag-grid" id="filter-musician-type-grid">
                                    ${['Sänger', 'Solokünstler', 'Duo', 'Trio', 'Band', 'Coverband', 'Big Band', 'Ensemble', 'Chor', 'Orchester', 'DJ', 'Alleinunterhalter', 'Showkünstler/Tänzer', 'Sonstige'].map(t => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterMusicianTypes" value="${t}" checked>
                                            <span>${t}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #2563eb; margin-bottom: 0.35rem;">Datum / Kalender</label>
                                <div class="filter-calendar-widget" id="filter-calendar-widget">
                                    <div class="filter-calendar-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                        <button type="button" class="btn-cal-prev" id="btn-filter-cal-prev" style="background: none; border: none; cursor: pointer; color: #64748b; padding: 0.2rem 0.5rem;"><i class="fa-solid fa-chevron-left"></i></button>
                                        <span id="filter-calendar-month-year" style="font-weight: 800; font-size: 0.85rem; color: #0f172a;">Juli 2026</span>
                                        <button type="button" class="btn-cal-next" id="btn-filter-cal-next" style="background: none; border: none; cursor: pointer; color: #64748b; padding: 0.2rem 0.5rem;"><i class="fa-solid fa-chevron-right"></i></button>
                                    </div>
                                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 0.7rem; font-weight: 800; color: #64748b; margin-bottom: 0.35rem;">
                                        <div>Mo</div><div>Di</div><div>Mi</div><div>Do</div><div>Fr</div><div>Sa</div><div>So</div>
                                    </div>
                                    <div id="filter-calendar-days-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;"></div>
                                    <div id="filter-selected-dates-preview" style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.6rem;"></div>
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #2563eb; margin-bottom: 0.35rem;">Ort</label>
                                <input type="text" id="filter-location-m" placeholder="z.B. München" class="form-input" style="width: 100% !important; max-width: 100% !important; min-width: 0 !important; box-sizing: border-box !important; display: block !important; padding: 0.55rem; border-radius: 8px; border: 1px solid #cbd5e1; background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div class="slider-value-display">
                                    <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #2563eb; margin-bottom: 0.35rem;">Maximaler Umkreis</label>
                                    <span id="val-filter-radius-m" style="font-size: 0.85rem; font-weight: 700; color: #2563eb;">500 km</span>
                                </div>
                                <input type="range" class="form-input" id="input-filter-radius-m" min="0" max="500" step="50" value="500" style="width: 100%; accent-color: #2563eb;">
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                                    <label style="font-size: 0.85rem; font-weight: 900; color: #2563eb; margin: 0;">Genres</label>
                                    <div style="display: flex; gap: 0.5rem; font-size: 0.75rem; font-weight: 700;">
                                        <span onclick="window.toggleAllFilterCheckboxes(this, true)" style="color: #2563eb; cursor: pointer; text-decoration: underline;">alle auswählen</span>
                                    </div>
                                </div>
                                <div class="checkbox-tag-grid" id="filter-genres-grid-m">
                                    ${['Pop', 'Rock', 'Schlager', 'Funk', 'Charts', 'Evergreens', 'Dance', 'Elektronisch', 'Jazz', 'Latin', 'R&B', 'Soul', 'Hip Hop', 'Rap', 'Punk', 'Metal', 'Alternative', 'Indie', '60er', '70er', '80er', '90er', '2000er', '2010er', 'Afrobeat', 'Blues', 'Gospel', 'Country', 'Folk', 'K-Pop', 'Klassisch', 'Sonstige'].map(g => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterGenresM" value="${g}" checked>
                                            <span>${g}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                                    <label style="font-size: 0.85rem; font-weight: 900; color: #2563eb; margin: 0;">Instrumente</label>
                                    <div style="display: flex; gap: 0.5rem; font-size: 0.75rem; font-weight: 700;">
                                        <span onclick="window.toggleAllFilterCheckboxes(this, true)" style="color: #2563eb; cursor: pointer; text-decoration: underline;">alle auswählen</span>
                                    </div>
                                </div>
                                <div class="checkbox-tag-grid" id="filter-instruments-grid-m">
                                    ${['Akustik', 'Gesang', 'Gitarre', 'Klavier', 'Bass', 'Schlagzeug', 'Percussion', 'Saxophon', 'Trompete', 'Geige', 'Cello', 'Harfe', 'Sonstige'].map(ins => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterInstrumentsM" value="${ins}" checked>
                                            <span>${ins}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div class="slider-value-display">
                                    <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #2563eb; margin-bottom: 0.35rem;">Spieldauer (Std.)</label>
                                    <span id="val-filter-duration-m" style="font-size: 0.85rem; font-weight: 700; color: #2563eb;">0,5 - 10,0 Std.</span>
                                </div>
                                <div class="dual-range-slider" id="slider-filter-duration-m-container">
                                    <div class="dual-range-track"></div>
                                    <div class="dual-range-active-track" id="track-filter-duration-m"></div>
                                    <input type="range" class="form-input" id="input-filter-duration-m-min" min="0.5" max="10" step="0.5" value="0.5">
                                    <input type="range" class="form-input" id="input-filter-duration-m-max" min="0.5" max="10" step="0.5" value="10.0">
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div class="slider-value-display">
                                    <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #2563eb; margin-bottom: 0.35rem;">Gage (€)</label>
                                    <span id="val-filter-gage-m" style="font-size: 0.85rem; font-weight: 700; color: #2563eb;">0 - 5.000+ €</span>
                                </div>
                                <div class="dual-range-slider" id="slider-filter-gage-m-container">
                                    <div class="dual-range-track"></div>
                                    <div class="dual-range-active-track" id="track-filter-gage-m"></div>
                                    <input type="range" class="form-input" id="input-filter-gage-m-min" min="0" max="5000" step="100" value="0">
                                    <input type="range" class="form-input" id="input-filter-gage-m-max" min="0" max="5000" step="100" value="5000">
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div class="slider-value-display">
                                    <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #2563eb; margin-bottom: 0.35rem;">Publikum (Anzahl)</label>
                                    <span id="val-filter-publikum-m" style="font-size: 0.85rem; font-weight: 700; color: #2563eb;">0 - 500+</span>
                                </div>
                                <div class="dual-range-slider" id="slider-filter-publikum-m-container">
                                    <div class="dual-range-track"></div>
                                    <div class="dual-range-active-track" id="track-filter-publikum-m"></div>
                                    <input type="range" class="form-input" id="input-filter-publikum-m-min" min="0" max="500" step="50" value="0">
                                    <input type="range" class="form-input" id="input-filter-publikum-m-max" min="0" max="500" step="50" value="500">
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                                    <label style="font-size: 0.85rem; font-weight: 900; color: #2563eb; margin: 0;">Bevorzugte Event-Typen</label>
                                    <div style="display: flex; gap: 0.5rem; font-size: 0.75rem; font-weight: 700;">
                                        <span onclick="window.toggleAllFilterCheckboxes(this, true)" style="color: #2563eb; cursor: pointer; text-decoration: underline;">alle auswählen</span>
                                    </div>
                                </div>
                                <div class="checkbox-tag-grid" id="filter-event-types-grid-m">
                                    ${['Geburtstag', 'Hochzeit – Trauung', 'Hochzeit - Sektempfang', 'Hochzeit – Party', 'Polterabend', 'Firmenfeier', 'Sommerfest', 'Öffentliches Event', 'Stadtfest', 'Kirmes', 'Karnevalsparty', 'Oktoberfest', 'Schützenfest', 'Vereinsfest', 'Sportveranstaltung', 'Jubiläum', 'Festival', 'Konzert', 'Bar/Kneipe/Club', 'Sonstige'].map(evt => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterEventTypesM" value="${evt}" checked>
                                            <span>${evt}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                                    <label style="font-size: 0.85rem; font-weight: 900; color: #2563eb; margin: 0;">Technik</label>
                                    <div style="display: flex; gap: 0.5rem; font-size: 0.75rem; font-weight: 700;">
                                        <span onclick="window.toggleAllFilterCheckboxes(this, true)" style="color: #2563eb; cursor: pointer; text-decoration: underline;">alle auswählen</span>
                                    </div>
                                </div>
                                <div class="checkbox-tag-grid" id="filter-technik-grid-m">
                                    ${['Technik vorhanden', 'Technik ist noch unklar', 'Technik nicht vorhanden'].map(t => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterTechnikM" value="${t}" checked>
                                            <span>${t}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                        </div>
                    `}
                </div>

                <!-- Center Main Section -->
                <div>
                    <div id="market-items-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr)); gap: 2rem;">
                        ${renderMarketGridHTML(items, isEvents)}
                    </div>
                </div>
            </div>
            <div id="market-filters-overlay" class="market-filters-overlay"></div>
        </div>
    `;

    // Mobile filter toggle listener
    const toggleBtn = container.querySelector('#btn-toggle-mobile-filters');
    const filterWrapper = container.querySelector('#market-filters-wrapper');
    const overlay = container.querySelector('#market-filters-overlay');

    toggleBtn?.addEventListener('click', function() {
        filterWrapper.classList.toggle('open');
        this.classList.toggle('active');
        const isOpen = filterWrapper.classList.contains('open');
        overlay?.classList.toggle('open', isOpen);
        this.innerHTML = isOpen 
            ? `<i class="fa-solid fa-xmark" style="font-size: 1.1rem; margin: 0;"></i>` 
            : `<i class="fa-solid fa-sliders" style="font-size: 1.05rem; margin: 0;"></i>`;
    });

    const closeBtnM = container.querySelector('#btn-close-filters-m');
    closeBtnM?.addEventListener('click', function() {
        filterWrapper.classList.remove('open');
        overlay?.classList.remove('open');
        toggleBtn?.classList.remove('active');
        if (toggleBtn) {
            toggleBtn.innerHTML = `<i class="fa-solid fa-sliders" style="font-size: 1.05rem; margin: 0;"></i>`;
        }
    });

    overlay?.addEventListener('click', function() {
        filterWrapper.classList.remove('open');
        overlay.classList.remove('open');
        toggleBtn?.classList.remove('active');
        if (toggleBtn) {
            toggleBtn.innerHTML = `<i class="fa-solid fa-sliders" style="font-size: 1.05rem; margin: 0;"></i>`;
        }
    });

    const sortSelects = container.querySelectorAll('#sort-select, #sort-select-m');
    const sortSelect = sortSelects[0] || null;
    const resetBtn = container.querySelector('#btn-reset-filters');
    const marketProfileSelect = container.querySelector('#market-profile-select');
    if (marketProfileSelect) {
        marketProfileSelect.addEventListener('change', function() {
            const val = this.value;
            console.log("[DEBUG] market-profile-select changed to:", val);
            if (state.currentUser) {
                if (state.currentUser.role === 'musician') {
                    state.activeMusicianId = val;
                } else {
                    state.activeEventId = val;
                }
                state.notify();
            }
        });
    }

    function getCheckedValues(id) {
        const grid = container.querySelector('#' + id);
        if (!grid) return [];
        return Array.from(grid.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    }

    function initDualSlider(containerId, minInputId, maxInputId, trackId, displayId, unit, isPrice) {
        const sliderContainer = container.querySelector('#' + containerId);
        if (!sliderContainer) return;
        const minInput = container.querySelector('#' + minInputId);
        const maxInput = container.querySelector('#' + maxInputId);
        const track = container.querySelector('#' + trackId);
        const display = container.querySelector('#' + displayId);

        function updateSlider() {
            let minVal = parseFloat(minInput.value);
            let maxVal = parseFloat(maxInput.value);

            if (minVal > maxVal) {
                const temp = minVal;
                minVal = maxVal;
                maxVal = temp;
            }

            const percentMin = ((minVal - minInput.min) / (minInput.max - minInput.min)) * 100;
            const percentMax = ((maxVal - maxInput.min) / (maxInput.max - maxInput.min)) * 100;

            if (track) {
                track.style.left = percentMin + '%';
                track.style.width = (percentMax - percentMin) + '%';
            }

            if (display) {
                if (isPrice) {
                    if (maxVal >= 5000) {
                        display.textContent = `${minVal.toLocaleString('de-DE')} - 5.000+`;
                    } else {
                        display.textContent = `${minVal.toLocaleString('de-DE')} - ${maxVal.toLocaleString('de-DE')}`;
                    }
                } else if (unit === 'Std.') {
                    display.textContent = `${minVal.toFixed(1).replace('.', ',')} - ${maxVal.toFixed(1).replace('.', ',')}`;
                } else if (unit === 'Personen') {
                    if (maxVal >= 500) {
                        display.textContent = `${minVal} - 500+`;
                    } else {
                        display.textContent = `${minVal} - ${maxVal}`;
                    }
                } else {
                    display.textContent = `${minVal} - ${maxVal} ${unit}`;
                }
            }
        }

        minInput.addEventListener('input', updateSlider);
        maxInput.addEventListener('input', updateSlider);
        minInput.addEventListener('input', applyAllFiltersAndSort);
        maxInput.addEventListener('input', updateSlider); // Trigger update on release
        maxInput.addEventListener('input', applyAllFiltersAndSort);
        updateSlider();
    }

    function applyAllFiltersAndSort() {
        let list = [...items];
        console.log("applyAllFiltersAndSort started. Input items:", list.length, "isEvents:", isEvents);

        // Pre-calculate matchScore for every item in list based on logged in user profile
        if (state.currentUser) {
            if (state.currentUser.role === 'musician') {
                const myProfile = state.musicians.find(m => m.id === state.activeMusicianId) 
                    || state.musicians.find(m => m.creatorId === state.currentUser.id || m.id === state.currentUser.profileId);
                if (myProfile) {
                    list.forEach(item => {
                        if (isEvents) {
                            item.matchScore = calculateMatch(myProfile, item, 'musician').score;
                        } else {
                            item.matchScore = 100;
                        }
                    });
                }
            } else if (state.currentUser.role === 'organizer') {
                const myProfile = state.events.find(e => e.id === state.activeEventId) 
                    || state.events.find(e => e.creatorId === state.currentUser.id || e.id === state.currentUser.profileId) 
                    || state.events.find(e => e.creatorId === state.currentUser.id) 
                    || state.events[0];
                if (myProfile) {
                    list.forEach(item => {
                        if (!isEvents) {
                            item.matchScore = calculateMatch(item, myProfile, 'organizer').score;
                        } else {
                            item.matchScore = 100;
                        }
                    });
                }
            }
        } else {
            list.forEach(item => {
                let hash = 0;
                const idStr = String(item.id);
                for (let i = 0; i < idStr.length; i++) {
                    hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
                }
                item.matchScore = 45 + Math.abs(hash % 51); // 45% to 95%
            });
        }

        // Apply Top-Matches and Favorites toggles
        if (showOnlyTopMatches) {
            list = list.filter(item => item.matchScore >= 70);
        }
        if (showOnlyFavorites) {
            list = list.filter(item => state.isFavorite(item.id));
        }

        // 1. Ort Filter
        const locInput = isEvents 
            ? (container.querySelector('#filter-location')?.value || '').trim().toLowerCase()
            : (container.querySelector('#filter-location-m')?.value || '').trim().toLowerCase();
        if (locInput) {
            const cleanQuery = locInput.split(' (')[0].toLowerCase().trim();
            list = list.filter(item => {
                const itemLoc = (item.location || '').split(' (')[0].toLowerCase().trim();
                return itemLoc.includes(cleanQuery);
            });
        }

        // 1.5. Datum Filter (Date Filter) - Multi-Date selection
        if (selectedFilterDates && selectedFilterDates.length > 0) {
            list = list.filter(item => {
                if (isEvents) {
                    return selectedFilterDates.includes(item.date);
                } else {
                    if (!item.availability) return true;
                    return selectedFilterDates.some(dateVal => {
                        if (Array.isArray(item.availability)) {
                            if (item.availability.includes(dateVal)) return true;
                            const weekday = getWeekdayFromDate(dateVal);
                            return item.availability.includes(weekday);
                        } else if (typeof item.availability === 'object') {
                            const eventWeekday = getWeekdayFromDate(dateVal).toLowerCase();
                            if (item.availability[eventWeekday] !== undefined) {
                                return !!item.availability[eventWeekday].available;
                            } else {
                                const isModified = item.availability.modifiedDates && item.availability.modifiedDates.includes(dateVal);
                                if (item.availability.defaultState === 'all-selected') {
                                    return !isModified;
                                } else {
                                    return isModified;
                                }
                            }
                        }
                        return true;
                    });
                }
            });
        }

        // 2. Suchbegriffe Filter
        const kw = isEvents
            ? (container.querySelector('#filter-keyword')?.value || '').trim().toLowerCase()
            : (container.querySelector('#filter-keyword-m')?.value || '').trim().toLowerCase();
        if (kw) {
            list = list.filter(item => {
                const fullText = [item.name, item.title, item.bio, item.description, item.location, item.category, item.eventType, item.type, ...(item.genres||[]), ...(item.instruments||[])].join(' ').toLowerCase();
                return fullText.includes(kw);
            });
        }

        // 3. Genres Filter
        const genresGridId = isEvents ? 'filter-genres-grid' : 'filter-genres-grid-m';
        const genresGrid = container.querySelector('#' + genresGridId);
        const genresInteracted = genresGrid && genresGrid.dataset.interacted === 'true';
        const selGenres = getCheckedValues(genresGridId);
        if (genresInteracted || selGenres.length > 0) {
            list = list.filter(item => {
                const itemG = item.genres || [];
                return selGenres.some(g => itemG.some(ig => ig.toLowerCase().includes(g.toLowerCase())));
            });
        }

        // 4. Instrumente Filter
        const instGridId = isEvents ? 'filter-instruments-grid' : 'filter-instruments-grid-m';
        const instGrid = container.querySelector('#' + instGridId);
        const instInteracted = instGrid && instGrid.dataset.interacted === 'true';
        const selInst = getCheckedValues(instGridId);
        if (instInteracted || selInst.length > 0) {
            list = list.filter(item => {
                const itemI = item.instruments || [];
                return selInst.some(inst => itemI.some(i => i.toLowerCase().includes(inst.toLowerCase())));
            });
        }

        // 5. Musiker-Typ / Event-Typ
        const typeGridId = isEvents ? 'filter-event-type-grid' : 'filter-musician-type-grid';
        const typeGrid = container.querySelector('#' + typeGridId);
        const typeInteracted = typeGrid && typeGrid.dataset.interacted === 'true';
        const selType = getCheckedValues(typeGridId);
        if (typeInteracted || selType.length > 0) {
            list = list.filter(item => {
                const val = (item.type || item.eventType || '');
                return selType.some(t => val.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(val.toLowerCase()));
            });
        }

        // 6. Technik Filter
        const techGridId = isEvents ? 'filter-technik-grid' : 'filter-technik-grid-m';
        const techGrid = container.querySelector('#' + techGridId);
        const techInteracted = techGrid && techGrid.dataset.interacted === 'true';
        const selTechnik = getCheckedValues(techGridId);
        if (techInteracted || selTechnik.length > 0) {
            list = list.filter(item => {
                const rawVal = item.technik || item.equipment || '';
                const itemTechArr = Array.isArray(rawVal) 
                    ? rawVal 
                    : (typeof rawVal === 'string' && rawVal.trim() !== '' ? [rawVal] : []);
                
                return selTechnik.some(t => 
                    itemTechArr.some(it => it.trim().toLowerCase() === t.trim().toLowerCase())
                );
            });
        }

        // 7. Spieldauer Filter (Dual Slider)
        const minD = parseFloat(container.querySelector(isEvents ? '#input-filter-duration-min' : '#input-filter-duration-m-min')?.value || 0.5);
        const maxD = parseFloat(container.querySelector(isEvents ? '#input-filter-duration-max' : '#input-filter-duration-m-max')?.value || 10);
        list = list.filter(item => {
            if (isEvents) {
                const itemMinD = parseFloat(item.minDuration !== undefined ? item.minDuration : item.duration) || 0.5;
                const itemMaxD = parseFloat(item.maxDuration !== undefined ? item.maxDuration : item.duration) || 24;
                return itemMaxD >= minD && itemMinD <= maxD;
            } else {
                const itemMinD = parseFloat(item.minDuration) || 0.5;
                const itemMaxD = parseFloat(item.maxDuration) || 24;
                return itemMaxD >= minD && itemMinD <= maxD;
            }
        });

        // 8. Budget / Gage Filter (Dual Slider)
        const minB = parseFloat(container.querySelector(isEvents ? '#input-filter-budget-min' : '#input-filter-gage-m-min')?.value || 0);
        const maxB = parseFloat(container.querySelector(isEvents ? '#input-filter-budget-max' : '#input-filter-gage-m-max')?.value || 5000);
        list = list.filter(item => {
            const itemMinB = parseFloat(item.minBudget !== undefined ? item.minBudget : (isEvents ? item.budget : item.price)) || 0;
            const itemMaxB = parseFloat(item.maxBudget !== undefined ? item.maxBudget : (isEvents ? item.budget : item.price)) || 5000;
            return itemMaxB >= minB && itemMinB <= maxB;
        });

        // 9. Besucheranzahl / Publikum Filter (Dual Slider)
        const minP = parseInt(container.querySelector(isEvents ? '#input-filter-publikum-min' : '#input-filter-publikum-m-min')?.value || 0);
        const maxP = parseInt(container.querySelector(isEvents ? '#input-filter-publikum-max' : '#input-filter-publikum-m-max')?.value || 500);
        list = list.filter(item => {
            const itemMinP = parseInt(item.minPublikum) || 0;
            const itemMaxP = parseInt(item.maxPublikum) || 500;
            return itemMaxP >= minP && itemMinP <= maxP;
        });

        // 10. Umkreis Filter (for Musiker-Markt only)
        if (!isEvents) {
            const radiusVal = parseInt(container.querySelector('#input-filter-radius-m')?.value || 500);
            if (radiusVal < 500) {
                list = list.filter(item => (item.radius || 0) <= radiusVal);
            }
        }

        // 11. Bevorzugte Event-Typen Filter (for Musiker-Markt only)
        if (!isEvents) {
            const selEvtTypes = getCheckedValues('filter-event-types-grid-m');
            if (selEvtTypes.length > 0) {
                list = list.filter(item => {
                    const types = item.eventTypes || [];
                    return selEvtTypes.some(t => types.some(it => it.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(it.toLowerCase())));
                });
            }
        }

        // Sortierung
        const sortVal = sortSelect?.value || 'match';
        if (sortVal === 'match') {
            list.sort((a, b) => (b.matchScore !== undefined ? b.matchScore : 95) - (a.matchScore !== undefined ? a.matchScore : 95));
        } else if (sortVal === 'newest') {
            list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        } else if (sortVal === 'price') {
            const parsePrice = (str) => {
                if (typeof str === 'number') return str;
                const match = (str || '').match(/\d+/g);
                return match ? parseInt(match.join('')) : 999999;
            };
            list.sort((a, b) => parsePrice(a.price || a.budget || a.minBudget) - parsePrice(b.price || b.budget || b.minBudget));
        } else if (sortVal === 'distance') {
            list.sort((a, b) => (parseInt(a.distance || 50) - parseInt(b.distance || 50)));
        } else if (sortVal === 'name') {
            list.sort((a, b) => (isEvents ? a.title : a.name).localeCompare(isEvents ? b.title : b.name));
        }

        const grid = container.querySelector('#market-items-grid');
        if (grid) grid.innerHTML = renderMarketGridHTML(list, isEvents);
        
        const countEl = container.querySelector('#market-results-count');
        if (countEl) countEl.textContent = list.length;
        
        const labelEl = container.querySelector('#market-title-label');
        if (labelEl) {
            if (showOnlyTopMatches) {
                labelEl.textContent = 'Top-Matches';
            } else if (showOnlyFavorites) {
                labelEl.textContent = 'Favoriten';
            } else {
                labelEl.textContent = isEvents ? 'Event-Markt' : 'Musiker-Markt';
            }
        }
        
        console.log("applyAllFiltersAndSort finished. Output items count:", list.length, "IDs:", list.map(item => item.id).join(', '));
    }

    sortSelects.forEach(sel => {
        sel.addEventListener('change', function() {
            const val = this.value;
            sortSelects.forEach(other => {
                if (other !== this) other.value = val;
            });
            applyAllFiltersAndSort();
        });
    });
    
    // Bind change/input event to text inputs
    container.querySelectorAll('.form-input:not([type="checkbox"]):not([type="range"])').forEach(el => {
        el.addEventListener('input', applyAllFiltersAndSort);
    });

    // Filter Calendar Widget Rendering and Logic
    function renderFilterCalendar() {
        const calendarDaysGrid = container.querySelector('#filter-calendar-days-grid');
        const calendarMonthYear = container.querySelector('#filter-calendar-month-year');
        if (!calendarDaysGrid || !calendarMonthYear) return;

        const year = currentFilterCalDate.getFullYear();
        const month = currentFilterCalDate.getMonth();

        const monthNames = [
            "Januar", "Februar", "März", "April", "Mai", "Juni",
            "Juli", "August", "September", "Oktober", "November", "Dezember"
        ];
        calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

        const firstDayIndex = new Date(year, month, 1).getDay(); // 0 Sunday, 1 Monday...
        const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
        const totalDays = new Date(year, month + 1, 0).getDate();

        let daysHtml = '';

        for (let i = 0; i < adjustedFirstDayIndex; i++) {
            daysHtml += `<div class="filter-cal-day empty"></div>`;
        }

        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = selectedFilterDates.includes(dateStr);
            daysHtml += `
                <div class="filter-cal-day ${isSelected ? 'selected' : ''}" data-date="${dateStr}">
                    ${day}
                </div>
            `;
        }

        calendarDaysGrid.innerHTML = daysHtml;

        calendarDaysGrid.querySelectorAll('.filter-cal-day:not(.empty)').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const dateVal = e.currentTarget.getAttribute('data-date');
                const idx = selectedFilterDates.indexOf(dateVal);
                if (idx > -1) {
                    selectedFilterDates.splice(idx, 1);
                } else {
                    selectedFilterDates.push(dateVal);
                }
                renderFilterCalendar();
                applyAllFiltersAndSort();
            });
        });

        const previewContainer = container.querySelector('#filter-selected-dates-preview');
        if (previewContainer) {
            previewContainer.innerHTML = selectedFilterDates.map(d => {
                const [y, m, dayVal] = d.split('-');
                const formattedDate = `${dayVal}.${m}.`;
                return `
                    <span style="background: ${isEvents ? 'rgba(37, 99, 235, 0.1)' : 'rgba(124, 58, 237, 0.1)'}; color: ${isEvents ? '#2563eb' : '#7c3aed'}; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; user-select: none;">
                        ${formattedDate}
                        <i class="fa-solid fa-xmark remove-date-chip" data-date="${d}" style="cursor: pointer; font-size: 0.7rem;"></i>
                    </span>
                `;
            }).join('');

            previewContainer.querySelectorAll('.remove-date-chip').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const dateVal = e.currentTarget.getAttribute('data-date');
                    const idx = selectedFilterDates.indexOf(dateVal);
                    if (idx > -1) {
                        selectedFilterDates.splice(idx, 1);
                    }
                    renderFilterCalendar();
                    applyAllFiltersAndSort();
                });
            });
        }
    }

    container.querySelector('#btn-filter-cal-prev')?.addEventListener('click', () => {
        currentFilterCalDate.setMonth(currentFilterCalDate.getMonth() - 1);
        renderFilterCalendar();
    });

    container.querySelector('#btn-filter-cal-next')?.addEventListener('click', () => {
        currentFilterCalDate.setMonth(currentFilterCalDate.getMonth() + 1);
        renderFilterCalendar();
    });

    renderFilterCalendar();

    // Tag pill checkbox click handler for filters
    container.querySelectorAll('.tag-pill-checkbox input').forEach(input => {
        if (input.checked) {
            input.parentElement.classList.add('active');
        }
        input.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                e.target.parentElement.classList.toggle('active', e.target.checked);
                const grid = e.target.closest('.checkbox-tag-grid');
                if (grid) {
                    grid.dataset.interacted = "true";
                }
            }
            applyAllFiltersAndSort();
        });
    });

    // Initialize range sliders
    if (isEvents) {
        initDualSlider('slider-filter-duration-container', 'input-filter-duration-min', 'input-filter-duration-max', 'track-filter-duration', 'val-filter-duration', 'Std.', false);
        initDualSlider('slider-filter-budget-container', 'input-filter-budget-min', 'input-filter-budget-max', 'track-filter-budget', 'val-filter-budget', '€', true);
        initDualSlider('slider-filter-publikum-container', 'input-filter-publikum-min', 'input-filter-publikum-max', 'track-filter-publikum', 'val-filter-publikum', 'Personen', false);
    } else {
        const radiusInput = container.querySelector('#input-filter-radius-m');
        const radiusDisplay = container.querySelector('#val-filter-radius-m');
        if (radiusInput && radiusDisplay) {
            radiusInput.addEventListener('input', () => {
                radiusDisplay.textContent = radiusInput.value + ' km';
                applyAllFiltersAndSort();
            });
        }
        initDualSlider('slider-filter-duration-m-container', 'input-filter-duration-m-min', 'input-filter-duration-m-max', 'track-filter-duration-m', 'val-filter-duration-m', 'Std.', false);
        initDualSlider('slider-filter-gage-m-container', 'input-filter-gage-m-min', 'input-filter-gage-m-max', 'track-filter-gage-m', 'val-filter-gage-m', '€', true);
        initDualSlider('slider-filter-publikum-m-container', 'input-filter-publikum-m-min', 'input-filter-publikum-m-max', 'track-filter-publikum-m', 'val-filter-publikum-m', 'Personen', false);
    }

    resetBtn?.addEventListener('click', () => {
        container.querySelectorAll('input[type="text"]').forEach(el => el.value = '');
        
        selectedFilterDates = [];
        renderFilterCalendar();
        
        container.querySelectorAll('.tag-pill-checkbox input').forEach(el => {
            el.checked = false;
            el.parentElement.classList.remove('active');
        });
        container.querySelectorAll('.checkbox-tag-grid').forEach(grid => {
            grid.removeAttribute('data-interacted');
        });
        
        const durationMin = container.querySelector('#input-filter-duration-min') || container.querySelector('#input-filter-duration-m-min');
        if (durationMin) durationMin.value = durationMin.min;
        const durationMax = container.querySelector('#input-filter-duration-max') || container.querySelector('#input-filter-duration-m-max');
        if (durationMax) durationMax.value = durationMax.max;
        
        const budgetMin = container.querySelector('#input-filter-budget-min') || container.querySelector('#input-filter-gage-m-min');
        if (budgetMin) budgetMin.value = budgetMin.min;
        const budgetMax = container.querySelector('#input-filter-budget-max') || container.querySelector('#input-filter-gage-m-max');
        if (budgetMax) budgetMax.value = budgetMax.max;

        const publikumMin = container.querySelector('#input-filter-publikum-min') || container.querySelector('#input-filter-publikum-m-min');
        if (publikumMin) publikumMin.value = publikumMin.min;
        const publikumMax = container.querySelector('#input-filter-publikum-max') || container.querySelector('#input-filter-publikum-m-max');
        if (publikumMax) publikumMax.value = publikumMax.max;

        const radiusSlider = container.querySelector('#input-filter-radius-m');
        if (radiusSlider) radiusSlider.value = radiusSlider.max;

        container.querySelectorAll('.dual-range-slider input[type="range"], #input-filter-radius-m').forEach(el => {
            el.dispatchEvent(new Event('input'));
        });

        sortSelects.forEach(sel => sel.value = 'match');
        applyAllFiltersAndSort();
    });

    const btnToggleTopMatches = container.querySelector('#btn-toggle-market-top-matches');
    btnToggleTopMatches?.addEventListener('click', () => {
        if (!state.currentUser) {
            showModal('auth');
            return;
        }
        showOnlyTopMatches = !showOnlyTopMatches;
        if (showOnlyTopMatches) {
            btnToggleTopMatches.classList.add('active');
            btnToggleTopMatches.style.color = '#eab308';
            btnToggleTopMatches.style.borderColor = '#eab308';
            btnToggleTopMatches.style.background = 'rgba(234, 179, 8, 0.1)';
            
            if (showOnlyFavorites) {
                showOnlyFavorites = false;
                if (btnToggleFavorites) {
                    btnToggleFavorites.classList.remove('active');
                    btnToggleFavorites.style.color = '';
                    btnToggleFavorites.style.borderColor = '';
                    btnToggleFavorites.style.background = '';
                }
            }
        } else {
            btnToggleTopMatches.classList.remove('active');
            btnToggleTopMatches.style.color = '';
            btnToggleTopMatches.style.borderColor = '';
            btnToggleTopMatches.style.background = '';
        }
        applyAllFiltersAndSort();
    });

    const btnToggleFavorites = container.querySelector('#btn-toggle-market-favorites');
    btnToggleFavorites?.addEventListener('click', () => {
        if (!state.currentUser) {
            showModal('auth');
            return;
        }
        showOnlyFavorites = !showOnlyFavorites;
        if (showOnlyFavorites) {
            btnToggleFavorites.classList.add('active');
            btnToggleFavorites.style.color = '#ef4444';
            btnToggleFavorites.style.borderColor = '#ef4444';
            btnToggleFavorites.style.background = 'rgba(239, 68, 68, 0.1)';
            
            if (showOnlyTopMatches) {
                showOnlyTopMatches = false;
                if (btnToggleTopMatches) {
                    btnToggleTopMatches.classList.remove('active');
                    btnToggleTopMatches.style.color = '';
                    btnToggleTopMatches.style.borderColor = '';
                    btnToggleTopMatches.style.background = '';
                }
            }
        } else {
            btnToggleFavorites.classList.remove('active');
            btnToggleFavorites.style.color = '';
            btnToggleFavorites.style.borderColor = '';
            btnToggleFavorites.style.background = '';
        }
        applyAllFiltersAndSort();
    });

    window.marketApplyFilters = applyAllFiltersAndSort;

    // Run sorting and filtering initially on page load
    applyAllFiltersAndSort();
}

// Unified Tile Card Renderer - NO EXTRA PAGE & NO POPUP BUTTON!


// Unified Tile Card Renderer - NO EXTRA PAGE / NO MODAL NEEDED!




function formatEventDateWithTime(item) {
    const dateArr = item.dates && item.dates.length > 0 ? item.dates : (item.date ? [item.date] : []);
    if (dateArr.length > 0) {
        let dateDisplay = dateArr.map(d => {
            const parts = d.split('-');
            return parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : d;
        }).join(', ');
        if (item.eventStartTime) {
            if (item.eventEndTime) {
                dateDisplay += `, ${item.eventStartTime} - ${item.eventEndTime} Uhr`;
            } else {
                dateDisplay += `, ${item.eventStartTime} Uhr`;
            }
        }
        return dateDisplay;
    }
    return 'Termin nach Absprache';
}

function formatMusicianAvailabilityHelper(item) {
    const avail = item.availability;
    if (!avail) return 'Auf Anfrage verfügbar';
    if (typeof avail === 'string') return avail;

    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

    let activeIndices = [];

    if (Array.isArray(avail)) {
        const lowerAvail = avail.map(d => d.toLowerCase());
        activeIndices = dayKeys.map((key, index) => lowerAvail.includes(key) ? index : -1).filter(idx => idx !== -1);
    } else if (typeof avail === 'object') {
        let hasWeekdays = dayKeys.some(key => avail[key] !== undefined || avail[key.charAt(0).toUpperCase() + key.slice(1)] !== undefined);
        if (hasWeekdays) {
            activeIndices = dayKeys.map((key, index) => {
                const dayObj = avail[key] || avail[key.charAt(0).toUpperCase() + key.slice(1)];
                return (dayObj && dayObj.available) ? index : -1;
            }).filter(idx => idx !== -1);
        } else {
            const { defaultState, modifiedDates } = avail;
            if (defaultState === 'all-selected') {
                if (!modifiedDates || modifiedDates.length === 0) {
                    return "Flexibel (Jederzeit)";
                }
                return "Flexibel (außer einzelne Tage)";
            } else {
                if (!modifiedDates || modifiedDates.length === 0) {
                    return "Keine Termine";
                }
                const sortedDates = [...modifiedDates].sort((a, b) => new Date(a) - new Date(b));
                const formatted = sortedDates.slice(0, 2).map(d => {
                    const parts = d.split('-');
                    return `${parts[2]}.${parts[1]}.`;
                });
                return `${formatted.join(', ')}${sortedDates.length > 2 ? '...' : ''} (${sortedDates.length} Tage)`;
            }
        }
    }

    if (activeIndices.length === 0) {
        return 'Auf Anfrage verfügbar';
    }
    if (activeIndices.length === 7) {
        return 'Jeden Tag (Mo-So)';
    }

    let groups = [];
    let currentGroup = [activeIndices[0]];

    for (let i = 1; i < activeIndices.length; i++) {
        if (activeIndices[i] === activeIndices[i - 1] + 1) {
            currentGroup.push(activeIndices[i]);
        } else {
            groups.push(currentGroup);
            currentGroup = [activeIndices[i]];
        }
    }
    groups.push(currentGroup);

    const formattedGroups = groups.map(group => {
        if (group.length >= 3) {
            return `${dayLabels[group[0]]}-${dayLabels[group[group.length - 1]]}`;
        } else {
            return group.map(idx => dayLabels[idx]).join(', ');
        }
    });

    return formattedGroups.join(', ');
}

window.openItemDetailModal = function(id, isEvents) {
    return; // Detail modal completely disabled on all devices
    const item = (isEvents ? state.events : state.musicians).find(x => x.id === id) || (isEvents ? state.events[0] : state.musicians[0]);
    if (!item) return;

    const isUnlocked = state ? ((typeof state.isUnlocked === 'function') ? state.isUnlocked(item.id) : (state.unlockedContacts && state.unlockedContacts.includes(item.id))) : false;
    const roleColor = isEvents ? '#2563eb' : '#7c3aed';
    const photo = item.image || item.photo || (isEvents 
        ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80' 
        : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80');

    const genres = item.genres || (item.genre ? [item.genre] : ['Pop', 'Cover', 'Acoustic']);
    const instruments = item.instruments || (item.category ? [item.category] : ['Gesang', 'Gitarre']);
    const description = item.description || item.bio || (isEvents 
        ? 'Wir suchen eine professionelle musikalische Begleitung für unser anstehendes Event mit toller Stimmung. Bitte Ton- und Lichttechnik mitbringen oder absprechen.' 
        : 'Professionelle Live-Musik für unvergleichliche Momente bei Hochzeiten, Geburtstagen & Firmenevents. Großes Repertoire von Klassikern bis zu modernen Charts.');

    // Date formatting (German)
    let dateDisplay = isEvents ? formatEventDateWithTime(item) : formatMusicianAvailabilityHelper(item);

    // Duration formatting (ends with "Stunden.")
    let durationDisplay = '';
    const minDur = item.minDuration;
    const maxDur = item.maxDuration;
    if (minDur !== undefined && minDur !== null) {
        const minStr = String(minDur).replace('.', ',');
        if (maxDur !== undefined && maxDur !== null && maxDur !== minDur) {
            const maxStr = String(maxDur).replace('.', ',');
            durationDisplay = `${minStr} - ${maxStr} Stunden`;
        } else {
            durationDisplay = `${minStr} Stunden`;
        }
    } else {
        let baseDur = String(item.duration || item.spieldauer || '2 - 4');
        baseDur = baseDur.replace(/ca\.\s*/gi, '').replace(/\s*Stunden\.?/gi, '').trim();
        durationDisplay = `${baseDur} Stunden`;
    }

    // Budget formatting (ends with "€")
    let budgetDisplay = '';
    const minB = item.minBudget !== undefined ? item.minBudget : item.price;
    const maxB = item.maxBudget;
    if (minB !== undefined && minB !== null) {
        const minBStr = typeof minB === 'number' ? minB.toLocaleString('de-DE') : String(minB);
        if (maxB !== undefined && maxB !== null && maxB !== minB) {
            const maxBStr = typeof maxB === 'number' ? maxB.toLocaleString('de-DE') : String(maxB);
            budgetDisplay = `${minBStr} - ${maxBStr} €`;
        } else {
            budgetDisplay = `${minBStr} €`;
        }
    } else {
        budgetDisplay = '0 - 5.000 €';
    }

    // Technology formatting
    const techDisplay = (isEvents ? (item.technik || 'Technik vorhanden') : (item.technik || 'Technik vorhanden'));
    const techDisplayStr = Array.isArray(techDisplay) ? techDisplay.join(', ') : String(techDisplay);

    const modalHTML = `
        <div class="modal-overlay active ${isEvents ? 'theme-musician' : 'theme-organizer'}" id="modal-item-detail" style="position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
            <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 20px; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px rgba(0,0,0,0.5); position: relative;">
                
                <!-- Close Button -->
                <button onclick="document.getElementById('modal-item-detail').remove();" style="position: absolute; top: 15px; right: 15px; z-index: 10; background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <!-- Full Hero Banner & Photo Gallery -->
                <div style="position: relative; height: 260px; width: 100%; background: #0f172a;">
                    <img src="${photo}" style="width: 100%; height: 100%; object-fit: cover;">
                    <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.9) 0%, transparent 60%);"></div>
                    <div style="position: absolute; bottom: 20px; left: 25px; right: 25px;">
                        <span style="display: inline-block; padding: 0.3rem 0.8rem; border-radius: 20px; background: ${roleColor}; color: #fff; font-size: 0.8rem; font-weight: 800; margin-bottom: 0.5rem;">
                            ${isEvents ? (item.eventType || 'Event') : (item.type || item.category || 'Musiker')}
                        </span>
                        <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 900; color: #ffffff; margin: 0;">
                            ${item.name || item.title || ''}
                        </h2>
                    </div>
                </div>

                <div style="padding: 2rem;">
                    
                    <!-- Media Showcase: Video & Audio Section (ALWAYS VISIBLE IN PROTECTED MODE) -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.2rem; margin-bottom: 2rem;">
                        
                        <!-- Video Showcase Box -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 1.2rem;">
                            <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-main); margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fa-solid fa-circle-play" style="color: #ef4444;"></i> Video-PrÄsentation
                            </div>
                            <div style="position: relative; height: 140px; border-radius: 10px; overflow: hidden; background: #000; display: flex; align-items: center; justify-content: center; background: url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=80') center/cover;">
                                <button onclick="window.open('${(item.videos && item.videos.length > 0) ? item.videos[0] : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}', '_blank')" title="${(item.videos && item.videos.length > 0) ? item.videos[0] : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}" style="width: 50px; height: 50px; border-radius: 50%; background: rgba(239, 68, 68, 0.9); border: none; color: #fff; font-size: 1.4rem; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                                    <i class="fa-solid fa-play" style="margin-left: 3px;"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Audio Player Box -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 1.2rem;">
                            <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-main); margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fa-solid fa-music" style="color: ${roleColor};"></i> HÖrproben & Audio
                            </div>
                            <div style="background: rgba(0,0,0,0.3); border-radius: 10px; padding: 0.8rem; display: flex; align-items: center; gap: 0.8rem;">
                                <button onclick="const icon=this.querySelector('i'); if(icon.classList.contains('fa-play')){icon.classList.remove('fa-play');icon.classList.add('fa-pause');}else{icon.classList.remove('fa-pause');icon.classList.add('fa-play');}" style="width: 40px; height: 40px; border-radius: 50%; background: ${roleColor}; border: none; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;">
                                    <i class="fa-solid fa-play" style="font-size: 1rem; margin-left: 2px;"></i>
                                </button>
                                <div style="flex: 1;">
                                    <div style="font-size: 0.85rem; font-weight: 700; color: #fff;">${item.audioTrack || 'Live Medley Demo'}</div>
                                    <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.15); border-radius: 3px; margin-top: 6px; position: relative;">
                                        <div style="width: 55%; height: 100%; background: ${roleColor}; border-radius: 3px;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Description Section (ALWAYS VISIBLE IN PROTECTED MODE) -->
                    <div style="margin-bottom: 1.8rem;">
                        <h4 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">
                            Beschreibung & Details
                        </h4>
                        <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6;">
                            ${description}
                        </p>
                    </div>

                                        <!-- Key Data Grid: Genres, Instrumente, Spieldauer, Technik, Budget -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 1.2rem; border-radius: 12px;">
                        <div>
                            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Genres</span>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.3rem;">
                                ${genres.map(g => `<span style="background: rgba(255,255,255,0.08); padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.78rem; color: #fff;">${g}</span>`).join('')}
                            </div>
                        </div>

                        <div>
                            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Instrumente / Besetzung</span>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.3rem;">
                                ${instruments.map(inst => `<span style="background: ${isEvents ? 'rgba(124, 58, 237, 0.15)' : 'rgba(37, 99, 235, 0.15)'}; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.78rem; color: ${roleColor}; font-weight: 700;">${inst}</span>`).join('')}
                            </div>
                        </div>

                        <div>
                            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 0.2rem;">${isEvents ? 'Veranstaltungsdatum' : 'VerfÃ¼gbarkeiten'}</span>
                            <strong style="font-size: 0.9rem; color: #fff;"><i class="fa-solid fa-calendar-days" style="color: ${roleColor};"></i> ${dateDisplay}</strong>
                        </div>

                        <div>
                            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 0.2rem;">${isEvents ? 'Bevorzugter Musiker-Typ' : 'Musiker-Typ'}</span>
                            <strong style="font-size: 0.9rem; color: #fff;">
                                <i class="fa-solid fa-guitar" style="color: ${roleColor};"></i> 
                                ${isEvents 
                                    ? ((Array.isArray(item.musicianTypes) && item.musicianTypes.length > 0) 
                                        ? item.musicianTypes.join(', ') 
                                        : (typeof item.musicianTypes === 'string' && item.musicianTypes.trim() !== '' 
                                            ? item.musicianTypes 
                                            : (item.musicianType || 'Solo / Band')))
                                    : (item.type || item.category || 'Solo / Band')}
                            </strong>
                        </div>

                        <div>
                            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 0.2rem;">Spieldauer</span>
                            <strong style="font-size: 0.9rem; color: #fff;"><i class="fa-solid fa-clock" style="color: ${roleColor};"></i> ${durationDisplay}</strong>
                        </div>

                        <div>
                            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 0.2rem;">${isEvents ? 'Anzahl der GÃ¤ste' : 'PublikumsgrÃ¶ÃŸe'}</span>
                            <strong style="font-size: 0.9rem; color: #fff;">
                                <i class="fa-solid fa-users" style="color: ${roleColor};"></i> 
                                ${item.minPublikum !== undefined && item.maxPublikum !== undefined ? `${item.minPublikum} - ${item.maxPublikum}+` : (isEvents ? '50 - 150' : '0 - 500+')}
                            </strong>
                        </div>

                        <div>
                            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 0.2rem;">Gage / Budget</span>
                            <strong style="font-size: 0.9rem; color: #fff;"><i class="fa-solid fa-sack-dollar" style="color: ${roleColor};"></i> ${budgetDisplay}</strong>
                        </div>

                        <div>
                            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 0.2rem;">Technik</span>
                            <strong style="font-size: 0.9rem; color: #fff;"><i class="fa-solid fa-microchip" style="color: ${roleColor};"></i> ${(item.technik && item.technik.length > 0) ? (Array.isArray(item.technik) ? item.technik.join(', ') : item.technik) : 'Technik ist noch unklar'}</strong>
                        </div>
                    </div>

                    <!-- Protected Contact Details Area -->
                    <div style="background: rgba(15, 23, 42, 0.8); border: 2px solid ${roleColor}; border-radius: 16px; padding: 1.5rem; text-align: center;">
                        ${isUnlocked ? `
                            <div style="color: ${roleColor}; font-weight: 800; font-size: 1.1rem; margin-bottom: 0.8rem;">
                                <i class="fa-solid fa-unlock"></i> Kontaktdaten freigeschaltet
                            </div>
                            <div style="font-size: 1rem; color: #fff; display: flex; flex-direction: column; align-items: center; gap: 0.6rem; margin-bottom: 1.2rem;">
                                <div><i class="fa-solid fa-building" style="color: ${roleColor}; margin-right: 0.5rem;"></i> <strong>${isEvents ? ((!item.organizerType || item.organizerType === 'Privater Veranstalter' || item.company === 'Privatperson') ? 'Privatperson' : (item.company || 'Privatperson')) : (item.company || 'Privatperson')}</strong></div>
                                <div><i class="fa-solid fa-user" style="color: ${roleColor}; margin-right: 0.5rem;"></i> <strong>${isEvents ? (item.contactName || 'Demo Kontakt') : `Name: ${item.contactName || 'Demo Kontakt'}`}</strong></div>
                                <div><i class="fa-solid fa-phone" style="color: ${roleColor}; margin-right: 0.5rem;"></i> Tel: 
                                    ${item.hidePhone ? (
                                        (state && state.currentUser && (item.creatorId === state.currentUser.id || item.id === state.currentUser.profileId)) ? `
                                            <strong>${item.phone || '+49 170 1234567'}</strong> <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 0.4rem; font-weight: normal;">(nur für dich sichtbar)</span>
                                        ` : `
                                            <span style="font-size: 0.9rem; color: var(--text-muted); font-style: italic;">[Vom Nutzer ausgeblendet]</span>
                                        `
                                    ) : `
                                        <strong>${item.phone || '+49 170 1234567'}</strong>
                                    `}
                                </div>
                                <div><i class="fa-solid fa-envelope" style="color: ${roleColor}; margin-right: 0.5rem;"></i> Mail: <strong>${item.email || 'kontakt@gigconnact.de'}</strong></div>
                            </div>
                            <button class="btn btn-primary" 
                                    data-rec-id="${isEvents ? item.creatorId : item.id}" 
                                    data-rec-name="${item.name || item.title || ''}" 
                                    data-ev-id="${isEvents ? item.id : ''}"
                                    data-close-modal="true"
                                    onclick="event.stopPropagation(); window.handleChatButtonClick(this)" 
                                    style="background: ${isEvents ? '#2563eb' : '#7c3aed'}; border-color: ${isEvents ? '#2563eb' : '#7c3aed'}; font-weight: 800; padding: 0.8rem 2rem; border-radius: 10px; display: inline-flex; align-items: center; gap: 0.6rem; margin-top: 0.5rem;">
                                <i class="fa-solid fa-comment"></i> Nachricht senden
                            </button>
                        ` : `
                            <div style="font-weight: 800; font-size: 1.1rem; color: #ffffff; margin-bottom: 0.4rem;">
                                <i class="fa-solid fa-lock" style="color: ${roleColor};"></i> Geschützter Kontaktbereich
                            </div>
                            <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.2rem;">
                                Kontaktdaten (Telefonnummer & E-Mail-Adresse) sind im geschützten Modus verborgen. Registriere dich oder melde dich an, um direkt zu kommunizieren.
                            </p>
                            <button class="btn btn-primary" onclick="showModal('auth'); document.getElementById('modal-item-detail').remove();" style="background: ${isEvents ? 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)' : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'} !important; border-color: ${isEvents ? '#1e40af' : '#7c3aed'} !important; font-weight: 800; padding: 0.9rem 2rem; font-size: 1rem; border-radius: 12px; display: inline-flex; align-items: center; gap: 0.6rem; box-shadow: ${isEvents ? '0 4px 14px rgba(37, 99, 235, 0.35)' : '0 4px 14px rgba(124, 58, 237, 0.35)'} !important;">
                                <i class="fa-solid fa-sign-in-alt"></i> Kontaktdaten freischalten
                            </button>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.handleChatButtonClick = function(btn) {
    if (btn.getAttribute('data-close-modal') === 'true') {
        const detailModal = document.getElementById('modal-item-detail');
        if (detailModal) detailModal.remove();
    }
    const recId = btn.getAttribute('data-rec-id');
    const recName = btn.getAttribute('data-rec-name');
    const evId = btn.getAttribute('data-ev-id');
    window.initiateMarketContact(recId, recName, evId);
};

window.initiateMarketContact = async function(targetId, targetName, eventId) {
    if (!state.currentUser) {
        showModal('auth');
        return;
    }
    const result = await state.initiateContact(targetId, targetName, eventId);
    if (result.success) {
        if (eventId && state.currentUser && state.currentUser.role === 'musician') {
            await state.addMusicianApplication(state.currentUser.profileId, eventId);
        }
        window.postboxActiveChatId = result.chatId;
        window.postboxActiveTab = 'all';
        showToast({
            title: "Verbindung initiiert!",
            message: `Chat mit ${targetName} geöffnet.`,
            actionTab: "postbox"
        });
        navigate('postbox');
    }
};

window.revealMarketContact = function(itemId, type, value, clickedBtn) {
    const container = document.getElementById(`contact-reveal-${itemId}`);
    if (!container) return;
    
    const card = container.closest('.market-tile-card');
    const buttons = card ? card.querySelectorAll('.market-contact-btn') : [];
    
    const isCurrentlyVisible = container.style.display === 'block';
    const currentType = container.getAttribute('data-type');
    
    const clearActiveButtons = () => {
        buttons.forEach(btn => btn.classList.remove('active'));
    };
    
    if (isCurrentlyVisible && currentType === type) {
        container.style.display = 'none';
        container.removeAttribute('data-type');
        clearActiveButtons();
    } else {
        clearActiveButtons();
        if (clickedBtn) {
            clickedBtn.classList.add('active');
        }
        
        container.style.background = 'rgba(255,255,255,0.15)';
        container.style.padding = '0.55rem';
        container.style.width = '100%';
        container.style.boxSizing = 'border-box';
        
        let contentHtml = '';
        if (type === 'chat') {
            const parts = value.split('|');
            const recId = parts[0];
            const recName = parts[1] || '';
            const evId = parts[2] || '';
            
            contentHtml = `
                <div style="display: flex; align-items: center; justify-content: center;">
                    <span onclick="event.stopPropagation(); window.handleChatButtonClick(this)" 
                          data-rec-id="${recId}"
                          data-rec-name="${recName}"
                          data-ev-id="${evId}"
                          style="font-weight: 800; color: #ffffff; font-size: 0.9rem; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; transition: opacity 0.2s;"
                          onmouseover="this.style.opacity='0.85';"
                          onmouseout="this.style.opacity='1';"
                          title="Chat im Postfach öffnen">
                        Nachricht schreiben <i class="fa-solid fa-comments" style="font-size: 1rem; color: #ffffff;"></i>
                    </span>
                </div>
            `;
        } else {
            contentHtml = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.6rem; flex-wrap: wrap;">
                    <span style="font-weight: 600; color: #ffffff; font-size: 0.9rem; user-select: all;">${value}</span>
                    ${(value !== 'Vom Nutzer ausgeblendet' && value !== '[Vom Nutzer ausgeblendet]') ? `
                        <button onclick="event.stopPropagation(); navigator.clipboard.writeText('${value}'); this.innerHTML='<i class=\\'fa-solid fa-check\\'></i>'; setTimeout(() => this.innerHTML='<i class=\\'fa-solid fa-copy\\'></i>', 1800);" 
                                style="background: rgba(255,255,255,0.2); border: none; color: #fff; width: 26px; height: 26px; border-radius: 4px; font-size: 0.78rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: background 0.15s; margin: 0;" 
                                onmouseover="this.style.background='rgba(255,255,255,0.35)'" 
                                onmouseout="this.style.background='rgba(255,255,255,0.2)'"
                                title="Kopieren">
                            <i class="fa-solid fa-copy"></i>
                        </button>
                    ` : ''}
                </div>
            `;
        }
        
        container.innerHTML = contentHtml;
        container.style.display = 'block';
        container.setAttribute('data-type', type);
    }
};

window.toggleFavorite = function(id) {
    if (!state.currentUser) {
        showModal('auth');
        return;
    }
    if (state.toggleFavorite(id)) {
        const isFav = state.isFavorite(id);
        showToast({
            title: isFav ? "Favorit hinzugefügt!" : "Favorit entfernt",
            message: isFav ? "Dieses Angebot wurde in deinen Favoriten gespeichert." : "Dieses Angebot wurde aus deinen Favoriten entfernt."
        });
        if (typeof window.marketApplyFilters === 'function') {
            window.marketApplyFilters();
        } else if (typeof window.matchesUpdate === 'function') {
            window.matchesUpdate();
        } else if (typeof window.handleRouting === 'function') {
            window.handleRouting();
        }
    }
};



function renderProfilePage(container) {
    if (!state.currentUser) {
        navigate('');
        showModal('auth');
        return;
    }
    const u = state.currentUser;
    const isMusician = (u.role === 'musician');
    const themeColor = isMusician ? 'var(--color-purple)' : 'var(--color-cyan)';
    const themeClass = isMusician ? 'text-purple' : 'text-cyan';
    const themeBtnBg = isMusician ? '#7c3aed' : '#2563eb';
    const themeBtnBorder = isMusician ? '#7c3aed' : '#2563eb';

    const getPlanDetails = (planKey) => {
        switch (planKey) {
            case 'plus': return { title: 'Plus', priceText: '7,99 € / Monat', details: '6 Monate Vertragslaufzeit, 1. Monat kostenlos' };
            case 'pro': return { title: 'Pro', priceText: '5,99 € / Monat', details: '12 Monate Vertragslaufzeit, 1. Monat kostenlos' };
            case 'premium': return { title: 'Premium', priceText: '4,99 € / Monat', details: '12 Monate Vertragslaufzeit, 3 Monate kostenlos' };
            default: return { title: 'Flex', priceText: '9,99 € / Monat', details: '1 Monat Vertragslaufzeit, 1. Monat kostenlos' };
        }
    };
    
    const activePlan = u.subscriptionPlan || 'flex';
    const planInfo = getPlanDetails(activePlan);
    let selectedPlan = activePlan;

    container.innerHTML = `
        <div class="portal-layout ${isMusician ? 'theme-musician' : 'theme-organizer'}" style="display:flex; flex-direction:column; gap:2rem; max-width: 800px; margin: 0 auto; padding: 1rem 0;">
            <div class="profile-section-card">
                <h3 style="color: ${themeColor}; margin-top: 0; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.6rem;">
                    <i class="fa-solid fa-address-card ${themeClass}"></i> Persönliche Kontaktdaten
                </h3>
                <form id="profile-details-form">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div class="form-group">
                            <label style="color: ${themeColor} !important; font-weight: 800 !important; font-size:0.8rem; display:block; margin-bottom:0.3rem;">Vorname</label>
                            <input type="text" id="prof-firstname" class="input-field" value="${u.firstName || ''}" required style="margin:0;">
                        </div>
                        <div class="form-group">
                            <label style="color: ${themeColor} !important; font-weight: 800 !important; font-size:0.8rem; display:block; margin-bottom:0.3rem;">Nachname</label>
                            <input type="text" id="prof-lastname" class="input-field" value="${u.lastName || ''}" required style="margin:0;">
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div class="form-group">
                            <label style="color: ${themeColor} !important; font-weight: 800 !important; font-size:0.8rem; display:block; margin-bottom:0.3rem;">E-Mail-Adresse</label>
                            <input type="email" id="prof-email" class="input-field" value="${u.email || ''}" required style="margin:0;">
                        </div>
                        <div class="form-group">
                            <label style="color: ${themeColor} !important; font-weight: 800 !important; font-size:0.8rem; display:block; margin-bottom:0.3rem;">Telefonnummer</label>
                            <input type="text" id="prof-phone" class="input-field" value="${u.phone || ''}" required style="margin:0;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.4rem;">
                                <input type="checkbox" id="prof-hidephone" ${u.hidePhone ? 'checked' : ''} style="cursor: pointer; width: auto; margin: 0; scale: 1.3; transform-origin: left center; margin-right: 0.15rem;">
                                <label for="prof-hidephone" style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted); cursor: pointer; margin: 0;">Telefonnummer verbergen</label>
                            </div>
                        </div>
                    </div>
                    
                    ${u.role === 'organizer' ? `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                        <div class="form-group">
                            <label style="color: ${themeColor} !important; font-weight: 800 !important; font-size:0.8rem; display:block; margin-bottom:0.3rem;">Organisation</label>
                            <input type="text" id="prof-company" class="input-field" value="${u.company || ''}" style="margin:0;">
                        </div>
                        <div class="form-group">
                            <label style="color: ${themeColor} !important; font-weight: 800 !important; font-size:0.8rem; display:block; margin-bottom:0.3rem;">Veranstalter-Typ</label>
                            <select id="prof-orgtype" class="input-field" style="margin:0; height:42px;">
                                <option value="Privater Veranstalter" ${u.organizerType === 'Privater Veranstalter' ? 'selected' : ''}>Privater Veranstalter</option>
                                <option value="Event-Agentur" ${u.organizerType === 'Event-Agentur' ? 'selected' : ''}>Event-Agentur</option>
                                <option value="Hochzeitsplaner" ${u.organizerType === 'Hochzeitsplaner' ? 'selected' : ''}>Hochzeitsplaner</option>
                                <option value="Eventlocation" ${u.organizerType === 'Eventlocation' ? 'selected' : ''}>Eventlocation</option>
                                <option value="Firma" ${u.organizerType === 'Firma' ? 'selected' : ''}>Firma</option>
                                <option value="Hotel" ${u.organizerType === 'Hotel' ? 'selected' : ''}>Hotel</option>
                                <option value="Restaurant" ${u.organizerType === 'Restaurant' ? 'selected' : ''}>Restaurant</option>
                                <option value="Bar" ${u.organizerType === 'Bar' ? 'selected' : ''}>Bar</option>
                                <option value="Stadtmarketing" ${u.organizerType === 'Stadtmarketing' ? 'selected' : ''}>Stadtmarketing</option>
                                <option value="Festivalveranstalter" ${u.organizerType === 'Festivalveranstalter' ? 'selected' : ''}>Festivalveranstalter</option>
                                <option value="Verein" ${u.organizerType === 'Verein' ? 'selected' : ''}>Verein</option>
                                <option value="Sonstige" ${u.organizerType === 'Sonstige' ? 'selected' : ''}>Sonstige</option>
                            </select>
                        </div>
                    </div>` : ''}

                    <div style="display: flex; justify-content: center;">
                        <button type="submit" class="btn btn-primary" style="margin:0; padding: 0.85rem 2.5rem; font-size: 1.05rem; font-weight: 800; background: ${themeBtnBg}; border-color: ${themeBtnBorder};">
                            <i class="fa-solid fa-floppy-disk"></i> Änderungen speichern
                        </button>
                    </div>
                </form>
            </div>

            ${u.role === 'musician' ? `
            <div class="profile-section-card">
                <h3 style="color: ${themeColor}; margin-top: 0; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.6rem;">
                    <i class="fa-solid fa-credit-card ${themeClass}"></i> Abonnement verwalten
                </h3>
                
                <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 1.2rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Aktueller Tarif</div>
                        <div style="font-size: 1.4rem; font-weight: 800; color: var(--color-purple); display: flex; align-items: center; gap: 0.5rem; margin-top: 0.2rem;">
                            ${planInfo.title} <span style="font-size:1rem; font-weight:400; color:var(--text-main);">(${planInfo.priceText})</span>
                        </div>
                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.3rem;">
                            ${planInfo.details}
                        </div>
                        <div style="font-size: 0.75rem; font-weight: 700; margin-top: 0.5rem; color: ${u.subscriptionCancelled ? 'var(--color-red)' : '#10b981'};">
                            Status: ${u.subscriptionCancelled ? `Gekündigt (Aktiv bis zum ${u.subscriptionEndDate || 'Ende des Abrechnungszeitraums'})` : 'Aktiv (Automatische Verlängerung)'}
                        </div>
                    </div>
                    
                    ${u.subscriptionCancelled ? `
                        <button class="btn btn-primary" id="btn-reactivate-subscription" style="margin:0; background: #10b981; border-color: #10b981;">
                            <i class="fa-solid fa-arrow-rotate-right"></i> Abo reaktivieren
                        </button>
                    ` : `
                        <button class="btn btn-glass btn-sm" id="btn-cancel-subscription" style="margin:0; color: var(--color-red); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.05);">
                            <i class="fa-solid fa-ban"></i> Abo kündigen
                        </button>
                    `}
                </div>

                <div id="sub-management-options" style="margin-top: 1rem;">
                    <h4 style="font-family: var(--font-heading); font-size: 0.95rem; margin-bottom: 0.8rem; color: var(--text-main);">Tarif wechseln (Upgrade / Downgrade)</h4>
                    
                    <div class="subscription-cards" style="margin-bottom: 1.5rem;">
                        <div class="subscription-card ${activePlan === "flex" ? "active" : ""}" data-plan="flex" data-price="9.99">
                            <div class="selected-badge">Beliebt</div>
                            <h5>Flex</h5>
                            <div class="price">9,99 € <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
                            <div class="subscription-gift-box">
                                <i class="fa-solid fa-gift"></i>
                                <div class="gift-title">1 Monat kostenlos</div>
                            </div>
                            <ul class="plan-features" style="font-size: 0.7rem; margin-top: 0.6rem;">
                                <li><i class="fa-solid fa-circle-check"></i> Kontakt zu ALLEN Veranstaltern</li>
                                <li><i class="fa-solid fa-circle-check"></i> 1 Monat Vertragslaufzeit</li>
                                <li><i class="fa-solid fa-circle-check"></i> <span>Jederzeit kündbar<br>(auch in der Testphase)</span></li>
                            </ul>
                            <div style="display: flex; justify-content: center; margin-top: 0.8rem; width: 100%;">
                                <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">${activePlan === "flex" ? "Aktueller Tarif" : (selectedPlan === "flex" ? "Ausgewählt" : "Auswählen")}</button>
                            </div>
                        </div>
                        <div class="subscription-card ${activePlan === "plus" ? "active" : ""}" data-plan="plus" data-price="7.99">
                            <div class="selected-badge">Spare 20 %</div>
                            <h5>Plus</h5>
                            <div class="price">7,99 € <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
                            <div class="subscription-gift-box">
                                <i class="fa-solid fa-gift"></i>
                                <div class="gift-title">1 Monat kostenlos</div>
                            </div>
                            <ul class="plan-features" style="font-size: 0.7rem; margin-top: 0.6rem;">
                                <li><i class="fa-solid fa-circle-check"></i> Kontakt zu ALLEN Veranstaltern</li>
                                <li><i class="fa-solid fa-circle-check"></i> 6 Monate Vertragslaufzeit</li>
                                <li><i class="fa-solid fa-circle-check"></i> <span>Jederzeit kündbar<br>(auch in der Testphase)</span></li>
                            </ul>
                            <div style="display: flex; justify-content: center; margin-top: 0.8rem; width: 100%;">
                                <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">${activePlan === "plus" ? "Aktueller Tarif" : (selectedPlan === "plus" ? "Ausgewählt" : "Auswählen")}</button>
                            </div>
                        </div>
                        <div class="subscription-card ${activePlan === "pro" ? "active" : ""}" data-plan="pro" data-price="5.99">
                            <div class="selected-badge">Spare 40 %</div>
                            <h5>Pro</h5>
                            <div class="price">5,99 € <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
                            <div class="subscription-gift-box">
                                <i class="fa-solid fa-gift"></i>
                                <div class="gift-title">1 Monat kostenlos</div>
                            </div>
                            <ul class="plan-features" style="font-size: 0.7rem; margin-top: 0.6rem;">
                                <li><i class="fa-solid fa-circle-check"></i> Kontakt zu ALLEN Veranstaltern</li>
                                <li><i class="fa-solid fa-circle-check"></i> 12 Monate Vertragslaufzeit</li>
                                <li><i class="fa-solid fa-circle-check"></i> <span>Jederzeit kündbar<br>(auch in der Testphase)</span></li>
                            </ul>
                            <div style="display: flex; justify-content: center; margin-top: 0.8rem; width: 100%;">
                                <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">${activePlan === "pro" ? "Aktueller Tarif" : (selectedPlan === "pro" ? "Ausgewählt" : "Auswählen")}</button>
                            </div>
                        </div>
                        <div class="subscription-card ${activePlan === "premium" ? "active" : ""}" data-plan="premium" data-price="4.99">
                            <div class="selected-badge" style="background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%) !important;">Spare 59 %</div>
                            <h5>Premium</h5>
                            <div class="price">4,99 € <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
                            <div class="subscription-gift-box">
                                <i class="fa-solid fa-gift"></i>
                                <div class="gift-title">3 Monate kostenlos</div>
                            </div>
                            <ul class="plan-features" style="font-size: 0.7rem; margin-top: 0.6rem;">
                                <li><i class="fa-solid fa-circle-check"></i> Kontakt zu ALLEN Veranstaltern</li>
                                <li><i class="fa-solid fa-circle-check"></i> 12 Monate Vertragslaufzeit</li>
                                <li><i class="fa-solid fa-circle-check"></i> <span>Jederzeit kündbar<br>(auch in der Testphase)</span></li>
                            </ul>
                            <div style="display: flex; justify-content: center; margin-top: 0.8rem; width: 100%;">
                                <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">${activePlan === "premium" ? "Aktueller Tarif" : (selectedPlan === "premium" ? "Ausgewählt" : "Auswählen")}</button>
                            </div>
                        </div>
                    </div><div id="profile-promo-code-box" style="display: none; margin-bottom: 1.5rem; background: rgba(124, 58, 237, 0.05); border: 1px dashed var(--color-purple); padding: 1rem; border-radius: var(--radius-md);">
                        <h5 style="margin: 0 0 0.5rem; font-size: 0.85rem; font-weight: 700; color: var(--color-purple);"><i class="fa-brands fa-instagram"></i> Premium-Freischaltung</h5>
                        <p style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.8rem; line-height: 1.35;">
                            Um in den exklusiven Premium-Tarif zu wechseln, gib bitte deinen Gutscheincode ein (Instagram Story-Aktion):
                        </p>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="prof-promo-code" class="input-field" placeholder="Gutscheincode" style="margin:0; text-transform: uppercase;">
                            <button type="button" class="btn btn-secondary btn-sm" id="btn-prof-apply-promo" style="margin:0; font-size:0.75rem; white-space:nowrap; background:var(--color-purple); border-color:var(--color-purple);">Code prüfen</button>
                        </div>
                        <div id="prof-promo-status-msg" style="font-size: 0.7rem; margin-top: 0.4rem; display: none;"></div>
                        
                        <!-- Stripe-Verbindung (wird eingeblendet bei richtigem Code) -->
                        <div id="prof-stripe-connect-container" style="display: none; margin-top: 1rem; padding: 1rem; background: rgba(37, 99, 235, 0.05); border: 1px solid #2563eb; border-radius: var(--radius-md); text-align: left;">
                            <h6 style="margin: 0 0 0.5rem; font-size: 0.85rem; font-weight: 700; color: #2563eb; display: flex; align-items: center; gap: 0.4rem;"><i class="fa-brands fa-stripe" style="font-size: 1.2rem;"></i> Stripe Verbindung</h6>
                            <p style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.8rem; line-height: 1.35;">
                                Dein Gutscheincode ist gültig! Verbinde jetzt dein Konto mit Stripe, um die Premium-Buchung abzuschließen. Die Stripe-Schnittstelle wird nächste Woche aktiviert.
                            </p>
                            <button type="button" class="btn btn-primary btn-sm" style="background: #2563eb; border-color: #2563eb; display: flex; align-items: center; gap: 0.5rem; width: 100%; justify-content: center; cursor: not-allowed; opacity: 0.75;" disabled>
                                <i class="fa-brands fa-stripe"></i> Mit Stripe verbinden (Ab nächste Woche)
                            </button>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end;">
                        <button class="btn btn-primary btn-sm" id="btn-save-subscription-change" style="margin:0; background: #7c3aed; border-color: #7c3aed;">
                            <i class="fa-solid fa-circle-arrow-right"></i> Tarifwechsel bestätigen
                        </button>
                    </div>
                </div>
            </div>
            ` : ''}

            <!-- DSGVO Datenschutz & Kontoverwaltung Sektion -->
            <div class="profile-section-card" style="margin-top: 1rem;">
                <h3 style="color: ${themeColor}; margin-top: 0; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.6rem;">
                    <i class="fa-solid fa-shield-halved ${themeClass}"></i> Datenschutz & Kontoverwaltung
                </h3>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.2rem;">
                    Hier kannst du deine Betroffenenrechte gemäß DSGVO ausüben. Du kannst deine Cookie-Einstellungen anpassen, dein Benutzerkonto unwiderruflich löschen oder einen manuellen Datenexport anfordern.
                </p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <button class="btn btn-secondary btn-sm" id="btn-cookie-settings-profile" onclick="window.showCookieSettings()" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fa-solid fa-cookie-bite"></i> Cookie-Einstellungen anpassen
                    </button>
                    <button class="btn btn-glass btn-sm" id="btn-delete-useraccount" style="margin: 0; color: var(--color-red); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.05); display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fa-solid fa-trash-can"></i> Konto unwiderruflich löschen
                    </button>
                </div>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 1rem; margin-bottom: 0;">
                    Für eine Auskunft oder einen Export deiner Daten sende bitte eine formlose E-Mail an <a href="mailto:info@gigconnact.de" style="color: var(--color-purple); text-decoration: underline;">info@gigconnact.de</a>.
                </p>
            </div>

        </div>
    `;

    const form = document.getElementById('profile-details-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fName = document.getElementById('prof-firstname').value.trim();
            const lName = document.getElementById('prof-lastname').value.trim();
            const email = document.getElementById('prof-email').value.trim();
            const phone = document.getElementById('prof-phone').value.trim();
            const hidePhone = document.getElementById('prof-hidephone').checked;

            const nameReg = /^[a-zA-ZäöüÄÖÜß\s\-]+$/;
            if (!nameReg.test(fName) || !nameReg.test(lName)) {
                showToast({ title: "Fehler", message: "Der Name darf nur Buchstaben enthalten.", type: "error" });
                return;
            }

            u.firstName = fName;
            u.lastName = lName;
            u.email = email;
            u.phone = phone;
            u.hidePhone = hidePhone;

            if (u.role === 'organizer') {
                u.company = document.getElementById('prof-company').value.trim();
                u.organizerType = document.getElementById('prof-orgtype').value;
                const startEl = document.getElementById("prof-event-starttime"); const endEl = document.getElementById("prof-event-endtime"); if (startEl) u.eventStartTime = startEl.value; if (endEl) u.eventEndTime = endEl.value;
                
                // Update primary event start and end time
                const primaryEvent = state.events.find(e => e.id === u.profileId);
                if (primaryEvent) {
                    primaryEvent.eventStartTime = u.eventStartTime;
                    primaryEvent.eventEndTime = u.eventEndTime;
                }
            }

            // Also update contact details on their created musicians and events!
            state.musicians.forEach(m => {
                if (m.creatorId === u.id || m.id === u.profileId) {
                    m.contactName = `${fName} ${lName}`;
                    m.phone = phone;
                    m.email = email;
                    m.hidePhone = hidePhone;
                }
            });
            state.events.forEach(e => {
                if (e.creatorId === u.id || e.id === u.profileId) {
                    e.contactName = `${fName} ${lName}`;
                    e.phone = phone;
                    e.email = email;
                    e.hidePhone = hidePhone;
                }
            });

            const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
            const idx = registeredUsers.findIndex(usr => usr.id === u.id);
            if (idx !== -1) {
                registeredUsers[idx].firstName = fName;
                registeredUsers[idx].lastName = lName;
                registeredUsers[idx].email = email;
                registeredUsers[idx].phone = phone;
                registeredUsers[idx].hidePhone = hidePhone;
                if (u.role === 'organizer') {
                    registeredUsers[idx].company = u.company;
                    registeredUsers[idx].organizerType = u.organizerType;
                    registeredUsers[idx].eventStartTime = u.eventStartTime;
                    registeredUsers[idx].eventEndTime = u.eventEndTime;
                }
                localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));
            }

            state.currentUser = u;
            state.saveState();
            
            showToast({
                title: "Profil aktualisiert! 💾",
                message: "Deine persönlichen Informationen wurden erfolgreich gespeichert."
            });
            updateNavbar();
        });
    }

    if (u.role === 'musician') {
        const cancelBtn = document.getElementById('btn-cancel-subscription');
        const reactivateBtn = document.getElementById('btn-reactivate-subscription');

        if (cancelBtn) {
            cancelBtn.addEventListener('click', async () => {
                const confirmMsg = "Möchtest du dein Abonnement wirklich zum nächstmöglichen Zeitpunkt kündigen? Du verlierst damit nach Ablauf des Zeitraums den direkten Zugang.\n\nHinweis: Dein Profil bleibt nach Ablauf inaktiv gespeichert, damit du es später einfach reaktivieren kannst. Du kannst dein Konto und alle Daten jederzeit dauerhaft über die Funktion 'Konto unwiderruflich löschen' entfernen.";
                if (confirm(confirmMsg)) {
                    u.subscriptionCancelled = true;
                    
                    const end = new Date();
                    end.setDate(end.getDate() + 30);
                    const endStr = end.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    u.subscriptionEndDate = endStr;
                    
                    const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
                    const idx = registeredUsers.findIndex(usr => usr.id === u.id);
                    if (idx !== -1) {
                        registeredUsers[idx].subscriptionCancelled = true;
                        registeredUsers[idx].subscriptionEndDate = endStr;
                        localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));
                    }
                    
                    if (typeof db !== 'undefined' && u.id) {
                        try {
                            await db.collection('users').doc(u.id).update({
                                subscriptionCancelled: true,
                                subscriptionEndDate: endStr
                            });
                        } catch (err) {
                            console.error("Firestore user sub cancel update error:", err);
                        }
                    }
                    
                    state.saveState();
                    showToast({
                        title: "Abo gekündigt ℹ",
                        message: `Dein Abonnement wurde gekündigt. Du hast bis zum ${endStr} vollen Zugriff.`
                    });
                    renderProfilePage(container);
                    updateNavbar();
                }
            });
        }

        if (reactivateBtn) {
            reactivateBtn.addEventListener('click', async () => {
                u.subscriptionCancelled = false;
                delete u.subscriptionEndDate;
                
                const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
                const idx = registeredUsers.findIndex(usr => usr.id === u.id);
                if (idx !== -1) {
                    registeredUsers[idx].subscriptionCancelled = false;
                    delete registeredUsers[idx].subscriptionEndDate;
                    localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));
                }
                
                if (typeof db !== 'undefined' && u.id) {
                    try {
                        await db.collection('users').doc(u.id).update({
                            subscriptionCancelled: false,
                            subscriptionEndDate: firebase.firestore.FieldValue.delete()
                        });
                    } catch (err) {
                        console.error("Firestore user sub reactivate update error:", err);
                    }
                }
                
                state.saveState();
                showToast({
                    title: "Abo reaktiviert! 🎉",
                    message: "Deine automatische Abonnement-Verlängerung ist wieder aktiv."
                });
                renderProfilePage(container);
                updateNavbar();
            });
        }

        const subCards = container.querySelectorAll('.subscription-card');
        const promoBox = document.getElementById('profile-promo-code-box');
        selectedPlan = activePlan;
        let isPromoApplied = activePlan === 'premium';

        subCards.forEach(card => {
            card.addEventListener('click', () => {
                subCards.forEach(c => c.classList.remove('active'));
                
                card.classList.add("active");
                selectedPlan = card.getAttribute("data-plan");

                // Dynamically update card buttons text in profile edit
                subCards.forEach(c => {
                    const btn = c.querySelector(".btn-sub-select");
                    if (btn) {
                        const plan = c.getAttribute("data-plan");
                        btn.textContent = plan === activePlan
                            ? "Aktueller Tarif"
                            : (c.classList.contains("active") ? "Ausgewählt" : "Auswählen");
                    }
                });

                if (selectedPlan === "premium" && !isPromoApplied) {
                    promoBox.style.display = 'block';
                } else {
                    promoBox.style.display = 'none';
                }
            });
        });

        const promoBtn = document.getElementById('btn-prof-apply-promo');
        const promoInput = document.getElementById('prof-promo-code');
        const promoStatus = document.getElementById('prof-promo-status-msg');

        if (promoBtn && promoInput && promoStatus) {
            promoBtn.addEventListener('click', () => {
                const code = promoInput.value.trim().toUpperCase();
                if (['GIGINSTA59', 'INSTASTORY', 'GIGPREMIUM', 'GIGCONN59'].includes(code) || window.gcaPromoCodes.includes(code)) {
                    isPromoApplied = true;
                    promoStatus.textContent = "✔ Gutscheincode gültig! Premium-Tarif freigeschaltet.";
                    promoStatus.style.color = "#10b981";
                    promoStatus.style.display = "block";
                    promoInput.disabled = true;
                    promoBtn.disabled = true;
                    
                    const stripeBox = document.getElementById('prof-stripe-connect-container');
                    if (stripeBox) stripeBox.style.display = 'block';
                } else {
                    isPromoApplied = false;
                    promoStatus.textContent = "❌ Ungültiger Gutscheincode. Bitte folge uns auf Instagram und teile den Story-Beitrag.";
                    promoStatus.style.color = "#ef4444";
                    promoStatus.style.display = "block";
                }
            });
        }

        const saveSubBtn = document.getElementById('btn-save-subscription-change');
        if (saveSubBtn) {
            saveSubBtn.addEventListener('click', async () => {
                if (selectedPlan === 'premium' && !isPromoApplied) {
                    showToast({ title: "Gutscheincode erforderlich", message: "Bitte gib einen gültigen Instagram-Code ein, um den Premium-Tarif freizuschalten.", type: "error" });
                    return;
                }

                u.subscriptionPlan = selectedPlan;
                u.isPremium = true;
                u.subscriptionCancelled = false;
                delete u.subscriptionEndDate;

                const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
                const idx = registeredUsers.findIndex(usr => usr.id === u.id);
                if (idx !== -1) {
                    registeredUsers[idx].subscriptionPlan = selectedPlan;
                    registeredUsers[idx].isPremium = true;
                    registeredUsers[idx].subscriptionCancelled = false;
                    delete registeredUsers[idx].subscriptionEndDate;
                    localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));
                }

                if (typeof db !== 'undefined' && u.id) {
                    try {
                        await db.collection('users').doc(u.id).update({
                            subscriptionPlan: selectedPlan,
                            isPremium: true,
                            subscriptionCancelled: false,
                            subscriptionEndDate: firebase.firestore.FieldValue.delete()
                        });
                    } catch (err) {
                        console.error("Firestore user sub save update error:", err);
                    }
                }

                state.saveState();
                showToast({
                    title: "Tarif erfolgreich gewechselt! 🚀",
                    message: `Dein Abonnement wurde auf den Tarif "${selectedPlan.toUpperCase()}" umgestellt.`
                });
                renderProfilePage(container);
                updateNavbar();
            });
        }
    }

    // DSGVO Daten-Export wird auf Anfrage per E-Mail abgewickelt

    // DSGVO Konto-Löschung Listener
    const deleteBtn = document.getElementById('btn-delete-useraccount');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            const u = state.currentUser;
            if (!u) return;

            const firstConfirm = confirm("ACHTUNG: Möchtest du dein GigConnAct-Konto wirklich unwiderruflich löschen?\n\nDies löscht alle deine Profildaten, Musiker- und Event-Angebote sowie deine Verknüpfungen. Dieser Schritt kann NICHT rückgängig gemacht werden.");
            if (!firstConfirm) return;

            const secondConfirm = confirm("Bist du dir absolut sicher? Alle deine Daten werden gelöscht und du wirst sofort abgemeldet.");
            if (!secondConfirm) return;

            try {
                showToast({
                    title: "Löschung läuft...",
                    message: "Dein Konto wird gelöscht. Bitte warte einen Moment."
                });

                const myMusicians = state.musicians.filter(m => m.creatorId === u.id || m.id === u.profileId);
                const myEvents = state.events.filter(e => e.creatorId === u.id || e.id === u.profileId);

                // Delete musician profiles in Firestore
                for (const m of myMusicians) {
                    await db.collection('musicians').doc(m.id).delete();
                }

                // Delete event profiles in Firestore
                for (const e of myEvents) {
                    await db.collection('events').doc(e.id).delete();
                }

                // Delete user from users collection
                await db.collection('users').doc(u.id).delete();

                // Delete Authentication account
                const firebaseUser = auth.currentUser;
                if (firebaseUser) {
                    await firebaseUser.delete();
                }

                // Clean local fallback users list
                const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
                const idx = registeredUsers.findIndex(usr => usr.id === u.id);
                if (idx !== -1) {
                    registeredUsers.splice(idx, 1);
                    localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));
                }

                // Clean local state & session storage/localStorage items
                state.currentUser = null;
                state.activeMusicianId = null;
                state.activeEventId = null;
                state.saveState();
                localStorage.removeItem('GigConnAct_read_chats');

                showToast({
                    title: "Konto gelöscht ℹ",
                    message: "Dein Konto wurde erfolgreich gelöscht."
                });
                
                setTimeout(() => {
                    window.location.hash = '#/';
                    window.location.reload();
                }, 1500);

            } catch (err) {
                console.error("Account deletion failed:", err);
                if (err.code === 'auth/requires-recent-login') {
                    showToast({
                        title: "Reauthentifizierung erforderlich",
                        message: "Aus Sicherheitsgründen musst du dich vor dem Löschen deines Kontos abmelden, wieder neu anmelden und es direkt erneut versuchen.",
                        type: "error"
                    });
                } else {
                    showToast({
                        title: "Fehler beim Löschen",
                        message: "Dein Konto konnte nicht gelöscht werden: " + err.message,
                        type: "error"
                    });
                }
            }
        });
    }

    const logoutBtn = document.getElementById('btn-profile-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            state.logout();
            window.location.hash = '#/';
        });
    }
}



function renderMatchesPage(container) {
        if (!state.currentUser) return;
        const u = state.currentUser;
        const isMusician = u.role === 'musician';
        
        let profiles = [];
        if (isMusician) {
            profiles = state.musicians.filter(m => m.creatorId === u.id);
        } else {
            profiles = state.events.filter(e => e.creatorId === u.id);
        }
        
        let selectedId = isMusician ? state.activeMusicianId : state.activeEventId;
        if (!selectedId && profiles.length > 0) {
            selectedId = profiles[0].id;
            if (isMusician) state.activeMusicianId = selectedId;
            else state.activeEventId = selectedId;
        }
        
        const selectOptionsHtml = profiles.map(p => `<option value="${p.id}" ${p.id === selectedId ? 'selected' : ''}>${p.name}</option>`).join('');
        
        const isOrganizer = u.role === 'organizer';
        const creditsValue = isOrganizer ? 'Gratis' : (u.isPremium ? '∞' : u.credits);
        const billingMode = isOrganizer ? 'Kostenlos' : (u.isPremium ? 'Flatrate' : 'Prepaid');
        const unlockedCount = isOrganizer ? 'Unbegrenzt' : (u.unlockedContacts || []).length;

        container.innerHTML = `
            <div class="portal-layout" style="display:flex; flex-direction:column; gap:2rem;">
                <div class="profile-section-card" style="margin-bottom:0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; border-bottom: 1px solid var(--border-glass); padding-bottom:1rem; margin-bottom:1rem;">
                        <h3 style="margin:0;"><i class="fa-solid fa-star text-cyan"></i> Top-Matches</h3>
                        <div style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
                            ${profiles.length > 1 ? `
                                <div style="display:flex; align-items:center; gap:0.5rem;">
                                    <label style="font-size:0.8rem; font-weight:600; color:var(--text-muted); margin:0;">Profil:</label>
                                    <select id="select-profile" class="input-field" style="width:180px; padding:0.4rem 0.8rem; font-size:0.8rem; height:34px; margin:0;">
                                        ${selectOptionsHtml}
                                    </select>
                                </div>
                            ` : `
                                <input type="hidden" id="select-profile" value="${selectedId || ''}">
                            `}
                            <div style="display:flex; align-items:center; gap:0.5rem;">
                                <label style="font-size:0.8rem; font-weight:600; color:var(--text-muted); margin:0;">Sortierung:</label>
                                <select id="select-sort" class="input-field" style="width:160px; padding:0.4rem 0.8rem; font-size:0.8rem; height:34px; margin:0;">
                                    <option value="match" selected>Match-Faktor</option>
                                    <option value="newest">Neueste zuerst</option>
                                    <option value="price-asc">Gage (aufsteigend)</option>
                                    <option value="price-desc">Gage (absteigend)</option>
                                    <option value="name">Name (A-Z)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    ${selectedId ? `
                        <div style="display:flex; align-items:center; gap:2rem; flex-wrap:wrap; margin-top:0.8rem;">
                            <div style="flex:1; display:grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap:1rem;">
                                <div style="background:rgba(56,239,125,0.02); border:1px solid rgba(56,239,125,0.15); padding:0.6rem 0.8rem; border-radius:var(--radius-md);">
                                    <div style="font-size:0.65rem; color:var(--color-green); text-transform:uppercase; font-weight:700; margin-bottom:0.15rem;">Kontaktdaten</div>
                                    <div id="stats-unlocked-contacts" style="font-size:1.3rem; font-weight:700; color:var(--color-green);">Unbegrenzt</div>
                                </div>
                                <div style="background:rgba(124,58,237,0.02); border:1px solid rgba(124,58,237,0.15); padding:0.6rem 0.8rem; border-radius:var(--radius-md);">
                                    <div style="font-size:0.65rem; color:var(--color-purple); text-transform:uppercase; font-weight:700; margin-bottom:0.15rem;">Top Matches (>=70%)</div>
                                    <div id="stats-top-matches-count" style="font-size:1.3rem; font-weight:700; color:var(--color-purple);">0</div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>

                ${!selectedId ? `
                    <div class="profile-section-card" style="text-align:center; padding:3rem 1.5rem;">
                        <i class="fa-solid fa-guitar" style="font-size:3rem; color:var(--border-glass); margin-bottom:1rem;"></i>
                        <h4>Erstelle zuerst ein Profil</h4>
                        <p style="color:var(--text-muted); max-width:400px; margin:0.5rem auto 1.5rem;">Um Matches und passende Partner zu sehen, musst du mindestens eine Ausschreibung oder ein Musiker-Profil aktiv haben.</p>
                        <button class="btn btn-primary" id="btn-create-profile-matches" style="margin:0;">
                            <i class="fa-solid fa-plus"></i> Profil erstellen
                        </button>
                    </div>
                ` : `
                    <div class="profile-section-card">
                        <h4 style="margin:0 0 1rem; font-family:var(--font-heading); font-size:1.1rem; border-bottom:1px solid var(--border-glass); padding-bottom:0.6rem; text-align:left;">
                            <i class="fa-solid fa-star text-cyan"></i> Top Matches (<span id="top-matches-count">0</span>)
                        </h4>
                        <div id="top-matches-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem;">
                        </div>
                    </div>
                `}
        </div>
    `;

    const createProfileBtn = document.getElementById('btn-create-profile-matches');
    if (createProfileBtn) {
        createProfileBtn.addEventListener('click', () => {
            navigate(isMusician ? 'my-musicians' : 'my-events');
        });
    }

    const selectProfile = document.getElementById('select-profile');
    const selectSort = document.getElementById('select-sort');
    const topGrid = document.getElementById('top-matches-grid');

    if (!selectedId) return;

    const updateMatches = () => {
        const activeId = selectProfile ? selectProfile.value : '';
        if (!activeId) return;
        
        if (isMusician) state.activeMusicianId = activeId;
        else state.activeEventId = activeId;

        const myProfile = isMusician 
            ? state.musicians.find(m => m.id === activeId)
            : state.events.find(e => e.id === activeId);

        if (!myProfile) return;

        const candidates = isMusician 
            ? state.events.filter(e => isEventActive(e))
            : state.musicians.filter(m => m.isActive !== false);

        const candidatesWithMatches = candidates.map(item => {
            const match = isMusician ? calculateMatch(myProfile, item, 'musician') : calculateMatch(item, myProfile, 'organizer');
            return { item, match };
        });

        const topMatches = candidatesWithMatches.filter(cand => cand.match.score >= 70);

        const sortVal = selectSort?.value || 'match';
        topMatches.sort((a, b) => {
            if (sortVal === 'match') {
                return b.match.score - a.match.score;
            }
            if (sortVal === 'newest') {
                const dateA = a.item.createdAt ? new Date(a.item.createdAt) : new Date(0);
                const dateB = b.item.createdAt ? new Date(b.item.createdAt) : new Date(0);
                return dateB - dateA;
            }
            if (sortVal === 'price-asc') {
                const valA = a.item.minBudget !== undefined ? a.item.minBudget : (a.item.budget || 0);
                const valB = b.item.minBudget !== undefined ? b.item.minBudget : (b.item.budget || 0);
                return valA - valB;
            }
            if (sortVal === 'price-desc') {
                const valA = a.item.minBudget !== undefined ? a.item.minBudget : (a.item.budget || 0);
                const valB = b.item.minBudget !== undefined ? b.item.minBudget : (b.item.budget || 0);
                return valB - valA;
            }
            if (sortVal === 'name') {
                const nameA = a.item.name || a.item.title || '';
                const nameB = b.item.name || b.item.title || '';
                return nameA.localeCompare(nameB);
            }
            return 0;
        });

        if (document.getElementById('top-matches-count')) {
            document.getElementById('top-matches-count').textContent = topMatches.length;
        }
        if (document.getElementById('stats-top-matches-count')) {
            document.getElementById('stats-top-matches-count').textContent = topMatches.length;
        }

        if (topGrid) {
            if (topMatches.length === 0) {
                topGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-glass); width: 100%;">
                        <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                        <h3 style="margin-bottom: 0.5rem; color: var(--text-main);">Keine Ergebnisse gefunden</h3>
                        <p style="color: var(--text-muted); font-size: 0.88rem; margin: 0 auto; max-width: 400px;">Keine passenden Top-Matches gefunden (Matching-Faktor >= 70 %).</p>
                    </div>
                `;
            } else {
                const isEventMarket = isMusician;
                const items = topMatches.map(cand => {
                    cand.item.matchScore = cand.match.score;
                    return cand.item;
                });
                topGrid.innerHTML = renderMarketGridHTML(items, isEventMarket);
            }
        }
    };

    if (selectProfile) {
        selectProfile.addEventListener('change', function() {
            const val = this.value;
            if (val) {
                if (isMusician) state.activeMusicianId = val;
                else state.activeEventId = val;
                state.notify();
            }
        });
    }
    if (selectSort) {
        selectSort.addEventListener('change', updateMatches);
    }
    window.matchesUpdate = updateMatches;
    updateMatches();

    const marketBtn = document.getElementById('btn-goto-market-from-matches');
    if (marketBtn) {
        marketBtn.addEventListener('click', () => {
            navigate(isMusician ? 'events' : 'musicians');
        });
    }
}


function isEventActive(e) {
    if (e.musicianFound || e.isCanceled) return false;
    if (e.isActive === false) return false;
    if (!e.date) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const eventDate = new Date(e.date);
    eventDate.setHours(0,0,0,0);
    const limitDate = new Date(eventDate);
    limitDate.setDate(limitDate.getDate() + 1);
    return today <= limitDate;
}

function isNewListing(item) {
    if (!item || !item.createdAt) return false;
    const diffMs = Date.now() - new Date(item.createdAt).getTime();
    return diffMs < 48 * 60 * 60 * 1000;
}

function renderOrganizerEventItem(e, isActive) {
    const photos = (e.photos && e.photos.length > 0)
        ? e.photos.slice(0, 5)
        : [
            e.profilePic || (e.type && (e.type.toLowerCase().includes('hochzeit') || e.type.toLowerCase().includes('wedding')) ? 'https://picsum.photos/id/111/300/300' : 'https://picsum.photos/id/1025/300/300')
          ];

    const videoSources = e.videos && e.videos.length > 0 ? e.videos : [];

    const genresArr = e.genres && e.genres.length > 0 ? e.genres : (e.genre ? [e.genre] : ['Pop', 'Rock']);
    const instrumentsList = (e.instruments || (e.category ? [e.category] : ['Gesang', 'Gitarre'])).join(', ');

    let formattedDate = new Date(e.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    if (e.eventStartTime) {
        if (e.eventEndTime) {
            formattedDate += `, ${e.eventStartTime} - ${e.eventEndTime} Uhr`;
        } else {
            formattedDate += `, ${e.eventStartTime} Uhr`;
        }
    }

    let budgetDisplay = e.budget ? `${e.budget} €` : 'Auf Anfrage';
    let durationDisplay = e.spieldauer ? `${e.spieldauer} Stunden` : '2 - 4 Stunden';
    
    const techArr = Array.isArray(e.technik) 
        ? e.technik 
        : (typeof e.technik === 'string' && e.technik.trim() !== '' ? e.technik.split(',').map(s => s.trim()) : []);

    const description = e.description || 'Wir suchen eine professionelle musikalische Begleitung für unser anstehendes Event mit fantastischer Stimmung.';

    const themeColor = '#7c3aed';

    return `
        <div class="market-tile-card" style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm); opacity: ${isActive ? '1' : '0.75'};">
            
            <!-- 1. Combined Galerie: Photos (FÜLLT DIE KACHEL IN DER BREITE 100% AUS) -->
            <div class="tile-fullwidth-photo-slider" style="position: relative; width: 100%; height: 210px; background: #0f172a; overflow: hidden;">
                <span class="tile-gallery-counter" style="position: absolute; bottom: 12px; left: 12px; z-index: 4; font-size: 0.7rem; font-weight: 700; color: #fff; background: rgba(15, 23, 42, 0.75); padding: 0.25rem 0.5rem; border-radius: 6px; backdrop-filter: blur(4px); pointer-events: none; border: 1px solid rgba(255,255,255,0.1);">
                    📷 1 / ${photos.length}
                </span>
                
                <div id="combo-slider-${e.id}" data-idx="0" style="display: flex; width: 100%; height: 100%; transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);">
                    <!-- Slides 1-3: Fotos -->
                    ${photos.map((img) => `
                        <div style="width: 100%; height: 100%; flex-shrink: 0; position: relative;">
                            <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    `).join('')}

                    <!-- Last Slide: Beschreibung -->
                    <div style="width: 100%; height: 100%; flex-shrink: 0; position: relative; background: #0f172a; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 0.3rem 3.2rem 0.5rem; box-sizing: border-box; text-align: center;">
                        <p style="font-size: 0.82rem; font-weight: 500; color: #f8fafc; line-height: 1.45; margin: 0; max-height: 145px; overflow-y: auto;">
                            ${description}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Dots container below the slider, but very close -->
            <div class="tile-gallery-dots" id="combo-dots-${e.id}" data-theme="${themeColor}" style="display: flex; justify-content: center; gap: 6px; margin: 0.5rem auto 0; align-items: center;">
                ${Array.from({ length: photos.length + 1 }).map((_, dIdx) => `
                    <span class="tile-gallery-dot${dIdx === 0 ? ' active' : ''}" style="width: 6px; height: 6px; border-radius: 50%; background: ${dIdx === 0 ? themeColor : 'var(--text-muted)'}; opacity: ${dIdx === 0 ? '1' : '0.4'}; transition: all 0.2s ease; transform: ${dIdx === 0 ? 'scale(1.2)' : 'scale(1)'};"></span>
                `).join('')}
            </div>

            <!-- Tile Body Content -->
            <div class="tile-body-content" style="padding: 0.8rem 1.1rem 0.8rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin: 0 0 0.6rem; line-height: 1.25;">
                        ${e.name}
                        ${e.isCanceled ? ' <span style="background:rgba(255,75,75,0.1); color:var(--color-red); font-size:0.65rem; padding:0.1rem 0.35rem; border-radius:4px;"><i class="fa-solid fa-ban"></i> Abgesagt</span>' : ''}
                        ${!isActive ? ' <span style="background:rgba(249,115,22,0.1); color:var(--color-orange); font-size:0.65rem; padding:0.1rem 0.35rem; border-radius:4px;"><i class="fa-solid fa-pause"></i> Pausiert</span>' : ''}
                    </h3>

                    <!-- Single column list matching market style -->
                    <div class="tile-info-list" style="display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.84rem; color: var(--text-main); margin-bottom: 0.6rem;">
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-location-dot" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>${window.normalizeCityName(e.location)}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-calendar" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>${formattedDate}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-tag" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>Typ: ${e.type}</span>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 0.6rem; line-height: 1.35;">
                            <i class="fa-solid fa-music" style="color: ${themeColor}; width: 16px; text-align: center; margin-top: 0.15rem;"></i>
                            <span style="flex: 1;">Musikgenres: ${formatTruncatedValue(genresArr, themeColor, e.id, 'genres')}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-users" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>${e.minPublikum !== undefined && e.maxPublikum !== undefined ? `${e.minPublikum} - ${e.maxPublikum}+` : '50 - 150'} Personen</span>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 0.6rem; line-height: 1.35;">
                            <i class="fa-solid fa-sliders" style="color: ${themeColor}; width: 16px; text-align: center; margin-top: 0.15rem;"></i>
                            <span style="flex: 1;">${techArr.length > 0 ? formatTruncatedValue(techArr, themeColor, e.id, 'tech') : 'nach Vereinbarung'}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-euro-sign" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>Budget: ${budgetDisplay}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions Grid at the Bottom (Purple theme with white text) -->
            <div style="border-top: 1px solid rgba(255, 255, 255, 0.15); padding: 0.6rem 0.8rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; background: #7c3aed;">
                <button class="btn btn-sm btn-glass btn-edit-my-event" data-id="${e.id}" style="font-size: 0.72rem; padding: 0.35rem; margin: 0; display: flex; align-items: center; justify-content: center; gap: 0.3rem; color: #ffffff; border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.1);">
                    <i class="fa-solid fa-pen" style="color: #ffffff;"></i> Bearbeiten
                </button>
                <button class="btn btn-sm btn-glass btn-duplicate-my-event" data-id="${e.id}" style="font-size: 0.72rem; padding: 0.35rem; margin: 0; display: flex; align-items: center; justify-content: center; gap: 0.3rem; color: #ffffff; border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.1);">
                    <i class="fa-solid fa-copy" style="color: #ffffff;"></i> Duplizieren
                </button>
                <button class="btn btn-sm btn-glass btn-pause-my-event" data-id="${e.id}" style="font-size: 0.72rem; padding: 0.35rem; margin: 0; display: flex; align-items: center; justify-content: center; gap: 0.3rem; color: #ffffff; border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.1);">
                    <i class="fa-solid fa-${isActive ? 'pause' : 'play'}" style="color: #ffffff;"></i> ${isActive ? 'Pausieren' : 'Aktivieren'}
                </button>
                <button class="btn btn-sm btn-glass btn-delete-my-event" data-id="${e.id}" style="font-size: 0.72rem; padding: 0.35rem; margin: 0; display: flex; align-items: center; justify-content: center; gap: 0.3rem; color: #ffffff; border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.1);">
                    <i class="fa-solid fa-trash" style="color: #ffffff;"></i> Löschen
                </button>
            </div>
        </div>
    `;
}

function renderMyEvents(container) {
    if (!state.currentUser) return;
    const u = state.currentUser;
    const allMyEvents = state.events.filter(e => e.creatorId === u.id);
    const activeEvents = allMyEvents.filter(e => isEventActive(e));
    const deactivatedEvents = allMyEvents.filter(e => !isEventActive(e));
    
    const totalInterestsExpressedByMe = state.interests?.filter(i => allMyEvents.some(e => e.id === i.eventId) && i.organizerInterested).length || 0;
    const totalNoInterestsByMe = state.interests?.filter(i => allMyEvents.some(e => e.id === i.eventId) && i.organizerNoInterest).length || 0;
    
    let totalPerfectMatches = 0;
    allMyEvents.forEach(e => {
        state.interests?.forEach(i => {
            if (i.eventId === e.id && i.musicianInterested && i.organizerInterested) {
                totalPerfectMatches++;
            }
        });
    });

    const totalContactedByMe = state.chats?.filter(c => 
        c.participants.includes(u.id) && 
        c.participants.some(p => p.startsWith('mus_'))
    ).length || 0;

    const successPercent = totalInterestsExpressedByMe > 0 ? Math.round((totalPerfectMatches / totalInterestsExpressedByMe) * 100) : 0;

    container.innerHTML = `
        <div class="portal-layout" style="display:flex; flex-direction:column; gap:2rem;"><!-- Active Events -->
            <div class="profile-section-card" style="padding-top: 1.2rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom: 1px solid var(--border-glass); padding-bottom:0.6rem; flex-wrap: wrap; gap:1rem;">
                    <h3 style="margin:0;"><i class="fa-solid fa-calendar-check text-cyan"></i> Aktive Events (${activeEvents.length})</h3>
                </div>
                
                <div class="my-events-list">
                    ${activeEvents.length === 0 ? `
                        <div style="padding:2rem 1rem; text-align:center; color:var(--text-muted); margin-bottom: 1rem;">
                            <i class="fa-solid fa-calendar-days" style="font-size:2.5rem; color:var(--border-glass); margin-bottom:0.8rem;"></i>
                            <p>Keine aktiven Ausschreibungen vorhanden.</p>
                        </div>
                    ` : `
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 390px), 1fr)); gap: 1.5rem; margin-bottom: 1rem;">
                            ${activeEvents.map(e => renderOrganizerEventItem(e, true)).join('')}
                        </div>
                    `}
                    <div style="display: flex; justify-content: center; margin-top: 1.5rem;">
                        <button class="btn btn-primary" id="btn-create-event-modal" style="margin:0; background: #2563eb; border-color: #2563eb; color: #ffffff;">
                            <i class="fa-solid fa-plus"></i> Neues Event erstellen
                        </button>
                    </div>
                </div>
            </div>

            <!-- Deactivated / Finished Events -->
            <div class="profile-section-card" style="opacity:0.85;">
                <div style="margin-bottom:1.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom:0.8rem;">
                    <h3 style="margin:0; color:var(--text-muted);"><i class="fa-solid fa-calendar-minus"></i> Deaktivierte & Beendete Events (${deactivatedEvents.length})</h3>
                </div>
                
                <div class="my-events-list">
                    ${deactivatedEvents.length === 0 ? `
                        <div style="padding:2rem 1rem; text-align:center; color:var(--text-muted);">
                            <i class="fa-solid fa-calendar-xmark" style="font-size:2.5rem; color:var(--border-glass); margin-bottom:0.8rem;"></i>
                            <p>Keine deaktivierten oder beendeten Events.</p>
                        </div>
                    ` : `
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 390px), 1fr)); gap: 1.5rem;">
                            ${deactivatedEvents.map(e => renderOrganizerEventItem(e, false)).join('')}
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;

    const createBtn = document.getElementById('btn-create-event-modal');
    if (createBtn) {
        createBtn.addEventListener('click', () => showEventModal(null));
    }

    container.querySelectorAll('.btn-pause-my-event').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const result = state.toggleEventActive(id);
            if (result.success) {
                showToast({
                    title: result.isActive ? "Event aktiviert 🟢" : "Event pausiert 🟠",
                    message: result.isActive ? "Das Event ist wieder aktiv und auf dem Markt sichtbar." : "Das Event wurde pausiert und aus der Suche entfernt."
                });
                renderMyEvents(container);
            }
        });
    });

    container.querySelectorAll('.btn-duplicate-my-event').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const event = state.events.find(e => e.id === id);
            if (event) {
                const duplicatedCopy = { ...event };
                duplicatedCopy.id = null;
                duplicatedCopy.name = `${event.name} (Kopie)`;
                duplicatedCopy.date = '';
                duplicatedCopy.musicianFound = false;
                duplicatedCopy.isActive = true;
                showEventModal(duplicatedCopy, true);
            }
        });
    });

    container.querySelectorAll('.btn-edit-my-event').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const event = state.events.find(e => e.id === id);
            if (event) showEventModal(event);
        });
    });

    container.querySelectorAll('.btn-delete-my-event').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            const event = state.events.find(e => e.id === id);
            if (event) {
                if (confirm(`Möchtest du das Event "${event.name}" wirklich unwiderruflich löschen?`)) {
                    await state.deleteEvent(id);
                    showToast({
                        title: "Event gelöscht",
                        message: "Das Event wurde erfolgreich aus der Suche entfernt."
                    });
                    renderMyEvents(container);
                }
            }
        });
    });
}

const activeInsightsProfiles = new Set();

function renderMusicianInsightsPanel(m) {
    const apps = m.applications || [];
    const totalApps = apps.length;
    const bookedCount = apps.filter(a => a.status === 'booked').length;
    const declinedCount = apps.filter(a => a.status === 'declined').length;
    const contactedCount = apps.filter(a => a.status === 'contacted').length;

    let perfectMatchesCount = 0;
    state.interests?.forEach(i => {
        if (i.musicianId === m.id && i.musicianInterested && i.organizerInterested) {
            perfectMatchesCount++;
        }
    });

    const totalInterestsExpressedByMe = state.interests?.filter(i => i.musicianId === m.id && i.musicianInterested).length || 0;
    const bookedPercent = totalInterestsExpressedByMe > 0 ? Math.round((perfectMatchesCount / totalInterestsExpressedByMe) * 100) : 0;

    // Resolve event details
    const resolvedApps = apps.map(app => {
        const event = state.events.find(e => e.id === app.eventId);
        return { app, event };
    }).filter(item => item.event !== undefined);

    const eventListHtml = resolvedApps.length === 0 ? `
        <div style="padding:1.5rem; text-align:center; color:var(--text-muted); font-size:0.8rem; background:#ffffff; border: 1px solid var(--border-glass); border-radius:var(--radius-sm);">
            <i class="fa-solid fa-envelope-open" style="font-size:1.8rem; color:var(--border-glass); margin-bottom:0.5rem; display:block;"></i>
            Keine kontaktierten Events für dieses Profil gefunden. Bewirb dich auf dem Event-Marktplatz!
        </div>
    ` : `
        <div style="display:flex; flex-direction:column; gap:0.6rem;">
            ${resolvedApps.map(({ app, event }) => `
                <div class="insights-event-row" style="display:flex; align-items:center; justify-content:space-between; padding: 0.8rem; background: #ffffff; border: 1px solid var(--border-glass); border-radius: var(--radius-sm); gap: 1rem; flex-wrap: wrap;">
                    <div style="flex:1; min-width: 200px;">
                        <h5 style="margin:0 0 0.15rem; font-size:0.9rem; font-weight:700; color:var(--text-main);">${event.name}</h5>
                        <div style="font-size:0.75rem; color:var(--text-muted); display:flex; gap:0.8rem; flex-wrap:wrap;">
                            <span><i class="fa-solid fa-calendar text-purple"></i> ${new Date(event.date).toLocaleDateString('de-DE')}</span>
                            <span><i class="fa-solid fa-map-marker-alt text-purple"></i> ${window.normalizeCityName(event.location)}</span>
                            <span><i class="fa-solid fa-euro-sign text-purple"></i> ${(() => {
                                const minB = event.minBudget !== undefined ? event.minBudget : event.budget;
                                const maxB = event.maxBudget;
                                if (minB !== undefined && minB !== null) {
                                    if (maxB !== undefined && maxB !== null && maxB !== minB) {
                                        return `${minB.toLocaleString('de-DE')} - ${maxB.toLocaleString('de-DE')} €`;
                                    }
                                    return `${minB.toLocaleString('de-DE')} €`;
                                }
                                return 'Auf Anfrage';
                            })()}</span>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:1.2rem; flex-shrink:0; flex-wrap:wrap;">
                        <span style="font-size:0.7rem; font-weight:700; padding:0.2rem 0.5rem; border-radius:4px; ${
                            app.status === 'booked' 
                                ? 'background:rgba(56,239,125,0.1); color:var(--color-green);' 
                                : app.status === 'declined'
                                    ? 'background:rgba(255,75,75,0.1); color:var(--color-red);'
                                    : 'background:rgba(15,23,42,0.05); color:var(--text-muted);'
                        }">
                            ${app.status === 'booked' ? '<i class="fa-solid fa-check-double"></i> Gebucht' : app.status === 'declined' ? '<i class="fa-solid fa-ban"></i> Abgesagt' : '<i class="fa-solid fa-paper-plane"></i> Kontaktiert'}
                        </span>
                        
                        <div style="display:flex; align-items:center; gap:0.8rem;">
                            <label style="display:flex; align-items:center; gap:0.3rem; font-size:0.8rem; font-weight:600; cursor:pointer; margin:0; user-select:none; color: ${app.status === 'booked' ? 'var(--color-green)' : 'var(--text-muted)'};">
                                <input type="checkbox" class="chk-toggle-booked" data-musician-id="${m.id}" data-event-id="${event.id}" ${app.status === 'booked' ? 'checked' : ''} style="width:15px; height:15px; accent-color:var(--color-green); cursor:pointer;">
                                Gebucht
                            </label>
                            <label style="display:flex; align-items:center; gap:0.3rem; font-size:0.8rem; font-weight:600; cursor:pointer; margin:0; user-select:none; color: ${app.status === 'declined' ? 'var(--color-red)' : 'var(--text-muted)'};">
                                <input type="checkbox" class="chk-toggle-declined" data-musician-id="${m.id}" data-event-id="${event.id}" ${app.status === 'declined' ? 'checked' : ''} style="width:15px; height:15px; accent-color:var(--color-red); cursor:pointer;">
                                Absagen
                            </label>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    return `
        <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
            <!-- Insights Profile Dashboard -->
            <div style="display:flex; align-items:center; gap:2rem; flex-wrap:wrap; background:rgba(124,58,237,0.02); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-glass);">
                <!-- Donut Chart -->
                <div style="position: relative; width: 90px; height: 90px; flex-shrink: 0; margin: 0 auto;">
                    <div style="width: 100%; height: 100%; border-radius: 50%; background: conic-gradient(var(--color-green) 0% ${bookedPercent}%, rgba(15,23,42,0.08) ${bookedPercent}% 100%);"></div>
                    <div style="position: absolute; top: 9px; left: 9px; width: 72px; height: 72px; border-radius: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center; flex-direction: column; border: 1px solid var(--border-glass); padding: 0.2rem;">
                        <span style="font-size: 1.1rem; font-weight: 700; color: var(--text-main);">${bookedPercent}%</span>
                        <span style="font-size: 0.45rem; color: var(--text-muted); text-transform:uppercase; font-weight:600; letter-spacing:0.5px; text-align:center; line-height:1.2;">Match Ratio</span>
                    </div>
                </div>
                
                <!-- Small Stats Grid -->
                <div style="flex:1; display:grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap:1rem; min-width:180px;">
                    <div style="background:#ffffff; border:1px solid var(--border-glass); padding:0.6rem 0.8rem; border-radius:var(--radius-sm);">
                        <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; font-weight:700; margin-bottom:0.15rem;">Bewerbungen</div>
                        <div style="font-size:1.3rem; font-weight:700; color:var(--text-main);">${totalApps}</div>
                    </div>
                    <div style="background:rgba(56,239,125,0.02); border:1px solid rgba(56,239,125,0.15); padding:0.6rem 0.8rem; border-radius:var(--radius-sm);">
                        <div style="font-size:0.65rem; color:var(--color-green); text-transform:uppercase; font-weight:700; margin-bottom:0.15rem;">Gebucht</div>
                        <div style="font-size:1.3rem; font-weight:700; color:var(--color-green);">${bookedCount}</div>
                    </div>
                    <div style="background:rgba(255,75,75,0.02); border:1px solid rgba(255,75,75,0.15); padding:0.6rem 0.8rem; border-radius:var(--radius-sm);">
                        <div style="font-size:0.65rem; color:var(--color-red); text-transform:uppercase; font-weight:700; margin-bottom:0.15rem;">Abgesagt</div>
                        <div style="font-size:1.3rem; font-weight:700; color:var(--color-red);">${declinedCount}</div>
                    </div>
                    <div style="background:rgba(255,20,147,0.02); border:1px solid rgba(255,20,147,0.15); padding:0.6rem 0.8rem; border-radius:var(--radius-sm);">
                        <div style="font-size:0.65rem; color:#ff1493; text-transform:uppercase; font-weight:700; margin-bottom:0.15rem;">Perfect Matches</div>
                        <div style="font-size:1.3rem; font-weight:700; color:#ff1493;">${perfectMatchesCount}</div>
                    </div>
                </div>
            </div>

            <!-- List of applied events -->
            <div>
                <h4 style="margin:0 0 0.8rem; font-size:0.95rem; font-weight:700; color:var(--text-main);"><i class="fa-solid fa-list text-purple"></i> Kontaktierte Events & Bewerbungen</h4>
                ${eventListHtml}
            </div>
        </div>
    `;
}

function renderMyMusicianItem(m, isActive) {
    const photos = (m.photos && m.photos.length > 0)
        ? m.photos.slice(0, 5)
        : [
            m.profilePic || (m.type === 'DJ' ? 'https://picsum.photos/id/653/300/300' : m.type === 'Solo' ? 'https://picsum.photos/id/325/300/300' : 'https://picsum.photos/id/453/300/300')
          ];

    const videoSources = (m.videos && m.videos.length > 0) ? m.videos.slice(0, 3) : [];

    const audios = (m.audio && m.audio.length > 0) ? m.audio.slice(0, 3) : [];

    const genresArr = m.genres && m.genres.length > 0 ? m.genres : ['Pop', 'Rock'];
    const instrumentsList = (m.instruments || []).join(', ') || (m.type === 'DJ' ? 'DJ-Controller' : 'Gesang, Gitarre');
    const eventTypesList = (m.eventTypes || []).join(', ') || 'Hochzeit, Geburtstag, Firmenfeier';

    let durationDisplay = '';
    const minDur = m.minDuration;
    const maxDur = m.maxDuration;
    if (minDur !== undefined && minDur !== null) {
        if (maxDur !== undefined && maxDur !== null && maxDur !== minDur) {
            durationDisplay = `${minDur} - ${maxDur} Stunden`;
        } else {
            durationDisplay = `${minDur} Stunden`;
        }
    } else {
        durationDisplay = '2 - 4 Stunden';
    }

    let budgetDisplay = '';
    const minB = m.minBudget;
    const maxB = m.maxBudget;
    if (minB !== undefined && minB !== null) {
        if (maxB !== undefined && maxB !== null && maxB !== minB) {
            budgetDisplay = `${minB.toLocaleString('de-DE')} - ${maxB.toLocaleString('de-DE')} €`;
        } else {
            budgetDisplay = `${minB.toLocaleString('de-DE')} €`;
        }
    } else {
        budgetDisplay = 'Auf Anfrage';
    }

    const techArr = Array.isArray(m.technik) 
        ? m.technik 
        : (typeof m.technik === 'string' && m.technik.trim() !== '' ? m.technik.split(',').map(s => s.trim()) : []);

    const description = m.description || m.bio || 'Professionelle Live-Musik für unvergessliche Momente bei Hochzeiten, Geburtstagen & Firmenevents.';

    const themeColor = '#2563eb';

    // Availability mapping
    let availDaysStr = 'Nach Vereinbarung';
    if (m.availability) {
        const activeDays = [];
        if (m.availability.monday?.available) activeDays.push('Mo');
        if (m.availability.tuesday?.available) activeDays.push('Di');
        if (m.availability.wednesday?.available) activeDays.push('Mi');
        if (m.availability.thursday?.available) activeDays.push('Do');
        if (m.availability.Friday?.available || m.availability.friday?.available) activeDays.push('Fr');
        if (m.availability.Saturday?.available || m.availability.saturday?.available) activeDays.push('Sa');
        if (m.availability.Sunday?.available || m.availability.sunday?.available) activeDays.push('So');
        if (activeDays.length > 0) {
            availDaysStr = activeDays.join(', ');
        }
    }

    return `
        <div class="market-tile-card" style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm); opacity: ${isActive ? '1' : '0.75'};">
            
            <!-- 1. Combined Galerie: Photos + Videos + Audios direkt folgend -->
            <div class="tile-fullwidth-photo-slider" style="position: relative; width: 100%; height: 210px; background: #0f172a; overflow: hidden;">
                <span class="tile-gallery-counter" style="position: absolute; bottom: 12px; left: 12px; z-index: 4; font-size: 0.7rem; font-weight: 700; color: #fff; background: rgba(15, 23, 42, 0.75); padding: 0.25rem 0.5rem; border-radius: 6px; backdrop-filter: blur(4px); pointer-events: none; border: 1px solid rgba(255,255,255,0.1);">
                    📷 1 / ${photos.length}
                </span>
                
                <div id="combo-slider-${m.id}" data-idx="0" style="display: flex; width: 100%; height: 100%; transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);">
                    
                    <!-- Slides: Fotos -->
                    ${photos.map((img) => `
                        <div style="width: 100%; height: 100%; flex-shrink: 0; position: relative;">
                            <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    `).join('')}

                    <!-- Slides: Nativ abspielbare HTML5 Videos -->
                    ${videoSources.map((vid, vIdx) => `
                        <div style="width: 100%; height: 100%; flex-shrink: 0; position: relative; background: #000; display: flex; align-items: center; justify-content: center;">
                            <video controls preload="metadata" poster="${photos[vIdx % photos.length]}" style="width: 100%; height: 100%; object-fit: cover;" onclick="event.stopPropagation();">
                                <source src="${vid.url}" type="video/mp4">
                                Dein Browser unterstützt dieses Video nicht.
                            </video>
                        </div>
                    `).join('')}

                    <!-- Slides: Nativ abspielbare HTML5 Audios -->
                    ${audios.map((aud, aIdx) => `
                        <div style="width: 100%; height: 100%; flex-shrink: 0; position: relative; background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1rem; box-sizing: border-box;">
                            <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(6, 182, 212, 0.15); display: flex; align-items: center; justify-content: center; margin-bottom: 0.8rem; box-shadow: 0 0 15px rgba(6, 182, 212, 0.4); border: 1px solid rgba(6, 182, 212, 0.3);">
                                <i class="fa-solid fa-music" style="color: #06b6d4; font-size: 1.4rem;"></i>
                            </div>
                            <span style="font-size: 0.82rem; font-weight: 700; color: #f8fafc; text-align: center; margin-bottom: 0.6rem; max-width: 80%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
                                Hörprobe: ${aud.title || 'Demo'}
                            </span>
                            <audio controls preload="metadata" style="width: 85%; height: 32px; outline: none; border-radius: 8px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));" onclick="event.stopPropagation();">
                                <source src="${aud.url}" type="audio/mp3">
                                Dein Browser unterstützt diesen Audioplayer nicht.
                            </audio>
                        </div>
                    `).join('')}

                    <!-- Last Slide: Beschreibung -->
                    <div style="width: 100%; height: 100%; flex-shrink: 0; position: relative; background: #0f172a; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 0.3rem 3.2rem 0.5rem; box-sizing: border-box; text-align: center;">
                        <p style="font-size: 0.82rem; font-weight: 500; color: #f8fafc; line-height: 1.45; margin: 0; max-height: 145px; overflow-y: auto;">
                            ${description}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Dots container below the slider, but very close -->
            <div class="tile-gallery-dots" id="combo-dots-${m.id}" data-theme="${themeColor}" style="display: flex; justify-content: center; gap: 6px; margin: 0.5rem auto 0; align-items: center;">
                ${Array.from({ length: photos.length + videoSources.length + audios.length + 1 }).map((_, dIdx) => `
                    <span class="tile-gallery-dot${dIdx === 0 ? ' active' : ''}" style="width: 6px; height: 6px; border-radius: 50%; background: ${dIdx === 0 ? themeColor : 'var(--text-muted)'}; opacity: ${dIdx === 0 ? '1' : '0.4'}; transition: all 0.2s ease; transform: ${dIdx === 0 ? 'scale(1.2)' : 'scale(1)'};"></span>
                `).join('')}
            </div>

            <!-- Tile Body Content -->
            <div class="tile-body-content" style="padding: 0.8rem 1.1rem 0.8rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin: 0 0 0.6rem; line-height: 1.25;">
                        ${m.name}
                        ${!isActive ? ' <span style="background:rgba(249,115,22,0.1); color:var(--color-orange); font-size:0.65rem; padding:0.1rem 0.35rem; border-radius:4px;"><i class="fa-solid fa-pause"></i> Pausiert</span>' : ''}
                    </h3>

                    <!-- Single column list matching market style -->
                    <div class="tile-info-list" style="display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.84rem; color: var(--text-main); margin-bottom: 0.6rem;">
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-location-dot" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>${window.normalizeCityName(m.location)}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-guitar" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>${m.type}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-calendar-days" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>${availDaysStr}</span>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 0.6rem; line-height: 1.35;">
                            <i class="fa-solid fa-music" style="color: ${themeColor}; width: 16px; text-align: center; margin-top: 0.15rem;"></i>
                            <span style="flex: 1;">${formatTruncatedValue(genresArr, themeColor, m.id, 'genres')}</span>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 0.6rem; line-height: 1.35;">
                            <i class="fa-solid fa-calendar-check" style="color: ${themeColor}; width: 16px; text-align: center; margin-top: 0.15rem;"></i>
                            <span style="flex: 1;">Event-Typen: ${formatTruncatedValue(m.eventTypes && m.eventTypes.length > 0 ? m.eventTypes : ['Hochzeit', 'Geburtstag', 'Firmenfeier'], themeColor, m.id, 'eventtypes')}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-users" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>${m.minPublikum !== undefined && m.maxPublikum !== undefined ? `${m.minPublikum} - ${m.maxPublikum}+` : '0 - 500+'} Personen</span>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 0.6rem; line-height: 1.35;">
                            <i class="fa-solid fa-sliders" style="color: ${themeColor}; width: 16px; text-align: center; margin-top: 0.15rem;"></i>
                            <span style="flex: 1;">${techArr.length > 0 ? formatTruncatedValue(techArr, themeColor, m.id, 'tech') : 'nach Vereinbarung'}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-euro-sign" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>${budgetDisplay}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions Grid at the Bottom (Blue theme with white text) -->
            <div style="border-top: 1px solid rgba(255, 255, 255, 0.15); padding: 0.6rem 0.8rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; background: #2563eb;">
                <button class="btn btn-sm btn-glass btn-edit-my-musician" data-id="${m.id}" style="font-size: 0.72rem; padding: 0.35rem; margin: 0; display: flex; align-items: center; justify-content: center; gap: 0.3rem; color: #ffffff; border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.1);">
                    <i class="fa-solid fa-pen" style="color: #ffffff;"></i> Bearbeiten
                </button>
                <button class="btn btn-sm btn-glass btn-duplicate-my-musician" data-id="${m.id}" style="font-size: 0.72rem; padding: 0.35rem; margin: 0; color: #ffffff; border-color: rgba(255, 255, 255, 0.4); background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
                    <i class="fa-solid fa-copy" style="color: #ffffff;"></i> Duplizieren
                </button>
                <button class="btn btn-sm btn-glass btn-pause-my-musician" data-id="${m.id}" style="font-size: 0.72rem; padding: 0.35rem; margin: 0; color: #ffffff; border-color: rgba(255, 255, 255, 0.4); background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
                    <i class="fa-solid fa-${isActive ? 'pause' : 'play'}" style="color: #ffffff;"></i> ${isActive ? 'Pausieren' : 'Aktivieren'}
                </button>
                <button class="btn btn-sm btn-glass btn-delete-my-musician" data-id="${m.id}" style="font-size: 0.72rem; padding: 0.35rem; margin: 0; color: #ffffff; border-color: rgba(255, 255, 255, 0.4); background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
                    <i class="fa-solid fa-trash" style="color: #ffffff;"></i> Löschen
                </button>
            </div>
        </div>
    `;
}
function renderMyMusicians(container) {
    if (!state.currentUser) return;
    const u = state.currentUser;
    const allMyMusicians = state.musicians.filter(m => m.creatorId === u.id);
    const activeMusicians = allMyMusicians.filter(m => m.isActive !== false);
    const deactivatedMusicians = allMyMusicians.filter(m => m.isActive === false);

    container.innerHTML = `
        <div class="portal-layout" style="display:flex; flex-direction:column; gap:2rem;">
            <!-- Active Musicians -->
            <div class="profile-section-card" style="padding-top: 1.2rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom: 1px solid var(--border-glass); padding-bottom:0.6rem; flex-wrap: wrap; gap:1rem;">
                    <h3 style="margin:0; color:var(--color-purple);"><i class="fa-solid fa-guitar"></i> Aktive Musiker-Profile (${activeMusicians.length})</h3>
                </div>
                
                <div class="my-musicians-list">
                    ${activeMusicians.length === 0 ? `
                        <div style="padding:2rem 1rem; text-align:center; color:var(--text-muted); margin-bottom: 1rem;">
                            <i class="fa-solid fa-guitar" style="font-size:2.5rem; color:var(--border-glass); margin-bottom:0.8rem;"></i>
                            <p>Keine aktiven Profile vorhanden.</p>
                        </div>
                    ` : `
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 390px), 1fr)); gap: 1.5rem; margin-bottom: 1rem;">
                            ${activeMusicians.map(m => renderMyMusicianItem(m, true)).join('')}
                        </div>
                    `}
                    <div style="display: flex; justify-content: center; margin-top: 1.5rem;">
                        <button class="btn btn-primary" id="btn-create-musician-modal" style="margin:0; background: #2563eb; border-color: #2563eb; color: #ffffff;">
                            <i class="fa-solid fa-plus"></i> Profil hinzufügen
                        </button>
                    </div>
                </div>
            </div>

            <!-- Paused / Inactive Musicians -->
            <div class="profile-section-card" style="opacity:0.85;">
                <div style="margin-bottom:1.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom:0.8rem;">
                    <h3 style="margin:0; color:var(--text-muted);"><i class="fa-solid fa-pause"></i> Pausierte & Inaktive Profile (${deactivatedMusicians.length})</h3>
                </div>
                
                <div class="my-musicians-list">
                    ${deactivatedMusicians.length === 0 ? `
                        <div style="padding:2rem 1rem; text-align:center; color:var(--text-muted);">
                            <i class="fa-solid fa-guitar" style="font-size:2.5rem; color:var(--border-glass); margin-bottom:0.8rem; filter: grayscale(1);"></i>
                            <p>Keine pausierten oder inaktiven Profile.</p>
                        </div>
                    ` : `
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 390px), 1fr)); gap: 1.5rem;">
                            ${deactivatedMusicians.map(m => renderMyMusicianItem(m, false)).join('')}
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;

    const createBtn = document.getElementById('btn-create-musician-modal');
    if (createBtn) {
        createBtn.addEventListener('click', () => showMusicianModal(null));
    }

    container.querySelectorAll('.btn-pause-my-musician').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const result = state.toggleMusicianActive(id);
            if (result.success) {
                showToast({
                    title: result.isActive ? "Profil aktiv!" : "Profil pausiert!",
                    message: result.isActive ? "Das Profil ist nun wieder im Markt sichtbar." : "Das Profil wurde pausiert und aus der Suche entfernt."
                });
                renderMyMusicians(container);
            }
        });
    });

    container.querySelectorAll('.btn-duplicate-my-musician').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const musician = state.musicians.find(m => m.id === id);
            if (musician) {
                const duplicatedCopy = { ...musician };
                duplicatedCopy.id = null;
                duplicatedCopy.name = `${musician.name} (Kopie)`;
                duplicatedCopy.isActive = true;
                showMusicianModal(duplicatedCopy, true);
            }
        });
    });

    container.querySelectorAll('.btn-edit-my-musician').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const musician = state.musicians.find(m => m.id === id);
            if (musician) showMusicianModal(musician);
        });
    });

    container.querySelectorAll('.btn-delete-my-musician').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const musician = state.musicians.find(m => m.id === id);
            if (musician && confirm(`Möchtest du das Musiker-Profil "${musician.name}" wirklich unwiderruflich löschen?`)) {
                state.deleteMusician(id);
                showToast({
                    title: "Profil gelöscht",
                    message: "Das Musiker-Profil wurde erfolgreich entfernt."
                });
                renderMyMusicians(container);
            }
        });
    });
}

function showMusicianModal(musicianObj = null, isDuplication = false) {

    const modalWrapper = document.getElementById('modal-container');
    if (!modalWrapper) return;

    modalWrapper.classList.remove('hidden');
    
    const isEdit = !!musicianObj && !isDuplication;
    const title = isEdit ? 'Musiker-Profil bearbeiten' : (isDuplication ? 'Musiker-Profil duplizieren' : 'Neues Musiker-Profil anlegen');
    
    let profilePicUrl = musicianObj?.profilePic || (
        musicianObj?.type === 'DJ' ? 'https://picsum.photos/id/653/300/300' : musicianObj?.type === 'Solo' ? 'https://picsum.photos/id/325/300/300' : 'https://picsum.photos/id/453/300/300'
    );
    let selectedBase64 = musicianObj?.profilePic || '';
    const localMedia = {
        photos: musicianObj?.photos ? [...musicianObj.photos] : [],
        videos: musicianObj?.videos ? [...musicianObj.videos] : [],
        audios: musicianObj?.audio ? [...musicianObj.audio] : []
    };

    // Extract current types
    const currentTypes = musicianObj?.type ? musicianObj.type.split(',').map(s => s.trim()) : [];

    // Helper to check if weekday availability day is active
    const isDayActive = (dayKey) => {
        if (!musicianObj) return false; // Default to unchecked for new profiles
        const avail = musicianObj.availability;
        if (!avail) return false;
        if (Array.isArray(avail)) {
            const dayNames = {
                'mo_do': ['monday', 'tuesday', 'wednesday', 'thursday', 'mo', 'di', 'mi', 'do', 'montag', 'dienstag', 'mittwoch', 'donnerstag'],
                'fr': ['friday', 'fr', 'freitag'],
                'sa': ['saturday', 'sa', 'samstag'],
                'so': ['sunday', 'so', 'sonntag']
            };
            const searchTerms = dayNames[dayKey] || [];
            return avail.some(val => searchTerms.includes(val.toLowerCase()));
        }
        if (typeof avail === 'object') {
            if (dayKey === 'mo_do') {
                return !!(avail.monday?.available || avail.tuesday?.available || avail.wednesday?.available || avail.thursday?.available);
            }
            if (dayKey === 'fr') return !!avail.friday?.available;
            if (dayKey === 'sa') return !!avail.saturday?.available;
            if (dayKey === 'so') return !!avail.sunday?.available;
        }
        return false;
    };

    // Helper to get prefilled start/end time
    const getDayTime = (dayKey, type) => {
        const defStart = dayKey === 'sa' || dayKey === 'so' ? '00:01' : '18:00';
        const defEnd = '23:59';
        const defVal = type === 'start' ? defStart : defEnd;
        
        if (!musicianObj) return '';
        const avail = musicianObj.availability;
        if (!avail || Array.isArray(avail) || typeof avail !== 'object') return defVal;
        
        let dayProp = '';
        if (dayKey === 'mo_do') dayProp = 'monday';
        else if (dayKey === 'fr') dayProp = 'friday';
        else if (dayKey === 'sa') dayProp = 'saturday';
        else if (dayKey === 'so') dayProp = 'sunday';
        
        const dayData = avail[dayProp];
        if (!dayData || !dayData.available) return defVal;
        
        return (type === 'start' ? dayData.startTime : dayData.endTime) || defVal;
    };

    modalWrapper.innerHTML = `
        <div class="modal-content" style="max-width: 650px; max-height: 85vh; overflow-y: auto; text-align: left;">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-modal-btn" id="btn-close-musician-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="musician-editor-form">

                    <div class="form-group">
                        <label>Musiker- oder Bandname</label>
                        <input type="text" name="bandName" class="input-field" value="${musicianObj?.name || ''}" maxlength="50" required>
                    </div>

                    <div class="form-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                            <label style="margin: 0;">Musiker-Typ (Mehrfachauswahl)</label>
                            <span onclick="window.toggleSelectAll('grid-musician-types', this)" style="font-size: 0.72rem; color: var(--color-purple); cursor: pointer; font-weight: 600; text-decoration: underline;">Alle auswählen</span>
                        </div>
                        <div class="checkbox-tag-grid" id="grid-musician-types">
                            ${['Sänger', 'Solokünstler', 'Duo', 'Trio', 'Band', 'Coverband', 'Big Band', 'Ensemble', 'Chor', 'Orchester', 'DJ', 'Alleinunterhalter', 'Showkünstler/Tänzer', 'Sonstige'].map(t => {
                                const isChecked = currentTypes.includes(t);
                                return `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="musicianTypes" value="${t}" ${isChecked ? 'checked' : ''}>
                                        <span>${t}</span>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Standort (Stadt)</label>
                        <input type="text" name="location" class="input-field" value="${musicianObj?.location || ''}" required autocomplete="off">
                    </div>

                    <div class="form-group">
                        <div class="slider-value-display">
                            <label>Maximaler Umkreis (Reisebereitschaft)</label>
                            <span id="val-radius">${musicianObj?.radius || 50} km</span>
                        </div>
                        <input type="range" name="radius" min="0" max="500" step="50" value="${musicianObj?.radius || 50}" class="input-field" style="padding:0; height:auto; accent-color:#a855f7;">
                    </div>

                    <div class="form-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                            <label style="margin: 0;">Genres (Mehrfachauswahl)</label>
                            <span onclick="window.toggleSelectAll('grid-genres', this)" style="font-size: 0.72rem; color: var(--color-purple); cursor: pointer; font-weight: 600; text-decoration: underline;">Alle auswählen</span>
                        </div>
                        <div class="checkbox-tag-grid" id="grid-genres">
                            ${['Pop', 'Rock', 'Schlager', 'Funk', 'Charts', 'Evergreens', 'Dance', 'Elektronisch', 'Jazz', 'Latin', 'R&B', 'Soul', 'Hip Hop', 'Rap', 'Punk', 'Metal', 'Alternative', 'Indie', '60er', '70er', '80er', '90er', '2000er', '2010er', 'Afrobeat', 'Blues', 'Gospel', 'Country', 'Folk', 'K-Pop', 'Klassisch', 'Sonstige'].map(g => {
                                const isChecked = musicianObj?.genres?.includes(g);
                                return `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="genres" value="${g}" ${isChecked ? 'checked' : ''}>
                                        <span>${g}</span>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <div class="form-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                            <label style="margin: 0;">Instrumente (Mehrfachauswahl)</label>
                            <span onclick="window.toggleSelectAll('grid-instruments', this)" style="font-size: 0.72rem; color: var(--color-purple); cursor: pointer; font-weight: 600; text-decoration: underline;">Alle auswählen</span>
                        </div>
                        <div class="checkbox-tag-grid" id="grid-instruments">
                            ${['Akustik', 'Gesang', 'Gitarre', 'Klavier', 'Bass', 'Schlagzeug', 'Percussion', 'Saxophon', 'Trompete', 'Geige', 'Cello', 'Harfe', 'Sonstige'].map(ins => {
                                const isChecked = musicianObj?.instruments?.includes(ins);
                                return `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="instruments" value="${ins}" ${isChecked ? 'checked' : ''}>
                                        <span>${ins}</span>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="slider-value-display">
                            <label>Spieldauer (Stunden)</label>
                            <span id="val-spieldauer">${musicianObj?.minDuration || 0.5} - ${musicianObj?.maxDuration || 2.0} Std.</span>
                        </div>
                        <div class="dual-range-slider" id="slider-spieldauer-container">
                            <div class="dual-range-track"></div>
                            <div class="dual-range-active-track" id="track-spieldauer"></div>
                            <input type="range" id="input-spieldauer-min" name="minDuration" min="0.5" max="10" step="0.5" value="${musicianObj?.minDuration || 0.5}">
                            <input type="range" id="input-spieldauer-max" name="maxDuration" min="0.5" max="10" step="0.5" value="${musicianObj?.maxDuration || 2.0}">
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="slider-value-display">
                            <label>Gage (€)</label>
                            <span id="val-gage">${musicianObj?.minBudget || 0} - ${musicianObj?.maxBudget || 5000} €</span>
                        </div>
                        <div class="dual-range-slider" id="slider-gage-container">
                            <div class="dual-range-track"></div>
                            <div class="dual-range-active-track" id="track-gage"></div>
                            <input type="range" id="input-gage-min" name="minBudget" min="0" max="5000" step="100" value="${musicianObj?.minBudget || 0}">
                            <input type="range" id="input-gage-max" name="maxBudget" min="0" max="5000" step="100" value="${musicianObj?.maxBudget || 5000}">
                        </div>
                    </div>

                    <div class="form-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                            <label style="margin: 0;">Bevorzugte Event-Typen (Mehrfachauswahl)</label>
                            <span onclick="window.toggleSelectAll('grid-event-types', this)" style="font-size: 0.72rem; color: var(--color-purple); cursor: pointer; font-weight: 600; text-decoration: underline;">Alle auswählen</span>
                        </div>
                        <div class="checkbox-tag-grid" id="grid-event-types">
                            ${['Geburtstag', 'Hochzeit - Trauung', 'Hochzeit - Sektempfang', 'Hochzeit - Party', 'Polterabend', 'Firmenfeier', 'Sommerfest', 'Öffentliches Event', 'Stadtfest', 'Kirmes', 'Karnevalsparty', 'Oktoberfest', 'Schützenfest', 'Vereinsfest', 'Sportveranstaltung', 'Jubiläum', 'Festival', 'Konzert', 'Bar/Kneipe/Club', 'Sonstige'].map(evt => {
                                const isChecked = musicianObj?.eventTypes?.includes(evt);
                                return `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="eventTypes" value="${evt}" ${isChecked ? 'checked' : ''}>
                                        <span>${evt}</span>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Verfügbarkeiten</label>
                        <div class="availability-week-grid">
                            ${[
                                { key: 'mo_do', label: 'Montag - Donnerstag', defActive: isDayActive('mo_do'), minTime: getDayTime('mo_do', 'start'), maxTime: getDayTime('mo_do', 'end') },
                                { key: 'fr', label: 'Freitag', defActive: isDayActive('fr'), minTime: getDayTime('fr', 'start'), maxTime: getDayTime('fr', 'end') },
                                { key: 'sa', label: 'Samstag', defActive: isDayActive('sa'), minTime: getDayTime('sa', 'start'), maxTime: getDayTime('sa', 'end') },
                                { key: 'so', label: 'Sonntag', defActive: isDayActive('so'), minTime: getDayTime('so', 'start'), maxTime: getDayTime('so', 'end') }
                            ].map(day => `
                                <div class="availability-day-row" data-day="${day.key}">
                                     <div class="availability-day-info">
                                         <input type="checkbox" name="availDays" value="${day.key}" id="modal-chk-avail-${day.key}" ${day.defActive ? 'checked' : ''}>
                                         <label for="modal-chk-avail-${day.key}">${day.label}</label>
                                     </div>
                                     <div class="availability-day-times" id="modal-times-container-${day.key}">
                                         <input type="time" name="availStart_${day.key}" value="${day.minTime}" ${!day.defActive ? 'disabled' : ''}>
                                         <span>bis</span>
                                         <input type="time" name="availEnd_${day.key}" value="${day.maxTime}" ${!day.defActive ? 'disabled' : ''}>
                                     </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="slider-value-display">
                            <label>Publikum (Anzahl)</label>
                            <span id="val-publikum">${musicianObj?.minPublikum || 0} - ${musicianObj?.maxPublikum || 500}+</span>
                        </div>
                        <div class="dual-range-slider" id="slider-publikum-container">
                            <div class="dual-range-track"></div>
                            <div class="dual-range-active-track" id="track-publikum"></div>
                            <input type="range" id="input-publikum-min" name="minPublikum" min="0" max="500" step="50" value="${musicianObj?.minPublikum || 0}">
                            <input type="range" id="input-publikum-max" name="maxPublikum" min="0" max="500" step="50" value="${musicianObj?.maxPublikum || 500}">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Technik</label>
                        <div class="checkbox-tag-grid" id="grid-technik">
                            ${['Technik vorhanden', 'Technik ist noch unklar', 'Technik nicht vorhanden'].map(t => {
                                const isChecked = Array.isArray(musicianObj?.technik) 
                                    ? musicianObj.technik.includes(t) 
                                    : (musicianObj?.technik === t || (t === 'Technik ist noch unklar' && !musicianObj?.technik));
                                return `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="musTechnik" value="${t}" ${isChecked ? 'checked' : ''}>
                                        <span>${t}</span>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Beschreibung</label>
                        <textarea name="description" class="input-field" rows="3" style="resize:vertical;" maxlength="200" required>${musicianObj?.description || ''}</textarea>
                    </div>

                    <!-- Media Section -->
                    <div style="border-top:1px solid rgba(15,23,42,0.08); margin: 1.5rem 0; padding-top:1rem;"></div>
                    <h4 style="font-family: var(--font-heading); font-size:1.1rem; margin-bottom:0.3rem; color:var(--text-main);"><i class="fa-solid fa-photo-film"></i> Medien</h4>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.3;">
                        Füge Fotos, Videos und Hörproben (Audios) für dein Profil hinzu, um es attraktiver zu gestalten.
                    </p>
                    <div class="form-group" style="margin-bottom: 1.2rem;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                            <label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">Fotos (max. 5) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: JPG, JPEG, PNG, WebP&#10;Maximale Größe: 10 MB&#10;Auflösung: mind. 1200 x 1200 px"></i></label>
                            <button type="button" id="btn-modal-add-photo" class="btn btn-sm btn-glass" style="margin:0; padding:0.2rem 0.6rem; font-size:0.7rem; border-color: rgba(124, 58, 237, 0.3); color:#7c3aed;">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                        <div id="modal-photos-preview" style="display: flex; gap: 0.5rem; flex-wrap: wrap;"></div>
                    </div>
                    <div class="form-group" style="margin-bottom: 1.2rem;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                            <label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">Videos (max. 3) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: MP4, MOV, WebM&#10;Maximale Größe: 500 MB&#10;Maximale Länge: 5 Minuten&#10;Auflösung: 720p - 1080p"></i></label>
                            <button type="button" id="btn-modal-add-video" class="btn btn-sm btn-glass" style="margin:0; padding:0.2rem 0.6rem; font-size:0.7rem; border-color: rgba(124, 58, 237, 0.3); color:#7c3aed;">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                        <div id="modal-videos-preview" style="display: flex; gap: 0.5rem; flex-wrap: wrap;"></div>
                    </div>
                    <div class="form-group" style="margin-bottom: 1.2rem;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                            <label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">Hörproben (max. 3) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: MP3, WAV, M4A&#10;Maximale Größe: 100 MB&#10;Maximale Länge: 10 Minuten"></i></label>
                            <button type="button" id="btn-modal-add-audio" class="btn btn-sm btn-glass" style="margin:0; padding:0.2rem 0.6rem; font-size:0.7rem; border-color: rgba(124, 58, 237, 0.3); color:#7c3aed;">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                        <div id="modal-audios-preview" style="display: flex; gap: 0.5rem; flex-wrap: wrap;"></div>
                    </div>

                    <div style="display: flex; justify-content: center; margin-top: 1.5rem;">
                        <button type="submit" class="btn btn-primary" style="margin:0; padding: 0.85rem 2.5rem; font-size: 1.05rem; font-weight: 800; background: var(--color-purple); border-color: var(--color-purple);">
                            ${isEdit ? 'Änderungen speichern' : 'Profil erstellen'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById('btn-close-musician-modal').addEventListener('click', closeModal);
    
    const locInput = modalWrapper.querySelector('input[name="location"]');
    setupLocationAutocomplete(locInput);



    // Radius range display sync
    const radiusInput = modalWrapper.querySelector('input[name="radius"]');
    const radiusDisplay = modalWrapper.querySelector('#val-radius');
    if (radiusInput && radiusDisplay) {
        radiusInput.addEventListener('input', () => {
            radiusDisplay.textContent = `${radiusInput.value} km`;
        });
    }

    // Dual sliders initialization (scoped to modalWrapper to avoid duplicate ID issues)
    initDualSlider('slider-spieldauer-container', 'input-spieldauer-min', 'input-spieldauer-max', 'track-spieldauer', 'val-spieldauer', 'Std.', false, modalWrapper);
    initDualSlider('slider-gage-container', 'input-gage-min', 'input-gage-max', 'track-gage', 'val-gage', '€', true, modalWrapper);
    initDualSlider('slider-publikum-container', 'input-publikum-min', 'input-publikum-max', 'track-publikum', 'val-publikum', 'Personen', false, modalWrapper);

    // Weekday times enable/disable sync
    modalWrapper.querySelectorAll('input[name="availDays"]').forEach(chk => {
        chk.addEventListener('change', (e) => {
            const day = e.target.value;
            const timesDiv = document.getElementById(`modal-times-container-${day}`);
            if (timesDiv) {
                const inputs = timesDiv.querySelectorAll('input[type="time"]');
                inputs.forEach(inp => inp.disabled = !e.target.checked);
            }
        });
    });

    // Sync active class on tag checkboxes
    modalWrapper.querySelectorAll('.tag-pill-checkbox input').forEach(input => {
        if (input.checked) {
            input.parentElement.classList.add('active');
        } else {
            input.parentElement.classList.remove('active');
        }
        input.addEventListener('change', (e) => {
            if (e.target.checked) {
                e.target.parentElement.classList.add('active');
            } else {
                e.target.parentElement.classList.remove('active');
            }
        });
    });

    // Modal local media previews and actions
    const updateLocalMediaPreview = () => {
        const photosContainer = document.getElementById('modal-photos-preview');
        const videosContainer = document.getElementById('modal-videos-preview');
        const audiosContainer = document.getElementById('modal-audios-preview');
        if (!photosContainer || !videosContainer) return;

        photosContainer.innerHTML = localMedia.photos.length === 0
            ? `<span style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">Keine Bilder hinzugefügt</span>`
            : localMedia.photos.map((p, idx) => `
                <div style="position: relative; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: #000; display:flex; align-items:center; justify-content:center;">
                    ${p === 'loading' ? `
                        <i class="fa-solid fa-spinner fa-spin" style="color: #a855f7; font-size: 1.1rem;"></i>
                    ` : `
                        <img src="${p}" style="width:100%; height:100%; object-fit:cover;">
                    `}
                    <button type="button" class="btn-delete-modal-photo" data-idx="${idx}" style="position: absolute; top: 1px; right: 1px; background: rgba(239, 68, 68, 0.85); border: none; color: #fff; width: 15px; height: 15px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.5rem;"><i class="fa-solid fa-times"></i></button>
                </div>
            `).join('');

        videosContainer.innerHTML = localMedia.videos.length === 0
            ? `<span style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">Keine Videos hinzugefügt</span>`
            : localMedia.videos.map((v, idx) => `
                <div style="position: relative; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: #000; display:flex; align-items:center; justify-content:center;" title="${v.title || (typeof v === 'string' ? v : 'Video')}">
                    ${v.url === 'loading' ? `
                        <i class="fa-solid fa-spinner fa-spin" style="color: #a855f7; font-size: 1.1rem;"></i>
                    ` : `
                        <i class="fa-solid fa-file-video" style="color: #a855f7; font-size: 1.1rem;"></i>
                    `}
                    <button type="button" class="btn-delete-modal-video" data-idx="${idx}" style="position: absolute; top: 1px; right: 1px; background: rgba(239, 68, 68, 0.85); border: none; color: #fff; width: 15px; height: 15px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.5rem;"><i class="fa-solid fa-times"></i></button>
                </div>
            `).join('');

        if (audiosContainer) {
            audiosContainer.innerHTML = localMedia.audios.length === 0
                ? `<span style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">Keine Audios hinzugefügt</span>`
                : localMedia.audios.map((a, idx) => `
                    <div style="position: relative; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: #1e1b4b; display:flex; align-items:center; justify-content:center;" title="${a.title || (typeof a === 'string' ? a : 'Audio')}">
                        ${a.url === 'loading' ? `
                            <i class="fa-solid fa-spinner fa-spin" style="color: #06b6d4; font-size: 1.1rem;"></i>
                        ` : `
                            <i class="fa-solid fa-music" style="color: #06b6d4; font-size: 1.1rem;"></i>
                        `}
                        <button type="button" class="btn-delete-modal-audio" data-idx="${idx}" style="position: absolute; top: 1px; right: 1px; background: rgba(239, 68, 68, 0.85); border: none; color: #fff; width: 15px; height: 15px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.5rem;"><i class="fa-solid fa-times"></i></button>
                    </div>
                `).join('');
        }

        // Bind delete listeners
        photosContainer.querySelectorAll('.btn-delete-modal-photo').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const idx = parseInt(btn.getAttribute('data-idx'));
                localMedia.photos.splice(idx, 1);
                updateLocalMediaPreview();
            });
        });

        videosContainer.querySelectorAll('.btn-delete-modal-video').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const idx = parseInt(btn.getAttribute('data-idx'));
                localMedia.videos.splice(idx, 1);
                updateLocalMediaPreview();
            });
        });

        if (audiosContainer) {
            audiosContainer.querySelectorAll('.btn-delete-modal-audio').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const idx = parseInt(btn.getAttribute('data-idx'));
                    localMedia.audios.splice(idx, 1);
                    updateLocalMediaPreview();
                });
            });
        }
    };

    const addPhotoBtn = document.getElementById('btn-modal-add-photo');
    if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const remainingSlots = 5 - localMedia.photos.length;
            if (remainingSlots <= 0) {
                showToast({
                    title: "Bilder-Limit erreicht 📷",
                    message: "Es sind maximal 5 Bilder erlaubt."
                });
                return;
            }
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    const filesToProcess = Array.from(fileInput.files).slice(0, remainingSlots);
                    if (fileInput.files.length > remainingSlots) {
                        showToast({
                            title: "Bilder-Limit 📷",
                            message: `Es wurden nur die ersten ${remainingSlots} Bilder ausgewählt (maximal 5 erlaubt).`
                        });
                    }
                    filesToProcess.forEach(file => {
                        const placeholderVal = 'loading';
                        localMedia.photos.push(placeholderVal);
                        updateLocalMediaPreview();

                        validateAndProcessPhoto(file, (dataUrl) => {
                            if (!dataUrl) {
                                const pIdx = localMedia.photos.indexOf(placeholderVal);
                                if (pIdx !== -1) localMedia.photos.splice(pIdx, 1);
                                updateLocalMediaPreview();
                                return;
                            }
                            const alreadyExists = localMedia.photos.some((p, pIdx) => p === dataUrl && pIdx !== localMedia.photos.indexOf(placeholderVal));
                            if (alreadyExists) {
                                showToast({
                                    title: "Bild existiert bereits",
                                    message: "Dieses Bild wurde bereits hinzugefügt."
                                });
                                const pIdx = localMedia.photos.indexOf(placeholderVal);
                                if (pIdx !== -1) localMedia.photos.splice(pIdx, 1);
                                updateLocalMediaPreview();
                                return;
                            }
                            const pIdx = localMedia.photos.indexOf(placeholderVal);
                            if (pIdx !== -1) {
                                localMedia.photos[pIdx] = dataUrl;
                            } else {
                                localMedia.photos.push(dataUrl);
                            }
                            updateLocalMediaPreview();
                        });
                    });
                }
            });
            fileInput.click();
        });
    }

    const addVideoBtn = document.getElementById('btn-modal-add-video');
    if (addVideoBtn) {
        addVideoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const remainingSlots = 3 - localMedia.videos.length;
            if (remainingSlots <= 0) {
                showToast({
                    title: "Video-Limit erreicht 🎬",
                    message: "Es sind maximal 3 Videos erlaubt."
                });
                return;
            }
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.accept = 'video/*';
            fileInput.style.display = 'none';
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    const filesToProcess = Array.from(fileInput.files).slice(0, remainingSlots);
                    if (fileInput.files.length > remainingSlots) {
                        showToast({
                            title: "Video-Limit 🎬",
                            message: `Es wurden nur die ersten ${remainingSlots} Videos ausgewählt (maximal 3 erlaubt).`
                        });
                    }
                    filesToProcess.forEach(file => {
                        const placeholderObj = { url: 'loading', title: file.name };
                        localMedia.videos.push(placeholderObj);
                        updateLocalMediaPreview();

                        validateAndProcessVideo(file, (videoUrl) => {
                            if (!videoUrl) {
                                const pIdx = localMedia.videos.indexOf(placeholderObj);
                                if (pIdx !== -1) localMedia.videos.splice(pIdx, 1);
                                updateLocalMediaPreview();
                                return;
                            }
                            const alreadyExists = localMedia.videos.some(v => v.url === videoUrl && v !== placeholderObj);
                            if (alreadyExists) {
                                showToast({
                                    title: "Video existiert bereits",
                                    message: "Dieses Video wurde bereits hinzugefügt."
                                });
                                const pIdx = localMedia.videos.indexOf(placeholderObj);
                                if (pIdx !== -1) localMedia.videos.splice(pIdx, 1);
                                updateLocalMediaPreview();
                                return;
                            }
                            placeholderObj.url = videoUrl;
                            updateLocalMediaPreview();
                        });
                    });
                }
            });
            fileInput.click();
        });
    }

    const addAudioBtn = document.getElementById('btn-modal-add-audio');
    if (addAudioBtn) {
        addAudioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const remainingSlots = 3 - localMedia.audios.length;
            if (remainingSlots <= 0) {
                showToast({
                    title: "Audio-Limit erreicht 🎵",
                    message: "Es sind maximal 3 Audio-Dateien erlaubt."
                });
                return;
            }
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.accept = 'audio/*';
            fileInput.style.display = 'none';
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    const filesToProcess = Array.from(fileInput.files).slice(0, remainingSlots);
                    if (fileInput.files.length > remainingSlots) {
                        showToast({
                            title: "Audio-Limit 🎵",
                            message: `Es wurden nur die ersten ${remainingSlots} Audio-Dateien ausgewählt (maximal 3 erlaubt).`
                        });
                    }
                    filesToProcess.forEach(file => {
                        const placeholderObj = { url: 'loading', title: file.name };
                        localMedia.audios.push(placeholderObj);
                        updateLocalMediaPreview();

                        validateAndProcessAudio(file, (audioObj) => {
                            if (!audioObj || !audioObj.url) {
                                const pIdx = localMedia.audios.indexOf(placeholderObj);
                                if (pIdx !== -1) localMedia.audios.splice(pIdx, 1);
                                updateLocalMediaPreview();
                                return;
                            }
                            const alreadyExists = localMedia.audios.some(a => a.url === audioObj.url && a !== placeholderObj);
                            if (alreadyExists) {
                                showToast({
                                    title: "Hörprobe existiert bereits",
                                    message: "Diese Hörprobe wurde bereits hinzugefügt."
                                });
                                const pIdx = localMedia.audios.indexOf(placeholderObj);
                                if (pIdx !== -1) localMedia.audios.splice(pIdx, 1);
                                updateLocalMediaPreview();
                                return;
                            }
                            placeholderObj.url = audioObj.url;
                            placeholderObj.title = audioObj.title || file.name;
                            updateLocalMediaPreview();
                        });
                    });
                }
            });
            fileInput.click();
        });
    }

    updateLocalMediaPreview();

    const form = document.getElementById('musician-editor-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        const checkedTypes = form.querySelectorAll('input[name="musicianTypes"]:checked');
        if (checkedTypes.length === 0) {
            showToast({ title: "Validierungsfehler ⚠️", message: "Bitte wähle mindestens einen Musiker-Typen aus." });
            return;
        }
        const checkedGenres = form.querySelectorAll('input[name="genres"]:checked');
        if (checkedGenres.length === 0) {
            showToast({ title: "Validierungsfehler ⚠️", message: "Bitte wähle mindestens ein Genre aus." });
            return;
        }
        const checkedInstruments = form.querySelectorAll('input[name="instruments"]:checked');
        if (checkedInstruments.length === 0) {
            showToast({ title: "Validierungsfehler ⚠️", message: "Bitte wähle mindestens ein Instrument aus." });
            return;
        }
        const checkedEventTypes = form.querySelectorAll('input[name="eventTypes"]:checked');
        if (checkedEventTypes.length === 0) {
            showToast({ title: "Validierungsfehler ⚠️", message: "Bitte wähle mindestens eine Event-Art aus." });
            return;
        }
        const locVal = formData.get('location')?.trim();
        if (!locVal) {
            showToast({ title: "Validierungsfehler ⚠️", message: "Bitte gib deinen Standort (Stadt) an." });
            return;
        }
        const descVal = formData.get('description')?.trim();
        if (!descVal) {
            showToast({ title: "Validierungsfehler ⚠️", message: "Bitte gib eine kurze Beschreibung über dich/deine Band an." });
            return;
        }
        const checkedTechnik = form.querySelectorAll('input[name="musTechnik"]:checked');
        if (checkedTechnik.length === 0) {
            showToast({ title: "Validierungsfehler ⚠️", message: "Bitte wähle mindestens eine Technik-Option aus." });
            return;
        }

        const availability = {};
        const moDoChk = form.querySelector('input[name="availDays"][value="mo_do"]');
        const isMoDoChecked = moDoChk ? moDoChk.checked : false;
        const moDoStart = form.querySelector('input[name="availStart_mo_do"]')?.value || '18:00';
        const moDoEnd = form.querySelector('input[name="availEnd_mo_do"]')?.value || '23:59';
        
        ['monday', 'tuesday', 'wednesday', 'thursday'].forEach(day => {
            availability[day] = {
                available: isMoDoChecked,
                startTime: isMoDoChecked ? moDoStart : '',
                endTime: isMoDoChecked ? moDoEnd : ''
            };
        });

        const frChk = form.querySelector('input[name="availDays"][value="fr"]');
        const isFrChecked = frChk ? frChk.checked : false;
        const frStart = form.querySelector('input[name="availStart_fr"]')?.value || '18:00';
        const frEnd = form.querySelector('input[name="availEnd_fr"]')?.value || '23:59';
        availability['friday'] = {
            available: isFrChecked,
            startTime: isFrChecked ? frStart : '',
            endTime: isFrChecked ? frEnd : ''
        };
        
        const saChk = form.querySelector('input[name="availDays"][value="sa"]');
        const isSaChecked = saChk ? saChk.checked : false;
        availability['saturday'] = {
            available: isSaChecked,
            startTime: isSaChecked ? (form.querySelector('input[name="availStart_sa"]')?.value || '00:01') : '',
            endTime: isSaChecked ? (form.querySelector('input[name="availEnd_sa"]')?.value || '23:59') : ''
        };
        
        const soChk = form.querySelector('input[name="availDays"][value="so"]');
        const isSoChecked = soChk ? soChk.checked : false;
        availability['sunday'] = {
            available: isSoChecked,
            startTime: isSoChecked ? (form.querySelector('input[name="availStart_so"]')?.value || '00:01') : '',
            endTime: isSoChecked ? (form.querySelector('input[name="availEnd_so"]')?.value || '23:59') : ''
        };

        const data = {
            name: formData.get('bandName'),
            type: Array.from(form.querySelectorAll('input[name="musicianTypes"]:checked')).map(el => el.value).join(', ') || 'Solo',
            location: formData.get('location'),
            radius: parseInt(formData.get('radius')) || 50,
            minDuration: parseFloat(formData.get('minDuration')) || 1,
            maxDuration: parseFloat(formData.get('maxDuration')) || 3,
            minBudget: parseFloat(formData.get('minBudget')) || 300,
            maxBudget: parseFloat(formData.get('maxBudget')) || 1000,
            genres: Array.from(form.querySelectorAll('input[name="genres"]:checked')).map(el => el.value),
            instruments: Array.from(form.querySelectorAll('input[name="instruments"]:checked')).map(el => el.value),
            eventTypes: Array.from(form.querySelectorAll('input[name="eventTypes"]:checked')).map(el => el.value),
            description: formData.get('description'),
            technik: Array.from(form.querySelectorAll('input[name="musTechnik"]:checked')).map(el => el.value).length > 0
                ? Array.from(form.querySelectorAll('input[name="musTechnik"]:checked')).map(el => el.value)
                : ["Technik ist noch unklar"],
            profilePic: selectedBase64,
            photos: localMedia.photos.filter(p => p !== 'loading'),
            videos: localMedia.videos.filter(v => v.url !== 'loading'),
            audio: (localMedia.audios || []).filter(a => a.url !== 'loading'),
            contactName: `${state.currentUser.firstName} ${state.currentUser.lastName}`,
            phone: state.currentUser.phone,
            email: state.currentUser.email,
            availability: availability,
            minPublikum: parseInt(form.querySelector('#input-publikum-min')?.value) || 0,
            maxPublikum: parseInt(form.querySelector('#input-publikum-max')?.value) || 500
        };

        if (isEdit) {
            state.updateMusician(musicianObj.id, data);
            showToast({
                title: "Musiker aktualisiert!",
                message: `Das Profil "${data.name}" wurde erfolgreich gespeichert.`
            });
        } else {
            state.addMusician(data);
            showToast({
                title: "Musiker angelegt! ??",
                message: `Das Profil "${data.name}" wurde erfolgreich veröffentlicht.`
            });
        }

        closeModal();
        const mainContainer = document.getElementById('app-main');
        renderMyMusicians(mainContainer);
    });
}

function showEventModal(eventObj = null, isDuplication = false) {
    const modalWrapper = document.getElementById('modal-container');
    if (!modalWrapper) return;

    modalWrapper.classList.remove('hidden');
    
    const isEdit = !!eventObj && !isDuplication;
    const title = isEdit ? 'Event bearbeiten' : (isDuplication ? 'Event duplizieren' : 'Neues Event erstellen');
    const localMedia = {
        photos: eventObj?.photos ? [...eventObj.photos] : [],
        videos: eventObj?.videos ? [...eventObj.videos] : [],
        audios: eventObj?.audio ? [...eventObj.audio] : []
    };

    let selectedEventDates = [];
    if (eventObj?.date) {
        if (typeof eventObj.date === 'string' && eventObj.date.startsWith('[')) {
            try {
                selectedEventDates = JSON.parse(eventObj.date);
            } catch(e) {
                selectedEventDates = [eventObj.date];
            }
        } else {
            selectedEventDates = [eventObj.date];
        }
    } else if (eventObj?.dates) {
        selectedEventDates = [...eventObj.dates];
    } else {
        selectedEventDates = [];
    }

    let selectedOrgLocations = eventObj?.locations ? [...eventObj.locations] : (eventObj?.location ? [eventObj.location] : []);
    const currentTypes = eventObj?.type ? eventObj.type.split(',').map(s => s.trim()) : [];
    const currentMusicianTypes = eventObj?.musicianTypes || (eventObj?.musicianType ? eventObj.musicianType.split(',').map(s => s.trim()) : []);

    modalWrapper.innerHTML = `
        <div class="modal-content" style="max-width: 650px; max-height: 85vh; overflow-y: auto; text-align: left;">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-modal-btn" id="btn-close-event-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="event-editor-form">
                    
                    <div class="form-group">
                        <label>Eventname</label>
                        <input type="text" name="eventName" class="input-field" value="${eventObj?.name || ''}" placeholder="Name des Events" maxlength="50" required>
                    </div>

                    <div class="form-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                            <label style="margin: 0;">Event-Typ (Mehrfachauswahl)</label>
                            <span onclick="window.toggleSelectAll('grid-org-event-types', this)" style="font-size: 0.72rem; color: #2563eb; cursor: pointer; font-weight: 600; text-decoration: underline;">Alle auswählen</span>
                        </div>
                        <div class="checkbox-tag-grid" id="grid-org-event-types">
                            ${['Geburtstag', 'Hochzeit - Trauung', 'Hochzeit - Sektempfang', 'Hochzeit - Party', 'Polterabend', 'Firmenfeier', 'Sommerfest', 'Öffentliches Event', 'Stadtfest', 'Kirmes', 'Karnevalsparty', 'Oktoberfest', 'Schützenfest', 'Vereinsfest', 'Sportveranstaltung', 'Jubiläum', 'Festival', 'Konzert', 'Bar/Kneipe/Club', 'Sonstige'].map(t => {
                                const isChecked = currentTypes.includes(t);
                                return `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="orgEventTypes" value="${t}" ${isChecked ? 'checked' : ''}>
                                        <span>${t}</span>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>
 
                    <div class="form-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                            <label style="margin: 0;">Gesuchte Musiker-Typen (Mehrfachauswahl)</label>
                            <span onclick="window.toggleSelectAll('grid-org-musician-types', this)" style="font-size: 0.72rem; color: #2563eb; cursor: pointer; font-weight: 600; text-decoration: underline;">Alle auswählen</span>
                        </div>
                        <div class="checkbox-tag-grid" id="grid-org-musician-types">
                            ${['Sänger', 'Solokünstler', 'Duo', 'Trio', 'Band', 'Coverband', 'Big Band', 'Ensemble', 'Chor', 'Orchester', 'DJ', 'Alleinunterhalter', 'Showkünstler/Tänzer', 'Sonstige'].map(t => {
                                const isChecked = currentMusicianTypes.includes(t);
                                return `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="orgMusicianTypes" value="${t}" ${isChecked ? 'checked' : ''}>
                                        <span>${t}</span>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Datum</label>
                        <p style="font-size:0.7rem; color:var(--text-muted); margin-bottom: 0.5rem; line-height: 1.3;">
                            An welchem Tag bzw. an welchen Tagen findet dein Event statt?
                        </p>
                        <div class="organizer-calendar-widget" id="modal-org-calendar-widget">
                            <div class="org-calendar-header">
                                <button type="button" class="btn-cal-nav" id="modal-btn-cal-prev"><i class="fa-solid fa-chevron-left"></i></button>
                                <span id="modal-org-calendar-month-year">Juli 2026</span>
                                <button type="button" class="btn-cal-nav" id="modal-btn-cal-next"><i class="fa-solid fa-chevron-right"></i></button>
                            </div>
                            <div class="org-calendar-weekdays">
                                <div>Mo</div><div>Di</div><div>Mi</div><div>Do</div><div>Fr</div><div>Sa</div><div>So</div>
                            </div>
                            <div class="org-calendar-days" id="modal-org-calendar-days-grid"></div>
                        </div>
                        <input type="hidden" name="eventDates" id="modal-input-event-dates" value="">
                        <div id="modal-org-selected-dates-preview" style="font-size:0.75rem; color:#3b82f6; margin-top:0.5rem; font-weight:600;">
                            Keine Termine ausgewählt
                        </div>
                    </div>

                    <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
                        <div class="form-group" style="flex: 0 0 120px; width: 120px;">
                            <label>Startzeit</label>
                            <input type="time" name="eventStartTime" class="input-field" value="${eventObj?.eventStartTime || '18:00'}" style="margin: 0; width: 120px; height:42px;">
                        </div>
                        <div class="form-group" style="flex: 0 0 120px; width: 120px;">
                            <label>Endzeit</label>
                            <input type="time" name="eventEndTime" class="input-field" value="${eventObj?.eventEndTime || '22:00'}" style="margin: 0; width: 120px; height:42px;">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Ort (Stadt)</label>
                        <input type="text" id="modal-input-org-location-search" class="input-field" value="${eventObj?.location || ''}" placeholder="z.B. München" autocomplete="off" style="width: 100%;">
                    </div>

                    <div class="form-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                            <label style="margin: 0;">Genres (Mehrfachauswahl)</label>
                            <span onclick="window.toggleSelectAll('grid-org-genres', this)" style="font-size: 0.72rem; color: #2563eb; cursor: pointer; font-weight: 600; text-decoration: underline;">Alle auswählen</span>
                        </div>
                        <div class="checkbox-tag-grid" id="grid-org-genres">
                            ${['Pop', 'Rock', 'Schlager', 'Funk', 'Charts', 'Evergreens', 'Dance', 'Elektronisch', 'Jazz', 'Latin', 'R&B', 'Soul', 'Hip Hop', 'Rap', 'Punk', 'Metal', 'Alternative', 'Indie', '60er', '70er', '80er', '90er', '2000er', '2010er', 'Afrobeat', 'Blues', 'Gospel', 'Country', 'Folk', 'K-Pop', 'Klassisch', 'Sonstige'].map(g => {
                                const isChecked = eventObj?.genres?.includes(g);
                                return `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="orgGenres" value="${g}" ${isChecked ? 'checked' : ''}>
                                        <span>${g}</span>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <div class="form-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                            <label style="margin: 0;">Instrumente (Mehrfachauswahl)</label>
                            <span onclick="window.toggleSelectAll('grid-org-instruments', this)" style="font-size: 0.72rem; color: #2563eb; cursor: pointer; font-weight: 600; text-decoration: underline;">Alle auswählen</span>
                        </div>
                        <div class="checkbox-tag-grid" id="grid-org-instruments">
                            ${['Akustik', 'Gesang', 'Gitarre', 'Klavier', 'Bass', 'Schlagzeug', 'Percussion', 'Saxophon', 'Trompete', 'Geige', 'Cello', 'Harfe', 'Sonstige'].map(ins => {
                                const isChecked = eventObj?.instruments?.includes(ins);
                                return `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="orgInstruments" value="${ins}" ${isChecked ? 'checked' : ''}>
                                        <span>${ins}</span>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <div class="form-group" style="margin-top: 1rem;">
                        <div class="slider-value-display">
                            <label>Spieldauer (Std.)</label>
                            <span id="val-org-spieldauer">${eventObj?.minDuration || 0.5} - ${eventObj?.maxDuration || 2.0} Std.</span>
                        </div>
                        <div class="dual-range-slider" id="slider-org-spieldauer-container">
                            <div class="dual-range-track"></div>
                            <div class="dual-range-active-track" id="track-org-spieldauer"></div>
                            <input type="range" id="input-org-spieldauer-min" name="orgMinDuration" min="0.5" max="10" step="0.5" value="${eventObj?.minDuration || 0.5}">
                            <input type="range" id="input-org-spieldauer-max" name="orgMaxDuration" min="0.5" max="10" step="0.5" value="${eventObj?.maxDuration || 2.0}">
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="slider-value-display">
                            <label>Gäste (Anzahl)</label>
                            <span id="val-org-publikum">${eventObj?.minPublikum || 0} - ${eventObj?.maxPublikum || 500}+</span>
                        </div>
                        <div class="dual-range-slider" id="slider-org-publikum-container">
                            <div class="dual-range-track"></div>
                            <div class="dual-range-active-track" id="track-org-publikum"></div>
                            <input type="range" id="input-org-publikum-min" name="orgMinPublikum" min="0" max="500" step="50" value="${eventObj?.minPublikum || 0}">
                            <input type="range" id="input-org-publikum-max" name="orgMaxPublikum" min="0" max="500" step="50" value="${eventObj?.maxPublikum || 500}">
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="slider-value-display">
                            <label>Budget (€)</label>
                            <span id="val-org-gage">${eventObj?.minBudget || eventObj?.budget || 0} - ${eventObj?.maxBudget || eventObj?.budget || 5000}+ €</span>
                        </div>
                        <div class="dual-range-slider" id="slider-org-gage-container">
                            <div class="dual-range-track"></div>
                            <div class="dual-range-active-track" id="track-org-gage"></div>
                            <input type="range" id="input-org-gage-min" name="orgMinBudget" min="0" max="5000" step="100" value="${eventObj?.minBudget || eventObj?.budget || 0}">
                            <input type="range" id="input-org-gage-max" name="orgMaxBudget" min="0" max="5000" step="100" value="${eventObj?.maxBudget || eventObj?.budget || 5000}">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Technik</label>
                        <div class="checkbox-tag-grid" id="grid-org-technik">
                            ${['Technik vorhanden', 'Technik ist noch unklar', 'Technik nicht vorhanden'].map(t => {
                                const isChecked = Array.isArray(eventObj?.technik) 
                                    ? eventObj.technik.includes(t) 
                                    : (eventObj?.technik === t || (t === 'Technik ist noch unklar' && !eventObj?.technik));
                                return `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="orgTechnik" value="${t}" ${isChecked ? 'checked' : ''}>
                                        <span>${t}</span>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Beschreibung</label>
                        <textarea name="orgDescription" class="input-field" rows="3" style="resize:vertical;" maxlength="200" required>${eventObj?.description || ''}</textarea>
                    </div>

                    <!-- Media Section -->
                    <div style="border-top:1px solid rgba(15,23,42,0.08); margin: 1.5rem 0; padding-top:1rem;"></div>
                    <h4 style="font-family: var(--font-heading); font-size:1.1rem; margin-bottom:0.3rem; color:var(--text-main);"><i class="fa-solid fa-photo-film"></i> Medien</h4>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.3;">
                        Füge Fotos und Videos für dein Event hinzu, um es attraktiver zu gestalten.
                    </p>
                    <div class="form-group" style="margin-bottom: 1.2rem;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                            <label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">Fotos (max. 5) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: JPG, JPEG, PNG, WebP&#10;Maximale Größe: 10 MB&#10;Auflösung: mind. 1200 x 1200 px"></i></label>
                            <button type="button" id="btn-event-modal-add-photo" class="btn btn-sm btn-glass" style="margin:0; padding:0.2rem 0.6rem; font-size:0.7rem; border-color: rgba(37, 99, 235, 0.3); color:#2563eb;">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                        <div id="event-modal-photos-preview" style="display: flex; gap: 0.5rem; flex-wrap: wrap;"></div>
                    </div>
                    <div class="form-group" style="margin-bottom: 1.2rem;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                            <label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">Videos (max. 3) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: MP4, MOV, WebM&#10;Maximale Größe: 500 MB&#10;Maximale Länge: 5 Minuten&#10;Auflösung: 720p - 1080p"></i></label>
                            <button type="button" id="btn-event-modal-add-video" class="btn btn-sm btn-glass" style="margin:0; padding:0.2rem 0.6rem; font-size:0.7rem; border-color: rgba(37, 99, 235, 0.3); color:#2563eb;">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                        <div id="event-modal-videos-preview" style="display: flex; gap: 0.5rem; flex-wrap: wrap;"></div>
                    </div>

                    <div style="display: flex; justify-content: center; margin-top: 1.5rem;">
                        <button type="submit" class="btn btn-primary" style="margin:0; padding: 0.85rem 2.5rem; font-size: 1.05rem; font-weight: 800; background: #2563eb; border-color: #2563eb;">
                            ${isEdit ? 'Änderungen speichern' : 'Event ausschreiben'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById('btn-close-event-modal').addEventListener('click', closeModal);

    // Initialize Calendar Widget
    let currentCalDate = new Date(2026, 6, 1); // July 2026
    const calendarMonthYear = document.getElementById('modal-org-calendar-month-year');
    const calendarDaysGrid = document.getElementById('modal-org-calendar-days-grid');
    const calendarPrevBtn = document.getElementById('modal-btn-cal-prev');
    const calendarNextBtn = document.getElementById('modal-btn-cal-next');

    const renderOrganizerCalendar = () => {
        if (!calendarDaysGrid || !calendarMonthYear) return;
        const year = currentCalDate.getFullYear();
        const month = currentCalDate.getMonth();
        const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
        calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

        const firstDayIndex = new Date(year, month, 1).getDay();
        const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
        const totalDays = new Date(year, month + 1, 0).getDate();

        let daysHtml = '';
        for (let i = 0; i < adjustedFirstDayIndex; i++) {
            daysHtml += `<div class="org-cal-day empty"></div>`;
        }
        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = selectedEventDates.includes(dateStr);
            daysHtml += `<div class="org-cal-day ${isSelected ? 'selected' : ''}" data-date="${dateStr}">${day}</div>`;
        }
        calendarDaysGrid.innerHTML = daysHtml;

        calendarDaysGrid.querySelectorAll('.org-cal-day:not(.empty)').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const dateVal = e.currentTarget.getAttribute('data-date');
                const idx = selectedEventDates.indexOf(dateVal);
                if (idx > -1) {
                    selectedEventDates.splice(idx, 1);
                } else {
                    selectedEventDates.push(dateVal);
                }
                renderOrganizerCalendar();
                updateDatesPreview();
            });
        });
    };

    const updateDatesPreview = () => {
        const inputEventDates = document.getElementById('modal-input-event-dates');
        const selectedDatesPreview = document.getElementById('modal-org-selected-dates-preview');
        if (inputEventDates) {
            inputEventDates.value = selectedEventDates.length > 0 ? JSON.stringify(selectedEventDates) : '';
        }
        if (selectedDatesPreview) {
            if (selectedEventDates.length === 0) {
                selectedDatesPreview.textContent = "Keine Termine ausgewählt";
                selectedDatesPreview.style.color = '#60a5fa';
            } else {
                const sorted = [...selectedEventDates].sort();
                const formatted = sorted.map(d => {
                    const parts = d.split('-');
                    return `${parts[2]}.${parts[1]}.${parts[0]}`;
                });
                selectedDatesPreview.textContent = `Ausgewählt: ${formatted.join(', ')}`;
                selectedDatesPreview.style.color = '#34d399';
            }
        }
    };

    if (calendarPrevBtn) {
        calendarPrevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentCalDate.setMonth(currentCalDate.getMonth() - 1);
            renderOrganizerCalendar();
        });
    }
    if (calendarNextBtn) {
        calendarNextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentCalDate.setMonth(currentCalDate.getMonth() + 1);
            renderOrganizerCalendar();
        });
    }

    renderOrganizerCalendar();
    updateDatesPreview();

    // Locations setup
    const orgLocationInput = document.getElementById('modal-input-org-location-search');
    if (orgLocationInput) {
        setupLocationAutocomplete(orgLocationInput);
    }

    // Dual sliders initialization (scoped to modalWrapper to avoid duplicate ID issues)
    initDualSlider('slider-org-spieldauer-container', 'input-org-spieldauer-min', 'input-org-spieldauer-max', 'track-org-spieldauer', 'val-org-spieldauer', 'Std.', false, modalWrapper);
    initDualSlider('slider-org-publikum-container', 'input-org-publikum-min', 'input-org-publikum-max', 'track-org-publikum', 'val-org-publikum', 'Personen', false, modalWrapper);
    initDualSlider('slider-org-gage-container', 'input-org-gage-min', 'input-org-gage-max', 'track-org-gage', 'val-org-gage', '€', true, modalWrapper);

    // Sync active class on tag checkboxes
    modalWrapper.querySelectorAll('.tag-pill-checkbox input').forEach(input => {
        if (input.checked) {
            input.parentElement.classList.add('active');
        } else {
            input.parentElement.classList.remove('active');
        }
        input.addEventListener('change', (e) => {
            if (e.target.checked) {
                e.target.parentElement.classList.add('active');
            } else {
                e.target.parentElement.classList.remove('active');
            }
        });
    });

    // Modal local media previews and actions for event
    const updateLocalEventMediaPreview = () => {
        const photosContainer = document.getElementById('event-modal-photos-preview');
        const videosContainer = document.getElementById('event-modal-videos-preview');
        const audiosContainer = document.getElementById('event-modal-audios-preview');
        if (!photosContainer || !videosContainer) return;

        photosContainer.innerHTML = localMedia.photos.length === 0
            ? `<span style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">Keine Bilder hinzugefügt</span>`
            : localMedia.photos.map((p, idx) => `
                <div style="position: relative; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                    <img src="${p}" style="width:100%; height:100%; object-fit:cover;">
                    <button type="button" class="btn-delete-event-modal-photo" data-idx="${idx}" style="position: absolute; top: 1px; right: 1px; background: rgba(239, 68, 68, 0.85); border: none; color: #fff; width: 15px; height: 15px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.5rem;"><i class="fa-solid fa-times"></i></button>
                </div>
            `).join('');

        videosContainer.innerHTML = localMedia.videos.length === 0
            ? `<span style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">Keine Videos hinzugefügt</span>`
            : localMedia.videos.map((v, idx) => `
                <div style="position: relative; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: #000; display:flex; align-items:center; justify-content:center;" title="${v.title || (typeof v === 'string' ? v : 'Video')}">
                    <i class="fa-solid fa-file-video" style="color: #a855f7; font-size: 1.1rem;"></i>
                    <button type="button" class="btn-delete-event-modal-video" data-idx="${idx}" style="position: absolute; top: 1px; right: 1px; background: rgba(239, 68, 68, 0.85); border: none; color: #fff; width: 15px; height: 15px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.5rem;"><i class="fa-solid fa-times"></i></button>
                </div>
            `).join('');

        if (audiosContainer) {
            audiosContainer.innerHTML = (localMedia.audios || []).length === 0
                ? `<span style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">Keine Audios hinzugefügt</span>`
                : localMedia.audios.map((a, idx) => `
                    <div style="position: relative; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: #1e1b4b; display:flex; align-items:center; justify-content:center;" title="${a.title || (typeof a === 'string' ? a : 'Audio')}">
                        <i class="fa-solid fa-music" style="color: #06b6d4; font-size: 1.1rem;"></i>
                        <button type="button" class="btn-delete-event-modal-audio" data-idx="${idx}" style="position: absolute; top: 1px; right: 1px; background: rgba(239, 68, 68, 0.85); border: none; color: #fff; width: 15px; height: 15px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.5rem;"><i class="fa-solid fa-times"></i></button>
                    </div>
                `).join('');
        }

        // Bind delete listeners
        photosContainer.querySelectorAll('.btn-delete-event-modal-photo').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const idx = parseInt(btn.getAttribute('data-idx'));
                localMedia.photos.splice(idx, 1);
                updateLocalEventMediaPreview();
            });
        });

        videosContainer.querySelectorAll('.btn-delete-event-modal-video').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const idx = parseInt(btn.getAttribute('data-idx'));
                localMedia.videos.splice(idx, 1);
                updateLocalEventMediaPreview();
            });
        });

        if (audiosContainer) {
            audiosContainer.querySelectorAll('.btn-delete-event-modal-audio').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const idx = parseInt(btn.getAttribute('data-idx'));
                    localMedia.audios.splice(idx, 1);
                    updateLocalEventMediaPreview();
                });
            });
        }
    };

    const addEventPhotoBtn = document.getElementById('btn-event-modal-add-photo');
    if (addEventPhotoBtn) {
        addEventPhotoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (localMedia.photos.length >= 5) {
                showToast({
                    title: "Bilder-Limit erreicht 📷",
                    message: "Es sind maximal 5 Bilder erlaubt."
                });
                return;
            }
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/png, image/jpeg, image/gif, image/webp';
            fileInput.style.display = 'none';
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    validateAndProcessPhoto(fileInput.files[0], (dataUrl) => {
                        localMedia.photos.push(dataUrl);
                        updateLocalEventMediaPreview();
                    });
                }
            });
            fileInput.click();
        });
    }

    const addEventVideoBtn = document.getElementById('btn-event-modal-add-video');
    if (addEventVideoBtn) {
        addEventVideoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (localMedia.videos.length >= 3) {
                showToast({
                    title: "Video-Limit erreicht 🎬",
                    message: "Es sind maximal 3 Videos erlaubt."
                });
                return;
            }
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'video/mp4, video/quicktime, video/webm, video/ogg, video/x-matroska';
            fileInput.style.display = 'none';
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    validateAndProcessVideo(fileInput.files[0], (videoUrl) => {
                        localMedia.videos.push(videoUrl);
                        updateLocalEventMediaPreview();
                    });
                }
            });
            fileInput.click();
        });
    }

    const addEventAudioBtn = document.getElementById('btn-event-modal-add-audio');
    if (addEventAudioBtn) {
        addEventAudioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if ((localMedia.audios || []).length >= 3) {
                showToast({
                    title: "Audio-Limit erreicht 🎵",
                    message: "Es sind maximal 3 Audio-Dateien erlaubt."
                });
                return;
            }
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'audio/mpeg, audio/wav, audio/ogg, audio/mp3, audio/m4a, audio/aac';
            fileInput.style.display = 'none';
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    validateAndProcessAudio(fileInput.files[0], (audioObj) => {
                        if (!localMedia.audios) localMedia.audios = [];
                        localMedia.audios.push(audioObj);
                        updateLocalEventMediaPreview();
                    });
                }
            });
            fileInput.click();
        });
    }

    updateLocalEventMediaPreview();

    const form = document.getElementById('event-editor-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        const checkedEventTypes = form.querySelectorAll('input[name="orgEventTypes"]:checked');
        if (checkedEventTypes.length === 0) {
            showToast({ title: "Validierungsfehler ⚠️", message: "Bitte wähle mindestens einen Event-Typen aus." });
            return;
        }
        const checkedMusicianTypes = form.querySelectorAll('input[name="orgMusicianTypes"]:checked');
        if (checkedMusicianTypes.length === 0) {
            showToast({ title: "Validierungsfehler ⚠️", message: "Bitte wähle mindestens einen gesuchten Musiker-Typen aus." });
            return;
        }
        if (selectedEventDates.length === 0) {
            showToast({ title: "Validierungsfehler ⚠️", message: "Bitte wähle mindestens ein Veranstaltungsdatum im Kalender aus." });
            return;
        }
        const locVal = (orgLocationInput?.value || '').trim();
        if (!locVal) {
            showToast({ title: "Validierungsfehler ⚠️", message: "Bitte gib den Veranstaltungsort (Stadt) an." });
            return;
        }
        const checkedGenres = form.querySelectorAll('input[name="orgGenres"]:checked');
        if (checkedGenres.length === 0) {
            showToast({ title: "Validierungsfehler ⚠️", message: "Bitte wähle mindestens ein Genre aus." });
            return;
        }
        const checkedInstruments = form.querySelectorAll('input[name="orgInstruments"]:checked');
        if (checkedInstruments.length === 0) {
            showToast({ title: "Validierungsfehler ⚠️", message: "Bitte wähle mindestens ein Instrument aus." });
            return;
        }
        const checkedTechnik = form.querySelectorAll('input[name="orgTechnik"]:checked');
        if (checkedTechnik.length === 0) {
            showToast({ title: "Validierungsfehler ⚠️", message: "Bitte wähle mindestens eine Technik-Option aus." });
            return;
        }
        const descVal = formData.get('orgDescription')?.trim();
        if (!descVal) {
            showToast({ title: "Validierungsfehler ⚠️", message: "Bitte gib eine kurze Beschreibung deines Events an." });
            return;
        }

        const data = {
            name: formData.get('eventName'),
            type: Array.from(form.querySelectorAll('input[name="orgEventTypes"]:checked')).map(el => el.value).join(', ') || 'Sonstige',
            location: (orgLocationInput?.value || '').trim() || 'München',
            locations: [(orgLocationInput?.value || '').trim() || 'München'],
            date: selectedEventDates[0] || new Date().toISOString().split('T')[0],
            dates: selectedEventDates,
            eventStartTime: formData.get('eventStartTime') || '18:00',
            eventEndTime: formData.get('eventEndTime') || '22:00',
            minDuration: parseFloat(formData.get('orgMinDuration')) || 0.5,
            maxDuration: parseFloat(formData.get('orgMaxDuration')) || 2.0,
            spieldauer: parseFloat(formData.get('orgMaxDuration')) || 2.0,
            minPublikum: parseInt(formData.get('orgMinPublikum')) || 0,
            maxPublikum: parseInt(formData.get('orgMaxPublikum')) || 500,
            minBudget: parseFloat(formData.get('orgMinBudget')) || 0,
            maxBudget: parseFloat(formData.get('orgMaxBudget')) || 5000,
            budget: parseFloat(formData.get('orgMaxBudget')) || 5000,
            genres: Array.from(form.querySelectorAll('input[name="orgGenres"]:checked')).map(el => el.value),
            instruments: Array.from(form.querySelectorAll('input[name="orgInstruments"]:checked')).map(el => el.value),
            musicianTypes: Array.from(form.querySelectorAll('input[name="orgMusicianTypes"]:checked')).map(el => el.value),
            technik: Array.from(form.querySelectorAll('input[name="orgTechnik"]:checked')).map(el => el.value).length > 0
                ? Array.from(form.querySelectorAll('input[name="orgTechnik"]:checked')).map(el => el.value)
                : ["Technik ist noch unklar"],
            description: formData.get('orgDescription'),
            photos: localMedia.photos.filter(p => p !== 'loading'),
            videos: localMedia.videos.filter(v => v.url !== 'loading'),
            audio: (localMedia.audios || []).filter(a => a.url !== 'loading'),
            contactName: `${state.currentUser.firstName} ${state.currentUser.lastName}`,
            phone: state.currentUser.phone,
            email: state.currentUser.email
        };

        if (isEdit) {
            state.updateEvent(eventObj.id, data);
            showToast({
                title: "Event aktualisiert!",
                message: `Das Event "${data.name}" wurde erfolgreich gespeichert.`
            });
        } else {
            state.addEvent(data);
            showToast({
                title: "Event erstellt! ??",
                message: `Das Event "${data.name}" wurde erfolgreich veröffentlicht.`
            });
        }

        closeModal();
        const mainContainer = document.getElementById('app-main');
        renderMyEvents(mainContainer);
    });
}

function validateEmailAddress(email) {
    const emailTrimmed = email.trim().toLowerCase();
    
    // 1. Structural validation using a robust regex
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(emailTrimmed)) {
        return { isValid: false, message: "Bitte gib eine gültige E-Mail-Adresse ein." };
    }
    
    // 2. Levenshtein-based typo detection
    const parts = emailTrimmed.split('@');
    if (parts.length === 2) {
        const domain = parts[1];
        const commonEmailDomains = [
            "gmail.com", "googlemail.com",
            "hotmail.com", "hotmail.de",
            "outlook.com", "outlook.de",
            "gmx.de", "gmx.net", "gmx.at", "gmx.ch",
            "web.de",
            "yahoo.com", "yahoo.de",
            "t-online.de",
            "aol.com", "aol.de",
            "icloud.com"
        ];

        // If it's a common domain but has a specific typo
        if (commonEmailDomains.includes(domain)) {
            return { isValid: true };
        }

        // Check Levenshtein distance to find typos
        for (const common of commonEmailDomains) {
            const dist = getLevenshteinDistance(domain, common);
            
            // Check if distance is 1 or 2, or if domain contains a common provider name with extra letters (e.g. hotmailx.com)
            const isTypo = (dist >= 1 && dist <= 2) || 
                           (domain.includes('hotmail') && domain !== 'hotmail.com' && domain !== 'hotmail.de') ||
                           (domain.includes('gmail') && domain !== 'gmail.com' && domain !== 'googlemail.com') ||
                           (domain.includes('gmx') && domain !== 'gmx.de' && domain !== 'gmx.net' && domain !== 'gmx.at' && domain !== 'gmx.ch') ||
                           (domain.includes('web.de') && domain !== 'web.de') ||
                           (domain.includes('outlook') && domain !== 'outlook.com' && domain !== 'outlook.de');

            if (isTypo) {
                return { 
                    isValid: false, 
                    message: `Tippfehler in E-Mail-Domain erkannt. Meintest du @${common}?` 
                };
            }
        }
    }
    return { isValid: true };
}

function getLevenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

function formatAvailability(availability) {
    if (!availability) return "Keine Angabe";
    if (Array.isArray(availability)) {
        const mapping = {
            "Monday": "Mo", "Tuesday": "Di", "Wednesday": "Mi", 
            "Thursday": "Do", "Friday": "Fr", "Saturday": "Sa", "Sunday": "So"
        };
        const mapped = availability.map(d => mapping[d] || d);
        return `Verfügbar: ${mapped.slice(0, 4).join(', ')}${mapped.length > 4 ? '...' : ''}`;
    }
    if (typeof availability === 'object') {
        if (availability.monday || availability.tuesday || availability.friday || availability.saturday || availability.sunday) {
            const dayMap = {
                'monday': 'Mo', 'tuesday': 'Di', 'wednesday': 'Mi', 'thursday': 'Do',
                'friday': 'Fr', 'saturday': 'Sa', 'sunday': 'So'
            };
            const availableDays = [];
            Object.keys(dayMap).forEach(day => {
                if (availability[day] && availability[day].available) {
                    availableDays.push(dayMap[day]);
                }
            });
            if (availableDays.length === 0) return "Nicht verfügbar";
            return `Verfügbar: ${availableDays.join(', ')}`;
        }
        
        const { defaultState, modifiedDates } = availability;
        if (defaultState === 'all-selected') {
            if (!modifiedDates || modifiedDates.length === 0) {
                return "Verfügbar: Flexibel (Jederzeit)";
            }
            return "Verfügbar: Flexibel (außer einzelne Tage)";
        } else {
            if (!modifiedDates || modifiedDates.length === 0) {
                return "Verfügbar: Keine Termine";
            }
            const sortedDates = [...modifiedDates].sort((a, b) => new Date(a) - new Date(b));
            const formatted = sortedDates.slice(0, 2).map(d => {
                const parts = d.split('-');
                return `${parts[2]}.${parts[1]}.`;
            });
            return `Verfügbar: ${formatted.join(', ')}${sortedDates.length > 2 ? '...' : ''} (${sortedDates.length} Tage)`;
        }
    }
    return "Keine Angabe";
}

// Modal Controllers
function showModal(type, onSuccessCallback) {
    const modalWrapper = document.getElementById('modal-container');
    if (!modalWrapper) return;

    if (type === 'auth') {
        renderAuthModal(modalWrapper, onSuccessCallback);
    } else if (type === 'premium') {
        renderPremiumModal(modalWrapper, onSuccessCallback);
    } else if (type === 'verification') {
        renderVerificationModal(modalWrapper, onSuccessCallback);
    }
    
    modalWrapper.classList.remove('hidden');
    initAllLocationAutocompletes();
}

function closeModal() {
    const modalWrapper = document.getElementById('modal-container');
    if (modalWrapper) {
        modalWrapper.classList.add('hidden');
        modalWrapper.innerHTML = '';
    }
}

function renderAuthModal(wrapper, onSuccessCallback) {
    window.registrationMedia = {
        musician: {
            photos: ['https://picsum.photos/id/453/400/300'],
            videos: [{ title: 'Live Performance Highlights', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }],
            audios: []
        },
        organizer: {
            photos: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'],
            videos: [{ title: 'Live Performance Highlights', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }],
            audios: []
        }
    };
    wrapper.innerHTML = `
        <div class="modal-content">
            <div class="modal-header" style="flex-direction: column; padding: 1.5rem 2rem 1.2rem;">
                <h3 style="line-height: 1.2; text-align: center; margin: 0; font-family: var(--font-heading); width: 100%;">
                    <span style="display: block; font-size: 0.95rem; font-weight: 700; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.5px; color: #475569;">Anmelden/Registrieren</span>
                    <span style="display: block; font-size: 1.45rem; font-weight: 900; color: #000000; margin-top: 0.25rem; letter-spacing: 0.5px;">ohne Passwort</span>
                </h3>
                <button class="close-modal-btn" id="btn-close-modal">&times;</button>
            </div>
            
            <div class="auth-tabs">
                <button class="auth-tab-btn active" id="tab-magic-btn">Anmelden</button>
                <button class="auth-tab-btn" id="tab-register-btn">Registrieren</button>
            </div>

            <div class="modal-body">
                <div id="google-login-container" style="margin-bottom: 1.5rem;">
                    <button id="btn-google-login" class="btn" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.65rem; background: #ffffff !important; color: #1f2937 !important; border: 1px solid #d1d5db !important; font-weight: 700 !important; padding: 0.65rem !important; border-radius: 8px !important; cursor: pointer !important; transition: background 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;">
                        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
                            <path d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.7-1.57 2.69-3.88 2.69-6.57z" fill="#4285F4"/>
                            <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.24c-.8.54-1.83.86-3.06.86-2.35 0-4.35-1.59-5.06-3.73H.96v2.3C2.44 15.98 5.48 18 9 18z" fill="#34A853"/>
                            <path d="M3.94 10.71c-.18-.54-.28-1.12-.28-1.71s.1-1.17.28-1.71V4.99H.96A8.99 8.99 0 000 9c0 1.49.36 2.92.96 4.2l2.98-2.3a5.35 5.35 0 01-.29-1.19z" fill="#FBBC05"/>
                            <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.05C13.47.62 11.43 0 9 0 5.48 0 2.44 2.02.96 4.99l2.98 2.3C4.65 5.17 6.65 3.58 9 3.58z" fill="#EA4335"/>
                        </svg>
                        Mit Google anmelden
                    </button>
                    
                    <div style="display: flex; align-items: center; text-align: center; margin: 1rem 0 0.5rem; color: var(--text-muted); font-size: 0.8rem;">
                        <div style="flex: 1; height: 1px; background: rgba(255,255,255,0.15);"></div>
                        <span style="padding: 0 0.75rem; color: var(--text-muted); font-weight: 500;">oder</span>
                        <div style="flex: 1; height: 1px; background: rgba(255,255,255,0.15);"></div>
                    </div>
                </div>

                <form id="auth-magic-form">
                    <div class="form-group">
                        <label>E-Mail-Adresse</label>
                        <input type="email" name="email" class="input-field" placeholder="deine@mail.de" required>
                        <p style="font-size:0.7rem; color:var(--text-muted); margin-top: 0.3rem;">Gib deine E-Mail-Adresse ein, um einen Anmeldelink zu erhalten.</p>
                    </div>
                    <div id="magic-error-msg" class="text-red" style="font-size:0.8rem; margin-bottom: 1rem; display:none;"></div>
                    <div id="magic-success-container" style="display:none; margin-bottom: 1.5rem;"></div>
                    <button type="submit" class="btn btn-primary" id="btn-send-magic" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); border: none;">
                        Anmeldelink senden
                    </button>
                </form>

                <form id="auth-register-form" class="hidden">
                    <div class="role-picker-container" style="margin-bottom: 1.5rem;">
                        <div class="role-picker">
                            <div class="role-card active musician-role" id="role-picker-mus">
                                <i class="fa-solid fa-guitar"></i>
                                <h4>Musiker</h4>
                                <p>Ich suche Gigs</p>
                            </div>
                            <div class="role-card organizer-role" id="role-picker-org">
                                <i class="fa-solid fa-calendar-days"></i>
                                <h4>Veranstalter</h4>
                                <p>ich suche Acts</p>
                            </div>
                        </div>
                    </div>

                    <div id="reg-fields-musician">
                        
                        <div class="form-group">
                            <label>Musikername</label>
                            <input type="text" name="bandName" class="input-field" maxlength="50" required placeholder="Name des Acts">
                        </div>

                        <div class="form-group">
                            <label>Musiker-Typ</label>
                            <div class="checkbox-tag-grid" id="grid-musician-types">
                                ${['Sänger', 'Solokünstler', 'Duo', 'Trio', 'Band', 'Coverband', 'Big Band', 'Ensemble', 'Chor', 'Orchester', 'DJ', 'Alleinunterhalter', 'Showkünstler/Tänzer', 'Sonstige'].map(t => `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="musicianTypes" value="${t}">
                                        <span>${t}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Standort (Stadt)</label>
                            <input type="text" name="musLocation" id="input-mus-location-search" class="input-field" placeholder="z.B. München" autocomplete="off" style="width: 100%;">
                        </div>

                                                <div class="form-group">
                            <div class="slider-value-display">
                                <label>Maximaler Umkreis (km)</label>
                                <span id="val-radius">50 km</span>
                            </div>
                            <input type="range" name="radius" min="0" max="500" step="50" value="50" class="input-field" style="padding:0; height:auto; accent-color:#a855f7;">
                        </div>

                        <div class="form-group">
                            <label>Genres</label>
                            <div class="checkbox-tag-grid" id="grid-genres">
                                ${['Pop', 'Rock', 'Schlager', 'Funk', 'Charts', 'Evergreens', 'Dance', 'Elektronisch', 'Jazz', 'Latin', 'R&B', 'Soul', 'Hip Hop', 'Rap', 'Punk', 'Metal', 'Alternative', 'Indie', '60er', '70er', '80er', '90er', '2000er', '2010er', 'Afrobeat', 'Blues', 'Gospel', 'Country', 'Folk', 'K-Pop', 'Klassisch', 'Sonstige'].map(g => `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="genres" value="${g}">
                                        <span>${g}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Instrumente</label>
                            <div class="checkbox-tag-grid" id="grid-instruments">
                                ${['Akustik', 'Gesang', 'Gitarre', 'Klavier', 'Bass', 'Schlagzeug', 'Percussion', 'Saxophon', 'Trompete', 'Geige', 'Cello', 'Harfe', 'Sonstige'].map(ins => `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="instruments" value="${ins}">
                                        <span>${ins}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="slider-value-display">
                                                                <label>Spieldauer (Std.)</label>
                                <span id="val-spieldauer">0,5 - 2,0 Std.</span>
                            </div>
                            <div class="dual-range-slider" id="slider-spieldauer-container">
                                <div class="dual-range-track"></div>
                                <div class="dual-range-active-track" id="track-spieldauer"></div>
                                <input type="range" id="input-spieldauer-min" name="minDuration" min="0.5" max="10" step="0.5" value="0.5">
                                <input type="range" id="input-spieldauer-max" name="maxDuration" min="0.5" max="10" step="0.5" value="2.0">
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="slider-value-display">
                                <label>Gage (€)</label>
                                <span id="val-gage">0 - 5.000+ €</span>
                            </div>
                            <div class="dual-range-slider" id="slider-gage-container">
                                <div class="dual-range-track"></div>
                                <div class="dual-range-active-track" id="track-gage"></div>
                                <input type="range" id="input-gage-min" name="minBudget" min="0" max="5000" step="100" value="0">
                                <input type="range" id="input-gage-max" name="maxBudget" min="0" max="5000" step="100" value="5000">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Bevorzugte Event-Typen</label>
                            <div class="checkbox-tag-grid" id="grid-event-types">
                                ${['Geburtstag', 'Hochzeit – Trauung', 'Hochzeit - Sektempfang', 'Hochzeit – Party', 'Polterabend', 'Firmenfeier', 'Sommerfest', 'Öffentliches Event', 'Stadtfest', 'Kirmes', 'Karnevalsparty', 'Oktoberfest', 'Schützenfest', 'Vereinsfest', 'Sportveranstaltung', 'Jubiläum', 'Festival', 'Konzert', 'Bar/Kneipe/Club', 'Sonstige'].map(evt => `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="eventTypes" value="${evt}">
                                        <span>${evt}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Verfügbarkeiten</label>
                            <div class="availability-week-grid">
                                ${[
                                    { key: 'mo_do', label: 'Montag - Donnerstag', defActive: true, minTime: '18:00', maxTime: '23:59' },
                                    { key: 'fr', label: 'Freitag', defActive: true, minTime: '18:00', maxTime: '23:59' },
                                    { key: 'sa', label: 'Samstag', defActive: true, minTime: '00:01', maxTime: '23:59' },
                                    { key: 'so', label: 'Sonntag', defActive: true, minTime: '00:01', maxTime: '23:59' }
                                ].map(day => `
                                    <div class="availability-day-row" data-day="${day.key}">
                                        <div class="availability-day-info">
                                            <input type="checkbox" name="availDays" value="${day.key}" id="chk-avail-${day.key}" checked>
                                            <label for="chk-avail-${day.key}">${day.label}</label>
                                        </div>
                                        <div class="availability-day-times" id="times-container-${day.key}">
                                            <input type="time" name="availStart_${day.key}" value="${day.minTime}">
                                            <span>bis</span>
                                            <input type="time" name="availEnd_${day.key}" value="${day.maxTime}">
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="slider-value-display">
                                <label>Publikum (Anzahl)</label>
                                <span id="val-publikum">0 - 500+</span>
                            </div>
                            <div class="dual-range-slider" id="slider-publikum-container">
                                <div class="dual-range-track"></div>
                                <div class="dual-range-active-track" id="track-publikum"></div>
                                <input type="range" id="input-publikum-min" min="0" max="500" step="50" value="0">
                                <input type="range" id="input-publikum-max" min="0" max="500" step="50" value="500">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Technik</label>
                            <div class="checkbox-tag-grid" id="grid-technik">
                                ${['Technik vorhanden', 'Technik ist noch unklar', 'Technik nicht vorhanden'].map(t => `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="musTechnik" value="${t}">
                                        <span>${t}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>


                        <div class="form-group">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <label>Beschreibung</label>
                                <span id="desc-char-counter" style="font-size:0.75rem; color:var(--text-muted);">0 / 200</span>
                            </div>
                            <textarea name="musDescription" id="textarea-mus-desc" class="input-field" rows="3" maxlength="200" placeholder="Erzähle kurz etwas über dich/eure Band..." required></textarea>
                        </div>

                        <!-- Media Section -->
                        <div style="border-top:1px solid rgba(15,23,42,0.08); margin: 1.5rem 0; padding-top:1rem;"></div>
                        <h4 style="font-family: var(--font-heading); font-size:1.1rem; margin-bottom:0.3rem; color:var(--text-main);"><i class="fa-solid fa-photo-film"></i> Medien</h4>
                        <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.3;">
                            Füge Fotos, Videos und Hörproben (Audios) für dein Profil hinzu, um es attraktiver zu gestalten.
                        </p>
                        <div class="form-group" style="margin-bottom: 1.2rem;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                                <label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">Fotos (max. 5) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: JPG, JPEG, PNG, WebP&#10;Maximale Größe: 10 MB&#10;Auflösung: mind. 1200 x 1200 px"></i></label>
                                <button type="button" onclick="window.addRegMedia('musician', 'photo')" class="btn btn-sm btn-glass" style="margin:0; padding:0.2rem 0.6rem; font-size:0.7rem; border-color: rgba(124, 58, 237, 0.3); color:#7c3aed;">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                            <div id="reg-musician-photos-preview" style="display: flex; gap: 0.5rem; flex-wrap: wrap;"></div>
                        </div>
                        <div class="form-group" style="margin-bottom: 1.2rem;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                                <label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">Videos (max. 3) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: MP4, MOV, WebM&#10;Maximale Größe: 500 MB&#10;Maximale Länge: 5 Minuten&#10;Auflösung: 720p - 1080p"></i></label>
                                <button type="button" onclick="window.addRegMedia('musician', 'video')" class="btn btn-sm btn-glass" style="margin:0; padding:0.2rem 0.6rem; font-size:0.7rem; border-color: rgba(124, 58, 237, 0.3); color:#7c3aed;">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                            <div id="reg-musician-videos-preview" style="display: flex; gap: 0.5rem; flex-wrap: wrap;"></div>
                        </div>
                        <div class="form-group" style="margin-bottom: 1.2rem;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                                <label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">Hörproben (max. 3) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: MP3, WAV, M4A&#10;Maximale Größe: 100 MB&#10;Maximale Länge: 10 Minuten"></i></label>
                                <button type="button" onclick="window.addRegMedia('musician', 'audio')" class="btn btn-sm btn-glass" style="margin:0; padding:0.2rem 0.6rem; font-size:0.7rem; border-color: rgba(124, 58, 237, 0.3); color:#7c3aed;">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                            <div id="reg-musician-audios-preview" style="display: flex; gap: 0.5rem; flex-wrap: wrap;"></div>
                        </div>
                        <div style="background: rgba(124, 58, 237, 0.05); border: 1px solid rgba(124, 58, 237, 0.15); padding: 0.8rem; border-radius: 8px; font-size:0.75rem; color: var(--text-main); margin-top:0.5rem; margin-bottom: 1.5rem; display: flex; gap: 0.5rem; align-items: flex-start;">
                            <i class="fa-solid fa-circle-info" style="color: #7c3aed; margin-top: 2px;"></i>
                            <span>Fotos und Videos können auch zu einem späteren Zeitpunkt im Profil hinzugefügt und geändert werden.</span>
                        </div>
                    </div>

                    <div id="reg-fields-organizer" class="hidden">
                        
                        <div class="form-group">
                            <label>Eventname</label>
                            <input type="text" name="eventName" class="input-field" maxlength="50" placeholder="Name des Events">
                        </div>

                        <div class="form-group">
                            <label>Event-Typ</label>
                            <div class="checkbox-tag-grid" id="grid-org-event-types">
                                ${['Geburtstag', 'Hochzeit – Trauung', 'Hochzeit - Sektempfang', 'Hochzeit – Party', 'Polterabend', 'Firmenfeier', 'Sommerfest', 'Öffentliches Event', 'Stadtfest', 'Kirmes', 'Karnevalsparty', 'Oktoberfest', 'Schützenfest', 'Vereinsfest', 'Sportveranstaltung', 'Jubiläum', 'Festival', 'Konzert', 'Bar/Kneipe/Club', 'Sonstige'].map(t => `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="orgEventTypes" value="${t}">
                                        <span>${t}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Gesuchte Musiker-Typen (Mehrfachauswahl)</label>
                            <div class="checkbox-tag-grid" id="grid-org-musician-types">
                                ${['Sänger', 'Solokünstler', 'Duo', 'Trio', 'Band', 'Coverband', 'Big Band', 'Ensemble', 'Chor', 'Orchester', 'DJ', 'Alleinunterhalter', 'Showkünstler/Tänzer', 'Sonstige'].map(t => `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="orgMusicianTypes" value="${t}">
                                        <span>${t}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Datum</label>
                            <p style="font-size:0.7rem; color:var(--text-muted); margin-bottom: 0.5rem; line-height: 1.3;">
                                An welchem Tag bzw. an welchen Tagen findet dein Event statt?
                            </p>
                            <div class="organizer-calendar-widget" id="org-calendar-widget">
                                <div class="org-calendar-header">
                                    <button type="button" class="btn-cal-nav" id="btn-cal-prev"><i class="fa-solid fa-chevron-left"></i></button>
                                    <span id="org-calendar-month-year">Juli 2026</span>
                                    <button type="button" class="btn-cal-nav" id="btn-cal-next"><i class="fa-solid fa-chevron-right"></i></button>
                                </div>
                                <div class="org-calendar-weekdays">
                                    <div>Mo</div><div>Di</div><div>Mi</div><div>Do</div><div>Fr</div><div>Sa</div><div>So</div>
                                </div>
                                <div class="org-calendar-days" id="org-calendar-days-grid"></div>
                            </div>
                            <input type="hidden" name="eventDates" id="input-event-dates" value="">
                            <div id="org-selected-dates-preview" style="font-size:0.75rem; color:#3b82f6; margin-top:0.5rem; font-weight:600;">
                                Keine Termine ausgewählt
                            </div>
                        </div>

                                                <div class="form-group">
                            <label>Standard-Uhrzeit</label>
                            <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.5rem;">
                                <div style="width: 120px; flex-shrink: 0;">
                                     <span style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:0.3rem;">Startzeit</span>
                                     <input type="time" name="eventStartTime" class="input-field" value="18:00" style="margin: 0; width: 120px; height:42px;">
                                 </div>
                                 <div style="width: 120px; flex-shrink: 0;">
                                     <span style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:0.3rem;">Endzeit</span>
                                     <input type="time" name="eventEndTime" class="input-field" value="22:00" style="margin: 0; width: 120px; height:42px;">
                                 </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Veranstaltungsort (Stadt)</label>
                            <input type="text" name="orgLocation" id="input-org-location-search" class="input-field" placeholder="z.B. München" autocomplete="off" style="width: 100%;">
                        </div>

                        <div class="form-group">
                            <label>Genres</label>
                            <div class="checkbox-tag-grid" id="grid-org-genres">
                                ${['Pop', 'Rock', 'Schlager', 'Funk', 'Charts', 'Evergreens', 'Dance', 'Elektronisch', 'Jazz', 'Latin', 'R&B', 'Soul', 'Hip Hop', 'Rap', 'Punk', 'Metal', 'Alternative', 'Indie', '60er', '70er', '80er', '90er', '2000er', '2010er', 'Afrobeat', 'Blues', 'Gospel', 'Country', 'Folk', 'K-Pop', 'Klassisch', 'Sonstige'].map(g => `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="orgGenres" value="${g}">
                                        <span>${g}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Instrumente</label>
                            <div class="checkbox-tag-grid" id="grid-org-instruments">
                                ${['Akustik', 'Gesang', 'Gitarre', 'Klavier', 'Bass', 'Schlagzeug', 'Percussion', 'Saxophon', 'Trompete', 'Geige', 'Cello', 'Harfe', 'Sonstige'].map(ins => `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="orgInstruments" value="${ins}">
                                        <span>${ins}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <div class="form-group" style="margin-top: 1rem;">
                            <div class="slider-value-display">
                                <label>Spieldauer (Std.)</label>
                                <span id="val-org-spieldauer">0,5 - 2,0 Std.</span>
                            </div>
                            <div class="dual-range-slider" id="slider-org-spieldauer-container">
                                <div class="dual-range-track"></div>
                                <div class="dual-range-active-track" id="track-org-spieldauer"></div>
                                <input type="range" id="input-org-spieldauer-min" name="orgMinDuration" min="0.5" max="10" step="0.5" value="0.5">
                                <input type="range" id="input-org-spieldauer-max" name="orgMaxDuration" min="0.5" max="10" step="0.5" value="2.0">
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="slider-value-display">
                                <label>Gäste (Anzahl)</label>
                                <span id="val-org-publikum">0 - 500+</span>
                            </div>
                            <div class="dual-range-slider" id="slider-org-publikum-container">
                                <div class="dual-range-track"></div>
                                <div class="dual-range-active-track" id="track-org-publikum"></div>
                                <input type="range" id="input-org-publikum-min" name="orgMinPublikum" min="0" max="500" step="50" value="0">
                                <input type="range" id="input-org-publikum-max" name="orgMaxPublikum" min="0" max="500" step="50" value="500">
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="slider-value-display">
                                <label>Budget (€)</label>
                                <span id="val-org-gage">0 - 5.000+ €</span>
                            </div>
                            <div class="dual-range-slider" id="slider-org-gage-container">
                                <div class="dual-range-track"></div>
                                <div class="dual-range-active-track" id="track-org-gage"></div>
                                <input type="range" id="input-org-gage-min" name="orgMinBudget" min="0" max="5000" step="100" value="0">
                                <input type="range" id="input-org-gage-max" name="orgMaxBudget" min="0" max="5000" step="100" value="5000">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Technik</label>
                            <div class="checkbox-tag-grid" id="grid-org-technik">
                                ${['Technik vorhanden', 'Technik ist noch unklar', 'Technik nicht vorhanden'].map(t => `
                                    <label class="tag-pill-checkbox">
                                        <input type="checkbox" name="orgTechnik" value="${t}">
                                        <span>${t}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <div class="form-group">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <label>Beschreibung</label>
                                <span id="org-desc-char-counter" style="font-size:0.75rem; color:var(--text-muted);">0 / 200</span>
                            </div>
                            <textarea name="orgDescription" id="textarea-org-desc" class="input-field" rows="3" maxlength="200" placeholder="Beschreibe kurz dein Event..." required></textarea>
                        </div>

                        <!-- Media Section -->
                        <div style="border-top:1px solid rgba(15,23,42,0.08); margin: 1.5rem 0; padding-top:1rem;"></div>
                        <h4 style="font-family: var(--font-heading); font-size:1.1rem; margin-bottom:0.3rem; color:var(--text-main);"><i class="fa-solid fa-photo-film"></i> Medien</h4>
                        <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.3;">
                            Füge Fotos und Videos für dein Event hinzu, um es attraktiver zu gestalten.
                        </p>
                        <div class="form-group" style="margin-bottom: 1.2rem;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                                <label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">Fotos (max. 5) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: JPG, JPEG, PNG, WebP&#10;Maximale Größe: 10 MB&#10;Auflösung: mind. 1200 x 1200 px"></i></label>
                                <button type="button" onclick="window.addRegMedia('organizer', 'photo')" class="btn btn-sm btn-glass" style="margin:0; padding:0.2rem 0.6rem; font-size:0.7rem; border-color: rgba(37, 99, 235, 0.3); color:#2563eb;">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                            <div id="reg-organizer-photos-preview" style="display: flex; gap: 0.5rem; flex-wrap: wrap;"></div>
                        </div>
                        <div class="form-group" style="margin-bottom: 1.2rem;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                                <label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">Videos (max. 3) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: MP4, MOV, WebM&#10;Maximale Größe: 500 MB&#10;Maximale Länge: 5 Minuten&#10;Auflösung: 720p - 1080p"></i></label>
                                <button type="button" onclick="window.addRegMedia('organizer', 'video')" class="btn btn-sm btn-glass" style="margin:0; padding:0.2rem 0.6rem; font-size:0.7rem; border-color: rgba(37, 99, 235, 0.3); color:#2563eb;">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                            <div id="reg-organizer-videos-preview" style="display: flex; gap: 0.5rem; flex-wrap: wrap;"></div>
                        </div>
                        <div style="background: rgba(37, 99, 235, 0.05); border: 1px solid rgba(37, 99, 235, 0.15); padding: 0.8rem; border-radius: 8px; font-size:0.75rem; color: var(--text-main); margin-top:0.5rem; margin-bottom: 1.5rem; display: flex; gap: 0.5rem; align-items: flex-start;">
                            <i class="fa-solid fa-circle-info" style="color: #2563eb; margin-top: 2px;"></i>
                            <span>Fotos und Videos können auch zu einem späteren Zeitpunkt im Profil hinzugefügt und geändert werden.</span>
                        </div>
                    </div>

                    <!-- Personal details at the end -->
                    <div style="border-top:1px solid rgba(15,23,42,0.08); margin: 1.5rem 0; padding-top:1rem;"></div>
                    <h4 style="font-family: var(--font-heading); font-size:1rem; margin-bottom:1rem; color:var(--text-main);"><i class="fa-solid fa-user-lock"></i> Persönliche Kontaktdaten</h4>

                    <div class="form-group hidden" id="reg-organizer-type-container">
                        <label>Veranstalter-Typ</label>
                        <select name="organizerType" id="reg-org-type-select" class="input-field" style="width: 100%; box-sizing: border-box; padding: 0.55rem; border-radius: 8px; border: 1px solid #cbd5e1; background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                            <option value="" disabled selected>Veranstalter-Typ auswählen</option>
                            <option value="Privater Veranstalter">Privater Veranstalter</option>
                            <option value="Event-Agentur">Event-Agentur</option>
                            <option value="Hochzeitsplaner">Hochzeitsplaner</option>
                            <option value="Eventlocation">Eventlocation</option>
                            <option value="Firma">Firma</option>
                            <option value="Hotel">Hotel</option>
                            <option value="Restaurant">Restaurant</option>
                            <option value="Bar">Bar</option>
                            <option value="Stadtmarketing">Stadtmarketing</option>
                            <option value="Festivalveranstalter">Festivalveranstalter</option>
                            <option value="Verein">Verein</option>
                            <option value="Sonstige">Sonstige</option>
                        </select>
                    </div>

                    <!-- Dynamic field for non-private organizers -->
                    <div class="form-group hidden" id="reg-org-company-dynamic-container" style="margin-top: 1rem;">
                        <label id="reg-org-company-dynamic-label">Name Organisation</label>
                        <input type="text" name="company" id="reg-org-company-input" class="input-field" maxlength="50" placeholder="Name eingeben">
                    </div>

                    <div class="form-group">
                        <label>Vor- und Nachname</label>
                        <input type="text" name="fullName" id="input-reg-fullname" class="input-field" maxlength="50" placeholder="z.B. Max Mustermann" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>E-Mail-Adresse</label>
                            <input type="email" name="email" class="input-field" maxlength="80" placeholder="z.B. max.mustermann@gmail.com" required>
                        </div>
                        <div class="form-group">
                            <label>Telefonnummer</label>
                            <input type="text" name="phone" id="input-reg-phone" class="input-field" maxlength="20" placeholder="z.B. 01761234567" required>
                            <div style="display: flex; align-items: center; gap: 0.4rem; margin-top: 0.4rem;">
                                <input type="checkbox" name="hidePhone" id="input-reg-hidephone" style="width: auto; margin: 0; cursor: pointer;">
                                <label for="input-reg-hidephone" style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted); cursor: pointer; margin: 0;">Telefonnummer verbergen</label>
                            </div>
                        </div>
                    </div>

                    <div id="reg-subscription-container" style="margin-top: 1.5rem;">
                        <h4 style="font-family: var(--font-heading); font-size:1rem; margin-bottom:0.5rem; color:var(--color-purple);"><i class="fa-solid fa-credit-card"></i> Abo-Modell auswählen</h4>
                        <div class="subscription-cards">
                            <div class="subscription-card active" data-plan="flex" data-price="9.99">
                                <div class="selected-badge">Beliebt</div>
                                <h5>Flex</h5>
                                <div class="price">9,99 € <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
                                <div class="subscription-gift-box">
                                    <i class="fa-solid fa-gift"></i>
                                    <div class="gift-title">1 Monat kostenlos</div>
                                </div>
                                <ul class="plan-features">
                                    <li><i class="fa-solid fa-circle-check"></i> Kontakt zu ALLEN Veranstaltern</li>
                                    <li><i class="fa-solid fa-circle-check"></i> 1 Monat Vertragslaufzeit</li>
                                    <li><i class="fa-solid fa-circle-check"></i> <span>Jederzeit kündbar<br>(auch in der Testphase)</span></li>
                                </ul>
                                <div style="display: flex; justify-content: center; margin-top: 0.8rem; width: 100%;">
                                    <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">Ausgewählt</button>
                                </div>
                            </div>
                            <div class="subscription-card" data-plan="plus" data-price="7.99">
                                <div class="selected-badge">Spare 20 %</div>
                                <h5>Plus</h5>
                                <div class="price">7,99 € <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
                                <div class="subscription-gift-box">
                                    <i class="fa-solid fa-gift"></i>
                                    <div class="gift-title">1 Monat kostenlos</div>
                                </div>
                                <ul class="plan-features">
                                    <li><i class="fa-solid fa-circle-check"></i> Kontakt zu ALLEN Veranstaltern</li>
                                    <li><i class="fa-solid fa-circle-check"></i> 6 Monate Vertragslaufzeit</li>
                                    <li><i class="fa-solid fa-circle-check"></i> <span>Jederzeit kündbar<br>(auch in der Testphase)</span></li>
                                </ul>
                                <div style="display: flex; justify-content: center; margin-top: 0.8rem; width: 100%;">
                                    <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">Auswählen</button>
                                </div>
                            </div>
                            <div class="subscription-card" data-plan="pro" data-price="5.99">
                                <div class="selected-badge">Spare 40 %</div>
                                <h5>Pro</h5>
                                <div class="price">5,99 € <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
                                <div class="subscription-gift-box">
                                    <i class="fa-solid fa-gift"></i>
                                    <div class="gift-title">1 Monat kostenlos</div>
                                </div>
                                <ul class="plan-features">
                                    <li><i class="fa-solid fa-circle-check"></i> Kontakt zu ALLEN Veranstaltern</li>
                                    <li><i class="fa-solid fa-circle-check"></i> 12 Monate Vertragslaufzeit</li>
                                    <li><i class="fa-solid fa-circle-check"></i> <span>Jederzeit kündbar<br>(auch in der Testphase)</span></li>
                                </ul>
                                <div style="display: flex; justify-content: center; margin-top: 0.8rem; width: 100%;">
                                    <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">Auswählen</button>
                                </div>
                            </div>
                            <div class="subscription-card" data-plan="premium" data-price="4.99">
                                <div class="selected-badge" style="background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%) !important;">Spare 59 %</div>
                                <h5>Premium</h5>
                                <div class="price">4,99 € <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
                                <div class="subscription-gift-box">
                                    <i class="fa-solid fa-gift"></i>
                                    <div class="gift-title">3 Monate kostenlos</div>
                                </div>
                                <ul class="plan-features">
                                    <li><i class="fa-solid fa-circle-check"></i> Kontakt zu ALLEN Veranstaltern</li>
                                    <li><i class="fa-solid fa-circle-check"></i> 12 Monate Vertragslaufzeit</li>
                                    <li><i class="fa-solid fa-circle-check"></i> <span>Jederzeit kündbar<br>(auch in der Testphase)</span></li>
                                    <li><i class="fa-solid fa-circle-info"></i> Code erforderlich</li>
                                </ul>
                                <div style="display: flex; justify-content: center; margin-top: 0.8rem; width: 100%;">
                                    <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">Auswählen</button>
                                </div>
                            </div>
                        </div>
                        <input type="hidden" name="selectedPlan" id="input-selected-plan" value="flex">
                        
                        <div id="premium-promo-container" style="display: none; margin-top: 1.5rem; background: rgba(124, 58, 237, 0.05); border: 1px dashed var(--color-purple); padding: 1rem; border-radius: var(--radius-md);">
                            <h5 style="margin: 0 0 0.5rem; font-size: 0.85rem; font-weight: 700; color: var(--color-purple);"><i class="fa-brands fa-instagram"></i> Premium-Zugang freischalten</h5>
                            <p style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.8rem; line-height: 1.35;">
                                Gib deinen exklusiven Gutscheincode ein. Du erhältst ihn, wenn du <strong>@GigConnAct</strong> auf Instagram folgst und unseren aktuellen Story-Beitrag teilst und uns markierst.
                            </p>
                            <div style="display: flex; gap: 0.5rem;">
                                <input type="text" id="reg-promo-code" class="input-field" placeholder="Gutscheincode" style="margin:0; text-transform: uppercase;">
                                <button type="button" class="btn btn-secondary btn-sm" id="btn-apply-promo" style="margin:0; font-size:0.75rem; white-space:nowrap; background:var(--color-purple); border-color:var(--color-purple);">Code prüfen</button>
                            </div>
                            <div id="promo-status-msg" style="font-size: 0.7rem; margin-top: 0.4rem; display: none;"></div>
                            
                            <!-- Stripe-Verbindung (wird eingeblendet bei richtigem Code) -->
                            <div id="reg-stripe-connect-container" style="display: none; margin-top: 1rem; padding: 1rem; background: rgba(37, 99, 235, 0.05); border: 1px solid #2563eb; border-radius: var(--radius-md); text-align: left;">
                                <h6 style="margin: 0 0 0.5rem; font-size: 0.85rem; font-weight: 700; color: #2563eb; display: flex; align-items: center; gap: 0.4rem;"><i class="fa-brands fa-stripe" style="font-size: 1.2rem;"></i> Stripe Verbindung</h6>
                                <p style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.8rem; line-height: 1.35;">
                                    Dein Gutscheincode ist gültig! Verbinde jetzt dein Konto mit Stripe, um die Premium-Buchung abzuschließen. Die Stripe-Schnittstelle wird nächste Woche aktiviert.
                                </p>
                                <button type="button" class="btn btn-primary btn-sm" style="background: #2563eb; border-color: #2563eb; display: flex; align-items: center; gap: 0.5rem; width: 100%; justify-content: center; cursor: not-allowed; opacity: 0.75;" disabled>
                                    <i class="fa-brands fa-stripe"></i> Mit Stripe verbinden (Ab nächste Woche)
                                </button>
                            </div>
                        </div>
                    </div>

                    <div id="reg-sepa-consent-container" style="margin-top: 1.5rem;">
                        <div class="sepa-panel">
                            <h5><i class="fa-solid fa-circle-info"></i> SEPA Lastschrift-Mandat</h5>
                            <p id="sepa-mandate-text">Ich ermächtige GigConnAct, Zahlungen für das Musiker-Abonnement (9,99 € pro Monat) von meinem Bankkonto mittels Lastschrift einzuziehen. Zugleich weise ich mein Kreditinstitut an, die von GigConnAct auf mein Konto gezogenen Lastschriften einzulösen.</p>
                        </div>
                        <label class="form-checkbox" style="margin-bottom: 1.5rem;">
                            <input type="checkbox" name="sepaConsent" required checked>
                            <span id="sepa-checkbox-label">Ich stimme dem SEPA-Lastschriftmandat für das 9,99 € Abo zu.</span>
                        </label>
                    </div>

                    <div id="reg-privacy-consent-container" style="margin-top: 1.2rem; margin-bottom: 1.2rem;">
                        <label class="form-checkbox" style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.8rem; line-height: 1.4; color: var(--text-muted); cursor: pointer;">
                            <input type="checkbox" name="privacyConsent" required style="width: auto; margin-top: 0.2rem; cursor: pointer; transform: scale(1.2);">
                            <span>Ich habe die <a href="#/datenschutz" target="_blank" style="color: var(--color-purple); text-decoration: underline;">Datenschutzerklärung</a> gelesen und willige in die Verarbeitung meiner personenbezogenen Daten zum Zweck der Partnervermittlung ein.</span>
                        </label>
                    </div>

                    <div id="register-error-msg" class="text-red" style="font-size:0.8rem; margin-bottom: 1rem; display:none;"></div>
                    <button type="submit" class="btn btn-secondary" style="width: 100%;">
                        Registrierung abschließen
                    </button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('btn-close-modal').addEventListener('click', closeModal);

    // Full name input filter to allow only letters, spaces, and hyphens
    const nameInput = document.getElementById('input-reg-fullname');
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^a-zA-ZäöüÄÖÜß\s\-]/g, '');
        });
    }

    const magicTab = document.getElementById('tab-magic-btn');
    const registerTab = document.getElementById('tab-register-btn');
    const magicForm = document.getElementById('auth-magic-form');
    const registerForm = document.getElementById('auth-register-form');

    function setActiveTab(activeBtn) {
        [magicTab, registerTab].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        if (activeBtn) activeBtn.classList.add('active');
    }

    function showForm(activeForm) {
        [magicForm, registerForm].forEach(f => {
            if (f) f.classList.add('hidden');
        });
        if (activeForm) activeForm.classList.remove('hidden');

        const googleContainer = document.getElementById('google-login-container');
        if (googleContainer) {
            if (activeForm === magicForm) {
                googleContainer.style.display = 'block';
            } else {
                googleContainer.style.display = 'none';
            }
        }
    }

    if (magicTab) {
        magicTab.addEventListener('click', () => {
            setActiveTab(magicTab);
            showForm(magicForm);
            window.googleRegistrationUser = null;
            if (registerForm && registerForm.elements.email) {
                registerForm.elements.email.value = '';
                registerForm.elements.email.disabled = false;
                registerForm.elements.email.style.background = '';
                registerForm.elements.email.style.cursor = '';
            }
            if (registerForm && registerForm.elements.fullName) {
                registerForm.elements.fullName.value = '';
            }
            document.getElementById('magic-success-container').style.display = 'none';
            document.getElementById('magic-success-container').innerHTML = '';
            document.getElementById('magic-error-msg').style.display = 'none';
            document.getElementById('btn-send-magic').style.display = 'flex';
            if (magicForm.elements.email) {
                magicForm.elements.email.style.display = 'block';
                magicForm.elements.email.value = '';
            }
            const grp = magicForm.querySelector('.form-group');
            if (grp) {
                const lbl = grp.querySelector('label');
                const para = grp.querySelector('p');
                if (lbl) lbl.style.display = 'block';
                if (para) para.style.display = 'block';
            }
            const btn = document.getElementById('btn-send-magic');
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = `Anmeldelink senden`;
            }
        });
    }

    if (registerTab) {
        registerTab.addEventListener('click', () => {
            setActiveTab(registerTab);
            showForm(registerForm);
            window.registrationMedia = {
                musician: {
                    photos: ['https://picsum.photos/id/453/400/300'],
                    videos: [{ title: 'Live Performance Highlights', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }],
                    audios: []
                },
                organizer: {
                    photos: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'],
                    videos: [{ title: 'Live Performance Highlights', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }],
                    audios: []
                }
            };
            window.updateRegMediaPreview('musician');
            window.updateRegMediaPreview('organizer');
        });
    }

    if (magicForm) {
        magicForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = magicForm.elements.email.value.trim();
            const btn = document.getElementById('btn-send-magic');
            const errDiv = document.getElementById('magic-error-msg');
            const successContainer = document.getElementById('magic-success-container');

            if (errDiv) errDiv.style.display = 'none';
            
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Anmeldelink wird generiert...`;
            }

            // Trigger the real Firebase auth email sending
            const res = await state.loginPasswordless(email);
            
            if (btn) btn.style.display = 'none';
            if (magicForm.elements.email) magicForm.elements.email.style.display = 'none';
            const grp = magicForm.querySelector('.form-group');
            if (grp) {
                const lbl = grp.querySelector('label');
                const para = grp.querySelector('p');
                if (lbl) lbl.style.display = 'none';
                if (para) para.style.display = 'none';
            }

            if (!res.success) {
                if (btn) {
                    btn.disabled = false;
                    btn.style.display = 'flex';
                    btn.innerHTML = `<i class="fa-solid fa-magic"></i> Magic Link anfordern`;
                }
                if (magicForm.elements.email) magicForm.elements.email.style.display = 'block';
                if (errDiv) {
                    errDiv.innerText = res.message || "Fehler beim Senden des Links.";
                    errDiv.style.display = 'block';
                }
                return;
            }

            if (successContainer) {
                successContainer.innerHTML = `
                    <div style="text-align: center; color: var(--color-green); font-size: 1.8rem; margin-bottom: 0.5rem;">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <h4 style="text-align: center; margin: 0 0 0.5rem; font-family: var(--font-heading); color: var(--text-main);">Anmeldelink gesendet!</h4>
                    <p style="text-align: center; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.4;">
                        Wir haben einen sicheren Link an <strong>${email}</strong> gesendet.<br><br>
                        Bitte überprüfe dein E-Mail-Postfach (und deinen Spam-Ordner) und klicke auf den Bestätigungslink in der E-Mail, um dich anzumelden.
                    </p>
                `;
                successContainer.style.display = 'block';
            }
        });
    }


    const pickerMus = document.getElementById('role-picker-mus');
    const pickerOrg = document.getElementById('role-picker-org');
    const fieldsMus = document.getElementById('reg-fields-musician');
    const fieldsOrg = document.getElementById('reg-fields-organizer');
    let selectedRole = 'musician';

    // State arrays for organizer dates
    let selectedEventDates = [];

    // Default class on form
    if (registerForm) {
        registerForm.classList.add('role-musician-active');
        registerForm.classList.remove('role-organizer-active');
    }

    pickerMus.addEventListener('click', () => {
        selectedRole = 'musician';
        pickerMus.classList.add('active');
        pickerOrg.classList.remove('active');
        fieldsMus.classList.remove('hidden');
        fieldsOrg.classList.add('hidden');
        
        if (registerForm) {
            registerForm.classList.add('role-musician-active');
            registerForm.classList.remove('role-organizer-active');
        }

        const subContainer = document.getElementById('reg-subscription-container');
        if (subContainer) subContainer.classList.remove('hidden');
        
        const sepaContainer = document.getElementById('reg-sepa-consent-container');
        if (sepaContainer) {
            sepaContainer.classList.remove('hidden');
            const consentChk = sepaContainer.querySelector('input[name="sepaConsent"]');
            if (consentChk) consentChk.setAttribute('required', '');
        }

        const orgTypeContainer = document.getElementById('reg-organizer-type-container');
        if (orgTypeContainer) {
            orgTypeContainer.classList.add('hidden');
            const selectEl = orgTypeContainer.querySelector('select');
            if (selectEl) {
                selectEl.removeAttribute('required');
                selectEl.value = '';
            }
        }
        const dynamicContainer = document.getElementById('reg-org-company-dynamic-container');
        if (dynamicContainer) {
            dynamicContainer.classList.add('hidden');
            const dynamicInput = document.getElementById('reg-org-company-input');
            if (dynamicInput) {
                dynamicInput.value = '';
                dynamicInput.removeAttribute('required');
            }
        }
        
        toggleRequired(fieldsMus, true);
        toggleRequired(fieldsOrg, false);
    });

    pickerOrg.addEventListener('click', () => {
        selectedRole = 'organizer';
        pickerOrg.classList.add('active');
        pickerMus.classList.remove('active');
        fieldsOrg.classList.remove('hidden');
        fieldsMus.classList.add('hidden');
        
        if (registerForm) {
            registerForm.classList.add('role-organizer-active');
            registerForm.classList.remove('role-musician-active');
        }

        const subContainer = document.getElementById('reg-subscription-container');
        if (subContainer) subContainer.classList.add('hidden');
        
        const sepaContainer = document.getElementById('reg-sepa-consent-container');
        if (sepaContainer) {
            sepaContainer.classList.add('hidden');
            const consentChk = sepaContainer.querySelector('input[name="sepaConsent"]');
            if (consentChk) consentChk.removeAttribute('required');
        }

        const orgTypeContainer = document.getElementById('reg-organizer-type-container');
        if (orgTypeContainer) {
            orgTypeContainer.classList.remove('hidden');
            const selectEl = orgTypeContainer.querySelector('select');
            if (selectEl) selectEl.setAttribute('required', '');
        }
        
        toggleRequired(fieldsOrg, true);
        toggleRequired(fieldsMus, false);

        // Render widgets on active state
        renderOrganizerCalendar();
    });

    function toggleRequired(container, isRequired) {
        container.querySelectorAll('input, select, textarea').forEach(el => {
            if (isRequired) {
                if (el.type !== 'checkbox' && el.type !== 'hidden' && el.name !== 'musLocation' && el.name !== 'orgLocationSearch' && el.id !== 'input-org-location-search') {
                    if (el.id === 'reg-org-company-input') {
                        const dynamicContainer = document.getElementById('reg-org-company-dynamic-container');
                        if (dynamicContainer && !dynamicContainer.classList.contains('hidden')) {
                            el.setAttribute('required', '');
                        } else {
                            el.removeAttribute('required');
                        }
                    } else {
                        el.setAttribute('required', '');
                    }
                } else if (el.name === 'sepaConsent') {
                    el.setAttribute('required', '');
                }
            } else {
                el.removeAttribute('required');
            }
        });
    }

    // Add change listener for dynamically opening the organizer company name field
    const regOrgTypeSelect = document.getElementById('reg-org-type-select');
    const dynamicContainer = document.getElementById('reg-org-company-dynamic-container');
    const dynamicLabel = document.getElementById('reg-org-company-dynamic-label');
    const dynamicInput = document.getElementById('reg-org-company-input');

    if (regOrgTypeSelect && dynamicContainer && dynamicLabel && dynamicInput) {
        regOrgTypeSelect.addEventListener('change', () => {
            const val = regOrgTypeSelect.value;
            if (val && val !== 'Privater Veranstalter') {
                dynamicContainer.classList.remove('hidden');
                dynamicLabel.textContent = `Name ${val}`;
                dynamicInput.setAttribute('placeholder', `Name ${val} eingeben`);
                dynamicInput.setAttribute('required', '');
            } else {
                dynamicContainer.classList.add('hidden');
                dynamicInput.value = '';
                dynamicInput.removeAttribute('required');
            }
        });
    }
    // Init checkable tag pill checkboxes active toggler
    document.querySelectorAll('.tag-pill-checkbox input').forEach(input => {
        if (input.checked) {
            input.parentElement.classList.add('active');
        }
        input.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                e.target.parentElement.classList.toggle('active', e.target.checked);
            }
        });
    });

    // Distance Radius Slider
    const radiusInput = registerForm.querySelector('input[name="radius"]');
    if (radiusInput) {
        radiusInput.addEventListener('input', (e) => {
            const display = document.getElementById('val-radius');
            if (display) display.textContent = `${e.target.value} km`;
        });
    }

    // Dual Range Sliders Setup
    function initDualSlider(containerId, minInputId, maxInputId, trackId, displayId, unit, isPrice) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const minInput = document.getElementById(minInputId);
        const maxInput = document.getElementById(maxInputId);
        const track = document.getElementById(trackId);
        const display = document.getElementById(displayId);

        function updateSlider() {
            let minVal = parseFloat(minInput.value);
            let maxVal = parseFloat(maxInput.value);

            if (minVal > maxVal) {
                const temp = minVal;
                minVal = maxVal;
                maxVal = temp;
            }

            const percentMin = ((minVal - minInput.min) / (minInput.max - minInput.min)) * 100;
            const percentMax = ((maxVal - maxInput.min) / (maxInput.max - maxInput.min)) * 100;

            track.style.left = percentMin + '%';
            track.style.width = (percentMax - percentMin) + '%';

            if (isPrice) {
                if (maxVal >= 5000) {
                    display.textContent = `${minVal.toLocaleString('de-DE')} - 5.000+`;
                } else {
                    display.textContent = `${minVal.toLocaleString('de-DE')} - ${maxVal.toLocaleString('de-DE')}`;
                }
            } else if (unit === 'Std.') {
                display.textContent = `${minVal.toFixed(1).replace('.', ',')} - ${maxVal.toFixed(1).replace('.', ',')}`;
            } else if (unit === 'Personen') {
                if (maxVal >= 500) {
                    display.textContent = `${minVal} - 500+`;
                } else {
                    display.textContent = `${minVal} - ${maxVal}`;
                }
            } else {
                display.textContent = `${minVal} - ${maxVal} ${unit}`;
            }
        }

        minInput.addEventListener('input', updateSlider);
        maxInput.addEventListener('input', updateSlider);
        updateSlider();
    }

    initDualSlider('slider-spieldauer-container', 'input-spieldauer-min', 'input-spieldauer-max', 'track-spieldauer', 'val-spieldauer', 'Std.', false);
    initDualSlider('slider-gage-container', 'input-gage-min', 'input-gage-max', 'track-gage', 'val-gage', '€', true);
    initDualSlider('slider-publikum-container', 'input-publikum-min', 'input-publikum-max', 'track-publikum', 'val-publikum', 'Personen', false);

    // Initialize Organizer Dual Sliders
    initDualSlider('slider-org-spieldauer-container', 'input-org-spieldauer-min', 'input-org-spieldauer-max', 'track-org-spieldauer', 'val-org-spieldauer', 'Std.', false);
    initDualSlider('slider-org-publikum-container', 'input-org-publikum-min', 'input-org-publikum-max', 'track-org-publikum', 'val-org-publikum', 'Personen', false);
    initDualSlider('slider-org-gage-container', 'input-org-gage-min', 'input-org-gage-max', 'track-org-gage', 'val-org-gage', '€', true);

    // Organizer description char-counter logic
    const orgDescTextarea = document.getElementById('textarea-org-desc');
    const orgDescCounter = document.getElementById('org-desc-char-counter');
    if (orgDescTextarea && orgDescCounter) {
        orgDescTextarea.addEventListener('input', (e) => {
            const len = e.target.value.length;
            orgDescCounter.textContent = `${len} / 200`;
            if (len >= 200) {
                orgDescCounter.style.color = 'var(--color-red)';
            } else {
                orgDescCounter.style.color = 'var(--text-muted)';
            }
        });
    }

    // Organizer Calendar Widget Logic
    const calendarMonthYear = document.getElementById('org-calendar-month-year');
    const calendarDaysGrid = document.getElementById('org-calendar-days-grid');
    const calendarPrevBtn = document.getElementById('btn-cal-prev');
    const calendarNextBtn = document.getElementById('btn-cal-next');
    const inputEventDates = document.getElementById('input-event-dates');
    const selectedDatesPreview = document.getElementById('org-selected-dates-preview');

    let currentCalDate = new Date(2026, 6, 1); // July 2026 as standard start for this application

    function renderOrganizerCalendar() {
        if (!calendarDaysGrid || !calendarMonthYear) return;

        const year = currentCalDate.getFullYear();
        const month = currentCalDate.getMonth();

        const monthNames = [
            "Januar", "Februar", "März", "April", "Mai", "Juni",
            "Juli", "August", "September", "Oktober", "November", "Dezember"
        ];
        calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

        const firstDayIndex = new Date(year, month, 1).getDay(); // 0 Sunday, 1 Monday...
        const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
        const totalDays = new Date(year, month + 1, 0).getDate();

        let daysHtml = '';

        for (let i = 0; i < adjustedFirstDayIndex; i++) {
            daysHtml += `<div class="org-cal-day empty"></div>`;
        }

        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = selectedEventDates.includes(dateStr);
            daysHtml += `
                <div class="org-cal-day ${isSelected ? 'selected' : ''}" data-date="${dateStr}">
                    ${day}
                </div>
            `;
        }

        calendarDaysGrid.innerHTML = daysHtml;

        calendarDaysGrid.querySelectorAll('.org-cal-day:not(.empty)').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const dateVal = e.currentTarget.getAttribute('data-date');
                const idx = selectedEventDates.indexOf(dateVal);
                if (idx > -1) {
                    selectedEventDates.splice(idx, 1);
                } else {
                    selectedEventDates.push(dateVal);
                }
                renderOrganizerCalendar();
                updateDatesPreview();
            });
        });
    }

    function updateDatesPreview() {
        if (inputEventDates) {
            inputEventDates.value = selectedEventDates.length > 0 ? JSON.stringify(selectedEventDates) : '';
        }
        if (selectedDatesPreview) {
            if (selectedEventDates.length === 0) {
                selectedDatesPreview.textContent = "Keine Termine ausgewählt";
                selectedDatesPreview.style.color = '#60a5fa';
            } else {
                const sorted = [...selectedEventDates].sort();
                const formatted = sorted.map(d => {
                    const parts = d.split('-');
                    return `${parts[2]}.${parts[1]}.${parts[0]}`;
                });
                selectedDatesPreview.textContent = `Ausgewählt: ${formatted.join(', ')}`;
                selectedDatesPreview.style.color = '#34d399';
            }
        }
    }

    if (calendarPrevBtn) {
        calendarPrevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentCalDate.setMonth(currentCalDate.getMonth() - 1);
            renderOrganizerCalendar();
        });
    }

    if (calendarNextBtn) {
        calendarNextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentCalDate.setMonth(currentCalDate.getMonth() + 1);
            renderOrganizerCalendar();
        });
    }

    // Organizer Location Handling
    const orgLocationInput = document.getElementById('input-org-location-search');

    if (orgLocationInput) {
        setupLocationAutocomplete(orgLocationInput);
        orgLocationInput.dataset.autocompleteBound = "true";
    }

    const detectOrgLocBtn = document.getElementById('btn-org-detect-location');
    const orgLocSpinner = document.getElementById('org-location-spinner');

    if (detectOrgLocBtn) {
        detectOrgLocBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!navigator.geolocation) {
                showToast({ title: 'Fehler', message: 'Geolokalisation wird von deinem Browser nicht unterstützt.' });
                return;
            }

            if (orgLocSpinner) orgLocSpinner.style.display = 'block';
            detectOrgLocBtn.disabled = true;

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
                        const data = await response.json();
                        if (data && data.address) {
                            const addr = data.address;
                            const city = addr.city || addr.town || addr.village || addr.municipality;
                            const postcode = addr.postcode || "";
                            if (city) {
                                const locString = postcode ? `${postcode} ${city}` : city;
                                if (orgLocationInput) {
                                    orgLocationInput.value = locString;
                                    orgLocationInput.dispatchEvent(new Event('input', { bubbles: true }));
                                    orgLocationInput.dispatchEvent(new Event('change', { bubbles: true }));
                                }
                                showToast({ title: 'Standort ermittelt', message: `Ort eingestellt: ${locString}` });
                            } else {
                                showToast({ title: 'Fehler', message: 'Ort konnte nicht bestimmt werden.' });
                            }
                        } else {
                            showToast({ title: 'Fehler', message: 'Adresse konnte nicht bestimmt werden.' });
                        }
                    } catch (err) {
                        showToast({ title: 'Fehler', message: 'Abfrage des Standorts fehlgeschlagen.' });
                    } finally {
                        if (orgLocSpinner) orgLocSpinner.style.display = 'none';
                        detectOrgLocBtn.disabled = false;
                    }
                },
                (error) => {
                    let errMsg = 'Zugriff auf Standort verweigert.';
                    if (error.code === error.TIMEOUT) errMsg = 'Zeitüberschreitung bei der Standortbestimmung.';
                    showToast({ title: 'Fehler', message: errMsg });
                    if (orgLocSpinner) orgLocSpinner.style.display = 'none';
                    detectOrgLocBtn.disabled = false;
                },
                { timeout: 10000 }
            );
        });
    }

    // Weekday Availability Day Checkbox and Input state synchronizer
    document.querySelectorAll('input[name="availDays"]').forEach(chk => {
        chk.addEventListener('change', (e) => {
            const day = e.target.value;
            const timesDiv = document.getElementById(`times-container-${day}`);
            if (timesDiv) {
                const inputs = timesDiv.querySelectorAll('input[type="time"]');
                inputs.forEach(inp => {
                    inp.disabled = !e.target.checked;
                });
                timesDiv.style.opacity = e.target.checked ? '1' : '0.3';
            }
        });
    });

    // Musician Location Handling
    const musLocationInput = document.getElementById('input-mus-location-search');

    if (musLocationInput) {
        setupLocationAutocomplete(musLocationInput);
        musLocationInput.dataset.autocompleteBound = "true";
    }

    // Subscription Selector logic
    const subCards = document.querySelectorAll('.subscription-card');
    const selectedPlanInput = document.getElementById('input-selected-plan');
    const sepaMandateText = document.getElementById('sepa-mandate-text');
    const sepaCheckboxLabel = document.getElementById('sepa-checkbox-label');

    subCards.forEach(card => {
        card.addEventListener('click', () => {
            subCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const plan = card.getAttribute('data-plan');
            if (selectedPlanInput) selectedPlanInput.value = plan;

            // Dynamically update card buttons text in registration
            subCards.forEach(c => {
                const btn = c.querySelector(".btn-sub-select");
                if (btn) {
                    btn.textContent = c.classList.contains('active') ? 'Ausgewählt' : 'Auswählen';
                }
            });

            let periodText = 'pro Monat';
            let priceText = '9,99 €';
            if (plan === 'plus') {
                periodText = 'pro Monat (6 Monate Laufzeit)';
                priceText = '7,99 €';
            } else if (plan === 'pro') {
                periodText = 'pro Monat (12 Monate Laufzeit)';
                priceText = '5,99 €';
            } else if (plan === 'premium') {
                periodText = 'pro Monat (12 Monate Laufzeit)';
                priceText = '4,99 €';
            }

            const promoContainer = document.getElementById('premium-promo-container');
            if (promoContainer) {
                if (plan === 'premium') {
                    promoContainer.style.display = 'block';
                } else {
                    promoContainer.style.display = 'none';
                }
            }

            if (sepaMandateText) {
                sepaMandateText.innerHTML = `Ich ermächtige GigConnAct, Zahlungen für das Musiker-Abonnement (${priceText} ${periodText}) von meinem Bankkonto mittels Lastschrift einzuziehen. Zugleich weise ich mein Kreditinstitut an, die von GigConnAct auf mein Konto gezogenen Lastschriften einzulösen.`;
            }
            if (sepaCheckboxLabel) {
                sepaCheckboxLabel.textContent = `Ich stimme dem SEPA-Lastschriftmandat für das ${priceText} Abo zu.`;
            }
        });
    });

    let isPromoCodeApplied = false;
    const promoBtn = document.getElementById('btn-apply-promo');
    const promoInput = document.getElementById('reg-promo-code');
    const promoStatus = document.getElementById('promo-status-msg');

    if (promoBtn && promoInput && promoStatus) {
        promoBtn.addEventListener('click', () => {
            const code = promoInput.value.trim().toUpperCase();
            if (['GIGINSTA59', 'INSTASTORY', 'GIGPREMIUM', 'GIGCONN59'].includes(code) || window.gcaPromoCodes.includes(code)) {
                isPromoCodeApplied = true;
                promoStatus.textContent = "✔ Gutscheincode gültig! Premium-Tarif freigeschaltet (3 Monate kostenfrei, danach 4,99 €/Monat).";
                promoStatus.style.color = "#10b981";
                promoStatus.style.display = "block";
                promoInput.disabled = true;
                promoBtn.disabled = true;
                
                const stripeBox = document.getElementById('reg-stripe-connect-container');
                if (stripeBox) stripeBox.style.display = 'block';
            } else {
                isPromoCodeApplied = false;
                promoStatus.textContent = "❌ Ungültiger Gutscheincode. Bitte folge uns auf Instagram und teile den Beitrag.";
                promoStatus.style.color = "#ef4444";
                promoStatus.style.display = "block";
            }
        });
    }

    // Character Counter for Musician Description
    const descTextarea = document.getElementById('textarea-mus-desc');
    const charCounter = document.getElementById('desc-char-counter');
    if (descTextarea && charCounter) {
        descTextarea.addEventListener('input', (e) => {
            const len = e.target.value.length;
            charCounter.textContent = `${len} / 200`;
            if (len >= 200) {
                charCounter.style.color = 'var(--color-red)';
            } else {
                charCounter.style.color = 'var(--text-muted)';
            }
        });
    }

    // Phone numbers only sanitizer (max 13 numbers)
    const phoneInput = document.getElementById('input-reg-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 13);
        });
    }
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errDiv = document.getElementById('register-error-msg');
        
        const privacyConsent = registerForm.elements.privacyConsent?.checked;
        if (!privacyConsent) {
            errDiv.textContent = "Bitte bestätige, dass du die Datenschutzerklärung gelesen hast.";
            errDiv.style.display = 'block';
            errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const email = registerForm.elements.email.value.trim();
        
        const selectedPlan = document.getElementById('input-selected-plan')?.value || 'flex';
        if (selectedPlan === 'premium' && !isPromoCodeApplied) {
            errDiv.textContent = "Bitte gib einen gültigen Gutscheincode ein, um den Premium-Tarif freizuschalten.";
            errDiv.style.display = 'block';
            errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const emailValidation = validateEmailAddress(email);
        if (!emailValidation.isValid) {
            errDiv.textContent = emailValidation.message;
            errDiv.style.display = 'block';
            errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const fullName = registerForm.elements.fullName ? registerForm.elements.fullName.value.trim() : '';
        const nameReg = /^[a-zA-ZäöüÄÖÜß\s\-]+$/;
        if (!nameReg.test(fullName)) {
            errDiv.textContent = 'Der Vor- und Nachname darf nur Buchstaben, Leerzeichen oder Bindestriche enthalten.';
            errDiv.style.display = 'block';
            errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const nameParts = fullName.split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const cleanPhone = registerForm.elements.phone.value.replace(/\D/g, '');
        if (cleanPhone.length < 8 || cleanPhone.length > 13) {
            errDiv.textContent = 'Die Telefonnummer muss zwischen 8 und 13 Ziffern lang sein.';
            errDiv.style.display = 'block';
            errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        if (selectedRole === 'musician') {
            const checkedTypes = registerForm.querySelectorAll('input[name="musicianTypes"]:checked');
            if (checkedTypes.length === 0) {
                errDiv.textContent = 'Bitte wähle mindestens eine Kategorie (z.B. Band oder Solokünstler) aus.';
                errDiv.style.display = 'block';
                errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            const checkedGenres = registerForm.querySelectorAll('input[name="genres"]:checked');
            if (checkedGenres.length === 0) {
                errDiv.textContent = 'Bitte wähle mindestens ein Genre aus.';
                errDiv.style.display = 'block';
                errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            const checkedInstruments = registerForm.querySelectorAll('input[name="instruments"]:checked');
            if (checkedInstruments.length === 0) {
                errDiv.textContent = 'Bitte wähle mindestens ein Instrument aus.';
                errDiv.style.display = 'block';
                errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            const checkedEventTypes = registerForm.querySelectorAll('input[name="eventTypes"]:checked');
            if (checkedEventTypes.length === 0) {
                errDiv.textContent = 'Bitte wähle mindestens eine Event-Art aus.';
                errDiv.style.display = 'block';
                errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            const musLocVal = (musLocationInput?.value || '').trim();
            if (!musLocVal) {
                errDiv.textContent = 'Bitte gib deinen Standort (Stadt) an.';
                errDiv.style.display = 'block';
                errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            const musDescVal = registerForm.querySelector('textarea[name="musDescription"]')?.value.trim();
            if (!musDescVal) {
                errDiv.textContent = 'Bitte gib eine kurze Beschreibung über dich/deine Band an.';
                errDiv.style.display = 'block';
                errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
        } else if (selectedRole === 'organizer') {
            const eventName = registerForm.elements.eventName.value.trim();
            if (!eventName) {
                errDiv.textContent = 'Bitte gib einen Eventnamen ein.';
                errDiv.style.display = 'block';
                errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            if (eventName.length > 25) {
                errDiv.textContent = 'Der Eventname darf maximal 25 Zeichen lang sein.';
                errDiv.style.display = 'block';
                errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            const checkedEventTypes = registerForm.querySelectorAll('input[name="orgEventTypes"]:checked');
            if (checkedEventTypes.length === 0) {
                errDiv.textContent = 'Bitte wähle mindestens einen Event-Typen aus.';
                errDiv.style.display = 'block';
                errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            const checkedMusicianTypes = registerForm.querySelectorAll('input[name="orgMusicianTypes"]:checked');
            if (checkedMusicianTypes.length === 0) {
                errDiv.textContent = 'Bitte wähle mindestens einen gesuchten Musiker-Typen aus.';
                errDiv.style.display = 'block';
                errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            if (selectedEventDates.length === 0) {
                errDiv.textContent = 'Bitte wähle mindestens ein Veranstaltungsdatum im Kalender aus.';
                errDiv.style.display = 'block';
                errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            const orgLocVal = (orgLocationInput?.value || '').trim();
            if (!orgLocVal) {
                errDiv.textContent = 'Bitte gib den Veranstaltungsort (Stadt) an.';
                errDiv.style.display = 'block';
                errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            const checkedGenres = registerForm.querySelectorAll('input[name="orgGenres"]:checked');
            if (checkedGenres.length === 0) {
                errDiv.textContent = 'Bitte wähle mindestens ein Genre aus.';
                errDiv.style.display = 'block';
                errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            const checkedInstruments = registerForm.querySelectorAll('input[name="orgInstruments"]:checked');
            if (checkedInstruments.length === 0) {
                errDiv.textContent = 'Bitte wähle mindestens ein Instrument aus.';
                errDiv.style.display = 'block';
                errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            const checkedTechnik = registerForm.querySelectorAll('input[name="orgTechnik"]:checked');
            if (checkedTechnik.length === 0) {
                errDiv.textContent = 'Bitte wähle mindestens eine Technik-Option aus.';
                errDiv.style.display = 'block';
                errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            const orgDescVal = registerForm.querySelector('textarea[name="orgDescription"]')?.value.trim();
            if (!orgDescVal) {
                errDiv.textContent = 'Bitte gib eine kurze Beschreibung deines Events an.';
                errDiv.style.display = 'block';
                errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
        }

        let compValue = "Privatperson";
        if (selectedRole === 'organizer') {
            const orgType = registerForm.elements.organizerType.value;
            if (orgType && orgType !== 'Privater Veranstalter') {
                const compInputVal = registerForm.elements.company.value.trim();
                if (!compInputVal) {
                    errDiv.textContent = 'Bitte gib den Namen deiner Organisation/Firma an.';
                    errDiv.style.display = 'block';
                    errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return;
                }
                compValue = compInputVal;
            }
        }

        const payload = {
            role: selectedRole,
            firstName: firstName,
            lastName: lastName,
            company: compValue,
            organizerType: selectedRole === 'organizer' ? registerForm.elements.organizerType.value : '',
            phone: cleanPhone,
            hidePhone: registerForm.querySelector('input[name="hidePhone"]').checked,
            email: email,
            password: ""
        };

        if (selectedRole === 'musician') {
            payload.bandName = registerForm.elements.bandName.value;
            payload.musicianType = Array.from(registerForm.querySelectorAll('input[name="musicianTypes"]:checked')).map(el => el.value).join(', ');
            payload.locations = [musLocVal];
            payload.radius = registerForm.elements.radius.value;
            payload.minDuration = registerForm.elements.minDuration.value;
            payload.maxDuration = registerForm.elements.maxDuration.value;
            payload.minBudget = registerForm.elements.minBudget.value;
            payload.maxBudget = registerForm.elements.maxBudget.value;
            payload.description = registerForm.elements.musDescription.value;
            payload.sepaConsent = registerForm.elements.sepaConsent.checked;
            payload.technik = Array.from(registerForm.querySelectorAll('input[name="musTechnik"]:checked')).map(el => el.value).length > 0
                ? Array.from(registerForm.querySelectorAll('input[name="musTechnik"]:checked')).map(el => el.value)
                : ["Technik ist noch unklar"];
            payload.genres = Array.from(registerForm.querySelectorAll('input[name="genres"]:checked')).map(el => el.value);
            payload.instruments = Array.from(registerForm.querySelectorAll('input[name="instruments"]:checked')).map(el => el.value);
            payload.eventTypes = Array.from(registerForm.querySelectorAll('input[name="eventTypes"]:checked')).map(el => el.value);
            payload.subscriptionPlan = registerForm.elements.selectedPlan.value || "flex";
            
            const availability = {};
            
            // Montag - Donnerstag mapping
            const moDoChk = registerForm.querySelector('input[name="availDays"][value="mo_do"]');
            const isMoDoChecked = moDoChk ? moDoChk.checked : false;
            const moDoStart = registerForm.querySelector('input[name="availStart_mo_do"]')?.value || '18:00';
            const moDoEnd = registerForm.querySelector('input[name="availEnd_mo_do"]')?.value || '23:59';
            
            ['monday', 'tuesday', 'wednesday', 'thursday'].forEach(day => {
                availability[day] = {
                    available: isMoDoChecked,
                    startTime: isMoDoChecked ? moDoStart : '',
                    endTime: isMoDoChecked ? moDoEnd : ''
                };
            });

            // Freitag mapping
            const frChk = registerForm.querySelector('input[name="availDays"][value="fr"]');
            const isFrChecked = frChk ? frChk.checked : false;
            const frStart = registerForm.querySelector('input[name="availStart_fr"]')?.value || '18:00';
            const frEnd = registerForm.querySelector('input[name="availEnd_fr"]')?.value || '23:59';
            availability['friday'] = {
                available: isFrChecked,
                startTime: isFrChecked ? frStart : '',
                endTime: isFrChecked ? frEnd : ''
            };
            
            // Saturday mapping
            const saChk = registerForm.querySelector('input[name="availDays"][value="sa"]');
            const isSaChecked = saChk ? saChk.checked : false;
            availability['saturday'] = {
                available: isSaChecked,
                startTime: isSaChecked ? (registerForm.querySelector('input[name="availStart_sa"]')?.value || '00:01') : '',
                endTime: isSaChecked ? (registerForm.querySelector('input[name="availEnd_sa"]')?.value || '23:59') : ''
            };
            
            // Sunday mapping
            const soChk = registerForm.querySelector('input[name="availDays"][value="so"]');
            const isSoChecked = soChk ? soChk.checked : false;
            availability['sunday'] = {
                available: isSoChecked,
                startTime: isSoChecked ? (registerForm.querySelector('input[name="availStart_so"]')?.value || '00:01') : '',
                endTime: isSoChecked ? (registerForm.querySelector('input[name="availEnd_so"]')?.value || '23:59') : ''
            };
            payload.minPublikum = registerForm.querySelector('#input-publikum-min')?.value || 0;
            payload.maxPublikum = registerForm.querySelector('#input-publikum-max')?.value || 500;
            payload.availability = availability;
            payload.photos = (window.registrationMedia.musician.photos || []).filter(p => p !== 'loading');
            payload.videos = (window.registrationMedia.musician.videos || []).filter(v => v && v.url !== 'loading');
            payload.audios = (window.registrationMedia.musician.audios || []).filter(a => a && a.url !== 'loading');
        } else {
            payload.eventName = registerForm.elements.eventName.value.trim();
            payload.orgEventTypes = Array.from(registerForm.querySelectorAll('input[name="orgEventTypes"]:checked')).map(el => el.value);
            payload.orgMusicianTypes = Array.from(registerForm.querySelectorAll('input[name="orgMusicianTypes"]:checked')).map(el => el.value);
            payload.eventDates = selectedEventDates;
            payload.eventStartTime = registerForm.querySelector('input[name="eventStartTime"]')?.value || '18:00';
            payload.eventEndTime = registerForm.querySelector('input[name="eventEndTime"]')?.value || '22:00';
            payload.orgLocations = [orgLocVal];
            payload.orgGenres = Array.from(registerForm.querySelectorAll('input[name="orgGenres"]:checked')).map(el => el.value);
            payload.orgInstruments = Array.from(registerForm.querySelectorAll('input[name="orgInstruments"]:checked')).map(el => el.value);
            payload.orgMinDuration = registerForm.querySelector('input[name="orgMinDuration"]').value;
            payload.orgMaxDuration = registerForm.querySelector('input[name="orgMaxDuration"]').value;
            payload.orgMinPublikum = registerForm.querySelector('input[name="orgMinPublikum"]').value;
            payload.orgMaxPublikum = registerForm.querySelector('input[name="orgMaxPublikum"]').value;
            payload.technik = Array.from(registerForm.querySelectorAll('input[name="orgTechnik"]:checked')).map(el => el.value).length > 0
                ? Array.from(registerForm.querySelectorAll('input[name="orgTechnik"]:checked')).map(el => el.value)
                : ["Technik ist noch unklar"];
            payload.orgMinBudget = registerForm.querySelector('input[name="orgMinBudget"]').value;
            payload.orgMaxBudget = registerForm.querySelector('input[name="orgMaxBudget"]').value;
            payload.orgDescription = registerForm.querySelector('textarea[name="orgDescription"]').value.trim();
            payload.photos = (window.registrationMedia.organizer.photos || []).filter(p => p !== 'loading');
            payload.videos = (window.registrationMedia.organizer.videos || []).filter(v => v && v.url !== 'loading');
            payload.audios = (window.registrationMedia.organizer.audios || []).filter(a => a && a.url !== 'loading');
        }

        if (window.googleRegistrationUser) {
            try {
                const user = window.googleRegistrationUser;
                const profileId = payload.role === 'musician' ? 'mus_' + user.uid : 'event_' + user.uid;

                const newUser = {
                    id: user.uid,
                    role: payload.role,
                    firstName: firstName,
                    lastName: lastName,
                    company: payload.company,
                    phone: payload.phone,
                    hidePhone: payload.hidePhone,
                    email: user.email,
                    favorites: [],
                    credits: 5,
                    profileId: payload.role === 'musician' ? profileId : null,
                    createdAt: new Date().toISOString()
                };

                if (payload.role === 'musician') {
                    const newMusician = {
                        id: profileId,
                        creatorId: user.uid,
                        name: payload.bandName,
                        bluffName: `Anonyme/r ${payload.musicianType} (${payload.genres[0] || 'Musik'})`,
                        type: payload.musicianType,
                        location: payload.locations ? payload.locations.join(', ') : 'München',
                        locations: payload.locations || ['München'],
                        radius: parseInt(payload.radius) || 50,
                        genres: payload.genres,
                        instruments: payload.instruments,
                        minDuration: parseFloat(payload.minDuration) || 1,
                        maxDuration: parseFloat(payload.maxDuration) || 3,
                        minBudget: parseFloat(payload.minBudget) || 150,
                        maxBudget: parseFloat(payload.maxBudget) || 1000,
                        eventTypes: payload.eventTypes,
                        availability: payload.availability,
                        minPublikum: parseInt(payload.minPublikum) || 0,
                        maxPublikum: parseInt(payload.maxPublikum) || 500,
                        technik: payload.technik,
                        bio: payload.description,
                        photos: payload.photos,
                        videos: payload.videos,
                        audio: payload.audios
                    };
                    await db.collection('users').doc(user.uid).set(newUser);
                    await db.collection('musicians').doc(profileId).set(newMusician);
                } else {
                    const newEvent = {
                        id: 'event_' + user.uid,
                        creatorId: user.uid,
                        name: payload.eventName,
                        type: payload.orgEventTypes ? payload.orgEventTypes.join(', ') : 'Event',
                        musicianTypes: payload.orgMusicianTypes,
                        location: payload.orgLocations ? payload.orgLocations.join(', ') : 'München',
                        locations: payload.orgLocations || ['München'],
                        date: payload.eventDates[0] || new Date().toISOString().split('T')[0],
                        dates: payload.eventDates,
                        eventStartTime: payload.eventStartTime,
                        eventEndTime: payload.eventEndTime,
                        genres: payload.orgGenres,
                        instruments: payload.orgInstruments,
                        minDuration: parseFloat(payload.orgMinDuration) || 1,
                        maxDuration: parseFloat(payload.orgMaxDuration) || 3,
                        minPublikum: parseInt(payload.orgMinPublikum) || 0,
                        maxPublikum: parseInt(payload.orgMaxPublikum) || 500,
                        technik: payload.technik,
                        budget: parseFloat(payload.orgMinBudget) || 200,
                        budgetMax: parseFloat(payload.orgMaxBudget) || 1500,
                        description: payload.orgDescription,
                        photos: payload.photos,
                        videos: payload.videos,
                        audio: payload.audios || [],
                        isActive: true,
                        isCanceled: false
                    };
                    await db.collection('users').doc(user.uid).set(newUser);
                    await db.collection('events').doc(newEvent.id).set(newEvent);
                }

                window.googleRegistrationUser = null;
                
                // Re-enable email in case modal is re-opened later
                if (registerForm && registerForm.elements.email) {
                    registerForm.elements.email.disabled = false;
                    registerForm.elements.email.style.background = '';
                    registerForm.elements.email.style.cursor = '';
                }

                closeModal();
                showToast({
                    title: "Registrierung abgeschlossen!",
                    message: `Willkommen bei GigConnAct, ${newUser.firstName}!`
                });
                
                if (typeof onSuccessCallback === 'function') {
                    onSuccessCallback();
                } else {
                    handleRouting();
                }
            } catch (err) {
                console.error("Google user profile setup failed:", err);
                errDiv.textContent = "Google-Registrierung fehlgeschlagen: " + err.message;
                errDiv.style.display = 'block';
            }
            return;
        }

        const res = await state.registerPasswordless(payload);
        if (res.success) {
            closeModal();
            showModal('verification', onSuccessCallback);
        } else {
            errDiv.textContent = res.message;
            errDiv.style.display = 'block';
        }
    });

    window.updateRegMediaPreview('musician');
    window.updateRegMediaPreview('organizer');

    const googleBtn = document.getElementById('btn-google-login');
    if (googleBtn) {
        googleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            
            googleBtn.disabled = true;
            const originalHtml = googleBtn.innerHTML;
            googleBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Google-Anmeldung...';
            
            auth.signInWithPopup(provider)
                .then(async (result) => {
                    googleBtn.disabled = false;
                    googleBtn.innerHTML = originalHtml;
                    
                    if (result && result.user) {
                        const user = result.user;
                        console.log("Google popup sign-in successful:", user.email);
                        
                        const userDoc = await db.collection('users').doc(user.uid).get();
                        if (!userDoc.exists) {
                            // NEW USER: Redirect to register page!
                            window.googleRegistrationUser = user;
                            closeModal();
                            showModal('auth');
                            const registerForm = document.getElementById('auth-register-form');
                            if (registerForm) {
                                if (registerForm.elements.email) {
                                    registerForm.elements.email.value = user.email || '';
                                    registerForm.elements.email.disabled = true;
                                    registerForm.elements.email.style.background = 'rgba(255,255,255,0.05)';
                                    registerForm.elements.email.style.cursor = 'not-allowed';
                                }
                                if (registerForm.elements.fullName && user.displayName) {
                                    registerForm.elements.fullName.value = user.displayName;
                                }
                            }
                            const registerTabBtn = document.getElementById('tab-register-btn');
                            if (registerTabBtn) registerTabBtn.click();
                            
                            showToast({
                                title: "Google-Konto verknüpft!",
                                message: "Bitte vervollständige deine Angaben, um die Registrierung abzuschließen."
                            });
                        } else {
                            // EXISTING USER: Logged in!
                            closeModal();
                            showToast({
                                title: "Erfolgreich angemeldet!",
                                message: `Willkommen zurück, ${user.displayName || user.email}!`
                            });
                            // setupAuthListener will trigger state update
                        }
                    }
                })
                .catch((err) => {
                    console.error("Google Popup Error:", err);
                    googleBtn.disabled = false;
                    googleBtn.innerHTML = originalHtml;
                    showToast({
                        title: "Google-Anmeldung fehlgeschlagen",
                        message: err.message || "Es gab ein Problem bei der Anmeldung."
                    });
                });
        });
    }
}

function renderVerificationModal(wrapper, onSuccessCallback) {
    const pendingUser = JSON.parse(localStorage.getItem('GigConnAct_pending_registration') || '{}');
    wrapper.innerHTML = `
        <div class="modal-content" style="max-width: 450px; text-align: center;">
            <div class="modal-header" style="border-bottom:none; justify-content:center;">
                <h3 style="font-size:1.6rem;"><i class="fa-solid fa-envelope-circle-check text-cyan"></i> E-Mail Verifizierung</h3>
            </div>
            <div class="modal-body" style="padding-top:0;">
                <p style="margin-bottom:1.5rem; line-height: 1.5; color: var(--text-muted);">
                    Wir haben eine E-Mail zur Registrierung an <strong>${pendingUser.email || 'deine E-Mail'}</strong> gesendet.<br><br>
                    Bitte überprüfe dein E-Mail-Postfach (und deinen Spam-Ordner) und klicke auf den Bestätigungslink in der E-Mail, um die Registrierung abzuschließen.
                </p>
                <div style="margin-top: 2rem;">
                    <button class="btn btn-secondary btn-sm" id="btn-close-verification-modal">
                        Schließen
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('btn-close-verification-modal').addEventListener('click', closeModal);
}




function renderPremiumModal(wrapper, onSuccessCallback) {
    wrapper.innerHTML = `
        <div class="modal-content" style="max-width: 540px;">
            <div class="modal-header">
                <h3>Mitgliedschaft & Credits aufladen</h3>
                <button class="close-modal-btn" id="btn-close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div style="text-align:center; margin-bottom: 1.2rem;">
                    <i class="fa-solid fa-coins" style="font-size: 2.8rem; color:#FFD700; margin-bottom:0.5rem;"></i>
                    <h4 style="font-family: var(--font-heading); font-size:1.25rem; color: var(--text-main);">WÄhle deine Zahlungsoption</h4>
                    <p style="color:var(--text-muted); font-size:0.85rem; margin-top:0.2rem;">Schalte Kontaktdaten frei, um direkt zu chatten und Angebote zu verhandeln.</p>
                </div>
                
                <form id="premium-payment-form">
                    <!-- Option Selection Cards -->
                    <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                        <!-- Option 1: Credits -->
                        <label style="flex: 1; min-width: 220px; display: flex; flex-direction: column; gap: 0.4rem; background: rgba(255,215,0,0.08); border: 2px solid #FFD700; border-radius: var(--radius-md); padding: 1.2rem 1rem; cursor: pointer; text-align: center; position: relative; transition: all 0.2s; box-shadow: 0 4px 12px rgba(255,215,0,0.05);" class="payment-option-card active" id="card-option-credits">
                            <input type="radio" name="paymentOption" value="credits" checked style="position: absolute; top: 12px; right: 12px; accent-color: var(--color-purple); scale: 1.25;">
                            <i class="fa-solid fa-coins" style="font-size: 1.6rem; color: #FFD700; margin-bottom: 0.2rem;"></i>
                            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-main);">Option 1: Prepaid</span>
                            <div style="font-size: 1.2rem; font-weight: 800; color: #FFD700; margin: 0.1rem 0; display:flex; align-items:center; justify-content:center; gap:0.25rem;">
                                <input type="number" id="credits-amount-input" min="1" max="999" value="10" onclick="event.stopPropagation();" style="width: 55px; height: 26px; text-align: center; font-size: 0.9rem; font-weight: 800; border-radius: 4px; border: 1px solid rgba(255, 215, 0, 0.4); background: rgba(0,0,0,0.4); color: #FFD700; padding:0; margin:0;">
                                <span>Credits für</span>
                                <span id="credits-total-price">10</span><span> €</span>
                            </div>
                            <span style="font-size: 0.7rem; color: var(--text-muted);">1 € pro Credit, ab 1 Credit aufladbar</span>
                        </label>
                        
                        <!-- Option 2: Subscription -->
                        <label style="flex: 1; min-width: 220px; display: flex; flex-direction: column; gap: 0.4rem; background: rgba(255,255,255,0.02); border: 2px solid rgba(255,255,255,0.05); border-radius: var(--radius-md); padding: 1.2rem 1rem; cursor: pointer; text-align: center; position: relative; transition: all 0.2s;" class="payment-option-card" id="card-option-subscription">
                            <input type="radio" name="paymentOption" value="subscription" style="position: absolute; top: 12px; right: 12px; accent-color: var(--color-purple); scale: 1.25;">
                            <i class="fa-solid fa-calendar-check" style="font-size: 1.6rem; color: var(--color-purple); margin-bottom: 0.2rem;"></i>
                            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-main);">Option 2: Flatrate-Abo</span>
                            <span style="font-size: 1.2rem; font-weight: 800; color: var(--color-purple); margin: 0.1rem 0;">5 € / Monat</span>
                            <span style="font-size: 0.7rem; color: var(--text-muted);">Unbegrenzt freischalten, kÜndbar</span>
                        </label>
                    </div>
                    
                    <!-- Payment Details (SEPA) -->
                    <div class="sepa-panel" style="background: rgba(255,255,255,0.01); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 1.2rem; margin-bottom: 1.2rem; text-align: left;">
                        <h5 style="margin: 0 0 0.6rem; font-size: 0.85rem; font-family: var(--font-heading); font-weight: 700; display:flex; align-items:center; gap:0.4rem; color:var(--text-main);"><i class="fa-solid fa-file-contract text-cyan"></i> SEPA-Lastschriftmandat</h5>
                        <div class="form-group" style="margin-bottom: 0.8rem;">
                            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">IBAN (Mock)</label>
                            <input type="text" class="input-field" placeholder="DE89 5000 0000 1234 5678 90" required style="width:100%; height:38px; font-size:0.85rem; padding: 0.4rem 0.8rem; margin:0;">
                        </div>
                        <label class="form-checkbox" style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.75rem; color: var(--text-muted); cursor: pointer; line-height: 1.4;">
                            <input type="checkbox" required style="margin-top:2px;">
                            <span>Ich stimme dem Lastschriftverfahren für die gewählte Option ausdrücklich zu.</span>
                        </label>
                    </div>
                    
                    <button type="submit" class="btn btn-secondary" style="width: 100%; margin: 0; font-weight: 700;">
                        Zahlungspflichtig bestellen
                    </button>
                </form>
            </div>
        </div>
    `;

    const form = document.getElementById('premium-payment-form');
    const radioCredits = form.querySelector('input[value="credits"]');
    const radioSub = form.querySelector('input[value="subscription"]');
    const cardCredits = document.getElementById('card-option-credits');
    const cardSub = document.getElementById('card-option-subscription');
    const creditsInput = form.querySelector('#credits-amount-input');
    const creditsPrice = form.querySelector('#credits-total-price');

    if (creditsInput && creditsPrice) {
        creditsInput.addEventListener('input', () => {
            let val = parseInt(creditsInput.value) || 1;
            if (val < 1) val = 1;
            creditsPrice.textContent = val;
        });
    }

    const updateCardStyles = () => {
        if (radioCredits.checked) {
            cardCredits.style.border = "2px solid #FFD700";
            cardCredits.style.background = "rgba(255,215,0,0.08)";
            cardSub.style.border = "2px solid rgba(255,255,255,0.05)";
            cardSub.style.background = "rgba(255,255,255,0.02)";
        } else {
            cardCredits.style.border = "2px solid rgba(255,255,255,0.05)";
            cardCredits.style.background = "rgba(255,255,255,0.02)";
            cardSub.style.border = "2px solid var(--color-purple)";
            cardSub.style.background = "rgba(124, 58, 237, 0.08)";
        }
    };

    radioCredits.addEventListener('change', updateCardStyles);
    radioSub.addEventListener('change', updateCardStyles);

    document.getElementById('btn-close-modal').addEventListener('click', closeModal);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedOption = form.querySelector('input[name="paymentOption"]:checked').value;
        const targetUnlockId = state.pendingUnlockListingId;

        const handleInplaceRefresh = () => {
            const currentHash = window.location.hash;
            if ((currentHash.includes('events') || currentHash.includes('musicians')) && typeof window.marketApplyFilters === 'function') {
                window.marketApplyFilters();
            } else if (currentHash.includes('matches') && typeof window.matchesUpdate === 'function') {
                window.matchesUpdate();
            } else {
                window.handleRouting();
            }
        };

        if (selectedOption === 'credits') {
            const buyAmount = parseInt(creditsInput?.value || '10');
            await state.addCredits(buyAmount);
            
            if (targetUnlockId) {
                // Determine target name
                const isEventMarket = (window.location.hash || '').includes('events');
                const targetEvent = state.events.find(ev => ev.id === targetUnlockId);
                const targetMusician = state.musicians.find(m => m.id === targetUnlockId);
                const targetName = targetEvent ? targetEvent.name : (targetMusician ? targetMusician.name : "Inserat");

                // Render intermediate confirmation page in the modal wrapper
                wrapper.innerHTML = `
                    <div class="modal-content" style="max-width: 440px; text-align: center; padding: 2rem;">
                        <i class="fa-solid fa-circle-check" style="font-size: 3.5rem; color: var(--color-green); margin-bottom: 1rem;"></i>
                        <h3 style="font-family: var(--font-heading); margin-bottom: 0.5rem; color: var(--text-main);">Credits erfolgreich aufgeladen!</h3>
                        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">
                            Dir wurden <strong>${buyAmount} Credits</strong> gutgeschrieben.<br><br>
                            Möchtest du jetzt <strong>1 Credit</strong> einlösen, um die Kontaktdaten für <strong>${targetName}</strong> freizuschalten?
                        </p>
                        
                        <div style="display: flex; gap: 1rem; justify-content: center;">
                            <button class="btn btn-sm btn-glass" id="btn-confirm-later" style="margin:0;">Nein, später</button>
                            <button class="btn btn-sm btn-primary" id="btn-confirm-now" style="margin:0; background:var(--color-green); border-color:var(--color-green); color:#000; font-weight:700;">Ja, jetzt freischalten</button>
                        </div>
                    </div>
                `;

                wrapper.querySelector('#btn-confirm-later').addEventListener('click', () => {
                    state.pendingUnlockListingId = null;
                    closeModal();
                    updateNavbar();
                    handleInplaceRefresh();
                    if (onSuccessCallback) onSuccessCallback();
                });

                wrapper.querySelector('#btn-confirm-now').addEventListener('click', async () => {
                    const unlockRes = await state.unlockContact(targetUnlockId);
                    state.pendingUnlockListingId = null;
                    closeModal();
                    updateNavbar();
                    
                    if (unlockRes.success) {
                        showToast({
                            title: "Kontaktdaten freigeschaltet! 🪙",
                            message: `Du hast die Kontaktdaten von ${targetName} erfolgreich freigeschaltet.`
                        });
                    }
                    handleInplaceRefresh();
                    if (onSuccessCallback) onSuccessCallback();
                });

                return; // Prevent closing the modal yet!
            } else {
                showToast({
                    title: "Credits aufgeladen! 🪙",
                    message: `${buyAmount} Credits wurden erfolgreich deinem Konto gutgeschrieben.`
                });
            }
        } else {
            // Subscription flatrate
            await state.toggleSubscription(); // sets isPremium = true
            
            if (targetUnlockId) {
                await state.unlockContact(targetUnlockId); // ensure it's in unlockedContacts as well, though subscription covers it
                state.pendingUnlockListingId = null;
            }
            
            showToast({
                title: "Flatrate-Abo aktiviert! 🚀",
                message: "Du hast nun unbegrenzten Zugriff auf alle Kontaktdaten."
            });
        }
        
        closeModal();
        updateNavbar();
        handleInplaceRefresh();
        
        if (onSuccessCallback) onSuccessCallback();
    });
}

function navigateAfterLogin() {
    if (state.currentUser) {
        if (state.currentUser.role === 'musician') {
            navigate('events');
        } else {
            navigate('musicians');
        }
    } else {
        navigate('');
    }
}
window.navigateAfterLogin = navigateAfterLogin;

function checkCookieConsent() {
    const raw = localStorage.getItem('GigConnAct_cookie_consent');
    if (!raw) {
        setTimeout(() => {
            showCookieConsentBanner();
        }, 1000);
    } else {
        try {
            const consent = JSON.parse(raw);
            loadTrackingScripts(consent);
        } catch (err) {
            console.error("Failed to parse cookie consent, resetting:", err);
            localStorage.removeItem('GigConnAct_cookie_consent');
            setTimeout(() => {
                showCookieConsentBanner();
            }, 1000);
        }
    }
}
window.checkCookieConsent = checkCookieConsent;

function showCookieSettings() {
    let preExisting = null;
    const raw = localStorage.getItem('GigConnAct_cookie_consent');
    if (raw) {
        try {
            preExisting = JSON.parse(raw);
        } catch (e) {}
    }
    showCookieConsentBanner(preExisting);
}
window.showCookieSettings = showCookieSettings;

function loadTrackingScripts(consent) {
    if (!consent) return;
    
    const gaId = "G-XXXXXX"; 
    const adsId = "AW-XXXXXX"; 
    
    const hasAnalytics = consent.analytics;
    const hasMarketing = consent.marketing;
    
    if (hasAnalytics || hasMarketing) {
        if (!document.getElementById('google-tag-manager-js')) {
            const script = document.createElement('script');
            script.id = 'google-tag-manager-js';
            script.async = true;
            const primaryId = hasAnalytics ? gaId : adsId;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${primaryId}`;
            document.head.appendChild(script);
            
            window.dataLayer = window.dataLayer || [];
            window.gtag = function() { window.dataLayer.push(arguments); };
            window.gtag('js', new Date());
        }
        
        if (hasAnalytics) {
            window.gtag('config', gaId, { 'anonymize_ip': true });
            console.log("[DEBUG] Google Analytics loaded (IP anonymized)");
        }
        
        if (hasMarketing) {
            window.gtag('config', adsId);
            console.log("[DEBUG] Google Ads Conversion Tracking loaded");
        }
    }
}
window.loadTrackingScripts = loadTrackingScripts;

function showCookieConsentBanner(preExistingSettings = null) {
    const oldBanner = document.getElementById('gigconnact-cookie-banner');
    if (oldBanner) oldBanner.remove();

    const consent = preExistingSettings || {
        essential: true,
        analytics: true,
        marketing: true
    };

    const banner = document.createElement('div');
    banner.id = 'gigconnact-cookie-banner';
    banner.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        left: 24px;
        max-width: 480px;
        background: rgba(18, 18, 18, 0.95);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(124, 58, 237, 0.35);
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1);
        z-index: 100000;
        font-family: var(--font-heading);
        color: #ffffff;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    if (!document.getElementById('cookie-banner-styles')) {
        const styleTag = document.createElement('style');
        styleTag.id = 'cookie-banner-styles';
        styleTag.innerHTML = `
            @keyframes slideInUp {
                from { transform: translateY(100px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @media (max-width: 600px) {
                #gigconnact-cookie-banner {
                    bottom: 12px !important;
                    right: 12px !important;
                    left: 12px !important;
                    max-width: none !important;
                    padding: 1.2rem !important;
                }
            }
            .cookie-switch {
                position: relative;
                display: inline-block;
                width: 40px;
                height: 20px;
            }
            .cookie-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .cookie-slider {
                position: absolute;
                cursor: pointer;
                top: 0; left: 0; right: 0; bottom: 0;
                background-color: rgba(255,255,255,0.15);
                transition: .3s;
                border-radius: 20px;
                border: 1px solid rgba(255,255,255,0.2);
            }
            .cookie-slider:before {
                position: absolute;
                content: "";
                height: 14px;
                width: 14px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                transition: .3s;
                border-radius: 50%;
            }
            .cookie-switch input:checked + .cookie-slider {
                background-color: #7c3aed;
            }
            .cookie-switch input:checked + .cookie-slider:before {
                transform: translateX(20px);
            }
            .cookie-switch input:disabled + .cookie-slider {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(styleTag);
    }

    banner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i class="fa-solid fa-cookie-bite" style="font-size: 2rem; color: #a78bfa; filter: drop-shadow(0 0 8px rgba(124,58,237,0.4));"></i>
            <h4 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #ffffff;">Wir verwenden Cookies 🍪</h4>
        </div>
        <p style="margin: 0; font-size: 0.78rem; color: rgba(255,255,255,0.8); line-height: 1.5;">
            Um unsere Website optimal zu gestalten, Zugriffe zu analysieren und Werbung zu optimieren, nutzen wir Cookies. Du kannst entscheiden, welche Kategorien du erlaubst. Mehr Infos in unserer <a href="#/datenschutz" style="color: #a78bfa; text-decoration: underline;" onclick="document.getElementById('gigconnact-cookie-banner').remove();">Datenschutzerklärung</a>.
        </p>

        <div style="display: flex; flex-direction: column; gap: 0.7rem; margin: 0.3rem 0; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.7rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong style="font-size: 0.82rem; display: block; color: #ffffff;">📊 Statistiken (Google Analytics)</strong>
                    <span style="font-size: 0.68rem; color: rgba(255,255,255,0.55); line-height: 1.4; display: block; margin-top: 0.15rem;">Helft uns zu verstehen, wie Besucher GigConnAct nutzen und unsere Website zu verbessern.</span>
                </div>
                <label class="cookie-switch">
                    <input type="checkbox" id="cookie-opt-analytics" ${consent.analytics ? 'checked' : ''}>
                    <span class="cookie-slider"></span>
                </label>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong style="font-size: 0.82rem; display: block; color: #ffffff;">📣 Marketing (Google Ads)</strong>
                    <span style="font-size: 0.68rem; color: rgba(255,255,255,0.55); line-height: 1.4; display: block; margin-top: 0.15rem;">Ermöglicht uns, die Wirksamkeit unserer Werbekampagnen zu messen und unsere Werbung zu optimieren.</span>
                </div>
                <label class="cookie-switch">
                    <input type="checkbox" id="cookie-opt-marketing" ${consent.marketing ? 'checked' : ''}>
                    <span class="cookie-slider"></span>
                </label>
            </div>
        </div>

        <div style="display: flex; margin-top: 0.3rem;">
            <button class="btn btn-primary btn-sm" id="btn-cookie-save-choice" style="margin:0; width: 100%; background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); border: none; font-weight: 700; font-size: 0.82rem; padding: 0.6rem; color: #fff; border-radius: 8px; cursor: pointer; transition: opacity 0.2s;">
                Speichern
            </button>
        </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('btn-cookie-save-choice').addEventListener('click', () => {
        const analytics = document.getElementById('cookie-opt-analytics').checked;
        const marketing = document.getElementById('cookie-opt-marketing').checked;
        saveConsent({ essential: true, analytics, marketing });
    });

    function saveConsent(newConsent) {
        newConsent.date = new Date().toISOString();
        localStorage.setItem('GigConnAct_cookie_consent', JSON.stringify(newConsent));
        banner.remove();
        loadTrackingScripts(newConsent);
        showToast({
            title: "Einstellungen gespeichert 🍪",
            message: "Deine Cookie-Auswahl wurde erfolgreich übernommen."
        });
    }
}
window.showCookieConsentBanner = showCookieConsentBanner;

function isSubscriptionExpired(user) {
    if (!user) return false;
    if (user.role === 'organizer') return false;
    
    if (user.subscriptionCancelled && user.subscriptionEndDate) {
        const parts = user.subscriptionEndDate.split('.');
        if (parts.length === 3) {
            const endDate = new Date(parts[2], parts[1] - 1, parts[0], 23, 59, 59);
            return endDate < new Date();
        }
    }
    return false;
}
window.isSubscriptionExpired = isSubscriptionExpired;

function renderSubscriptionExpiredPage(container) {
    const u = state.currentUser;
    if (!u) return;

    const getPlanDetails = (planKey) => {
        switch (planKey) {
            case 'plus': return { title: 'Plus', priceText: '7,99 € / Monat', price: '7.99', details: '6 Monate Vertragslaufzeit, 1. Monat kostenlos' };
            case 'pro': return { title: 'Pro', priceText: '5,99 € / Monat', price: '5.99', details: '12 Monate Vertragslaufzeit, 1. Monat kostenlos' };
            case 'premium': return { title: 'Premium', priceText: '4,99 € / Monat', price: '4.99', details: '12 Monate Vertragslaufzeit, 3 Monate kostenlos' };
            default: return { title: 'Flex', priceText: '9,99 € / Monat', price: '9.99', details: '1 Monat Vertragslaufzeit, 1. Monat kostenlos' };
        }
    };
    
    const activePlan = u.subscriptionPlan || 'flex';
    let selectedPlan = activePlan;
    const planInfo = getPlanDetails(selectedPlan);

    container.innerHTML = `
        <div class="market-container" style="max-width: 800px; margin: 3rem auto; padding: 2.5rem; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--shadow-lg); text-align: center;">
            <i class="fa-solid fa-lock" style="font-size: 3.5rem; color: var(--color-purple); margin-bottom: 1.5rem; filter: drop-shadow(0 0 10px rgba(124, 58, 237, 0.3));"></i>
            <h1 style="font-family: var(--font-heading); color: var(--text-main); font-size: 2rem; margin-bottom: 1rem;">Zugang abgelaufen 🔒</h1>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; max-width: 600px; margin: 0 auto 2rem;">
                Dein Abonnement für GigConnAct ist inaktiv. Um deine Inserate wieder zu aktivieren und Kontakt zu Veranstaltern aufzunehmen, wähle bitte einen Tarif und reaktiviere dein Abonnement.
            </p>

            <div style="text-align: left; margin-bottom: 2rem;">
                <h4 style="font-family: var(--font-heading); font-size: 1rem; margin-bottom: 1rem; color: var(--text-main); text-align: center;">Wähle deinen Tarif:</h4>
                <div class="subscription-cards" style="margin-bottom: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem;">
                    <div class="subscription-card ${selectedPlan === 'flex' ? 'active' : ''}" data-plan="flex" style="cursor: pointer; padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 12px; transition: 0.2s; text-align: center;">
                        <h5 style="margin: 0 0 0.5rem; font-size: 0.9rem;">Flex</h5>
                        <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-purple);">9,99 €</div>
                        <p style="font-size: 0.65rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.3;">1 Monat Laufzeit, jederzeit kündbar.</p>
                    </div>
                    <div class="subscription-card ${selectedPlan === 'plus' ? 'active' : ''}" data-plan="plus" style="cursor: pointer; padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 12px; transition: 0.2s; text-align: center;">
                        <h5 style="margin: 0 0 0.5rem; font-size: 0.9rem;">Plus</h5>
                        <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-purple);">7,99 €</div>
                        <p style="font-size: 0.65rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.3;">6 Monate Laufzeit, 1. Monat kostenlos.</p>
                    </div>
                    <div class="subscription-card ${selectedPlan === 'pro' ? 'active' : ''}" data-plan="pro" style="cursor: pointer; padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 12px; transition: 0.2s; text-align: center;">
                        <h5 style="margin: 0 0 0.5rem; font-size: 0.9rem;">Pro</h5>
                        <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-purple);">5,99 €</div>
                        <p style="font-size: 0.65rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.3;">12 Monate Laufzeit, 1. Monat kostenlos.</p>
                    </div>
                </div>

                <div id="expired-promo-code-box" style="display: none; margin-bottom: 1.5rem; background: rgba(124, 58, 237, 0.05); border: 1px dashed var(--color-purple); padding: 1rem; border-radius: var(--radius-md);">
                    <h5 style="margin: 0 0 0.5rem; font-size: 0.85rem; font-weight: 700; color: var(--color-purple);"><i class="fa-brands fa-instagram"></i> Story-Aktion Premium-Tarif</h5>
                    <p style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.8rem;">
                        Gib deinen Gutscheincode ein, um den Premium-Tarif für 4,99 € freizuschalten:
                    </p>
                    <div style="display: flex; gap: 0.5rem;">
                        <input type="text" id="expired-promo-code" class="input-field" placeholder="Gutscheincode" style="margin:0; text-transform: uppercase;">
                        <button type="button" class="btn btn-secondary btn-sm" id="btn-expired-apply-promo" style="margin:0; font-size:0.75rem; white-space:nowrap; background:var(--color-purple); border-color:var(--color-purple);">Prüfen</button>
                    </div>
                    <div id="expired-promo-status-msg" style="font-size: 0.7rem; margin-top: 0.4rem; display: none;"></div>
                    
                    <!-- Stripe-Verbindung (wird eingeblendet bei richtigem Code) -->
                    <div id="expired-stripe-connect-container" style="display: none; margin-top: 1rem; padding: 1rem; background: rgba(37, 99, 235, 0.05); border: 1px solid #2563eb; border-radius: var(--radius-md); text-align: left;">
                        <h6 style="margin: 0 0 0.5rem; font-size: 0.85rem; font-weight: 700; color: #2563eb; display: flex; align-items: center; gap: 0.4rem;"><i class="fa-brands fa-stripe" style="font-size: 1.2rem;"></i> Stripe Verbindung</h6>
                        <p style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.8rem; line-height: 1.35;">
                            Dein Gutscheincode ist gültig! Verbinde jetzt dein Konto mit Stripe, um die Premium-Buchung abzuschließen. Die Stripe-Schnittstelle wird nächste Woche aktiviert.
                        </p>
                        <button type="button" class="btn btn-primary btn-sm" style="background: #2563eb; border-color: #2563eb; display: flex; align-items: center; gap: 0.5rem; width: 100%; justify-content: center; cursor: not-allowed; opacity: 0.75;" disabled>
                            <i class="fa-brands fa-stripe"></i> Mit Stripe verbinden (Ab nächste Woche)
                        </button>
                    </div>
                </div>

                <div class="sepa-panel" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
                    <h5 style="margin:0 0 0.5rem; font-size:0.85rem; color:var(--text-main);"><i class="fa-solid fa-circle-info"></i> SEPA Lastschrift-Mandat</h5>
                    <p style="margin:0; font-size:0.7rem; color:var(--text-muted); line-height:1.4;" id="expired-sepa-text">
                        Ich ermächtige GigConnAct, Zahlungen für das Musiker-Abonnement (${planInfo.priceText}) von meinem Bankkonto mittels Lastschrift einzuziehen. Zugleich weise ich mein Kreditinstitut an, die von GigConnAct auf mein Konto gezogenen Lastschriften einzulösen.
                    </p>
                </div>
                <label class="form-checkbox" style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 2rem; cursor: pointer;">
                    <input type="checkbox" id="expired-sepa-consent" required checked style="margin-top: 0.15rem; width: auto; transform: scale(1.1); cursor: pointer;">
                    <span id="expired-sepa-checkbox-label">Ich stimme dem SEPA-Lastschriftmandat für das ${planInfo.priceText} Abo zu.</span>
                </label>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: center; align-items: center; flex-wrap: wrap;">
                <button class="btn btn-primary" id="btn-reactivate-expired-sub" style="margin: 0; background: var(--grad-primary); border: none; padding: 0.75rem 2rem; font-weight: 700; min-width: 200px;">
                    <i class="fa-solid fa-arrow-rotate-right"></i> Abo reaktivieren & bezahlen
                </button>
                <button class="btn btn-glass" id="btn-expired-logout" style="margin: 0; border-color: rgba(255,255,255,0.15); color: var(--text-muted);">
                    <i class="fa-solid fa-right-from-bracket"></i> Abmelden
                </button>
            </div>
        </div>
    `;

    const subCards = container.querySelectorAll('.subscription-card');
    const promoBox = document.getElementById('expired-promo-code-box');
    const sepaText = document.getElementById('expired-sepa-text');
    const sepaLabel = document.getElementById('expired-sepa-checkbox-label');
    let isPromoApplied = false;

    const updateUIForPlan = (planKey) => {
        const details = getPlanDetails(planKey);
        sepaText.textContent = `Ich ermächtige GigConnAct, Zahlungen für das Musiker-Abonnement (${details.priceText}) von meinem Bankkonto mittels Lastschrift einzuziehen. Zugleich weise ich mein Kreditinstitut an, die von GigConnAct auf mein Konto gezogenen Lastschriften einzulösen.`;
        sepaLabel.textContent = `Ich stimme dem SEPA-Lastschriftmandat für das ${details.priceText} Abo zu.`;
    };

    subCards.forEach(card => {
        card.addEventListener('click', () => {
            subCards.forEach(c => {
                c.classList.remove('active');
                c.style.borderColor = 'var(--border-glass)';
                c.style.background = 'rgba(255,255,255,0.02)';
            });
            card.classList.add('active');
            card.style.borderColor = 'var(--color-purple)';
            card.style.background = 'rgba(124, 58, 237, 0.05)';
            
            selectedPlan = card.getAttribute('data-plan');
            updateUIForPlan(selectedPlan);

            if (selectedPlan === 'premium' && !isPromoApplied) {
                promoBox.style.display = 'block';
            } else {
                promoBox.style.display = 'none';
            }
        });
    });

    const promoBtn = document.getElementById('btn-expired-apply-promo');
    const promoInput = document.getElementById('expired-promo-code');
    const promoStatus = document.getElementById('expired-promo-status-msg');

    if (promoBtn && promoInput && promoStatus) {
        promoBtn.addEventListener('click', () => {
            const code = promoInput.value.trim().toUpperCase();
            if (['GIGINSTA59', 'INSTASTORY', 'GIGPREMIUM', 'GIGCONN59'].includes(code) || window.gcaPromoCodes.includes(code)) {
                isPromoApplied = true;
                promoStatus.textContent = "✔ Gutscheincode gültig! Premium-Tarif (4,99 €) freigeschaltet.";
                promoStatus.style.color = "#10b981";
                promoStatus.style.display = "block";
                promoInput.disabled = true;
                promoBtn.disabled = true;
                
                const stripeBox = document.getElementById('expired-stripe-connect-container');
                if (stripeBox) stripeBox.style.display = 'block';
                
                selectedPlan = 'premium';
                updateUIForPlan('premium');
            } else {
                isPromoApplied = false;
                promoStatus.textContent = "❌ Ungültiger Gutscheincode.";
                promoStatus.style.color = "#ef4444";
                promoStatus.style.display = "block";
            }
        });
    }

    const reactivateBtn = document.getElementById('btn-reactivate-expired-sub');
    if (reactivateBtn) {
        reactivateBtn.addEventListener('click', async () => {
            const sepaChecked = document.getElementById('expired-sepa-consent').checked;
            if (!sepaChecked) {
                showToast({ title: "Zustimmung erforderlich", message: "Bitte stimme dem SEPA-Lastschriftmandat zu.", type: "error" });
                return;
            }

            if (selectedPlan === 'premium' && !isPromoApplied) {
                showToast({ title: "Gutscheincode erforderlich", message: "Bitte gib einen gültigen Instagram-Code ein, um den Premium-Tarif freizuschalten.", type: "error" });
                return;
            }

            try {
                reactivateBtn.disabled = true;
                reactivateBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Reaktivierung läuft...`;

                u.subscriptionCancelled = false;
                u.subscriptionPlan = selectedPlan;
                u.isPremium = true;
                delete u.subscriptionEndDate;

                const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
                const idx = registeredUsers.findIndex(usr => usr.id === u.id);
                if (idx !== -1) {
                    registeredUsers[idx].subscriptionCancelled = false;
                    registeredUsers[idx].subscriptionPlan = selectedPlan;
                    registeredUsers[idx].isPremium = true;
                    delete registeredUsers[idx].subscriptionEndDate;
                    localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));
                }

                if (typeof db !== 'undefined' && u.id) {
                    await db.collection('users').doc(u.id).update({
                        subscriptionCancelled: false,
                        subscriptionPlan: selectedPlan,
                        isPremium: true,
                        subscriptionEndDate: firebase.firestore.FieldValue.delete()
                    });
                }

                state.currentUser = u;
                state.saveState();

                showToast({
                    title: "Abonnement reaktiviert! 🎉",
                    message: "Vielen Dank! Dein Zugang ist wieder aktiv."
                });

                setTimeout(() => {
                    window.location.reload();
                }, 1000);

            } catch (err) {
                console.error("Reactivation failed:", err);
                reactivateBtn.disabled = false;
                reactivateBtn.innerHTML = `<i class="fa-solid fa-arrow-rotate-right"></i> Abo reaktivieren & bezahlen`;
                showToast({ title: "Fehler", message: "Die Reaktivierung ist fehlgeschlagen: " + err.message, type: "error" });
            }
        });
    }

    const logoutBtn = document.getElementById('btn-expired-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            state.logout();
            window.location.hash = '#/';
        });
    }
}
window.renderSubscriptionExpiredPage = renderSubscriptionExpiredPage;

function navigate(page) {
    const mainContainer = document.getElementById('app-main');
    if (!mainContainer) return;

    if (state && !state.initialLoadDone) {
        mainContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh; gap: 1.2rem; color: var(--text-muted); font-family: var(--font-body);">
                <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2.5rem; color: var(--color-purple);"></i>
                
            </div>
        `;
        return;
    }

    // Check if subscription has expired (DSGVO Variant A)
    if (state && state.currentUser && isSubscriptionExpired(state.currentUser)) {
        if (page === 'impressum') {
            renderImpressumPage(mainContainer);
            return;
        }
        if (page === 'datenschutz') {
            renderDatenschutzPage(mainContainer);
            return;
        }
        renderSubscriptionExpiredPage(mainContainer);
        return;
    }

    // Optimize redundant rendering: exit early if page hasn't changed, user session is identical, collection counts are identical, and active profile is identical
    const currentUserId = (state && state.currentUser) ? state.currentUser.id : null;
    const currentUserRole = (state && state.currentUser) ? state.currentUser.role : null;
    const currentMusiciansCount = (state && state.musicians) ? state.musicians.length : 0;
    const currentEventsCount = (state && state.events) ? state.events.length : 0;
    const activeMusicianId = (state && state.activeMusicianId) ? state.activeMusicianId : null;
    const activeEventId = (state && state.activeEventId) ? state.activeEventId : null;
    const currentUpdateVersion = (state && state.updateVersion) ? state.updateVersion : 0;

    const maxChatTimestamp = (state && state.chats) 
        ? Math.max(...state.chats.map(c => new Date(c.updatedAt || 0).getTime()), 0) 
        : 0;

    console.log("[DEBUG] navigate called for page:", page, 
                "currentActivePage:", window.currentActivePage, 
                "lastActiveMusicianId:", window.lastActiveMusicianId, "activeMusicianId:", activeMusicianId,
                "lastActiveEventId:", window.lastActiveEventId, "activeEventId:", activeEventId,
                "lastChatTimestamp:", window.lastChatTimestamp, "maxChatTimestamp:", maxChatTimestamp,
                "lastUpdateVersion:", window.lastUpdateVersion, "currentUpdateVersion:", currentUpdateVersion);

    const isIdentical = page !== '' && 
        window.currentActivePage === page && 
        window.lastUserSessionId === currentUserId && 
        window.lastUserRole === currentUserRole &&
        window.lastMusiciansCount === currentMusiciansCount &&
        window.lastEventsCount === currentEventsCount &&
        window.lastActiveMusicianId === activeMusicianId &&
        window.lastActiveEventId === activeEventId &&
        window.lastUpdateVersion === currentUpdateVersion;

    if (page === 'postbox') {
        if (isIdentical && window.lastChatTimestamp === maxChatTimestamp) {
            console.log("[DEBUG] navigate exiting early for postbox (chats unchanged)");
            return;
        }
    } else {
        if (isIdentical) {
            console.log("[DEBUG] navigate exiting early (rendering skipped)");
            return;
        }
    }

    window.lastUserSessionId = currentUserId;
    window.lastUserRole = currentUserRole;
    window.lastMusiciansCount = currentMusiciansCount;
    window.lastEventsCount = currentEventsCount;
    window.lastActiveMusicianId = activeMusicianId;
    window.lastActiveEventId = activeEventId;
    window.lastChatTimestamp = maxChatTimestamp;
    window.lastUpdateVersion = currentUpdateVersion;

    if (page === '') {
        mainContainer.classList.add('page-landing');
    } else {
        mainContainer.classList.remove('page-landing');
    }

    // Only scroll to top if the page has actually changed, preventing viewport jumping
    if (window.currentActivePage !== page) {
        window.scrollTo(0, 0);
        window.currentActivePage = page;
    }

    updateNavbar(page === '');
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

    switch (page) {
        case 'events':
            renderMarket(mainContainer, 'events', navigate);
            setActiveLink('link-events');
            window.location.hash = '#/events';
            break;
        case 'musicians':
            renderMarket(mainContainer, 'musicians', navigate);
            setActiveLink('link-musicians');
            window.location.hash = '#/musicians';
            break;
        case 'matches':
        case 'top-matches':
            if (!state.currentUser) {
                navigate('');
                showModal('auth');
            } else {
                state.clearUnreadMatches();
                renderMatchesPage(mainContainer);
                setActiveLink('link-matches');
                window.location.hash = '#/matches';
            }
            break;
        case 'dashboard':
            if (!state.currentUser) {
                navigate('');
                showModal('auth');
            } else if (state.currentUser.role === 'organizer') {
                renderMyEvents(mainContainer);
                setActiveLink('link-dashboard');
                window.location.hash = '#/dashboard';
            } else {
                renderMyMusicians(mainContainer);
                setActiveLink('link-dashboard');
                window.location.hash = '#/dashboard';
            }
            break;
        case 'my-musicians':
            if (!state.currentUser) {
                navigate('');
                showModal('auth');
            } else {
                renderMyMusicians(mainContainer);
                setActiveLink('link-my-musicians');
                window.location.hash = '#/my-musicians';
            }
            break;
        case 'my-events':
            if (!state.currentUser) {
                navigate('');
                showModal('auth');
            } else {
                renderMyEvents(mainContainer);
                setActiveLink('link-my-events');
                window.location.hash = '#/my-events';
            }
            break;
        case 'postbox':
            if (!state.currentUser) {
                navigate('');
                showModal('auth');
            } else {
                window.postboxJustOpened = true;
                renderPostbox(mainContainer);
                setActiveLink('link-postbox');
                window.location.hash = '#/postbox';
            }
            break;
        case 'credits':
            if (!state.currentUser) {
                navigate('');
                showModal('auth');
            } else {
                renderCreditsPage(mainContainer);
                setActiveLink('link-credits');
                window.location.hash = '#/credits';
            }
            break;
        case 'verify-email':
            renderVerifyEmailPage(mainContainer);
            break;
        case 'impressum':
            renderImpressumPage(mainContainer);
            break;
        case 'datenschutz':
            renderDatenschutzPage(mainContainer);
            break;
        case 'profile':
            if (!state.currentUser) {
                navigate('');
                showModal('auth');
            } else {
                renderProfilePage(mainContainer);
                window.location.hash = '#/profile';
            }
            break;
        default:
            renderLandingPage(mainContainer, navigate);
            if (window.location.hash && window.location.hash !== '#/' && window.location.hash !== '#') {
                history.replaceState(null, '', '#/');
            }
            break;
    }
}

function setActiveLink(linkId) {
    const link = document.getElementById(linkId);
    if (link) link.classList.add('active');
}

function updateNavbar(forceLanding) {
    const nav = document.getElementById('main-nav');
    const authArea = document.getElementById('auth-area');
    if (!nav || !authArea) return;

    const u = state.currentUser;
    const isLanding = forceLanding !== undefined 
        ? forceLanding 
        : (!window.location.hash || window.location.hash === '#/' || window.location.hash === '#');

    const header = document.querySelector('.app-header');
    if (header) {
        if (isLanding) {
            header.classList.add('transparent-header');
        } else {
            header.classList.remove('transparent-header');
        }
    }

    const main = document.getElementById('app-main');
    if (main) {
        if (isLanding) {
            main.classList.add('landing-active-main');
        } else {
            main.classList.remove('landing-active-main');
        }
    }

    if (u && u.id) {
        nav.className = `main-nav ${u.role === 'musician' ? 'nav-purple' : 'nav-blue'}`;
        nav.innerHTML = ''; // Hide text-based navigation links since icon buttons are used instead
        
        const unreadCount = state.getUnreadCount();

        let creditsBadgeHtml = '';
        const isProfileActive = window.location.hash === '#/profile';

        const isMusician = u.role === 'musician';
        const marketIcon = isMusician ? 'fa-calendar-days' : 'fa-guitar';
        const marketLink = isMusician ? '#/events' : '#/musicians';
        const marketTitle = isMusician ? 'Event-Markt' : 'Musiker-Markt';
        
        const isMarketActive = isMusician 
            ? (window.location.hash === '#/events' || window.location.hash.startsWith('#/events'))
            : (window.location.hash === '#/musicians' || window.location.hash.startsWith('#/musicians'));
        const isPostboxActive = window.location.hash === '#/postbox' || window.location.hash.startsWith('#/postbox');

        // Fetch user profiles to generate persistent profile switcher in header
        let userProfiles = [];
        let activeProfileId = '';
        if (isMusician) {
            userProfiles = state.musicians.filter(m => m.creatorId === u.id);
            activeProfileId = state.activeMusicianId || (userProfiles[0]?.id || '');
            if (activeProfileId) state.activeMusicianId = activeProfileId;
        } else {
            userProfiles = state.events.filter(e => e.creatorId === u.id);
            activeProfileId = state.activeEventId || (userProfiles[0]?.id || '');
            if (activeProfileId) state.activeEventId = activeProfileId;
        }

        let profileSelectorHtml = '';
        if (userProfiles.length > 0) {
            const options = userProfiles.map(p => `<option value="${p.id}" ${p.id === activeProfileId ? 'selected' : ''} style="background: #ffffff; color: #1e293b;">${p.name || p.contactName || p.title || 'Profil'}</option>`).join('');
            profileSelectorHtml = `
                <div class="profile-switcher-wrapper" style="display: flex; align-items: center; gap: 0.25rem; background: rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.08); border-radius: 20px; padding: 0.2rem 0.5rem; margin: 0; max-width: 140px; height: 32px; box-sizing: border-box; flex-shrink: 0; font-family: var(--font-heading);">
                    <i class="${isMusician ? 'fa-solid fa-guitar' : 'fa-solid fa-calendar-day'}" style="color: ${isMusician ? 'var(--color-purple)' : 'var(--color-cyan)'}; font-size: 0.75rem; flex-shrink: 0;"></i>
                    <select id="navbar-profile-select" style="width: 100%; height: 24px; padding: 0 0.15rem; font-size: 0.7rem; margin: 0; border: none; background: transparent; cursor: pointer; color: #1e293b; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; outline: none; -webkit-appearance: none; -moz-appearance: none; appearance: none;">
                        ${options}
                    </select>
                </div>
            `;
        }

        authArea.innerHTML = `
            <div style="display:flex; align-items:center; gap:0.6rem;">
                ${profileSelectorHtml}
                
                <div class="profile-dropdown-container">
                    <button class="profile-avatar-btn ${isMusician ? 'profile-avatar-purple' : 'profile-avatar-blue'} ${isProfileActive ? 'active' : ''}" id="btn-profile-dropdown" aria-label="Benutzermenü" style="position: relative;">
                        <i class="fa-regular fa-circle-user"></i>
                        ${unreadCount > 0 ? `
                            <span style="position: absolute; top: -2px; right: -2px; background: var(--color-red); width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid var(--bg-card); display: block;"></span>
                        ` : ''}
                    </button>
                    <div class="profile-dropdown-menu" id="profile-dropdown-menu">
                        <!-- Event-Markt / Musiker-Markt Link -->
                        <a href="${marketLink}" class="profile-dropdown-item ${isMusician ? 'profile-dropdown-purple' : 'profile-dropdown-blue'} ${isMarketActive ? 'active' : ''}" id="dropdown-link-market">
                            <i class="fa-solid ${marketIcon}"></i>
                            <span>${marketTitle}</span>
                        </a>

                        <!-- Postfach Link -->
                        <a href="#/postbox" class="profile-dropdown-item ${isMusician ? 'profile-dropdown-purple' : 'profile-dropdown-blue'} ${isPostboxActive ? 'active' : ''}" id="dropdown-link-postbox" style="position: relative;">
                            <i class="fa-solid fa-envelope"></i>
                            <span>Postfach</span>
                            ${unreadCount > 0 ? `
                                <span style="margin-left: auto; background: var(--color-red); color: white; font-size: 0.65rem; font-weight: 800; min-width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 0 2px; box-sizing: border-box; line-height: 1;">
                                    ${unreadCount}
                                </span>
                            ` : ''}
                        </a>
                        
                        <!-- Meine Musiker / Meine Events Link -->
                        <a href="${isMusician ? '#/my-musicians' : '#/my-events'}" class="profile-dropdown-item ${isMusician ? 'profile-dropdown-purple' : 'profile-dropdown-blue'} ${window.location.hash === (isMusician ? '#/my-musicians' : '#/my-events') ? 'active' : ''}" id="dropdown-link-my-tab">
                            <i class="fa-solid ${isMusician ? 'fa-guitar' : 'fa-calendar-check'}"></i>
                            <span>${isMusician ? 'Meine Musiker' : 'Meine Events'}</span>
                        </a>
                        
                        <a href="#/profile" class="profile-dropdown-item ${isMusician ? 'profile-dropdown-purple' : 'profile-dropdown-blue'} ${isProfileActive ? 'active' : ''}" id="dropdown-link-profile">
                            <i class="fa-solid fa-user-gear"></i>
                            <span>Profil bearbeiten</span>
                        </a>
                        
                        <div class="profile-dropdown-divider"></div>
                        <a href="javascript:void(0)" class="profile-dropdown-item logout-item ${isMusician ? 'profile-dropdown-purple' : 'profile-dropdown-blue'}" id="dropdown-btn-logout">
                            <i class="fa-solid fa-right-from-bracket"></i>
                            <span>Abmelden</span>
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Toggle dropdown logic
        const trigger = document.getElementById('btn-profile-dropdown');
        const menu = document.getElementById('profile-dropdown-menu');
        
        if (trigger && menu) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('show');
            });
        }

        // Dropdown internal link navigation handles closing menu
        const marketLinkBtn = document.getElementById('dropdown-link-market');
        if (marketLinkBtn) {
            marketLinkBtn.addEventListener('click', () => {
                menu.classList.remove('show');
            });
        }

        const postboxLinkBtn = document.getElementById('dropdown-link-postbox');
        if (postboxLinkBtn) {
            postboxLinkBtn.addEventListener('click', () => {
                menu.classList.remove('show');
            });
        }

        const profileLink = document.getElementById('dropdown-link-profile');
        if (profileLink) {
            profileLink.addEventListener('click', () => {
                menu.classList.remove('show');
            });
        }
        
        const myTabLink = document.getElementById('dropdown-link-my-tab');
        if (myTabLink) {
            myTabLink.addEventListener('click', () => {
                menu.classList.remove('show');
            });
        }

        const logoutBtn = document.getElementById('dropdown-btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                menu.classList.remove('show');
                state.logout();
                window.location.hash = '#/';
            });
        }

        const navbarProfileSelect = document.getElementById('navbar-profile-select');
        if (navbarProfileSelect) {
            navbarProfileSelect.addEventListener('change', function() {
                const val = this.value;
                console.log("[DEBUG] navbar-profile-select changed to:", val);
                if (isMusician) {
                    state.activeMusicianId = val;
                } else {
                    state.activeEventId = val;
                }
                state.notify();
            });
        }
    } else {
        nav.className = 'main-nav';
        nav.innerHTML = '';
        authArea.innerHTML = `
            <button class="btn btn-secondary btn-sm header-login-btn" id="btn-login-trigger">
                <span class="btn-text-top">Anmelden/Registrieren</span>
                <span class="btn-text-bottom">ohne Passwort</span>
            </button>
        `;
        document.getElementById('btn-login-trigger').addEventListener('click', () => {
            showModal('auth', () => {
                navigateAfterLogin();
            });
        });
    }
}

function handleRouting() {
    const hash = window.location.hash;
    let pageWithQuery = hash.replace('#/', '');
    let page = pageWithQuery.split('?')[0];
    if (page === 'top-matches') page = 'matches';
    
    // Redirect logged-in users away from the landing page
    if (state && state.currentUser && state.currentUser.id && (page === '' || page === '/')) {
        if (state.currentUser.role === 'musician') {
            navigate('events');
        } else {
            navigate('musicians');
        }
        return;
    }
    
    navigate(page);
}

// Global scope initialization
window.appNavigate = navigate;
window.handleRouting = handleRouting;

window.navigateGallery = function(btn, direction) {
    const wrapper = btn.closest('.listing-thumbnail-wrapper');
    const slidesContainer = wrapper.querySelector('.listing-gallery-slides');
    const images = slidesContainer.querySelectorAll('img');
    const total = images.length;
    if (total <= 1) return;
    
    let currentIndex = parseInt(wrapper.getAttribute('data-current-index') || '0');
    currentIndex = (currentIndex + direction + total) % total;
    wrapper.setAttribute('data-current-index', currentIndex);
    
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    const dots = wrapper.querySelectorAll('.gallery-dot');
    dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
            dot.style.background = '#ffffff';
            dot.style.transform = 'scale(1.2)';
        } else {
            dot.style.background = 'rgba(255,255,255,0.4)';
            dot.style.transform = 'scale(1)';
        }
    });
};

function initGigConnActApp() {
    // Check cookie consent settings (GDPR)
    if (typeof checkCookieConsent === 'function') checkCookieConsent();

    document.addEventListener('click', (e) => {
        const menu = document.getElementById('profile-dropdown-menu');
        const trigger = document.getElementById('btn-profile-dropdown');
        if (menu && trigger && !menu.contains(e.target) && !trigger.contains(e.target)) {
            menu.classList.remove('show');
        }

        const infoIcon = e.target.closest('.fa-circle-info');
        if (infoIcon && infoIcon.hasAttribute('title')) {
            const title = infoIcon.getAttribute('title');
            const formattedMessage = title.replace(/\n/g, '<br>');
            showToast({
                title: "Information ℹ️",
                message: formattedMessage
            });
        }
    });

    if (typeof updateNavbar === 'function') updateNavbar();
    window.addEventListener('hashchange', handleRouting);
    if (typeof handleRouting === 'function') handleRouting();
    if (typeof initAllLocationAutocompletes === 'function') initAllLocationAutocompletes();

    const logoLink = document.getElementById('logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            let targetHash = '#/';
            if (state && state.currentUser) {
                if (state.currentUser.role === 'musician') {
                    targetHash = '#/events';
                } else if (state.currentUser.role === 'organizer') {
                    targetHash = '#/musicians';
                }
            }
            
            if (window.location.hash === targetHash) {
                handleRouting();
            } else {
                window.location.hash = targetHash;
            }
        });
    }

    const resetDemoBtn = document.getElementById('btn-reset-demo');
    if (resetDemoBtn) {
        resetDemoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            if (state) state.currentUser = null;
            showToast({
                title: "Demo-Daten zurückgesetzt",
                message: "Die Anwendung wird neu geladen..."
            });
            setTimeout(() => {
                window.location.hash = '#/';
                window.location.reload();
            }, 1000);
        });
    }

    document.addEventListener('user-state-changed', () => {
        if (typeof updateNavbar === 'function') updateNavbar();
        if (typeof handleRouting === 'function') handleRouting();
        runMatchingMonitor();
    });

    function runMatchingMonitor() {
        // Disabled match monitor background notifications as requested
        if (window.matchIntervalId) {
            clearInterval(window.matchIntervalId);
            window.matchIntervalId = null;
        }
    }

    runMatchingMonitor();
    // E-Mail Postfach (Simulation) widget removed as requested
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initGigConnActApp, 1);
} else {
    document.addEventListener('DOMContentLoaded', initGigConnActApp);
}

function renderPostbox(container) {
    if (!state.currentUser) return;
    const u = state.currentUser;
    const isMusician = u.role === 'musician';
    let userProfiles = [];

    // Auto-select profile & chat with unread messages when first opening the postbox
    if (window.postboxJustOpened) {
        window.postboxJustOpened = false;
        if (state.chats && state.chats.length > 0) {
            const unreadChats = state.chats.filter(c => state.isChatUnread(c));
            if (unreadChats.length > 0) {
                unreadChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                const targetChat = unreadChats[0];
                
                if (isMusician) {
                    const profiles = state.musicians.filter(m => m.creatorId === u.id);
                    const matchingProfile = profiles.find(m => targetChat.participants.includes(m.id));
                    if (matchingProfile) {
                        state.activeMusicianId = matchingProfile.id;
                        window.postboxActiveChatId = targetChat.id;
                    }
                } else {
                    const userEvents = state.events.filter(e => e.creatorId === u.id);
                    const matchingEvent = userEvents.find(e => targetChat.participants.includes(e.id));
                    if (matchingEvent) {
                        state.activeEventId = matchingEvent.id;
                        window.postboxActiveChatId = targetChat.id;
                    }
                }
            }
        }
    }

    let activeProfileId = '';
    if (isMusician) {
        userProfiles = state.musicians.filter(m => m.creatorId === u.id);
        activeProfileId = state.activeMusicianId || (userProfiles[0]?.id || u.profileId);
        state.activeMusicianId = activeProfileId;
    } else {
        userProfiles = state.events.filter(e => e.creatorId === u.id);
        activeProfileId = state.activeEventId || (userProfiles[0]?.id || u.id);
        state.activeEventId = activeProfileId;
    }

    const currentUserId = activeProfileId;

    let activeTab = window.postboxActiveTab || 'all'; // 'all' | 'received' | 'sent' | 'system'
    let activeChatId = window.postboxActiveChatId !== undefined ? window.postboxActiveChatId : null;

    let profileSelectorHtml = '';

    if (container.cleanupPostboxListener) {
        container.cleanupPostboxListener();
    }

    const renderView = () => {
        const chats = state.getChatsForUser(currentUserId);
        window.postboxActiveTab = activeTab;
        window.postboxActiveChatId = activeChatId;

        // Categorize chats (filtering out system chats entirely as requested)
        const nonSystemChats = chats.filter(c => !c.participants.includes('system'));
        const receivedChats = [];
        const sentChats = [];

        nonSystemChats.forEach(chat => {
            const msgs = chat.messages || [];
            const firstMsg = msgs[0];
            const isFirstMsgFromMe = firstMsg ? (firstMsg.senderId === currentUserId) : (chat.initiatorId === currentUserId);

            if (isFirstMsgFromMe) {
                sentChats.push(chat);
            } else {
                receivedChats.push(chat);
            }
        });

        let currentCategoryChats = [];
        if (activeTab === 'all') currentCategoryChats = nonSystemChats;
        else if (activeTab === 'received') currentCategoryChats = receivedChats;
        else if (activeTab === 'sent') currentCategoryChats = sentChats;
        else if (activeTab === 'system') currentCategoryChats = [];

        if (!currentCategoryChats.some(c => c.id === activeChatId) && currentCategoryChats.length > 0) {
            activeChatId = currentCategoryChats[0].id;
        }

        const activeChat = chats.find(c => c.id === activeChatId);

        window.postboxShowFilters = window.postboxShowFilters !== undefined ? window.postboxShowFilters : false;

        container.innerHTML = `
            <style>
                @media(max-width: 900px) {
                    .portal-layout {
                        flex-direction: column !important;
                        height: auto !important;
                    }
                    .postbox-sidebar {
                        width: 100% !important;
                        height: auto !important;
                    }
                    .postbox-chat-detail {
                        display: none !important;
                    }
                    .mobile-chat-accordion {
                        display: block !important;
                    }
                }
                @media(min-width: 901px) {
                    .mobile-chat-accordion {
                        display: none !important;
                    }
                }
            </style>
            <div class="portal-layout" style="display: flex !important; flex-direction: row !important; gap: 1.5rem; height: calc(100vh - 180px); min-height: 600px; width: 100%;">
                
                <!-- Left Sidebar: Categories & Chat Threads List -->
                <div class="postbox-sidebar" style="width: 340px; flex-shrink: 0; background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--radius-md); display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-sm); height: 100%;">
                    
                                        <!-- Postbox Header & Tabs -->
                    <div style="padding: 1rem; border-bottom: 1px solid var(--border-glass); background: rgba(255,255,255,0.01);">
                        <h3 style="margin: 0 0 0.8rem; font-size: 1.15rem; font-family: var(--font-heading); display:flex; align-items:center; gap:0.5rem; color:var(--text-main); justify-content: space-between;">
                            <span style="display:flex; align-items:baseline; gap:0.4rem; flex-wrap: wrap;">
                                <span style="display:flex; align-items:center; gap:0.5rem;">
                                    <i class="fa-solid fa-envelope ${isMusician ? 'text-purple' : 'text-cyan'}"></i> 
                                    Postfach 
                                    <span style="font-size: 1.15rem; color: ${isMusician ? 'var(--color-purple)' : 'var(--color-cyan)'}; font-weight: 800; margin-left: 0.2rem;">(${currentCategoryChats.length})</span>
                                </span>
                            </span>
                            <i class="fa-solid fa-sliders" id="btn-toggle-postbox-filters" style="color: ${window.postboxShowFilters ? (isMusician ? 'var(--color-purple)' : 'var(--color-cyan)') : 'var(--text-muted)'}; cursor: pointer; font-size: 1.05rem; transition: color 0.2s;" title="Filter ein-/ausblenden"></i>
                        </h3>
                        
                        ${profileSelectorHtml}
                        <!-- 3 Category Tabs (3 Columns) -->
                        <div id="postbox-filters-container" style="display: ${window.postboxShowFilters ? 'grid' : 'none'}; grid-template-columns: repeat(3, 1fr); gap: 0.4rem;">
                            <button class="btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-glass'} tab-btn-postbox" data-tab="all" style="font-size: 0.72rem; padding: 0.4rem 0.1rem; text-align: center; margin:0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="Alle Nachrichten">
                                <i class="fa-solid fa-folder-open" style="margin-right: 4px;"></i> Alle
                            </button>
                            <button class="btn btn-sm ${activeTab === 'received' ? 'btn-primary' : 'btn-glass'} tab-btn-postbox" data-tab="received" style="font-size: 0.72rem; padding: 0.4rem 0.1rem; text-align: center; margin:0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-color: rgba(34, 197, 94, 0.35); color: ${activeTab === 'received' ? '#ffffff' : '#22c55e'};" title="Empfangene Anfragen">
                                <i class="fa-solid fa-inbox" style="margin-right: 4px;"></i> Empfangen
                            </button>
                            <button class="btn btn-sm ${activeTab === 'sent' ? 'btn-primary' : 'btn-glass'} tab-btn-postbox" data-tab="sent" style="font-size: 0.72rem; padding: 0.4rem 0.1rem; text-align: center; margin:0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-color: rgba(239, 68, 68, 0.35); color: ${activeTab === 'sent' ? '#ffffff' : '#ef4444'};" title="Versendete Anfragen">
                                <i class="fa-solid fa-paper-plane" style="margin-right: 4px;"></i> Versendet
                            </button>
                        </div>
                    </div>

                    <!-- Thread Items List -->
                    <div class="postbox-threads-list" style="flex: 1; overflow-y: auto; padding: 0.5rem;">
                        ${currentCategoryChats.length === 0 ? `
                            <div style="padding: 2rem 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
                                <i class="fa-solid fa-inbox" style="font-size: 2rem; color: var(--border-glass); margin-bottom: 0.5rem; display: block;"></i>
                                Keine Nachrichten in dieser Kategorie.
                            </div>
                        ` : currentCategoryChats.map(c => {
                            const isSelected = c.id === activeChatId;
                            const isSys = c.participants.includes('system');
                            const counterpartyId = c.participants.find(id => id !== currentUserId) || c.participants[0];

                            let name = "System";
                            let avatar = "https://picsum.photos/id/1025/100/100";

                            if (!isSys) {
                                const counterMus = state.musicians.find(m => m.id === counterpartyId);
                                const counterOrg = state.events.find(e => e.id === counterpartyId) || state.events.find(e => e.creatorId === counterpartyId);
                                if (counterMus) {
                                    name = counterMus.name;
                                    avatar = counterMus.profilePic || "https://picsum.photos/id/453/100/100";
                                } else if (counterOrg) {
                                    name = counterOrg.name || counterOrg.contactName || "Veranstalter";
                                    avatar = "https://picsum.photos/id/111/100/100";
                                } else {
                                    name = "Gelöschter Nutzer";
                                    avatar = "https://picsum.photos/id/1025/100/100";
                                }
                            }

                            const msgs = c.messages || [];
                            const lastMsg = msgs[msgs.length - 1];
                            const isUnread = state.isChatUnread(c);

                            // Determine type and colors for specific feedback backgrounds and thick borders
                            let itemType = 'sent';
                            if (isSys) {
                                itemType = 'system';
                            } else {
                                const firstMsg = msgs[0];
                                const isFirstMsgFromMe = firstMsg ? (firstMsg.senderId === currentUserId) : (c.initiatorId === currentUserId);
                                if (!isFirstMsgFromMe) {
                                    itemType = 'received';
                                }
                            }

                            let bgColor = 'rgba(255, 255, 255, 0.02)';
                            let borderColor = 'rgba(255, 255, 255, 0.05)';
                            let leftBorderColor = 'transparent';

                            if (itemType === 'received') {
                                bgColor = isSelected ? 'rgba(34, 197, 94, 0.12)' : 'rgba(34, 197, 94, 0.04)';
                                borderColor = isSelected ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.15)';
                                leftBorderColor = isUnread ? '#22c55e' : 'transparent';
                            } else if (itemType === 'sent') {
                                bgColor = isSelected ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.04)';
                                borderColor = isSelected ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.15)';
                                leftBorderColor = isUnread ? '#ef4444' : 'transparent';
                            } else if (itemType === 'system') {
                                bgColor = isSelected ? 'rgba(234, 179, 8, 0.12)' : 'rgba(234, 179, 8, 0.04)';
                                borderColor = isSelected ? 'rgba(234, 179, 8, 0.4)' : 'rgba(234, 179, 8, 0.15)';
                                leftBorderColor = isUnread ? '#eab308' : 'transparent';
                            }

                            // Determine lock state for mobile accordion inline view
                            let isAccordionLock = false;
                            let lockEventId = c.eventId;
                            let lockMusicianId = counterpartyId;

                            const threadMsgs = c.messages || [];
                            if (!isMusician && !isSys) {
                                const interest = state.interests?.find(i => i.musicianId === lockMusicianId && (lockEventId ? i.eventId === lockEventId : true));
                                const isPerfect = interest && interest.musicianInterested && interest.organizerInterested;
                                const isDeclined = interest && interest.organizerNoInterest;
                                const firstMsg = threadMsgs[0];
                                const isFirstMsgFromMe = firstMsg ? (firstMsg.senderId === currentUserId) : (c.initiatorId === currentUserId);
                                if (!isPerfect && !isDeclined && !isFirstMsgFromMe) {
                                    isAccordionLock = false;
                                }
                            }

                            const inlineChatHtml = isSelected ? `
                                <div class="mobile-chat-accordion" style="margin-top: 0.8rem; border-top: 1px solid var(--border-glass); padding-top: 0.8rem; text-align: left; width: 100%;">
                                    <!-- Chat Messages Body -->
                                    <div class="chat-messages-container" style="max-height: 260px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.6rem; padding: 0.5rem 0.2rem;">
                                        ${threadMsgs.length === 0 ? `
                                            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); text-align: center; padding: 1.5rem 1rem;">
                                                <i class="fa-regular fa-paper-plane" style="font-size: 1.8rem; color: var(--border-glass); margin-bottom: 0.6rem;"></i>
                                                <p style="font-size: 0.78rem; margin: 0; line-height: 1.3;">Keine Nachrichten vorhanden. Schreibe eine Nachricht, um das Gespräch zu beginnen!</p>
                                            </div>
                                        ` : threadMsgs.map(m => {
                                             const isMe = m.senderId === currentUserId;
                                             const isSysMsg = m.senderId === 'system';
                                             const senderRole = isMe
                                                 ? (state.currentUser ? state.currentUser.role : 'musician')
                                                 : ((state.currentUser && state.currentUser.role === 'musician') ? 'organizer' : 'musician');
                                             
                                             let bubbleStyle = '';
                                             if (isSysMsg) {
                                                 bubbleStyle = 'background: rgba(255,255,255,0.05); color: var(--text-main); border: 1px solid var(--border-glass);';
                                             } else if (senderRole === 'musician') {
                                                 bubbleStyle = 'background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: #ffffff;';
                                             } else {
                                                 bubbleStyle = 'background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); color: #ffffff;';
                                             }
                                             const radiusStyle = isMe ? 'border-bottom-right-radius: 2px;' : 'border-bottom-left-radius: 2px;';

                                             return `
                                                 <div style="display: flex; justify-content: ${isMe ? 'flex-end' : 'flex-start'};">
                                                     <div style="max-width: 85%; padding: 0.55rem 0.75rem; border-radius: 12px; font-size: 0.78rem; line-height: 1.35; ${bubbleStyle} ${radiusStyle}">
                                                         <div>${m.text}</div>
                                                         <div style="font-size: 0.6rem; opacity: 0.7; text-align: right; margin-top: 0.25rem;">
                                                             ${new Date(m.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                                                         </div>
                                                     </div>
                                                 </div>
                                             `;
                                         }).join('')}
                                    </div>

                                    <!-- Lock Questionnaire or Message Input Footer -->
                                    <div style="padding-top: 0.8rem; border-top: 1px solid rgba(255,255,255,0.06);">
                                        ${isAccordionLock ? `
                                            <div class="organizer-questionnaire-box" style="background: rgba(124, 58, 237, 0.08); border: 1px solid var(--color-purple); border-radius: var(--radius-sm); padding: 0.8rem; text-align: center;">
                                                <h4 style="margin: 0 0 0.3rem; font-family: var(--font-heading); font-size: 0.9rem; color: var(--text-main);">
                                                    Ist die Anfrage interessant für dich?
                                                </h4>
                                                <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.6rem;">
                                                    Stimme der Anfrage zu, um das Antworten freizuschalten.
                                                </p>
                                                <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
                                                    <button class="btn btn-sm btn-glass btn-decline-incoming-req" data-musician-id="${lockMusicianId}" data-event-id="${lockEventId || ''}" style="color: var(--color-red); border-color: rgba(255,75,75,0.3); margin:0; font-size: 0.7rem; padding: 0.3rem 0.5rem;">
                                                        <i class="fa-solid fa-xmark"></i> Nein, ablehnen
                                                    </button>
                                                    <button class="btn btn-sm btn-primary btn-accept-incoming-req" data-musician-id="${lockMusicianId}" data-event-id="${lockEventId || ''}" style="background: var(--color-green); border-color: var(--color-green); color: #000; font-weight: 800; margin:0; font-size: 0.7rem; padding: 0.3rem 0.5rem;">
                                                        <i class="fa-solid fa-check"></i> Ja, kontaktieren
                                                    </button>
                                                </div>
                                            </div>
                                        ` : `
                                            <form class="chat-send-form-mobile" style="display: flex; gap: 0.4rem; margin-top: 0.2rem;">
                                                <input type="text" class="input-field chat-message-input-mobile" placeholder="${isSys ? 'Nicht möglich' : 'Schreibe...'}" ${isSys ? 'disabled' : ''} required style="flex: 1; margin: 0; height: 36px; font-size: 0.8rem; padding: 0.5rem; border-radius: 8px;">
                                                <button type="submit" class="btn btn-primary" ${isSys ? 'disabled' : ''} style="margin: 0; padding: 0 0.8rem; height: 36px; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; justify-content: center;">
                                                    <i class="fa-solid fa-paper-plane"></i>
                                                </button>
                                            </form>
                                        `}
                                    </div>
                                </div>
                            ` : '';

                            return `
                                <div class="thread-item ${isSelected ? 'selected' : ''}" data-chat-id="${c.id}" style="display: flex; flex-direction: column; align-items: stretch; gap: 0.5rem; padding: 0.7rem; border-radius: var(--radius-sm); cursor: pointer; margin-bottom: 0.35rem; transition: all 0.2s; background: ${bgColor}; border: 1px solid ${borderColor}; border-left: 5px solid ${leftBorderColor} !important;">
                                    <div style="display: flex; align-items: center; gap: 0.8rem; width: 100%;">
                                        <img src="${avatar}" style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover; flex-shrink: 0;">
                                        <div style="flex: 1; min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
                                            <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${name}</span>
                                            ${isUnread ? '<span style="width: 8px; height: 8px; border-radius: 50%; background: var(--color-cyan); display: inline-block; flex-shrink: 0;"></span>' : ''}
                                        </div>
                                    </div>
                                    ${inlineChatHtml}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Right Detail View: Chat Messages & Controls -->
                <div class="postbox-chat-detail" style="flex: 1; background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--radius-md); display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-sm); height: 100%;">
                    ${!activeChat ? `
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); padding: 2rem; text-align: center;">
                            <i class="fa-regular fa-comments" style="font-size: 3.5rem; color: var(--border-glass); margin-bottom: 1rem;"></i>
                            <h4 style="margin: 0 0 0.5rem; color: var(--text-main);">WÄhle einen Unterhaltung aus</h4>
                            <p style="max-width: 360px; font-size: 0.85rem;">Klicke links auf eine Nachricht, um den Verlauf zu sehen und zu antworten.</p>
                        </div>
                    ` : (() => {
                        const isSys = activeChat.participants.includes('system');
                        const counterpartyId = activeChat.participants.find(id => id !== currentUserId) || activeChat.participants[0];
                        let name = "System";
                        let avatar = "https://picsum.photos/id/1025/100/100";

                        if (!isSys) {
                            const counterMus = state.musicians.find(m => m.id === counterpartyId);
                            const counterOrg = state.events.find(e => e.id === counterpartyId) || state.events.find(e => e.creatorId === counterpartyId);
                            if (counterMus) {
                                name = counterMus.name;
                                avatar = counterMus.profilePic || "https://picsum.photos/id/453/100/100";
                            } else if (counterOrg) {
                                name = counterOrg.name || counterOrg.contactName || "Veranstalter";
                                avatar = "https://picsum.photos/id/111/100/100";
                            } else {
                                name = "Gelöschter Nutzer";
                                avatar = "https://picsum.photos/id/1025/100/100";
                            }
                        }

                        // Determine if input should be locked for organizers in "Anfrage erhalten"
                        let isOrganizerIncomingLock = false;
                        let lockEventId = activeChat.eventId;
                        let lockMusicianId = counterpartyId;

                        if (!isMusician && !isSys) {
                            const interest = state.interests?.find(i => i.musicianId === lockMusicianId && (lockEventId ? i.eventId === lockEventId : true));
                            const isPerfect = interest && interest.musicianInterested && interest.organizerInterested;
                            const isDeclined = interest && interest.organizerNoInterest;
                            if (!isPerfect && !isDeclined && activeTab === 'received') {
                                isOrganizerIncomingLock = false;
                            }
                        }

                        // Mark chat as read
                        state.markChatAsRead(activeChat.id);

                        return `
                            <!-- Chat Header -->
                            <div style="padding: 0.9rem 1.2rem; border-bottom: 1px solid var(--border-glass); background: rgba(255,255,255,0.01); display: flex; align-items: center; gap: 0.8rem;">
                                <img src="${avatar}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                                <div>
                                    <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--text-main);">${name}</h4>
                                    <span style="font-size: 0.72rem; color: var(--text-muted);">${isSys ? 'Offizielle Mitteilung' : (isMusician ? 'Veranstalter' : 'Musiker')}</span>
                                </div>
                            </div>

                            <!-- Chat Messages Body -->
                            <div class="chat-messages-container" style="flex: 1; padding: 1.2rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.8rem;">
                                ${(activeChat.messages || []).length === 0 ? `
                                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); text-align: center; padding: 2rem;">
                                        <i class="fa-regular fa-paper-plane" style="font-size: 2.5rem; color: var(--border-glass); margin-bottom: 0.8rem;"></i>
                                        <p style="font-size: 0.85rem; margin: 0;">Keine Nachrichten vorhanden. Schreibe eine Nachricht, um das Gespräch zu beginnen!</p>
                                    </div>
                                ` : (activeChat.messages || []).map(m => {
                                    const isMe = m.senderId === currentUserId;
                                    const isSysMsg = m.senderId === 'system';
                                    const senderRole = isMe
                                        ? (state.currentUser ? state.currentUser.role : 'musician')
                                        : ((state.currentUser && state.currentUser.role === 'musician') ? 'organizer' : 'musician');
                                    
                                    let bubbleStyle = '';
                                    if (isSysMsg) {
                                        bubbleStyle = 'background: rgba(255,255,255,0.05); color: var(--text-main); border: 1px solid var(--border-glass);';
                                    } else if (senderRole === 'musician') {
                                        bubbleStyle = 'background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: #ffffff;';
                                    } else {
                                        bubbleStyle = 'background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); color: #ffffff;';
                                    }
                                    const radiusStyle = isMe ? 'border-bottom-right-radius: 2px;' : 'border-bottom-left-radius: 2px;';

                                    return `
                                        <div style="display: flex; justify-content: ${isMe ? 'flex-end' : 'flex-start'};">
                                            <div style="max-width: 75%; padding: 0.75rem 1rem; border-radius: 12px; font-size: 0.85rem; line-height: 1.4; ${bubbleStyle} ${radiusStyle}">
                                                <div>${m.text}</div>
                                                <div style="font-size: 0.65rem; opacity: 0.7; text-align: right; margin-top: 0.3rem;">
                                                    ${new Date(m.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>

                            <!-- Lock Questionnaire or Message Input Footer -->
                            <div style="padding: 1rem; border-top: 1px solid var(--border-glass); background: rgba(255,255,255,0.01);">
                                ${isOrganizerIncomingLock ? `
                                    <div class="organizer-questionnaire-box" style="background: rgba(124, 58, 237, 0.08); border: 1px solid var(--color-purple); border-radius: var(--radius-md); padding: 1.2rem; text-align: center;">
                                        <h4 style="margin: 0 0 0.4rem; font-family: var(--font-heading); font-size: 1rem; color: var(--text-main);">
                                            Ist die Anfrage interessant für dich?
                                        </h4>
                                        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">
                                            Stimme der Anfrage zu, um automatisch ein <strong>Perfect Match</strong> zu erstellen und das Antworten freizuschalten.
                                        </p>
                                        <div style="display: flex; gap: 1rem; justify-content: center;">
                                            <button class="btn btn-sm btn-glass btn-decline-incoming-req" data-musician-id="${lockMusicianId}" data-event-id="${lockEventId || ''}" style="color: var(--color-red); border-color: rgba(255,75,75,0.3); margin:0;">
                                                <i class="fa-solid fa-xmark"></i> Nein, ablehnen
                                            </button>
                                            <button class="btn btn-sm btn-primary btn-accept-incoming-req" data-musician-id="${lockMusicianId}" data-event-id="${lockEventId || ''}" style="background: var(--color-green); border-color: var(--color-green); color: #000; font-weight: 800; margin:0;">
                                                <i class="fa-solid fa-check"></i> Ja, kontaktieren
                                            </button>
                                        </div>
                                    </div>
                                ` : `
                                    <form id="chat-send-form" style="display: flex; gap: 0.8rem;">
                                        <input type="text" id="chat-message-input" class="input-field" placeholder="${isSys ? 'Antworten auf Systemnachrichten nicht mÖglich' : 'Schreibe eine Nachricht...'}" ${isSys ? 'disabled' : ''} required style="flex: 1; margin: 0; height: 42px;">
                                        <button type="submit" class="btn btn-primary" ${isSys ? 'disabled' : ''} style="margin: 0; padding: 0 1.2rem; height: 42px; font-weight: 700; background: ${isMusician ? 'var(--color-purple)' : '#2563eb'}; border-color: ${isMusician ? 'var(--color-purple)' : '#2563eb'};">
                                            <i class="fa-solid fa-paper-plane"></i> Senden
                                        </button>
                                    </form>
                                `}
                            </div>
                        `;
                    })()}
                </div>
            </div>
        `;

        // Add Event Listeners for tabs & buttons
        container.querySelectorAll('.tab-btn-postbox').forEach(btn => {
            btn.addEventListener('click', () => {
                activeTab = btn.getAttribute('data-tab');
                renderView();
            });
        });

        container.querySelectorAll('.thread-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.closest('.mobile-chat-accordion')) {
                    return;
                }
                const clickedChatId = item.getAttribute('data-chat-id');
                if (activeChatId === clickedChatId) {
                    activeChatId = null;
                } else {
                    activeChatId = clickedChatId;
                    state.markChatAsRead(clickedChatId); // Force mark as read immediately on click!
                }
                renderView();
            });
        });

        // Question accept/decline handlers (supports both desktop and mobile layouts)
        container.querySelectorAll('.btn-accept-incoming-req').forEach(btn => {
            btn.addEventListener('click', async () => {
                const mId = btn.getAttribute('data-musician-id');
                const eId = btn.getAttribute('data-event-id');
                await state.acceptMusicianRequest(mId, eId);
                showToast({
                    title: "Perfect Match entstanden! 🎉",
                    message: "Ihr habt nun gegenseitig Interesse bekundet. Du kannst jetzt direkt antworten."
                });
                activeTab = 'received';
                renderView();
            });
        });

        container.querySelectorAll('.btn-decline-incoming-req').forEach(btn => {
            btn.addEventListener('click', async () => {
                const mId = btn.getAttribute('data-musician-id');
                const eId = btn.getAttribute('data-event-id');
                await state.declineMusicianRequest(mId, eId);
                showToast({
                    title: "Anfrage abgelehnt",
                    message: "Die Anfrage wurde als nicht interessant markiert."
                });
                renderView();
            });
        });

        // Send message form handler (Desktop)
        const sendForm = container.querySelector('#chat-send-form');
        if (sendForm) {
            sendForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const input = container.querySelector('#chat-message-input');
                const text = input.value.trim();
                if (!text || !activeChat) return;

                const counterpartyId = activeChat.participants.find(id => id !== currentUserId) || activeChat.participants[0];
                const res = await state.sendMessage(counterpartyId, text, activeChat.eventId);
                if (res && !res.success) {
                    showToast({
                        title: "Fehler beim Senden ⚠️",
                        message: res.message || "Nachricht konnte nicht gespeichert werden."
                    });
                } else {
                    input.value = '';
                }
            });
        }

        // Send message form handler (Mobile Accordion)
        container.querySelectorAll('.chat-send-form-mobile').forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const input = form.querySelector('.chat-message-input-mobile');
                const text = input.value.trim();
                if (!text || !activeChat) return;

                const counterpartyId = activeChat.participants.find(id => id !== currentUserId) || activeChat.participants[0];
                const res = await state.sendMessage(counterpartyId, text, activeChat.eventId);
                if (res && !res.success) {
                    showToast({
                        title: "Fehler beim Senden ⚠️",
                        message: res.message || "Nachricht konnte nicht gespeichert werden."
                    });
                } else {
                    input.value = '';
                }
            });
        });

        const toggleFiltersBtn = container.querySelector('#btn-toggle-postbox-filters');
        if (toggleFiltersBtn) {
            toggleFiltersBtn.addEventListener('click', () => {
                window.postboxShowFilters = !window.postboxShowFilters;
                renderView();
            });
        }

        const postboxProfileSelect = container.querySelector('#postbox-profile-select');
        if (postboxProfileSelect) {
            postboxProfileSelect.addEventListener('change', function() {
                const val = this.value;
                if (state.currentUser) {
                    if (state.currentUser.role === 'musician') {
                        state.activeMusicianId = val;
                    } else {
                        state.activeEventId = val;
                    }
                    state.saveState();
                    renderPostbox(container);
                }
            });
        }

        // Auto-scroll chat message containers to the bottom
        const scrollContainers = container.querySelectorAll('.chat-messages-container');
        scrollContainers.forEach(el => {
            el.scrollTop = el.scrollHeight;
            setTimeout(() => {
                el.scrollTop = el.scrollHeight;
            }, 50);
        });
    };

    renderView();
}

function formatTruncatedValue(val, themeColor, itemId, uniqueType) {
    if (!val) return 'Keine Angabe';
    
    const mapVal = (v) => {
        const s = String(v).trim();
        const sLower = s.toLowerCase();
        if (sLower === 'klavier/piano') return 'Klavier';
        if (sLower === 'percussion/cajÃ³n' || sLower === 'percussion/cajon' || sLower === 'cajon') return 'Percussion';
        if (sLower === 'r&b/soul') return 'R&B, Soul';
        return s;
    };

    let fullText = '';
    if (Array.isArray(val)) {
        fullText = val.map(mapVal).join(', ');
    } else {
        fullText = mapVal(val);
    }
    
    if (fullText.length === 0) return 'Keine Angabe';
    
    // Max one line: truncate if content exceeds 26 characters (keeps plus button on first line)
    if (fullText.length <= 26) {
        return fullText;
    }
    
    // Find a clean split point near index 15-22 (prefer comma, then space, then fallback to 18)
    let splitIdx = 18;
    const searchArea = fullText.slice(12, 24);
    const lastCommaIdx = searchArea.lastIndexOf(',');
    if (lastCommaIdx !== -1) {
        splitIdx = 12 + lastCommaIdx + 1; // split right after comma
    } else {
        const lastSpaceIdx = searchArea.lastIndexOf(' ');
        if (lastSpaceIdx !== -1) {
            splitIdx = 12 + lastSpaceIdx; // split at space
        }
    }
    
    const visiblePart = fullText.slice(0, splitIdx).trim();
    const hiddenPart = fullText.slice(splitIdx);
    const hiddenId = `more-${uniqueType}-${itemId}`;
    
    return `
        <span>${visiblePart}</span><span id="${hiddenId}" style="display: none;">${hiddenPart}</span><span onclick="event.stopPropagation(); window.toggleTruncatedList(this, '${hiddenId}')" style="color: ${themeColor}; font-weight: 900; cursor: pointer; margin-left: 0.5rem; display: inline-flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.25); width: 26px; height: 26px; border-radius: 50%; font-size: 1.15rem; vertical-align: middle; line-height: 1; transition: all 0.2s; padding-bottom: 2px; box-sizing: border-box;" onmouseover="this.style.background='rgba(255,255,255,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.25)'" title="Mehr anzeigen">+</span>
    `;
}

function renderMarketGridHTML(items, isEvents, isLandingPage = false) {
    if (!items || items.length === 0) {
        return `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-glass);">
                <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                <h3 style="margin-bottom: 0.5rem; color: var(--text-main);">Keine Ergebnisse gefunden</h3>
                <p style="color: var(--text-muted);">Versuche deine Filterkriterien anzupassen.</p>
            </div>
        `;
    }

    const themeColor = isEvents ? '#7c3aed' : '#2563eb';
    const footerGradient = isEvents 
        ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' 
        : 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)';

    return items.map(item => {
        const isUnlocked = state ? ((typeof state.isUnlocked === 'function') ? state.isUnlocked(item.id) : (state.unlockedContacts && state.unlockedContacts.includes(item.id))) : false;
        
        // Up to 5 photos
        const photos = (item.photos && item.photos.length > 0)
            ? item.photos.slice(0, 5)
            : [
                item.image || (isEvents ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80')
              ];

        // Up to 3 videos
        const videos = (item.videos && item.videos.length > 0)
            ? item.videos.slice(0, 3)
            : [];

        // Up to 3 audios
        const audios = (item.audio && item.audio.length > 0)
            ? item.audio.slice(0, 3)
            : [];
        
        // Dynamically compute button styles based on page context and type
        const btnIsPurple = isEvents;
        const btnGradient = btnIsPurple 
            ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' 
            : 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)';
        const btnBorderColor = btnIsPurple ? '#7c3aed' : '#1e40af';
        const btnBoxShadow = btnIsPurple 
            ? '0 4px 14px rgba(124, 58, 237, 0.35)' 
            : '0 4px 14px rgba(37, 99, 235, 0.35)';

        const genresArr = item.genres || (item.genre ? [item.genre] : ['Pop', 'Cover', 'Acoustic']);
        const instrumentsArr = item.instruments || (item.category ? [item.category] : ['Gesang', 'Gitarre']);
        const techArr = Array.isArray(item.technik) 
            ? item.technik 
            : (typeof item.technik === 'string' && item.technik.trim() !== '' ? item.technik.split(',').map(s => s.trim()) : []);
        
        // Date formatting (German)
        let dateDisplay = isEvents ? formatEventDateWithTime(item) : formatMusicianAvailabilityHelper(item);

        // Duration formatting (ends with "Stunden")
        let durationDisplay = '';
        const minDur = item.minDuration;
        const maxDur = item.maxDuration;
        if (minDur !== undefined && minDur !== null) {
            const minStr = String(minDur).replace('.', ',');
            if (maxDur !== undefined && maxDur !== null && maxDur !== minDur) {
                const maxStr = String(maxDur).replace('.', ',');
                durationDisplay = `${minStr} - ${maxStr} Stunden`;
            } else {
                durationDisplay = `${minStr} Stunden`;
            }
        } else {
            let baseDur = String(item.duration || item.spieldauer || '2 - 4');
            baseDur = baseDur.replace(/ca\.\s*/gi, '').replace(/\s*Stunden\.?/gi, '').trim();
            durationDisplay = `${baseDur} Stunden`;
        }

        // Budget formatting (ends with "€")
        let budgetDisplay = '';
        const minB = item.minBudget !== undefined ? item.minBudget : item.price;
        const maxB = item.maxBudget;
        if (minB !== undefined && minB !== null) {
            const minBStr = typeof minB === 'number' ? minB.toLocaleString('de-DE') : String(minB);
            if (maxB !== undefined && maxB !== null && maxB !== minB) {
                const maxBStr = typeof maxB === 'number' ? maxB.toLocaleString('de-DE') : String(maxB);
                budgetDisplay = `${minBStr} - ${maxBStr} €`;
            } else {
                budgetDisplay = `${minBStr} €`;
            }
        } else {
            budgetDisplay = '0 - 5.000 €';
        }

        const description = item.description || item.bio || (isEvents 
            ? 'Wir suchen eine professionelle musikalische Begleitung für unser anstehendes Event mit fantastischer Stimmung.' 
            : 'Professionelle Live-Musik für unvergessliche Momente bei Hochzeiten, Geburtstagen & Firmenevents.');

        const bandName = item.name || item.title || '';

        return `
            <div class="market-tile-card" style="cursor: default; background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm);">
                
                <!-- 1. Combined Galerie: Photos + Videos + Audios direkt folgend -->
                <div class="tile-fullwidth-photo-slider" style="position: relative; width: 100%; height: 235px; background: #0f172a; overflow: hidden;">
                    
                    <span class="tile-gallery-counter" style="position: absolute; bottom: 12px; left: 12px; z-index: 4; font-size: 0.7rem; font-weight: 700; color: #fff; background: rgba(15, 23, 42, 0.75); padding: 0.25rem 0.5rem; border-radius: 6px; backdrop-filter: blur(4px); pointer-events: none; border: 1px solid rgba(255,255,255,0.1);">
                        📷 1 / ${photos.length}
                    </span>

                    <div id="combo-slider-${item.id}" data-idx="0" style="display: flex; width: 100%; height: 100%; transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);">
                        
                        <!-- Slides: Fotos -->
                        ${photos.map((img) => `
                            <div style="width: 100%; height: 100%; flex-shrink: 0; position: relative;">
                                <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        `).join('')}

                        <!-- Slides: Nativ abspielbare HTML5 Videos -->
                        ${videos.map((vid, vIdx) => `
                            <div style="width: 100%; height: 100%; flex-shrink: 0; position: relative; background: #000; display: flex; align-items: center; justify-content: center;">
                                <video controls preload="metadata" poster="${photos[vIdx % photos.length]}" style="width: 100%; height: 100%; object-fit: cover;" onclick="event.stopPropagation();">
                                    <source src="${vid.url}" type="video/mp4">
                                    Dein Browser unterstützt dieses Video nicht.
                                </video>
                            </div>
                        `).join('')}

                        <!-- Slides: Nativ abspielbare HTML5 Audios -->
                        ${audios.map((aud, aIdx) => `
                            <div style="width: 100%; height: 100%; flex-shrink: 0; position: relative; background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1rem; box-sizing: border-box;">
                                <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(6, 182, 212, 0.15); display: flex; align-items: center; justify-content: center; margin-bottom: 0.8rem; box-shadow: 0 0 15px rgba(6, 182, 212, 0.4); border: 1px solid rgba(6, 182, 212, 0.3);">
                                    <i class="fa-solid fa-music" style="color: #06b6d4; font-size: 1.4rem;"></i>
                                </div>
                                <span style="font-size: 0.82rem; font-weight: 700; color: #f8fafc; text-align: center; margin-bottom: 0.6rem; max-width: 80%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
                                    Hörprobe: ${aud.title || 'Demo'}
                                </span>
                                <audio controls preload="metadata" style="width: 85%; height: 32px; outline: none; border-radius: 8px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));" onclick="event.stopPropagation();">
                                    <source src="${aud.url}" type="audio/mp3">
                                    Dein Browser unterstützt diesen Audioplayer nicht.
                                </audio>
                            </div>
                        `).join('')}

                        <!-- Last Slide: Beschreibung (schwarz mit weisser Schrift) -->
                        <div style="width: 100%; height: 100%; flex-shrink: 0; position: relative; background: #0f172a; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 0.3rem 4.2rem 0.5rem; box-sizing: border-box; text-align: center;">
                            <p style="font-size: 0.84rem; font-weight: 500; color: #f8fafc; line-height: 1.5; margin: 0; max-height: 145px; overflow-y: auto; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
                                ${description}
                            </p>
                        </div>
                    </div>

                    <!-- Match-Faktor Badge rechts mittig -->
                    <div style="position: absolute; top: 50%; transform: translateY(-50%); right: 12px; z-index: 5; background: ${isEvents ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' : 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)'}; color: #fff; padding: 0.35rem 0.45rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.25); box-shadow: 0 5px 12px rgba(0,0,0,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.1; min-width: 50px;">
                        <span style="font-size: 1.05rem; font-weight: 900;">${item.matchScore !== undefined ? item.matchScore : '96'}%</span>
                        <span style="font-size: 0.5rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; opacity: 0.95; margin-top: 1px;">Match</span>
                    </div>
                </div>

                <!-- Dots container below the slider, but very close -->
                <div class="tile-gallery-dots" id="combo-dots-${item.id}" data-theme="${themeColor}" style="display: flex; justify-content: center; gap: 6px; margin: 0.5rem auto 0; align-items: center;">
                    ${Array.from({ length: photos.length + videos.length + audios.length + 1 }).map((_, dIdx) => `
                        <span class="tile-gallery-dot${dIdx === 0 ? ' active' : ''}" style="width: 6px; height: 6px; border-radius: 50%; background: ${dIdx === 0 ? themeColor : 'var(--text-muted)'}; opacity: ${dIdx === 0 ? '1' : '0.4'}; transition: all 0.2s ease; transform: ${dIdx === 0 ? 'scale(1.2)' : 'scale(1)'};"></span>
                    `).join('')}
                </div>

                <!-- Tile Body Content -->
                <div class="tile-body-content" style="padding: 0.9rem 1.3rem 0.8rem; flex: 1; display: flex; flex-direction: column;">
                    
                    <!-- Band/Event Name unter dem Bild (Fett gedruckt) + Favorit Herz -->
                    <div style="margin-bottom: 0.8rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
                        <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0; line-height: 1.2; flex: 1; height: 2.4em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: break-word;">
                            ${bandName}
                        </h3>
                        <div style="display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0; margin-top: 0.15rem;">
                            ${item.matchScore >= 70 ? `
                                <span title="Top Match" style="color: #eab308; display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; cursor: default;">
                                    <i class="fa-solid fa-star" style="font-size: 1.2rem;"></i>
                                </span>
                            ` : ''}
                            <button onclick="event.stopPropagation(); window.toggleFavorite('${item.id}')" style="background: none; border: none; padding: 0.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; outline: none;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Zu Favoriten hinzufÃ¼gen/entfernen">
                                ${(state && typeof state.isFavorite === 'function' && state.isFavorite(item.id)) ? `
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" width="22" height="22" style="display: block;">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                ` : `
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff" stroke="#ef4444" stroke-width="2" width="22" height="22" style="display: block;">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                `}
                            </button>
                        </div>
                    </div>

                                        <!-- 2. Einspaltige Informationen mit Icons (Reihenfolge nach Benutzer-Anforderungen) -->
                    <div class="tile-info-list" style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.88rem; color: var(--text-main); margin-bottom: 0.75rem;">
                        <!-- 1. Ort -->
                        <div style="display: flex; align-items: flex-start; gap: 0.75rem; line-height: 1.35;">
                            <i class="fa-solid fa-location-dot" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem; margin-top: 0.15rem;"></i>
                            <span style="flex: 1;">${formatTruncatedValue(window.normalizeCityName(item.location || 'Deutschlandweit'), themeColor, item.id, 'location')}</span>
                        </div>
                        
                        ${isEvents ? `
                        <!-- 2. Datum -->
                        <div style="display: flex; align-items: flex-start; gap: 0.75rem; line-height: 1.35;">
                            <i class="fa-solid fa-calendar-days" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem; margin-top: 0.15rem;"></i>
                            <span style="flex: 1;">${formatTruncatedValue(dateDisplay, themeColor, item.id, 'date')}</span>
                        </div>
                        <!-- 3. Event-Art (Event-Typ) -->
                        <div style="display: flex; align-items: flex-start; gap: 0.75rem; line-height: 1.35;">
                            <i class="fa-solid fa-calendar-check" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem; margin-top: 0.15rem;"></i>
                            <span style="flex: 1;">${formatTruncatedValue(item.type || item.eventType || 'Event', themeColor, item.id, 'eventtype')}</span>
                        </div>
                        <!-- 4. Gesuchter Musiker-Typ -->
                        <div style="display: flex; align-items: flex-start; gap: 0.75rem; line-height: 1.35;">
                            <i class="fa-solid fa-guitar" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem; margin-top: 0.15rem;"></i>
                            <span style="flex: 1;">Gesucht: ${formatTruncatedValue((Array.isArray(item.musicianTypes) && item.musicianTypes.length > 0) ? item.musicianTypes : (typeof item.musicianTypes === 'string' && item.musicianTypes.trim() !== '' ? item.musicianTypes : (item.musicianType || 'Solo / Band')), themeColor, item.id, 'musiciantype')}</span>
                        </div>
                        ` : `
                        <!-- 2. VerfÃ¼gbarkeit -->
                        <div style="display: flex; align-items: flex-start; gap: 0.75rem; line-height: 1.35;">
                            <i class="fa-solid fa-calendar-days" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem; margin-top: 0.15rem;"></i>
                            <span style="flex: 1;">${formatTruncatedValue(dateDisplay, themeColor, item.id, 'avail')}</span>
                        </div>
                        <!-- 3. Musiker-Typ -->
                        <div style="display: flex; align-items: flex-start; gap: 0.75rem; line-height: 1.35;">
                            <i class="fa-solid fa-guitar" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem; margin-top: 0.15rem;"></i>
                            <span style="flex: 1;">${formatTruncatedValue(item.type || item.category || 'Solo / Band', themeColor, item.id, 'mustype')}</span>
                        </div>
                        <!-- Bevorzugte Event-Typen -->
                        <div style="display: flex; align-items: flex-start; gap: 0.75rem; line-height: 1.35;">
                            <i class="fa-solid fa-calendar-check" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem; margin-top: 0.15rem;"></i>
                            <span style="flex: 1;">Event-Typen (Gesucht): ${formatTruncatedValue(item.eventTypes && item.eventTypes.length > 0 ? item.eventTypes : ['Hochzeit', 'Geburtstag', 'Firmenfeier'], themeColor, item.id, 'eventtypes')}</span>
                        </div>
                        `}

                        <!-- 4. Genres -->
                        <div style="display: flex; align-items: flex-start; gap: 0.75rem; line-height: 1.35;">
                            <i class="fa-solid fa-music" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem; margin-top: 0.15rem;"></i>
                            <span style="flex: 1;">${formatTruncatedValue(genresArr, themeColor, item.id, 'genres')}</span>
                        </div>
                        
                        <!-- Publikum / GÃ¤ste -->
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-users" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${item.minPublikum !== undefined && item.maxPublikum !== undefined ? `${item.minPublikum} - ${item.maxPublikum}+` : (isEvents ? '50 - 150' : '0 - 500+')} Personen</span>
                        </div>
                        
                        <!-- 7. Technik -->
                        <div style="display: flex; align-items: flex-start; gap: 0.75rem; line-height: 1.35;">
                            <i class="fa-solid fa-microchip" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem; margin-top: 0.15rem;"></i>
                            <span style="flex: 1;">${techArr.length > 0 ? formatTruncatedValue(techArr, themeColor, item.id, 'tech') : 'Technik ist noch unklar'}</span>
                        </div>

                        <!-- 8. Budget / Gage (last) -->
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-sack-dollar" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${isEvents ? 'Budget' : 'Gage'}: ${budgetDisplay}</span>
                        </div>
                    </div>
                </div>

                ${isUnlocked ? `
                    <!-- Solid Colored Unlocked Contact Footer Box -->
                    <div style="border-top: 1px solid rgba(255, 255, 255, 0.15); padding: 1rem 1.3rem; background: ${footerGradient}; color: #ffffff; display: flex; flex-direction: column; gap: 0.8rem; border-radius: 0 0 18px 18px;">
                        <!-- Row of circular action buttons -->
                        <div style="display: flex; align-items: center; justify-content: center; gap: 1.2rem;">
                            <!-- Organizer Type Button -->
                            <button class="market-contact-btn" onclick="event.stopPropagation(); window.revealMarketContact('${item.id}', 'company', '${(item.company || 'Privatperson').replace(/'/g, "\\'")}', this)" 
                                    title="Veranstalter-Typ anzeigen">
                                <i class="fa-solid fa-building"></i>
                            </button>

                            <!-- Contact Name Button -->
                            <button class="market-contact-btn" onclick="event.stopPropagation(); window.revealMarketContact('${item.id}', 'name', '${(item.contactName || 'Demo Kontakt').replace(/'/g, "\\'")}', this)" 
                                    title="Vor- und Nachname anzeigen">
                                <i class="fa-solid fa-user"></i>
                            </button>

                            <!-- Phone Button -->
                            <button class="market-contact-btn" onclick="event.stopPropagation(); window.revealMarketContact('${item.id}', 'phone', '${(item.hidePhone && !(state && state.currentUser && (item.creatorId === state.currentUser.id || item.id === state.currentUser.profileId))) ? 'Vom Nutzer ausgeblendet' : (item.phone || '+49 170 1234567')}', this)" 
                                    title="Telefonnummer anzeigen">
                                <i class="fa-solid fa-phone"></i>
                            </button>

                            <!-- Email Button -->
                            <button class="market-contact-btn" onclick="event.stopPropagation(); window.revealMarketContact('${item.id}', 'email', '${item.email || 'kontakt@gigconnact.de'}', this)" 
                                    title="E-Mail-Adresse anzeigen">
                                <i class="fa-solid fa-envelope"></i>
                            </button>

                            <!-- Chat / Message Button -->
                            <button class="market-contact-btn" onclick="event.stopPropagation(); window.revealMarketContact('${item.id}', 'chat', '${isEvents ? item.creatorId : item.id}|${(item.name || item.title || '').replace(/'/g, "\\'")}|${isEvents ? item.id : ''}', this)" 
                                    title="Nachricht schreiben">
                                <i class="fa-solid fa-comments"></i>
                            </button>
                        </div>

                        <!-- Reveal panel for contact data -->
                        <div id="contact-reveal-${item.id}" style="display: none; width: 100%; box-sizing: border-box; text-align: center; font-size: 0.82rem; padding: 0.55rem; background: rgba(255,255,255,0.15); border-radius: 8px; animation: fadeIn 0.2s; word-break: break-all;"></div>
                    </div>
                ` : `
                    <!-- 4. Aktions-Button: "Kontaktdaten freischalten" -->
                    <div class="tile-action-container" style="padding: 0 1.3rem 1.1rem;">
                        <button class="btn btn-primary" onclick="event.stopPropagation(); showModal('auth')" style="width: 100%; background: ${btnGradient} !important; border-color: ${btnBorderColor} !important; font-weight: 800; padding: 0.8rem; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 0.6rem; font-size: 0.88rem; box-shadow: ${btnBoxShadow} !important;">
                            <i class="fa-solid fa-lock"></i> Kontaktdaten freischalten
                        </button>
                    </div>
                `}
            </div>
        `;
    }).join('');
}

// Safe State Initialization
try {
    state = new StateManager();
} catch (e) {
    console.error("StateManager failsafe init error, using fallback:", e);
}
console.log("StateManager initialized. Events IDs:", state.events.map(e => e.id).join(", "));

if (!state) {
    state = {
        currentUser: null,
        musicians: typeof initialMusicians !== 'undefined' ? initialMusicians : [],
        events: typeof initialEvents !== 'undefined' ? initialEvents : [],
        matches: [],
        messages: [],
        unlockedContacts: [],
        getUnreadCount() { return 0; },
        notify() {},
        subscribe() {},
        saveState() {},
        loadState() {}
    };
}

// Immediate Synchronous Execution
try {
    if (typeof updateNavbar === 'function') updateNavbar();
    if (typeof handleRouting === 'function') handleRouting();
    if (typeof initAllLocationAutocompletes === 'function') initAllLocationAutocompletes();
} catch (err) {
    console.error("Direct sync execution error:", err);
}

// ==========================================
// CAROUSEL SLIDER LOGIC (v3600)
// ==========================================
window.carouselPositions = { musicians: 0, events: 0 };

window.slideCarousel = function(type, direction) {
    const track = document.getElementById(`carousel-track-${type}`);
    if (!track) return;
    
    const cards = track.querySelectorAll('.market-tile-card');
    const totalCards = cards.length;
    if (totalCards === 0) return;
    
    // Determine how many cards are visible
    let visibleCards = 3;
    if (window.innerWidth <= 600) {
        visibleCards = 1;
    } else if (window.innerWidth <= 900) {
        visibleCards = 2;
    }
    
    const maxIndex = totalCards - visibleCards;
    let newIndex = (window.carouselPositions[type] || 0) + direction;
    
    // Circular loop boundaries
    if (newIndex < 0) {
        newIndex = maxIndex;
    } else if (newIndex > maxIndex) {
        newIndex = 0;
    }
    
    window.carouselPositions[type] = newIndex;
    
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = visibleCards === 1 ? 0 : 32; // 2rem gap = 32px
    const translateAmount = newIndex * (cardWidth + gap);
    
    track.style.transform = `translateX(-${translateAmount}px)`;
    
    // Auto-update dots
    if (maxIndex > 0) {
        const dotIndex = Math.round((newIndex / maxIndex) * 4);
        window.updateCarouselDots(type, dotIndex);
    }
};

window.jumpToCarouselSlide = function(type, dotIndex) {
    const track = document.getElementById(`carousel-track-${type}`);
    if (!track) return;
    const cards = track.querySelectorAll('.market-tile-card');
    const totalCards = cards.length;
    if (totalCards === 0) return;
    
    let visibleCards = 3;
    if (window.innerWidth <= 600) {
        visibleCards = 1;
    } else if (window.innerWidth <= 900) {
        visibleCards = 2;
    }
    const maxIndex = totalCards - visibleCards;
    if (maxIndex <= 0) return;
    
    let targetIndex = Math.round((dotIndex / 4) * maxIndex);
    if (targetIndex > maxIndex) targetIndex = maxIndex;
    if (targetIndex < 0) targetIndex = 0;
    
    window.carouselPositions[type] = targetIndex;
    
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = visibleCards === 1 ? 0 : 32;
    const translateAmount = targetIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${translateAmount}px)`;
    
    window.updateCarouselDots(type, dotIndex);
};

window.updateCarouselDots = function(type, dotIndex) {
    const dotsContainer = document.getElementById(`carousel-dots-${type}`);
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
        if (idx === dotIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
};

window.toggleCategoriesRow = function(type) {
    const row2 = document.getElementById(`row2-categories-${type}`);
    if (!row2) return;
    const isHidden = row2.style.display === 'none' || row2.style.display === '';
    if (isHidden) {
        row2.style.display = 'flex';
    } else {
        row2.style.display = 'none';
    }
};

window.toggleAllFilterCheckboxes = function(element, checkAll) {
    // Traverse up to find the card wrapping container
    const section = element.closest('div[style*="background:"]');
    if (!section) return;
    const checkboxes = section.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = checkAll;
    });
    // Mark the grid as interacted
    const grid = section.querySelector('.checkbox-tag-grid');
    if (grid) {
        grid.dataset.interacted = 'true';
    }
    // Apply filters and sort
    if (typeof window.marketApplyFilters === 'function') {
        window.marketApplyFilters();
    }
};

window.toggleTruncatedList = function(element, hiddenId) {
    const hiddenSpan = document.getElementById(hiddenId);
    if (!hiddenSpan) return;
    const isHidden = hiddenSpan.style.display === 'none';
    if (isHidden) {
        hiddenSpan.style.display = 'inline';
        element.innerHTML = '−';
        element.setAttribute('title', 'Weniger anzeigen');
    } else {
        hiddenSpan.style.display = 'none';
        element.innerHTML = '+';
        element.setAttribute('title', 'Mehr anzeigen');
    }
};

window.initCarouselTouch = function(type) {
    const track = document.getElementById(`carousel-track-${type}`);
    if (!track) return;
    const viewport = track.parentElement;
    if (!viewport) return;
    let startX = 0;
    let startY = 0;
    let isSwiping = false;
    
    viewport.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwiping = true;
    }, { passive: true });
    
    viewport.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;
        
        // If moving horizontally more than vertically, prevent vertical page scroll
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (e.cancelable) {
                e.preventDefault();
            }
        }
    }, { passive: false });
    
    viewport.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        if (Math.abs(diffX) > 40) {
            if (diffX > 0) {
                window.slideCarousel(type, 1);
            } else {
                window.slideCarousel(type, -1);
            }
        }
        isSwiping = false;
    }, { passive: true });
};

window.addMockEmail = function(subject, from, body) {
    const emailRecipient = state && state.currentUser ? state.currentUser.email : 'gast@gigconnact.de';
    let emails = [];
    try {
        emails = JSON.parse(localStorage.getItem('GigConnAct_mock_emails') || '[]');
    } catch(e) {
        emails = [];
    }
    emails.unshift({
        id: "mail_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        subject: subject,
        from: from,
        recipient: emailRecipient,
        body: body,
        date: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        read: false
    });
    localStorage.setItem('GigConnAct_mock_emails', JSON.stringify(emails));
    if (window.refreshMockEmailWidget) {
        window.refreshMockEmailWidget();
    }
};

function initMockEmailWidget() {
    let widget = document.getElementById('mock-email-widget');
    if (widget) widget.remove();

    widget = document.createElement('div');
    widget.id = 'mock-email-widget';
    widget.style.position = 'fixed';
    widget.style.bottom = '20px';
    widget.style.right = '20px';
    widget.style.zIndex = '99999';
    widget.style.fontFamily = 'var(--font-heading), sans-serif';
    document.body.appendChild(widget);

    if (!localStorage.getItem('GigConnAct_mock_emails')) {
        const initialEmails = [
            {
                id: "welcome_mail",
                subject: "Willkommen bei GigConnAct!",
                from: "GigConnAct Team <welcome@gigconnact.de>",
                recipient: "gast@gigconnact.de",
                body: "Hi! Willkommen auf GigConnAct. Dies ist dein simuliertes E-Mail-Postfach. Alle E-Mails, die das System an dich sendet (z.B. Registrierungs-Mails, Login-Links oder Benachrichtigungen über neue Chat-Nachrichten), werden als Vorschau direkt hier landen.",
                date: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
                read: true
            }
        ];
        localStorage.setItem('GigConnAct_mock_emails', JSON.stringify(initialEmails));
    }

    if (!document.getElementById('mock-email-widget-styles')) {
        const styles = document.createElement('style');
        styles.id = 'mock-email-widget-styles';
        styles.innerHTML = `
            @keyframes slideInUp {
                from { transform: translateY(100px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .mock-email-item:hover {
                background: rgba(255,255,255,0.05) !important;
            }
        `;
        document.head.appendChild(styles);
    }

    let isExpanded = false;
    let selectedEmailId = null;

    window.refreshMockEmailWidget = () => {
        let emails = [];
        try {
            emails = JSON.parse(localStorage.getItem('GigConnAct_mock_emails') || '[]');
        } catch(e) {
            emails = [];
        }
        const unreadCount = emails.filter(e => !e.read).length;

        if (!isExpanded) {
            widget.innerHTML = `
                <button id="btn-expand-mock-emails" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #fff; border: 1.5px solid rgba(255,255,255,0.15); border-radius: 30px; padding: 0.75rem 1.4rem; font-weight: 700; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 10px 25px rgba(0,0,0,0.5); transition: transform 0.2s; outline: none;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    <i class="fa-solid fa-envelope" style="color: #ef4444; font-size: 1.05rem;"></i>
                    <span>E-Mail Postfach (Simulation)</span>
                    ${unreadCount > 0 ? `
                        <span style="background: #ef4444; color: #fff; font-size: 0.7rem; font-weight: 900; min-width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 0 4px; box-sizing: border-box; margin-left: 4px;">${unreadCount}</span>
                    ` : ''}
                </button>
            `;
            document.getElementById('btn-expand-mock-emails').addEventListener('click', () => {
                isExpanded = true;
                selectedEmailId = null;
                window.refreshMockEmailWidget();
            });
        } else {
            let innerHTML = '';
            if (selectedEmailId) {
                const email = emails.find(e => e.id === selectedEmailId);
                if (!email) {
                    selectedEmailId = null;
                    window.refreshMockEmailWidget();
                    return;
                }
                innerHTML = `
                    <div style="padding: 0.6rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 0.5rem; background: rgba(0,0,0,0.2);">
                        <button id="btn-back-to-emails" style="background: none; border: none; color: #a855f7; cursor: pointer; padding: 0.2rem; display: flex; align-items: center; font-size: 0.85rem; font-weight: 700; outline: none;">
                            <i class="fa-solid fa-arrow-left" style="margin-right: 0.3rem;"></i> Zurück
                        </button>
                        <div style="flex: 1; text-align: right; font-size: 0.72rem; color: #94a3b8;">${email.date}</div>
                    </div>
                    <div style="padding: 1.25rem; flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem; text-align: left;">
                        <div>
                            <div style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 0.15rem;">Von:</div>
                            <div style="font-size: 0.84rem; font-weight: 700; color: #ffffff;">${email.from}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 0.15rem;">An:</div>
                            <div style="font-size: 0.84rem; color: #ffffff;">${email.recipient}</div>
                        </div>
                        <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.75rem;">
                            <div style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 0.15rem;">Betreff:</div>
                            <div style="font-size: 0.95rem; font-weight: 800; color: #a855f7; line-height: 1.35;">${email.subject}</div>
                        </div>
                        <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1rem; font-size: 0.85rem; color: #e2e8f0; line-height: 1.5; white-space: pre-wrap; word-break: break-word;">${email.body}</div>
                    </div>
                `;
            } else {
                innerHTML = `
                    <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; padding: 0.5rem; text-align: left;">
                        ${emails.length === 0 ? `
                            <div style="text-align: center; color: #94a3b8; padding: 3rem 1rem; font-size: 0.85rem;">
                                <i class="fa-regular fa-envelope-open" style="font-size: 2.5rem; color: rgba(255,255,255,0.1); margin-bottom: 0.75rem; display: block;"></i>
                                Keine simulierten E-Mails im Postfach.
                            </div>
                        ` : emails.map(email => `
                            <div class="mock-email-item" data-id="${email.id}" style="padding: 0.8rem 1rem; border-radius: 8px; cursor: pointer; margin-bottom: 0.4rem; transition: background 0.2s; border: 1px solid ${email.read ? 'transparent' : 'rgba(168, 85, 247, 0.25)'}; background: ${email.read ? 'rgba(255,255,255,0.02)' : 'rgba(168, 85, 247, 0.06)'};">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem; gap: 0.5rem;">
                                    <span style="font-size: 0.75rem; font-weight: 800; color: #a855f7; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px;">${email.from.split(' <')[0]}</span>
                                    <span style="font-size: 0.68rem; color: #94a3b8; flex-shrink: 0;">${email.date}</span>
                                </div>
                                <div style="font-size: 0.82rem; font-weight: 700; color: #ffffff; margin-bottom: 0.15rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${email.subject}</div>
                                <div style="font-size: 0.72rem; color: #94a3b8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${email.body.replace(/\n/g, ' ')}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            widget.innerHTML = `
                <div style="width: 360px; height: 480px; background: linear-gradient(135deg, #0f172a 0%, #020617 100%); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; box-shadow: 0 20px 45px rgba(0,0,0,0.65); display: flex; flex-direction: column; overflow: hidden; animation: slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
                    <div style="background: rgba(255,255,255,0.02); padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
                        <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #ffffff; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fa-solid fa-envelope-open-text" style="color: #a855f7;"></i> E-Mail-Postfach <span style="font-size: 0.72rem; font-weight: 400; color: #94a3b8;">(Demo)</span>
                        </h4>
                        <button id="btn-collapse-mock-emails" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.1rem; padding: 0.2rem; display: flex; align-items: center; justify-content: center; transition: color 0.2s; outline: none;" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='#94a3b8'">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                    </div>
                    ${innerHTML}
                </div>
            `;

            document.getElementById('btn-collapse-mock-emails').addEventListener('click', () => {
                isExpanded = false;
                window.refreshMockEmailWidget();
            });

            if (selectedEmailId) {
                document.getElementById('btn-back-to-emails').addEventListener('click', () => {
                    selectedEmailId = null;
                    window.refreshMockEmailWidget();
                });
            } else {
                widget.querySelectorAll('.mock-email-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const id = item.getAttribute('data-id');
                        let updatedEmails = emails.map(e => {
                            if (e.id === id) e.read = true;
                            return e;
                        });
                        localStorage.setItem('GigConnAct_mock_emails', JSON.stringify(updatedEmails));
                        selectedEmailId = id;
                        window.refreshMockEmailWidget();
                    });
                });
            }
        }
    };

    window.refreshMockEmailWidget();
}

function validateAndProcessPhoto(file, callback, errorCallback) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
        showToast({
            title: "Fehler beim Fotoupload ❌",
            message: "Ungültiges Dateiformat. Erlaubt sind JPG, JPEG, PNG und WebP."
        });
        if (errorCallback) errorCallback();
        return;
    }

    if (file.size > maxSize) {
        showToast({
            title: "Fehler beim Fotoupload ❌",
            message: "Die Datei ist zu groß. Maximale Größe ist 10 MB (deine Datei: " + (file.size / (1024 * 1024)).toFixed(2) + " MB)."
        });
        if (errorCallback) errorCallback();
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            if (Math.max(img.width, img.height) < 300) {
                showToast({
                    title: "Auflösung zu gering 📷",
                    message: "Das Foto muss eine Auflösung von mindestens 300 px auf der längeren Seite haben."
                });
                if (errorCallback) errorCallback();
                return;
            }

            const canvas = document.createElement('canvas');
            const maxDim = 3000;
            let w = img.width;
            let h = img.height;
            if (w > h) {
                if (w > maxDim) {
                    h = Math.round((h * maxDim) / w);
                    w = maxDim;
                }
            } else {
                if (h > maxDim) {
                    w = Math.round((w * maxDim) / h);
                    h = maxDim;
                }
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            callback(canvas.toDataURL('image/jpeg', 0.85)); // slightly higher quality
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function validateAndProcessVideo(file, callback, errorCallback) {
    const allowedExtensions = ['mp4', 'mov', 'webm', 'ogg', 'mkv', 'avi', '3gp', 'm4v'];
    const fileExt = file.name.split('.').pop().toLowerCase();
    const isAllowedExt = allowedExtensions.includes(fileExt);
    const isAllowedMime = file.type && file.type.startsWith('video/');
    const maxSize = 500 * 1024 * 1024; // 500 MB

    if (!isAllowedMime && !isAllowedExt) {
        showToast({
            title: "Fehler beim Videoupload ❌",
            message: "Ungültiges Dateiformat. Erlaubt sind gängige Videoformate wie MP4, MOV, WebM."
        });
        if (errorCallback) errorCallback();
        return;
    }

    if (file.size > maxSize) {
        showToast({
            title: "Fehler beim Videoupload ❌",
            message: "Die Datei ist zu groß. Maximale Größe ist 500 MB (deine Datei: " + (file.size / (1024 * 1024)).toFixed(2) + " MB)."
        });
        if (errorCallback) errorCallback();
        return;
    }

    showToast({
        title: "Video wird verarbeitet...",
        message: "Bitte warten..."
    });

    (async () => {
        let url = null;
        let uploadErrorDetail = null;
        if (typeof firebase !== 'undefined' && firebase.storage) {
            try {
                const userId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : 'anonymous';
                const storageRef = firebase.storage().ref();
                const fileRef = storageRef.child(`videos/${userId}/${Date.now()}_${file.name}`);
                const snapshot = await fileRef.put(file);
                url = await snapshot.ref.getDownloadURL();
            } catch (storageError) {
                console.warn("Firebase Storage failed, falling back to local object URL:", storageError);
                uploadErrorDetail = storageError.message || storageError;
            }
        }

        if (!url) {
            // Fallback: local Blob URL
            url = URL.createObjectURL(file);
            showToast({
                title: "Video geladen ⚠️",
                message: "Firebase Storage fehlgeschlagen. Video nur in dieser Sitzung abspielbar: " + (uploadErrorDetail || "Kein aktiver Storage-Dienst.")
            });
        } else {
            showToast({
                title: "Video hochgeladen ✅",
                message: "Das Video wurde erfolgreich hochgeladen."
            });
        }
        callback(url);
    })();
}

window.showMediaModal = function(itemId, isEvents) {
    const list = isEvents ? state.events : state.musicians;
    const item = list.find(x => x.id === itemId);
    if (!item) return;

    let modal = document.getElementById('media-upload-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'media-upload-modal';
    modal.className = 'modal-backdrop';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(15, 23, 42, 0.75)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '100000';
    modal.style.backdropFilter = 'blur(8px)';

    const photos = item.photos || [item.profilePic || item.image || (isEvents ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80' : 'https://picsum.photos/id/453/300/300')];
    const videos = item.videos || [];
    const audios = item.audio || [];

    modal.innerHTML = `
        <div class="modal-card" style="width: 450px; max-width: 90%; background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 16px; box-shadow: var(--shadow-lg); overflow: hidden; display: flex; flex-direction: column; animation: modalFadeIn 0.3s ease;">
            <div style="padding: 1.2rem; border-bottom: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.01);">
                <h3 style="margin: 0; font-size: 1.1rem; font-family: var(--font-heading); color: var(--text-main); display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fa-solid fa-photo-film text-cyan"></i> Medien verwalten
                </h3>
                <button id="btn-close-media-modal" style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.2rem;"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <div style="padding: 1.5rem; flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1.2rem;">
                <!-- Section: Photos -->
                <div>
                    <h4 style="margin: 0 0 0.6rem; font-size: 0.9rem; color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
                        <span style="display: inline-flex; align-items: center; gap: 0.3rem;">📷 Fotos (${photos.length}/${isEvents ? 3 : 5}) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.8rem;" title="Erlaubte Formate: JPG, JPEG, PNG, WebP&#10;Maximale Größe: 10 MB&#10;Auflösung: mind. 1200 x 1200 px"></i></span>
                        ${photos.length < (isEvents ? 3 : 5) ? `
                            <button id="btn-add-mock-photo" class="btn btn-sm btn-glass" style="margin:0; padding: 0.25rem 0.5rem; font-size: 0.72rem; border-color: ${isEvents ? 'rgba(37, 99, 235, 0.3)' : 'rgba(124, 58, 237, 0.3)'}; color: ${isEvents ? '#2563eb' : '#7c3aed'}; display: flex; align-items: center; gap: 0.25rem;">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        ` : ''}
                    </h4>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${photos.map((p, idx) => `
                            <div style="position: relative; width: 80px; height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-glass);">
                                <img src="${p}" style="width: 100%; height: 100%; object-fit: cover;">
                                <button class="btn-delete-photo" data-idx="${idx}" style="position: absolute; top: 2px; right: 2px; background: rgba(239, 68, 68, 0.85); border: none; color: #fff; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.6rem;"><i class="fa-solid fa-times"></i></button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Section: Videos -->
                <div>
                    <h4 style="margin: 0 0 0.6rem; font-size: 0.9rem; color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
                        <span style="display: inline-flex; align-items: center; gap: 0.3rem;">🎬 Videos (${videos.length}/${isEvents ? 1 : 3}) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.8rem;" title="Erlaubte Formate: MP4, MOV, WebM&#10;Maximale Größe: 500 MB&#10;Maximale Länge: 5 Minuten&#10;Auflösung: 720p - 1080p"></i></span>
                        ${videos.length < (isEvents ? 1 : 3) ? `
                            <button id="btn-add-mock-video" class="btn btn-sm btn-glass" style="margin:0; padding: 0.25rem 0.5rem; font-size: 0.72rem; border-color: ${isEvents ? 'rgba(37, 99, 235, 0.3)' : 'rgba(124, 58, 237, 0.3)'}; color: ${isEvents ? '#2563eb' : '#7c3aed'}; display: flex; align-items: center; gap: 0.25rem;">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        ` : ''}
                    </h4>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${videos.length === 0 ? `
                            <span style="font-size: 0.78rem; color: var(--text-muted); font-style: italic;">Keine Videos hochgeladen</span>
                        ` : videos.map((v, idx) => `
                            <div style="position: relative; width: 80px; height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-glass); background: #000; display:flex; align-items:center; justify-content:center;">
                                <i class="fa-solid fa-file-video" style="color: ${isEvents ? '#2563eb' : '#7c3aed'}; font-size: 1.5rem;"></i>
                                <button class="btn-delete-video" data-idx="${idx}" style="position: absolute; top: 2px; right: 2px; background: rgba(239, 68, 68, 0.85); border: none; color: #fff; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.6rem;"><i class="fa-solid fa-times"></i></button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Section: Audios -->
                ${!isEvents ? `
                <div>
                    <h4 style="margin: 0 0 0.6rem; font-size: 0.9rem; color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
                        <span style="display: inline-flex; align-items: center; gap: 0.3rem;">🎵 Hörproben (${audios.length}/3) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.8rem;" title="Erlaubte Formate: MP3, WAV, M4A&#10;Maximale Größe: 100 MB&#10;Maximale Länge: 10 Minuten"></i></span>
                        ${audios.length < 3 ? `
                            <button id="btn-add-mock-audio" class="btn btn-sm btn-glass" style="margin:0; padding: 0.25rem 0.5rem; font-size: 0.72rem; border-color: rgba(124, 58, 237, 0.3); color: #7c3aed; display: flex; align-items: center; gap: 0.25rem;">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        ` : ''}
                    </h4>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${audios.length === 0 ? `
                            <span style="font-size: 0.78rem; color: var(--text-muted); font-style: italic;">Keine Hörproben hochgeladen</span>
                        ` : audios.map((a, idx) => `
                            <div style="position: relative; width: 80px; height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-glass); background: #1e1b4b; display:flex; align-items:center; justify-content:center;" title="${a.title || 'Audio'}">
                                <i class="fa-solid fa-music" style="color: #7c3aed; font-size: 1.5rem;"></i>
                                <button class="btn-delete-audio" data-idx="${idx}" style="position: absolute; top: 2px; right: 2px; background: rgba(239, 68, 68, 0.85); border: none; color: #fff; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.6rem;"><i class="fa-solid fa-times"></i></button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>

            <div style="padding: 1rem; border-top: 1px solid var(--border-glass); display: flex; justify-content: flex-end; gap: 0.5rem; background: rgba(255,255,255,0.01);">
                <button id="btn-cancel-media" class="btn btn-glass btn-sm" style="margin:0;">Abbrechen</button>
                <button id="btn-save-media" class="btn btn-primary btn-sm" style="margin:0; background: ${isEvents ? '#2563eb' : 'var(--color-purple)'}; border-color: ${isEvents ? '#2563eb' : 'var(--color-purple)'};">Speichern</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);

    const close = () => modal.remove();
    document.getElementById('btn-close-media-modal').addEventListener('click', close);
    document.getElementById('btn-cancel-media').addEventListener('click', close);

    const addPhotoBtn = document.getElementById('btn-add-mock-photo');
    if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', () => {
            const maxPhotos = isEvents ? 3 : 5;
            if (photos.length >= maxPhotos) {
                showToast({
                    title: "Fotos-Limit erreicht 📷",
                    message: `Es sind maximal ${maxPhotos} Fotos erlaubt.`
                });
                return;
            }
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/png, image/jpeg, image/webp';
            fileInput.style.display = 'none';
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    validateAndProcessPhoto(fileInput.files[0], (dataUrl) => {
                        photos.push(dataUrl);
                        close();
                        window.showMediaModal(itemId, isEvents);
                    });
                }
            });
            fileInput.click();
        });
    }

    const addVideoBtn = document.getElementById('btn-add-mock-video');
    if (addVideoBtn) {
        addVideoBtn.addEventListener('click', () => {
            const maxVideos = isEvents ? 1 : 3;
            if (videos.length >= maxVideos) {
                showToast({
                    title: "Video-Limit erreicht 🎬",
                    message: `Es sind maximal ${maxVideos} Videos erlaubt.`
                });
                return;
            }
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'video/mp4, video/quicktime, video/webm';
            fileInput.style.display = 'none';
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    validateAndProcessVideo(fileInput.files[0], (videoUrl) => {
                        videos.push(videoUrl);
                        close();
                        window.showMediaModal(itemId, isEvents);
                    });
                }
            });
            fileInput.click();
        });
    }

    const addAudioBtn = document.getElementById('btn-add-mock-audio');
    if (addAudioBtn) {
        addAudioBtn.addEventListener('click', () => {
            if (audios.length >= 3) {
                showToast({
                    title: "Audio-Limit erreicht 🎵",
                    message: "Es sind maximal 3 Audio-Dateien erlaubt."
                });
                return;
            }
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'audio/mpeg, audio/mp3, audio/wav, audio/x-wav, audio/m4a, audio/x-m4a, audio/mp4';
            fileInput.style.display = 'none';
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    validateAndProcessAudio(fileInput.files[0], (audioObj) => {
                        audios.push(audioObj);
                        close();
                        window.showMediaModal(itemId, isEvents);
                    });
                }
            });
            fileInput.click();
        });
    }

    modal.querySelectorAll('.btn-delete-photo').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-idx'));
            photos.splice(idx, 1);
            close();
            window.showMediaModal(itemId, isEvents);
        });
    });

    modal.querySelectorAll('.btn-delete-video').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-idx'));
            videos.splice(idx, 1);
            close();
            window.showMediaModal(itemId, isEvents);
        });
    });

    modal.querySelectorAll('.btn-delete-audio').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-idx'));
            audios.splice(idx, 1);
            close();
            window.showMediaModal(itemId, isEvents);
        });
    });

    document.getElementById('btn-save-media').addEventListener('click', () => {
        item.photos = photos;
        if (photos.length > 0) {
            item.profilePic = photos[0];
            item.image = photos[0];
        } else {
            item.profilePic = '';
            item.image = '';
        }
        item.videos = videos;
        if (!isEvents) {
            item.audio = audios;
        }

        if (isEvents) {
            state.updateEvent(item.id, {
                photos: photos,
                profilePic: item.profilePic,
                image: item.image,
                videos: videos
            });
            localStorage.setItem('GigConnAct_events', JSON.stringify(state.events));
        } else {
            state.updateMusician(item.id, {
                photos: photos,
                profilePic: item.profilePic,
                image: item.image,
                videos: videos,
                audio: audios
            });
            localStorage.setItem('GigConnAct_musicians', JSON.stringify(state.musicians));
        }

        showToast({
            title: "Medien aktualisiert 📸",
            message: "Deine Fotos, Videos und Hörproben wurden erfolgreich gespeichert."
        });
        
        close();
        
        const container = document.getElementById('app-main');
        if (isEvents) {
            renderMyEvents(container);
        } else {
            renderMyMusicians(container);
        }
    });
};

async function renderVerifyEmailPage(container) {
    container.innerHTML = `
        <div class="market-container" style="max-width: 600px; margin: 4rem auto; padding: 3rem; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-color); text-align: center; box-shadow: var(--shadow-lg);">
            <div id="verify-loading" style="display: block;">
                <div class="spinner" style="width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--color-purple); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1.5rem;"></div>
                <h3 style="font-family: var(--font-heading); color: var(--text-main); margin-bottom: 0.5rem;">E-Mail-Adresse wird verifiziert...</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Bitte hab einen kurzen Moment Geduld.</p>
            </div>
            
            <div id="verify-success" style="display: none;">
                <div style="font-size: 4rem; color: var(--color-green); margin-bottom: 1.5rem;">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <h3 style="font-family: var(--font-heading); color: var(--text-main); margin-bottom: 1rem;">E-Mail erfolgreich verifiziert! 🎉</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 2rem; line-height: 1.5;">
                    Vielen Dank! Deine E-Mail-Adresse wurde erfolgreich bestätigt. Du kannst dich jetzt einloggen und alle Funktionen von GigConnAct nutzen.
                </p>
                <button class="btn btn-primary" onclick="window.location.hash = '#/'; showModal('auth');" style="margin: 0 auto;">Jetzt anmelden</button>
            </div>

            <div id="verify-error" style="display: none;">
                <div style="font-size: 4rem; color: var(--color-red); margin-bottom: 1.5rem;">
                    <i class="fa-solid fa-circle-xmark"></i>
                </div>
                <h3 style="font-family: var(--font-heading); color: var(--text-main); margin-bottom: 1rem;">Verifizierung fehlgeschlagen ⚠️</h3>
                <p id="verify-error-msg" style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 2rem; line-height: 1.5;">
                    Der Verifizierungs-Code ist ungültig oder abgelaufen.
                </p>
                <button class="btn btn-secondary" onclick="window.location.hash = '#/';" style="margin: 0 auto;">Zur Startseite</button>
            </div>
        </div>
    `;

    // Parse parameters from query string
    const hash = window.location.hash;
    const queryString = hash.split('?')[1] || '';
    const urlParams = new URLSearchParams(queryString);
    const oobCode = urlParams.get('oobCode');

    if (!oobCode) {
        document.getElementById('verify-loading').style.display = 'none';
        document.getElementById('verify-error').style.display = 'block';
        document.getElementById('verify-error-msg').innerText = "Kein Verifizierungscode in der URL gefunden.";
        return;
    }

    try {
        await auth.applyActionCode(oobCode);
        document.getElementById('verify-loading').style.display = 'none';
        document.getElementById('verify-success').style.display = 'block';
    } catch (err) {
        console.error("verifyEmail failed:", err);
        document.getElementById('verify-loading').style.display = 'none';
        document.getElementById('verify-error').style.display = 'block';
        document.getElementById('verify-error-msg').innerText = "Der Link ist ungültig, abgelaufen oder wurde bereits verwendet: " + err.message;
    }
}
window.renderVerifyEmailPage = renderVerifyEmailPage;

function renderImpressumPage(container) {
    container.innerHTML = `
        <div class="market-container" style="max-width: 800px; margin: 3rem auto; padding: 2.5rem; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--shadow-lg);">
            <h1 style="font-family: var(--font-heading); color: var(--text-main); font-size: 2rem; margin-bottom: 1.5rem; border-bottom: 2px solid var(--border-color); padding-bottom: 0.75rem;">Impressum</h1>
            
            <div style="line-height: 1.8; color: var(--text-main); font-size: 0.95rem;">
                <h3 style="margin-top: 1.5rem; color: var(--text-main);">Angaben gemäß § 5 DDG</h3>
                <p>
                    Vibulan Sivanathan<br>
                    Montanusstraße 49<br>
                    51065 Köln
                </p>

                <h3 style="margin-top: 1.5rem; color: var(--text-main);">Kontakt</h3>
                <p>
                    Telefon: +49 15788703998<br>
                    E-Mail: info@gigconnact.de
                </p>

                <h3 style="margin-top: 1.5rem; color: var(--text-main);">Umsatzsteuer-Identifikationsnummer (USt-IdNr.)</h3>
                <p style="color: var(--text-muted); font-style: italic;">
                    [Hier nach der Gewerbeanmeldung deine USt-IdNr. eintragen, z. B. DE123456789]
                </p>

                <h3 style="margin-top: 1.5rem; color: var(--text-main);">EU-Streitschlichtung</h3>
                <p>
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:<br>
                    <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style="color: var(--color-purple); text-decoration: underline;">https://ec.europa.eu/consumers/odr/</a>.<br>
                    Unsere E-Mail-Adresse finden Sie oben im Impressum.
                </p>

                <h3 style="margin-top: 1.5rem; color: var(--text-main);">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h3>
                <p>
                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
            </div>
        </div>
    `;
    window.scrollTo(0, 0);
}
window.renderImpressumPage = renderImpressumPage;

function renderDatenschutzPage(container) {
    container.innerHTML = `
        <div class="market-container" style="max-width: 800px; margin: 3rem auto; padding: 2.5rem; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--shadow-lg);">
            <h1 style="font-family: var(--font-heading); color: var(--text-main); font-size: 2rem; margin-bottom: 1.5rem; border-bottom: 2px solid var(--border-color); padding-bottom: 0.75rem;">Datenschutzerklärung</h1>
            
            <div style="line-height: 1.8; color: var(--text-main); font-size: 0.95rem;">
                <h2 style="font-size: 1.3rem; margin-top: 1.5rem; color: var(--text-main); border-left: 4px solid var(--color-purple); padding-left: 0.5rem;">1. Datenschutz auf einen Blick</h2>
                <h3 style="font-size: 1.1rem; margin-top: 1rem; color: var(--text-main);">Allgemeine Hinweise</h3>
                <p>
                    Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                </p>
                <h3 style="font-size: 1.1rem; margin-top: 1rem; color: var(--text-main);">Datenerfassung auf unserer Website</h3>
                <p>
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Verantwortliche Stelle“ entnehmen. Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen (z. B. durch Registrierung). Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst (z. B. IP-Adresse oder Browsertyp).
                </p>

                <h2 style="font-size: 1.3rem; margin-top: 2rem; color: var(--text-main); border-left: 4px solid var(--color-purple); padding-left: 0.5rem;">2. Allgemeine Hinweise und Pflichtinformationen</h2>
                <h3 style="font-size: 1.1rem; margin-top: 1rem; color: var(--text-main);">Verantwortliche Stelle</h3>
                <p>
                    Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br>
                    <strong>Vibulan Sivanathan</strong><br>
                    Montanusstraße 49<br>
                    51065 Köln<br>
                    E-Mail: <a href="mailto:info@gigconnact.de" style="color: var(--color-purple); text-decoration: underline;">info@gigconnact.de</a><br>
                    Telefon: +49 15788703998
                </p>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">
                    <em>Hinweis: Die verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.</em>
                </p>

                <h3 style="font-size: 1.1rem; margin-top: 1.5rem; color: var(--text-main);">Speicherdauer</h3>
                <p>
                    Soweit in dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschbegehren geltend machen oder Ihre Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, es sei denn, wir haben andere rechtlich zulässige Gründe für die Speicherung Ihrer personenbezogenen Daten (z. B. steuer- oder handelsrechtliche Aufbewahrungsfristen).
                    Gekündigte Profile verbleiben nach Ablauf des Abonnement-Zeitraums in einem inaktiven Zustand (inaktives Benutzerkonto), um dem Nutzer eine spätere Reaktivierung zu ermöglichen und den Missbrauch von kostenlosen Probephasen zu verhindern. Sie können Ihr Konto und alle hiermit verbundenen Daten jederzeit selbstständig über die Funktion „Konto löschen“ im Profilbereich unwiderruflich entfernen.
                </p>

                <h3 style="font-size: 1.1rem; margin-top: 1.5rem; color: var(--text-main);">Rechtsgrundlagen der Datenverarbeitung auf dieser Website</h3>
                <p>
                    Sofern Sie in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO. Im Falle einer ausdrücklichen Einwilligung in die Übertragung personenbezogener Daten in Drittstaaten erfolgt die Verarbeitung zudem auf Grundlage von Art. 49 Abs. 1 lit. a DSGVO.
                    Die Registrierung und die Datenverarbeitung zur Vermittlung (Matching) basiert auf Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung oder vorvertragliche Maßnahmen). Unser berechtigtes Interesse an der sicheren Bereitstellung der Plattform begründet sich auf Art. 6 Abs. 1 lit. f DSGVO.
                </p>

                <h3 style="font-size: 1.1rem; margin-top: 1.5rem; color: var(--text-main);">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
                <p>
                    Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
                </p>

                <h3 style="font-size: 1.1rem; margin-top: 1.5rem; color: var(--text-main);">Recht auf Beschwerde bei der zuständigen Aufsichtsbehörde</h3>
                <p>
                    Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu. Das Beschwerderecht besteht unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.
                </p>

                <h3 style="font-size: 1.1rem; margin-top: 1.5rem; color: var(--text-main);">Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</h3>
                <p>
                    Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen.
                      <h2 style="font-size: 1.3rem; margin-top: 2rem; color: var(--text-main); border-left: 4px solid var(--color-purple); padding-left: 0.5rem;">3. Datenerfassung und Sichtbarkeit auf unserer Plattform</h2>
                <p>
                    Im Rahmen der Vermittlung von Musikern und Veranstaltern verarbeiten wir spezifische personenbezogene Daten. Diese Verarbeitung erfolgt zur Erfüllung unseres Vertrages bzw. zur Durchführung vorvertraglicher Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO).
                </p>
                <h3 style="font-size: 1.1rem; margin-top: 1rem; color: var(--text-main);">Datenkategorien Musiker</h3>
                <p>
                    Bei der Registrierung und Profilgestaltung von Musikern erfassen und verarbeiten wir: Künstlername, E-Mail-Adresse, Telefonnummer (falls angegeben), Standort (Umkreis), Profilbild, Band- und Künstlerbeschreibung, Genres, Instrumente, Fotos, Videos, Audiodateien, Gagenvorstellungen sowie Verfügbarkeiten.
                </p>
                <h3 style="font-size: 1.1rem; margin-top: 1rem; color: var(--text-main);">Datenkategorien Veranstalter</h3>
                <p>
                    Bei der Registrierung und Erstellung von Events von Veranstaltern erfassen und verarbeiten wir: Name/Firma, E-Mail-Adresse, Telefonnummer, Veranstaltungsort, Eventdaten (Datum, Uhrzeit, Budget, Spieldauer, gesuchtes Genre/Typ) sowie Chatnachrichten.
                </p>
                <h3 style="font-size: 1.1rem; margin-top: 1rem; color: var(--text-main);">Öffentliche Sichtbarkeit vs. Registrierte Nutzer (Plattform-Zugang)</h3>
                <p>
                    Um den Datenschutz unserer Nutzer zu maximieren, gilt folgendes Sichtbarkeitskonzept:
                    <ul style="padding-left: 1.5rem; margin-top: 0.5rem; line-height: 1.6;">
                        <li><strong>Öffentlicher Bereich (nicht eingeloggt):</strong> Auf den öffentlichen Marktplätzen sind Musiker-Profile und Events ausschließlich <strong>anonymisiert</strong> sichtbar. Es werden keine Klarnamen oder konkrete Kontaktdaten (E-Mail, Telefon) angezeigt.</li>
                        <li><strong>Registrierte & eingeloggte Nutzer:</strong> Die vollständigen Profile und Kontaktdaten (Künstlername bzw. Name/Firma, E-Mail-Adresse, Telefonnummer) sind für alle registrierten und angemeldeten Nutzer auf der Plattform einsehbar, sobald sie über ein Benutzerkonto verfügen.</li>
                        <li><strong>Kommunikation (Postbox):</strong> Die über das Postfach geführten Chatverläufe und Nachrichten sind vertraulich und nur für die jeweiligen beiden Kommunikationspartner einsehbar. Zur Unterstützung der Vermittlung wird den Nutzern lediglich ein berechneter Match-Score (Übereinstimmungsgrad) angezeigt.</li>
                    </ul>
                </p>

                <h2 style="font-size: 1.3rem; margin-top: 2rem; color: var(--text-main); border-left: 4px solid var(--color-purple); padding-left: 0.5rem;">4. Datenerfassung auf dieser Website (Technische Dienstleister)</h2>
                
                <h3 style="font-size: 1.1rem; margin-top: 1rem; color: var(--text-main);">Registrierung und Login (Google Firebase Authentication)</h3>
                <p>
                    Wir bieten Ihnen die Möglichkeit, sich auf unserer Website zu registrieren. Hierzu verwenden wir den Authentifizierungsdienst <strong>Firebase Authentication</strong> der Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Irland).
                    Wenn Sie sich registrieren oder einloggen (z. B. via Google-Login oder passwortlosem Magic-Link), übermitteln wir Ihre E-Mail-Adresse und ggf. Ihren Namen an Google, um Ihre Identität zu verifizieren und Ihren Account bereitzustellen. Google Firebase verarbeitet Daten teilweise auch in den USA. Die Übertragung basiert auf den EU-Standardvertragsklauseln der Europäischen Kommission.
                </p>

                <h3 style="font-size: 1.1rem; margin-top: 1.5rem; color: var(--text-main);">Datenverarbeitung & Dateispeicher (Google Cloud Firestore & Cloud Storage)</h3>
                <p>
                    Sämtliche von Ihnen erstellten Profileinträge, hochgeladenen Medien (Fotos, Videos, Audio sowohl für Musiker als auch für Veranstalter), Präferenzen, Chats und System-Benachrichtigungen werden in der NoSQL-Datenbank <strong>Firebase Cloud Firestore</strong> bzw. im <strong>Firebase Cloud Storage</strong> gespeichert.
                    Diese Speicherung ist technisch zwingend erforderlich, um das Matching zwischen Musiker und Veranstalter sowie das Postfach bereitzustellen (Vertragserfüllung gemäß Art. 6 Abs. 1 lit. b DSGVO).
                </p>

                <h3 style="font-size: 1.1rem; margin-top: 1.5rem; color: var(--text-main);">E-Mail-Versand (Resend)</h3>
                <p>
                    Für den automatisierten Versand von System-E-Mails (z. B. Login-Links, Match-Empfehlungen und Chat-Benachrichtigungen) nutzen wir den Dienst <strong>Resend</strong> (Resend Labs Inc., 2261 Market St #4079, San Francisco, CA 94114, USA).
                    Hierbei wird Ihre E-Mail-Adresse und ggf. Ihr Vorname an Resend übertragen. Die Verarbeitung erfolgt zur Erfüllung unserer vertraglichen Pflichten (Art. 6 Abs. 1 lit. b DSGVO) sowie zur Gewährleistung der Kommunikationsgeschwindigkeit. Die Übertragung in die USA wird durch Standardvertragsklauseln abgesichert.
                </p>

                <h3 style="font-size: 1.1rem; margin-top: 1.5rem; color: var(--text-main);">Zahlungsabwicklung (Stripe)</h3>
                <p>
                    Zur Abwicklung von kostenpflichtigen Abonnements nutzen wir den Zahlungsdienstleister <strong>Stripe</strong> (Stripe Payments Europe Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irland).
                    Wenn Sie ein Abonnement abschließen, werden Ihre Zahlungsdaten (z. B. Name, E-Mail-Adresse, IBAN/BIC oder Kreditkarteninformationen) verschlüsselt an Stripe übertragen. Stripe verarbeitet diese Daten als eigenständiger datenschutzrechtlich Verantwortlicher, um Zahlungen einzuziehen und Betrug vorzubeugen.
                    Die Weitergabe erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Zahlungsabwicklung zur Vertragserfüllung). Stripe übermittelt Daten teilweise auch an das Mutterunternehmen Stripe, Inc. in den USA. Diese Übertragungen sind durch die Standardvertragsklauseln der EU-Kommission und die Zertifizierung unter dem EU-US Data Privacy Framework abgesichert. Weitere Informationen finden Sie in der Datenschutzerklärung von Stripe unter <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" style="color: var(--color-purple); text-decoration: underline;">https://stripe.com/de/privacy</a>.
                </p>

                <h3 style="font-size: 1.1rem; margin-top: 1.5rem; color: var(--text-main);">Cookies & Einwilligungs-Management (Cookie-Banner)</h3>
                <p>
                    Diese Website verwendet Cookies. Einige von ihnen sind technisch notwendig (z. B. für die Anmeldung und das Speichern Ihres Sitzungsstatus), während andere uns helfen, diese Website und Ihre Erfahrung zu verbessern (Statistiken und Marketing).
                    Technisch nicht notwendige Cookies werden erst geladen, nachdem Sie Ihre ausdrückliche Einwilligung erteilt haben (Opt-In gemäß Art. 6 Abs. 1 lit. a DSGVO i. V. m. § 25 Abs. 1 TTDSG).
                    Sie können Ihre Cookie-Einwilligungen jederzeit anpassen oder widerrufen, indem Sie auf folgenden Link klicken:
                    <a href="javascript:void(0);" onclick="window.showCookieSettings();" style="color: var(--color-purple); text-decoration: underline; font-weight: bold;">Cookie-Einstellungen ändern</a>.
                </p>

                <h3 style="font-size: 1.1rem; margin-top: 1.5rem; color: var(--text-main);">Webanalyse (Google Analytics)</h3>
                <p>
                    Sofern Sie Ihre Einwilligung erteilt haben, nutzen wir auf dieser Website <strong>Google Analytics</strong>, einen Webanalysedienst der Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Irland).
                    Google Analytics verwendet Cookies, die eine Analyse der Benutzung der Website durch Sie ermöglichen. Die durch das Cookie erzeugten Informationen über Ihre Benutzung dieser Website werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert. Wir nutzen Google Analytics ausschließlich mit aktivierter IP-Anonymisierung (IP-Masking), sodass Ihre IP-Adresse von Google innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum zuvor gekürzt wird.
                    Die Datenverarbeitung basiert auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können diese Einwilligung jederzeit über die Cookie-Einstellungen widerrufen. Die Datenübertragung in die USA ist durch Standardvertragsklauseln der EU-Kommission und die Zertifizierung unter dem EU-US Data Privacy Framework abgesichert.
                </p>

                <h3 style="font-size: 1.1rem; margin-top: 1.5rem; color: var(--text-main);">Online-Werbung & Conversion-Tracking (Google Ads)</h3>
                <p>
                    Sofern Sie eingewilligt haben, nutzen wir das Online-Werbeprogramm <strong>Google Ads</strong> und das dazugehörige Conversion-Tracking der Google Ireland Limited.
                    Dabei wird von Google ein Cookie auf Ihrem Gerät gesetzt, wenn Sie über eine Google-Anzeige auf unsere Website gelangt sind. Dieses Cookie verliert nach 30 Tagen seine Gültigkeit und dient nicht der persönlichen Identifizierung, sondern hilft uns zu messen, wie viele Nutzer nach dem Klick auf eine Anzeige eine bestimmte Aktion (z. B. Registrierung) auf unserer Website durchgeführt haben.
                    Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Ein Widerruf ist jederzeit über die Cookie-Einstellungen möglich. Die Datenübertragung in die USA ist durch Standardvertragsklauseln und das EU-US Data Privacy Framework abgesichert.
                </p>

                <h3 style="font-size: 1.1rem; margin-top: 1.5rem; color: var(--text-main);">Standortdienste & Captchas</h3>
                <p>
                    Zum Schutz Ihrer Privatsphäre werden auf unserer Website <strong>keine</strong> externen Kartendienste (wie Google Maps) oder Captcha-Dienste von Drittanbietern geladen. Die Standortauswahl und Adressvorschläge erfolgen vollständig lokal oder über die Standardfunktionen Ihres Browsers, sodass hierbei keine Daten an Drittanbieter übertragen werden.
                </p>

                <h3 style="font-size: 1.1rem; margin-top: 1.5rem; color: var(--text-main);">Server-Log-Dateien & LocalStorage</h3>
                <p>
                    Der Hoster der Website erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt (z. B. Browsertyp, Betriebssystem, Referrer URL, Uhrzeit). Diese Daten sind nicht bestimmten Personen zuzuordnen und werden nicht mit anderen Datenquellen zusammengeführt.
                    Zudem nutzt diese Website den <strong>LocalStorage</strong> Ihres Browsers, um Sitzungsschlüssel, unread-Zähler und im Offline-Modus Ihre lokalen Präferenzen sicher und temporär zu sichern. Dies ist zur fehlerfreien Bereitstellung der SPA-Funktionalitäten notwendig.
                </p>
            </div>
        </div>
    `;
    window.scrollTo(0, 0);
}
window.renderDatenschutzPage = renderDatenschutzPage;

// Global touch and mouse drag event delegation for card galleries
(function() {
    let startX = 0;
    let startY = 0;
    let isSwiping = false;
    let currentSlider = null;
    let dragDetected = false;

    // Touch events
    document.addEventListener('touchstart', (e) => {
        const sliderContainer = e.target.closest('.tile-fullwidth-photo-slider');
        if (!sliderContainer) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwiping = true;
        currentSlider = sliderContainer;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!isSwiping || !currentSlider) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (e.cancelable) {
                e.preventDefault();
            }
        }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        if (!isSwiping || !currentSlider) return;
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        const sliderInner = currentSlider.querySelector('[id^="combo-slider-"]');
        if (sliderInner) {
            const itemId = sliderInner.id.replace('combo-slider-', '');
            if (Math.abs(diffX) > 40) {
                if (diffX > 0) {
                    window.slideComboGallery(itemId, 1);
                } else {
                    window.slideComboGallery(itemId, -1);
                }
            }
        }
        isSwiping = false;
        currentSlider = null;
    }, { passive: true });

    // Mouse drag events for desktop
    document.addEventListener('mousedown', (e) => {
        const sliderContainer = e.target.closest('.tile-fullwidth-photo-slider');
        if (!sliderContainer) return;
        startX = e.clientX;
        startY = e.clientY;
        isSwiping = true;
        currentSlider = sliderContainer;
        dragDetected = false;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isSwiping || !currentSlider) return;
        const currentX = e.clientX;
        const currentY = e.clientY;
        const diffX = startX - currentX;
        
        if (Math.abs(diffX) > 10) {
            dragDetected = true;
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (!isSwiping || !currentSlider) return;
        const endX = e.clientX;
        const diffX = startX - endX;
        
        if (dragDetected && Math.abs(diffX) > 40) {
            const sliderInner = currentSlider.querySelector('[id^="combo-slider-"]');
            if (sliderInner) {
                const itemId = sliderInner.id.replace('combo-slider-', '');
                if (diffX > 0) {
                    window.slideComboGallery(itemId, 1);
                } else {
                    window.slideComboGallery(itemId, -1);
                }
            }
        }
        isSwiping = false;
        currentSlider = null;
    });
})();
