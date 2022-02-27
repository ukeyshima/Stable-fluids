#version 300 es
precision mediump float;

uniform vec2 resolution;
uniform sampler2D poissonTexture;
uniform sampler2D divergenceTexture;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    float p0 = texelFetch(poissonTexture, coord - ivec2(1.0, 0.0), 0).r;
    float p1 = texelFetch(poissonTexture, coord + ivec2(1.0, 0.0), 0).r;
    float p2 = texelFetch(poissonTexture, coord - ivec2(0.0, 1.0), 0).r;
    float p3 = texelFetch(poissonTexture, coord + ivec2(0.0, 1.0), 0).r;
    float divergence = texelFetch(divergenceTexture, coord, 0).r;

    float poisson = (p0 + p1 + p2 + p3) / 4.0 - divergence;

    outColor = vec4(poisson, 0.0, 0.0, 1.0);
}