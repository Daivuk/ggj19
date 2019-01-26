var CLOUD_TEXTURE = getTexture("clouds.png")
var CLOUD_FOG_TEXTURE = getTexture("cloudFog.png")
var CLOUD_ALT = 25
var CLOUD_SIZE = 8
var CLOUD_COLOR = Color.fromHexRGB(0xfff8c0)
var CLOUD_FOG_SIZE = 2

var clouds = []

function cloud_create(position)
{
    var type = Random.getNext(4)
    var vertBuffer = new Float32Array([
        -CLOUD_SIZE, 0,  CLOUD_SIZE / 2, 1, 1, 1, 0, type / 4,
        -CLOUD_SIZE, 0, -CLOUD_SIZE / 2, 1, 1, 1, 0, type / 4 + 0.25,
         CLOUD_SIZE, 0, -CLOUD_SIZE / 2, 1, 1, 1, 1, type / 4 + 0.25,
        -CLOUD_SIZE, 0,  CLOUD_SIZE / 2, 1, 1, 1, 0, type / 4,
         CLOUD_SIZE, 0, -CLOUD_SIZE / 2, 1, 1, 1, 1, type / 4 + 0.25,
         CLOUD_SIZE, 0,  CLOUD_SIZE / 2, 1, 1, 1, 1, type / 4,
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
                cloud_create(new Vector3(x - 128, y - 128, Random.randNumber(CLOUD_ALT - 1, CLOUD_ALT + 1)))
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
        var dir = camera.front// cloud.position.sub(camera.position)
        cloud.world = Matrix.createWorld(
            cloud.position, 
            dir.normalize(), 
            new Vector3(0, 0, -1).cross(dir).cross(dir).normalize())
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
        Renderer.setVertexBuffer(cloud.vb)
        Renderer.draw(cloud.vertCount)
    }
}

function cloud_renderOverlay()
{
    // var amount = 0

    // var len = clouds.length
    // var sizeSqr = CLOUD_FOG_SIZE * CLOUD_FOG_SIZE
    // for (var i = 0; i < len; ++i)
    // {
    //     var cloud = clouds[i]
    //     var dist = Vector2.distanceSquared(cloud.position, camera.position)
    //     amount = Math.min(1, Math.max(amount, 1 - (dist / sizeSqr)))
    // }

    // SpriteBatch.begin()
    // SpriteBatch.drawRect(null, new Rect(0, 0, res.x, res.y), Color.lerp(Color.TRANSPARENT, CLOUD_COLOR, amount))
    // SpriteBatch.end()
}
