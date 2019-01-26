var OCEAN_HEAR_DIST = 10
var OCEAN_EXTEND = 128 + 200

var ocean = {
    vb: null,
    world: Matrix.IDENTITY,
    texture: getTexture("ocean.png"),
    vertCount: 0,
    sound: getSound("ocean.wav").createInstance()
}

function adjustOceanVolume()
{
    ocean.sound.setVolume(Math.min(1, Math.max(0, 1 - camera.position.z / OCEAN_HEAR_DIST)) * 0.4) 
}

function ocean_init()
{
    var textureScale = OCEAN_EXTEND / 100
    var vertexData = new Float32Array([
        -OCEAN_EXTEND, OCEAN_EXTEND, 0, 1, 1, 1, 0, 0,
        -OCEAN_EXTEND, -OCEAN_EXTEND, 0, 1, 1, 1, 0, textureScale,
        OCEAN_EXTEND, -OCEAN_EXTEND, 0, 1, 1, 1, textureScale, textureScale,
        -OCEAN_EXTEND, OCEAN_EXTEND, 0, 1, 1, 1, 0, 0,
        OCEAN_EXTEND, -OCEAN_EXTEND, 0, 1, 1, 1, textureScale, textureScale,
        OCEAN_EXTEND, OCEAN_EXTEND, 0, 1, 1, 1, textureScale, 0,
    ])
    ocean.vb = VertexBuffer.createStatic(vertexData)
    ocean.vertCount = vertexData.length / 8

    // Start ocean audio
    adjustOceanVolume()
    ocean.sound.setLoop(true)
    ocean.sound.play()
}

function ocean_update(dt)
{
    adjustOceanVolume()
}

function ocean_render()
{
    Renderer.setWorld(ocean.world)
    Renderer.setVertexBuffer(ocean.vb)
    Renderer.setTexture(ocean.texture, 1)
    Renderer.draw(ocean.vertCount)
}
