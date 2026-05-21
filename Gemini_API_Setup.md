# 🎨 Google Gemini API 설정 가이드

## 📋 준비 사항

Google 계정만 있으면 됩니다! (당신의 kty4523@gmail.com 사용)

---

## 🚀 Step-by-Step 설정

### Step 1: Google AI Studio 접속

```
https://aistudio.google.com/app/apikey
```

또는:

```
1. https://aistudio.google.com 접속
2. 좌측 메뉴 → "Get API key"
3. "Create API key in new project" 클릭
```

### Step 2: API Key 생성

```
"Create API key" 버튼 클릭
↓
"Create API key in new Google Cloud project" 선택
↓
API Key 자동 생성됨
```

### Step 3: API Key 복사

생성된 API Key를 복사:

```
AIzaSy... (긴 문자열)
```

**이 값을 안전하게 보관하세요!**

---

## ✅ 무료 요금제 확인

### Gemini API 무료 사용량

```
✅ 분당 60개 요청 무료
✅ 하루 1,500개 요청까지 무료
✅ 월 비용: $0

당신의 필요:
- 하루 1개 포스팅 = 약 1개 요청
- 월 30개 = 완전 무료 범위 내 ✅
```

---

## 🔧 다음 단계

API Key를 얻었으면, 로컬에서:

```powershell
cd H:\blog-automation

# 환경변수 설정
$env:GEMINI_API_KEY='AIzaSy...'

# 의존성 설치
npm install

# 테스트
node index.js
```

---

## ⚠️ 주의사항

1. **API Key 보안**
   - GitHub에 절대 업로드 금지
   - GitHub Secrets에 저장

2. **무료 한계**
   - 분당 60개 요청 제한
   - 초과 시 잠시 대기

3. **모델 선택**
   - `gemini-pro`: 일반 텍스트
   - `gemini-pro-vision`: 이미지 분석 (우리는 gemini-pro 사용)

---

## 🎯 완료되면

당신의 GitHub 저장소에:

1. Gemini API Key 추가
2. index.js 수정
3. package.json 업데이트
4. 자동 포스팅 시작!

준비되셨으면 API Key를 알려주세요! 🚀
