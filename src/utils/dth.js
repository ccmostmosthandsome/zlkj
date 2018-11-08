 import Cesium from 'cesium/Cesium'
  //动态添加气泡窗口DIV
	/*
     * star
     * */

var _position, _pm_position, _cartesian, max_width = 300, max_height = 500, infoDiv,firstclick=0

var Entity

var selected = {
        feature: undefined,
        originalColor: new Cesium.Color()
    };

// function appendInfoDiv(){
//  //  infoDiv='<div id="trackPopUp" style="display:none;">'+
//  //                           '<div id="trackPopUpContent" class="leaflet-popup" style="top:5px;left:0;">'+
//  //                             '<a class="leaflet-popup-close-button" ></a>'+
//  //                             '<div class="leaflet-popup-content-wrapper">'+
//  //                               '<div id="trackPopUpLink" class="leaflet-popup-content" style="max-width: ' + max_width + 'px;max-height: ' + max_height + 'px">'+
//  //                               '<table class="table table-striped"></table>'+
//  //                               '</div>'+
//  //                             '</div>'+
//  //                             '<div class="leaflet-popup-tip-container">'+
//  //                               '<div class="leaflet-popup-tip"></div>'+
//  //                             '</div>'+
//  //                           '</div>'+
// 	// '</div>';
// 	var d = document.createDocumentFragment()
// 	var d1 = document.createElement('div')
// 	d1.style.display = 'none'
// 	d1.setAttribute("id", "d1")
// 	d1.style.width = 250
// 	var d2 = document.createElement('div')
// 	d2.className = 'popup-content'
// 	var h3 = document.createElement('h3')
// 	h3.className = 'popup-title'
// 	var table = document.createElement('table')

// 	d1.appendChild(h3)

// 	d1.appendChild(d2)

// 	d2.appendChild(table)

// 	d.appendChild(d1)
	
// 	document.getElementById('map3d').append(d)

//   // $("#map3d").append(infoDiv);
// }

export function postRender(viewer, color) {

	var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

	handler.setInputAction(function (CLICK) {
	    //http://blog.csdn.net/u013929284/article/details/52503295
	    var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(CLICK.position), viewer.scene); // 二维屏幕坐标系到三维坐标系的转换
	    var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian); // 三维坐标到地理坐标的转换
	    var picks = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian);
			var pick = viewer.scene.pick(CLICK.position);

	    _position = CLICK.position;
	    _cartesian = cartesian;
	    

	    // var lng = cartographic.longitude * 180 / Math.PI;
	    // var lat = cartographic.latitude * 180 / Math.PI;
	    // var hei = cartographic.height;
	    var flag, tableDom
	    // console.log(pick)
	    console.log(pick)
	    if (pick.id&&pick.id.name==='danti') {
	    	// console.log('有实体')
	    	_pm_position = { x: picks.x, y: picks.y }
	    	
	    	// console.log(pick.id)

	    	if (!firstclick) {
	    		// appendInfoDiv();

	    		// var d = document.createDocumentFragment()
					var d1 = document.createElement('div')
        	// d1.style.display = 'none'
        	d1.style.display = 'none'
					d1.style.position = 'absolute'
					d1.style.backgroundColor = 'rgba(0, 0, 0, .4)'
					d1.style.color = '#fff'
					d1.setAttribute("id", "d1")
					d1.style.width = 250 + 'px'
					var d2 = document.createElement('div')
					d2.className = 'popup-content'
					var h3 = document.createElement('h3')
					h3.className = 'popup-title'
					var table = document.createElement('table')
					table.setAttribute("id", "table")

					d1.appendChild(h3)

					d1.appendChild(d2)

					d2.appendChild(table)

					// d.appendChild(d1)

					document.getElementById('map3d').append(d1)

	    		firstclick=1
	    	}

	    	if (selected.feature) {

          // 有选择
	      	if(selected.feature==pick.id._id)
	      		return;
	      	else {
	            // 这里把之前更改透明度变0.01不太妥
	      		// viewer.entities.getById(selected.feature).polygon.material.color = Cesium.Color.fromCssColorString(color).withAlpha(0.01);
            viewer.entities.getById(selected.feature).polygon.material.color = Cesium.Color.fromAlpha(viewer.entities.getById(selected.feature).polygon.material.color._value, 0.01)

            if (viewer.entities.getById(pick.id._id).polygon) {

              selected.feature=pick.id._id;

              // viewer.entities.getById(selected.feature).polygon.material.color=Cesium.Color.fromCssColorString(color).withAlpha(.5);
              viewer.entities.getById(selected.feature).polygon.material.color = Cesium.Color.fromAlpha(viewer.entities.getById(selected.feature).polygon.material.color._value, 0.5)
            }
	      	}
	      } else {

          // viewer.entities.getById(pick.id._id).polygon
	      	if (pick.id&&pick.id.name==='danti') {

	      		selected.feature = pick.id._id;

	      		// viewer.entities.getById(selected.feature).polygon.material.color = Cesium.Color.fromCssColorString(color).withAlpha(.5);
	      		viewer.entities.getById(selected.feature).polygon.material.color = Cesium.Color.fromAlpha(viewer.entities.getById(selected.feature).polygon.material.color._value, 0.5)

	      	}
	      	// else {

	      	// 	viewer.entities.values.forEach((item) => {

	      	// 		if (item.polygon.hierarchy._value.positions) {

		      // 			item.polygon.material.color = Cesium.Color.fromAlpha(item.polygon.material.color, 0.01)
		      // 		}
	      			
	      	// 	})
	      	// }
	      	
	      }

	    	var value=pick.id;
	    	flag = false;//判断没有自定义属性就不弹出弹框

	    	if (value.properties.propertyNames.length!==0 || value.properties.custom) {

	    		flag = true;

	    		if (value.properties.custom) {

		      	document.getElementsByTagName('h3')[0].innerText = value.properties.custom

		      } 

		      if (value.properties.propertyNames.length!==0) {
		      	// var oDescription="<tr><td>属性名</td><td>属性值</td></tr>";
		      	var tbody = document.createElement('tbody')
		      	var oDescription = document.createElement('tr')
		      	var td1 = document.createElement('td')
		      	var td2 = document.createElement('td')
		      	td1.append('属性名')
		      	td2.append('属性值')
		      	
		      	oDescription.appendChild(td1)
		      	oDescription.appendChild(td2)
		      	tbody.appendChild(oDescription)
	          for(var i=0;i<value.properties.propertyNames.length; i++) {

	           	var propertie = value.properties.propertyNames[i];
	            var values = value.properties[propertie]._value;
	            // flag = true;
	            var tr = document.createElement('tr')
	            var td3 = document.createElement('td')
	            var td4 = document.createElement('td')

	            tr.appendChild(td3)
	            tr.appendChild(td4)
	            tbody.appendChild(tr)

	            td3.append(propertie)
	           
	            td4.append(values)

	            // oDescription +=
	            //     "<tr>" +
	            //     "<td>" + propertie + "</td>" +
	            //     "<td>" + values + "</td>" +
	            //     "</tr>";
	          }
          }
	      }


        if (flag) {

       	  // $("#trackPopUp .leaflet-popup-content table").html(oDescription);
          // $('#trackPopUp').show();
          // document.getElementsByTagName('table')[0].appendChild(tbody)
          if (value.properties.propertyNames.length!==0) {
          	
          	tableDom = document.getElementById("table")
          	tableDom.innerHTML = ''
          	tableDom.appendChild(tbody)
          } else {

          	document.getElementById("table").innerHTML = ''
          }
          
          // var d1 = document.getElementById("d1")

        	document.getElementById("d1").style.display = 'block'
        } else {
        	// 单体化实体切换的时候，有一个实体没有属性的情况
        	document.getElementById("d1").style.display = 'none'
        }
	    } else {
	    	// console.log('没实体')
	    	if (selected.feature) {

	    		// viewer.entities.getById(selected.feature).polygon.material.color = Cesium.Color.fromCssColorString(color).withAlpha(0.01);
	    		viewer.entities.getById(selected.feature).polygon.material.color = Cesium.Color.fromAlpha(viewer.entities.getById(selected.feature).polygon.material.color._value, 0.01)

	    		selected.feature=undefined;
	    	} else {

	    			viewer.entities.values.forEach((item) => {

	      			if (item.name==='danti') {

		      			// item.polygon.material.color= Cesium.Color.fromCssColorString(color).withAlpha(0.01)
		      			item.polygon.material.color = Cesium.Color.fromAlpha(item.polygon.material.color._value, 0.01)

		      		}
	      			
	      		})
	    	}

        // $('#trackPopUp').hide();
        // document.getElementById('trackPopUp').style.display = 'none'
        var d1 = document.getElementById("d1")

        if (d1) {

        	d1.style.display = 'none'
        }

        // console.log('这里没有单体化信息')
	    }

	}, Cesium.ScreenSpaceEventType.LEFT_CLICK)


	var _pm_position_2;
	viewer.scene.postRender.addEventListener(function () {

		if(_pm_position) {

	    // if (_pm_position != _pm_position_2) {
	    	
	        _pm_position_2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, _cartesian);
	        // var popw = document.getElementById("trackPopUpContent").offsetWidth;
	        // var poph = document.getElementById("trackPopUpContent").offsetHeight;

	        var dx = document.getElementById("d1");
	        var popw = dx.offsetWidth;
	        var poph = dx.offsetHeight;

	        // var trackPopUpContent_ = window.document.getElementById("trackPopUpContent");


	        // trackPopUpContent_.style.left = _pm_position_2.x-(popw/2)+'px';
	        // trackPopUpContent_.style.top = _pm_position_2.y-(poph-10)+'px';

	        dx.style.left = _pm_position_2.x-(popw/2)+'px';
	        dx.style.top = _pm_position_2.y-(poph+10)+'px';
	    // }

	  }
	})
}