// ===== RETRO GRID CANVAS =====
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let gridOffset = 0;

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Perspective grid floor
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 1;

    const horizon = canvas.height * 0.4;
    const gridSpacing = 60;
    const numVerticalLines = 30;

    // Horizontal lines moving toward viewer
    for (let i = 0; i < 20; i++) {
        const y = horizon + (i + gridOffset / gridSpacing) * (canvas.height - horizon) / 15;
        if (y > horizon && y < canvas.height) {
            const alpha = Math.max(0, 0.15 - (y - horizon) / (canvas.height * 3));
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    // Vertical lines converging to vanishing point
    const vanishX = canvas.width / 2;
    for (let i = -numVerticalLines / 2; i <= numVerticalLines / 2; i++) {
        const bottomX = vanishX + i * gridSpacing * 3;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
        ctx.beginPath();
        ctx.moveTo(vanishX, horizon);
        ctx.lineTo(bottomX, canvas.height);
        ctx.stroke();
    }

    ctx.restore();

    // Sun/circle at horizon
    const gradient = ctx.createRadialGradient(vanishX, horizon, 0, vanishX, horizon, 200);
    gradient.addColorStop(0, 'rgba(255, 0, 255, 0.15)');
    gradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.05)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(vanishX - 200, horizon - 200, 400, 400);

    gridOffset = (gridOffset + 0.5) % gridSpacing;
    requestAnimationFrame(drawGrid);
}

drawGrid();

// ===== FLOATING PARTICLES =====
const particlesContainer = document.getElementById('particles');

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 8 + 4) + 's';
    particle.style.width = (Math.random() * 4 + 1) + 'px';
    particle.style.height = particle.style.width;

    const colors = ['#00f0ff', '#ff00ff', '#ffd700'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.boxShadow = `0 0 6px ${particle.style.background}`;

    particlesContainer.appendChild(particle);

    setTimeout(() => particle.remove(), 12000);
}

const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
setInterval(createParticle, isMobileDevice ? 800 : 300);

// ===== CUSTOM CURSOR =====
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.left = mouseX - 10 + 'px';
    cursorGlow.style.top = mouseY - 10 + 'px';
});

document.querySelectorAll('a, button, .play-btn, .track-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorGlow.style.width = '40px';
        cursorGlow.style.height = '40px';
        cursorGlow.style.left = mouseX - 20 + 'px';
        cursorGlow.style.top = mouseY - 20 + 'px';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(255, 0, 255, 0.6), transparent)';
    });
    el.addEventListener('mouseleave', () => {
        cursorGlow.style.width = '20px';
        cursorGlow.style.height = '20px';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(0, 240, 255, 0.8), transparent)';
    });
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== VISOR TEXT ANIMATION =====
const visorPhrases = [
    'EXPERIENCE MUSIC A WAY YOU NEVER FELT BEFORE',
    'DJ DOLLAR DAVID',
    'FEEL THE BASS',
    'WELCOME TO THE FUTURE',
    'ONE MORE TIME',
    'AROUND THE WORLD'
];
let phraseIndex = 0;
const visorText = document.getElementById('visorText');

function typeVisor() {
    const phrase = visorPhrases[phraseIndex];
    let charIndex = 0;
    visorText.textContent = '';

    const typeInterval = setInterval(() => {
        visorText.textContent += phrase[charIndex];
        charIndex++;
        if (charIndex >= phrase.length) {
            clearInterval(typeInterval);
            setTimeout(() => {
                phraseIndex = (phraseIndex + 1) % visorPhrases.length;
                typeVisor();
            }, 2000);
        }
    }, 80);
}

typeVisor();

// ===== REVEAL ON SCROLL =====
const revealElements = document.querySelectorAll('.reveal-text, .track-card, .event-card, .stat');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 100);
        }
    });
}, { threshold: 0.2 });

revealElements.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
const stats = document.querySelectorAll('.stat');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count);
            const numberEl = el.querySelector('.stat-number');
            let current = 0;
            const increment = Math.ceil(target / 60);
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                if (target >= 1000000) {
                    numberEl.textContent = (current / 1000000).toFixed(1) + 'M';
                } else if (target >= 1000) {
                    numberEl.textContent = Math.floor(current).toLocaleString();
                } else {
                    numberEl.textContent = current;
                }
            }, 30);
            statsObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

stats.forEach(stat => statsObserver.observe(stat));

// ===== WAVEFORM VISUALIZER =====
document.querySelectorAll('.waveform-canvas').forEach(canvas => {
    const c = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = 80;

    function drawWave() {
        c.clearRect(0, 0, canvas.width, canvas.height);
        const bars = 60;
        const barWidth = canvas.width / bars;

        for (let i = 0; i < bars; i++) {
            const h = Math.random() * 30 + 5;
            const hue = (i / bars) * 60 + 170;
            c.fillStyle = `hsla(${hue}, 100%, 60%, 0.6)`;
            c.fillRect(i * barWidth, (canvas.height - h) / 2, barWidth - 2, h);
        }
        requestAnimationFrame(drawWave);
    }
    drawWave();
});

// ===== WAVEFORM VISUAL IN TRACK ART =====
document.querySelectorAll('.waveform-visual').forEach(container => {
    for (let i = 0; i < 40; i++) {
        const bar = document.createElement('div');
        bar.style.cssText = `
            width: 3px;
            background: linear-gradient(180deg, #00f0ff, #ff00ff);
            border-radius: 2px;
            animation: equalizer ${0.5 + Math.random() * 0.8}s ease-in-out infinite alternate;
            animation-delay: ${Math.random() * 0.5}s;
            min-height: 4px;
        `;
        container.appendChild(bar);
    }
});

// ===== TRACK CARD VISIBILITY =====
document.querySelectorAll('.track-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
});

// ===== DECK WAVEFORMS =====
function initDeckWaveforms() {
    ['waveLeft', 'waveRight'].forEach((id, idx) => {
        const c = document.getElementById(id);
        if (!c) return;
        const ctx2 = c.getContext('2d');
        // Use parent size as fallback if offsetWidth is 0
        const w = c.offsetWidth || c.parentElement?.offsetWidth || 200;
        const h = c.offsetHeight || c.parentElement?.offsetHeight || 50;
        c.width = w * 2;
        c.height = h * 2;
        let t = idx * 80;

        function drawDeckWave() {
            ctx2.clearRect(0, 0, c.width, c.height);
            const bars = 50;
            const bw = c.width / bars;
            for (let i = 0; i < bars; i++) {
                const h2 = (Math.sin((i + t) * 0.25) * 0.4 + 0.5 + Math.random() * 0.15) * c.height * 0.7;
                const hue = idx === 0 ? 186 : 300;
                ctx2.fillStyle = `hsla(${hue}, 100%, 60%, 0.7)`;
                ctx2.fillRect(i * bw + 1, (c.height - h2) / 2, bw - 2, h2);
            }
            t++;
            requestAnimationFrame(drawDeckWave);
        }
        drawDeckWave();
    });
}
// Wait for full layout before sizing canvases
if (document.readyState === 'complete') {
    initDeckWaveforms();
} else {
    window.addEventListener('load', initDeckWaveforms);
}

// ===== MURAKAMI FLOWERS =====
function createMurakamiFlower(x, y, size) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 5;
        opacity: 0;
        transition: opacity 0.5s, transform 0.5s;
        filter: drop-shadow(0 0 8px rgba(255, 0, 255, 0.4));
    `;

    const petalColors = ['#ff00ff', '#00f0ff', '#ffd700', '#ff3366', '#66ff33', '#ff6600'];
    const centerColors = ['#fff', '#ffd700', '#ff00ff'];
    const color = petalColors[Math.floor(Math.random() * petalColors.length)];
    const centerColor = centerColors[Math.floor(Math.random() * centerColors.length)];
    const numPetals = 6 + Math.floor(Math.random() * 4);

    let petals = '';
    for (let i = 0; i < numPetals; i++) {
        const angle = (360 / numPetals) * i;
        petals += `<ellipse cx="50" cy="25" rx="16" ry="22" fill="${color}" opacity="0.85"
            transform="rotate(${angle} 50 50)" />`;
    }

    // Smiley face center (Murakami signature)
    svg.innerHTML = `
        ${petals}
        <circle cx="50" cy="50" r="18" fill="${centerColor}" />
        <circle cx="43" cy="46" r="4" fill="#111" />
        <circle cx="57" cy="46" r="4" fill="#111" />
        <path d="M 40 55 Q 50 65 60 55" stroke="#111" stroke-width="2.5" fill="none" stroke-linecap="round" />
    `;

    return svg;
}

// Scatter static Murakami flowers as decoration
function scatterFlowers() {
    const positions = [
        { x: '5%', y: '15%', size: 50, delay: 0 },
        { x: '92%', y: '20%', size: 40, delay: 0.5 },
        { x: '8%', y: '85%', size: 35, delay: 1 },
        { x: '88%', y: '75%', size: 45, delay: 1.5 },
        { x: '50%', y: '95%', size: 30, delay: 2 },
        { x: '15%', y: '50%', size: 25, delay: 0.8 },
        { x: '85%', y: '45%', size: 35, delay: 1.2 },
    ];

    positions.forEach(pos => {
        const flower = createMurakamiFlower(0, 0, pos.size);
        flower.style.left = pos.x;
        flower.style.top = pos.y;
        flower.style.animation = `flower-float ${3 + Math.random() * 3}s ease-in-out infinite, flower-spin ${8 + Math.random() * 6}s linear infinite`;
        flower.style.animationDelay = `${pos.delay}s`;

        document.body.appendChild(flower);
        setTimeout(() => { flower.style.opacity = '0.7'; }, pos.delay * 1000 + 500);
    });
}

// Flower burst on click
document.addEventListener('click', (e) => {
    for (let i = 0; i < 5; i++) {
        const size = 20 + Math.random() * 30;
        const flower = createMurakamiFlower(
            e.clientX - size / 2 + (Math.random() - 0.5) * 100,
            e.clientY - size / 2 + (Math.random() - 0.5) * 100,
            size
        );
        document.body.appendChild(flower);
        setTimeout(() => {
            flower.style.opacity = '0.9';
            flower.style.transform = `scale(1.2) rotate(${Math.random() * 360}deg)`;
        }, 50);
        setTimeout(() => {
            flower.style.opacity = '0';
            flower.style.transform = `scale(0) rotate(${Math.random() * 720}deg)`;
        }, 1500);
        setTimeout(() => flower.remove(), 2500);
    }
});

scatterFlowers();

// Add flower animation keyframes
const flowerStyle = document.createElement('style');
flowerStyle.textContent = `
    @keyframes flower-float {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-15px) scale(1.1); }
    }
    @keyframes flower-spin {
        from { rotate: 0deg; }
        to { rotate: 360deg; }
    }
`;
document.head.appendChild(flowerStyle);

// ===== BOOKING WIZARD =====
(function () {
    const state = {
        step: 1,
        package: null,
        packageLabel: '',
        packagePrice: '',
        date: null,
        time: null,
        name: '', email: '', phone: '', venue: '', notes: ''
    };

    // Simulate some pre-booked slots
    const bookedSlots = {
        // format: 'YYYY-MM-DD': ['10:00 PM', '11:00 PM']
    };

    const allSlots = [
        '6:00 PM','7:00 PM','8:00 PM','9:00 PM',
        '10:00 PM','11:00 PM','12:00 AM','1:00 AM'
    ];

    // ── Step navigation ──────────────────────────────────────
    function goToStep(n) {
        document.querySelectorAll('.wizard-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('step' + n).classList.add('active');

        document.querySelectorAll('.wizard-step').forEach(s => {
            const sn = parseInt(s.dataset.step);
            s.classList.toggle('active', sn === n);
            s.classList.toggle('done', sn < n);
        });

        document.querySelectorAll('.wizard-connector').forEach((c, i) => {
            c.classList.toggle('done', i < n - 1);
        });

        state.step = n;
    }

    // ── Package selection ────────────────────────────────────
    document.querySelectorAll('.package-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.package-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            state.package = card.dataset.package;
            state.packageLabel = card.querySelector('h4').textContent;
            state.packagePrice = card.dataset.price;
            state.packageDuration = card.dataset.duration;
            setTimeout(() => goToStep(2), 300);
        });
    });

    // ── Calendar ─────────────────────────────────────────────
    let viewDate = new Date();
    viewDate.setDate(1);

    function renderCalendar() {
        const now = new Date();
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const monthNames = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
                            'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];

        document.getElementById('calMonthYear').textContent = monthNames[month] + ' ' + year;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const container = document.getElementById('calDays');
        container.innerHTML = '';

        // Empty cells
        for (let i = 0; i < firstDay; i++) {
            const el = document.createElement('div');
            el.className = 'cal-day empty';
            container.appendChild(el);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const el = document.createElement('div');
            const thisDate = new Date(year, month, d);
            const isPast = thisDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const isToday = thisDate.toDateString() === now.toDateString();
            const dateKey = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const isSelected = state.date === dateKey;

            el.className = 'cal-day' + (isPast ? ' past' : ' available') +
                           (isToday ? ' today' : '') +
                           (isSelected ? ' selected' : '');
            el.textContent = d;

            if (!isPast) {
                el.addEventListener('click', () => selectDate(dateKey, d, monthNames[month], year));
            }
            container.appendChild(el);
        }
    }

    function selectDate(key, day, monthName, year) {
        state.date = key;
        state.time = null;
        document.getElementById('selectedDateLabel').textContent =
            `AVAILABLE TIMES — ${monthName.slice(0,3)} ${day}, ${year}`;
        renderCalendar();
        renderTimeslots(key);
        checkStep2();
    }

    function renderTimeslots(dateKey) {
        const booked = bookedSlots[dateKey] || [];
        const container = document.getElementById('timeslots');
        container.innerHTML = '';
        allSlots.forEach(slot => {
            const el = document.createElement('div');
            const isBooked = booked.includes(slot);
            const isSelected = state.time === slot;
            el.className = 'timeslot ' + (isBooked ? 'booked' : 'available') + (isSelected ? ' selected' : '');
            el.textContent = slot;
            if (!isBooked) {
                el.addEventListener('click', () => {
                    state.time = slot;
                    document.querySelectorAll('.timeslot').forEach(t => t.classList.remove('selected'));
                    el.classList.add('selected');
                    checkStep2();
                });
            }
            container.appendChild(el);
        });
    }

    function checkStep2() {
        const btn = document.getElementById('step2Next');
        btn.disabled = !(state.date && state.time);
    }

    document.getElementById('calPrev').addEventListener('click', () => {
        viewDate.setMonth(viewDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('calNext').addEventListener('click', () => {
        viewDate.setMonth(viewDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();

    // ── Step 2 next ──────────────────────────────────────────
    document.getElementById('step2Next').addEventListener('click', () => goToStep(3));

    // ── Step 3 next ──────────────────────────────────────────
    document.getElementById('step3Next').addEventListener('click', () => {
        const name = document.getElementById('bName').value.trim();
        const email = document.getElementById('bEmail').value.trim();
        const venue = document.getElementById('bVenue').value.trim();
        if (!name || !email || !venue) {
            [document.getElementById('bName'), document.getElementById('bEmail'), document.getElementById('bVenue')]
                .forEach(el => {
                    if (!el.value.trim()) el.style.borderBottomColor = 'var(--neon-magenta)';
                });
            return;
        }
        state.name = name;
        state.email = email;
        state.phone = document.getElementById('bPhone').value.trim();
        state.venue = venue;
        state.notes = document.getElementById('bNotes').value.trim();
        renderSummary();
        goToStep(4);
    });

    // ── Summary ──────────────────────────────────────────────
    function renderSummary() {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const [y, m, d] = state.date.split('-');
        const dateStr = `${months[parseInt(m)-1]} ${parseInt(d)}, ${y}`;

        document.getElementById('bookingSummary').innerHTML = `
            <div class="summary-item">
                <span class="summary-label">PACKAGE</span>
                <span class="summary-value highlight">${state.packageLabel}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">PRICE</span>
                <span class="summary-value highlight">${state.packagePrice}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">DATE</span>
                <span class="summary-value">${dateStr}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">TIME</span>
                <span class="summary-value">${state.time}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">NAME</span>
                <span class="summary-value">${state.name}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">EMAIL</span>
                <span class="summary-value">${state.email}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">VENUE</span>
                <span class="summary-value">${state.venue}</span>
            </div>
            ${state.notes ? `<div class="summary-item" style="grid-column:1/-1">
                <span class="summary-label">NOTES</span>
                <span class="summary-value">${state.notes}</span>
            </div>` : ''}
        `;
    }

    // ── Confirm ──────────────────────────────────────────────
    document.getElementById('confirmBooking').addEventListener('click', () => {
        const btn = document.getElementById('confirmBooking');
        btn.textContent = 'TRANSMITTING...';
        btn.disabled = true;

        // Simulate network request
        setTimeout(() => {
            document.getElementById('successMsg').textContent =
                `${state.packageLabel} · ${state.date} at ${state.time}`;
            goToStep(5);
        }, 1500);
    });

    // ── New booking ──────────────────────────────────────────
    document.getElementById('newBooking').addEventListener('click', () => {
        state.package = null; state.date = null; state.time = null;
        state.name = ''; state.email = ''; state.phone = '';
        state.venue = ''; state.notes = '';
        document.querySelectorAll('.package-card').forEach(c => c.classList.remove('selected'));
        document.getElementById('bookingForm').reset();
        document.getElementById('timeslots').innerHTML = '';
        document.getElementById('selectedDateLabel').textContent = 'Select a date to see available times';
        viewDate = new Date(); viewDate.setDate(1);
        renderCalendar();
        checkStep2();
        goToStep(1);
    });

    // ── Back buttons ─────────────────────────────────────────
    document.querySelectorAll('.wizard-back').forEach(btn => {
        btn.addEventListener('click', () => goToStep(parseInt(btn.dataset.target)));
    });
})();

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== FORM HANDLING — Formspree =====
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');

    // Replace YOUR_FORM_ID below with the ID from formspree.io
    const FORMSPREE_ID = 'YOUR_FORM_ID';

    btnText.textContent = 'SENDING...';
    btn.disabled = true;

    const data = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value,
        _replyto: form.email.value,
        _subject: 'New message from DJ Dollar David site'
    };

    try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            btnText.textContent = 'TRANSMITTED ✓';
            btn.style.borderColor = '#00ff88';
            btn.style.color = '#00ff88';
            form.reset();
            setTimeout(() => {
                btnText.textContent = 'TRANSMIT';
                btn.style.borderColor = '';
                btn.style.color = '';
                btn.disabled = false;
            }, 4000);
        } else {
            throw new Error('Failed');
        }
    } catch {
        btnText.textContent = 'ERROR — TRY AGAIN';
        btn.style.borderColor = '#ff3366';
        btn.style.color = '#ff3366';
        btn.disabled = false;
        setTimeout(() => {
            btnText.textContent = 'TRANSMIT';
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 3000);
    }
});

// ===== 3D CONTROLLER TILT ON MOUSE MOVE =====
const rig = document.querySelector('.controller-rig');
if (rig && !isMobileDevice) {
    const baseX = 28;
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5);
        const y = (e.clientY / window.innerHeight - 0.5);
        const tiltX = baseX - y * 8;
        const tiltY = x * 6;
        rig.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        rig.style.transition = 'transform 0.12s ease-out';
    });

    document.addEventListener('mouseleave', () => {
        rig.style.transform = `rotateX(${baseX}deg) rotateY(0deg)`;
        rig.style.transition = 'transform 0.6s ease';
    });
}
