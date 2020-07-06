//=========Store our API endpoint inside queryUrl=================
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5
   
});

//======Map layer setup=========================================
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);
 
//===========Set circles for map=====================
d3.json(queryUrl, function(data){
  data.features.forEach(d => {
    L.circleMarker([d.geometry.coordinates[1], d.geometry.coordinates[0]],{
        color: 'black',
        weight: 0.5,
        fillOpacity: 0.7,
        radius: d.properties.mag * 3,  // magnitude relfect by radius size
        fillColor: circleColor(d.properties.mag)
    }).bindPopup("<h3>" + d.properties.place + "</h3><hr><p>"+ "Magnitude: " + d.properties.mag + "<br> Date: "+ new Date(d.properties.time) + "</p>").addTo(myMap);
  console.log(data.features);
});
});


//=============Magnitude color scale function=============
function circleColor(magnitude) {
  if(magnitude > 5 ){
    return '#DC143C'; // red
    }
  if(magnitude > 4 ){
     return '#FF6347'; //reddish orange
    }   
  if(magnitude > 3 ){
     return '#FF8C00'; //dark orange
  }
  if(magnitude > 2 ){
    return '#F0E68C'; //light orange
  }
  if(magnitude > 1 ){
  return '#FFFF00'; //yellow
  }
  else {
  return '#ADFF2F'; //green
  }
 
}

//******https://leafletjs.com/examples/choropleth/********* */
//============Add Color Scale Legend to Map==========
var legend = L.control({position: 'bottomright'});
legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
        scale = [0, 1, 2, 3, 4, 5];

    //====loop through our density intervals and generate a label with a colored circle for each interval=====
    //******https://stackoverflow.com/questions/48579194/leaflet-legend-how-to-set-styles-css-in-div-from-typescript-code/48580604*****
    for (var i = 0; i < scale.length; i++) {
        div.innerHTML +=
            '<i style="background:' + circleColor(scale[i] + 1) + '"></i> ' +
            scale[i] + (scale[i + 1] ? '&ndash;' + scale[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap);


