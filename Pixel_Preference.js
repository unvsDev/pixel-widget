// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: file-code;
// Pixel Preference 1.0.3
// Made by xkfdhrwhdk

// 여기부터 초기값을 입력하세요
// 스크립트 이름을 반드시 "Pixel Preference"로 저장해야 본 코드에 적용됩니다.
let API_WEATHER = "0000000"; // Openweathermap API Key
let CITY_WEATHER = "0000000"; // Openweathermap City ID

let USERNAME = "Sir"; // 위젯 인사말에 보여질 이름
let TEMP_UNIT = "metric"; // metric(Celsius) or imperial(Fahrenheit)

let THEME_COLOR = new Color("#ffffff");
const SPACING = 45; // 상단 경계값
const TEXT_SIZE = 26; // 메인 택스트 사이즈
const WICON_SIZE = 27; // Pixel 스타일에서 날씨 아이콘 사이즈

const PREVIEW_MODE = true; // 미리보기 모드 (true, false)
const PREVIEW_SIZE = "medium"; // 미리보기 사이즈 (small, medium, large)

const REFRESH_VIEW = false; // 리프레시된 마지막 시각을 위젯 하단에 표시하는 옵션 (true, false)

const LAYOUT_MODE = "pixel"; // 위젯 디자인 (pixel, siri)

const COVID_MODE = true;
// 코로나19에 대한 정보를 위젯 하단에 표시합니다. (true, false) - for Korea only
// 확진자 수 라벨을 클릭하면 실시간 정보를 확인하실 수 있습니다.
// QR Check-In 라벨은 네이버 서비스로 연결되어 있습니다.

const AUTO_WALL = false;
// 자동으로 라이트 / 다크 모드에 따라 배경화면을 변경합니다. (true, false) - 변경사항 적용을 위해서는 스크립트 1회 실행이 필요함
// Scriptable 설정의 File Bookmark에서 light, dark 배경화면을 설정하거나, still 배경화면을 등록해 공통으로 적용할 수 있습니다.

const FONT_NAME = "Product Sans";
const FONT_NAME_BOLD = "Product Sans Medium";
// 적용할 폰트의 이름을 입력합니다.
// 기본 폰트는 PWL에서 설치하실 수 있습니다.

const COVID_SOURCE = "official";
// 코로나19 확진자 정보를 받아올 소스를 선택합니다.
// (official, live) 권장되는 값은 "official"입니다.
// 정보 제공처에 따라 데이터가 불안정할 수 있습니다.

// 초기값 입력 부분 끝

// Localization (기본값 세팅)
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']; // 요일
var months = ['January','February','March','April','May','June','July','August','September','October','November','December']; // 달

// 인사말
// List에 여러 개의 인사말을 넣으면 랜덤으로 하나가 보여집니다.
var greetingsMorning = [
'Good morning, ' + USERNAME
]; // 아침
var greetingsAfternoon = [
'Good afternoon, ' + USERNAME
]; // 점심
var greetingsEvening = [
'Good evening, ' + USERNAME
]; // 저녁
var greetingsNight = [
'Good night, ' + USERNAME
]; // 밤
var greetingsLateNight = [
'Time to sleep, ' + USERNAME
]; // 새벽

// Append ordinal suffix to date
function ordinalSuffix(input) {
  if (input % 10 == 1 && date != 11) {
    return input.toString() + "st";
  } else if (input % 10 == 2 && date != 12) {
    return input.toString() + "nd";
  } else if (input % 10 == 3 && date != 13) {
    return input.toString() + "rd";
  } else {
    return input.toString() + "th";
  }
  // return input.toString() + "일";
}

// 날짜 계산
const today = new Date();

var weekday = days[ today.getDay() ];
var month = months[ today.getMonth() ];
var date = today.getDate();
var hour = today.getHours();
var minute = today.getMinutes();

// 날짜 스트링을 커스텀합니다
// 사용 가능 변수 : weekday(요일), month(달), date(일), hour(시간), minute(분)
/*
Long 스타일 : weekday + ", " + month + " " + ordinalSuffix(date);
Short 스타일 : weekday + ", " + month.substr(0, 3) + " " + date;
*/
// Edit this space CAREFULLY
var dateString = weekday + ", " + month.substr(0, 3) + " " + date;

// Send information to main code (Do not edit)
module.exports.apikey = () => {
  return API_WEATHER
}

module.exports.cityid = () => {
  return CITY_WEATHER
}

module.exports.username = () => {
  return USERNAME
}

module.exports.tempunit = () => {
  return TEMP_UNIT
}

module.exports.themecolor = () => {
  return THEME_COLOR
}

module.exports.spacing = () => {
  return SPACING
}

module.exports.textsize = () => {
  return TEXT_SIZE
}

module.exports.wiconsize = () => {
  return WICON_SIZE
}

module.exports.preference = (n) => {
  switch(n) {
    case 1:
      return PREVIEW_MODE
      break
    case 2:
      return PREVIEW_SIZE
      break
    case 3:
      return REFRESH_VIEW
      break
    case 4:
      return LAYOUT_MODE
      break
    case 5:
      return COVID_MODE
      break
  }
}

module.exports.autowall = () => {
  return AUTO_WALL
}

module.exports.fontpack = () => {
  return [FONT_NAME, FONT_NAME_BOLD]
}

module.exports.covidsource = () => {
  return COVID_SOURCE
}

// Localization
module.exports.custom = (n) => {
  switch(n) {
    case 1:
      return days
      break
    case 2:
      return months
      break
    case 3:
      return REFRESH_VIEW
      break
  }
}

module.exports.greeting = (n) => {
  switch(n) {
    case 1:
      return greetingsMorning
      break
    case 2:
      return greetingsAfternoon
      break
    case 3:
      return greetingsEvening
      break
    case 4:
      return greetingsNight
      break
    case 5:
      return greetingsLateNight
      break
  }
}

module.exports.dateformat = () => {
  return dateString
}