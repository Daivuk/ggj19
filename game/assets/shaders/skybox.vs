input float3 inPosition;
input float3 inColor;

output float3 outColor;

void main()
{
    oPosition = mul(float4(inPosition.xyz, 1), oViewProjection);
    outColor = inColor;
}
