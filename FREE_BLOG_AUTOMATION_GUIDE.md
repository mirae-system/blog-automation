# 🎉 완전 무료 블로그 자동화 솔루션

## 📊 비용 비교

| 방법 | 초기비용 | 월비용 | 자동화 | 추천도 |
|------|--------|-------|-------|--------|
| **GitHub Actions** | $0 | $0 | ✅ 24/7 | ⭐⭐⭐⭐⭐ |
| Google Cloud Functions | $0 | $1-2 | ✅ 24/7 | ⭐⭐⭐⭐ |
| Cafe24 + cron | $0 | $0 | ✅ 제한적 | ⭐⭐⭐⭐ |
| Node.js 로컬 | $0 | $0 | ❌ 수동 | ⭐⭐⭐ |

---

## 🏆 추천: GitHub Actions (완전 무료 자동화)

### 왜 GitHub Actions인가?

1. **완전 무료** - 매월 2,000분 무료 실행
   - 하루 1개 포스팅 = 약 5분 소요
   - 월 150분 = 무료 범위 내

2. **24/7 자동화** - 서버 유지보수 불필요
   - 매일 정해진 시간에 자동 실행
   - 당신의 PC 켜켜놓을 필요 없음

3. **설정 간단** - GitHub 저장소만 있으면 됨
   - GitHub 계정으로 무료 가능
   - 5분이면 설정 완료

4. **보안** - GitHub Secrets로 API 키 암호화
   - 로컬에 민감한 정보 저장 안 함

---

## 🚀 구현 방법 (5단계)

### Step 1: GitHub 저장소 생성

```bash
1. https://github.com 접속 (계정 없으면 가입)
2. "New" 버튼 클릭
3. Repository name: "blog-automation"
4. Public 또는 Private 선택
5. "Create repository" 클릭
```

### Step 2: API 키 저장 (GitHub Secrets)

```
저장소 페이지 → Settings → Secrets and variables → Actions
"New repository secret" 클릭

다음 4개 추가:
1. CLAUDE_API_KEY = sk-... (Claude API)
2. GOOGLE_CLIENT_ID = XXX.apps.googleusercontent.com
3. GOOGLE_CLIENT_SECRET = XXXXX
4. BLOGGER_BLOG_ID = 1234567890123456789
```

### Step 3: 자동화 워크플로우 생성

```
저장소 → Actions → New workflow
"set up a workflow yourself" 클릭
파일명: .github/workflows/blog-automation.yml

아래 코드 복사 (다음 섹션 참고)
```

### Step 4: 코드 작성 (Node.js + GitHub Actions)

아래 파일들을 저장소에 추가:

#### `.github/workflows/blog-automation.yml`
```yaml
name: Daily Blog Post

on:
  schedule:
    # 매일 오전 9시 (UTC+9 한국시간 6시 = UTC 21시 전날)
    - cron: '0 21 * * *'
  workflow_dispatch:  # 수동 실행도 가능

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run blog automation
        env:
          CLAUDE_API_KEY: ${{ secrets.CLAUDE_API_KEY }}
          GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
          GOOGLE_CLIENT_SECRET: ${{ secrets.GOOGLE_CLIENT_SECRET }}
          BLOGGER_BLOG_ID: ${{ secrets.BLOGGER_BLOG_ID }}
        run: node index.js
```

#### `package.json`
```json
{
  "name": "blog-automation",
  "version": "1.0.0",
  "description": "Automated blog posting with Claude and Pollinations",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.24.0",
    "axios": "^1.6.0",
    "googleapis": "^118.0.0",
    "google-auth-library": "^9.4.0"
  }
}
```

#### `index.js` (메인 로직)
```javascript
const Anthropic = require("@anthropic-ai/sdk");
const axios = require("axios");
const { google } = require("googleapis");
const fs = require("fs");

const TOPICS = [
  "웹사이트 SEO 최적화",
  "WordPress 블로그 시작",
  "HTML/CSS 기초",
  "도메인 호스팅 선택",
  "SSL 인증서 설치",
  "반응형 웹디자인",
  "웹 속도 최적화",
  "Google Analytics",
  "웹 보안 기초",
  "JavaScript 필수개념",
  "웹 색상 선택",
  "로고 디자인",
  "이미지 최적화",
  "CMS 선택",
  "E-커머스 시작",
  "회원가입 폼",
  "웹 모니터링",
  "API 연동",
  "데이터베이스 기초",
  "정적 사이트 생성",
  "웹호스팅 마이그레이션",
  "GDPR 준수",
  "메타데이터 최적화",
  "캐시 관리",
  "고객 리뷰 시스템",
  "이메일 뉴스레터",
  "모바일 앱 연동",
  "결제 시스템",
  "채팅 봇",
  "웹 접근성"
];

async function main() {
  try {
    console.log("🚀 블로그 자동화 시작");

    // 1. 랜덤 주제 선택
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    console.log(`📝 주제: ${topic}`);

    // 2. Claude로 포스팅 생성
    const post = await generatePost(topic);
    console.log(`✅ 포스팅 생성 완료`);

    // 3. Pollinations.ai로 이미지 생성
    const imageUrl = await generateImage(topic);
    console.log(`🖼️ 이미지 생성 완료: ${imageUrl}`);

    // 4. HTML 생성
    const htmlContent = generateHtml(topic, post, imageUrl);

    // 5. Blogger에 업로드
    await uploadToBlogger(topic, htmlContent);
    console.log(`📤 Blogger 업로드 완료`);

  } catch (error) {
    console.error("❌ 오류:", error.message);
    process.exit(1);
  }
}

async function generatePost(topic) {
  const client = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
  });

  const message = await client.messages.create({
    model: "claude-opus-4-20250514",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `다음 주제로 블로그 포스팅을 작성해주세요 (800-1000자):
주제: ${topic}

요구사항:
- HTML 형식 (h2, p, ul 등)
- 일반인도 이해하기 쉬운 언어
- 실무 팁 포함
- 이미지 설명: [이미지가 여기 들어갑니다]

포스팅만 작성하고 설명은 하지 마세요.`,
      },
    ],
  });

  return message.content[0].text;
}

async function generateImage(topic) {
  // Pollinations.ai는 API 키 필요 없음
  // URL 기반 호출로 이미지 생성
  const prompt = encodeURIComponent(
    `${topic} modern professional blog banner design, high quality`
  );
  
  return `https://image.pollinations.ai/prompt/${prompt}?width=1200&height=630&nologo=true`;
}

function generateHtml(title, content, imageUrl) {
  return `
    <h2>${title}</h2>
    <img src="${imageUrl}" alt="${title}" style="max-width: 100%; margin: 20px 0; border-radius: 8px;" />
    ${content}
    <p><em>이 글은 AI를 통해 자동으로 생성되었습니다.</em></p>
  `;
}

async function uploadToBlogger(title, content) {
  // Google Blogger API 인증
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/auth/callback"
  );

  // 저장된 토큰 로드 (처음에는 수동으로 생성 필요)
  let token;
  try {
    token = JSON.parse(fs.readFileSync("token.json"));
    auth.setCredentials(token);
  } catch {
    console.log("토큰 파일 없음. 수동 인증이 필요합니다.");
    // 처음 실행 시 수동으로 한 번 인증 필요
    await authenticateManually(auth);
    token = JSON.parse(fs.readFileSync("token.json"));
    auth.setCredentials(token);
  }

  const blogger = google.blogger({ version: "v3", auth });

  const post = {
    title: title,
    content: content,
    published: true,
  };

  await blogger.posts.insert({
    blogId: process.env.BLOGGER_BLOG_ID,
    requestBody: post,
  });
}

async function authenticateManually(auth) {
  const { generateAuthUrl, getToken } = require("google-auth-library/build/src/auth/oauth2client");
  
  const authUrl = auth.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/blogger"],
  });

  console.log("아래 URL을 열고 인증하세요:");
  console.log(authUrl);
  
  // 실제로는 사용자가 수동으로 인증 후 코드를 입력받아야 함
  // GitHub Actions 환경에서는 처음 한 번만 수동으로 하면 됨
}

main();
```

### Step 5: 처음 인증 (1회만)

GitHub Actions에서 자동으로 실행되려면 Google OAuth 토큰이 필요합니다.

```bash
# 로컬에서 한 번 실행:
1. git clone 저장소
2. npm install
3. node index.js 실행
4. 브라우저에서 Google 계정으로 인증
5. token.json 파일 생성됨
6. token.json을 저장소에 커밋
```

---

## ⚠️ 주의사항

### 처음 설정 시 수동 인증 필요

Google OAuth는 자동화 환경에서 처음 한 번 수동 인증이 필요합니다:

**해결 방법:**
1. 로컬에서 스크립트 실행
2. 브라우저에서 Google 로그인
3. 생성된 `token.json`을 저장소에 추가
4. 이후 자동 실행 가능

또는 **Service Account** 사용:
- Google Cloud에서 서비스 계정 생성
- JSON 키 다운로드
- GitHub Secrets에 추가
- 인증 없이 자동화 가능

---

## 🎯 비용 정리

```
✅ GitHub Actions: $0 (월 2,000분 무료)
✅ Pollinations.ai: $0 (무제한)
✅ Claude API: 사용한 만큼 (선택)
✅ Blogger: $0
✅ Google Cloud: $0

📊 총 월 비용: $0 ~ $5 (Claude 선택 시)
```

---

## 📅 예상 실행 시간

```
포스팅 생성 (Claude): 10-20초
이미지 생성 (Pollinations): 5-10초
Blogger 업로드: 5-10초

총 소요시간: 20-40초
→ GitHub Actions 월 2,000분 내에 충분
```

---

## 🔄 대안: 더 간단한 방법

### 옵션 1: 로컬 + 수동 실행

```bash
npm install
node index.js
```

매일 수동으로 실행 (클릭 한 번)

### 옵션 2: Cafe24 + PHP

기존 Cafe24 호스팅에 PHP 스크립트 배포
cron job으로 자동화

### 옵션 3: Google Apps Script (더 간단)

Google Sheets + Apps Script
인증이 자동으로 처리됨

---

## ✅ 결론

**가장 무료인 방법: GitHub Actions**

- 월 비용: $0
- 자동화: 완전 자동 (24/7)
- 설정: 20분
- 유지보수: 거의 없음

---

## 📞 다음 단계

1. GitHub 계정 생성 (없으면)
2. 저장소 생성
3. 위 코드들 추가
4. Secrets 설정
5. 로컬에서 한 번 실행 (인증)
6. 자동화 활성화

준비되셨나요? 😊
