import Phaser from "phaser";
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'

import { DEBUG, GRAVITY, FIXED_STEP, MAX_SUBSTEPS, PLAYER_OFFSET, GAME_WIDTH, GAME_HEIGHT } from '../config.ts'

import * as THREE from 'three'
import CameraControls from 'camera-controls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { createLights } from '../util/createLights.ts'
import { createRenderer } from '../util/createRenderer.ts'
import { parseMap } from '../util/parseMap.ts'
import { createPlayer } from '../util/createPlayer.ts'
import { Mesh } from 'three'
import { v4 as uuidv4 } from 'uuid';
import { UIScene } from "./UIScene.ts";


interface IExternThree extends Phaser.GameObjects.Extern {
    render: Function
}

CameraControls.install({ THREE: THREE });

interface Game {
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera
    world: CANNON.World,
    pointer: THREE.Vector2,
    raycaster: THREE.Raycaster,
    bgRect: THREE.Mesh
}


export class MainScene extends Phaser.Scene {
    interval: number = 0
    bodies: CANNON.Body[] = []
    meshes: Mesh[] = []
    world!: CANNON.World
    threeScene!: THREE.Scene
    constructor() {
        super({
            key: "MainScene",
        });
    }

    preload(): void {

    }

    create(): void {


        const ui = this.scene.launch('UIScene')
        console.log(ui)

        const createGame = (): Game => {
            const scene = new THREE.Scene()
            this.threeScene = scene
            scene.background = new THREE.Color('#90EE90')

            const camera = new THREE.PerspectiveCamera(60, GAME_WIDTH / GAME_HEIGHT, 0.1, 1000)
            const lights = createLights()
            scene.add(...lights)
            const renderer = createRenderer(this.sys.game.canvas, this.sys.game.context as WebGLRenderingContext)

            // Setup world
            const world = new CANNON.World(
                {
                    gravity: new CANNON.Vec3(0, GRAVITY, 0),
                    broadphase: new CANNON.NaiveBroadphase(),
                }
            )
            this.world = world

            const pointer = new THREE.Vector2()
            const raycaster = new THREE.Raycaster()

            const bgRectGeo = new THREE.PlaneGeometry(20, 20)
            const bgRect = new THREE.Mesh(
                bgRectGeo,
                new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0 })
            )



            return {
                scene,
                renderer,
                camera,
                world,
                pointer,
                raycaster,
                bgRect
            }
        }

        const startGame = async () => {
            const clock = new THREE.Clock()
            const game = createGame()
            const { scene, camera, renderer, world, pointer, raycaster, bgRect } = game




            let cannonDebugger: {
                update: () => void;
            } | undefined

            if (DEBUG) cannonDebugger = CannonDebugger(scene, world)

            // Load Item Models
            const loader = new GLTFLoader()
            const model = await loader.loadAsync('trixortreat.glb')
            const group = model.scene

            // Load Bucket Model
            const bucketModel = await loader.loadAsync('bucket.glb')
            const bucketModelGroup = bucketModel.scene.children[0]


            // Add mesh to raycast against
            scene.add(bgRect)

            // Map
            const { items } = parseMap(world, group)

            const bodies: CANNON.Body[] = []
            const meshes: Mesh[] = []

            this.bodies = bodies
            this.meshes = meshes

            // Camera
            const start = new THREE.Vector3(0, 0, 10)
            camera.position.copy(start)
            camera.lookAt(start)


            // Player
            const { player, playerGroup, playerSensor } = await createPlayer(start, bucketModelGroup)
            world.addBody(player)
            world.addBody(playerSensor)
            scene.add(playerGroup)

            // Player collision event
            const idList: number[] = []
            const ui = this.scene.get('UIScene') as UIScene
            playerSensor.addEventListener('collide', (event: { body: CANNON.Body }) => {
                if (idList.includes(event.body.id)) return
                idList.push(event.body.id)
                const i = bodies.findIndex((b) => b.id === event.body.id)


                if (i >= 0) {
                    meshes[i].userData.toDestroy = true;

                    ui.getItem(meshes[i].userData.itemName, meshes[i].userData.itemValue)
                }

            })


            // Orbit Controls
            // const controls = new OrbitControls(camera, renderer.domElement)

            // Camera Controls
            const paddingLeft = 0
            const paddingRight = 0
            const paddingTop = 0
            const paddingBottom = 0
            const cameraControls = new CameraControls(camera, renderer.domElement);

            cameraControls.fitToBox(bgRect, false, { paddingLeft: paddingLeft, paddingRight: paddingRight, paddingBottom: paddingBottom, paddingTop: paddingTop });
            // cameraControls.zoom(1.3)
            cameraControls.enabled = false
            // Mouse position
            const mouseVec = new THREE.Vector3()



            // Add Item
            ui.startTimer()
            this.interval = setInterval(() => {
                const random = addItem(items, scene, world)
                const { mesh, body } = random
                meshes.push(mesh)
                bodies.push(body)
                const posX = getRandomInt(-8, 8)
                body.position.set(posX, 10, 0)
                body.applyTorque(new CANNON.Vec3(getRandomInt(0, 200), getRandomInt(0, 200), 0))
            }, 300)


            // Resize
            // const resizeVector = new THREE.Vector2(1024, 768)
            // window.addEventListener("resize", () => {
            //     resizeVector.x = innerWidth;
            //     resizeVector.y = innerHeight;
            //     camera.aspect = innerWidth / innerHeight
            //     camera.updateProjectionMatrix()
            //     renderer.setSize(innerWidth, innerHeight)
            // })

            const lerpVector = new THREE.Vector3()

            window.addEventListener('mousemove', (event) => {
                const { width, height, left, top } = renderer.domElement.getBoundingClientRect();

                // Adjust for the canvas offset by subtracting 'left' and 'top' from the clientX and clientY
                pointer.x = ((event.clientX - left) / width) * 2 - 1;
                pointer.y = -((event.clientY - top) / height) * 2 + 1;

                raycaster.setFromCamera(pointer, camera);
                const intersects = raycaster.intersectObject(bgRect)

                if (intersects && intersects.length) {
                    mouseVec.copy(intersects[0].point)
                }
            })


            let score = 0

            const view = this.add.extern() as IExternThree



            //  The Extern render function
            view.render = () => {

                //  This is essential to get ThreeJS to reset the GL state
                renderer.resetState();


                world.step(FIXED_STEP, clock.getDelta(), MAX_SUBSTEPS);


                // tweens.forEach((t) => t.update(clock.getElapsedTime(), true))

                bodies.forEach((body, i) => {

                    meshes[i].position.copy(body.position)
                    meshes[i].quaternion.copy(body.quaternion)


                    if (meshes[i].userData.toDestroy) {
                        world.removeBody(bodies[i])
                        scene.remove(meshes[i])
                        bodies.splice(i, 1)
                        meshes.splice(i, 1)
                        score += 1

                    } else if (body.position.y < -10) {

                        world.removeBody(bodies[i])
                        scene.remove(meshes[i])
                        bodies.splice(i, 1)
                        meshes.splice(i, 1)
                    }
                })

                lerpVector.lerpVectors(mouseVec, playerGroup.position, 0.9)
                // Update player position
                playerGroup.position.set(lerpVector.x, PLAYER_OFFSET, 0)
                player.position.set(lerpVector.x, PLAYER_OFFSET, 0)
                playerSensor.position.set(lerpVector.x, PLAYER_OFFSET, 0)


                if (DEBUG) cannonDebugger?.update()

                const delta = clock.getDelta();
                cameraControls.update(delta);

                renderer.render(scene, camera);


            };



        }

        const getRandomInt = (min: number, max: number) => {
            const minCeiled = Math.ceil(min);
            const maxFloored = Math.floor(max);
            return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
        }


        const addItem = (items: {
            name: string;
            mesh: Mesh;
            body: CANNON.Body;
        }[], scene: THREE.Scene, world: CANNON.World) => {
            const item = items[Math.floor(Math.random() * items.length)]

            const itemMesh = item.mesh.clone(false)
            const itemBody = new CANNON.Body({ mass: 1, type: CANNON.Body.DYNAMIC, collisionFilterGroup: 2, collisionFilterMask: 1 })
            itemBody.addShape(item.body.shapes[0])

            scene.add(itemMesh)
            world.addBody(itemBody)



            return { id: uuidv4(), mesh: itemMesh, body: itemBody }
        }


        startGame()



    }

    stopGame(score: number) {
        clearInterval(this.interval)
        this.bodies.forEach((b) => {
            this.world.removeBody(b)
        })
        this.meshes.forEach((m) => {
            this.threeScene.remove(m)
        })

        this.scene.stop('UIScene')
        this.scene.start('EndScene', {
            score
        })
    }
}
