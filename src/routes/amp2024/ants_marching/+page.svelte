<script>
  // @ts-nocheck

  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

  let stopGo = false;

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
  scene.background = new THREE.Color('#FFFFFF');

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
   * Check if we need to resize the canvas
   * @param renderer {THREE.WebGLRenderer}
   * @returns boolean
   */
  function resizeRendererToDisplaySize(renderer) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== w || canvas.height !== h;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  /**
   * Animate loop
   * @param time {number}
   */
  function render(time, loop = true) {
    time *= 0.001;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // cube.rotation.x = 2 * time;
    // cube.rotation.y = 3 * time;

    evolve();
    drawStatus();

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);

    requestAnimationFrame(render);
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

    resetStatus();

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

    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(0, 2, 0));

    const gridGeometry = new THREE.BufferGeometry().setFromPoints(points);
    lineMesh.geometry.dispose();
    lineMesh.geometry = gridGeometry;
  }

  $: drawGrid(totalSteps + 1);

  let totalSteps = 4;
  let timeStep = 20; // how oftern to update, in milliseconds

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
            color: i + j == totalSteps + 1 ? 0x3333aa : 0x252525,
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
    controls?.target.set(
      STEP * (totalSteps / 2 + 1),
      0,
      STEP * (totalSteps / 2 + 1)
    );
    camera?.lookAt(
      new THREE.Vector3(
        STEP * (totalSteps / 2 + 1),
        0,
        STEP * (totalSteps / 2 + 1)
      )
    );
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
            count / 10,
            0.8 * STEP
          );
          box.position.y = count / 20;
          box.visible = true;
        } else {
          box.visible = false;
        }
        box.count = count;
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
            if (Math.random() < timeStep / 200) {
              entry.count =
                stopGo && i + j == 0
                  ? Math.max(entry.count - 1, 1)
                  : entry.count - 1;
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
</script>

<h1>Ants Marching</h1>

<p>
  Ants move along a rectangular lattice by choosing only 'up' or 'right' with
  equal probability at each step. Where do they end up after <em>n</em> steps?
</p>

<div id="controls">
  <label for="totalSteps"
    >Steps:
    <input
      type="range"
      name="totalSteps"
      id="totalSteps"
      bind:value={totalSteps}
      on:input={resetStatus}
      min="2"
      step="1"
      max="25"
    />
    {totalSteps}
  </label>
  <label for="timeStep">
    Antsiness:
    <input
      type="range"
      name="timeStep"
      id="timeStep"
      bind:value={timeStep}
      min="5"
      max="100"
      step="5"
    />{timeStep}</label
  >
  <!-- <button
    on:click={() => {
      stopGo = !stopGo;
      if (stopGo) requestAnimationFrame(render);
    }}>{stopGo ? 'Stop' : 'Go'}</button
  > -->
  <div>
    <button
      on:click={() => {
        status.find((e) => e.i == 0 && e.j == 0).count += 1;
      }}
    >
      ANT!
    </button>
    <button class:down={stopGo} on:click={() => (stopGo = !stopGo)}
      >AntLock</button
    >
  </div>
</div>

<canvas bind:this={canvas} bind:clientWidth={w} bind:clientHeight={h}></canvas>
<div>
  <button on:click={resetStatus}>Reset</button>
</div>

<style>
  canvas {
    width: 100%;
    /* height: 80%; */
    height: 100%;
    max-width: 1000px;
  }
  div#controls {
    width: 70%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-direction: column;
  }

  button {
    color: aliceblue;
    background-color: navy;
    border-radius: 15%;
    padding: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  button:active,
  .down {
    background-color: blueviolet;
  }
</style>
