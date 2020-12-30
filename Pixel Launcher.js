// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: cannabis;
// Pixel Launcher v2.2 - by unvsDev
// for Setting up Pixel Widget

// Unauthorized Redistribute is Strictly prohibited.
// Contact developer for question, or reporting abuse
// You can use Discord to contact @unvsDev!

const version = 2.2
const plName = Script.name()

var fm = FileManager.iCloud()
var filePath = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/";
var prefPath = fm.joinPath(filePath, "pixelPref.txt")
var namePath = fm.joinPath(filePath, "plName.txt")

fm.writeString(namePath, plName)

var defaultJSON = {"apikey":"openweatherapikey","cityid":"1835848","layout":"pixel","username":"Sir","tempunit":"metric","locale":"en","textcolor":"#ffffff","textsize":"23","iconcolor":"default","iconsize":"27","font":"Product Sans","fontbold":"Product Sans Medium","spacing":"45","previewmode":"true","previewsize":"medium","refreshview":"false","greeting1":"Good morning","greeting2":"Good afternoon","greeting3":"Good evening","greeting4":"Good night","greeting5":"Time to sleep","greeting0":"Welcome to Pixel Widget","dateformat":"MMMM, EEE dd","quotemode":"false","bgmode":"solid","bglight":"null","bgdark":"null","bgcolor":"#147158","iconrefresh":"true","refreshrate":"90","ddaymode":"false","ddayname":"Christmas","ddaytarg":"2021-12-25","hideb":"false","event":"true"}

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
  "quotemode": "UseFixedGreeting",
  "bgmode": "Background Mode",
  "bglight": "Select Light Background",
  "bgdark": "Select Dark Background",
  "bgcolor": "Background Color",
  "iconrefresh": "AlwaysRefreshWeatherIcon",
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
  "refreshrate": "(second)",
  "ddaymode": "(true, false)",
  "ddayname": "(Name)",
  "ddaytarg": "YYYY-MM-DD",
  "hideb": "(true, false)",
  "event": "(true, false)"
}

var welcomemode = 0

// Preparing File
let prefData0; var settingmode = 0;
if(!(fm.fileExists(prefPath))) {
  welcomemode = 1
  await fm.writeString(prefPath, JSON.stringify(defaultJSON))
}

let plAlert = new Alert()
plAlert.title = welcomemode ? "Welcome to Pixel Widget!" : "Pixel Launcher"
let menuOptions = ["Edit Preferences", "General Settings"]
for(const option of menuOptions) {
  plAlert.addAction(option)
}
plAlert.addCancelAction("Done")
let response = await plAlert.presentAlert()
if(response == 1){
  settingmode = 1
} else if(response == 2) {
  
} else if(response == -1) {
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
    fm.writeString(namePath, "forceupdate")
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
    if(number != 25 && number != 26){
      let editAlert = new Alert()
      editAlert.title = "Edit " + optionName[optionList[number]]
      editAlert.addTextField(optionFormat[optionList[number]], prevData[optionList[number]].toString())
      editAlert.addCancelAction("Cancel")
      editAlert.addAction("Done")
      if(await editAlert.present() == 0){
        prevData[optionList[number]] = editAlert.textFieldValue()
      }
    }
    else if(number == 25){
      prevData.bglight = await DocumentPicker.openFile()
      let bgPickerAlert = new Alert()
      bgPickerAlert.title = "Light Wallpaper"
      bgPickerAlert.message = "Successfully saved your wallpaper!"
      bgPickerAlert.addAction("OK")
      await bgPickerAlert.present()
    } else if(number == 26){
      prevData.bgdark = await DocumentPicker.openFile()
      let bgPickerAlert = new Alert()
      bgPickerAlert.title = "Dark Wallpaper"
      bgPickerAlert.message = "Successfully saved your wallpaper!"
      bgPickerAlert.addAction("OK")
      await bgPickerAlert.present()
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
