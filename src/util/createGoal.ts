import { Body, BODY_TYPES, Box, Vec3, World } from "cannon-es";
import { CylinderGeometry, Mesh, MeshStandardMaterial, Scene, Vector3 } from "three"
import { ShapeType, threeToCannon } from "three-to-cannon";

const createGoal = (scene: Scene, world: World, position: Vector3) => {

    const base = createBase(scene, position)

    const baseLight = createBaseLight(scene, position)

    const goal = createGoalBody(baseLight)
    world.addBody(goal)

    return { base, baseLight, goalBody: goal }

}

const createGoalBody = (mesh: Mesh) => {
    const result = threeToCannon(mesh, { type: ShapeType.BOX });
    if (!result) throw new Error('Invalid shape for goal')

    const body = new Body({ mass: 0, type: BODY_TYPES.STATIC })
    const shape = new Box(new Vec3(1.5, 20, 1.5))
    body.addShape(shape)

    body.position.x = mesh.position.x
    body.position.y = mesh.position.y + 21
    body.position.z = mesh.position.z



    return body;
}

const createBaseLight = (scene: Scene, position: Vector3) => {
    const baseLightMesh = new Mesh(
        new CylinderGeometry(2, 2, 200, 12, 1, false),
        new MeshStandardMaterial({ color: '#1ffff4', transparent: true, opacity: 0.3 })
    )
    baseLightMesh.geometry.translate(0, 100, 0)
    scene.add(baseLightMesh)
    baseLightMesh.position.copy(position)

    return baseLightMesh
}

const createBase = (scene: Scene, position: Vector3) => {
    const material = new MeshStandardMaterial({ color: '#444' })
    const geometry = new CylinderGeometry(2, 4, 0.75, 12, 1, false);
    const mesh = new Mesh(geometry, material)
    mesh.position.copy(position)
    mesh.position.y -= 0.2
    scene.add(mesh)


    const result = threeToCannon(mesh, { type: ShapeType.HULL });
    if (!result) throw new Error('Invalid shape for base')

    const body = new Body({ mass: 0, type: BODY_TYPES.STATIC })
    const { shape, offset, orientation } = result;
    body.addShape(shape, offset, orientation);
    body.position.x = mesh.position.x
    body.position.y = mesh.position.y
    body.position.z = mesh.position.z

    return {
        mesh, body
    }
}

export { createGoal }