var shots = []

var SHOT_TEXTURE = getTexture("shot.png")

var shotsVB = null
var shotsVertCount = 0

var SHOT_VEL = 45
var SHOT_SIZE = 0.1

function shots_init()
{
    var vertBuffer = new Float32Array([
        -SHOT_SIZE / 2, 0,  SHOT_SIZE / 2, 0, 0,
        -SHOT_SIZE / 2, 0, -SHOT_SIZE / 2, 0, 1,
         SHOT_SIZE / 2, 0, -SHOT_SIZE / 2, 1, 1,
        -SHOT_SIZE / 2, 0,  SHOT_SIZE / 2, 0, 0,
         SHOT_SIZE / 2, 0, -SHOT_SIZE / 2, 1, 1,
         SHOT_SIZE / 2, 0,  SHOT_SIZE / 2, 1, 0,
    ])
    shotsVB = VertexBuffer.createStatic(vertBuffer)
    shotsVertCount = vertBuffer.length / 2
}

function shot_create(position, vel, from)
{
    var shot = {
        position: new Vector3(position),
        velocity: new Vector3(vel),
        from: from,
        world: new Matrix()
    }

    shots.push(shot)
}

function shots_update(dt)
{
    var len = shots.length
    for (var i = 0; i < len; ++i)
    {
        var shot = shots[i]
        shot.position = shot.position.add(shot.velocity.mul(dt))
        shot.world = Matrix.createWorld(shot.position, camera.front, camera.up)
    }
}

function shots_render()
{
    Renderer.setBlendMode(BlendMode.ADD)
    Renderer.setFilterMode(FilterMode.LINEAR)
    Renderer.setBackFaceCull(false)
    Renderer.setDepthEnabled(true)
    Renderer.setDepthWrite(false)
    Renderer.setPrimitiveMode(PrimitiveMode.TRIANGLE_LIST)
    Renderer.setVertexShader(plane.propellerVS)
    Renderer.setPixelShader(plane.propellerPS)

    Renderer.setVertexBuffer(plane.propellerVB)
    Renderer.setTexture(plane.engineRev > 1.5 ? (plane.engineRev > 2.5 ? plane.propellerTexture3 : plane.propellerTexture2) : plane.propellerTexture, 0)
    Renderer.draw(plane.propellerVertCount)

    Renderer.setTexture(SHOT_TEXTURE, 0)

    var len = shots.length
    for (var i = 0; i < len; ++i)
    {
        var shot = shots[i]
        Renderer.setWorld(shot.world)
        Renderer.setVertexBuffer(shotsVB)
        Renderer.draw(shotsVertCount)
    }
}
