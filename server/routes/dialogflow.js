const express = require("express");
const router = express.Router();
const structjson = require("./structjson.js");
const dialogflow = require("dialogflow");
const uuid = require("uuid");

const config = require("../config/keys");

const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

// Create a new session client with Dialogflow service account credentials
const sessionClient = new dialogflow.SessionsClient();

const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// Text Query Route
router.post("/textQuery", async (req, res) => {
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the Dialogflow agent
        text: req.body.text,
        // The language used by the client (en-US)
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

// Event Query Route
router.post("/eventQuery", async (req, res) => {
  const request = {
    session: sessionPath,
    queryInput: {
      event: {
        // The query to send to the Dialogflow agent
        name: req.body.event,
        // The language used by the client (en-US)
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
