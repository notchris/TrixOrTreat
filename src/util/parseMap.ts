import { Body, BODY_TYPES, World } from 'cannon-es'
import { Group, Mesh } from 'three'
import { parseMesh } from './parseMesh'
import { contactMaterials } from './contactMaterials'


export const parseMap = (world: World, group: Group) => {

    // Create Contact Materials
    Object.values(contactMaterials).forEach((material) => world.addContactMaterial(material))

    // Parse platforms


    const items: { name: string, mesh: Mesh, body: Body }[] = [

    ]

    const nameList: string[] = []

    group.children.forEach((mesh) => {
        if (mesh instanceof Mesh) {
            const { name } = mesh.userData
            const { body } = parseMesh(world, mesh)
            nameList.push(mesh.name)

            if (body.type === BODY_TYPES.KINEMATIC || body.type === BODY_TYPES.DYNAMIC) {
                items.push({ name, mesh, body })
            }

        }
    })

    console.log(nameList)


    return { items }
}