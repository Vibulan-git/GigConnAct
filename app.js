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
        location: "München",
        radius: 100, // in km
        genres: ["Pop", "Electro", "Rock"],
        instruments: ["Gesang", "Synthesizer", "E-Gitarre", "Schlagzeug"],
        maxDuration: 4, // in hours
        minBudget: 800, // EUR
        eventTypes: ["Club", "Festival", "Corporate", "Wedding"],
        availability: ["Friday", "Saturday"],
        description: "Wir bringen jeden Club zum Kochen! Mit unserem einzigartigen Elektro-Pop Sound und Covers der 80er, 90er und heutigen Charts im neuen Gewand. Perfekt für Partys, Firmenevents und Festivals.",
        contactName: "Maximilian Schmidt",
        phone: "+49 176 12345678",
        email: "contact@neonbeats.de",
        isPremium: false,
        credits: 50,
        socialLinks: {
            spotify: "https://spotify.com/artist/neonbeats",
            youtube: "https://youtube.com/c/neonbeats",
            instagram: "https://instagram.com/neonbeats"
        },
        photos: ["https://picsum.photos/id/453/400/300", "https://picsum.photos/id/280/400/300"],
        videos: [],
        audio: [],
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
        location: "Stuttgart",
        radius: 50,
        genres: ["Klassik", "Pop", "Jazz"],
        instruments: ["Klavier", "Keyboard"],
        maxDuration: 2.5,
        minBudget: 300,
        eventTypes: ["Wedding", "Corporate", "Birthday"],
        availability: ["Saturday", "Sunday"],
        description: "Elegante Hintergrundmusik am Klavier für Ihre Trauung, den Sektempfang oder ein festliches Dinner. Ich spiele sowohl klassische Meisterwerke als auch moderne Pop-Balladen im sanften Klavier-Arrangement.",
        contactName: "Clara Weber",
        phone: "+49 152 98765432",
        email: "clara.piano@gmx.de",
        isPremium: false,
        socialLinks: {
            spotify: "",
            youtube: "https://youtube.com/c/clarapiano",
            instagram: "https://instagram.com/clara_lichtblick"
        },
        photos: ["https://picsum.photos/id/1082/400/300"],
        videos: [],
        audio: []
    },
    {
        id: "mus_3",
        name: "DJ Soundwave",
        bluffName: "Professional Club & Event DJ",
        type: "DJ",
        location: "Nürnberg",
        radius: 150,
        genres: ["Electro", "HipHop", "Charts", "Pop"],
        instruments: ["Turntables", "Mischpult"],
        maxDuration: 8,
        minBudget: 500,
        eventTypes: ["Club", "Corporate", "Wedding", "Birthday"],
        availability: ["Friday", "Saturday", "Sunday"],
        description: "Seit 10 Jahren als DJ auf Hochzeiten, Firmenfeiern und in Clubs unterwegs. Professionelles Licht- und Tonsystem bringe ich auf Wunsch mit. Individuelle Playlist-Absprachen sind selbstverständlich.",
        contactName: "Andreas Richter",
        phone: "+49 171 55566677",
        email: "dj.soundwave@web.de",
        isPremium: true,
        socialLinks: {
            spotify: "https://spotify.com/artist/djsoundwave",
            youtube: "",
            instagram: "https://instagram.com/dj_soundwave"
        },
        photos: ["https://picsum.photos/id/342/400/300"],
        videos: [],
        audio: []
    },
    {
        id: "mus_4",
        name: "Acoustic Duo Breeze",
        bluffName: "Charmantes Akustik-Duo",
        type: "Duo",
        location: "Augsburg",
        radius: 80,
        genres: ["Pop", "Jazz", "Folk"],
        instruments: ["Akustikgitarre", "Gesang", "Cajon"],
        maxDuration: 3,
        minBudget: 450,
        eventTypes: ["Wedding", "Corporate", "Birthday", "Festival"],
        availability: ["Saturday", "Sunday", "Thursday"],
        description: "Zweistimmiger Gesang, feine Akustikgitarren-Klänge und sanfte Rhythmen. Wir bieten den perfekten Soundtrack für chillige Sommerevents, Gartenpartys oder romantische Trauungen.",
        contactName: "Sarah & Ben",
        phone: "+49 160 88877799",
        email: "acoustic.breeze@outlook.de",
        isPremium: true,
        socialLinks: {
            spotify: "",
            youtube: "https://youtube.com/c/acousticbreeze",
            instagram: "https://instagram.com/acoustic_breeze"
        },
        photos: ["https://picsum.photos/id/325/400/300"],
        videos: [],
        audio: []
    },
    {
        id: "mus_5",
        name: "Blackwood Syndicate",
        bluffName: "Klassische Rock & Hard Rock Coverband",
        type: "Band",
        location: "Stuttgart",
        radius: 120,
        genres: ["Rock", "Metal", "Blues"],
        instruments: ["Gesang", "E-Gitarre", "Bass", "Schlagzeug"],
        maxDuration: 5,
        minBudget: 900,
        eventTypes: ["Club", "Festival", "Corporate"],
        availability: ["Friday", "Saturday"],
        description: "Echte Rock-Klassiker und harte Riffs von AC/DC bis Led Zeppelin. Wir spielen 100% live, energetisch und laut. Die perfekte Band, um die Hütte zum Rocken zu bringen!",
        contactName: "Thorsten Müller",
        phone: "+49 170 44433322",
        email: "info@blackwood-rock.de",
        isPremium: true,
        socialLinks: {
            spotify: "https://spotify.com/artist/blackwood",
            youtube: "https://youtube.com/c/blackwood",
            instagram: "https://instagram.com/blackwood_rock"
        },
        photos: ["https://picsum.photos/id/109/400/300"],
        videos: [],
        audio: []
    },
    {
        id: "mus_6",
        name: "Sax & Soul (Leo Berg)",
        bluffName: "Premium Jazz-Saxophonist",
        type: "Solo",
        location: "München",
        radius: 75,
        genres: ["Jazz", "Blues", "Pop"],
        instruments: ["Saxophon", "Gesang"],
        maxDuration: 3,
        minBudget: 250,
        eventTypes: ["Gartenparty", "Corporate", "Wedding", "Dinner"],
        availability: ["Saturday", "Sunday", "Wednesday"],
        description: "Sinnliche Saxophonklänge und samtige Vocals. Begleitung beim Sektempfang, Dinnermusik oder als Live-Highlight zu Lounge-Beats. Professionelle Playbacks runden das Klangbild ab.",
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
        videos: [],
        audio: []
    },
    {
        id: "mus_zero",
        name: "Leo Null",
        bluffName: "Gitarrist & Sänger (0 Credits Demo)",
        type: "Solo",
        location: "Berlin",
        radius: 100,
        genres: ["Pop", "Rock"],
        instruments: ["Gitarre", "Gesang"],
        maxDuration: 3,
        minBudget: 200,
        eventTypes: ["Birthday", "Wedding"],
        availability: ["Saturday", "Sunday"],
        description: "Demo-Musiker-Account mit 0 Credits zum Testen des Bezahlfensters.",
        contactName: "Leo Null",
        phone: "+49 170 00000000",
        email: "zero@musician.de",
        isPremium: false,
        credits: 0,
        socialLinks: { spotify: "", youtube: "", instagram: "" },
        photos: ["https://picsum.photos/id/111/400/300"],
        videos: [],
        audio: []
    },
    {
        id: "mus_five",
        name: "Fynn Fünf",
        bluffName: "Singer-Songwriter (5 Credits Demo)",
        type: "Solo",
        location: "Hamburg",
        radius: 100,
        genres: ["Folk", "Pop"],
        instruments: ["Akustikgitarre", "Gesang"],
        maxDuration: 4,
        minBudget: 300,
        eventTypes: ["Corporate", "Birthday"],
        availability: ["Friday", "Saturday"],
        description: "Demo-Musiker-Account mit 5 Credits zum Testen der Einzelfreischaltung.",
        contactName: "Fynn Fünf",
        phone: "+49 175 55555555",
        email: "five@musician.de",
        isPremium: false,
        credits: 5,
        socialLinks: { spotify: "", youtube: "", instagram: "" },
        photos: ["https://picsum.photos/id/280/400/300"],
        videos: [],
        audio: []
    }
];

const initialEvents = [
    {
        id: "evt_1",
        name: "Traumhochzeit am See",
        type: "Wedding",
        date: "2026-08-15",
        location: "Stuttgart",
        genres: ["Pop", "Klassik"],
        instruments: ["Klavier", "Gesang"],
        duration: 2,
        budget: 400,
        musicianTypes: ["Solo", "Duo"],
        description: "Für unsere kirchliche Trauung und den anschließenden Sektempfang direkt am See suchen wir eine gefühlvolle musikalische Untermalung (Klavier & Gesang). Gewünscht sind ca. 3 Lieder während der Zeremonie und 1.5 Stunden Hintergrundmusik beim Empfang.",
        contactName: "Julia & Michael",
        phone: "+49 173 11122233",
        email: "julia.michael.wedding2026@gmail.com",
        isOnline: true,
        creatorId: "org_1"
    },
    {
        id: "evt_2",
        name: "Sommerfestival Stadtstrand",
        type: "Festival",
        date: "2026-09-05",
        location: "München",
        genres: ["Electro", "Pop"],
        instruments: ["Synthesizer", "Turntables", "Gesang"],
        duration: 4,
        budget: 1200,
        musicianTypes: ["Band", "DJ"],
        description: "Großes Sommer-Event am Stadtstrand! Wir suchen eine energiegeladene Live-Band oder einen DJ, der für fette Beats und Sommerstimmung sorgt. PA-Anlage und Bühne sind vorhanden. Verpflegung wird gestellt.",
        contactName: "Eventagentur SommerSonne",
        phone: "+49 89 9876540",
        email: "info@sommersonne-events.de",
        isOnline: true,
        creatorId: "org_2"
    },
    {
        id: "evt_3",
        name: "Firmenjubiläum TechCorp",
        type: "Corporate",
        date: "2026-10-20",
        location: "Nürnberg",
        genres: ["Jazz", "Pop", "Rock"],
        instruments: ["Schlagzeug", "E-Gitarre", "Bass", "Saxophon"],
        duration: 3,
        budget: 950,
        musicianTypes: ["Band", "Duo"],
        description: "Wir feiern unser 10-jähriges Bestehen und suchen eine Band für den Abend. Zuerst gediegener Jazz zum Dinner, danach Pop/Rock-Klassiker zum Tanzen. Licht/Ton muss mitgebracht werden.",
        contactName: "Sandra Meier (TechCorp HR)",
        phone: "+49 911 445566",
        email: "s.meier@techcorp.de",
        isOnline: true,
        creatorId: "org_3"
    },
    {
        id: "evt_4",
        name: "Electronic Beach Party",
        type: "Club",
        date: "2026-09-12",
        location: "Augsburg",
        genres: ["Electro"],
        instruments: ["Turntables", "Mischpult"],
        duration: 4,
        budget: 700,
        musicianTypes: ["DJ"],
        description: "Wir veranstalten unser alljährliches Open Air am See und suchen einen professionellen Club-DJ für fette EDM, House & Techno-Beats. Sound- & Lichtanlage sind komplett vorhanden.",
        contactName: "Club Seeufer Augsburg",
        phone: "+49 821 555666",
        email: "booking@seeufer-augsburg.de",
        isOnline: true,
        creatorId: "org_4"
    },
    {
        id: "evt_5",
        name: "50. Geburtstag im Gewölbekeller",
        type: "Birthday",
        date: "2026-09-26",
        location: "Stuttgart",
        genres: ["Rock", "Pop", "Schlager"],
        instruments: ["E-Gitarre", "Gesang", "Keyboard"],
        duration: 5,
        budget: 500,
        musicianTypes: ["Duo", "Solo", "Band"],
        description: "Zu meinem 50. Geburtstag suche ich ein Akustik-Duo oder einen Solo-Musiker, der alte Rock- und Popklassiker spielt und für gute Laune im Kellergewölbe sorgt. Platz ist begrenzt, Strom vorhanden.",
        contactName: "Thomas Wagner",
        phone: "+49 172 77766655",
        email: "thomas.wagner50@web.de",
        isOnline: true,
        creatorId: "org_5"
    }
];

const genresList = ["Pop", "Rock", "Electro", "Jazz", "Klassik", "Folk", "HipHop", "Metal", "Schlager", "Country", "Blues"];
const instrumentsList = ["Gesang", "Klavier", "Keyboard", "Synthesizer", "Turntables", "Akustikgitarre", "E-Gitarre", "Bass", "Schlagzeug", "Cajon", "Saxophon", "Violine", "Flöte"];
const eventTypesList = ["Wedding", "Corporate", "Concert", "Birthday", "Club", "Festival", "Gartenparty", "Dinner"];
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
    const locationsPool = ["München", "Augsburg", "Nürnberg", "Stuttgart"];
    const typesPool = ["Band", "Solo", "DJ", "Duo"];
    const daysPool = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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

        const minBudget = Math.floor(Math.random() * 10) * 100 + 200;
        const maxDuration = Math.floor(Math.random() * 3) + 2;

        musicians.push({
            id: `mus_gen_${i}`,
            name,
            bluffName,
            type,
            location,
            radius: Math.floor(Math.random() * 3) * 50 + 50,
            genres,
            instruments,
            maxDuration,
            minBudget,
            eventTypes: ["Wedding", "Corporate", "Birthday", "Club"].slice(0, Math.floor(Math.random() * 3) + 1),
            availability,
            description: `Hallo, wir sind ${name}! Mit viel Herzblut und Leidenschaft spielen wir ${genres.join(" & ")} für Ihre Veranstaltung in ${location} und Umgebung. Kontaktieren Sie uns gerne!`,
            contactName,
            phone: `+49 176 ${Math.floor(10000000 + Math.random() * 90000000)}`,
            email: `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`,
            isPremium: Math.random() > 0.5,
            socialLinks: { spotify: "", youtube: "", instagram: "" },
            photos: [],
            videos: [],
            audio: [],
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
    const locationsPool = ["München", "Augsburg", "Nürnberg", "Stuttgart"];
    const eventTypesPool = ["Wedding", "Corporate", "Festival", "Club", "Birthday", "Sommerfest"];
    const eventAdjectives = ["Große", "Gemütliche", "Exklusive", "Traditionelle", "Stimmungsvolle", "Moderne"];
    const genresPool = ["Pop", "Rock", "Electro", "Jazz", "Klassik", "Schlager"];
    const instrumentsPool = ["E-Gitarre", "Akustikgitarre", "Klavier", "Keyboard", "Schlagzeug", "Gesang"];
    const musicianTypesPool = ["Band", "DJ", "Solo", "Duo"];

    for (let i = existing.length; i < targetCount; i++) {
        const location = locationsPool[Math.floor(Math.random() * locationsPool.length)];
        const eventType = eventTypesPool[Math.floor(Math.random() * eventTypesPool.length)];
        const contactName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        
        let eventName = "";
        if (eventType === "Wedding") {
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

        const budget = Math.floor(Math.random() * 12) * 100 + 300;
        const duration = Math.floor(Math.random() * 3) + 2;
        
        const futureDays = Math.floor(Math.random() * 180) + 10;
        const date = new Date(Date.now() + futureDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        events.push({
            id: `evt_gen_${i}`,
            name: eventName,
            type: eventType,
            date,
            location,
            genres,
            instruments,
            duration,
            budget,
            musicianTypes: [musicianTypesPool[Math.floor(Math.random() * musicianTypesPool.length)]],
            description: `Für unsere Veranstaltung '${eventName}' suchen wir einen passenden Live-Act. Wir freuen uns auf eure Bewerbung!`,
            contactName,
            phone: `+49 176 ${Math.floor(10000000 + Math.random() * 90000000)}`,
            email: `event_${i}@example.com`,
            isOnline: true,
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
        
        // Temporary cleanup for test emails
        try {
            const emailsToRemove = ['vibulan22@gmail.de', 'vibulan22@gmail.com', 'vanessa@hotmailx.com', 'vanessa@hotmail.com'];
            
            const regKey = 'GigConnAct_registered_users';
            let users = JSON.parse(localStorage.getItem(regKey) || '[]');
            users = users.filter(u => u.email && !emailsToRemove.includes(u.email.toLowerCase()));
            localStorage.setItem(regKey, JSON.stringify(users));

            const musKey = 'GigConnAct_musicians';
            let musicians = JSON.parse(localStorage.getItem(musKey) || '[]');
            musicians = musicians.filter(m => m.email && !emailsToRemove.includes(m.email.toLowerCase()));
            localStorage.setItem(musKey, JSON.stringify(musicians));

            const pendingKey = 'GigConnAct_pending_user';
            let pending = localStorage.getItem(pendingKey);
            if (pending) {
                const pUser = JSON.parse(pending);
                if (pUser.email && emailsToRemove.includes(pUser.email.toLowerCase())) {
                    localStorage.removeItem(pendingKey);
                }
            }

            const userKey = 'GigConnAct_current_user';
            let currentUser = localStorage.getItem(userKey);
            if (currentUser) {
                const u = JSON.parse(currentUser);
                if (u.email && emailsToRemove.includes(u.email.toLowerCase())) {
                    localStorage.removeItem(userKey);
                }
            }
        } catch(e) {
            console.error("Cleanup error for test emails", e);
        }

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
            let base = (Array.isArray(parsed) && parsed.length > 0) ? parsed : [...initialMusicians];
            initialMusicians.forEach(init => {
                if (!base.some(m => m.id === init.id)) {
                    base.push(init);
                }
            });
            this.musicians = generateRemainingMusicians(base);
        } catch (e) {
            this.musicians = generateRemainingMusicians(initialMusicians);
        }

        try {
            const storedEvents = localStorage.getItem('GigConnAct_events');
            const parsed = storedEvents ? JSON.parse(storedEvents) : [];
            let base = (Array.isArray(parsed) && parsed.length > 0) ? parsed : [...initialEvents];
            initialEvents.forEach(init => {
                if (!base.some(e => e.id === init.id)) {
                    base.push(init);
                }
            });
            this.events = generateRemainingEvents(base);
        } catch (e) {
            this.events = generateRemainingEvents(initialEvents);
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

        // Ensure all entities have a createdAt timestamp for sorting and correct creatorId mapping
        let registeredUsers = [];
        try {
            registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
        } catch (e) {}

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
                bluffName: "Acoustic Pop-Sänger & Gitarrist",
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
        const techOptions = ["vorhanden", "nicht vorhanden", "Weiß ich noch nicht"];
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
            if (!e.company) {
                const user = registeredUsers.find(u => u.id === e.creatorId || u.profileId === e.id);
                e.company = user ? (user.company || "Privatperson") : "Privatperson";
            }
            if (!e.technik) {
                e.technik = techOptions[Math.floor(Math.random() * techOptions.length)];
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
        }

        this.saveState();
    }

    saveState() {
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
                    { senderId: "org_1", text: "Hallo! Wir finden euren Sound absolut genial. Hättet ihr Zeit, bei unserer Hochzeit zu spielen?", timestamp: "2026-07-12T14:30:00Z" },
                    { senderId: "mus_1", text: "Hallo Julia! Vielen Dank für die Anfrage. Der 15. August 2026 passt uns super. Welche Art von Songs wünscht ihr euch?", timestamp: "2026-07-12T15:15:00Z" },
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
                firstName: musician.contactName.split(" ")[0] || "Musiker",
                lastName: musician.contactName.split(" ")[1] || "",
                company: "Privatperson",
                phone: musician.phone,
                email: musician.email,
                isPremium: musician.isPremium,
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
                firstName: event.contactName.split(" ")[0] || "Veranstalter",
                lastName: event.contactName.split(" ")[1] || "",
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
            this.currentUser = {
                id: registered.id,
                role: registered.role,
                firstName: registered.firstName,
                lastName: registered.lastName,
                company: registered.company || "Privatperson",
                phone: registered.phone,
                email: registered.email,
                isPremium: registered.role === "musician" ? registered.isPremium : true,
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

    logout() {
        this.currentUser = null;
        this.notify();
    }

    hasContactAccess(activeId, targetId) {
        if (!this.currentUser) return false;
        if (this.currentUser.role === 'organizer') return true;
        if (this.currentUser.isPremium) return true;
        if (this.currentUser.id === targetId || this.currentUser.profileId === targetId) return true;
        
        const unlocked = this.currentUser.unlockedContacts || [];
        return unlocked.includes(targetId);
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
            phone: payload.phone,
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
            phone: user.phone,
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
                location: data.location,
                radius: parseInt(data.radius) || 50,
                genres: data.genres,
                instruments: data.instruments,
                maxDuration: parseFloat(data.maxDuration) || 3,
                minBudget: parseFloat(data.minBudget) || 300,
                eventTypes: data.eventTypes,
                availability: data.availability,
                description: data.description,
                technik: data.technik || "Weiß ich noch nicht",
                company: user.company || "Privatperson",
                contactName: `${user.firstName} ${user.lastName}`,
                phone: user.phone,
                email: user.email,
                isPremium: user.isPremium,
                credits: 5,
                unlockedContacts: [],
                socialLinks: { spotify: "", youtube: "", instagram: "" },
                photos: [],
                videos: [],
                audio: [],
                creatorId: user.id
            };
            this.musicians.push(newMusician);
        } else if (user.role === "organizer") {
            const data = user.rawData;
            const newEvent = {
                id: user.profileId,
                name: data.eventName,
                type: data.eventType,
                date: data.eventDate,
                location: data.location,
                genres: data.genres,
                instruments: data.instruments,
                duration: parseFloat(data.duration) || 2,
                budget: parseFloat(data.budget) || 500,
                musicianTypes: data.musicianTypes,
                description: data.description,
                technik: data.technik || "Weiß ich noch nicht",
                company: user.company || "Privatperson",
                contactName: `${user.firstName} ${user.lastName}`,
                phone: user.phone,
                email: user.email,
                isOnline: true,
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
            phone: user.phone,
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
        const profileId = this.currentUser ? this.currentUser.profileId : "";
        const uId = this.currentUser ? this.currentUser.id : "";
        
        return this.chats.filter(c => 
            c.participants.includes(uId) || 
            c.participants.includes(profileId) ||
            (this.currentUser?.role === "musician" && c.participants.includes(profileId))
        ).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    sendMessage(recipientId, text) {
        if (!this.currentUser) return { success: false, message: "Bitte melde dich an." };
        const senderId = this.currentUser.role === 'musician' ? this.currentUser.profileId : this.currentUser.id;
        
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
        
        this.notify();
        return { success: true, chat };
    }

    initiateContact(targetId, targetName) {
        if (!this.currentUser) return { success: false, redirectAuth: true };
        
        const welcomeText = `Hallo! Ich habe dein Profil auf GigConnAct gefunden und interessiere mich für eine Zusammenarbeit. Lass uns hier schreiben!`;
        this.sendMessage(targetId, welcomeText);
        
        this.currentUser.contactRequests = (this.currentUser.contactRequests || 0) + 1;
        this.notify();

        return { success: true, chatId: this.chats.find(c => c.participants.includes(targetId))?.id };
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
        const myId = this.currentUser.role === 'musician' ? this.currentUser.profileId : this.currentUser.id;
        const userChats = this.getChatsForUser(this.currentUser.id);
        
        return userChats.filter(c => {
            if (this.readChats.includes(c.id)) return false;
            if (c.messages.length === 0) return false;
            const lastMsg = c.messages[c.messages.length - 1];
            return lastMsg.senderId !== myId;
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
        this.currentUser.phone = updatedData.phone;
        this.currentUser.email = updatedData.email;
        
        // Update user storage
        const registeredUsers = JSON.parse(localStorage.getItem('GigConnAct_registered_users') || '[]');
        const index = registeredUsers.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) {
            registeredUsers[index].firstName = this.currentUser.firstName;
            registeredUsers[index].lastName = this.currentUser.lastName;
            registeredUsers[index].company = this.currentUser.company;
            registeredUsers[index].phone = this.currentUser.phone;
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
                m.email = this.currentUser.email;
            }
        });
        this.events.forEach(e => {
            if (e.creatorId === this.currentUser.id) {
                e.company = this.currentUser.company;
                e.contactName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
                e.phone = this.currentUser.phone;
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
        } else if (type === "video" && musician.videos.length < 3) {
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

const state = new StateManager();

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

function calculateMatch(musician, event) {
    const breakdown = {
        type: false,
        date: false,
        location: false,
        radius: false,
        genres: false,
        instruments: false,
        duration: false,
        budget: false,
        technik: false
    };
 
    if (event.musicianTypes && event.musicianTypes.some(t => t.toLowerCase() === musician.type.toLowerCase())) {
        breakdown.type = true;
    }
 
    if (musician.availability) {
        if (Array.isArray(musician.availability)) {
            if (musician.availability.includes(event.date)) {
                breakdown.date = true;
            } else {
                const eventWeekday = getWeekdayFromDate(event.date);
                if (musician.availability.includes(eventWeekday)) {
                    breakdown.date = true;
                }
            }
        } else if (typeof musician.availability === 'object') {
            const isModified = musician.availability.modifiedDates && musician.availability.modifiedDates.includes(event.date);
            if (musician.availability.defaultState === 'all-selected') {
                breakdown.date = !isModified;
            } else {
                breakdown.date = isModified;
            }
        }
    }
 
    if (event.location.toLowerCase() === musician.location.toLowerCase()) {
        breakdown.location = true;
    }
 
    const distance = getEstimatedDistance(musician.location, event.location);
    if (distance <= musician.radius) {
        breakdown.radius = true;
    }
 
    if (event.genres && musician.genres && event.genres.some(g => musician.genres.includes(g))) {
        breakdown.genres = true;
    }
 
    if (event.instruments && musician.instruments && event.instruments.some(i => musician.instruments.includes(i))) {
        breakdown.instruments = true;
    }
 
    if (event.duration <= musician.maxDuration) {
        breakdown.duration = true;
    }
 
    if (event.budget >= musician.minBudget) {
        breakdown.budget = true;
    }
 
    let technikMatch = false;
    const evTech = (event.technik || "Weiß ich noch nicht").toLowerCase();
    const musTech = (musician.technik || "Weiß ich noch nicht").toLowerCase();
    if (evTech === "weiß ich noch nicht" || musTech === "weiß ich noch nicht") {
        technikMatch = true;
    } else if (evTech === "vorhanden") {
        technikMatch = true;
    } else if (evTech === "nicht vorhanden" && musTech === "vorhanden") {
        technikMatch = true;
    }
    breakdown.technik = technikMatch;
 
    const matchedCount = Object.values(breakdown).filter(v => v === true).length;
    const score = Math.round((matchedCount / Object.keys(breakdown).length) * 100);
 
    return { score, breakdown, matchedCount };
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
            const match = calculateMatch(musician, event);
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
                    
                    if (showToastCallback) {
                        showToastCallback({
                            title: `Neues passendes Event! (${match.score}%)`,
                            message: `'${event.name}' entspricht Ihren Filtern.`,
                            actionTab: "postbox"
                        });
                    }
                }
            }
        });
    } else if (userRole === "organizer") {
        const event = stateManager.events.find(e => e.creatorId === userId);
        if (!event) return;

        stateManager.musicians.forEach(musician => {
            const match = calculateMatch(musician, event);
            if (match.score > 49) {
                const chats = stateManager.getChatsForUser(userId);
                const hasSystemChat = chats.some(c => c.participants.includes("system") && c.participants.includes(userId));
                
                let alreadyNotified = false;
                if (hasSystemChat) {
                    const systemChat = chats.find(c => c.participants.includes("system") && c.participants.includes(userId));
                    alreadyNotified = systemChat.messages.some(m => m.text.includes(musician.name) || m.text.includes(musician.id));
                }

                if (!alreadyNotified) {
                    const messageText = `🚨 MUSIKER-MATCH ALERT (${match.score}% Übereinstimmung): Der Musiker/die Band '${musician.name}' passt optimal zu Ihrem Event '${event.name}'. (ID: ${musician.id})`;
                    stateManager.addSystemNotification(userId, messageText);

                    if (showToastCallback) {
                        showToastCallback({
                            title: `Passender Musiker gefunden! (${match.score}%)`,
                            message: `'${musician.name}' passt zu Ihrer Veranstaltung.`,
                            actionTab: "postbox"
                        });
                    }
                }
            }
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

function renderLandingPage(container, onNavigate) {
    const isMusicianTab = state.activeHeroTab === 'musician';
    
    container.innerHTML = `
        <!-- Full-Screen Hero Banner -->
        <section class="hero-section" style="position: relative; padding: 4rem 1.5rem 5rem; background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.8) 100%), url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat; min-height: 85vh; display: flex; align-items: center; justify-content: center;">
            <div style="max-width: 1250px; width: 100%; margin: 0 auto; text-align: center; position: relative; z-index: 2;">
                
                <!-- Main Catchy Title -->
                <h1 style="font-family: var(--font-heading); font-size: clamp(2.5rem, 5vw, 4.2rem); font-weight: 900; line-height: 1.15; color: #ffffff; margin-bottom: 1.2rem; letter-spacing: -1px;">
                    GigConnact <span style="background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Musiker-Markt</span>
                </h1>
                
                <!-- Subtitle -->
                <p style="font-size: clamp(1.1rem, 2vw, 1.4rem); color: rgba(255, 255, 255, 0.85); max-width: 780px; margin: 0 auto 2.5rem; line-height: 1.6;">
                    Direkte Vermittlung zwischen Musikern, Bands, DJs & Veranstaltern â€“ einfach, schnell & ohne VermittlungsgebÃ¼hren.
                </p>
                
                <!-- 2 Main Door Hero CTA Buttons with Large Left Icons spanning both lines -->
                <div style="display: flex; gap: 1.5rem; justify-content: center; align-items: center; flex-wrap: wrap; margin-bottom: 3.5rem;">
                    
                    <!-- Door Button 1: Musiker -->
                    <button class="btn btn-primary btn-hero-cta" onclick="navigate('musicians')" style="padding: 1.2rem 2.2rem; font-size: 1.1rem; border-radius: 14px; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); border: none; font-weight: 900; box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4); display: flex; align-items: center; gap: 1.2rem; text-align: left; cursor: pointer;">
                        <i class="fa-solid fa-guitar" style="font-size: 2.4rem; flex-shrink: 0; color: #ffffff;"></i>
                        <span style="line-height: 1.35; color: #ffffff;">
                            Ich bin Musiker<br>und suche Gigs
                        </span>
                    </button>
                    
                    <!-- Door Button 2: Veranstalter -->
                    <button class="btn btn-secondary btn-hero-cta" onclick="navigate('events')" style="padding: 1.2rem 2.2rem; font-size: 1.1rem; border-radius: 14px; background: rgba(255, 255, 255, 0.08); border: 2px solid rgba(255, 255, 255, 0.25); font-weight: 900; backdrop-filter: blur(10px); display: flex; align-items: center; gap: 1.2rem; text-align: left; cursor: pointer;">
                        <i class="fa-solid fa-calendar-check" style="font-size: 2.4rem; color: #38bdf8; flex-shrink: 0;"></i>
                        <span style="line-height: 1.35; color: #ffffff;">
                            Ich bin Veranstalter<br>und suche Acts
                        </span>
                    </button>
                </div>

                <!-- Interactive Benefits Tabs -->
                <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 20px; padding: 2.2rem; backdrop-filter: blur(16px); max-width: 950px; margin: 0 auto; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);">
                    <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem;">
                        <button id="hero-tab-musician" class="hero-tab-btn ${isMusicianTab ? 'active' : ''}" style="padding: 0.8rem 1.8rem; border-radius: 30px; font-weight: 800; font-size: 0.95rem; border: none; cursor: pointer; transition: all 0.25s ease; background: ${isMusicianTab ? '#7c3aed' : 'rgba(255,255,255,0.06)'}; color: #ffffff;">
                            <i class="fa-solid fa-guitar"></i> Vorteile fÃ¼r Musiker & Bands
                        </button>
                        <button id="hero-tab-organizer" class="hero-tab-btn ${!isMusicianTab ? 'active' : ''}" style="padding: 0.8rem 1.8rem; border-radius: 30px; font-weight: 800; font-size: 0.95rem; border: none; cursor: pointer; transition: all 0.25s ease; background: ${!isMusicianTab ? '#2563eb' : 'rgba(255,255,255,0.06)'}; color: #ffffff;">
                            <i class="fa-solid fa-calendar-check"></i> Vorteile fÃ¼r Veranstalter
                        </button>
                    </div>

                    <div id="hero-tab-content">
                        ${renderHeroTabContent(isMusicianTab)}
                    </div>
                </div>
            </div>
        </section>

        <!-- Preview Tiles Grid Section -->
        <section style="max-width: 1400px; margin: 0 auto; padding: 4rem 1.5rem 6rem;">
            <div style="text-align: center; margin-bottom: 3rem;">
                <h2 style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 900; color: var(--text-main); margin-bottom: 0.5rem;">
                    Neueste Highlights & Profile
                </h2>
                <p style="color: var(--text-muted); font-size: 1.05rem;">
                    Entdecke erstklassige Musiker und aktuelle Gig-Anfragen
                </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2rem;">
                ${renderMarketGridHTML(state.musicians.slice(0, 3), false)}
            </div>
        </section>
    `;

    // Tab Event Listeners
    const musicianTab = container.querySelector('#hero-tab-musician');
    const organizerTab = container.querySelector('#hero-tab-organizer');
    const tabContent = container.querySelector('#hero-tab-content');

    if (musicianTab && organizerTab && tabContent) {
        musicianTab.addEventListener('click', () => {
            state.activeHeroTab = 'musician';
            musicianTab.style.background = '#7c3aed';
            organizerTab.style.background = 'rgba(255,255,255,0.06)';
            tabContent.innerHTML = renderHeroTabContent(true);
        });

        organizerTab.addEventListener('click', () => {
            state.activeHeroTab = 'organizer';
            organizerTab.style.background = '#2563eb';
            musicianTab.style.background = 'rgba(255,255,255,0.06)';
            tabContent.innerHTML = renderHeroTabContent(false);
        });
    }
}

function getSelectOptions(list, selectedValues = []) {
    return list.map(item => `
        <option value="${item}" ${selectedValues.includes(item) ? 'selected' : ''}>${item}</option>
    `).join('');
}

function renderMatchDial(score) {
    let badgeColor = 'rgba(16, 185, 129, 0.1)';
    let textColor = '#10b981';
    
    if (score < 65) {
        badgeColor = 'rgba(124, 58, 237, 0.1)';
        textColor = '#7c3aed';
    } else if (score < 85) {
        badgeColor = 'rgba(124, 58, 237, 0.1)';
        textColor = '#7c3aed';
    }

    return `
        <div class="match-score-container" style="display:flex; flex-direction:column; align-items:center;">
            <div style="background: ${badgeColor}; color: ${textColor}; padding: 0.4rem 0.8rem; border-radius: 20px; font-weight: 700; font-size: 1rem; border: 1px solid ${textColor}30; text-align:center; min-width:80px;">
                ${score}% Match
            </div>
        </div>
    `;
}

const popularGermanCities = [
    "Berlin", "Hamburg", "München", "Köln", "Frankfurt am Main", "Stuttgart", "Düsseldorf", "Dortmund", "Essen", "Leipzig", "Bremen", "Dresden", "Hannover", "Nürnberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster", "Karlsruhe", "Mannheim", "Augsburg", "Wiesbaden", "Gelsenkirchen", "Mönchengladbach", "Braunschweig", "Chemnitz", "Aachen", "Kiel", "Halle (Saale)", "Magdeburg", "Freiburg im Breisgau", "Krefeld", "Lübeck", "Oberhausen", "Erfurt", "Mainz", "Rostock", "Kassel", "Hagen", "Hamm", "Saarbrücken", "Mülheim an der Ruhr", "Potsdam", "Ludwigshafen am Rhein", "Oldenburg", "Leverkusen", "Osnabrück", "Solingen", "Heidelberg", "Herne", "Neuss", "Darmstadt", "Paderborn", "Regensburg", "Ingolstadt", "Würzburg", "Fürth", "Wolfsburg", "Offenbach am Main", "Ulm", "Heilbronn", "Pforzheim", "Göttingen", "Bottrop", "Recklinghausen", "Reutlingen", "Koblenz", "Bergisch Gladbach", "Remscheid", "Bremerhaven", "Jena", "Trier", "Erlangen", "Moers", "Siegen", "Hildesheim", "Salzgitter", "Cottbus", "Kaiserslautern", "Witten", "Gütersloh", "Schwerin", "Gera", "Bad Homburg", "Marl", "Flensburg", "Lünen", "Villingen-Schwenningen", "Ratingen", "Neu-Isenburg", "Bad Salzuflen", "Tübingen", "Minden", "Worms", "Konstanz", "Wilhelmshaven", "Velbert", "Norderstedt", "Stein", "Castrop-Rauxel", "Delmenhorst", "Viersen", "Gladbeck", "Marburg", "Rheine", "Troisdorf", "Dorsten", "Lüneburg", "Detmold", "Bayreuth", "Arnsberg", "Lippstadt", "Landshut", "Dinslaken", "Plauen", "Weimar", "Neuwied", "Ibbenbüren", "Gießen", "Passau", "Freising", "Freital", "Frankfurt (Oder)", "Ravensburg", "Rosenheim", "Stralsund", "Lörrach", "Schweinfurt", "Baden-Baden", "Offenburg", "Stendal", "Heidenheim", "Garmisch-Partenkirchen", "Memmingen", "Dachau", "Kempten (Allgäu)", "Görlitz", "Bautzen", "Sindelfingen", "Goch", "Kleve", "Wesel", "Kevelaer", "Kempen", "Nettetal"
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
    return matrix[b.length][a.length];
}

function getFuzzyScore(query, target) {
    const q = query.toLowerCase();
    const t = target.toLowerCase();
    
    if (t.startsWith(q)) return 100 + q.length;
    
    const idx = t.indexOf(q);
    if (idx !== -1) return 80 - idx;
    
    const dist = levenshteinDistance(q, t);
    if (q.length >= 4 && dist <= 2) {
        return 50 - dist;
    }
    
    return 0;
}

function setupLocationAutocomplete(input) {
    if (!input) return;
    
    const parent = input.parentElement;
    if (parent) {
        parent.style.position = 'relative';
    }

    let debounceTimer;
    let suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'autocomplete-suggestions hidden';
    parent.appendChild(suggestionsContainer);

    input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();
        
        if (query.length < 3) {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.classList.add('hidden');
            return;
        }

        debounceTimer = setTimeout(async () => {
            try {
                // 1. Get local fuzzy matches
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

                // 2. Fetch from Nominatim API (restricted to settlements, i.e. cities/villages)
                let apiMatches = [];
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=de&addressdetails=1&featuretype=settlement&limit=5`, {
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
                localMatches.slice(0, 5).forEach(m => {
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
                    return;
                }

                suggestionsContainer.innerHTML = finalSuggestions.map(item => {
                    return `
                        <div class="autocomplete-suggestion" data-val="${item.name}">
                            <i class="fa-solid fa-map-marker-alt"></i>
                            <span>${item.label}</span>
                        </div>
                    `;
                }).join('');

                suggestionsContainer.classList.remove('hidden');

                suggestionsContainer.querySelectorAll('.autocomplete-suggestion').forEach(item => {
                    item.addEventListener('click', () => {
                        input.value = item.getAttribute('data-val');
                        suggestionsContainer.classList.add('hidden');
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    });
                });

            } catch (err) {
                console.error("Autocomplete processing error: ", err);
            }
        }, 250);
    });

    document.addEventListener('click', (e) => {
        if (e.target !== input && e.target !== suggestionsContainer && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.classList.add('hidden');
        }
    });
}

function initAllLocationAutocompletes() {
    document.querySelectorAll('input[name="location"], input[name="musLocation"], input[name="orgLocation"]').forEach(input => {
        if (!input.dataset.autocompleteBound) {
            setupLocationAutocomplete(input);
            input.dataset.autocompleteBound = "true";
        }
    });
}

function renderMarket(container, type, onNavigate) {
    const isEvents = type === 'events';
    const title = isEvents ? 'Event-Markt fÃ¼r Musiker' : 'Musiker-Markt fÃ¼r Veranstalter';

    const items = isEvents ? state.events : state.musicians;

    container.innerHTML = `
        <div class="market-page" style="max-width: 1400px; margin: 0 auto; padding: 2rem 1.5rem 5rem;">
            
            <!-- Page Header (OHNE Gitarren-Logo!) -->
            <div style="margin-bottom: 1.8rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h1 style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 900; color: var(--text-main); margin: 0;">
                        ${title}
                    </h1>
                </div>
                <div>
                    ${!state.currentUser ? `
                        <button class="btn btn-primary" onclick="showModal('auth')" style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); font-weight: 800; padding: 0.8rem 1.6rem; border-radius: 10px; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
                            <i class="fa-solid fa-lock"></i> Kontaktdaten freischalten
                        </button>
                    ` : ''}
                </div>
            </div>

            <!-- Main Layout: Left Sticky Sidebar Filters + Center Content -->
            <div class="market-layout-container" style="display: grid; grid-template-columns: 280px 1fr; gap: 2rem; align-items: start;">
                
                <!-- Left Sidebar Filters (WEISSE EINGABEFELDER) -->
                <div class="market-filter-card" style="background: rgba(124, 58, 237, 0.05); border: 1px solid rgba(124, 58, 237, 0.2); border-radius: var(--radius-md); padding: 1.2rem; box-shadow: var(--shadow-sm); position: sticky; top: 90px; max-height: calc(100vh - 110px); overflow-y: auto;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; border-bottom: 2px solid rgba(124, 58, 237, 0.3); padding-bottom: 0.8rem;">
                        <span style="color: #a855f7; font-weight: 900; font-size: 1.15rem; display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-sliders" style="color: #a855f7;"></i> Filter
                        </span>
                    </div>
                    
                    ${isEvents ? `
                        <!-- 10 Event-Markt Filter + Suchbegriffe mit weissen Eingabefeldern -->
                        <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Event-Art</label>
                                <select id="filter-event-type" class="form-input" multiple style="width: 100%; height: 90px; padding: 0.4rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                                    <option value="Hochzeit">Hochzeit</option>
                                    <option value="Geburtstag">Geburtstag</option>
                                    <option value="Firmenfeier">Firmenfeier</option>
                                    <option value="Festival">Festival / Kirmes</option>
                                    <option value="Gartenparty">Gartenparty</option>
                                    <option value="Club">Club / Bar Gig</option>
                                </select>
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Datum</label>
                                <input type="date" id="filter-date" class="form-input" style="width: 100%; padding: 0.55rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Ort / PLZ</label>
                                <input type="text" id="filter-location" placeholder="z.B. KÃ¶ln, Berlin..." class="form-input" style="width: 100%; padding: 0.55rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Umkreis</label>
                                <select id="filter-distance" class="form-input" style="width: 100%; padding: 0.55rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                                    <option value="">Beliebiger Umkreis</option>
                                    <option value="25">bis 25 km</option>
                                    <option value="50">bis 50 km</option>
                                    <option value="100">bis 100 km</option>
                                    <option value="250">bis 250 km</option>
                                </select>
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Genres</label>
                                <select id="filter-genre" class="form-input" multiple style="width: 100%; height: 100px; padding: 0.4rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                                    <option value="Pop">Pop</option>
                                    <option value="Rock">Rock</option>
                                    <option value="Acoustic">Acoustic / Singer-Songwriter</option>
                                    <option value="Jazz">Jazz & Soul</option>
                                    <option value="Cover">Cover & Party Hits</option>
                                    <option value="DJ">DJ & Electronic</option>
                                </select>
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Instrumente</label>
                                <select id="filter-instrument" class="form-input" multiple style="width: 100%; height: 90px; padding: 0.4rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                                    <option value="Gesang">Gesang / Solo</option>
                                    <option value="Gitarre">Acoustic Gitarre</option>
                                    <option value="Piano">Piano / Keyboard</option>
                                    <option value="Duo">Duo / Trio</option>
                                    <option value="Band">Band (Vollbesetzung)</option>
                                    <option value="DJ">DJ Setup</option>
                                </select>
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Spieldauer</label>
                                <select id="filter-duration" class="form-input" style="width: 100%; padding: 0.55rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                                    <option value="">Beliebige Spieldauer</option>
                                    <option value="1">bis 1 Stunde</option>
                                    <option value="2-3">2 - 3 Stunden</option>
                                    <option value="4">4 - 5 Stunden</option>
                                    <option value="open">Open End / Ganztags</option>
                                </select>
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Budgetspanne</label>
                                <select id="filter-budget" class="form-input" style="width: 100%; padding: 0.55rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                                    <option value="">Jedes Budget</option>
                                    <option value="500">bis 500 â‚¬</option>
                                    <option value="1000">500 â‚¬ - 1.000 â‚¬</option>
                                    <option value="2500">1.000 â‚¬ - 2.500 â‚¬</option>
                                    <option value="5000">Ã¼ber 2.500 â‚¬</option>
                                </select>
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Besucheranzahl</label>
                                <select id="filter-attendees" class="form-input" style="width: 100%; padding: 0.55rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                                    <option value="">Beliebige GÃ¤stezahl</option>
                                    <option value="50">bis 50 GÃ¤ste</option>
                                    <option value="150">50 - 150 GÃ¤ste</option>
                                    <option value="500">150 - 500 GÃ¤ste</option>
                                </select>
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Technik</label>
                                <select id="filter-equipment" class="form-input" style="width: 100%; padding: 0.55rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                                    <option value="">Beliebig</option>
                                    <option value="Vorhanden">Vorhanden</option>
                                    <option value="Mitbringen">Musiker bringt mit</option>
                                </select>
                            </div>

                            <!-- SUCHBEGRIFFE FELD DIREKT UNTER TECHNIK (WEISSES EINGABEFELD) -->
                            <div style="background: rgba(124, 58, 237, 0.18); border: 1.5px solid #a855f7; border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Suchbegriffe</label>
                                <input type="text" id="filter-keyword" placeholder="z.B. Hochzeit, Sax, Rock..." class="form-input" style="width: 100%; padding: 0.55rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                            </div>

                            <div style="padding-top: 0.3rem;">
                                <button id="btn-reset-filters" class="btn btn-secondary" style="width: 100%; padding: 0.65rem; border-radius: 8px; font-weight: 700;">
                                    <i class="fa-solid fa-rotate-left"></i> ZurÃ¼cksetzen
                                </button>
                            </div>
                        </div>
                    ` : `
                        <!-- 10 Musiker-Markt Filter + Suchbegriffe mit weissen Eingabefeldern -->
                        <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                            
                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Musiker-Typ</label>
                                <select id="filter-musician-type" class="form-input" multiple style="width: 100%; height: 90px; padding: 0.4rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                                    <option value="Solo">Solo-KÃ¼nstler</option>
                                    <option value="Duo">Duo / Trio</option>
                                    <option value="Coverband">Coverband</option>
                                    <option value="Band">Band (Vollbesetzung)</option>
                                    <option value="DJ">DJ</option>
                                </select>
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Datum / VerfÃ¼gbarkeit</label>
                                <input type="date" id="filter-date-m" class="form-input" style="width: 100%; padding: 0.55rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Ort</label>
                                <input type="text" id="filter-location-m" placeholder="z.B. MÃ¼nchen, KÃ¶ln..." class="form-input" style="width: 100%; padding: 0.55rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Umkreis</label>
                                <select id="filter-distance-m" class="form-input" style="width: 100%; padding: 0.55rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                                    <option value="">Beliebiger Umkreis</option>
                                    <option value="25">bis 25 km</option>
                                    <option value="50">bis 50 km</option>
                                    <option value="100">bis 100 km</option>
                                </select>
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Genres</label>
                                <select id="filter-genre-m" class="form-input" multiple style="width: 100%; height: 100px; padding: 0.4rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                                    <option value="Pop">Pop</option>
                                    <option value="Rock">Rock</option>
                                    <option value="Acoustic">Acoustic / Singer-Songwriter</option>
                                    <option value="Jazz">Jazz & Soul</option>
                                    <option value="Cover">Cover & Party Hits</option>
                                    <option value="DJ">DJ & Electronic</option>
                                </select>
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Instrumente</label>
                                <select id="filter-instrument-m" class="form-input" multiple style="width: 100%; height: 90px; padding: 0.4rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                                    <option value="Gesang">Gesang</option>
                                    <option value="Gitarre">Gitarre</option>
                                    <option value="Piano">Klavier / Keyboard</option>
                                    <option value="Saxophon">Saxophon</option>
                                    <option value="DJ">DJ Setup</option>
                                </select>
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Spieldauer</label>
                                <select id="filter-duration-m" class="form-input" style="width: 100%; padding: 0.55rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                                    <option value="">Beliebige Spieldauer</option>
                                    <option value="1">bis 1 Stunde</option>
                                    <option value="2-3">2 - 3 Stunden</option>
                                    <option value="4">4 - 5 Stunden</option>
                                    <option value="open">Open End / Ganztags</option>
                                </select>
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Preisspanne</label>
                                <select id="filter-price-m" class="form-input" style="width: 100%; padding: 0.55rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                                    <option value="">Jede Preisspanne</option>
                                    <option value="500">bis 500 â‚¬</option>
                                    <option value="1000">500 â‚¬ - 1.000 â‚¬</option>
                                    <option value="2500">1.000 â‚¬ - 2.500 â‚¬</option>
                                </select>
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Besucheranzahl</label>
                                <select id="filter-attendees-m" class="form-input" style="width: 100%; padding: 0.55rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                                    <option value="">Beliebige GÃ¤stezahl</option>
                                    <option value="50">bis 50 GÃ¤ste</option>
                                    <option value="150">50 - 150 GÃ¤ste</option>
                                </select>
                            </div>

                            <div style="background: rgba(124, 58, 237, 0.14); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Technik</label>
                                <select id="filter-equipment-m" class="form-input" style="width: 100%; padding: 0.55rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                                    <option value="">Beliebig</option>
                                    <option value="Eigene">Eigene PA vorhanden</option>
                                    <option value="BenÃ¶tigt">Technik wird benÃ¶tigt</option>
                                </select>
                            </div>

                            <!-- SUCHBEGRIFFE FELD DIREKT UNTER TECHNIK (WEISSES EINGABEFELD) -->
                            <div style="background: rgba(124, 58, 237, 0.18); border: 1.5px solid #a855f7; border-radius: 10px; padding: 0.8rem;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 900; color: #a855f7; margin-bottom: 0.35rem;">Suchbegriffe</label>
                                <input type="text" id="filter-keyword-m" placeholder="z.B. Acoustic, Sax, Pop..." class="form-input" style="width: 100%; padding: 0.55rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 600; font-size: 0.85rem;">
                            </div>

                            <div style="padding-top: 0.3rem;">
                                <button id="btn-reset-filters" class="btn btn-secondary" style="width: 100%; padding: 0.65rem; border-radius: 8px; font-weight: 700;">
                                    <i class="fa-solid fa-rotate-left"></i> ZurÃ¼cksetzen
                                </button>
                            </div>
                        </div>
                    `}
                </div>

                <!-- Center Main Section -->
                <div>
                    
                    <!-- Center Top Control Bar: Sortierungsfunktion -->
                    <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 1rem 1.4rem; margin-bottom: 1.8rem; display: flex; justify-content: flex-end; align-items: center; flex-wrap: wrap; gap: 1rem; box-shadow: var(--shadow-sm);">
                        
                        <!-- Sortierungsfunktion -->
                        <div style="display: flex; align-items: center; gap: 0.8rem;">
                            <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-muted); white-space: nowrap;">
                                <i class="fa-solid fa-arrow-down-wide-short" style="color: ${isEvents ? '#2563eb' : '#7c3aed'};"></i> Sortierung:
                            </span>
                            <select id="sort-select" style="padding: 0.55rem 1rem; border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.3); background: #ffffff; color: #0f172a; font-weight: 800; font-size: 0.88rem;">
                                <option value="match">Match-Faktor absteigend</option>
                                <option value="newest">Neueste zuerst</option>
                                <option value="price">GÃ¼nstig zuerst</option>
                                <option value="distance">NÃ¤chste zuerst</option>
                                <option value="name">Name (A-Z)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Center Main Grid for Musiker- or Event-Kacheln -->
                    <div id="market-items-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2rem;">
                        ${renderMarketGridHTML(items, isEvents)}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Filter logic supporting KEYWORD SEARCH, LOCATION, MULTI-SELECTS & SORTING
    const sortSelect = container.querySelector('#sort-select');
    const resetBtn = container.querySelector('#btn-reset-filters');

    function getSelectedValues(id) {
        const el = container.querySelector('#' + id);
        if (!el) return [];
        if (el.multiple) {
            return Array.from(el.selectedOptions).map(o => o.value).filter(v => v !== '');
        }
        return el.value ? [el.value] : [];
    }

    function applyAllFiltersAndSort() {
        let list = [...items];

        // 1. Ort Filter (z.B. KÃ¶ln, MÃ¼nchen, Berlin)
        const locInput = isEvents 
            ? (container.querySelector('#filter-location')?.value || '').trim().toLowerCase()
            : (container.querySelector('#filter-location-m')?.value || '').trim().toLowerCase();
        if (locInput) {
            list = list.filter(item => (item.location || '').toLowerCase().includes(locInput));
        }

        // 2. Suchbegriffe Filter (Freitext-Suche direkt unter Technik)
        const kw = isEvents
            ? (container.querySelector('#filter-keyword')?.value || '').trim().toLowerCase()
            : (container.querySelector('#filter-keyword-m')?.value || '').trim().toLowerCase();
        if (kw) {
            list = list.filter(item => {
                const fullText = [item.name, item.title, item.bio, item.description, item.location, item.category, item.eventType, ...(item.genres||[]), ...(item.instruments||[])].join(' ').toLowerCase();
                return fullText.includes(kw);
            });
        }

        // 3. Genres Filter
        const selGenres = isEvents ? getSelectedValues('filter-genre') : getSelectedValues('filter-genre-m');
        if (selGenres.length > 0) {
            list = list.filter(item => {
                const itemG = item.genres || (item.genre ? [item.genre] : []);
                return selGenres.some(g => itemG.some(ig => ig.toLowerCase().includes(g.toLowerCase())));
            });
        }

        // 4. Instrumente Filter
        const selInst = isEvents ? getSelectedValues('filter-instrument') : getSelectedValues('filter-instrument-m');
        if (selInst.length > 0) {
            list = list.filter(item => {
                const itemI = item.instruments || (item.category ? [item.category] : []);
                return selInst.some(inst => itemI.some(i => i.toLowerCase().includes(inst.toLowerCase())));
            });
        }

        // 5. Musiker-Typ / Event-Art
        const selType = isEvents ? getSelectedValues('filter-event-type') : getSelectedValues('filter-musician-type');
        if (selType.length > 0) {
            list = list.filter(item => {
                const val = isEvents ? (item.eventType || '') : (item.category || '');
                return selType.some(t => val.toLowerCase().includes(t.toLowerCase()));
            });
        }

        // 6. Spieldauer Filter
        const durationVal = isEvents
            ? (container.querySelector('#filter-duration')?.value || '')
            : (container.querySelector('#filter-duration-m')?.value || '');
        if (durationVal) {
            list = list.filter(item => {
                const dur = (item.duration || item.spieldauer || '').toLowerCase();
                if (durationVal === '1') return dur.includes('1');
                if (durationVal === '2-3') return dur.includes('2') || dur.includes('3') || dur.includes('4');
                if (durationVal === '4') return dur.includes('4') || dur.includes('5');
                if (durationVal === 'open') return dur.includes('open') || dur.includes('ganztag');
                return true;
            });
        }

        // 7. Sortierungs-Funktion
        const sortVal = sortSelect?.value || 'match';
        if (sortVal === 'match') {
            list.sort((a, b) => (b.matchScore || 95) - (a.matchScore || 95));
        } else if (sortVal === 'newest') {
            list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        } else if (sortVal === 'price') {
            const parsePrice = (str) => {
                const match = (str || '').match(/\d+/g);
                return match ? parseInt(match.join('')) : 999999;
            };
            list.sort((a, b) => parsePrice(a.price || a.budget) - parsePrice(b.price || b.budget));
        } else if (sortVal === 'distance') {
            list.sort((a, b) => (parseInt(a.distance || 50) - parseInt(b.distance || 50)));
        } else if (sortVal === 'name') {
            list.sort((a, b) => (isEvents ? a.title : a.name).localeCompare(isEvents ? b.title : b.name));
        }

        const grid = container.querySelector('#market-items-grid');
        if (grid) grid.innerHTML = renderMarketGridHTML(list, isEvents);
    }

    sortSelect?.addEventListener('change', applyAllFiltersAndSort);
    container.querySelectorAll('.form-input').forEach(el => {
        el.addEventListener('input', applyAllFiltersAndSort);
        el.addEventListener('change', applyAllFiltersAndSort);
    });

    resetBtn?.addEventListener('click', () => {
        container.querySelectorAll('.form-input').forEach(el => {
            if (el.multiple) {
                Array.from(el.options).forEach(o => o.selected = false);
            } else {
                el.value = '';
            }
        });
        if (sortSelect) sortSelect.value = 'match';
        applyAllFiltersAndSort();
    });
}

// Unified Tile Card Renderer - NO EXTRA PAGE & NO POPUP BUTTON!


// Unified Tile Card Renderer - NO EXTRA PAGE / NO MODAL NEEDED!




// Global openItemDetailModal function that works for everyone in protected mode!
window.openItemDetailModal = function(id, isEvents) {
    const item = (isEvents ? state.events : state.musicians).find(x => x.id === id) || (isEvents ? state.events[0] : state.musicians[0]);
    if (!item) return;

    const isUnlocked = state.unlockedContacts && state.unlockedContacts.includes(item.id);
    const roleColor = isEvents ? '#2563eb' : '#7c3aed';
    const photo = item.image || item.photo || (isEvents 
        ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80' 
        : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80');

    const genres = item.genres || (item.genre ? [item.genre] : ['Pop', 'Cover', 'Acoustic']);
    const instruments = item.instruments || (item.category ? [item.category] : ['Gesang', 'Gitarre']);
    const duration = item.duration || item.spieldauer || 'ca. 2 - 4 Stunden';
    const description = item.description || item.bio || (isEvents 
        ? 'Wir suchen eine professionelle musikalische Begleitung fÃ¼r unser anstehendes Event mit toller Stimmung. Bitte Ton- und Lichttechnik mitbringen oder absprechen.' 
        : 'Professionelle Live-Musik fÃ¼r unvergleichliche Momente bei Hochzeiten, Geburtstagen & Firmenevents. GroÃŸes Repertoire von Klassikern bis zu modernen Charts.');

    const modalHTML = `
        <div class="modal-overlay active" id="modal-item-detail" style="position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
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
                            ${isEvents ? item.title : item.name}
                        </h2>
                    </div>
                </div>

                <div style="padding: 2rem;">
                    
                    <!-- Media Showcase: Video & Audio Section (ALWAYS VISIBLE IN PROTECTED MODE) -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.2rem; margin-bottom: 2rem;">
                        
                        <!-- Video Showcase Box -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 1.2rem;">
                            <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-main); margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fa-solid fa-circle-play" style="color: #ef4444;"></i> Video-PrÃ¤sentation
                            </div>
                            <div style="position: relative; height: 140px; border-radius: 10px; overflow: hidden; background: #000; display: flex; align-items: center; justify-content: center; background: url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=80') center/cover;">
                                <button onclick="alert('Video-Wiedergabe startet...');" style="width: 50px; height: 50px; border-radius: 50%; background: rgba(239, 68, 68, 0.9); border: none; color: #fff; font-size: 1.4rem; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                                    <i class="fa-solid fa-play" style="margin-left: 3px;"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Audio Player Box -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 1.2rem;">
                            <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-main); margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fa-solid fa-music" style="color: ${roleColor};"></i> HÃ¶rproben & Audio
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
                                ${instruments.map(inst => `<span style="background: rgba(124, 58, 237, 0.15); padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.78rem; color: ${roleColor}; font-weight: 700;">${inst}</span>`).join('')}
                            </div>
                        </div>

                        <div>
                            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 0.2rem;">Spieldauer</span>
                            <strong style="font-size: 0.9rem; color: #fff;"><i class="fa-solid fa-clock" style="color: ${roleColor};"></i> ${duration}</strong>
                        </div>

                        <div>
                            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 0.2rem;">Technik & Equipment</span>
                            <strong style="font-size: 0.9rem; color: #fff;"><i class="fa-solid fa-plug" style="color: ${roleColor};"></i> ${item.equipment || 'Vorhanden'}</strong>
                        </div>
                    </div>

                    <!-- Protected Contact Details Area -->
                    <div style="background: rgba(15, 23, 42, 0.8); border: 2px solid ${isUnlocked ? 'rgba(34, 197, 94, 0.4)' : roleColor}; border-radius: 16px; padding: 1.5rem; text-align: center;">
                        ${isUnlocked ? `
                            <div style="color: #4ade80; font-weight: 800; font-size: 1.1rem; margin-bottom: 0.8rem;">
                                <i class="fa-solid fa-unlock"></i> Kontaktdaten freigeschaltet
                            </div>
                            <div style="font-size: 1rem; color: #fff; display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
                                <div><i class="fa-solid fa-phone"></i> Tel: <strong>${item.phone || '+49 170 1234567'}</strong></div>
                                <div><i class="fa-solid fa-envelope"></i> Mail: <strong>${item.email || 'kontakt@gigconnact.de'}</strong></div>
                            </div>
                        ` : `
                            <div style="font-weight: 800; font-size: 1.1rem; color: #ffffff; margin-bottom: 0.4rem;">
                                <i class="fa-solid fa-lock" style="color: ${roleColor};"></i> GeschÃ¼tzter Kontaktbereich
                            </div>
                            <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.2rem;">
                                Kontaktdaten (Telefonnummer & E-Mail-Adresse) sind im geschÃ¼tzten Modus verborgen. Schalte die Kontaktdaten frei, um direkt zu kommunizieren.
                            </p>
                            <button class="btn btn-primary btn-unlock-contact" data-id="${item.id}" onclick="document.getElementById('modal-item-detail').remove();" style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); border-color: #7c3aed; font-weight: 800; padding: 0.9rem 2rem; font-size: 1rem; border-radius: 12px; display: inline-flex; align-items: center; gap: 0.6rem;">
                                <i class="fa-solid fa-key"></i> Kontaktdaten freischalten (1 Credit)
                            </button>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
};



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
                        <h3 style="margin:0;"><i class="fa-solid fa-handshake text-cyan"></i> Matches</h3>
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
                            <div class="matches-donut-chart-container" style="position:relative; width:90px; height:90px; flex-shrink:0;">
                                <div id="matches-credits-donut" style="width:100%; height:100%; border-radius:50%;"></div>
                                <div style="position:absolute; top:9px; left:9px; width:72px; height:72px; border-radius:50%; background:#ffffff; display:flex; align-items:center; justify-content:center; flex-direction:column; border:1px solid var(--border-glass);">
                                    <span id="matches-credits-value" style="font-size:1.1rem; font-weight:700; color:var(--text-main);">${creditsValue}</span>
                                    <span style="font-size:0.45rem; color:var(--text-muted); text-transform:uppercase; font-weight:600; letter-spacing:0.5px; text-align:center;">Guthaben</span>
                                </div>
                            </div>
                            <div style="flex:1; display:grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap:1rem;">
                                <div style="background:rgba(255,215,0,0.02); border:1px solid rgba(255,215,0,0.15); padding:0.6rem 0.8rem; border-radius:var(--radius-md);">
                                    <div style="font-size:0.65rem; color:#FFD700; text-transform:uppercase; font-weight:700; margin-bottom:0.15rem;">Modell</div>
                                    <div id="stats-billing-mode" style="font-size:1.1rem; font-weight:700; color:#FFD700;">${billingMode}</div>
                                </div>
                                <div style="background:rgba(56,239,125,0.02); border:1px solid rgba(56,239,125,0.15); padding:0.6rem 0.8rem; border-radius:var(--radius-md);">
                                    <div style="font-size:0.65rem; color:var(--color-green); text-transform:uppercase; font-weight:700; margin-bottom:0.15rem;">Freischaltungen</div>
                                    <div id="stats-unlocked-contacts" style="font-size:1.3rem; font-weight:700; color:var(--color-green);">${unlockedCount}</div>
                                </div>
                                <div style="background:rgba(124,58,237,0.02); border:1px solid rgba(124,58,237,0.15); padding:0.6rem 0.8rem; border-radius:var(--radius-md);">
                                    <div style="font-size:0.65rem; color:var(--color-purple); text-transform:uppercase; font-weight:700; margin-bottom:0.15rem;">Top Matches (>=50%)</div>
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
                    <div class="listings-grid-layout" id="top-matches-grid">
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
        const activeId = selectProfile.value;
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
            const match = isMusician ? calculateMatch(myProfile, item) : calculateMatch(item, myProfile);
            return { item, match };
        });

        const topMatches = candidatesWithMatches.filter(cand => cand.match.score >= 50);

        const sortVal = selectSort?.value || 'match';
        const sortCandidateList = (list) => {
            list.sort((a, b) => {
                if (sortVal === 'match') {
                    return b.match.score - a.match.score;
                }
                if (sortVal === 'newest') {
                    const dateA = a.item.createdAt ? new Date(a.item.createdAt) : new Date(0);
                    const dateB = b.item.createdAt ? new Date(b.item.createdAt) : new Date(0);
                    return dateB - dateA;
                }
                if (sortVal === 'price-asc') {
                    const valA = isMusician ? a.item.budget : a.item.minBudget;
                    const valB = isMusician ? b.item.budget : b.item.minBudget;
                    return valA - valB;
                }
                if (sortVal === 'price-desc') {
                    const valA = isMusician ? a.item.budget : a.item.minBudget;
                    const valB = isMusician ? b.item.budget : b.item.minBudget;
                    return valB - valA;
                }
                if (sortVal === 'name') {
                    const nameA = state.hasContactAccess(activeId, a.item.id) ? a.item.name : (isMusician ? a.item.name : a.item.bluffName);
                    const nameB = state.hasContactAccess(activeId, b.item.id) ? b.item.name : (isMusician ? b.item.name : b.item.bluffName);
                    return nameA.localeCompare(nameB);
                }
                return 0;
            });
        };

        sortCandidateList(topMatches);

        if (document.getElementById('top-matches-count')) {
            document.getElementById('top-matches-count').textContent = topMatches.length;
        }
        if (document.getElementById('stats-top-matches-count')) {
            document.getElementById('stats-top-matches-count').textContent = topMatches.length;
        }

        const donut = document.getElementById('matches-credits-donut');
        const rateLabel = document.getElementById('matches-credits-value');
        if (donut && rateLabel) {
            const pct = isOrganizer || u.isPremium ? 100 : Math.min(100, Math.max(0, (u.credits / 50) * 100));
            donut.style.background = `conic-gradient(${isOrganizer || u.isPremium ? 'var(--color-green)' : '#FFD700'} 0% ${pct}%, rgba(255,255,255,0.05) ${pct}% 100%)`;
        }

        const renderGrid = (gridEl, list) => {
            if (list.length === 0) {
                gridEl.innerHTML = `
                    <div style="padding:2rem 1rem; text-align:center; color:var(--text-muted); width: 100%;">
                        <p>Keine passenden Matches gefunden (Score >= 50%).</p>
                    </div>
                `;
                return;
            }

            const isEventMarket = isMusician;

            gridEl.innerHTML = list.map(cand => {
                    const item = cand.item;
                    const matchScore = cand.match.score;
                    const matchHtml = renderMatchDial(matchScore);
                    
                    const hasContactAccess = state.hasContactAccess(activeId, item.id);
                    const displayName = hasContactAccess ? item.name : (isEventMarket ? item.name : item.bluffName);

                    const formatLocationWithPlz = (city) => {
                        if (!city) return "";
                        const plzMap = {
                            "münchen": "80331",
                            "stuttgart": "70173",
                            "nürnberg": "90402",
                            "berlin": "10115",
                            "hamburg": "20095",
                            "köln": "50667",
                            "frankfurt": "60311",
                            "düsseldorf": "40210"
                        };
                        const clean = city.trim().toLowerCase();
                        const plz = plzMap[clean] || "80331";
                        return `${plz} ${city}`;
                    };

                    const formatEventDateWithWeekday = (dateStr) => {
                        if (!dateStr) return "";
                        const dateObj = new Date(dateStr);
                        const formattedDate = dateObj.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
                        const weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
                        const weekday = weekdays[dateObj.getDay()];
                        return `${formattedDate} (${weekday})`;
                    };

                    let profilePicUrl = '';
                    if (isEventMarket) {
                        profilePicUrl = item.profilePic || (
                            item.type.toLowerCase().includes('hochzeit') || item.type.toLowerCase().includes('wedding') ? 'https://picsum.photos/id/111/300/300' :
                            item.type.toLowerCase().includes('club') || item.type.toLowerCase().includes('party') ? 'https://picsum.photos/id/653/300/300' :
                            item.type.toLowerCase().includes('festival') || item.type.toLowerCase().includes('open') ? 'https://picsum.photos/id/280/300/300' :
                            item.type.toLowerCase().includes('firma') || item.type.toLowerCase().includes('corporate') ? 'https://picsum.photos/id/30/300/300' :
                            'https://picsum.photos/id/1025/300/300'
                        );
                    } else {
                        profilePicUrl = item.profilePic || (
                            item.type === 'DJ' ? 'https://picsum.photos/id/653/300/300' :
                            item.type === 'Solo' ? 'https://picsum.photos/id/325/300/300' :
                            'https://picsum.photos/id/453/300/300'
                        );
                    }

                    const photos = item.photos && item.photos.length > 0 ? item.photos : [
                        profilePicUrl,
                        isEventMarket ? 'https://picsum.photos/id/1025/400/300' : 'https://picsum.photos/id/1082/400/300',
                        'https://picsum.photos/id/453/400/300'
                    ];



                    const videos = item.videos && item.videos.length > 0 ? item.videos : ['vid_1', 'vid_2'];
                    const audio = item.audio && item.audio.length > 0 ? item.audio : [
                        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
                    ];

                    const socialLinks = item.socialLinks && (item.socialLinks.spotify || item.socialLinks.youtube || item.socialLinks.instagram) ? item.socialLinks : {
                        spotify: "https://spotify.com",
                        youtube: "https://youtube.com",
                        instagram: "https://instagram.com"
                    };

                    // Contact Panel & Social Media html
                    let contactPanelHtml = '';
                    let socialMediaHtml = '';
                    if (hasContactAccess) {
                        contactPanelHtml = `
                            <div class="contact-details-box" style="margin-top: 0.5rem; padding: 0.6rem; border: 1px solid rgba(56, 239, 125, 0.2); background: rgba(56, 239, 125, 0.03); border-radius: var(--radius-sm); font-size: 0.75rem; text-align: left; display: flex; flex-direction: column; gap: 0.3rem;">
                                ${item.company ? `<div class="contact-line" style="word-break: break-all;"><i class="fa-solid fa-building" style="color:var(--color-cyan);"></i> ${item.company}</div>` : ''}
                                <div class="contact-line" style="word-break: break-all;"><i class="fa-solid fa-user" style="color:var(--color-cyan);"></i> ${item.contactName}</div>
                                <div class="contact-line" style="word-break: break-all;"><i class="fa-solid fa-phone" style="color:var(--color-cyan);"></i> ${item.phone}</div>
                                <div class="contact-line" style="word-break: break-all;"><i class="fa-solid fa-envelope" style="color:var(--color-cyan);"></i> ${item.email}</div>
                            </div>
                        `;
                        socialMediaHtml = `
                            <div class="card-social-icons-row" style="margin-top: 0.5rem; display: flex; gap: 0.8rem; justify-content: center; align-items: center; padding: 0.4rem 0;">
                                ${socialLinks.spotify ? `<a href="${socialLinks.spotify}" target="_blank" style="color: #1DB954; font-size: 1.25rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Spotify" onclick="event.stopPropagation();"><i class="fa-brands fa-spotify"></i></a>` : ''}
                                ${socialLinks.youtube ? `<a href="${socialLinks.youtube}" target="_blank" style="color: #FF0000; font-size: 1.25rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="YouTube" onclick="event.stopPropagation();"><i class="fa-brands fa-youtube"></i></a>` : ''}
                                ${socialLinks.instagram ? `<a href="${socialLinks.instagram}" target="_blank" style="color: #E1306C; font-size: 1.25rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Instagram" onclick="event.stopPropagation();"><i class="fa-brands fa-instagram"></i></a>` : ''}
                            </div>
                        `;
                    } else {
                        contactPanelHtml = `
                            <div class="contact-details-box" style="position: relative; margin-top: 0.5rem; border-radius: var(--radius-sm); font-size: 0.75rem; text-align: left; overflow: hidden; padding: 0.4rem; border: 1px dashed var(--border-glass);">
                                <div style="filter: blur(4px); user-select: none; pointer-events: none; display: flex; flex-direction: column; gap: 0.3rem; opacity: 0.7;">
                                    <div class="contact-line"><i class="fa-solid fa-building"></i> Musterfirma GmbH</div>
                                    <div class="contact-line"><i class="fa-solid fa-user"></i> Max Mustermann</div>
                                    <div class="contact-line"><i class="fa-solid fa-phone"></i> +49 176 1234567</div>
                                    <div class="contact-line"><i class="fa-solid fa-envelope"></i> mail@muster.de</div>
                                </div>
                                <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: rgba(255,255,255,0.25);">
                                    <button class="btn btn-secondary btn-sm" id="btn-activate-premium-inside-${item.id}" style="font-size: 0.65rem; padding: 0.2rem 0.4rem; margin: 0;" onclick="event.stopPropagation(); showModal('premium');">
                                        <i class="fa-solid fa-lock"></i> Freischalten
                                    </button>
                                </div>
                            </div>
                        `;
                        socialMediaHtml = `
                            <div class="card-social-icons-row" style="margin-top: 0.5rem; display: flex; gap: 0.8rem; justify-content: center; align-items: center; padding: 0.4rem 0;">
                                <div style="filter: blur(4px); display: flex; gap: 0.8rem; pointer-events: none; opacity: 0.6;">
                                    <span style="font-size: 1.2rem; color: var(--text-muted);"><i class="fa-brands fa-spotify"></i></span>
                                    <span style="font-size: 1.2rem; color: var(--text-muted);"><i class="fa-brands fa-youtube"></i></span>
                                    <span style="font-size: 1.2rem; color: var(--text-muted);"><i class="fa-brands fa-instagram"></i></span>
                                </div>
                            </div>
                        `;
                    }

                    return `
                        <div class="listing-card" data-id="${item.id}">
                            <div class="left-media-column" style="display:flex; flex-direction:column; gap:0.6rem; width:200px; flex-shrink:0;">
                                <div class="listing-thumbnail-wrapper" style="position: relative; width: 200px; height: 200px; overflow: hidden; border-radius: var(--radius-md); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); flex-shrink: 0;">
                                    ${isNewListing(item) ? `
                                        <span class="badge-new-listing" style="position: absolute; top: 8px; left: 8px; background: var(--color-purple); color: #000000; font-weight: 800; font-size: 0.65rem; padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); box-shadow: 0 4px 8px rgba(0,0,0,0.2); z-index: 12; display: flex; align-items: center; gap: 3px; letter-spacing: 0.5px;">
                                            <i class="fa-solid fa-star"></i> NEU
                                        </span>
                                    ` : ''}
                                    <!-- Slides Container -->
                                    <div class="listing-gallery-slides" style="width: 100%; height: 100%; display: flex; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); transform: translateX(0);">
                                        ${photos.map(p => `
                                            <img src="${p}" style="width: 100%; height: 100%; flex-shrink: 0; object-fit: cover;" alt="Vorschau">
                                        `).join('')}
                                    </div>
                                    <!-- Prev/Next Controls -->
                                    ${photos.length > 1 ? `
                                        <button class="gallery-arrow prev-arrow" onclick="event.stopPropagation(); window.navigateGallery(this, -1);" style="position: absolute; left: 6px; top: 50%; transform: translateY(-50%); background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(255, 255, 255, 0.1); color: #ffffff; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.7rem; z-index: 10; transition: background 0.2s, transform 0.2s;" onmouseover="this.style.background='rgba(15, 23, 42, 0.85)'" onmouseout="this.style.background='rgba(15, 23, 42, 0.65)'"><i class="fa-solid fa-chevron-left"></i></button>
                                        <button class="gallery-arrow next-arrow" onclick="event.stopPropagation(); window.navigateGallery(this, 1);" style="position: absolute; right: 6px; top: 50%; transform: translateY(-50%); background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(255, 255, 255, 0.1); color: #ffffff; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.7rem; z-index: 10; transition: background 0.2s, transform 0.2s;" onmouseover="this.style.background='rgba(15, 23, 42, 0.85)'" onmouseout="this.style.background='rgba(15, 23, 42, 0.65)'"><i class="fa-solid fa-chevron-right"></i></button>
                                        <!-- Dots indicator -->
                                        <div class="gallery-dots" style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px; z-index: 10;">
                                            ${photos.map((_, idx) => `
                                                <span class="gallery-dot" style="width: 6px; height: 6px; border-radius: 50%; background: ${idx === 0 ? '#ffffff' : 'rgba(255,255,255,0.4)'}; transition: background 0.2s, transform 0.2s; transform: ${idx === 0 ? 'scale(1.2)' : 'scale(1)'};"></span>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                </div>

                                <!-- Videos under gallery -->
                                ${videos && videos.length > 0 ? `
                                    <div class="listing-videos-gallery" style="display:flex; gap:0.4rem; overflow-x:auto; padding:2px 0;">
                                        ${videos.map((v, idx) => `
                                            <div class="video-gallery-item" onclick="event.stopPropagation(); window.playVideoModal('${v}');" style="width:64px; height:48px; border-radius:4px; overflow:hidden; position:relative; cursor:pointer; border:1px solid rgba(255,255,255,0.1); flex-shrink:0;" title="Video abspielen">
                                                <img src="https://picsum.photos/id/653/100/100" style="width:100%; height:100%; object-fit:cover;">
                                                <div style="position:absolute; inset:0; background:rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center;">
                                                    <i class="fa-solid fa-play text-red" style="font-size:0.8rem;"></i>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}

                                <!-- Audio Tracks under gallery -->
                                ${audio && audio.length > 0 ? `
                                    <div class="listing-audios-gallery" style="display:flex; flex-direction:column; gap:0.25rem;">
                                        ${audio.map((a, idx) => `
                                            <div class="audio-gallery-item" onclick="event.stopPropagation(); window.toggleAudioTrack(this, '${a}');" style="display:flex; align-items:center; gap:0.4rem; background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:4px; padding:0.25rem 0.4rem; cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'" title="Audio abspielen">
                                                <i class="fa-solid fa-play play-icon text-purple" style="font-size:0.65rem;"></i>
                                                <span style="font-size:0.65rem; color:var(--text-main); font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Demo ${idx+1}</span>
                                                <audio class="hidden-audio-player" src="${a}" style="display:none;"></audio>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>

                            <div class="listing-main-info">
                                <div class="listing-top-row" style="display: block; text-align: left;">
                                    <div class="listing-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; font-weight: 700; font-size: 1.15rem; color: var(--text-main); line-height: 1.2;" title="${displayName}">
                                        ${displayName}
                                    </div>
                                    <div style="margin-top: 0.2rem; margin-bottom: 0.6rem;">
                                        <span class="listing-badge ${isEventMarket ? 'badge-organizer' : 'badge-musician'}" style="display: inline-block;">
                                            ${item.type}
                                        </span>
                                    </div>
                                </div>
         
                                <div class="listing-details-grid">
                                    <div class="detail-item"><i class="fa-solid fa-map-marker-alt"></i> ${formatLocationWithPlz(item.location)}</div>
                                    <div class="detail-item">
                                        ${isEventMarket 
                                            ? `<i class="fa-solid fa-calendar-days"></i> ${formatEventDateWithWeekday(item.date)}` 
                                            : `<i class="fa-solid fa-calendar-check"></i> Event-Arten: ${item.eventTypes ? item.eventTypes.join(', ') : ''}`}
                                    </div>
                                    <div class="detail-item">
                                        <i class="fa-solid fa-euro-sign"></i> 
                                        ${isEventMarket ? `Budget: ${item.budget} €` : `Min. Gage: ${item.minBudget} €`}
                                    </div>
                                    <div class="detail-item">
                                        <i class="fa-solid fa-clock"></i> 
                                        ${isEventMarket ? `${item.duration} Std. Spieldauer` : `Max. ${item.maxDuration} Std. Spieldauer`}
                                    </div>
                                    <div class="detail-item">
                                        <i class="fa-solid fa-sliders"></i> 
                                        Technik: ${item.technik === 'vorhanden' ? 'Ja' : (item.technik === 'nicht vorhanden' ? 'Nein' : 'Weiß ich noch nicht')}
                                    </div>
                                    ${isEventMarket ? `
                                        <div class="detail-item">
                                            <i class="fa-solid fa-users"></i> 
                                            Gesucht: ${item.musicianTypes ? item.musicianTypes.join(', ') : ''}
                                        </div>
                                    ` : ''}
                                </div>

                                <!-- Genres & Instrumente tags (without titles) -->
                                <div class="listing-details-block" style="margin-top: 0.8rem; font-size: 0.85rem; display: flex; flex-wrap: wrap; gap: 0.4rem; text-align: left;">
                                    ${item.genres.map(g => `<span class="tag">🎵 ${g}</span>`).join('')}
                                    ${item.instruments.map(ins => `<span class="tag">🎸 ${ins}</span>`).join('')}
                                </div>

                                <!-- Description directly visible under tags -->
                                <div class="listing-description" style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.8rem; margin-top: 0.8rem; font-size: 0.85rem; line-height: 1.4; color: var(--text-muted); text-align: left;">
                                    ${item.description}
                                </div>
                            </div>

                            <div class="listing-actions-panel" style="display:flex; flex-direction:column; gap:0.4rem; align-items:stretch; width:180px;">
                                ${matchHtml}
                                <div style="display:flex; flex-direction:column; gap:0.4rem; width:100%; margin-top:0.4rem;">
                                    ${hasContactAccess ? `
                                        <button class="btn btn-sm ${isEventMarket ? 'btn-primary' : 'btn-secondary'} btn-contact-listing" 
                                                data-id="${isEventMarket ? item.creatorId : item.id}" 
                                                data-name="${displayName}"
                                                data-event-id="${isEventMarket ? item.id : ''}"
                                                style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.4rem; margin: 0;">
                                            <i class="fa-solid fa-comment"></i> Nachricht schreiben
                                        </button>
                                    ` : ''}
                                    ${contactPanelHtml}
                                    ${socialMediaHtml}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');

                gridEl.querySelectorAll('.btn-contact-listing').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const targetId = btn.getAttribute('data-id');
                        const targetName = btn.getAttribute('data-name');
                        const eventId = btn.getAttribute('data-event-id');
                        const result = state.initiateContact(targetId, targetName);
                        if (result.success) {
                            if (eventId && state.currentUser && state.currentUser.role === 'musician') {
                                state.addMusicianApplication(state.currentUser.profileId, eventId);
                            }
                            showToast({
                                title: "Verbindung initiiert!",
                                message: `Chat mit ${targetName} geöffnet.`,
                                actionTab: "postbox"
                            });
                            navigate('postbox');
                        }
                    });
                });

                gridEl.querySelectorAll('.btn-interest').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const musicianId = btn.getAttribute('data-musician-id');
                        const eventId = btn.getAttribute('data-event-id');
                        const res = state.toggleInterest(u.role, musicianId, eventId);
                        if (res.success) {
                            if (res.isPerfectMatch) {
                                showToast({
                                    title: "Perfect Match! 💖🎉",
                                    message: "Ihr habt beide gegenseitig Interesse bekundet! Ihr könnt nun direkt chatten.",
                                    actionTab: "postbox"
                                });
                                let targetId = '';
                                if (u.role === 'musician') {
                                    const event = state.events.find(ev => ev.id === eventId);
                                    targetId = event ? event.creatorId : '';
                                } else {
                                    targetId = musicianId;
                                }
                                if (targetId) {
                                    state.initiateContact(targetId, "Perfect Match Partner");
                                }
                                navigate('postbox');
                            } else {
                                showToast({
                                    title: res.active ? "Interesse bekundet!" : "Interesse zurückgezogen",
                                    message: res.active ? "Dein Interesse wurde erfolgreich übermittelt." : "Dein Interesse wurde zurückgezogen."
                                });
                                updateMatches();
                            }
                        }
                    });
                });

                gridEl.querySelectorAll('.btn-no-interest').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const musicianId = btn.getAttribute('data-musician-id');
                        const eventId = btn.getAttribute('data-event-id');
                        const res = state.toggleNoInterest(u.role, musicianId, eventId);
                        if (res.success) {
                            showToast({
                                title: res.active ? "Kein Interesse markiert" : "Markierung aufgehoben",
                                message: res.active ? "Dieses Angebot wurde als nicht interessant markiert." : "Die Markierung wurde aufgehoben."
                            });
                            updateMatches();
                        }
                    });
                });
            };

            renderGrid(perfectGrid, perfectMatches, true);
            renderGrid(topGrid, topMatches, false);
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
    const pic = e.profilePic || (e.type && (e.type.toLowerCase().includes('hochzeit') || e.type.toLowerCase().includes('wedding')) ? 'https://picsum.photos/id/111/300/300' : 'https://picsum.photos/id/1025/300/300');
    const formattedDate = new Date(e.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    const interestsCount = state.interests?.filter(i => i.eventId === e.id && i.organizerInterested).length || 0;
    const noInterestsCount = state.interests?.filter(i => i.eventId === e.id && i.organizerNoInterest).length || 0;
    const contactedCount = state.musicians.filter(m => m.applications?.some(app => app.eventId === e.id && app.status === 'contacted')).length || 0;
    
    let perfectMatchesCount = 0;
    state.interests?.forEach(i => {
        if (i.eventId === e.id && i.musicianInterested && i.organizerInterested) {
            perfectMatchesCount++;
        }
    });
    
    return `
        <div class="my-event-item" style="display: flex; background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 1.2rem; gap: 1.5rem; width: 100%; position: relative; flex-wrap: wrap;">
            <!-- Left Section (Image + Info + Stats) -->
            <div style="flex: 1; display: flex; flex-direction: column; gap: 1rem; min-width: 280px;">
                <!-- Header Info -->
                <div style="display: flex; align-items: flex-start; gap: 1.2rem;">
                    <img src="${pic}" style="width: 55px; height: 55px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0; ${!isActive ? 'filter:grayscale(0.8);' : ''}">
                    <div style="min-width: 0; flex: 1;">
                        <h4 style="margin: 0 0 0.4rem; font-size: 1.05rem; font-weight: 700; color: ${isActive ? 'var(--text-main)' : 'var(--text-muted)'}; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                            ${e.name}
                            ${e.isCanceled ? ' <span class="tag" style="background:rgba(255,75,75,0.1); color:var(--color-red); font-size:0.7rem; padding:0.1rem 0.4rem; border-radius:4px;"><i class="fa-solid fa-ban"></i> Abgesagt</span>' : ''}
                            ${(!isActive && !e.isCanceled) ? ' <span class="tag" style="background:rgba(15,23,42,0.08); border: 1px solid var(--border-glass); color:var(--text-muted); font-size:0.7rem; padding:0.1rem 0.4rem; border-radius:4px;"><i class="fa-solid fa-clock"></i> Beendet</span>' : ''}
                        </h4>
                        <div style="display: flex; gap: 1.2rem; font-size: 0.8rem; color: var(--text-muted); flex-wrap: wrap; margin-top: 0.2rem;">
                            <span><i class="fa-solid fa-tag text-cyan"></i> ${e.type}</span>
                            <span><i class="fa-solid fa-calendar text-cyan"></i> ${formattedDate}</span>
                            <span><i class="fa-solid fa-map-marker-alt text-cyan"></i> ${e.location}</span>
                            <span><i class="fa-solid fa-euro-sign text-cyan"></i> ${e.budget} €</span>
                        </div>
                    </div>
                </div>

                <!-- Stats Row (1-to-1 design matching the Dashboard stats grid) -->
                <div style="display: flex; gap: 0.8rem; flex-wrap: wrap; margin-top: 0.4rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.8rem;">
                    <div style="background:rgba(124,58,237,0.02); border:1px solid rgba(124,58,237,0.15); padding:0.8rem; border-radius:var(--radius-md); flex: 1; min-width: 100px;">
                        <div style="font-size:0.7rem; color:var(--color-purple); text-transform:uppercase; font-weight:700; margin-bottom:0.25rem;">Interesse bekundet</div>
                        <div style="font-size:1.6rem; font-weight:700; color:var(--color-purple);">${interestsCount}</div>
                    </div>
                    <div style="background:rgba(255,75,75,0.02); border:1px solid rgba(255,75,75,0.15); padding:0.8rem; border-radius:var(--radius-md); flex: 1; min-width: 100px;">
                        <div style="font-size:0.7rem; color:var(--color-red); text-transform:uppercase; font-weight:700; margin-bottom:0.25rem;">Kein Interesse</div>
                        <div style="font-size:1.6rem; font-weight:700; color:var(--color-red);">${noInterestsCount}</div>
                    </div>
                    <div style="background:rgba(0,242,254,0.02); border:1px solid rgba(0,242,254,0.15); padding:0.8rem; border-radius:var(--radius-md); flex: 1; min-width: 100px;">
                        <div style="font-size:0.7rem; color:var(--color-cyan); text-transform:uppercase; font-weight:700; margin-bottom:0.25rem;">Kontaktiert</div>
                        <div style="font-size:1.6rem; font-weight:700; color:var(--color-cyan);">${contactedCount}</div>
                    </div>
                    <div style="background:rgba(56,239,125,0.02); border:1px solid rgba(56,239,125,0.15); padding:0.8rem; border-radius:var(--radius-md); flex: 1; min-width: 100px;">
                        <div style="font-size:0.7rem; color:var(--color-green); text-transform:uppercase; font-weight:700; margin-bottom:0.25rem;">Perfekte Matches</div>
                        <div style="font-size:1.6rem; font-weight:700; color:var(--color-green);">${perfectMatchesCount}</div>
                    </div>
                </div>
            </div>

            <!-- Right Section (Actions) -->
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-end; gap: 0.5rem; min-width: 160px; border-left: 1px solid rgba(255,255,255,0.05); padding-left: 1.2rem; flex: 0 0 auto;">
                ${isActive ? `
                    <button class="btn btn-glass btn-sm btn-edit-my-event" data-id="${e.id}" style="margin:0; width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.45rem 0.8rem; font-size: 0.8rem;">
                        <i class="fa-solid fa-pen"></i> Bearbeiten
                    </button>
                    <button class="btn btn-glass btn-sm btn-duplicate-my-event" data-id="${e.id}" style="margin:0; width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.45rem 0.8rem; font-size: 0.8rem; border-color: rgba(0,242,254,0.3); color:var(--color-cyan); background: rgba(0,242,254,0.02);">
                        <i class="fa-solid fa-copy"></i> Duplizieren
                    </button>
                    <button class="btn btn-glass btn-sm btn-delete-my-event" data-id="${e.id}" style="margin:0; width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.45rem 0.8rem; font-size: 0.8rem; color: var(--color-red); border-color: rgba(255, 75, 75, 0.15);">
                        <i class="fa-solid fa-power-off"></i> Deaktivieren
                    </button>
                ` : `
                    <button class="btn btn-glass btn-sm btn-activate-my-event" data-id="${e.id}" style="margin:0; width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.45rem 0.8rem; font-size: 0.8rem; border-color: rgba(56,239,125,0.3); color:var(--color-green); background: rgba(56,239,125,0.02);">
                        <i class="fa-solid fa-play"></i> Aktivieren
                    </button>
                    <button class="btn btn-glass btn-sm btn-delete-my-event" data-id="${e.id}" style="margin:0; width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.45rem 0.8rem; font-size: 0.8rem; color: var(--color-red); border-color: rgba(255, 75, 75, 0.15);">
                        <i class="fa-solid fa-trash"></i> Löschen
                    </button>
                `}
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
        <div class="portal-layout" style="display:flex; flex-direction:column; gap:2rem;">
            <!-- Integrated Dashboard Header -->
            <div class="profile-section-card" style="margin-bottom:0;">
                <h3 style="margin-bottom:1.5rem;"><i class="fa-solid fa-chart-pie text-cyan"></i> Event-Statistiken (Dashboard)</h3>
                <div style="display:flex; align-items:center; gap:3rem; flex-wrap:wrap;">
                    <!-- CSS Donut Chart -->
                    <div style="position: relative; width: 120px; height: 120px; flex-shrink: 0; margin: 0 auto 1rem;">
                        <div style="width: 100%; height: 100%; border-radius: 50%; background: conic-gradient(var(--color-green) 0% ${successPercent}%, rgba(124,58,237,0.15) ${successPercent}% 100%);"></div>
                        <div style="position: absolute; top: 12px; left: 12px; width: 96px; height: 96px; border-radius: 50%; background: #ffffff; border: 1px solid var(--border-glass);"></div>
                    </div>
                    
                    <!-- Stats Grid -->
                    <div style="flex:1; display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:1.2rem; min-width:250px;">
                        <div style="background:rgba(124,58,237,0.02); border:1px solid rgba(124,58,237,0.15); padding:0.8rem; border-radius:var(--radius-md);">
                            <div style="font-size:0.7rem; color:var(--color-purple); text-transform:uppercase; font-weight:700; margin-bottom:0.25rem;">Interesse bekundet</div>
                            <div style="font-size:1.6rem; font-weight:700; color:var(--color-purple);">${totalInterestsExpressedByMe}</div>
                        </div>
                        <div style="background:rgba(255,75,75,0.02); border:1px solid rgba(255,75,75,0.15); padding:0.8rem; border-radius:var(--radius-md);">
                            <div style="font-size:0.7rem; color:var(--color-red); text-transform:uppercase; font-weight:700; margin-bottom:0.25rem;">Kein Interesse</div>
                            <div style="font-size:1.6rem; font-weight:700; color:var(--color-red);">${totalNoInterestsByMe}</div>
                        </div>
                        <div style="background:rgba(0,242,254,0.02); border:1px solid rgba(0,242,254,0.15); padding:0.8rem; border-radius:var(--radius-md);">
                            <div style="font-size:0.7rem; color:var(--color-cyan); text-transform:uppercase; font-weight:700; margin-bottom:0.25rem;">Kontaktiert</div>
                            <div style="font-size:1.6rem; font-weight:700; color:var(--color-cyan);">${totalContactedByMe}</div>
                        </div>
                        <div style="background:rgba(56,239,125,0.02); border:1px solid rgba(56,239,125,0.15); padding:0.8rem; border-radius:var(--radius-md);">
                            <div style="font-size:0.7rem; color:var(--color-green); text-transform:uppercase; font-weight:700; margin-bottom:0.25rem;">Perfekte Matches</div>
                            <div style="font-size:1.6rem; font-weight:700; color:var(--color-green);">${totalPerfectMatches}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Active Events -->
            <div class="profile-section-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom:0.8rem; flex-wrap: wrap; gap:1rem;">
                    <h3 style="margin:0;"><i class="fa-solid fa-calendar-check text-cyan"></i> Aktive Event-Ausschreibungen (${activeEvents.length})</h3>
                    <button class="btn btn-secondary btn-sm" id="btn-create-event-modal" style="margin:0;">
                        <i class="fa-solid fa-plus"></i> Neues Event erstellen
                    </button>
                </div>
                
                <div class="my-events-list">
                    ${activeEvents.length === 0 ? `
                        <div style="padding:2rem 1rem; text-align:center; color:var(--text-muted);">
                            <i class="fa-solid fa-calendar-days" style="font-size:2.5rem; color:var(--border-glass); margin-bottom:0.8rem;"></i>
                            <p>Keine aktiven Ausschreibungen vorhanden.</p>
                        </div>
                    ` : `
                        <div style="display: flex; flex-direction: column; gap: 1rem;">
                            ${activeEvents.map(e => renderOrganizerEventItem(e, true)).join('')}
                        </div>
                    `}
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
                        <div style="display: flex; flex-direction: column; gap: 1rem;">
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


    container.querySelectorAll('.btn-activate-my-event').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const result = state.reactivateEvent(id);
            if (result.success) {
                showToast({
                    title: "Event aktiviert 🟢",
                    message: "Das Event ist wieder aktiv und auf dem Markt sichtbar."
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
                const isAct = isEventActive(event);
                const actionText = isAct ? "deaktivieren" : "unwiderruflich löschen";
                if (confirm(`Möchtest du das Event "${event.name}" wirklich ${actionText}?`)) {
                    state.deleteEvent(id);
                    showToast({
                        title: isAct ? "Event deaktiviert" : "Event gelöscht",
                        message: isAct ? "Das Event wurde erfolgreich deaktiviert." : "Das Event wurde erfolgreich aus der Suche entfernt."
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
                            <span><i class="fa-solid fa-euro-sign text-purple"></i> ${event.budget} €</span>
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
    const pic = m.profilePic || (
        m.type === 'DJ' ? 'https://picsum.photos/id/653/300/300' : m.type === 'Solo' ? 'https://picsum.photos/id/325/300/300' : 'https://picsum.photos/id/453/300/300'
    );
    
    const isExpanded = activeInsightsProfiles.has(m.id);
    const insightsHtml = isExpanded ? renderMusicianInsightsPanel(m) : '';
    const insightsStyle = isExpanded ? 'display: block;' : 'display: none;';
    const activeStyle = isExpanded 
        ? 'border-color: var(--color-purple); color: #ffffff; background: var(--color-purple);'
        : 'border-color: rgba(124,58,237,0.3); color:var(--color-purple); background: rgba(124,58,237,0.02);';

    return `
        <div class="my-musician-item-container" style="background: #ffffff; border: 1px solid var(--border-glass); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm); margin-bottom: 1rem;">
            <div class="my-musician-item" style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; gap: 1rem; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 1rem; flex: 1; min-width: 250px;">
                    <img src="${pic}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0; ${!isActive ? 'filter:grayscale(0.8);' : ''}">
                    <div style="min-width: 0;">
                        <h4 style="margin:0 0 0.2rem; font-size: 1rem; font-weight: 700; color: ${isActive ? 'var(--text-main)' : 'var(--text-muted)'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${m.name}
                            ${!isActive ? ' <span class="tag" style="background:rgba(255,75,75,0.1); color:var(--color-red); font-size:0.7rem; padding:0.1rem 0.4rem; border-radius:4px;"><i class="fa-solid fa-pause"></i> Pausiert</span>' : ' <span class="tag" style="background:rgba(56,239,125,0.1); color:var(--color-green); font-size:0.7rem; padding:0.1rem 0.4rem; border-radius:4px;"><i class="fa-solid fa-circle-check"></i> Aktiv</span>'}
                        </h4>
                        <div style="display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-muted); flex-wrap: wrap;">
                            <span><i class="fa-solid fa-guitar text-purple"></i> ${m.type}</span>
                            <span><i class="fa-solid fa-map-marker-alt text-purple"></i> ${m.location}</span>
                            <span><i class="fa-solid fa-euro-sign text-purple"></i> ab ${m.minBudget} €</span>
                            <span><i class="fa-solid fa-tag text-purple"></i> ${m.genres.slice(0,2).join(', ')}</span>
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 0.5rem; flex-shrink: 0; flex-wrap: wrap;">
                    <button class="btn btn-glass btn-sm btn-insights-my-musician" data-id="${m.id}" style="margin:0; padding:0.4rem 0.8rem; ${activeStyle}">
                        <i class="fa-solid fa-chart-line"></i> Insights
                    </button>
                    ${isActive ? `
                        <button class="btn btn-glass btn-sm btn-pause-my-musician" data-id="${m.id}" style="margin:0; padding:0.4rem 0.8rem; border-color: rgba(255,75,75,0.3); color:var(--color-red); background: rgba(255,75,75,0.02);">
                            <i class="fa-solid fa-pause"></i> Profil pausieren
                        </button>
                        <button class="btn btn-glass btn-sm btn-duplicate-my-musician" data-id="${m.id}" style="margin:0; padding:0.4rem 0.8rem; border-color: rgba(124,58,237,0.3); color:var(--color-purple); background: rgba(124,58,237,0.02);">
                            <i class="fa-solid fa-copy"></i> Duplizieren
                        </button>
                        <button class="btn btn-glass btn-sm btn-edit-my-musician" data-id="${m.id}" style="margin:0; padding:0.4rem 0.8rem;">
                            <i class="fa-solid fa-pen"></i> Bearbeiten
                        </button>
                    ` : `
                        <button class="btn btn-glass btn-sm btn-pause-my-musician" data-id="${m.id}" style="margin:0; padding:0.4rem 0.8rem; border-color: rgba(56,239,125,0.3); color:var(--color-green); background: rgba(56,239,125,0.02);">
                            <i class="fa-solid fa-play"></i> Profil aktivieren
                        </button>
                        <button class="btn btn-glass btn-sm btn-duplicate-my-musician" data-id="${m.id}" style="margin:0; padding:0.4rem 0.8rem; border-color: rgba(124,58,237,0.3); color:var(--color-purple); background: rgba(124,58,237,0.02);">
                            <i class="fa-solid fa-copy"></i> Duplizieren
                        </button>
                    `}
                    <button class="btn btn-glass btn-sm btn-delete-my-musician" data-id="${m.id}" style="margin:0; padding:0.4rem 0.8rem; color: var(--color-red); border-color: rgba(255, 75, 75, 0.15);">
                        <i class="fa-solid fa-trash"></i> Löschen
                    </button>
                </div>
            </div>
            
            <div class="my-musician-insights-panel" id="insights-panel-${m.id}" style="border-top: 1px solid var(--border-glass); background: rgba(124,58,237,0.01); ${insightsStyle}">
                ${insightsHtml}
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

    const successPercent = allMyMusicians.length > 0 ? Math.round((activeMusicians.length / allMyMusicians.length) * 100) : 0;

    container.innerHTML = `
        <div class="portal-layout" style="display:flex; flex-direction:column; gap:2rem;">
            <!-- Active Musicians -->
            <div class="profile-section-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom:0.8rem; flex-wrap: wrap; gap:1rem;">
                    <h3 style="margin:0;"><i class="fa-solid fa-guitar text-purple"></i> Aktive Musiker-Profile (${activeMusicians.length})</h3>
                    <button class="btn btn-secondary btn-sm" id="btn-create-musician-modal" style="margin:0; background: var(--color-purple); border-color: var(--color-purple);">
                        <i class="fa-solid fa-plus"></i> Profil hinzufügen
                    </button>
                </div>
                
                <div class="my-musicians-list">
                    ${activeMusicians.length === 0 ? `
                        <div style="padding:2rem 1rem; text-align:center; color:var(--text-muted);">
                            <i class="fa-solid fa-guitar" style="font-size:2.5rem; color:var(--border-glass); margin-bottom:0.8rem;"></i>
                            <p>Keine aktiven Profile vorhanden.</p>
                        </div>
                    ` : `
                        <div style="display: flex; flex-direction: column; gap: 1rem;">
                            ${activeMusicians.map(m => renderMyMusicianItem(m, true)).join('')}
                        </div>
                    `}
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
                        <div style="display: flex; flex-direction: column; gap: 1rem;">
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

    const attachInsightsListeners = (panel, m) => {
        panel.querySelectorAll('.chk-toggle-booked').forEach(chk => {
            chk.addEventListener('change', () => {
                const musId = chk.getAttribute('data-musician-id');
                const evtId = chk.getAttribute('data-event-id');
                const isChecked = chk.checked;
                const newStatus = isChecked ? 'booked' : 'contacted';
                const result = state.setApplicationStatus(musId, evtId, newStatus);
                if (result.success) {
                    showToast({
                        title: newStatus === 'booked' ? "Event gebucht! 🎉" : "Status aktualisiert",
                        message: newStatus === 'booked' ? "Du hast den Auftritt als 'Gebucht' markiert." : "Der Status wurde wieder auf 'Kontaktiert' gesetzt."
                    });
                    
                    const updatedMusician = state.musicians.find(mus => mus.id === musId);
                    panel.innerHTML = renderMusicianInsightsPanel(updatedMusician);
                    attachInsightsListeners(panel, updatedMusician);
                }
            });
        });

        panel.querySelectorAll('.chk-toggle-declined').forEach(chk => {
            chk.addEventListener('change', () => {
                const musId = chk.getAttribute('data-musician-id');
                const evtId = chk.getAttribute('data-event-id');
                const isChecked = chk.checked;
                const newStatus = isChecked ? 'declined' : 'contacted';
                const result = state.setApplicationStatus(musId, evtId, newStatus);
                if (result.success) {
                    showToast({
                        title: newStatus === 'declined' ? "Absage markiert 🔴" : "Status aktualisiert",
                        message: newStatus === 'declined' ? "Du hast die Bewerbung als 'Abgesagt' markiert." : "Der Status wurde wieder auf 'Kontaktiert' gesetzt."
                    });
                    
                    const updatedMusician = state.musicians.find(mus => mus.id === musId);
                    panel.innerHTML = renderMusicianInsightsPanel(updatedMusician);
                    attachInsightsListeners(panel, updatedMusician);
                }
            });
        });
    };

    // Attach listeners and load content for already expanded insights panels
    allMyMusicians.forEach(m => {
        if (activeInsightsProfiles.has(m.id)) {
            const panel = document.getElementById(`insights-panel-${m.id}`);
            if (panel) {
                attachInsightsListeners(panel, m);
            }
        }
    });

    container.querySelectorAll('.btn-insights-my-musician').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');
            const panel = document.getElementById(`insights-panel-${id}`);
            if (panel) {
                const isHidden = panel.style.display === 'none';
                if (isHidden) {
                    activeInsightsProfiles.add(id);
                    const musician = state.musicians.find(m => m.id === id);
                    if (musician) {
                        panel.innerHTML = renderMusicianInsightsPanel(musician);
                        attachInsightsListeners(panel, musician);
                    }
                    panel.style.display = 'block';
                    btn.style.borderColor = 'var(--color-purple)';
                    btn.style.color = '#ffffff';
                    btn.style.background = 'var(--color-purple)';
                } else {
                    activeInsightsProfiles.delete(id);
                    panel.style.display = 'none';
                    btn.style.borderColor = 'rgba(124,58,237,0.3)';
                    btn.style.color = 'var(--color-purple)';
                    btn.style.background = 'rgba(124,58,237,0.02)';
                }
            }
        });
    });

    container.querySelectorAll('.btn-pause-my-musician').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const result = state.toggleMusicianActive(id);
            if (result.success) {
                showToast({
                    title: result.isActive ? "Profil aktiv! 🟢" : "Profil pausiert! 🟡",
                    message: result.isActive 
                        ? "Das Profil ist nun wieder im Markt sichtbar." 
                        : "Das Profil wurde pausiert und aus der Suche entfernt."
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

    modalWrapper.innerHTML = `
        <div class="modal-content" style="max-width: 650px; max-height: 85vh; overflow-y: auto; text-align: left;">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-modal-btn" id="btn-close-musician-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="musician-editor-form">
                    <div style="display:flex; gap: 1rem; align-items:center; margin-bottom: 1.5rem; background:rgba(255,255,255,0.02); padding:0.8rem; border-radius:var(--radius-md); border: 1px solid var(--border-glass);">
                        <div style="width: 60px; height: 60px; border-radius: 50%; overflow:hidden; border: 2px solid var(--color-purple); flex-shrink: 0; background: #111;">
                            <img id="musician-modal-preview-img" src="${profilePicUrl}" style="width:100%; height:100%; object-fit:cover;">
                        </div>
                        <div>
                            <h4 style="font-size:0.85rem; margin-bottom:0.15rem;">Profilbild hochladen</h4>
                            <p style="font-size:0.7rem; color:var(--text-muted); margin-bottom:0.4rem;">Wird in der Musikersuche angezeigt.</p>
                            <input type="file" id="musician-pic-file-input" accept="image/*" style="display:none;">
                            <button type="button" class="btn btn-glass btn-sm" id="btn-select-musician-pic" style="font-size:0.7rem; padding:0.3rem 0.6rem; margin:0;">
                                <i class="fa-solid fa-cloud-arrow-up"></i> Bild auswählen
                            </button>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Musiker- oder Bandname</label>
                            <input type="text" name="bandName" class="input-field" value="${musicianObj?.name || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Künstler-Typ</label>
                            <select name="musicianType" class="input-field">
                                ${getSelectOptions(musicianTypesList, [musicianObj?.type || 'Solo'])}
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Standort (Stadt)</label>
                            <input type="text" name="location" class="input-field" value="${musicianObj?.location || ''}" required autocomplete="off">
                        </div>
                        <div class="form-group">
                            <label>Max. Reisebereitschaft (Umkreis km)</label>
                            <input type="number" name="radius" class="input-field" value="${musicianObj?.radius || 50}" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Max. Spieldauer (Stunden)</label>
                            <input type="number" name="maxDuration" step="0.5" class="input-field" value="${musicianObj?.maxDuration || 3}" required>
                        </div>
                        <div class="form-group">
                            <label>Mindest-Budget (€)</label>
                            <input type="number" name="minBudget" class="input-field" value="${musicianObj?.minBudget || 300}" required>
                        </div>
                    </div>
 
                    <div class="form-group">
                        <label>Technik (Sound-System/Equipment)</label>
                        <select name="technik" class="input-field">
                            <option value="Weiß ich noch nicht" ${(musicianObj?.technik || 'Weiß ich noch nicht') === 'Weiß ich noch nicht' ? 'selected' : ''}>Weiß ich noch nicht</option>
                            <option value="vorhanden" ${(musicianObj?.technik || '') === 'vorhanden' ? 'selected' : ''}>Vorhanden (bringe eigene Technik mit)</option>
                            <option value="nicht vorhanden" ${(musicianObj?.technik || '') === 'nicht vorhanden' ? 'selected' : ''}>Nicht vorhanden (benötige Technik vor Ort)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Genres (Halte Strg/Cmd für Mehrfachauswahl)</label>
                        <select name="genres" class="input-field" multiple style="height: 100px;">
                            ${getSelectOptions(genresList, musicianObj?.genres || [])}
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Instrumente (Halte Strg/Cmd für Mehrfachauswahl)</label>
                        <select name="instruments" class="input-field" multiple style="height: 100px;">
                            ${getSelectOptions(instrumentsList, musicianObj?.instruments || [])}
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Event-Arten (Mehrfachauswahl)</label>
                        <select name="eventTypes" class="input-field" multiple style="height: 100px;">
                            ${getSelectOptions(eventTypesList, musicianObj?.eventTypes || [])}
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Beschreibung</label>
                        <textarea name="description" class="input-field" rows="3" style="resize:vertical;" required>${musicianObj?.description || ''}</textarea>
                    </div>

                    <h4 style="font-family:var(--font-heading); font-size:1rem; margin:1.5rem 0 0.8rem; border-top:1px solid rgba(255,255,255,0.05); padding-top:1rem; color:var(--color-purple);"><i class="fa-solid fa-photo-film"></i> Portfolio & Medien</h4>
                    
                    <div style="display:flex; flex-direction:column; gap:1.5rem; background:rgba(255,255,255,0.01); border:1px solid var(--border-glass); padding:1rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
                        <div>
                            <h5 style="margin:0 0 0.5rem; font-size:0.85rem; color:var(--text-muted);">Fotos (Max. 3)</h5>
                            <div class="media-uploads-grid" id="modal-photos-grid"></div>
                        </div>
                        <div>
                            <h5 style="margin:0 0 0.5rem; font-size:0.85rem; color:var(--text-muted);">Videos (Max. 3)</h5>
                            <div class="media-uploads-grid" id="modal-videos-grid"></div>
                        </div>
                        <div>
                            <h5 style="margin:0 0 0.5rem; font-size:0.85rem; color:var(--text-muted);">Audio Demos (Max. 3)</h5>
                            <div class="media-uploads-grid" id="modal-audios-grid"></div>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary" style="width:100%; margin-top: 1rem; background: var(--color-purple); border-color: var(--color-purple);">
                        ${isEdit ? 'Änderungen speichern' : 'Profil erstellen'}
                    </button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('btn-close-musician-modal').addEventListener('click', closeModal);
    
    // Autocomplete inside modal
    const locInput = modalWrapper.querySelector('input[name="location"]');
    setupLocationAutocomplete(locInput);

    const selectPicBtn = document.getElementById('btn-select-musician-pic');
    const picInput = document.getElementById('musician-pic-file-input');
    const previewImg = document.getElementById('musician-modal-preview-img');

    if (selectPicBtn && picInput) {
        selectPicBtn.addEventListener('click', () => picInput.click());
        picInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    selectedBase64 = event.target.result;
                    if (previewImg) previewImg.src = selectedBase64;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Media renderer helper inside modal
    const renderModalMedia = () => {
        const pGrid = document.getElementById('modal-photos-grid');
        const vGrid = document.getElementById('modal-videos-grid');
        const aGrid = document.getElementById('modal-audios-grid');
        if (!pGrid || !vGrid || !aGrid) return;

        const musData = musicianObj || { photos: [], videos: [], audio: [] };
        if (!musData.photos) musData.photos = [];
        if (!musData.videos) musData.videos = [];
        if (!musData.audio) musData.audio = [];

        let pHTML = '';
        for(let i=0; i<3; i++) {
            if (musData.photos[i]) {
                pHTML += `
                    <div class="media-upload-item">
                        <img src="${musData.photos[i]}" class="media-preview-img">
                        <button type="button" class="media-delete-btn" data-type="photo" data-idx="${i}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
            } else {
                pHTML += `
                    <div class="media-upload-item btn-add-modal-photo" style="cursor:pointer;">
                        <i class="fa-solid fa-plus"></i>
                        <span style="font-size:0.65rem;">Hinzufügen</span>
                    </div>
                `;
            }
        }
        pGrid.innerHTML = pHTML;

        let vHTML = '';
        for(let i=0; i<3; i++) {
            if (musData.videos[i]) {
                vHTML += `
                    <div class="media-upload-item" style="background:#000;">
                        <i class="fa-solid fa-play" style="color:var(--color-cyan); font-size:1.5rem;"></i>
                        <span style="font-size:0.6; color:var(--text-muted)">Video_${i+1}</span>
                        <button type="button" class="media-delete-btn" data-type="video" data-idx="${i}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
            } else {
                vHTML += `
                    <div class="media-upload-item btn-add-modal-video" style="cursor:pointer;">
                        <i class="fa-solid fa-video"></i>
                        <span style="font-size:0.65rem;">Hinzufügen</span>
                    </div>
                `;
            }
        }
        vGrid.innerHTML = vHTML;

        let aHTML = '';
        for(let i=0; i<3; i++) {
            if (musData.audio[i]) {
                aHTML += `
                    <div class="media-upload-item" style="grid-column: span 1; justify-content:space-around; aspect-ratio: unset; padding: 0.5rem; height: auto;">
                        <span style="font-size:0.65rem; font-weight:600;"><i class="fa-solid fa-music"></i> Track_${i+1}</span>
                        <button type="button" class="media-delete-btn" data-type="audio" data-idx="${i}" style="position:static; margin-left:0.5rem;"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
            } else {
                aHTML += `
                    <div class="media-upload-item btn-add-modal-audio" style="cursor:pointer; aspect-ratio: unset; padding: 0.5rem; height: 35px; flex-direction:row; gap:0.5rem;">
                        <i class="fa-solid fa-microphone" style="font-size:0.8rem;"></i>
                        <span style="font-size:0.65rem;">Hinzufügen</span>
                    </div>
                `;
            }
        }
        aGrid.innerHTML = aHTML;

        pGrid.querySelectorAll('.btn-add-modal-photo').forEach(btn => {
            btn.addEventListener('click', () => {
                const randomId = Math.floor(Math.random() * 1000);
                const url = `https://picsum.photos/id/${randomId}/400/300`;
                musData.photos.push(url);
                renderModalMedia();
            });
        });
        vGrid.querySelectorAll('.btn-add-modal-video').forEach(btn => {
            btn.addEventListener('click', () => {
                musData.videos.push('mock_video_url');
                renderModalMedia();
            });
        });
        aGrid.querySelectorAll('.btn-add-modal-audio').forEach(btn => {
            btn.addEventListener('click', () => {
                musData.audio.push('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
                renderModalMedia();
            });
        });

        modalWrapper.querySelectorAll('.media-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const type = btn.getAttribute('data-type');
                const idx = parseInt(btn.getAttribute('data-idx'));
                if (type === 'photo') musData.photos.splice(idx, 1);
                else if (type === 'video') musData.videos.splice(idx, 1);
                else if (type === 'audio') musData.audio.splice(idx, 1);
                renderModalMedia();
            });
        });
    };

    renderModalMedia();

    const form = document.getElementById('musician-editor-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const musData = musicianObj || { photos: [], videos: [], audio: [] };
        if (!musData.photos) musData.photos = [];
        if (!musData.videos) musData.videos = [];
        if (!musData.audio) musData.audio = [];

        const data = {
            name: formData.get('bandName'),
            type: formData.get('musicianType'),
            location: formData.get('location'),
            radius: parseInt(formData.get('radius')) || 50,
            maxDuration: parseFloat(formData.get('maxDuration')) || 3,
            minBudget: parseFloat(formData.get('minBudget')) || 300,
            genres: Array.from(form.elements.genres.selectedOptions).map(o => o.value),
            instruments: Array.from(form.elements.instruments.selectedOptions).map(o => o.value),
            eventTypes: Array.from(form.elements.eventTypes.selectedOptions).map(o => o.value),
            description: formData.get('description'),
            technik: formData.get('technik') || "Weiß ich noch nicht",
            profilePic: selectedBase64,
            photos: musData.photos,
            videos: musData.videos,
            audio: musData.audio,
            contactName: `${state.currentUser.firstName} ${state.currentUser.lastName}`,
            phone: state.currentUser.phone,
            email: state.currentUser.email
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
                title: "Musiker angelegt! 🎶",
                message: `Das Profil "${data.name}" wurde erfolgreich veröffentlicht.`
            });
        }

        closeModal();
        const mainContainer = document.getElementById('app-main');
        renderMyMusicians(mainContainer);
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

    modalWrapper.classList.remove('hidden');

    if (type === 'auth') {
        renderAuthModal(modalWrapper, onSuccessCallback);
    } else if (type === 'premium') {
        renderPremiumModal(modalWrapper, onSuccessCallback);
    } else if (type === 'verification') {
        renderVerificationModal(modalWrapper, onSuccessCallback);
    }
    
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
    wrapper.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Mit GigConnAct verbinden</h3>
                <button class="close-modal-btn" id="btn-close-modal">&times;</button>
            </div>
            
            <div class="auth-tabs">
                <button class="auth-tab-btn active" id="tab-login-btn">Einloggen</button>
                <button class="auth-tab-btn" id="tab-register-btn">Registrieren</button>
            </div>

            <div class="modal-body">
                <form id="auth-login-form">
                    <div class="form-group">
                        <label>E-Mail-Adresse</label>
                        <input type="email" name="email" class="input-field" placeholder="deine@mail.de" required>
                        <p style="font-size:0.7rem; color:var(--text-muted); margin-top: 0.3rem;">Demo accounts: contact@neonbeats.de oder julia.michael.wedding2026@gmail.com</p>
                    </div>
                    <div class="form-group">
                        <label>Passwort</label>
                        <input type="password" name="password" class="input-field" placeholder="••••••••" required>
                        <p style="font-size:0.7rem; color:var(--text-muted); margin-top: 0.3rem;">Nutze 'pass123' für Demo-Accounts</p>
                    </div>
                    <div id="login-error-msg" class="text-red" style="font-size:0.8rem; margin-bottom: 1rem; display:none;"></div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        Jetzt einloggen
                    </button>
                </form>

                <form id="auth-register-form" class="hidden">
                    <div class="form-group">
                        <label>Ich registriere mich als...</label>
                        <div class="role-picker">
                            <div class="role-card active musician-role" id="role-picker-mus">
                                <i class="fa-solid fa-guitar"></i>
                                <h4>Musiker / Band</h4>
                                <p>Sucht Gigs & Events</p>
                            </div>
                            <div class="role-card" id="role-picker-org">
                                <i class="fa-solid fa-calendar-days"></i>
                                <h4>Veranstalter</h4>
                                <p>Sucht Musiker</p>
                            </div>
                        </div>
                    </div>

                    <div id="reg-fields-musician">
                        <h4 style="font-family: var(--font-heading); font-size:1rem; margin-bottom:1rem; color:var(--color-purple);">Infos zum Musiker / Band</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Musikername (Band/DJ)</label>
                                <input type="text" name="bandName" class="input-field" required>
                            </div>
                            <div class="form-group">
                                <label>Musiker-Typ</label>
                                <select name="musicianType" class="input-field">
                                    ${getSelectOptions(musicianTypesList)}
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Standort (Ort)</label>
                                <input type="text" name="musLocation" class="input-field" placeholder="z.B. München" required autocomplete="off">
                            </div>
                            <div class="form-group">
                                <label>Maximaler Umkreis (km)</label>
                                <input type="number" name="radius" class="input-field" value="50" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Max. Spieldauer (Stunden)</label>
                                <input type="number" name="maxDuration" step="0.5" class="input-field" value="3" required>
                            </div>
                            <div class="form-group">
                                <label>Mindest-Budget (€)</label>
                                <input type="number" name="minBudget" class="input-field" value="300" required>
                            </div>
                        </div>
 
                        <div class="form-group">
                            <label>Technik (Sound-System/Equipment)</label>
                            <select name="musTechnik" class="input-field">
                                <option value="Weiß ich noch nicht" selected>Weiß ich noch nicht</option>
                                <option value="vorhanden">Vorhanden (bringe eigene Technik mit)</option>
                                <option value="nicht vorhanden">Nicht vorhanden (benötige Technik vor Ort)</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Genres (Halte Strg/Cmd gedrückt)</label>
                            <select name="genres" class="input-field" multiple style="height: 100px;" required>
                                ${getSelectOptions(genresList)}
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Instrumente (Halte Strg/Cmd gedrückt)</label>
                            <select name="instruments" class="input-field" multiple style="height: 100px;" required>
                                ${getSelectOptions(instrumentsList)}
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Interessante Eventarten (Mehrfachauswahl)</label>
                            <select name="eventTypes" class="input-field" multiple style="height: 100px;" required>
                                ${getSelectOptions(eventTypesList)}
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Kalender-Verfügbarkeit (Freie Tage wählen)</label>
                            <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.5rem; line-height: 1.3;">
                                Jedes Datum ist standardmäßig als verfügbar vorausgewählt (lila markiert). Klicke auf ein Datum, um es abzuwählen. Nutze die Buttons unten für Massenaktionen.
                            </p>
                            
                            <div class="calendar-widget">
                                <div class="calendar-widget-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                    <button type="button" class="btn btn-secondary btn-sm" id="cal-prev-month" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;">&larr;</button>
                                    <span id="cal-current-month-year" style="font-weight: 600; font-size: 0.85rem; color: var(--text-main);">Juli 2026</span>
                                    <button type="button" class="btn btn-secondary btn-sm" id="cal-next-month" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;">&rarr;</button>
                                </div>
                                
                                <div class="calendar-widget-grid" id="cal-widget-days-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; margin-bottom: 0.8rem;">
                                    <!-- Populated dynamically via JS -->
                                </div>
                                
                                <div class="calendar-widget-actions" style="display: flex; gap: 8px;">
                                    <button type="button" class="btn btn-secondary btn-sm" id="cal-deselect-all" style="flex: 1; padding: 0.3rem; font-size: 0.75rem; background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; height: auto;">Alle abwählen</button>
                                    <button type="button" class="btn btn-secondary btn-sm" id="cal-select-all" style="flex: 1; padding: 0.3rem; font-size: 0.75rem; background: #dcfce7; color: #166534; border: 1px solid #86efac; height: auto;">Alle auswählen</button>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Beschreibung</label>
                            <textarea name="musDescription" class="input-field" rows="3" required></textarea>
                        </div>
                    </div>

                    <div id="reg-fields-organizer" class="hidden">
                        <h4 style="font-family: var(--font-heading); font-size:1rem; margin-bottom:1rem; color:var(--color-cyan);">Infos zum ersten Event</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Eventname</label>
                                <input type="text" name="eventName" class="input-field">
                            </div>
                            <div class="form-group">
                                <label>Event-Art</label>
                                <select name="eventType" class="input-field">
                                    ${getSelectOptions(eventTypesList)}
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Veranstaltungsort (Ort)</label>
                                <input type="text" name="orgLocation" class="input-field" placeholder="z.B. München" autocomplete="off">
                            </div>
                            <div class="form-group">
                                <label>Datum des Events</label>
                                <input type="date" name="eventDate" class="input-field">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Dauer (Stunden)</label>
                                <input type="number" name="duration" step="0.5" class="input-field" value="2">
                            </div>
                            <div class="form-group">
                                <label>Budget (€)</label>
                                <input type="number" name="budget" class="input-field" value="500">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Benötigte Genres (Halte Strg/Cmd)</label>
                            <select name="orgGenres" class="input-field" multiple style="height: 100px;">
                                ${getSelectOptions(genresList)}
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Erwartete Instrumente (Halte Strg/Cmd)</label>
                            <select name="orgInstruments" class="input-field" multiple style="height: 100px;">
                                ${getSelectOptions(instrumentsList)}
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Gesuchte Musiker-Typen (Mehrfachauswahl)</label>
                            <select name="orgMusicianTypes" class="input-field" multiple style="height: 100px;">
                                ${getSelectOptions(musicianTypesList)}
                            </select>
                        </div>
 
                        <div class="form-group">
                            <label>Technik (Sound-System/Equipment vor Ort)</label>
                            <select name="orgTechnik" class="input-field">
                                <option value="Weiß ich noch nicht" selected>Weiß ich noch nicht</option>
                                <option value="vorhanden">Vorhanden (Venue stellt Technik)</option>
                                <option value="nicht vorhanden">Nicht vorhanden (Musiker muss eigene Technik mitbringen)</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Eventbeschreibung</label>
                            <textarea name="orgDescription" class="input-field" rows="3"></textarea>
                        </div>
                    </div>

                    <!-- Personal details at the end -->
                    <div style="border-top:1px solid rgba(15,23,42,0.08); margin: 1.5rem 0; padding-top:1rem;"></div>
                    <h4 style="font-family: var(--font-heading); font-size:1rem; margin-bottom:1rem; color:var(--text-main);"><i class="fa-solid fa-user-lock"></i> Persönliche Kontaktdaten & Account erstellen</h4>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Vorname</label>
                            <input type="text" name="firstName" class="input-field" required>
                        </div>
                        <div class="form-group">
                            <label>Nachname</label>
                            <input type="text" name="lastName" class="input-field" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Firma / Unternehmen</label>
                        <input type="text" name="company" class="input-field" value="Privatperson" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Telefonnummer</label>
                            <input type="text" name="phone" class="input-field" required>
                        </div>
                        <div class="form-group">
                            <label>E-Mail-Adresse</label>
                            <input type="email" name="email" class="input-field" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Passwort</label>
                        <input type="password" name="password" class="input-field" placeholder="Sicheres Passwort" required>
                    </div>

                    <div id="reg-sepa-consent-container" style="margin-top: 1.5rem;">
                        <div class="sepa-panel">
                            <h5><i class="fa-solid fa-circle-info"></i> SEPA Lastschrift-Mandat</h5>
                            <p>Ich ermächtige GigConnAct, Zahlungen für das Musiker-Abonnement (5,00 € pro Monat) von meinem Bankkonto mittels Lastschrift einzuziehen. Zugleich weise ich mein Kreditinstitut an, die von GigConnAct auf mein Konto gezogenen Lastschriften einzulösen.</p>
                        </div>
                        <label class="form-checkbox" style="margin-bottom: 1.5rem;">
                            <input type="checkbox" name="sepaConsent" required>
                            <span>Ich stimme dem SEPA-Lastschriftmandat für das 5 € Abo zu.</span>
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

    const loginTab = document.getElementById('tab-login-btn');
    const registerTab = document.getElementById('tab-register-btn');
    const loginForm = document.getElementById('auth-login-form');
    const registerForm = document.getElementById('auth-register-form');

    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.elements.email.value;
        const password = loginForm.elements.password.value;
        const errDiv = document.getElementById('login-error-msg');

        const res = state.login(email, password);
        if (res.success) {
            closeModal();
            document.dispatchEvent(new CustomEvent('user-state-changed'));
            window.handleRouting();
            if (onSuccessCallback) onSuccessCallback();
        } else {
            errDiv.textContent = res.message;
            errDiv.style.display = 'block';
        }
    });

    const pickerMus = document.getElementById('role-picker-mus');
    const pickerOrg = document.getElementById('role-picker-org');
    const fieldsMus = document.getElementById('reg-fields-musician');
    const fieldsOrg = document.getElementById('reg-fields-organizer');
    let selectedRole = 'musician';

    pickerMus.addEventListener('click', () => {
        selectedRole = 'musician';
        pickerMus.classList.add('active');
        pickerOrg.classList.remove('active');
        fieldsMus.classList.remove('hidden');
        fieldsOrg.classList.add('hidden');
        
        const sepaContainer = document.getElementById('reg-sepa-consent-container');
        if (sepaContainer) {
            sepaContainer.classList.remove('hidden');
            const consentChk = sepaContainer.querySelector('input[name="sepaConsent"]');
            if (consentChk) consentChk.setAttribute('required', '');
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
        
        const sepaContainer = document.getElementById('reg-sepa-consent-container');
        if (sepaContainer) {
            sepaContainer.classList.add('hidden');
            const consentChk = sepaContainer.querySelector('input[name="sepaConsent"]');
            if (consentChk) consentChk.removeAttribute('required');
        }
        
        toggleRequired(fieldsOrg, true);
        toggleRequired(fieldsMus, false);
    });

    function toggleRequired(container, isRequired) {
        container.querySelectorAll('input, select, textarea').forEach(el => {
            if (isRequired) {
                if (el.type !== 'checkbox') {
                    el.setAttribute('required', '');
                } else if (el.name === 'sepaConsent') {
                    el.setAttribute('required', '');
                }
            } else {
                el.removeAttribute('required');
            }
        });
    }

    // Calendar Widget Logic
    let calDefaultState = 'all-selected';
    const calModifiedDates = new Set();
    let calCurrentMonth = new Date(2026, 6, 1); // July 2026

    let calIsDragging = false;
    let calDragTargetState = null;
    let calLastClickedDate = null;

    // Stop dragging on mouseup globally
    document.addEventListener('mouseup', () => {
        calIsDragging = false;
    });

    function toggleDate(dateStr, targetAvailable) {
        const isModified = calModifiedDates.has(dateStr);
        const isAvailable = calDefaultState === 'all-selected' ? !isModified : isModified;
        if (isAvailable === targetAvailable) return;
        
        if (isModified) {
            calModifiedDates.delete(dateStr);
        } else {
            calModifiedDates.add(dateStr);
        }
    }

    function renderCalendarWidget() {
        const grid = document.getElementById('cal-widget-days-grid');
        const monthYearLabel = document.getElementById('cal-current-month-year');
        if (!grid || !monthYearLabel) return;

        grid.innerHTML = '';

        // Headers
        const headers = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
        headers.forEach(h => {
            const hCell = document.createElement('div');
            hCell.className = 'calendar-day-header-cell';
            hCell.textContent = h;
            grid.appendChild(hCell);
        });

        const year = calCurrentMonth.getFullYear();
        const month = calCurrentMonth.getMonth();

        const monthNames = [
            "Januar", "Februar", "März", "April", "Mai", "Juni",
            "Juli", "August", "September", "Oktober", "November", "Dezember"
        ];
        monthYearLabel.textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1);
        let firstDayIndex = firstDay.getDay();
        firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

        const totalDays = new Date(year, month + 1, 0).getDate();
        const today = new Date(2026, 6, 14); // current date
        today.setHours(0,0,0,0);

        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day-cell empty';
            grid.appendChild(emptyCell);
        }

        for (let day = 1; day <= totalDays; day++) {
            const dateObj = new Date(year, month, day);
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            const cell = document.createElement('div');
            cell.className = 'calendar-day-cell';
            cell.textContent = day;

            if (dateObj < today) {
                cell.classList.add('past');
            } else {
                const isModified = calModifiedDates.has(dateStr);
                const isAvailable = calDefaultState === 'all-selected' ? !isModified : isModified;

                if (isAvailable) {
                    cell.classList.add('available');
                } else {
                    cell.classList.add('unavailable');
                }

                // Add drag selecting and shift range click support
                cell.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    calIsDragging = true;
                    const isMod = calModifiedDates.has(dateStr);
                    const isAvail = calDefaultState === 'all-selected' ? !isMod : isMod;
                    calDragTargetState = !isAvail;
                    
                    if (e.shiftKey && calLastClickedDate) {
                        const start = new Date(calLastClickedDate);
                        const end = new Date(dateStr);
                        const rangeStart = start < end ? start : end;
                        const rangeEnd = start < end ? end : start;
                        
                        const cur = new Date(rangeStart);
                        while (cur <= rangeEnd) {
                            const curStr = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
                            toggleDate(curStr, calDragTargetState);
                            cur.setDate(cur.getDate() + 1);
                        }
                    } else {
                        toggleDate(dateStr, calDragTargetState);
                        calLastClickedDate = dateStr;
                    }
                    renderCalendarWidget();
                });

                cell.addEventListener('mouseenter', () => {
                    if (calIsDragging && calDragTargetState !== null) {
                        toggleDate(dateStr, calDragTargetState);
                        renderCalendarWidget();
                    }
                });
            }

            grid.appendChild(cell);
        }
    }

    const prevMonthBtn = document.getElementById('cal-prev-month');
    const nextMonthBtn = document.getElementById('cal-next-month');
    const deselectAllBtn = document.getElementById('cal-deselect-all');
    const selectAllBtn = document.getElementById('cal-select-all');

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', (e) => {
            e.preventDefault();
            calCurrentMonth.setMonth(calCurrentMonth.getMonth() - 1);
            renderCalendarWidget();
        });
    }
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', (e) => {
            e.preventDefault();
            calCurrentMonth.setMonth(calCurrentMonth.getMonth() + 1);
            renderCalendarWidget();
        });
    }
    if (deselectAllBtn) {
        deselectAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            calDefaultState = 'all-deselected';
            calModifiedDates.clear();
            renderCalendarWidget();
        });
    }
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            calDefaultState = 'all-selected';
            calModifiedDates.clear();
            renderCalendarWidget();
        });
    }

    renderCalendarWidget();

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const errDiv = document.getElementById('register-error-msg');
        const email = registerForm.elements.email.value;
        
        const emailValidation = validateEmailAddress(email);
        if (!emailValidation.isValid) {
            errDiv.textContent = emailValidation.message;
            errDiv.style.display = 'block';
            errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const payload = {
            role: selectedRole,
            firstName: registerForm.elements.firstName.value,
            lastName: registerForm.elements.lastName.value,
            company: registerForm.elements.company.value,
            phone: registerForm.elements.phone.value,
            email: registerForm.elements.email.value.trim(),
            password: registerForm.elements.password.value
        };

        if (selectedRole === 'musician') {
            payload.bandName = registerForm.elements.bandName.value;
            payload.musicianType = registerForm.elements.musicianType.value;
            payload.location = registerForm.elements.musLocation.value;
            payload.radius = registerForm.elements.radius.value;
            payload.maxDuration = registerForm.elements.maxDuration.value;
            payload.minBudget = registerForm.elements.minBudget.value;
            payload.description = registerForm.elements.musDescription.value;
            payload.sepaConsent = registerForm.elements.sepaConsent.checked;
            payload.technik = registerForm.elements.musTechnik.value || "Weiß ich noch nicht";
            payload.genres = Array.from(registerForm.elements.genres.selectedOptions).map(o => o.value);
            payload.instruments = Array.from(registerForm.elements.instruments.selectedOptions).map(o => o.value);
            payload.eventTypes = Array.from(registerForm.elements.eventTypes.selectedOptions).map(o => o.value);
            payload.availability = {
                defaultState: calDefaultState,
                modifiedDates: Array.from(calModifiedDates)
            };
        } else {
            payload.eventName = registerForm.elements.eventName.value;
            payload.eventType = registerForm.elements.eventType.value;
            payload.location = registerForm.elements.orgLocation.value;
            payload.eventDate = registerForm.elements.eventDate.value;
            payload.duration = registerForm.elements.duration.value;
            payload.budget = registerForm.elements.budget.value;
            payload.description = registerForm.elements.orgDescription.value;
            payload.technik = registerForm.elements.orgTechnik.value || "Weiß ich noch nicht";
            payload.genres = Array.from(registerForm.elements.orgGenres.selectedOptions).map(o => o.value);
            payload.instruments = Array.from(registerForm.elements.orgInstruments.selectedOptions).map(o => o.value);
            payload.musicianTypes = Array.from(registerForm.elements.orgMusicianTypes.selectedOptions).map(o => o.value);
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
                    Für diese Demo kannst du die Registrierung direkt hier durch Klick auf den Bestätigungslink abschließen.
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
            else navigate('postbox');
        }
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
                    <h4 style="font-family: var(--font-heading); font-size:1.25rem; color: var(--text-main);">Wähle deine Zahlungsoption</h4>
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
                            <span style="font-size: 0.7rem; color: var(--text-muted);">Unbegrenzt freischalten, kündbar</span>
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

// ==========================================
// 5. APPLICATION INITIALIZATION & ROUTING
// ==========================================

function navigate(page) {
    const mainContainer = document.getElementById('app-main');
    if (!mainContainer) return;

    window.scrollTo(0, 0);
    updateNavbar();
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
        default:
            renderLandingPage(mainContainer, navigate);
            window.location.hash = '#/';
            break;
    }
}

function setActiveLink(linkId) {
    const link = document.getElementById(linkId);
    if (link) link.classList.add('active');
}

function updateNavbar() {
    const nav = document.getElementById('main-nav');
    const authArea = document.getElementById('auth-area');
    if (!nav || !authArea) return;

    const u = state.currentUser;
    const isLanding = !window.location.hash || window.location.hash === '#/' || window.location.hash === '#';

    if (u) {
        const unreadCount = state.getUnreadCount();
        const badgeHtml = unreadCount > 0 
            ? ` <span class="nav-badge" style="background: var(--color-red); color: white; border-radius: 50%; padding: 0.1rem 0.4rem; font-size: 0.7rem; font-weight: 700; margin-left: 0.3rem;">${unreadCount}</span>` 
            : '';

        const marketLinkHtml = u.role === 'musician' 
            ? `<a href="#/events" class="nav-link" id="link-events"><i class="fa-solid fa-calendar-days"></i> Event-Markt</a>` 
            : `<a href="#/musicians" class="nav-link" id="link-musicians"><i class="fa-solid fa-guitar"></i> Musiker-Markt</a>`;

        const myTabLinkHtml = u.role === 'musician'
            ? `<a href="#/my-musicians" class="nav-link" id="link-my-musicians"><i class="fa-solid fa-guitar"></i> Meine Musiker</a>`
            : `<a href="#/my-events" class="nav-link" id="link-my-events"><i class="fa-solid fa-calendar-check"></i> Meine Events</a>`;

        nav.innerHTML = `
            <a href="#/matches" class="nav-link" id="link-matches"><i class="fa-solid fa-handshake"></i> Matches</a>
            ${marketLinkHtml}
            <a href="#/postbox" class="nav-link" id="link-postbox"><i class="fa-solid fa-envelope"></i> Postfach${badgeHtml}</a>
            ${myTabLinkHtml}
        `;

        let creditsBadgeHtml = '';
        if (u.role === 'musician') {
            creditsBadgeHtml = `
                <div class="credits-badge" id="btn-navbar-credits" style="display:flex; align-items:center; gap:0.4rem; background:rgba(56,239,125,0.08); border:1px solid rgba(56,239,125,0.3); padding:0.3rem 0.7rem; border-radius:50px; font-size:0.8rem; font-weight:700; color:var(--color-green); cursor:pointer; transition: transform 0.2s, background 0.2s;" onmouseover="this.style.transform='scale(1.05)'; this.style.background='rgba(56,239,125,0.15)';" onmouseout="this.style.transform='scale(1)'; this.style.background='rgba(56,239,125,0.08)';" title="Credits aufladen">
                    <i class="fa-solid fa-coins" style="color: var(--color-green);"></i>
                    <span>${u.credits !== undefined ? u.credits : 0} Credits</span>
                </div>
            `;
        }

        authArea.innerHTML = `
            <div style="display:flex; align-items:center; gap:1.2rem;">
                ${creditsBadgeHtml}
                
                <div class="profile-dropdown-container">
                    <button class="profile-avatar-btn ${u.role === 'musician' ? 'musician-avatar' : ''}" id="btn-profile-dropdown" aria-label="Benutzermenü">
                        <i class="fa-regular fa-circle-user"></i>
                    </button>
                    <div class="profile-dropdown-menu" id="profile-dropdown-menu">
                        <div style="padding: 0.5rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom:0.3rem;">
                            <div style="font-size:0.8rem; font-weight:700;">${u.firstName} ${u.lastName}</div>
                            <div style="font-size:0.7rem; color:var(--text-muted); overflow:hidden; text-overflow:ellipsis; max-width:150px;">${u.email}</div>
                        </div>
                        <a href="#/profile" class="profile-dropdown-item ${u.role === 'musician' ? 'musician-item' : ''}" id="dropdown-link-profile">
                            <i class="fa-solid fa-user-gear"></i> Profil bearbeiten
                        </a>
                        <div class="profile-dropdown-divider"></div>
                        <button class="profile-dropdown-item logout-item" id="dropdown-btn-logout">
                            <i class="fa-solid fa-right-from-bracket"></i> Abmelden
                        </button>
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
        const profileLink = document.getElementById('dropdown-link-profile');
        if (profileLink) {
            profileLink.addEventListener('click', () => {
                menu.classList.remove('show');
            });
        }

        const logoutBtn = document.getElementById('dropdown-btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                menu.classList.remove('show');
                state.logout();
                showToast({
                    title: "Abgemeldet",
                    message: "Auf Wiedersehen!"
                });
                navigate('');
            });
        }
    } else {
        nav.innerHTML = '';
        authArea.innerHTML = `
            <button class="btn btn-secondary btn-sm" id="btn-login-trigger">
                <i class="fa-solid fa-sign-in-alt"></i> Anmelden ohne Passwort
            </button>
        `;
        document.getElementById('btn-login-trigger').addEventListener('click', () => {
            showModal('auth', () => {
                navigate('dashboard');
            });
        });
    }
}

function handleRouting() {
    const hash = window.location.hash;
    let page = hash.replace('#/', '');
    if (page === 'top-matches') page = 'matches';
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

document.addEventListener('DOMContentLoaded', () => {
    // Click outside to close profile dropdown
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('profile-dropdown-menu');
        const trigger = document.getElementById('btn-profile-dropdown');
        if (menu && trigger && !menu.contains(e.target) && !trigger.contains(e.target)) {
            menu.classList.remove('show');
        }
    });

    updateNavbar();
    window.addEventListener('hashchange', handleRouting);
    handleRouting();
    initAllLocationAutocompletes();

    document.getElementById('logo-link').addEventListener('click', (e) => {
        e.preventDefault();
        navigate('');
    });

    const resetBtn = document.getElementById('btn-reset-demo');
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.reload();
        });
    }

    document.addEventListener('user-state-changed', () => {
        updateNavbar();
        runMatchingMonitor();
    });

    function runMatchingMonitor() {
        if (state.currentUser) {
            checkAndNotifyMatches(state, showToast);
            if (window.matchIntervalId) clearInterval(window.matchIntervalId);
            window.matchIntervalId = setInterval(() => {
                checkAndNotifyMatches(state, showToast);
            }, 15000);
        } else {
            if (window.matchIntervalId) {
                clearInterval(window.matchIntervalId);
                window.matchIntervalId = null;
            }
        }
    }

    runMatchingMonitor();
});

function renderPostbox(container) {
    if (!state.currentUser) return;
    const u = state.currentUser;
    const isMusician = u.role === 'musician';
    const currentUserId = isMusician ? u.profileId : u.id;

    // Fetch user chats
    const chats = state.getChatsForUser(currentUserId);
    let activeTab = window.postboxActiveTab || 'perfect'; // 'perfect' | 'received' | 'sent' | 'system'
    let activeChatId = window.postboxActiveChatId || (chats.length > 0 ? chats[0].id : null);

    const renderView = () => {
        window.postboxActiveTab = activeTab;
        window.postboxActiveChatId = activeChatId;

        // Categorize chats
        const perfectChats = [];
        const receivedChats = [];
        const sentChats = [];
        const systemChats = [];

        chats.forEach(chat => {
            const isSys = chat.participants.includes('system');
            if (isSys) {
                systemChats.push(chat);
                return;
            }

            const counterpartyId = chat.participants.find(id => id !== currentUserId) || chat.participants[0];
            const eventId = chat.eventId;

            // Check interest status
            let mId = isMusician ? currentUserId : counterpartyId;
            let eId = eventId || (isMusician ? null : state.events.find(ev => ev.creatorId === currentUserId)?.id);

            const interest = state.interests?.find(i => i.musicianId === mId && (eId ? i.eventId === eId : true));
            const isPerfect = interest && interest.musicianInterested && interest.organizerInterested;

            if (isPerfect) {
                perfectChats.push(chat);
            } else {
                // Determine sender of first message
                const firstMsg = chat.messages[0];
                const isFirstMsgFromMe = firstMsg && firstMsg.senderId === currentUserId;

                if (isFirstMsgFromMe) {
                    sentChats.push(chat);
                } else {
                    receivedChats.push(chat);
                }
            }
        });

        let currentCategoryChats = [];
        if (activeTab === 'perfect') currentCategoryChats = perfectChats;
        else if (activeTab === 'received') currentCategoryChats = receivedChats;
        else if (activeTab === 'sent') currentCategoryChats = sentChats;
        else if (activeTab === 'system') currentCategoryChats = systemChats;

        if (!currentCategoryChats.some(c => c.id === activeChatId) && currentCategoryChats.length > 0) {
            activeChatId = currentCategoryChats[0].id;
        }

        const activeChat = chats.find(c => c.id === activeChatId);

        container.innerHTML = `
            <div class="portal-layout" style="display:flex; gap:1.5rem; height: calc(100vh - 160px); min-height: 550px;">
                
                <!-- Left Sidebar: Categories & Chat Threads List -->
                <div class="postbox-sidebar" style="width: 340px; flex-shrink: 0; background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--radius-md); display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-sm);">
                    
                    <!-- Postbox Header & Tabs -->
                    <div style="padding: 1rem; border-bottom: 1px solid var(--border-glass); background: rgba(255,255,255,0.01);">
                        <h3 style="margin: 0 0 0.8rem; font-size: 1.15rem; font-family: var(--font-heading); display:flex; align-items:center; gap:0.5rem; color:var(--text-main);">
                            <i class="fa-solid fa-envelope text-cyan"></i> Postfach
                        </h3>
                        
                        <!-- 4 Category Tabs -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem;">
                            <button class="btn btn-sm ${activeTab === 'perfect' ? 'btn-primary' : 'btn-glass'} tab-btn-postbox" data-tab="perfect" style="font-size: 0.72rem; padding: 0.4rem 0.2rem; text-align: center; margin:0;">
                                ðŸ’– Perfect (${perfectChats.length})
                            </button>
                            <button class="btn btn-sm ${activeTab === 'received' ? 'btn-primary' : 'btn-glass'} tab-btn-postbox" data-tab="received" style="font-size: 0.72rem; padding: 0.4rem 0.2rem; text-align: center; margin:0;">
                                ðŸ“¥ Erhalten (${receivedChats.length})
                            </button>
                            <button class="btn btn-sm ${activeTab === 'sent' ? 'btn-primary' : 'btn-glass'} tab-btn-postbox" data-tab="sent" style="font-size: 0.72rem; padding: 0.4rem 0.2rem; text-align: center; margin:0;">
                                ðŸ“¤ Gestellt (${sentChats.length})
                            </button>
                            <button class="btn btn-sm ${activeTab === 'system' ? 'btn-primary' : 'btn-glass'} tab-btn-postbox" data-tab="system" style="font-size: 0.72rem; padding: 0.4rem 0.2rem; text-align: center; margin:0;">
                                âš™ï¸ System (${systemChats.length})
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
                                const counterOrg = state.events.find(e => e.creatorId === counterpartyId);
                                if (counterMus) {
                                    name = counterMus.name;
                                    avatar = counterMus.profilePic || "https://picsum.photos/id/453/100/100";
                                } else if (counterOrg) {
                                    name = counterOrg.contactName || counterOrg.name;
                                    avatar = "https://picsum.photos/id/111/100/100";
                                }
                            }

                            const lastMsg = c.messages[c.messages.length - 1];
                            const isUnread = !state.readChats?.includes(c.id);

                            return `
                                <div class="thread-item ${isSelected ? 'selected' : ''}" data-chat-id="${c.id}" style="display: flex; align-items: center; gap: 0.8rem; padding: 0.7rem; border-radius: var(--radius-sm); cursor: pointer; margin-bottom: 0.3rem; transition: background 0.2s; background: ${isSelected ? 'rgba(0, 242, 254, 0.08)' : 'transparent'}; border: 1px solid ${isSelected ? 'rgba(0, 242, 254, 0.3)' : 'transparent'};">
                                    <img src="${avatar}" style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover; flex-shrink: 0;">
                                    <div style="flex: 1; min-width: 0;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.15rem;">
                                            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${name}</span>
                                            ${isUnread ? '<span style="width: 8px; height: 8px; border-radius: 50%; background: var(--color-cyan); display: inline-block;"></span>' : ''}
                                        </div>
                                        <div style="font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                            ${lastMsg ? lastMsg.text : 'Keine Nachrichten'}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Right Detail View: Chat Messages & Controls -->
                <div class="postbox-chat-detail" style="flex: 1; background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--radius-md); display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-sm);">
                    ${!activeChat ? `
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); padding: 2rem; text-align: center;">
                            <i class="fa-regular fa-comments" style="font-size: 3.5rem; color: var(--border-glass); margin-bottom: 1rem;"></i>
                            <h4 style="margin: 0 0 0.5rem; color: var(--text-main);">WÃ¤hle einen Unterhaltung aus</h4>
                            <p style="max-width: 360px; font-size: 0.85rem;">Klicke links auf eine Nachricht, um den Verlauf zu sehen und zu antworten.</p>
                        </div>
                    ` : (() => {
                        const isSys = activeChat.participants.includes('system');
                        const counterpartyId = activeChat.participants.find(id => id !== currentUserId) || activeChat.participants[0];
                        let name = "System";
                        let avatar = "https://picsum.photos/id/1025/100/100";

                        if (!isSys) {
                            const counterMus = state.musicians.find(m => m.id === counterpartyId);
                            const counterOrg = state.events.find(e => e.creatorId === counterpartyId);
                            if (counterMus) {
                                name = counterMus.name;
                                avatar = counterMus.profilePic || "https://picsum.photos/id/453/100/100";
                            } else if (counterOrg) {
                                name = counterOrg.contactName || counterOrg.name;
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
                                ${activeChat.messages.map(m => {
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
                                            Ist die Anfrage interessant fÃ¼r dich?
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
                                        <input type="text" id="chat-message-input" class="input-field" placeholder="${isSys ? 'Antworten auf Systemnachrichten nicht mÃ¶glich' : 'Schreibe eine Nachricht...'}" ${isSys ? 'disabled' : ''} required style="flex: 1; margin: 0; height: 42px;">
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
            item.addEventListener('click', () => {
                activeChatId = item.getAttribute('data-chat-id');
                renderView();
            });
        });

        // Question accept/decline handlers
        const acceptBtn = container.querySelector('.btn-accept-incoming-req');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                const mId = acceptBtn.getAttribute('data-musician-id');
                const eId = acceptBtn.getAttribute('data-event-id');
                state.acceptMusicianRequest(mId, eId);
                showToast({
                    title: "Perfect Match entstanden! ðŸŽ‰",
                    message: "Ihr habt nun gegenseitig Interesse bekundet. Du kannst jetzt direkt antworten."
                });
                activeTab = 'perfect';
                renderView();
            });
        }

        const declineBtn = container.querySelector('.btn-decline-incoming-req');
        if (declineBtn) {
            declineBtn.addEventListener('click', () => {
                const mId = declineBtn.getAttribute('data-musician-id');
                const eId = declineBtn.getAttribute('data-event-id');
                state.declineMusicianRequest(mId, eId);
                showToast({
                    title: "Anfrage abgelehnt",
                    message: "Die Anfrage wurde als nicht interessant markiert."
                });
                renderView();
            });
        }

        // Send message form handler
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
    };

    renderView();
}

function renderMarketGridHTML(items, isEvents) {
    if (!items || items.length === 0) {
        return `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-glass);">
                <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                <h3 style="margin-bottom: 0.5rem; color: var(--text-main);">Keine Ergebnisse gefunden</h3>
                <p style="color: var(--text-muted);">Versuche deine Filterkriterien anzupassen.</p>
            </div>
        `;
    }

    const themeColor = isEvents ? '#2563eb' : '#7c3aed';

    return items.map(item => {
        const isUnlocked = state.unlockedContacts && state.unlockedContacts.includes(item.id);
        
        // 3 Fotos pro Musiker/Event
        const photos = (item.photos || [
            item.image || (isEvents ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'),
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80'
        ]).slice(0, 3);

        // 3 Real Playable HTML5 Videos fÃ¼r Slides 4, 5, 6
        const videoSources = [
            { title: 'Live Performance Highlights', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
            { title: 'Auftritt Showreel & Trailer', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
            { title: 'Unplugged Live Session', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' }
        ];

        const genresList = (item.genres || (item.genre ? [item.genre] : ['Pop', 'Cover', 'Acoustic'])).join(', ');
        const instrumentsList = (item.instruments || (item.category ? [item.category] : ['Gesang', 'Gitarre'])).join(', ');
        
        let duration = item.duration || item.spieldauer || '2 - 4 Stunden';
        duration = duration.replace(/ca\.\s*/gi, '');

        const description = item.description || item.bio || (isEvents 
            ? 'Wir suchen eine professionelle musikalische Begleitung fÃ¼r unser anstehendes Event mit fantastischer Stimmung.' 
            : 'Professionelle Live-Musik fÃ¼r unvergessliche Momente bei Hochzeiten, Geburtstagen & Firmenevents.');

        const bandName = isEvents ? item.title : item.name;

        return `
            <div class="market-tile-card" style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm);">
                
                <!-- 1. Combined Galerie: 3 Fotos + 3 Videos direkt folgend (FÃœLLT DIE KACHEL IN DER BREITE 100% AUS) -->
                <div class="tile-fullwidth-photo-slider" style="position: relative; width: 100%; height: 235px; background: #0f172a; overflow: hidden;">
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
                                    Dein Browser unterstÃ¼tzt dieses Video nicht.
                                </video>
                                <span style="position: absolute; top: 12px; left: 12px; z-index: 4; font-size: 0.72rem; font-weight: 800; color: #fff; background: rgba(239, 68, 68, 0.9); padding: 0.25rem 0.6rem; border-radius: 6px; backdrop-filter: blur(4px);">
                                    ðŸŽ¬ Video #${vIdx + 1}: ${vid.title}
                                </span>
                            </div>
                        `).join('') : ''}
                    </div>

                    <!-- Bandname oben links auf dem Bild -->
                    <div style="position: absolute; top: 12px; left: 12px; z-index: 5; max-width: 65%;">
                        <span style="display: inline-block; padding: 0.45rem 0.95rem; border-radius: 20px; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(8px); color: #ffffff; font-size: 0.96rem; font-weight: 900; border: 1px solid rgba(255,255,255,0.25); box-shadow: 0 4px 12px rgba(0,0,0,0.4); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${bandName}
                        </span>
                    </div>

                    <!-- Match-Faktor Badge oben rechts (OHNE FLAMMEN-EMOJI / VORZEICHEN) -->
                    <div style="position: absolute; top: 12px; right: 12px; z-index: 5; background: ${themeColor}; color: #fff; padding: 0.45rem 1rem; border-radius: 14px; font-size: 0.95rem; font-weight: 900; box-shadow: 0 4px 14px rgba(0,0,0,0.4); letter-spacing: 0.5px;">
                        ${item.matchScore || '96'}% Match
                    </div>

                    <!-- Slide Navigation Arrows -->
                    <button onclick="const s=document.getElementById('combo-slider-${item.id}'); let cur=parseInt(s.getAttribute('data-idx')||'0'); cur=cur>0?cur-1:5; s.style.transform=\`translateX(-\${cur*100}%)\`; s.setAttribute('data-idx', cur); const lbl=this.nextElementSibling.nextElementSibling; if(cur<3){lbl.innerText=\`ðŸ“· \${cur+1} / 3 Fotos\`;}else{lbl.innerText=\`ðŸŽ¬ Video \${cur-2} / 3\`;}" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.68); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; backdrop-filter: blur(4px);">
                        <i class="fa-solid fa-chevron-left" style="font-size: 0.9rem;"></i>
                    </button>
                    <button onclick="const s=document.getElementById('combo-slider-${item.id}'); let cur=parseInt(s.getAttribute('data-idx')||'0'); cur=(cur+1)%6; s.style.transform=\`translateX(-\${cur*100}%)\`; s.setAttribute('data-idx', cur); const lbl=this.nextElementSibling; if(cur<3){lbl.innerText=\`ðŸ“· \${cur+1} / 3 Fotos\`;}else{lbl.innerText=\`ðŸŽ¬ Video \${cur-2} / 3\`;}" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.68); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; backdrop-filter: blur(4px);">
                        <i class="fa-solid fa-chevron-right" style="font-size: 0.9rem;"></i>
                    </button>

                    <!-- Photo / Video Counter Indicator -->
                    <span style="position: absolute; bottom: 10px; left: 12px; background: rgba(0,0,0,0.75); color: #ffffff; font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.65rem; border-radius: 6px; backdrop-filter: blur(4px); z-index: 5;">
                        ðŸ“· 1 / 3 Fotos
                    </span>
                </div>

                <!-- Tile Body Content -->
                <div style="padding: 1.2rem 1.3rem 0.8rem; flex: 1; display: flex; flex-direction: column;">
                    
                    <!-- 2. Einspaltige Informationen mit Icons (Genres & Instrumente direkt unter Musiker-Typ) -->
                    <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.88rem; color: var(--text-main); margin-bottom: 0.75rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-location-dot" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${item.location || 'Deutschlandweit'}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid ${isEvents ? 'fa-calendar-alt' : 'fa-guitar'}" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${isEvents ? (item.eventType || 'Event') : (item.category || 'Solo / Band')}</span>
                        </div>
                        
                        <!-- Genres DIREKT UNTER MUSIKER-TYP -->
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-music" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${genresList}</span>
                        </div>

                        <!-- Instrumente DIREKT UNTER GENRES -->
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-sliders" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${instrumentsList}</span>
                        </div>

                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-calendar-days" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${isEvents ? (item.date || 'Termin nach Absprache') : (item.availability || 'Auf Anfrage verfÃ¼gbar')}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-clock" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${duration}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-sack-dollar" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${isEvents ? (item.budget || 'Gage auf Anfrage') : (item.price || 'Honorar auf Anfrage')}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fa-solid fa-plug" style="color: ${themeColor}; width: 18px; text-align: center; font-size: 0.95rem;"></i>
                            <span>${item.equipment || 'Technik vorhanden'}</span>
                        </div>
                    </div>

                    <!-- 3. Beschreibung -->
                    <div style="margin-bottom: 0.6rem; padding-top: 0.6rem; border-top: 1px dashed rgba(255,255,255,0.08);">
                        <p style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.45; margin: 0;">
                            ${description}
                        </p>
                    </div>
                </div>

                <!-- 4. Aktions-Button: "Kontaktdaten freischalten" -->
                <div style="padding: 0 1.3rem 1.1rem;">
                    ${isUnlocked ? `
                        <!-- Freigeschaltete Kontaktdaten -->
                        <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 10px; padding: 0.75rem; font-size: 0.85rem; color: #4ade80; margin-bottom: 0.5rem;">
                            <div style="font-weight: 800; margin-bottom: 0.2rem;"><i class="fa-solid fa-unlock"></i> Kontaktdaten</div>
                            <div>Tel: ${item.phone || '+49 170 1234567'}</div>
                            <div>Mail: ${item.email || 'kontakt@gigconnact.de'}</div>
                        </div>
                        <button class="btn btn-primary" onclick="showModal('auth')" style="width: 100%; background: ${themeColor}; border-color: ${themeColor}; font-weight: 800; padding: 0.8rem; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 0.6rem;">
                            <i class="fa-solid fa-paper-plane"></i> Nachricht senden
                        </button>
                    ` : `
                        <!-- Kontaktdaten freischalten Button -->
                        <button class="btn btn-primary" onclick="showModal('auth')" style="width: 100%; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); border-color: #7c3aed; font-weight: 800; padding: 0.8rem; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 0.6rem; font-size: 0.88rem; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);">
                            <i class="fa-solid fa-lock"></i> Kontaktdaten freischalten
                        </button>
                    `}
                </div>
            </div>
        `;
    }).join('');
}