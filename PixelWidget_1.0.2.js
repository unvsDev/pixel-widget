// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: space-shuttle;
// Pixel Widget alpha 1.0.2 by Xkfdhrwhdk
// Inspired by Google Pixel's 'at a Glance' widget
// COVID-19 Plugin for Korea
// Auto Updater
// Synced Preferences & Custom Localization

// Widget 자체 설정 값
const bnumber = 1002; // DO NOT EDIT THIS AREA
const IGNORE_UPDATE = false; // NOT recommended
const UPDATE_TEST = false; // 업데이트 화면 테스트
// 자체 설정값 끝

// FileManager
var fm = FileManager.iCloud()
var w_path = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/scr_mode.txt";

if(!config.runsInWidget){ // Bulit-in PWL
  const updateServer = "https://pastebin.com/raw/SxUuh0bX"
  var latestVer = await new Request(updateServer).loadString()
  
  const codeServer = "https://pastebin.com/raw/QNPn042a"
  var latestCode = await new Request(codeServer).loadString()
  
  // Auto Light & Dark Wallpaper
  if(Device.isUsingDarkAppearance()) {
    fm.writeString(w_path, "dark")
  } else {
    fm.writeString(w_path, "light")
  }
  
  if(IGNORE_UPDATE) {
    let updateAlert = new Alert()
    updateAlert.title = "자동 업데이트가 중단됨"
    updateAlert.message = "최적의 사용자 경험을 위해 항상 최신 버전으로 업데이트하실 것을 권장합니다."
    updateAlert.addCancelAction("확인")
    updateAlert.addDestructiveAction("무시")
    let response = await updateAlert.presentAlert()
    if(response == -1) { return 0 }
  }
  
  let alert = new Alert()
  alert.title = "Pixel Widget Launcher"
  alert.message = "환영합니다. 메뉴를 선택해 주세요."
  let menuOptions = ["위젯 미리보기", "Pixel Widget 설치 (" + latestCode + ")", "Pixel Preference 설치", "전용 폰트 설치하기", "투명 위젯 만들기", "크레딧", "공식 디스코드"]
  for(const option of menuOptions) {
    alert.addAction(option)
  }
  alert.addCancelAction("완료")
  let response = await alert.presentSheet()
  if(response == 0){
    
  } else if(response == 1){
    var updateLink = await new Request("https://pastebin.com/raw/ntiKwgUJ").loadString()
    Safari.openInApp(updateLink, false)
    return 0
  } else if(response == 2) {
    var updateLink2 = await new Request("https://pastebin.com/raw/Lbj8T8ki").loadString()
    Safari.openInApp(updateLink2, false)
    return 0
  } else if(response == 3) {
    var fontLink = await new Request("https://pastebin.com/raw/rfHS7Xey").loadString()
    Safari.openInApp(fontLink, false)
    return 0
  } else if(response == 4) {
    var clearWidget = await new Request("https://pastebin.com/raw/Fw4L2vpR").loadString()
    Safari.openInApp(clearWidget, false)
    return 0
  } else if(response == 5) {
    let devAlert = new Alert()
    devAlert.title = "Credit"
    devAlert.message = "Made by xkfdhrwhdk (JaiIbreak)\n참여해주신 베타테스터 여러분 감사합니다!\n폰트 프로파일 by Max\n코로나 라이브 by munbbok"
    devAlert.addAction("확인")
    await devAlert.presentAlert()
    return 0
  } else if(response == 6) {
    let noticeDiscord = new Alert()
    noticeDiscord.title = "디스코드 참여 안내"
    noticeDiscord.message = "디스코드의 경우, 참여 가능 기간이 아니면 링크가 유효하지 않을 수도 있습니다."
    noticeDiscord.addAction("확인")
    await noticeDiscord.presentAlert()
    var discordLink = await new Request("https://pastebin.com/raw/axwUQepj").loadString()
    Safari.openInApp(discordLink, false)
    return 0
  } else if(response == -1) {
    return 0
  }
}

// main code
let pl = importModule('Pixel Preference')

let API_WEATHER = pl.apikey();
let CITY_WEATHER = pl.cityid();
let USERNAME = pl.username();
let TEMP_UNIT = pl.tempunit();

let THEME_COLOR = pl.themecolor();
const SPACING = pl.spacing();
const TEXT_SIZE = pl.textsize();
const WICON_SIZE = pl.wiconsize();

const PREVIEW_MODE = pl.preference(1);
const PREVIEW_SIZE = pl.preference(2);
const REFRESH_VIEW = pl.preference(3);
const LAYOUT_MODE = pl.preference(4);
const COVID_MODE = pl.preference(5);

const AUTO_WALL = pl.autowall();
var FONT_PACK = pl.fontpack();
const FONT_NAME = FONT_PACK[0];
const FONT_NAME_BOLD = FONT_PACK[1];
// 초기값 입력 부분 끝

// 위젯에 표시되는 요일 체계
var days = pl.custom(1);
var months = pl.custom(2);

// 날짜 계산
const today = new Date();

var weekday = days[ today.getDay() ];
var month = months[ today.getMonth() ];
var date = today.getDate();
var hour = today.getHours();
var minute = today.getMinutes();

// 날짜 포맷팅
let df_Name = new DateFormatter()
let df_Month = new DateFormatter()
df_Name.dateFormat = "EEEE"
df_Month.dateFormat = "MMMM"

function formatTime(date) { // 현지화 날짜 리턴
    let df = new DateFormatter()
    df.useNoDateStyle()
    df.useShortTimeStyle()
    return df.string(date)
}

const dayName = df_Name.string(today)
const dayNumber = today.getDate().toString()
const monthName = df_Month.string(today)

// 이벤트 처리
const events = await CalendarEvent.today([])
let futureEvents = []

// 날씨 아이콘 및 데이터 구성
//Get storage
var base_path = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/weather/";

// Fetch Image from Url
async function fetchimageurl(url) {
   const request = new Request(url)
   var res = await request.loadImage();
   return res;
}

// Load image from local drive
async function fetchimagelocal(path){
  var finalPath = base_path + path + ".png";
  if(fm.fileExists(finalPath)==true){
   console.log("file exists: " + finalPath);
   return finalPath;
  }else{
   //throw new Error("Error file not found: " + path);
   if(fm.fileExists(base_path)==false){
     console.log("Directry not exist creating one.");
     fm.createDirectory(base_path);
   }
   console.log("Downloading file: " + finalPath);
   await downloadimg(path);
   if(fm.fileExists(finalPath)==true){
     console.log("file exists after download: " + finalPath);
     return finalPath;
   }else{
     throw new Error("Error file not found: " + path);
   }
  }
}

async function downloadimg(path){
   const url = "http://a.animedlweb.ga/weather/weathers25_2.json";
   const data = await fetchWeatherData(url);
   var dataimg = null;
   var name = null;
   if(path.includes("bg")){
     dataimg = data.background;
     name = path.replace("_bg","");
   }else{
     dataimg = data.icon;
     name = path.replace("_ico","");
   }
   var imgurl=null;
   switch (name){
     case "01d":
      imgurl = dataimg._01d;
     break;
     case "01n":
      imgurl = dataimg._01n;
     break;
     case "02d":
      imgurl = dataimg._02d;
     break;
     case "02n":
      imgurl = dataimg._02n;
     break;
     case "03d":
      imgurl = dataimg._03d;
     break;
     case "03n":
      imgurl = dataimg._03n;
     break;
     case "04d":
      imgurl = dataimg._04d;
     break;
     case "04n":
      imgurl = dataimg._04n;
     break;
     case "09d":
      imgurl = dataimg._09d;
     break;
     case "09n":
      imgurl = dataimg._09n;
     break;
     case "10d":
      imgurl = dataimg._10d;
     break;
     case "10n":
      imgurl = dataimg._10n;
     break;
     case "11d":
      imgurl = dataimg._11d;
     break;
     case "11n":
      imgurl = dataimg._11n;
     break;
     case "13d":
      imgurl = dataimg._13d;
     break;
     case "13n":
      imgurl = dataimg._13n;
     break;
     case "50d":
      imgurl = dataimg._50d;
     break;
     case "50n":
      imgurl = dataimg._50n;
     break;
   }
   const image = await fetchimageurl(imgurl);
   console.log("Downloaded Image");
   fm.writeImage(base_path+path+".png",image);
}

//get Json weather
async function fetchWeatherData(url) {
  const request = new Request(url);
  const res = await request.loadJSON();
  return res;
}

let wetherurl = "http://api.openweathermap.org/data/2.5/weather?id=" + CITY_WEATHER + "&APPID=" + API_WEATHER + "&units=" + TEMP_UNIT;

const weatherJSON = await fetchWeatherData(wetherurl);
const cityName = weatherJSON.name;
const weatherarry = weatherJSON.weather;
const iconData = weatherarry[0].icon;
const weathername = weatherarry[0].main;
const curTempObj = weatherJSON.main;
const curTemp = curTempObj.temp;
const highTemp = curTempObj.temp_max;
const lowTemp = curTempObj.temp_min;
const feel_like = curTempObj.feels_like;

// 날씨 가져오기 끝


// Greetings arrays per time period. 
var greetingsMorning = pl.greeting(1);
var greetingsAfternoon = pl.greeting(2);
var greetingsEvening = pl.greeting(3);
var greetingsNight = pl.greeting(4);
var greetingsLateNight = pl.greeting(5);

// Holiday customization
var holidaysByKey = {
   // month,week,day: datetext
   "11,4,4": "Happy Thanksgiving!"
}

var holidaysByDate = {
   // month,date: greeting
   "1,1": "Happy " + (today.getFullYear()).toString() + "!",
   "10,31": "Happy Halloween!",
   "12,25": "Merry Christmas!"
}

var holidayKey = (today.getMonth() + 1).toString() + "," +  (Math.ceil(today.getDate() / 7)).toString() + "," + (today.getDay()).toString();

var holidayKeyDate = (today.getMonth() + 1).toString() + "," + (today.getDate()).toString();

var dateString = pl.dateformat();

// Support for multiple greetings per time period
function randomGreeting(greetingArray) {
   return Math.floor(Math.random() * greetingArray.length);
}

// Greeting Label procedure
var greeting = new String("Dokdo is Korea's Territory")
if (hour < 5 && hour >= 1) { // 1am - 5am
   greeting = greetingsLateNight[randomGreeting(greetingsLateNight)];
} else if (hour >= 23 || hour < 1) { // 11pm - 1am
   greeting = greetingsNight[randomGreeting(greetingsNight)];
} else if (hour < 12) { // Before noon (5am - 12pm)
   greeting = greetingsMorning[randomGreeting(greetingsMorning)];
} else if (hour >= 12 && hour <= 17) { // 12pm - 5pm
   greeting = greetingsAfternoon[randomGreeting(greetingsAfternoon)];
} else if (hour > 17 && hour < 23) { // 5pm - 11pm
   greeting = greetingsEvening[randomGreeting(greetingsEvening)];
} 

// Overwrite greeting if calculated holiday
if (holidaysByKey[holidayKey]) {
   greeting = holidaysByKey[holidayKey];
}

// Overwrite all greetings if specific holiday
if (holidaysByDate[holidayKeyDate]) {
   greeting = holidaysByDate[holidayKeyDate];
}


// 위젯 레이아웃
let pwidget = new ListWidget();

var now = new Date().getTime()

// Widget Auto-Update
if(!IGNORE_UPDATE) {
    // console.log('[*] Checking update : ' + latestVer)

    if(UPDATE_TEST || (bnumber < parseInt(latestVer))) { // Update process
        pwidget.addSpacer();
        let updateLabel = pwidget.addText("Update Available")
        updateLabel.font = new Font(FONT_NAME_BOLD, 26);
        updateLabel.textColor = THEME_COLOR
        updateLabel.centerAlignText()
        
        pwidget.backgroundColor = new Color("#5e77f9")
        
        pwidget.addSpacer();
        pwidget.setPadding(0, 0, 0, 0);
        
        Script.setWidget(pwidget)
        
        let updateNoti = new Notification()
        updateNoti.title = "Pixel Widget"
        updateNoti.body = "New update available! Download it on PWL."
        await updateNoti.schedule()
        return 1
        // Force End
    }
}

pwidget.addSpacer(SPACING); // Top Spacing

for (const event of events) {
    if (futureEvents.length == 1) { break } // Getting one event
    if (event.startDate.getTime() > today.getTime() && !event.isAllDay) {
        if (Math.floor((event.startDate.getTime() - now) / (1000 * 60) / 60) <= 6) {
            // If event is less than 6 hours ahead
            futureEvents.push(event)
        }
    }
}

var img = Image.fromFile(await fetchimagelocal(iconData + "_ico"));

if (futureEvents.length != 0) { // has event
    let futureEvent = futureEvents[0]
    
    var target = futureEvent.startDate.getTime()
    var distance = target - now
    var eventMinute = Math.floor(distance / (1000 * 60) % 60)
    var eventHour = Math.floor(distance / (1000 * 60) / 60)

    // Show ahead time; First Line
    let eventLabel = pwidget.addText(futureEvent.title + ' in ' + eventHour + ' hr ' + eventMinute + ' min')
    eventLabel.font = new Font(FONT_NAME_BOLD, TEXT_SIZE);
    eventLabel.textColor = THEME_COLOR
    eventLabel.url = "calshow://"
    eventLabel.centerAlignText()

    pwidget.addSpacer(8)

    // Second Line
    let hStack = pwidget.addStack()
    hStack.layoutHorizontally()
    hStack.addSpacer()
    
    // Calendar SFSymbol Icon
    let calSymbol = SFSymbol.named("calendar")
    let calElement = hStack.addImage(calSymbol.image)
    calElement.imageSize = new Size(18, 18)
    calElement.tintColor = Color.white()
    calElement.imageOpacity = 0.6

    // Event Duration
    let duration = hStack.addText(" " + formatTime(futureEvent.startDate) + " - " + formatTime(futureEvent.endDate) + "  |  ")
    duration.font = new Font(FONT_NAME, 16);
    duration.textColor = THEME_COLOR
    duration.textOpacity = (0.7)

    // Weather Icon
    let weatherIcon = hStack.addImage(img)
    weatherIcon.imageSize = new Size(18, 18)
    weatherIcon.centerAlignImage()

    // Tempeture Label
    let tempLabel = hStack.addText(" " + Math.round(curTemp).toString() + "°C")
    tempLabel.font = new Font(FONT_NAME, 16);
    tempLabel.textColor = THEME_COLOR
    tempLabel.textOpacity = (0.7)
    tempLabel.centerAlignText()

    tempLabel.url = "https://weather.naver.com/"
    weatherIcon.url = "https://weather.naver.com/"

    // Show Battery Icon and Percent
    //batteryModule(hStack)

    hStack.addSpacer()

} else if (LAYOUT_MODE == "pixel") { // pixel layout
    let hStack = pwidget.addStack()
    hStack.layoutHorizontally()
    hStack.addSpacer()

    let dateLabel = hStack.addText(dateString + " | "); //*
    dateLabel.font = new Font(FONT_NAME_BOLD, TEXT_SIZE);
    dateLabel.textColor = THEME_COLOR

    // Weather Icon
    let weatherIcon = hStack.addImage(img);
    weatherIcon.imageSize = new Size(WICON_SIZE, WICON_SIZE); // bigger icon
    weatherIcon.centerAlignImage()
    
    hStack.addSpacer(3)

    // Tempeture Label
    let tempLabel = hStack.addText(Math.round(curTemp).toString() + "°C")
    tempLabel.font = new Font(FONT_NAME, TEXT_SIZE);
    tempLabel.textColor = THEME_COLOR
    tempLabel.centerAlignText()

    tempLabel.url = "https://weather.naver.com/"
    weatherIcon.url = "https://weather.naver.com/"

    hStack.addSpacer()

    pwidget.addSpacer(8)

    // Second Line
    let hStack2 = pwidget.addStack()
    hStack2.layoutHorizontally()

    hStack2.addSpacer()
    batteryModule(hStack2)
    hStack2.addSpacer()

} else { // siri layout
    // Greeting label; First Line
    let greetingLabel = pwidget.addText(greeting)
    greetingLabel.font = new Font(FONT_NAME_BOLD, TEXT_SIZE);
    greetingLabel.textColor = THEME_COLOR
    greetingLabel.centerAlignText()

    pwidget.addSpacer(8)

    // Second Line
    let hStack = pwidget.addStack()
    hStack.layoutHorizontally()
    hStack.addSpacer()

    // Date Label
    let dateLabel = hStack.addText(dateString + "  |  ") //*
    dateLabel.font = new Font(FONT_NAME, 16);
    dateLabel.textColor = THEME_COLOR
    dateLabel.textOpacity = (0.7)
    
    // Weather Icon
    let weatherIcon = hStack.addImage(img)
    weatherIcon.imageSize = new Size(18, 18)
    weatherIcon.centerAlignImage()

    // Tempeture Label
    let tempLabel = hStack.addText(Math.round(curTemp).toString() + "°C  |  ")
    tempLabel.font = new Font(FONT_NAME, 16);
    tempLabel.textColor = THEME_COLOR
    tempLabel.textOpacity = (0.7)
    tempLabel.centerAlignText()

    tempLabel.url = "https://weather.naver.com/"
    weatherIcon.url = "https://weather.naver.com/"

    // Show Battery Icon and Percent
    batteryModule(hStack)

    hStack.addSpacer()

}

// Optional Module
function batteryModule(stack) {
    let batteryImg = stack.addImage(renderBatteryIcon(Device.batteryLevel(),Device.isCharging()));
    batteryImg.tintColor = new Color("#fff", 0.7);
    batteryImg.imageSize = new Size(25, 18);
    let batterytext = stack.addText(" " + renderBattery() + '%');
    batterytext.font = new Font(FONT_NAME, 16);
    batterytext.textColor = THEME_COLOR;
    batterytext.textOpacity = (0.7);
    batterytext.centerAlignText();
}

function renderBattery() { // Getting Battery Level (Number)
    const batteryData = Device.batteryLevel();
    const batteryLevel = Math.round(batteryData * 100);
    return batteryLevel;
}

function renderBatteryIcon( batteryLevel, charging = false ) { // Getting Battery Level (Icon)
    // If we're charging, show the charging icon.
    if (charging) { return SFSymbol.named("battery.100.bolt").image }

    // Set the size of the battery icon.
    const batteryWidth = 87
    const batteryHeight = 41

    // Start our draw context.
    let draw = new DrawContext()
    draw.opaque = false
    draw.respectScreenScale = true
    draw.size = new Size(batteryWidth, batteryHeight)

    // Draw the battery.
    draw.drawImageInRect(SFSymbol.named("battery.0").image, new Rect(0, 0, batteryWidth, batteryHeight))

    // Match the battery level values to the SFSymbol.
    const x = batteryWidth*0.1525
    const y = batteryHeight*0.247
    const width = batteryWidth*0.602
    const height = batteryHeight*0.505

    // Prevent unreadable icons.
    let level = batteryLevel
    if (level < 0.05) { level = 0.05 }

    // Determine the width and radius of the battery level.
    const current = width * level
    let radius = height/6.5

    // When it gets low, adjust the radius to match.
    if (current < (radius * 2)) { radius = current / 2 }

    // Make the path for the battery level.
    let barPath = new Path()
    barPath.addRoundedRect(new Rect(x, y, current, height), radius, radius)
    draw.addPath(barPath)
    draw.setFillColor(Color.black())
    draw.fillPath()
    return draw.getImage()
}

// Refresh Text
if(REFRESH_VIEW) {
  pwidget.addSpacer(3);
  let refreshText = pwidget.addText('Last Updated at ' + formatTime(today));
  refreshText.font = new Font(FONT_NAME, 13);
  refreshText.textColor = THEME_COLOR;
  refreshText.textOpacity = (0.5);
  refreshText.centerAlignText();
}

// COVID-19 Plugin KR
if(COVID_MODE) {
  // Source 1:Orig
  const source = 'http://ncov.mohw.go.kr'
  let webView = new WebView()
  await webView.loadURL(source)

  let covid = await webView.evaluateJavaScript(`
      const baseSelector = 'div.mainlive_container div.liveboard_layout '
      let date = document.querySelector(baseSelector + 'h2 span.livedate').innerText
      let domestic = document.querySelector(baseSelector + 'div.liveNum_today_new ul li:nth-child(1) span.data').innerText
      let overseas = document.querySelector(baseSelector + 'div.liveNum_today_new ul li:nth-child(2) span.data').innerText
      
      completion({date, count: {
          domestic, overseas
      }})
  `, true)

  let covid_count = parseInt(covid.count.domestic) + parseInt(covid.count.overseas)
  let covid_date = covid.date.replace(/\(|\)/g, '').split(',')[0]
/*
  // Source 2:HIDDEN CODE
  const source2 = 'http://corona-live.com'
  let webView2 = new WebView()
  await webView2.loadURL(source2)
  let covid_live = await webView2.evaluateJavaScript(`
    setTimeout(() => {
        let button = document.querySelector('#root-portal button')
        if (button) button.click()
        
        let date = document.querySelector('#__next > div:nth-child(1) > div:nth-child(4) > div:nth-child(1)').innerText
        let count = document.querySelector('#__next > div:nth-child(1) > div:nth-child(6) > div:nth-child(3) > div:nth-child(5) > strong').innerText.trim()
        
        completion({date, count})        
    }, 2000)
`, true)
  let covide_live_count = parseInt(covid_live.count.replace(/명/g, ''))
  let covide_live_date = covid_live.date
*/
// Layout
  pwidget.addSpacer(7)
  
  let cStack = pwidget.addStack()
  cStack.layoutHorizontally()
  cStack.addSpacer()
  
  let covidIcon = cStack.addImage(SFSymbol.named("info.circle.fill").image)
  covidIcon.tintColor = new Color("#ec7063")
  covidIcon.imageSize = new Size(12, 12);
  
  cStack.addSpacer(3)

  let covidText = cStack.addText('COVID-19 Alert : ' + covid_count.toString() + '명 / ' + covid_date.toString())
  covidText.font = new Font(FONT_NAME, 13)
  covidText.textColor = new Color("#ec7063");
  covidText.textOpacity = (1.0)
  covidText.url = 'https://corona-live.com'
  covidText.centerAlignText()
  
  cStack.addSpacer()

  pwidget.addSpacer(2)
/*
  // HIDDEN CODE for Corona Live
  // 의도된 기능이 작동하지 않을 수 있습니다.
  let cStackl = pwidget.addStack()
  cStackl.layoutHorizontally()
  cStackl.addSpacer()
  
  let covidIconl = cStackl.addImage(SFSymbol.named("info.circle.fill").image)
  covidIconl.tintColor = new Color("#ec7063")
  covidIconl.imageSize = new Size(12, 12);
  
  cStackl.addSpacer(3)

  let clText = cStackl.addText('COVID Live : ' + covide_live_count.toString() + '명 / ' + covide_live_date.toString())
  clText.font = new Font("Product Sans", 13)
  clText.textColor = new Color("#ec7063")
  clText.url = 'https://corona-live.com'
  clText.centerAlignText()
  
  cStackl.addSpacer()
  
  pwidget.addSpacer(2)
*/
  let cStack2 = pwidget.addStack()
  cStack2.layoutHorizontally()
  cStack2.addSpacer()
  
  let arrowIcon = cStack2.addImage(SFSymbol.named("arrowshape.turn.up.right.fill").image)
  arrowIcon.tintColor = new Color("#ec7063")
  arrowIcon.imageSize = new Size(12, 12);
  
  cStack2.addSpacer(3)

  let qrText = cStack2.addText('QR Check-In')
  qrText.font = new Font(FONT_NAME, 13)
  qrText.textColor = new Color("#ec7063")
  qrText.url = 'https://nid.naver.com/login/privacyQR'
  qrText.centerAlignText()

  cStack2.addSpacer()
}

// Bottom Spacer
pwidget.addSpacer();
pwidget.setPadding(0, 0, 0, 0);
 
// Background image
if (AUTO_WALL) {
  var themeMode = fm.readString(w_path)
  let bgimagePath = fm.bookmarkedPath(themeMode)
  pwidget.backgroundImage = fm.readImage(bgimagePath)
} else {
  let bgimagePath = fm.bookmarkedPath("still")
  pwidget.backgroundImage = fm.readImage(bgimagePath)
}
//단색 배경을 사용할 경우, 아래 코드의 주석을 해제하세요.
//pwidget.backgroundColor = new Color("#1f1f1f")

pwidget.refreshAfterDate = new Date(Date.now() + 1000 * 120) // Refresh every 120 Second
 
// Set widget
Script.setWidget(pwidget);

if (PREVIEW_MODE) {
  if (PREVIEW_SIZE == "small") { pwidget.presentSmall() }
  if (PREVIEW_SIZE == "medium") { pwidget.presentMedium() }
  if (PREVIEW_SIZE == "large") { pwidget.presentLarge() }
}

Script.complete()