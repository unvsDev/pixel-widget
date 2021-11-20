// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: drafting-compass;
// Pixel Widget - by unvsDev
// inspired by Google Pixel's "at a Glance"
// Greetings, weather, events, and more!

// Unauthorized Redistribute is Strictly prohibited.
// 본 위젯은 무단 재배포 및 복제가 엄격히 금지되어 있습니다. 자세한 내용은 제공처에 문의하시기 바랍니다.

// Pro로 업그레이드하세요: https://widget.oopy.io/plus


// eslint-disable-next-line no-unused-vars
const version = '3.1';
// eslint-disable-next-line no-unused-vars
const name = Script.name();

// FileManager
const fm = FileManager.iCloud();
const fDir = fm.joinPath(fm.documentsDirectory(), '/PX3');
if (!fm.fileExists(fDir)) {
  fm.createDirectory(fDir);
}
const prefPath = fm.joinPath(fDir, 'pixelPref.json');
const progPath = fm.joinPath(fDir, 'plPlugin.json');
const layoutPath = fm.joinPath(fDir, 'plLayout.json');
const wallPath = fm.joinPath(fDir, 'plWall.json');
const linkPath = fm.joinPath(fDir, 'plLinker.txt');
const aprPath = fm.joinPath(fDir, 'pixelApr.txt');
const posPath = fm.joinPath(fDir, 'pixelPos.txt');
const dataPath = fm.joinPath(fDir, 'weatherData.json');

let darkMode;
// Preparing Device Appearance
if (config.runsInApp) {
  darkMode = Device.isUsingDarkAppearance();
  // darkMode = !(Color.dynamic(Color.white(),Color.black()).red)
  fm.writeString(aprPath, (darkMode === true ? 1 : 0).toString());
} else if (!fm.fileExists(aprPath)) {
  throw new Error('화면 모드 확인을 위해, 픽셀 위젯을 앱에서 한번 실행해 주세요.');
} else {
  darkMode = parseInt(fm.readString(aprPath));
}

// Getting Preference
let prefData0;
if (fm.fileExists(prefPath)) {
  fm.downloadFileFromiCloud(prefPath);
  prefData0 = fm.readString(prefPath);
} else {
  throw new Error('픽셀 런처를 앱에서 한번 실행해 주세요.');
}
const prefData = JSON.parse(prefData0);

const layoutData = JSON.parse(fm.readString(layoutPath));
const wallData = JSON.parse(fm.readString(wallPath));

const LAYOUT_MODE = layoutData.layout;

const API_WEATHER = prefData.apikey;
const CITY_WEATHER = prefData.cityid;
const USERNAME = prefData.username;
const TEMP_UNIT = prefData.tempunit;

const TEMP_TEXT = (TEMP_UNIT === 'metric')? '°C' : '°F';

let TEXT_COLOR = prefData.textcolor;
if (TEXT_COLOR === 'auto') {
  if (darkMode) {
    TEXT_COLOR = new Color('#ffffff');
  } else {
    TEXT_COLOR = new Color('#000000');
  }
} else {
  TEXT_COLOR = new Color(prefData.textcolor);
}

let ICON_COLOR = prefData.iconcolor;
if (ICON_COLOR === 'auto') {
  if (darkMode) {
    ICON_COLOR = new Color('#ffffff');
  } else {
    ICON_COLOR = new Color('#000000');
  }
} else {
  ICON_COLOR = new Color(prefData.iconcolor);
}

let linkData;
if (fm.fileExists(linkPath)) {
  fm.downloadFileFromiCloud(linkPath);
  linkData = fm.readString(linkPath);
} else {
  linkData = 'scriptable://';
}

const TEXT_SIZE = parseInt(prefData.textsize);
const ICON_SIZE = parseInt(prefData.iconsize);

const PREVIEW_MODE = prefData.previewmode;
const PREVIEW_SIZE = prefData.previewsize;
const REFRESH_VIEW = prefData.refreshview;
const FONT_NAME = prefData.font;
const FONT_NAME_BOLD = prefData.fontbold;
const SPACING = layoutData.padding[LAYOUT_MODE];


// Preparing Date
const today = new Date();
let date = today.getDate();
const hour = today.getHours();
// eslint-disable-next-line no-unused-vars
const minute = today.getMinutes();

function formatTime(date) {
  const df = new DateFormatter();
  df.locale = prefData.locale;
  df.useNoDateStyle();
  df.useShortTimeStyle();
  return df.string(date);
}

// Preparing Event
const events = await CalendarEvent.today([]);
const futureEvents = [];


async function fetchWeatherIcon(key) {
  const target = `/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/PX3/weather/${key}.png`;

  let image;
  if (fm.fileExists(target)) {
    fm.downloadFileFromiCloud(target);
    image = fm.readImage(target);
  } else {
    console.log('날씨 아이콘을 찾을 수 없습니다. 다운로드를 시작합니다..');
    await getWeatherIcon();
    return fetchWeatherIcon(key);
  }
  return image;
}

async function getWeatherIcon() {
  const keys = [
    '01n',
    '01d',
    '02n',
    '02d',
    '03d',
    '03n',
    '04n',
    '04d',
    '09n',
    '09d',
    '10d',
    '10n',
    '11d',
    '11n',
    '13n',
    '13d',
    '50n',
    '50d',
  ];
  const keysOrigin = {
    '01n': 'https://user-images.githubusercontent.com/63099769/116782432-122a3500-aac4-11eb-90bc-9faf84f7b67b.png',
    '01d': 'https://user-images.githubusercontent.com/63099769/116782446-3128c700-aac4-11eb-98fc-8b7c9f0c8f86.png',
    '02n': 'https://user-images.githubusercontent.com/63099769/116782442-2b32e600-aac4-11eb-9102-4e6b832342e2.png',
    '02d': 'https://user-images.githubusercontent.com/63099769/116782441-28d08c00-aac4-11eb-9dbc-eea73c612364.png',
    '03d': 'https://user-images.githubusercontent.com/63099769/118116579-68cd3280-b425-11eb-8b23-813a5d20a37f.png',
    '03n': 'https://user-images.githubusercontent.com/63099769/118116589-6a96f600-b425-11eb-9e39-e32fc146c54d.png',
    '04n': 'https://user-images.githubusercontent.com/63099769/116782475-4f8ec280-aac4-11eb-90db-ee8d81aeb5ca.png',
    '04d': 'https://user-images.githubusercontent.com/63099769/116782476-51f11c80-aac4-11eb-9983-9f0da8b653b3.png',
    '09n': 'https://user-images.githubusercontent.com/63099769/116782481-54ec0d00-aac4-11eb-8df9-562df6d8bed9.png',
    '09d': 'https://user-images.githubusercontent.com/63099769/116782483-574e6700-aac4-11eb-9be8-41939eb8f751.png',
    '10d': 'https://user-images.githubusercontent.com/63099769/118116601-6e2a7d00-b425-11eb-8eea-96fdb6ae0cae.png',
    '10n': 'https://user-images.githubusercontent.com/63099769/118116596-6c60b980-b425-11eb-993b-913231278260.png',
    '11d': 'https://user-images.githubusercontent.com/63099769/118162536-d6945100-b45b-11eb-870f-2f286743d73e.png',
    '11n': 'https://user-images.githubusercontent.com/63099769/118162613-edd33e80-b45b-11eb-96de-b03013aa471c.png',
    '13n': 'https://user-images.githubusercontent.com/63099769/116782509-78af5300-aac4-11eb-908d-a24cd6b73921.png',
    '13d': 'https://user-images.githubusercontent.com/63099769/116782510-7a791680-aac4-11eb-89c4-f0645339aabd.png',
    '50n': 'https://user-images.githubusercontent.com/63099769/116782512-7cdb7080-aac4-11eb-88d5-53252ad84f08.png',
    '50d': 'https://user-images.githubusercontent.com/63099769/116782514-7ea53400-aac4-11eb-8eeb-9891fc54a4f4.png',
  };
  for (const key of keys) {
    const baseURL = keysOrigin[key];
    const inDir = fm.joinPath(fDir, '/weather');
    if (!fm.fileExists(inDir)) {
      fm.createDirectory(inDir);
    }
    const target = `/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/PX3/weather/${key}.png`;
    const image = await new Request(baseURL).loadImage();
    fm.writeImage(target, image);
  }
  console.log('날씨 아이콘을 모두 다운로드했습니다.');
}

async function fetchWeatherData(url) {
  const request = new Request(url);
  return await request.loadJSON();
}

let weatherUrl;
if (CITY_WEATHER !== 'false') {
  weatherUrl = `https://api.openweathermap.org/data/2.5/weather?id=${CITY_WEATHER}&APPID=${API_WEATHER}&units=${TEMP_UNIT}`;
} else {
  let latLong = {};
  let LAT;
  let LON;
  try {
    Location.setAccuracyToHundredMeters();
    latLong = await Location.current();

    LAT = latLong.latitude;
    LON = latLong.longitude;

    fm.writeString(posPath, JSON.stringify(latLong));
  } catch (e) {
    if (fm.fileExists(posPath)) {
      const latLong = JSON.parse(fm.readString(posPath));

      LAT = latLong.latitude;
      LON = latLong.longitude;
    } else {
      throw new Error('캐시된 위치 정보가 존재하지 않습니다. 잠시 후 다시 시도해 보세요.');
    }
  }

  weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=${TEMP_UNIT}&appid=${API_WEATHER}`;
}

let weatherJSON;
let cityName; let weatherArray; let iconData;
try {
  weatherJSON = await fetchWeatherData(weatherUrl);
  cityName = weatherJSON.name;
  weatherArray = weatherJSON.weather;
  iconData = weatherArray[0].icon;
} catch (e) {
  if (fm.fileExists(dataPath)) {
    weatherJSON = JSON.parse(fm.readString(dataPath));
    // eslint-disable-next-line no-unused-vars
    cityName = weatherJSON.name;
    weatherArray = weatherJSON.weather;
    iconData = weatherArray[0].icon;
  } else {
    console.log(weatherJSON);
    throw new Error(
        '날씨 데이터를 불러오는 도중 오류가 발생했습니다. API Key를 정확하게 입력하셨는지 확인해주세요.\n' +
        'Openweather 날씨 서비스가 등록된 후 활성화되기까지 시간이 최대 몇 시간 소요될 수 있으니 잠시 후 다시 시도해보세요.',
    );
  }
}

await fm.writeString(dataPath, JSON.stringify(weatherJSON));

let offlineMode;
try {
  await new Request('https://pastebin.com/raw/94LKAJvT').loadString();
  offlineMode = false;
} catch (e) {
  offlineMode = true;
}

// eslint-disable-next-line no-unused-vars
const weatherName = weatherArray[0].main;
const curTempObj = weatherJSON.main;
const curTemp = curTempObj.temp;
// eslint-disable-next-line no-unused-vars
const highTemp = curTempObj.temp_max;
// eslint-disable-next-line no-unused-vars
const lowTemp = curTempObj.temp_min;
// eslint-disable-next-line no-unused-vars
const feelsLike = curTempObj.feels_like;

// Weather Done!

function formatDate(format, date) {
  date = date || new Date();
  const df = new DateFormatter();
  df.locale = prefData.locale;
  df.dateFormat = format;
  return df.string(date);
}

// Holiday customization
const holidaysByKey = {
  // month, week, day: date text
  '11,4,4': 'Happy Thanksgiving!',
};

const holidaysByDate = {
  // month,date: greeting
  '1,1': 'Happy ' + (today.getFullYear()).toString() + '!',
  '10,31': 'Happy Halloween!',
  '12,25': 'Merry Christmas!',
};

const holidayKey =
    `${(today.getMonth() + 1).toString()},${(Math.ceil(today.getDate() / 7)).toString()},${(today.getDay()).toString()}`;

const holidayKeyDate = `${(today.getMonth() + 1).toString()},${(today.getDate()).toString()}`;

const dateString = formatDate(prefData.dateformat, today);

// Support for multiple greetings per time period
// eslint-disable-next-line no-unused-vars
function randomGreeting(greetingArray) {
  return Math.floor(Math.random() * greetingArray.length);
}

// Greeting Label procedure
let greeting = String('Dokdo is Korea\'s Territory');
if (prefData.quotemode === 'true') {
  greeting = prefData.greeting0;
} else {
  if (5 <= hour && hour <= 11) { // 5am - 11am
    greeting = prefData.greeting1 + ', ' + USERNAME;
  } else if (12 <= hour && hour <= 17) { // 12pm - 5pm
    greeting = prefData.greeting2 + ', ' + USERNAME;
  } else if (18 <= hour && hour <= 21) { // 6pm - 9pm
    greeting = prefData.greeting3 + ', ' + USERNAME;
  } else if (22 <= hour && hour <= 23) { // 10pm - 11pm
    greeting = prefData.greeting4 + ', ' + USERNAME;
  } else if (0 <= hour && hour <= 4) { // 12am - 4am
    greeting = prefData.greeting5 + ', ' + USERNAME;
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
const pwidget = new ListWidget();

const now = new Date().getTime();

for (const event of events) {
  if (futureEvents.length === 1) {
    break;
  } // Getting one event
  if (event.startDate.getTime() > today.getTime() && !event.isAllDay) {
    if (Math.floor((event.startDate.getTime() - now) / (1000 * 60) / 60) <= 6) {
      // If event is less than 6 hours ahead
      futureEvents.push(event);
    }
  }
}

const img = await fetchWeatherIcon(iconData);

function tintIcon(object) {
  if (prefData.iconcolor !== 'default') {
    object.tintColor = ICON_COLOR;
  }
}

if (futureEvents.length !== 0 && prefData.event === 'true') { // has event
  pwidget.addSpacer(layoutData.padding2.Pixel);

  const futureEvent = futureEvents[0];

  const target = futureEvent.startDate.getTime();
  const distance = target - now;
  const eventMinute = Math.floor(distance / (1000 * 60) % 60);
  const eventHour = Math.floor(distance / (1000 * 60) / 60);


  const eventLabel = pwidget.addText(`${futureEvent.title} in ${eventHour} hr ${eventMinute} min`);
  eventLabel.font = new Font(FONT_NAME_BOLD, TEXT_SIZE);
  eventLabel.textColor = TEXT_COLOR;
  eventLabel.url = 'calshow://';
  eventLabel.centerAlignText();

  pwidget.addSpacer(8);

  // Second Line
  const hStack = pwidget.addStack();
  hStack.layoutHorizontally();
  hStack.addSpacer();

  // Calendar SFSymbol Icon
  const calSymbol = SFSymbol.named('calendar');
  const calElement = hStack.addImage(calSymbol.image);
  calElement.imageSize = new Size(18, 18);
  calElement.tintColor = Color.white();
  tintIcon(calElement);
  calElement.imageOpacity = 0.6;

  // Event Duration
  const duration = hStack.addText(
      ` ${formatTime(futureEvent.startDate)} - ${formatTime(futureEvent.endDate)}  `,
  );
  duration.font = new Font(FONT_NAME, 16);
  duration.textColor = TEXT_COLOR;
  duration.textOpacity = (0.7);

  const inStack = hStack.addStack();
  inStack.layoutVertically();
  inStack.addSpacer(2);

  // Weather Icon
  const weatherIcon = inStack.addImage(img);
  weatherIcon.imageSize = new Size(16, 16);
  weatherIcon.centerAlignImage();
  tintIcon(weatherIcon);

  // Temperature Label
  const tempLabel = hStack.addText(` ${Math.round(curTemp).toString()}${TEMP_TEXT}`);
  tempLabel.font = new Font(FONT_NAME, 16);
  tempLabel.textColor = TEXT_COLOR;
  tempLabel.textOpacity = (0.7);
  tempLabel.centerAlignText();

  tempLabel.url = 'https://openweathermap.org/city/' + CITY_WEATHER;
  weatherIcon.url = 'https://openweathermap.org/city/' + CITY_WEATHER;

  // Show Battery Icon and Percent
  // batteryModule(hStack)

  hStack.addSpacer();
} else if (LAYOUT_MODE === 'Days') {
  pwidget.addSpacer(SPACING); // Top Spacing

  // Show dday
  const ddayLabel = pwidget.addText(
      countDayPrecise(
          layoutData.ddayname,
          layoutData.ddaytarg,
      ),
  );
  ddayLabel.font = new Font(FONT_NAME_BOLD, TEXT_SIZE);
  ddayLabel.textColor = TEXT_COLOR;
  ddayLabel.centerAlignText();

  pwidget.addSpacer(8);

  // Second Line
  const hStack = pwidget.addStack();
  hStack.layoutHorizontally();
  hStack.addSpacer();

  const inStack = hStack.addStack();
  inStack.layoutVertically();
  inStack.addSpacer(1);

  // Gift SFSymbol Icon
  const ddaySymbol = SFSymbol.named('app.gift.fill');
  const ddayElement = inStack.addImage(ddaySymbol.image);
  ddayElement.imageSize = new Size(17, 17);
  ddayElement.tintColor = Color.white();
  ddayElement.imageOpacity = 0.6;
  ddayElement.tintColor = Color.white();
  tintIcon(ddayElement);

  hStack.addSpacer(4);
  // Event Duration
  const df0 = new DateFormatter();
  df0.useLongDateStyle();
  df0.locale = prefData.locale;
  date = new Date(layoutData.ddaytarg);
  const ddayTarget = hStack.addText(df0.string(date));
  ddayTarget.font = new Font(FONT_NAME, 16);
  ddayTarget.textColor = TEXT_COLOR;
  ddayTarget.textOpacity = (0.7);

  hStack.addSpacer(8);

  const inStack2 = hStack.addStack();
  inStack2.layoutVertically();
  inStack2.addSpacer(1);

  // Weather Icon
  const weatherIcon = inStack2.addImage(img);
  weatherIcon.imageSize = new Size(18, 18);
  weatherIcon.centerAlignImage();
  tintIcon(weatherIcon);

  // Temperature Label
  const tempLabel = hStack.addText(
      ' ' + Math.round(curTemp).toString() + TEMP_TEXT,
  );
  tempLabel.font = new Font(FONT_NAME, 16);
  tempLabel.textColor = TEXT_COLOR;
  tempLabel.textOpacity = (0.7);
  tempLabel.centerAlignText();

  hStack.addSpacer();

  tempLabel.url = 'https://openweathermap.org/city/' + CITY_WEATHER;
  weatherIcon.url = 'https://openweathermap.org/city/' + CITY_WEATHER;
} else if (LAYOUT_MODE === 'Pixel') { // pixel layout
  pwidget.addSpacer(SPACING); // Top Spacing

  const hStack = pwidget.addStack();
  hStack.layoutHorizontally();
  hStack.addSpacer();

  // Show Date
  const dateLabel = hStack.addText(dateString);
  dateLabel.font = new Font(FONT_NAME_BOLD, TEXT_SIZE);
  dateLabel.textColor = TEXT_COLOR;

  hStack.addSpacer(8);

  const inLine = hStack.addStack();
  inLine.layoutVertically();
  inLine.addSpacer(5);

  const vertLine = inLine.addStack();
  vertLine.size = new Size(1, TEXT_SIZE - 4);
  vertLine.backgroundColor = new Color('#fff');

  hStack.addSpacer(8);

  const inStack = hStack.addStack();
  inStack.layoutVertically();
  inStack.addSpacer(3);

  // Weather Icon
  const weatherIcon = inStack.addImage(img);
  weatherIcon.imageSize = new Size(ICON_SIZE, ICON_SIZE);
  weatherIcon.centerAlignImage();
  tintIcon(weatherIcon);

  hStack.addSpacer(3);

  // Temperature Label
  const tempLabel = hStack.addText(Math.round(curTemp).toString() + TEMP_TEXT);
  tempLabel.font = new Font(FONT_NAME, TEXT_SIZE);
  tempLabel.textColor = TEXT_COLOR;
  tempLabel.centerAlignText();

  tempLabel.url = 'https://www.weather.go.kr/w/index.do';
  weatherIcon.url = 'https://www.weather.go.kr/w/index.do';

  hStack.addSpacer();

  if (prefData.hideb === 'false') {
    // Second Line
    pwidget.addSpacer(8);

    const hStack2 = pwidget.addStack();
    hStack2.layoutHorizontally();

    hStack2.addSpacer();
    batteryModule(hStack2);
    hStack2.addSpacer();
  }
} else if (LAYOUT_MODE === 'Siri') { // siri layout
  pwidget.addSpacer(SPACING); // Top Spacing

  // Greeting label; First Line
  const greetingLabel = pwidget.addText(greeting);
  greetingLabel.font = new Font(FONT_NAME_BOLD, TEXT_SIZE);
  greetingLabel.textColor = TEXT_COLOR;
  greetingLabel.centerAlignText();

  pwidget.addSpacer(8);

  // Second Line
  const hStack = pwidget.addStack();
  hStack.layoutHorizontally();
  hStack.addSpacer();

  // Date Label
  const dateLabel = hStack.addText(dateString);
  dateLabel.font = new Font(FONT_NAME, 16);
  dateLabel.textColor = TEXT_COLOR;
  dateLabel.textOpacity = (0.7);

  hStack.addSpacer(10);

  // Icon Aligner
  const inStack = hStack.addStack();
  inStack.layoutVertically();
  inStack.addSpacer(2);

  // Weather Icon
  const weatherIcon = inStack.addImage(img);
  weatherIcon.imageSize = new Size(16, 16);
  weatherIcon.centerAlignImage();
  tintIcon(weatherIcon);

  hStack.addSpacer(3);

  // Temperature Label
  const tempLabel = hStack.addText(Math.round(curTemp).toString() + TEMP_TEXT);
  tempLabel.font = new Font(FONT_NAME, 16);
  tempLabel.textColor = TEXT_COLOR;
  tempLabel.textOpacity = (0.7);
  tempLabel.centerAlignText();

  tempLabel.url = 'https://openweathermap.org/city/' + CITY_WEATHER;
  weatherIcon.url = 'https://openweathermap.org/city/' + CITY_WEATHER;

  if (prefData.hideb === 'false') {
    hStack.addSpacer(9);

    // Show Battery Icon and Percent
    batteryModule(hStack);
  }

  hStack.addSpacer();
}

/*
여기부터 플러그인 코드입니다.
*/

const progData = JSON.parse(fm.readString(progPath));

const pgLayout = progData.layout;
const pgColor = new Color(progData.color);

const inSpacerVal = 2.5;
// 아이콘과 라벨의 줄 밀림을 막기 위해 아이콘을 수직으로 약간 내립니다.
// 이 값을 조정하면서 폰트와 간격을 맞춰보세요.

pwidget.addSpacer(10);

if (progData.minimemo.length > 0) {
  pwidget.addSpacer(5);
  const mStack = pwidget.addStack();
  mStack.layoutHorizontally();
  if (pgLayout >= 0) {
    mStack.addSpacer();
  }

  const inStack1 = mStack.addStack();
  inStack1.layoutVertically();
  inStack1.addSpacer(inSpacerVal + 0.5);

  const icon1 = inStack1.addImage(SFSymbol.named('pencil.and.outline').image);
  icon1.imageSize = new Size(9, 9);
  icon1.tintColor = pgColor;
  mStack.addSpacer(2.5);

  const mLabel = mStack.addText(progData.minimemo);
  mLabel.font = new Font(FONT_NAME, 12);
  mLabel.textColor = TEXT_COLOR;
  mLabel.textOpacity = 0.8;
  if (pgLayout <= 0) {
    mStack.addSpacer();
  }
}

if (progData.minidday[0].length > 0) {
  pwidget.addSpacer(5);
  const cdStack = pwidget.addStack();
  cdStack.layoutHorizontally();
  if (pgLayout >= 0) {
    cdStack.addSpacer();
  }

  const inStack1 = cdStack.addStack();
  inStack1.layoutVertically();
  inStack1.addSpacer(inSpacerVal);

  const icon1 = inStack1.addImage(SFSymbol.named('staroflife.fill').image);
  icon1.imageSize = new Size(10, 10);
  icon1.tintColor = pgColor;
  cdStack.addSpacer(2);

  const cdLabel = cdStack.addText(countDayPrecise(progData.minidday[1], progData.minidday[0]));
  cdLabel.font = new Font(FONT_NAME, 12);
  cdLabel.textColor = TEXT_COLOR;
  cdLabel.textOpacity = 0.8;
  if (pgLayout <= 0) {
    cdStack.addSpacer();
  }
}

if (progData.covidkr1 === true && !offlineMode) {
  const cDir = fm.joinPath(fm.documentsDirectory(), '/coronaAlpha');
  if (!fm.fileExists(cDir + '/index.js')) {
    fm.createDirectory(cDir);
  }
  fm.writeString(
      `${cDir}/index.js`,
      await new Request('https://github.com/unvsDev/corona-alpha/raw/main/exportModule.js').loadString(),
  );
  const cModule = await importModule('/coronaAlpha');
  await cModule.getData();
  const currentData = await cModule.getCurrent();
  const currentCnt = currentData[0];
  const currentGap = currentData[1];
  const totalGap = await cModule.getPrevTot();
  pwidget.addSpacer(5);
  const cStack = pwidget.addStack();
  cStack.layoutHorizontally();
  if (pgLayout >= 0) {
    cStack.addSpacer();
  }
  const cSymbol = SFSymbol.named('sun.min.fill');
  const inStack = cStack.addStack();
  inStack.layoutVertically();
  inStack.addSpacer(inSpacerVal);
  const cIcon = inStack.addImage(cSymbol.image);
  cIcon.tintColor = pgColor;
  cIcon.imageSize = new Size(10, 10);
  cStack.addSpacer(3);
  const cLabel = cStack.addText(`코로나19: ${currentCnt}명 (${currentGap}명) • 어제: ${totalGap}명`);
  cLabel.font = new Font(FONT_NAME, 12);
  cLabel.textColor = new Color('#fff');
  cLabel.textOpacity = 0.8;
  cLabel.url = 'https://corona-live.com';
  if (pgLayout <= 0) {
    cStack.addSpacer();
  }
}

if (progData.covidkr2 === 'Kakao') {
  pwidget.addSpacer(5);
  const cStack2 = pwidget.addStack();
  cStack2.layoutHorizontally();
  if (pgLayout >= 0) {
    cStack2.addSpacer();
  }

  const inStack = cStack2.addStack();
  inStack.layoutVertically();
  inStack.addSpacer(inSpacerVal);

  const cSymbol2 = SFSymbol.named('person.2.square.stack.fill');
  const cIcon2 = inStack.addImage(cSymbol2.image);
  cIcon2.tintColor = pgColor;
  cIcon2.imageSize = new Size(10, 10);
  cStack2.addSpacer(3);

  let finStr = '카카오 QR 체크인';
  try {
    const tmpLen = progData.covidStr.length;
    if (tmpLen > 0) {
      finStr = '카카오 QR 체크인 • 개인안심번호: ' + progData.covidStr;
    }
  } catch (e) {
    finStr = '카카오 QR 체크인';
  }

  const cLabel2 = cStack2.addText(finStr);
  cLabel2.font = new Font(FONT_NAME, 12);
  cLabel2.textColor = new Color('#fff');
  cLabel2.textOpacity = 0.8;
  cLabel2.url = 'kakaotalk://con/web?url=https://accounts.kakao.com/qr_check_in';
  if (pgLayout <= 0) {
    cStack2.addSpacer();
  }
} else if (progData.covidkr2 === 'Naver') {
  pwidget.addSpacer(5);
  const cStack2 = pwidget.addStack();
  cStack2.layoutHorizontally();
  if (pgLayout >= 0) {
    cStack2.addSpacer();
  }

  const inStack = cStack2.addStack();
  inStack.layoutVertically();
  inStack.addSpacer(inSpacerVal);

  const cSymbol2 = SFSymbol.named('person.2.square.stack.fill');
  const cIcon2 = inStack.addImage(cSymbol2.image);
  cIcon2.tintColor = pgColor;
  cIcon2.imageSize = new Size(10, 10);
  cStack2.addSpacer(3);

  let finStr = '네이버 QR 체크인';
  try {
    const tmpLen = progData.covidStr.length;
    if (tmpLen > 0) {
      finStr = '네이버 QR 체크인 • 개인안심번호: ' + progData.covidStr;
    }
  } catch (e) {
    finStr = '네이버 QR 체크인';
  }

  const cLabel2 = cStack2.addText(finStr);
  cLabel2.font = new Font(FONT_NAME, 12);
  cLabel2.textColor = new Color('#fff');
  cLabel2.textOpacity = 0.8;
  cLabel2.url = 'https://nid.naver.com/login/privacyQR';
  if (pgLayout <= 0) {
    cStack2.addSpacer();
  }
}


// Optional Module
function batteryModule(stack) {
  const batInStack = stack.addStack();
  batInStack.layoutVertically();
  batInStack.addSpacer(0.7);

  const batteryImg = batInStack.addImage(renderBatteryIcon(Device.batteryLevel(), Device.isCharging()));
  batteryImg.tintColor = new Color(prefData.bColor, 0.7);
  tintIcon(batteryImg);
  batteryImg.imageSize = new Size(25, 18);
  const batteryText = stack.addText(' ' + renderBattery() + '%');
  batteryText.font = new Font(FONT_NAME, 16);
  batteryText.textColor = TEXT_COLOR;
  batteryText.textOpacity = (0.7);
  batteryText.centerAlignText();
}

function renderBattery() { // Getting Battery Level (Number)
  const batteryData = Device.batteryLevel();
  return Math.round(batteryData * 100);
}

function renderBatteryIcon( batteryLevel, charging = false ) { // Getting Battery Level (Icon)
  // If we're charging, show the charging icon.
  if (charging) {
    return SFSymbol.named('battery.100.bolt').image;
  }

  // Set the size of the battery icon.
  const batteryWidth = 87;
  const batteryHeight = 41;

  // Start our draw context.
  const draw = new DrawContext();
  draw.opaque = false;
  draw.respectScreenScale = true;
  draw.size = new Size(batteryWidth, batteryHeight);

  // Draw the battery.
  draw.drawImageInRect(SFSymbol.named('battery.0').image, new Rect(0, 0, batteryWidth, batteryHeight));

  // Match the battery level values to the SFSymbol.
  const x = batteryWidth*0.1525;
  const y = batteryHeight*0.247;
  const width = batteryWidth*0.602;
  const height = batteryHeight*0.505;

  // Prevent unreadable icons.
  let level = batteryLevel;
  if (level < 0.05) {
    level = 0.05;
  }

  // Determine the width and radius of the battery level.
  const current = width * level;
  let radius = height/6.5;

  // When it gets low, adjust the radius to match.
  if (current < (radius * 2)) {
    radius = current / 2;
  }

  // Make the path for the battery level.
  const barPath = new Path();
  barPath.addRoundedRect(new Rect(x, y, current, height), radius, radius);
  draw.addPath(barPath);
  draw.setFillColor(Color.black());
  draw.fillPath();
  return draw.getImage();
}

// Precise Day counting
function formatDefTime(date) {
  const df = new DateFormatter();
  df.useShortDateStyle();
  df.locale = '';
  return df.string(date);
}

function countDayPrecise(name, target) {
  const defToday = new Date(formatDefTime(new Date())).getTime();
  const defTarget = new Date(target).getTime();

  let gap = defTarget - defToday;
  gap = gap / (1000 * 60 * 60 * 24);
  const count = Math.ceil(gap);

  if (count === 0) {
    return `${name} is Today`;
  } else if (count === 1) {
    return `${count} day to ${name}`;
  } else if (count > 0) {
    return `${count} days to ${name}`;
  } else {
    return `${(count * -1) + 1} days from ${name}`;
  }
}

const photoEnable = true; // 포토콘 활성화
let spacerDone = false;

if (photoEnable && progData.photo.length > 0) {
  pwidget.addSpacer();
  spacerDone = true;

  const phStack = pwidget.addStack();
  phStack.layoutHorizontally();

  phStack.addSpacer();

  const mainImage = phStack.addImage(fm.readImage(fm.bookmarkedPath(progData.photo)));
  mainImage.imageSize = new Size(progData.photo2, progData.photo2);
  mainImage.cornerRadius = 25;
  mainImage.borderWidth = progData.frame;
  mainImage.borderColor = new Color(progData.frame2);

  phStack.addSpacer();
}

// Refresh Text
if (REFRESH_VIEW === 'true') {
  pwidget.addSpacer(3);
  const refreshText = pwidget.addText('Last Updated at ' + formatTime(today));
  refreshText.font = new Font(FONT_NAME, 13);
  refreshText.textColor = TEXT_COLOR;
  refreshText.textOpacity = (0.5);
  refreshText.centerAlignText();
}

// Bottom Spacer
pwidget.url = linkData;
if (spacerDone) {
  pwidget.addSpacer(3);
} else {
  pwidget.addSpacer();
}
pwidget.setPadding(0, 0, 0, 0);


const imgPath = fm.joinPath(fDir, 'light.png');
const imgPath2 = fm.joinPath(fDir, 'dark.png');

// Widget Background
if (wallData.mode === 1) {
  fm.downloadFileFromiCloud(imgPath);
  if (fm.fileExists(imgPath2)) {
    fm.downloadFileFromiCloud(imgPath2);
  }
  if (darkMode && fm.fileExists(imgPath2)) {
    pwidget.backgroundImage = fm.readImage(imgPath2);
  } else {
    pwidget.backgroundImage = fm.readImage(imgPath);
  }
} else if (wallData.mode === 0) {
  pwidget.backgroundColor = new Color(wallData.color);
} else {
  let bgImagePath;
  if (darkMode && wallData.book2 !== '') {
    bgImagePath = fm.bookmarkedPath(wallData.book2);
  } else {
    bgImagePath = fm.bookmarkedPath(wallData.book1);
  }
  pwidget.backgroundImage = fm.readImage(bgImagePath);
}

pwidget.refreshAfterDate = new Date(Date.now() + 1000 * parseInt(prefData.refreshrate)); // Refresh every 120 Second

// Set widget
Script.setWidget(pwidget);

if (PREVIEW_MODE === 'true') {
  if (PREVIEW_SIZE === 'small') {
    pwidget.presentSmall();
  }
  if (PREVIEW_SIZE === 'medium') {
    pwidget.presentMedium();
  }
  if (PREVIEW_SIZE === 'large') {
    pwidget.presentLarge();
  }
}

Script.complete();
