#version 300 es
precision mediump float;

uniform sampler2D colorTexture;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec3 color = texelFetch(colorTexture, coord, 0).rgb;
    outColor = vec4(color, 1.0);
}