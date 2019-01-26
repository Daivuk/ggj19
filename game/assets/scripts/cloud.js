var CLOUD_TEXTURE = getTexture("clouds.png")
var CLOUD_FOG_TEXTURE = getTexture("cloudFog.png")
var CLOUD_ALT = 25
var CLOUD_SIZE = 8

var clouds = []

function cloud_create(position)
{
    var type = Random.getNext(4)
    var vertBuffer = new Float32Array([
        -CLOUD_SIZE, 0, CLOUD_SIZE / 2, 0, 0, 1, 0, type / 4,
        -CLOUD_SIZE, 0, -CLOUD_SIZE / 2, 0, 0, 1, 0, type / 4 + 0.25,
        CLOUD_SIZE, 0, -CLOUD_SIZE / 2, 0, 0, 1, 1, type / 4 + 0.25,
        -CLOUD_SIZE, 0, CLOUD_SIZE / 2, 0, 0, 1, 0, type / 4,
        CLOUD_SIZE, 0, -CLOUD_SIZE / 2, 0, 0, 1, 1, type / 4 + 0.25,
        CLOUD_SIZE, 0, CLOUD_SIZE / 2, 0, 0, 1, 1, type / 4,
    ])
    var cloud = {
        position: new Vector3(position),
        vb: VertexBuffer.createStatic(vertBuffer),
        vertCount: vertBuffer.length / 8,
        world: new Matrix()
    }
    clouds.push(cloud)
}

function clouds_init()
{
    var file = new BinaryFileReader("cloud.raw")
    for (var y = 0; y < 256; ++y)
    {
        for (var x = 0; x < 256; ++x)
        {
            if (file.readUInt8() > 50)
            {
                cloud_create(new Vector3(x - 128, y - 128, CLOUD_ALT))
            }
        }
    }
}

function clouds_update(dt)
{
    var len = clouds.length
    for (var i = 0; i < len; ++i)
    {
        var cloud = clouds[i]
        cloud.world = Matrix.createWorld(cloud.position, camera.front, camera.up)
    }
}

function clouds_render()
{
    Renderer.setTexture(CLOUD_TEXTURE, 1)

    var len = clouds.length
    for (var i = 0; i < len; ++i)
    {
        var cloud = clouds[i]
        Renderer.setWorld(cloud.world)
        threeD.vs.setVector3("world", cloud.world)
        Renderer.setVertexBuffer(cloud.vb)
        Renderer.draw(cloud.vertCount)
    }
}
