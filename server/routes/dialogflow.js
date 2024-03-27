const express = require("express");
const router = express.Router();
const structjson = require("./structjson.js");
const dialogflow = require("dialogflow");
const uuid = require("uuid");

const config = require("../config/keys");

const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

// Dialogflow 서비스 계정 자격 증명으로 새 세션 클라이언트를 생성합니다
const sessionClient = new dialogflow.SessionsClient();

// 세션 경로 설정
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// textQuery Route
router.post("/textQuery", async (req, res) => {
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // Dialogflow 에이전트에게 전송할 쿼리
        text: req.body.text,
        // 클라이언트에서 사용되는 언어 (en-US)
        languageCode: languageCode,
      },
    },
  };
  try {
    const responses = await sessionClient.detectIntent(request);
    console.log("Detected intent");
    const result = responses[0].queryResult; // 첫 번째 응답에 대한 결과를 가져옴
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);

    res.send(result);
  } catch (error) {
    console.error("Error while processing text query:", error);
    res.status(500).json({ error: error.message }); // 오류 메시지를 응답으로 전송
  }
});

// EventQuery Route
router.post("/eventQuery", async (req, res) => {
  const request = {
    session: sessionPath,
    queryInput: {
      event: {
        // Dialogflow 에이전트에게 전송할 쿼리
        name: req.body.event,
        // 클라이언트에서 사용되는 언어 (en-US)
        languageCode: languageCode,
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    console.log("Detected intent");
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);

    res.send(result);
  } catch (error) {
    console.error("Error while processing event query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
