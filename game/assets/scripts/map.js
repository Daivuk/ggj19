var MAP_SIZE = 500
var CLOUD_CEILING = 40

function map_init()
{
    // Generate clouds
    for (var i = 0; i < 100; ++i)
    {
        cloud_create(Random.randVector3(
            new Vector3(-MAP_SIZE, -MAP_SIZE, CLOUD_CEILING - 2),
            new Vector3(MAP_SIZE, MAP_SIZE, CLOUD_CEILING + 2)))
    }
}
