'use strict';

// アイコンを押したときに出てくるポップアップの処理



// 保存された設定の読み込みは非同期のため、onload前に読んでおく
var videoSizeData = new VideoSizeData();
videoSizeData.setSaveNotification(noticeVideoSizeSave);
var screenShotData = new ScreenShotData();
screenShotData.setSaveNotification(noticeScreenShotSave);



$(document).ready(function () {
    // 設定を変更したときのイベントを登録
    setVideoSizeEvent();
    setScreenShotEvent();

    // 設定を画面上に反映
    refConfig();
});

function refConfig() {
    // 設定が読み込まれるまで待機
    if (videoSizeData.isLoaded() === false || screenShotData.isLoaded() === false) {
        setTimeout(function () { refConfig() }, 1000);
        return;
    }
    // 設定が読み込まれたら反映
    refVideoSizeConfig();
    refScreenShotConfig();
}

function refVideoSizeConfig() {

    if (videoSizeData.isLoaded() === false) return;


    $('input[name="videoSizeType"][value="' + videoSizeData.type + '"]').prop('checked', true);
    $('#videoSizeFixed').prop('value', videoSizeData.fixedSize);
    $('#videoSizeRatio').prop('value', videoSizeData.ratioSize);

    $('#videoSizePower').prop('disabled', false);
    $('#videoSizePower').prop('checked', videoSizeData.power);


    changeVideoSizePower();
}


function setVideoSizeEvent() {
    // on:offボタンを切り替えたときの処理
    $('#videoSizePower').change(function () {
        changeVideoSizePower();
    });

    // サイズタイプを切り替えたときの処理
    $('input[name="videoSizeType"]:radio').change(function () {
        changeVideoSizeType();
    });

    // 固定サイズを入力したときの処理
    $('#videoSizeFixed').change(function () {
        changeVideoSizeFixed();
    });

    // 割合サイズを入力したときの処理
    $('#videoSizeRatio').change(function () {
        changeVideoSizeRatio();
    });

}

// on:offボタンを切り替えたときの処理
function changeVideoSizePower() {
    var power = $('#videoSizePower').is(':checked');
    var boxRight = $('#videoSizeBox .customBoxRight');
    if (power) {
        boxRight.removeClass('disabled');
        boxRight.find('input').prop('disabled', false);
        changeVideoSizeType();
    }
    else {
        boxRight.addClass('disabled');
        boxRight.find('input').prop('disabled', true);
    }
    videoSizeData.power = power;
}

function changeVideoSizeType() {
    var value = $('input[name="videoSizeType"]:checked').prop('value');

    videoSizeData.type = value;
}

function changeVideoSizeFixed() {
    var sizeString = $('#videoSizeFixed').prop('value');
    var size = Number(sizeString);

    if (isNaN(size)) return;

    videoSizeData.fixedSize = size;
}

function changeVideoSizeRatio() {
    var sizeString = $('#videoSizeRatio').prop('value');
    var size = Number(sizeString);

    if (isNaN(size)) return;

    videoSizeData.ratioSize = size;
}



function refScreenShotConfig() {

    if (screenShotData.isLoaded() === false) return;

    $('#screenShotPower').prop('disabled', false);
    $('#screenShotPower').prop('checked', screenShotData.power);

    changeScreenShotPower();
}


function setScreenShotEvent() {
    // on:offボタンを切り替えたときの処理
    $('#screenShotPower').change(function () {
        changeScreenShotPower();
    });
}

// on:offボタンを切り替えたときの処理
function changeScreenShotPower() {
    var power = $('#screenShotPower').is(':checked');
    var boxRight = $('#screenShotBox .customBoxRight');
    if (power) {
        boxRight.removeClass('disabled');
        boxRight.find('input').prop('disabled', false);
    }
    else {
        boxRight.addClass('disabled');
        boxRight.find('input').prop('disabled', true);
    }
    screenShotData.power = power;
}


// 設定変更があったことをブラウザのタブに通知
function noticeVideoSizeSave() {
    noticeSave("videoSize", videoSizeData.getSaveData());
}

function noticeScreenShotSave() {
    noticeSave("screenShot", screenShotData.getSaveData());
}

function noticeSave(type, saveData) {
    // chrome.tabs.query => tabの配列をcallbackに渡してくる(N予備校のURLで絞る)
    // callback => tabの配列に設定が変更されたことを通知
    chrome.tabs.query({ url: ['*://www.nnn.ed.nico/lessons/*', '*://nnn.ed.nico/lessons/*'] }, function (tabs) {
        for (var tab of tabs) {
            chrome.tabs.sendMessage(tab.id, { type: type, saveData: saveData });
        }
    });

}
