import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function FloatingCube() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) return;

    // Create Three.js scene
    const scene = new THREE.Scene();

    // Configure camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );

    camera.position.set(-2, -0.4, 7);

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(mount.clientWidth, mount.clientHeight);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setClearColor(0x000000, 0);

    mount.appendChild(renderer.domElement);

    // Track mouse position for future interactions
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;

      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Create floating cube
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 1.9, 1.9),
      new THREE.MeshPhysicalMaterial({
        color: 0x8e7cff,
        metalness: 0.45,
        roughness: 0.25,
        clearcoat: 0.7,
      }),
    );

    cube.position.set(-2.3, -0.2, 0);
    cube.rotation.set(-0.15, 0, 0.25);

    scene.add(cube);

    // Lighting setup
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);

    keyLight.position.set(3, 3, 4);

    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x6366f1, 0.8);

    fillLight.position.set(-4, -2, 2);

    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    scene.add(ambientLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      cube.rotation.x += 0.002;
      cube.rotation.y += 0.002;

      cube.position.y = Math.sin(time * 1.2) * 0.4;

      cube.position.x = -2.7 + Math.cos(time * 0.6) * 0.25;

      renderer.render(scene, camera);
    };

    animate();

    // Handle viewport resizing
    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      renderer.setSize(width, height);

      camera.aspect = width / height;

      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);

      window.removeEventListener("resize", handleResize);

      mount.removeChild(renderer.domElement);

      renderer.dispose();
    };
  }, []);

  return <div className="floating-cube" ref={mountRef} />;
}
