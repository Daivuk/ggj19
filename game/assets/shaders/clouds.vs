input float3 inPosition;
input float2 inTexCoord;

output float2 outTexCoord;

void main()
{
    oPosition = mul(float4(inPosition.xyz, 1), oViewProjection);

    outTexCoord = inTexCoord;
}
