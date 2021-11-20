// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: cog;
// Pixel Launcher - by unvsDev
// Customize your Pixel Widget!

// Unauthorized Redistribute is Strictly prohibited.
// 본 위젯은 무단 재배포 및 복제가 엄격히 금지되어 있습니다. 자세한 내용은 제공처에 문의하시기 바랍니다.

// 최적의 사용자 경험을 위해 픽셀 위젯과 동일한 버전의 런처를 이용하시는 것을 추천드립니다.

// Pro로 업그레이드하세요: https://widget.oopy.io/plus


const version = '3.1';
// eslint-disable-next-line no-unused-vars
const plName = Script.name();

let enableSuggestions = true; // 기능 제안 표시

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

const defaultJSON = {
  'apikey': '',
  'cityid': 'false',
  'username': '픽셀님',
  'tempunit': 'metric',
  'locale': 'ko-kr',
  'textcolor': '#ffffff',
  'textsize': '25.5',
  'iconcolor': 'default',
  'iconsize': '24',
  'font': 'Product Sans',
  'fontbold': 'Product Sans Medium',
  'previewmode': 'true',
  'previewsize': 'large',
  'refreshview': 'false',
  'greeting1': '좋은 아침입니다',
  'greeting2': '좋은 점심입니다',
  'greeting3': '좋은 오후입니다',
  'greeting4': '좋은 저녁입니다',
  'greeting5': '주무실 시간입니다',
  'greeting0': 'PX3에 오신 것을 환영합니다',
  'dateformat': 'MMMM d일 EEEE',
  'quotemode': 'false',
  'refreshrate': '90',
  'hideb': 'false',
  'event': 'true',
  'bColor': '#fff',
};

const optionName = {
  'apikey': '날씨 서비스 API Key',
  'cityid': '날씨 수집 위치 설정',
  'username': '닉네임',
  'tempunit': '온도 표시 단위',
  'locale': '지역 설정',
  'textcolor': '텍스트 색',
  'textsize': '텍스트 크기',
  'iconcolor': '아이콘 색',
  'iconsize': '아이콘 크기',
  'bColor': '배터리 색',
  'font': '폰트',
  'fontbold': '폰트 (볼드체)',
  'previewmode': '미리보기 모드',
  'previewsize': '미리보기 크기',
  'refreshview': '리프레시 시간 보이기',
  'greeting1': '아침 인사말',
  'greeting2': '점심 인사말',
  'greeting3': '오후 인사말',
  'greeting4': '저녁 인사말',
  'greeting5': '새벽 인사말',
  'greeting0': '고정된 인사말',
  'dateformat': '날짜 포맷',
  'quotemode': '고정된 인사말을 사용할까요?',
  'refreshrate': '위젯 리프레시 주기',
  'hideb': '배터리 아이콘을 숨길까요?',
  'event': '이벤트를 위젯에 표시할까요?',
};

const optionFormat = {
  'apikey': '오픈웨더를 이용해 날씨 정보를 표시합니다. API 등록 방법은 제공처를 참고해 주세요.',
  'cityid': '날씨 정보를 받을 위치를 설정하세요.\n- false : GPS 기반 실시간 위치로 설정\n- 또는 해당 위치의 City ID 입력\n관련 정보는 제공처를 참고해 주세요.',
  'username': '고정된 인사말이 아닐 경우, 위젯에 "인사말, 닉네임" 로 표시됩니다.',
  'tempunit': '위젯에 표시할 온도의 단위를 설정하세요. 섭씨, 화씨를 선택하실 수 있습니다. (metric, imperial)',
  'locale': '위젯에 표시할 텍스트를 현지화할 수 있습니다. 설정할 국가 코드를 입력하세요.',
  'textcolor': '위젯에 표시되는 텍스트의 색상을 설정하세요.\n색 Hex 코드 - 직접 색상 설정\nauto - 화면 모드에 따라 자동 설정',
  'textsize': '위젯에 표시되는 텍스트의 크기를 설정하세요.',
  'iconcolor': '위젯에 표시되는 아이콘의 색상을 설정하세요.\ndefault - 기본 색상\n색 Hex 코드 - 직접 색상 설정\nauto - 화면 모드에 따라 자동 설정',
  'iconsize': '위젯에 표시되는 아이콘의 크기를 설정하세요.',
  'bColor': '색 Hex 코드 - 직접 색상 설정',
  'font': '위젯에 표시할 텍스트의 폰트를 개인설정할 수 있습니다. 프로파일에 나타나는 영어 폰트 이름을 정확하게 입력해주세요!',
  'fontbold': '위젯에 표시할 텍스트의 볼드체 폰트를 개인설정할 수 있습니다. 프로파일에 나타나는 영어 폰트 이름을 정확하게 입력해주세요!',
  'previewmode': '위젯을 앱에서 실행했을 때 미리보기를 보여줍니다.',
  'previewsize': '미리보기의 위젯 사이즈를 선택합니다. (small, medium, large)',
  'refreshview': '마지막으로 리프레시된 시간을 위젯 하단에 표시합니다.',
  'greeting1': '오전 5시 ~ 11시 사이에 표시될 인사말을 설정해주세요.',
  'greeting2': '오후 12시 ~ 5시 사이에 표시될 인사말을 설정해주세요.',
  'greeting3': '오후 6시 ~ 9시 사이에 표시될 인사말을 설정해주세요.',
  'greeting4': '오후 10시 ~ 11시 사이에 표시될 인사말을 설정해주세요.',
  'greeting5': '오전 12시 ~ 4시 사이에 표시될 인사말을 설정해주세요.',
  'greeting0': '인사말을 명언, 기분 등으로 고정해서 표시해보세요! 고정된 인사말을 사용할 텍스트를 설정해주세요.',
  'dateformat': '위젯에 표시되는 날짜 텍스트의 포맷을 설정해주세요.\n기본값: 1월 1일 월요일 (Date Format)',
  'quotemode': '인사말을 시간에 관계없이 하나로 표시합니다. 고정된 인사말 옵션에서 표시할 텍스트를 설정하실 수 있습니다.',
  'refreshrate': '위젯의 리프레시 주기를 설정합니다. iOS 위젯 정책에 의해 리프레시 주기가 일부 지연될 수 있습니다.',
  'hideb': '위젯 레이아웃에서 배터리 상태 표시를 숨깁니다.',
  'event': '이벤트 레이아웃을 위젯에 표시합니다.',
};

const orgProgData = {
  'layout': 0,
  'color': '#615cff',
  'covidkr1': false,
  'covidkr2': 'Hide',
  'covidstr': '',
  'minimemo': '',
  'minidday': ['', ''],
  'photo': '',
  'photo2': 80,
  'frame': 8,
  'frame2': '#fff',
};

let welcomeMode = 0;

if (!fm.fileExists(prefPath)) {
  welcomeMode = 1;
  await fm.writeString(prefPath, JSON.stringify(defaultJSON));
}

if (!(fm.fileExists(progPath))) {
  await fm.writeString(progPath, JSON.stringify(orgProgData));
}

fm.downloadFileFromiCloud(prefPath);
fm.downloadFileFromiCloud(progPath);

let prefData = JSON.parse(fm.readString(prefPath));
let progData = JSON.parse(fm.readString(progPath));

// Auto Update Preferences
let cnt = 0;
for (const i in defaultJSON) {
  if (prefData[i] === undefined) {
    cnt = cnt + 1;
    prefData[i] = defaultJSON[i];
    console.log('[!] 초기값 업데이트 중.. (' + cnt + ')');
  }
}

// Auto Update Preferences (Plugin)
for (const i in orgProgData) {
  if (progData[i] === undefined) {
    cnt = cnt + 1;
    progData[i] = orgProgData[i];
    console.log('[!] 초기값 업데이트 중.. (' + cnt + ')');
  }
}

if (cnt) {
  await fm.writeString(prefPath, JSON.stringify(prefData));
  await fm.writeString(progPath, JSON.stringify(progData));

  const upAlert = new Notification();
  upAlert.title = '픽셀 위젯 업데이트 완료';
  upAlert.body = '위젯 데이터가 최신으로 업데이트되었습니다! 💛';
  await upAlert.schedule();
}

const layoutJSON0 = {
  'layout': 'Siri',
  'event': 'Pixel',
  'ddayname': '크리스마스',
  'ddaytarg': '2021-12-25',
  'padding': {
    'Pixel': 45,
    'Siri': 45,
    'Days': 45,
  },
  'padding2': {
    'Pixel': 45,
  },
};
if (!fm.fileExists(layoutPath)) {
  fm.writeString(layoutPath, JSON.stringify(layoutJSON0));
}

const wallJSON = {
  mode: 0,
  color: '#748e54',
  book1: 'light',
  book2: 'dark',
};
if (!fm.fileExists(wallPath)) {
  fm.writeString(wallPath, JSON.stringify(wallJSON));
}

if (welcomeMode) {
  const wAlert = new Alert();
  wAlert.title = '환영합니다 🤩';
  wAlert.message = '픽셀 위젯에 오신 것을 환영합니다!\n시작하기 전에, Pixel 스타일의 멋진 폰트를 설치해 보세요.';
  wAlert.addCancelAction('네!');
  wAlert.addAction('괜찮아요');
  const response = await wAlert.present();

  if (response === -1) {
    const fontURL = await new Request('https://pastebin.com/raw/rfHS7Xey').loadString();
    await Safari.openInApp(fontURL, false);
  }
}

async function updateCode(newVer) {
  const widgetCode = await new Request(
      'https://raw.githubusercontent.com/unvsDev/pixel-widget/main/Pixel%20Widget.js',
  ).loadString();
  const launcherCode = await new Request(
      'https://github.com/unvsDev/pixel-widget/raw/main/Pixel%20Launcher.js',
  ).loadString();

  await fm.writeString(fm.joinPath(fm.documentsDirectory(), 'Pixel Launcher v' + version + '.js'), launcherCode);
  await fm.writeString(fm.joinPath(fm.documentsDirectory(), 'Pixel Widget v' + version + '.js'), widgetCode);

  const upAlert = new Notification();
  upAlert.title = '픽셀 위젯 업데이트 완료';
  upAlert.body = '위젯 코드가 최신으로 업데이트되었습니다! 💛';
  await upAlert.schedule();

  Safari.open('scriptable:///run/Pixel%20Launcher%20v' + newVer);
  return 0;
}


async function showMainPanel() {
  if (!enableSuggestions) {
    let suggestionsData;
    try {
      suggestionsData = await new Request('https://pastebin.com/raw/0QhBLLmH').loadString();
    } catch (e) {
      suggestionsData = '0';
    }
    if (suggestionsData === '1') {
      enableSuggestions = true;
    }
  }

  let latestVersion;
  try {
    latestVersion = await new Request('https://pastebin.com/raw/LyeJejyX').loadString();
  } catch (e) {
    latestVersion = version;
  }

  const pxPanel = new UITable();
  pxPanel.showSeparators = true;

  function loadAllRows() {
    const title = new UITableRow();
    title.isHeader = true;
    title.height = 120;
    title.addText(welcomeMode ? 'PX3에 오신 것을 환영합니다!' : 'Pixel Widget', '버전 ' + version + ' - developed by unvsDev');
    pxPanel.addRow(title);

    if (latestVersion !== version) {
      const updater = new UITableRow();
      updater.isHeader = true;
      updater.height = 70;
      updater.addText('✈️ 업데이트 가능', '확인된 최신 버전: v' + latestVersion);
      pxPanel.addRow(updater);

      const updateBt = UITableCell.button('지금 설치');
      updateBt.rightAligned();
      updater.addCell(updateBt);

      updateBt.onTap = async () => {
        const upAlert = new Alert();
        upAlert.title = '지금 업데이트를 설치할까요?';
        upAlert.message = '기존 위젯 코드가 최신으로 병합됩니다. 위젯 내부 데이터는 유지됩니다.';
        upAlert.addAction('지금 설치');
        upAlert.addCancelAction('취소');
        const response = await upAlert.present();

        if (response !== -1) {
          await updateCode(latestVersion);
        }
      };
    }

    const shortcut = new UITableRow();
    shortcut.isHeader = true;
    shortcut.height = 50;
    shortcut.addText('위젯 미리보기');
    shortcut.onSelect = () => {
      Safari.open('scriptable:///run/Pixel%20Widget%20v' + version);
      return 0;
    };
    pxPanel.addRow(shortcut);

    const menuOptions = ['일반 설정', '레이아웃 설정', '배경화면 설정', '하위 요소 편집', '기타 설정'];
    for (const menuOption of menuOptions) {
      const option = new UITableRow();
      option.height = 60;
      option.addText(menuOption);
      option.dismissOnSelect = false;

      option.onSelect = async (number) => {
        number = number - 1;
        if (number === 1) {
          await showPrefPanel();
        } else if (number === 2) {
          await showLayoutPanel();
        } else if (number === 3) {
          await showWallPanel();
        } else if (number === 4) {
          await showPluginPanel();
        } else if (number === 5) {
          await showSettingPanel();
        }
      };

      pxPanel.addRow(option);
    }
  }

  loadAllRows();
  await pxPanel.present();
}

await showMainPanel();

async function showLayoutPanel() {
  const layoutData = JSON.parse(fm.readString(layoutPath));

  const settings = new UITable();
  settings.showSeparators = true;

  function loadAllRows() {
    const settingsTitle = new UITableRow();
    settingsTitle.isHeader = true;
    settingsTitle.addText('레이아웃 설정', '위젯의 구성을 다양하게 변경해보세요!');
    settingsTitle.height = 120;
    settings.addRow(settingsTitle);

    const scSample = {
      'Pixel': 'https://user-images.githubusercontent.com/63099769/109387541-50c93500-7945-11eb-9e24-3f95c4f5e682.jpeg',
      'Siri': 'https://user-images.githubusercontent.com/63099769/109390104-fa62f300-7952-11eb-9a95-6a6852b3e7c5.jpeg',
      'Days': 'https://user-images.githubusercontent.com/63099769/109390154-339b6300-7953-11eb-995c-2251da1085c6.jpeg',
      'Event': 'https://user-images.githubusercontent.com/63099769/111494628-f96af780-8781-11eb-8c21-7928f2038ba4.jpeg',
      'Special': 'https://user-images.githubusercontent.com/63099769/109390205-90971900-7953-11eb-894f-7effb0c4eac7.jpeg',
      'Silk': 'https://user-images.githubusercontent.com/63099769/109473605-d91b1780-7ab6-11eb-853d-68e07e955d1c.jpeg',
    };

    const photo = new UITableRow();
    photo.height = 380;
    const img = UITableCell.imageAtURL(scSample[layoutData.layout]);

    photo.addCell(img);
    settings.addRow(photo);

    const mode = new UITableRow();
    mode.height = 70;

    const mtitle = UITableCell.text('메인 레이아웃');
    mtitle.leftAligned();
    mode.addCell(mtitle);

    const mtitle2 = UITableCell.text(layoutData.layout);
    mtitle2.leftAligned();
    mtitle2.titleFont = Font.boldMonospacedSystemFont(16);
    mtitle2.titleColor = new Color('#e9897e');
    mode.addCell(mtitle2);

    const current = UITableCell.button('편집');
    current.rightAligned();
    mode.addCell(current);

    current.onTap = async () => {
      const moder = new UITable();
      moder.showSeparators = true;

      const title = new UITableRow();
      title.isHeader = true;
      title.addText('위젯 레이아웃 설정', '픽셀 위젯을 다양한 레이아웃으로 꾸며보세요!');
      title.height = 120;
      moder.addRow(title);

      const bt1 = new UITableRow();
      bt1.addText('Pixel', '오리지널 픽셀 스타일을 구성해보세요.');
      bt1.height = 60;
      bt1.dismissOnSelect = true;
      moder.addRow(bt1);

      bt1.onSelect = () => {
        layoutData.layout = 'Pixel';
      };

      const bt2 = new UITableRow();
      bt2.addText('Siri', '맞춤형 인사말과 함께 독특한 스타일의 위젯을 만들어보세요.');
      bt2.height = 60;
      bt2.dismissOnSelect = true;
      moder.addRow(bt2);

      bt2.onSelect = () => {
        layoutData.layout = 'Siri';
      };

      const btd = new UITableRow();
      btd.addText('Days', '디데이에 집중해 홈 화면을 새롭게 바꾸어보세요.');
      btd.height = 60;
      btd.dismissOnSelect = true;
      moder.addRow(btd);

      btd.onSelect = () => {
        layoutData.layout = 'Days';
      };

      if (enableSuggestions) {
        const bt3 = new UITableRow();
        bt3.addText('Event', '다가올 이벤트에 집중할 수 있도록 위젯을 구성하세요.');
        bt3.height = 60;
        bt3.dismissOnSelect = true;
        moder.addRow(bt3);

        bt3.onSelect = async () => {
          await showTeaserLayout('Event', scSample.Event);
        };

        const bt4 = new UITableRow();
        bt4.addText('Special', '심플하면서도 특별한, 개발자 커스텀 레이아웃입니다.');
        bt4.height = 60;
        bt4.dismissOnSelect = true;
        moder.addRow(bt4);

        bt4.onSelect = async () => {
          await showTeaserLayout('Special', scSample.Special);
        };

        const bt5 = new UITableRow();
        bt5.addText('Silk', 'Android 12의 스타일로 위젯을 꾸며보세요.');
        bt5.height = 60;
        bt5.dismissOnSelect = true;
        moder.addRow(bt5);

        bt5.onSelect = async () => {
          await showTeaserLayout('Silk', scSample.Silk);
        };
      }

      await moder.present();

      refreshAllRows();
    };

    settings.addRow(mode);

    const padding = new UITableRow();
    padding.dismissOnSelect = false;
    padding.height = 70;
    padding.addText('상단 여백 설정', layoutData['padding'][layoutData.layout].toString());

    settings.addRow(padding);

    padding.onSelect = async () => {
      const alert = new Alert();
      alert.title = '상단 여백을 설정하세요';
      alert.addTextField(
          layoutData.padding[layoutData.layout].toString(),
          layoutData.padding[layoutData.layout].toString(),
      );
      alert.addAction('확인');
      alert.addCancelAction('취소');
      const response = await alert.present();

      if (response !== -1) {
        layoutData.padding[layoutData.layout] = parseInt(alert.textFieldValue());
        refreshAllRows();
      }
    };

    if (layoutData.layout === 'Days') {
      const daysName = new UITableRow();
      daysName.dismissOnSelect = false;
      daysName.height = 70;
      daysName.addText('디데이 이름', layoutData.ddayname);
      settings.addRow(daysName);

      daysName.onSelect = async () => {
        const alert = new Alert();
        alert.title = '디데이 이름을 입력하세요';
        alert.addTextField(layoutData.ddayname, layoutData.ddayname);
        alert.addAction('확인');
        alert.addCancelAction('취소');
        const response = await alert.present();

        if (response !== -1) {
          layoutData.ddayname = alert.textFieldValue();
          refreshAllRows();
        }
      };

      const daysDate = new UITableRow();
      daysDate.dismissOnSelect = false;
      daysDate.height = 70;
      daysDate.addText('디데이 날짜', layoutData.ddaytarg);
      settings.addRow(daysDate);

      daysDate.onSelect = async () => {
        const alert = new Alert();
        alert.title = '디데이 날짜를 입력하세요';
        alert.message = 'YYYY-MM-DD의 형태로 등록하세요!';
        alert.addTextField(layoutData.ddaytarg, layoutData.ddaytarg);
        alert.addAction('확인');
        alert.addCancelAction('취소');
        const response = await alert.present();

        if (response !== -1) {
          layoutData.ddaytarg = alert.textFieldValue();
          refreshAllRows();
        }
      };
    }

    const evSample = {
      'Pixel': 'https://user-images.githubusercontent.com/63099769/109392105-a4477d00-795d-11eb-987c-3c96afc42487.jpeg',
      'Silk': 'https://user-images.githubusercontent.com/63099769/116784447-30e1f900-aacf-11eb-8d47-10e32ae94942.jpeg',
    };

    const photo2 = new UITableRow();
    photo2.height = 380;
    const img2 = UITableCell.imageAtURL(evSample[layoutData.event]);

    photo2.addCell(img2);
    settings.addRow(photo2);

    const mode2 = new UITableRow();
    mode2.height = 70;

    const m2title = UITableCell.text('이벤트 레이아웃');
    m2title.leftAligned();
    mode2.addCell(m2title);

    const m2title2 = UITableCell.text(layoutData.event);
    m2title2.leftAligned();
    m2title2.titleFont = Font.boldMonospacedSystemFont(16);
    m2title2.titleColor = new Color('#b899ff');
    mode2.addCell(m2title2);

    const current2 = UITableCell.button('편집');
    current2.rightAligned();
    mode2.addCell(current2);

    current2.onTap = async () => {
      const moder = new UITable();
      moder.showSeparators = true;

      const title = new UITableRow();
      title.isHeader = true;
      title.addText('이벤트 레이아웃 설정', '다가오는 이벤트를 다양한 레이아웃으로 만나보세요.');
      title.height = 120;
      moder.addRow(title);

      const bt1 = new UITableRow();
      bt1.addText('Pixel', '간결한 구성과 함께 이벤트를 확인하세요.');
      bt1.height = 60;
      bt1.dismissOnSelect = true;
      moder.addRow(bt1);

      bt1.onSelect = () => {
        layoutData.event = 'Pixel';
      };

      if (enableSuggestions) {
        const bt2 = new UITableRow();
        bt2.addText('Silk', 'Android 12의 스타일로 이벤트를 확인하세요.');
        bt2.height = 60;
        bt2.dismissOnSelect = true;
        moder.addRow(bt2);

        bt2.onSelect = async () => {
          await showTeaserLayout('Silk', evSample.Silk);
        };
      }

      await moder.present();

      refreshAllRows();
    };

    settings.addRow(mode2);

    const padding2 = new UITableRow();
    padding2.dismissOnSelect = false;
    padding2.height = 70;
    padding2.addText('상단 여백 설정', layoutData['padding2'][layoutData.event].toString());

    settings.addRow(padding2);

    padding2.onSelect = async () => {
      const alert = new Alert();
      alert.title = '상단 여백을 설정하세요';
      alert.addTextField(
          layoutData.padding2[layoutData.event].toString(),
          layoutData.padding2[layoutData.event].toString(),
      );
      alert.addAction('확인');
      alert.addCancelAction('취소');
      const response = await alert.present();

      if (response !== -1) {
        layoutData.padding2[layoutData.event] = parseInt(alert.textFieldValue());
        refreshAllRows();
      }
    };
  }

  loadAllRows();
  await settings.present(false);

  await fm.writeString(layoutPath, JSON.stringify(layoutData));

  return 0;

  function refreshAllRows() {
    settings.removeAllRows();
    loadAllRows();
    settings.reload();
  }
}

async function showTeaserLayout(name, image) {
  const teaserPanel = new UITable();
  teaserPanel.showSeparators = false;

  const title = new UITableRow();
  title.isHeader = true;
  title.height = 120;
  title.addText('지금 Pro로 업그레이드하세요 🤩', '더 많은 위젯 레이아웃을 만나보세요!');
  teaserPanel.addRow(title);

  const photo = new UITableRow();
  photo.height = 380;
  const img = UITableCell.imageAtURL(image);

  photo.addCell(img);
  teaserPanel.addRow(photo);

  const text = new UITableRow();
  text.height = 70;
  text.isHeader = true;
  text.addText('🔓 잠금 해제하기', name + ' 레이아웃 및 다양한 기능 포함');
  text.dismissOnSelect = true;
  teaserPanel.addRow(text);

  text.onSelect = () => {
    Safari.openInApp('https://widget.oopy.io/plus', true);
  };

  const noThanks = getNoThanksTable('💩 괜찮아요', '기본 레이아웃 사용하기');
  teaserPanel.addRow(noThanks);

  await teaserPanel.present(true);
}

async function showWallPanel() {
  const wallOption = ['단색 배경', '이미지 파일', '파일 북마크', '투명 배경'];

  const wallData = JSON.parse(fm.readString(wallPath));

  const settings = new UITable();
  settings.showSeparators = true;

  function loadAllRows() {
    const settingsTitle = new UITableRow();
    settingsTitle.isHeader = true;
    settingsTitle.addText('배경화면 설정', '위젯의 배경화면을 설정할 수 있습니다.');
    settingsTitle.height = 120;
    settings.addRow(settingsTitle);

    const mode = new UITableRow();
    mode.height = 100;

    const mTitle = UITableCell.text('배경 모드');
    mTitle.leftAligned();
    mode.addCell(mTitle);

    const left = UITableCell.button('⬅️');
    const current = UITableCell.button(wallOption[wallData.mode]);
    const right = UITableCell.button('➡️');

    left.centerAligned();
    current.centerAligned();
    right.centerAligned();

    mode.addCell(left);
    mode.addCell(current);
    mode.addCell(right);

    left.onTap = () => {
      wallData.mode = wallData.mode === 0 ? 3 : wallData.mode - 1;
      refreshAllRows();
    };

    right.onTap = () => {
      wallData.mode = wallData.mode === 3 ? 0 : wallData.mode + 1;
      refreshAllRows();
    };

    current.onTap = async () => {
      const selector = new Alert();
      selector.title = '배경화면 모드 선택';
      for (const wallOptionItem of wallOption) {
        selector.addAction(wallOptionItem);
      }
      wallData.mode = await selector.present();
      refreshAllRows();
    };

    settings.addRow(mode);

    if (wallData.mode === 0) {
      const input = new UITableRow();
      input.dismissOnSelect = false;
      input.height = 70;
      input.addText('단색 Hex 입력', wallData.color);
      settings.addRow(input);

      input.onSelect = async () => {
        const alert = new Alert();
        alert.title = 'Hex 코드를 입력하세요';
        alert.addTextField(wallData.color, wallData.color);
        alert.addAction('확인');
        alert.addCancelAction('취소');

        const response = await alert.present();

        if (response !== -1) {
          wallData.color = alert.textFieldValue(0);
          refreshAllRows();
        }
      };
    }

    if (wallData.mode === 1) {
      const imgPath = fm.joinPath(fDir, 'light.png');
      const imgPath2 = fm.joinPath(fDir, 'dark.png');

      const input = new UITableRow();
      input.dismissOnSelect = false;
      input.height = 70;
      const lStr = fm.fileExists(imgPath) ? '✅ 설정되었습니다' : '❌ 설정되지 않았습니다';
      input.addText('기본 배경화면 지정', lStr);
      settings.addRow(input);

      input.onSelect = async () => {
        const dir = await DocumentPicker.open(['public.image']);
        const imgPath = fm.joinPath(fDir, 'light.png');

        await fm.writeImage(imgPath, await fm.readImage(dir[0]));

        refreshAllRows();
      };

      const input2 = new UITableRow();
      input2.dismissOnSelect = false;
      input2.height = 70;
      const dStr = fm.fileExists(imgPath2) ? '✅ 설정되었습니다' : '❌ 설정되지 않았습니다';
      input2.addText('다크 배경화면 지정 (선택)', dStr);
      settings.addRow(input2);

      input2.onSelect = async () => {
        const inAlert = new Alert();
        inAlert.title = '다크 배경화면을 사용할까요?';
        inAlert.addAction('켜기');
        inAlert.addAction('끄기');

        const response = await inAlert.present();
        if (response) {
          fm.remove(imgPath2);
          refreshAllRows();
        } else {
          const dir = await DocumentPicker.open(['public.image']);
          // eslint-disable-next-line no-unused-vars
          const imgPath = fm.joinPath(fDir, 'dark.png');

          await fm.writeImage(imgPath2, await fm.readImage(dir[0]));
          refreshAllRows();
        }
      };
    }

    if (wallData.mode === 2) {
      const input = new UITableRow();
      input.dismissOnSelect = false;
      input.height = 70;

      input.addText('기본 파일 북마크 지정', wallData.book1);
      settings.addRow(input);

      input.onSelect = async () => {
        const bm = new Alert();
        bm.title = '북마크 이름을 입력하세요';
        bm.addTextField(wallData.book1, wallData.book1);
        bm.addAction('완료');
        bm.addCancelAction('취소');

        const response = await bm.present();
        if (response !== -1) {
          wallData.book1 = bm.textFieldValue(0);
        }
        refreshAllRows();
      };

      const input2 = new UITableRow();
      input2.dismissOnSelect = false;
      input2.height = 70;

      input2.addText('다크 파일 북마크 지정 (선택)', wallData.book2);
      settings.addRow(input2);

      input2.onSelect = async () => {
        const inAlert = new Alert();
        inAlert.title = '다크 배경화면을 사용할까요?';
        inAlert.addAction('켜기');
        inAlert.addAction('끄기');

        const response = await inAlert.present();
        if (response) {
          wallData.book2 = '';
          refreshAllRows();
        } else {
          const bm = new Alert();
          bm.title = '북마크 이름을 입력하세요';
          bm.addTextField(wallData.book2, wallData.book2);
          bm.addAction('완료');
          bm.addCancelAction('취소');

          const response = await bm.present();
          if (response !== -1) {
            wallData.book2 = bm.textFieldValue(0);
          }
          refreshAllRows();
        }
      };
    }

    if (enableSuggestions && wallData.mode === 3) {
      // eslint-disable-next-line no-unused-vars
      const basePath = fm.joinPath(fDir, 'base.png');
      // eslint-disable-next-line no-unused-vars
      const imgPath = fm.joinPath(fDir, 'light.png');
      // eslint-disable-next-line no-unused-vars
      const imgPath2 = fm.joinPath(fDir, 'dark.png');

      const input = new UITableRow();
      input.dismissOnSelect = false;
      input.height = 100;
      input.isHeader = true;

      input.addText('투명 배경 만들어 적용하기', '위젯 사이즈에 따라, 언제든 배경화면을 수정할 수 있습니다!');
      settings.addRow(input);

      input.onSelect = async () => {
        await showTeaser(
            '손쉽게 투명 배경을 설정해보세요!',
            'https://user-images.githubusercontent.com/63099769/118160548-64bb0800-b459-11eb-8f42-563d455bf48f.jpeg',
            '자동 투명 배경',
            '직접 배경 지정하기',
        );
      };
    }
  }

  loadAllRows();
  await settings.present(false);

  await fm.writeString(wallPath, JSON.stringify(wallData));

  return 0;

  function refreshAllRows() {
    settings.removeAllRows();
    loadAllRows();
    settings.reload();
  }
}


async function showPluginPanel() {
  progData = JSON.parse(fm.readString(progPath));

  const pluginMenu = new UITable();
  pluginMenu.showSeparators = true;

  function loadAllRows() {
    const title = new UITableRow();
    title.isHeader = true;
    title.addText('하위 요소 편집', '위젯에 더 많은 정보를 추가해서 독특한 디자인을 만들어보세요!');
    title.height = 120;
    pluginMenu.addRow(title);

    const settingsTitle = new UITableRow();
    settingsTitle.isHeader = true;
    settingsTitle.addText('👋 Pixel Con');
    settingsTitle.height = 50;
    pluginMenu.addRow(settingsTitle);

    const layout = new UITableRow();
    layout.dismissOnSelect = false;
    layout.addText('픽셀콘 위치 설정');
    layout.height = 50;
    pluginMenu.addRow(layout);

    layout.onSelect = async () => {
      const pAlert = new Alert();
      pAlert.title = '픽셀콘 위치 설정';
      pAlert.addAction('좌측에 배치');
      pAlert.addAction('중간에 배치 (기본값)');
      pAlert.addAction('우측에 배치');
      const response = await pAlert.present();
      progData.layout = response - 1;
    };

    const color = new UITableRow();
    color.dismissOnSelect = false;
    color.addText('시그니쳐 색상 설정');
    color.height = 50;
    pluginMenu.addRow(color);

    color.onSelect = async () => {
      const pAlert = new Alert();
      pAlert.title = '시그니쳐 색상 편집';
      pAlert.addTextField('(Hex 값 입력)', progData.color);
      pAlert.addCancelAction('취소');
      pAlert.addAction('완료');
      const response = await pAlert.present();
      if (response !== -1) {
        progData.color = pAlert.textFieldValue();
      }
    };

    const miniMemo = new UITableRow();
    miniMemo.dismissOnSelect = false;
    miniMemo.addText('메모콘', '짧은 메모에 나만의 명언, 투두를 적어보세요!');
    miniMemo.height = 60;
    pluginMenu.addRow(miniMemo);

    miniMemo.onSelect = async () => {
      const pAlert = new Alert();
      pAlert.title = '메모콘 편집';
      pAlert.message = (
          progData.minimemo.length < 1 ? '미니 메모가 비활성화되어 있습니다.' : '미니 메모가 "' + progData.minimemo + '"로 설정되어 있습니다.'
      ) + '\n' +
          '텍스트 필드를 비워두시면 비활성화됩니다.';
      pAlert.addTextField('메모 입력', progData.minimemo);
      pAlert.addCancelAction('취소');
      pAlert.addAction('완료');
      const response = await pAlert.present();
      if (response !== -1) {
        progData.minimemo = pAlert.textFieldValue();
      }
    };

    const miniDday = new UITableRow();
    miniDday.dismissOnSelect = false;
    miniDday.addText('디데이콘', '디데이 카운터와 함께 중요한 날을 놓치지 마세요.');
    miniDday.height = 60;
    pluginMenu.addRow(miniDday);

    miniDday.onSelect = async () => {
      const pAlert = new Alert();
      pAlert.title = '디데이콘 편집';
      pAlert.message = (
          progData.minidday[0].length < 1 ? '디데이 기능이 비활성화되어 있습니다.' : progData.minidday[1] + ': ' + progData.minidday[0]
      ) + '\n' +
          '텍스트 필드를 비워두시면 비활성화됩니다.';
      pAlert.addTextField('YYYY-MM-DD', progData.minidday[0]);
      pAlert.addTextField('디데이 이름', progData.minidday[1]);
      pAlert.addCancelAction('취소');
      pAlert.addAction('완료');
      const response = await pAlert.present();
      if (response !== -1) {
        progData.minidday[0] = pAlert.textFieldValue(0);
        progData.minidday[1] = pAlert.textFieldValue(1);
      }
    };

    const covidKr1 = new UITableRow();
    covidKr1.dismissOnSelect = false;
    covidKr1.addText('코로나콘', '대한민국 코로나19 확진자 정보를 간단히 알려줍니다.');
    covidKr1.height = 60;
    pluginMenu.addRow(covidKr1);

    covidKr1.onSelect = async () => {
      const pAlert = new Alert();
      pAlert.title = '코로나콘 편집';
      pAlert.message = '현재 ' + (progData.covidkr1 ? '보이도록' : '숨겨지도록') + ' 설정되어 있습니다.';
      pAlert.addAction('보이기');
      pAlert.addAction('숨기기');
      progData.covidkr1 = !await pAlert.present();
    };

    const covidKr2 = new UITableRow();
    covidKr2.dismissOnSelect = false;
    covidKr2.addText('큐알콘', 'QR 체크인 바로가기와 개인 안심번호를 표시하실 수 있습니다.');
    covidKr2.height = 60;
    pluginMenu.addRow(covidKr2);

    covidKr2.onSelect = async () => {
      const pAlert = new Alert();
      pAlert.title = '큐알콘 편집';
      const progOption = {
        'Naver': '네이버 서비스로 연결되도록',
        'Kakao': '카카오 서비스로 연결되도록',
        'Hide': '숨겨지도록',
      };

      pAlert.message = '현재 ' + progOption[progData.covidkr2] + ' 설정되어 있습니다.';
      pAlert.addAction('네이버 서비스 연결');
      pAlert.addAction('카카오 서비스 연결');
      pAlert.addAction('숨기기');
      const response = await pAlert.present();
      if (response === 0) {
        progData.covidkr2 = 'Naver';
      } else if (response === 1) {
        progData.covidkr2 = 'Kakao';
      } else {
        progData.covidkr2 = 'Hide';
      }

      if (response !== 2) {
        const inAlert = new Alert();
        inAlert.title = '개인안심번호를 표시할까요?';
        inAlert.message = '코로나19 수기명부에 전화번호 대신 개인안심번호를 입력하실 수 있습니다. 위젯에서 이를 표시하실 수 있습니다! 텍스트 필드를 비워두시면 비활성화됩니다.';
        inAlert.addTextField('12가34나', progData.covidStr);
        inAlert.addAction('완료');

        await inAlert.present();
        progData.covidStr = inAlert.textFieldValue();
      }
    };

    // PhotoCon - Developed by Euny
    const miniPhoto = new UITableRow();
    miniPhoto.dismissOnSelect = false;
    miniPhoto.addText('포토콘', '보고 싶은 사진을 누구보다 이쁘게 꾸며보세요!');
    miniPhoto.height = 60;
    pluginMenu.addRow(miniPhoto);

    miniPhoto.onSelect = async () => {
      const pAlert = new Alert();
      pAlert.title = '포토콘 편집';
      pAlert.message = (
          progData.photo.length < 1 ? '포토콘이 비활성화되어 있습니다.' : '포토콘이 파일 북마크 "' + progData.photo + '"(으)로 설정되어 있습니다.'
      ) + '\n\n' +
          '- 사진의 파일 북마크 입력\n' +
          '- 사진 크기 입력 (숫자)\n' +
          '- 사진 테두리 크기 입력 (숫자)\n' +
          '- 사진 테두리 색 입력 (Hex 값)';
      pAlert.addTextField('파일 북마크 입력', progData.photo);
      pAlert.addTextField('사진 크기 입력 (숫자)', progData.photo2.toString());
      pAlert.addTextField('사진 테두리 크기 입력 (숫자)', progData.frame.toString());
      pAlert.addTextField('사진 테두리 색 입력 (Hex 값)', progData.frame2);
      pAlert.addCancelAction('취소');
      pAlert.addAction('완료');
      const response = await pAlert.present();
      if (response !== -1) {
        progData.photo = pAlert.textFieldValue(0);
        progData.photo2 = parseInt(pAlert.textFieldValue(1));
        progData.frame = parseInt(pAlert.textFieldValue(2));
        progData.frame2 = pAlert.textFieldValue(3);
      }
    };

    if (enableSuggestions) {
      const elements = new UITableRow();
      elements.isHeader = true;
      elements.addText('🧩 다른 요소 발견하기..');
      elements.height = 70;
      elements.dismissOnSelect = false;
      pluginMenu.addRow(elements);

      elements.onSelect = async () => {
        await showTeaser(
            '마법같은 하위 요소를 사용해보세요!',
            'https://user-images.githubusercontent.com/63099769/118161532-a9936e80-b45a-11eb-98ce-8b4c134d2253.jpeg',
            'Now Playing',
            '다른 요소 추가하지 않기',
        );
      };
    }
  }

  loadAllRows();
  await pluginMenu.present();
  await fm.writeString(progPath, JSON.stringify(progData));
}

function getNoThanksTable(title, subtitle) {
  const noThanks = new UITableRow();
  noThanks.height = 70;
  noThanks.addText(title, subtitle);
  noThanks.dismissOnSelect = true;
  noThanks.onSelect = () => { };
  return noThanks;
}

async function showTeaser(message, url, term, short) {
  const teaserPanel = new UITable();
  teaserPanel.showSeparators = false;

  const title = new UITableRow();
  title.isHeader = true;
  title.height = 120;
  title.addText('지금 Pro로 업그레이드하세요 🤩', message);
  teaserPanel.addRow(title);

  const photo = new UITableRow();
  photo.height = term === '이벤트 미리 알림' ? 200 : 380;
  const img = UITableCell.imageAtURL(url);

  photo.addCell(img);
  teaserPanel.addRow(photo);

  const text = new UITableRow();
  text.height = 70;
  text.isHeader = true;
  text.addText('🔓 잠금 해제하기', term + ' 및 다양한 기능 포함');
  text.dismissOnSelect = true;
  teaserPanel.addRow(text);

  text.onSelect = () => {
    Safari.openInApp('https://widget.oopy.io/plus', true);
  };

  const noThanks = getNoThanksTable('💩 괜찮아요', short);
  teaserPanel.addRow(noThanks);

  await teaserPanel.present(true);
}


// General Settings
async function showSettingPanel() {
  const settings = new UITable();
  settings.showSeparators = true;

  const settingsTitle = new UITableRow();
  settingsTitle.isHeader = true;
  settingsTitle.addText('기타 설정', '픽셀 위젯을 사용해주셔서 감사합니다!');
  settingsTitle.height = 120;
  settings.addRow(settingsTitle);

  const shortcut = new UITableRow();
  shortcut.dismissOnSelect = false;
  shortcut.addText('위젯 바로가기 설정', '픽셀 위젯을 클릭했을 때 이동할 바로가기를 설정해보세요.');
  shortcut.height = 60;
  settings.addRow(shortcut);

  shortcut.onSelect = async () => {
    const sPanel = new UITable();
    sPanel.showSeparators = true;

    const title = new UITableRow();
    title.isHeader = true;
    title.height = 120;
    title.addText('위젯 바로가기 설정', '픽셀 위젯을 클릭했을 때 이동할 바로가기를 설정하실 수 있습니다.');
    sPanel.addRow(title);

    const sData = ['Scriptable 앱 실행', '픽셀 위젯 실행', '픽셀 런처 실행', '네이버 QR 체크인', '카카오 QR 체크인'];
    const lData = [
      'scriptable://',
      `scriptable:///run/Pixel%20Widget%20v${version}`,
      `scriptable:///run/Pixel%20Launcher%20v${version}`,
      'naversearchapp://inappbrowser?url=https://nid.naver.com/login/privacyQR',
      'kakaotalk://con/web?url=https://accounts.kakao.com/qr_check_in',
    ];
    for (let i = 0; i < sData.length; i++) {
      const bt = new UITableRow();
      bt.height = i ? 55 : 70;
      bt.addText(sData[i], i ? null : '위젯 속성에 설정된 동작을 실행합니다. (기본값)');
      sPanel.addRow(bt);

      bt.onSelect = async (number) => {
        await fm.writeString(linkPath, lData[number-1]);

        const upAlert = new Notification();
        upAlert.title = '위젯 바로가기 설정';
        upAlert.body = '저장이 완료되었습니다. 바로가기는 다음 위젯 리프레시에 적용됩니다.';
        await upAlert.schedule();
      };
    }
    await sPanel.present();
  };

  if (enableSuggestions) {
    const pro1 = new UITableRow();
    pro1.dismissOnSelect = false;
    pro1.addText('위젯에 적용할 캘린더 선택하기', '이벤트 뷰를 호출할 캘린더를 설정하실 수 있습니다.\n아무것도 선택하지 않을 시 모든 이벤트를 표시합니다.');
    pro1.height = 80;
    settings.addRow(pro1);

    pro1.onSelect = async () => {
      await showTeaser(
          '위젯에 나타낼 캘린더를 직접 선택하세요.',
          'https://user-images.githubusercontent.com/63099769/118160040-be6f0280-b458-11eb-9e31-9fe3b813e7f3.jpeg',
          '캘린더 필터링',
          '모든 캘린더에서 일정 수신하기',
      );
    };

    const pro2 = new UITableRow();
    pro2.dismissOnSelect = false;
    pro2.addText('이벤트 미리 알림', '시스템 알림으로 다가오는 이벤트를 알려 드립니다!');
    pro2.height = 60;
    settings.addRow(pro2);

    pro2.onSelect = async () => {
      await showTeaser(
          '다가오는 이벤트를 빠르게 확인하세요.',
          'https://user-images.githubusercontent.com/63099769/118167379-96d06800-b461-11eb-9961-8b5dfe856233.jpeg',
          '이벤트 미리 알림',
          '위젯을 통해 이벤트 확인하기',
      );
    };
  }

  const option1 = new UITableRow();
  option1.dismissOnSelect = false;
  option1.addText('폰트 프로파일 설치', 'Pixel 스타일의 폰트를 설치해보세요.');
  option1.height = 60;
  settings.addRow(option1);

  option1.onSelect = async () => {
    const fontURL = await new Request('https://pastebin.com/raw/rfHS7Xey').loadString();
    Safari.openInApp(fontURL, false);
  };

  const option2 = new UITableRow();
  option2.dismissOnSelect = true;
  const opt2text = UITableCell.text('위젯 데이터 초기화하기 😭', '위젯이 정상적으로 작동하지 않을 때 데이터를 초기화해주세요.');
  opt2text.titleColor = new Color('#cf2835');
  option2.addCell(opt2text);
  option2.height = 60;
  settings.addRow(option2);

  option2.onSelect = async () => {
    const resetAlert = new Alert();
    resetAlert.title = '정말 초기화하시겠어요?';
    resetAlert.message = 'PX3에 저장된 위젯 데이터 및 개인설정이 모두 삭제됩니다. 이 작업은 되돌릴 수 없어요! 😭';
    resetAlert.addCancelAction('취소');
    resetAlert.addDestructiveAction('사용자 데이터 초기화');
    resetAlert.addDestructiveAction('모든 파일 완전히 삭제');
    const response = await resetAlert.presentAlert();

    if (response === 0) {
      fm.remove(prefPath);
      fm.remove(progPath);
    } else if (response === 1) {
      fm.remove(fDir);
    }

    if (response === -1) {
      await settings.present();
    } else {
      const upAlert = new Notification();
      upAlert.title = '픽셀 위젯 초기화 완료';
      upAlert.body = '데이터의 초기화가 완료되었습니다.';
      await upAlert.schedule();

      Safari.open('scriptable:///run/Pixel%20Launcher%20v' + version);
      return 0;
    }
  };

  const option4 = new UITableRow();
  option4.dismissOnSelect = false;
  option4.addText('Github');
  option4.height = 60;
  settings.addRow(option4);

  option4.onSelect = () => {
    Safari.openInApp('https://github.com/unvsDev/pixel-widget', false);
  };

  await settings.present(false);

  return 0;
}


// Edit Preferences
async function showPrefPanel() {
  prefData = JSON.parse(fm.readString(prefPath));

  const settings = new UITable();
  settings.showSeparators = true;

  function loadAllRows() {
    const title = new UITableRow();
    title.isHeader = true;
    title.height = 120;
    title.addText('일반 설정', '각각의 요소를 선택하면 변경할 수 있습니다.');
    settings.addRow(title);

    const optionList = [];

    for (const thing in optionName) {
      if (Object.prototype.hasOwnProperty.call(optionName, thing)) {
        // Settings List
        const isBoolValue = (!(prefData[thing] !== 'true' && prefData[thing] !== 'false'));
        const option = new UITableRow();
        option.dismissOnSelect = false;
        if (thing === 'apikey') {
          option.addText(optionName[thing]);
        } else if (thing === 'citywide') {
          option.addText(optionName[thing], prefData[thing] === 'false' ? '실시간 위치' : '수동 위치');
        } else {
          option.addText(optionName[thing], isBoolValue ? (prefData[thing] === 'true' ? '네' : '아니요') : prefData[thing]);
        }
        option.height = 60;
        optionList.push(thing);
        settings.addRow(option);

        option.onSelect = async (number) => {
          let response;
          const n = number - 1;
          const val = prefData[optionList[n]];
          if (n === 1 || (val !== 'true' && val !== 'false')) {
            const editAlert = new Alert();
            editAlert.title = optionName[optionList[n]];
            editAlert.message = optionFormat[optionList[n]];
            editAlert.addTextField(val, val);
            editAlert.addCancelAction('취소');
            editAlert.addAction('완료');

            response = await editAlert.present();
            if (response !== -1) {
              prefData[optionList[n]] = editAlert.textFieldValue();
              refreshAllRows();
            }
          } else {
            const editAlert = new Alert();
            editAlert.title = optionName[optionList[n]];
            editAlert.message = optionFormat[optionList[n]];
            editAlert.addAction('네');
            editAlert.addAction('아니요');
            editAlert.addCancelAction('취소');

            response = await editAlert.present();
            if (response !== -1) {
              prefData[optionList[n]] = response ? 'false' : 'true';
              refreshAllRows();
            }
          }
        };
      }
    }
  }

  loadAllRows();
  await settings.present();

  function refreshAllRows() {
    settings.removeAllRows();
    loadAllRows();
    settings.reload();
  }

  await fm.writeString(prefPath, JSON.stringify(prefData));
}


Script.complete();

// eslint-disable-next-line no-unused-vars
async function generateAlert(title, message, options) {
  const alert = new Alert();
  alert.title = title;
  alert.message = message;

  for (const option of options) {
    alert.addAction(option);
  }

  return await alert.presentAlert();
}
