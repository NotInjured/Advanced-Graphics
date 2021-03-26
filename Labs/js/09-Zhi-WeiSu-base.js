let Shaders = {}
Shaders.BasicShader9B0 = {

	name: 'BasicShader9B0', //for debugging

	uniforms: {

		'time': { type: 'f', value: 0.0 }

	},
	
	vertexShader: 
	
	`uniform float time;

	varying vec2  vUv;

	void main() {

		vec3 pos = position;

		// pos.z += position.y;

       	// pos.z += sin( pos.y );
		// pos.z = step(0.0, sin( pos.x));
		// pos.z += step(0.0, sin( pos.y));
       	// pos.z += sin( pos.y * 0.5 );

       	// pos.z += sin( pos.y + time);

       	// pos.z += 0.4 * sin( time * 2.0 + pos.x ) + 0.2 * sin( time * 2.0 + pos.y );

       	// pos.x += sin( position.z );
       	// pos.y += sin( position.x );
       	// pos.z += sin( position.y );
       	vUv = uv;

		gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

	}`,


	fragmentShader:

	`varying vec2 vUv;

	// vec3 color = vec3(1.0, 1.0, 0.0);         //local variable red

	void main() {

		gl_FragColor = vec4( vec3(vUv, 1.0),  1.0 );    //alpha is 0.75

	}`
};

