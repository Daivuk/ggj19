var shots = []

var SHOT_TEXTURE = getTexture("shot.png")

var shotsVB = null
var shotsVertCount = 0

var SHOT_VEL = 45
var SHOT_SIZE = 0.1
var SHOT_LIFE = 0.5

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

function shot_create(position, vel, from, precision, doSmoke, life)
{
    var shot = {
        position: new Vector3(position),
        velocity: new Vector3(vel),
        from: from,
        world: new Matrix(),
        realLife: life == undefined ? SHOT_LIFE : life,
        life: life == undefined ? SHOT_LIFE : life,
        doSmoke: doSmoke == undefined ? true : doSmoke
    }

    var speed = shot.velocity.length()
    var dir = shot.velocity.normalize()
    var right = dir.cross(Vector3.UNIT_Z)
    var up = right.cross(dir)
    dir = dir.transform(Matrix.createFromAxisAngle(up, Random.randNumber(-precision, precision)))
    dir = dir.transform(Matrix.createFromAxisAngle(right, Random.randNumber(-precision, precision)))
    shot.velocity = dir.mul(speed)

    shots.push(shot)
}

function shots_update(dt)
{
    var len = shots.length
    for (var i = 0; i < len; ++i)
    {
        var shot = shots[i]
        var prevPos = shot.position
        shot.position = shot.position.add(shot.velocity.mul(dt))
        if (shot.doSmoke)
        {
            if (shot.life > shot.realLife - 0.3)
            {
                var step = Math.max(0.3, (shot.realLife - shot.life) * 10)
                for (var j = step; j <= 1; j += step)
                {
                    smoke_create(Vector3.lerp(prevPos, shot.position, j))
                }
            }
        }

        // Collision with ground
        var mapX = Math.floor(shot.position.x + 128)
        var mapY = Math.floor(shot.position.y + 128)
        var h = 0
        if (mapX >= 0 && mapX < 256 && mapY >= 0 && mapY < 256) h = map.hm[mapY * 256 + mapX]
        if (shot.position.z <= h)
        {
            shots.splice(i, 1)
            --i
            len = shots.length
            smoke_create(shot.position.add(new Vector3(0, 0, 0.1)))
            smoke_create(shot.position.add(new Vector3(0, 0, 0.15)))
            smoke_create(shot.position.add(new Vector3(0, 0, 0.20)))
            smoke_create(shot.position.add(new Vector3(0, 0, 0.25)))
            continue
        }

        // Apply gravity
        shot.velocity = shot.velocity.add(Vector3.UNIT_Z.mul(-dt * 2)).mul(1 - dt * 0.5) // And friction
        shot.world = Matrix.createWorld(shot.position, camera.front, camera.up)
        shot.life -= dt
        if (shot.life <= 0)
        {
            shots.splice(i, 1)
            --i
            len = shots.length
        }

        // Test collision with entities
        if (Vector3.distanceSquared(shot.position, plane.position) <= 0.25)
        {
            shots.splice(i, 1)
            --i
            len = shots.length

            // Dmg
            plane.life -= 1
            camera_shake(0.1)
            if (plane.life <= 0) plane_crash()
        }
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
