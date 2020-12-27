// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: space-shuttle;
// Pixel Widget 2.0.3 - by unvsDev
// with italoboy (Development) & mvan231 (Beta Tester)
// iOS Scriptable Widget
// inspired by Google Pixel's "at a Glance"

// Unauthorized Redistribute is Strictly prohibited.
// Contact developer for question, or reporting abuse
// You can use Discord to contact @unvsDev!

// System variables
const bnumber = 2003; // We recommend you DO NOT EDIT this area.
const UPDATE_TEST = false; // Forcing auto update
const IGNORE_UPDATE = false; // Temporarily ignore update alert (Not recommended)

// FileManager
var fm = FileManager.iCloud()
var filePath = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/";
var prefPath = fm.joinPath(filePath, "pixelPref.txt")

fm.writeString(fm.joinPath(filePath, "pixelVer.txt"), JSON.stringify({"version":bnumber,"ignore":IGNORE_UPDATE,"license":"normal"}))

// Getting Preference
let prefData0
if(fm.fileExists(prefPath)){
  fm.downloadFileFromiCloud(prefPath)
  prefData0 = fm.readString(prefPath)
} else {
  let setupAlert = new Alert()
  setupAlert.title = "Widget Verified"
  setupAlert.message = "Set up your widget first!\nNow Launch Pixel Launcher!"
  setupAlert.addAction("OK")
  await setupAlert.presentAlert()
  return 0
}
let prefData = JSON.parse(prefData0)

let API_WEATHER = prefData.apikey;
let CITY_WEATHER = prefData.cityid;
let USERNAME = prefData.username;
let TEMP_UNIT = prefData.tempunit;
const LAYOUT_MODE = prefData.layout;

const TEMP_TEXT = (TEMP_UNIT == 'metric')? "°C" : "°F"

let TEXT_COLOR = new Color(prefData.textcolor);
let ICON_COLOR = prefData.iconcolor;
const TEXT_SIZE = parseInt(prefData.textsize);
const ICON_SIZE = parseInt(prefData.iconsize);

const PREVIEW_MODE = prefData.previewmode;
const PREVIEW_SIZE = prefData.previewsize;
const REFRESH_VIEW = prefData.refreshview;
const FONT_NAME = prefData.font;
const FONT_NAME_BOLD = prefData.fontbold;
const SPACING = parseInt(prefData.spacing);

// Preparing Date
const today = new Date();

var date = today.getDate();
var hour = today.getHours();
var minute = today.getMinutes();

function formatTime(date) {
    let df = new DateFormatter()
    df.locale = prefData.locale
    df.useNoDateStyle()
    df.useShortTimeStyle()
    return df.string(date)
}

// Preparing Event
const events = await CalendarEvent.today([])
let futureEvents = []

// Preparing Weather Data
// Get storage
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
   if(prefData.iconrefresh == "true") {
    fm.downloadFileFromiCloud(finalPath);
    console.log("force downloaded: " + finalPath);
   } else {
    console.log("file exists: " + finalPath);
   }
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

var weatherJSON
var cityName; var weatherarry; var iconData
try{
  weatherJSON = await fetchWeatherData(wetherurl);
  cityName = weatherJSON.name;
  weatherarry = weatherJSON.weather;
  iconData = weatherarry[0].icon;
}catch(e){
  throw new Error("Openweather API Key is invalid.");
}

const weathername = weatherarry[0].main;
const curTempObj = weatherJSON.main;
const curTemp = curTempObj.temp;
const highTemp = curTempObj.temp_max;
const lowTemp = curTempObj.temp_min;
const feel_like = curTempObj.feels_like;

// Weather Done!

function formatDate(format, date){
  date = date || new Date()
  var df = new DateFormatter()
  df.locale = prefData.locale
  df.dateFormat = format
  return df.string(date)
}

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

var dateString = formatDate(prefData.dateformat, today)

// Support for multiple greetings per time period
function randomGreeting(greetingArray) {
   return Math.floor(Math.random() * greetingArray.length);
}

// Greeting Label procedure
var greeting = new String("Dokdo is Korea's Territory")
if (prefData.quotemode == "true"){
  greeting = prefData.greeting0;
} else {
  if (5 <= hour && hour <= 11) { // 5am - 11am
     greeting = prefData.greeting1 + ", " + USERNAME;
  } else if (12 <= hour && hour <= 17) { // 12pm - 5pm
     greeting = prefData.greeting2 + ", " + USERNAME;
  } else if (18 <= hour && hour <= 21) { // 6pm - 9pm
     greeting = prefData.greeting3 + ", " + USERNAME;
  } else if (22 <= hour && hour <= 23) { // 10pm - 11pm
     greeting = prefData.greeting4 + ", " + USERNAME;
  } else if (0 <= hour && hour <= 4) { // 12am - 4am
     greeting = prefData.greeting5 + ", " + USERNAME;
  }
}

// Overwrite greeting if calculated holiday
if (holidaysByKey[holidayKey]) {
   greeting = holidaysByKey[holidayKey];
}

// Overwrite all greetings if specific holiday
if (holidaysByDate[holidayKeyDate]) {
   greeting = holidaysByDate[holidayKeyDate];
}


// Widget Layout
let pwidget = new ListWidget();

var now = new Date().getTime()

const updateServer = "https://pastebin.com/raw/DX6AeT4C"
var latestVer = await new Request(updateServer).loadString()

// Widget Auto-Update
if(!IGNORE_UPDATE) {
    // console.log('[*] Checking update : ' + latestVer)

    if(UPDATE_TEST || (bnumber < parseInt(latestVer))) { // Update process
        pwidget.addSpacer();
        let updateLabel = pwidget.addText("Update Available")
        updateLabel.font = new Font(FONT_NAME_BOLD, 26);
        updateLabel.textColor = TEXT_COLOR
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

function tintIcon(object){
  if(prefData.iconcolor != "false") {
    object.tintColor = new Color(prefData.iconcolor) }
}

if (futureEvents.length != 0) { // has event
    let futureEvent = futureEvents[0]
    
    var target = futureEvent.startDate.getTime()
    var distance = target - now
    var eventMinute = Math.floor(distance / (1000 * 60) % 60)
    var eventHour = Math.floor(distance / (1000 * 60) / 60)

    // Show ahead time; First Line
    let eventLabel = pwidget.addText(futureEvent.title + ' in ' + eventHour + ' hr ' + eventMinute + ' min')
    eventLabel.font = new Font(FONT_NAME_BOLD, TEXT_SIZE);
    eventLabel.textColor = TEXT_COLOR
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
    tintIcon(calElement)
    calElement.imageOpacity = 0.6

    // Event Duration
    let duration = hStack.addText(" " + formatTime(futureEvent.startDate) + " - " + formatTime(futureEvent.endDate) + "  |  ")
    duration.font = new Font(FONT_NAME, 16);
    duration.textColor = TEXT_COLOR
    duration.textOpacity = (0.7)

    // Weather Icon
    let weatherIcon = hStack.addImage(img)
    weatherIcon.imageSize = new Size(18, 18)
    weatherIcon.centerAlignImage()
    tintIcon(weatherIcon)

    // Tempeture Label
    let tempLabel = hStack.addText(" " + Math.round(curTemp).toString() + TEMP_TEXT)
    tempLabel.font = new Font(FONT_NAME, 16);
    tempLabel.textColor = TEXT_COLOR
    tempLabel.textOpacity = (0.7)
    tempLabel.centerAlignText()

    tempLabel.url = "https://openweathermap.org/city/" + CITY_WEATHER
    weatherIcon.url = "https://openweathermap.org/city/" + CITY_WEATHER

    // Show Battery Icon and Percent
    // batteryModule(hStack)

    hStack.addSpacer()

} else if (prefData.ddaymode == "true") {
    // Show dday
    let ddayLabel = pwidget.addText(countDay())
    ddayLabel.font = new Font(FONT_NAME_BOLD, TEXT_SIZE);
    ddayLabel.textColor = TEXT_COLOR
    ddayLabel.centerAlignText()

    pwidget.addSpacer(8)

    // Second Line
    let hStack = pwidget.addStack()
    hStack.layoutHorizontally()
    hStack.addSpacer()
    
    // Gift SFSymbol Icon
    let ddaySymbol = SFSymbol.named("app.gift.fill")
    let ddayElement = hStack.addImage(ddaySymbol.image)
    ddayElement.imageSize = new Size(18, 18)
    ddayElement.tintColor = Color.white()
    ddayElement.imageOpacity = 0.6
    ddayElement.tintColor = Color.white()
    tintIcon(ddayElement)

    // Event Duration
    var df0 = new DateFormatter()
    df0.useLongDateStyle()
    df0.locale = prefData.locale
    var date = new Date(prefData.ddaytarg)
    let ddaytarget = hStack.addText(" " + df0.string(date))
    ddaytarget.font = new Font(FONT_NAME, 16);
    ddaytarget.textColor = TEXT_COLOR
    ddaytarget.textOpacity = (0.7)
    
    let spacerlabel = hStack.addText("  |  ")
    spacerlabel.font = new Font(FONT_NAME, 16);
    spacerlabel.textColor = TEXT_COLOR
    spacerlabel.textOpacity = (0.7)

    // Weather Icon
    let weatherIcon = hStack.addImage(img)
    weatherIcon.imageSize = new Size(18, 18)
    weatherIcon.centerAlignImage()
    tintIcon(weatherIcon)

    // Tempeture Label
    let tempLabel = hStack.addText(" " + Math.round(curTemp).toString() + TEMP_TEXT)
    tempLabel.font = new Font(FONT_NAME, 16);
    tempLabel.textColor = TEXT_COLOR
    tempLabel.textOpacity = (0.7)
    tempLabel.centerAlignText()

    hStack.addSpacer()
    
    tempLabel.url = "https://openweathermap.org/city/" + CITY_WEATHER
    weatherIcon.url = "https://openweathermap.org/city/" + CITY_WEATHER

} else if (LAYOUT_MODE == "pixel") { // pixel layout
    let hStack = pwidget.addStack()
    hStack.layoutHorizontally()
    hStack.addSpacer()
    
    // Show Date
    let dateLabel = hStack.addText(dateString);
    dateLabel.font = new Font(FONT_NAME_BOLD, TEXT_SIZE);
    dateLabel.textColor = TEXT_COLOR
    
    let spacerlabel = hStack.addText(" | ");
    spacerlabel.font = new Font(FONT_NAME_BOLD, TEXT_SIZE);
    spacerlabel.textColor = TEXT_COLOR
    
    // Weather Icon
    let weatherIcon = hStack.addImage(img);
    weatherIcon.imageSize = new Size(ICON_SIZE, ICON_SIZE);
    weatherIcon.centerAlignImage()
    tintIcon(weatherIcon)
    
    hStack.addSpacer(3)

    // Tempeture Label
    let tempLabel = hStack.addText(Math.round(curTemp).toString() + TEMP_TEXT)
    tempLabel.font = new Font(FONT_NAME, TEXT_SIZE);
    tempLabel.textColor = TEXT_COLOR
    tempLabel.centerAlignText()

    tempLabel.url = "https://openweathermap.org/city/" + CITY_WEATHER
    weatherIcon.url = "https://openweathermap.org/city/" + CITY_WEATHER

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
    greetingLabel.textColor = TEXT_COLOR
    greetingLabel.centerAlignText()

    pwidget.addSpacer(8)

    // Second Line
    let hStack = pwidget.addStack()
    hStack.layoutHorizontally()
    hStack.addSpacer()

    // Date Label
    let dateLabel = hStack.addText(dateString)
    dateLabel.font = new Font(FONT_NAME, 16);
    dateLabel.textColor = TEXT_COLOR
    dateLabel.textOpacity = (0.7)
    
    let spacerlabel = hStack.addText("  |  ")
    spacerlabel.font = new Font(FONT_NAME, 16);
    spacerlabel.textColor = TEXT_COLOR
    spacerlabel.textOpacity = (0.7)
    
    // Weather Icon
    let weatherIcon = hStack.addImage(img)
    weatherIcon.imageSize = new Size(18, 18)
    weatherIcon.centerAlignImage()
    tintIcon(weatherIcon)

    // Tempeture Label
    let tempLabel = hStack.addText(Math.round(curTemp).toString() + TEMP_TEXT + "  |  ")
    tempLabel.font = new Font(FONT_NAME, 16);
    tempLabel.textColor = TEXT_COLOR
    tempLabel.textOpacity = (0.7)
    tempLabel.centerAlignText()

    tempLabel.url = "https://openweathermap.org/city/" + CITY_WEATHER
    weatherIcon.url = "https://openweathermap.org/city/" + CITY_WEATHER

    // Show Battery Icon and Percent
    batteryModule(hStack)

    hStack.addSpacer()

}

// Optional Module
function batteryModule(stack) {
    let batteryImg = stack.addImage(renderBatteryIcon(Device.batteryLevel(),Device.isCharging()));
    batteryImg.tintColor = new Color("#fff", 0.7);
    tintIcon(batteryImg)
    batteryImg.imageSize = new Size(25, 18);
    let batterytext = stack.addText(" " + renderBattery() + '%');
    batterytext.font = new Font(FONT_NAME, 16);
    batterytext.textColor = TEXT_COLOR;
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

function countDay() {
  var name = prefData.ddayname;
  var now = new Date();
  var then = new Date(prefData.ddaytarg);
  var gap = now.getTime() - then.getTime();
  gap = gap / (1000 * 60 * 60 * 24);
  var count = Math.floor(gap);
  if(gap > -1 && gap < 1) {
    return name + " today"
  } else if(gap < 0) {
    count = count * -1;
    return count + " days to " + name
  } else {
    return count + " days from " + name
  }
}

// Refresh Text
if(REFRESH_VIEW == "true") {
  pwidget.addSpacer(3);
  let refreshText = pwidget.addText('Last Updated at ' + formatTime(today));
  refreshText.font = new Font(FONT_NAME, 13);
  refreshText.textColor = TEXT_COLOR;
  refreshText.textOpacity = (0.5);
  refreshText.centerAlignText();
}

// Bottom Spacer
pwidget.addSpacer();
pwidget.setPadding(0, 0, 0, 0);

// Prepare Gradient
function setupGradient() {
  if (hour < 7 || 18 < hour) {
    return {
      color() { return [new Color("16296b"), new Color("021033"), new Color("021033"), new Color("113245")] },
      position() { return [-0.5, 0.2, 0.5, 1] },
    }
  } else {
    return {
      color() { return [new Color("3a8cc1"), new Color("90c0df")] },
      position() { return [0, 1] },
    }
  }
}

// Widget Background
if(prefData.bgmode == "solid") {
  pwidget.backgroundColor = new Color(prefData.bgcolor)
} else if(prefData.bgmode == "gradient") {
  const gradient = new LinearGradient()
  const gradientValue = await setupGradient()
  
  gradient.colors = gradientValue.color()
  gradient.locations = gradientValue.position()
  pwidget.backgroundGradient = gradient
} else {
  let bgimagePath = fm.bookmarkedPath(prefData.bgmode)
  pwidget.backgroundImage = fm.readImage(bgimagePath)
}

pwidget.refreshAfterDate = new Date(Date.now() + 1000 * 120) // Refresh every 120 Second
 
// Set widget
Script.setWidget(pwidget);

if (PREVIEW_MODE == "true") {
  if (PREVIEW_SIZE == "small") { pwidget.presentSmall() }
  if (PREVIEW_SIZE == "medium") { pwidget.presentMedium() }
  if (PREVIEW_SIZE == "large") { pwidget.presentLarge() }
}

Script.complete()
