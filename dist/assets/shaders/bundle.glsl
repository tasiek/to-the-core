

---
name: Colorful Voronoi
type: fragment
author: Brandon Fogerty (xdpixel.com)
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 fragCoord;

vec2 hash(vec2 p)
{
    mat2 m = mat2(  13.85, 47.77,
                    99.41, 8.48
                );

    return fract(sin(m*p) * 46738.29);
}

float voronoi(vec2 p)
{
    vec2 g = floor(p);
    vec2 f = fract(p);

    float distanceToClosestFeaturePoint = 1.0;
    for(int y = -1; y <= 1; y++)
    {
        for(int x = -1; x <= 1; x++)
        {
            vec2 latticePoint = vec2(x, y);
            float currentDistance = distance(latticePoint + hash(g+latticePoint), f);
            distanceToClosestFeaturePoint = min(distanceToClosestFeaturePoint, currentDistance);
        }
    }

    return distanceToClosestFeaturePoint;
}

void main( void )
{
    vec2 uv = ( fragCoord.xy / resolution.xy ) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;

    float offset = voronoi(uv*10.0 + vec2(time));
    float t = 1.0/abs(((uv.x + sin(uv.y + time)) + offset) * 30.0);

    float r = voronoi( uv * 1.0 ) * 1.0;
    vec3 finalColor = vec3(10.0 * uv.y, 2.0, 1.0 * r ) * t;
    
    gl_FragColor = vec4(finalColor, 1.0 );
}

---
name: Tunnel
type: fragment
uniform.alpha: { "type": "1f", "value": 1.0 }
uniform.origin: { "type": "1f", "value": 2.0 }
uniform.iChannel0: { "type": "sampler2D", "value": null, "textureData": { "repeat": true } }
---

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;
uniform float alpha;
uniform float origin;

varying vec2 fragCoord;

#define S 0.79577471545 // Precalculated 2.5 / PI
#define E 0.0001

void main(void) {
    vec2 p = (origin * fragCoord.xy / resolution.xy - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    vec2 t = vec2(S * atan(p.x, p.y), 1.0 / max(length(p), E));
    vec3 c = texture2D(iChannel0, t + vec2(time * 0.1, time)).xyz;
    gl_FragColor = vec4(c / (t.y + 0.5), alpha);
}



---
name: Particles
type: fragment
---

precision highp float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

#define N(h) fract(sin(vec4(6,9,1,0)*h) * 9e2)

void main(void)
{
    vec4 o; 
    vec2 u = fragCoord.xy / resolution.y;
    float s = 500.0;
    u = floor(u * s) / s;
    float e, d, i=0.;
    vec4 p;
    
    for (float i=1.; i<30.; i++) {
        d = floor(e = i*9.1+time);
        p = N(d)+.3;
        e -= d;

        for (float d=0.; d<5.;d++)
            o += p*(2.9-e)/1e3/length(u-(p-e*(N(d*i)-.5)).xy);
    }
     
    gl_FragColor = vec4(o.rgb, 1.0);
}



---
name: Rainbow Circle
type: fragment
---

#ifdef GL_ES
precision lowp float;
#endif

uniform float time;
uniform vec2 resolution;

#define PI 3.14159265359
#define T (time / .99)

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 4.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {
	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - 0.5);
	position.x *= resolution.x / resolution.y;
	
	vec3 color = vec3(0.0, 0.0, 0.0);
	
	for (float i = 0.; i < PI*2.0; i += PI/20.0) {
		vec2 p = position - vec2(cos(i), sin(i)) * 0.4;
		vec3 col = vec3(1.0, 0.0, 0.0); //hsv2rgb(vec3((i + T)/(PI*2.0), 1., 1));
		color += col * (2./512.) / length(p);
	}
	gl_FragColor = vec4( color, 1.0 ) / vec4(2.0, 2.0, 2.0, 1.0);

}