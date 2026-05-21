# 🔐 GitHub Actions 인증 설정 가이드

## 📋 준비물

1. **Google 클라이언트 ID** (Google Cloud Console)
2. **Google 클라이언트 보안 비밀번호** (Google Cloud Console)
3. **Blogger 블로그 ID** (Blogger 설정)
4. **GitHub 계정** (무료)

---

## 🚀 Step-by-Step 설정

### Step 1: GitHub 저장소 생성

```
1. https://github.com 접속
2. 우측 상단 "+" 클릭 → "New repository"
3. Repository name: blog-automation
4. "Create repository" 클릭
```

### Step 2: 파일 업로드

GitHub 웹 인터페이스에서:

```
1. "Add file" → "Create new file"
2. 파일명: package.json
3. 내용: (위의 package.json 복사)
4. "Commit changes" 클릭

위 과정을 반복해서 다음 파일 추가:
- index.js
- .github/workflows/blog-automation.yml
```

또는 **git 명령어 사용:**

```bash
git clone https://github.com/YOUR_USERNAME/blog-automation.git
cd blog-automation

# 파일들 복사
cp /경로/package.json .
cp /경로/index.js .
mkdir -p .github/workflows
cp /경로/blog-automation.yml .github/workflows/

# 커밋 및 푸시
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 3: GitHub Secrets 설정

```
저장소 페이지 → Settings → Secrets and variables → Actions

"New repository secret" 클릭 (4번 반복):

Secret 1:
Name: CLAUDE_API_KEY
Value: sk-ant-... (Claude API 키)

Secret 2:
Name: GOOGLE_CLIENT_ID
Value: XXXXX.apps.googleusercontent.com

Secret 3:
Name: GOOGLE_CLIENT_SECRET
Value: XXXXX

Secret 4:
Name: BLOGGER_BLOG_ID
Value: 1234567890123456789
```

---

## 🔑 Google OAuth 토큰 생성 (중요!)

Google의 자동 인증은 불가능하므로, 처음 한 번 수동으로 토큰을 생성해야 합니다.

### 로컬에서 토큰 생성

```bash
# 1. 저장소 클론
git clone https://github.com/YOUR_USERNAME/blog-automation.git
cd blog-automation

# 2. 의존성 설치
npm install

# 3. 임시 인증 스크립트 실행
# auth-setup.js 파일을 다음과 같이 생성:
```

#### `auth-setup.js` (로컬 인증용)

```javascript
const { google } = require("googleapis");
const fs = require("fs");
const readline = require("readline");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost"
);

const scopes = ["https://www.googleapis.com/auth/blogger"];

async function getAuthToken() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  console.log("아래 링크를 브라우저에서 열고 Google 계정으로 인증하세요:");
  console.log(authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("\n인증 후 URL의 'code' 파라미터 값을 입력하세요: ", async (code) => {
    rl.close();

    try {
      const { tokens } = await oauth2Client.getToken(code);
      fs.writeFileSync("token.json", JSON.stringify(tokens));
      console.log("\n✅ token.json이 생성되었습니다!");
      console.log("이 파일을 저장소에 추가한 후 GitHub에 커밋하세요.");
    } catch (error) {
      console.error("❌ 오류:", error.message);
    }
  });
}

getAuthToken();
```

```bash
# 4. 환경변수 설정 (임시)
export GOOGLE_CLIENT_ID="XXX.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="XXXXX"

# 5. 인증 실행
node auth-setup.js

# 6. 브라우저에서 Google 로그인
# 7. code 값 복사하여 입력
# 8. token.json 생성됨
```

### GitHub에 토큰 업로드

```bash
# 생성된 token.json을 저장소에 추가
git add token.json
git commit -m "Add authentication token"
git push origin main
```

---

## ⚙️ Secrets 최종 확인

Settings → Secrets에서 다음 4개가 보이는지 확인:

- ✅ CLAUDE_API_KEY
- ✅ GOOGLE_CLIENT_ID
- ✅ GOOGLE_CLIENT_SECRET
- ✅ BLOGGER_BLOG_ID

---

## 🧪 테스트 실행

### 방법 1: 웹에서 수동 실행

```
저장소 → Actions → "Daily Blog Post" → "Run workflow" → "Run workflow"
```

### 방법 2: 자동 스케줄 확인

```
매일 09:00 (한국시간) 자동 실행
Log 확인: Actions 탭에서 실행 결과 보기
```

---

## ⏰ 스케줄 변경 (필요시)

`.github/workflows/blog-automation.yml` 편집:

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # UTC 시간 변경
```

**시간 변환:**
- 09:00 한국시간 = 00:00 UTC
- 12:00 한국시간 = 03:00 UTC
- 18:00 한국시간 = 09:00 UTC

---

## 🆘 문제 해결

### "token.json을 찾을 수 없습니다" 오류

```
해결책: 로컬에서 auth-setup.js 실행하여 token.json 생성
그 후 GitHub에 커밋
```

### "API 오류" 발생

```
확인사항:
1. Secrets이 정확히 입력되었는가?
2. Blogger API가 활성화되어 있는가?
3. 블로그 ID가 정확한가?
```

### "401 Unauthorized" 오류

```
토큰이 만료되었을 가능성
로컬에서 다시 인증한 후 token.json 업데이트
```

---

## 📊 월 비용 계산

```
GitHub Actions: 무료 (월 2,000분)
소요 시간: 약 30초 × 30일 = 15분
→ 무료 범위 내에서 충분함!
```

---

## 🎉 완료!

모든 설정이 끝나면:
- 매일 09:00에 자동으로 포스팅 생성
- Blogger에 자동으로 업로드
- 비용: $0
- 유지보수: 거의 없음

만약 문제가 있으면 Actions 탭의 로그를 확인하세요!
