import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class Scene3D {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false
        });

        this.container = document.getElementById('canvas-container');
        if (!this.container) {
            throw new Error('Canvas container not found!');
        }

        this.init();
        this.createFlower();
        this.setupLights();
        this.animate();
    }

    init() {
        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;
        this.renderer.setSize(containerWidth, containerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 20;
        this.camera.position.y = 2;
        this.camera.position.x = 0;

        this.container.style.pointerEvents = 'auto';

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        this.controls.rotateSpeed = 1.0;
        this.controls.panSpeed = 1.0;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 50;
        this.controls.target.set(0, 5, 0);
    }

    createFlower() {
        this.flower = new THREE.Group();
        this.flower.position.y = 8;
        
        // Membuat kelopak bunga
        const petalGeometry = new THREE.TorusKnotGeometry(2, 0.3, 100, 16);
        const petalMaterial = new THREE.MeshPhongMaterial({
            color: 0xf75023,
            shininess: 100,
            specular: 0x444444,
            emissive: 0xf75023,
            emissiveIntensity: 0.2
        });

        // Membuat beberapa kelopak bunga
        for (let i = 0; i < 8; i++) {
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);
            petal.rotation.x = (Math.PI / 4) * i;
            petal.rotation.y = (Math.PI / 4) * i;
            this.flower.add(petal);
        }

        // Membuat pusat bunga
        const centerGeometry = new THREE.SphereGeometry(1, 32, 32);
        const centerMaterial = new THREE.MeshPhongMaterial({
            color: 0xffff00,
            shininess: 100,
            emissive: 0xffff00,
            emissiveIntensity: 0.2
        });
        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        this.flower.add(center);

        // Membuat tangkai
        const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 10, 32);
        const stemMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            shininess: 30
        });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = -5;
        this.flower.add(stem);

        // Membuat daun
        const leafGeometry = new THREE.TorusGeometry(1, 0.2, 16, 100, Math.PI);
        const leafMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            shininess: 30
        });

        // Menambahkan dua daun
        for (let i = 0; i < 2; i++) {
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            leaf.position.y = -3 + (i * 2);
            leaf.rotation.x = Math.PI / 2;
            leaf.rotation.y = Math.PI / 2 * (i * 2 - 1);
            this.flower.add(leaf);
        }

        this.scene.add(this.flower);

        // Menambahkan partikel untuk efek
        this.addParticles();
    }

    addParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        const posArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 30;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xf75023,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        });

        this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const light1 = new THREE.DirectionalLight(0xffffff, 1);
        light1.position.set(5, 5, 5);
        this.scene.add(light1);

        const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
        light2.position.set(-5, -5, -5);
        this.scene.add(light2);

        const pointLight = new THREE.PointLight(0xf75023, 1, 100);
        pointLight.position.set(0, 0, 10);
        this.scene.add(pointLight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.flower) {
            // Rotasi keseluruhan bunga
            this.flower.rotation.y += 0.005;
            
            // Animasi kelopak bunga
            this.flower.children.forEach((child, index) => {
                if (index < 8) { // Hanya untuk kelopak bunga
                    child.rotation.z += Math.sin(Date.now() * 0.001 + index) * 0.002;
                }
            });
        }

        if (this.particles) {
            this.particles.rotation.x += 0.0002;
            this.particles.rotation.y += 0.0002;
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;
        
        this.camera.aspect = containerWidth / containerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(containerWidth, containerHeight);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Scene3D();
});