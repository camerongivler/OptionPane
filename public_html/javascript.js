/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var socket = io.connect('http://localhost:7501'), camNum = 0,
        sliders = false, mult = false, nums = new Array(), cams;

$(function() {
    $('#options').hide();
    $('h3').hide();
    $('#prev').hide();
    $('#next').hide();
    $('#back').hide();
    $('#white').hide();
    $('#back').on('tap', function() {
        sliders = false;
        nums = [];
        $('#black').hide();
        $('#black').css({'z-index': 999, width: '100%', height: '100%'}).fadeIn(function() {
            $('h2').show();
            $('h3').show();
            $('h1').show();
            $('#back').fadeOut();
            $('#prev').fadeOut();
            $('#next').hide();
            $('#preview').hide();
            $('#options').hide();
            refresh();
            makeDivs();
            makeContainer();
            makeMult();
            $('#black').fadeOut();
        });
    });
    socket.on('cameras', function(obj) {
        cams = obj;
        makeDivs();
        makeContainer();
        makeOptions();
        $('#black').fadeOut(200);
    });
    socket.on('loadPreview', function() {
        $('#preview').attr('src', 'image.jpg');
        $('#preview').fadeIn();
        $('#black').css({'z-index': 80, opacity: 1});
        $('#preview').animate({opacity: 1}).css({'z-index': 82});
        $('#options').fadeIn(1000);
        $('.no').fadeOut(function() {
            $('.no').remove();
        });
        if (mult) {
            $('#prev').click(function() {
                camNum--;
                if (camNum < 0)
                    camNum = nums.length - 1;
                socket.emit('changeCam', {num: nums[camNum]});
            }).fadeIn(1000);
            $('#next').click(function() {
                camNum++;
                if (camNum >= nums.length)
                    camNum = 0;
                socket.emit('changeCam', {num: nums[camNum]});
            }).fadeIn(1000);
        }
    });
});

$(window).resize(function() {
    if (!sliders)
        makeContainer();
    else {
        windowSetup();
    }
});

function makeDivs() {
    $('body').prepend('<div id="container"></div>');
    for (var k = 226; k > 99; k--) {
        if (cams[k])
            $('#container').append('<div class="nums U1000 yes show" id="n' + k + '">' + k + '</div>');
        else
            $('#container').append('<div class="nums U1000 yes hide" id="n' + k + '">' + k + '</div>');
    }
    for (var k = 99; k > 9; k--) {
        if (cams[k])
            $('#container').append('<div class="nums U100 yes show" id="n' + k + '">' + k + '</div>');
        else
            $('#container').append('<div class="nums U100 yes hide" id="n' + k + '">' + k + '</div>');

    }
    for (var k = 9; k > 0; k--) {
        if (cams[k])
            $('#container').append('<div class="nums U10 yes show" id="n' + k + '">' + k + '</div>');
        else
            $('#container').append('<div class="nums U10 yes hide" id="n' + k + '">' + k + '</div>');

    }
    $('.show').on('tap', function() {
        nums[nums.length] = parseInt($(this).attr('id').replace(/\D/, ''));
        if (mult) {
            $(this).css({'background-color': 'rgb(255, 47, 0)', 'z-index': 1000, color: '#e5f2fd'});
        } else {
            goToOptions($(this));
        }
    });
    $('h3').on('tap', function() {
        if (nums.length > 0)
            goToOptions($('#n' + nums[camNum]));
    });
    $('h2').hover(function() {
        $('h2').css('color', 'rgb(255, 47, 0)');
    }, function() {
        $('h2').css('color', 'rgba(255, 47, 0, 0.2)');
    });
    $('#take').on('tap', function() {
        socket.emit('take');
        $('#white').fadeIn(100, function() {
            $(this).fadeOut(100);
        });
    });
    makeMult();
}

function goToOptions(cam) {
    sliders = true;
    cam.attr('class', 'nums no');
    cam.text('');
    $('#black').fadeIn(600, function() {
        $('.yes').remove();
        $('h2').hide();
        $('h3').hide();
        $('#black').hide();
        $('#back').fadeIn();
        $('h1').hide();
        $('#black').css({height: '430px', opacity: 0});
        $('#container').animate({top: 0, left: 0, height: '100%', width: '100%', 'margin-top': 0, 'margin-left': 0}, 1000);
        windowSetup();
        var temp = {top: '20px', left: '50%', width: '400px', height: '400px', 'padding-left': 0, 'padding-top': 0, 'margin-left': '-200px', 'margin-top': '0px'};
        if ($(window).width() > 999) {
            temp = {top: '50%', left: '20px', width: '400px', height: '400px', 'padding-left': 0, 'padding-top': 0, 'margin-left': '0px', 'margin-top': '-200px'};
        }
        $('.no').animate(temp, {duration: 1000, complete: function() {
                $(this).remove();
                socket.emit('cameraNumbers', {nums: nums});
                $('#container').remove();
            }
        });
    });
}

function makeMult() {
    mult = false;
    $('h2').off();
    $('h2').hover(function() {
        $('h2').css('color', 'rgb(255, 47, 0)');
    }, function() {
        $('h2').css('color', 'rgba(255, 47, 0, 0.2)');
    });
    $('h2').css('color', 'rgba(255, 47, 0, 0.2)');
    $('h3').hide();
    $('h2').on('tap', function() {
        mult = true;
        $(this).off();
        $(this).hover(function() {
            $(this).css('color', 'rgb(255, 47, 0)');
        }, function() {
            $(this).css('color', 'white');
        });
        $(this).css('color', 'white');
        $('h3').fadeIn(300, false);
        $('h2').on('tap', function() {
            mult = false;
            $(this).off();
            $(this).hover(function() {
                $(this).css('color', 'rgb(255, 47, 0)');
            }, function() {
                $(this).css('color', 'rgba(255, 47, 0, 0.2)');
            });
            $(this).css('color', 'rgba(255, 47, 0, 0.2)');
            $('h3').fadeOut(300, false);
            makeMult();
        });
    });
}

function makeContainer() {
    var wHeight = $(window).height() - 56;
    var wWidth = $(window).width();
    if (wWidth / wHeight > 1.12109375) {
        var ratio = wHeight / 1024;
        $('#container').height(wHeight);
        $('#container').css({width: wHeight * 1.12109375, left: '50%', top: '50%'});
        $('.nums').css({'font-size': wHeight / 34});
    } else {
        var ratio = wWidth / 1148;
        $('#container').width(wWidth);
        $('#container').css({height: wWidth / 1.12109375, left: '50%', top: '50%'});
        $('.nums').css({'font-size': wWidth / 38.1171875});
    }
    $('#container').css({'margin-left': -$('#container').width() / 2 + 'px'});
    $('#container').css({'margin-top': -$('#container').height() / 2 + 40 + 'px'});
    $('.nums').css({height: ratio * 58 + 'px', 'padding-top': ratio * 22 + 'px', 'margin-top': -ratio * 22 + 'px'});
    $('.U10').css({width: ratio * 50 + 'px', 'padding-left': ratio * 30 + 'px', 'margin-left': -ratio * 30 + 'px'});
    $('.U100').css({width: ratio * 58 + 'px', 'padding-left': ratio * 22 + 'px', 'margin-left': -ratio * 22 + 'px'});
    $('.U1000').css({'width': ratio * 65 + 'px', 'padding-left': ratio * 15 + 'px', 'margin-left': -ratio * 15 + 'px'});
}

function makeOptions() {
    $("#focus").on('change', function() {
        if ($(this).data('old') === $(this).val())
            return;
        $(this).data('old', $(this).val());
        var temp = {};
        temp[nums[camNum]] = {set: {focus: $('#aFocus').val() === 'On' ? -1 : $('#focus').val()}};
        socket.emit('request', temp);
    });
    $("#aFocus").on('slidestop', function() {
        if ($(this).data('old') === $(this).val())
            return;
        $(this).data('old', $(this).val());
        var temp = {};
        temp[nums[camNum]] = {set: {focus: $('#aFocus').val() === 'On' ? -1 : $('#focus').val()}};
        socket.emit('request', temp);
    });
    $("#exposure").on('change', function() {
        if ($(this).data('old') === $(this).val())
            return;
        $(this).data('old', $(this).val());
        var temp = {};
        temp[nums[camNum]] = {set: {exposure: $('#aExposure').val() === 'On' ? -1 : $('#exposure').val()}};
        socket.emit('request', temp);
    });
    $("#aExposure").on('slidestop', function() {
        if ($(this).data('old') === $(this).val())
            return;
        $(this).data('old', $(this).val());
        var temp = {};
        temp[nums[camNum]] = {set: {exposure: $('#aExposure').val() === 'On' ? -1 : $('#exposure').val()}};
        socket.emit('request', temp);
    });
    $("#red").on('change', function() {
        if ($(this).data('old') === $(this).val())
            return;
        $(this).data('old', $(this).val());
        var temp = {};
        temp[nums[camNum]] = {set: {red: $('#aRed').val() === 'On' ? -1 : $('#red').val()}};
        socket.emit('request', temp);
    });
    $("#green").on('change', function() {
        if ($(this).data('old') === $(this).val())
            return;
        $(this).data('old', $(this).val());
        var temp = {};
        temp[nums[camNum]] = {set: {green: $('#aGreen').val() === 'On' ? -1 : $('#green').val()}};
        socket.emit('request', temp);
    });
    $("#blue").on('change', function() {
        if ($(this).data('old') === $(this).val())
            return;
        $(this).data('old', $(this).val());
        var temp = {};
        temp[nums[camNum]] = {set: {blue: $('#aBlue').val() === 'On' ? -1 : $('#blue').val()}};
        socket.emit('request', temp);
    });
    $("#aRed").on('slidestop', function() {
        if ($(this).data('old') === $(this).val())
            return;
        $(this).data('old', $(this).val());
        var temp = {};
        temp[nums[camNum]] = {set: {red: $('#aRed').val() === 'On' ? -1 : $('#red').val()}};
        socket.emit('request', temp);
    });
    $("#aGreen").on('slidestop', function() {
        if ($(this).data('old') === $(this).val())
            return;
        $(this).data('old', $(this).val());
        var temp = {};
        temp[nums[camNum]] = {set: {green: $('#aGreen').val() === 'On' ? -1 : $('#green').val()}};
        socket.emit('request', temp);
    });
    $("#aBlue").on('slidestop', function() {
        if ($(this).data('old') === $(this).val())
            return;
        $(this).data('old', $(this).val());
        var temp = {};
        temp[nums[camNum]] = {set: {blue: $('#aBlue').val() === 'On' ? -1 : $('#blue').val()}};
        socket.emit('request', temp);
    });
    $("#iso").on('change', function() {
        if ($(this).data('old') === $(this).val())
            return;
        $(this).data('old', $(this).val());
        var temp = {};
        temp[nums[camNum]] = {set: {iso: $(this).val()}};
        socket.emit('request', temp);
    });
    $("#stream").on('slidestop', function() {
        if ($(this).data('old') === $(this).val())
            return;
        $(this).data('old', $(this).val());
        var temp = {};
        temp[nums[camNum]] = {set: {stream: $(this).val() === 'On' ? 1 : -1}};
        socket.emit('request', temp);
    });
    $('#reset').on('tap', function() {
        socket.emit('request', {reset: 1});
    });
    $('#unlock').on('tap', function() {
        socket.emit('request', {unlock: 1});
    });
}

function windowSetup() {
    if ($(window).width() < 1000) {
        $('#black').show();
        $('#prev').css({left: '50%', top: '150px', 'margin-left': '-275px', 'margin-top': 0});
        $('#next').css({top: '150px', left: '50%', 'margin-left': '225px', 'margin-top': 0});
        if ($(window).height() < 904) {
            $('#black').css({'box-shadow': '0px -20px 50px #AEBDCC'});
            $('#options').css('position', 'absolute');
        } else {
            $('#black').css({'box-shadow': '0 0 0'});

        }
        var temp1 = {top: '20px', left: '50%', 'margin-left': '-199px', 'margin-top': '-1px'};
        var temp2 = {top: '440px', left: '3%', width: '94%'};
    } else {
        $('#black').hide();
        $('#options').css('position', 'absolute');
        $('#prev').css({left: '200px', top: '50%', 'margin-left': 0, 'margin-top': '-300px'});
        $('#next').css({top: '50%', left: '200px', 'margin-left': 0, 'margin-top': '175px'});
        var opTop = ($(window).height() - 474) / 2 > 20 ? ($(window).height() - 474) / 2 : 20;
        temp1 = {top: '50%', left: '20px', 'margin-left': 0, 'margin-top': '-199px'};
        temp2 = {top: opTop + 'px', left: '440px', width: $(window).width() - 460 + 'px'};
    }
    $('#preview').css(temp1);
    $('#options').css(temp2);
    $('#sliders .ui-block-a').css('width', $('#options').width() - 84 + "px");
}

function refresh() {
    $('#focus').val(50).slider('refresh');
    $('#aFocus').val('Off').slider('refresh');
    $('#exposure').val(50).slider('refresh');
    $('#aExposure').val('Off').slider('refresh');
    $('#red').val(50).slider('refresh');
    $('#aRed').val('Off').slider('refresh');
    $('#green').val(50).slider('refresh');
    $('#aGreen').val('Off').slider('refresh');
    $('#blue').val(50).slider('refresh');
    $('#aBlue').val('Off').slider('refresh');
    $('#iso').val(50).slider('refresh');
    $('#stream').val('Off').slider('refresh');
}