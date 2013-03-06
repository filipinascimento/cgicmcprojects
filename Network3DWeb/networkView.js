
var N3DViewPropertyFloatType=0;
var N3DViewPropertyIntType=1;
var N3DViewPropertyStringType=2;
var N3DViewPropertyToggleType=3;
var N3DViewPropertyMultiToggleType=4;
var N3DViewPropertySelectorType=5;



function N3DViewProperty(options){
	options = typeof options !== 'undefined' ? options : {};
	this.type = N3DViewPropertyFloatType;
	this.name = "";
	this.extraOptions = {};
	this.control = null;
	this.controlElementID = "";
	this.updateControl = null;
	this.maxValue = 1;
	this.minValue = 0;
	this.step = 0.1;
	this.value = 0;
	this.selectorOptions = [];
	this.createUpdateControlFunction = function(){
		if(this.type == N3DViewPropertyFloatType || this.type == N3DViewPropertyIntType){
			this.updateControl = function(){
				var controlElementSlider = jQuery("#"+this.controlElementID+" .control");
				var controlElementLabel = jQuery("#"+this.controlElementID+" .label");
				var controlElementTitle = jQuery("#"+this.controlElementID+" .title");
				if(controlElementSlider.length){
					controlElementSlider.slider( "option", "max", this.maxValue );
					controlElementSlider.slider( "option", "min", this.minValue );
					controlElementSlider.slider( "option", "value", this.value );
					controlElementSlider.slider( "option", "step", this.step);
				}
				if(controlElementLabel.length){
					controlElementLabel.text(""+this.value);
				}
				if(controlElementTitle.length){
					controlElementTitle.text(this.name);
				}
			};
		}else if(this.type == N3DViewPropertyStringType){
			
		}else if(this.type == N3DViewPropertyToggleType){
			
		}else if(this.type == N3DViewPropertyMultiToggleType){
			
		}else if(this.type == N3DViewPropertySelectorType){
			
		}
		// FIXME: Complete that
	}
	this.initializeControlForID = function(elementID){
		this.controlElementID = elementID;
		if(this.type == N3DViewPropertyFloatType || this.type == N3DViewPropertyIntType){
			this.updateControl = function(){
				var controlElementSlider = jQuery("#"+this.controlElementID+" .control");
				var controlElementLabel = jQuery("#"+this.controlElementID+" .label");
				var controlElementTitle = jQuery("#"+this.controlElementID+" .title");
				if(controlElementSlider.length){
					controlElementSlider.slider({
						max: this.maxValue,
						min: this.minValue,
						value: this.value,
						step: this.step
					});
				}
				if(controlElementLabel.length){
					controlElementLabel.text(""+this.value);
				}
				if(controlElementTitle.length){
					controlElementTitle.text(this.name);
				}
			};
		}else if(this.type == N3DViewPropertyStringType){
			
		}else if(this.type == N3DViewPropertyToggleType){
			
		}else if(this.type == N3DViewPropertyMultiToggleType){
			
		}else if(this.type == N3DViewPropertySelectorType){
			
		}
		// FIXME: Complete that
	}
	this.appendDefaultControlTo(controlDestination){
		if(this.controlElementID==""){
			this.controlElementID = this.name+"Control";
		}
		jQuery('<div/>', {
			id: this.controlElementID
			}).appendTo(controlDestination);
			
	}
	this.createUpdateControlFunction();
	jQuery.extend(this,options);
}


function N3DNetworkView(){
	//HTML Context
	this.mainSplitter = null;
	this.context = null;
	//HTML 
	this.network = null;
	
	this.camera = null;
	
	this.geometry = null;
	
	
	
	var options = new Object();
	options.showEdges = true;									
	options.showVertices = true;
	options.opaqueVertices = true;
	options.useEdgesDepth = false;
	options.usePerspective = true;
	options.fastEdges = false;
	options.fastVertices = false;
}

var test = new N3DNetworkView();

N3DNetworkView.prototype.setNetwork = function(network){
	var gl = this.context;
	if(!gl){
		throw "No context initialized for the networkView. Contexts shall be initialized before setuping the network geometry.";
		return;
	}
	
	
}


