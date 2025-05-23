import * as THREE from "three";

import { ToastContainer, toast } from "react-toastify";
import { useEffect, useRef } from "react";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import processOldFiles from "@/Threejs/processOldFiles";
import { useRouter } from "next/router";

// Function to deserialize the model state from the URL
const deserializeModelState = (encodedState) => {
  const decodedState = decodeURIComponent(encodedState);
  return JSON.parse(decodedState);
};

// Function to apply the model state (position, rotation, scale, material) to the 3D model
const applyModelState = (model, state) => {
  // model.position.fromArray(state.position);
  // model.rotation.fromArray(state.rotation);
  // model.scale.fromArray(state.scale);
  // Create a material

  if (!state.imagePath) {
    router.push("/"); // Redirect to homepage
    return;
  }

  const color = `#${state.material.color}`;
  const material = new THREE.MeshPhongMaterial({
    color: new THREE.Color(color),
    specular: 0x888888,
    shininess: state.material.shininess,
    side: THREE.DoubleSide,
    emissive: 0x000000,
    emissiveIntensity: 1,
    wireframe: state.material.wireframe,
    transparent: state.material.transparent,
    opacity: state.material.opacity,
    depthWrite: true,
    depthTest: true,
  });

  const modelWithMaterial = { model, material };
  // Load the STL file from the filePath if provided
  if (state.imagePath) {
    loadModelFromFile(state.imagePath, modelWithMaterial);
  }
};

// Function to load and render the STL model from the local file
// const loadModelFromFile = (filePath, { model, material }) => {
//   const loader = new STLLoader();
//   loader.load(filePath, (geometry) => {
//     const stlModel = new THREE.Mesh(geometry, material);
//     // Add the loaded model to the scene
//     console.log("material", material);
//     geometry.computeBoundingBox();
//     const boundingBox = geometry.boundingBox;
//     const center = new THREE.Vector3();
//     boundingBox.getCenter(center);
//     geometry.center();
//     const size = boundingBox.getSize(new THREE.Vector3());
//     const maxDimension = Math.max(size.x, size.y, size.z);
//     const scaleFactor = 50 / maxDimension;
//     stlModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

//     // center the model
//     stlModel.position.set(
//       -center.x * scaleFactor,
//       -center.y * scaleFactor,
//       -center.z * scaleFactor
//     );
//     model.add(stlModel);
//   });
// };

// Function to load and render the STL model from the s3 bucket
const loadModelFromFile = async (filePath, { model, material }) => {
  try {
    // Extract the object key from the S3 URL
    const objectKey = filePath.split(".com/")[1];

    // Get pre-signed URL
    const response = await fetch(
      `/api/s3presignedurl?objectKey=${encodeURIComponent(objectKey)}`
    );
    if (!response.ok) {
      throw new Error("Failed to get signed URL");
    }

    const { signedUrl } = await response.json();

    // Use the signed URL to load the model
    const loader = new STLLoader();
    loader.load(
      signedUrl,
      (geometry) => {
        const stlModel = new THREE.Mesh(geometry, material);
        // ...existing code...
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        geometry.center();
        const size = boundingBox.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scaleFactor = 50 / maxDimension;
        stlModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

        stlModel.position.set(
          -center.x * scaleFactor,
          -center.y * scaleFactor,
          -center.z * scaleFactor
        );
        model.add(stlModel);
      },
      undefined,
      (error) => {
        console.error("Error loading STL:", error);
        toast.error("Failed to load 3D model", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "colored",
        });
      }
    );
  } catch (error) {
    console.error("Error:", error);
    toast.error("Failed to load 3D model", {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      theme: "colored",
    });
  }
};
// Three.js Scene Setup
const setupThreeJS = (container, serializedState, router) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 50);
  camera.lookAt(0, 0, 0);
  const canvas = document.querySelector("canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Optional, for smoother motion
  controls.dampingFactor = 0.25; // Optional, for smoother motion
  controls.screenSpacePanning = false; // Optional, for panning in screen space
  controls.minDistance = 40; // Set minDistance to the desired distance
  controls.maxDistance = 300; // Set maxDistance to the same value to lock zoom level
  controls.enableZoom = true; // Enable zooming
  controls.enablePan = true; // Enable panning

  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };

  controls.zoomSpeed = 1.0; // Set zoom speed
  controls.panSpeed = 1.0; // Set pan speed
  controls.target.set(0, 0, 0); //
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Stronger ambient light for base lighting
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight1.position.set(1, 1, 1).normalize();
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(-1, -1, 1).normalize();
  scene.add(directionalLight2);

  // Initialize the STL model and apply the state
  const model = new THREE.Group();
  scene.add(model);

  const state = deserializeModelState(serializedState);
  applyModelState(model, state);

  // Resize the renderer when the window is resized
  window.addEventListener("resize", function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

  // Render loop
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };

  animate();
};

// Main component for the Shared page
const SharedPage = () => {
  const router = useRouter();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!router.isReady) {
      return; // Wait until the router is ready and the query parameters are populated
    }

    const { state } = router.query;

    let parsedState;
    if (typeof state === "string") {
      try {
        parsedState = JSON.parse(state);
      } catch (e) {
        console.error("Failed to parse state:", e);
      }
    } else {
      parsedState = state;
    }
    const filePath = parsedState?.imagePath;
    const fileName = filePath.replace("/uploads/", "");

    // Check if the file has expired
    const isExpired = processOldFiles(fileName);

    if (
      state &&
      Object.keys(state).length > 0 &&
      containerRef.current &&
      !isExpired
    ) {
      setupThreeJS(containerRef.current, state); // Parse state if it's a stringified object
    } else {
      // Notify the User that the file has expired
      toast.error("The file has expired or is invalid.", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
        icon: false,
      });
      router.push("/"); // Redirect to homepage
    }
  }, [router, router.isReady, router.query]);

  return (
    <main>
      <div>
        <ToastContainer className={"z-50"} />
        <canvas ref={containerRef} />
      </div>
    </main>
  );
};

export default SharedPage;
