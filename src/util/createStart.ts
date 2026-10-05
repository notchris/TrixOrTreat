import { Body, BODY_TYPES, World } from "cannon-es";
import { CylinderGeometry, Mesh, MeshStandardMaterial, Scene, Vector3 } from "three"
import { ShapeType, threeToCannon } from "three-to-cannon";

const createStart = (scene: Scene, world: World, position: Vector3) => {

    const base = createBase(position)
    const { mesh, body } = base

    scene.add(mesh)
    world.addBody(body)

    return { mesh, body }

}

const createBase = (position: Vector3) => {
    const material = new MeshStandardMaterial({ color: '#444' })
    const geometry = new CylinderGeometry(2, 4, 0.75, 12, 1, false);
    const mesh = new Mesh(geometry, material)
    mesh.position.copy(position)


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

export { createStart }