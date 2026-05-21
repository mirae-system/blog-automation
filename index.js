const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// 주제 목록 (주제별 미리 준비된 포스팅)
const TOPICS = {
  "웹사이트 SEO 최적화 완벽가이드": `
    <h3>웹사이트 SEO 최적화 완벽가이드</h3>
    <p>검색 엔진 최적화(SEO)는 웹사이트의 가시성을 높이는 핵심입니다. Google, Naver 같은 검색 엔진에서 상위에 나타나면 자연스러운 트래픽이 증가합니다.</p>
    <h4>SEO의 3가지 핵심 요소</h4>
    <ul>
      <li><strong>온페이지 SEO:</strong> 제목, 설명, 키워드 최적화</li>
      <li><strong>기술적 SEO:</strong> 사이트 속도, 모바일 최적화, 구조화된 데이터</li>
      <li><strong>백링크:</strong> 다른 웹사이트에서의 링크</li>
    </ul>
    <h4>실행 체크리스트</h4>
    <ul>
      <li>페이지 제목을 50-60자로 작성</li>
      <li>메타 설명을 100-160자로 작성</li>
      <li>이미지에 alt 텍스트 추가</li>
      <li>모바일 반응형 디자인 확인</li>
      <li>페이지 로딩 속도 개선</li>
    </ul>
    <p>SEO는 장기 전략입니다. 꾸준한 콘텐츠 업로드와 최적화가 성공의 핵심입니다.</p>
  `,
  
  "WordPress로 블로그 시작하는 방법": `
    <h3>WordPress로 블로그 시작하는 방법</h3>
    <p>WordPress는 세계에서 가장 인기있는 블로깅 플랫폼입니다. 초보자도 쉽게 시작할 수 있습니다.</p>
    <h4>WordPress 시작 3단계</h4>
    <ol>
      <li><strong>호스팅 선택:</strong> Bluehost, SiteGround, 카페24 등</li>
      <li><strong>도메인 구입:</strong> .com, .co.kr 등</li>
      <li><strong>WordPress 설치:</strong> 대부분 자동 설치 가능</li>
    </ol>
    <h4>필수 플러그인</h4>
    <ul>
      <li>Yoast SEO: SEO 최적화</li>
      <li>Jetpack: 보안 및 성능</li>
      <li>WP Super Cache: 속도 최적화</li>
      <li>Elementor: 쉬운 디자인</li>
    </ul>
    <p>WordPress로 시작하면 전문적인 블로그를 빠르게 구축할 수 있습니다.</p>
  `,
  
  "HTML/CSS 초보자를 위한 기초 가이드": `
    <h3>HTML/CSS 초보자를 위한 기초 가이드</h3>
    <p>HTML과 CSS는 웹 개발의 기초입니다. HTML은 구조를, CSS는 디자인을 담당합니다.</p>
    <h4>HTML이란?</h4>
    <p>HTML(HyperText Markup Language)은 웹페이지의 구조를 정의하는 언어입니다.</p>
    <h4>CSS란?</h4>
    <p>CSS(Cascading Style Sheets)는 HTML 요소의 스타일을 정의하는 언어입니다.</p>
    <h4>학습 순서</h4>
    <ul>
      <li>HTML 기본 태그 학습</li>
      <li>CSS 선택자와 속성 학습</li>
      <li>레이아웃 디자인</li>
      <li>실제 프로젝트 만들기</li>
    </ul>
    <p>꾸준한 연습이 가장 중요합니다. 작은 프로젝트부터 시작하세요.</p>
  `,
  
  "도메인과 호스팅 선택하는 방법": `
    <h3>도메인과 호스팅 선택하는 방법</h3>
    <p>웹사이트를 시작하려면 도메인과 호스팅 두 가지가 필요합니다.</p>
    <h4>도메인이란?</h4>
    <p>도메인은 웹사이트의 주소입니다. 예: example.com, mysite.co.kr</p>
    <h4>호스팅이란?</h4>
    <p>호스팅은 웹사이트 파일을 저장하는 서버 공간입니다.</p>
    <h4>선택 기준</h4>
    <ul>
      <li>신뢰성: 99.9% 가동시간</li>
      <li>가격: 월 5,000원 ~ 50,000원</li>
      <li>고객지원: 24/7 한글 지원</li>
      <li>확장성: 트래픽 증가 시 업그레이드 가능</li>
    </ul>
    <h4>추천 호스팅</h4>
    <ul>
      <li>카페24: 한국 기업, 저가</li>
      <li>가비아: 한국 기업, 신뢰성 높음</li>
      <li>AWS: 글로벌, 확장성 우수</li>
    </ul>
  `,
  
  "SSL 인증서 설치 및 설정": `
    <h3>SSL 인증서 설치 및 설정</h3>
    <p>SSL 인증서는 웹사이트의 보안을 보장하고 검색 순위를 높입니다.</p>
    <h4>SSL이란?</h4>
    <p>SSL(Secure Sockets Layer)은 웹사이트 방문자의 정보를 암호화합니다.</p>
    <h4>SSL 인증서 종류</h4>
    <ul>
      <li>도메인 검증(DV): 가장 저렴, 개인 블로그 추천</li>
      <li>기관 검증(OV): 중간 수준 보안</li>
      <li>확대 검증(EV): 최고 수준 보안, 전자상거래 추천</li>
    </ul>
    <h4>무료 SSL 인증서</h4>
    <ul>
      <li>Let's Encrypt: 완전 무료, 자동 갱신</li>
      <li>CloudFlare: 무료 SSL 제공</li>
    </ul>
    <p>SSL 인증서는 필수입니다. 최소한 Let's Encrypt를 사용하세요.</p>
  `,
  
  "모바일 반응형 웹디자인 만들기": `
    <h3>모바일 반응형 웹디자인 만들기</h3>
    <p>현재 60% 이상의 사람들이 모바일로 웹사이트를 방문합니다. 반응형 디자인은 필수입니다.</p>
    <h4>반응형 디자인이란?</h4>
    <p>모든 화면 크기(모바일, 태블릿, 데스크톱)에서 최적으로 표시되는 디자인입니다.</p>
    <h4>핵심 기술</h4>
    <ul>
      <li>미디어 쿼리(Media Query)</li>
      <li>유연한 그리드 레이아웃</li>
      <li>유연한 이미지</li>
      <li>Flexbox와 CSS Grid</li>
    </ul>
    <h4>체크리스트</h4>
    <ul>
      <li>Viewport 메타 태그 추가</li>
      <li>모바일 텍스트 크기 최소 16px</li>
      <li>터치 버튼 크기 최소 44x44px</li>
      <li>모바일에서 속도 테스트</li>
    </ul>
    <p>Google은 모바일 친화성을 검색 순위 결정 요소로 사용합니다.</p>
  `,
  
  "웹사이트 속도 최적화 팁": `
    <h3>웹사이트 속도 최적화 팁</h3>
    <p>웹사이트 속도는 사용자 경험과 검색 순위에 직접 영향을 미칩니다.</p>
    <h4>속도 측정</h4>
    <ul>
      <li>Google PageSpeed Insights: 무료</li>
      <li>GTmetrix: 상세한 분석</li>
      <li>WebPageTest: 실제 사용자 측정</li>
    </ul>
    <h4>속도 개선 방법</h4>
    <ul>
      <li>이미지 최적화: 파일 크기 줄이기</li>
      <li>캐싱 활성화: 브라우저 캐시</li>
      <li>CSS/JS 최소화: 파일 크기 줄이기</li>
      <li>CDN 사용: 글로벌 네트워크</li>
      <li>불필요한 플러그인 제거</li>
    </ul>
    <h4>목표</h4>
    <p>3초 이내 로딩을 목표로 하세요. 1초 지연 시 7% 이상의 전환율 감소가 발생합니다.</p>
  `,
  
  "Google Analytics 설정 및 분석": `
    <h3>Google Analytics 설정 및 분석</h3>
    <p>Google Analytics는 웹사이트 방문자를 분석하는 무료 도구입니다.</p>
    <h4>설정 방법</h4>
    <ol>
      <li>Google 계정 생성</li>
      <li>analytics.google.com 접속</li>
      <li>웹사이트 등록</li>
      <li>추적 코드 설치</li>
    </ol>
    <h4>주요 지표</h4>
    <ul>
      <li>사용자: 방문자 수</li>
      <li>세션: 방문 횟수</li>
      <li>이탈률: 한 페이지만 보고 나간 비율</li>
      <li>전환: 목표 달성</li>
    </ul>
    <h4>활용 팁</h4>
    <ul>
      <li>목표 설정: 뉴스레터 구독, 구매 등</li>
      <li>세그먼트: 사용자 그룹 분석</li>
      <li>리포트: 정기적인 분석</li>
    </ul>
  `,
  
  "웹 보안 기초 가이드": `
    <h3>웹 보안 기초 가이드</h3>
    <p>웹사이트 보안은 사용자 정보와 신뢰를 보호하는 가장 중요한 요소입니다.</p>
    <h4>주요 위협</h4>
    <ul>
      <li>해킹: 무단 접근</li>
      <li>악성코드: 바이러스, 랜섬웨어</li>
      <li>SQL 인젝션: 데이터베이스 공격</li>
      <li>XSS: 스크립트 공격</li>
    </ul>
    <h4>기본 보안 조치</h4>
    <ul>
      <li>SSL 인증서: HTTPS 사용</li>
      <li>암호: 강력한 관리자 암호</li>
      <li>업데이트: 소프트웨어 최신 유지</li>
      <li>백업: 정기적인 데이터 백업</li>
      <li>방화벽: WAF(웹 응용 방화벽)</li>
    </ul>
    <p>보안은 지속적인 관리가 필요합니다.</p>
  `,
  
  "JavaScript 초급자 필수 개념": `
    <h3>JavaScript 초급자 필수 개념</h3>
    <p>JavaScript는 웹 개발에서 가장 중요한 언어입니다. 인터랙티브한 웹사이트를 만듭니다.</p>
    <h4>기본 개념</h4>
    <ul>
      <li>변수: 데이터를 저장하는 상자</li>
      <li>함수: 재사용 가능한 코드 블록</li>
      <li>이벤트: 사용자 상호작용</li>
      <li>DOM: 웹페이지의 구조</li>
    </ul>
    <h4>학습 순서</h4>
    <ul>
      <li>변수와 데이터 타입</li>
      <li>조건문과 반복문</li>
      <li>함수</li>
      <li>DOM 조작</li>
      <li>이벤트 처리</li>
    </ul>
    <h4>추천 학습 자료</h4>
    <ul>
      <li>MDN 웹 문서: 공식 문서</li>
      <li>Codecademy: 대화형 학습</li>
      <li>freeCodeCamp: 무료 강의</li>
    </ul>
  `,
  
  "웹사이트 색상 선택 기준": `
    <h3>웹사이트 색상 선택 기준</h3>
    <p>색상은 웹사이트의 분위기와 사용자 감정에 큰 영향을 미칩니다.</p>
    <h4>색상 심리학</h4>
    <ul>
      <li>빨강: 에너지, 긴급성</li>
      <li>파랑: 신뢰, 안정성</li>
      <li>초록: 자연, 성장</li>
      <li>노랑: 희망, 긍정</li>
      <li>검정: 고급스러움, 신비로움</li>
    </ul>
    <h4>색상 선택 팁</h4>
    <ul>
      <li>1~3가지 주요 색상만 사용</li>
      <li>명도와 채도 고려</li>
      <li>색맹 사용자 고려</li>
      <li>경쟁사 분석</li>
    </ul>
    <h4>도구</h4>
    <ul>
      <li>Adobe Color Wheel</li>
      <li>Coolors.co</li>
      <li>Paletton</li>
    </ul>
  `
};

async function main() {
  try {
    console.log("🚀 블로그 자동화 시작");
    
    // 1. 주제 선택
    const topics = Object.keys(TOPICS);
    const topic = topics[Math.floor(Math.random() * topics.length)];
    console.log(`📝 선택된 주제: ${topic}`);
    
    // 2. 포스팅 생성 (미리 준비된 콘텐츠 사용)
    const postContent = TOPICS[topic];
    console.log(`✅ 포스팅 생성 완료`);
    
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