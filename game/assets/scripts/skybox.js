var COL_SKY_BOTTOM = Color.fromHexRGB(0x8bd0ba)//.mul(1.25)
var COL_SKY_TOP = Color.fromHexRGB(0x55a894)//.mul(0.75)

var skybox = {
    vb: null,
    world: new Matrix(),
    vs: getShader("skybox.vs"),
    ps: getShader("skybox.ps"),
    vertCount: 0
}

function skybox_init()
{
    var tr = COL_SKY_TOP.r
    var tg = COL_SKY_TOP.g
    var tb = COL_SKY_TOP.b

    var midCol = Color.lerp(COL_SKY_BOTTOM, COL_SKY_TOP, 0.5)
    var mr = midCol.r
    var mg = midCol.g
    var mb = midCol.b

    var br = COL_SKY_BOTTOM.r
    var bg = COL_SKY_BOTTOM.g
    var bb = COL_SKY_BOTTOM.b

    var vertexData = new Float32Array([
        // front
        -100, 100, 100, mr, mg, mb,
        -100, 100, 0, br, bg, bb,
        100, 100, 0, br, bg, bb,
        -100, 100, 100, mr, mg, mb,
        100, 100, 0, br, bg, bb,
        100, 100, 100, mr, mg, mb,

        -100, 100, 0, br, bg, bb,
        -100, 100, -100, br, bg, bb,
        100, 100, -100, br, bg, bb,
        -100, 100, 0, br, bg, bb,
        100, 100, -100, br, bg, bb,
        100, 100, 0, br, bg, bb,

        // right
        100, 100, 100, mr, mg, mb,
        100, 100, 0, br, bg, bb,
        100, -100, 0, br, bg, bb,
        100, 100, 100, mr, mg, mb,
        100, -100, 0, br, bg, bb,
        100, -100, 100, mr, mg, mb,

        100, -100, 0, br, bg, bb,
        100, -100, -100, br, bg, bb,
        100, 100, -100, br, bg, bb,
        100, -100, 0, br, bg, bb,
        100, 100, -100, br, bg, bb,
        100, 100, 0, br, bg, bb,

        // back
        100, -100, 100, mr, mg, mb,
        100, -100, 0, br, bg, bb,
        -100, -100, 0, br, bg, bb,
        100, -100, 100, mr, mg, mb,
        -100, -100, 0, br, bg, bb,
        -100, -100, 100, mr, mg, mb,

        100, -100, 0, br, bg, bb,
        100, -100, -100, br, bg, bb,
        -100, -100, -100, br, bg, bb,
        100, -100, 0, br, bg, bb,
        -100, -100, -100, br, bg, bb,
        -100, -100, 0, br, bg, bb,

        // left
        -100, -100, 100, mr, mg, mb,
        -100, -100, 0, br, bg, bb,
        -100, 100, 0, br, bg, bb,
        -100, -100, 100, mr, mg, mb,
        -100, 100, 0, br, bg, bb,
        -100, 100, 100, mr, mg, mb,

        -100, 100, 0, br, bg, bb,
        -100, 100, -100, br, bg, bb,
        -100, -100, -100, br, bg, bb,
        -100, 100, 0, br, bg, bb,
        -100, -100, -100, br, bg, bb,
        -100, -100, 0, br, bg, bb,

        // Top
        -100, 100, 100, mr, mg, mb,
        100, 100, 100, mr, mg, mb,
        0, 0, 100, tr, tg, tb,
        100, 100, 100, mr, mg, mb,
        100, -100, 100, mr, mg, mb,
        0, 0, 100, tr, tg, tb,
        100, -100, 100, mr, mg, mb,
        -100, -100, 100, mr, mg, mb,
        0, 0, 100, tr, tg, tb,
        -100, -100, 100, mr, mg, mb,
        -100, 100, 100, mr, mg, mb,
        0, 0, 100, tr, tg, tb,
    ])
    skybox.vb = VertexBuffer.createStatic(vertexData)
    skybox.vertCount = vertexData.length / 6
}

function skybox_update(dt)
{
    skybox.world = Matrix.createWorld(camera.position, Vector3.UNIT_Y, Vector3.UNIT_Z)
}

function skybox_render()
{
    Renderer.setView(camera.view)
    Renderer.setProjection(camera.projection)
    Renderer.setBlendMode(BlendMode.OPAQUE)
    Renderer.setFilterMode(FilterMode.LINEAR)
    Renderer.setBackFaceCull(false)
    Renderer.setDepthEnabled(false)
    Renderer.setDepthWrite(false)
    Renderer.setPrimitiveMode(PrimitiveMode.TRIANGLE_LIST)
    Renderer.setWorld(skybox.world)
    Renderer.setVertexShader(skybox.vs)
    Renderer.setPixelShader(skybox.ps)
    Renderer.setVertexBuffer(skybox.vb)
    Renderer.draw(skybox.vertCount)
}
