var explosions = []

var EXPLOSION_FRAMES = [
    getTexture("explosion1.png"),
    getTexture("explosion2.png"),
    getTexture("explosion3.png"),
    getTexture("explosion4.png"),
    getTexture("explosion5.png"),
    getTexture("explosion6.png"),
    getTexture("explosion7.png")
]

function explosion_create(position, size, duration, frames, color, fadeOut)
{
    var explosion = {
        position: new Vector3(position),
        world: new Matrix(),
        life: duration == undefined ? 1 : duration,
        realLife: duration == undefined ? 1 : duration,
        size: size == undefined ? 2 : size,
        frames: frames == undefined ? EXPLOSION_FRAMES : frames,
        color: color == undefined ? Color.WHITE : color,
        fadeOut: fadeOut == undefined ? false : fadeOut
    }

    explosions.push(explosion)
}

function explosions_update(dt)
{
    var len = explosions.length
    var world = Matrix.createWorld(Vector3.ZERO, camera.front, camera.up)
    for (var i = 0; i < len; ++i)
    {
        var explosion = explosions[i]
        var size = explosion.size
        explosion.world._11 = world._11 * size
        explosion.world._12 = world._12 * size
        explosion.world._13 = world._13 * size
        explosion.world._21 = world._21 * size
        explosion.world._22 = world._22 * size
        explosion.world._23 = world._23 * size
        explosion.world._31 = world._31 * size
        explosion.world._32 = world._32 * size
        explosion.world._33 = world._33 * size
        explosion.world._41 = explosion.position.x
        explosion.world._42 = explosion.position.y
        explosion.world._43 = explosion.position.z
        explosion.life -= dt
        explosion.explosion += dt
        if (explosion.life <= 0)
        {
            explosions.splice(i, 1)
            --i
            len = explosions.length
        }
    }
}

function explosions_render()
{
    Renderer.setBlendMode(BlendMode.PREMULTIPLIED)
    Renderer.setFilterMode(FilterMode.LINEAR)
    Renderer.setBackFaceCull(false)
    Renderer.setDepthEnabled(true)
    Renderer.setDepthWrite(false)
    Renderer.setPrimitiveMode(PrimitiveMode.TRIANGLE_LIST)
    Renderer.setVertexShader(SMOKE_VS)
    Renderer.setPixelShader(SMOKE_PS)

    var len = explosions.length
    for (var i = 0; i < len; ++i)
    {
        var explosion = explosions[i]
        var percent = 1 - explosion.life / explosion.realLife
        var frameId = Math.min(Math.floor(percent * explosion.frames.length), explosion.frames.length - 1)
        Renderer.setTexture(explosion.frames[frameId], 0)
        var color = explosion.fadeOut ? new Vector4(explosion.life / explosion.realLife * 2).mul(explosion.color.toVector4()) : explosion.color.toVector4()
        SMOKE_PS.setVector4("color", color)
        Renderer.setWorld(explosion.world)
        Renderer.setVertexBuffer(shotsVB)
        Renderer.draw(shotsVertCount)
    }
}
