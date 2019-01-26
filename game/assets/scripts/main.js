var res = new Vector2(0, 0)
var skyboxRT = Texture.createScreenRenderTarget()
var font = getFont("font.fnt")

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

    cloud_renderOverlay()

    SpriteBatch.begin()
    SpriteBatch.drawText(font, "Speed: " + plane.speed, new Vector2(10, 20), Vector2.TOP_LEFT, new Color(0.8, 0, 0, 1));
    SpriteBatch.drawText(font, "Lift: " + plane.lift, new Vector2(10, 40), Vector2.TOP_LEFT, new Color(0.8, 0, 0, 1));
    if (plane.onDeck)
    {
        SpriteBatch.drawText(font, "ON DECK", new Vector2(10, 60), Vector2.TOP_LEFT, new Color(0.8, 0, 0, 1));
    }
    SpriteBatch.drawSprite(null, new Vector2(50, 100), new Color(1, 0, 0, 1), 0, 4);
    SpriteBatch.drawSprite(null, new Vector2(50 + plane.roll / 100 * 40, 100 + plane.pitch / 100 * 40), new Color(0, 1, 0, 1), 0, 4);
    SpriteBatch.end()
}

function renderUI()
{
    res = Renderer.getResolution()
}
