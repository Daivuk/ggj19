input float3 inPosition;
input float3 inColor;
input float2 inTexCoord;

output float4 outPosition;
output float2 outTexCoord;
output float3 outColor;

extern float3 sunDir;

void main()
{
    oPosition = mul(float4(inPosition, 1), oViewProjection);
    
    outPosition = oPosition;
    outTexCoord = inTexCoord;
    outColor = inColor;
}
