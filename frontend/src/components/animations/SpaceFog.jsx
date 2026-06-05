import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SpaceFog() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) return;

    // Create Three.js scene
    const scene = new THREE.Scene();

    // Configure camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      1,
      1000,
    );

    camera.position.z = 1;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
    });

    renderer.setSize(mount.clientWidth, mount.clientHeight);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setClearColor(0x000000, 0);

    mount.appendChild(renderer.domElement);

    // Generate background stars
    const starCount = 1200;

    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 2000;

      const y = (Math.random() - 0.5) * 2000;

      const z = -Math.random() * 2000;

      positions.push(x, y, z);
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      transparent: true,
      opacity: 0.8,
    });

    const stars = new THREE.Points(geometry, material);

    scene.add(stars);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      stars.rotation.y += 0.0001;

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
      window.removeEventListener("resize", handleResize);

      geometry.dispose();
      material.dispose();

      if (mount && renderer.domElement.parentNode) {
        mount.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, []);

  return <div className="space-fog" ref={mountRef} />;
}
