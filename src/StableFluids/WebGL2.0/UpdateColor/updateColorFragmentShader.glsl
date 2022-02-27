#version 300 es
precision mediump float;

uniform vec2 resolution;
uniform float dt;
uniform sampler2D colorTexture;
uniform sampler2D velocityTexture;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec2 velocity = texelFetch(velocityTexture, coord, 0).rg;
    coord -= ivec2(velocity * resolution * dt);
    vec3 color = texelFetch(colorTexture, coord, 0).rgb;
    outColor = vec4(color, 1.0);
}