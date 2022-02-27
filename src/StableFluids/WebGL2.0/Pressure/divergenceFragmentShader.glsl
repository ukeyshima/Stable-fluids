#version 300 es
precision mediump float;

uniform float dt;
uniform sampler2D velocityTexture;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    float x0 = texelFetch(velocityTexture, coord - ivec2(1.0, 0.0), 0).r;
    float x1 = texelFetch(velocityTexture, coord + ivec2(1.0, 0.0), 0).r;
    float y0 = texelFetch(velocityTexture, coord - ivec2(0.0, 1.0), 0).g;
    float y1 = texelFetch(velocityTexture, coord + ivec2(0.0, 1.0), 0).g;

    float divergence = (x1 - x0 + y1 - y0) / 2.0;
    outColor = vec4(divergence, 0.0, 0.0, 1.0);
}
