input float3 inPosition;
input float2 inTexCoord;

output float2 outTexCoord;

extern matrix world;

void main()
{
    oPosition = mul(float4(inPosition, 1), oViewProjection);
    outTexCoord = inTexCoord;
}
