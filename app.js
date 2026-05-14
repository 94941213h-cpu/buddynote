'use strict';

// ═══════════════════════════════════════
// 1. CONSTANTS & CONFIG
// ═══════════════════════════════════════
const APP_VERSION = '1.0.0';
const DB_NAME = 'buddynote';
const DB_VER = 1;
const STORE_PHOTOS = 'photos';
const LS_KEY = 'bn_data';

// Open-Meteo weather codes
const WX = {
  0:  { desc: '맑음',          emoji: '☀️' },
  1:  { desc: '대체로 맑음',    emoji: '🌤️' },
  2:  { desc: '구름 조금',      emoji: '⛅' },
  3:  { desc: '흐림',          emoji: '☁️' },
  45: { desc: '안개',          emoji: '🌫️' },
  48: { desc: '안개',          emoji: '🌫️' },
  51: { desc: '이슬비',         emoji: '🌦️' },
  53: { desc: '이슬비',         emoji: '🌦️' },
  55: { desc: '이슬비',         emoji: '🌦️' },
  61: { desc: '비',            emoji: '🌧️' },
  63: { desc: '비',            emoji: '🌧️' },
  65: { desc: '강한 비',        emoji: '🌧️' },
  71: { desc: '눈',            emoji: '❄️' },
  73: { desc: '눈',            emoji: '❄️' },
  75: { desc: '강한 눈',        emoji: '❄️' },
  80: { desc: '소나기',         emoji: '🌦️' },
  81: { desc: '소나기',         emoji: '🌦️' },
  82: { desc: '강한 소나기',     emoji: '⛈️' },
  95: { desc: '뇌우',          emoji: '⛈️' },
  96: { desc: '뇌우+우박',       emoji: '⛈️' },
  99: { desc: '뇌우+우박',       emoji: '⛈️' },
};

// ═══════════════════════════════════════
// 2. CHECKLIST DATA
// ═══════════════════════════════════════
const CHECKLIST = [
  // ⛳ 필수 (항상)
  { id: 'clubs',        cat: '⛳ 필수', name: '골프채 (클럽 세트)' },
  { id: 'shoes',        cat: '⛳ 필수', name: '골프화' },
  { id: 'glove',        cat: '⛳ 필수', name: '골프장갑' },
  { id: 'balls',        cat: '⛳ 필수', name: '골프공 (여분 포함)' },
  { id: 'tee',          cat: '⛳ 필수', name: '티 / 볼마커 / 그린보수기' },
  { id: 'top',          cat: '⛳ 필수', name: '골프 상의' },
  { id: 'bottom',       cat: '⛳ 필수', name: '골프 하의' },
  { id: 'cap',          cat: '⛳ 필수', name: '모자' },
  { id: 'towel',        cat: '⛳ 필수', name: '골프 타올' },
  { id: 'wallet',       cat: '⛳ 필수', name: '지갑 / 현금 (캐디피)' },
  { id: 'id',           cat: '⛳ 필수', name: '신분증' },
  { id: 'phone',        cat: '⛳ 필수', name: '휴대폰 + 보조배터리' },
  { id: 'toiletry',     cat: '⛳ 필수', name: '세면도구 (샤워용)' },
  { id: 'spare',        cat: '⛳ 필수', name: '여분 속옷 / 양말' },
  { id: 'sunscreen',    cat: '⛳ 필수', name: '썬크림 (기본)' },

  // ☀️ 더운날씨 (26°+)
  { id: 'sunglass',     cat: '☀️ 더운날씨', name: '선글라스',            wx: 'hot' },
  { id: 'water',        cat: '☀️ 더운날씨', name: '물 / 이온음료',        wx: 'hot' },
  { id: 'armcover',     cat: '☀️ 더운날씨', name: '쿨토시',               wx: 'hot' },
  { id: 'exglove',      cat: '☀️ 더운날씨', name: '장갑 여분 (땀 대비)',   wx: 'hot' },
  { id: 'cooltowel',    cat: '☀️ 더운날씨', name: '쿨링 타올',            wx: 'hot' },

  // 🔥 폭염 (32°+)
  { id: 'sunscreen2',   cat: '🔥 폭염', name: '강한 썬크림 (SPF50+ PA++++)', wx: 'veryhot' },
  { id: 'glucose',      cat: '🔥 폭염', name: '포도당 / 에너지젤',            wx: 'veryhot' },
  { id: 'fan',          cat: '🔥 폭염', name: '소형 선풍기',                  wx: 'veryhot' },
  { id: 'icepack',      cat: '🔥 폭염', name: '얼음주머니 / 쿨팩',           wx: 'veryhot' },
  { id: 'coolunder',    cat: '🔥 폭염', name: '냉감 언더레이어',              wx: 'veryhot' },
  { id: 'drinks',       cat: '🔥 폭염', name: '스포츠음료 넉넉히',           wx: 'veryhot' },

  // 🥶 추운날씨 (10° 이하)
  { id: 'hotpack',      cat: '🥶 추운날씨', name: '핫팩',            wx: 'cold' },
  { id: 'windbreaker',  cat: '🥶 추운날씨', name: '바람막이 / 점퍼', wx: 'cold' },
  { id: 'vest',         cat: '🥶 추운날씨', name: '니트 조끼',       wx: 'cold' },
  { id: 'beanie',       cat: '🥶 추운날씨', name: '귀마개 / 비니',   wx: 'cold' },

  // 🧊 한파 (5° 이하)
  { id: 'thermalunder', cat: '🧊 한파', name: '방한 언더레이어',  wx: 'verycold' },
  { id: 'handwarmer',   cat: '🧊 한파', name: '손난로 (포켓용)',   wx: 'verycold' },
  { id: 'winterglove',  cat: '🧊 한파', name: '방한 골프장갑',    wx: 'verycold' },
  { id: 'neckwarmer',   cat: '🧊 한파', name: '넥워머',           wx: 'verycold' },

  // 🌧️ 비오는날
  { id: 'umbrella',     cat: '🌧️ 비오는날', name: '우산 / 우비',               wx: 'rain' },
  { id: 'rainglove',    cat: '🌧️ 비오는날', name: '우천용 장갑',               wx: 'rain' },
  { id: 'bagcover',     cat: '🌧️ 비오는날', name: '골프백 커버',               wx: 'rain' },
  { id: 'extowel',      cat: '🌧️ 비오는날', name: '타올 여분',                 wx: 'rain' },
  { id: 'waterproof',   cat: '🌧️ 비오는날', name: '방수 스프레이 (골프화용)',   wx: 'rain' },

  // 💨 강풍 (8m/s+)
  { id: 'windgear',     cat: '💨 강풍', name: '바람막이 (필수)',  wx: 'wind' },
  { id: 'capclip',      cat: '💨 강풍', name: '모자 고정 클립',  wx: 'wind' },

  // 🦟 야간/여름 (5~9월 야간 또는 여름 낮)
  { id: 'mosquito',     cat: '🦟 모기주의', name: '모기기피제',          wx: 'mosquito' },
  { id: 'longsleeve',   cat: '🦟 모기주의', name: '긴소매 얇은 상의',    wx: 'mosquito' },

  // 😷 봄철 황사 (3~5월)
  { id: 'mask',         cat: '😷 황사주의', name: 'KF94 마스크',  wx: 'dust' },
  { id: 'eyedrop',      cat: '😷 황사주의', name: '인공눈물',     wx: 'dust' },
];

// ═══════════════════════════════════════
// 3. STATE
// ═══════════════════════════════════════
let state = {
  rounds: [],
  settings: { homeAddress: '', homeCoords: null, kakaoKey: '', kakaoRestKey: '' },
  activeTab: 'reservation',
  viewingRoundId: null,
};

let db = null;
let _courseResults = [];
let _selectedCourse = null;

// ═══════════════════════════════════════
// 4. INDEXED DB (PHOTOS)
// ═══════════════════════════════════════
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = e => {
      e.target.result.createObjectStore(STORE_PHOTOS, { keyPath: 'id' });
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = () => reject(req.error);
  });
}

function savePhoto(photoId, dataUrl) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PHOTOS, 'readwrite');
    tx.objectStore(STORE_PHOTOS).put({ id: photoId, data: dataUrl });
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

function getPhoto(photoId) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PHOTOS, 'readonly');
    const req = tx.objectStore(STORE_PHOTOS).get(photoId);
    req.onsuccess = () => resolve(req.result ? req.result.data : null);
    req.onerror = () => reject(req.error);
  });
}

function deletePhoto(photoId) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PHOTOS, 'readwrite');
    tx.objectStore(STORE_PHOTOS).delete(photoId);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

// ═══════════════════════════════════════
// 5. STORAGE (LOCAL STORAGE)
// ═══════════════════════════════════════
function getCustomCourses() {
  try { return JSON.parse(localStorage.getItem('bn_custom_courses') || '[]'); } catch { return []; }
}

function saveCustomCourse(course) {
  const courses = getCustomCourses();
  if (!courses.find(c => c.name === course.name)) {
    courses.push(course);
    localStorage.setItem('bn_custom_courses', JSON.stringify(courses));
  }
}

function searchAllCourses(query) {
  if (!query || query.length < 1) return [];
  const dbResults = typeof searchGolfCourse === 'function' ? searchGolfCourse(query) : [];
  const custom = getCustomCourses();
  const q = query.toLowerCase().replace(/\s/g, '');
  const customResults = custom.filter(c =>
    c.name.toLowerCase().replace(/\s/g, '').includes(q) ||
    (c.region || '').replace(/\s/g, '').includes(q)
  );
  const seen = new Set(dbResults.map(c => c.name));
  return [...dbResults, ...customResults.filter(c => !seen.has(c.name))].slice(0, 8);
}
function saveState() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state.rounds = parsed.rounds || [];
      state.settings = { ...state.settings, ...(parsed.settings || {}) };
    }
  } catch (e) {}
}

// ═══════════════════════════════════════
// 6. SMS PARSING
// ═══════════════════════════════════════
function parseReservationText(text) {
  const r = {};

  // DATE — 다양한 형식 지원
  let dm = text.match(/(\d{4})[년.\-\/\s]\s*(\d{1,2})[월.\-\/\s]\s*(\d{1,2})[일]?/);
  if (!dm) dm = text.match(/(\d{4})(\d{2})(\d{2})/);
  if (dm) {
    const y = dm[1], mo = String(parseInt(dm[2])).padStart(2,'0'), d = String(parseInt(dm[3])).padStart(2,'0');
    r.date = `${y}-${mo}-${d}`;
  }

  // TIME
  let tm = text.match(/오전\s*(\d{1,2})[\s시:]*(\d{0,2})분?/);
  if (tm) {
    r.time = `${String(parseInt(tm[1])).padStart(2,'0')}:${(tm[2]||'00').padStart(2,'0')}`;
  } else {
    tm = text.match(/오후\s*(\d{1,2})[\s시:]*(\d{0,2})분?/);
    if (tm) {
      const h = parseInt(tm[1]) < 12 ? parseInt(tm[1]) + 12 : parseInt(tm[1]);
      r.time = `${String(h).padStart(2,'0')}:${(tm[2]||'00').padStart(2,'0')}`;
    } else {
      tm = text.match(/\b(\d{1,2}):(\d{2})\b/);
      if (tm) r.time = `${String(parseInt(tm[1])).padStart(2,'0')}:${tm[2]}`;
      else {
        tm = text.match(/(\d{1,2})시\s*(\d{0,2})분?/);
        if (tm) r.time = `${String(parseInt(tm[1])).padStart(2,'0')}:${(tm[2]||'00').padStart(2,'0')}`;
      }
    }
  }

  // COURSE NAME — 골프 관련 키워드로 추출
  let nm = text.match(/골프장\s*[:\s◆·]\s*([^\n\r◆()【】[\]]+)/);
  if (!nm) nm = text.match(/◆\s*골프장\s*[:\s]\s*([^\n\r◆]+)/);
  if (!nm) nm = text.match(/([가-힣a-zA-Z\s]+(?:골프클럽|골프장|컨트리클럽|CC|GC|Golf Club|Resort))/i);
  if (!nm) {
    // 첫 번째 줄에서 골프 키워드 찾기
    const lines = text.split(/[\n\r]/);
    for (const ln of lines) {
      if (/골프|CC|GC/i.test(ln) && !/예약|확인|안내|문의|번호|인원|날짜|시간|홀/i.test(ln)) {
        nm = [null, ln.replace(/[\[\]【】◆·\s]+/g, ' ').trim()];
        break;
      }
    }
  }
  if (nm && nm[1]) r.courseName = nm[1].trim().replace(/\s+/g, ' ').replace(/[^가-힣a-zA-Z0-9\s]/g, '').trim();

  // HOLES
  r.holes = /9\s*홀/.test(text) ? 9 : 18;

  // PLAYERS
  const pm = text.match(/(\d+)\s*(?:명|인)\b/);
  if (pm) r.players = parseInt(pm[1]);

  // RESERVATION NUMBER
  const rm = text.match(/예약\s*(?:번호|No\.?|no\.?)\s*[:\s]*([A-Z0-9가-힣\-]+)/i);
  if (rm) r.reservationNumber = rm[1].trim();

  // PHONE
  const phm = text.match(/(\d{2,3}[-\s]\d{3,4}[-\s]\d{4})/);
  if (phm) r.phone = phm[1];

  return r;
}

// ═══════════════════════════════════════
// 7. WEATHER API (Open-Meteo, 무료)
// ═══════════════════════════════════════
async function geocode(query) {
  // 1차: Nominatim (OpenStreetMap) — 한국 골프장 이름까지 커버
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=kr&limit=1&accept-language=ko`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'ko' } });
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: data[0].display_name };
    }
  } catch (e) {}

  // 2차: Open-Meteo geocoding — 도시/지역명 fallback
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=3&language=ko`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return { lat: data.results[0].latitude, lng: data.results[0].longitude, name: data.results[0].name };
    }
  } catch (e) {}

  return null;
}

async function fetchWeather(lat, lng, dateStr) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max&timezone=Asia%2FSeoul&start_date=${dateStr}&end_date=${dateStr}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.daily && data.daily.time && data.daily.time[0] === dateStr) {
      return {
        code: data.daily.weathercode[0],
        maxTemp: Math.round(data.daily.temperature_2m_max[0]),
        minTemp: Math.round(data.daily.temperature_2m_min[0]),
        rainProb: data.daily.precipitation_probability_max[0],
        wind: Math.round(data.daily.windspeed_10m_max[0]),
      };
    }
  } catch (e) {}
  return null;
}

function wxInfo(code) {
  return WX[code] || { desc: '확인 중', emoji: '🌡️' };
}

function isRain(code)     { return [51,53,55,61,63,65,80,81,82,95,96,99].includes(code); }
function isHot(temp)      { return temp >= 26; }
function isVeryHot(temp)  { return temp >= 32; }
function isCold(temp)     { return temp <= 10; }
function isVeryCold(temp) { return temp <= 5; }
function isHighWind(wind) { return wind >= 8; }

function isMosquitoSeason(dateStr, teeTime) {
  if (!dateStr) return false;
  const month = new Date(dateStr + 'T00:00:00').getMonth() + 1;
  if (month < 5 || month > 9) return false;
  if (teeTime) {
    const h = parseInt(teeTime.split(':')[0]);
    return h >= 17 || h < 7; // 야간/이른 아침
  }
  return month >= 6 && month <= 8; // 6~8월 낮에도 모기 주의
}

function isDustSeason(dateStr) {
  if (!dateStr) return false;
  const month = new Date(dateStr + 'T00:00:00').getMonth() + 1;
  return month >= 3 && month <= 5;
}

function getWxConditions(round) {
  const wx = round.weather;
  return {
    rain:      wx ? isRain(wx.code)          : false,
    hot:       wx ? isHot(wx.maxTemp)        : false,
    veryhot:   wx ? isVeryHot(wx.maxTemp)    : false,
    cold:      wx ? isCold(wx.minTemp)       : false,
    verycold:  wx ? isVeryCold(wx.minTemp)   : false,
    wind:      wx ? isHighWind(wx.wind)      : false,
    mosquito:  isMosquitoSeason(round.date, round.teeTime),
    dust:      isDustSeason(round.date),
  };
}

// ═══════════════════════════════════════
// 8. NAVER MAP (맛집 연결)
// ═══════════════════════════════════════
function stripCourseSuffix(name) {
  return name
    .replace(/\s*(컨트리클럽|골프클럽|골프장|리조트|CC|GC|Golf\s*Club|Country\s*Club)\s*$/i, '')
    .trim();
}

function openNaverRestaurants(roundId) {
  const r = state.rounds.find(x => x.id === roundId);
  if (!r) return;
  const name = stripCourseSuffix(r.courseName || '골프장');
  const query = encodeURIComponent(name + ' 맛집');

  // 모바일이면 앱 딥링크 먼저, 실패하면 웹
  if (/android|iphone|ipad/i.test(navigator.userAgent) && r.courseCoords) {
    const { lat, lng } = r.courseCoords;
    window.location.href = `nmap://search?query=${encodeURIComponent(name + ' 맛집')}&lat=${lat}&lng=${lng}&appname=com.buddynote`;
    setTimeout(() => window.open(`https://map.naver.com/v5/search/${query}`, '_blank'), 1500);
  } else {
    window.open(`https://map.naver.com/v5/search/${query}`, '_blank');
  }
}

// ═══════════════════════════════════════
// 9. NOTIFICATIONS
// ═══════════════════════════════════════
async function requestNotiPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const perm = await Notification.requestPermission();
  return perm === 'granted';
}

function showNotification(title, body) {
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification(title, { body, icon: '/icon-192.png', tag: 'buddynote' });
    });
  }
}

function checkNotifications() {
  const today = todayStr();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tmrStr = tomorrow.toISOString().split('T')[0];

  state.rounds.forEach(r => {
    if (r.status === 'completed') return;
    const notifiedKey = `bn_noti_${r.id}`;
    const notified = JSON.parse(localStorage.getItem(notifiedKey) || '{}');

    // 하루 전
    if (r.date === tmrStr && !notified.dayBefore) {
      const wx = r.weather ? `날씨: ${wxInfo(r.weather.code).desc} ${r.weather.maxTemp}°` : '';
      showNotification('버디노트 ⛳', `내일 ${r.courseName} 라운드! ${wx}`);
      notified.dayBefore = true;
      localStorage.setItem(notifiedKey, JSON.stringify(notified));
    }

    // 당일 출발 알림
    if (r.date === today && r.departureTime && !notified.departure) {
      const now = new Date();
      const [dh, dm] = r.departureTime.split(':').map(Number);
      const depDate = new Date(); depDate.setHours(dh, dm, 0, 0);
      const diff = depDate - now;
      if (diff > 0 && diff < 30 * 60 * 1000) { // 30분 이내
        const wx = r.weather ? `${wxInfo(r.weather.code).emoji} ${r.weather.maxTemp}°` : '';
        showNotification('출발 시간이에요! ⛳', `${r.courseName}로 출발하세요 ${wx}`);
        notified.departure = true;
        localStorage.setItem(notifiedKey, JSON.stringify(notified));
      }
    }
  });
}

// ═══════════════════════════════════════
// 10. UTILS
// ═══════════════════════════════════════
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function dday(dateStr) {
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date(); now.setHours(0,0,0,0);
  const diff = Math.round((target - now) / 86400000);
  if (diff === 0) return '오늘';
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['일','월','화','수','목','금','토'];
  return `${d.getMonth()+1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

function formatDateFull(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['일','월','화','수','목','금','토'];
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

function getRoundStatus(round) {
  const today = todayStr();
  if (round.date === today) return 'today';
  if (round.date < today) return 'past';
  return 'upcoming';
}

function calcDepartureTime(teeTime, travelMinutes) {
  const [h, m] = teeTime.split(':').map(Number);
  const total = h * 60 + m - travelMinutes - 30; // 30분 여유
  const dh = Math.floor(total / 60);
  const dm = total % 60;
  return `${String(dh).padStart(2,'0')}:${String(Math.max(0,dm)).padStart(2,'0')}`;
}

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function showToast(msg, duration = 2000) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.add('hidden'), duration);
}

function compressImage(file, maxW = 1200, quality = 0.8) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ═══════════════════════════════════════
// 11. COURSE AUTOCOMPLETE
// ═══════════════════════════════════════
function onCourseInput(value) {
  _selectedCourse = null;
  const dropdown = document.getElementById('course-dropdown');
  if (!dropdown) return;

  if (!value || value.length < 1) {
    dropdown.style.display = 'none';
    return;
  }

  _courseResults = searchAllCourses(value);
  if (_courseResults.length === 0) {
    dropdown.style.display = 'none';
    return;
  }

  dropdown.innerHTML = _courseResults.map((c, i) =>
    `<div onclick="selectCourse(${i})" style="padding:12px 16px;cursor:pointer;border-bottom:1px solid #f0f0f0;transition:background .15s" onmouseenter="this.style.background='#f7faf8'" onmouseleave="this.style.background=''">
      <div style="font-weight:600;font-size:14px;color:#111">${c.name}</div>
      <div style="font-size:12px;color:#888;margin-top:2px">${c.region}${c.custom ? ' · 직접 추가' : ''}</div>
    </div>`
  ).join('');
  dropdown.style.display = 'block';
}

function selectCourse(idx) {
  const course = _courseResults[idx];
  if (!course) return;
  _selectedCourse = course;
  const inp = document.getElementById('inp-course');
  if (inp) inp.value = course.name;
  const reg = document.getElementById('inp-region');
  if (reg) reg.value = course.region || '';
  const dropdown = document.getElementById('course-dropdown');
  if (dropdown) dropdown.style.display = 'none';
}

// ═══════════════════════════════════════
// 12. MODAL
// ═══════════════════════════════════════
function openModal(html, onClose) {
  document.getElementById('modal-body').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-overlay')._onClose = onClose;
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  const cb = overlay._onClose;
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
  if (cb) cb();
}

// ═══════════════════════════════════════
// 12. RENDER — RESERVATION TAB
// ═══════════════════════════════════════
function renderReservationTab() {
  const listEl = document.getElementById('reservation-list');
  const today = todayStr();

  const upcoming = state.rounds.filter(r => r.date >= today).sort((a,b) => a.date.localeCompare(b.date));
  const past = state.rounds.filter(r => r.date < today && r.status !== 'completed').sort((a,b) => b.date.localeCompare(a.date));
  const completed = state.rounds.filter(r => r.status === 'completed').sort((a,b) => b.date.localeCompare(a.date));

  if (state.rounds.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⛳</div>
        <div class="empty-title">등록된 예약이 없어요</div>
        <div class="empty-desc">아래 + 버튼을 눌러<br>골프 예약을 추가해보세요</div>
      </div>`;
    return;
  }

  let html = '';
  if (upcoming.length) {
    html += `<div class="section-label">다가오는 라운드</div>`;
    upcoming.forEach(r => { html += roundCardHTML(r, today); });
  }
  if (past.length) {
    html += `<div class="section-label">지난 라운드 (기록 미완료)</div>`;
    past.forEach(r => { html += roundCardHTML(r, today); });
  }
  if (completed.length) {
    html += `<div class="section-label">완료</div>`;
    completed.forEach(r => { html += roundCardHTML(r, today); });
  }
  listEl.innerHTML = html;
}

function roundCardHTML(r, today) {
  const status = getRoundStatus(r);
  const ddayText = dday(r.date);
  const badgeCls = status === 'today' ? 'today' : (status === 'past' ? 'past' : '');
  const cardCls = r.status === 'completed' ? 'completed' : (status === 'today' ? 'today' : '');
  const wxEmoji = r.weather ? wxInfo(r.weather.code).emoji : '';
  return `
    <div class="round-card ${cardCls}" data-id="${r.id}">
      <div class="round-card-top">
        <div class="round-course">${r.courseName || '골프장 미정'}</div>
        <div class="dday-badge ${badgeCls}">${r.status === 'completed' ? '완료' : ddayText}</div>
      </div>
      <div class="round-meta">
        <span class="round-meta-item">📅 ${formatDate(r.date)}</span>
        <span class="round-meta-item">⏰ ${r.teeTime || '--:--'}</span>
        ${wxEmoji ? `<span class="round-meta-item">${wxEmoji} ${r.weather.maxTemp}°</span>` : ''}
      </div>
      ${r.companions && r.companions.length ? `<div class="round-meta"><span class="round-meta-item">👥 ${r.companions.join(', ')}</span></div>` : ''}
    </div>`;
}

// ═══════════════════════════════════════
// 13. RENDER — ROUND DETAIL
// ═══════════════════════════════════════
async function renderRoundDetail(roundId) {
  const r = state.rounds.find(x => x.id === roundId);
  if (!r) return;

  const status = getRoundStatus(r);
  const ddayText = dday(r.date);
  const wx = r.weather;
  const wxI = wx ? wxInfo(wx.code) : null;

  // 날씨 카드
  let weatherHTML = '';
  if (wx && wxI) {
    const rainLabel = wx.rainProb > 0 ? `강수확률 ${wx.rainProb}%` : '';
    const conditions = [rainLabel, `바람 ${wx.wind}m/s`].filter(Boolean).join(' · ');
    weatherHTML = `
      <div class="weather-card">
        <div class="weather-icon">${wxI.emoji}</div>
        <div class="weather-info">
          <div class="weather-temp">${wx.maxTemp}° / ${wx.minTemp}°</div>
          <div class="weather-desc">${wxI.desc}</div>
          <div class="weather-detail">${conditions}</div>
        </div>
      </div>`;
  } else {
    weatherHTML = `<div class="loading-row"><span class="spinner"></span> 날씨 불러오는 중...</div>`;
  }

  // 식당 목록
  let restHTML = '';
  if (r.restaurants && r.restaurants.length > 0) {
    restHTML = r.restaurants.map((rt, i) => `
      <div class="restaurant-item tap-highlight" onclick="window.open('${rt.place_url}','_blank')">
        <div class="restaurant-rank">${i+1}</div>
        <div style="flex:1">
          <div class="restaurant-name">${rt.place_name}</div>
          <div class="restaurant-meta">${rt.category_name ? rt.category_name.split('>').pop().trim() + ' · ' : ''}${rt.road_address_name || rt.address_name}</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </div>`).join('');
  } else if (state.settings.kakaoRestKey) {
    restHTML = `<div class="loading-row"><span class="spinner"></span> 맛집 검색 중...</div>`;
  } else {
    restHTML = `<div style="padding:14px 16px;color:var(--text3);font-size:13px">카카오 REST API 키 설정 시 맛집을 자동 검색해드려요.<br><span style="color:var(--green);cursor:pointer" onclick="openSettings()">설정에서 입력하기 →</span></div>`;
  }

  // 스코어 (완료된 경우)
  let scoreHTML = '';
  if (r.status === 'completed' && r.myScore) {
    scoreHTML = `
      <div class="detail-section">
        <div class="section-label">스코어</div>
        <div class="detail-card">
          <div class="score-summary">
            <div class="score-row">
              <div class="score-player" style="color:var(--gold)">나</div>
              <div class="score-value me">${r.myScore}</div>
            </div>
            ${(r.companionScores||[]).map(c => `
              <div class="score-row">
                <div class="score-player">${c.name}</div>
                <div class="score-value">${c.score}</div>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  // 사진
  let photoHTML = '';
  if (r.photos && r.photos.length > 0) {
    const thumbs = await Promise.all(r.photos.map(async pid => {
      const data = await getPhoto(pid);
      return data ? `<div class="photo-thumb-wrap"><img class="photo-thumb" src="${data}" onclick="viewPhoto('${pid}')"></div>` : '';
    }));
    photoHTML = `
      <div class="detail-section">
        <div class="section-label">사진 (${r.photos.length}장)</div>
        <div class="photo-preview-row" style="padding:0 16px 16px">${thumbs.join('')}</div>
      </div>`;
  }

  // 이동 버튼 (당일 또는 다가오는 라운드)
  let navHTML = '';
  if (status !== 'past' || r.status !== 'completed') {
    const lat = r.courseCoords ? r.courseCoords.lat : '';
    const lng = r.courseCoords ? r.courseCoords.lng : '';
    const name = encodeURIComponent(r.courseName || '골프장');
    const tmapUrl = lat ? `tmap://route?goalname=${name}&goalx=${lng}&goaly=${lat}&reqCoordType=WGS84GEO&resCoordType=WGS84GEO` : `tmap://search?name=${name}`;
    const kakaoNavUrl = lat ? `kakaonavi://navigate?ep=${lng},${lat}&by=TIME` : '';
    const kakaoMapUrl = lat ? `https://map.kakao.com/link/to/${name},${lat},${lng}` : `https://map.kakao.com/link/search/${name}`;

    navHTML = `
      <div class="detail-section">
        <div class="section-label">네비게이션</div>
        <div class="action-row">
          <button class="btn-nav tmap" onclick="openNav('tmap','${r.id}')">
            <span style="font-size:20px">🗺️</span>
            <span>T map</span>
          </button>
          <button class="btn-nav kakao" onclick="openNav('kakao','${r.id}')">
            <span style="font-size:20px">🟡</span>
            <span>카카오내비</span>
          </button>
        </div>
      </div>`;
  }

  // 동반자
  let compHTML = '';
  if (r.companions && r.companions.length > 0) {
    compHTML = `
      <div class="detail-section">
        <div class="section-label">동반자</div>
        <div class="companion-tags">${r.companions.map(c => `<span class="companion-tag">👤 ${c}</span>`).join('')}</div>
      </div>`;
  }

  // 메모
  let memoHTML = r.memo ? `
    <div class="detail-section">
      <div class="section-label">메모</div>
      <div class="detail-card"><div class="memo-text">${r.memo}</div></div>
    </div>` : '';

  const depTime = r.departureTime || (r.teeTime ? calcDepartureTime(r.teeTime, r.travelMinutes || 60) : '');

  document.getElementById('reservation-detail').innerHTML = `
    <div class="detail-hero">
      <div class="detail-hero-course">${r.courseName || '골프장 미정'}</div>
      <div class="detail-hero-sub">${formatDateFull(r.date)} · ${r.teeTime || '--:--'} · ${r.holes || 18}홀</div>
      <div class="detail-hero-dday ${status === 'today' ? 'today' : ''}">${r.status === 'completed' ? '✓ 완료' : ddayText}</div>
    </div>

    <div class="detail-section" style="margin-top:12px">
      <div class="detail-card">
        <div class="detail-row">
          <div class="detail-row-icon">📍</div>
          <div class="detail-row-content">
            <div class="detail-row-label">골프장</div>
            <div class="detail-row-value">${r.courseName || '미정'}</div>
            ${r.courseAddress ? `<div style="font-size:12px;color:var(--text2);margin-top:2px">${r.courseAddress}</div>` : ''}
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-row-icon">📅</div>
          <div class="detail-row-content">
            <div class="detail-row-label">날짜 · 시간</div>
            <div class="detail-row-value">${formatDateFull(r.date)} · ${r.teeTime || '--:--'}</div>
          </div>
        </div>
        <div class="detail-row" style="cursor:pointer" onclick="editDeparture('${r.id}')">
          <div class="detail-row-icon">🚗</div>
          <div class="detail-row-content">
            <div class="detail-row-label">출발 예정 시간</div>
            <div class="detail-row-value">${depTime || '탭해서 설정하기'}</div>
            ${r.travelMinutes ? `<div style="font-size:12px;color:var(--text2);margin-top:2px">이동 약 ${r.travelMinutes}분 + 여유 30분</div>` : ''}
          </div>
          <div style="color:var(--text3);font-size:12px;padding-left:8px">수정 ›</div>
        </div>
        ${r.reservationNumber ? `
        <div class="detail-row">
          <div class="detail-row-icon">🔖</div>
          <div class="detail-row-content">
            <div class="detail-row-label">예약번호</div>
            <div class="detail-row-value">${r.reservationNumber}</div>
          </div>
        </div>` : ''}
        ${r.coursePhone ? `
        <div class="detail-row" style="cursor:pointer" onclick="window.location='tel:${r.coursePhone}'">
          <div class="detail-row-icon">📞</div>
          <div class="detail-row-content">
            <div class="detail-row-label">골프장 전화</div>
            <div class="detail-row-value" style="color:var(--blue)">${r.coursePhone}</div>
          </div>
        </div>` : ''}
      </div>
    </div>

    <div class="detail-section">
      <div class="section-label">날씨 (${formatDate(r.date)})</div>
      ${weatherHTML}
    </div>

    ${compHTML}
    ${navHTML}

    <div class="detail-section">
      <div class="section-label">근처 맛집</div>
      <div class="detail-card">
        <div style="padding:16px">
          <div style="font-size:13px;color:var(--text2);margin-bottom:12px">골프장 주변 맛집을 네이버 지도에서 확인해요</div>
          <button onclick="openNaverRestaurants('${r.id}')" style="width:100%;padding:14px;background:#03C75A;color:white;border-radius:12px;font-size:15px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px">
            <span>🍽️</span> 네이버 지도에서 주변 맛집 보기
          </button>
        </div>
      </div>
    </div>

    ${scoreHTML}
    ${photoHTML}
    ${memoHTML}

    ${r.status !== 'completed' ? `
    <div class="detail-section" style="margin-top:4px">
      <button class="btn-primary" onclick="openScoreEntry('${r.id}')">스코어 · 사진 기록하기 ⛳</button>
    </div>` : `
    <div class="detail-section" style="margin-top:4px">
      <button class="btn-secondary" onclick="openScoreEntry('${r.id}')">스코어 수정하기</button>
    </div>`}

    <div class="detail-section" style="margin-top:4px">
      <button class="btn-danger" onclick="deleteRound('${r.id}')">삭제</button>
    </div>
  `;
}

// ═══════════════════════════════════════
// 14. RENDER — PREPARE TAB
// ═══════════════════════════════════════
function renderPrepareTab() {
  const el = document.getElementById('prepare-content');
  const today = todayStr();
  const upcoming = state.rounds.filter(r => r.date >= today && r.status !== 'completed').sort((a,b) => a.date.localeCompare(b.date));
  const r = upcoming[0];

  if (!r) {
    el.innerHTML = `<div class="no-round-state"><div class="no-round-icon">🏌️</div><div class="no-round-text">다가오는 라운드가 없어요</div><div class="no-round-sub">예약 탭에서 라운드를 추가하면<br>준비물 체크리스트가 생성돼요</div></div>`;
    return;
  }

  const cond = getWxConditions(r);
  const wx = r.weather;

  // 날씨 조건에 따라 표시할 아이템 결정
  const checklist = r.checklist || initChecklist(r);
  const grouped = {};
  checklist.forEach(item => {
    if (!wxItemVisible(item, cond)) return;
    if (!grouped[item.cat]) grouped[item.cat] = [];
    grouped[item.cat].push(item);
  });

  const total = Object.values(grouped).flat().length;
  const done = Object.values(grouped).flat().filter(i => i.checked).length;
  const pct = total > 0 ? Math.round(done / total * 100) : 0;

  let html = `
    <div style="padding:12px 16px 0">
      <div style="font-size:15px;font-weight:700;color:var(--green);margin-bottom:8px">
        ${r.courseName} · ${formatDate(r.date)}
      </div>`;

  if (wx) {
    const wxI = wxInfo(wx.code);
    const tags = [];
    if (cond.veryhot)  tags.push(`🔥 폭염 (${wx.maxTemp}°)`);
    else if (cond.hot) tags.push(`☀️ 더운 날씨 (${wx.maxTemp}°)`);
    if (cond.verycold)  tags.push(`🧊 한파 (${wx.minTemp}°)`);
    else if (cond.cold) tags.push(`🥶 추운 날씨 (${wx.minTemp}°)`);
    if (cond.rain)     tags.push(`🌧️ 비 예보 (${wx.rainProb}%)`);
    if (cond.wind)     tags.push(`💨 강풍 (${wx.wind}m/s)`);
    if (cond.mosquito) tags.push(`🦟 모기주의`);
    if (cond.dust)     tags.push(`😷 황사주의`);
    if (tags.length === 0) tags.push(`${wxI.emoji} ${wxI.desc} ${wx.maxTemp}°/${wx.minTemp}°`);
    html += `<div style="font-size:13px;color:var(--text2);margin-bottom:12px;line-height:1.8">${tags.join(' &nbsp;·&nbsp; ')}</div>`;
  }

  html += `
    <div class="checklist-progress">
      <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
      <div class="progress-text">${done}/${total}</div>
    </div></div>`;

  Object.entries(grouped).forEach(([cat, items]) => {
    html += `<div class="checklist-group" style="padding:0 16px">
      <div class="checklist-group-title">${cat}</div>`;
    items.forEach(item => {
      const badge = item.wx ? `<div class="item-weather-badge">${cat}</div>` : '';
      html += `
        <div class="checklist-item ${item.checked ? 'checked' : ''}" data-round="${r.id}" data-item="${item.id}" onclick="toggleCheck('${r.id}','${item.id}')">
          <div class="checkbox ${item.checked ? 'on' : ''}"></div>
          <div class="item-name">${item.name}</div>
          ${badge}
        </div>`;
    });
    html += `</div>`;
  });

  el.innerHTML = html;
}

function wxItemVisible(item, cond) {
  if (!item.wx) return true;
  return (item.wx === 'rain'     && cond.rain)    ||
         (item.wx === 'hot'      && cond.hot)      ||
         (item.wx === 'veryhot'  && cond.veryhot)  ||
         (item.wx === 'cold'     && cond.cold)      ||
         (item.wx === 'verycold' && cond.verycold)  ||
         (item.wx === 'wind'     && cond.wind)      ||
         (item.wx === 'mosquito' && cond.mosquito)  ||
         (item.wx === 'dust'     && cond.dust);
}

function initChecklist(round) {
  const cond = getWxConditions(round);
  return CHECKLIST.map(item => ({
    ...item,
    checked: false,
    enabled: wxItemVisible(item, cond),
  }));
}

function toggleCheck(roundId, itemId) {
  const r = state.rounds.find(x => x.id === roundId);
  if (!r || !r.checklist) return;
  const item = r.checklist.find(x => x.id === itemId);
  if (item) item.checked = !item.checked;
  saveState();
  renderPrepareTab();
}

// ═══════════════════════════════════════
// 15. RENDER — ROUND TAB
// ═══════════════════════════════════════
function renderRoundTab() {
  const el = document.getElementById('round-content');
  const today = todayStr();
  const todayRound = state.rounds.find(r => r.date === today);
  const nextRound = state.rounds.filter(r => r.date > today && r.status !== 'completed').sort((a,b) => a.date.localeCompare(b.date))[0];

  if (!todayRound && !nextRound) {
    el.innerHTML = `<div class="no-round-state"><div class="no-round-icon">⛳</div><div class="no-round-text">오늘 예약된 라운드가 없어요</div><div class="no-round-sub">예약 탭에서 라운드를 추가해보세요</div></div>`;
    return;
  }

  const r = todayRound || nextRound;
  const isToday = r.date === today;
  const wx = r.weather;
  const wxI = wx ? wxInfo(wx.code) : null;

  let html = '';

  // 날씨 배너
  if (wx && wxI) {
    const rain = isRain(wx.code);
    html += `
      <div style="background:${rain ? 'linear-gradient(135deg,#1E40AF,#3B82F6)' : 'linear-gradient(135deg,var(--green),var(--green-light))'};padding:16px 20px;color:white;margin-bottom:2px">
        <div style="font-size:12px;opacity:.75;font-weight:600">${isToday ? '오늘' : formatDate(r.date)} · ${r.courseName}</div>
        <div style="display:flex;align-items:center;gap:12px;margin-top:6px">
          <span style="font-size:36px">${wxI.emoji}</span>
          <div>
            <div style="font-size:22px;font-weight:700">${wx.maxTemp}° / ${wx.minTemp}°</div>
            <div style="font-size:13px;opacity:.85">${wxI.desc}${wx.rainProb > 0 ? ` · 강수확률 ${wx.rainProb}%` : ''}</div>
          </div>
        </div>
      </div>`;
  }

  if (isToday) {
    // 출발 시간 카드
    const depTime = r.departureTime || (r.teeTime ? calcDepartureTime(r.teeTime, r.travelMinutes || 60) : null);
    if (depTime) {
      const now = new Date();
      const [dh, dm] = depTime.split(':').map(Number);
      const depDate = new Date(); depDate.setHours(dh, dm, 0, 0);
      const diff = depDate - now;
      const diffMin = Math.round(diff / 60000);
      let countdownText = '';
      if (diff > 0) countdownText = `${diffMin}분 후 출발`;
      else if (diff > -60 * 60000) countdownText = '지금 출발!';
      else countdownText = '이미 출발 시간이 지났어요';

      html += `
        <div style="padding:12px 16px 0">
          <div class="departure-card">
            <div class="departure-label">출발 시간</div>
            <div class="departure-time">${depTime}</div>
            <div class="departure-sub">티오프 ${r.teeTime} · ${r.travelMinutes || 60}분 소요 예상</div>
            <div class="departure-countdown">${countdownText}</div>
          </div>
        </div>`;
    }

    // 네비 버튼
    html += `
      <div style="padding:12px 16px 0">
        <div class="section-label" style="padding:0 0 10px">네비게이션으로 이동</div>
        <div class="action-row">
          <button class="btn-nav tmap" onclick="openNav('tmap','${r.id}')">
            <span style="font-size:24px">🗺️</span>
            <span>T map</span>
          </button>
          <button class="btn-nav kakao" onclick="openNav('kakao','${r.id}')">
            <span style="font-size:24px">🟡</span>
            <span>카카오내비</span>
          </button>
        </div>
      </div>`;

    // 스코어 기록
    html += `
      <div style="padding:12px 16px 0">
        <div class="section-label" style="padding:0 0 10px">라운드 기록</div>
        <button class="btn-primary" style="margin:0;width:100%" onclick="openScoreEntry('${r.id}')">
          ${r.status === 'completed' ? '✓ 기록 완료 (수정하기)' : '스코어 · 사진 기록하기 ⛳'}
        </button>
      </div>`;
  } else {
    // 다음 라운드 카운트다운
    html += `
      <div style="padding:16px">
        <div style="background:white;border-radius:18px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,0.06);text-align:center">
          <div style="font-size:13px;color:var(--text2);margin-bottom:4px">다음 라운드까지</div>
          <div style="font-size:48px;font-weight:800;color:var(--green);letter-spacing:-2px">${dday(r.date)}</div>
          <div style="font-size:14px;color:var(--text2);margin-top:4px">${r.courseName} · ${formatDate(r.date)} ${r.teeTime || ''}</div>
        </div>
      </div>`;

    // 출발 시간 설정
    const depTime = r.departureTime || (r.teeTime ? calcDepartureTime(r.teeTime, r.travelMinutes || 60) : '');
    html += `
      <div style="padding:0 16px">
        <div style="background:white;border-radius:18px;padding:16px;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
          <div style="font-size:13px;font-weight:600;color:var(--text2);margin-bottom:10px">출발 예정 시간</div>
          <div style="display:flex;align-items:center;gap:12px">
            <div style="font-size:36px;font-weight:800;color:var(--gold);flex:1">${depTime || '--:--'}</div>
            <button onclick="editDeparture('${r.id}')" style="background:var(--green-pale);color:var(--green);padding:10px 16px;border-radius:12px;font-size:13px;font-weight:700">수정</button>
          </div>
          ${r.travelMinutes ? `<div style="font-size:12px;color:var(--text3);margin-top:6px">이동 약 ${r.travelMinutes}분 + 여유 30분</div>` : ''}
        </div>
      </div>`;
  }

  el.innerHTML = html;
}

// ═══════════════════════════════════════
// 16. RENDER — HISTORY TAB
// ═══════════════════════════════════════
async function renderHistoryTab() {
  const el = document.getElementById('history-content');
  const today = todayStr();
  const completed = state.rounds.filter(r => r.status === 'completed' || r.date < today).sort((a,b) => b.date.localeCompare(a.date));

  if (completed.length === 0) {
    el.innerHTML = `<div class="no-round-state"><div class="no-round-icon">📖</div><div class="no-round-text">아직 기록이 없어요</div><div class="no-round-sub">라운드를 마치고 스코어를 기록하면<br>나만의 골프 히스토리가 쌓여요</div></div>`;
    return;
  }

  const scores = completed.filter(r => r.myScore).map(r => r.myScore);
  const best = scores.length ? Math.min(...scores) : null;

  let html = '';
  if (scores.length > 0) {
    const avg = Math.round(scores.reduce((a,b) => a+b, 0) / scores.length);
    html += `
      <div style="background:var(--green);padding:16px 20px;margin-bottom:2px;color:white;display:flex;gap:24px">
        <div style="text-align:center">
          <div style="font-size:11px;opacity:.7">총 라운드</div>
          <div style="font-size:28px;font-weight:800">${completed.length}</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:11px;opacity:.7">베스트 스코어</div>
          <div style="font-size:28px;font-weight:800">${best || '-'}</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:11px;opacity:.7">평균 스코어</div>
          <div style="font-size:28px;font-weight:800">${avg}</div>
        </div>
      </div>`;
  }

  html += `<div style="padding:12px 16px">`;
  for (const r of completed) {
    let thumbHTML = '';
    if (r.photos && r.photos.length > 0) {
      const data = await getPhoto(r.photos[0]);
      if (data) thumbHTML = `<img class="history-photo" src="${data}" alt="">`;
    }
    if (!thumbHTML) thumbHTML = `<div class="history-photo-placeholder">⛳</div>`;

    const isBest = r.myScore && r.myScore === best;
    html += `
      <div class="history-card" onclick="viewHistoryRound('${r.id}')">
        <div class="history-card-inner">
          ${thumbHTML}
          <div class="history-info">
            <div>
              <div class="history-course">${r.courseName || '골프장'}</div>
              <div class="history-date">${formatDateFull(r.date)}</div>
            </div>
            <div>
              <div class="history-score-row">
                ${r.myScore ? `<div class="history-score">${r.myScore}</div><div class="history-score-label">타</div>` : '<div style="color:var(--text3);font-size:13px">기록 없음</div>'}
                ${isBest ? `<div class="best-badge">🏆 베스트</div>` : ''}
              </div>
              ${r.companions && r.companions.length ? `<div class="history-companions">함께: ${r.companions.join(', ')}</div>` : ''}
            </div>
          </div>
        </div>
      </div>`;
  }
  html += `</div>`;
  el.innerHTML = html;
}

// ═══════════════════════════════════════
// 17. ADD ROUND MODAL
// ═══════════════════════════════════════
function openAddRound() {
  const html = `
    <div class="modal-title">라운드 추가</div>

    <div class="form-group">
      <label class="form-label">예약 문자 자동 인식</label>
      <textarea class="form-textarea" id="parse-input" rows="5" placeholder="카카오골프, 골프존 등 예약 확인 문자를 여기에 붙여넣으세요"></textarea>
      <button class="parse-btn" onclick="doParse()">🔍 자동 인식하기</button>
    </div>

    <div style="display:flex;align-items:center;gap:12px;padding:4px 20px">
      <div style="flex:1;height:1px;background:var(--border)"></div>
      <div style="font-size:12px;color:var(--text3)">또는 직접 입력</div>
      <div style="flex:1;height:1px;background:var(--border)"></div>
    </div>

    <div class="form-group">
      <label class="form-label">골프장 이름 *</label>
      <div style="position:relative">
        <input class="form-input" id="inp-course" type="text" placeholder="예: 파인힐스CC" autocomplete="off" oninput="onCourseInput(this.value)">
        <div id="course-dropdown" style="display:none;position:absolute;top:100%;left:0;right:0;background:white;border:1px solid var(--border);border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.12);z-index:1000;max-height:220px;overflow-y:auto;margin-top:4px"></div>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">지역 (날씨용)</label>
      <input class="form-input" id="inp-region" type="text" placeholder="골프장 선택 시 자동 입력 또는 직접 입력">
      <div class="form-hint">골프장 선택 시 자동으로 채워져요. 없으면 직접 입력해주세요.</div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">날짜 *</label>
        <input class="form-input" id="inp-date" type="date">
      </div>
      <div class="form-group">
        <label class="form-label">티오프 시간</label>
        <input class="form-input" id="inp-time" type="time">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">홀</label>
        <select class="form-input" id="inp-holes">
          <option value="18">18홀</option>
          <option value="9">9홀</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">이동 시간 (분)</label>
        <div style="display:flex;gap:6px;margin-bottom:6px">
          <button onclick="addRoundDepFromCurrent()" style="flex:1;padding:8px 4px;background:white;border:1.5px solid var(--border);border-radius:10px;font-size:11px;font-weight:600;cursor:pointer">📍 현재위치</button>
          <button onclick="addRoundDepFromHome()" style="flex:1;padding:8px 4px;background:white;border:1.5px solid var(--border);border-radius:10px;font-size:11px;font-weight:600;cursor:pointer">🏠 집</button>
          <button onclick="addRoundDepShowAddr()" style="flex:1;padding:8px 4px;background:white;border:1.5px solid var(--border);border-radius:10px;font-size:11px;font-weight:600;cursor:pointer">🔍 주소</button>
        </div>
        <div id="add-dep-addr-wrap" style="display:none;margin-bottom:6px;display:none">
          <div style="display:flex;gap:6px">
            <input id="add-dep-addr" class="form-input" type="text" placeholder="출발지 주소" style="margin:0;flex:1">
            <button onclick="addRoundDepFromAddr()" style="padding:0 12px;background:var(--green);color:white;border-radius:10px;font-size:12px;font-weight:700">확인</button>
          </div>
        </div>
        <div id="add-dep-status" style="font-size:12px;color:var(--green);margin-bottom:4px;display:none"></div>
        <input class="form-input" id="inp-travel" type="number" placeholder="60" value="60" min="10" max="300">
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">동반자</label>
      <div id="companion-inputs"></div>
      <button class="companion-add-btn" onclick="addCompanionInput()">+ 동반자 추가</button>
    </div>

    <div class="form-group">
      <label class="form-label">메모</label>
      <input class="form-input" id="inp-memo" type="text" placeholder="코스 정보, 특이사항 등">
    </div>

    <button class="btn-primary" onclick="saveNewRound()">저장하기</button>
    <button class="btn-secondary" onclick="closeModal()">취소</button>
    <div style="height:8px"></div>
  `;
  _selectedCourse = null;
  _courseResults = [];
  openModal(html);

  // 오늘 날짜 기본값
  document.getElementById('inp-date').value = todayStr();
}

function addCompanionInput(value = '') {
  const wrap = document.getElementById('companion-inputs');
  const row = document.createElement('div');
  row.className = 'companion-input-row';
  row.innerHTML = `
    <input class="form-input companion-name" type="text" placeholder="이름" value="${value}">
    <button class="companion-remove" onclick="this.parentElement.remove()">×</button>`;
  wrap.appendChild(row);
}

function doParse() {
  const text = document.getElementById('parse-input').value.trim();
  if (!text) { showToast('문자를 먼저 붙여넣어 주세요'); return; }

  const parsed = parseReservationText(text);

  if (parsed.courseName) {
    document.getElementById('inp-course').value = parsed.courseName;
    // DB 자동 매칭 시도
    const matches = searchAllCourses(parsed.courseName);
    if (matches.length > 0) {
      _selectedCourse = matches[0];
      document.getElementById('inp-region').value = matches[0].region || '';
    }
    // 드롭다운 표시 (확인/변경 가능하도록)
    onCourseInput(parsed.courseName);
  }
  if (parsed.date) document.getElementById('inp-date').value = parsed.date;
  if (parsed.time) document.getElementById('inp-time').value = parsed.time;
  if (parsed.holes) document.getElementById('inp-holes').value = parsed.holes;

  const found = Object.values(parsed).filter(Boolean).length;
  const courseMatched = parsed.courseName && _selectedCourse ? ' · 골프장 DB 매칭 완료' : '';
  showToast(found > 1 ? `✅ 인식 완료${courseMatched}! 확인해주세요` : '인식이 어려워요. 직접 입력해주세요');
}

async function saveNewRound() {
  const courseName = document.getElementById('inp-course').value.trim();
  const date = document.getElementById('inp-date').value;
  if (!courseName || !date) { showToast('골프장 이름과 날짜는 필수예요'); return; }

  const teeTime = document.getElementById('inp-time').value;
  const holes = parseInt(document.getElementById('inp-holes').value);
  const travelMinutes = parseInt(document.getElementById('inp-travel').value) || 60;
  const memo = document.getElementById('inp-memo').value.trim();
  const region = document.getElementById('inp-region').value.trim();
  const companions = Array.from(document.querySelectorAll('.companion-name')).map(i => i.value.trim()).filter(Boolean);
  const departureTime = teeTime ? calcDepartureTime(teeTime, travelMinutes) : '';

  // DB에서 선택한 골프장이면 좌표 바로 사용, 없으면 나중에 geocode
  const presetCoords = (_selectedCourse && _selectedCourse.lat && _selectedCourse.lng)
    ? { lat: _selectedCourse.lat, lng: _selectedCourse.lng } : null;

  // DB에 없는 골프장이면 커스텀으로 저장 (다음에도 자동완성에 표시)
  if (!_selectedCourse && courseName) {
    saveCustomCourse({ name: courseName, region: region || '', lat: null, lng: null, custom: true });
  }

  const round = {
    id: uid(),
    courseName, date, teeTime, holes, travelMinutes, departureTime,
    companions, memo, region,
    status: 'upcoming',
    courseAddress: '', courseCoords: presetCoords, coursePhone: '',
    weather: null,
    checklist: null,
    myScore: null, companionScores: [], photos: [],
    reservationNumber: '',
    createdAt: Date.now(),
  };

  // 예약번호 (자동인식에서 가져온 경우)
  const parseText = document.getElementById('parse-input').value;
  if (parseText) {
    const p = parseReservationText(parseText);
    if (p.reservationNumber) round.reservationNumber = p.reservationNumber;
    if (p.phone) round.coursePhone = p.phone;
  }

  state.rounds.push(round);
  round.checklist = initChecklist(round);
  saveState();
  closeModal();

  // 비동기로 날씨 + 골프장 정보 로딩
  loadRoundData(round.id);

  renderReservationTab();
  showToast('라운드가 추가됐어요 ⛳');

  // 상세 페이지로 이동
  setTimeout(() => viewRound(round.id), 300);
}

// ═══════════════════════════════════════
// 18. LOAD ROUND DATA (날씨 + 골프장)
// ═══════════════════════════════════════
async function loadRoundData(roundId) {
  const r = state.rounds.find(x => x.id === roundId);
  if (!r) return;

  // 1. 골프장 좌표 — 지역명 우선, 없으면 골프장명으로 시도
  if (!r.courseCoords) {
    const query = r.region || r.courseName;
    if (query) {
      const geo = await geocode(query);
      if (geo) {
        r.courseCoords = { lat: geo.lat, lng: geo.lng };
      } else if (r.region && r.courseName !== r.region) {
        // 지역명 실패 시 골프장명으로 재시도
        const geo2 = await geocode(r.courseName);
        if (geo2) r.courseCoords = { lat: geo2.lat, lng: geo2.lng };
      }
    }
    saveState();
  }

  // 2. 날씨
  if (!r.weather && r.courseCoords && r.date) {
    const wx = await fetchWeather(r.courseCoords.lat, r.courseCoords.lng, r.date);
    if (wx) {
      r.weather = wx;
      r.checklist = initChecklist(r);
      saveState();
    }
  }

  // 현재 보고 있으면 새로 렌더
  if (state.viewingRoundId === roundId) {
    renderRoundDetail(roundId);
  }
  renderReservationTab();
  if (state.activeTab === 'prepare') renderPrepareTab();
  if (state.activeTab === 'round') renderRoundTab();
}

// ═══════════════════════════════════════
// 19. SCORE ENTRY MODAL
// ═══════════════════════════════════════
function openScoreEntry(roundId) {
  const r = state.rounds.find(x => x.id === roundId);
  if (!r) return;

  const compInputs = (r.companions || []).map((name, i) => `
    <div class="score-input-row">
      <div class="score-name">👤 ${name}</div>
      <input class="score-input" type="number" id="score-comp-${i}" value="${(r.companionScores||[])[i]?.score || ''}" min="40" max="200" placeholder="--">
    </div>`).join('');

  const html = `
    <div class="modal-title">스코어 기록</div>
    <div class="score-section" style="margin:0 20px;box-shadow:none;padding:0 0 16px;border-bottom:1px solid var(--border)">
      <div class="score-input-row score-me" style="margin-bottom:10px">
        <div class="score-name">🏌️ 나의 스코어</div>
        <input class="score-input" type="number" id="score-me" value="${r.myScore || ''}" min="40" max="200" placeholder="--">
      </div>
      ${compInputs}
    </div>

    <div class="form-group" style="padding-top:16px">
      <label class="form-label">📸 스코어카드 사진으로 자동인식</label>
      <label class="photo-attach-btn" for="score-photo-input">
        사진 선택 (스코어카드 또는 스마트스코어 화면)
      </label>
      <input type="file" id="score-photo-input" accept="image/*" style="display:none" onchange="doOCR(event,'${roundId}')">
      <div id="ocr-status" class="ocr-status">사진을 찍으면 자동으로 스코어를 인식해요<br>(인식 후 수동 수정 가능)</div>
    </div>

    <div class="form-group">
      <label class="form-label">📷 라운드 사진 추가</label>
      <label class="photo-attach-btn" for="round-photo-input">사진 추가하기</label>
      <input type="file" id="round-photo-input" accept="image/*" multiple style="display:none" onchange="addRoundPhotos(event,'${roundId}')">
      <div id="photo-preview" class="photo-preview-row"></div>
    </div>

    <div class="form-group">
      <label class="form-label">메모</label>
      <input class="form-input" id="score-memo" type="text" placeholder="오늘 라운드 한 줄 기록" value="${r.memo || ''}">
    </div>

    <button class="btn-primary" onclick="saveScore('${roundId}')">저장하기</button>
    <button class="btn-secondary" onclick="closeModal()">취소</button>
    <div style="height:8px"></div>
  `;
  openModal(html);

  // 기존 사진 표시
  if (r.photos && r.photos.length > 0) {
    r.photos.forEach(async pid => {
      const data = await getPhoto(pid);
      if (data) addPhotoThumb(data, pid);
    });
  }
}

async function doOCR(event, roundId) {
  const file = event.target.files[0];
  if (!file) return;

  const statusEl = document.getElementById('ocr-status');
  statusEl.className = 'ocr-status loading';
  statusEl.textContent = '⏳ 스코어 인식 중...';

  try {
    // Tesseract.js 동적 로드
    if (!window.Tesseract) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = window.TESSERACT_CDN;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    const r = state.rounds.find(x => x.id === roundId);
    const companionCount = (r && r.companions) ? r.companions.length : 0;

    const worker = await Tesseract.createWorker('kor+eng');
    const dataUrl = await compressImage(file, 1600, 0.9);
    const { data: { text } } = await worker.recognize(dataUrl);
    await worker.terminate();

    // 숫자 추출 — 골프 스코어 범위 (40~130)
    const nums = [...text.matchAll(/\b(\d{2,3})\b/g)]
      .map(m => parseInt(m[1]))
      .filter(n => n >= 40 && n <= 150);

    if (nums.length > 0) {
      document.getElementById('score-me').value = nums[0];
      for (let i = 0; i < companionCount && i + 1 < nums.length; i++) {
        const el = document.getElementById(`score-comp-${i}`);
        if (el) el.value = nums[i + 1];
      }
      statusEl.className = 'ocr-status';
      statusEl.textContent = `✅ 인식 완료! 스코어를 확인하고 수정해주세요`;
    } else {
      statusEl.className = 'ocr-status';
      statusEl.textContent = '인식이 어려워요. 직접 입력해주세요 ✏️';
    }
  } catch (e) {
    statusEl.className = 'ocr-status';
    statusEl.textContent = 'OCR 오류. 직접 입력해주세요 ✏️';
  }
}

async function addRoundPhotos(event, roundId) {
  const files = Array.from(event.target.files);
  for (const file of files) {
    const dataUrl = await compressImage(file);
    const pid = uid();
    await savePhoto(pid, dataUrl);
    const r = state.rounds.find(x => x.id === roundId);
    if (r) { if (!r.photos) r.photos = []; r.photos.push(pid); }
    addPhotoThumb(dataUrl, pid);
  }
  saveState();
}

function addPhotoThumb(dataUrl, pid) {
  const row = document.getElementById('photo-preview');
  if (!row) return;
  const wrap = document.createElement('div');
  wrap.className = 'photo-thumb-wrap';
  wrap.dataset.pid = pid;
  wrap.innerHTML = `<img class="photo-thumb" src="${dataUrl}"><button class="photo-remove" onclick="removePhoto('${pid}')">×</button>`;
  row.appendChild(wrap);
}

async function removePhoto(pid) {
  await deletePhoto(pid);
  state.rounds.forEach(r => {
    if (r.photos) r.photos = r.photos.filter(p => p !== pid);
  });
  saveState();
  const wrap = document.querySelector(`.photo-thumb-wrap[data-pid="${pid}"]`);
  if (wrap) wrap.remove();
}

async function saveScore(roundId) {
  const r = state.rounds.find(x => x.id === roundId);
  if (!r) return;

  const myScoreVal = parseInt(document.getElementById('score-me').value);
  if (!isNaN(myScoreVal)) r.myScore = myScoreVal;

  r.companionScores = (r.companions || []).map((name, i) => {
    const val = parseInt(document.getElementById(`score-comp-${i}`)?.value);
    return { name, score: isNaN(val) ? null : val };
  }).filter(c => c.score !== null);

  const memo = document.getElementById('score-memo').value.trim();
  if (memo) r.memo = memo;

  r.status = 'completed';
  saveState();
  closeModal();

  renderReservationTab();
  renderHistoryTab();
  if (state.viewingRoundId === roundId) renderRoundDetail(roundId);
  showToast('기록이 저장됐어요 🏆');
}

// ═══════════════════════════════════════
// 20. NAVIGATION
// ═══════════════════════════════════════
function openNav(app, roundId) {
  const r = state.rounds.find(x => x.id === roundId);
  if (!r) return;
  const name = encodeURIComponent(r.courseName || '골프장');
  const lat = r.courseCoords?.lat || '';
  const lng = r.courseCoords?.lng || '';

  if (app === 'tmap') {
    const url = lat ? `tmap://route?goalname=${name}&goalx=${lng}&goaly=${lat}&reqCoordType=WGS84GEO&resCoordType=WGS84GEO` : `tmap://search?name=${name}`;
    window.location.href = url;
    setTimeout(() => {
      window.open(`https://tmap.life/${lat},${lng}`, '_blank');
    }, 1500);
  } else {
    const url = lat ? `kakaonavi://navigate?ep=${lng},${lat}&by=TIME` : '';
    if (url) window.location.href = url;
    setTimeout(() => {
      window.open(lat ? `https://map.kakao.com/link/to/${name},${lat},${lng}` : `https://map.kakao.com/link/search/${name}`, '_blank');
    }, 1500);
  }
}

function editDeparture(roundId) {
  const r = state.rounds.find(x => x.id === roundId);
  if (!r) return;
  const hasHome = !!(state.settings.homeAddress && state.settings.homeCoords);
  const travel = r.travelMinutes || 60;
  const depTime = r.teeTime ? calcDepartureTime(r.teeTime, travel) : '--:--';

  const html = `
    <div class="modal-title">출발 시간 설정</div>

    <div style="padding:0 20px 16px">
      <div style="font-size:13px;color:var(--text2);margin-bottom:10px">출발지를 선택하세요</div>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <button onclick="depFromCurrent('${roundId}')" style="flex:1;padding:14px 6px;background:white;border:1.5px solid var(--border);border-radius:14px;font-size:12px;font-weight:600;cursor:pointer;line-height:1.9">
          📍<br>현재 위치
        </button>
        <button onclick="depFromHome('${roundId}')" style="flex:1;padding:14px 6px;background:white;border:1.5px solid var(--border);border-radius:14px;font-size:12px;font-weight:600;cursor:pointer;line-height:1.9;opacity:${hasHome ? 1 : 0.4}" ${!hasHome ? 'title="설정에서 집 주소를 먼저 입력해주세요"' : ''}>
          🏠<br>${hasHome ? '집' : '집 (미설정)'}
        </button>
        <button onclick="depShowAddrInput()" style="flex:1;padding:14px 6px;background:white;border:1.5px solid var(--border);border-radius:14px;font-size:12px;font-weight:600;cursor:pointer;line-height:1.9">
          🔍<br>주소 입력
        </button>
      </div>

      <div id="dep-addr-wrap" style="display:none;margin-bottom:12px">
        <div style="display:flex;gap:8px">
          <input id="dep-addr-input" class="form-input" type="text" placeholder="출발지 주소 입력 (예: 서울 강남구)" style="flex:1;margin:0">
          <button onclick="depFromAddr('${roundId}')" style="padding:0 16px;background:var(--green);color:white;border-radius:12px;font-weight:700;font-size:13px;white-space:nowrap">확인</button>
        </div>
      </div>

      <div id="dep-status" style="display:none;padding:12px 14px;background:var(--green-pale);border-radius:12px;font-size:13px;color:var(--green);font-weight:600;margin-bottom:4px"></div>
    </div>

    <div style="margin:0 20px 8px;padding:16px;background:white;border-radius:14px;border:1.5px solid var(--border)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="font-size:13px;color:var(--text2)">이동시간 (수정 가능)</div>
        <div style="display:flex;align-items:center;gap:6px">
          <input id="dep-travel" type="number" value="${travel}" min="10" max="300"
            style="width:70px;text-align:center;font-size:18px;font-weight:700;border:1px solid var(--border);border-radius:8px;padding:6px"
            oninput="updateDepPreview('${roundId}')">
          <span style="font-size:13px;color:var(--text2)">분</span>
        </div>
      </div>
      <div style="border-top:1px solid var(--border);padding-top:12px;display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:12px;color:var(--text2)">권장 출발시간</div>
          <div style="font-size:11px;color:var(--text3);margin-top:2px">티오프 ${r.teeTime || '--:--'} − 이동 − 여유 30분</div>
        </div>
        <div id="dep-preview" style="font-size:32px;font-weight:800;color:var(--gold)">${depTime}</div>
      </div>
    </div>

    <div style="padding:0 20px 4px">
      <button class="btn-primary" onclick="saveDeparture('${roundId}')">저장하기</button>
      <button class="btn-secondary" onclick="closeModal()">닫기</button>
    </div>
    <div style="height:16px"></div>
  `;
  openModal(html);
}

function depEstimateMinutes(dist) {
  return Math.max(15, Math.round(dist * 1.3 / 70 * 60) + 15);
}

async function getRouteDuration(fromLat, fromLng, toLat, toLng) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=false`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === 'Ok' && data.routes?.length > 0) {
      return Math.ceil(data.routes[0].duration / 60);
    }
  } catch (e) {}
  return null;
}

function depShowResult(roundId, dist, minutes, label) {
  const travelInput = document.getElementById('dep-travel');
  if (travelInput) travelInput.value = minutes;

  const result = document.getElementById('dep-result');
  if (result) {
    result.style.display = 'block';
    result.innerHTML = `${label} → 약 <strong>${Math.round(dist)}km</strong> · 예상 이동 <strong>${minutes}분</strong>`;
  }
  updateDepPreview(roundId);
}

function updateDepPreview(roundId) {
  const r = state.rounds.find(x => x.id === roundId);
  const travelInput = document.getElementById('dep-travel');
  const preview = document.getElementById('dep-preview');
  if (!travelInput || !preview) return;
  const minutes = parseInt(travelInput.value) || 60;
  if (r && r.teeTime) {
    preview.textContent = calcDepartureTime(r.teeTime, minutes);
  }
  const hint = preview.parentElement?.nextElementSibling;
  if (hint) hint.textContent = `이동 ${minutes}분 + 여유 30분`;
}

function depSetStatus(msg) {
  const el = document.getElementById('dep-status');
  if (el) { el.style.display = 'block'; el.textContent = msg; }
}

async function depCalcFromCoords(roundId, fromLat, fromLng, label) {
  const r = state.rounds.find(x => x.id === roundId);
  if (!r) return;

  if (!r.courseCoords) {
    depSetStatus('⚠️ 골프장 좌표 없음 — 이동시간을 직접 입력해주세요');
    return;
  }

  depSetStatus('⏳ 경로 계산 중...');
  const mins = await getRouteDuration(fromLat, fromLng, r.courseCoords.lat, r.courseCoords.lng);

  if (mins) {
    depSetStatus(`${label} → 도로 기준 약 ${mins}분`);
    const inp = document.getElementById('dep-travel');
    if (inp) inp.value = mins;
    updateDepPreview(roundId);
  } else {
    // OSRM 실패 시 직선거리 추정
    const dist = distanceKm(fromLat, fromLng, r.courseCoords.lat, r.courseCoords.lng);
    const estimated = depEstimateMinutes(dist);
    depSetStatus(`${label} → 약 ${Math.round(dist)}km · 추정 ${estimated}분`);
    const inp = document.getElementById('dep-travel');
    if (inp) inp.value = estimated;
    updateDepPreview(roundId);
  }
}

function depFromCurrent(roundId) {
  if (!navigator.geolocation) { depSetStatus('⚠️ GPS 사용 불가 — 주소를 직접 입력해주세요'); return; }
  depSetStatus('📍 현재 위치 확인 중...');
  navigator.geolocation.getCurrentPosition(
    pos => depCalcFromCoords(roundId, pos.coords.latitude, pos.coords.longitude, '📍 현재 위치'),
    () => depSetStatus('⚠️ 위치 접근 거부 — 주소를 직접 입력해주세요'),
    { timeout: 10000 }
  );
}

function depFromHome(roundId) {
  if (!state.settings.homeCoords) {
    showToast('⚙️ 설정에서 집 주소를 먼저 입력해주세요');
    return;
  }
  depCalcFromCoords(roundId, state.settings.homeCoords.lat, state.settings.homeCoords.lng, '🏠 집');
}

function depShowAddrInput() {
  const wrap = document.getElementById('dep-addr-wrap');
  if (wrap) { wrap.style.display = 'block'; document.getElementById('dep-addr-input')?.focus(); }
}

async function depFromAddr(roundId) {
  const addr = document.getElementById('dep-addr-input')?.value.trim();
  if (!addr) { showToast('주소를 입력해주세요'); return; }
  depSetStatus('🔍 주소 검색 중...');
  const geo = await geocode(addr);
  if (!geo) { depSetStatus('⚠️ 주소를 찾을 수 없어요. 다시 입력해주세요'); return; }
  depCalcFromCoords(roundId, geo.lat, geo.lng, `🔍 ${addr}`);
}

function depManual() {
  const inp = document.getElementById('dep-travel');
  if (inp) inp.focus();
}

function saveDeparture(roundId) {
  const r = state.rounds.find(x => x.id === roundId);
  if (!r) return;
  const travel = parseInt(document.getElementById('dep-travel').value) || 60;
  const manualTime = document.getElementById('dep-time').value;
  r.travelMinutes = travel;
  r.departureTime = manualTime || (r.teeTime ? calcDepartureTime(r.teeTime, travel) : '');
  saveState();
  closeModal();
  renderRoundTab();
  if (state.viewingRoundId === roundId) renderRoundDetail(roundId);
  showToast('출발 시간이 설정됐어요');
}

// ═══════════════════════════════════════
// 21. ROUND ACTIONS
// ═══════════════════════════════════════
function viewRound(roundId) {
  state.viewingRoundId = roundId;
  document.getElementById('reservation-list-view').classList.add('hidden');
  document.getElementById('reservation-detail-view').classList.remove('hidden');
  document.getElementById('btn-back').classList.remove('hidden');
  document.getElementById('header-title').textContent = '라운드 상세';
  renderRoundDetail(roundId);
}

function backToList() {
  state.viewingRoundId = null;
  document.getElementById('reservation-detail-view').classList.add('hidden');
  document.getElementById('reservation-list-view').classList.remove('hidden');
  document.getElementById('btn-back').classList.add('hidden');
  document.getElementById('header-title').textContent = '버디노트';
}

function viewHistoryRound(roundId) {
  switchTab('reservation');
  viewRound(roundId);
}

function deleteRound(roundId) {
  if (!confirm('이 라운드를 삭제할까요?')) return;
  const r = state.rounds.find(x => x.id === roundId);
  if (r && r.photos) r.photos.forEach(pid => deletePhoto(pid));
  state.rounds = state.rounds.filter(x => x.id !== roundId);
  saveState();
  backToList();
  renderReservationTab();
  renderHistoryTab();
  showToast('삭제됐어요');
}

function viewPhoto(photoId) {
  getPhoto(photoId).then(data => {
    if (!data) return;
    const html = `<div style="padding:16px;text-align:center"><img src="${data}" style="max-width:100%;border-radius:12px"></div>`;
    openModal(html);
  });
}

// ═══════════════════════════════════════
// 22. SETTINGS
// ═══════════════════════════════════════
function openSettings() {
  const s = state.settings;
  const html = `
    <div class="modal-title">설정</div>
    <div class="settings-section">
      <div class="settings-title">출발지</div>
    </div>
    <div class="form-group">
      <label class="form-label">기본 출발지 주소</label>
      <input class="form-input" id="set-home" type="text" placeholder="예: 서울 강남구 삼성동" value="${s.homeAddress || ''}">
      <div class="form-hint">출발 시간 계산에 사용돼요. 필요할 때 라운드별로 변경 가능해요.</div>
    </div>

    <div class="settings-hint" style="margin-top:8px">
      버디노트는 별도 API 키 없이 모든 기능이 동작해요 ✅<br>
      날씨, 체크리스트, 네비, 맛집 검색 모두 무료로 사용 가능해요.
    </div>

    <button class="btn-primary" onclick="saveSettings()">저장</button>
    <div style="height:8px"></div>
  `;
  openModal(html);
}

async function saveSettings() {
  state.settings.homeAddress = document.getElementById('set-home').value.trim();

  if (state.settings.homeAddress && !state.settings.homeCoords) {
    const geo = await geocode(state.settings.homeAddress);
    if (geo) state.settings.homeCoords = { lat: geo.lat, lng: geo.lng };
  }

  saveState();
  closeModal();
  showToast('설정이 저장됐어요');
}

// ═══════════════════════════════════════
// 23. TAB SWITCHING
// ═══════════════════════════════════════
function switchTab(tabName) {
  state.activeTab = tabName;

  // 예약 탭 벗어나면 상세뷰 닫기
  if (tabName !== 'reservation' && state.viewingRoundId) {
    state.viewingRoundId = null;
    document.getElementById('reservation-detail-view').classList.add('hidden');
    document.getElementById('reservation-list-view').classList.remove('hidden');
    document.getElementById('btn-back').classList.add('hidden');
    document.getElementById('header-title').textContent = '버디노트';
  }

  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

  document.getElementById(`panel-${tabName}`).classList.add('active');
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

  if (tabName === 'reservation') renderReservationTab();
  else if (tabName === 'prepare') renderPrepareTab();
  else if (tabName === 'round') renderRoundTab();
  else if (tabName === 'history') renderHistoryTab();
}

// ═══════════════════════════════════════
// 24. EVENT LISTENERS
// ═══════════════════════════════════════
function bindEvents() {
  // 탭 전환
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // 뒤로가기
  document.getElementById('btn-back').addEventListener('click', backToList);

  // 설정
  document.getElementById('btn-settings').addEventListener('click', openSettings);

  // 예약 추가
  document.getElementById('btn-add-round').addEventListener('click', openAddRound);

  // 모달 오버레이 닫기
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });

  // 예약 카드 클릭 (이벤트 위임)
  document.getElementById('reservation-list').addEventListener('click', e => {
    const card = e.target.closest('.round-card');
    if (card && card.dataset.id) viewRound(card.dataset.id);
  });
}

// ═══════════════════════════════════════
// 25. SERVICE WORKER
// ═══════════════════════════════════════
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}

// ═══════════════════════════════════════
// 26. INIT
// ═══════════════════════════════════════
async function init() {
  loadState();
  db = await openDB();

  // 스플래시 애니메이션
  const splash = document.getElementById('splash');
  setTimeout(() => {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.style.display = 'none';
      document.getElementById('main').classList.remove('hidden');
      bindEvents();
      renderReservationTab();
      checkNotifications();
      setInterval(checkNotifications, 60000);
    }, 500);
  }, 1200);

  registerSW();

  // 설정이 없으면 처음 방문 안내
  if (state.rounds.length === 0 && !state.settings.homeAddress) {
    setTimeout(() => {
      showToast('⚙️ 설정에서 홈 주소를 입력하면 출발 시간을 계산해드려요', 3500);
    }, 2000);
  }
}

// 전역 함수 노출 (인라인 onclick용)
window.openNav = openNav;
window.openNaverRestaurants = openNaverRestaurants;
window.openScoreEntry = openScoreEntry;
window.doOCR = doOCR;
window.addRoundPhotos = addRoundPhotos;
window.removePhoto = removePhoto;
window.addPhotoThumb = addPhotoThumb;
window.saveScore = saveScore;
window.deleteRound = deleteRound;
window.viewPhoto = viewPhoto;
window.viewHistoryRound = viewHistoryRound;
window.doParse = doParse;
window.onCourseInput = onCourseInput;
window.selectCourse = selectCourse;
window.addCompanionInput = addCompanionInput;
window.saveNewRound = saveNewRound;
window.closeModal = closeModal;
window.openSettings = openSettings;
window.saveSettings = saveSettings;
window.toggleCheck = toggleCheck;
window.editDeparture = editDeparture;
window.saveDeparture = saveDeparture;
function addRoundSetTravel(mins, msg) {
  const inp = document.getElementById('inp-travel');
  if (inp) inp.value = mins;
  const st = document.getElementById('add-dep-status');
  if (st) { st.style.display = 'block'; st.textContent = msg; }
}

async function addRoundDepCalc(fromLat, fromLng, label) {
  const courseName = document.getElementById('inp-course')?.value.trim();
  const toLat = _selectedCourse?.lat;
  const toLng = _selectedCourse?.lng;

  if (!toLat || !toLng) {
    addRoundSetTravel(60, '⚠️ 골프장을 먼저 선택해주세요 (자동완성에서 선택)');
    return;
  }
  addRoundSetTravel(60, '⏳ 경로 계산 중...');
  const mins = await getRouteDuration(fromLat, fromLng, toLat, toLng);
  if (mins) {
    addRoundSetTravel(mins, `${label} → 도로 기준 약 ${mins}분`);
  } else {
    const dist = distanceKm(fromLat, fromLng, toLat, toLng);
    const est = depEstimateMinutes(dist);
    addRoundSetTravel(est, `${label} → 약 ${Math.round(dist)}km · 추정 ${est}분`);
  }
}

function addRoundDepFromCurrent() {
  if (!navigator.geolocation) { addRoundSetTravel(60, '⚠️ GPS 사용 불가'); return; }
  addRoundSetTravel(60, '📍 현재 위치 확인 중...');
  navigator.geolocation.getCurrentPosition(
    pos => addRoundDepCalc(pos.coords.latitude, pos.coords.longitude, '📍 현재위치'),
    () => addRoundSetTravel(60, '⚠️ 위치 접근 거부됨'),
    { timeout: 10000 }
  );
}

function addRoundDepFromHome() {
  if (!state.settings.homeCoords) { showToast('설정에서 집 주소를 먼저 입력해주세요'); return; }
  addRoundDepCalc(state.settings.homeCoords.lat, state.settings.homeCoords.lng, '🏠 집');
}

function addRoundDepShowAddr() {
  const wrap = document.getElementById('add-dep-addr-wrap');
  if (wrap) { wrap.style.display = 'block'; document.getElementById('add-dep-addr')?.focus(); }
}

async function addRoundDepFromAddr() {
  const addr = document.getElementById('add-dep-addr')?.value.trim();
  if (!addr) return;
  addRoundSetTravel(60, '🔍 주소 검색 중...');
  const geo = await geocode(addr);
  if (!geo) { addRoundSetTravel(60, '⚠️ 주소를 찾을 수 없어요'); return; }
  addRoundDepCalc(geo.lat, geo.lng, `🔍 ${addr}`);
}

window.addRoundDepFromCurrent = addRoundDepFromCurrent;
window.addRoundDepFromHome = addRoundDepFromHome;
window.addRoundDepShowAddr = addRoundDepShowAddr;
window.addRoundDepFromAddr = addRoundDepFromAddr;

window.depFromCurrent = depFromCurrent;
window.depFromHome = depFromHome;
window.depManual = depManual;
window.depShowAddrInput = depShowAddrInput;
window.depFromAddr = depFromAddr;
window.updateDepPreview = updateDepPreview;

function fixVH() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
fixVH();
window.addEventListener('resize', fixVH);
window.addEventListener('orientationchange', () => setTimeout(fixVH, 100));

document.addEventListener('DOMContentLoaded', init);
