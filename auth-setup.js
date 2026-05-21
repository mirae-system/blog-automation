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