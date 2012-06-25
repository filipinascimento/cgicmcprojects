
//GetShader function obtained from
//https://developer.mozilla.org/en/WebGL/Adding_2D_content_to_a_WebGL_context
// under public domain.
function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}
	
	if(shaderScript.src){
		$.ajax({
		 	url: shaderScript.src,
		 	success: function(result) {
				str = result;
			},
			async: false
		});
	}
	
	var shader;
	if (shaderScript.type == "text/glsl-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "text/glsl-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}


function ShaderProgram(vertexShader,fragmentShader, uniforms, attributes, glContext){
	var shaderProgram = gl.createProgram();
	
	if(!glContext){
		glContext = gl;
	}
	
	glContext.attachShader(shaderProgram, vertexShader);
	glContext.attachShader(shaderProgram, fragmentShader);
	glContext.linkProgram(shaderProgram);
	
	
	if (!glContext.getProgramParameter(shaderProgram, glContext.LINK_STATUS)) {
		alert("Shader Compilation Error.");
		 return;
	}
	
	this.id = shaderProgram;
	
	this.uniforms = new Object();
	this.attributes = new Object();
	
	if(uniforms){
		for(var i=0;i<uniforms.length;i++){
			this.uniforms[uniforms[i]] = glContext.getUniformLocation(this.id, uniforms[i]);
		}
	}
	
	this.attributes.enable = function(attributeName){
		if(!glContext){
			glContext = gl;
		}
		glContext.enableVertexAttribArray(this[attributeName]);
	}
	
	this.attributes.disable = function(attributeName){
		if(!glContext){
			glContext = gl;
		}
		glContext.disableVertexAttribArray(this[attributeName]);
	}
	
	if(attributes){
		for(var i=0;i<attributes.length;i++){
			this.attributes[attributes[i]] = glContext.getAttribLocation(this.id, attributes[i]);
		}
	}
	
	this.use = function(glContext){
		if(!glContext){
			glContext = gl;
		}
		glContext.useProgram(this.id);
	}
}