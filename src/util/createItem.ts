import { Body, BODY_TYPES, Sphere, World } from "cannon-es";
import { Mesh, MeshStandardMaterial, Scene, SphereGeometry, Vector3 } from "three"

const createItem = (scene: Scene, world: World, position: Vector3) => {

    const itemMesh = new Mesh(
        new SphereGeometry(0.5, 32, 16),
        new MeshStandardMaterial({ color: '#00FF00' })
    )
    itemMesh.castShadow = true
    itemMesh.receiveShadow = true
    itemMesh.position.copy(position)

    const itemBody = createItemBody(position)

    scene.add(itemMesh)
    world.addBody(itemBody)

}

const createItemBody = (position: Vector3) => {

    const body = new Body({ mass: 0, type: BODY_TYPES.STATIC })
    const shape = new Sphere(0.5)
    body.addShape(shape)

    body.position.x = position.x
    body.position.y = position.y
    body.position.z = position.z

    return body

}

export { createItem }