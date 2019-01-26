var res = new Vector2(0, 0)
var skyboxRT = Texture.createScreenRenderTarget()
var bloomRT = Texture.createScreenRenderTarget()
var screenRT = Texture.createScreenRenderTarget()
var font = getFont("font.fnt")
var bloomPS = getShader("bloom.ps")

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
    shots_init()
    trees_init()
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
    shots_update(dt)
    smokes_update(dt)
    trees_update(dt)
}

function render()
{
    res = Renderer.getResolution()

    Renderer.clear(Color.BLACK)
    Renderer.clearDepth()
    
    Renderer.pushRenderTarget(skyboxRT)
    skybox_render()
    sun_render()
    Renderer.popRenderTarget()

    Renderer.pushRenderTarget(screenRT)
    SpriteBatch.begin()
    SpriteBatch.drawRect(skyboxRT, new Rect(0, 0, res.x, res.y), Color.WHITE)
    SpriteBatch.end()

    // Standard 3D
    threeD_setup()
    plane_render()
    carrier_render()
    trees_render()
    clouds_render()
    map_render()
    ocean_render()

    // Specials
    smokes_render()
    shots_render()
    propeller_render()

    cloud_renderOverlay()
    Renderer.popRenderTarget()

    Renderer.pushRenderTarget(bloomRT)
    SpriteBatch.begin(Matrix.IDENTITY, bloomPS)
    Renderer.setBlendMode(BlendMode.OPAQUE)
    SpriteBatch.drawRect(screenRT, new Rect(0, 0, res.x, res.y), Color.WHITE)
    SpriteBatch.end()
    Renderer.popRenderTarget()

    bloomRT.blur()
    SpriteBatch.begin()
    Renderer.setBlendMode(BlendMode.OPAQUE)
    SpriteBatch.drawRect(screenRT, new Rect(0, 0, res.x, res.y), Color.WHITE)
    Renderer.setBlendMode(BlendMode.ADD)
    SpriteBatch.drawRect(bloomRT, new Rect(0, 0, res.x, res.y), Color.WHITE)
    SpriteBatch.end()

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
