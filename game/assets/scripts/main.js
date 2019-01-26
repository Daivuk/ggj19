var res = new Vector2(0, 0)
var skyboxRT = Texture.createScreenRenderTarget()

init()

function init()
{
    skybox_init()
    carrier_init()
    plane_init()
    camera_init()
    map_init()
    clouds_init()
    ocean_init()
}

function update(dt)
{
    res = Renderer.getResolution()

    plane_update(dt)
    carrier_update(dt)
    camera_update(dt)
    skybox_update(dt)
    clouds_update(dt)
    ocean_update(dt)
    sun_update(dt)
}

function render()
{
    res = Renderer.getResolution()

    Renderer.clearDepth()
    
    Renderer.pushRenderTarget(skyboxRT)
    skybox_render()
    sun_render()
    Renderer.popRenderTarget(skyboxRT)

    SpriteBatch.begin()
    SpriteBatch.drawRect(skyboxRT, new Rect(0, 0, res.x, res.y), Color.WHITE)
    SpriteBatch.end()

    threeD_setup()

    plane_render()
    carrier_render()
    ocean_render()
    clouds_render()
    propeller_render()
}

function renderUI()
{
    res = Renderer.getResolution()
}
