// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: cannabis;
// Pixel Launcher v2.3 - by unvsDev
// for Setting up Pixel Widget

// Unauthorized Redistribute is Strictly prohibited.
// Contact developer for question, or reporting abuse
// You can use Discord to contact @unvsDev!

const version = 2.3
const plName = Script.name()

var fm = FileManager.iCloud()
var fDir = fm.joinPath(fm.documentsDirectory(), "/Pixel Widget")
if(!fm.fileExists(fDir)){ fm.createDirectory(fDir) }
var prefPath = fm.joinPath(fDir, "pixelPref.txt")
var namePath = fm.joinPath(fDir, "plName.txt")
var progPath = fm.joinPath(fDir, "plPlugin.txt")

fm.writeString(namePath, JSON.stringify({"name":plName, "update":"false"}))

var defaultJSON = {"apikey":"openweatherapikey","cityid":"1835848","layout":"pixel","username":"Sir","tempunit":"metric","locale":"en","textcolor":"#ffffff","textsize":"23","iconcolor":"default","iconsize":"27","font":"Product Sans","fontbold":"Product Sans Medium","spacing":"45","previewmode":"true","previewsize":"medium","refreshview":"false","greeting1":"Good morning","greeting2":"Good afternoon","greeting3":"Good evening","greeting4":"Good night","greeting5":"Time to sleep","greeting0":"Welcome to Pixel Widget","dateformat":"MMMM, EEE dd","quotemode":"false","bgmode":"solid","bglight":"null","bgdark":"null","bgcolor":"#147158","iconrefresh":"true","wallrefresh":"true","refreshrate":"90","ddaymode":"false","ddayname":"Christmas","ddaytarg":"2021-12-25","hideb":"false","event":"true"}

var optionName = {
  "apikey": "Openweather API Key",
  "cityid": "City ID",
  "layout": "Widget Layout",
  "username": "Username",
  "tempunit": "Temperature Unit",
  "locale": "Locale",
  "textcolor": "Text Color",
  "textsize": "Text Size",
  "iconcolor": "Icon Color",
  "iconsize": "Icon Size",
  "font": "Font",
  "fontbold": "Bold Font",
  "spacing": "Top Spacing",
  "previewmode": "Preview Mode",
  "previewsize": "Preview Size",
  "refreshview": "RefreshView",
  "greeting1": "Morning Greeting",
  "greeting2": "Afternoon Greeting",
  "greeting3": "Evening Greeting",
  "greeting4": "Night Greeting",
  "greeting5": "Sleep Greeting",
  "greeting0": "Fixed Greeting",
  "dateformat": "Date Format",
  "quotemode": "Use Fixed Greeting",
  "bgmode": "Background Mode",
  "bglight": "Select Light Background",
  "bgdark": "Select Dark Background",
  "bgcolor": "Background Color",
  "iconrefresh": "Always Refresh Weather Icon",
  "wallrefresh": "Always Refresh Wallpaper",
  "refreshrate": "Widget Refresh Rate",
  "ddaymode": "Day Count Mode",
  "ddayname": "Day Count Name",
  "ddaytarg": "Day Count Date",
  "hideb": "Hide Battery Icon",
  "event": "Show Event"
}

var optionFormat = {
  "apikey": "For weather service",
  "cityid": "Fixed Location",
  "layout": "(pixel, siri)",
  "username": "To be shown on your Widget",
  "tempunit": "(metric, imperial)",
  "locale": "For language customization",
  "textcolor": "(auto, or Color Hex Code)",
  "textsize": "(Number)",
  "iconcolor": "(auto, default, or Color Hex Code)",
  "iconsize": "(Number)",
  "font": "(Font Name)",
  "fontbold": "(Font Name)",
  "spacing": "(Number)",
  "previewmode": "(true, false) - show preview",
  "previewsize": "(small, medium, large)",
  "refreshview": "(true, false) - show last refreshed time",
  "greeting1": "(String) - 5am ~ 11am",
  "greeting2": "(String) - 12pm ~ 5pm",
  "greeting3": "(String) - 6pm ~ 9pm",
  "greeting4": "(String) - 10pm ~ 11pm",
  "greeting5": "(String) - 12am ~ 4am",
  "greeting0": "(String) - shows when UseFixedGreeting is true",
  "dateformat": "(Date Format) - show date",
  "quotemode": "(true, false) - show fixed greeting",
  "bgmode": "(auto, fixed, solid, or gradient)",
  "bglight": "for fixed & auto mode",
  "bgdark": "for auto mode",
  "bgcolor": "(Color Hex Code) - solid mode",
  "iconrefresh": "(true, false) - recommended option",
  "wallrefresh": "(true, false) - recommended option",
  "refreshrate": "(second)",
  "ddaymode": "(true, false)",
  "ddayname": "(Name)",
  "ddaytarg": "YYYY-MM-DD",
  "hideb": "(true, false)",
  "event": "(true, false)"
}

var welcomemode = 0

// Preparing File
let prefData0; var settingmode = 0; var pluginmode = 0;
if(!(fm.fileExists(prefPath))) {
  welcomemode = 1
  await fm.writeString(prefPath, JSON.stringify(defaultJSON))
}

var orgProgData = {
    "covidkr1": false,
    "covidkr2": "Hide",
    "minimemo": "",
    "minidday": ["", ""]
}
let progData
if(!(fm.fileExists(progPath))) {
  progData = orgProgData
  await fm.writeString(progPath, JSON.stringify(progData))
}

// Main Menu
let plAlert = new Alert()
plAlert.title = welcomemode ? "Welcome to Pixel Widget!" : "Pixel Launcher"
let menuOptions = ["Edit Preferences", "Manage Plugin", "General Settings"]
for(const option of menuOptions) {
  plAlert.addAction(option)
}
plAlert.addCancelAction("Done")
let response = await plAlert.presentAlert()
if(response == 1){
  pluginmode = 1
} else if(response == 2) {
  settingmode = 1
} else if(response == -1) {
  return 0
}


if(pluginmode){
  progData = JSON.parse(fm.readString(progPath))
  
  // Auto Update Preferences
  var cnt = 0
  for(i in orgProgData){
    if(progData[i] == undefined){
      cnt = cnt + 1
      progData[i] = orgProgData[i]
      console.log("[!] Updating preferences.. (" + cnt + ")")
    }
  }
  
  let pluginMenu = new UITable()
  pluginMenu.showSeparators = true
  
  const covidkr1 = new UITableRow()
  covidkr1.dismissOnSelect = false
  covidkr1.addText("Covid-19 KR Information", "코로나19 확진자 정보를 간단히 알려줍니다. (KR Local)")
  pluginMenu.addRow(covidkr1)
  
  covidkr1.onSelect = async () => {
    let pAlert = new Alert()
    pAlert.title = "Edit Covid-19 KR Information"
    pAlert.message = "Currently set to \"" + (progData.covidkr1 ? "Show" : "Hide") + "\""
    pAlert.addAction("Show")
    pAlert.addAction("Hide")
    progData.covidkr1 = (await pAlert.present() ? false : true)
  }
  
  const covidkr2 = new UITableRow()
  covidkr2.dismissOnSelect = false
  covidkr2.addText("QR Check-in Shortcut", "QR 체크인 바로가기를 보여줍니다. (KR Local)")
  pluginMenu.addRow(covidkr2)
  
  covidkr2.onSelect = async () => {
    let pAlert = new Alert()
    pAlert.title = "Edit QR Check-in Shortcut"
    pAlert.message = "Currently set to \"" + progData.covidkr2 + "\""
    pAlert.addAction("Show Naver")
    pAlert.addAction("Show Kakao")
    pAlert.addAction("Hide")
    let response = await pAlert.present()
    if(response == 0) { progData.covidkr2 = "Naver" }
    else if(response == 1) { progData.covidkr2 = "Kakao" }
    else { progData.covidkr2 = "Hide" }
  }
  
  const minimemo = new UITableRow()
  minimemo.dismissOnSelect = false
  minimemo.addText("Mini Memo", "Type your quote, or short memo!")
  pluginMenu.addRow(minimemo)
  
  minimemo.onSelect = async () => {
    let pAlert = new Alert()
    pAlert.title = "Edit Mini Memo"
    pAlert.message = (progData.minimemo.length < 1 ? "Mini Memo is turned off currently." : "Mini Memo is set to \"" + progData.minimemo + "\"") + "\nLeave it blank to set to hide."
    pAlert.addTextField("Type Memo", progData.minimemo)
    pAlert.addCancelAction("Cancel")
    pAlert.addAction("Done")
    let response = await pAlert.present()
    if(response != -1) {
      progData.minimemo = pAlert.textFieldValue()
    }
  }
  
  const minidday = new UITableRow()
  minidday.dismissOnSelect = false
  minidday.addText("Mini Day Counter", "Celebrate your special day!")
  pluginMenu.addRow(minidday)
  
  minidday.onSelect = async () => {
    let pAlert = new Alert()
    pAlert.title = "Edit Mini Day Counter"
    pAlert.message = (progData.minidday[0].length < 1 ? "Day counter is turned off currently." : progData.minidday[1] + " is set to " + progData.minidday[0]) + "\nLeave it blank to set to hide, or input Target Date."
    pAlert.addTextField("YYYY-MM-DD", progData.minidday[0])
    pAlert.addTextField("Day Count Name", progData.minidday[1])
    pAlert.addCancelAction("Cancel")
    pAlert.addAction("Done")
    let response = await pAlert.present()
    if(response != -1) {
      progData.minidday[0] = pAlert.textFieldValue(0)
      progData.minidday[1] = pAlert.textFieldValue(1)
    }
  }
  
  await pluginMenu.present()
  
  await fm.writeString(progPath, JSON.stringify(progData))
  
  return 0
}


// General Settings
if(settingmode){
  let settings = new UITable()
  settings.showSeparators = true
  
  const option1 = new UITableRow()
  option1.dismissOnSelect = false
  option1.addText("Install Font Profile")
  settings.addRow(option1)
  
  option1.onSelect = async () => {
    var fontURL = await new Request("https://pastebin.com/raw/rfHS7Xey").loadString()
    Safari.openInApp(fontURL, false)
  }
  
  const option2 = new UITableRow()
  option2.dismissOnSelect = true
  option2.addText("Reset Widget")
  settings.addRow(option2)
  
  option2.onSelect = async () => {
    let resetAlert = new Alert()
    resetAlert.title = "Reset Confirmation"
    resetAlert.message = "Do you really want to reset all Data? This includes Preference, and Your secure data."
    resetAlert.addCancelAction("Cancel")
    resetAlert.addDestructiveAction("Confirm")
    let response = await resetAlert.presentAlert()
    if(response != -1) {
      fm.remove(prefPath)
      return 0
    }
    await settings.present()
  }
  
  const option3 = new UITableRow()
  option3.dismissOnSelect = true
  option3.addText("Request Force Update", "Current: v" + version)
  settings.addRow(option3)
  
  option3.onSelect = async () => {
    fm.writeString(namePath, JSON.stringify({"name":plName, "update":"true"}))
    let fuAlert = new Alert()
    fuAlert.title = "Requested Update"
    fuAlert.message = "Launch Pixel Widget to begin Update. Your Preferences won't be deleted."
    fuAlert.addAction("OK")
    
    await fuAlert.present()
    
    await settings.present()
  }
  
  const option4 = new UITableRow()
  option4.dismissOnSelect = false
  option4.addText("Github")
  settings.addRow(option4)
  
  option4.onSelect = () => {
    Safari.openInApp("https://github.com/unvsDev/pixel-widget", false)
  }
  
  await settings.present()
  
  return 0
}


// Edit Preferences
fm.downloadFileFromiCloud(prefPath)
prefData0 = fm.readString(prefPath)
let prefData = JSON.parse(prefData0)

var prevData = {
  "apikey": prefData.apikey,
  "cityid": prefData.cityid,
  "layout": prefData.layout,
  "username": prefData.username,
  "tempunit": prefData.tempunit,
  "locale": prefData.locale,
  "textcolor": prefData.textcolor,
  "textsize": prefData.textsize,
  "iconcolor": prefData.iconcolor,
  "iconsize": prefData.iconsize,
  "font": prefData.font,
  "fontbold": prefData.fontbold,
  "spacing": prefData.spacing,
  "previewmode": prefData.previewmode,
  "previewsize": prefData.previewsize,
  "refreshview": prefData.refreshview,
  "greeting1": prefData.greeting1,
  "greeting2": prefData.greeting2,
  "greeting3": prefData.greeting3,
  "greeting4": prefData.greeting4,
  "greeting5": prefData.greeting5,
  "greeting0": prefData.greeting0,
  "dateformat": prefData.dateformat,
  "quotemode": prefData.quotemode,
  "bgmode": prefData.bgmode,
  "bglight": prefData.bglight,
  "bgdark": prefData.bgdark,
  "bgcolor": prefData.bgcolor,
  "iconrefresh": prefData.iconrefresh,
  "wallrefresh": prefData.wallrefresh,
  "refreshrate": prefData.refreshrate,
  "ddaymode": prefData.ddaymode,
  "ddayname": prefData.ddayname,
  "ddaytarg": prefData.ddaytarg,
  "hideb": prefData.hideb,
  "event": prefData.event
}

// Auto Update Preferences
var cnt = 0
for(i in defaultJSON){
  if(prevData[i] == undefined){
    cnt = cnt + 1
    prevData[i] = defaultJSON[i]
    console.log("[!] Updating preferences.. (" + cnt + ")")
  }
}

const settings = new UITable()
settings.showSeparators = true

var optionList = []
for(title in prevData){
  // Settings List
  const option = new UITableRow()
  optionList.push(title)
  option.dismissOnSelect = false
  option.addText(optionName[title], optionFormat[title])
  settings.addRow(option)
  option.onSelect = async (number) => {
    if(number != 24 && number != 25 && number != 26){
      let editAlert = new Alert()
      editAlert.title = "Edit " + optionName[optionList[number]]
      editAlert.addTextField(optionFormat[optionList[number]], prevData[optionList[number]].toString())
      editAlert.addCancelAction("Cancel")
      editAlert.addAction("Done")
      if(await editAlert.present() == 0){
        prevData[optionList[number]] = editAlert.textFieldValue()
      }
    } else if(number == 24){
      let bgPickerAlert = new Alert()
      bgPickerAlert.title = "Edit Wallpaper Mode"
      bgPickerAlert.message = "Currently set to " + prevData.bgmode + "."
      bgPickerAlert.addAction("Fixed - One wallpaper")
      bgPickerAlert.addAction("Auto - Two wallpaper")
      bgPickerAlert.addAction("Solid - Simple color")
      bgPickerAlert.addAction("Gradient - Based on current time")
      bgPickerAlert.addCancelAction("Cancel")
      let response = await bgPickerAlert.present()
      if(response == 0) { prevData.bgmode = "fixed" }
      else if(response == 1) { prevData.bgmode = "auto" }
      else if(response == 2) { prevData.bgmode = "solid" }
      else if(response == 3) { prevData.bgmode = "gradient" }
      
    } else if(number == 25){
      if(prevData.bgmode == "fixed" || prevData.bgmode == "auto") {
        prevData.bglight = await DocumentPicker.openFile()
        let bgPickerAlert = new Alert()
        bgPickerAlert.title = "Light Wallpaper"
        bgPickerAlert.message = "Successfully saved your wallpaper!"
        bgPickerAlert.addAction("OK")
        await bgPickerAlert.present()
      } else {
        let bgPickerAlert = new Alert()
        bgPickerAlert.title = "Light Wallpaper"
        bgPickerAlert.message = "You can edit this area\nif you're in fixed / auto mode."
        bgPickerAlert.addAction("OK")
        await bgPickerAlert.present()
      }
    } else if(number == 26){
      if(prevData.bgmode == "auto") {
        prevData.bgdark = await DocumentPicker.openFile()
        let bgPickerAlert = new Alert()
        bgPickerAlert.title = "Dark Wallpaper"
        bgPickerAlert.message = "Successfully saved your wallpaper!"
        bgPickerAlert.addAction("OK")
        await bgPickerAlert.present()
      } else {
        let bgPickerAlert = new Alert()
        bgPickerAlert.title = "Dark Wallpaper"
        bgPickerAlert.message = "You can edit this area if you're in auto mode."
        bgPickerAlert.addAction("OK")
        await bgPickerAlert.present()
      }
    }
  }
}
await settings.present()

fm.writeString(prefPath, JSON.stringify(prevData))

Script.complete()

async function generateAlert(title,message,options) {
  let alert = new Alert()
  alert.title = title
  alert.message = message
  
  for (const option of options) {
    alert.addAction(option)
  }
  
  let response = await alert.presentAlert()
  return response
}
