var threeD = {
    vs: getShader("textured_shaded.vs"),
    ps: getShader("textured_shaded.ps"),
}

function threeD_setup()
{
    // Set common render states for 3D stuff
    Renderer.setView(camera.view)
    Renderer.setProjection(camera.projection)
    Renderer.setBlendMode(BlendMode.OPAQUE)
    Renderer.setFilterMode(FilterMode.NEAREST)
    Renderer.setBackFaceCull(true)
    Renderer.setDepthEnabled(true)
    Renderer.setDepthWrite(true)
    Renderer.setPrimitiveMode(PrimitiveMode.TRIANGLE_LIST)
    Renderer.setVertexShader(threeD.vs)
    Renderer.setPixelShader(threeD.ps)

    threeD.vs.setVector3("sunDir", sun.dir)
    threeD.ps.setVector2("fogDist", new Vector2(10, 75))
    Renderer.setTexture(skyboxRT, 0)
}
