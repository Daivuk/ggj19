var CAMERA_ADAPT_SPEED = 4

var camera = {
    position: new Vector3(0, 0, 0),
    target: new Vector3(0, 0, 0),
    upTarget: new Vector3(0, 0, 0),
    front: new Vector3(0, 1, 0),
    up: new Vector3(0, 0, 1),
    view: new Matrix(),
    projection: new Matrix(),
}

var angle = 45

function camera_init()
{
    var planePos = new Vector3(plane.world._41, plane.world._42, plane.world._43)
    var planeFront = new Vector3(plane.world._21, plane.world._22, plane.world._23)
    var planeUp = new Vector3(plane.world._31, plane.world._32, plane.world._33)

    camera.position = planePos.sub(planeFront.mul(0.25)).add(planeUp.mul(0.35))
    camera.target = camera.position.add(planeFront)
    camera.upTarget = camera.position.add(planeUp)
}

function camera_update(dt)
{
    var planePos = new Vector3(plane.world._41, plane.world._42, plane.world._43)
    var planeFront = new Vector3(plane.world._21, plane.world._22, plane.world._23)
    var planeUp = new Vector3(plane.world._31, plane.world._32, plane.world._33)

    var targetPosition = planePos.sub(planeFront.mul(0.25)).add(planeUp.mul(0.35))
    var targetTarget = targetPosition.add(planeFront)
    var targetUpTarget = targetPosition.add(planeUp)
    if (plane.dead)
    {
        angle += dt * Math.PI / 6
        targetPosition = new Vector3(plane.position.x + Math.cos(angle) * 3, plane.position.y + Math.sin(angle) * 3, plane.position.z + 3)
        targetTarget = planePos
        targetUpTarget = targetPosition.add(new Vector3(0, 0, 1))
    }

    camera.position = camera.position.add(targetPosition.sub(camera.position).mul(dt * CAMERA_ADAPT_SPEED))
    camera.target = camera.target.add(targetTarget.sub(camera.target).mul(dt * CAMERA_ADAPT_SPEED))
    camera.upTarget = camera.upTarget.add(targetUpTarget.sub(camera.upTarget).mul(dt * CAMERA_ADAPT_SPEED))

    camera.front = camera.target.sub(camera.position).normalize()
    camera.up = camera.upTarget.sub(camera.position).normalize()

    camera.view = Matrix.createLookAt(camera.position, camera.position.add(camera.front), camera.up)
    camera.projection = Matrix.createPerspectiveFieldOfView(Math.PI / (2 + plane.speed / 10), res.x / res.y, 0.1, 200)
}

function camera_shake(amount)
{
    camera.target = camera.target.add(Random.randVector3(new Vector3(-amount), new Vector3(amount)))
}
