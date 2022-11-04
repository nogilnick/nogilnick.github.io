function Reset() {
  Plotly.react(PLOTLY_DIV, PLOTLY_DATA, PLOTLY_LAYOUT, PLOTLY_CONFIG);
}

function GetURLArgs() {
    var args = {};
    var str  = window.location.search.replace("?", "")
                     .split(`&`).map((si) => { 
      var keyVal = si.split(`=`); 
      args[keyVal[0]] = keyVal[1];
    });
    return args
}

function Highlight() {
  var mtch = document.getElementById("inputText").value.toLowerCase();
  
  var FILT_DATA = [];
  var O = [];
  
  for (j = 0; j < PLOTLY_DATA.length; j += 1) {
     for (i = 0; i < PLOTLY_DATA[j].text.length; i += 1) {
           O.push((PLOTLY_DATA[j].text[i].toLowerCase().indexOf(mtch) !== -1) ? 0.8 : 0.1);
     }
     
     var dat    = {}
     dat        = Object.assign(dat, PLOTLY_DATA[j]);
     dat.marker = {};
     dat.marker = Object.assign(dat.marker, PLOTLY_DATA[j].marker);
     dat.marker.opacity = O;
     
     FILT_DATA.push(dat);
  }

  Plotly.react(PLOTLY_DIV, FILT_DATA, PLOTLY_LAYOUT, PLOTLY_CONFIG);
}

function Search() {
  var mtch = document.getElementById("inputText").value.toLowerCase();
  var i = 0;
  var T = [];
  var X = [];
  var Y = [];
  var C = [];
  var S = [];
  
  var FILT_DATA = [];
  
  for (j = 0; j < PLOTLY_DATA.length; j += 1) {
     for (i = 0; i < PLOTLY_DATA[j].text.length; i += 1) {
           if (PLOTLY_DATA[j].text[i].toLowerCase().indexOf(mtch) === -1) {
                 continue;
           }
           T.push(PLOTLY_DATA[j].text[i]);
           X.push(PLOTLY_DATA[j].x[i]);
           Y.push(PLOTLY_DATA[j].y[i]);
           C.push(PLOTLY_DATA[j].marker.color[i]);
           S.push(PLOTLY_DATA[j].marker.size[i])
     }
     
     var dat    = {}
     dat        = Object.assign(dat, PLOTLY_DATA[j]);
     dat.marker = {};
     dat.marker = Object.assign(dat.marker, PLOTLY_DATA[j].marker);
     
     dat.x = X;
     dat.y = Y;
     dat.marker.size = S;
     dat.marker.color = C;
     dat.text = T;
     
     FILT_DATA.push(dat);
  }

  Plotly.react(PLOTLY_DIV, FILT_DATA, PLOTLY_LAYOUT, PLOTLY_CONFIG);
}

function Init() {
    Plotly.newPlot(PLOTLY_DIV, PLOTLY_DATA, PLOTLY_LAYOUT, PLOTLY_CONFIG);

    // Setup onclick
    if (LINK_DATA !== undefined) {
        var ele = document.getElementById(PLOTLY_DIV);
        ele.on('plotly_click', function(data) {
            if (data.points.length === 1) {
                var link = LINK_DATA[data.points[0].pointNumber];
                if (LINK_PRE !== undefined) {
                    link = LINK_PRE + link;
                }
                window.open(link, "_blank");
          }
        });
    }
}
 
var PLOTLY_DATA   = null;
var PLOTLY_LAYOUT = null;
var LINK_DATA     = null;
var LINK_PRE      = null;

function LoadJSON() {
  var dataFile = GetURLArgs()["filename"];

  var xObj = new XMLHttpRequest();
  xObj.overrideMimeType("application/json");
  xObj.open('GET', "Data/" + dataFile + ".json", true);
  xObj.onreadystatechange = function () {
        if (xObj.readyState == 4 && xObj.status == "200") {
          var DAT = JSON.parse(xObj.responseText);
          PLOTLY_DATA    = DAT["data"];
          PLOTLY_LAYOUT  = DAT["layout"];
          LINK_DATA      = DAT["links"];
          LINK_PRE       = DAT["linkpre"];

          document.title = DAT["title"] || "Plot";

          Init();
        }
  };
  xObj.send(null);
}

var PLOTLY_DIV    = "graph";
var PLOTLY_CONFIG = {"responsive": true};

LoadJSON();
