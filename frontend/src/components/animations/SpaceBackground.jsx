import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SpaceBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) return;

    // Create Three.js scene
    const scene = new THREE.Scene();

    // Configure camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000,
    );

    camera.position.z = 5;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setClearColor(0x000000, 0);

    mount.appendChild(renderer.domElement);

    // Create star field
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = [];

    for (let i = 0; i < starCount; i++) {
      positions.push(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        -Math.random() * 200,
      );
    }

    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      depthWrite: false,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);

    scene.add(stars);

    // Load nebula background texture
    const textureLoader = new THREE.TextureLoader();

    let cloudPlane = null;

    textureLoader.load("/textures/nebula.png", (texture) => {
      const cloudMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      cloudMaterial.depthTest = false;

      cloudPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(80, 50),
        cloudMaterial,
      );

      cloudPlane.position.set(0, 0, -30);

      scene.add(cloudPlane);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      stars.rotation.y += 0.0002;

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

      if (mount && renderer.domElement.parentNode) {
        mount.removeChild(renderer.domElement);
      }

      starGeometry.dispose();
      starMaterial.dispose();

      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="space-background" />;
}
