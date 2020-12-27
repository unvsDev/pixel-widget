// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: cannabis;
// Pixel Launcher v1.0.3 - by unvsDev
// for Setting up Pixel Widget ~v2.x
// Unauthorized Redistribute is Strictly prohibited.
// Contact developer for question, or reporting abuse
// You can use Discord to contact @unvsDev!

var fm = FileManager.iCloud()
var filePath = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/";
var prefPath = fm.joinPath(filePath, "pixelPref.txt")

const bnumber = 103; // Do NOT edit this area

var defaultJSON = {"apikey":"Your API Key","cityid":"Your City ID","layout":"pixel","username":"Sir","tempunit":"metric","locale":"en","textcolor":"#ffffff","textsize":26,"iconcolor":"false","iconsize":27,"font":"Product Sans","fontbold":"Product Sans Medium","spacing":45,"previewmode":"true","previewsize":"medium","refreshview":"false","greeting1":"Good morning","greeting2":"Good afternoon","greeting3":"Good evening","greeting4":"Good night","greeting5":"Time to sleep","greeting0":"Welcome to Pixel Widget","dateformat":"MMMM, EEE dd","quotemode":"false","bgmode":"solid","bgcolor":"#147158","iconrefresh":"false","ddaymode":"false","ddayname":"Christmas","ddaytarg":"2020-12-25"}

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
  "bgcolor": "Background Color",
  "iconrefresh": "AlwaysRefreshWeatherIcon",
  "ddaymode": "Day Count Mode",
  "ddayname": "Day Count Name",
  "ddaytarg": "Day Count Date"
}

var optionFormat = {
  "apikey": "For weather service",
  "cityid": "Fixed Location",
  "layout": "(pixel, siri)",
  "username": "To be shown on your Widget",
  "tempunit": "(metric, imperial)",
  "locale": "For language customization",
  "textcolor": "(Color Hex Code)",
  "textsize": "(Number)",
  "iconcolor": "(false, or Color Hex Code)",
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
  "bgmode": "(solid, gradient, or bookmarked name)",
  "bgcolor": "(Color Hex Code) - solid mode",
  "iconrefresh": "(true, false) - can cause battery drain faster",
  "ddaymode": "(true, false)",
  "ddayname": "(Name)",
  "ddaytarg": "YYYY-MM-DD"
}

if(!fm.fileExists(fm.joinPath(filePath, "pixelVer.txt"))){
  let errAlert = new Alert()
  errAlert.title = "Version Data not Found"
  errAlert.message = "To Verify that you've installed Pixel Widget, Please launch Pixel Widget once."
  errAlert.addAction("OK")
  await errAlert.presentAlert()
  return 0
}

let prefData0
if(!(fm.fileExists(prefPath))) {
  let shouldSetup = await generateAlert("Welcome to Pixel Widget!","Thanks for choosing pixel widget!\nAre you first to Pixel Widget?",["I have used","Yep, I'm newbie"])
  if(shouldSetup) {
    let setupAnnounce = await generateAlert("Okay!","Before using pixel widget, you need to do a few things. First, Let me check your device's Permission! also, please Activate iCloud Drive to store information.",["Check Permission"])
    const events = await CalendarEvent.today([])
    let futureEvents = []
    
    let setupAPIKey = await generateAlert("Getting Weather API","Then, you have to enter Openweather API Key to use weather function. Please copy your API Key and continue.",["Okay, I'm ready"])
    
    var APIKey = Pasteboard.pasteString()
    let setupCityID = await generateAlert("Getting City ID","You're almost there! Since widget uses fixed weather location, please copy your City ID and continue.",["Okay, I'm ready"])
    
    var CityID = Pasteboard.pasteString()
    let setupFont = await generateAlert("Install Font Profile","For better Pixel Experience, We prepared pixel style font profile! Please install it.",["Install Profile"])
    var installFont = await new Request("https://pastebin.com/raw/rfHS7Xey").loadString()
    await Safari.openInApp(installFont, false)
    
    let setupJSON = await generateAlert("All Done","Okay, You're ready now!\nGetting preference data...",["Kick off"])
    
    defaultJSON.apikey = APIKey
    defaultJSON.cityid = CityID
    await fm.writeString(prefPath, JSON.stringify(defaultJSON))
  } else {
  let setupDirect = await generateAlert("All Done","Well, then you can add your data in Preference file!",["Kick off"])
  await fm.writeString(prefPath, JSON.stringify(defaultJSON))
  }
}

// Do NOT edit this area
var verData = JSON.parse(fm.readString(fm.joinPath(filePath, "pixelVer.txt")))
const updateServer = "https://pastebin.com/raw/DX6AeT4C"
var latestVer = await new Request(updateServer).loadString()

const plupserver = "https://pastebin.com/raw/SwSPeM48"
var latestPl = await new Request(plupserver).loadString()

if(verData.ignore) {
  let updateAlert = new Alert()
  updateAlert.title = "Auto update Stopped"
  updateAlert.message = "For the best user experience, we recommend turning on Auto Update."
  updateAlert.addCancelAction("OK")
  updateAlert.addDestructiveAction("Ignore")
  let response = await updateAlert.presentAlert()
  if(response == -1) { return 0 }
} else if(parseInt(verData.version) < parseInt(latestVer)) {
  let updateAlert = new Alert()
  updateAlert.title = "Update Available"
  updateAlert.message = "There's new version of Pixel Widget available!"
  updateAlert.addCancelAction("Update")
  updateAlert.addDestructiveAction("Ignore")
  let response = await updateAlert.presentAlert()
  if(response != -1) {
    Safari.openInApp("https://pastebin.com/raw/ntiKwgUJ", false)
    return 0
  }
}

if(bnumber < parseInt(latestPl)) {
  let plupAlert = new Alert()
  plupAlert.title = "Update Available"
  plupAlert.message = "There's new version of Pixel Launcher available!"
  plupAlert.addCancelAction("Update")
  plupAlert.addDestructiveAction("Ignore")
  let response2 = await plupAlert.presentAlert()
  if(response2 != -1) {
    Safari.openInApp("https://pastebin.com/raw/qPEwdQn5", false)
    return 0
  }
}

let plAlert = new Alert()
plAlert.title = "Pixel Launcher"
let menuOptions = ["Edit Preferences", "Update Widget", "Reset Widget", "Dev's Discord", "Credit"]
for(const option of menuOptions) {
  plAlert.addAction(option)
}
if(verData.license != "pro"){plAlert.addAction("Upgrade to Pro 🚀");}
plAlert.addCancelAction("Done")
let response = await plAlert.presentSheet()
if(response == 0){
  
} else if(response == 1){
  var updateL = await new Request("https://pastebin.com/raw/ntiKwgUJ").loadString()
  Safari.openInApp(updateL, false)
  return 0
} else if(response == 2) {
  let resetAlert = new Alert()
  resetAlert.title = "Reset Confirmation"
  resetAlert.message = "Do you really want to reset all Data? This includes Preference, and Version Data."
  resetAlert.addCancelAction("Cancel")
  resetAlert.addDestructiveAction("Confirm")
  let response = await resetAlert.presentAlert()
  if(response != -1) {
    fm.remove(prefPath)
    fm.remove(fm.joinPath(filePath, "pixelVer.txt"))
    return 0
  }
  return 0
} else if(response == 3) {
  var discordL = await new Request("https://pastebin.com/raw/Yzt84Vi8").loadString()
  Safari.openInApp(discordL, false)
  return 0
} else if(response == 4) {
  let devAlert = new Alert()
  devAlert.title = "Credit"
  devAlert.message = "Made by unvsDev\nwith italoboy & mvan231!\nShoutout to Beta Testers! 🔥"
  devAlert.addAction("OK")
  await devAlert.presentAlert()
  return 0
} else if(response == 5) {
  if(verData.license != "pro"){
    let proAlert = new Alert()
    proAlert.title = "Upgrade to Pro 🔥"
    proAlert.message = "Pixel Widget Pro is coming soon!\nWith Pro Features! Stay tuned! 💜"
    proAlert.addAction("OK")
    await proAlert.presentAlert()
    return 0
  }
} else if(response == -1) {
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
  "bgcolor": prefData.bgcolor,
  "iconrefresh": prefData.iconrefresh,
  "ddaymode": prefData.ddaymode,
  "ddayname": prefData.ddayname,
  "ddaytarg": prefData.ddaytarg
}

const settings = new UITable()
settings.showSeparators = true

var optionList = []
for(title in prefData){
  // Settings List
  const option = new UITableRow()
  optionList.push(title)
  option.dismissOnSelect = false
  option.addText(optionName[title], optionFormat[title])
  settings.addRow(option)
  option.onSelect = async (number) => {
    let editAlert = new Alert()
    editAlert.title = "Edit " + optionName[optionList[number]]
    editAlert.addTextField(optionFormat[optionList[number]], prevData[optionList[number]].toString())
    editAlert.addCancelAction("Cancel")
    editAlert.addAction("Done")
    if(await editAlert.present() == 0){
      prevData[optionList[number]] = editAlert.textFieldValue()
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
