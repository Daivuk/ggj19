var CLOUD_TEXTURES = [
    getTexture("cloud1.png"),
    getTexture("cloud2.png"),
    getTexture("cloud3.png"),
    getTexture("cloud4.png")
]
var CLOUD_COUNT = 100

var clouds = []

function cloud_create(position)
{
    var cloud = {
        position: new Vector3(position),
        texture: CLOUD_TEXTURES[Random.getNext(CLOUD_TEXTURES.length)]
    }
    clouds.push(cloud)
}

function clouds_init()
{
}

function clouds_update(dt)
{
}

function clouds_render()
{

}
