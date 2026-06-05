import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BackgroundStars() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Create Three.js scene
    const scene = new THREE.Scene();

    // Configure camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      2000,
    );

    camera.position.z = 1;

    // Initialize renderer with transparent background
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    mount.appendChild(renderer.domElement);

    // Generate star positions
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];

    for (let i = 0; i < 2500; i++) {
      starVertices.push(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        -Math.random() * 2000,
      );
    }

    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3),
    );

    // Configure star appearance
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);

    scene.add(stars);

    const positions = starGeometry.attributes.position.array;

    // Animate stars moving toward the viewer
    const animate = () => {
      requestAnimationFrame(animate);

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += 0.15;

        if (positions[i + 2] > 0) {
          positions[i + 2] = -2000;
        }
      }

      starGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Handle viewport resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      mount.removeChild(renderer.domElement);

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
      }}
    />
  );
}
