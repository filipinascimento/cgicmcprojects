uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
//uniform mat4 u_modelMatrix;

attribute vec4 vertex;
attribute vec3 color;

varying vec3 vColor;
//varying float vZComponent;

void main(void){
	vec4 viewVertex = projectionMatrix * viewMatrix * vertex;
	vColor = color;
	//vZComponent = viewVertex.z;
	gl_Position =   viewVertex;
}
