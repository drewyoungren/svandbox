<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import * as THREE from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

  let stopGo = true;

  //scene stuff

  /**
   * @type Element
   */
  let canvas;

  /**
   * @type THREE.WebGLRenderer
   */
  let renderer;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#DEDEDE");

  const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 0);

  let w = 800;
  let h = 600;

  // @ts-ignore
  camera.position.set(4, 3, 14);

  // const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0x7744cc,
    // shininess: 80,
  });
  // const cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

  // const light = new THREE.AmbientLight(0xffffff);
  // scene.add(light);
  const light2 = new THREE.DirectionalLight(0xffffff, 10);
  scene.add(light2);

  // Controls
  let controls;

  /**
   * Animate loop
   * @param time {number}
   */
  function render(time) {
    time *= 0.001;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // cube.rotation.x = 2 * time;
    // cube.rotation.y = 3 * time;

    evolve();
    drawStatus();

    renderer.setSize(w, h);
    renderer.render(scene, camera);

    if (stopGo) requestAnimationFrame(render);
  }

  onMount(() => {
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.render(scene, camera);

    controls = new OrbitControls(camera, canvas);

    // Enable camera keyboard controls
    controls.listenToKeyEvents(canvas);

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.maxPolarAngle = Math.PI;

    // controls.addEventListener('change', requestFrameIfNotRequested);
    // // controls2.addEventListener('change', requestFrameIfNotRequested);

    // // resize();
    // requestFrameIfNotRequested();

    requestAnimationFrame(render);
  });

  // grid stuff

  const STEP = 1;

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
  });

  const lineMesh = new THREE.LineSegments(undefined, lineMaterial);
  scene.add(lineMesh);

  /**
   *
   * @param totalSteps {number}
   */
  function drawGrid(totalSteps) {
    const points = [];
    for (let i = 0; i <= totalSteps + 1; i++) {
      points.push(new THREE.Vector3(i * STEP, 0, 0));
      points.push(new THREE.Vector3(i * STEP, 0, STEP * (totalSteps + 1)));
      points.push(new THREE.Vector3(0, 0, i * STEP));
      points.push(new THREE.Vector3(STEP * (totalSteps + 1), 0, i * STEP));
    }

    const gridGeometry = new THREE.BufferGeometry().setFromPoints(points);
    lineMesh.geometry.dispose();
    lineMesh.geometry = gridGeometry;
  }

  $: drawGrid(totalSteps);

  let totalSteps = 4;
  let timeStep = 500; // how oftern to update, in milliseconds

  /**
   * @typedef {Object} GridEntry
   * @property {number} i
   * @property {number} j
   * @property {number} count
   * @property {THREE.Mesh} box
   */

  /**
   * @type Array<GridEntry>
   */
  let status = [];

  function resetStatus() {
    status.forEach((e) => {
      e.box.geometry.dispose();
      scene.remove(e.box);
    });
    status = [];
    for (let i = 0; i <= totalSteps + 1; i++) {
      for (let j = 0; j + i <= totalSteps + 1; j++) {
        const count = 0;
        const box = new THREE.Mesh(
          count == 0
            ? undefined
            : new THREE.BoxGeometry(0.8 * STEP, count, 0.8 * STEP),
          new THREE.MeshBasicMaterial({
            color: Math.floor(((i + j) / (2 * totalSteps)) * 0xaa33aa),
          })
        );
        status.push({
          i,
          j,
          count,
          box,
        });
        box.position.x = i * STEP + STEP / 2;
        box.position.z = j * STEP + STEP / 2;
        box.position.y = count / 2;
        box.count = count;
        scene.add(box);
      }
    }
  }

  function drawStatus() {
    const total = status
      .filter((e) => e.i + e.j == totalSteps + 1)
      .map((e) => e.count)
      .reduce((p, n) => p + n);
    status.forEach((e) => {
      let { count, box } = e;
      if (count != box.count) {
        box.geometry?.dispose();
        if (count > 0) {
          box.geometry = new THREE.BoxGeometry(
            0.8 * STEP,
            e.i + e.j <= totalSteps ? count : (10 * count) / total,
            0.8 * STEP
          );
          box.position.y =
            e.i + e.j <= totalSteps ? count / 2 : (5 * count) / total;
          box.visible = true;
        } else {
          console.log("Should reset to 0", e.i, e.j);
          box.visible = false;
        }
      }
    });
  }

  function evolve() {
    for (let k = totalSteps; k >= 0; k--) {
      status
        .filter((e) => e.i + e.j == k)
        .forEach((entry) => {
          let { i, j, count, box } = entry;
          for (let g = 0; g < count; g++) {
            console.log(i, j, count, box.count);
            if (Math.random() < 1 / 20) {
              entry.count -= 1;
              console.log("Ant moving!", entry.count);
              if (Math.random() > 0.5) {
                // go up
                status.find((e) => e.i == i + 1 && e.j == j).count++;
              } else {
                status.find((e) => e.i == i && e.j == j + 1).count++;
              }
            }
          }
        });
    }
  }

  resetStatus();
</script>

<h1>Ants Marching</h1>

<p>
  Ants move along a rectangular lattice by choosing only 'up' or 'right' with
  equal probability at each step. Where do they end up after <em>n</em> steps?
</p>

<div id="controls">
  <input
    type="range"
    name="totalSteps"
    id="totalSteps"
    bind:value={totalSteps}
    on:input={resetStatus}
    min="2"
    max="10"
  />
  <input
    type="range"
    name="timeStep"
    id="timeStep"
    bind:value={timeStep}
    min="50"
    max="1000"
    step="50"
  />
  <button
    on:click={() => {
      stopGo = !stopGo;
      if (stopGo) requestAnimationFrame(render);
    }}>{stopGo ? "Stop" : "Go"}</button
  >
  <button
    on:click={() => {
      status.find((e) => e.i == 0 && e.j == 0).count += 1;
    }}>ANT!</button
  >
</div>

<canvas bind:this={canvas} bind:clientWidth={w} bind:clientHeight={h}></canvas>

<style>
  canvas {
    width: 70%;
    height: 80%;
  }
  div#controls {
    display: flex;
    justify-content: space-around;
  }
</style>
