var camera = {
    position: new Vector3(0, 0, 0),
    front: new Vector3(0, 1, 0),
    up: new Vector3(0, 0, 1),
    view: new Matrix(),
    projection: new Matrix()
}

function camera_init()
{
    camera.position = new Vector3(plane.position)
    camera.front = new Vector3(plane.front)
    camera.up = new Vector3(plane.up)

    camera.position = new Vector3(-10, -10, 10)
    camera.front = new Vector3(0, 0, 0).sub(camera.position)
    camera.up = Vector3.UNIT_Z
}

function camera_update(dt)
{
    camera.view = Matrix.createLookAt(camera.position, camera.position.add(camera.front), camera.up)
    camera.projection = Matrix.createPerspectiveFieldOfView(90, res.x / res.y, 0.1, 1000)
}
