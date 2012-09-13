/**
 * Singleton for Aplication
 *
 */

APP = {
	dragBox : false // is controlBox being dragged?
}


/**
 * Singleton for big MAP
 *
 */

MAP = {
  url : "https://www1.sedecatastro.gob.es/Cartografia/GeneraMapa.aspx?del=14&mapa=110,112&formato=png&XMin=587907&YMin=4841689&XMax=588577&YMax=4842160.5&AnchoPixels=1754&AltoPixels=1240&Transparente=N&layers=CATASTRO&huso=25829",
  pUrl : "https://www1.sedecatastro.gob.es/Cartografia/GeneraMapa.aspx?del=14&mapa=110,112&formato=png&XMin={XMin}&YMin={YMin}&XMax={XMax}&YMax={YMax}&AnchoPixels={AnchoPixels}&AltoPixels={AltoPixels}&Transparente=N&layers=CATASTRO&huso=25829",
  startData: {
    XMin : 587907,
    XMax : 588577,
    YMin : 4841689,
    YMax : 4842160.5,
    AnchoPixels:1754,
    AltoPixels:1240
  },
  dx: 669.5/10,
  dy : 471/10,
  sx : 1, // zoom (scale)
  sy : 1,

  cx : 4, // cell x,y
  cy : 4,
  cox: 4, // cell origin
  coy: 4,
  clx: 4, // save old value
  cly: 4,

  setMapPosition: function() {
    $('#cell'+this.cly+this.clx).css('background-color','transparent');
    $('#cell'+this.cy+this.cx).css('background-color','lightblue');
    MAP.clx = MAP.cx;
    MAP.cly = MAP.cy;
  }
}


miniMAP = $.extend({}, MAP,
         {
           startData: {
                XMin : 584000,
                XMax : 584000+(1754*5),
                YMin : 4839000,
                YMax : 4839000+(1240*5),
                AnchoPixels:280,
                AltoPixels:200
           }
         }
);


function t(s,d){
 for(var p in d)
   s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
 return s;
}

FRAME = {
  x:0,
  y:0,
  dx: 0,
  dy: 0,
  top:0,
  left:0,
  moving: false
}

$(document).ready( function () {
  var i,j,k;
  var h;

  var board = $("#board");

  for (k=0; k<9; k++) {
    board.append("<tr></tr>")
    for (i=0;i<9; i++) {
      h=board.children().children().last();
      h.html(h.html()+'<td id="cell'+k+i+'" class="square">&nbsp;</td>');
    }
  }

  MAP.setMapPosition.call(MAP);


  MAP.curData = $.extend({}, MAP.startData);
  var url = t(MAP.pUrl, MAP.curData);
  var image = $("#image");

  image.load( function() {
    $("#loading").css("visibility","hidden");
  })
  .error( function() {
    alert("Erro cargando. Inténtao de novo");
  });

  image.attr("src", url);
  $("#loading").css("visibility","visible");


  // miniMAP
  miniMAP.curData = $.extend({}, miniMAP.startData);
  url = t(MAP.pUrl, miniMAP.curData);
  board.css("background","url("+url+")");


  $("td").click( function() {
    var h = $(this).html().charCodeAt(0);
    console.log(h);
    switch(h) {
      case 8595:
        MAP.curData.YMin -= MAP.dy;
        MAP.curData.YMax -= MAP.dy;
        console.log(MAP.curData);
        url = t(MAP.pUrl, MAP.curData);
        image.attr("src", url);
        MAP.cy++;
        break;
      case 8593:
        MAP.curData.YMin += MAP.dy;
        MAP.curData.YMax += MAP.dy;
        console.log(MAP.curData);
        url = t(MAP.pUrl, MAP.curData);
        image.attr("src", url);
        MAP.cy--;
        break;
      case 8592:
        MAP.curData.XMin -= MAP.dx;
        MAP.curData.XMax -= MAP.dx;
        console.log(MAP.curData);
        url = t(MAP.pUrl, MAP.curData);
        image.attr("src", url);
        MAP.cx--;
        break;
      case 8594:
        MAP.curData.XMin += MAP.dx;
        MAP.curData.XMax += MAP.dx;
        console.log(MAP.curData);
        url = t(MAP.pUrl, MAP.curData);
        image.attr("src", url);
        MAP.cx++;
        break;
      case 43: // +
        MAP.dx *= 2;
        MAP.dy *= 2;
        MAP.curData.YMax = MAP.curData.YMin + MAP.dy;
        MAP.curData.XMax = MAP.curData.XMin + MAP.dx;
        url = t(MAP.pUrl, MAP.curData);
        image.attr("src", url);
        break;
      case 45: // -
        MAP.dx /= 2;
        MAP.dy /= 2;
        MAP.curData.YMax = MAP.curData.YMin + MAP.dy;
        MAP.curData.XMax = MAP.curData.XMin + MAP.dx;
        url = t(MAP.pUrl, MAP.curData);
        image.attr("src", url);
        break;
    }

    MAP.setMapPosition.call(MAP);


    if ($(this).hasClass("inception")) {
      MAP.curData = $.extend({}, MAP.startData);
      var url = t(MAP.pUrl, MAP.curData);
      image.attr("src", url);
      return;
    }


  });


  var box = $("#box");
  var boxControls = $("#boxControls");
  var dragInterval;

  TUPE = {
    status : "open"
  };

  $("#tupe").mousedown( function(e) {
    var top, left;
    APP.dragBox = true;

    top = Number(box.css("top").replace("px",""));
    left = Number(box.css("left").replace("px",""));
    FRAME.dy = e.pageY - top;
    FRAME.dx = e.pageX - left;
  })
  .mouseup( function() {
    APP.dragBox = false;
  });


  $("body").mousemove( function(e) {

		if(APP.dragBox){
			box.css("left", (e.pageX - FRAME.dx)+ 'px');
			box.css("top",  (e.pageY - FRAME.dy) + 'px');
		}	

  });


  $("#tupe > span").click(function() {

    if (TUPE.status == "open") {
      boxControls.css("display", "none");
      TUPE.status = "close";
    } else {
      boxControls.css("display", "block");
      TUPE.status = "open";
    }

  });

});
