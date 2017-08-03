$(function() {

    function renderAudio(file, name) {
        var reader = new FileReader();
        reader.onload = function(event)  {
            var nameTr0 = name.replace(/\s/g, '');
            var trName = "y" + nameTr0.substring(0,nameTr0.length - 4);
            let the_url = URL.createObjectURL(file);
            $("#list").append("<audio class=\"audioPlayer\" id=\"" + trName + "\" src=\"" + the_url +  "\"></audio>");
        }
        reader.readAsDataURL(file);
    }

    $('.load').click(function() {
       $('#input').click();
    });

    /* Setting playlist */

    let typeObj = {};

    $('input[type="file"]').change(function(e){
        let fileList = this.files;
        let length = fileList.length;
        for (let i = 0; i < length; i++) {
            let trackName = fileList[i].name;
            renderAudio(fileList[i], trackName);
            $("#fileList").append('<li>' + trackName + '</li>');
            typeObj[i] = {
                type : fileList[i].type,
                name : trackName,
                size : fileList[i].size
            };
        }
        if ($(".highlight").length == 0) {
           $("#fileList li").first().addClass("highlight");
        } 
        if ($("#name").is(':empty')) {
            let htm = $("#fileList li").first().html();
            $("#name").append(htm);
        }
        $("#fileList > li").click(function(evt) {
            if ($(".highlight")[0]){
                $(".highlight").removeClass("highlight");
            } 
            $(this).addClass("highlight");
            if (!$(".playing")[0]) {
                var html = $(this).html();
                $("#name").html(html);
            }
        })
    });

    /* Making buttons work */

    let durChangeRev = " ";

    $(".button").click(function(evt) {
        if ($("#fileList li")[0]) {
        let current = $(".highlight").html().replace(/\s/g, '');
        let current1 = "y" + current.substring(0,current.length - 4);
        let which = $("#" + current1);
        if ($(this).hasClass("play")) {
            clearInterval(durChangeRev);
            if ($(".playing")[0]) {
                if ($(".playing").hasClass("paused")) {
                    $(".playing").removeClass("paused");
                } else {
                    $(".playing").trigger("pause").prop("currentTime",0);
                }
            }
            if ($(".playing").hasClass("playing")) {
                $(".playing").removeClass("playing");
            }
            which.trigger("play");
            which.addClass("playing");
            let length = $("audio").length;
            let findItem;
            for (let i = 0; i < length; i++) {
                if ($("#list audio").eq(i).hasClass("playing")) { findItem = i; } 
            }
            let dur = $("audio")[findItem].duration;
            durChangeRev = setInterval(function() {
            let timePos = $("audio")[findItem].currentTime;
            $("#time").text((Math.floor(timePos / 60)) + ":" + (Math.floor(timePos % 60))); 
            }, 1000);
            var html = $(".highlight").html();
            $("#name").html(html);
            var typeObjLength = Object.keys(typeObj).length;
            for (let i = 0; i < typeObjLength; i++) {
                if (typeObj[i].name == $(".highlight").html()) {
                    $("#info").text("File type: " + typeObj[i].type.substring(6,40) + ", File size: " + typeObj[i].size);
                }
            } 
        } else if ($(this).hasClass("pause")) {
            clearInterval(durChangeRev);
            which.trigger("pause");
            which.addClass("paused");
        } else if ($(this).hasClass("stop")) {
            clearInterval(durChangeRev);
            which.trigger("pause");
            which.prop("currentTime",0);         
        } else if ($(this).hasClass("remove")) {
            which.remove();
            $(".highlight").remove();
        } else if ($(this).hasClass("leap")) {
            let list = $("#fileList li");
            let highlighted;
            for (let i = 0; i < list.length; i++) {
                if ($("#fileList li").eq(i).attr("class") == "highlight") {
                    highlighted = i;                    
                }

            }
            if ($(this).hasClass("previous") == true && highlighted != 0) {
                highlighted--;
                $(".highlight").removeClass("highlight");
                $("#fileList li").eq(highlighted).addClass("highlight");
            }
            if ($(this).hasClass("next") == true && highlighted < (list.length - 1)) {
                highlighted++;
                $(".highlight").removeClass("highlight");
                $("#fileList li").eq(highlighted).addClass("highlight");
            }
                $('.play').click();
        }
    } else {
        if ($(this).hasClass("load") == false) {
        alert("No files loaded!");
        }
    }
    });

    /* Volume slider */

    $('#vol').click(function(evt) {
        let width = Math.floor($("#slider").width());
        let ofset = $(this).offset();
        let relX = evt.pageX - ofset.left;
        let volume = "0." + (Math.floor((relX/500) * 100));
        let quantity = $(".audioPlayer").length;
        for (let i = 0; i < quantity; i++) {
            if ((relX/500) * 100 < 10) {
                volume = "0.0" + (Math.floor((relX/500) * 100));
            } 
            $(".audioPlayer")[i].volume = volume;
            $("#slider").width(volume * 500);
        }
    })
});






