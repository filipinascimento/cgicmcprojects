/*
 * Implementation of a Complex Network Viewerer in WebGL
 * Assignment for Computational Graphics graduate course
 * ICMC - Universidade de São Paulo
 * Created by Filipi Nacimento Silva
 *
*/


/* LICENSED Under the terms of Cyvision Open Academic License 

Copyright (c) 2012, Filipi Nascimento Silva
All rights reserved.

Cyvision Open Academic License ("COAL") This Cyvision Open Academic 
License (the "License") applies to any original work of authorship
(the "Original Work" or the "Software") whose owner (the "Licensor")
has placed the following licensing notice adjacent to the copyright
notice for the Original Work:

The term "External Deployment" means the use, distribution, or
communication of the Original Work or Derivative Works in any way such
that the Original Work or Derivative Works may be used by anyone other
than You, whether those works are distributed or communicated to those
persons or made available as an application intended for use over a
network.

The term "academic research" means works by faculty members, students or
affiliates of a recognized educational institution for teaching, research
and scientific information dissemination.


Licensed under the Cyvision Open Academic License

1) Grant of Copyright License. Licensor GRANTS You a worldwide,
royalty-free, non-exclusive license, for the duration of the copyright,
to do the following:

a) to perform the Original Work or Derivative Works publicly
for non-profit academic research purposes.

b) to display the Original Work or Derivative Works publicly for
non-profit academic research purposes.

c) to External Deployment for non-profit academic research purposes


2) Grant of Copyright License. Licensor does NOT ALLOW the following
uses without prior written consent:

a) any other use other than for of academic research purpose.

b) sublicense, rent, sell,	or lease any portion of this Software.


3) Redistributions of source code or Derivative Works must retain the
above copyright notice, this list of conditions and the following
disclaimer.


4) Grant of Patent License. Licensor grants You a worldwide,
royalty-free, non-exclusive license, under patent claims owned or
controlled by the Licensor that are embodied in the Original Work as
furnished by the Licensor, for the duration of the patents use the
Original Work and Derivative Works solely for non-profit academic
research purposes.


5) Exclusions From License Grant. Neither the names of Licensor, nor the
names of any contributors to the Original Work, nor any of their
trademarks or service marks, may be used to endorse or promote products
derived from this Original Work without express prior permission of the
Licensor. Except as expressly stated herein, nothing in this License
grants any license to Licensor's trademarks, copyrights, patents, trade
secrets or any other intellectual property. No patent license is granted
to make, use, sell, offer for sale, have made, or import embodiments of
any patent claims other than the licensed claims defined in Section 2.
No license is granted to the trademarks of Licensor even if such marks
are included in the Original Work. Nothing in this License shall be
interpreted to prohibit Licensor from licensing under terms different
from this License any Original Work that Licensor otherwise would have a
right to license.


6) Warranty of Provenance and Disclaimer of Warranty. Licensor warrants
that the copyright in and to the Original Work and the patent rights
granted herein by Licensor are owned by the Licensor or are sublicensed
to You under the terms of this License with the permission of the
contributor(s) of those copyrights and patent rights. Except as
expressly stated in the immediately preceding sentence, the Original
Work is provided under this License on an "AS IS" BASIS and WITHOUT
WARRANTY, either express or implied, including, without limitation, the
warranties of non-infringement, merchantability or fitness for a
particular purpose. THE ENTIRE RISK AS TO THE QUALITY OF THE ORIGINAL
WORK IS WITH YOU. This DISCLAIMER OF WARRANTY constitutes an essential
part of this License. No license to the Original Work is granted by this
License except under this disclaimer.

7) Limitation of Liability. Under no circumstances and under no legal
theory, whether in tort (including negligence), contract, or otherwise,
shall the Licensor be liable to anyone for any indirect, special,
incidental, or consequential damages of any character arising as a
result of this License or the use of the Original Work including,
without limitation, damages for loss of goodwill, work stoppage,
computer failure or malfunction, or any and all other commercial damages
or losses. This limitation of liability shall not apply to the extent
applicable law prohibits such limitation.

8) Termination for Patent Action. This License shall terminate
automatically and You may no longer exercise any of the rights granted
to You by this License as of the date You commence an action, including
a cross-claim or counterclaim, against Licensor or any licensee alleging
that the Original Work infringes a patent. This termination provision
shall not apply for an action alleging patent infringement by
combinations of the Original Work with other software or hardware.

9) Jurisdiction, Venue and Governing Law. Any action or suit relating to
this License may be brought only in the courts of a jurisdiction wherein
the Licensor resides or in which Licensor conducts its primary business,
and under the laws of that jurisdiction excluding its conflict-of-law
provisions. The application of the United Nations Convention on
Contracts for the International Sale of Goods is expressly excluded. Any
use of the Original Work outside the scope of this License or after its
termination shall be subject to the requirements and penalties of
copyright or patent law in the appropriate jurisdiction. This section
shall survive the termination of this License.

10) Attorneys' Fees. In any action to enforce the terms of this License
or seeking damages relating thereto, the prevailing party shall be
entitled to recover its costs and expenses, including, without
limitation, reasonable attorneys' fees and costs incurred in connection
with such action, including any appeal of such action. This section
shall survive the termination of this License.

11) Miscellaneous. If any provision of this License is held to be
unenforceable, such provision shall be reformed only to the extent
necessary to make it enforceable.

12) Definition of "You" in This License. "You" throughout this License,
whether in upper or lower case, means an individual or a legal entity
exercising rights under, and complying with all of the terms of, this
License. For legal entities, "You" includes any entity that controls, is
controlled by, or is under common control with you. For purposes of this
definition, "control" means (i) the power, direct or indirect, to cause
the direction or management of such entity, whether by contract or
otherwise, or (ii) ownership of fifty percent (50%) or more of the
outstanding shares, or (iii) beneficial ownership of such entity.

13) Right to Use. You may use the Original Work in all ways not
otherwise restricted or conditioned by this License or by law, and
Licensor promises not to interfere with or be responsible for such uses
by You.


14) THE CYBERNETIC VISION RESEARCH GROUP (CYVISION), UNIVERISADE DE SÃO
PAULO (USP), INSTITUTE OF PHYSICS OF SÃO CARLOS (IFSC), MAKE NO
REPRESENTATION ABOUT THE SUITABILITY OR ACCURACY OF THIS SOFTWARE OR
DATA FOR ANY PURPOSE, AND MAKES NO WARRANTIES, EITHER EXPRESS OR
IMPLIED, INCLUDING THE WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE OR THAT THE USE OF THIS SOFTWARE OR DATA WILL NOT
INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS, TRADEMARKS OF OTHER
RIGHTS. IT IS PROVIDED "AS IS".

*/

/* GLOBALS */

//Enable async mode - Very important for OpenGL calls order
$.ajaxSetup({async:false});


// Panel Splitter
var mainSplitter;

//OpenGL Context and Canvas
var gl;
var context2d;
var networkCanvas;
var networkCanvas2D;
var canvasContainer;
var context;

//Edges and Vertices Shader Programs IDs
var edgesShaderProgram;
var verticesShaderProgram;

//The network object (class in network.js)
var network;

//Edges geometry of the network (must be set in a VBO for performance)
var edgesGeometry = null;

/* view and projection Matrices*/
var viewMatrix;
var projectionMatrix;

/* stores the vertex geometry */
var vertexShape;

//Mouse UP/Down and simple camera controls with mouse.
var mouseDown  = false;
var lastMouseX = null;
var lastMouseY = null;
var cameraDistance = 6;
var redrawingFromMouseWheelEvent = false;
var rotationMatrix = mat4.create();
var animate = false;
mat4.identity(rotationMatrix);
var translatePosition = [0,0,0];

/* GUI variables */

var linesIntensity = intensityTransfFunction(80); 		// Global intensity of edges
var verticesIntensity = intensityTransfFunction(80);	// Global intensity of vertices when non opaque is enabled
var verticesScale = 1.0;
var linesWidth = 1.0;								// Global vertices scale factor

// Enable/Disabled options
var showEdges = true;									
var showVertices = true;
var opaqueVertices = true;	// Vertices are rendered as solids.
var useEdgesDepth = false;	// Enables the use of EdgesDepth (NOTE: edges are not sorted when depth is enabled. Visual artefacts may occurs.)
var useDarkBackground = true;
var usePerspective = true;
var fastEdges = false;
var fastVertices = false;

// Geometry mutators by properties default keys.
var currentEdgesColorKey = "degree";
var currentVerticesColorKey = "degree";

var currentSizeScalarKey = "degree";
var currentEdgesIntensitiesKey = "degree";
var currentVerticesIntensitiesKey = "degree";

// Geometry mutators coefficients. Coefficients are used to transform a linear function into a exponential function.
// The used transformation equation is: linearValue^(propertyCoeff)
var scalePropertyCoeff = 0.0;
var verticesIntensitiesCoeff = 0.0;
var edgesIntensitiesCoeff = 0.0;


var animation = new Object();

animation.translate = [0,0,0];
animation.distance = cameraDistance;
animation.xRotationSpeed = 0.25;
animation.yRotationSpeed = 0.1;


var dpr = window.devicePixelRatio || 1;
var displayNames = [];
var displayIndices = [];
var labelsSize = 20*dpr;
var labelsFont = labelsSize+"px Helvetica Neue"
var labelsBoxSize = 20*dpr;
var labelSymbolSize = dpr*1;

var touchMinScale = 1.0 ;
var touchCurrentScale = 1.0 ;

var NSet = function() {}
NSet.prototype.add = function(o) { this[o] = true; }
NSet.prototype.remove = function(o) { delete this[o]; }


function rgb(red, green, blue){
	return "rgb("+Math.round(red)+", "+Math.round(green)+", "+Math.round(blue)+")";
}
function rgba(red, green, blue, alpha){
	return "rgba("+Math.round(red)+", "+Math.round(green)+", "+Math.round(blue)+", "+alpha+")";
}

//Simple transformation function from linear slider intensity values to a better range for transparency.
function intensityTransfFunction(intensityValue){
	return Math.round(255*Math.pow(intensityValue/255.0,2.0))
}

// Degrees to Radians convert function
function degToRad(degrees) {
	return degrees * Math.PI / 180;
}

//mouse down handler (stores the last Mouse X and Y
function handleMouseDown(event) {
	event.preventDefault();
	mouseDown = true;
	var curX,curY;
	if(event.originalEvent!==undefined){
		curX = event.originalEvent.pageX;
		curY = event.originalEvent.pageY;
	}else{
		curX = event.pageX;
		curY = event.pageY;
	}
	
	lastMouseX = curX;
	lastMouseY = curY;
	
}


// update mouse state
function handleMouseUp(event) {
	event.preventDefault();
	mouseDown = false;
	if(fastEdges||fastVertices){
		//requestAnimFrame(function(){
		if(!animate){
				redraw();
			}
		//});
	}
}

//Handle mouse move when pressed
function handleMouseMove(event) {
	event.preventDefault();
	if (!mouseDown) {
		return;
	}
	var newX;
	var newY;
	var curX,curY;
	var curX,curY;
	if(event.originalEvent!==undefined){
		curX = event.originalEvent.pageX;
		curY = event.originalEvent.pageY;
	}else{
		curX = event.pageX;
		curY = event.pageY;
	}
	newX = curX;
	newY = curY;
	
	// x-axis differences rotates the matrix around y-axis
	// y-axis differences rotates the matrix around x-axis
	var deltaX = newX - lastMouseX
	var newRotationMatrix = mat4.create();
	
	mat4.identity(newRotationMatrix);
	mat4.rotate(newRotationMatrix, degToRad(deltaX / 2), [0, 1, 0]);

	var deltaY = newY - lastMouseY;
	mat4.rotate(newRotationMatrix, degToRad(deltaY / 2), [1, 0, 0]);

	mat4.multiply(newRotationMatrix, rotationMatrix, rotationMatrix);

	lastMouseX = newX
	lastMouseY = newY;
	
	// FIXME: Doing lazy redraw here because of performance issues.
	//requestAnimFrame(function(){
	if(!animate){
		redraw();
	}
	//});
}


// Generates edge geometry from a network
// also populates geometry mutators selectors in html
function generateEdgesGeometryFromNetwork(aNetwork){
	var edges = aNetwork.edges;
	var positions = aNetwork.positions;
	
	var newGeometry = new Object();
	var indicesArray;
	
	
	//FIXME: If num of vertices > 65k, we need to store the geometry in two different indices objects
	if(positions.length>64000){
		indicesArray = new Uint16Array(edges);
		newGeometry.indexType = gl.UNSIGNED_SHORT;
	}else{
		indicesArray = new Uint16Array(edges);
		newGeometry.indexType = gl.UNSIGNED_SHORT;
	}
	
	// create the lines buffer 2 vertices per geometry.
	newGeometry.vertexObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, newGeometry.vertexObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	
	newGeometry.colorObjects = new Object();
	newGeometry.intensitiesObjects = new Object();
	
	// Empty mutator selection fields
	$( "#edgesColorsProperty").empty();
	$( "#verticesColorsProperty").empty();
	$( "#sizeScalarProperty").empty();
	$( "#edgesIntensitiesProperty").empty();
	$( "#verticesIntensitiesProperty").empty();
	
	var key;
	var hasDegree = false;
	for(key in aNetwork.properties){
		if(aNetwork.properties[key].colors){
			//if the network property has colors, initialize a color buffer with its contents.
			var colorObject = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, colorObject);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aNetwork.properties[key].colors), gl.STATIC_DRAW);
			newGeometry.colorObjects[key] = colorObject;
			//using default "degree" as mutator property
			if(key=="degree"){
				currentEdgesColorKey= key;
				hasDegree = true;
			}
			// populate mutators selector with valid colors keys
			$( "#edgesColorsProperty").append(
				"<li class=\"ui-widget-content\" title=\""+key+"\">"+aNetwork.properties[key].name+"</li>"
			);
			
			$( "#verticesColorsProperty").append(
				"<li class=\"ui-widget-content\" title=\""+key+"\">"+aNetwork.properties[key].name+"</li>"
			);
		}
		if(aNetwork.properties[key].values && !isNaN(aNetwork.properties[key].values[0])){
			var intensitiesObject = gl.createBuffer();
			//if scalar values are found, assign a float buffer with its contents.
			gl.bindBuffer(gl.ARRAY_BUFFER, intensitiesObject);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aNetwork.properties[key].values), gl.STATIC_DRAW);
			newGeometry.intensitiesObjects[key] = intensitiesObject;
			aNetwork.properties[key].maxValue = Math.max.apply( Math, aNetwork.properties[key].values);
			
			if(key=="degree"){
				currentSizeScalarKey= key;
				hasDegree = true;
			}
			//populate valid scalar geometry mutators
			$( "#sizeScalarProperty").append(
				"<li class=\"ui-widget-content\" title=\""+key+"\">"+aNetwork.properties[key].name+"</li>"
			);
			$( "#edgesIntensitiesProperty").append(
				"<li class=\"ui-widget-content\" title=\""+key+"\">"+aNetwork.properties[key].name+"</li>"
			);
			$( "#verticesIntensitiesProperty").append(
				"<li class=\"ui-widget-content\" title=\""+key+"\">"+aNetwork.properties[key].name+"</li>"
			);
		}
		//if no degree key found, select the last valid key.
		if(!hasDegree){
			currentEdgesColorKey = key;
			currentSizeScalarKey= key;
		}
	}
	//Enable the current selected mutators keys.
	currentVerticesColorKey = currentEdgesColorKey;
	$("#edgesColorsProperty li[title=\""+currentEdgesColorKey+"\"]").addClass("ui-selected");
	$("#verticesColorsProperty li[title=\""+currentVerticesColorKey+"\"]").addClass("ui-selected");			
	
	currentEdgesIntensitiesKey = currentSizeScalarKey;
	currentVerticesIntensitiesKey = currentSizeScalarKey;
	
	$("#sizeScalarProperty li[title=\""+currentSizeScalarKey+"\"]").addClass("ui-selected");
	$("#edgesIntensitiesProperty li[title=\""+currentEdgesIntensitiesKey+"\"]").addClass("ui-selected");
	$("#verticesIntensitiesProperty li[title=\""+currentVerticesIntensitiesKey+"\"]").addClass("ui-selected");	
	
	//Create the index buffer directly from the edges adjacency list
	newGeometry.numIndices = indicesArray.length;
	
	newGeometry.indexObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, newGeometry.indexObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesArray, gl.STREAM_DRAW);
	return newGeometry;
}


//WebGL initialization 
function initCanvas(){

	//Initializing edges shaders
	var edgesShaderVertex = getShader(gl, "edges-vertex");
	var edgesShaderFragment = getShader(gl, "edges-fragment");
	
	edgesShaderProgram = new ShaderProgram(edgesShaderVertex,edgesShaderFragment,
									["projectionViewMatrix","nearFar","linesIntensity"],
									["vertex","color"]);
	
	//Initializing vertices shaders
	var verticesShaderVertex = getShader(gl, "vertices-vertex");
	var verticesShaderFragment = getShader(gl, "vertices-fragment");
	
	verticesShaderProgram = new ShaderProgram(verticesShaderVertex,verticesShaderFragment,
									["viewMatrix","projectionMatrix","normalMatrix",
									"position","color","intensity","scale"],
									["vertex","normal"]);
									
	//assigning the default vertex geometry as a sphere.
	vertexShape = makeSphere(gl, 1.0, 16, 16);
	//ertexShape = makeBox(gl);
	
	//Depth test is essential for the desired effects
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CW);
}

// function called everytime the canvas change it's size and redraw
function resizeCanvas(newWidth, newHeight){
	gl.viewport(0, 0, newWidth, newHeight);
	if(!animate){
		redraw();
	}
}

// Redraw function draw the entire scene.
function redraw(){
	//enables the depthMask in order to clear the depth buffer.
	gl.depthMask(true);
	if(useDarkBackground){
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
	}else{
		gl.clearColor(1.0, 1.0, 1.0, 1.0);
	}
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	gl.lineWidth(linesWidth);

	//initialize projection and view matrices
	projectionMatrix = mat4.create();
	viewMatrix = mat4.create();
	
	//Initialize the projection matrix as perspective or ortho according with the options
	if(usePerspective){
		mat4.perspective(60, networkCanvas.width / networkCanvas.height, 0.005, 100.0, projectionMatrix);
		mat4.identity(viewMatrix);
		mat4.translate(viewMatrix, [0, 0, -cameraDistance]);
	}else{
		var zoom = 1.0/Math.max(networkCanvas.width,networkCanvas.height);
		mat4.ortho(-networkCanvas.width * cameraDistance*zoom, networkCanvas.width * cameraDistance*zoom, -networkCanvas.height * cameraDistance*zoom, networkCanvas.height * cameraDistance*zoom, 0.05, 50.0, projectionMatrix);
		mat4.identity(viewMatrix);
		mat4.translate(viewMatrix, [0, 0, -5]);
	}
	
	//rotates view by the camera rotation matrix
	mat4.multiply(viewMatrix, rotationMatrix);
	//scales the matrix by a factor of 0.01 to ajust our data
	mat4.scale(viewMatrix,[0.01,0.01,0.01]);
	mat4.translate(viewMatrix,translatePosition);

	/* Draw vertices */
	
	//Vertices are drawn first because they may be opaque.
	//(the z buffer will be populated so we don't need to sort if we are using additive blending
	
	if(network.ready && showVertices && !((mouseDown||redrawingFromMouseWheelEvent) && fastVertices)){
		
		//Enable the shader program to draw vertices and the related attributes
		verticesShaderProgram.use();
	
		verticesShaderProgram.attributes.enable("vertex");
		verticesShaderProgram.attributes.enable("normal");
		
		//If opaque is enabled then we disable the transparency.
		//otherwise we draw the vertices with additive blending.
		//	Note that for additive blending to work no data must be written to the depthBuffer
		if(useDarkBackground){
			if(opaqueVertices){
				gl.disable(gl.BLEND);
			}else{
				gl.enable(gl.BLEND);
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
				gl.depthMask(false);
			}
		}else{
			if(opaqueVertices){
				gl.disable(gl.BLEND);
			}else{
				gl.enable(gl.BLEND);
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
				gl.depthMask(false);
			}
		}
		//Binding VAOs to attributes of the shader (vertex and normal)
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexShape.vertexObject);
		gl.vertexAttribPointer(verticesShaderProgram.attributes.vertex, 3, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexShape.normalObject);
		gl.vertexAttribPointer(verticesShaderProgram.attributes.normal, 3, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexShape.indexObject);
		
		gl.uniformMatrix4fv(verticesShaderProgram.uniforms.projectionMatrix, false, projectionMatrix);
		gl.uniformMatrix4fv(verticesShaderProgram.uniforms.viewMatrix, false, viewMatrix);
		
		//Normal matrix is obtained by the inverse transpose of the upper-left matrix in order to eliminate translations
		// and non isotropic scaling.
		var normalMatrix = mat3.create();
		mat4.toInverseMat3(viewMatrix, normalMatrix);
		mat3.transpose(normalMatrix);
		gl.uniformMatrix3fv(verticesShaderProgram.uniforms.normalMatrix, false, normalMatrix);
		
		// Geometry Mutators and colors obtained from the network properties
		var colorsArray = network.properties[currentVerticesColorKey].colors;
		var positionsArray = network.positions;
		var scaleValue = network.properties[currentSizeScalarKey].values;
		var intensityValue = network.properties[currentVerticesIntensitiesKey].values;
		
		//Normalization factor for scale and intensity
		var maxScale = network.properties[currentSizeScalarKey].maxValue;
		var maxIntensity = network.properties[currentVerticesIntensitiesKey].maxValue;
		
		//Positions
		for(var i=0;i<network.positions.length;i+=3){
			var color = [colorsArray[i],colorsArray[i+1],colorsArray[i+2]];
			var position = [positionsArray[i],positionsArray[i+1],positionsArray[i+2]];
			
			//Geometry Mutators
			gl.uniform1f(verticesShaderProgram.uniforms.scale,Math.pow(5*scaleValue[i/3]/maxScale,scalePropertyCoeff)*verticesScale);
			gl.uniform1f(verticesShaderProgram.uniforms.intensity,Math.pow(intensityValue[i/3]/maxIntensity,verticesIntensitiesCoeff)*verticesIntensity/255.0);
			
			/* Reserved for future Picking implementation (identification to rgb)
				var identification = i/3;
				var r = identification%255;
				var g = (identification/255)%255;
				var b = (identification/255/255)%255;
				
				gl.uniform3fv(verticesShaderProgram.uniforms.identification,[r/255.0,g/255.0,b/255.0]);
			*/
			
			//uniforms for each color/position
			gl.uniform3fv(verticesShaderProgram.uniforms.color,color);
			gl.uniform3fv(verticesShaderProgram.uniforms.position,position);
			//draw the geometry for every position 
			//FIXME: drawElement overhead is very critical on javascript (needs to reduce drawElements calling)
			gl.drawElements(gl.TRIANGLES, vertexShape.numIndices, vertexShape.indexType, 0);
		}
		// Disable attributes
		verticesShaderProgram.attributes.disable("vertex");
		verticesShaderProgram.attributes.disable("normal");
	}
	
	
	projectionViewMatrix = mat4.create(projectionMatrix);
	mat4.multiply(projectionViewMatrix,viewMatrix);
	
	//draw of the edges as lines
	if(edgesGeometry&&linesIntensity>0.0 && showEdges && !((mouseDown||redrawingFromMouseWheelEvent) && fastEdges)){
		edgesShaderProgram.use();
		
		//Edges are rendered with additive blending.
		gl.enable(gl.BLEND);
		if(useDarkBackground){
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		}else{
			//gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
			gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA,
                         gl.ZERO, gl.ONE );
		}
		// Enables the use of EdgesDepth (NOTE: edges are not sorted when depth is enabled. Visual artefacts may occurs.)
		if(!useEdgesDepth){
			gl.depthMask(false);
		}else{
			gl.depthMask(true);
		}
		
		//Enable attributes (vertex and color)
		edgesShaderProgram.attributes.enable("vertex");
		edgesShaderProgram.attributes.enable("color");
		
		//bind attributes and unions
		gl.bindBuffer(gl.ARRAY_BUFFER, edgesGeometry.vertexObject);
		gl.vertexAttribPointer(edgesShaderProgram.attributes.vertex, 3, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, edgesGeometry.colorObjects[currentEdgesColorKey]);
		gl.vertexAttribPointer(edgesShaderProgram.attributes.color, 3, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, edgesGeometry.indexObject);
		
		gl.uniformMatrix4fv(edgesShaderProgram.uniforms.projectionViewMatrix, false, projectionViewMatrix);
		
		//gl.uniform2fv(edgesShaderProgram.uniforms.nearFar,[0.1,10.0]);
		gl.uniform1f(edgesShaderProgram.uniforms.linesIntensity,linesIntensity/255);
		
		//drawElements is called only 1 time. no overhead from javascript
		gl.drawElements(gl.LINES, edgesGeometry.numIndices, edgesGeometry.indexType, 0);
		
		//disabling attributes
		edgesShaderProgram.attributes.disable("vertex");
		edgesShaderProgram.attributes.disable("color");
	}
	
		context2d.clearRect(0, 0, networkCanvas2D.width, networkCanvas2D.height);
	if(displayNames.length>0||displayIndices.length>0){
		context2d.save();
		context2d.strokeStyle = "rgba(255, 255, 255, 0.25)";
		context2d.fillStyle = "rgba(255, 255, 255, 0.25)";
		w2d = networkCanvas2D.width;
		h2d = networkCanvas2D.height;
		/*context2d.shadowBlur=0;
		context2d.shadowColor="rgba(255, 255, 255, 0.5)";
		context2d.shadowOffsetX= 1;
		context2d.shadowOffsetY= 1;
		
		context2d.shadowColor = "#000000";
		context2d.shadowOffsetX= 0;
		context2d.shadowOffsetY= 0;
		*/
		context2d.font = labelsFont;
		
		var allDisplayIndices = [];
		/*for(var nexti=0;nexti<displayNames.length;nexti++){
			var i = network.indexNameMap[displayNames[nexti]];
			if(i != undefined && i>=0 && i < network.names.length){
				allDisplayIndices.push(i);
			}
		}
		*/
		var allDisplaysSet = new NSet();
		for(var nexti=0;nexti<displayNames.length;nexti++){
			allDisplaysSet.add(displayNames[nexti]);
		}

		for(var i=0;i<network.names.length;i++){
			if(network.names[i] in allDisplaysSet){
				allDisplayIndices.push(i);
			}
		}

		for(var nexti=0;nexti<allDisplayIndices.length;nexti++){
			var i = allDisplayIndices[nexti];
			
			var color = [colorsArray[i*3],colorsArray[i*3+1],colorsArray[i*3+2]];
			var position = [positionsArray[i*3],positionsArray[i*3+1],positionsArray[i*3+2],1.0];
			var scale = Math.pow(5*scaleValue[i]/maxScale,scalePropertyCoeff)*verticesScale;
			var dest = [0.0,0.0,0.0,0.0];
			mat4.multiplyVec4(projectionViewMatrix, position, dest);
			if(dest[2]<0){//behind the camera
				continue;
			}
			var x = w2d/2 + dest[0]*w2d/2.0/dest[3];
			var y = h2d/2 - dest[1]*h2d/2.0/dest[3];
			context2d.translate(x,y);
			
			
			if(useDarkBackground){
				context2d.strokeStyle = rgba(color[0]*255, color[1]*255, color[2]*255, 0.4);
			}else{
				context2d.strokeStyle = rgba(color[0]*50+205, color[1]*50+205, color[2]*50+205, 0.80);
			}
			context2d.lineWidth = 3;
			context2d.beginPath();
			context2d.arc(0,0,1.0/dest[2]*scale*15*labelSymbolSize,0,2*Math.PI);
			context2d.stroke();
			
			if(useDarkBackground){
				context2d.strokeStyle = rgba(color[0]*200+55, color[1]*200+55, color[2]*200+55, 0.75);
			}else{
				context2d.strokeStyle = rgba(color[0]*100, color[1]*100, color[2]*100, 0.75);
			}
			
			context2d.beginPath();
			context2d.arc(0,0,1.0/dest[2]*scale*7.5*labelSymbolSize,0,2*Math.PI);
			context2d.stroke();
			
			if(useDarkBackground){
				context2d.strokeStyle = rgba(color[0]*200+55, color[1]*200+55, color[2]*200+55, 0.65);
			}else{
				context2d.strokeStyle = rgba(color[0]*50+205, color[1]*50+205, color[2]*50+205, 0.80);
			}
			
			context2d.beginPath();
			context2d.arc(0,0,1.0/dest[2]*scale*20*labelSymbolSize,0,2*Math.PI);
			context2d.stroke();
			
			var theName = network.names[i];
			var textSize = context2d.measureText(theName);
			
			if(useDarkBackground){
				context2d.fillStyle = rgba(color[0]*100, color[1]*100, color[2]*100, 0.75);
				context2d.strokeStyle = rgba(color[0]*255, color[1]*255, color[2]*255, 0.7);
			}else{
				context2d.fillStyle = rgba(color[0]*50+205, color[1]*50+205, color[2]*50+205, 0.80);
				context2d.strokeStyle = rgba(color[0]*50+205, color[1]*50+205, color[2]*50+205, 0.80);
			}
			context2d.fillRect(2,-(labelsBoxSize),textSize.width+6,labelsBoxSize);
			context2d.lineWidth = 1;
			context2d.strokeRect(2,-(labelsBoxSize),textSize.width+6,labelsBoxSize);
			
			if(useDarkBackground){
				context2d.fillStyle = "rgba(255, 255, 255, 0.6)";
			}else{
				context2d.fillStyle = "rgba(0, 0, 0, 0.9)";
			}
			
			context2d.fillText(theName,5,-5);
			context2d.translate(-x,-y);
		}
		context2d.restore();
	}
	
	if(redrawingFromMouseWheelEvent){
		redrawingFromMouseWheelEvent=false;
	}
}

// Event of resize of the canvas (called by the splitter or by windows resizing)
function willResizeEvent(event){
	//requestAnimFrame(function(){
		var dpr = window.devicePixelRatio || 1;
		networkCanvas2D.width = canvasContainer.innerWidth();
		networkCanvas2D.height = canvasContainer.innerHeight();
		networkCanvas.style.width = canvasContainer.innerWidth()+"px";
		networkCanvas.style.height = canvasContainer.innerHeight()+"px";
		networkCanvas2D.style.width = canvasContainer.innerWidth()+"px";
		networkCanvas2D.style.height = canvasContainer.innerHeight()+"px";
		networkCanvas.width = dpr*networkCanvas.clientWidth;
		networkCanvas.height = dpr*networkCanvas.clientHeight;
		networkCanvas2D.width = dpr*networkCanvas2D.clientWidth;
		networkCanvas2D.height = dpr*networkCanvas2D.clientHeight;
		resizeCanvas(networkCanvas.width,networkCanvas.height);
	//});
}


function centerVertexWithName(vertexName){
	var vertexPos = network.positionForName(vertexName);
	if(vertexPos){
		animation.translate[0] = -vertexPos[0];
		animation.translate[1] = -vertexPos[1];
		animation.translate[2] = -vertexPos[2];
	}
}


function stepAnimationToState(stepSize){
	
	//animation.translate = [0,0,0];
	//animation.distance = cameraDistance;
	newTranslate = animation.translate;
	var dx = newTranslate[0]-translatePosition[0];
	var dy = newTranslate[1]-translatePosition[1];
	var dz = newTranslate[2]-translatePosition[2];
	
	var sqredDist = dx*dx+dy*dy+dz*dz;
	
	if(sqredDist>=stepSize*stepSize*2.0){
		dx *= stepSize;
		dy *= stepSize;
		dz *= stepSize;
		
		if(sqredDist<stepSize*stepSize){
			var dist = Math.sqrt(sqredDist);
			dx /=dist;
			dy /=dist;
			dz /=dist;
		}
		translatePosition[0] += dx;
		translatePosition[1] += dy;
		translatePosition[2] += dz;
		return true;
	}else{
		translatePosition[0] = newTranslate[0];
		translatePosition[1] = newTranslate[1];
		translatePosition[2] = newTranslate[2];
		return false;
	}
}

function stepAnimationZoom(stepSize){
	
	//animation.translate = [0,0,0];
	//animation.distance = cameraDistance;
	newTranslate = animation.translate;
	var dx = animation.distance-cameraDistance;
	
	var sqredDist = dx*dx;
	
	if(sqredDist>=stepSize*stepSize*1.25){
		dx *= stepSize;
		
		if(sqredDist<stepSize*stepSize){
			dx /= Math.sqrt(sqredDist);
		}
		cameraDistance += dx;
		return true;
	}else{
		cameraDistance = animation.distance;
		return false;
	}
}
var animateFunction = function (){
	if(animate){
		var newRotationMatrix = mat4.create();
		mat4.identity(newRotationMatrix);
		mat4.rotate(newRotationMatrix, degToRad(animation.xRotationSpeed), [0, 1, 0]);
		mat4.rotate(newRotationMatrix, degToRad(animation.yRotationSpeed), [1, 0, 0]);
		mat4.multiply(newRotationMatrix, rotationMatrix, rotationMatrix);
		
		stepAnimationToState(0.05);
		stepAnimationZoom(0.01);
		redraw();
		requestAnimFrame(animateFunction);
	}
}

function startAnimation(){
	animate=true;
	requestAnimFrame(animateFunction);
}

function stopAnimation(){
	animate=false;
}

// Main 
$().ready(function(){
	//Resets the forms
	$("#propertiesForm")[0].reset();
	
	//Loading the network
	
	network = new Network();
	var networkFile = "go_nfs_complete"
	
	var hash_value = window.location.hash.replace('#', '');
	if(hash_value && hash_value.length>0){
		networkFile = hash_value;
	}
	network.loadFromFile(networkFile+"/properties.json");
	
	$("#legends").attr("src", networkFile+"/legends.png");
	
	
	//Obtaining the network canvas and the gl context
	networkCanvas = document.getElementById("networkCanvas");
	networkCanvas2D = document.getElementById("networkCanvas2D");
	canvasContainer = $("#canvasContainer");
	
	//GL context can be obtained with Debug form as in the following commented line
	//gl = WebGLDebugUtils.makeDebugContext(WebGLUtils.create3DContext(networkCanvas,{antialias: true}));
	gl = WebGLUtils.create3DContext(networkCanvas,{antialias: true});
	context2d = networkCanvas2D.getContext('2d');
	
		// Easily switch between regular canvas 2d context and webgl-2d
		
	initCanvas();
	
	//resize or spliter.resize events
	//jQuery.resize.delay = 50;
	
	$('#canvasContainer').bind('spliter.resize', willResizeEvent);
	$(window).resize(function(event) {
		if(mainSplitter){
			mainSplitter.trigger("spliter.resize");
			//mainSplitter.position(mainSplitter.position);
		}
		willResizeEvent(event);
	});
	
	mainSplitter = $('#mainSplitter')
					.split({orientation: 'vertical', limit: 200, position:-200, relativeToEnd:true});
		
	
	function BlockMove(event) {
		// Tell Safari not to move the window.
 		event.preventDefault() ;
 	}
	
	//Settuping mouse events and creating the geometry afther the network is fully loaded.
	network.callWhenReady(function(){
		console.log("Network is ready :)");
		edgesGeometry = generateEdgesGeometryFromNetwork(this);
		var deviceAgent = navigator.userAgent.toLowerCase();
		var agentID = deviceAgent.match(/(iphone|ipod|ipad)/);
		if (agentID) {
	 
			$(networkCanvas2D).bind("touchstart",handleMouseDown);
			$(networkCanvas2D).bind("touchend",handleMouseUp);
			$(networkCanvas2D).bind("touchmove",handleMouseMove);
			
			
			
			networkCanvas2D.ongestureend = function(event){
				 touchMinScale *= event.scale ;
			};
			
			
			networkCanvas2D.ontouchmove = function(event) {
				//touchCurrentScale = event.scale;
				//cameraDistance=6.0/(touchCurrentScale * touchMinScale);
				//requestAnimFrame(function(){
				redrawingFromMouseWheelEvent = true;
				if(!animate){
					redraw();
				}
					//});
			};
			
		}else{
			
			networkCanvas2D.onmousedown = handleMouseDown;
			document.onmouseup = handleMouseUp;
			document.onmousemove = handleMouseMove;
			document.onclick = void(0);
			networkCanvas2D.onclick = void(0);
			
		
			
			$(networkCanvas2D).mousewheel(function(event, delta, deltaX, deltaY) {
				//console.log(delta, deltaX, deltaY);
				
				cameraDistance+=delta;
				if(cameraDistance<0.01){
					cameraDistance=0.01;
				}else if(cameraDistance>10){
					cameraDistance = 10;
				}
				//requestAnimFrame(function(){
					redrawingFromMouseWheelEvent = true;
					if(!animate){
						redraw();
					}
					//});
			});
		}
		//requestAnimFrame(function(){
		
		if(!animate){
			redraw();
		}
		//});
	});
	
	/* GUI DEFINITIONS CALLS */
	
	
	// GUI Panel
	// Width Slider
	var widthChange = function(event, ui) {
		newValue = $("#widthSlider").slider("value");
		
		linesWidth = newValue;
		$("#widthValue").text(""+linesWidth);
		//requestAnimFrame(function(){
		
		if(!animate){
			redraw();
		}
		//});
	}
	
	$("#widthSlider").slider({
		max: 10,
		min: 0.5,
		step: 0.5,
		value: 1,
		slide:widthChange,
		change:widthChange
	});


	// Intensity Slider
	var intensityChange = function(event, ui) {
		newValue = $("#intensitySlider").slider("value");
		
		linesIntensity = intensityTransfFunction(newValue);
		$("#intensityValue").text(""+linesIntensity);
		//requestAnimFrame(function(){
		
		if(!animate){
			redraw();
		}
		//});
	}
	
	$("#intensitySlider").slider({
		max: 255,
		min: 0,
		step: 1,
		value: 80,
		slide:intensityChange,
		change:intensityChange
	});
	
	// Vertex Intensity Slider
	var vertexIntensityChange = function(event, ui) {
		newValue = $("#verticesIntensitySlider").slider("value");
		
		verticesIntensity = intensityTransfFunction(newValue);
		$("#verticesIntensityValue").text(""+verticesIntensity);
		if(!animate){
			redraw();
		}
	}
	
	$("#verticesIntensitySlider").slider({
		max: 255,
		min: 0,
		step: 1,
		value: 80,
		slide:vertexIntensityChange,
		change:vertexIntensityChange
	});
	
	// vertex Scale
	var scaleChange = function(event, ui) {
		newValue = $("#scaleSlider").slider("value");
		
		verticesScale = Math.pow(10,newValue);
		$("#scaleValue").text(""+Math.round(verticesScale*100)/100.0);
		if(!animate){
			redraw();
		}
	}
	// vertex Scale
	$("#scaleSlider").slider({
		max: 1,
		min: -1,
		step: 0.1,
		value: 0.0,
		slide:scaleChange,
		change:scaleChange
	});
	
	//show/hide Edges and Vertices
	$("#showhideSelector").buttonset();
	function updateShowHide(){
		showEdges = $("#showEdgesButton").is(':checked');
		showVertices = $("#showVerticesButton").is(':checked');
		if(!animate){
			redraw();
		}
	}
	$("#showEdgesButton").click(updateShowHide);
	$("#showVerticesButton").click(updateShowHide);
	
	$("#opaqueVerticesCheck").button();
	$("#opaqueVerticesCheck").click(function(){
		opaqueVertices = $("#opaqueVerticesCheck").is(':checked');
		if(!animate){
			redraw();
		}
	});
	
	//show/hide Edges and Vertices
	$("#orthoPerspectiveSelector").buttonset();
	$( "#radio" ).buttonset();
	function updatePerspectiveSelector(){
		usePerspective = $("#perspectiveButton").is(':checked');
		if(!animate){
			redraw();
		}
	}
	
	$("#perspectiveButton").click(updatePerspectiveSelector);
	$("#orthogonalButton").click(updatePerspectiveSelector);
	
	
	$("#useEdgesDepthCheck").button();
	$("#useEdgesDepthCheck").click(function(){
		useEdgesDepth = $("#useEdgesDepthCheck").is(':checked');
		if(!animate){
			redraw();
		}
	});
	
	$("#useDarkBackgroundCheck").button();
	$("#useDarkBackgroundCheck").click(function(){
		useDarkBackground = $("#useDarkBackgroundCheck").is(':checked');
		if(!animate){
			redraw();
		}
		if(useDarkBackground){
			 $("#propertiesPanel").css('backgroundColor','#000000').css('color','#FFFFFF');
		}else{
			 $("#propertiesPanel").css('backgroundColor','#FFFFFF').css('color','#000000');
		}
	});
	
	$("#edgesColorsProperty").selectable({
		stop: function() {
			//var result = $("#select-result").empty();
			if($("#edgesColorsProperty .ui-selected").length>0){
				currentEdgesColorKey = $("#edgesColorsProperty .ui-selected").attr("title");
				if(!animate){
					redraw();
				}
			}else{
				$("#edgesColorsProperty li[title=\""+currentEdgesColorKey+"\"]").addClass("ui-selected");
			}
		}
	});
	
	
	$("#verticesColorsProperty").selectable({
		stop: function() {
			//var result = $("#select-result").empty();
			if($("#verticesColorsProperty .ui-selected").length>0){
				currentVerticesColorKey = $("#verticesColorsProperty .ui-selected").attr("title");
				if(!animate){
					redraw();
				}
			}else{
				$("#verticesColorsProperty li[title=\""+currentVerticesColorKey+"\"]").addClass("ui-selected");
			}
		}
	});
	
	
	$("#sizeScalarProperty").selectable({
		stop: function() {
			//var result = $("#select-result").empty();
			if($("#sizeScalarProperty .ui-selected").length>0){
				currentSizeScalarKey = $("#sizeScalarProperty .ui-selected").attr("title");
				if(!animate){
					redraw();
				}
			}else{
				$("#sizeScalarProperty li[title=\""+currentSizeScalarKey+"\"]").addClass("ui-selected");
			}
		}
	});
	
	$("#edgesIntensitiesProperty").selectable({
		stop: function() {
			//var result = $("#select-result").empty();
			if($("#edgesIntensitiesProperty .ui-selected").length>0){
				currentEdgesIntensitiesKey = $("#edgesIntensitiesProperty .ui-selected").attr("title");
				if(!animate){
					redraw();
				}
			}else{
				$("#edgesIntensitiesProperty li[title=\""+currentEdgesIntensitiesKey+"\"]").addClass("ui-selected");
			}
		}
	});
	
	$("#verticesIntensitiesProperty").selectable({
		stop: function() {
			//var result = $("#select-result").empty();
			if($("#verticesIntensitiesProperty .ui-selected").length>0){
				currentVerticesIntensitiesKey = $("#verticesIntensitiesProperty .ui-selected").attr("title");
				if(!animate){
					redraw();
				}
			}else{
				$("#verticesIntensitiesProperty li[title=\""+currentVerticesIntensitiesKey+"\"]").addClass("ui-selected");
			}
		}
	});
	
	// scale property coeff
	var scalePropertyCoeffChange = function(event, ui) {
		newValue = $("#scalePropertyCoeffSlider").slider("value");
		scalePropertyCoeff = newValue;
		$("#scalePropertyCoeffValue").text(""+scalePropertyCoeff);
		if(!animate){
			redraw();
		}
	}
	// scale property coeff Change
	$("#scalePropertyCoeffSlider").slider({
		max: 2,
		min: 0,
		step: 0.1,
		value: 0,
		slide:scalePropertyCoeffChange,
		change:scalePropertyCoeffChange
	});
	
	// vertices intensities property coeff
	var verticesIntensitiesCoeffChange = function(event, ui) {
		newValue = $("#verticesIntensitiesCoeffSlider").slider("value");
		verticesIntensitiesCoeff = newValue;
		$("#verticesIntensitiesCoeffValue").text(""+verticesIntensitiesCoeff);
		if(!animate){
			redraw();
		}
	}
	
	// vertices intensities property coeff Change
	$("#verticesIntensitiesCoeffSlider").slider({
		max: 2,
		min: 0,
		step: 0.1,
		value: 0,
		slide:verticesIntensitiesCoeffChange,
		change:verticesIntensitiesCoeffChange
	});
	
	// edges intensities property coeff
	var edgesIntensitiesCoeffChange = function(event, ui) {
		newValue = $("#edgesIntensitiesCoeffSlider").slider("value");
		edgesIntensitiesCoeff = newValue;
		$("#edgesIntensitiesCoeffValue").text(""+edgesIntensitiesCoeff);
		if(!animate){
			redraw();
		}
	}
	
	// edges intensities property coeff Change
	$("#edgesIntensitiesCoeffSlider").slider({
		max: 2,
		min: 0,
		step: 0.1,
		value: 0,
		slide:edgesIntensitiesCoeffChange,
		change:edgesIntensitiesCoeffChange
	});
	
	//Fast Edges and Vertices movement
	$("#fastMoveSelector").buttonset();
	function updateFastMovement(){
		fastEdges = $("#fastEdgesButton").is(':checked');
		fastVertices = $("#fastVerticesButton").is(':checked');
		if(!animate){
			redraw();
		}
	}
	
	$("#fastEdgesButton").click(updateFastMovement);
	$("#fastVerticesButton").click(updateFastMovement);
	
});

