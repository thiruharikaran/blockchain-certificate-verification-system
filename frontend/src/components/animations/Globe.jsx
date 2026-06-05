import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

export default function Globe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) return;

    // Create scene
    const scene = new THREE.Scene();

    // Configure camera
    const camera = new THREE.PerspectiveCamera(
      52,
      mount.clientWidth / mount.clientHeight,
      0.1,
      2000,
    );

    camera.position.set(0, 0, 7);

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(mount.clientWidth, mount.clientHeight);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 0.9;

    mount.appendChild(renderer.domElement);

    // Handle viewport resizing
    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      renderer.setSize(width, height);

      camera.aspect = width / height;

      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    // Load HDR environment map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    new RGBELoader()
      .setDataType(THREE.FloatType)
      .load(
        "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr",
        (texture) => {
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;

          scene.environment = envMap;

          texture.dispose();
          pmremGenerator.dispose();
        },
      );

    // Create globe group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Outer glow effect
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(2.05, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.05,
        side: THREE.BackSide,
      }),
    );

    glow.renderOrder = -1;
    scene.add(glow);

    // Main globe
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.75, 64, 64),
      new THREE.MeshPhysicalMaterial({
        color: 0x6366f1,
        roughness: 0.15,
        metalness: 0.05,
        clearcoat: 1,
        transmission: 0.6,
        thickness: 1.2,
        ior: 1.5,
        envMapIntensity: 1.2,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.35,
      }),
    );

    globeGroup.add(sphere);

    // Atmospheric layer
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.85, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    );

    atmosphere.scale.set(1.03, 1.03, 1.03);

    globeGroup.add(atmosphere);

    // Animated orbit ring
    const segments = 400;
    const radius = 2.5;

    const positions = [];
    const colors = [];

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;

      positions.push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);

      const color = new THREE.Color();

      color.setHSL(i / segments, 1, 0.6);

      colors.push(color.r, color.g, color.b);
    }

    const ringGeometry = new THREE.BufferGeometry();

    ringGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );

    ringGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3),
    );

    const ring = new THREE.LineLoop(
      ringGeometry,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );

    ring.rotation.x = 0.15;

    globeGroup.add(ring);

    // Orbiting shapes
    const orbitShapes = new THREE.Group();

    globeGroup.add(orbitShapes);

    const orbitRadius = 2.8;

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.65, 0.65),
      new THREE.MeshPhysicalMaterial({
        color: 0x22d3ee,
        metalness: 0.3,
        roughness: 0.4,
        clearcoat: 0.3,
      }),
    );

    cube.position.set(orbitRadius, 0, 0);

    orbitShapes.add(cube);

    const prism = new THREE.Mesh(
      new THREE.CylinderGeometry(0, 0.55, 1.1, 3),
      new THREE.MeshPhysicalMaterial({
        color: 0x22d3ee,
        metalness: 0.3,
        roughness: 0.4,
        clearcoat: 0.3,
      }),
    );

    prism.rotation.x = Math.PI / 2;

    prism.position.set(-orbitRadius * 0.7, -orbitRadius * 0.7, 0);

    orbitShapes.add(prism);

    // Scene lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    const rimLight = new THREE.DirectionalLight(0xffffff, 5.5);

    rimLight.position.set(8, 3, 6);

    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x4f46e5, 0.6);

    fillLight.position.set(-5, 0, 2);

    scene.add(fillLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      globeGroup.position.y = Math.sin(time * 0.6) * 0.08;

      sphere.rotation.y += 0.0015;

      ring.rotation.z += 0.001;

      orbitShapes.rotation.z += 0.0015;

      cube.rotation.x += 0.01;

      cube.rotation.y += 0.01;

      prism.rotation.y += 0.008;

      prism.rotation.x += 0.005;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);

      mount.removeChild(renderer.domElement);

      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="globe-container" />;
}
