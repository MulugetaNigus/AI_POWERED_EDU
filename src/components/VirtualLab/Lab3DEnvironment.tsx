import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
// Add type declarations for Three.js modules
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// @ts-ignore
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

interface Lab3DEnvironmentProps {
  experimentId: string;
  onInteraction: (equipmentId: string, action: string) => void;
}

const Lab3DEnvironment: React.FC<Lab3DEnvironmentProps> = ({ experimentId, onInteraction }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [handPosition, setHandPosition] = useState({ x: 0, y: 0 });
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [handMode, setHandMode] = useState<'open' | 'closed'>('open');
  const [handDistance, setHandDistance] = useState(0.5); // Distance between hands
  const [showHandControls, setShowHandControls] = useState(false);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rightHandRef = useRef<THREE.Group | null>(null);
  const leftHandRef = useRef<THREE.Group | null>(null);
  const equipmentRefs = useRef<Map<string, THREE.Object3D>>(new Map());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const tableRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const handAnimationMixers = useRef<THREE.AnimationMixer[]>([]);

  // Initialize 3D scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 3);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.update();
    controlsRef.current = controls;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.bias = -0.0001;
    scene.add(directionalLight);

    // Add lab table
    const tableGeometry = new THREE.BoxGeometry(4, 0.1, 2);
    const tableMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513,
      roughness: 0.7,
      metalness: 0.1
    });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.y = 0.7;
    table.receiveShadow = true;
    scene.add(table);
    tableRef.current = table;

    // Add lab floor and walls
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xcccccc,
      roughness: 0.8,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const wallGeometry = new THREE.PlaneGeometry(10, 5);
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xf0f0f0,
      roughness: 0.9,
      metalness: 0.0
    });
    
    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.z = -5;
    backWall.position.y = 2.5;
    backWall.receiveShadow = true;
    scene.add(backWall);
    
    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.position.x = -5;
    leftWall.position.y = 2.5;
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Load 3D models based on experiment
    loadExperimentModels(experimentId, scene);

    // Load realistic hand models
    loadRealisticHandModels(scene);

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Update hand positions and animations
      updateHandPositions();
      
      // Update animation mixers
      const delta = 0.016; // Approximately 60fps
      handAnimationMixers.current.forEach(mixer => mixer.update(delta));
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Mouse event handlers
    const handleMouseMove = (event: MouseEvent) => {
      if (!mountRef.current) return;
      
      const rect = mountRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / mountRef.current.clientWidth) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / mountRef.current.clientHeight) * 2 + 1;
      
      setHandPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });

      if (isDragging && selectedObject && rightHandRef.current && cameraRef.current && tableRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObject(tableRef.current);
        
        if (intersects.length > 0) {
          // Move the selected object with the hand
          selectedObject.position.set(
            intersects[0].point.x,
            selectedObject.position.y,
            intersects[0].point.z
          );
          
          // Position the right hand near the object for grabbing
          rightHandRef.current.position.set(
            selectedObject.position.x + 0.05,
            selectedObject.position.y + 0.1,
            selectedObject.position.z
          );
          
          // Rotate hand to grabbing position
          rightHandRef.current.rotation.set(
            -Math.PI / 3, // Tilt down
            0,
            0
          );
          
          // Position the left hand on the other side for two-handed manipulation
          if (leftHandRef.current) {
            leftHandRef.current.position.set(
              selectedObject.position.x - 0.05,
              selectedObject.position.y + 0.1,
              selectedObject.position.z + handDistance
            );
            
            // Rotate left hand to grabbing position
            leftHandRef.current.rotation.set(
              -Math.PI / 3, // Tilt down
              0,
              0
            );
          }
        }
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (!cameraRef.current || !sceneRef.current) return;
      
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      
      // Check for intersections with equipment
      const interactableObjects: THREE.Object3D[] = [];
      equipmentRefs.current.forEach((object) => {
        interactableObjects.push(object);
      });
      
      const intersects = raycasterRef.current.intersectObjects(interactableObjects, true);
      
      if (intersects.length > 0) {
        // Find the top-level parent that's in our equipment refs
        let currentObject: THREE.Object3D | null = intersects[0].object;
        let equipmentId = '';
        
        while (currentObject && !equipmentId) {
          equipmentRefs.current.forEach((value, key) => {
            if (value === currentObject) {
              equipmentId = key;
            }
          });
          
          if (!equipmentId && currentObject.parent) {
            currentObject = currentObject.parent;
          } else {
            break;
          }
        }
        
        if (equipmentId) {
          setSelectedObject(currentObject);
          setIsDragging(true);
          setHandMode('closed');
          
          // Notify about the interaction
          onInteraction(equipmentId, 'select');
          
          // Disable orbit controls while dragging
          if (controlsRef.current) {
            controlsRef.current.enabled = false;
          }
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setHandMode('open');
      
      if (rightHandRef.current && leftHandRef.current) {
        // Animate hands returning to neutral positions
        animateHandsToNeutral();
      }
      
      // Re-enable orbit controls
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
      }
    };

    // Key event handlers for hand distance
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show hand controls when any key is pressed
      setShowHandControls(true);
      
      // Adjust hand distance with keys
      if (event.key === 'ArrowUp') {
        setHandDistance(prev => Math.min(prev + 0.1, 1.5));
      } else if (event.key === 'ArrowDown') {
        setHandDistance(prev => Math.max(prev - 0.1, 0.2));
      }
      
      // Toggle hand mode with spacebar
      if (event.code === 'Space') {
        setHandMode(prev => prev === 'open' ? 'closed' : 'open');
      }
    };

    mountRef.current.addEventListener('mousemove', handleMouseMove);
    mountRef.current.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);

    // Hide hand controls after 3 seconds of inactivity
    const hideControlsTimeout = setTimeout(() => {
      setShowHandControls(false);
    }, 3000);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeEventListener('mousemove', handleMouseMove);
      mountRef.current?.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      
      clearTimeout(hideControlsTimeout);
      
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [experimentId, onInteraction, handDistance, handMode]);

  // Animate hands to neutral position
  const animateHandsToNeutral = () => {
    if (!rightHandRef.current || !leftHandRef.current) return;
    
    // Define neutral positions
    const rightNeutralPos = new THREE.Vector3(0.5, 1, 1);
    const leftNeutralPos = new THREE.Vector3(-0.5, 1, 1);
    
    // Define neutral rotations
    const neutralRotation = new THREE.Euler(0, 0, 0);
    
    // Animation function
    const animateToNeutral = () => {
      // Interpolate positions
      rightHandRef.current!.position.lerp(rightNeutralPos, 0.05);
      leftHandRef.current!.position.lerp(leftNeutralPos, 0.05);
      
      // Interpolate rotations (simplified)
      rightHandRef.current!.rotation.x += (neutralRotation.x - rightHandRef.current!.rotation.x) * 0.05;
      rightHandRef.current!.rotation.y += (neutralRotation.y - rightHandRef.current!.rotation.y) * 0.05;
      rightHandRef.current!.rotation.z += (neutralRotation.z - rightHandRef.current!.rotation.z) * 0.05;
      
      leftHandRef.current!.rotation.x += (neutralRotation.x - leftHandRef.current!.rotation.x) * 0.05;
      leftHandRef.current!.rotation.y += (neutralRotation.y - leftHandRef.current!.rotation.y) * 0.05;
      leftHandRef.current!.rotation.z += (neutralRotation.z - leftHandRef.current!.rotation.z) * 0.05;
    };
    
    // Call once to start the animation
    animateToNeutral();
  };

  // Load experiment-specific 3D models
  const loadExperimentModels = (id: string, scene: THREE.Scene) => {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(dracoLoader);

    // For demo purposes, we'll create simple 3D objects instead of loading models
    // In a production app, you would load actual GLTF models

    switch (id) {
      case 'pendulum':
        // Create pendulum stand
        const standGeometry = new THREE.CylinderGeometry(0.05, 0.1, 1.2, 16);
        const standMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x444444,
          roughness: 0.7,
          metalness: 0.3
        });
        const stand = new THREE.Mesh(standGeometry, standMaterial);
        stand.position.set(-0.5, 1.3, 0);
        stand.castShadow = true;
        scene.add(stand);
        equipmentRefs.current.set('stand', stand);

        // Create pendulum arm
        const armGeometry = new THREE.BoxGeometry(0.8, 0.05, 0.05);
        const armMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x222222,
          roughness: 0.5,
          metalness: 0.5
        });
        const arm = new THREE.Mesh(armGeometry, armMaterial);
        arm.position.set(-0.1, 1.8, 0);
        arm.castShadow = true;
        scene.add(arm);
        equipmentRefs.current.set('arm', arm);

        // Create pendulum bob
        const bobGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const bobMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xcc0000,
          roughness: 0.2,
          metalness: 0.8
        });
        const bob = new THREE.Mesh(bobGeometry, bobMaterial);
        bob.position.set(0.3, 1.4, 0);
        bob.castShadow = true;
        scene.add(bob);
        equipmentRefs.current.set('bob', bob);

        // Create string
        const stringGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.5, 8);
        const stringMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xeeeeee,
          roughness: 0.9,
          metalness: 0.0
        });
        const string = new THREE.Mesh(stringGeometry, stringMaterial);
        string.position.set(0.3, 1.6, 0);
        string.castShadow = true;
        scene.add(string);
        equipmentRefs.current.set('string', string);

        // Create ruler
        const rulerGeometry = new THREE.BoxGeometry(0.5, 0.02, 0.05);
        const rulerMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xffff00,
          roughness: 0.5,
          metalness: 0.1
        });
        const ruler = new THREE.Mesh(rulerGeometry, rulerMaterial);
        ruler.position.set(0.8, 0.8, 0.3);
        ruler.castShadow = true;
        scene.add(ruler);
        equipmentRefs.current.set('ruler', ruler);
        break;

      case 'titration':
        // Create burette
        const buretteGeometry = new THREE.CylinderGeometry(0.03, 0.02, 0.8, 16);
        const buretteMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xaaaaff,
          transparent: true,
          opacity: 0.7
        });
        const burette = new THREE.Mesh(buretteGeometry, buretteMaterial);
        burette.position.set(0, 1.5, 0);
        burette.castShadow = true;
        scene.add(burette);
        equipmentRefs.current.set('burette', burette);

        // Create burette stand
        const standBaseGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.3);
        const standBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const standBase = new THREE.Mesh(standBaseGeometry, standBaseMaterial);
        standBase.position.set(0, 0.75, 0);
        standBase.castShadow = true;
        scene.add(standBase);

        const standPoleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 16);
        const standPoleMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const standPole = new THREE.Mesh(standPoleGeometry, standPoleMaterial);
        standPole.position.set(0, 1.5, 0);
        standPole.castShadow = true;
        scene.add(standPole);
        equipmentRefs.current.set('stand', standPole);

        // Create flask
        const flaskBottomGeometry = new THREE.SphereGeometry(0.15, 32, 32);
        const flaskTopGeometry = new THREE.CylinderGeometry(0.05, 0.15, 0.2, 32);
        const flaskMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xaaaaff,
          transparent: true,
          opacity: 0.7
        });
        
        const flaskBottom = new THREE.Mesh(flaskBottomGeometry, flaskMaterial);
        flaskBottom.position.set(0, 0.85, 0.4);
        flaskBottom.castShadow = true;
        
        const flaskTop = new THREE.Mesh(flaskTopGeometry, flaskMaterial);
        flaskTop.position.set(0, 1.05, 0.4);
        flaskTop.castShadow = true;
        
        const flask = new THREE.Group();
        flask.add(flaskBottom);
        flask.add(flaskTop);
        scene.add(flask);
        equipmentRefs.current.set('flask', flask);

        // Create chemicals
        const chemicalGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16);
        
        const naohMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const naoh = new THREE.Mesh(chemicalGeometry, naohMaterial);
        naoh.position.set(-0.5, 0.8, 0.3);
        naoh.castShadow = true;
        scene.add(naoh);
        equipmentRefs.current.set('naoh', naoh);
        
        const hclMaterial = new THREE.MeshStandardMaterial({ color: 0xffffaa });
        const hcl = new THREE.Mesh(chemicalGeometry, hclMaterial);
        hcl.position.set(-0.7, 0.8, 0.3);
        hcl.castShadow = true;
        scene.add(hcl);
        equipmentRefs.current.set('hcl', hcl);
        
        const indicatorMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });
        const indicator = new THREE.Mesh(chemicalGeometry, indicatorMaterial);
        indicator.position.set(-0.9, 0.8, 0.3);
        indicator.castShadow = true;
        scene.add(indicator);
        equipmentRefs.current.set('indicator', indicator);
        break;

      case 'microscopy':
        // Create microscope base
        const baseGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.6);
        const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(0, 0.75, 0);
        base.castShadow = true;
        
        // Create microscope arm
        const armGeometry2 = new THREE.BoxGeometry(0.1, 0.5, 0.1);
        const armMaterial2 = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const microscopeArm = new THREE.Mesh(armGeometry2, armMaterial2);
        microscopeArm.position.set(0, 1, -0.2);
        microscopeArm.castShadow = true;
        
        // Create microscope head
        const headGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.rotation.x = Math.PI / 2;
        head.position.set(0, 1.2, 0);
        head.castShadow = true;
        
        // Create microscope stage
        const stageGeometry = new THREE.BoxGeometry(0.3, 0.02, 0.3);
        const stageMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const stage = new THREE.Mesh(stageGeometry, stageMaterial);
        stage.position.set(0, 0.9, 0);
        stage.castShadow = true;
        
        // Create microscope eyepiece
        const eyepieceGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16);
        const eyepieceMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const eyepiece = new THREE.Mesh(eyepieceGeometry, eyepieceMaterial);
        eyepiece.rotation.x = Math.PI / 2;
        eyepiece.position.set(0, 1.4, 0);
        eyepiece.castShadow = true;
        
        // Create microscope objective lenses
        const lensGeometry = new THREE.CylinderGeometry(0.03, 0.04, 0.1, 16);
        const lensMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        
        const lens1 = new THREE.Mesh(lensGeometry, lensMaterial);
        lens1.rotation.x = Math.PI / 2;
        lens1.position.set(-0.05, 1.05, 0);
        lens1.castShadow = true;
        
        const lens2 = new THREE.Mesh(lensGeometry, lensMaterial);
        lens2.rotation.x = Math.PI / 2;
        lens2.position.set(0, 1.05, 0);
        lens2.castShadow = true;
        
        const lens3 = new THREE.Mesh(lensGeometry, lensMaterial);
        lens3.rotation.x = Math.PI / 2;
        lens3.position.set(0.05, 1.05, 0);
        lens3.castShadow = true;
        
        // Create microscope slide
        const slideGeometry = new THREE.BoxGeometry(0.15, 0.01, 0.05);
        const slideMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xaaaaff,
          transparent: true,
          opacity: 0.7
        });
        const slide = new THREE.Mesh(slideGeometry, slideMaterial);
        slide.position.set(0, 0.91, 0);
        slide.castShadow = true;
        
        // Group all microscope parts
        const microscope = new THREE.Group();
        microscope.add(base);
        microscope.add(microscopeArm);
        microscope.add(head);
        microscope.add(stage);
        microscope.add(eyepiece);
        microscope.add(lens1);
        microscope.add(lens2);
        microscope.add(lens3);
        microscope.add(slide);
        
        scene.add(microscope);
        equipmentRefs.current.set('microscope', microscope);
        equipmentRefs.current.set('slide', slide);
        break;

      default:
        break;
    }

    setIsLoading(false);
  };

  // Load realistic hand models
  const loadRealisticHandModels = (scene: THREE.Scene) => {
    // In a production app, you would load detailed hand models from GLTF files
    // For this example, we'll create more detailed hand representations
    
    // Create hand group for right hand
    const rightHand = new THREE.Group();
    
    // Palm
    const palmGeometry = new THREE.BoxGeometry(0.08, 0.12, 0.03);
    const skinMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffccaa,
      roughness: 0.8,
      metalness: 0.1
    });
    const palm = new THREE.Mesh(palmGeometry, skinMaterial);
    palm.castShadow = true;
    rightHand.add(palm);
    
    // Fingers
    const createFinger = (x: number, y: number, length: number, width: number) => {
      const fingerGroup = new THREE.Group();
      
      // First segment
      const segment1Geo = new THREE.BoxGeometry(width, length * 0.5, width);
      const segment1 = new THREE.Mesh(segment1Geo, skinMaterial);
      segment1.position.y = length * 0.25;
      segment1.castShadow = true;
      fingerGroup.add(segment1);
      
      // Second segment
      const segment2Geo = new THREE.BoxGeometry(width * 0.9, length * 0.4, width * 0.9);
      const segment2 = new THREE.Mesh(segment2Geo, skinMaterial);
      segment2.position.y = length * 0.7;
      segment2.castShadow = true;
      fingerGroup.add(segment2);
      
      // Position the finger
      fingerGroup.position.set(x, y, 0);
      
      return fingerGroup;
    };
    
    // Add fingers to right hand
    const thumb = createFinger(-0.05, 0.06, 0.1, 0.025);
    thumb.rotation.z = -Math.PI / 4;
    rightHand.add(thumb);
    
    const indexFinger = createFinger(-0.025, 0.06, 0.12, 0.02);
    rightHand.add(indexFinger);
    
    const middleFinger = createFinger(0, 0.06, 0.13, 0.02);
    rightHand.add(middleFinger);
    
    const ringFinger = createFinger(0.025, 0.06, 0.12, 0.02);
    rightHand.add(ringFinger);
    
    const pinkyFinger = createFinger(0.05, 0.06, 0.1, 0.018);
    rightHand.add(pinkyFinger);
    
    // Position right hand
    rightHand.position.set(0.5, 1, 1);
    scene.add(rightHand);
    rightHandRef.current = rightHand;
    
    // Create left hand (mirror of right hand)
    const leftHand = rightHand.clone();
    leftHand.scale.x = -1; // Mirror
    leftHand.position.set(-0.5, 1, 1);
    scene.add(leftHand);
    leftHandRef.current = leftHand;
    
    // Create simple animation mixers for hand gestures
    const rightHandMixer = new THREE.AnimationMixer(rightHand);
    const leftHandMixer = new THREE.AnimationMixer(leftHand);
    
    handAnimationMixers.current = [rightHandMixer, leftHandMixer];
  };

  // Update hand positions based on mouse movement and interactions
  const updateHandPositions = () => {
    if (!rightHandRef.current || !leftHandRef.current || !cameraRef.current || !sceneRef.current) return;
    
    if (!isDragging) {
      // Move right hand with mouse when not dragging
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children);
      
      if (intersects.length > 0) {
        // Smoothly move the right hand to the intersection point
        rightHandRef.current.position.lerp(new THREE.Vector3(
          intersects[0].point.x,
          intersects[0].point.y + 0.1, // Slightly above the surface
          intersects[0].point.z
        ), 0.1);
        
        // Left hand follows at a distance
        leftHandRef.current.position.lerp(new THREE.Vector3(
          intersects[0].point.x - handDistance,
          intersects[0].point.y + 0.1,
          intersects[0].point.z
        ), 0.1);
      }
    }
    
    // Update hand pose based on mode
    updateHandPose(rightHandRef.current, 'right', handMode);
    updateHandPose(leftHandRef.current, 'left', handMode);
  };
  
  // Update hand pose (open or closed)
  const updateHandPose = (hand: THREE.Group, side: 'left' | 'right', mode: 'open' | 'closed') => {
    if (!hand) return;
    
    // Get all fingers (children after the palm)
    const fingers = hand.children.slice(1);
    
    fingers.forEach((finger: THREE.Object3D, index: number) => {
      if (mode === 'closed') {
        // Curl fingers for grabbing
        finger.rotation.x = Math.PI / 3; // Curl down
        
        // Thumb moves differently
        if (index === 0) {
          finger.rotation.z = side === 'right' ? Math.PI / 3 : -Math.PI / 3;
        }
      } else {
        // Straighten fingers
        finger.rotation.x = 0;
        
        // Reset thumb
        if (index === 0) {
          finger.rotation.z = side === 'right' ? -Math.PI / 4 : Math.PI / 4;
        }
      }
    });
  };

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-10">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Loading 3D Environment ({loadingProgress}%)</p>
          </div>
        </div>
      )}
      <div ref={mountRef} className="w-full h-full"></div>
      
      {/* Hand controls overlay */}
      {showHandControls && (
        <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-80 text-white p-3 rounded-lg text-sm">
          <p className="font-bold mb-1">Hand Controls:</p>
          <p>↑/↓ - Adjust hand distance</p>
          <p>Space - Toggle grab/release</p>
          <p>Current mode: {handMode === 'open' ? 'Open hands' : 'Grabbing'}</p>
        </div>
      )}
      
      {/* Hand cursor overlay */}
      <div 
        className="absolute pointer-events-none"
        style={{
          left: `${handPosition.x}px`,
          top: `${handPosition.y}px`,
          transform: 'translate(-50%, -50%)',
          display: isDragging ? 'block' : 'none'
        }}
      >
        <div className="w-8 h-8 border-2 border-blue-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default Lab3DEnvironment; 