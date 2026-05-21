const Anthropic = require("@anthropic-ai/sdk");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// 주제 목록
const TOPICS = [
  "웹사이트 SEO 최적화 완벽가이드",
  "WordPress로 블로그 시작하는 방법",
  "HTML/CSS 초보자를 위한 기초 가이드",
  "도메인과 호스팅 선택하는 방법",
  "SSL 인증서 설치 및 설정",
  "모바일 반응형 웹디자인 만들기",
  "웹사이트 속도 최적화 팁",
  "Google Analytics 설정 및 분석",
  "웹 보안 기초 가이드",
  "JavaScript 초급자 필수 개념",
  "웹사이트 색상 선택 기준",
  "전문적인 로고 디자인 가이드",
  "이미지 최적화 방법",
  "웹 폰트 선택과 적용",
  "CMS 선택 기준 및 비교",
  "웹 접근성 개선 방법",
  "E-커머스 사이트 시작하기",
  "효과적인 회원가입 폼 디자인",
  "웹사이트 백업의 중요성",
  "CDN이란 무엇인가",
  "API 연동 가이드",
  "데이터베이스 기초 개념",
  "정적 사이트 생성기 vs WordPress",
  "웹호스팅 마이그레이션 완벽가이드",
  "GDPR 준수하는 웹사이트 만들기",
  "메타데이터 최적화하기",
  "효율적인 캐시 관리 방법",
  "웹사이트 모니터링 도구 비교",
  "고객 리뷰 시스템 구축",
  "이메일 뉴스레터 구독 연동"
];

async function main() {
  try {
    console.log("🚀 블로그 자동화 시작");
    
    // 1. 주제 선택
    const topic = selectRandomTopic();
    console.log(`📝 선택된 주제: ${topic}`);
    
    // 2. Claude로 포스팅 생성
    const postContent = await generatePost(topic);
    console.log(`✅ 포스팅 생성 완료 (${postContent.length}자)`);
    
    // 3. Pollinations.ai로 이미지 생성
    const imageUrl = generateImageUrl(topic);
    console.log(`🖼️ 이미지 URL: ${imageUrl}`);
    
    // 4. HTML 콘텐츠 생성
    const htmlContent = createHtmlContent(topic, postContent, imageUrl);
    
    // 5. Blogger에 업로드
    await uploadToBlogger(topic, htmlContent);
    console.log(`📤 Blogger 업로드 완료`);
    console.log(`✨ 포스팅 완료!`);
    
  } catch (error) {
    console.error("❌ 오류 발생:", error.message);
    if (error.response) {
      console.error("응답 상태:", error.response.status);
      console.error("응답 데이터:", error.response.data);
    }
    process.exit(1);
  }
}

function selectRandomTopic() {
  return TOPICS[Math.floor(Math.random() * TOPICS.length)];
}

async function generatePost(topic) {
  const client = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
  });

  const message = await client.messages.create({
    model: "claude-opus-4-20250514",
    max_tokens: 1200,
    messages: [
      {
        role: "user",
        content: `다음 주제로 블로그 포스팅을 작성해주세요:

주제: ${topic}

요구사항:
- 800-1000자 분량
- HTML 형식 사용 (<h3>, <p>, <ul>, <li> 등)
- 일반인도 이해하기 쉬운 언어
- 실무 팁이나 체크리스트 포함
- 매력적이고 도움이 되는 내용

포스팅만 작성하세요. HTML 태그만 포함하고 설명은 하지 마세요.`,
      },
    ],
  });

  return message.content[0].text;
}

function generateImageUrl(topic) {
  // Pollinations.ai - API 키 필요 없음, URL 기반 호출
  const prompt = encodeURIComponent(
    `${topic} modern professional blog banner, clean design, high quality, web design, 1200x630`
  );
  
  return `https://image.pollinations.ai/prompt/${prompt}?width=1200&height=630&nologo=true`;
}

function createHtmlContent(title, content, imageUrl) {
  return `<h2>${escapeHtml(title)}</h2>
<img src="${imageUrl}" alt="${escapeHtml(title)}" style="max-width: 100%; height: auto; margin: 20px 0; border-radius: 8px;" />
${content}
<hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
<p style="font-size: 12px; color: #999;"><em>이 글은 AI를 통해 자동으로 생성되었습니다. (miraesystem 블로그 자동화 시스템)</em></p>`;
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

async function uploadToBlogger(title, content) {
  const { OAuth2Client } = require("google-auth-library");
  
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost"
  );

  // 저장된 토큰 로드
  let credentials;
  const tokenPath = "token.json";
  
  if (fs.existsSync(tokenPath)) {
    const token = JSON.parse(fs.readFileSync(tokenPath));
    oauth2Client.setCredentials(token);
  } else {
    throw new Error(
      "token.json을 찾을 수 없습니다. 로컬에서 먼저 인증하세요."
    );
  }

  const blogger = google.blogger({
    version: "v3",
    auth: oauth2Client,
  });

  const post = {
    title: title,
    content: content,
    published: true,
    labels: ["자동생성", "웹", "기술"]
  };

  const response = await blogger.posts.insert({
    blogId: process.env.BLOGGER_BLOG_ID,
    requestBody: post,
  });

  return response.data;
}

// 실행
main().catch(console.error);
