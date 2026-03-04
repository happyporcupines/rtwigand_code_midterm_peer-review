// agrow midterm project
// map + hosted layers + filters + buttons for adding points and land polygons

require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",

  "esri/layers/FeatureLayer",
  "esri/Basemap",

  "esri/widgets/Search",
  "esri/widgets/Locate",
  "esri/widgets/Zoom",

  "esri/widgets/BasemapGallery",
  "esri/widgets/LayerList",
  "esri/widgets/Editor",
  "esri/widgets/Expand",

  // temp draw layer + sketch tool
  "esri/layers/GraphicsLayer",
  "esri/widgets/Sketch/SketchViewModel",
  "esri/Graphic",

  "esri/symbols/SimpleMarkerSymbol",
  "esri/renderers/SimpleRenderer"
], function (
  esriConfig,
  Map,
  MapView,

  FeatureLayer,
  Basemap,

  Search,
  Locate,
  Zoom,

  BasemapGallery,
  LayerList,
  Editor,
  Expand,

  GraphicsLayer,
  SketchViewModel,
  Graphic,

  SimpleMarkerSymbol,
  SimpleRenderer
) {

  // api key for arcgis js
  esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurEzkBozXZgPgjPozCzklawWD863C9mArHp4QeXfLaiy8L2BJTmm_eFlkRBmh-rS8f86DIaVxCZv1qDyzDjRyrQtKAoG97CplbDXiwWMA2bYqtEAxH9-MHlA3tDGSjUp93BMOHIaqXguOZxzW8cFVKszpoaoEbOPaECd9FiSLY6Rg-2FBhrb9bssxhS2Mh6EcsLusRR-qwO3qSJK5S8_0-lU3r-pdC0akyfo2hyekjELXAT1_Mj7DoXAA";

  // hosted layers
  var usersLandUrl =
    "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Users_Land/FeatureServer/0";

  var fieldDataUrl =
    "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/field_data/FeatureServer/0";

  // map start
  var map = new Map({
    basemap: "arcgis-imagery"
  });

  // land polygons layer
  var usersLandLayer = new FeatureLayer({
    url: usersLandUrl,
    title: "My Land",
    outFields: ["*"],
    popupTemplate: {
      title: "{land_name}",
      content: [{
        type: "fields",
        fieldInfos: [
          { fieldName: "land_owner", label: "Owner" },
          { fieldName: "crop_type", label: "Crop Type" },
          { fieldName: "acres", label: "Acres" }
        ]
      }]
    }
  });

  // point layer (made symbol brighter so it shows on imagery)
  var pointSym = new SimpleMarkerSymbol({
    style: "circle",
    size: 10,
    color: [0,170,255,1],
    outline: { color: [255,255,255,1], width: 1.5 }
  });

  var fieldDataLayer = new FeatureLayer({
    url: fieldDataUrl,
    title: "Field Data",
    outFields: ["*"],
    renderer: new SimpleRenderer({ symbol: pointSym }),
    popupTemplate: {
      title: "{title}",
      content: [{
        type: "fields",
        fieldInfos: [
          { fieldName: "obs_type", label: "Observation Type" },
          { fieldName: "status", label: "Status" },
          { fieldName: "severity", label: "Severity" },
          { fieldName: "crop_type", label: "Crop Type" },
          { fieldName: "obs_notes", label: "Notes" }
        ]
      }]
    }
  });

  map.addMany([usersLandLayer, fieldDataLayer]);

  // map view
  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-89.4,43.07],
    zoom: 10
  });

  // widgets (search top right)
  var searchWidget = new Search({ view:view });
  var locateWidget = new Locate({ view:view });
  var zoomWidget = new Zoom({ view:view });

  view.ui.add(searchWidget,"top-right");
  view.ui.add(locateWidget,{ position:"top-right", index:1 });
  view.ui.add(zoomWidget,{ position:"top-right", index:2 });

  // basemap + layers
  var basemapGallery = new BasemapGallery({ view:view });
  var layerList = new LayerList({ view:view });

  var basemapExpand = new Expand({
    view:view,
    content:basemapGallery
  });

  var layersExpand = new Expand({
    view:view,
    content:layerList
  });

  view.ui.add(basemapExpand,"top-left");
  view.ui.add(layersExpand,"top-left");

  // keep basemap options simple
  view.when(function(){
    Promise.all([
      Basemap.fromId("arcgis-imagery"),
      Basemap.fromId("arcgis-topographic")
    ]).then(function(basemaps){
      basemapGallery.source = basemaps;
    });
  });

  // editor only used for updating features
  view.when(function(){

    var editor = new Editor({
      view:view,
      allowedWorkflows:["update"],
      layerInfos:[
        { layer:usersLandLayer },
        { layer:fieldDataLayer }
      ]
    });

    var editorExpand = new Expand({
      view:view,
      content:editor
    });

    view.ui.add(editorExpand,"top-left");

  });

  // -------------------------
  // sidebar filters
  // -------------------------

  var obsFilter = document.getElementById("obsFilter");
  var statusFilter = document.getElementById("statusFilter");
  var severityFilter = document.getElementById("severityFilter");
  var cropFilter = document.getElementById("cropFilter");
  var searchBtn = document.getElementById("searchBtn");
  var clearBtn = document.getElementById("clearFilters");

  // values from AGOL domains
  var obsTypes = [
    "Vegetation Health",
    "Nutrients",
    "Disease",
    "Pest",
    "Soil Quality",
    "Irrigation",
    "Erosion",
    "Infrastructure",
    "Livestock",
    "General",
    "Other"
  ];

  var statuses = ["Open","In Progress","Monitoring","Closed"];

  var severityOptions = [
    { label:"Minimal", code:1 },
    { label:"Low", code:2 },
    { label:"Moderate", code:3 },
    { label:"High", code:4 },
    { label:"Critical", code:5 }
  ];

  var cropTypes = [
    "Corn",
    "Soybean",
    "Wheat",
    "Potatoes",
    "Alfalfa",
    "Specialty Crop",
    "Cover Crop",
    "Pasture",
    "Other"
  ];

  function addOptions(selectEl,values){
    values.forEach(function(v){
      var opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      selectEl.appendChild(opt);
    });
  }

  function addSeverityOptions(selectEl,values){
    values.forEach(function(v){
      var opt = document.createElement("option");
      opt.value = String(v.code);
      opt.textContent = v.label;
      selectEl.appendChild(opt);
    });
  }

  addOptions(obsFilter,obsTypes);
  addOptions(statusFilter,statuses);
  addSeverityOptions(severityFilter,severityOptions);
  addOptions(cropFilter,cropTypes);

  function safeText(txt){
    return txt.replace("'","''");
  }

  function applyFilters(){

    var parts = [];

    if(obsFilter.value) parts.push("obs_type = '"+safeText(obsFilter.value)+"'");
    if(statusFilter.value) parts.push("status = '"+safeText(statusFilter.value)+"'");
    if(severityFilter.value) parts.push("severity = "+severityFilter.value);
    if(cropFilter.value) parts.push("crop_type = '"+safeText(cropFilter.value)+"'");

    fieldDataLayer.definitionExpression = parts.length ? parts.join(" AND ") : "1=1";

  }

  searchBtn.addEventListener("click",applyFilters);

  clearBtn.addEventListener("click",function(){

    obsFilter.value="";
    statusFilter.value="";
    severityFilter.value="";
    cropFilter.value="";

    fieldDataLayer.definitionExpression="1=1";

  });

  // -------------------------
  // add buttons
  // -------------------------

  var addPointBtn = document.getElementById("addPointBtn");
  var addLandBtn = document.getElementById("addLandBtn");

  // temp drawing layer
  var drawLayer = new GraphicsLayer();
  map.add(drawLayer);

  var sketchVM = new SketchViewModel({
    view:view,
    layer:drawLayer
  });

  // form overlay elements
  var overlay = document.getElementById("formOverlay");
  var formTitle = document.getElementById("formTitle");
  var formBody = document.getElementById("formBody");
  var formSave = document.getElementById("formSave");
  var formCancel = document.getElementById("formCancel");

  var currentMode = null;
  var pendingGeometry = null;
  var pendingTempGraphic = null;

  function openForm(mode,geom,tempGraphic){

    currentMode = mode;
    pendingGeometry = geom;
    pendingTempGraphic = tempGraphic;

    formBody.innerHTML="";

    if(mode==="point"){

      formTitle.textContent="Add Field Data";

      formBody.appendChild(makeInput("Title","fd_title"));
      formBody.appendChild(makeInput("Observation Type","fd_obs"));
      formBody.appendChild(makeInput("Status","fd_status"));
      formBody.appendChild(makeInput("Severity","fd_sev"));
      formBody.appendChild(makeInput("Crop Type","fd_crop"));
      formBody.appendChild(makeTextarea("Notes","fd_notes"));

    }

    if(mode==="land"){

      formTitle.textContent="Add Land";

      formBody.appendChild(makeInput("Land Name","land_name"));
      formBody.appendChild(makeInput("Owner","land_owner"));
      formBody.appendChild(makeInput("Crop Type","land_crop"));
      formBody.appendChild(makeInput("Acres","land_acres","number"));

    }

    overlay.style.display="flex";

  }

  function closeForm(){

    overlay.style.display="none";

    if(pendingTempGraphic){
      drawLayer.remove(pendingTempGraphic);
    }

    currentMode=null;
    pendingGeometry=null;
    pendingTempGraphic=null;

  }

  function makeInput(label,id,type){

    var wrap = document.createElement("div");
    wrap.className="formRow";

    var l = document.createElement("label");
    l.textContent=label;

    var i = document.createElement("input");
    i.id=id;
    i.type=type||"text";

    wrap.appendChild(l);
    wrap.appendChild(i);

    return wrap;

  }

  function makeTextarea(label,id){

    var wrap = document.createElement("div");
    wrap.className="formRow";

    var l = document.createElement("label");
    l.textContent=label;

    var t = document.createElement("textarea");
    t.id=id;

    wrap.appendChild(l);
    wrap.appendChild(t);

    return wrap;

  }

  formCancel.addEventListener("click",function(){
    closeForm();
  });

  // save feature to AGOL
  formSave.addEventListener("click",function(){

    if(!currentMode || !pendingGeometry) return;

    if(currentMode==="point"){

      var g = new Graphic({
        geometry:pendingGeometry,
        attributes:{
          title:document.getElementById("fd_title").value,
          obs_type:document.getElementById("fd_obs").value,
          status:document.getElementById("fd_status").value,
          severity:document.getElementById("fd_sev").value,
          crop_type:document.getElementById("fd_crop").value,
          obs_notes:document.getElementById("fd_notes").value
        }
      });

      fieldDataLayer.applyEdits({ addFeatures:[g] })
        .then(function(){ closeForm(); });

    }

    if(currentMode==="land"){

      var g2 = new Graphic({
        geometry:pendingGeometry,
        attributes:{
          land_name:document.getElementById("land_name").value,
          land_owner:document.getElementById("land_owner").value,
          crop_type:document.getElementById("land_crop").value,
          acres:Number(document.getElementById("land_acres").value)
        }
      });

      usersLandLayer.applyEdits({ addFeatures:[g2] })
        .then(function(){ closeForm(); });

    }

  });

  // start drawing point
  addPointBtn.addEventListener("click",function(){

    drawLayer.removeAll();
    view.popup.close();
    sketchVM.cancel();

    sketchVM.create("point");

  });

  // start drawing polygon
  addLandBtn.addEventListener("click",function(){

    drawLayer.removeAll();
    view.popup.close();
    sketchVM.cancel();

    sketchVM.create("polygon");

  });

  // when sketch finishes
  sketchVM.on("create",function(evt){

    if(evt.state!=="complete") return;

    var tempGraphic = evt.graphic;
    var geom = tempGraphic.geometry;

    if(geom.type==="point"){
      openForm("point",geom,tempGraphic);
    }

    if(geom.type==="polygon"){
      openForm("land",geom,tempGraphic);
    }

  });

});