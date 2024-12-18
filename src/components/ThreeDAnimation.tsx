// src/components/ThreeDAnimation.tsx

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

const ThreeDAnimation: React.FC = () => {
    const mountRef = useRef<HTMLDivElement | null>(null);
    let letters: THREE.Mesh[] = [];
    let line: THREE.Line;
    let currentLetterIndex = 0;

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        if (mountRef.current) {
            renderer.setSize(window.innerWidth, window.innerHeight);
            mountRef.current.appendChild(renderer.domElement);
        }

        // Load font and create letters
        const loader = new FontLoader();
        loader.load('https://threejs.org/fonts/helvetiker_regular.typeface.json', (font) => {
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const lettersArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

            lettersArray.forEach((letter, index) => {
                const textGeometry = new THREE.TextGeometry(letter, {
                    font: font,
                    size: 1,
                    height: 0.1,
                });

                const letterMesh = new THREE.Mesh(textGeometry, textMaterial);
                letterMesh.position.set(index * 1.5 - (lettersArray.length * 1.5) / 2, 0, 0); // Position letters in a line
                letters.push(letterMesh);
                scene.add(letterMesh);
            });

            // Create a line to separate letters
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-10, 0.5, 0),
                new THREE.Vector3(10, 0.5, 0),
            ]);
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
            line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
        });

        camera.position.z = 5;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            // Update the visibility of letters
            letters.forEach((letter, index) => {
                letter.visible = index === currentLetterIndex;
            });

            // Move the line
            line.position.x += 0.01;
            if (line.position.x > 10) {
                line.position.x = -10; // Reset line position
            }

            renderer.render(scene, camera);
        };

        animate();

        // Change letter every second
        const changeLetter = () => {
            currentLetterIndex = (currentLetterIndex + 1) % letters.length;
        };
        const letterInterval = setInterval(changeLetter, 1000);

        // Cleanup on unmount
        return () => {
            clearInterval(letterInterval);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} />;
};

export default ThreeDAnimation;