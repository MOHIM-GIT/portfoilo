/* ==========================================================================
   FUTURE HUD LOGIC SYSTEM - MOHIM DAS PORTFOLIO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Check if libraries are loaded
    const hasThree = typeof THREE !== 'undefined';
    const hasGSAP = typeof gsap !== 'undefined';

    // Register GSAP ScrollTrigger if available
    if (hasGSAP && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* --- 1. HUD LIVE SYSTEM TIME --- */
    function updateHUDTime() {
        const hudTimeEl = document.getElementById('hud-live-time');
        if (hudTimeEl) {
            const now = new Date();
            const timeStr = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
            hudTimeEl.textContent = timeStr;
        }
    }
    updateHUDTime();
    setInterval(updateHUDTime, 1000);

    /* --- ANIMATE MOTIVATION TICKER (LOOPING ENHANCED SYSTEM) --- */
    const motivationEl = document.getElementById('motivation-ticker');
    if (motivationEl) {
        const motivationLines = [
            "\"No connections. No funding. No shortcuts. Just a laptop, a dream, and an obsession to build something that matters.\" — MOHIM DAS // The future belongs to builders.",
            "\"They ignored the beginner. They laughed at the dream. They doubted the vision. Now the vision is becoming reality.\" — MOHIM DAS // Building today what others will use tomorrow.",
            "\"While others were waiting for opportunities, I was creating them.\" — MOHIM DAS // Every line of code is a step closer to the future.",
            "\"They said I was too young. So I decided to let my work speak louder than my age.\" — MOHIM DAS 🚀 // The mission is bigger than the obstacles."
        ];
        
        let lineIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        
        function tickMotivation() {
            const currentLine = motivationLines[lineIdx];
            
            if (isDeleting) {
                charIdx--;
            } else {
                charIdx++;
            }
            
            motivationEl.textContent = currentLine.substring(0, charIdx);
            
            let speed = isDeleting ? 15 : 30;
            
            if (!isDeleting && charIdx === currentLine.length) {
                speed = 5000; // Pause at full line for 5 seconds
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                lineIdx = (lineIdx + 1) % motivationLines.length;
                speed = 800; // Pause before typing next line
            }
            
            setTimeout(tickMotivation, speed);
        }
        // Start typing after loader closes
        setTimeout(tickMotivation, 2500);
    }

    /* --- 2. DUAL-RING CUSTOM CURSOR --- */
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant cursor dot tracking
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    // Interpolated cursor outer ring tracking for smooth trailing
    if (cursor) {
        function updateCursorOuter() {
            // GSAP-like manual interpolation if GSAP is not running
            const dx = mouseX - currentX;
            const dy = mouseY - currentY;
            currentX += dx * 0.15;
            currentY += dy * 0.15;
            
            cursor.style.left = `${currentX}px`;
            cursor.style.top = `${currentY}px`;
            
            requestAnimationFrame(updateCursorOuter);
        }
        updateCursorOuter();
    }

    // Hover detection for interactive items
    const interactiveSelectors = 'a, button, input, textarea, .project-card, .social-icon-box, .nav-link, .achievement-badge';
    function attachCursorHovers() {
        const elements = document.querySelectorAll(interactiveSelectors);
        elements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovered-link');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovered-link');
            });
        });
    }
    attachCursorHovers();

    /* --- 3. CINEMATIC ENTRANCE LOADER --- */
    const loaderEl = document.getElementById('loader');
    const percentageEl = document.getElementById('loader-percentage');
    const logoContainerEl = document.querySelector('.loader-logo-container');
    
    let loadCount = 0;
    
    function runSimulatedLoader() {
        const interval = setInterval(() => {
            // Dynamic loading increments
            const step = Math.floor(Math.random() * 8) + 2;
            loadCount = Math.min(100, loadCount + step);
            
            if (percentageEl) {
                percentageEl.textContent = `${loadCount.toString().padStart(2, '0')}%`;
            }
            
            // Show Logo reveal halfway
            if (loadCount >= 60 && logoContainerEl) {
                logoContainerEl.style.opacity = '1';
                logoContainerEl.style.transform = 'translateY(0)';
            }
            
            if (loadCount >= 100) {
                clearInterval(interval);
                setTimeout(closeLoaderOverlay, 600);
            }
        }, 80);
    }
    runSimulatedLoader();

    function closeLoaderOverlay() {
        if (!loaderEl) return;
        
        const panelLeft = document.querySelector('.panel-left');
        const panelRight = document.querySelector('.panel-right');
        
        // Animate panels split open using GSAP
        if (hasGSAP) {
            gsap.timeline({
                onComplete: () => {
                    loaderEl.style.display = 'none';
                    // Trigger entrance animations for Hero Section
                    triggerHeroAnimations();
                }
            })
            .to('.loader-hud-container', { duration: 0.5, opacity: 0, scale: 0.9, ease: 'power2.in' })
            .to(panelLeft, { duration: 1, x: '-100%', ease: 'power3.inOut' }, '-=0.2')
            .to(panelRight, { duration: 1, x: '100%', ease: 'power3.inOut' }, '-=1');
        } else {
            // Fallback without GSAP
            panelLeft.style.transform = 'translateX(-100%)';
            panelRight.style.transform = 'translateX(100%)';
            loaderEl.style.opacity = '0';
            setTimeout(() => {
                loaderEl.style.display = 'none';
            }, 1000);
        }
    }

    /* --- 4. HERO SECTION ENTRANCE ANIMATIONS --- */
    function triggerHeroAnimations() {
        if (!hasGSAP) return;
        
        // Setup initial states
        gsap.set('.hero-bg-image', { opacity: 0, scale: 1.05 });
        gsap.set('.animate-fade', { opacity: 0, y: 20 });
        gsap.set('.animate-title', { opacity: 0, x: -50 });
        gsap.set('.animate-subtitle', { opacity: 0, x: -30 });
        gsap.set('.animate-portrait', { opacity: 0, scale: 0.9, rotateY: 15 });
        
        const tl = gsap.timeline();
        tl.to('.hero-bg-image', { duration: 1.8, opacity: 1, scale: 1, ease: 'power2.out' })
          .to('.animate-title', { duration: 0.8, opacity: 1, x: 0, ease: 'power3.out' }, '-=1.4')
          .to('.animate-subtitle', { duration: 0.6, opacity: 1, x: 0, ease: 'power3.out' }, '-=0.4')
          .to('.animate-fade', { duration: 0.6, opacity: 1, y: 0, stagger: 0.15, ease: 'power2.out' }, '-=0.3')
          .to('.animate-portrait', { duration: 1, opacity: 1, scale: 1, rotateY: 0, ease: 'power4.out' }, '-=0.8')
          .from('.floating-element', { duration: 1, opacity: 0, stagger: 0.1, y: 30, ease: 'back.out(1.7)' }, '-=0.5')
          .from('.hud-header', { duration: 0.6, opacity: 0, y: -20, ease: 'power2.out' }, '-=0.8');
    }

    /* --- 5. DYNAMIC TYPING TERMINAL TEXT --- */
    const typingTexts = [
        "Building CodeLX",
        "Full Stack Developer",
        "AI Enthusiast",
        "Startup Founder",
        "Future Google Engineer"
    ];
    
    const typingSpan = document.getElementById('typing-text');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        if (!typingSpan) return;
        
        const currentText = typingTexts[textIndex];
        
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }
        
        typingSpan.textContent = currentText.substring(0, charIndex);
        
        let typeSpeed = isDeleting ? 40 : 80;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            typeSpeed = 500; // Pause before typing next word
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    setTimeout(typeEffect, 2000); // Wait for loader

    /* --- 6. FLOATING HUD DEPTH (PARALLAX EFFECT) --- */
    window.addEventListener('mousemove', (e) => {
        const floatEls = document.querySelectorAll('.floating-element');
        const xOffset = (window.innerWidth / 2 - e.clientX) * 0.03;
        const yOffset = (window.innerHeight / 2 - e.clientY) * 0.03;
        
        floatEls.forEach(el => {
            const depth = parseFloat(el.getAttribute('data-depth')) || 0.3;
            const moveX = xOffset * depth * 10;
            const moveY = yOffset * depth * 10;
            el.style.transform = `translate(${moveX}px, ${moveY}px) translateY(${Math.sin(Date.now() * 0.0015 + depth * 10) * 8}px)`;
        });
    });

    /* --- 7. THREE.JS STARFIELD BACKGROUND --- */
    if (hasThree) {
        initStarfieldBackground();
    }
    
    function initStarfieldBackground() {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 1;
        
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Resize Handler
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Particles setup
        const particleCount = 800;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        
        for (let i = 0; i < particleCount; i++) {
            // Position
            positions[i * 3] = (Math.random() - 0.5) * 5;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
            
            // Velocity
            velocities.push({
                x: (Math.random() - 0.5) * 0.002,
                y: (Math.random() - 0.5) * 0.002,
                z: (Math.random() - 0.5) * 0.002
            });
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Glowing red particle material
        const material = new THREE.PointsMaterial({
            color: new THREE.Color(0xff3333),
            size: 0.008,
            transparent: true,
            opacity: 0.6,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        
        const starPoints = new THREE.Points(geometry, material);
        scene.add(starPoints);
        
        // Interactive Mouse Position coordinates
        let targetX = 0;
        let targetY = 0;
        
        window.addEventListener('mousemove', (e) => {
            targetX = (e.clientX - window.innerWidth / 2) * 0.0003;
            targetY = (e.clientY - window.innerHeight / 2) * 0.0003;
        });
        
        // Render loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Subtle rotation
            starPoints.rotation.y += 0.0005;
            starPoints.rotation.x += 0.0002;
            
            // Follow mouse slightly
            starPoints.rotation.y += (targetX - starPoints.rotation.y) * 0.05;
            starPoints.rotation.x += (targetY - starPoints.rotation.x) * 0.05;
            
            const posAttr = geometry.getAttribute('position');
            const arr = posAttr.array;
            
            // Move particles slowly in random directions
            for (let i = 0; i < particleCount; i++) {
                arr[i * 3] += velocities[i].x;
                arr[i * 3 + 1] += velocities[i].y;
                arr[i * 3 + 2] += velocities[i].z;
                
                // Boundary check
                if (Math.abs(arr[i * 3]) > 2.5) velocities[i].x *= -1;
                if (Math.abs(arr[i * 3 + 1]) > 2.5) velocities[i].y *= -1;
                if (Math.abs(arr[i * 3 + 2]) > 2.5) velocities[i].z *= -1;
            }
            
            posAttr.needsUpdate = true;
            renderer.render(scene, camera);
        }
        animate();
    }

    /* --- 8. THREE.JS 3D SCI-FI WIREFRAME GLOBE --- */
    if (hasThree) {
        initThreeGlobe();
    }
    
    function initThreeGlobe() {
        const container = document.getElementById('canvas3d-container');
        if (!container) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 100);
        camera.position.z = 22;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        
        // Resizing
        const resizeObserver = new ResizeObserver(() => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
        resizeObserver.observe(container);
        
        // 1. Globe wireframe geometry
        const globeGroup = new THREE.Group();
        scene.add(globeGroup);
        
        const globeGeo = new THREE.SphereGeometry(6, 30, 30);
        const globeMat = new THREE.MeshBasicMaterial({
            color: 0x111115,
            transparent: true,
            opacity: 0.8
        });
        const globeMesh = new THREE.Mesh(globeGeo, globeMat);
        globeGroup.add(globeMesh);
        
        // 2. Wireframe grid contours
        const wireframe = new THREE.WireframeGeometry(globeGeo);
        const lineMat = new THREE.LineBasicMaterial({
            color: 0xff3333,
            transparent: true,
            opacity: 0.15
        });
        const lines = new THREE.LineSegments(wireframe, lineMat);
        globeGroup.add(lines);
        
        // 3. Latitude & longitude ring lines
        const ringsGroup = new THREE.Group();
        globeGroup.add(ringsGroup);
        
        for (let i = -5; i <= 5; i++) {
            const rad = 6 * Math.cos((i * 15 * Math.PI) / 180);
            const y = 6 * Math.sin((i * 15 * Math.PI) / 180);
            const ringGeo = new THREE.BufferGeometry();
            const points = [];
            
            for (let j = 0; j <= 64; j++) {
                const theta = (j * 2 * Math.PI) / 64;
                points.push(new THREE.Vector3(rad * Math.cos(theta), y, rad * Math.sin(theta)));
            }
            ringGeo.setFromPoints(points);
            
            const ringLineMat = new THREE.LineBasicMaterial({
                color: 0xff3333,
                transparent: true,
                opacity: 0.2
            });
            const ringLine = new THREE.Line(ringGeo, ringLineMat);
            ringsGroup.add(ringLine);
        }

        // Helper to convert lat/lon to 3D Cartesian coordinates
        function latLonToVector3(lat, lon, radius) {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);
            
            return new THREE.Vector3(
                -radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.cos(theta)
            );
        }
        
        // Cities Data
        const cities = {
            Kolkata: { lat: 22.5726, lon: 88.3639, name: "Kolkata, IN", size: 0.18, color: 0xff3333 },
            SiliconValley: { lat: 37.7749, lon: -122.4194, name: "Silicon Valley, US", size: 0.08, color: 0xffffff },
            London: { lat: 51.5074, lon: -0.1278, name: "London, UK", size: 0.08, color: 0xffffff },
            Singapore: { lat: 1.3521, lon: 103.8198, name: "Singapore, SG", size: 0.08, color: 0xffffff },
            Dubai: { lat: 25.2048, lon: 55.2708, name: "Dubai, UAE", size: 0.08, color: 0xffffff },
            Tokyo: { lat: 35.6762, lon: 139.6503, name: "Tokyo, JP", size: 0.08, color: 0xffffff }
        };
        
        const pins = [];
        
        // Place Pins on Globe
        Object.keys(cities).forEach(key => {
            const city = cities[key];
            const pos = latLonToVector3(city.lat, city.lon, 6);
            
            const pinGeo = new THREE.SphereGeometry(city.size, 16, 16);
            const pinMat = new THREE.MeshBasicMaterial({
                color: city.color,
                transparent: true,
                opacity: 0.9
            });
            const pinMesh = new THREE.Mesh(pinGeo, pinMat);
            pinMesh.position.copy(pos);
            globeGroup.add(pinMesh);
            
            pins.push(pinMesh);
        });

        // 4. Bezier curve connections from Kolkata to others
        const curvesGroup = new THREE.Group();
        globeGroup.add(curvesGroup);
        const flightPackets = [];
        
        const kolkataPos = latLonToVector3(cities.Kolkata.lat, cities.Kolkata.lon, 6);
        
        Object.keys(cities).forEach(key => {
            if (key === 'Kolkata') return;
            const targetPos = latLonToVector3(cities[key].lat, cities[key].lon, 6);
            
            // Calculate height control point
            const mid = new THREE.Vector3().addVectors(kolkataPos, targetPos).multiplyScalar(0.5);
            const dist = kolkataPos.distanceTo(targetPos);
            // Push control point outwards along normal from globe center
            const midNormalized = mid.clone().normalize();
            const controlPoint = midNormalized.multiplyScalar(6 + dist * 0.25);
            
            // Bezier Curve
            const curve = new THREE.QuadraticBezierCurve3(kolkataPos, controlPoint, targetPos);
            const curvePoints = curve.getPoints(50);
            const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
            
            const curveMat = new THREE.LineBasicMaterial({
                color: 0xff3333,
                transparent: true,
                opacity: 0.3
            });
            const curveLine = new THREE.Line(curveGeo, curveMat);
            curvesGroup.add(curveLine);
            
            // Add a data packet particle flowing along curve
            const packetGeo = new THREE.SphereGeometry(0.06, 8, 8);
            const packetMat = new THREE.MeshBasicMaterial({
                color: 0xff3333,
                transparent: true,
                opacity: 0.9
            });
            const packetMesh = new THREE.Mesh(packetGeo, packetMat);
            globeGroup.add(packetMesh);
            
            flightPackets.push({
                mesh: packetMesh,
                curve: curve,
                progress: Math.random() // Start at random progress point
            });
        });
        
        // Initial rotation to show Kolkata
        globeGroup.rotation.y = -1.2;
        globeGroup.rotation.x = 0.35;
        
        let mouseOnGlobe = false;
        let prevMouseX = 0;
        let prevMouseY = 0;
        
        container.addEventListener('mouseenter', () => mouseOnGlobe = true);
        container.addEventListener('mouseleave', () => mouseOnGlobe = false);
        
        // Drag rotation support
        let isDragging = false;
        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            prevMouseX = e.clientX;
            prevMouseY = e.clientY;
        });
        
        window.addEventListener('mouseup', () => isDragging = false);
        
        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - prevMouseX;
                const deltaY = e.clientY - prevMouseY;
                
                globeGroup.rotation.y += deltaX * 0.005;
                globeGroup.rotation.x += deltaY * 0.005;
                
                prevMouseX = e.clientX;
                prevMouseY = e.clientY;
            }
        });
        
        // Render Loop
        function draw() {
            requestAnimationFrame(draw);
            
            // Auto-rotate if not interacting
            if (!mouseOnGlobe && !isDragging) {
                globeGroup.rotation.y += 0.0018;
            }
            
            // Animate flying data packets along Bezier curves
            flightPackets.forEach(packet => {
                packet.progress += 0.008;
                if (packet.progress > 1) packet.progress = 0;
                
                const pos = packet.curve.getPointAt(packet.progress);
                packet.mesh.position.copy(pos);
            });
            
            // Pulse the Kolkata marker scale
            const time = Date.now() * 0.003;
            const pulseScale = 1 + Math.sin(time) * 0.15;
            pins[0].scale.set(pulseScale, pulseScale, pulseScale);
            
            renderer.render(scene, camera);
        }
        draw();
    }

    /* --- 9. 3D CARD TILT EFFECT ON MOUSE HOVER --- */
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position inside element
            const y = e.clientY - rect.top;  // y position inside element
            
            const width = rect.width;
            const height = rect.height;
            
            // Calculate tilt degrees (-10 to 10 deg)
            const rotateX = -10 * ((y - height / 2) / (height / 2));
            const rotateY = 10 * ((x - width / 2) / (width / 2));
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Dynamic lens shine reflection mapping
            const glow = card.querySelector('.card-glow, .badge-glow');
            if (glow) {
                glow.style.top = `${y - 75}px`;
                glow.style.left = `${x - 75}px`;
                glow.style.opacity = '0.9';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            
            const glow = card.querySelector('.card-glow, .badge-glow');
            if (glow) {
                glow.style.opacity = '0.4';
                glow.style.top = '-75px';
                glow.style.left = 'unset';
                glow.style.right = '-75px';
            }
        });
    });

    /* --- 10. GSAP SCROLLTRIGGER PROGRESS TIMELINE & METRICS --- */
    if (hasGSAP) {
        
        // 1. Navbar active page indicator highlighting
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        sections.forEach(sec => {
            const id = sec.getAttribute('id');
            ScrollTrigger.create({
                trigger: sec,
                start: 'top 40%',
                end: 'bottom 40%',
                onEnter: () => activateNavLink(id),
                onEnterBack: () => activateNavLink(id)
            });
        });
        
        function activateNavLink(id) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
        
        // 2. Global page scrolling header progress indicator
        gsap.to('.scroll-progress-indicator', {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            }
        });
        
        // 3. About section grid reveal
        gsap.from('.about-card', {
            duration: 0.8,
            opacity: 0,
            y: 40,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#about',
                start: 'top 75%'
            }
        });
        
        // 4. Vision statement filling bars indicator
        gsap.utils.toArray('.v-fill').forEach(bar => {
            const width = bar.style.width;
            gsap.set(bar, { width: '0%' });
            
            gsap.to(bar, {
                width: width,
                duration: 1.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.vision-graph-container',
                    start: 'top 80%'
                }
            });
        });

        // 5. Timeline line filling scroll animation
        gsap.to('.timeline-progress-bar', {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.timeline-container',
                start: 'top 20%',
                end: 'bottom 80%',
                scrub: true
            }
        });
        
        // 6. Timeline cards slide-in triggers
        const timelineItems = gsap.utils.toArray('.animate-timeline');
        timelineItems.forEach(item => {
            const card = item.querySelector('.timeline-card');
            const isLeft = item.classList.contains('left');
            
            // Set initial offscreen positions
            gsap.set(card, { opacity: 0, x: isLeft ? -50 : 50 });
            
            gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: 'top 70%',
                    onEnter: () => item.classList.add('active-item')
                }
            })
            .to(card, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power2.out'
            })
            .call(() => {
                // Animate progress circles inside cards if any
                const circleProgress = card.querySelector('.metric-progress');
                const percentContainer = card.querySelector('.metric-circle');
                
                if (circleProgress && percentContainer) {
                    const targetPercent = parseFloat(percentContainer.getAttribute('data-target'));
                    // Circle circumference = 2 * PI * r = 2 * 3.14 * 15.9155 = 100
                    gsap.to(circleProgress, {
                        strokeDasharray: `${targetPercent}, 100`,
                        duration: 1.5,
                        ease: 'power2.out'
                    });
                }
            });
        });
        
        // 7. Projects section stagger cards
        gsap.from('.project-card', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#projects',
                start: 'top 70%'
            }
        });

        // 8. Achievements grid badges slide-in
        gsap.from('.achievement-badge', {
            opacity: 0,
            scale: 0.8,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.5)',
            scrollTrigger: {
                trigger: '#achievements',
                start: 'top 75%'
            }
        });
        
        // 9. Skills progress bar widths fill
        gsap.from('.skill-fill', {
            width: '0%',
            duration: 1.2,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.skills-list',
                start: 'top 80%'
            }
        });
        
        // 10. Skills soft progress rings circles fill
        gsap.utils.toArray('.circle-fill').forEach(circle => {
            const dashArray = circle.getAttribute('stroke-dasharray');
            circle.setAttribute('stroke-dasharray', '0, 100');
            
            gsap.to(circle, {
                attribute: { 'stroke-dasharray': dashArray },
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.skills-circle-grid',
                    start: 'top 85%'
                }
            });
        });

        // 11. CodeLX roadmap nodes and tracks scroll triggers
        gsap.to('.roadmap-fill', {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.roadmap-wrapper',
                start: 'top 60%',
                end: 'bottom 40%',
                scrub: true
            }
        });
        
        gsap.from('.roadmap-node', {
            opacity: 0,
            x: 30,
            stagger: 0.2,
            duration: 0.6,
            scrollTrigger: {
                trigger: '.roadmap-wrapper',
                start: 'top 70%'
            }
        });

    }

    /* --- 11. PROJECTS CARD DYNAMIC CANVAS BACKGROUND PARTICLES --- */
    const projectCanvases = document.querySelectorAll('.canvas-project-particles');
    projectCanvases.forEach(container => {
        const type = parseInt(container.getAttribute('data-type')) || 1;
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let width = canvas.width = container.clientWidth;
        let height = canvas.height = container.clientHeight;
        
        // Resize listener
        window.addEventListener('resize', () => {
            if (container.clientWidth > 0) {
                width = canvas.width = container.clientWidth;
                height = canvas.height = container.clientHeight;
            }
        });
        
        const particles = [];
        const count = 18;
        
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2 + 1,
                // Different project colors
                color: type === 1 ? 'rgba(255, 51, 51, 0.2)' : type === 2 ? 'rgba(0, 255, 204, 0.15)' : 'rgba(255, 255, 255, 0.15)'
            });
        }
        
        function render() {
            ctx.clearRect(0, 0, width, height);
            
            // Draw floating tech particle nodes
            particles.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;
                
                // Wrap boundaries
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                
                // Draw connecting lines between nearby points
                for (let j = idx + 1; j < count; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 60) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = type === 1 ? `rgba(255, 51, 51, ${0.08 * (1 - dist/60)})` : `rgba(255, 255, 255, ${0.05 * (1 - dist/60)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(render);
        }
        render();
    });

    /* --- 12. MOBILE HUD NAVIGATION TOGGLING --- */
    const mobileToggle = document.querySelector('.mobile-hud-toggle');
    const hudNav = document.querySelector('.hud-nav');
    const navLinksList = document.querySelectorAll('.nav-link');
    
    if (mobileToggle && hudNav) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            hudNav.classList.toggle('open');
            
            // Disable scroll when menu is open
            if (hudNav.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
        
        navLinksList.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                hudNav.classList.remove('open');
                document.body.style.overflow = 'auto';
            });
        });
    }

    /* --- 13. PREMIUM GLASSMORPHIC CONTACT FORM ENCRYPTION --- */
    const contactForm = document.getElementById('hud-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Prevent default to run our animation first
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'ENCRYPTING PACKETS...';
            
            // Set dynamic action to hide email from static scrapers
            const part1 = "mohimdas300";
            const part2 = "gmail.com";
            contactForm.action = `https://formsubmit.co/${part1}@${part2}`;
            
            // Add _next to return back to current website page after submission
            let nextInput = contactForm.querySelector('input[name="_next"]');
            if (!nextInput) {
                nextInput = document.createElement('input');
                nextInput.type = 'hidden';
                nextInput.name = '_next';
                contactForm.appendChild(nextInput);
            }
            nextInput.value = window.location.href;
            
            // Add _captcha to disable recaptchas for frictionless submission
            let captchaInput = contactForm.querySelector('input[name="_captcha"]');
            if (!captchaInput) {
                captchaInput = document.createElement('input');
                captchaInput.type = 'hidden';
                captchaInput.name = '_captcha';
                captchaInput.value = 'false';
                contactForm.appendChild(captchaInput);
            }
            
            // Submit the form naturally after a short delay for animation
            setTimeout(() => {
                submitBtn.innerHTML = 'TRANSMITTING ROUTE...';
                setTimeout(() => {
                    contactForm.submit();
                }, 400);
            }, 600);
        });
    }

    /* --- 14. OUTRO LOGO CANVAS: CODELX logo reveal --- */
    initOutroLogoReveal();
    
    function initOutroLogoReveal() {
        const canvas = document.getElementById('outro-logo-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const container = canvas.parentElement;
        
        let width = canvas.width = container.clientWidth;
        let height = canvas.height = container.clientHeight;
        
        window.addEventListener('resize', () => {
            if (container.clientWidth > 0) {
                width = canvas.width = container.clientWidth;
                height = canvas.height = container.clientHeight;
            }
        });
        
        const dots = [];
        
        // Define letters pattern nodes representing "CodeLX" text outline
        // Coordinates normalized between 0-1 (we'll scale them in canvas coordinates)
        const codeLXOutline = [
            // C
            {x: 0.15, y: 0.35}, {x: 0.13, y: 0.4}, {x: 0.12, y: 0.45}, {x: 0.12, y: 0.5}, {x: 0.12, y: 0.55}, {x: 0.13, y: 0.6}, {x: 0.15, y: 0.65},
            {x: 0.18, y: 0.7}, {x: 0.22, y: 0.72}, {x: 0.26, y: 0.72}, {x: 0.29, y: 0.7},
            {x: 0.18, y: 0.3}, {x: 0.22, y: 0.28}, {x: 0.26, y: 0.28}, {x: 0.29, y: 0.3},
            
            // o
            {x: 0.34, y: 0.45}, {x: 0.33, y: 0.5}, {x: 0.33, y: 0.55}, {x: 0.34, y: 0.6}, {x: 0.36, y: 0.65}, {x: 0.4, y: 0.67}, {x: 0.44, y: 0.65},
            {x: 0.46, y: 0.6}, {x: 0.47, y: 0.55}, {x: 0.47, y: 0.5}, {x: 0.46, y: 0.45}, {x: 0.44, y: 0.4}, {x: 0.4, y: 0.38}, {x: 0.36, y: 0.4},
            
            // d
            {x: 0.52, y: 0.45}, {x: 0.51, y: 0.5}, {x: 0.51, y: 0.55}, {x: 0.52, y: 0.6}, {x: 0.54, y: 0.65}, {x: 0.58, y: 0.67}, {x: 0.61, y: 0.65},
            {x: 0.62, y: 0.6}, {x: 0.62, y: 0.55}, {x: 0.62, y: 0.5}, {x: 0.62, y: 0.45}, {x: 0.62, y: 0.4}, {x: 0.62, y: 0.35}, {x: 0.62, y: 0.3}, {x: 0.62, y: 0.25}, {x: 0.62, y: 0.2},
            {x: 0.58, y: 0.38}, {x: 0.54, y: 0.4},
            
            // e
            {x: 0.67, y: 0.5}, {x: 0.71, y: 0.5}, {x: 0.74, y: 0.5}, {x: 0.75, y: 0.47}, {x: 0.74, y: 0.42}, {x: 0.72, y: 0.39}, {x: 0.69, y: 0.39}, {x: 0.67, y: 0.42},
            {x: 0.66, y: 0.47}, {x: 0.66, y: 0.52}, {x: 0.67, y: 0.57}, {x: 0.69, y: 0.62}, {x: 0.72, y: 0.64}, {x: 0.75, y: 0.64},
            
            // L
            {x: 0.8, y: 0.2}, {x: 0.8, y: 0.25}, {x: 0.8, y: 0.3}, {x: 0.8, y: 0.35}, {x: 0.8, y: 0.4}, {x: 0.8, y: 0.45}, {x: 0.8, y: 0.5}, {x: 0.8, y: 0.55}, {x: 0.8, y: 0.60}, {x: 0.8, y: 0.65},
            {x: 0.82, y: 0.65}, {x: 0.84, y: 0.65}, {x: 0.86, y: 0.65},
            
            // X
            {x: 0.9, y: 0.35}, {x: 0.91, y: 0.39}, {x: 0.93, y: 0.44}, {x: 0.95, y: 0.49}, {x: 0.97, y: 0.54}, {x: 0.98, y: 0.59}, {x: 1.0, y: 0.65},
            {x: 0.9, y: 0.65}, {x: 0.92, y: 0.60}, {x: 0.93, y: 0.55}, {x: 0.96, y: 0.45}, {x: 0.98, y: 0.40}, {x: 1.0, y: 0.35}
        ];
        
        // Spawn particles
        const particleCount = codeLXOutline.length * 4;
        
        for (let i = 0; i < particleCount; i++) {
            // Pick a target outline coordinate
            const outlinePointIndex = i % codeLXOutline.length;
            const targetPoint = codeLXOutline[outlinePointIndex];
            
            dots.push({
                // Start scattered
                x: Math.random() * width,
                y: Math.random() * height,
                // Target coordinates
                tx: targetPoint.x,
                ty: targetPoint.y,
                vx: 0,
                vy: 0,
                radius: Math.random() * 1.5 + 1,
                // Color variation
                color: Math.random() > 0.45 ? '#ff3333' : '#ffffff',
                originX: 0,
                originY: 0
            });
        }
        
        let mouseInCanvas = false;
        let cMouseX = 0;
        let cMouseY = 0;
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            cMouseX = e.clientX - rect.left;
            cMouseY = e.clientY - rect.top;
            mouseInCanvas = true;
        });
        canvas.addEventListener('mouseleave', () => {
            mouseInCanvas = false;
        });
        
        let scrollTriggered = false;
        
        if (hasGSAP) {
            ScrollTrigger.create({
                trigger: '.outro-section',
                start: 'top 50%',
                onEnter: () => scrollTriggered = true
            });
        } else {
            scrollTriggered = true; // Fallback
        }
        
        function renderOutro() {
            ctx.clearRect(0, 0, width, height);
            
            const textWidth = Math.min(width * 0.7, 450);
            const textHeight = 120;
            const startX = (width - textWidth) / 2;
            const startY = (height - textHeight) / 2;
            
            dots.forEach(d => {
                // Scale target coordinate to current canvas size
                // Offset target coordinate so that L/X coordinates are mapped properly
                d.originX = startX + d.tx * textWidth - (textWidth * 0.1);
                d.originY = startY + d.ty * textHeight;
                
                if (scrollTriggered) {
                    // Converge towards targets (flocking particles)
                    const dx = d.originX - d.x;
                    const dy = d.originY - d.y;
                    
                    // Simple spring physics convergence
                    d.vx += dx * 0.003;
                    d.vy += dy * 0.003;
                    
                    d.vx *= 0.92;
                    d.vy *= 0.92;
                    
                    // React to mouse cursor repulsion
                    if (mouseInCanvas) {
                        const mDist = Math.hypot(d.x - cMouseX, d.y - cMouseY);
                        if (mDist < 45) {
                            const angle = Math.atan2(d.y - cMouseY, d.x - cMouseX);
                            const force = (45 - mDist) * 0.15;
                            d.vx += Math.cos(angle) * force;
                            d.vy += Math.sin(angle) * force;
                        }
                    }
                } else {
                    // Drift randomly before trigger
                    d.vx += (Math.random() - 0.5) * 0.05;
                    d.vy += (Math.random() - 0.5) * 0.05;
                    d.vx *= 0.98;
                    d.vy *= 0.98;
                }
                
                d.x += d.vx;
                d.y += d.vy;
                
                // Draw particle node
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
                ctx.fillStyle = d.color;
                
                // Add soft neon drop shadow glow to red logo points
                if (d.color === '#ff3333') {
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = '#ff3333';
                } else {
                    ctx.shadowBlur = 0;
                }
                
                ctx.fill();
            });
            
            // Clear shadow settings
            ctx.shadowBlur = 0;
            
            requestAnimationFrame(renderOutro);
        }
        renderOutro();
    }
});
