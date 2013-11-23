var rango = {latitud:100,longitud:100};

function initialize(){
    document.addEventListener("deviceready",function(){
        crearTabla();
        obtenerRegistros();
        var lat = geoloc().lat;
        var lng = geoloc().lng;
        var latlng = new google.maps.LatLng(lat, lng);
        var mapOptions = {
            center: latlng,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title:"Hello World!"
        });
        locazador(lat,lng);
    },false);
}
function geoloc(){
    var obj = {lat:null,lng:null};
    navigator.geolocation.getCurrentPosition(function(p){
        obj.lat = p.coords.latitude;
        obj.lng = p.coords.longitude;
    },function(err){
        alert(err.code);
    });
    return obj;
}
function accesoDB(){
    var db = window.openDatabase("lugares","0.1","Lugares",200000);
    return db;
}
function obtenerRegistros(){
    $.ajax({
        type: "POST",
        url: "http://10.175.11.51/lugares.php",
        data: "obtenerLugares"
    }).done(function(msg){
        borrarRegistros();
        msg = JSON.parse(msg);
        for(i=0;i<msg.length;i++){
            gardarLugares(msg[i].latitud, msg[i].longitud);
        }
    });
}
function gardarLugares(lat, lng){
    accesoDB().transaction(function(tx){
        tx.executeSql('INSERT INTO lugares (latitud,longitud) VALUES ("'+lat+'","'+lng+'")');
    },function(err){
        alert(err.code);
    },function(){
       alert('guardado'); 
    });
}
function crearTabla(){
    accesoDB().transaction(function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS laguares(id unique, latitud,longitud)');
    },function(err){
        alert(err.code);
    },function(){
        var x = null;
    });
}
function borrarRegistros(){
    accesoDB().transaction(function(tx){
        tx.executeSql('DELETE FROM lugares');
    },function(err){
        alert(err.code);
    },function(){
        var x = null;
    });
}
function locazador(lat,lng){
    var marcadores = [];
    accesoDB().transaction(function(tx){
        tx.executeSql('SELECT * FROM lugares',[],function(tx2,res){
            for(i=0;i<res.rows.length;i++){
                var latitud = res.rows.item(i).latitud;
                var longitud = res.rows.item(i).longitud;
                if(latitud <= rango.latitud && latitud >= -rango.latitud && longitud <= rango.longitud && longitud >= -rango.longitud){
                    marcadores[i] = new google.maps.Marker({
                        position: new google.maps.Latlng(res.rows.item(i).latitud,res.rows.item(i).longitud),
                        map: map,
                        title: "Marcador "+i
                    });
                }
            }
        },function(err){
            alert(err.code);
        });
    },function(err){
        alert(err.code);
    },function(){
        alert("Localizado");
    });
}