/*
 * Implementation of a OpenGL subset in Javascript using HTML5's canvas
 * Assignment for Computational Graphics graduate course
 * ICMC - Universidade de São Paulo
 * Created by Filipi Nacimento Silva
 *
*/


/* LICENSED Under the terms of NEW BSD LICENSE:

Copyright (c) 2012, Filipi Nascimento Silva
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the <organization> nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/



/* Portins of code marked as provided by glMatrix JS (https://github.com/toji/gl-matrix/)
 * are under the following license:
 *
 * Copyright (c) 2012 Brandon Jones, Colin MacKenzie IV
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */






// Proper definition of last method to use Arrays as Stacks. 
if(!Array.prototype.last) {
    Array.prototype.last = function() {
        return this[this.length - 1];
    }
}

// Suitable RGB to HTML string converter.
function rgb(red, green, blue){
    return "rgb("+red+", "+green+", "+blue+")";
}

//
//Matrix and Vector operations - Only 4x4 matrices and 3 component vectors are implemented
//

//Creates a new Null Matrix
VECNewMatrix = function(copyM){
	var m = Array();
	if(copyM){
		m[0]= copyM[0];
		m[1]= copyM[1];
		m[2]= copyM[2];
		m[3]= copyM[3];
		m[4]= copyM[4];
		m[5]= copyM[5];
		m[6]= copyM[6];
		m[7]= copyM[7];
		m[8]= copyM[8];
		m[9]= copyM[9];
		m[10]= copyM[10];
		m[11]= copyM[11];
		m[12]= copyM[12];
		m[13]= copyM[13];
		m[14]= copyM[14];
		m[15]= copyM[15];
	}
	m[0]= 0;
	m[1]= 0;
	m[2]= 0;
	m[3]= 0;
	m[4]= 0;
	m[5]= 0;
	m[6]= 0;
	m[7]= 0;
	m[8]= 0;
	m[9]= 0;
	m[10]= 0;
	m[11]= 0;
	m[12]= 0;
	m[13]= 0;
	m[14]= 0;
	m[15]= 0;
}

//Copy the contents of copyM to destination matrix.
VECCopyMatrix = function(copyM,destination){
    if(!destination) {
    	destination = Array();
    }
	destination[0] = copyM[0];
	destination[1] = copyM[1];
	destination[2] = copyM[2];
	destination[3] = copyM[3];
	destination[4] = copyM[4];
	destination[5] = copyM[5];
	destination[6] = copyM[6];
	destination[7] = copyM[7];
	destination[8] = copyM[8];
	destination[9] = copyM[9];
	destination[10]= copyM[10];
	destination[11]= copyM[11];
	destination[12]= copyM[12];
	destination[13]= copyM[13];
	destination[14]= copyM[14];
	destination[15]= copyM[15];
	return destination;
}

//Creates a human readable string representation of a matrix (note that the matrices are col oriented)
VECStringMatrix = function(matrix){
	var string = "";
	string += matrix[0]+"  "+matrix[4]+"  "+matrix[8]+"  "+matrix[12]+"\n";
	string += matrix[1]+"  "+matrix[5]+"  "+matrix[9]+"  "+matrix[13]+"\n";
	string += matrix[2]+"  "+matrix[6]+"  "+matrix[10]+"  "+matrix[14]+"\n";
	string += matrix[3]+"  "+matrix[7]+"  "+matrix[11]+"  "+matrix[15];
	return string;
}

//Creates a identity matrix or turn destionation into a identity matrix
VECIdentityMatrix = function(destination) {
    if(!destination) {
    	destination = Array();
    }
    
    destination[0] = 1;  //11
    destination[5] = 1;  //22
    destination[10] = 1; //33
    destination[15] = 1; //44
    
    
    //-
    destination[1] = 0;
    destination[2] = 0;
    destination[3] = 0;
    
    
    destination[4] = 0;
    //-
    destination[6] = 0;
    destination[7] = 0;
    
    
    destination[8] = 0;
    //-
    destination[9] = 0;
    destination[11] = 0;
    
    
    destination[12] = 0;
    destination[13] = 0;
    //-
    destination[14] = 0;
    
    return destination;
};

//Code adapted from glMatrix JS source code (NEW BSD License)
//Multiply two matrices, write the result to destionation and return it.
VECMultiplyMatrix = function(m1, m2, destination) {
    if(!destination) {
    	destination = Array();
     }
    
    var a00 = m1[0], a01 = m1[1], a02 = m1[2], a03 = m1[3];
    var a10 = m1[4], a11 = m1[5], a12 = m1[6], a13 = m1[7];
    var a20 = m1[8], a21 = m1[9], a22 = m1[10], a23 = m1[11];
    var a30 = m1[12], a31 = m1[13], a32 = m1[14], a33 = m1[15];
    
    var b00 = m2[0], b01 = m2[1], b02 = m2[2], b03 = m2[3];
    var b10 = m2[4], b11 = m2[5], b12 = m2[6], b13 = m2[7];
    var b20 = m2[8], b21 = m2[9], b22 = m2[10], b23 = m2[11];
    var b30 = m2[12], b31 = m2[13], b32 = m2[14], b33 = m2[15];
    
    destination[0] = b00*a00 + b01*a10 + b02*a20 + b03*a30;
    destination[1] = b00*a01 + b01*a11 + b02*a21 + b03*a31;
    destination[2] = b00*a02 + b01*a12 + b02*a22 + b03*a32;
    destination[3] = b00*a03 + b01*a13 + b02*a23 + b03*a33;
    destination[4] = b10*a00 + b11*a10 + b12*a20 + b13*a30;
    destination[5] = b10*a01 + b11*a11 + b12*a21 + b13*a31;
    destination[6] = b10*a02 + b11*a12 + b12*a22 + b13*a32;
    destination[7] = b10*a03 + b11*a13 + b12*a23 + b13*a33;
    destination[8] = b20*a00 + b21*a10 + b22*a20 + b23*a30;
    destination[9] = b20*a01 + b21*a11 + b22*a21 + b23*a31;
    destination[10] = b20*a02 + b21*a12 + b22*a22 + b23*a32;
    destination[11] = b20*a03 + b21*a13 + b22*a23 + b23*a33;
    destination[12] = b30*a00 + b31*a10 + b32*a20 + b33*a30;
    destination[13] = b30*a01 + b31*a11 + b32*a21 + b33*a31;
    destination[14] = b30*a02 + b31*a12 + b32*a22 + b33*a32;
    destination[15] = b30*a03 + b31*a13 + b32*a23 + b33*a33;
    
    return destination;
};

//Multiply a matrix by a vector
//The vector is scaled by perspective (dividing by w)
//scaleFactor is provided for pointBased graphics
VECMultiplyMatrixVector = function(m, vector, destination, scaleFactor) {
    if(!destination) {
    	destination = vector;
    }
    
    var vx = vector[0];
    var vy = vector[1];
    var vz = vector[2];
    
    destination[0] = m[0]*vx + m[4]*vy + m[8]*vz + m[12];
    destination[1] = m[1]*vx + m[5]*vy + m[9]*vz + m[13];
    destination[2] = m[2]*vx + m[6]*vy + m[10]*vz + m[14];
    
    var winv = 1.0/(m[3]*vx + m[7]*vy + m[11]*vz + m[15]);
    //console.log(w);
    
    //perspective projection
    destination[0] *= winv;
    destination[1] *= winv;
    destination[2] *= winv;
    
    if(scaleFactor){
	    scaleFactor[0]=winv;
    }
    return destination;
};

//Translates a matrix by the provided vector
VECTranslateMatrix = function(vector,m,destination){
	var tx = vector[0];
	var ty = vector[1];
	var tz = vector[2];
	
	TMatrix = VECIdentityMatrix();
	TMatrix[12] = tx;
	TMatrix[13] = ty;
	TMatrix[14] = tz;
	
	if(!destination){
		destination = VECIdentityMatrix();
	}
	if(m){
		VECMultiplyMatrix(destination, TMatrix,  destination);
	}else{
		VECCopyMatrix(TMatrix,destination);
	}
	
	return destination;
}

//Scales a matrix by the provided scale vector
VECScaleMatrix = function(scaleVector,m,destination){
	var sx = scaleVector[0];
	var sy = scaleVector[1];
	var sz = scaleVector[2];
	
	SMatrix = VECIdentityMatrix();
	SMatrix[0] = sx;
	SMatrix[5] = sy;
	SMatrix[10] = sz;
	
	if(!destination){
		destination = VECIdentityMatrix();
	}
	if(m){
		VECMultiplyMatrix(destination,SMatrix, destination);
	}else{
		VECCopyMatrix(SMatrix, destination);
	}
	
	return destination;
}

//VECRotateMatrix is based on glMatrix JS source code (NEW BSD licensed)
//Rotates the provided matrix by the angle around the axis.
VECRotateMatrix = function(angle, axis, mat, destination) {
		if(!mat){
			mat = VECIdentityMatrix();
		}
        var x = axis[0], y = axis[1], z = axis[2];
        var len = Math.sqrt(x*x + y*y + z*z);
        if (!len) { return null; }
        if (len != 1) {
                len = 1 / len;
                x *= len; 
                y *= len; 
                z *= len;
        }
        
        var s = Math.sin(angle);
        var c = Math.cos(angle);
        var t = 1-c;
        
        // Cache the matrix values (makes for huge speed increases!)
        var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
        var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
        var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
        
        // Construct the elements of the rotation matrix
        var b00 = x*x*t + c, b01 = y*x*t + z*s, b02 = z*x*t - y*s;
        var b10 = x*y*t - z*s, b11 = y*y*t + c, b12 = z*y*t + x*s;
        var b20 = x*z*t + y*s, b21 = y*z*t - x*s, b22 = z*z*t + c;
        
        if(!destination) { 
                destination = mat 
        } else if(mat != destination) {
                destination[12] = mat[12];
                destination[13] = mat[13];
                destination[14] = mat[14];
                destination[15] = mat[15];
        }
        
        // Perform rotation-specific matrix multiplication
        destination[0] = a00*b00 + a10*b01 + a20*b02;
        destination[1] = a01*b00 + a11*b01 + a21*b02;
        destination[2] = a02*b00 + a12*b01 + a22*b02;
        destination[3] = a03*b00 + a13*b01 + a23*b02;
        
        destination[4] = a00*b10 + a10*b11 + a20*b12;
        destination[5] = a01*b10 + a11*b11 + a21*b12;
        destination[6] = a02*b10 + a12*b11 + a22*b12;
        destination[7] = a03*b10 + a13*b11 + a23*b12;
        
        destination[8] = a00*b20 + a10*b21 + a20*b22;
        destination[9] = a01*b20 + a11*b21 + a21*b22;
        destination[10] = a02*b20 + a12*b21 + a22*b22;
        destination[11] = a03*b20 + a13*b21 + a23*b22;
        return destination;
};

//VECFrustumMatrix function based on glMatrix JS source code (NEW BSD licensed)
//Creates the Frustum projection Matrix
VECFrustumMatrix = function(left, right, bottom, top, near, far, dest) {
        if(!dest) { dest = Array(); }
        var rl = (right - left);
        var tb = (top - bottom);
        var fn = (far - near);
        dest[0] = (near*2) / rl;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 0;
        dest[4] = 0;
        dest[5] = (near*2) / tb;
        dest[6] = 0;
        dest[7] = 0;
        dest[8] = (right + left) / rl;
        dest[9] = (top + bottom) / tb;
        dest[10] = -(far + near) / fn;
        dest[11] = -1;
        dest[12] = 0;
        dest[13] = 0;
        dest[14] = -(far*near*2) / fn;
        dest[15] = 0;
        return dest;
};


//VECPerspectiveMatrix function based on glMatrix JS source code (NEW BSD licensed)
//Creates the Frustum matrix from other perspective parameters.
VECPerspectiveMatrix = function(fovy, aspect, near, far, dest) {
        var top = near*Math.tan(fovy*Math.PI / 360.0);
        var right = top*aspect;
        return VECFrustumMatrix(-right, right, -top, top, near, far, dest);
};

//VECOrthoMatrix function based on glMatrix JS source code (NEW BSD licensed)
//Creates a orthogonal projection matrix
VECOrthoMatrix = function(xmin, xmax, ymin, ymax, znear, zfar, destination) {
        if(!destination) {
        	destination = Array();
        }
        
        var xsize = (xmax - xmin);
        var ysize = (ymax - ymin);
        var zsize = (zfar - znear);
        
        destination[0] = 2 / xsize;
        destination[1] = 0;
        destination[2] = 0;
        destination[3] = 0;
        
        destination[4] = 0;
        destination[5] = 2 / ysize;
        destination[6] = 0;
        destination[7] = 0;
        
        destination[8] = 0;
        destination[9] = 0;
        destination[10] = -2 / zsize;
        destination[11] = 0;
        
        destination[12] = -(xmin + xmax) / xsize; //tx
        destination[13] = -(xmax + ymin) / ysize; //ty
        destination[14] = -(zfar + znear) / zsize; //tz
        destination[15] = 1;
        
        return destination;
};

//
//GL object. Holds all OpenGL related functions and states.
//

function GL(theContext) {
	//Constants for current matrixModes
	this.GL_MODELVIEW = 0; //Use ModelView Matrix
    this.GL_PROJECTION = 1; //Use projection Matrix
    
	//Clear bit for glClear, when enabled the framebuffer is cleared.
    this.GL_COLOR_BUFFER_BIT = 0;
    //Framebuffer clear color
	this.clearColor = Array(0,0,0);
    
	//Current primitives supported by this software.
    this.GL_POINTS = 0;
    this.GL_LINES = 1;

	//Vertex attributes for glBegin/glEnd.
	this.vertices = Array();
	this.colors = Array();
	this.pointsSizes = Array();
	
	//Holds the current canvas context
	this.context = theContext;
	
	//Defines the current matrix to be handled by matrix operations
	this.matrixMode = this.GL_MODELVIEW;
	
	//Projection and modelView matrix Stacks
	this.projectionMatrixStack = Array();
	this.modelViewMatrixStack = Array();
	
	//Viewport definitions
	this.viewport = new Object();
	this.viewport.x = 0;
	this.viewport.y = 0;
	this.viewport.width = theContext.canvas.width;
	this.viewport.height = theContext.canvas.height;
	
	//Line width for GL_LINES primitives
	this.lineWidth = 1.0;
	
	//glBegin/glEnd temporary attributes
	this.primitiveType = 1;
	this.currentColor = Array(0,0,0);
	this.currentPointSize = 1;
	
	
	//Holds all provided primitives until glFlush is called.
	this.primitives = Array(); //Primitives to draw
	
	
	this.projectionMatrixStack.push(VECIdentityMatrix()); //Initial Projection Matrix
	this.modelViewMatrixStack.push(VECIdentityMatrix()); //Initial View Matrix
	
	//
	// GL Functions as in OpenGL 1.x specification
	//
	
    this.glMatrixMode = function(mode) {
    	this.matrixMode = mode;
    }

    
    this.glLoadIdentity = function() {
    	if(this.matrixMode==this.GL_MODELVIEW){
	    	VECIdentityMatrix(this.modelViewMatrixStack.last());
    	}else{
	    	VECIdentityMatrix(this.projectionMatrixStack.last());
    	}
    }
    
    this.gluPerspective = function(fovy, aspect, near, far){
    	if(this.matrixMode==this.GL_MODELVIEW){
	    	VECPerspectiveMatrix(fovy, aspect, near, far, this.modelViewMatrixStack.last());
    	}else{
	    	VECPerspectiveMatrix(fovy, aspect, near, far, this.projectionMatrixStack.last());
    	}
    }
    
    this.glOrtho = function(xmin, xmax, ymin, ymax, znear, zfar) {
    	if(this.matrixMode==this.GL_MODELVIEW){
	    	VECOrthoMatrix(xmin, xmax, ymin, ymax, znear, zfar, this.modelViewMatrixStack.last());
    	}else{
	    	VECOrthoMatrix(xmin, xmax, ymin, ymax, znear, zfar, this.projectionMatrixStack.last());
    	}
    }

    this.glViewport = function(x, y, width, height) {
    	this.viewport.x = x;
    	this.viewport.y = y;
    	this.viewport.width = width;
    	this.viewport.height = height;
    }
    
    this.glClearColor = function(r,g,b) {
    	this.clearColor = Array(r,g,b);
    }
    
    this.glClear = function(flag) {
    	if(flag==this.GL_COLOR_BUFFER_BIT){
    		//Here we need to use fillRect method of canvas because clearRect can not be used with a custom color.
	    	this.context.fillStyle = rgb(this.clearColor[0], this.clearColor[1], this.clearColor[2]);
	    	this.context.fillRect(this.viewport.x,this.viewport.y,this.viewport.width,this.viewport.height);
    	}
    }

    this.glBegin = function(primitiveType) {
        this.primitiveType = primitiveType;
    	this.vertices.length = 0;
    	this.colors.length = 0;
    	this.pointsSizes.length = 0;
    }


    this.glEnd = function() {
    	if(this.vertices.length>0){
    		//primitives are saved as objects with vertices, colors,
    		// type, projection/viewmode matrices and pointsSizes for GL_POINTS
    		var currentPrimitives = new Object();
    		currentPrimitives.type = this.primitiveType;
    		currentPrimitives.vertices = this.vertices.slice();
    		currentPrimitives.colors = this.colors.slice();
    		currentPrimitives.modelViewMatrix = this.modelViewMatrixStack.last().slice();
    		currentPrimitives.projectionMatrix = this.projectionMatrixStack.last().slice();
    		if(this.primitiveType==this.GL_POINTS){
    			currentPrimitives.pointsSizes = this.pointsSizes.slice();
    		}
    		this.primitives.push(currentPrimitives);
    	}
    	this.vertices.length = 0;
    	this.colors.length = 0;
    	this.pointsSizes.length = 0;
    }

    this.glVertex = function(x, y, z) {
    	this.colors.push(this.currentColor.slice());
    	this.vertices.push(Array(x,y,z)); 
    	if(this.primitiveType==this.GL_POINTS){
	    	this.pointsSizes.push(this.currentPointSize);
    	}
    }
    
    this.glColor = function(r, g, b) {
    	this.currentColor[0] = r;
    	this.currentColor[1] = g;
    	this.currentColor[2] = b;
    }
    
    this.glPointSize = function(pointSize){
	    this.currentPointSize = pointSize;
    }
    	
    this.glTranslate = function(tx, ty, tz) {
    	if(this.matrixMode==this.GL_MODELVIEW){
    		VECTranslateMatrix(Array(tx,ty,tz),this.modelViewMatrixStack.last(),this.modelViewMatrixStack.last());
    	}else{
    		VECTranslateMatrix(Array(tx,ty,tz),this.projectionMatrixStack.last(),this.projectionMatrixStack.last());
    	}
    }

    this.glRotate = function(theta, rx, ry, rz) {
    	if(this.matrixMode==this.GL_MODELVIEW){
    		VECRotateMatrix(theta, Array(rx,ry,rz), this.modelViewMatrixStack.last(), this.modelViewMatrixStack.last());
    	}else{
    		VECRotateMatrix(theta, Array(rx,ry,rz), this.projectionMatrixStack.last(), this.projectionMatrixStack.last());
    	}
    }

    this.glScale = function(sx, sy, sz) {
    	if(this.matrixMode==this.GL_MODELVIEW){
    		VECScaleMatrix(Array(sx,sy,sz),this.modelViewMatrixStack.last(),this.modelViewMatrixStack.last());
    	}else{
    		VECScaleMatrix(Array(sx,sy,sz),this.projectionMatrixStack.last(),this.projectionMatrixStack.last());
    	}
    }
    
    this.glPushMatrix = function(){
    	if(this.matrixMode==this.GL_MODELVIEW){
    		this.modelViewMatrixStack.push(this.modelViewMatrixStack.last().slice());
    	}else{
    		this.projectionMatrixStack.push(this.projectionMatrixStack.last().slice());
    	}
    }
    
    this.glPopMatrix = function(){
    	if(this.matrixMode==this.GL_MODELVIEW){
    		this.modelViewMatrixStack.pop();
    	}else{
    		this.projectionMatrixStack.pop();
    	}
    }
    
    this.glLineWidth = function(newWidth){
    	this.lineWidth=newWidth;
    }
    
    //glFlush will draw the scene into the canvas.
    this.glFlush = function() {
    	var primitiveIndex = 0;
	    for(primitiveIndex=0;primitiveIndex<this.primitives.length;primitiveIndex++){
	    	primitive = this.primitives[primitiveIndex];
	    	var vertices = primitive.vertices;
	    	var colors = primitive.colors;
	    	var count = vertices.length;
	    	
	    	var viewport = this.viewport;
	    	
	    	var modelViewMatrix = this.modelViewMatrixStack.last();
	    	var projectionMatrix = this.projectionMatrixStack.last();
	    	
	    	//console.log("Model for "+primitiveIndex+":\n"+VECStringMatrix(modelViewMatrix));
	    	//console.log("Proj for "+primitiveIndex+":\n"+VECStringMatrix(projectionMatrix));
	    	
	    	var projModelViewMatrix = VECMultiplyMatrix(projectionMatrix,modelViewMatrix);
			var perspectiveScales = Array();
			
    		for(i=0;i<count;i++){
				vertex = vertices[i];
				//Vertex Transformations
				//Works like a vertex shader
				var scaleFactor = Array(1);
				VECMultiplyMatrixVector(projModelViewMatrix, vertex, vertex,scaleFactor);
				perspectiveScales.push(scaleFactor[0]);
				
				//Viewport Transformation
				vertex[0] = viewport.width*0.5*(vertex[0]+1.0)+viewport.x;
				//Y is inverted because the canvas is y at top oriented
				vertex[1] = viewport.height-(viewport.height*0.5*(vertex[1]+1.0)+viewport.y);
    		}
    		
    		var canvasContext = this.context;
    		//Drawing of the primitives
	    	if(primitive.type == this.GL_POINTS){
	    		var pointsSizes = primitive.pointsSizes;
	    		for(i=0;i<count;i++){
		    		var vertex = vertices[i];
		    		var color = colors[i];
		    		var pointSize = pointsSizes[i]*perspectiveScales[i];
		    		//GL_POINTS are drawn as filled circles with pointSize size
		    		//The pointSize is proportional to the perspective scale
		    		canvasContext.fillStyle = rgb(color[0],color[1],color[2]);
		    		canvasContext.beginPath();
		    		canvasContext.arc(vertex[0], vertex[1], pointSize, 0, 2 * Math.PI, true);
		    		canvasContext.fill();
		
	    		}
	    	}else if(primitive.type == this.GL_LINES){
	    		canvasContext.lineWidth = this.lineWidth;
	    		for(i=0;i<count;i+=2){
		    		//GL_LINES are drawn as canvas lines.
		    		var start = vertices[i];
		    		var end = vertices[i+1];
		    		
		    		var colorStart = colors[i];
		    		var colorEnd = colors[i+1];
		    		
		    		var x1 = start[0];
		    		var y1 = start[1];
		    		
		    		var x2 = end[0];
		    		var y2 = end[1];
		    		
		    		//Creates line with linear gradient simulating linear interpolation.
		    		var grad = canvasContext.createLinearGradient(x1, y1, x2, y2);
		    		grad.addColorStop(0.0,rgb(colorStart[0],colorStart[1],colorStart[2]));
		    		grad.addColorStop(1.0,rgb(colorEnd[0],colorEnd[1],colorEnd[2]));
		    		canvasContext.strokeStyle = grad;
		    		canvasContext.beginPath();
		    		canvasContext.moveTo(x1,y1);
		    		canvasContext.lineTo(x2,y2);
		    		canvasContext.stroke();
	    		}
	    	}
    	}
    	this.primitives.length = 0;
    }
    
    //Gets the current matrix for debug purpose.
    this.glGetMatrix = function(destination) {
    	if(this.matrixMode==this.GL_MODELVIEW){
    		//console.log("Teste");
    		return VECCopyMatrix(this.modelViewMatrixStack.last(),destination);
    	}else{
    		return VECCopyMatrix(this.projectionMatrixStack.last(),destination);
    	}
    }
}

//Function required to update the canvas without flickering.
window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000 / 60);
    };
})();


//our current default gl object
var gl;
$(document).ready(function(){
var canvas = $("#glCanvas")[0];
	if(canvas!=undefined){
		var context = canvas.getContext("2d");
		//assigning the context of glCanvas container to our gl object.
		gl = new GL(context);
	}
});