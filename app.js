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
        videos: [{ title: 'Live Performance Highlights', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }]
    },
    organizer: {
        photos: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'],
        videos: [{ title: 'Live Performance Highlights', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }]
    }
};

window.updateRegMediaPreview = function(role) {
    const photosContainer = document.getElementById(`reg-${role}-photos-preview`);
    const videosContainer = document.getElementById(`reg-${role}-videos-preview`);
    if (!photosContainer || !videosContainer) return;

    const photos = window.registrationMedia[role].photos;
    const videos = window.registrationMedia[role].videos;

    photosContainer.innerHTML = photos.length === 0 
        ? `<span style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">Keine Bilder hinzugefügt</span>`
        : photos.map((p, idx) => `
            <div style="position: relative; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                <img src="${p}" style="width:100%; height:100%; object-fit:cover;">
                <button type="button" onclick="window.deleteRegMedia('${role}', 'photo', ${idx})" style="position: absolute; top: 1px; right: 1px; background: rgba(239, 68, 68, 0.85); border: none; color: #fff; width: 15px; height: 15px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.5rem;"><i class="fa-solid fa-times"></i></button>
            </div>
        `).join('');

    videosContainer.innerHTML = videos.length === 0
        ? `<span style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">Keine Videos hinzugefügt</span>`
        : videos.map((v, idx) => `
            <div style="position: relative; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: #000; display:flex; align-items:center; justify-content:center;" title="${v.title}">
                <i class="fa-solid fa-file-video" style="color: #a855f7; font-size: 1.1rem;"></i>
                <button type="button" onclick="window.deleteRegMedia('${role}', 'video', ${idx})" style="position: absolute; top: 1px; right: 1px; background: rgba(239, 68, 68, 0.85); border: none; color: #fff; width: 15px; height: 15px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.5rem;"><i class="fa-solid fa-times"></i></button>
            </div>
        `).join('');
};

window.addRegMedia = function(role, type) {
    const list = window.registrationMedia[role][type === 'photo' ? 'photos' : 'videos'];
    const limit = type === 'photo' ? 3 : 1;
    if (list.length >= limit) {
        showToast({
            title: type === 'photo' ? "Bilder-Limit erreicht 📷" : "Video-Limit erreicht 🎬",
            message: type === 'photo' ? "Es sind maximal 3 Bilder erlaubt." : "Es ist maximal 1 Video erlaubt."
        });
        return;
    }
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    if (type === 'photo') {
        fileInput.accept = 'image/png, image/jpeg, image/gif, image/webp';
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                validateAndProcessPhoto(fileInput.files[0], (dataUrl) => {
                    list.push(dataUrl);
                    window.updateRegMediaPreview(role);
                });
            }
        });
    } else {
        fileInput.accept = 'video/mp4, video/quicktime, video/webm, video/ogg, video/x-matroska';
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                validateAndProcessVideo(fileInput.files[0], (videoUrl) => {
                    list.push(videoUrl);
                    window.updateRegMediaPreview(role);
                });
            }
        });
    }
    fileInput.style.display = 'none';
    fileInput.click();
};

window.deleteRegMedia = function(role, type, idx) {
    const list = window.registrationMedia[role][type === 'photo' ? 'photos' : 'videos'];
    list.splice(idx, 1);
    window.updateRegMediaPreview(role);
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
        if (isPhoto) {
            let photoIdx = 1;
            for (let i = 0; i < cur; i++) {
                if (s.children[i].querySelector('img')) photoIdx++;
            }
            let totalPhotos = 0;
            for (let i = 0; i < slidesCount; i++) {
                if (s.children[i].querySelector('img')) totalPhotos++;
            }
            counter.innerText = '📷 ' + photoIdx + ' / ' + totalPhotos + ' Fotos';
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
        } else {
            counter.innerHTML = '📝 Beschreibung';
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
        modal.querySelector('#btn-confirm-unlock').addEventListener('click', () => {
            const res = state.unlockContact(targetId);
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
        this.loadState();
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
                // Force hidePhone for mus_1, mus_3, mus_5, and every 4th generated musician
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
            localStorage.setItem('GigConnAct_musicians', JSON.stringify(this.musicians));
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
                // Force hidePhone for evt_1, evt_3, evt_5, and every 4th generated event
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
            localStorage.setItem('GigConnAct_events', JSON.stringify(this.events));
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

        // Ensure all entities have a createdAt timestamp for sorting and correct creatorId mapping
        let registeredUsers = [];
        try {
            const parsedUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
            registeredUsers = Array.isArray(parsedUsers) ? parsedUsers : [];
        } catch (e) {
            registeredUsers = [];
        }

        this.musicians.forEach((m, idx) => {
            if (!m.createdAt) m.createdAt = new Date(Date.now() - idx * 2 * 60 * 60 * 1000).toISOString();
            const matchingUser = registeredUsers.find(u => u.profileId === m.id);
            if (matchingUser) {
                m.creatorId = matchingUser.id;
            } else if (!m.creatorId) {
                m.creatorId = m.id;
            }
        });
        this.events.forEach((e, idx) => {
            if (!e.createdAt) e.createdAt = new Date(Date.now() - idx * 2 * 60 * 60 * 1000).toISOString();
            if (!e.creatorId) e.creatorId = e.creatorId || "org_1";
        });

        // Ensure there are at least 3 events for Julia (creatorId: "org_1")
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

        // Also let's set first event to musicianFound = true for Julia
        if (juliaEvents.length >= 3) {
            juliaEvents[0].musicianFound = true;
        }

        // Ensure there are at least 2 profiles for contact@neonbeats.de (creatorId: "mus_1")
        const contactMusicians = this.musicians.filter(m => m.creatorId === "mus_1");
        if (contactMusicians.length === 1) {
            const first = contactMusicians[0];
            const second = {
                ...JSON.parse(JSON.stringify(first)),
                id: "mus_1_dup",
                name: "Neon Beats Acoustic",
                type: "Solo",
                bluffName: "Acoustic Pop-SÄnger & Gitarrist",
                minBudget: 400,
                genres: ["Pop", "Rock", "Singer-Songwriter"],
                isActive: true
            };
            this.musicians.push(second);
            contactMusicians.push(second);
        }

        // For each of the contact musicians, populate exactly 10 contacted events (3 booked, 2 declined, 5 contacted)
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
        
        // Ensure all musicians and events have a company name (defaulting to "Privatperson" if not present) and a random technik value
        const techOptions = ["Technik vorhanden", "Technik ist noch unklar", "Technik nicht vorhanden"];
        this.musicians.forEach(m => {
            if (!m.company) {
                const user = registeredUsers.find(u => u.id === m.creatorId || u.profileId === m.id);
                m.company = user ? (user.company || "Privatperson") : "Privatperson";
            }
            if (!m.technik) {
                m.technik = techOptions[Math.floor(Math.random() * techOptions.length)];
            }
        });
        this.events.forEach(e => {
            if (!e.company || (e.company === "Privatperson" && e.organizerType && e.organizerType !== "Privater Veranstalter")) {
                const user = registeredUsers.find(u => u.id === e.creatorId || u.profileId === e.id);
                if (user && user.company && user.company !== "Privatperson") {
                    e.company = user.company;
                } else {
                    const orgNames = {
                        "Firma": ["TechCorp GmbH", "Müller & Söhne KG", "InnoWave Solutions", "FutureMedia Group", "Hansa Logistik"],
                        "Verein": ["Musikverein e.V.", "Kulturverein Regenbogen", "Sportfreunde 1920", "Stadtjugendring", "Förderverein Kunst"],
                        "Event-Agentur": ["SommerSonne Events", "StarGigs Agency", "GoldenMoment Weddings", "BlueMoon Entertainment", "Epic Events"],
                        "Festivalveranstalter": ["BeachBeat Festival Group", "Rock am See GmbH", "JazzTime e.V.", "CityFestivals UG", "SoundScape Productions"],
                        "Eventlocation": ["Bürgerhaus", "Alte Mälzerei", "Schloss-Schenke"],
                        "Hotel": ["Grand Hotel", "Hotel Post", "Sonnenblick Resort"],
                        "Restaurant": ["La Piazza", "Zum Wilden Hirsch", "Hafenblick Restaurant"],
                        "Bar": ["Blue Note Jazz Bar", "Tiki Lounge", "Skyline Bar"],
                        "Stadtmarketing": ["Stadtmarketing GmbH", "Tourismusverband"],
                        "Sonstige": ["Kulturverein", "Bürgerbüro"]
                    };
                    const list = orgNames[e.organizerType] || ["Event Organisation"];
                    e.company = list[Math.floor(Math.random() * list.length)];
                }
            }
            if (!e.technik) {
                e.technik = techOptions[Math.floor(Math.random() * techOptions.length)];
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
        });

        // Initialize active musician and event IDs for matches / interest tracking
        if (this.currentUser) {
            if (this.currentUser.role === 'musician') {
                this.activeMusicianId = this.activeMusicianId || this.currentUser.profileId || (this.musicians.find(m => m.creatorId === this.currentUser.id)?.id || null);
            } else if (this.currentUser.role === 'organizer') {
                this.activeEventId = this.activeEventId && this.events.some(e => e.id === this.activeEventId)
                    ? this.activeEventId
                    : (this.events.find(e => e.creatorId === this.currentUser.id)?.id || null);
            }
            this.runDailyMatchCheck();
        }

        this.saveState();
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
            const storedMatchesRaw = localStorage.getItem(matchesKey);
            const storedMatches = storedMatchesRaw ? JSON.parse(storedMatchesRaw) : [];
            const storedIds = storedMatches.map(m => m.id);
            
            let currentDayMatches = [];
            let newMatchIds = [];
            
            myProfiles.forEach(myProfile => {
                candidates.forEach(cand => {
                    const match = this.currentUser.role === 'musician'
                        ? calculateMatch(myProfile, cand, 'musician')
                        : calculateMatch(cand, myProfile, 'organizer');
                        
                    if (match.score >= 70) {
                        currentDayMatches.push({
                            id: cand.id,
                            matchScore: match.score
                        });
                        if (!storedIds.includes(cand.id)) {
                            newMatchIds.push(cand.id);
                        }
                    }
                });
            });
            
            if (newMatchIds.length > 0) {
                const unreadKey = `GigConnAct_unread_matches_${this.currentUser.id}`;
                const storedUnreadRaw = localStorage.getItem(unreadKey);
                const storedUnread = storedUnreadRaw ? JSON.parse(storedUnreadRaw) : [];
                
                newMatchIds.forEach(id => {
                    if (!storedUnread.includes(id)) {
                        storedUnread.push(id);
                    }
                });
                
                localStorage.setItem(unreadKey, JSON.stringify(storedUnread));
            }
            
            localStorage.setItem(matchesKey, JSON.stringify(currentDayMatches));
            localStorage.setItem(checkKey, todayStr);
        }
    }

    getUnreadMatchesCount() {
        if (!this.currentUser) return 0;
        const unreadKey = `GigConnAct_unread_matches_${this.currentUser.id}`;
        const storedUnreadRaw = localStorage.getItem(unreadKey);
        const storedUnread = storedUnreadRaw ? JSON.parse(storedUnreadRaw) : [];
        return storedUnread.length;
    }

    clearUnreadMatches() {
        if (!this.currentUser) return;
        const unreadKey = `GigConnAct_unread_matches_${this.currentUser.id}`;
        localStorage.setItem(unreadKey, JSON.stringify([]));
        this.notify();
    }

    toggleFavorite(id) {
        if (!this.currentUser) {
            showModal('auth');
            return false;
        }
        if (!this.favorites) this.favorites = [];
        const idx = this.favorites.indexOf(id);
        if (idx === -1) {
            this.favorites.push(id);
        } else {
            this.favorites.splice(idx, 1);
        }
        this.saveState();
        this.notify();
        return true;
    }

    isFavorite(id) {
        if (!this.favorites) return false;
        return this.favorites.includes(id);
    }

    hasExpressedInterest(fromRole, musicianId, eventId) {
        if (!this.interests) this.interests = [];
        const interest = this.interests.find(i => i.musicianId === musicianId && i.eventId === eventId);
        if (!interest) return false;
        return fromRole === 'musician' ? !!interest.musicianInterested : !!interest.organizerInterested;
    }

    hasExpressedNoInterest(fromRole, musicianId, eventId) {
        if (!this.interests) this.interests = [];
        const interest = this.interests.find(i => i.musicianId === musicianId && i.eventId === eventId);
        if (!interest) return false;
        return fromRole === 'musician' ? !!interest.musicianNoInterest : !!interest.organizerNoInterest;
    }

    toggleInterest(fromRole, musicianId, eventId) {
        if (!this.interests) this.interests = [];
        let interest = this.interests.find(i => i.musicianId === musicianId && i.eventId === eventId);
        if (!interest) {
            interest = {
                musicianId: musicianId,
                eventId: eventId,
                musicianInterested: false,
                organizerInterested: false,
                musicianNoInterest: false,
                organizerNoInterest: false
            };
            this.interests.push(interest);
        }

        const isPerfect = !!interest.musicianInterested && !!interest.organizerInterested;
        if (isPerfect) {
            return { success: false, message: "Perfect Match ist bereits gesperrt.", isPerfectMatch: true };
        }

        if (fromRole === 'musician') {
            interest.musicianInterested = !interest.musicianInterested;
            if (interest.musicianInterested) {
                interest.musicianNoInterest = false;
            }
        } else {
            interest.organizerInterested = !interest.organizerInterested;
            if (interest.organizerInterested) {
                interest.organizerNoInterest = false;
            }
        }

        const isPerfectNow = !!interest.musicianInterested && !!interest.organizerInterested;
        this.saveState();
        this.notify();
        return { success: true, isPerfectMatch: isPerfectNow, active: fromRole === 'musician' ? interest.musicianInterested : interest.organizerInterested };
    }

    toggleNoInterest(fromRole, musicianId, eventId) {
        if (!this.interests) this.interests = [];
        let interest = this.interests.find(i => i.musicianId === musicianId && i.eventId === eventId);
        if (!interest) {
            interest = {
                musicianId: musicianId,
                eventId: eventId,
                musicianInterested: false,
                organizerInterested: false,
                musicianNoInterest: false,
                organizerNoInterest: false
            };
            this.interests.push(interest);
        }

        const isPerfect = !!interest.musicianInterested && !!interest.organizerInterested;
        if (isPerfect) {
            return { success: false, message: "Perfect Match ist bereits gesperrt." };
        }

        if (fromRole === 'musician') {
            interest.musicianNoInterest = !interest.musicianNoInterest;
            if (interest.musicianNoInterest) {
                interest.musicianInterested = false;
            }
        } else {
            interest.organizerNoInterest = !interest.organizerNoInterest;
            if (interest.organizerNoInterest) {
                interest.organizerInterested = false;
            }
        }

        this.saveState();
        this.notify();
        return { success: true, active: fromRole === 'musician' ? interest.musicianNoInterest : interest.organizerNoInterest };
    }

    expressInterest(fromRole, musicianId, eventId) {
        if (!this.interests) this.interests = [];
        let interest = this.interests.find(i => i.musicianId === musicianId && i.eventId === eventId);
        if (!interest) {
            interest = {
                musicianId: musicianId,
                eventId: eventId,
                musicianInterested: false,
                organizerInterested: false,
                musicianNoInterest: false,
                organizerNoInterest: false
            };
            this.interests.push(interest);
        }
        
        if (fromRole === 'musician') {
            interest.musicianInterested = true;
            interest.musicianNoInterest = false;
        } else {
            interest.organizerInterested = true;
            interest.organizerNoInterest = false;
        }

        const isPerfect = !!interest.musicianInterested && !!interest.organizerInterested;
        
        this.saveState();
        this.notify();
        return { success: true, isPerfectMatch: isPerfect };
    }

    getInitialChats() {
        return [
            {
                id: "chat_demo_1",
                participants: ["mus_1", "org_1"],
                messages: [
                    { senderId: "org_1", text: "Hallo! Wir finden euren Sound absolut genial. HÄttet ihr Zeit, bei unserer Hochzeit zu spielen?", timestamp: "2026-07-12T14:30:00Z" },
                    { senderId: "mus_1", text: "Hallo Julia! Vielen Dank für die Anfrage. Der 15. August 2026 passt uns super. Welche Art von Songs wÜnscht ihr euch?", timestamp: "2026-07-12T15:15:00Z" },
                    { senderId: "org_1", text: "Hauptsächlich Pop-Cover für die Party am Abend und etwas Ruhiges für den Sektempfang. Das Budget liegt bei ca. 800-1000 EUR.", timestamp: "2026-07-12T16:00:00Z" }
                ],
                updatedAt: "2026-07-12T16:00:00Z"
            },
            {
                id: "chat_system_mus_1",
                participants: ["mus_1", "system"],
                messages: [
                    { senderId: "system", text: "🚨 NEUES MATCHING: Ein Event mit 100% Match-Faktor wurde veröffentlicht! 'Sommerfestival Stadtstrand' passt perfekt zu Ihren Kriterien.", timestamp: "2026-07-13T10:00:00Z" }
                ],
                updatedAt: "2026-07-13T10:00:00Z"
            }
        ];
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notify() {
        this.runDailyMatchCheck();
        this.saveState();
        this.listeners.forEach(callback => callback(this));
        document.dispatchEvent(new CustomEvent('user-state-changed'));
    }

    login(email, password) {
        const musician = this.musicians.find(m => m.email && m.email.toLowerCase() === email.toLowerCase() && password === "pass123");
        if (musician) {
            this.currentUser = {
                id: musician.id,
                role: "musician",
                firstName: musician.contactName ? (musician.contactName.split(" ")[0] || "Musiker") : "Musiker",
                lastName: musician.contactName ? (musician.contactName.split(" ")[1] || "") : "",
                company: "Privatperson",
                phone: musician.phone,
                email: musician.email,
                isPremium: true,
                subscriptionPlan: musician.subscriptionPlan || "flex",
                subscriptionCancelled: musician.subscriptionCancelled || false,
                credits: musician.credits !== undefined ? musician.credits : 5,
                unlockedContacts: musician.unlockedContacts || [],
                profileId: musician.id,
                successfulGigs: 3,
                contactRequests: 5
            };
            this.notify();
            return { success: true, user: this.currentUser };
        }

        const event = this.events.find(e => e.email && e.email.toLowerCase() === email.toLowerCase() && password === "pass123");
        if (event) {
            this.currentUser = {
                id: event.creatorId,
                role: "organizer",
                firstName: event.contactName ? (event.contactName.split(" ")[0] || "Veranstalter") : "Veranstalter",
                lastName: event.contactName ? (event.contactName.split(" ")[1] || "") : "",
                company: "Privatperson",
                phone: event.phone,
                email: event.email,
                isPremium: true,
                profileId: event.creatorId,
                successfulGigs: 1,
                contactRequests: 2
            };
            this.notify();
            return { success: true, user: this.currentUser };
        }

        const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
        const registered = registeredUsers.find(u => u.email && u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (registered) {
            // Repair missing profiles dynamically on standard login
            if (registered.role === "musician") {
                const profileExists = this.musicians.some(m => m.id === registered.profileId || m.creatorId === registered.id || (m.email && m.email.toLowerCase() === email.toLowerCase()));
                if (!profileExists) {
                    const newMusician = {
                        id: registered.profileId || ("mus_" + registered.id),
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
                        availability: ["Friday", "Saturday"],
                        minPublikum: 0,
                        maxPublikum: 500,
                        description: "Professioneller Solo-Künstler für Events aller Art.",
                        technik: ["Technik vorhanden"],
                        company: registered.company || "Privatperson",
                        contactName: `${registered.firstName} ${registered.lastName}`,
                        phone: registered.phone,
                        email: registered.email,
                        isPremium: registered.isPremium,
                        subscriptionPlan: "flex",
                        credits: 5,
                        unlockedContacts: [],
                        socialLinks: { spotify: "", youtube: "", instagram: "" },
                        photos: [],
                        videos: [],
                        audio: [],
                        creatorId: registered.id
                    };
                    this.musicians.push(newMusician);
                    localStorage.setItem('GigConnAct_musicians', JSON.stringify(this.musicians));
                }
            } else if (registered.role === "organizer") {
                const profileExists = this.events.some(e => e.creatorId === registered.id || (e.email && e.email.toLowerCase() === email.toLowerCase()));
                if (!profileExists) {
                    const newEvent = {
                        id: registered.profileId || ("evt_" + registered.id),
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
                        company: registered.company || "Privatperson",
                        organizerType: registered.organizerType || "Privater Veranstalter",
                        contactName: `${registered.firstName} ${registered.lastName}`,
                        phone: registered.phone,
                        email: registered.email,
                        isOnline: true,
                        creatorId: registered.id
                    };
                    this.events.push(newEvent);
                    localStorage.setItem('GigConnAct_events', JSON.stringify(this.events));
                }
            }

            this.currentUser = {
                id: registered.id,
                role: registered.role,
                firstName: registered.firstName,
                lastName: registered.lastName,
                company: registered.company || "Privatperson",
                phone: registered.phone,
                email: registered.email,
                isPremium: true,
                subscriptionPlan: registered.role === "musician" ? (registered.subscriptionPlan || "flex") : "",
                subscriptionCancelled: registered.role === "musician" ? (registered.subscriptionCancelled || false) : false,
                credits: registered.role === "musician" ? (registered.credits !== undefined ? registered.credits : 5) : 0,
                unlockedContacts: registered.unlockedContacts || [],
                profileId: registered.profileId,
                successfulGigs: registered.successfulGigs || 0,
                contactRequests: registered.contactRequests || 0
            };
            this.notify();
            return { success: true, user: this.currentUser };
        }

        return { success: false, message: "Ungültige E-Mail-Adresse oder Passwort. Für Demo-Accounts nutze 'pass123' als Passwort." };
    }

    loginPasswordless(email) {
        const targetEmail = email.toLowerCase();
        
        const musician = this.musicians.find(m => m.email && m.email.toLowerCase() === targetEmail);
        if (musician) {
            this.currentUser = {
                id: musician.id,
                role: "musician",
                firstName: musician.contactName ? (musician.contactName.split(" ")[0] || "Musiker") : "Musiker",
                lastName: musician.contactName ? (musician.contactName.split(" ")[1] || "") : "",
                company: "Privatperson",
                phone: musician.phone,
                email: musician.email,
                isPremium: true,
                subscriptionPlan: musician.subscriptionPlan || "flex",
                subscriptionCancelled: musician.subscriptionCancelled || false,
                credits: musician.credits !== undefined ? musician.credits : 5,
                unlockedContacts: musician.unlockedContacts || [],
                profileId: musician.id,
                successfulGigs: 3,
                contactRequests: 5
            };
            this.notify();
            return { success: true, user: this.currentUser };
        }

        const event = this.events.find(e => e.email && e.email.toLowerCase() === targetEmail);
        if (event) {
            this.currentUser = {
                id: event.creatorId,
                role: "organizer",
                firstName: event.contactName ? (event.contactName.split(" ")[0] || "Veranstalter") : "Veranstalter",
                lastName: event.contactName ? (event.contactName.split(" ")[1] || "") : "",
                company: "Privatperson",
                phone: event.phone,
                email: event.email,
                isPremium: true,
                profileId: event.creatorId,
                successfulGigs: 1,
                contactRequests: 2
            };
            this.notify();
            return { success: true, user: this.currentUser };
        }

        const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
        const registered = registeredUsers.find(u => u.email && u.email.toLowerCase() === targetEmail);
        if (registered) {
            // Repair missing profiles dynamically
            if (registered.role === "musician") {
                const profileExists = this.musicians.some(m => m.id === registered.profileId || m.creatorId === registered.id || (m.email && m.email.toLowerCase() === targetEmail));
                if (!profileExists) {
                    const newMusician = {
                        id: registered.profileId || ("mus_" + registered.id),
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
                        availability: ["Friday", "Saturday"],
                        minPublikum: 0,
                        maxPublikum: 500,
                        description: "Professioneller Solo-Künstler für Events aller Art.",
                        technik: ["Technik vorhanden"],
                        company: registered.company || "Privatperson",
                        contactName: `${registered.firstName} ${registered.lastName}`,
                        phone: registered.phone,
                        email: registered.email,
                        isPremium: registered.isPremium,
                        subscriptionPlan: "flex",
                        credits: 5,
                        unlockedContacts: [],
                        socialLinks: { spotify: "", youtube: "", instagram: "" },
                        photos: [],
                        videos: [],
                        audio: [],
                        creatorId: registered.id
                    };
                    this.musicians.push(newMusician);
                    localStorage.setItem('GigConnAct_musicians', JSON.stringify(this.musicians));
                }
            } else if (registered.role === "organizer") {
                const profileExists = this.events.some(e => e.creatorId === registered.id || (e.email && e.email.toLowerCase() === targetEmail));
                if (!profileExists) {
                    const newEvent = {
                        id: registered.profileId || ("evt_" + registered.id),
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
                        company: registered.company || "Privatperson",
                        organizerType: registered.organizerType || "Privater Veranstalter",
                        contactName: `${registered.firstName} ${registered.lastName}`,
                        phone: registered.phone,
                        email: registered.email,
                        isOnline: true,
                        creatorId: registered.id
                    };
                    this.events.push(newEvent);
                    localStorage.setItem('GigConnAct_events', JSON.stringify(this.events));
                }
            }

            this.currentUser = {
                id: registered.id,
                role: registered.role,
                firstName: registered.firstName,
                lastName: registered.lastName,
                company: registered.company || "Privatperson",
                phone: registered.phone,
                email: registered.email,
                isPremium: true,
                subscriptionPlan: registered.role === "musician" ? (registered.subscriptionPlan || "flex") : "",
                subscriptionCancelled: registered.role === "musician" ? (registered.subscriptionCancelled || false) : false,
                credits: registered.role === "musician" ? (registered.credits !== undefined ? registered.credits : 5) : 0,
                unlockedContacts: registered.unlockedContacts || [],
                profileId: registered.profileId,
                successfulGigs: registered.successfulGigs || 0,
                contactRequests: registered.contactRequests || 0
            };
            this.notify();
            return { success: true, user: this.currentUser };
        }

        return { success: false, code: 'NOT_FOUND', message: "E-Mail-Adresse nicht gefunden." };
    }

    registerOnTheFly(email, role) {
        const id = role === "musician" ? "mus_" + Date.now() : "org_" + Date.now();
        const profileId = id;
        
        const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
        const firstName = role === "musician" ? "Demo-Musiker" : "Demo-Veranstalter";
        
        const newUser = {
            id,
            role,
            firstName,
            lastName: "Gast",
            company: "Privatperson",
            organizerType: role === "organizer" ? "Privater Veranstalter" : "",
            phone: "+49 170 1234567",
            email,
            password: "pass123",
            isPremium: true,
            subscriptionPlan: "flex",
            credits: role === "musician" ? 5 : 0,
            unlockedContacts: [],
            profileId,
            successfulGigs: 0,
            contactRequests: 0
        };
        registeredUsers.push(newUser);
        localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));

        if (role === "musician") {
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
                availability: ["Friday", "Saturday"],
                minPublikum: 0,
                maxPublikum: 500,
                description: "Professioneller Solo-Künstler für Events aller Art.",
                technik: ["Technik vorhanden"],
                company: "Privatperson",
                contactName: `${firstName} Gast`,
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
                creatorId: id
            };
            this.musicians.push(newMusician);
            localStorage.setItem('GigConnAct_musicians', JSON.stringify(this.musicians));
        } else if (role === "organizer") {
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
                contactName: `${firstName} Gast`,
                phone: "+49 170 1234567",
                email: email,
                isOnline: true,
                creatorId: id
            };
            this.events.push(newEvent);
            localStorage.setItem('GigConnAct_events', JSON.stringify(this.events));
        }

        return this.loginPasswordless(email);
    }

    logout() {
        this.currentUser = null;
        this.notify();
    }

    isUnlocked(targetId) {
        return !!this.currentUser;
    }

    hasContactAccess(activeId, targetId) {
        return !!this.currentUser;
    }

    unlockContact(targetId) {
        if (!this.currentUser) return { success: false, message: "Bitte melde dich an." };
        if (this.currentUser.credits <= 0 && !this.currentUser.isPremium) return { success: false, message: "Nicht genügend Credits." };
        
        if (!this.currentUser.isPremium) {
            this.currentUser.credits -= 1;
        }
        
        if (!this.currentUser.unlockedContacts) this.currentUser.unlockedContacts = [];
        if (!this.currentUser.unlockedContacts.includes(targetId)) {
            this.currentUser.unlockedContacts.push(targetId);
        }
        
        // Update registered users
        const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
        const index = registeredUsers.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) {
            registeredUsers[index].credits = this.currentUser.credits;
            registeredUsers[index].unlockedContacts = this.currentUser.unlockedContacts;
            localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));
        }

        // Also update musician profile if applicable
        const musician = this.musicians.find(m => m.id === this.currentUser.profileId);
        if (musician) {
            musician.credits = this.currentUser.credits;
            musician.unlockedContacts = this.currentUser.unlockedContacts;
        }
        
        this.saveState();
        this.notify();
        return { success: true };
    }

    addCredits(amount) {
        if (!this.currentUser) return;
        this.currentUser.credits = (this.currentUser.credits || 0) + amount;
        
        const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
        const index = registeredUsers.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) {
            registeredUsers[index].credits = this.currentUser.credits;
            localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));
        }

        const musician = this.musicians.find(m => m.id === this.currentUser.profileId);
        if (musician) {
            musician.credits = this.currentUser.credits;
        }

        this.saveState();
        this.notify();
    }

    register(payload) {
        const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
        const emailExists = this.musicians.some(m => m.email && m.email.toLowerCase() === payload.email.toLowerCase()) || 
                            this.events.some(e => e.email && e.email.toLowerCase() === payload.email.toLowerCase()) ||
                            registeredUsers.some(u => u.email && u.email.toLowerCase() === payload.email.toLowerCase());
        
        if (emailExists) {
            return { success: false, message: "Diese E-Mail-Adresse wird bereits verwendet." };
        }

        const id = "usr_" + Math.random().toString(36).substr(2, 9);
        const profileId = payload.role === "musician" ? "mus_" + id : "evt_" + id;

        const newUser = {
            id,
            role: payload.role,
            firstName: payload.firstName,
            lastName: payload.lastName,
            company: payload.company || "Privatperson",
            organizerType: payload.organizerType || "",
            phone: payload.phone,
            hidePhone: payload.hidePhone || false,
            email: payload.email,
            password: payload.password,
            profileId,
            isVerified: false,
            isPremium: payload.role === "musician" ? payload.sepaConsent : true,
            successfulGigs: 0,
            contactRequests: 0,
            rawData: payload
        };

        localStorage.setItem('GigConnAct_pending_user', JSON.stringify(newUser));
        return { success: true, user: newUser };
    }

    confirmEmail() {
        const pending = localStorage.getItem('GigConnAct_pending_user');
        if (!pending) return { success: false, message: "Keine ausstehende Registrierung gefunden." };

        const user = JSON.parse(pending);
        user.isVerified = true;

        const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
        registeredUsers.push({
            id: user.id,
            role: user.role,
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            company: user.company || "Privatperson",
            organizerType: user.organizerType || "",
            phone: user.phone,
            hidePhone: user.hidePhone || false,
            profileId: user.profileId,
            isPremium: user.isPremium,
            credits: user.role === "musician" ? 5 : 0,
            unlockedContacts: [],
            successfulGigs: 0,
            contactRequests: 0
        });
        localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));

        if (user.role === "musician") {
            const data = user.rawData;
            const newMusician = {
                id: user.profileId,
                name: data.bandName,
                bluffName: `Anonyme/r ${data.musicianType} (${data.genres[0] || 'Musik'})`,
                type: data.musicianType,
                location: data.locations ? data.locations.join(', ') : (data.location || 'München'),
                locations: data.locations || [data.location || 'München'],
                radius: parseInt(data.radius) || 50,
                genres: data.genres,
                instruments: data.instruments,
                minDuration: parseFloat(data.minDuration) || 1,
                maxDuration: parseFloat(data.maxDuration) || 3,
                minBudget: parseFloat(data.minBudget) || 150,
                maxBudget: parseFloat(data.maxBudget) || 1000,
                eventTypes: data.eventTypes,
                availability: data.availability,
                minPublikum: parseInt(data.minPublikum) || 0,
                maxPublikum: parseInt(data.maxPublikum) || 500,
                description: data.description,
                technik: data.technik || ["Technik ist noch unklar"],
                company: user.company || "Privatperson",
                contactName: `${user.firstName} ${user.lastName}`,
                phone: user.phone,
                hidePhone: data.hidePhone || false,
                email: user.email,
                isPremium: user.isPremium,
                subscriptionPlan: data.subscriptionPlan || "flex",
                credits: 5,
                unlockedContacts: [],
                socialLinks: { spotify: "", youtube: "", instagram: "" },
                photos: data.photos || (data.photoUrl ? [data.photoUrl] : []),
                videos: data.videos || (data.videoUrl ? [data.videoUrl] : []),
                audio: [],
                creatorId: user.id
            };
            this.musicians.push(newMusician);
        } else if (user.role === "organizer") {
            const data = user.rawData;
            const newEvent = {
                id: user.profileId,
                name: data.eventName,
                type: data.orgEventTypes ? data.orgEventTypes[0] : "",
                eventTypes: data.orgEventTypes || [],
                date: data.eventDates ? data.eventDates[0] : "",
                dates: data.eventDates || [],
                eventStartTime: data.eventStartTime || "18:00",
                eventEndTime: data.eventEndTime || "22:00",
                location: data.orgLocations ? data.orgLocations.join(', ') : "",
                locations: data.orgLocations || [],
                genres: data.orgGenres || [],
                instruments: data.orgInstruments || [],
                minDuration: parseFloat(data.orgMinDuration) || 0.5,
                maxDuration: parseFloat(data.orgMaxDuration) || 2.0,
                duration: parseFloat(data.orgMaxDuration) || 2.0,
                minPublikum: parseInt(data.orgMinPublikum) || 0,
                maxPublikum: parseInt(data.orgMaxPublikum) || 500,
                publikum: `${data.orgMinPublikum || 0} - ${data.orgMaxPublikum || 500}`,
                minBudget: parseFloat(data.orgMinBudget) || 0,
                maxBudget: parseFloat(data.orgMaxBudget) || 5000,
                description: data.orgDescription,
                technik: data.technik || ["Technik ist noch unklar"],
                company: user.company || "Privatperson",
                organizerType: data.organizerType || "",
                contactName: `${user.firstName} ${user.lastName}`,
                phone: user.phone,
                hidePhone: data.hidePhone || false,
                email: user.email,
                isOnline: true,
                photos: data.photos || (data.photoUrl ? [data.photoUrl] : []),
                videos: data.videos || (data.videoUrl ? [data.videoUrl] : []),
                creatorId: user.id
            };
            this.events.push(newEvent);
        }

        this.currentUser = {
            id: user.id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            company: user.company || "Privatperson",
            organizerType: user.organizerType || "",
            eventStartTime: user.role === "organizer" ? (user.rawData?.eventStartTime || "18:00") : undefined,
            eventEndTime: user.role === "organizer" ? (user.rawData?.eventEndTime || "22:00") : undefined,
            phone: user.phone,
            hidePhone: user.hidePhone || false,
            email: user.email,
            isPremium: user.isPremium,
            profileId: user.profileId,
            successfulGigs: 0,
            contactRequests: 0
        };

        localStorage.removeItem('GigConnAct_pending_user');
        this.notify();
        return { success: true, user: this.currentUser };
    }

    getChat(chatId) {
        return this.chats.find(c => c.id === chatId);
    }

    getChatsForUser(userId) {
        return this.chats.filter(c => 
            c.participants.includes(userId)
        ).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    sendMessage(recipientId, text) {
        if (!this.currentUser) return { success: false, message: "Bitte melde dich an." };
        const senderId = this.currentUser.role === 'musician' 
            ? (this.activeMusicianId || this.currentUser.profileId) 
            : (this.activeEventId || this.currentUser.id);
        
        let chat = this.chats.find(c => 
            (c.participants.includes(senderId) && c.participants.includes(recipientId))
        );

        if (!chat) {
            chat = {
                id: "chat_" + Math.random().toString(36).substr(2, 9),
                participants: [senderId, recipientId],
                messages: [],
                updatedAt: new Date().toISOString()
            };
            this.chats.push(chat);
        }

        const newMessage = {
            senderId,
            text,
            timestamp: new Date().toISOString()
        };

        chat.messages.push(newMessage);
        chat.updatedAt = new Date().toISOString();
        
        // Mark as unread for the recipient (remove from read list)
        this.readChats = this.readChats.filter(id => id !== chat.id);

        // Trigger mock email for sent message
        const recipientName = this.musicians.find(m => m.id === recipientId)?.name || this.events.find(e => e.creatorId === recipientId)?.contactName || "Musiker/Veranstalter";
        if (typeof window.addMockEmail === 'function') {
            window.addMockEmail(
                `Gesendete Anfrage an ${recipientName}`,
                `GigConnAct <no-reply@gigconnact.de>`,
                `Hallo ${this.currentUser.firstName},\n\ndeine Anfrage an ${recipientName} mit folgendem Inhalt wurde erfolgreich übermittelt:\n\n"${text}"`
            );
        }

        // Schedule mock reply from counterparty after 3s
        setTimeout(() => {
            if (this.currentUser && recipientId !== 'system') {
                const replies = this.currentUser.role === 'musician'
                    ? [
                        "Hi! Das klingt super. Euer Profil gefällt uns sehr gut. Seid ihr an dem gewünschten Termin noch flexibel?",
                        "Hallo! Vielen Dank für die Anfrage. Wir schauen uns die Details an und melden uns in Kürze wieder bei euch.",
                        "Guten Tag, danke für die Nachricht. Das Angebot klingt sehr interessant. Könnten wir vorab kurz telefonieren?"
                      ]
                    : [
                        "Hallo! Danke für die Nachricht. Das passt zeitlich perfekt bei uns. Wann können wir die Einzelheiten besprechen?",
                        "Hi! Eure Anfrage freut uns sehr. Wir haben großes Interesse. Welche Liedwünsche habt ihr denn?",
                        "Vielen Dank für die Anfrage. Wir sind an diesem Tag verfügbar und würden uns freuen, bei eurem Event zu spielen."
                      ];
                const randomReply = replies[Math.floor(Math.random() * replies.length)];
                this.receiveMessage(recipientId, senderId, randomReply);
                
                // Push notifications disabled per user request
                /*
                if (typeof showToast === 'function') {
                    showToast({
                        title: "Neue Nachricht erhalten! ✉️",
                        message: `Antwort von ${recipientName} im Postfach.`
                    });
                }
                */
            }
        }, 3000);
        
        this.notify();
        return { success: true, chat };
    }

    receiveMessage(senderId, recipientId, text) {
        let chat = this.chats.find(c => 
            (c.participants.includes(senderId) && c.participants.includes(recipientId))
        );
        if (!chat) return;

        const newMessage = {
            senderId,
            text,
            timestamp: new Date().toISOString()
        };
        chat.messages.push(newMessage);
        chat.updatedAt = new Date().toISOString();
        
        this.readChats = this.readChats.filter(id => id !== chat.id);
        
        const user = this.currentUser;
        if (user && (user.id === recipientId || user.profileId === recipientId)) {
            const senderName = this.musicians.find(m => m.id === senderId)?.name || this.events.find(e => e.creatorId === senderId)?.contactName || "Musiker/Veranstalter";
            if (typeof window.addMockEmail === 'function') {
                window.addMockEmail(
                    `Neue Anfrage von ${senderName}`,
                    `${senderName} via GigConnAct <no-reply@gigconnact.de>`,
                    `Hallo ${user.firstName},\n\ndu hast eine neue Nachricht von ${senderName} erhalten:\n\n"${text}"\n\nLogge dich bei GigConnAct ein, um direkt im Postfach zu antworten.`
                );
            }
        }
        
        this.notify();
        
        if (window.location.hash.includes('postbox') && typeof window.handleRouting === 'function') {
            window.handleRouting();
        }
    }

    initiateContact(targetId, targetName, eventId) {
        if (!this.currentUser) return { success: false, redirectAuth: true };
        
        const recipientId = eventId || targetId;
        const senderId = this.currentUser.role === 'musician' 
            ? (this.activeMusicianId || this.currentUser.profileId) 
            : (this.activeEventId || this.currentUser.id);

        let chat = this.chats.find(c => 
            c.participants.includes(senderId) && c.participants.includes(recipientId)
        );

        if (!chat) {
            chat = {
                id: "chat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
                participants: [senderId, recipientId],
                messages: [],
                updatedAt: new Date().toISOString(),
                initiatorId: senderId
            };
            this.chats.push(chat);
        }
        
        this.currentUser.contactRequests = (this.currentUser.contactRequests || 0) + 1;
        this.notify();

        return { success: true, chatId: chat.id };
    }

    addSystemNotification(recipientId, text) {
        let chat = this.chats.find(c => c.participants.includes(recipientId) && c.participants.includes("system"));
        if (!chat) {
            chat = {
                id: "chat_sys_" + Math.random().toString(36).substr(2, 9),
                participants: [recipientId, "system"],
                messages: [],
                updatedAt: new Date().toISOString()
            };
            this.chats.push(chat);
        }
        
        chat.messages.push({
            senderId: "system",
            text,
            timestamp: new Date().toISOString()
        });
        chat.updatedAt = new Date().toISOString();

        // Mark as unread
        this.readChats = this.readChats.filter(id => id !== chat.id);

        // Add to email preview
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

        this.notify();
    }

    markChatAsRead(chatId) {
        if (!this.readChats.includes(chatId)) {
            this.readChats.push(chatId);
            this.notify();
        }
    }

    getUnreadCount() {
        if (!this.currentUser) return 0;
        let myProfileIds = [];
        if (this.currentUser.role === 'musician') {
            myProfileIds = this.musicians.filter(m => m.creatorId === this.currentUser.id || m.id === this.currentUser.profileId).map(m => m.id);
            if (this.currentUser.profileId && !myProfileIds.includes(this.currentUser.profileId)) {
                myProfileIds.push(this.currentUser.profileId);
            }
        } else {
            myProfileIds = this.events.filter(e => e.creatorId === this.currentUser.id).map(e => e.id);
            if (this.currentUser.id && !myProfileIds.includes(this.currentUser.id)) {
                myProfileIds.push(this.currentUser.id);
            }
        }
        
        const myChats = this.chats.filter(c => c.participants.some(p => myProfileIds.includes(p)));
        
        return myChats.filter(c => {
            if (this.readChats.includes(c.id)) return false;
            if (c.messages.length === 0) return false;
            const lastMsg = c.messages[c.messages.length - 1];
            return !myProfileIds.includes(lastMsg.senderId);
        }).length;
    }

    updateProfilePicture(dataUrl) {
        if (!this.currentUser) return;
        const profileId = this.currentUser.profileId;
        
        if (this.currentUser.role === 'musician') {
            const musician = this.musicians.find(m => m.id === profileId);
            if (musician) {
                musician.profilePic = dataUrl;
            }
        } else {
            const event = this.events.find(e => e.creatorId === this.currentUser.id);
            if (event) {
                event.profilePic = dataUrl;
            }
        }
        this.notify();
    }

    incrementSuccessfulGigs() {
        if (!this.currentUser) return;
        this.currentUser.successfulGigs = (this.currentUser.successfulGigs || 0) + 1;
        
        const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
        const index = registeredUsers.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) {
            registeredUsers[index].successfulGigs = this.currentUser.successfulGigs;
            localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));
        }

        this.notify();
    }

    updateProfile(updatedData) {
        if (!this.currentUser) return { success: false };
        
        // Update current user
        this.currentUser.firstName = updatedData.firstName;
        this.currentUser.lastName = updatedData.lastName;
        this.currentUser.company = updatedData.company || "Privatperson";
        this.currentUser.organizerType = updatedData.organizerType || "";
        this.currentUser.phone = updatedData.phone;
        this.currentUser.hidePhone = updatedData.hidePhone || false;
        this.currentUser.email = updatedData.email;
        
        // Update user storage
        const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
        const index = registeredUsers.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) {
            registeredUsers[index].firstName = this.currentUser.firstName;
            registeredUsers[index].lastName = this.currentUser.lastName;
            registeredUsers[index].company = this.currentUser.company;
            registeredUsers[index].organizerType = this.currentUser.organizerType;
            registeredUsers[index].phone = this.currentUser.phone;
            registeredUsers[index].hidePhone = this.currentUser.hidePhone;
            registeredUsers[index].email = this.currentUser.email;
            if (updatedData.password) {
                registeredUsers[index].password = updatedData.password;
            }
            localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));
        }

        // Also update contact details on their created musicians and events!
        this.musicians.forEach(m => {
            if (m.creatorId === this.currentUser.id) {
                m.company = this.currentUser.company;
                m.contactName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
                m.phone = this.currentUser.phone;
                m.hidePhone = this.currentUser.hidePhone;
                m.email = this.currentUser.email;
            }
        });
        this.events.forEach(e => {
            if (e.creatorId === this.currentUser.id) {
                e.company = this.currentUser.company;
                e.organizerType = this.currentUser.organizerType || "";
                e.contactName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
                e.phone = this.currentUser.phone;
                e.hidePhone = this.currentUser.hidePhone;
                e.email = this.currentUser.email;
            }
        });
        
        this.saveState();
        this.notify();
        return { success: true };
    }

    deleteAccount() {
        if (!this.currentUser) return { success: false };
        const userId = this.currentUser.id;
        
        // 1. Delete user's musician profiles
        this.musicians = this.musicians.filter(m => m.creatorId !== userId);
        
        // 2. Delete user's event profiles
        this.events = this.events.filter(e => e.creatorId !== userId);
        
        // 3. Delete user's chats
        this.chats = this.chats.filter(c => !c.participants.includes(userId));
        
        // 4. Delete user from registered users database
        const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
        const updatedUsers = registeredUsers.filter(u => u.id !== userId);
        localStorage.setItem('GigConnAct_registered_users', JSON.stringify(updatedUsers));
        
        // 5. Logout current user
        this.currentUser = null;
        
        this.saveState();
        this.notify();
        return { success: true };
    }

    addEvent(eventData) {
        if (!this.currentUser) return { success: false };
        const newEvent = {
            id: 'evt_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            creatorId: this.currentUser.id,
            createdAt: new Date().toISOString(),
            ...eventData
        };
        this.events.push(newEvent);
        this.saveState();
        this.notify();
        return { success: true, event: newEvent };
    }

    updateEvent(eventId, updatedData) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            Object.assign(event, updatedData);
            this.saveState();
            this.notify();
            return { success: true };
        }
        return { success: false };
    }

    deleteEvent(eventId) {
        const index = this.events.findIndex(e => e.id === eventId);
        if (index !== -1) {
            this.events.splice(index, 1);
            this.saveState();
            this.notify();
            return { success: true };
        }
        return { success: false };
    }

    markMusicianFound(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            event.musicianFound = true;
            const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
            const creator = registeredUsers.find(u => u.id === event.creatorId);
            if (creator) {
                creator.successfulGigs = (creator.successfulGigs || 0) + 1;
                localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));
            }
            if (this.currentUser && this.currentUser.id === event.creatorId) {
                this.currentUser.successfulGigs = (this.currentUser.successfulGigs || 0) + 1;
            }
            this.saveState();
            this.notify();
            return { success: true };
        }
        return { success: false, message: 'Event nicht gefunden' };
    }

    markEventCanceled(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            event.isCanceled = true;
            this.saveState();
            this.notify();
            return { success: true };
        }
        return { success: false };
    }
 
    reactivateEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            event.isCanceled = false;
            event.musicianFound = false;
            this.saveState();
            this.notify();
            return { success: true };
        }
        return { success: false };
    }

    addMusician(musicianData) {
        if (!this.currentUser) return { success: false };
        const newMusician = {
            id: 'mus_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            creatorId: this.currentUser.id,
            createdAt: new Date().toISOString(),
            photos: [],
            videos: [],
            audio: [],
            socialLinks: { spotify: "", youtube: "", instagram: "" },
            ...musicianData
        };
        this.musicians.push(newMusician);
        this.saveState();
        this.notify();
        return { success: true, musician: newMusician };
    }

    updateMusician(musicianId, updatedData) {
        const musician = this.musicians.find(m => m.id === musicianId);
        if (musician) {
            Object.assign(musician, updatedData);
            this.saveState();
            this.notify();
            return { success: true };
        }
        return { success: false };
    }

    deleteMusician(musicianId) {
        const index = this.musicians.findIndex(m => m.id === musicianId);
        if (index !== -1) {
            this.musicians.splice(index, 1);
            this.saveState();
            this.notify();
            return { success: true };
        }
        return { success: false };
    }

    toggleMusicianActive(musicianId) {
        const musician = this.musicians.find(m => m.id === musicianId);
        if (musician) {
            musician.isActive = musician.isActive === false ? true : false;
            this.saveState();
            this.notify();
            return { success: true, isActive: musician.isActive };
        }
    }

    toggleEventActive(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            event.isActive = event.isActive === false ? true : false;
            this.saveState();
            this.notify();
            return { success: true, isActive: event.isActive };
        }
        return { success: false };
    }

    addMusicianApplication(musicianId, eventId) {
        const musician = this.musicians.find(m => m.id === musicianId);
        if (musician) {
            musician.applications = musician.applications || [];
            if (!musician.applications.some(app => app.eventId === eventId)) {
                musician.applications.push({ eventId, status: 'contacted' });
                this.saveState();
                this.notify();
            }
            return { success: true };
        }
        return { success: false };
    }

    setApplicationStatus(musicianId, eventId, status) {
        const musician = this.musicians.find(m => m.id === musicianId);
        if (musician && musician.applications) {
            const app = musician.applications.find(a => a.eventId === eventId);
            if (app) {
                app.status = status; // 'contacted' | 'booked' | 'declined'
                this.saveState();
                this.notify();
                return { success: true, status: app.status };
            }
        }
        return { success: false };
    }

        acceptMusicianRequest(musicianId, eventId) {
        if (!this.interests) this.interests = [];
        let interest = this.interests.find(i => i.musicianId === musicianId && i.eventId === eventId);
        if (!interest) {
            interest = {
                musicianId: musicianId,
                eventId: eventId,
                musicianInterested: true,
                organizerInterested: true,
                musicianNoInterest: false,
                organizerNoInterest: false
            };
            this.interests.push(interest);
        } else {
            interest.musicianInterested = true;
            interest.organizerInterested = true;
            interest.musicianNoInterest = false;
            interest.organizerNoInterest = false;
        }
        this.setApplicationStatus(musicianId, eventId, 'booked');
        this.saveState();
        this.notify();
        return { success: true };
    }

    declineMusicianRequest(musicianId, eventId) {
        if (!this.interests) this.interests = [];
        let interest = this.interests.find(i => i.musicianId === musicianId && i.eventId === eventId);
        if (!interest) {
            interest = {
                musicianId: musicianId,
                eventId: eventId,
                musicianInterested: true,
                organizerInterested: false,
                musicianNoInterest: false,
                organizerNoInterest: true
            };
            this.interests.push(interest);
        } else {
            interest.organizerInterested = false;
            interest.organizerNoInterest = true;
        }
        this.setApplicationStatus(musicianId, eventId, 'declined');
        this.saveState();
        this.notify();
        return { success: true };
    }

    addMedia(musicianId, type, fileUrl) {
        if (!this.currentUser || this.currentUser.role !== "musician") return;
        const musician = this.musicians.find(m => m.id === musicianId);
        if (!musician) return;

        if (type === "photo" && musician.photos.length < 3) {
            musician.photos.push(fileUrl);
        } else if (type === "video" && musician.videos.length < 1) {
            musician.videos.push(fileUrl);
        } else if (type === "audio" && musician.audio.length < 3) {
            musician.audio.push(fileUrl);
        }
        
        this.saveState();
        this.notify();
    }

    deleteMedia(musicianId, type, index) {
        if (!this.currentUser || this.currentUser.role !== "musician") return;
        const musician = this.musicians.find(m => m.id === musicianId);
        if (!musician) return;

        if (type === "photo") {
            musician.photos.splice(index, 1);
        } else if (type === "video") {
            musician.videos.splice(index, 1);
        } else if (type === "audio") {
            musician.audio.splice(index, 1);
        }

        this.saveState();
        this.notify();
    }

    toggleSubscription() {
        if (!this.currentUser || this.currentUser.role !== "musician") return;
        this.currentUser.isPremium = !this.currentUser.isPremium;
        
        const musician = this.musicians.find(m => m.id === this.currentUser.profileId);
        if (musician) {
            musician.isPremium = this.currentUser.isPremium;
        }

        const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
        const index = registeredUsers.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) {
            registeredUsers[index].isPremium = this.currentUser.isPremium;
            localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));
        }

        this.notify();
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

function calculateMatch(musician, event, searcherRole = 'musician') {
    // 1. Musiker-Typ (20 %)
    let typeScore = 0;
    if (event.musicianTypes && event.musicianTypes.some(t => t.toLowerCase() === musician.type.toLowerCase())) {
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
        const eventRadius = event.radius || 100; // Event search radius defaults to 100 km
        if (distance <= eventRadius) {
            ortScore = 10;
        }
    }

    // 3. Genres (20 %)
    let genresScore = 0;
    const evGenres = event.genres || [];
    const musGenres = musician.genres || [];
    if (evGenres.length > 0) {
        const commonGenres = evGenres.filter(g => musGenres.some(mg => mg.toLowerCase() === g.toLowerCase()));
        genresScore = (commonGenres.length / evGenres.length) * 20;
    }

    // 4. Instrumente (5 %)
    let instScore = 0;
    const evInst = event.instruments || [];
    const musInst = musician.instruments || [];
    if (evInst.length > 0) {
        const commonInst = evInst.filter(i => musInst.some(mi => mi.toLowerCase() === i.toLowerCase()));
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
    const musEventTypes = musician.eventTypes || [];
    const evType = event.type || event.eventType || '';
    const evTypes = event.eventTypes || (evType ? [evType] : []);
    if (evTypes.some(t => musEventTypes.some(mt => mt.toLowerCase() === t.toLowerCase()))) {
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
        matchedCount: typeScore > 0 ? 1 : 0 // dummy for matches logic backwards compatibility
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
    const isUserLoggedIn = !!state.currentUser;

    const bottomCtaButtonHtml = isUserLoggedIn 
        ? `<button class="btn" id="btn-bottom-dashboard-trigger" style="background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); border: 1.5px solid rgba(255,255,255,0.15); color: #ffffff; padding: 0.95rem 2.4rem; font-weight: 800; font-size: 1.15rem; border-radius: 15px; box-shadow: none; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; display: inline-flex; align-items: center; gap: 0.6rem; white-space: nowrap;" onmouseover="this.style.transform='scale(1.03)';" onmouseout="this.style.transform='scale(1)';">
               <i class="fa-solid fa-gauge-high"></i> Mein Dashboard
           </button>`
        : ``;

    container.innerHTML = `
        <div class="landing-page-wrapper" style="position: relative; overflow: hidden; padding-bottom: 5rem; margin: 0; width: 100%;">
            
            <!-- 1. Fullscreen 100vh Hero Background Video Section -->
            <div class="landing-hero" style="position: relative; width: 100%; height: 100vh; height: 100dvh; display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center; overflow: hidden; margin: 0; padding: 22vh 1.5rem 9rem; border-bottom: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                
                <!-- Seamless Dual Background Videos (Scaled to crop out Capcut watermark and cross-fade) -->
                <video id="hero-bg-video-1" autoplay muted playsinline style="position: absolute; top: -12%; left: -12%; width: 124%; height: 124%; object-fit: cover; z-index: 2; opacity: 1; transition: opacity 1.5s ease-in-out;">
                    <source src="hochzeit.mp4" type="video/mp4">
                </video>
                <video id="hero-bg-video-2" muted playsinline style="position: absolute; top: -12%; left: -12%; width: 124%; height: 124%; object-fit: cover; z-index: 1; opacity: 0; transition: opacity 1.5s ease-in-out;">
                </video>

                <!-- Dark overlay gradient -->
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(15, 23, 42, 0.78) 0%, rgba(30, 58, 138, 0.72) 50%, rgba(124, 58, 237, 0.68) 100%); z-index: 2;"></div>

                <!-- 1/3: Large Logo -->
                <div class="brand-logo-center" style="position: relative; z-index: 3; width: 100%; max-width: 600px; display: flex; align-items: center; justify-content: center; gap: 1rem; filter: drop-shadow(0 10px 25px rgba(0,0,0,0.5)); margin: 0 auto; padding: 0 0.8rem; box-sizing: border-box;">
                    <!-- Large SVG Disco Ball -->
                    <svg viewBox="0 0 100 100" style="width: clamp(2.8rem, 7.5vw, 4.8rem); height: clamp(2.8rem, 7.5vw, 4.8rem); flex-shrink: 0;">
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
                      <!-- Sparkles -->
                      <g transform="translate(22, 25)" filter="url(#glowLarge)"><polygon points="0,-8 2,-2 8,0 2,2 0,8 -2,2 -8,0 -2,-2" fill="#ffffff" /></g>
                      <g transform="translate(75, 30)" filter="url(#glowLarge)"><polygon points="0,-6 1.5,-1.5 6,0 1.5,1.5 0,6 -1.5,1.5 -6,0 -1.5,-1.5" fill="#ffffff" /></g>
                      <g transform="translate(68, 68)" filter="url(#glowLarge)"><polygon points="0,-7 1.8,-1.8 7,0 1.8,1.8 0,7 -1.8,1.8 -7,0 -1.8,-1.8" fill="#ffffff" /></g>
                    </svg>
                    <div style="font-family: var(--font-heading); font-size: clamp(2.4rem, 6.5vw, 4.2rem); font-weight: 900; letter-spacing: -1.5px; display: flex; white-space: nowrap; background: linear-gradient(135deg, #6d28d9 0%, #1e40af 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        GigConnAct
                    </div>
                </div>

                <!-- 2/3: CTA Buttons -->
                <div class="hero-cta-buttons" style="position: relative; z-index: 3; margin: 0; gap: 2rem;">
                    <button class="btn" id="btn-hero-musician" style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); border: none; color: #ffffff; padding: 1.5rem; font-weight: 800; border-radius: 20px; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.55); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.4rem; min-width: 210px; min-height: 165px;" onmouseover="this.style.transform='scale(1.04)';" onmouseout="this.style.transform='scale(1)';">
                        <i class="fa-solid fa-guitar" style="font-size: 3.2rem;"></i>
                        <span style="font-size: 1.5rem; font-weight: 800; display: block; line-height: 1.2;">Musiker</span>
                        <span style="font-size: 0.85rem; font-weight: 500; display: block; opacity: 0.85; text-transform: none; line-height: 1;">Ich suche Gigs</span>
                    </button>
                    <button class="btn" id="btn-hero-organizer" style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); border: none; color: #ffffff; padding: 1.5rem; font-weight: 800; border-radius: 20px; box-shadow: 0 10px 30px rgba(37, 99, 235, 0.55); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.4rem; min-width: 210px; min-height: 165px;" onmouseover="this.style.transform='scale(1.04)';" onmouseout="this.style.transform='scale(1)';">
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

            <!-- 2. SECTION 1: Musiker-Profile Marquee -->
            <div style="max-width: 1400px; margin: 0 auto; padding: 2rem 1.5rem 0;">
                <div class="logo-marquee-wrapper theme-musicians-marquee" style="margin-bottom: 2.2rem;">
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

                <div class="carousel-container">
                    <div class="carousel-viewport">
                        <div class="carousel-track theme-organizer" id="carousel-track-musicians">
                            ${renderMarketGridHTML(state.musicians.slice(0, 9), false, true)}
                        </div>
                    </div>
                    <button class="carousel-btn prev-btn btn-musicians" onclick="slideCarousel('musicians', -1)">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <button class="carousel-btn next-btn btn-musicians" onclick="slideCarousel('musicians', 1)">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>

            <!-- 3. SECTION 2: Event-Profile Marquee -->
            <div style="max-width: 1400px; margin: 0 auto; padding: 0.5rem 1.5rem 0;">
                <div class="logo-marquee-wrapper theme-events-marquee" style="margin-bottom: 2.2rem;">
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

                <div class="carousel-container">
                    <div class="carousel-viewport">
                        <div class="carousel-track theme-musician" id="carousel-track-events">
                            ${renderMarketGridHTML(state.events.slice(0, 9), true, true)}
                        </div>
                    </div>
                    <button class="carousel-btn prev-btn btn-events" onclick="slideCarousel('events', -1)">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <button class="carousel-btn next-btn btn-events" onclick="slideCarousel('events', 1)">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>

            <!-- 3.5. EVENT TYPES SECTION -->
            <div style="max-width: 1400px; margin: 5rem auto 3rem; padding: 0 1.5rem; text-align: center;">
                <h2 style="font-family: var(--font-heading); font-size: clamp(1.6rem, 3.2vw, 2.5rem); font-weight: 900; color: var(--text-main); margin: 0 0 2.5rem; line-height: 1.2;">
                    Live-Musik für jedes Event
                </h2>
                
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

                    <!-- Card 6: Gartenpartys -->
                    <div class="event-type-card card-blue">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(96, 165, 250, 0.35);">
                            <i class="fa-solid fa-champagne-glasses" style="color: #2563eb; font-size: 1.4rem;"></i>
                        </div>
                        <span style="font-size: 0.88rem; font-weight: 800; color: var(--text-main); line-height: 1.2;">Gartenpartys</span>
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
                            <div style="background: rgba(124, 58, 237, 0.1); color: #7c3aed; border-radius: 20px; padding: 0.4rem 0.9rem; font-size: 0.78rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 1.2rem; text-transform: uppercase;">
                                <i class="fa-solid fa-guitar"></i> Für Musiker
                            </div>
                            
                            <!-- Title and Illustration Row -->
                            <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                                <h3 style="font-family: var(--font-heading); font-size: clamp(1.4rem, 2.5vw, 1.95rem); font-weight: 900; color: var(--text-main); margin: 0; line-height: 1.25; text-align: left;">
                                    <span style="color: #7c3aed;">Mehr Gigs.</span><br>Mehr Einnahmen.
                                </h3>
                                <!-- Illustration: guitar + music notes -->
                                <div style="width: 76px; height: 76px; background: rgba(124, 58, 237, 0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0;">
                                    <i class="fa-solid fa-guitar" style="font-size: 2.2rem; color: #7c3aed; transform: rotate(-15deg);"></i>
                                    <i class="fa-solid fa-music" style="font-size: 0.9rem; color: #a78bfa; position: absolute; top: 12px; right: 12px; animation: bounce 2s infinite;"></i>
                                </div>
                            </div>

                            <!-- List stack -->
                            <div style="display: flex; flex-direction: column; gap: 1.1rem; width: 100%;">
                                
                                <!-- Item 1 -->
                                <div style="display: flex; align-items: flex-start; gap: 1rem; padding-bottom: 0.9rem; border-bottom: 1px solid rgba(226, 232, 240, 0.4); min-height: 60px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(124, 58, 237, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(167, 139, 250, 0.35);">
                                        <i class="fa-solid fa-unlock-keyhole" style="color: #7c3aed; font-size: 1rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.15rem; text-align: left;">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); display: flex; gap: 0.5rem; align-items: center;">
                                            Kostenloser Zugang zu Events
                                        </div>
                                        <div style="font-size: 0.84rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">
                                            Hochzeiten, Geburtstage, Firmenfeiern, Kirmes, Gartenpartys etc.
                                        </div>
                                    </div>
                                </div>

                                <!-- Item 2 -->
                                <div style="display: flex; align-items: flex-start; gap: 1rem; padding-bottom: 0.9rem; border-bottom: 1px solid rgba(226, 232, 240, 0.4); min-height: 60px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(124, 58, 237, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(167, 139, 250, 0.35);">
                                        <i class="fa-solid fa-sliders" style="color: #7c3aed; font-size: 1rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.15rem; text-align: left;">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); display: flex; gap: 0.5rem; align-items: center;">
                                            Passende Events
                                        </div>
                                        <div style="font-size: 0.84rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">
                                            Event-Art, Entfernung, Gage, Verfügbarkeit etc.
                                        </div>
                                    </div>
                                </div>

                                <!-- Item 3 -->
                                <div style="display: flex; align-items: flex-start; gap: 1rem; padding-bottom: 0.9rem; border-bottom: 1px solid rgba(226, 232, 240, 0.4); min-height: 60px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(124, 58, 237, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(167, 139, 250, 0.35);">
                                        <i class="fa-solid fa-comments" style="color: #7c3aed; font-size: 1rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.15rem; text-align: left;">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); display: flex; gap: 0.5rem; align-items: center;">
                                            Direkter Kontakt zu Veranstaltern
                                        </div>
                                        <div style="font-size: 0.84rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">
                                            Telefonnummern, Mail-Adressen, Nachrichten im GigConnAct-Postfach
                                        </div>
                                    </div>
                                </div>

                                <!-- Item 4 -->
                                <div style="display: flex; align-items: flex-start; gap: 1rem; padding-bottom: 0.9rem; border-bottom: 1px solid rgba(226, 232, 240, 0.4); min-height: 60px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(124, 58, 237, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(167, 139, 250, 0.35);">
                                        <i class="fa-solid fa-envelope" style="color: #7c3aed; font-size: 1rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.15rem; text-align: left;">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); display: flex; gap: 0.5rem; align-items: center;">
                                            Interessante Anfragen
                                        </div>
                                        <div style="font-size: 0.84rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">
                                            Nicht nur Anfragen an Veranstalter senden – sondern auch erhalten
                                        </div>
                                    </div>
                                </div>

                                <!-- Item 5 -->
                                <div style="display: flex; align-items: flex-start; gap: 1rem; padding-bottom: 0.9rem; border-bottom: 1px solid rgba(226, 232, 240, 0.4); min-height: 60px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(124, 58, 237, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(167, 139, 250, 0.35);">
                                        <i class="fa-solid fa-star" style="color: #7c3aed; font-size: 1rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.15rem; text-align: left;">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); display: flex; gap: 0.5rem; align-items: center;">
                                            Top-Vorschläge
                                        </div>
                                        <div style="font-size: 0.84rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">
                                            Automatische Empfehlungen von GigConnAct zu Events
                                        </div>
                                    </div>
                                </div>

                                <!-- Item 6 -->
                                <div style="display: flex; align-items: flex-start; gap: 1rem; padding-bottom: 0.9rem; border-bottom: 1px solid rgba(226, 232, 240, 0.4); min-height: 60px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(124, 58, 237, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(167, 139, 250, 0.35);">
                                        <i class="fa-solid fa-bolt" style="color: #7c3aed; font-size: 1rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.15rem; text-align: left;">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); display: flex; gap: 0.5rem; align-items: center;">
                                            Schnelle Anmeldung
                                        </div>
                                        <div style="font-size: 0.84rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">
                                            Anlegen des Musiker-Profils ohne Passwort
                                        </div>
                                    </div>
                                </div>

                                <!-- Item 7 -->
                                <div style="display: flex; align-items: flex-start; gap: 1rem; min-height: 60px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(124, 58, 237, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(167, 139, 250, 0.35);">
                                        <i class="fa-solid fa-shield-halved" style="color: #7c3aed; font-size: 1rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.15rem; text-align: left;">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); display: flex; gap: 0.5rem; align-items: center;">
                                            Keine Provisionskosten
                                        </div>
                                        <div style="font-size: 0.84rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">
                                            Preiswertes Abo-Modell (jederzeit kündbar)
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div style="margin-top: 2rem; text-align: center; width: 100%;">
                            <button id="btn-benefits-to-events" class="btn-homepage-market theme-musician" style="width: 100%; box-sizing: border-box;">
                                Hier geht´s zum Event-Markt <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Right column: Veranstalter benefits -->
                    <div class="benefit-split-card card-organizer">
                        <div>
                            <!-- Header badge -->
                            <div style="background: rgba(37, 99, 235, 0.1); color: #2563eb; border-radius: 20px; padding: 0.4rem 0.9rem; font-size: 0.78rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 1.2rem; text-transform: uppercase;">
                                <i class="fa-solid fa-building"></i> Für Veranstalter
                            </div>
                            
                            <!-- Title and Illustration Row -->
                            <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                                <h3 style="font-family: var(--font-heading); font-size: clamp(1.4rem, 2.5vw, 1.95rem); font-weight: 900; color: var(--text-main); margin: 0; line-height: 1.25; text-align: left;">
                                    <span style="color: #2563eb;">Dein Event.</span><br>Dein Act.
                                </h3>
                                <!-- Illustration: calendar -->
                                <div style="width: 76px; height: 76px; background: rgba(37, 99, 235, 0.08); border-radius: 18px; display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0;">
                                    <i class="fa-solid fa-calendar-days" style="font-size: 2rem; color: #2563eb;"></i>
                                </div>
                            </div>

                            <!-- List stack -->
                            <div style="display: flex; flex-direction: column; gap: 1.1rem; width: 100%;">
                                
                                <!-- Item 1 -->
                                <div style="display: flex; align-items: flex-start; gap: 1rem; padding-bottom: 0.9rem; border-bottom: 1px solid rgba(226, 232, 240, 0.4); min-height: 60px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(96, 165, 250, 0.35);">
                                        <i class="fa-solid fa-unlock-keyhole" style="color: #2563eb; font-size: 1rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.15rem; text-align: left;">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); display: flex; gap: 0.5rem; align-items: center;">
                                            Kostenloser Zugang zu Musikern
                                        </div>
                                        <div style="font-size: 0.84rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">
                                            Coverbands, Bands, DJs, Duos, Trios, Gitarristen, Sänger etc.
                                        </div>
                                    </div>
                                </div>

                                <!-- Item 2 -->
                                <div style="display: flex; align-items: flex-start; gap: 1rem; padding-bottom: 0.9rem; border-bottom: 1px solid rgba(226, 232, 240, 0.4); min-height: 60px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(96, 165, 250, 0.35);">
                                        <i class="fa-solid fa-sliders" style="color: #2563eb; font-size: 1rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.15rem; text-align: left;">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); display: flex; gap: 0.5rem; align-items: center;">
                                            Passende Musiker
                                        </div>
                                        <div style="font-size: 0.84rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">
                                            Musiker-Typ, Budget, Genre, Spieldauer etc.
                                        </div>
                                    </div>
                                </div>

                                <!-- Item 3 -->
                                <div style="display: flex; align-items: flex-start; gap: 1rem; padding-bottom: 0.9rem; border-bottom: 1px solid rgba(226, 232, 240, 0.4); min-height: 60px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(96, 165, 250, 0.35);">
                                        <i class="fa-solid fa-comments" style="color: #2563eb; font-size: 1rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.15rem; text-align: left;">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); display: flex; gap: 0.5rem; align-items: center;">
                                            Direkter Kontakt zu Musikern
                                        </div>
                                        <div style="font-size: 0.84rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">
                                            Telefonnummern, Mail-Adressen, Nachrichten im GigConnAct-Postfach
                                        </div>
                                    </div>
                                </div>

                                <!-- Item 4 -->
                                <div style="display: flex; align-items: flex-start; gap: 1rem; padding-bottom: 0.9rem; border-bottom: 1px solid rgba(226, 232, 240, 0.4); min-height: 60px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(96, 165, 250, 0.35);">
                                        <i class="fa-solid fa-envelope" style="color: #2563eb; font-size: 1rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.15rem; text-align: left;">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); display: flex; gap: 0.5rem; align-items: center;">
                                            Interessante Anfragen
                                        </div>
                                        <div style="font-size: 0.84rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">
                                            Nicht nur Anfragen an Musiker senden – sondern auch erhalten
                                        </div>
                                    </div>
                                </div>

                                <!-- Item 5 -->
                                <div style="display: flex; align-items: flex-start; gap: 1rem; padding-bottom: 0.9rem; border-bottom: 1px solid rgba(226, 232, 240, 0.4); min-height: 60px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(96, 165, 250, 0.35);">
                                        <i class="fa-solid fa-star" style="color: #2563eb; font-size: 1rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.15rem; text-align: left;">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); display: flex; gap: 0.5rem; align-items: center;">
                                            Top-Vorschläge
                                        </div>
                                        <div style="font-size: 0.84rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">
                                            Automatische Empfehlungen von GigConnAct zu Musikern
                                        </div>
                                    </div>
                                </div>

                                <!-- Item 6 -->
                                <div style="display: flex; align-items: flex-start; gap: 1rem; padding-bottom: 0.9rem; border-bottom: 1px solid rgba(226, 232, 240, 0.4); min-height: 60px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(96, 165, 250, 0.35);">
                                        <i class="fa-solid fa-bolt" style="color: #2563eb; font-size: 1rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.15rem; text-align: left;">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); display: flex; gap: 0.5rem; align-items: center;">
                                            Schnelle Anmeldung
                                        </div>
                                        <div style="font-size: 0.84rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">
                                            Anlegen des Veranstalter-Profils ohne Passwort
                                        </div>
                                    </div>
                                </div>

                                <!-- Item 7 -->
                                <div style="display: flex; align-items: flex-start; gap: 1rem; min-height: 60px;">
                                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(96, 165, 250, 0.35);">
                                        <i class="fa-solid fa-shield-halved" style="color: #2563eb; font-size: 1rem;"></i>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.15rem; text-align: left;">
                                        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); display: flex; gap: 0.5rem; align-items: center;">
                                            Keine Provisionskosten
                                        </div>
                                        <div style="font-size: 0.84rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">
                                            Oder andere versteckte Kosten
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div style="margin-top: 2rem; text-align: center; width: 100%;">
                            <button id="btn-benefits-to-musicians" class="btn-homepage-market theme-organizer" style="width: 100%; box-sizing: border-box;">
                                Hier geht´s zum Musiker-Markt <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>

                </div>
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
                          <!-- Sparkles -->
                          <g transform="translate(22, 25)" filter="url(#glowFooter)"><polygon points="0,-8 2,-2 8,0 2,2 0,8 -2,2 -8,0 -2,-2" fill="#ffffff" /></g>
                          <g transform="translate(75, 30)" filter="url(#glowFooter)"><polygon points="0,-6 1.5,-1.5 6,0 1.5,1.5 0,6 -1.5,1.5 -6,0 -1.5,-1.5" fill="#ffffff" /></g>
                          <g transform="translate(68, 68)" filter="url(#glowFooter)"><polygon points="0,-7 1.8,-1.8 7,0 1.8,1.8 0,7 -1.8,1.8 -7,0 -1.8,-1.8" fill="#ffffff" /></g>
                        </svg>
                        <div style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 900; background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">
                            GigConnAct
                        </div>
                    </div>
                    <!-- Impressum Info -->
                    <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; font-weight: 500;">
                        <span style="font-weight: 700; color: var(--text-main); font-size: 0.95rem; margin-bottom: 0.2rem;">Impressum</span>
                        <span>GigConnAct &bull; Montanusstraße 49 &bull; 51065 Köln</span>
                        <div style="display: flex; flex-direction: column; gap: 0.25rem;">
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
        // Preload next video in v2 immediately
        v2.src = heroVideos[1];
        v2.load();

        const transitionDuration = 1500; // 1.5s fade transition
        let isTransitioning = false;

        const startCrossfade = function(activePlayer, hiddenPlayer) {
            if (isTransitioning) return;
            isTransitioning = true;

            // Start playing the hidden player
            hiddenPlayer.play().then(() => {
                const onPlaying = () => {
                    hiddenPlayer.removeEventListener('playing', onPlaying);

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
                };

                hiddenPlayer.addEventListener('playing', onPlaying);
                
                // Fallback if playing event is delayed
                setTimeout(() => {
                    if (isTransitioning && hiddenPlayer.style.opacity !== '1') {
                        onPlaying();
                    }
                }, 300);
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
    "Berlin", "Hamburg", "MÜnchen", "KÖln", "Frankfurt am Main", "Stuttgart", "Düsseldorf", "Dortmund", "Essen", "Leipzig", "Bremen", "Dresden", "Hannover", "Nürnberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster", "Karlsruhe", "Mannheim", "Augsburg", "Wiesbaden", "Gelsenkirchen", "MÜnchengladbach", "Braunschweig", "Chemnitz", "Aachen", "Kiel", "Halle (Saale)", "Magdeburg", "Freiburg im Breisgau", "Krefeld", "Lübeck", "Oberhausen", "Erfurt", "Mainz", "Rostock", "Kassel", "Hagen", "Hamm", "Saarbrücken", "Mülheim an der Ruhr", "Potsdam", "Ludwigshafen am Rhein", "Oldenburg", "Leverkusen", "Osnabrück", "Solingen", "Heidelberg", "Herne", "Neuss", "Darmstadt", "Paderborn", "Regensburg", "Ingolstadt", "Würzburg", "FÜrth", "Wolfsburg", "Offenbach am Main", "Ulm", "Heilbronn", "Pforzheim", "Göttingen", "Bottrop", "Recklinghausen", "Reutlingen", "Koblenz", "Bergisch Gladbach", "Remscheid", "Bremerhaven", "Jena", "Trier", "Erlangen", "Moers", "Siegen", "Hildesheim", "Salzgitter", "Cottbus", "Kaiserslautern", "Witten", "Gütersloh", "Schwerin", "Gera", "Bad Homburg", "Marl", "Flensburg", "Lünen", "Villingen-Schwenningen", "Ratingen", "Neu-Isenburg", "Bad Salzuflen", "Tübingen", "Minden", "Worms", "Konstanz", "Wilhelmshaven", "Velbert", "Norderstedt", "Stein", "Castrop-Rauxel", "Delmenhorst", "Viersen", "Gladbeck", "Marburg", "Rheine", "Troisdorf", "Dorsten", "Lüneburg", "Detmold", "Bayreuth", "Arnsberg", "Lippstadt", "Landshut", "Dinslaken", "Plauen", "Weimar", "Neuwied", "Ibbenbüren", "Gießen", "Passau", "Freising", "Freital", "Frankfurt (Oder)", "Ravensburg", "Rosenheim", "Stralsund", "Lörrach", "Schweinfurt", "Baden-Baden", "Offenburg", "Stendal", "Heidenheim", "Garmisch-Partenkirchen", "Memmingen", "Dachau", "Kempten (Allgäu)", "Görlitz", "Bautzen", "Sindelfingen", "Goch", "Kleve", "Wesel", "Kevelaer", "Kempen", "Nettetal"
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
                            const state = addr.state ? `, ${addr.state}` : '';
                            return {
                                name: cityName,
                                label: `${cityName}${state}`
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
                    const matchedCity = popularGermanCities.find(c => c.toLowerCase() === val.toLowerCase());
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
            
            const matchedCity = popularGermanCities.find(c => c.toLowerCase() === val.toLowerCase());
            if (matchedCity) {
                input.value = matchedCity;
                input.dataset.lastValidVal = matchedCity;
                if (!onSelect) {
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

    let profileSelectorHtml = '';
    let userProfiles = [];
    let activeProfileId = '';
    
    if (state.currentUser) {
        if (state.currentUser.role === 'musician') {
            userProfiles = state.musicians.filter(m => m.creatorId === state.currentUser.id);
            activeProfileId = state.activeMusicianId || (userProfiles[0]?.id || '');
            if (activeProfileId) state.activeMusicianId = activeProfileId;
        } else if (state.currentUser.role === 'organizer') {
            userProfiles = state.events.filter(e => e.creatorId === state.currentUser.id);
            activeProfileId = state.activeEventId || (userProfiles[0]?.id || '');
            if (activeProfileId) state.activeEventId = activeProfileId;
        }
        
        if (userProfiles.length > 0) {
            const options = userProfiles.map(p => `<option value="${p.id}" ${p.id === activeProfileId ? 'selected' : ''}>${p.name || p.contactName || p.title || 'Profil'}</option>`).join('');
            profileSelectorHtml = `
                <div class="profile-switcher-wrapper" style="display: flex; align-items: center; gap: 0.25rem; background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 20px; padding: 0.2rem 0.4rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin: 0; min-width: 0; max-width: 120px; flex: 1 1 auto; flex-shrink: 0; height: 36px; box-sizing: border-box;">
                    <i class="${isEvents ? 'fa-solid fa-guitar' : 'fa-solid fa-calendar-day'}" style="color: ${isEvents ? '#2563eb' : '#7c3aed'}; font-size: 0.75rem; flex-shrink: 0;"></i>
                    <select id="market-profile-select" class="input-field" style="width: 100%; height: 24px; padding: 0 0.15rem; font-size: 0.7rem; margin: 0; border: none; background: transparent; cursor: pointer; color: var(--text-main); font-weight: 700; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; outline: none;">
                        ${options}
                    </select>
                </div>
            `;
        }
    }

    container.innerHTML = `
        <div class="market-page ${isEvents ? 'theme-musician' : 'theme-organizer'}" style="max-width: 1400px; margin: 0 auto; padding: 1.5rem 1rem 5rem; box-sizing: border-box;">
            
            <!-- Controls Row: Filter, Sortierung, Stern, Herz, Ergebnisse, Profil-Auswahl in linear order -->
            <div class="market-controls-row" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: nowrap; justify-content: flex-start; width: 100%; box-sizing: border-box; overflow-x: auto; padding: 0.5rem 0.6rem; -webkit-overflow-scrolling: touch;">
                
                <!-- 1. Filter -->
                <button class="market-filter-mobile-toggle" id="btn-toggle-mobile-filters" style="margin: 0; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; padding: 0; border-radius: 50%; flex-shrink: 0;">
                    <i class="fa-solid fa-sliders" style="font-size: 0.95rem; margin: 0;"></i>
                </button>
 
                <!-- 2. Sortierung -->
                <div class="market-sort-container-round" style="width: 36px !important; height: 36px !important; display: flex !important; align-items: center !important; justify-content: center !important; border-radius: 50% !important; flex-shrink: 0; position: relative; margin: 0;">
                    <i class="fa-solid fa-arrow-down-wide-short" style="color: ${isEvents ? '#2563eb' : '#7c3aed'}; font-size: 0.95rem; pointer-events: none;"></i>
                    <select id="sort-select" style="position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; -webkit-appearance: none; -moz-appearance: none; appearance: none; margin: 0; z-index: 5;">
                        <option value="match">Match-Faktor absteigend</option>
                        <option value="newest">Neueste zuerst</option>
                        <option value="price">Günstig zuerst</option>
                        <option value="distance">Nächste zuerst</option>
                        <option value="name">Name (A-Z)</option>
                    </select>
                </div>

                <!-- 3. Stern (Nur Top-Matches anzeigen) -->
                <button class="market-control-toggle" id="btn-toggle-market-top-matches" style="margin: 0; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; padding: 0; border-radius: 50%; cursor: pointer; transition: all 0.3s; flex-shrink: 0;" title="Nur Top-Matches anzeigen">
                    <i class="fa-solid fa-star" style="font-size: 0.95rem; margin: 0;"></i>
                </button>

                <!-- 4. Herz (Nur Favoriten anzeigen) -->
                <button class="market-control-toggle" id="btn-toggle-market-favorites" style="margin: 0; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; padding: 0; border-radius: 50%; cursor: pointer; transition: all 0.3s; flex-shrink: 0;" title="Nur Favoriten anzeigen">
                    <i class="fa-solid fa-heart" style="font-size: 0.95rem; margin: 0;"></i>
                </button>

                <!-- 5. Ergebnisse als Zahl -->
                <div id="market-results-count" style="font-family: var(--font-heading); font-size: 0.85rem; font-weight: 800; color: ${isEvents ? '#2563eb' : '#7c3aed'}; text-align: center; flex-shrink: 0; letter-spacing: 0.5px; margin: 0; white-space: nowrap;">
                    (${items.length})
                </div>

                <!-- 6. Profil-Auswahl -->
                ${profileSelectorHtml}
            </div>

            <!-- Main Layout: Left Sticky Sidebar Filters + Center Content -->
            <div class="market-layout-container">
                
                <!-- Left Sidebar Filters (Responsive Wrapper) -->
                <div id="market-filters-wrapper" class="market-filter-card">
                    <div class="filter-header-sticky">
                        <span class="filter-header-title">
                            <i class="fa-solid fa-sliders"></i> Filter
                        </span>
                        
                        <button id="btn-reset-filters" class="btn-reset-round" title="Filter zurücksetzen">
                            <i class="fa-solid fa-rotate-left"></i>
                        </button>
                        
                        <button id="btn-close-filters-m" class="btn-close-filters-m">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    
                    ${isEvents ? `
                        <!-- 10 Event-Markt Filter + Suchbegriffe mit tag-pill-checkboxes & dual range sliders -->
                        <div style="display: flex; flex-direction: column; gap: 0.8rem; padding: 1rem;">
                            
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #5b21b6; margin-bottom: 0.35rem;">Event-Typ</label>
                                <div class="checkbox-tag-grid" id="filter-event-type-grid">
                                    ${['Geburtstag', 'Hochzeit – Trauung', 'Hochzeit - Sektempfang', 'Hochzeit – Party', 'Polterabend', 'Firmenfeier', 'Sommerfest', 'Öffentliches Event', 'Stadtfest', 'Kirmes', 'Karnevalsparty', 'Oktoberfest', 'Schützenfest', 'Vereinsfest', 'Sportveranstaltung', 'Jubiläum', 'Festival', 'Konzert', 'Bar/Kneipe/Club', 'Sonstige'].map(t => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterEventTypes" value="${t}">
                                            <span>${t}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #5b21b6; margin-bottom: 0.35rem;">Datum / Kalender</label>
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
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #5b21b6; margin-bottom: 0.35rem;">Ort / PLZ</label>
                                <input type="text" id="filter-location" placeholder="z.B. Köln, Berlin..." class="form-input" style="width: 100% !important; max-width: 100% !important; min-width: 0 !important; box-sizing: border-box !important; display: block !important; padding: 0.55rem; border-radius: 8px; border: 1px solid #cbd5e1; background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #5b21b6; margin-bottom: 0.35rem;">Genres</label>
                                <div class="checkbox-tag-grid" id="filter-genres-grid">
                                    ${['Pop', 'Rock', 'Schlager', 'Funk', 'Charts', 'Evergreens', 'Dance', 'Elektronisch', 'Jazz', 'Latin', 'R&B/Soul', 'Hip Hop', 'Rap', 'Punk', 'Metal', 'Alternative', 'Indie', '60er', '70er', '80er', '90er', '2000er', '2010er', 'Afrobeat', 'Blues', 'Gospel', 'Country', 'Folk', 'K-Pop', 'Klassisch', 'Sonstige'].map(g => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterGenres" value="${g}">
                                            <span>${g}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #5b21b6; margin-bottom: 0.35rem;">Instrumente</label>
                                <div class="checkbox-tag-grid" id="filter-instruments-grid">
                                    ${['Akustik', 'Gesang', 'Gitarre', 'Klavier/Piano', 'Bass', 'Schlagzeug', 'Percussion/Cajón', 'Saxophon', 'Trompete', 'Geige', 'Cello', 'Harfe', 'Sonstige'].map(ins => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterInstruments" value="${ins}">
                                            <span>${ins}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div class="slider-value-display">
                                    <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #5b21b6; margin-bottom: 0.35rem;">Spieldauer (Std.)</label>
                                    <span id="val-filter-duration" style="font-size: 0.85rem; font-weight: 700; color: #5b21b6;">0,5 - 10,0 Std.</span>
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
                                    <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #5b21b6; margin-bottom: 0.35rem;">Budget (€)</label>
                                    <span id="val-filter-budget" style="font-size: 0.85rem; font-weight: 700; color: #5b21b6;">0 - 5.000+ €</span>
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
                                    <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #5b21b6; margin-bottom: 0.35rem;">Gäste (Anzahl)</label>
                                    <span id="val-filter-publikum" style="font-size: 0.85rem; font-weight: 700; color: #5b21b6;">0 - 500+</span>
                                </div>
                                <div class="dual-range-slider" id="slider-filter-publikum-container">
                                    <div class="dual-range-track"></div>
                                    <div class="dual-range-active-track" id="track-filter-publikum"></div>
                                    <input type="range" class="form-input" id="input-filter-publikum-min" min="0" max="500" step="50" value="0">
                                    <input type="range" class="form-input" id="input-filter-publikum-max" min="0" max="500" step="50" value="500">
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #5b21b6; margin-bottom: 0.35rem;">Technik</label>
                                <div class="checkbox-tag-grid" id="filter-technik-grid">
                                    ${['Technik vorhanden', 'Technik ist noch unklar', 'Technik nicht vorhanden'].map(t => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterTechnik" value="${t}">
                                            <span>${t}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- SUCHBEGRIFFE FELD DIREKT UNTER TECHNIK (WEISSES EINGABEFELD) -->
                            <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #5b21b6; margin-bottom: 0.35rem;">Suchbegriffe</label>
                                <input type="text" id="filter-keyword" placeholder="z.B. Hochzeit, Sax, Rock..." class="form-input" style="width: 100% !important; max-width: 100% !important; min-width: 0 !important; box-sizing: border-box !important; display: block !important; padding: 0.55rem; border-radius: 8px; border: 1px solid #cbd5e1; background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                            </div>

                        </div>
                    ` : `
                        <!-- 10 Musiker-Markt Filter + Suchbegriffe mit tag-pill-checkboxes & dual range sliders -->
                        <div style="display: flex; flex-direction: column; gap: 0.8rem; padding: 1rem;">
                            
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #1e3a8a; margin-bottom: 0.35rem;">Musiker-Typ</label>
                                <div class="checkbox-tag-grid" id="filter-musician-type-grid">
                                    ${['Sänger', 'Solokünstler', 'Duo', 'Trio', 'Band', 'Coverband', 'Big Band', 'Ensemble', 'Chor', 'Orchester', 'DJ', 'Alleinunterhalter', 'Showkünstler/Tänzer', 'Sonstige'].map(t => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterMusicianTypes" value="${t}">
                                            <span>${t}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #1e3a8a; margin-bottom: 0.35rem;">Datum / Kalender</label>
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
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #1e3a8a; margin-bottom: 0.35rem;">Ort</label>
                                <input type="text" id="filter-location-m" placeholder="z.B. München, Köln..." class="form-input" style="width: 100% !important; max-width: 100% !important; min-width: 0 !important; box-sizing: border-box !important; display: block !important; padding: 0.55rem; border-radius: 8px; border: 1px solid #cbd5e1; background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div class="slider-value-display">
                                    <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #1e3a8a; margin-bottom: 0.35rem;">Maximaler Umkreis</label>
                                    <span id="val-filter-radius-m" style="font-size: 0.85rem; font-weight: 700; color: #1e3a8a;">500 km</span>
                                </div>
                                <input type="range" class="form-input" id="input-filter-radius-m" min="0" max="500" step="50" value="500" style="width: 100%; accent-color: #2563eb;">
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #1e3a8a; margin-bottom: 0.35rem;">Genres</label>
                                <div class="checkbox-tag-grid" id="filter-genres-grid-m">
                                    ${['Pop', 'Rock', 'Schlager', 'Funk', 'Charts', 'Evergreens', 'Dance', 'Elektronisch', 'Jazz', 'Latin', 'R&B/Soul', 'Hip Hop', 'Rap', 'Punk', 'Metal', 'Alternative', 'Indie', '60er', '70er', '80er', '90er', '2000er', '2010er', 'Afrobeat', 'Blues', 'Gospel', 'Country', 'Folk', 'K-Pop', 'Klassisch', 'Sonstige'].map(g => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterGenresM" value="${g}">
                                            <span>${g}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #1e3a8a; margin-bottom: 0.35rem;">Instrumente</label>
                                <div class="checkbox-tag-grid" id="filter-instruments-grid-m">
                                    ${['Akustik', 'Gesang', 'Gitarre', 'Klavier/Piano', 'Bass', 'Schlagzeug', 'Percussion/Cajón', 'Saxophon', 'Trompete', 'Geige', 'Cello', 'Harfe', 'Sonstige'].map(ins => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterInstrumentsM" value="${ins}">
                                            <span>${ins}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <div class="slider-value-display">
                                    <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #1e3a8a; margin-bottom: 0.35rem;">Spieldauer (Std.)</label>
                                    <span id="val-filter-duration-m" style="font-size: 0.85rem; font-weight: 700; color: #1e3a8a;">0,5 - 10,0 Std.</span>
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
                                    <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #1e3a8a; margin-bottom: 0.35rem;">Gage (€)</label>
                                    <span id="val-filter-gage-m" style="font-size: 0.85rem; font-weight: 700; color: #1e3a8a;">0 - 5.000+ €</span>
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
                                    <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #1e3a8a; margin-bottom: 0.35rem;">Gäste (Anzahl)</label>
                                    <span id="val-filter-publikum-m" style="font-size: 0.85rem; font-weight: 700; color: #1e3a8a;">0 - 500+</span>
                                </div>
                                <div class="dual-range-slider" id="slider-filter-publikum-m-container">
                                    <div class="dual-range-track"></div>
                                    <div class="dual-range-active-track" id="track-filter-publikum-m"></div>
                                    <input type="range" class="form-input" id="input-filter-publikum-m-min" min="0" max="500" step="50" value="0">
                                    <input type="range" class="form-input" id="input-filter-publikum-m-max" min="0" max="500" step="50" value="500">
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #1e3a8a; margin-bottom: 0.35rem;">Bevorzugte Event-Typen</label>
                                <div class="checkbox-tag-grid" id="filter-event-types-grid-m">
                                    ${['Geburtstag', 'Hochzeit – Trauung', 'Hochzeit - Sektempfang', 'Hochzeit – Party', 'Polterabend', 'Firmenfeier', 'Sommerfest', 'Öffentliches Event', 'Stadtfest', 'Kirmes', 'Karnevalsparty', 'Oktoberfest', 'Schützenfest', 'Vereinsfest', 'Sportveranstaltung', 'Jubiläum', 'Festival', 'Konzert', 'Bar/Kneipe/Club', 'Sonstige'].map(evt => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterEventTypesM" value="${evt}">
                                            <span>${evt}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #1e3a8a; margin-bottom: 0.35rem;">Technik</label>
                                <div class="checkbox-tag-grid" id="filter-technik-grid-m">
                                    ${['Technik vorhanden', 'Technik ist noch unklar', 'Technik nicht vorhanden'].map(t => `
                                        <label class="tag-pill-checkbox">
                                            <input type="checkbox" name="filterTechnikM" value="${t}">
                                            <span>${t}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- SUCHBEGRIFFE FELD DIREKT UNTER TECHNIK (WEISSES EINGABEFELD) -->
                            <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #1e3a8a; margin-bottom: 0.35rem;">Suchbegriffe</label>
                                <input type="text" id="filter-keyword-m" placeholder="z.B. Acoustic, Sax, Pop..." class="form-input" style="width: 100% !important; max-width: 100% !important; min-width: 0 !important; box-sizing: border-box !important; display: block !important; padding: 0.55rem; border-radius: 8px; border: 1px solid #cbd5e1; background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                            </div>

                        </div>
                    `}
                </div>

                <!-- Center Main Section -->
                <div>
                    <div id="market-items-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem;">
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
            : `<i class="fa-solid fa-sliders" style="font-size: 1.1rem; margin: 0;"></i>`;
    });

    const closeBtnM = container.querySelector('#btn-close-filters-m');
    closeBtnM?.addEventListener('click', function() {
        filterWrapper.classList.remove('open');
        overlay?.classList.remove('open');
        toggleBtn?.classList.remove('active');
        if (toggleBtn) {
            toggleBtn.innerHTML = `<i class="fa-solid fa-sliders" style="font-size: 1.1rem; margin: 0;"></i>`;
        }
    });

    overlay?.addEventListener('click', function() {
        filterWrapper.classList.remove('open');
        overlay.classList.remove('open');
        toggleBtn?.classList.remove('active');
        if (toggleBtn) {
            toggleBtn.innerHTML = `<i class="fa-solid fa-sliders" style="font-size: 1.1rem; margin: 0;"></i>`;
        }
    });

    const sortSelect = container.querySelector('#sort-select');
    const resetBtn = container.querySelector('#btn-reset-filters');
    const marketProfileSelect = container.querySelector('#market-profile-select');
    if (marketProfileSelect) {
        marketProfileSelect.addEventListener('change', function() {
            const val = this.value;
            if (state.currentUser) {
                if (state.currentUser.role === 'musician') {
                    state.activeMusicianId = val;
                } else {
                    state.activeEventId = val;
                }
                state.saveState();
                applyAllFiltersAndSort();
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
            list = list.filter(item => (item.location || '').toLowerCase().includes(locInput));
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
        const selGenres = isEvents ? getCheckedValues('filter-genres-grid') : getCheckedValues('filter-genres-grid-m');
        if (selGenres.length > 0) {
            list = list.filter(item => {
                const itemG = item.genres || [];
                return selGenres.some(g => itemG.some(ig => ig.toLowerCase().includes(g.toLowerCase())));
            });
        }

        // 4. Instrumente Filter
        const selInst = isEvents ? getCheckedValues('filter-instruments-grid') : getCheckedValues('filter-instruments-grid-m');
        if (selInst.length > 0) {
            list = list.filter(item => {
                const itemI = item.instruments || [];
                return selInst.some(inst => itemI.some(i => i.toLowerCase().includes(inst.toLowerCase())));
            });
        }

        // 5. Musiker-Typ / Event-Typ
        const selType = isEvents ? getCheckedValues('filter-event-type-grid') : getCheckedValues('filter-musician-type-grid');
        if (selType.length > 0) {
            list = list.filter(item => {
                const val = (item.type || item.eventType || '');
                return selType.some(t => val.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(val.toLowerCase()));
            });
        }

        // 6. Technik Filter
        const selTechnik = isEvents ? getCheckedValues('filter-technik-grid') : getCheckedValues('filter-technik-grid-m');
        if (selTechnik.length > 0) {
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
        if (countEl) countEl.textContent = `(${list.length})`;
        
        console.log("applyAllFiltersAndSort finished. Output items count:", list.length, "IDs:", list.map(item => item.id).join(', '));
    }

    sortSelect?.addEventListener('change', applyAllFiltersAndSort);
    
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

        if (sortSelect) sortSelect.value = 'match';
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

// Global openItemDetailModal function that works for everyone in protected mode!
window.openItemDetailModal = function(id, isEvents) {
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
                            ${isEvents ? (item.eventType || 'Event') : (item.category || 'Musiker')}
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
                            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 0.2rem;">${isEvents ? 'Veranstaltungsdatum' : 'Verfügbarkeiten'}</span>
                            <strong style="font-size: 0.9rem; color: #fff;"><i class="fa-solid fa-calendar-days" style="color: ${roleColor};"></i> ${dateDisplay}</strong>
                        </div>

                        <div>
                            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 0.2rem;">Spieldauer</span>
                            <strong style="font-size: 0.9rem; color: #fff;"><i class="fa-solid fa-clock" style="color: ${roleColor};"></i> ${durationDisplay}</strong>
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
                            <button class="btn btn-primary" onclick="document.getElementById('modal-item-detail').remove(); window.initiateMarketContact('${isEvents ? item.creatorId : item.id}', '${(item.name || item.title || '').replace(/'/g, "\\'")}', '${isEvents ? item.id : ''}')" style="background: ${isEvents ? '#2563eb' : '#7c3aed'}; border-color: ${isEvents ? '#2563eb' : '#7c3aed'}; font-weight: 800; padding: 0.8rem 2rem; border-radius: 10px; display: inline-flex; align-items: center; gap: 0.6rem; margin-top: 0.5rem;">
                                <i class="fa-solid fa-comment"></i> Nachricht senden
                            </button>
                        ` : `
                            <div style="font-weight: 800; font-size: 1.1rem; color: #ffffff; margin-bottom: 0.4rem;">
                                <i class="fa-solid fa-lock" style="color: ${roleColor};"></i> Geschützter Kontaktbereich
                            </div>
                            <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.2rem;">
                                Kontaktdaten (Telefonnummer & E-Mail-Adresse) sind im geschützten Modus verborgen. Registriere dich oder melde dich an, um direkt zu kommunizieren.
                            </p>
                            <button class="btn btn-primary" onclick="document.getElementById('modal-item-detail').remove(); showModal('auth');" style="background: ${isEvents ? 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)' : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'}; border-color: ${isEvents ? '#1e40af' : '#7c3aed'}; font-weight: 800; padding: 0.9rem 2rem; font-size: 1rem; border-radius: 12px; display: inline-flex; align-items: center; gap: 0.6rem; box-shadow: ${isEvents ? '0 4px 14px rgba(37, 99, 235, 0.35)' : '0 4px 14px rgba(124, 58, 237, 0.35)'};">
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

window.initiateMarketContact = function(targetId, targetName, eventId) {
    if (!state.currentUser) {
        showModal('auth');
        return;
    }
    const result = state.initiateContact(targetId, targetName, eventId);
    if (result.success) {
        if (eventId && state.currentUser && state.currentUser.role === 'musician') {
            state.addMusicianApplication(state.currentUser.profileId, eventId);
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
        
        let contentHtml = '';
        if (type === 'chat') {
            const parts = value.split('|');
            const recId = parts[0];
            const recName = parts[1] || '';
            const evId = parts[2] || '';
            
            contentHtml = `
                <div style="display: flex; align-items: center; justify-content: center; padding: 0.2rem 0;">
                    <button class="btn btn-primary" 
                            onclick="event.stopPropagation(); window.initiateMarketContact('${recId}', '${recName.replace(/'/g, "\\'")}', '${evId}')" 
                            style="background: #ffffff; color: #0f172a; border: 1px solid #ffffff; font-weight: 800; padding: 0.5rem 1.5rem; border-radius: 8px; display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;"
                            onmouseover="this.style.background='rgba(255,255,255,0.9)'; this.style.transform='translateY(-1px)';"
                            onmouseout="this.style.background='#ffffff'; this.style.transform='translateY(0)';"
                            title="Chat im Postfach öffnen">
                        <i class="fa-solid fa-comments"></i> Nachricht schreiben
                    </button>
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

    container.innerHTML = `
        <div class="portal-layout" style="display:flex; flex-direction:column; gap:2rem; max-width: 800px; margin: 0 auto; padding: 1rem 0;">
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
                                <option value="Club / Bar" ${u.organizerType === 'Club / Bar' ? 'selected' : ''}>Club / Bar</option>
                                <option value="Firma / Agentur" ${u.organizerType === 'Firma / Agentur' ? 'selected' : ''}>Firma / Agentur</option>
                                <option value="Verein" ${u.organizerType === 'Verein' ? 'selected' : ''}>Verein</option>
                                <option value="Sonstiges" ${u.organizerType === 'Sonstiges' ? 'selected' : ''}>Sonstiges</option>
                            </select>
                        </div>
                    </div>` : ''}

                    <div style="display: flex; justify-content: center;">
                        <button type="submit" class="btn btn-primary" style="margin:0; background: ${themeBtnBg}; border-color: ${themeBtnBorder};">
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
                            Status: ${u.subscriptionCancelled ? 'Gekündigt (Aktiv bis zum Ende des Abrechnungszeitraums)' : 'Aktiv (Automatische Verlängerung)'}
                        </div>
                    </div>
                    
                    ${u.subscriptionCancelled ? `
                        <button class="btn btn-primary" id="btn-reactivate-subscription" style="margin:0; background: #10b981; border-color: #10b981;">
                            <i class="fa-solid fa-arrow-rotate-right"></i> Abo reaktivieren
                        </button>
                    ` : `
                        <button class="btn btn-glass" id="btn-cancel-subscription" style="margin:0; color: var(--color-red); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.05);">
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
                                <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">${activePlan === "flex" ? "Aktueller Tarif" : (selectedPlan === "flex" ? "Ausgew' + $ae + 'hlt" : "Ausw' + $ae + 'hlen")}</button>
                            </div>
                        </div>
                        <div class="subscription-card ${activePlan === "plus" ? "active" : ""}" data-plan="plus" data-price="7.99">
                            <div class="selected-badge">Spare 20 %</div>
                            <h5>Plus</h5>
                            <div class="price">7,99 € <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
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
                                <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">${activePlan === "plus" ? "Aktueller Tarif" : (selectedPlan === "plus" ? "Ausgew' + $ae + 'hlt" : "Ausw' + $ae + 'hlen")}</button>
                            </div>
                        </div>
                        <div class="subscription-card ${activePlan === "pro" ? "active" : ""}" data-plan="pro" data-price="5.99">
                            <div class="selected-badge">Spare 40 %</div>
                            <h5>Pro</h5>
                            <div class="price">5,99 € <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
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
                                <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">${activePlan === "pro" ? "Aktueller Tarif" : (selectedPlan === "pro" ? "Ausgew' + $ae + 'hlt" : "Ausw' + $ae + 'hlen")}</button>
                            </div>
                        </div>
                        <div class="subscription-card ${activePlan === "premium" ? "active" : ""}" data-plan="premium" data-price="4.99">
                            <div class="selected-badge" style="background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%) !important;">Spare 59 %</div>
                            <h5>Premium</h5>
                            <div class="price">4,99 € <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
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
                                <button type="button" class="btn btn-primary btn-sub-select" style="margin: 0; padding: 0.45rem 1.25rem; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">${activePlan === "premium" ? "Aktueller Tarif" : (selectedPlan === "premium" ? "Ausgew' + $ae + 'hlt" : "Ausw' + $ae + 'hlen")}</button>
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
                    </div>

                    <div style="display: flex; justify-content: flex-end;">
                        <button class="btn btn-primary" id="btn-save-subscription-change" style="margin:0; background: #7c3aed; border-color: #7c3aed;">
                            <i class="fa-solid fa-circle-arrow-right"></i> Tarifwechsel bestätigen
                        </button>
                    </div>
                </div>
            </div>
            ` : ''}

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
            cancelBtn.addEventListener('click', () => {
                if (confirm("Möchtest du dein Abonnement wirklich zum nächstmöglichen Zeitpunkt kündigen? Du verlierst damit nach Ablauf des Zeitraums den direkten Kontaktzugang zu Veranstaltern.")) {
                    u.subscriptionCancelled = true;
                    
                    const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
                    const idx = registeredUsers.findIndex(usr => usr.id === u.id);
                    if (idx !== -1) {
                        registeredUsers[idx].subscriptionCancelled = true;
                        localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));
                    }
                    
                    state.saveState();
                    showToast({
                        title: "Abo gekündigt ℹ",
                        message: "Dein Abonnement wurde gekündigt. Du hast bis zum Ende des aktuellen Zeitraums vollen Zugriff."
                    });
                    renderProfilePage(container);
                    updateNavbar();
                }
            });
        }

        if (reactivateBtn) {
            reactivateBtn.addEventListener('click', () => {
                u.subscriptionCancelled = false;
                
                const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
                const idx = registeredUsers.findIndex(usr => usr.id === u.id);
                if (idx !== -1) {
                    registeredUsers[idx].subscriptionCancelled = false;
                    localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));
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
        let selectedPlan = activePlan;
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
                            : (c.classList.contains("active") ? "Ausgew' + $ae + 'hlt" : "Ausw' + $ae + 'hlen");
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
                if (['GIGINSTA59', 'INSTASTORY', 'GIGPREMIUM', 'GIGCONN59'].includes(code)) {
                    isPromoApplied = true;
                    promoStatus.textContent = "✔ Gutscheincode gültig! Premium-Tarif freigeschaltet.";
                    promoStatus.style.color = "#10b981";
                    promoStatus.style.display = "block";
                    promoInput.disabled = true;
                    promoBtn.disabled = true;
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
            saveSubBtn.addEventListener('click', () => {
                if (selectedPlan === 'premium' && !isPromoApplied) {
                    showToast({ title: "Gutscheincode erforderlich", message: "Bitte gib einen gültigen Instagram-Code ein, um den Premium-Tarif freizuschalten.", type: "error" });
                    return;
                }

                u.subscriptionPlan = selectedPlan;
                u.isPremium = true;
                u.subscriptionCancelled = false;

                const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
                const idx = registeredUsers.findIndex(usr => usr.id === u.id);
                if (idx !== -1) {
                    registeredUsers[idx].subscriptionPlan = selectedPlan;
                    registeredUsers[idx].isPremium = true;
                    registeredUsers[idx].subscriptionCancelled = false;
                    localStorage.setItem('GigConnAct_registered_users', JSON.stringify(registeredUsers));
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
        selectProfile.addEventListener('change', updateMatches);
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
    const photos = (e.photos || [
        e.profilePic || (e.type && (e.type.toLowerCase().includes('hochzeit') || e.type.toLowerCase().includes('wedding')) ? 'https://picsum.photos/id/111/300/300' : 'https://picsum.photos/id/1025/300/300'),
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80'
    ]).slice(0, 3);

    const videoSources = e.videos && e.videos.length > 0 ? e.videos : [];

    const genresList = (e.genres || (e.genre ? [e.genre] : ['Pop', 'Rock'])).join(', ');
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
    let techDisplayStr = e.technik || 'Technik nach Vereinbarung';

    const description = e.description || 'Wir suchen eine professionelle musikalische Begleitung für unser anstehendes Event mit fantastischer Stimmung.';

    const themeColor = '#7c3aed';

    return `
        <div class="market-tile-card" style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm); opacity: ${isActive ? '1' : '0.75'};">
            
            <!-- 1. Combined Galerie: 3 Fotos (FÜLLT DIE KACHEL IN DER BREITE 100% AUS) -->
            <div class="tile-fullwidth-photo-slider" style="position: relative; width: 100%; height: 210px; background: #0f172a; overflow: hidden;">
                
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

                <!-- Slide Navigation Arrows -->
                <button onclick="event.stopPropagation(); window.slideComboGallery('${e.id}', -1)" style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.68); border: none; color: #fff; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; backdrop-filter: blur(4px);">
                    <i class="fa-solid fa-chevron-left" style="font-size: 0.8rem;"></i>
                </button>
                <button onclick="event.stopPropagation(); window.slideComboGallery('${e.id}', 1)" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.68); border: none; color: #fff; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; backdrop-filter: blur(4px);">
                    <i class="fa-solid fa-chevron-right" style="font-size: 0.8rem;"></i>
                </button>
            </div>

            <!-- Tile Body Content -->
            <div class="tile-body-content" style="padding: 1rem 1.1rem 0.8rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
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
                            <span>${e.location}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-calendar" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>${formattedDate}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-clock" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>Spieldauer: ${durationDisplay}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-euro-sign" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>Budget: ${budgetDisplay}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-tag" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>Typ: ${e.type}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-sliders" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>Technik: ${techDisplayStr}</span>
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
            <div class="profile-section-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom:0.8rem; flex-wrap: wrap; gap:1rem;">
                    <h3 style="margin:0;"><i class="fa-solid fa-calendar-check text-cyan"></i> Aktive Events (${activeEvents.length})</h3>
                </div>
                
                <div class="my-events-list">
                    ${activeEvents.length === 0 ? `
                        <div style="padding:2rem 1rem; text-align:center; color:var(--text-muted); margin-bottom: 1rem;">
                            <i class="fa-solid fa-calendar-days" style="font-size:2.5rem; color:var(--border-glass); margin-bottom:0.8rem;"></i>
                            <p>Keine aktiven Ausschreibungen vorhanden.</p>
                        </div>
                    ` : `
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 1rem;">
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
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
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
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const event = state.events.find(e => e.id === id);
            if (event) {
                if (confirm(`Möchtest du das Event "${event.name}" wirklich unwiderruflich löschen?`)) {
                    state.deleteEvent(id);
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
                            <span><i class="fa-solid fa-map-marker-alt text-purple"></i> ${event.location}</span>
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
    const photos = (m.photos || [
        m.profilePic || (m.type === 'DJ' ? 'https://picsum.photos/id/653/300/300' : m.type === 'Solo' ? 'https://picsum.photos/id/325/300/300' : 'https://picsum.photos/id/453/300/300'),
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80'
    ]).slice(0, 3);

    const videoSources = m.videos && m.videos.length > 0 ? m.videos : [
        { title: 'Live Performance Highlights', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
        { title: 'Auftritt Showreel & Trailer', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
        { title: 'Unplugged Live Session', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' }
    ];

    const genresList = (m.genres || []).join(', ') || 'Pop, Rock';
    const instrumentsList = (m.instruments || []).join(', ') || (m.type === 'DJ' ? 'DJ-Controller' : 'Gesang, Gitarre');

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

    let techDisplayStr = 'Technik nach Vereinbarung';
    if (Array.isArray(m.technik) && m.technik.length > 0) {
        techDisplayStr = m.technik.join(', ');
    }

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
        if (m.availability.friday?.available) activeDays.push('Fr');
        if (m.availability.saturday?.available) activeDays.push('Sa');
        if (m.availability.sunday?.available) activeDays.push('So');
        if (activeDays.length > 0) {
            availDaysStr = activeDays.join(', ');
        }
    }

    return `
        <div class="market-tile-card" style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm); opacity: ${isActive ? '1' : '0.75'};">
            
            <!-- 1. Combined Galerie: 3 Fotos + 3 Videos direkt folgend (FÜLLT DIE KACHEL IN DER BREITE 100% AUS) -->
            <div class="tile-fullwidth-photo-slider" style="position: relative; width: 100%; height: 210px; background: #0f172a; overflow: hidden;">
                
                <div id="combo-slider-${m.id}" data-idx="0" style="display: flex; width: 100%; height: 100%; transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);">
                    
                    <!-- Slides 1-3: Fotos -->
                    ${photos.map((img) => `
                        <div style="width: 100%; height: 100%; flex-shrink: 0; position: relative;">
                            <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    `).join('')}

                    <!-- Slides 4-6: Nativ abspielbare HTML5 Videos -->
                    ${videoSources.map((vid, vIdx) => `
                        <div style="width: 100%; height: 100%; flex-shrink: 0; position: relative; background: #000; display: flex; align-items: center; justify-content: center;">
                            <video controls preload="metadata" poster="${photos[vIdx % photos.length]}" style="width: 100%; height: 100%; object-fit: cover;">
                                <source src="${vid.url}" type="video/mp4">
                                Dein Browser unterstÜtzt dieses Video nicht.
                            </video>
                            <span style="position: absolute; top: 12px; left: 12px; z-index: 4; font-size: 0.72rem; font-weight: 800; color: #fff; background: rgba(239, 68, 68, 0.9); padding: 0.25rem 0.6rem; border-radius: 6px; backdrop-filter: blur(4px);">
                                🎬 Video #${vIdx + 1}: ${vid.title}
                            </span>
                        </div>
                    `).join('')}

                    <!-- Last Slide: Beschreibung -->
                    <div style="width: 100%; height: 100%; flex-shrink: 0; position: relative; background: #0f172a; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 0.3rem 3.2rem 0.5rem; box-sizing: border-box; text-align: center;">
                        <p style="font-size: 0.82rem; font-weight: 500; color: #f8fafc; line-height: 1.45; margin: 0; max-height: 145px; overflow-y: auto;">
                            ${description}
                        </p>
                    </div>
                </div>

                <!-- Slide Navigation Arrows -->
                <button onclick="event.stopPropagation(); window.slideComboGallery('${m.id}', -1)" style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.68); border: none; color: #fff; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; backdrop-filter: blur(4px);">
                    <i class="fa-solid fa-chevron-left" style="font-size: 0.8rem;"></i>
                </button>
                <button onclick="event.stopPropagation(); window.slideComboGallery('${m.id}', 1)" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.68); border: none; color: #fff; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; backdrop-filter: blur(4px);">
                    <i class="fa-solid fa-chevron-right" style="font-size: 0.8rem;"></i>
                </button>
            </div>

            <!-- Tile Body Content -->
            <div class="tile-body-content" style="padding: 1rem 1.1rem 0.8rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin: 0 0 0.6rem; line-height: 1.25;">
                        ${m.name}
                        ${!isActive ? ' <span style="background:rgba(249,115,22,0.1); color:var(--color-orange); font-size:0.65rem; padding:0.1rem 0.35rem; border-radius:4px;"><i class="fa-solid fa-pause"></i> Pausiert</span>' : ''}
                    </h3>

                    <!-- Single column list matching market style -->
                    <div class="tile-info-list" style="display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.84rem; color: var(--text-main); margin-bottom: 0.6rem;">
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-location-dot" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>${m.location}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-guitar" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>Typ: ${m.type}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-euro-sign" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>Gage: ${budgetDisplay}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-tag" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>Genres: ${genresList}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-clock" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>Spieldauer: ${durationDisplay}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-calendar-days" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>Verfügbarkeit: ${availDaysStr}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-sliders" style="color: ${themeColor}; width: 16px; text-align: center;"></i>
                            <span>Technik: ${techDisplayStr}</span>
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
            <div class="profile-section-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom:0.8rem; flex-wrap: wrap; gap:1rem;">
                    <h3 style="margin:0; color:var(--color-purple);"><i class="fa-solid fa-guitar"></i> Aktive Musiker-Profile (${activeMusicians.length})</h3>
                </div>
                
                <div class="my-musicians-list">
                    ${activeMusicians.length === 0 ? `
                        <div style="padding:2rem 1rem; text-align:center; color:var(--text-muted); margin-bottom: 1rem;">
                            <i class="fa-solid fa-guitar" style="font-size:2.5rem; color:var(--border-glass); margin-bottom:0.8rem;"></i>
                            <p>Keine aktiven Profile vorhanden.</p>
                        </div>
                    ` : `
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 1rem;">
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
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
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
        videos: musicianObj?.videos ? [...musicianObj.videos] : []
    };

    // Extract current types
    const currentTypes = musicianObj?.type ? musicianObj.type.split(',').map(s => s.trim()) : ['Solo'];

    // Helper to check if weekday availability day is active
    const isDayActive = (dayKey) => {
        if (!musicianObj) return true; // Default to checked for new profiles
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
        
        if (!musicianObj) return defVal;
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
                        <label>Künstler-Typ (Mehrfachauswahl)</label>
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
                        <label>Genres (Mehrfachauswahl)</label>
                        <div class="checkbox-tag-grid" id="grid-genres">
                            ${['Pop', 'Rock', 'Schlager', 'Funk', 'Charts', 'Evergreens', 'Dance', 'Elektronisch', 'Jazz', 'Latin', 'R&B/Soul', 'Hip Hop', 'Rap', 'Punk', 'Metal', 'Alternative', 'Indie', '60er', '70er', '80er', '90er', '2000er', '2010er', 'Afrobeat', 'Blues', 'Gospel', 'Country', 'Folk', 'K-Pop', 'Klassisch', 'Sonstige'].map(g => {
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
                        <label>Instrumente (Mehrfachauswahl)</label>
                        <div class="checkbox-tag-grid" id="grid-instruments">
                            ${['Akustik', 'Gesang', 'Gitarre', 'Klavier/Piano', 'Bass', 'Schlagzeug', 'Percussion/Cajón', 'Saxophon', 'Trompete', 'Geige', 'Cello', 'Harfe', 'Sonstige'].map(ins => {
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
                        <label>Bevorzugte Event-Typen (Mehrfachauswahl)</label>
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
                                <label>Wunschgröße Publikum</label>
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
                        <h4 style="font-family: var(--font-heading); font-size:1.1rem; margin-bottom:0.3rem; color:var(--text-main);"><i class="fa-solid fa-photo-film"></i> Medien (Foto & Video)</h4>
                        <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.3;">
                            Füge Fotos und Videos für dein Profil hinzu, um es attraktiver zu gestalten.
                        </p>
                        <div class="form-group" style="margin-bottom: 1.2rem;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                                <label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">📷 Bilder (max.3) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: JPG, JPEG, PNG, GIF, WEBP&#10;Maximale Grösse: 5 MB"></i></label>
                                <button type="button" onclick="window.addRegMedia('musician', 'photo')" class="btn btn-sm btn-glass" style="margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(34, 197, 94, 0.3); color:#22c55e; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;" title="Foto hinzufügen"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <div id="reg-musician-photos-preview" style="display: flex; gap: 0.5rem; flex-wrap: wrap;"></div>
                        </div>
                        <div class="form-group" style="margin-bottom: 1.2rem;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                                <label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">🎬 Video (max.1) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: MP4, MOV, WebM, OGG, MKV&#10;Maximale Grösse: 20 MB"></i></label>
                                <button type="button" onclick="window.addRegMedia('musician', 'video')" class="btn btn-sm btn-glass" style="margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(124, 58, 237, 0.3); color:#a855f7; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;" title="Video hinzufügen"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <div id="reg-musician-videos-preview" style="display: flex; gap: 0.5rem; flex-wrap: wrap;"></div>
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
                                <div style="flex: 1; min-width: 100px;">
                                    <span style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:0.3rem;">Startzeit</span>
                                    <input type="time" name="eventStartTime" class="input-field" value="18:00" style="margin: 0; width: 100%; height:42px; min-width: 90px;">
                                </div>
                                <div style="flex: 1; min-width: 100px;">
                                    <span style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:0.3rem;">Endzeit</span>
                                    <input type="time" name="eventEndTime" class="input-field" value="22:00" style="margin: 0; width: 100%; height:42px; min-width: 90px;">
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Ort</label>
                            <input type="text" id="input-org-location-search" class="input-field" placeholder="Ort eingeben, z.B. München" autocomplete="off" style="width: 100%; margin-bottom: 0.5rem;">
                            <div class="selected-locations-tags" id="org-selected-locations-container" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 0.5rem;"></div>
                            <input type="hidden" name="orgLocations" id="input-org-locations" value="">
                        </div>

                        <div class="form-group">
                            <label>Genres</label>
                            <div class="checkbox-tag-grid" id="grid-org-genres">
                                ${['Pop', 'Rock', 'Schlager', 'Funk', 'Charts', 'Evergreens', 'Dance', 'Elektronisch', 'Jazz', 'Latin', 'R&B/Soul', 'Hip Hop', 'Rap', 'Punk', 'Metal', 'Alternative', 'Indie', '60er', '70er', '80er', '90er', '2000er', '2010er', 'Afrobeat', 'Blues', 'Gospel', 'Country', 'Folk', 'K-Pop', 'Klassisch', 'Sonstige'].map(g => `
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
                                ${['Akustik', 'Gesang', 'Gitarre', 'Klavier/Piano', 'Bass', 'Schlagzeug', 'Percussion/Cajón', 'Saxophon', 'Trompete', 'Geige', 'Cello', 'Harfe', 'Sonstige'].map(ins => `
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
                                <label>Besucheranzahl</label>
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
                                <label>Gage (€)</label>
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
                            <textarea name="orgDescription" id="textarea-org-desc" class="input-field" rows="3" maxlength="200" placeholder="Beschreibe kurz dein Event..."></textarea>
                        </div>

                        <!-- Media Section -->
                        <div style="border-top:1px solid rgba(15,23,42,0.08); margin: 1.5rem 0; padding-top:1rem;"></div>
                        <h4 style="font-family: var(--font-heading); font-size:1.1rem; margin-bottom:0.3rem; color:var(--text-main);"><i class="fa-solid fa-photo-film"></i> Medien (Foto & Video)</h4>
                        <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.3;">
                            Füge Fotos und Videos für dein Event hinzu, um es attraktiver zu gestalten.
                        </p>
                        <div class="form-group" style="margin-bottom: 1.2rem;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                                <label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">📷 Bilder (max.3) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: JPG, JPEG, PNG, GIF, WEBP&#10;Maximale Grösse: 5 MB"></i></label>
                                <button type="button" onclick="window.addRegMedia('organizer', 'photo')" class="btn btn-sm btn-glass" style="margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(34, 197, 94, 0.3); color:#22c55e; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;" title="Foto hinzufügen"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <div id="reg-organizer-photos-preview" style="display: flex; gap: 0.5rem; flex-wrap: wrap;"></div>
                        </div>
                        <div class="form-group" style="margin-bottom: 1.2rem;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                                <label style="font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">🎬 Video (max.1) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.75rem;" title="Erlaubte Formate: MP4, MOV, WebM, OGG, MKV&#10;Maximale Grösse: 20 MB"></i></label>
                                <button type="button" onclick="window.addRegMedia('organizer', 'video')" class="btn btn-sm btn-glass" style="margin:0; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; border-color: rgba(124, 58, 237, 0.3); color:#a855f7; min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;" title="Video hinzufügen"><i class="fa-solid fa-plus"></i></button>
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
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.4rem;">
                                <input type="checkbox" name="hidePhone" id="input-reg-hidephone" style="width: auto; margin: 0; cursor: pointer; scale: 1.3; transform-origin: left center; margin-right: 0.15rem;">
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
                                <div class="price">7,99 € <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
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
                                <div class="price">5,99 € <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
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
                                <div class="price">4,99 € <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">/ Monat</span></div>
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
                        </div><input type="hidden" name="selectedPlan" id="input-selected-plan" value="flex">
                        
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
    }

    if (magicTab) {
        magicTab.addEventListener('click', () => {
            setActiveTab(magicTab);
            showForm(magicForm);
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
                    videos: [{ title: 'Live Performance Highlights', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }]
                },
                organizer: {
                    photos: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'],
                    videos: [{ title: 'Live Performance Highlights', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }]
                }
            };
            window.updateRegMediaPreview('musician');
            window.updateRegMediaPreview('organizer');
        });
    }

    if (magicForm) {
        magicForm.addEventListener('submit', (e) => {
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

            setTimeout(() => {
                if (btn) btn.style.display = 'none';
                if (magicForm.elements.email) magicForm.elements.email.style.display = 'none';
                const grp = magicForm.querySelector('.form-group');
                if (grp) {
                    const lbl = grp.querySelector('label');
                    const para = grp.querySelector('p');
                    if (lbl) lbl.style.display = 'none';
                    if (para) para.style.display = 'none';
                }

                const res = state.loginPasswordless(email);
                let mockEmailHtml = '';

                if (res.success) {
                    const user = res.user;
                    const roleText = user.role === 'musician' ? 'Musiker' : 'Veranstalter';

                    if (typeof window.addMockEmail === 'function') {
                        window.addMockEmail(
                            "Dein Anmeldelink für GigConnAct",
                            "GigConnAct <no-reply@gigconnact.de>",
                            `Hallo ${user.firstName},\n\nklicke auf den Link unten, um dich direkt bei deinem ${roleText}-Account anzumelden:\n\n[Jetzt anmelden]`
                        );
                    }

                    mockEmailHtml = `
                        <div style="background: rgba(124, 58, 237, 0.08); border: 1.5px solid rgba(124, 58, 237, 0.3); border-radius: 12px; padding: 1.25rem; margin-top: 1rem; text-align: left;">
                            <h4 style="margin: 0 0 0.5rem; font-family: var(--font-heading); color: #a855f7; display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem;">
                                <i class="fa-solid fa-envelope-open-text"></i> Posteingang (Simulation)
                            </h4>
                            <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.5rem;">
                                <strong>Betreff:</strong> Dein Anmeldelink für GigConnAct
                            </p>
                            <p style="font-size: 0.82rem; margin-bottom: 1rem; line-height: 1.4; color: var(--text-main);">
                                Hallo <strong>${user.firstName}</strong>,<br><br>
                                Klicke auf den Button unten, um dich direkt bei deinem <strong>${roleText}-Account</strong> anzumelden:
                            </p>
                            <button type="button" class="btn btn-primary btn-magic-action" data-email="${email}" data-action="login" style="width: 100%; background: ${user.role === 'musician' ? '#7c3aed' : '#2563eb'}; font-weight: 800; border: none; padding: 0.7rem; border-radius: 8px;">Jetzt anmelden</button>
                        </div>
                    `;
                } else {
                    if (typeof window.addMockEmail === 'function') {
                        window.addMockEmail(
                            "Registrierung abschließen bei GigConnAct",
                            "GigConnAct <no-reply@gigconnact.de>",
                            `Hallo,\n\ndiese E-Mail-Adresse ist neu bei uns. Wähle aus, wie du dich registrieren und anmelden möchtest.`
                        );
                    }

                    mockEmailHtml = `
                        <div style="background: rgba(124, 58, 237, 0.08); border: 1.5px solid rgba(124, 58, 237, 0.3); border-radius: 12px; padding: 1.25rem; margin-top: 1rem; text-align: left;">
                            <h4 style="margin: 0 0 0.5rem; font-family: var(--font-heading); color: #a855f7; display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem;">
                                <i class="fa-solid fa-envelope-open-text"></i> Posteingang (Simulation)
                            </h4>
                            <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.5rem;">
                                <strong>Betreff:</strong> Registrierung abschließen bei GigConnAct
                            </p>
                            <p style="font-size: 0.82rem; margin-bottom: 1rem; line-height: 1.4; color: var(--text-main);">
                                Hallo!<br><br>
                                Diese E-Mail-Adresse ist neu bei uns. Wähle aus, wie du dich registrieren und anmelden möchtest:
                            </p>
                            <div style="display: flex; gap: 0.75rem;">
                                <button type="button" class="btn btn-primary btn-magic-action" data-email="${email}" data-action="register-mus" style="flex: 1; background: #7c3aed; border: none; font-weight: 700; font-size: 0.78rem; padding: 0.6rem;">
                                    <i class="fa-solid fa-guitar"></i> Als Musiker
                                </button>
                                <button type="button" class="btn btn-primary btn-magic-action" data-email="${email}" data-action="register-org" style="flex: 1; background: #2563eb; border: none; font-weight: 700; font-size: 0.78rem; padding: 0.6rem;">
                                    <i class="fa-solid fa-calendar-days"></i> Als Veranstalter
                                </button>
                            </div>
                        </div>
                    `;
                }

                if (successContainer) {
                    successContainer.innerHTML = `
                        <div style="text-align: center; color: var(--color-green); font-size: 1.8rem; margin-bottom: 0.5rem;">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <h4 style="text-align: center; margin: 0 0 0.5rem; font-family: var(--font-heading); color: var(--text-main);">Anmeldelink gesendet!</h4>
                        <p style="text-align: center; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.4;">
                            Wir haben einen sicheren Link an <strong>${email}</strong> gesendet.
                        </p>
                        ${mockEmailHtml}
                    `;
                    successContainer.style.display = 'block';

                    successContainer.querySelectorAll('.btn-magic-action').forEach(actionBtn => {
                        actionBtn.addEventListener('click', (ev) => {
                            const action = ev.currentTarget.getAttribute('data-action');
                            const userEmail = ev.currentTarget.getAttribute('data-email');
                            let loginRes;

                            if (action === 'login') {
                                loginRes = state.loginPasswordless(userEmail);
                            } else if (action === 'register-mus') {
                                loginRes = state.registerOnTheFly(userEmail, 'musician');
                            } else if (action === 'register-org') {
                                loginRes = state.registerOnTheFly(userEmail, 'organizer');
                            }

                            if (loginRes && loginRes.success) {
                                closeModal();
                                document.dispatchEvent(new CustomEvent('user-state-changed'));
                                if (onSuccessCallback) onSuccessCallback();
                                else navigateAfterLogin();
                                /* Success toast disabled per user request */
                            }
                        });
                    });
                }
            }, 1200);
        });
    }
    const pickerMus = document.getElementById('role-picker-mus');
    const pickerOrg = document.getElementById('role-picker-org');
    const fieldsMus = document.getElementById('reg-fields-musician');
    const fieldsOrg = document.getElementById('reg-fields-organizer');
    let selectedRole = 'musician';

    // State arrays for organizer locations and dates
    let selectedOrgLocations = [];
    let selectedMusLocations = [];
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
        
        renderMusLocations();
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
        renderOrgLocations();
        renderMusLocations();
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
    const orgLocationContainer = document.getElementById('org-selected-locations-container');
    const orgLocationHidden = document.getElementById('input-org-locations');
    const addLocationBtn = document.getElementById('btn-org-add-location');

    function renderOrgLocations() {
        if (!orgLocationContainer) return;
        orgLocationContainer.innerHTML = selectedOrgLocations.map((loc, idx) => `
            <span class="tag" style="background: rgba(96, 165, 250, 0.15) !important; border: 1.5px solid #60a5fa !important; color: #60a5fa !important; font-weight: 600; display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.6rem; border-radius: 20px; font-size: 0.75rem;">
                ${loc}
                <i class="fa-solid fa-xmark remove-location-btn" data-index="${idx}" style="cursor: pointer; font-size: 0.75rem;"></i>
            </span>
        `).join('');

        if (orgLocationHidden) {
            orgLocationHidden.value = selectedOrgLocations.length > 0 ? JSON.stringify(selectedOrgLocations) : '';
        }

        orgLocationContainer.querySelectorAll('.remove-location-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                selectedOrgLocations.splice(idx, 1);
                renderOrgLocations();
            });
        });
    }

    function addLocation(locText) {
        const val = locText.trim();
        if (!val) return;
        if (!selectedOrgLocations.includes(val)) {
            selectedOrgLocations.push(val);
            renderOrgLocations();
        }
        if (orgLocationInput) {
            orgLocationInput.value = '';
        }
    }

    if (orgLocationInput) {
        setupLocationAutocomplete(orgLocationInput, addLocation);
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
                                addLocation(locString);
                                showToast({ title: 'Standort ermittelt', message: `Ort hinzugefügt: ${locString}` });
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
    const musLocationContainer = document.getElementById('mus-selected-locations-container');
    const musLocationHidden = document.getElementById('input-mus-locations');
    const addMusLocationBtn = document.getElementById('btn-mus-add-location');

    function renderMusLocations() {
        if (!musLocationContainer) return;
        musLocationContainer.innerHTML = selectedMusLocations.map((loc, idx) => `
            <span class="tag" style="background: rgba(168, 85, 247, 0.15) !important; border: 1.5px solid #a855f7 !important; color: #a855f7 !important; font-weight: 600; display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.6rem; border-radius: 20px; font-size: 0.75rem;">
                ${loc}
                <i class="fa-solid fa-xmark remove-mus-location-btn" data-index="${idx}" style="cursor: pointer; font-size: 0.75rem;"></i>
            </span>
        `).join('');

        if (musLocationHidden) {
            musLocationHidden.value = selectedMusLocations.length > 0 ? JSON.stringify(selectedMusLocations) : '';
        }

        musLocationContainer.querySelectorAll('.remove-mus-location-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                selectedMusLocations.splice(idx, 1);
                renderMusLocations();
            });
        });
    }

    function addMusLocation(locText) {
        const val = locText.trim();
        if (!val) return;
        if (!selectedMusLocations.includes(val)) {
            selectedMusLocations.push(val);
            renderMusLocations();
        }
        if (musLocationInput) {
            musLocationInput.value = '';
        }
    }

    if (musLocationInput) {
        setupLocationAutocomplete(musLocationInput, addMusLocation);
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
            
            card.classList.add("active");
            const plan = card.getAttribute("data-plan");
            if (selectedPlanInput) selectedPlanInput.value = plan;

            // Dynamically update card buttons text in registration
            subCards.forEach(c => {
                const btn = c.querySelector(".btn-sub-select");
                if (btn) {
                    btn.textContent = c.classList.contains("active") ? "Ausgew' + $ae + 'hlt" : "Ausw' + $ae + 'hlen";
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
            if (['GIGINSTA59', 'INSTASTORY', 'GIGPREMIUM', 'GIGCONN59'].includes(code)) {
                isPromoCodeApplied = true;
                promoStatus.textContent = "✔ Gutscheincode gültig! Premium-Tarif freigeschaltet (3 Monate kostenfrei, danach 4,99 €/Monat).";
                promoStatus.style.color = "#10b981";
                promoStatus.style.display = "block";
                promoInput.disabled = true;
                promoBtn.disabled = true;
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
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const errDiv = document.getElementById('register-error-msg');
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
            const checkedTypes = registerForm.querySelectorAll('input[name="musicianType"]:checked');
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
            if (selectedMusLocations.length === 0) {
                errDiv.textContent = 'Bitte füge mindestens einen Einsatzort hinzu.';
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
            if (selectedEventDates.length === 0) {
                errDiv.textContent = 'Bitte wähle mindestens ein Veranstaltungsdatum im Kalender aus.';
                errDiv.style.display = 'block';
                errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            if (selectedOrgLocations.length === 0) {
                errDiv.textContent = 'Bitte füge mindestens einen Veranstaltungsort hinzu.';
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
        }

        let compValue = "Privatperson";
        if (selectedRole === 'organizer') {
            const orgType = registerForm.elements.organizerType.value;
            if (orgType && orgType !== 'Privater Veranstalter') {
                compValue = registerForm.elements.company.value.trim() || 'Privatperson';
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
            payload.musicianType = Array.from(registerForm.querySelectorAll('input[name="musicianType"]:checked')).map(el => el.value).join(', ');
            payload.locations = selectedMusLocations;
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
            payload.photos = window.registrationMedia.musician.photos;
            payload.videos = window.registrationMedia.musician.videos;
        } else {
            payload.eventName = registerForm.elements.eventName.value.trim();
            payload.orgEventTypes = Array.from(registerForm.querySelectorAll('input[name="orgEventTypes"]:checked')).map(el => el.value);
            payload.eventDates = selectedEventDates;
            payload.eventStartTime = registerForm.querySelector('input[name="eventStartTime"]')?.value || '18:00';
            payload.eventEndTime = registerForm.querySelector('input[name="eventEndTime"]')?.value || '22:00';
            payload.orgLocations = selectedOrgLocations;
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
            payload.photos = window.registrationMedia.organizer.photos;
            payload.videos = window.registrationMedia.organizer.videos;
        }

        const res = state.register(payload);
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
}

function renderVerificationModal(wrapper, onSuccessCallback) {
    const pendingUser = JSON.parse(localStorage.getItem('GigConnAct_pending_user') || '{}');
    wrapper.innerHTML = `
        <div class="modal-content" style="max-width: 450px; text-align: center;">
            <div class="modal-header" style="border-bottom:none; justify-content:center;">
                <h3 style="font-size:1.6rem;"><i class="fa-solid fa-envelope-circle-check text-cyan"></i> E-Mail Verifizierung</h3>
            </div>
            <div class="modal-body" style="padding-top:0;">
                <p style="margin-bottom:1.5rem; line-height: 1.5; color: var(--text-muted);">
                    Wir haben eine E-Mail zur Registrierung an <strong>${pendingUser.email || 'deine E-Mail'}</strong> gesendet.<br><br>
                    FÜr diese Demo kannst du die Registrierung direkt hier durch Klick auf den Bestätigungslink abschließen.
                </p>
                <div style="background:rgba(0,242,254,0.03); border: 1px dashed rgba(0,242,254,0.3); border-radius:var(--radius-md); padding:1rem; margin-bottom: 2rem;">
                    <div style="font-size: 0.75rem; text-transform: uppercase; color:var(--color-cyan); font-weight:700; margin-bottom: 0.5rem;">Simulierte E-Mail-Nachricht</div>
                    <p style="font-size:0.85rem; margin-bottom:1rem;">Hi ${pendingUser.firstName || 'Musiker'}, bitte klicke unten, um dein GigConnAct Konto zu aktivieren.</p>
                    <button class="btn btn-primary btn-sm" id="btn-mock-email-confirm">
                        E-Mail bestätigen
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('btn-mock-email-confirm').addEventListener('click', () => {
        const res = state.confirmEmail();
        if (res.success) {
            closeModal();
            showToast({
                title: "Registrierung abgeschlossen! 🎉",
                message: "Dein Profil ist nun aktiv. Willkommen bei GigConnAct!"
            });
            document.dispatchEvent(new CustomEvent('user-state-changed'));
            if (onSuccessCallback) onSuccessCallback();
            else navigateAfterLogin();
        }
    });
}

function renderFeedbackModal(wrapper, onSuccessCallback) {
    if (!state.currentUser) return;
    const u = state.currentUser;
    const isMusician = u.role === 'musician';
    
    wrapper.innerHTML = `
        <div class="modal-content" style="max-width: 500px; background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-lg);">
            <div class="modal-header" style="padding: 1.2rem 1.5rem; border-bottom: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 1.3rem; font-family: var(--font-heading); display: flex; align-items: center; gap: 0.6rem; color: var(--text-main);">
                    <i class="fa-solid fa-comment-dots" style="color: ${isMusician ? '#3b82f6' : '#a855f7'};"></i> Feedback senden
                </h3>
                <button class="close-modal-btn" id="btn-close-modal" style="background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer; padding: 0; line-height: 1;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 1.5rem;">
                <form id="feedback-form" style="display: flex; flex-direction: column; gap: 1.2rem;">
                    <div class="form-group" style="display: flex; flex-direction: column; gap: 0.4rem;">
                        <label style="font-weight: 600; font-size: 0.85rem; color: var(--text-main);">Absender</label>
                        <input type="text" class="input-field" value="${u.firstName} ${u.lastName} (${u.email})" disabled style="background: rgba(255,255,255,0.03) !important; opacity: 0.75; cursor: not-allowed; width: 100%; box-sizing: border-box; color: var(--text-muted) !important;">
                    </div>
                    <div class="form-group" style="display: flex; flex-direction: column; gap: 0.4rem;">
                        <label style="font-weight: 600; font-size: 0.85rem; color: var(--text-main);">Empfänger</label>
                        <input type="email" class="input-field" value="info@gigconnact.de" disabled style="background: rgba(255,255,255,0.03) !important; opacity: 0.75; cursor: not-allowed; width: 100%; box-sizing: border-box; color: var(--text-muted) !important;">
                    </div>
                    <div class="form-group" style="display: flex; flex-direction: column; gap: 0.4rem;">
                        <label style="font-weight: 600; font-size: 0.85rem; color: var(--text-main);">Betreff</label>
                        <input type="text" id="feedback-subject" class="input-field" placeholder="Z. B. Verbesserungsvorschlag, Frage, Lob..." required style="width: 100%; box-sizing: border-box;">
                    </div>
                    <div class="form-group" style="display: flex; flex-direction: column; gap: 0.4rem;">
                        <label style="font-weight: 600; font-size: 0.85rem; color: var(--text-main);">Deine Nachricht</label>
                        <textarea id="feedback-message" class="input-field" rows="5" placeholder="Beschreibe dein Anliegen..." required style="width: 100%; box-sizing: border-box; resize: vertical; min-height: 120px;"></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 0.8rem; margin-top: 0.5rem; width: 100%;">
                        <button type="submit" class="btn btn-submit-feedback ${isMusician ? 'feedback-blue-btn' : 'feedback-purple-btn'}" id="btn-submit-feedback" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; height: 42px; border-radius: var(--radius-sm); border: none; font-weight: 600;">
                            <i class="fa-solid fa-paper-plane"></i> Feedback absenden
                        </button>
                        <button type="button" class="btn btn-glass" id="btn-mailto-fallback" title="Über eigenes E-Mail-Programm senden" style="display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; padding: 0; flex-shrink: 0; background: rgba(255,255,255,0.05); border: 1px solid var(--border-glass); border-radius: var(--radius-sm); color: var(--text-main); cursor: pointer; transition: all 0.2s;">
                            <i class="fa-solid fa-envelope-open-text" style="font-size: 1.1rem;"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById('btn-close-modal').addEventListener('click', closeModal);

    const feedbackForm = document.getElementById('feedback-form');
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const subject = document.getElementById('feedback-subject').value.trim();
        const message = document.getElementById('feedback-message').value.trim();
        
        // Disable buttons and show loading state
        const submitBtn = document.getElementById('btn-submit-feedback');
        const mailtoBtn = document.getElementById('btn-mailto-fallback');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Wird gesendet...';
        }
        if (mailtoBtn) mailtoBtn.disabled = true;

        setTimeout(() => {
            closeModal();
            showToast({
                title: "Feedback gesendet! ✉️",
                message: "Vielen Dank! Deine Nachricht wurde erfolgreich an info@gigconnact.de übermittelt."
            });
            if (onSuccessCallback) onSuccessCallback();
        }, 1000);
    });

    const mailtoBtn = document.getElementById('btn-mailto-fallback');
    mailtoBtn.addEventListener('click', () => {
        const subject = document.getElementById('feedback-subject').value.trim() || 'Feedback an GigConnAct';
        const message = document.getElementById('feedback-message').value.trim() || 'Hallo GigConnAct Team,';
        
        const mailtoUrl = `mailto:info@gigconnact.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        window.location.href = mailtoUrl;
    });
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

    form.addEventListener('submit', (e) => {
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
            state.addCredits(buyAmount);
            
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

                wrapper.querySelector('#btn-confirm-now').addEventListener('click', () => {
                    const unlockRes = state.unlockContact(targetUnlockId);
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
            state.toggleSubscription(); // sets isPremium = true
            
            if (targetUnlockId) {
                state.unlockContact(targetUnlockId); // ensure it's in unlockedContacts as well, though subscription covers it
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

function navigate(page) {
    const mainContainer = document.getElementById('app-main');
    if (!mainContainer) return;

    if (page === '') {
        mainContainer.classList.add('page-landing');
    } else {
        mainContainer.classList.remove('page-landing');
    }

    window.scrollTo(0, 0);
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

        const marketIconHtml = `
            <a href="${marketLink}" class="nav-icon-btn ${isMusician ? 'btn-purple' : 'btn-blue'} ${isMarketActive ? 'active' : ''}" title="${marketTitle}">
                <i class="fa-solid ${marketIcon}"></i>
            </a>
        `;
        
        const postboxIconHtml = `
            <a href="#/postbox" class="nav-icon-btn ${isMusician ? 'btn-purple' : 'btn-blue'} ${isPostboxActive ? 'active' : ''}" title="Postfach" style="position: relative;">
                <i class="fa-solid fa-envelope"></i>
                ${unreadCount > 0 ? `
                    <span style="position: absolute; top: -4px; right: -4px; background: var(--color-red); color: white; font-size: 0.65rem; font-weight: 800; min-width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1.5px solid var(--bg-card); padding: 0 2px; box-sizing: border-box; line-height: 1;">
                        ${unreadCount}
                    </span>
                ` : ''}
            </a>
        `;

        authArea.innerHTML = `
            <div style="display:flex; align-items:center; gap:0.6rem;">
                ${creditsBadgeHtml}
                ${marketIconHtml}
                ${postboxIconHtml}
                
                <div class="profile-dropdown-container">
                    <button class="profile-avatar-btn ${isMusician ? 'profile-avatar-purple' : 'profile-avatar-blue'} ${isProfileActive ? 'active' : ''}" id="btn-profile-dropdown" aria-label="Benutzermenü">
                        <i class="fa-regular fa-circle-user"></i>
                    </button>
                    <div class="profile-dropdown-menu" id="profile-dropdown-menu">

                        
                        <!-- Meine Musiker / Meine Events Link -->
                        <a href="${isMusician ? '#/my-musicians' : '#/my-events'}" class="profile-dropdown-item ${isMusician ? 'profile-dropdown-purple' : 'profile-dropdown-blue'} ${window.location.hash === (isMusician ? '#/my-musicians' : '#/my-events') ? 'active' : ''}" id="dropdown-link-my-tab"><i class="fa-solid ${isMusician ? 'fa-guitar' : 'fa-calendar-check'}"></i><span>${isMusician ? 'Meine Musiker' : 'Meine Events'}</span></a>
                        
                        <a href="#/profile" class="profile-dropdown-item ${isMusician ? 'profile-dropdown-purple' : 'profile-dropdown-blue'} ${isProfileActive ? 'active' : ''}" id="dropdown-link-profile"><i class="fa-solid fa-user-gear"></i><span>Profil bearbeiten</span></a>
                        
                        <!-- Feedback Button (Moved from Header to Dropdown under Profil bearbeiten) -->
                        <a href="javascript:void(0)" class="profile-dropdown-item ${isMusician ? 'profile-dropdown-purple' : 'profile-dropdown-blue'}" id="dropdown-btn-feedback"><i class="fa-solid fa-comment-dots"></i><span>Feedback senden</span></a>
                        
                        <div class="profile-dropdown-divider"></div>
                        <a href="javascript:void(0)" class="profile-dropdown-item logout-item ${isMusician ? 'profile-dropdown-purple' : 'profile-dropdown-blue'}" id="dropdown-btn-logout"><i class="fa-solid fa-right-from-bracket"></i><span>Abmelden</span></a>
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

        // Toggle feedback modal logic
        const feedbackBtn = document.getElementById('dropdown-btn-feedback');
        if (feedbackBtn) {
            feedbackBtn.addEventListener('click', () => {
                menu.classList.remove('show');
                showModal('feedback');
            });
        }

        // Dropdown internal link navigation handles closing menu
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
    let page = hash.replace('#/', '');
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
            if (state && state.currentUser) {
                if (state.currentUser.role === 'musician') {
                    window.location.hash = '#/events';
                } else if (state.currentUser.role === 'organizer') {
                    window.location.hash = '#/musicians';
                } else {
                    window.location.hash = '#/';
                }
            } else {
                window.location.hash = '#/';
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

    // Fetch user chats
    const chats = state.getChatsForUser(currentUserId);
    let activeTab = window.postboxActiveTab || 'all'; // 'all' | 'received' | 'sent' | 'system'
    let activeChatId = window.postboxActiveChatId !== undefined ? window.postboxActiveChatId : null;

    let profileSelectorHtml = '';
    if (userProfiles.length > 0) {
        const options = userProfiles.map(p => `<option value="${p.id}" ${p.id === activeProfileId ? 'selected' : ''}>${p.name || p.contactName || p.title || 'Profil'}</option>`).join('');
        profileSelectorHtml = `
            <div style="margin-bottom: 0.8rem; display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.2rem;">
                <label style="font-size: 0.65rem; font-weight: 800; color: ${isMusician ? 'var(--color-purple)' : 'var(--color-cyan)'}; text-transform: uppercase; letter-spacing: 0.5px;">Aktives Profil:</label>
                <select id="postbox-profile-select" class="input-field" style="width: 100%; padding: 0.4rem 0.8rem; font-size: 0.8rem; height: 34px; margin: 0; font-weight: 700; border: 1px solid var(--border-glass); border-radius: 8px; background: rgba(255,255,255,0.02); color: var(--text-main);">
                    ${options}
                </select>
            </div>
        `;
    }

    const renderView = () => {
        window.postboxActiveTab = activeTab;
        window.postboxActiveChatId = activeChatId;

        // Categorize chats
        const receivedChats = [];
        const sentChats = [];
        const systemChats = [];

        chats.forEach(chat => {
            const isSys = chat.participants.includes('system');
            if (isSys) {
                systemChats.push(chat);
                return;
            }

            const firstMsg = chat.messages[0];
            const isFirstMsgFromMe = firstMsg ? (firstMsg.senderId === currentUserId) : (chat.initiatorId === currentUserId);

            if (isFirstMsgFromMe) {
                sentChats.push(chat);
            } else {
                receivedChats.push(chat);
            }
        });

        let currentCategoryChats = [];
        if (activeTab === 'all') currentCategoryChats = chats;
        else if (activeTab === 'received') currentCategoryChats = receivedChats;
        else if (activeTab === 'sent') currentCategoryChats = sentChats;
        else if (activeTab === 'system') currentCategoryChats = systemChats;

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
                            <span style="display:flex; align-items:center; gap:0.5rem;">
                                <i class="fa-solid fa-envelope ${isMusician ? 'text-purple' : 'text-cyan'}"></i> Postfach
                            </span>
                            <i class="fa-solid fa-sliders" id="btn-toggle-postbox-filters" style="color: ${window.postboxShowFilters ? (isMusician ? 'var(--color-purple)' : 'var(--color-cyan)') : 'var(--text-muted)'}; cursor: pointer; font-size: 1.05rem; transition: color 0.2s;" title="Filter ein-/ausblenden"></i>
                        </h3>
                        
                        ${profileSelectorHtml}
                        <!-- 4 Category Tabs (2x2 Grid) -->
                        <div id="postbox-filters-container" style="display: ${window.postboxShowFilters ? 'grid' : 'none'}; grid-template-columns: 1fr 1fr; gap: 0.4rem;">
                            <button class="btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-glass'} tab-btn-postbox" data-tab="all" style="font-size: 0.72rem; padding: 0.4rem 0.2rem; text-align: center; margin:0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="Alle Nachrichten">
                                📂 Alle (${chats.length})
                            </button>
                            <button class="btn btn-sm ${activeTab === 'received' ? 'btn-primary' : 'btn-glass'} tab-btn-postbox" data-tab="received" style="font-size: 0.72rem; padding: 0.4rem 0.2rem; text-align: center; margin:0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-color: rgba(34, 197, 94, 0.35); color: #22c55e;" title="Empfangene Anfragen">
                                📥 Empfangen (${receivedChats.length})
                            </button>
                            <button class="btn btn-sm ${activeTab === 'sent' ? 'btn-primary' : 'btn-glass'} tab-btn-postbox" data-tab="sent" style="font-size: 0.72rem; padding: 0.4rem 0.2rem; text-align: center; margin:0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-color: rgba(239, 68, 68, 0.35); color: #ef4444;" title="Versendete Anfragen">
                                📤 Versendet (${sentChats.length})
                            </button>
                            <button class="btn btn-sm ${activeTab === 'system' ? 'btn-primary' : 'btn-glass'} tab-btn-postbox" data-tab="system" style="font-size: 0.72rem; padding: 0.4rem 0.2rem; text-align: center; margin:0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-color: rgba(234, 179, 8, 0.35); color: #eab308;" title="Benachrichtigungen">
                                🔔 Info (${systemChats.length})
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
                                }
                            }

                            const lastMsg = c.messages[c.messages.length - 1];
                            const isUnread = !state.readChats?.includes(c.id);

                            // Determine type and colors for specific feedback backgrounds and thick borders
                            let itemType = 'sent';
                            if (isSys) {
                                itemType = 'system';
                            } else {
                                const firstMsg = c.messages[0];
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

                            if (!isMusician && !isSys) {
                                const interest = state.interests?.find(i => i.musicianId === lockMusicianId && (lockEventId ? i.eventId === lockEventId : true));
                                const isPerfect = interest && interest.musicianInterested && interest.organizerInterested;
                                const isDeclined = interest && interest.organizerNoInterest;
                                const firstMsg = c.messages[0];
                                const isFirstMsgFromMe = firstMsg ? (firstMsg.senderId === currentUserId) : (c.initiatorId === currentUserId);
                                if (!isPerfect && !isDeclined && !isFirstMsgFromMe) {
                                    isAccordionLock = true;
                                }
                            }

                            const inlineChatHtml = isSelected ? `
                                <div class="mobile-chat-accordion" style="margin-top: 0.8rem; border-top: 1px solid var(--border-glass); padding-top: 0.8rem; text-align: left; width: 100%;">
                                    <!-- Chat Messages Body -->
                                    <div class="chat-messages-container" style="max-height: 260px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.6rem; padding: 0.5rem 0.2rem;">
                                        ${c.messages.length === 0 ? `
                                            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); text-align: center; padding: 1.5rem 1rem;">
                                                <i class="fa-regular fa-paper-plane" style="font-size: 1.8rem; color: var(--border-glass); margin-bottom: 0.6rem;"></i>
                                                <p style="font-size: 0.78rem; margin: 0; line-height: 1.3;">Keine Nachrichten vorhanden. Schreibe eine Nachricht, um das Gespräch zu beginnen!</p>
                                            </div>
                                        ` : c.messages.map(m => {
                                            const isMe = m.senderId === currentUserId;
                                            return `
                                                <div style="display: flex; justify-content: ${isMe ? 'flex-end' : 'flex-start'};">
                                                    <div style="max-width: 85%; padding: 0.55rem 0.75rem; border-radius: 12px; font-size: 0.78rem; line-height: 1.35; ${isMe ? 'background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: #fff; border-bottom-right-radius: 2px;' : 'background: rgba(255,255,255,0.05); color: var(--text-main); border: 1px solid var(--border-glass); border-bottom-left-radius: 2px;'}">
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
                                isOrganizerIncomingLock = true;
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
                                ${activeChat.messages.length === 0 ? `
                                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); text-align: center; padding: 2rem;">
                                        <i class="fa-regular fa-paper-plane" style="font-size: 2.5rem; color: var(--border-glass); margin-bottom: 0.8rem;"></i>
                                        <p style="font-size: 0.85rem; margin: 0;">Keine Nachrichten vorhanden. Schreibe eine Nachricht, um das Gespräch zu beginnen!</p>
                                    </div>
                                ` : activeChat.messages.map(m => {
                                    const isMe = m.senderId === currentUserId;
                                    return `
                                        <div style="display: flex; justify-content: ${isMe ? 'flex-end' : 'flex-start'};">
                                            <div style="max-width: 75%; padding: 0.75rem 1rem; border-radius: 12px; font-size: 0.85rem; line-height: 1.4; ${isMe ? 'background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: #fff; border-bottom-right-radius: 2px;' : 'background: rgba(255,255,255,0.05); color: var(--text-main); border: 1px solid var(--border-glass); border-bottom-left-radius: 2px;'}">
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
                                        <button type="submit" class="btn btn-primary" ${isSys ? 'disabled' : ''} style="margin: 0; padding: 0 1.2rem; height: 42px; font-weight: 700;">
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
                }
                renderView();
            });
        });

        // Question accept/decline handlers (supports both desktop and mobile layouts)
        container.querySelectorAll('.btn-accept-incoming-req').forEach(btn => {
            btn.addEventListener('click', () => {
                const mId = btn.getAttribute('data-musician-id');
                const eId = btn.getAttribute('data-event-id');
                state.acceptMusicianRequest(mId, eId);
                showToast({
                    title: "Perfect Match entstanden! 🎉",
                    message: "Ihr habt nun gegenseitig Interesse bekundet. Du kannst jetzt direkt antworten."
                });
                activeTab = 'received';
                renderView();
            });
        });

        container.querySelectorAll('.btn-decline-incoming-req').forEach(btn => {
            btn.addEventListener('click', () => {
                const mId = btn.getAttribute('data-musician-id');
                const eId = btn.getAttribute('data-event-id');
                state.declineMusicianRequest(mId, eId);
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
            sendForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = container.querySelector('#chat-message-input');
                const text = input.value.trim();
                if (!text || !activeChat) return;

                const counterpartyId = activeChat.participants.find(id => id !== currentUserId) || activeChat.participants[0];
                state.sendMessage(counterpartyId, text, activeChat.eventId);
                input.value = '';
                renderView();
            });
        }

        // Send message form handler (Mobile Accordion)
        container.querySelectorAll('.chat-send-form-mobile').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = form.querySelector('.chat-message-input-mobile');
                const text = input.value.trim();
                if (!text || !activeChat) return;

                const counterpartyId = activeChat.participants.find(id => id !== currentUserId) || activeChat.participants[0];
                state.sendMessage(counterpartyId, text, activeChat.eventId);
                input.value = '';
                renderView();
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
    };

    renderView();
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

    return items.map(item => {
        const isUnlocked = state ? ((typeof state.isUnlocked === 'function') ? state.isUnlocked(item.id) : (state.unlockedContacts && state.unlockedContacts.includes(item.id))) : false;
        console.log("renderMarketGridHTML: item =", item.id, "isUnlocked =", isUnlocked, "state.currentUser =", state ? state.currentUser : null);
        
        // Dynamically compute button styles based on page context and type
        const btnIsPurple = isEvents;
        const btnGradient = btnIsPurple 
            ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' 
            : 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)';
        const btnBorderColor = btnIsPurple ? '#7c3aed' : '#1e40af';
        const btnBoxShadow = btnIsPurple 
            ? '0 4px 14px rgba(124, 58, 237, 0.35)' 
            : '0 4px 14px rgba(37, 99, 235, 0.35)';
        
        // 3 Fotos pro Musiker/Event
        const photos = (item.photos || [
            item.image || (isEvents ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'),
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80'
        ]).slice(0, 3);

        // 3 Real Playable HTML5 Videos für Slides 4, 5, 6
        const videoSources = [
            { title: 'Live Performance Highlights', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
            { title: 'Auftritt Showreel & Trailer', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
            { title: 'Unplugged Live Session', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' }
        ];

        const genresList = (item.genres || (item.genre ? [item.genre] : ['Pop', 'Cover', 'Acoustic'])).join(', ');
        const instrumentsList = (item.instruments || (item.category ? [item.category] : ['Gesang', 'Gitarre'])).join(', ');
        
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

        // Technology formatting
        const techDisplay = item.technik;
        let techDisplayStr = 'Technik ist noch unklar';
        if (Array.isArray(techDisplay) && techDisplay.length > 0) {
            techDisplayStr = techDisplay.join(', ');
        } else if (typeof techDisplay === 'string' && techDisplay.trim() !== '') {
            techDisplayStr = techDisplay;
        }

        const description = item.description || item.bio || (isEvents 
            ? 'Wir suchen eine professionelle musikalische Begleitung für unser anstehendes Event mit fantastischer Stimmung.' 
            : 'Professionelle Live-Musik für unvergessliche Momente bei Hochzeiten, Geburtstagen & Firmenevents.');

        const bandName = item.name || item.title || '';

        return `
            <div class="market-tile-card" style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm);">
                
                <!-- 1. Combined Galerie: 3 Fotos + 3 Videos direkt folgend (FÜLLT DIE KACHEL IN DER BREITE 100% AUS) -->
                <div class="tile-fullwidth-photo-slider" style="position: relative; width: 100%; height: 235px; background: #0f172a; overflow: hidden;">
                    ${item.matchScore >= 70 ? `
                        <span style="position: absolute; top: 12px; left: 12px; background: rgba(15, 23, 42, 0.85); color: #eab308; font-weight: 800; padding: 0.35rem 0.45rem; border-radius: 6px; border: 1px solid rgba(234, 179, 8, 0.4); backdrop-filter: blur(4px); z-index: 10; display: flex; align-items: center; justify-content: center; pointer-events: none; text-shadow: 0 1px 3px rgba(0,0,0,0.6); box-shadow: 0 2px 8px rgba(0,0,0,0.25);">
                            <i class="fa-solid fa-star" style="font-size: 1.15rem; margin: 0;"></i>
                        </span>
                    ` : ''}
                    <div id="combo-slider-${item.id}" data-idx="0" style="display: flex; width: 100%; height: 100%; transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);">
                        
                        <!-- Slides 1-3: Fotos -->
                        ${photos.map((img) => `
                            <div style="width: 100%; height: 100%; flex-shrink: 0; position: relative;">
                                <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        `).join('')}

                        <!-- Slides 4-6: Nativ abspielbare HTML5 Videos direkt im Anschluss an das 3. Foto -->
                        ${!isEvents ? videoSources.map((vid, vIdx) => `
                            <div style="width: 100%; height: 100%; flex-shrink: 0; position: relative; background: #000; display: flex; align-items: center; justify-content: center;">
                                <video controls preload="metadata" poster="${photos[vIdx % photos.length]}" style="width: 100%; height: 100%; object-fit: cover;">
                                    <source src="${vid.url}" type="video/mp4">
                                    Dein Browser unterstÜtzt dieses Video nicht.
                                </video>
                                <span style="position: absolute; top: 12px; left: 12px; z-index: 4; font-size: 0.72rem; font-weight: 800; color: #fff; background: rgba(239, 68, 68, 0.9); padding: 0.25rem 0.65rem; border-radius: 6px; backdrop-filter: blur(4px);">
                                    🎬 Video #${vIdx + 1}: ${vid.title}
                                </span>
                            </div>
                        `).join('') : ''}

                        <!-- Last Slide: Beschreibung (schwarz mit weisser Schrift) -->
                        <div style="width: 100%; height: 100%; flex-shrink: 0; position: relative; background: #0f172a; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 0.3rem 4.2rem 0.5rem; box-sizing: border-box; text-align: center;">
                            <p style="font-size: 0.84rem; font-weight: 500; color: #f8fafc; line-height: 1.5; margin: 0; max-height: 145px; overflow-y: auto; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
                                ${description}
                            </p>
                        </div>
                    </div>

                    <!-- Match-Faktor Badge oben rechts (OHNE FLAMMEN-EMOJI / VORZEICHEN) -->
                    <div style="position: absolute; top: 12px; right: 12px; z-index: 5; background: ${isEvents ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' : 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)'}; color: #fff; padding: 0.35rem 0.45rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.25); box-shadow: 0 5px 12px rgba(0,0,0,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.1; min-width: 50px;">
                        <span style="font-size: 1.05rem; font-weight: 900;">${item.matchScore !== undefined ? item.matchScore : '96'}%</span>
                        <span style="font-size: 0.5rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; opacity: 0.95; margin-top: 1px;">Match</span>
                    </div>

                    <!-- Slide Navigation Arrows -->
                    <button onclick="event.stopPropagation(); window.slideComboGallery('${item.id}', -1)" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.68); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; backdrop-filter: blur(4px);">
                        <i class="fa-solid fa-chevron-left" style="font-size: 0.9rem;"></i>
                    </button>
                    <button onclick="event.stopPropagation(); window.slideComboGallery('${item.id}', 1)" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.68); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; backdrop-filter: blur(4px);">
                        <i class="fa-solid fa-chevron-right" style="font-size: 0.9rem;"></i>
                    </button>
                </div>

                <!-- Tile Body Content -->
                <div class="tile-body-content" style="padding: 1.2rem 1.3rem 0.8rem; flex: 1; display: flex; flex-direction: column;">
                    
                    <!-- Band/Event Name unter dem Bild (Fett gedruckt) + Favorit Herz -->
                    <div style="margin-bottom: 0.8rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
                        <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0; line-height: 1.2; flex: 1;">
                            ${bandName}
                        </h3>
                        <button onclick="event.stopPropagation(); window.toggleFavorite('${item.id}')" style="background: none; border: none; padding: 0.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; outline: none;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Zu Favoriten hinzufügen/entfernen">
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

                    <!-- 2. Einspaltige Informationen mit Icons (Reihenfolge nach Benutzer-Anforderungen) -->
                    <div class="tile-info-list" style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.88rem; color: var(--text-main); margin-bottom: 0.75rem;">
                        <!-- 1. Ort -->
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-location-dot" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${item.location || 'Deutschlandweit'}</span>
                        </div>
                        
                        ${isEvents ? `
                        <!-- 2. Event-Art (Event-Typ) -->
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-calendar-check" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${item.type || item.eventType || 'Event'}</span>
                        </div>
                        <!-- 3. Datum -->
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-calendar-days" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${dateDisplay}</span>
                        </div>
                        ` : `
                        <!-- 2. Musiker-Typ -->
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-guitar" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${item.type || item.category || 'Solo / Band'}</span>
                        </div>
                        <!-- 3. Verfügbarkeit -->
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-calendar-days" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${dateDisplay}</span>
                        </div>
                        `}

                        <!-- 4. Genres -->
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-music" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${genresList}</span>
                        </div>
                        <!-- 5. Instrumente -->
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-sliders" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${instrumentsList}</span>
                        </div>

                        <!-- 6. Spieldauer -->
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-clock" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${durationDisplay}</span>
                        </div>
                        <!-- 7. Budget / Gage -->
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-sack-dollar" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${budgetDisplay}</span>
                        </div>
                        
                        <!-- 8. Technik -->
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-microchip" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${(item.technik && item.technik.length > 0) ? (Array.isArray(item.technik) ? item.technik.join(', ') : item.technik) : 'Technik ist noch unklar'}</span>
                        </div>
                    </div>
                </div>

                ${isUnlocked ? `
                    <!-- Solid Colored Unlocked Contact Footer Box -->
                    <div style="border-top: 1px solid rgba(255, 255, 255, 0.15); padding: 1rem 1.3rem; background: ${themeColor}; color: #ffffff; display: flex; flex-direction: column; gap: 0.8rem; border-radius: 0 0 18px 18px;">
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
                        <div id="contact-reveal-${item.id}" style="display: none; text-align: center; font-size: 0.82rem; padding: 0.55rem; background: rgba(255,255,255,0.15); border-radius: 8px; animation: fadeIn 0.2s; word-break: break-all;"></div>
                    </div>
                ` : `
                    <!-- 4. Aktions-Button: "Kontaktdaten freischalten" -->
                    <div class="tile-action-container" style="padding: 0 1.3rem 1.1rem;">
                        <button class="btn btn-primary" onclick="event.stopPropagation(); showModal('auth')" style="width: 100%; background: ${btnGradient}; border-color: ${btnBorderColor}; font-weight: 800; padding: 0.8rem; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 0.6rem; font-size: 0.88rem; box-shadow: ${btnBoxShadow};">
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
};

window.initCarouselTouch = function(type) {
    const track = document.getElementById(`carousel-track-${type}`);
    if (!track) return;
    let startX = 0;
    let isSwiping = false;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
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

function validateAndProcessPhoto(file, callback) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        showToast({
            title: "Fehler beim Bildupload ❌",
            message: "Ungültiges Dateiformat. Erlaubt sind JPG, JPEG, PNG, GIF und WEBP."
        });
        return;
    }

    if (file.size > maxSize) {
        showToast({
            title: "Fehler beim Bildupload ❌",
            message: "Die Datei ist zu groß. Maximale Größe ist 5 MB (deine Datei: " + (file.size / (1024 * 1024)).toFixed(2) + " MB)."
        });
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 300;
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
            callback(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function validateAndProcessVideo(file, callback) {
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/ogg', 'video/x-matroska'];
    const maxSize = 20 * 1024 * 1024; // 20 MB

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp4|mov|webm|ogg|mkv)$/i)) {
        showToast({
            title: "Fehler beim Videoupload ❌",
            message: "Ungültiges Dateiformat. Erlaubt sind MP4, MOV, WebM und OGG."
        });
        return;
    }

    if (file.size > maxSize) {
        showToast({
            title: "Fehler beim Videoupload ❌",
            message: "Die Datei ist zu groß. Maximale Größe ist 20 MB (deine Datei: " + (file.size / (1024 * 1024)).toFixed(2) + " MB)."
        });
        return;
    }

    const mockVids = ['hochzeit.mp4', 'gartenparty.mp4', 'firmenfeier.mp4', 'konzert.mp4'];
    const randomMockVid = mockVids[Math.floor(Math.random() * mockVids.length)];
    showToast({
        title: "Video validiert ✅",
        message: "Das Video (" + file.name + ") wurde erfolgreich validiert und verknüpft."
    });
    callback(randomMockVid);
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
                        <span style="display: inline-flex; align-items: center; gap: 0.3rem;">📷 Bilder (${photos.length}/3) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.8rem;" title="Erlaubte Formate: JPG, JPEG, PNG, GIF, WEBP&#10;Maximale Größe: 5 MB"></i></span>
                        ${photos.length < 3 ? `
                            <button id="btn-add-mock-photo" class="btn btn-sm btn-glass" style="margin:0; padding: 0.25rem 0.5rem; font-size: 0.72rem; border-color: rgba(34, 197, 94, 0.3); color: #22c55e; display: flex; align-items: center; gap: 0.25rem;">
                                <i class="fa-solid fa-plus"></i> Hinzufügen
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
                        <span style="display: inline-flex; align-items: center; gap: 0.3rem;">🎬 Video (${videos.length}/1) <i class="fa-solid fa-circle-info" style="cursor: pointer; color: var(--text-muted); font-size: 0.8rem;" title="Erlaubte Formate: MP4, MOV, WebM, OGG, MKV&#10;Maximale Größe: 20 MB"></i></span>
                        ${videos.length < 1 ? `
                            <button id="btn-add-mock-video" class="btn btn-sm btn-glass" style="margin:0; padding: 0.25rem 0.5rem; font-size: 0.72rem; border-color: rgba(124, 58, 237, 0.3); color: #a855f7; display: flex; align-items: center; gap: 0.25rem;">
                                <i class="fa-solid fa-plus"></i> Hinzufügen
                            </button>
                        ` : ''}
                    </h4>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${videos.length === 0 ? `
                            <span style="font-size: 0.78rem; color: var(--text-muted); font-style: italic;">Keine Videos hochgeladen</span>
                        ` : videos.map((v, idx) => `
                            <div style="position: relative; width: 80px; height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-glass); background: #000; display:flex; align-items:center; justify-content:center;">
                                <i class="fa-solid fa-file-video" style="color: #a855f7; font-size: 1.5rem;"></i>
                                <button class="btn-delete-video" data-idx="${idx}" style="position: absolute; top: 2px; right: 2px; background: rgba(239, 68, 68, 0.85); border: none; color: #fff; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.6rem;"><i class="fa-solid fa-times"></i></button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div style="padding: 1rem; border-top: 1px solid var(--border-glass); display: flex; justify-content: flex-end; gap: 0.5rem; background: rgba(255,255,255,0.01);">
                <button id="btn-cancel-media" class="btn btn-glass btn-sm" style="margin:0;">Abbrechen</button>
                <button id="btn-save-media" class="btn btn-primary btn-sm" style="margin:0;">Speichern</button>
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
            if (photos.length >= 3) {
                showToast({
                    title: "Bilder-Limit erreicht 📷",
                    message: "Es sind maximal 3 Bilder erlaubt."
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
            if (videos.length >= 1) {
                showToast({
                    title: "Video-Limit erreicht 🎬",
                    message: "Es ist maximal 1 Video erlaubt."
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
                        videos.push(videoUrl);
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

    document.getElementById('btn-save-media').addEventListener('click', () => {
        item.photos = photos;
        if (photos.length > 0) {
            item.profilePic = photos[0];
            item.image = photos[0];
        }
        item.videos = videos;

        if (isEvents) {
            localStorage.setItem('GigConnAct_events', JSON.stringify(state.events));
        } else {
            localStorage.setItem('GigConnAct_musicians', JSON.stringify(state.musicians));
        }

        showToast({
            title: "Medien aktualisiert 📸",
            message: "Deine Fotos und Videos wurden erfolgreich gespeichert."
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