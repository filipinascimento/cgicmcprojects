
function Network() {
	this.loading = 0;
	this.ready=false;
	this.readyEventFunction = function(){
		
	};
	this.positionForName = function(name){
		var pos = new Array();
		var nameIndex = this.indexNameMap[name];
		pos.push(this.positions[nameIndex*3]);
		pos.push(this.positions[nameIndex*3+1]);
		pos.push(this.positions[nameIndex*3+2]);
		return pos;
	}
	this.triggerReadyEvent = function(){
		var i;
		this.indexNameMap = new Object();
		for(i=0;i<this.names.length;i++){
			this.indexNameMap[this.names[i]] = i;
		}
		this.readyEventFunction(this);
	}
	
	this.isReady = function() {
		return this.ready;
	}
	
	this.addLoad = function() {
		this.ready=false;
		this.loading++;
	}
	
	this.removeLoad = function() {
		this.loading--;
		if(this.loading<=0){
			this.ready=true;
			this.triggerReadyEvent();
		}
	}
	
	this.callWhenReady = function (readyEventFunction){
		this.readyEventFunction = readyEventFunction;
		if(this.loading<=0&&this.ready){
			this.triggerReadyEvent();
		}
	}

	this.networkAddProperty = function (propertyKey, propertyName, networkDir){
		if(!this.properties[propertyKey]){
			this.properties[propertyKey] = new Object();
		}
		this.properties[propertyKey].name = propertyName;
		
		networkObject = this;
		
		this.addLoad();
		$.get(networkDir+"/"+propertyKey+".property",function(values){
			console.log("Getting: "+networkDir+"/"+propertyKey+".property");
			networkObject.properties[propertyKey].values = values.split("\n");
			networkObject.removeLoad();
		}).error(function() {
			console.log("Values of property "+propertyName+" do not exist.");
			networkObject.removeLoad();
		});
		
		
		this.addLoad();
		$.get(networkDir+"/"+propertyKey+".colors",function(colors){
			console.log("Getting: "+networkDir+"/"+propertyKey+".colors");
			networkObject.properties[propertyKey].colors = new Float32Array(colors.split(new RegExp("\\s+")));
			networkObject.removeLoad();
		}).error(function() {
			console.log("Colors of property "+propertyName+" do not exist.");
			networkObject.removeLoad();
		});
		
		this.removeLoad();
	}

	this.loadFromFile = function(networkFile){
		this.addLoad();
		var networkDir = networkFile.substring(0, networkFile.lastIndexOf("/"));
		
		this.properties = new Object();
		
		networkObject = this;
		$.getJSON(networkFile,function(properties){
			networkObject.addLoad();
			$.get(networkDir+"/names.dat",function(names){
				networkObject.removeLoad();
				networkObject.names = names.split("\n");
			}).error(function(){
				networkObject.removeLoad();
				throw ("Can not load names file.");
			});
			
			networkObject.addLoad();
			$.get(networkDir+"/positions.dat",function(positions){
				networkObject.removeLoad();
				networkObject.positions = new Float32Array(positions.split(new RegExp("\\s+")));
			}).error(function(){
				networkObject.removeLoad();
				throw ("Can not load positions file.");
			});
			
			console.log(networkDir+"/edges.dat");
			networkObject.addLoad();;
			$.get(networkDir+"/edges.dat",function(edges){
				networkObject.removeLoad();
				networkObject.edges = new Int32Array(edges.split(new RegExp("\\s+")));
			}).error(function(){
				networkObject.removeLoad();
				throw ("Can not load edges file.");
			});
			
			if("ORDER" in properties){
				var order = properties["ORDER"];
				for(var i=0;i<order.length;i++){
					var propertyKey = order[i];
					if(propertyKey in properties){
						networkObject.addLoad();
						networkObject.networkAddProperty(propertyKey,properties[propertyKey],networkDir);
					}
				}
			}else{
				for(propertyKey in properties){
					if(propertyKey in properties){
						networkObject.addLoad();
						networkObject.networkAddProperty(propertyKey,properties[propertyKey],networkDir);
					}
				}
			}
			networkObject.removeLoad();
		}).error(function(){
			networkObject.removeLoad();
			throw ("Can not load properties file.");
		});
	}
}
