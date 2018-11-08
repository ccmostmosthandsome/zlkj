var tempPoints = [];
var tempEntities = [];
var tempPinEntities = [];
var tempPinLon, tempPinLat;
var tempLinesLong=0;

var handler = null;

function clearEffects() {
    if (handler != null) {
        handler.destroy();
    }
}

//设置各种操作模式
function SetMode(mode) {
						tempPoints = [];
            tempLinesLong=0;
            clearEffects();
    if (mode == "drawPloy")
    {
        tempPoints = [];
        handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        handler.setInputAction(function (click) {
            var cartesian=viewer.scene.pickPosition(click.position);//用于测坐标
            if (cartesian) {
                tempPoints.push(cartesian);
                var tempLength = tempPoints.length;
                drawPoint(tempPoints[tempPoints.length-1]);
                if (tempLength > 1) {
                    drawLine(tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1], false);
                }
            } 
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function (click) {
            var cartesian=viewer.scene.pickPosition(click.position);//用于测坐标
            if (cartesian) {
                var tempLength = tempPoints.length;
                if (tempLength < 3) {
                    alert('请选择3个以上的点再执行闭合操作命令');
                } else {
                    drawLine(tempPoints[0], tempPoints[tempPoints.length - 1], false);
                    drawPoly(tempPoints);
                    // highLightAssetsInArea(tempPoints);
                    
                
                    var   ent =
                    viewer.entities.add({
                        position: CalPolygonMid(tempPoints),
                        label: {
                            text: SphericalPolygonAreaMeters(tempPoints).toFixed(1) + '㎡',
                            font: '22px Helvetica',
                            fillColor: Cesium.Color.BLACK,
                            horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                            pixelOffset : new Cesium.Cartesian2(0.0, -10.0),
                            disableDepthTestDistance : 1000,//优先级
                            scaleByDistance : new Cesium.NearFarScalar(1.0e2, 1, 1.0e3, 0.1),
                            translucencyByDistance : new Cesium.NearFarScalar(1.0e2, 1, 1.0e3, 0)
                        }
                    });
        				    tempEntities.push(ent);
                    tempPoints = [];
                    clearEffects();
                }

            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
    
   
    else if ("drawLine" == mode)
    {
        tempPoints = [];
        handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        handler.setInputAction(function (click) {
            var cartesian=viewer.scene.pickPosition(click.position);//用于测坐标
            if (cartesian) {
                console.log(cartesian)
                tempPoints.push(cartesian);
                var tempLength = tempPoints.length;
                drawPoint(tempPoints[tempPoints.length - 1]);
                if (tempLength > 1) {
                    drawLine(tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1], true);
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction(function (click) {
        	
        		viewer.entities.add({
                position: tempPoints[tempPoints.length-1],
                label: {
                    text: '总长：'+tempLinesLong.toFixed(1) + 'm',
                    font: '22px Helvetica',
                    fillColor: Cesium.Color.ORANGE,
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
										pixelOffset: new Cesium.Cartesian2(1.0, -10.0),
										disableDepthTestDistance : 1000,
										translucencyByDistance : new Cesium.NearFarScalar(1.0e2, 1, 1.5e3, 0)
                }
            });
            tempPoints = [];
            tempLinesLong=0;
            clearEffects();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
}

function drawPoint(point) {
    var entity = 
    viewer.entities.add({
        position: point,
        clampToGround : true,
        attachPolygon:true,
        point: {
            pixelSize: 6,
            color: Cesium.Color.CHARTREUSE,
            translucencyByDistance : new Cesium.NearFarScalar(1.0e2, 1, 1.5e3, 0),
            disableDepthTestDistance : 1000000000//优先级
        }
    });
    tempEntities.push(entity);
}

function drawLine(point1, point2, showDistance) {
    var entity =
    viewer.entities.add({
        polyline: {
            positions: [point1, point2],
            width: 10.0,
            material: new Cesium.PolylineGlowMaterialProperty({
                color: Cesium.Color.DARKBLUE.withAlpha(.5),
                RimLighting: Cesium.Color.BLACK.withAlpha(.4),
            }),
            disableDepthTestDistance : 100000//优先级
        }
    });
    tempEntities.push(entity);
    if (showDistance) {
        var distance = getFlatternDistance(point1,point2);
        tempLinesLong+=distance;
        entity =
            viewer.entities.add({
                position: {x:(point1.x+point2.x)/2,y:(point1.y+point2.y)/2,z:(point1.z+point2.z)/2},
                label: {
                    text: distance.toFixed(1) + 'm',
                    font: '22px Helvetica',
                    fillColor: Cesium.Color.ORANGE,
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
										pixelOffset: new Cesium.Cartesian2(0.0, -10.0),
										disableDepthTestDistance : 1000,//优先级
										translucencyByDistance : new Cesium.NearFarScalar(1.0e2, 1, 1.5e3, 0)
                }
            });
        tempEntities.push(entity);
    }
}

function drawPoly(points) {
    var entity =
    viewer.entities.add({
        polygon: {
            hierarchy: new Cesium.PolygonHierarchy(points),
            material: Cesium.Color.CHARTREUSE.withAlpha(.5),
            perPositionHeight:true,
            disableDepthTestDistance : 1000//优先级
        }
    });
    
    var s=CalPolygonArea(entity);
    console.log(s);
    tempEntities.push(entity);
}

//计算两点间距离
function getFlatternDistance(p1,p2) {
//  		console.log(Cesium.Cartesian3.distance(new Cesium.Cartesian3(p1.x,p1.y,p1.z),new Cesium.Cartesian3(p2.x,p2.y,p2.z)))
    return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y)+(p1.z-p2.z)*(p1.z-p2.z))
}

//计算多边形面积
function SphericalPolygonAreaMeters(points){
		var N=Triangle3DsetVector(points[0],points[1],points[2]);
		points.push(points[0]);
		points.push(points[1]);
		var S=area3D_Polygon(points,N);
		return S;
}
function area3D_Polygon(V,N){
	var area = 0;
	var n=V.length-2;
	var an, ax, ay, az; // abs value of normal and its coords
	var coord; // coord to ignore: 1=x, 2=y, 3=z
	var i, j, k; // loop indices
	// select largest abs coordinate to ignore for projection
	ax = (N.x > 0 ? N.x : -N.x); // abs x-coord
	ay = (N.y > 0 ? N.y : -N.y); // abs y-coord
	az = (N.z > 0 ? N.z : -N.z); // abs z-coord
	coord = 3; // ignore z-coord
	if(ax > ay) {
		if(ax > az) coord = 1; // ignore x-coord
	} else if(ay > az) coord = 2; // ignore y-coord
	// compute area of the 2D projection
	for(i = 1, j = 2, k = 0; i <= n; i++, j++, k++)
		switch(coord) {
			case 1:
				area += (V[i].y * (V[j].z - V[k].z));
				continue;
			case 2:
				area += (V[i].x * (V[j].z - V[k].z));
				continue;
			case 3:
				area += (V[i].x * (V[j].y - V[k].y));
				continue;
		}
	// scale to get area before projection
	an = Math.sqrt(ax * ax + ay * ay + az * az); // length of normal vector
	switch(coord) {
		case 1:
			area *= (an / (2 * ax));
			break;
		case 2:
			area *= (an / (2 * ay));
			break;
		case 3:
			area *= (an / (2 * az));
	}
	return Math.abs(area);
}


//空间三角形单位法向量计算
function Triangle3DsetVector(A,B,C){
	var d=A.y*B.z+B.y*C.z+C.y*A.z-A.y*C.z-B.y*A.z-C.y*B.z;
	var f=A.x*B.z+B.x*C.z+C.x*A.z-C.x*B.z-B.x*A.z-A.x*C.z;
	var g=A.x*B.y+B.x*C.y+C.x*A.y-A.x*C.y-B.x*A.y-C.x*B.y;
	var h=-(A.x*B.y*C.z+B.x*C.y*C.x+C.x*A.y*B.z-A.x*C.y*B.z-B.x*A.y*C.z-C.x*B.y*A.z);
	var e=Math.sqrt(d*d+f*f+g*g);
	var j=d/e;
	var k=f/e;
	var l=g/e;
	
	return {x:j,y:k,z:l};
}
//计算多边形中点
function CalPolygonMid(points){
	var c=0,k=0,g=0;
	for(var i=0;i<points.length;i++){
		c+=points[i].x;
		k+=points[i].y;
		g+=points[i].z;
	}
	return {x:c/points.length,y:k/points.length,z:g/points.length};
}

/**
 * 清除地图痕迹
 */
function clearDrawingBoard() {
// <!-- viewer.entities.removeAll(); -->
    var primitives = viewer.entities;
        for (i = 0; i <  tempEntities.length; i++) {
            primitives.remove(tempEntities[i]);
    }
    tempEntities=[];
    clearEffects();
}


function CalPolygonArea(theEntity){
	var polygon = theEntity.polygon;
	var hierarchy = polygon.hierarchy._value;
	
	// "indices" here defines an array, elements of which defines the indice of a vector
	// defining one corner of a triangle. Add up the areas of those triangles to get
	// an approximate area for the polygon
	var indices = Cesium.PolygonPipeline.triangulate(hierarchy.positions, hierarchy.holes);
	var area = 0; // In square kilometers
	
	for (var i = 0; i < indices.length; i += 3) {
	  var vector1 = hierarchy.positions[indices[i]];
	  var vector2 = hierarchy.positions[indices[i+1]];
	  var vector3 = hierarchy.positions[indices[i+2]];
	
	  // These vectors define the sides of a parallelogram (double the size of the triangle)
	  var vectorC = Cesium.Cartesian3.subtract(vector2, vector1, new Cesium.Cartesian3());
	  var vectorD = Cesium.Cartesian3.subtract(vector3, vector1, new Cesium.Cartesian3());
	
	  // Area of parallelogram is the cross product of the vectors defining its sides
	  var areaVector = Cesium.Cartesian3.cross(vectorC, vectorD, new Cesium.Cartesian3());
	  
	  // Area of the triangle is just half the area of the parallelogram, add it to the sum.
	  area += Cesium.Cartesian3.magnitude(areaVector)/2.0;
	}
	return area;
}