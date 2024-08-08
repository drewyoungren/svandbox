<script>
    import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
    import * as THREE from 'three';
    import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';

    let hello = '';

    /**
     * @type number
     */
    let w;

    /**
     * @type number
     */
    let h;

    let oldHeight = 0;
    let oldWidth = 0;

    /**
     * @type THREE.WebGLRenderer
     */
    let renderer;

    const status = { x: [0, 1], z: [0, 1] };

    /**
     * @type Element;
     */
    let canvas;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#121212');

    const light2 = new THREE.DirectionalLight(0xffffff, 8);

    scene.add(light2);

    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(light);

    const box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.5, 1),
        new THREE.MeshPhongMaterial({ color: 0xffaa88 }),
    );
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        depthTest: true,
    });
    const boEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(box.geometry),
        lineMaterial,
    );

    box.position.x = 0.5;
    box.position.z = 0.5;
    box.position.y = 0.25;

    scene.add(box);
    box.add(boEdges);

    let tower = [box];
    $: currentBox = tower[tower.length - 1];
    $: xz = tower.length % 2 ? 'z' : 'x';
    $: zx = tower.length % 2 ? 'x' : 'z';
    $: speed = 1 + tower.length / 17;

    const leftoverBox = new THREE.Mesh();
    leftoverBox.add(new THREE.LineSegments());
    scene.add(leftoverBox);

    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 10);
    // const camera = new THREE.OrthographicCamera();

    let level = tweened(1);

    const levelUp = () => {
        // cut
        if (tower.length > 1) {
            if (
                currentBox.position.x < status.x[0] ||
                currentBox.position.x > status.x[1] ||
                currentBox.position.z < status.z[0] ||
                currentBox.position.z > status.z[1]
            ) {
                hello = 'You Lose!';
                return;
            } else {
                currentBox.geometry.dispose();
                const p = currentBox.position[zx];
                const [a, b] = status[zx];
                const m = (b + a) / 2;
                const e = (b - a) / 2;
                const ww = p > m ? e + b - p : e + p - a;

                currentBox.geometry =
                    xz == 'x'
                        ? new THREE.BoxGeometry(
                              status.x[1] - status.x[0],
                              0.5,
                              ww,
                          )
                        : new THREE.BoxGeometry(
                              ww,
                              0.5,
                              status.z[1] - status.z[0],
                          );

                const edges = currentBox.children[0];
                // console.log(edges);

                edges.geometry.dispose();
                edges.geometry = new THREE.EdgesGeometry(currentBox.geometry);

                leftoverBox.position.copy(currentBox.position);

                console.log(
                    'xz lag',
                    ww,
                    xz,
                    status.x[1] - status.x[0],
                    status.z[1] - status.z[0] - ww,
                    '\n',
                    status.x[1] - status.x[0] - ww,
                    status.z[1] - status.z[0],
                );

                leftoverBox.geometry =
                    xz == 'x'
                        ? new THREE.BoxGeometry(
                              status.x[1] - status.x[0],
                              0.5,
                              status.z[1] - status.z[0] - ww,
                          )
                        : new THREE.BoxGeometry(
                              status.x[1] - status.x[0] - ww,
                              0.5,
                              status.z[1] - status.z[0],
                          );

                leftoverBox.material = currentBox.material;

                const leftEdges = leftoverBox.children[0];
                // console.log(leftEdges);

                leftEdges.geometry.dispose();
                leftEdges.geometry = new THREE.EdgesGeometry(
                    leftoverBox.geometry,
                );

                if (p > m) {
                    status[zx][0] = b - ww;
                    currentBox.position[zx] = b - ww / 2;
                    leftoverBox.position[zx] = b + (b - a - ww) / 2;
                } else {
                    status[zx][1] = a + ww;
                    currentBox.position[zx] = a + ww / 2;
                    leftoverBox.position[zx] = a - (b - a - ww) / 2;
                }
            }
        }

        level.update((s) => s + 1);
        const myBox = new THREE.Mesh(
            new THREE.BoxGeometry(
                status.x[1] - status.x[0],
                0.5,
                status.z[1] - status.z[0],
            ),
            new THREE.MeshPhongMaterial({
                color: Math.floor(Math.random() * 0xffffff),
            }),
        );

        const boxEdge = new THREE.LineSegments(
            new THREE.EdgesGeometry(myBox.geometry),
            lineMaterial,
        );
        myBox.add(boxEdge);

        tower = [...tower, myBox];
        myBox.position[xz] = -1;
        myBox.position[zx] = (status[zx][1] + status[zx][0]) / 2;
        myBox.position.y = tower.length / 2 - 0.25;

        scene.add(myBox);
    };

    $: {
        camera.position.set(1.7, $level / 2 + 0.25, 1.5);
        camera.lookAt(0.5, $level / 2 - 0.25, 0.5);
    }
    /**
     *
     * @param t {number}
     */
    function update(t) {
        if (tower.length > 1) {
            if (hello == '') {
                currentBox.position[zx] += speed * t;
                leftoverBox.position.y -= 2 * speed * t;
            } else {
                currentBox.position.y -= t / 2;
                currentBox.rotation[xz] +=
                    speed *
                    t *
                    (currentBox.position[zx] >
                    (status[zx][1] + status[zx][0]) / 2
                        ? zx == 'z'
                            ? 1
                            : -1
                        : zx == 'z'
                          ? -1
                          : 1);
                currentBox.position[zx] +=
                    speed *
                    t *
                    (currentBox.position[zx] >
                    (status[zx][1] + status[zx][0]) / 2
                        ? 1
                        : -1);
            }
            // I am t
            // box.rotation.x += t;
            // box.rotation.y += 2 * t;
            // box.position.x += t;
            // box.position.x += 2;
            // box.position.x %= 4;
            // box.position.x -= 2;
        }
    }

    /**
     * Check if we need to resize the canvas
     * @param renderer {THREE.WebGLRenderer}
     * @returns boolean
     */
    function resizeRendererToDisplaySize(renderer) {
        if (!canvas) return false;
        else {
            const needResize =
                oldWidth !== canvas.clientWidth ||
                oldHeight !== canvas.clientHeight;
            if (needResize) {
                oldHeight = canvas.clientHeight;
                oldWidth = canvas.clientWidth;
                renderer.setSize(
                    canvas.clientWidth,
                    canvas.clientHeight,
                    false,
                );
            }
            return needResize;
        }
    }

    /**
     * @type number|undefined
     */
    let last = undefined;

    /**
     *
     * @param time {number}
     */
    function render(time) {
        const t = (time - (last || time)) / 1000;
        last = time;

        update(t);

        if (resizeRendererToDisplaySize(renderer)) {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    onMount(() => {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        light2.target = box;
        light2.position.set(2, 5, 2);
        requestAnimationFrame(render);
    });
</script>

<canvas bind:this={canvas} bind:clientHeight={h} bind:clientWidth={w}></canvas>

<h1 style="position: absolute; color: white; left: 10px; top: 10px;">
    {hello}
    {tower.length > 1 ? `${50 - tower.length + 1} levels to go` : ''}
</h1>

<div id="level">
    <button on:pointerdown={levelUp}>Level up</button>
    <button
        on:click={() => {
            hello = '';
            level.set(1);
            for (let index = 1; index < tower.length; index++) {
                const element = tower[index];
                element.geometry.dispose();
                element.material.dispose();
                element.children[0].geometry.dispose();
                element.children[0].material.dispose();
                scene.remove(element);
            }
            tower = [box];
            status.x = [0, 1];
            status.z = [0, 1];
            leftoverBox.position.y = -30;
        }}>Reset</button
    >
</div>

<style>
    canvas {
        position: absolute;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
    }

    #level {
        position: absolute;
        bottom: 5px;
        left: 5px;
    }
</style>
