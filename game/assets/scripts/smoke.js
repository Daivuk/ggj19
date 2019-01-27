var smokes = []

var SMOKE_TEXTURE = getTexture("smoke.png")
var SMOKE_VS = getShader("smoke.vs")
var SMOKE_PS = getShader("smoke.ps")

var SMOKE_SIZE = 1.5
var SMOKE_LIFE = 0.5

function smoke_create(position, size, color)
{
    var smoke = {
        position: new Vector3(position),
        world: new Matrix(),
        life: SMOKE_LIFE,
        realSize: size == undefined ? SMOKE_SIZE : size,
        size: 0,
        color: color == undefined ? Color.WHITE : color
    }

    smokes.push(smoke)
}

function smokes_update(dt)
{
    var len = smokes.length
    var world = Matrix.createWorld(Vector3.ZERO, camera.front, camera.up)
    for (var i = 0; i < len; ++i)
    {
        var smoke = smokes[i]
        var size = (1 - (smoke.life / SMOKE_LIFE)) * smoke.realSize
        smoke.world._11 = world._11 * size
        smoke.world._12 = world._12 * size
        smoke.world._13 = world._13 * size
        smoke.world._21 = world._21 * size
        smoke.world._22 = world._22 * size
        smoke.world._23 = world._23 * size
        smoke.world._31 = world._31 * size
        smoke.world._32 = world._32 * size
        smoke.world._33 = world._33 * size
        smoke.world._41 = smoke.position.x
        smoke.world._42 = smoke.position.y
        smoke.world._43 = smoke.position.z
        smoke.life -= dt
        smoke.smoke += dt
        if (smoke.life <= 0)
        {
            smokes.splice(i, 1)
            --i
            len = smokes.length
        }
    }
}

function smokes_render()
{
    Renderer.setBlendMode(BlendMode.PREMULTIPLIED)
    Renderer.setFilterMode(FilterMode.LINEAR)
    Renderer.setBackFaceCull(false)
    Renderer.setDepthEnabled(true)
    Renderer.setDepthWrite(false)
    Renderer.setPrimitiveMode(PrimitiveMode.TRIANGLE_LIST)
    Renderer.setVertexShader(SMOKE_VS)
    Renderer.setPixelShader(SMOKE_PS)

    Renderer.setTexture(SMOKE_TEXTURE, 0)

    var len = smokes.length
    for (var i = 0; i < len; ++i)
    {
        var smoke = smokes[i]
        SMOKE_PS.setVector4("color", new Vector4(smoke.life / SMOKE_LIFE * 2).mul(smoke.color.toVector4()))
        Renderer.setWorld(smoke.world)
        Renderer.setVertexBuffer(shotsVB)
        Renderer.draw(shotsVertCount)
    }
}
