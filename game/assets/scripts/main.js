var res = new Vector2(0, 0)
var skyboxRT = Texture.createScreenRenderTarget()
var bloomRT = Texture.createScreenRenderTarget()
var screenRT = Texture.createScreenRenderTarget()
var font = getFont("font.fnt")
var bloomPS = getShader("bloom.ps")
var crosshair = getTexture("crosshair.png")

init()

function init()
{
    Input.setMouseVisible(false)
    
    skybox_init()
    carrier_init()
    plane_init()
    camera_init()
    map_init()
    clouds_init()
    ocean_init()
    shots_init()
    trees_init()
    tanks_init()
    tents_init()
    aas_init()
}

function update(dt)
{
    if (Input.isJustDown(Key.ESCAPE)) quit()

    res = Renderer.getResolution()

    plane_update(dt)
    carrier_update(dt)
    tanks_update(dt)
    tents_update(dt)
    aas_update(dt)
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
    tents_render()
    trees_render()
    tanks_render()
    aas_render()
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

    var viewProj = camera.view.mul(camera.projection)
    var target = plane.position.add(new Vector3(plane.world._21, plane.world._22, plane.world._23).mul(20))
    var screenPos = new Vector4(target.x, target.y, target.z, 1).transform(viewProj)
    var screenPos2d = new Vector2(
        screenPos.x / screenPos.z * res.x / 2 + res.x / 2, 
        -screenPos.y / screenPos.z * res.y / 2 + res.y / 2)
    SpriteBatch.drawSprite(crosshair, screenPos2d, new Color(0.8, 0, 0, 1), 0, 1, Vector2.CENTER)

    SpriteBatch.end()


    SpriteBatch.begin()
    SpriteBatch.drawText(font, "Speed: " + plane.speed, new Vector2(10, 20), Vector2.TOP_LEFT, new Color(0.8, 0, 0, 1));
    SpriteBatch.drawText(font, "Lift: " + plane.lift, new Vector2(10, 40), Vector2.TOP_LEFT, new Color(0.8, 0, 0, 1));
    if (plane.onDeck)
    {
        SpriteBatch.drawText(font, "ON DECK", new Vector2(10, 60), Vector2.TOP_LEFT, new Color(0.8, 0, 0, 1));
    }
    SpriteBatch.drawText(font, "Life: " + plane.life, new Vector2(10, 80), Vector2.TOP_LEFT, new Color(0.8, 0, 0, 1));
    SpriteBatch.drawText(font, "Fuel: " + plane.fuel, new Vector2(10, 100), Vector2.TOP_LEFT, new Color(0.8, 0, 0, 1));
    SpriteBatch.drawText(font, "Bullets: " + plane.bullets, new Vector2(10, 120), Vector2.TOP_LEFT, new Color(0.8, 0, 0, 1));
    SpriteBatch.end()
}

function renderUI()
{
    res = Renderer.getResolution()
}
