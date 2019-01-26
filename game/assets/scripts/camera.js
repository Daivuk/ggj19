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

    camera.position = planePos.sub(planeFront.mul(0.5)).add(planeUp.mul(0.25))
    camera.front = planeFront
    camera.up = planeUp

    // angle += dt * Math.PI / 4
    // camera.position = new Vector3(Math.cos(angle) * 5, Math.sin(angle) * 5, 4)
    // camera.front = new Vector3(0, 0, 0).sub(camera.position)
    // camera.up = Vector3.UNIT_Z

    camera.view = Matrix.createLookAt(camera.position, camera.position.add(camera.front), camera.up)
    camera.projection = Matrix.createPerspectiveFieldOfView(Math.PI / 2, res.x / res.y, 0.1, 1000)
}
