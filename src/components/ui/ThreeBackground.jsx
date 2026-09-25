import { useEffect, useRef } from "react";
import * as THREE from "three";

function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 24);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const isMobile = window.innerWidth < 800;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const world = new THREE.Group();
    scene.add(world);

    /* -------------------------------------------------------
       PARTICLE FIELD
    ------------------------------------------------------- */

    const count = isMobile ? 460 : 1050;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;

      positions[i3] =
        (Math.random() - 0.5) * 42;

      positions[i3 + 1] =
        (Math.random() - 0.5) * 25;

      positions[i3 + 2] =
        (Math.random() - 0.5) * 26;

      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.2 + Math.random() * 0.8;
    }

    const particleGeometry = new THREE.BufferGeometry();

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: {
          value: Math.min(window.devicePixelRatio, 1.5),
        },
        uColor: {
          value: new THREE.Color(0x3157d5),
        },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;

        attribute float aPhase;
        attribute float aSpeed;

        varying float vAlpha;

        void main() {
          vec3 p = position;

          float t = uTime * aSpeed;

          p.y += sin(t * 1.35 + p.x * 0.22 + aPhase) * 0.48;
          p.x += cos(t * 1.05 + p.z * 0.18 + aPhase) * 0.34;
          p.z += sin(t * 0.88 + p.y * 0.15 + aPhase) * 0.25;

          float flow = sin(t * 0.62 + p.z * 0.08 + aPhase);
          p.x += flow * 0.20;
          p.y += cos(t * 0.52 + p.x * 0.06) * 0.16;

          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

          gl_Position = projectionMatrix * mvPosition;

          float size = 1.85 + sin(t * 1.45 + aPhase) * 0.65;
          float depthBoost = 1.0 + (1.0 / max(2.0, -mvPosition.z)) * 2.8;
          gl_PointSize = size * depthBoost * uPixelRatio;

          vAlpha = 0.42 + 0.48 * (0.5 + 0.5 * sin(t * 1.5 + aPhase));
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);

          if (d > 0.5) discard;

          float glow = 1.0 - smoothstep(0.0, 0.5, d);
          gl_FragColor = vec4(uColor, vAlpha * glow);
        }
      `,
    });

    const phaseAttribute = new Float32Array(phases);
    const speedAttribute = new Float32Array(speeds);

    particleGeometry.setAttribute(
      "aPhase",
      new THREE.BufferAttribute(phaseAttribute, 1)
    );

    particleGeometry.setAttribute(
      "aSpeed",
      new THREE.BufferAttribute(speedAttribute, 1)
    );

    const particles = new THREE.Points(
      particleGeometry,
      particleMaterial
    );

    // Keep a stable copy so the field can continuously drift through
    // 3D space on its own, independent of mouse movement.
    const basePositions = new Float32Array(positions);

    world.add(particles);

    /* -------------------------------------------------------
       SUBTLE 3D CORE
    ------------------------------------------------------- */

    const core = new THREE.Group();
    core.position.set(7, 0.5, -6);
    world.add(core);

    const coreGeometry =
      new THREE.IcosahedronGeometry(3.6, 1);

    const coreMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x5b76c9,
        wireframe: true,
        transparent: true,
        opacity: 0.13,
      });

    const coreMesh = new THREE.Mesh(
      coreGeometry,
      coreMaterial
    );

    core.add(coreMesh);

    const ringGeometry = new THREE.TorusGeometry(
      4.8,
      0.018,
      8,
      160
    );

    const ringMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x2d9fba,
        transparent: true,
        opacity: 0.19,
      });

    const ring = new THREE.Mesh(
      ringGeometry,
      ringMaterial
    );

    ring.rotation.x = Math.PI * 0.38;
    ring.rotation.y = Math.PI * 0.15;
    core.add(ring);

    // Additional geometric layers make the 3D field read clearly
    // even when the pointer is not moving.
    const orbitGeometry = new THREE.TorusGeometry(
      3.55,
      0.014,
      8,
      128
    );

    const orbit = new THREE.Mesh(
      orbitGeometry,
      ringMaterial.clone()
    );

    orbit.rotation.x = Math.PI * 0.78;
    orbit.rotation.z = Math.PI * 0.22;
    orbit.scale.set(1.0, 0.68, 1.0);
    core.add(orbit);

    const satelliteGeometry =
      new THREE.OctahedronGeometry(1.05, 1);

    const satelliteMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x5b76c9,
        wireframe: true,
        transparent: true,
        opacity: 0.10,
      });

    const satellite = new THREE.Mesh(
      satelliteGeometry,
      satelliteMaterial
    );

    satellite.position.set(-5.2, 2.8, -1.5);
    satellite.rotation.set(0.4, 0.7, 0.2);
    world.add(satellite);

    // Additional floating geometric elements.
    const diamondGeometry =
      new THREE.OctahedronGeometry(1.55, 1);

    const diamond = new THREE.Mesh(
      diamondGeometry,
      satelliteMaterial.clone()
    );

    diamond.position.set(-7.2, -3.4, -4);
    diamond.rotation.set(0.3, 0.5, 0.1);
    world.add(diamond);

    const cubeGeometry =
      new THREE.BoxGeometry(2.15, 2.15, 2.15);

    const cubeMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x5b76c9,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });

    const cube = new THREE.Mesh(
      cubeGeometry,
      cubeMaterial
    );

    cube.position.set(5.0, 4.4, -3.5);
    cube.rotation.set(0.5, 0.3, 0.2);
    world.add(cube);

    const orbitTwoGeometry =
      new THREE.TorusGeometry(
        5.9,
        0.012,
        8,
        160
      );

    const orbitTwoMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x2d9fba,
        transparent: true,
        opacity: 0.18,
      });

    const orbitTwo = new THREE.Mesh(
      orbitTwoGeometry,
      orbitTwoMaterial
    );

    orbitTwo.rotation.x = Math.PI * 0.56;
    orbitTwo.rotation.y = Math.PI * 0.30;
    orbitTwo.position.set(1.5, -1.0, -5.5);
    world.add(orbitTwo);

    const ringThreeGeometry =
      new THREE.TorusGeometry(
        2.35,
        0.01,
        8,
        120
      );

    const ringThree = new THREE.Mesh(
      ringThreeGeometry,
      orbitTwoMaterial.clone()
    );

    ringThree.rotation.x = Math.PI * 0.22;
    ringThree.rotation.z = Math.PI * 0.35;
    ringThree.position.set(-3.8, 4.0, -2.0);
    world.add(ringThree);

    const dodecaGeometry =
      new THREE.DodecahedronGeometry(1.25, 1);

    const dodecaMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x5b76c9,
        wireframe: true,
        transparent: true,
        opacity: 0.10,
      });

    const dodeca = new THREE.Mesh(
      dodecaGeometry,
      dodecaMaterial
    );

    dodeca.position.set(0.5, 5.0, -5.0);
    world.add(dodeca);

    /*
     * DYNAMIC ENERGY RIBBONS
     * These are continuously regenerated in 3D space so the background
     * has an obvious flowing motion even with no pointer interaction.
     */
    const ribbonCount = 2;
    const ribbonPoints = 90;
    const ribbons = [];

    for (let r = 0; r < ribbonCount; r += 1) {
      const geometry = new THREE.BufferGeometry();
      const ribbonPositions = new Float32Array(ribbonPoints * 3);

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(ribbonPositions, 3)
      );

      const material = new THREE.LineBasicMaterial({
        color: r === 0 ? 0x5b76c9 : 0x2d9fba,
        transparent: true,
        opacity: 0.14,
      });

      const line = new THREE.Line(geometry, material);

      line.position.set(
        r === 0 ? -1.5 : 2.5,
        r === 0 ? 0.8 : -2.2,
        r === 0 ? -4.5 : -2.5
      );

      world.add(line);

      ribbons.push({
        geometry,
        material,
        line,
        offset: r * Math.PI,
      });
    }

    /* -------------------------------------------------------
       DEPTH TUNNEL + CONSTELLATION NETWORK
       -------------------------------------------------------
       A second visual layer creates a stronger sense of depth:
       rings travel through the scene while a small network of
       points continuously shifts in 3D space.
    ------------------------------------------------------- */

    const tunnelCount = isMobile ? 7 : 11;
    const tunnelRings = [];
    const tunnelGeometry = new THREE.TorusGeometry(
      2.8,
      0.012,
      8,
      96
    );

    for (let i = 0; i < tunnelCount; i += 1) {
      const material = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x5b76c9 : 0x2d9fba,
        transparent: true,
        opacity: 0.09,
        depthWrite: false,
      });

      const tunnelRing = new THREE.Mesh(
        tunnelGeometry,
        material
      );

      tunnelRing.position.set(
        Math.sin(i * 1.7) * 3.2,
        Math.cos(i * 1.25) * 2.1,
        -1 - i * 2.35
      );

      tunnelRing.rotation.set(
        0.45 + i * 0.08,
        0.25 + i * 0.13,
        i * 0.22
      );

      const scale = 0.45 + i * 0.13;
      tunnelRing.scale.set(scale, scale, scale);

      world.add(tunnelRing);

      tunnelRings.push({
        mesh: tunnelRing,
        phase: i * 0.72,
        baseX: tunnelRing.position.x,
        baseY: tunnelRing.position.y,
        baseZ: tunnelRing.position.z,
      });
    }

    const networkCount = isMobile ? 22 : 36;
    const networkPositions = new Float32Array(
      networkCount * 3
    );
    const networkBase = new Float32Array(
      networkCount * 3
    );
    const networkPhase = new Float32Array(
      networkCount
    );

    for (let i = 0; i < networkCount; i += 1) {
      const i3 = i * 3;

      networkBase[i3] =
        (Math.random() - 0.5) * 24;
      networkBase[i3 + 1] =
        (Math.random() - 0.5) * 14;
      networkBase[i3 + 2] =
        -4 - Math.random() * 17;

      networkPositions[i3] = networkBase[i3];
      networkPositions[i3 + 1] = networkBase[i3 + 1];
      networkPositions[i3 + 2] = networkBase[i3 + 2];

      networkPhase[i] =
        Math.random() * Math.PI * 2;
    }

    const networkPointGeometry =
      new THREE.BufferGeometry();

    networkPointGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        networkPositions,
        3
      )
    );

    const networkPointMaterial =
      new THREE.PointsMaterial({
        color: 0x5b76c9,
        size: isMobile ? 0.045 : 0.065,
        transparent: true,
        opacity: 0.55,
        sizeAttenuation: true,
        depthWrite: false,
      });

    const networkPoints = new THREE.Points(
      networkPointGeometry,
      networkPointMaterial
    );

    world.add(networkPoints);

    const networkEdges = [];

    for (let i = 0; i < networkCount; i += 1) {
      networkEdges.push([
        i,
        (i + 1) % networkCount,
      ]);

      if (i + 3 < networkCount) {
        networkEdges.push([i, i + 3]);
      }

      if (i % 5 === 0 && i + 7 < networkCount) {
        networkEdges.push([i, i + 7]);
      }
    }

    const networkLinePositions =
      new Float32Array(
        networkEdges.length * 6
      );

    const networkLineGeometry =
      new THREE.BufferGeometry();

    networkLineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        networkLinePositions,
        3
      )
    );

    const networkLineMaterial =
      new THREE.LineBasicMaterial({
        color: 0x6b86e2,
        transparent: true,
        opacity: 0.09,
        depthWrite: false,
      });

    const networkLines =
      new THREE.LineSegments(
        networkLineGeometry,
        networkLineMaterial
      );

    world.add(networkLines);

    /* -------------------------------------------------------
       POINTER
    ------------------------------------------------------- */

    const pointer = new THREE.Vector2();
    const target = new THREE.Vector2();

    const handlePointerMove = (event) => {
      target.x =
        (event.clientX / window.innerWidth) * 2 - 1;

      target.y =
        -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      { passive: true }
    );

    /* -------------------------------------------------------
       THEME-AWARE COLORS
    ------------------------------------------------------- */

    const updateTheme = () => {
      const dark =
        document.documentElement.dataset.theme === "dark";

      particleMaterial.uniforms.uColor.value.set(
        dark ? 0x9be4ff : 0x6b86e2
      );

      coreMaterial.color.set(
        dark ? 0x7f9bff : 0x5b76c9
      );

      ringMaterial.color.set(
        dark ? 0x45d5e8 : 0x2d9fba
      );

      satelliteMaterial.color.set(
        dark ? 0x9be4ff : 0x6b86e2
      );

      cubeMaterial.color.set(
        dark ? 0x7f9bff : 0x5b76c9
      );

      dodecaMaterial.color.set(
        dark ? 0x9be4ff : 0x6b86e2
      );

      networkPointMaterial.color.set(
        dark ? 0x9be4ff : 0x6b86e2
      );

      networkLineMaterial.color.set(
        dark ? 0x7fdcff : 0x6b86e2
      );

      tunnelRings.forEach((ringItem, index) => {
        ringItem.mesh.material.color.set(
          dark
            ? index % 2 === 0
              ? 0x8edcff
              : 0x45d5e8
            : index % 2 === 0
              ? 0x6b86e2
              : 0x2d9fba
        );
      });

      orbitTwoMaterial.color.set(
        dark ? 0x45d5e8 : 0x2d9fba
      );

      ribbons[0].material.color.set(
        dark ? 0x8edcff : 0x6b86e2
      );

      ribbons[1].material.color.set(
        dark ? 0x45d5e8 : 0x2d9fba
      );
    };

    updateTheme();

    const themeObserver =
      new MutationObserver(updateTheme);

    themeObserver.observe(
      document.documentElement,
      {
        attributes: true,
        attributeFilter: ["data-theme"],
      }
    );

    /* -------------------------------------------------------
       RESIZE
    ------------------------------------------------------- */

    const handleResize = () => {
      camera.aspect =
        window.innerWidth / window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 1.5)
      );

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    /* -------------------------------------------------------
       ANIMATION
    ------------------------------------------------------- */

    const clock = new THREE.Clock();
    let animationFrame;

    const animate = () => {
      animationFrame =
        requestAnimationFrame(animate);

      const time = clock.getElapsedTime();
      const speed = reducedMotion ? 0.12 : 1;

      pointer.lerp(target, 0.035);

      particleMaterial.uniforms.uTime.value =
        time * speed;

      // Autonomous 3D flow: every particle gets its own phase-based
      // X/Y/Z drift, so the field visibly moves even when the mouse is still.
      const positionAttribute =
        particleGeometry.attributes.position;

      for (let i = 0; i < count; i += 1) {
        const i3 = i * 3;
        const phase = phases[i];
        const particleSpeed = speeds[i];

        positionAttribute.array[i3] =
          basePositions[i3] +
          Math.sin(time * 3.25 * particleSpeed + phase) * 0.68;

        positionAttribute.array[i3 + 1] =
          basePositions[i3 + 1] +
          Math.cos(time * 2.70 * particleSpeed + phase) * 0.56;

        positionAttribute.array[i3 + 2] =
          basePositions[i3 + 2] +
          Math.sin(time * 2.25 * particleSpeed + phase * 1.7) * 0.88;
      }

      positionAttribute.needsUpdate = true;

      particles.rotation.y =
        time * 0.19 * speed;

      particles.rotation.x =
        Math.sin(time * 0.48) * 0.15;

      particles.rotation.z =
        Math.cos(time * 0.38) * 0.075;

      particles.position.x =
        Math.sin(time * 0.58) * 1.10;

      particles.position.y =
        Math.cos(time * 0.46) * 0.76;

      particles.position.z =
        Math.sin(time * 0.34) * 0.94;

      coreMesh.rotation.x =
        time * 0.12 * speed;

      coreMesh.rotation.y =
        time * 0.17 * speed;

      coreMesh.rotation.z =
        time * 0.08 * speed;

      ring.rotation.z =
        time * 0.22 * speed;

      ring.rotation.x =
        Math.sin(time * 0.25) * 0.18;

      orbit.rotation.y =
        time * 0.19 * speed;

      orbit.rotation.z =
        -time * 0.14 * speed;

      orbit.position.x =
        Math.sin(time * 0.34) * 0.35;

      orbit.position.y =
        Math.cos(time * 0.27) * 0.25;

      satellite.rotation.x =
        time * 0.28 * speed;

      satellite.rotation.y =
        time * 0.38 * speed;

      satellite.rotation.z =
        time * 0.17 * speed;

      satellite.position.x =
        -5.2 + Math.sin(time * 0.42) * 0.90;

      satellite.position.y =
        2.8 + Math.cos(time * 0.31) * 0.70;

      satellite.position.z =
        -1.5 + Math.sin(time * 0.42) * 0.95;

      diamond.rotation.x =
        time * 0.48 * speed;

      diamond.rotation.y =
        -time * 0.64 * speed;

      diamond.rotation.z =
        time * 0.32 * speed;

      diamond.position.x =
        -7.2 + Math.cos(time * 0.31) * 1.15;

      diamond.position.y =
        -3.4 + Math.sin(time * 0.44) * 0.85;

      diamond.position.z =
        -4 + Math.cos(time * 0.24) * 0.75;

      cube.rotation.x =
        time * 0.36 * speed;

      cube.rotation.y =
        time * 0.52 * speed;

      cube.rotation.z =
        time * 0.28 * speed;

      cube.position.x =
        5 + Math.sin(time * 0.29) * 0.90;

      cube.position.y =
        4.4 + Math.cos(time * 0.36) * 0.75;

      cube.position.z =
        -3.5 + Math.sin(time * 0.21) * 0.70;

      orbitTwo.rotation.x =
        time * 0.12 * speed;

      orbitTwo.rotation.y =
        -time * 0.21 * speed;

      orbitTwo.rotation.z =
        time * 0.17 * speed;

      orbitTwo.position.x =
        1.5 + Math.sin(time * 0.22) * 0.65;

      orbitTwo.position.y =
        -1 + Math.cos(time * 0.30) * 0.50;

      ringThree.rotation.x =
        time * 0.28 * speed;

      ringThree.rotation.y =
        time * 0.19 * speed;

      ringThree.rotation.z =
        -time * 0.31 * speed;

      ringThree.position.x =
        -3.8 + Math.sin(time * 0.37) * 0.65;

      ringThree.position.y =
        4 + Math.cos(time * 0.26) * 0.55;

      dodeca.rotation.x =
        time * 0.22 * speed;

      dodeca.rotation.y =
        -time * 0.34 * speed;

      dodeca.rotation.z =
        time * 0.16 * speed;

      dodeca.position.x =
        0.5 + Math.sin(time * 0.29) * 1.15;

      dodeca.position.y =
        5.0 + Math.cos(time * 0.36) * 0.72;

      dodeca.position.z =
        -5.0 + Math.sin(time * 0.22) * 0.85;

      // Fast-moving depth tunnel.
      tunnelRings.forEach((ringItem, index) => {
        const ring = ringItem.mesh;

        ring.position.z =
          ringItem.baseZ +
          ((time * (3.5 + index * 0.12)) % 26);

        if (ring.position.z > 2) {
          ring.position.z -= 26;
        }

        ring.position.x =
          ringItem.baseX +
          Math.sin(
            time * 0.82 +
            ringItem.phase
          ) * 0.85;

        ring.position.y =
          ringItem.baseY +
          Math.cos(
            time * 0.62 +
            ringItem.phase
          ) * 0.58;

        ring.rotation.x +=
          0.009 * speed;

        ring.rotation.y +=
          0.013 * speed;

        ring.rotation.z +=
          0.017 * speed;

        const depth =
          THREE.MathUtils.clamp(
            (ring.position.z + 26) / 26,
            0,
            1
          );

        const scale =
          0.42 +
          index * 0.12 +
          depth * 0.30;

        ring.scale.set(
          scale,
          scale,
          scale
        );

        ring.material.opacity =
          0.045 + depth * 0.09;
      });

      // Moving constellation network.
      const networkPointAttribute =
        networkPointGeometry.attributes.position;

      const networkLineAttribute =
        networkLineGeometry.attributes.position;

      for (let i = 0; i < networkCount; i += 1) {
        const i3 = i * 3;
        const phase = networkPhase[i];

        networkPointAttribute.array[i3] =
          networkBase[i3] +
          Math.sin(
            time * 0.92 +
            phase
          ) * 0.65;

        networkPointAttribute.array[i3 + 1] =
          networkBase[i3 + 1] +
          Math.cos(
            time * 0.76 +
            phase
          ) * 0.48;

        networkPointAttribute.array[i3 + 2] =
          networkBase[i3 + 2] +
          Math.sin(
            time * 0.42 +
            phase * 1.3
          ) * 0.85;
      }

      networkPointAttribute.needsUpdate = true;

      networkEdges.forEach((edge, edgeIndex) => {
        const a = edge[0] * 3;
        const b = edge[1] * 3;
        const e = edgeIndex * 6;

        networkLineAttribute.array[e] =
          networkPointAttribute.array[a];

        networkLineAttribute.array[e + 1] =
          networkPointAttribute.array[a + 1];

        networkLineAttribute.array[e + 2] =
          networkPointAttribute.array[a + 2];

        networkLineAttribute.array[e + 3] =
          networkPointAttribute.array[b];

        networkLineAttribute.array[e + 4] =
          networkPointAttribute.array[b + 1];

        networkLineAttribute.array[e + 5] =
          networkPointAttribute.array[b + 2];
      });

      networkLineAttribute.needsUpdate = true;

      networkPoints.rotation.y =
        time * 0.055 * speed;

      networkLines.rotation.y =
        time * 0.055 * speed;

      const depthBreath =
        1 +
        Math.sin(time * 0.72) * 0.025;

      networkPoints.scale.setScalar(depthBreath);
      networkLines.scale.setScalar(depthBreath);

      // Flowing 3D energy ribbons.
      ribbons.forEach((ribbon, ribbonIndex) => {
        const attribute =
          ribbon.geometry.attributes.position;
        const offset = ribbon.offset;

        for (let i = 0; i < ribbonPoints; i += 1) {
          const progress =
            i / (ribbonPoints - 1);

          const x =
            (progress - 0.5) * 19;

          const y =
            Math.sin(
              progress * Math.PI * 3.5 +
              time * (1.75 + ribbonIndex * 0.30) +
              offset
            ) * 1.05 +
            Math.sin(
              progress * Math.PI * 7 -
              time * 1.08 +
              offset
            ) * 0.30;

          const z =
            Math.cos(
              progress * Math.PI * 3 +
              time * 1.28 +
              offset
            ) * 1.15 +
            Math.sin(
              progress * Math.PI * 5 +
              time * 0.55
            ) * 0.28;

          attribute.array[i * 3] = x;
          attribute.array[i * 3 + 1] = y;
          attribute.array[i * 3 + 2] = z;
        }

        attribute.needsUpdate = true;

        ribbon.line.rotation.y =
          Math.sin(time * 0.16 + offset) * 0.32;

        ribbon.line.rotation.x =
          Math.cos(time * 0.13 + offset) * 0.18;

        ribbon.line.position.x +=
          Math.sin(time * 0.20 + offset) * 0.0015;
      });

      core.position.x =
        7 + Math.sin(time * 0.34) * 0.55;

      core.position.y =
        0.5 + Math.cos(time * 0.27) * 0.38;

      core.position.z =
        -6 + Math.sin(time * 0.19) * 0.40;

      world.rotation.y =
        THREE.MathUtils.lerp(
          world.rotation.y,
          pointer.x * 0.085,
          0.035
        );

      world.rotation.x =
        THREE.MathUtils.lerp(
          world.rotation.x,
          pointer.y * 0.065,
          0.035
        );

      camera.position.x =
        THREE.MathUtils.lerp(
          camera.position.x,
          pointer.x * 0.95,
          0.025
        );

      camera.position.y =
        THREE.MathUtils.lerp(
          camera.position.y,
          pointer.y * 0.55,
          0.025
        );

      camera.lookAt(0, 0, -2);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      themeObserver.disconnect();

      particleGeometry.dispose();
      particleMaterial.dispose();

      coreGeometry.dispose();
      coreMaterial.dispose();

      ringGeometry.dispose();
      ringMaterial.dispose();

      orbitGeometry.dispose();
      orbit.material.dispose();

      satelliteGeometry.dispose();
      satelliteMaterial.dispose();

      diamondGeometry.dispose();
      diamond.material.dispose();

      cubeGeometry.dispose();
      cubeMaterial.dispose();

      orbitTwoGeometry.dispose();
      orbitTwoMaterial.dispose();

      ringThreeGeometry.dispose();
      ringThree.material.dispose();

      dodecaGeometry.dispose();
      dodecaMaterial.dispose();

      ribbons.forEach((ribbon) => {
        ribbon.geometry.dispose();
        ribbon.material.dispose();
      });

      tunnelGeometry.dispose();

      tunnelRings.forEach((ringItem) => {
        ringItem.mesh.material.dispose();
      });

      networkPointGeometry.dispose();
      networkPointMaterial.dispose();

      networkLineGeometry.dispose();
      networkLineMaterial.dispose();

      renderer.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="three-background"
      aria-hidden="true"
    />
  );
}

export default ThreeBackground;
