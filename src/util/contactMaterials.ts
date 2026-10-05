import { ContactMaterial, Material } from "cannon-es";


const groundMaterial = new Material("groundMaterial");
const ground_ground_cm = new ContactMaterial(groundMaterial, groundMaterial, {
    friction: 0.4,
});

const materials = {
    ground: groundMaterial
}

const contactMaterials = {
    ground: ground_ground_cm
}

export { materials, contactMaterials }