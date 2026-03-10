/* ============================================
   THE BIG O — 3D IMMERSIVE SCRIPT
   Three.js Particle Field + Interactive Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════
    // THREE.JS — 3D Particle Constellation
    // ═══════════════════════════════════════
    const canvas = document.getElementById('heroCanvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Particles
        const particleCount = 600;
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;  // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;  // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;  // z
            velocities.push({
                x: (Math.random() - 0.5) * 0.005,
                y: (Math.random() - 0.5) * 0.005,
                z: (Math.random() - 0.5) * 0.005
            });
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x3b82f6,
            size: 0.04,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Connection lines between nearby particles
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x2563eb,
            transparent: true,
            opacity: 0.12,
            blending: THREE.AdditiveBlending
        });

        let linesMesh = null;

        function updateLines() {
            if (linesMesh) scene.remove(linesMesh);

            const linePositions = [];
            const pos = particles.geometry.attributes.position.array;
            const maxDist = 2.5;

            for (let i = 0; i < particleCount; i++) {
                for (let j = i + 1; j < particleCount; j++) {
                    const dx = pos[i * 3] - pos[j * 3];
                    const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                    const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < maxDist) {
                        linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
                        linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
                    }
                }
            }

            if (linePositions.length > 0) {
                const lineGeom = new THREE.BufferGeometry();
                lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
                linesMesh = new THREE.LineSegments(lineGeom, lineMaterial);
                scene.add(linesMesh);
            }
        }

        // Ambient glow spheres
        const glowGeom = new THREE.SphereGeometry(0.15, 16, 16);
        const glowMat1 = new THREE.MeshBasicMaterial({ color: 0xf5b731, transparent: true, opacity: 0.15 });
        const glowMat2 = new THREE.MeshBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.1 });
        const glow1 = new THREE.Mesh(glowGeom, glowMat1);
        const glow2 = new THREE.Mesh(glowGeom, glowMat2);
        glow1.position.set(3, 2, -5);
        glow2.position.set(-4, -1, -8);
        glow1.scale.set(8, 8, 8);
        glow2.scale.set(10, 10, 10);
        scene.add(glow1);
        scene.add(glow2);

        camera.position.z = 8;

        let mouseX = 0, mouseY = 0;
        let frameCount = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function animateThree() {
            requestAnimationFrame(animateThree);
            frameCount++;

            // Animate particles
            const pos = particles.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                pos[i * 3] += velocities[i].x;
                pos[i * 3 + 1] += velocities[i].y;
                pos[i * 3 + 2] += velocities[i].z;

                // Bounce
                if (Math.abs(pos[i * 3]) > 10) velocities[i].x *= -1;
                if (Math.abs(pos[i * 3 + 1]) > 10) velocities[i].y *= -1;
                if (Math.abs(pos[i * 3 + 2]) > 10) velocities[i].z *= -1;
            }
            particles.geometry.attributes.position.needsUpdate = true;

            // Update lines every 3 frames for performance
            if (frameCount % 3 === 0) updateLines();

            // Camera responds to mouse
            camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.02;
            camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            // Rotate glow orbs
            glow1.position.x = Math.sin(frameCount * 0.005) * 4;
            glow1.position.y = Math.cos(frameCount * 0.003) * 3;
            glow2.position.x = Math.cos(frameCount * 0.004) * 5;
            glow2.position.y = Math.sin(frameCount * 0.006) * 2;

            // Subtle overall rotation
            particles.rotation.y += 0.0003;
            particles.rotation.x += 0.0001;

            renderer.render(scene, camera);
        }
        animateThree();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // ═══════════════════════════════════════
    // CODE BRACKET CURSOR < > WITH SPARKLES
    // ═══════════════════════════════════════
    const cursorGlow = document.getElementById('cursorGlow');
    const cursorRing = document.getElementById('cursorGlowRing');
    let cursorX = 0, cursorY = 0;
    let ringX = 0, ringY = 0;
    let cursorAngle = 0;
    let isHovering = false;

    // Sparkle trail pool
    const sparklePool = [];
    const MAX_SPARKLES = 30;
    for (let i = 0; i < MAX_SPARKLES; i++) {
        const spark = document.createElement('div');
        spark.style.cssText = `
            position: fixed; pointer-events: none; z-index: 9997;
            width: 4px; height: 4px; border-radius: 50%;
            background: #f5b731; opacity: 0;
            box-shadow: 0 0 6px rgba(245, 183, 49, 0.5);
            transition: none;
        `;
        document.body.appendChild(spark);
        sparklePool.push({ el: spark, life: 0, x: 0, y: 0, vx: 0, vy: 0 });
    }
    let sparkIdx = 0;
    let lastSparkTime = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;

        // Spawn sparkle every ~40ms while moving
        const now = Date.now();
        if (now - lastSparkTime > 40) {
            lastSparkTime = now;
            const s = sparklePool[sparkIdx % MAX_SPARKLES];
            s.x = cursorX;
            s.y = cursorY;
            s.vx = (Math.random() - 0.5) * 3;
            s.vy = (Math.random() - 0.5) * 3 - 1;
            s.life = 1;
            s.el.style.background = isHovering ? '#3b82f6' : '#f5b731';
            s.el.style.boxShadow = isHovering
                ? '0 0 8px rgba(59,130,246,0.6)'
                : '0 0 6px rgba(245,183,49,0.5)';
            sparkIdx++;
        }
    });

    function animateCursor() {
        requestAnimationFrame(animateCursor);

        // Core dot follows instantly
        if (cursorGlow) {
            cursorGlow.style.left = cursorX + 'px';
            cursorGlow.style.top = cursorY + 'px';
        }

        // Bracket ring follows with smooth lag + gentle rotation
        ringX += (cursorX - ringX) * 0.12;
        ringY += (cursorY - ringY) * 0.12;
        cursorAngle += isHovering ? 3 : 1;

        if (cursorRing) {
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            cursorRing.style.transform = `translate(-50%, -50%) rotate(${cursorAngle}deg)`;
        }

        // Animate sparkles
        sparklePool.forEach(s => {
            if (s.life > 0) {
                s.life -= 0.03;
                s.x += s.vx;
                s.y += s.vy;
                s.vy += 0.05; // gravity
                s.el.style.left = s.x + 'px';
                s.el.style.top = s.y + 'px';
                s.el.style.opacity = s.life;
                s.el.style.transform = `scale(${s.life})`;
            } else {
                s.el.style.opacity = '0';
            }
        });
    }
    animateCursor();

    // Hover state — brackets change style
    document.querySelectorAll('a, button, .member-card-wrapper, .tilt-card, .highlight-tag, .btn-primary, .btn-secondary').forEach(el => {
        el.addEventListener('mouseenter', () => {
            isHovering = true;
            if (cursorGlow) {
                cursorGlow.style.width = '12px';
                cursorGlow.style.height = '12px';
                cursorGlow.style.background = '#3b82f6';
                cursorGlow.style.boxShadow = '0 0 20px rgba(59,130,246,0.6), 0 0 40px rgba(59,130,246,0.3)';
            }
            if (cursorRing) {
                cursorRing.style.width = '56px';
                cursorRing.style.height = '56px';
                // Change brackets to { } via CSS class
                cursorRing.classList.add('hover-mode');
            }
        });
        el.addEventListener('mouseleave', () => {
            isHovering = false;
            if (cursorGlow) {
                cursorGlow.style.width = '8px';
                cursorGlow.style.height = '8px';
                cursorGlow.style.background = '#f5b731';
                cursorGlow.style.boxShadow = '0 0 12px rgba(245,183,49,0.4), 0 0 24px rgba(245,183,49,0.2)';
            }
            if (cursorRing) {
                cursorRing.style.width = '44px';
                cursorRing.style.height = '44px';
                cursorRing.classList.remove('hover-mode');
            }
        });
    });

    // ═══════════════════════════════════════
    // NAVBAR SCROLL EFFECT
    // ═══════════════════════════════════════
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ═══════════════════════════════════════
    // MOBILE NAV TOGGLE
    // ═══════════════════════════════════════
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ═══════════════════════════════════════
    // SCROLL REVEAL (Intersection Observer)
    // ═══════════════════════════════════════
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered reveal delay
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 100);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ═══════════════════════════════════════
    // 3D TILT EFFECT on .tilt-card elements
    // ═══════════════════════════════════════
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
            card.style.boxShadow = `
        ${-rotateY * 2}px ${rotateX * 2}px 30px rgba(0, 0, 0, 0.4),
        0 0 40px rgba(37, 99, 235, 0.08)
      `;

            // Update card-3d-layer glow position
            const layer = card.querySelector('.card-3d-layer');
            if (layer) {
                const px = (x / rect.width) * 100;
                const py = (y / rect.height) * 100;
                layer.style.setProperty('--mouse-x', px + '%');
                layer.style.setProperty('--mouse-y', py + '%');
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });

    // ═══════════════════════════════════════
    // ANIMATED STAT COUNTERS
    // ═══════════════════════════════════════
    const statNumbers = document.querySelectorAll('.stat-number');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                const suffix = el.getAttribute('data-suffix') || '';
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = Math.floor(current) + suffix;
                }, 25);
                countObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => countObserver.observe(el));

    // ═══════════════════════════════════════
    // SMOOTH SCROLL
    // ═══════════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ═══════════════════════════════════════
    // PARALLAX ON SCROLL
    // ═══════════════════════════════════════
    const bgShapes = document.querySelectorAll('.section-bg-shape');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        bgShapes.forEach((shape, i) => {
            const speed = 0.03 + i * 0.01;
            shape.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.01}deg)`;
        });

        // Parallax the code cube
        const cube = document.getElementById('codeCube');
        if (cube) {
            cube.style.top = `calc(15% + ${scrollY * 0.1}px)`;
        }
    });

    // ═══════════════════════════════════════
    // 3D CODE CUBE — Mouse interaction
    // ═══════════════════════════════════════
    const codeCube = document.getElementById('codeCube');
    if (codeCube) {
        document.addEventListener('mousemove', (e) => {
            const mx = (e.clientX / window.innerWidth - 0.5) * 30;
            const my = (e.clientY / window.innerHeight - 0.5) * 30;
            codeCube.style.animationPlayState = 'paused';
            codeCube.style.transform = `rotateX(${-my}deg) rotateY(${mx}deg)`;
        });
        document.addEventListener('mouseleave', () => {
            codeCube.style.animationPlayState = 'running';
            codeCube.style.transform = '';
        });
    }

});
