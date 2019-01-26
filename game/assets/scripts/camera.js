var camera = {
    position: new Vector3(0, 0, 0),
    front: new Vector3(0, 1, 0),
    up: new Vector3(0, 0, 1),
    view: new Matrix(),
    projection: new Matrix()
}

var angle = 45

function camera_init()
{
}

function camera_update(dt)
{
    var planePos = new Vector3(plane.world._41, plane.world._42, plane.world._43)
    var planeFront = new Vector3(plane.world._21, plane.world._22, plane.world._23)
    var planeUp = new Vector3(plane.world._31, plane.world._32, plane.world._33)
    var planeRight = planeFront.cross(planeUp)

    camera.position = planePos.sub(planeFront.mul(0.15)).add(planeUp.mul(0.35))
    camera.front = planeFront.transform(Matrix.createFromAxisAngle(planeRight, 15))
    camera.up = planeUp

    // angle += dt * Math.PI / 4
    // camera.position = new Vector3(plane.position.x + Math.cos(angle) * 1, plane.position.y + Math.sin(angle) * 1, plane.position.z + 1)
    // camera.front = plane.position.sub(camera.position)
    // camera.up = Vector3.UNIT_Z

    camera.view = Matrix.createLookAt(camera.position, camera.position.add(camera.front), camera.up)
    camera.projection = Matrix.createPerspectiveFieldOfView(Math.PI / 2.2, res.x / res.y, 0.1, 1000)
}
