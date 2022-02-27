#version 300 es
precision mediump float;

uniform vec2 resolution;

layout(location = 0) out vec4 outColor;

vec3 random3(vec2 p){
    return vec3(
        fract(sin(dot(p, vec2(12.2332,34.2145))*22.1232)),
        fract(sin(dot(p, vec2(25.5734,14.9741))*34.1342)),
        fract(sin(dot(p, vec2(32.1335,25.4821))*18.4272))
    );
}

void main(void) {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    p = floor(p * 10.0);
    vec3 color = random3(p);
    outColor = vec4(color, 1.0);
}