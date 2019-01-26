var camera = {
    position: new Vector3(0, 0, 0),
    dir: new Vector3(0, 1, 0),
    up: new Vector3(0, 0, 1),
    view: new Matrix(),
    projection: new Matrix()
}

function camera_update(dt)
{
    camera.view = Matrix.createLookAt(camera.position, camera.position.add(camera.dir), camera.up)
    camera.projection = Matrix.createPerspectiveFieldOfView(90, res.x / res.y, 1, 1000)
}
