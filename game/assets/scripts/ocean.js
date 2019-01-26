var OCEAN_HEAR_DIST = 10

var ocean = {
    vb: null,
    world: Matrix.IDENTITY,
    texture: getTexture("ocean.png"),
    vertCount: 0,
    sound: getSound("ocean.wav").createInstance()
}

function adjustOceanVolume()
{
    ocean.sound.setVolume(Math.min(1, Math.max(0, 1 - camera.position.z / OCEAN_HEAR_DIST)))
}

function ocean_init()
{
    var textureScale = 10000 / 100
    var vertexData = new Float32Array([
        -10000, 10000, 0, 0, 0, 1, 0, 0,
        -10000, -10000, 0, 0, 0, 1, 0, textureScale,
        10000, -10000, 0, 0, 0, 1, textureScale, textureScale,
        -10000, 10000, 0, 0, 0, 1, 0, 0,
        10000, -10000, 0, 0, 0, 1, textureScale, textureScale,
        10000, 10000, 0, 0, 0, 1, textureScale, 0,
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
    threeD.vs.setVector3("world", ocean.world)
    Renderer.setVertexBuffer(ocean.vb)
    Renderer.setTexture(ocean.texture, 1)
    Renderer.draw(ocean.vertCount)
}
