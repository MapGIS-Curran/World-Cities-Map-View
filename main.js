require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/tasks/support/Query",
  "esri/widgets/Legend",
  "esri/widgets/ScaleBar",
  "esri/widgets/BasemapToggle",
  "esri/widgets/LayerList"
], function(
  Map,
  MapView,
  FeatureLayer,
  Query,
  Legend,
  ScaleBar,
  BasemapToggle,
  LayerList
) {

  var defaultCity = {
    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
    outline: {
      // autocasts as new SimpleLineSymbol()
      color: "#71de6e",
      width: 1
    }
  };

  var defaultContinent = {
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    outline: {
      // autocasts as new SimpleLineSymbol()
      color: "#78f81f",
      width: "0.25px"
    }
  };

  var colorVisVar = {
    type: "color",
    field: "POP",
    legendOptions: { title: "Population Per City By Color Ramp" },
    stops: [
      { value: 50000, color: "#f7fcfd" },
      { value: 100000, color: "#ccece6" },
      { value: 500000, color: "#66c2a4" },
      { value: 1000000, color: "#238b45" },
      { value: 5000000, color: "#006d2c" },
      { value: 10000001, color: "#00441b" }
    ]
  };

  var sizeVisVar = {
    type: "size",
    field: "POP",
    legendOptions: { title: "Population Per City By Point Size" },
    stops: [
      { value: 50000, size: 3, label: "< 50,000" },
      { value: 100000, size: 6, label: "50,000 - 100,000" },
      { value: 500000, size: 9, label: "250,000 - 500,000" },
      { value: 1000000, size: 12, label: "500,000 - 1,000,000" },
      { value: 5000000, size: 15, label: "1,000,000 - 5,000,000" },
      { value: 10000001, size: 20, label: "> 10,000,000" }
    ]
  };

  var cityRenderer = {
    type: "simple", // autocasts as new SimpleRenderer()
    // Define a default marker symbol with a small outline
    symbol: defaultCity,
    // Set the color and size visual variables on the renderer
    visualVariables: [colorVisVar, sizeVisVar]
  };

  var continentRenderer = {
    type: "simple", // autocasts as new SimpleRenderer()
    symbol: defaultContinent
  };

  var cityTemplate = {
    title: "World Cities: {CITY_NAME}",
    content: "The population of {CITY_NAME} is {POP}.<br />",
    fieldInfos: [
      {
        fieldName: "POP",
        format: {
          digitSeparator: true,
          places: 0
        }
      },
      {
        fieldName: "CITY_NAME",
        format: {
          places: 0
        }
      }
    ]
  };

  var cities = new FeatureLayer({
    url:
      "http://sampleserver6.arcgisonline.com/arcgis/rest/services/SampleWorldCities/MapServer/0",
    visible: true,
    popupTemplate: cityTemplate
  });

  var continents = new FeatureLayer({
    url:
      "http://sampleserver6.arcgisonline.com/arcgis/rest/services/SampleWorldCities/MapServer/1",
    visible: true,
    renderer: continentRenderer,
    popupTemplate: {
      // autocasts as new PopupTemplate()
      title: "Continents of the World",
      content: "{CONTINENT} has a total of {SQMI} square miles.",
      fieldInfos: [
        {
          fieldName: "CONTINENT",
          format: {
            digitSeparator: true,
            places: 0
          }
        },
        {
          fieldName: "SQMI",
          format: {
            digitSeparator: true,
            places: 0
          }
        }
      ]
    }
  });

  var map = new Map({
    basemap: "dark-gray"
  });

  var view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 4,
    center: [20, 45]
  });

  map.addMany([continents, cities]);

  // Add a legend instance to the panel of a
  // ListItem in a LayerList instance
  const layerList = new LayerList({
    view: view,
    listItemCreatedFunction: function(event) {
      const item = event.item;
      if (item.layer.type != "group") {
        // don't show legend twice
        item.panel = {
          content: "legend",
          open: true
        };
      }
    }
  });
  view.ui.add(layerList, "top-right");

  var toggle = new BasemapToggle({
    view: view,
    nextBasemap: "satellite"
  });

  view.ui.add(toggle, "bottom-right");

  // The scale bar displays both metric and non-metric units.
  var scaleBar = new ScaleBar({
    view: view,
    unit: "dual"
  });

  // Add the scale bar widget to the bottom left corner of the view
  view.ui.add(scaleBar, {
    position: "bottom-left"
  });
});