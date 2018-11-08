import Cesium from 'cesium/Cesium'

function computeCircle(radius) {
	var positions = [];
	for (var i = 0; i < 360; i++) {
	    var radians = Cesium.Math.toRadians(i);
	    positions.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
	}
	return positions;
}

export function addHeightToposition(positions,h){
	var i;
	var position_=[];
	for(i=0;i<positions.length;i++){
		var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
		var currentClickLon = Cesium.Math.toDegrees(cartographic.longitude);//cartographic弧度，currentClickLon度
		var currentClickLat = Cesium.Math.toDegrees(cartographic.latitude);
		var currentClickHei = cartographic.height+h;
		position_.push(currentClickLon,currentClickLat,currentClickHei);
	}
	return Cesium.Cartesian3.fromDegreesArrayHeights(position_);
}
export function drawShape(positionData,mode,viewer,color,alpha) {
   	var shape;
   	if(mode=='polygon'){
//		var positions_addh=addHeightToposition(positionData,0.5);
		shape = viewer.entities.add({
		    polygon: {
		        hierarchy: positionData,//只能直接调用，不然无效
		        // material: Cesium.Color.CHARTREUSE.withAlpha(.5),
                material: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(color), alpha),
		        perPositionHeight:true,
		        disableDepthTestDistance : 1000//优先级
           }
		
		});
	}else if(mode=='polyline'){
		shape = viewer.entities.add({
		    polyline : {              
		    	show : true,
		    	positions : positionData,  
		    	material: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(color), alpha), 
		    	width : 5,
		    	disableDepthTestDistance : 100000//优先级
		    }
		
		});
	}else if(mode=='wall'){
		shape = viewer.entities.add({
	        wall : {
		        positions : positionData,
//		        minimumHeights : positionData[1],
		        material : Cesium.Color.RED
		    }
        });
	}else if(mode=='Vpolygon'){
		shape = viewer.entities.add({
			polygon: {
			    hierarchy:positionData,
			    heightReference: Cesium.HeightReference.NONE,
			    material: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(color), alpha),
			    perPositionHeight:true,
			    extrudedHeight:230,
			    disableDepthTestDistance : 1000//优先级
            }
		});
	}
	return shape;
}

export var DrawDynamicQinxie = (function () {
    var mouseHandlerDraw;
    function GetNorthCartesain(cartesain0, cartesain1) {
        var cartographic0 = Cesium.Cartographic.fromCartesian(cartesain0);
        var cartographic1 = Cesium.Cartographic.fromCartesian(cartesain1);
        var height = cartographic0.height > cartographic1.height ? cartographic0.height : cartographic1.height;
        var length = Math.sqrt((cartographic0.longitude - cartographic1.longitude) * (cartographic0.longitude - cartographic1.longitude)+
            (cartographic0.latitude - cartographic1.latitude) * (cartographic0.latitude - cartographic1.latitude));
        var cartographicN = new Cesium.Cartographic(cartographic0.longitude, cartographic0.latitude + length, height);
        var cartesainN = Cesium.Cartesian3.fromRadians(cartographicN.longitude, cartographicN.latitude, cartographicN.height);
        return cartesainN;
    }

    function _() { }
    //绘制点
    _.startDrawPoint = function (viewer, callback) {
        var scene = viewer.scene;
        if (mouseHandlerDraw) {
            mouseHandlerDraw.destroy();
            mouseHandlerDraw = null;
        } else {
            mouseHandlerDraw = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        }

        //TooltipDiv.initTool(viewer.cesiumWidget.container);

        mouseHandlerDraw.setInputAction(function (movement) {
            if (movement.position != null) {
                var cartesian = viewer.scene.pickPosition(movement.position);
                if (cartesian) {
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    if (cartographic) {
                        if (typeof callback == 'function') {
                            callback(cartesian);
                        }

                        if (mouseHandlerDraw) {
                            mouseHandlerDraw.destroy();
                            mouseHandlerDraw = null;
                        }
                        //TooltipDiv.setVisible(false);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        mouseHandlerDraw.setInputAction(function (movement) {
            var cartesian = viewer.scene.pickPosition(movement.endPosition);
            if (cartesian) {
                //TooltipDiv.showAt(movement.endPosition, '点击添加点');
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
    //绘制线段
    _.startDrawingLine = function (viewer, callback) {
        var scene = viewer.scene;
        if (mouseHandlerDraw) {
            mouseHandlerDraw.destroy();
            mouseHandlerDraw = null;
        } else {
            mouseHandlerDraw = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        }

        //TooltipDiv.initTool(viewer.cesiumWidget.container);

        var drawingPolyline = null;
        var positions = [];
        mouseHandlerDraw.setInputAction(function (movement) {
            if (movement.position != null) {
                var cartesian = viewer.scene.pickPosition(movement.position);
                
                if (cartesian) {
                    if (positions.length == 0) {
                        positions.push(cartesian.clone());
                    } else if (positions.length == 1) {
                        positions.push(cartesian.clone());
                        if (typeof callback == 'function') {
                            callback(positions);
                        }

                        if (mouseHandlerDraw) {
                            mouseHandlerDraw.destroy();
                            mouseHandlerDraw = null;
                        }
                        //TooltipDiv.setVisible(false);
                        //移除 
                        if (drawingPolyline != undefined)
                            viewer.entities.remove(drawingPolyline);

                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        mouseHandlerDraw.setInputAction(function (movement) {
            var cartesian = viewer.scene.pickPosition(movement.endPosition);
            if (cartesian) {
                if (positions.length == 0) {
                    //TooltipDiv.showAt(movement.endPosition, '点击添加起点');
                } else if (positions.length == 1) {
                    //更新entity
                    var positionArr = [];
                    positionArr.push(positions[0]);
                    positionArr.push(cartesian);
                    if (drawingPolyline != undefined)
                        viewer.entities.remove(drawingPolyline);
                    
                    if(drawingPolyline){
                    	drawingPolyline.polyline.positions=positionArr;
                    }else{
                    	var lineOpts = {
                        polyline: {
                            positions: positionArr,
                            clampToGround: true,  // 
                            width: 3,
                            material: Cesium.Color.BLUE.withAlpha(0.5),
                        }
                    	};
                    	drawingPolyline = viewer.entities.add(lineOpts);
                    }
                    
                    //TooltipDiv.showAt(movement.endPosition, "点击添加终点");
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    };
    //绘制多段线
    _.startDrawingPolyline = function (viewer, callback, color, alpha) {
        var scene = viewer.scene;
        if (mouseHandlerDraw) {
            mouseHandlerDraw.destroy();
            mouseHandlerDraw = null;
        } else {
            mouseHandlerDraw = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        }

        //TooltipDiv.initTool(viewer.cesiumWidget.container);
		
        var drawingPolyline = null;
        var polylines = new Cesium.PolylineCollection();
        var positions = [];
        mouseHandlerDraw.setInputAction(function (movement) {
            if (movement.position != null) {
                var cartesian = viewer.scene.pickPosition(movement.position);
                
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
				var currentClickLon = Cesium.Math.toDegrees(cartographic.longitude);//cartographic弧度，currentClickLon度
				var currentClickLat = Cesium.Math.toDegrees(cartographic.latitude);
 
                if (cartesian) {
                    positions.push(cartesian.clone());
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        mouseHandlerDraw.setInputAction(function (movement) {
            var cartesian = viewer.scene.pickPosition(movement.endPosition);
            if (cartesian) {
                if (positions.length == 0) {
                    //TooltipDiv.showAt(movement.endPosition, '点击添加起点');
                } else {
                    
                    if(drawingPolyline){
						positions.pop();
						positions.push(cartesian);
                    }else{
                    	positions.push(cartesian);
                    	var dynamicPositions = new Cesium.CallbackProperty(function () {
            			    return positions;
            			}, false);
            			drawingPolyline = drawShape(dynamicPositions,'polyline',viewer,color,alpha);
					}
                    
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        mouseHandlerDraw.setInputAction(function (movement) {
            if (movement.position != null) {
                var cartesian = viewer.scene.pickPosition(movement.position);
                if (cartesian) {
                    if (positions.length < 2) {
                        return;
                    } else {

                        if (typeof callback == 'function') {
                            callback(positions);
                        }
						
							
                        if (mouseHandlerDraw) {
                            mouseHandlerDraw.destroy();
                            mouseHandlerDraw = null;
                        }
                        //TooltipDiv.setVisible(false);
                        //移除entity
                        if (drawingPolyline != undefined)
                            viewer.entities.remove(drawingPolyline);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    };
    //绘制方位线
    _.startDrawingVLine = function (viewer, callback) {
        var scene = viewer.scene;
        if (mouseHandlerDraw) {
            mouseHandlerDraw.destroy();
            mouseHandlerDraw = null;
        } else {
            mouseHandlerDraw = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        }

        //TooltipDiv.initTool(viewer.cesiumWidget.container);

        var drawingPolylineN = null;
        var drawingPolylineT = null;
        var positions = [];
        mouseHandlerDraw.setInputAction(function (movement) {
            if (movement.position != null) {
                var cartesian = viewer.scene.pickPosition(movement.position);
                if (cartesian) {
                    if (positions.length == 0) {
                        positions.push(cartesian.clone());
                    } else if (positions.length == 1) {
                        positions.push(cartesian.clone());
                        if (typeof callback == 'function') {
                            callback(positions);
                        }

                        if (mouseHandlerDraw) {
                            mouseHandlerDraw.destroy();
                            mouseHandlerDraw = null;
                        }
                        //TooltipDiv.setVisible(false);
                        //移除 
                        if (drawingPolylineN != undefined)
                            viewer.entities.remove(drawingPolylineN);
                        if (drawingPolylineT != undefined)
                            viewer.entities.remove(drawingPolylineT);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        mouseHandlerDraw.setInputAction(function (movement) {
            var cartesian = viewer.scene.pickPosition(movement.endPosition);
            if (cartesian) {
                if (positions.length == 0) {
                    //TooltipDiv.showAt(movement.endPosition, '点击添加起点');
                } else if (positions.length == 1) {
                    //更新entity
                    var positionArr = [];
                    positionArr.push(positions[0]);
                    positionArr.push(cartesian);
                    //实时 
                    if (drawingPolylineT != undefined)
                        viewer.entities.remove(drawingPolylineT);
                    var lineOptsT = {
                        polyline: {
                            positions: positionArr,
                            clampToGround: true,  // 
                            width: 3,
                            material: Cesium.Color.BLUE.withAlpha(0.5),
                        }
                    };
                    drawingPolylineT = viewer.entities.add(lineOptsT);
                    //正北
                    var positionN = [];
                    positionN.push(positions[0]);
                    positionN.push(GetNorthCartesain(positions[0], cartesian));
                    if (drawingPolylineN != undefined)
                        viewer.entities.remove(drawingPolylineN);
                    var lineOptsN = {
                        polyline: {
                            positions: positionN,
                            clampToGround: true,  // 
                            width: 3,
                            material: Cesium.Color.RED.withAlpha(0.5),
                        }
                    };
                    drawingPolylineN = viewer.entities.add(lineOptsN);
                    //TooltipDiv.showAt(movement.endPosition, "点击结束");
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    }
    //绘制多边形
    _.startDrawingPolygon = function (viewer, callback, color, alpha) {
        var scene = viewer.scene;
        if (mouseHandlerDraw) {
            mouseHandlerDraw.destroy();
            mouseHandlerDraw = null;
        } else {
            mouseHandlerDraw = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        }

        //TooltipDiv.initTool(viewer.cesiumWidget.container);
		
        var drawingPolygon = null;
        var positions = [];
        mouseHandlerDraw.setInputAction(function (movement) {
            if (movement.position != null) {
                var cartesian = viewer.scene.pickPosition(movement.position);
                if (cartesian) {
                    positions.push(cartesian.clone());
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        

        mouseHandlerDraw.setInputAction(function (movement) {
            var cartesian = viewer.scene.pickPosition(movement.endPosition);
            if (cartesian) {
                if (positions.length <= 1) {
                    //TooltipDiv.showAt(movement.endPosition, '点击添加点');
                } else {
                    if(drawingPolygon){
						positions.pop();
						positions.push(cartesian);
                    }else{
                    	positions.push(cartesian);
                    	var dynamicPositions = new Cesium.CallbackProperty(function () {
            			    return addHeightToposition(positions,0.5);
            			}, false);
            			drawingPolygon = drawShape(dynamicPositions,'polygon',viewer,color,alpha);
					}
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        mouseHandlerDraw.setInputAction(function (movement) {
            if (movement.position != null) {
                var cartesian = viewer.scene.pickPosition(movement.position);
                if (cartesian) {
                    if (positions.length < 3) {
                        return;
                    } else {

                        if (typeof callback == 'function') {
                            callback(positions);
                        }

                        if (mouseHandlerDraw) {
                            mouseHandlerDraw.destroy();
                            mouseHandlerDraw = null;
                        }
                        //TooltipDiv.setVisible(false);
                        //移除entity
                        if (drawingPolygon != undefined)
                            viewer.entities.remove(drawingPolygon);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    };
    //绘制墙
    _.startDrawingWall = function (viewer, callback, color, alpha) {
        var scene = viewer.scene;
        if (mouseHandlerDraw) {
            mouseHandlerDraw.destroy();
            mouseHandlerDraw = null;
        } else {
            mouseHandlerDraw = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        }

        //TooltipDiv.initTool(viewer.cesiumWidget.container);

        var drawingWall = null;
        var positions = [];
        mouseHandlerDraw.setInputAction(function (movement) {
            if (movement.position != null) {
                var cartesian = viewer.scene.pickPosition(movement.position);
                if (cartesian) {
                    positions.push(cartesian.clone());
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        mouseHandlerDraw.setInputAction(function (movement) {
            var cartesian = viewer.scene.pickPosition(movement.endPosition);
            if (cartesian) {
                if (positions.length == 0) {
                    //TooltipDiv.showAt(movement.endPosition, '点击添加点');
                } else {
                	
                	if(drawingWall){
						positions.pop();
						positions.push(cartesian);
                    }else{
                    	positions.push(cartesian);
                    	var dynamicPositions = new Cesium.CallbackProperty(function () {
            			    var positionArr = [];
                    		for (var i = 0; i < positions.length; i++) {
		                    	var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
						        var currentClickLon = Cesium.Math.toDegrees(cartographic.longitude);//cartographic弧度，currentClickLon度
						        var currentClickLat = Cesium.Math.toDegrees(cartographic.latitude);
								var currentClickHei = cartographic.height+10;
						        positionArr.push(currentClickLon,currentClickLat,currentClickHei);
	                    	}
                    		positionArr=Cesium.Cartesian3.fromDegreesArrayHeights(positionArr);
						    return positionArr;
            			}, false);
            			drawingWall = drawShape(dynamicPositions,'wall',viewer,color,alpha);
					}
                	
                    //TooltipDiv.showAt(movement.endPosition, "双击结束");
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        mouseHandlerDraw.setInputAction(function (movement) {
            if (movement.position != null) {
                var cartesian = viewer.scene.pickPosition(movement.position);
                if (cartesian) {
                    if (positions.length < 3) {
                        return;
                    } else {

                        if (typeof callback == 'function') {
                            callback(positions);
                        }

                        if (mouseHandlerDraw) {
                            mouseHandlerDraw.destroy();
                            mouseHandlerDraw = null;
                        }
                        //TooltipDiv.setVisible(false);
                        //移除entity
                        if (drawingWall != undefined)
                            viewer.entities.remove(drawingWall);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    };
    //绘制立体多边形
    _.startDrawingVolumePolygon = function (viewer, callback, color, alpha) {
        var scene = viewer.scene;
        if (mouseHandlerDraw) {
            mouseHandlerDraw.destroy();
            mouseHandlerDraw = null;
        } else {
            mouseHandlerDraw = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        }
        //TooltipDiv.initTool(viewer.cesiumWidget.container);

        var drawingVolumePolygon = null;
        var positions = [];
        mouseHandlerDraw.setInputAction(function (movement) {
            if (movement.position != null) {
                var cartesian = viewer.scene.pickPosition(movement.position);
                if (cartesian) {
                    positions.push(cartesian.clone());
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        mouseHandlerDraw.setInputAction(function (movement) {
            var cartesian = viewer.scene.pickPosition(movement.endPosition);
            if (cartesian) {
                if (positions.length <= 1) {
                    //TooltipDiv.showAt(movement.endPosition, '点击添加点');
                } else {
                    if(drawingVolumePolygon){
						positions.pop();
						positions.push(cartesian);
                    }else{
                    	positions.push(cartesian);
                    	var dynamicPositions = new Cesium.CallbackProperty(function () {
            			    return positions;
            			}, false);
            			drawingVolumePolygon = drawShape(dynamicPositions,'Vpolygon',viewer,color,alpha);
					}
                    //TooltipDiv.showAt(movement.endPosition, "双击结束");
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        mouseHandlerDraw.setInputAction(function (movement) {
            if (movement.position != null) {
                var cartesian = viewer.scene.pickPosition(movement.position);
                if (cartesian) {
                    if (positions.length < 3) {
                        return;
                    } else {

                        if (typeof callback == 'function') {
                            callback(positions);
                        }

                        if (mouseHandlerDraw) {
                            mouseHandlerDraw.destroy();
                            mouseHandlerDraw = null;
                        }
                        //TooltipDiv.setVisible(false);
                        //移除entity
                        if (drawingVolumePolygon != undefined)
                            viewer.entities.remove(drawingVolumePolygon);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    };
    return _;
})();


