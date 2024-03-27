import React, { useEffect } from "react";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { List, Avatar } from "antd";
import { RobotOutlined, SmileTwoTone } from "@ant-design/icons";
import { saveMessage } from "../_actions/message_actions";
import Message from "./Sections/Message";
import Card from "./Sections/Card";

function Chatbot() {
  const dispatch = useDispatch();
  const messagesFromRedux = useSelector((state) => state.message.messages);

  useEffect(() => {
    // 페이지가 로드될 때 실행되는 초기화 함수
    eventQuery("welcomeToFruit");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 사용자가 입력한 텍스트에 대한 쿼리를 수행하는 함수
  const textQuery = async (text) => {
    const conversation = {
      who: "user",
      content: {
        text: {
          text: text,
        },
      },
    };

    dispatch(saveMessage(conversation));

    try {
      // Dialogflow에 텍스트 쿼리 요청
      const response = await Axios.post("/api/dialogflow/textQuery", { text });

      // Dialogflow로부터의 응답 처리
      response.data.fulfillmentMessages.forEach((content) => {
        dispatch(saveMessage({ who: "bot", content }));
      });
    } catch (error) {
      // 오류가 발생한 경우
      const conversation = {
        who: "bot",
        content: {
          text: {
            text: "오류가 발생했습니다.",
          },
        },
      };
      dispatch(saveMessage(conversation));
    }
  };

  // 이벤트에 대한 쿼리를 수행하는 함수
  const eventQuery = async (event) => {
    try {
      // Dialogflow에 이벤트 쿼리 요청
      const response = await Axios.post("/api/dialogflow/eventQuery", {
        event,
      });

      // Dialogflow로부터의 응답 처리
      response.data.fulfillmentMessages.forEach((content) => {
        dispatch(saveMessage({ who: "bot", content }));
      });
    } catch (error) {
      // 오류가 발생한 경우
      const conversation = {
        who: "bot",
        content: {
          text: {
            text: "에러가 발생하였습니다.",
          },
        },
      };
      dispatch(saveMessage(conversation));
    }
  };

  // 메시지 렌더링 함수
  const renderMessage = (messages) => {
    return messages.map((message, index) => {
      if (
        message.content &&
        message.content.text &&
        message.content.text.text
      ) {
        // 일반 텍스트인 경우
        return (
          <Message
            key={index}
            who={message.who}
            text={message.content.text.text}
          />
        );
      } else if (
        message.content &&
        message.content.payload &&
        message.content.payload.fields.card
      ) {
        // 카드가 있는 경우
        const AvatarSrc =
          message.who === "bot" ? (
            <Avatar icon={<RobotOutlined />} />
          ) : (
            <Avatar icon={<SmileTwoTone />} />
          );

        return (
          <div key={index}>
            <List.Item style={{ padding: "1rem" }}>
              <List.Item.Meta
                avatar={<Avatar icon={AvatarSrc} />}
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {message.who}
                  </div>
                }
                description={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {renderCards(
                      message.content.payload.fields.card.listValue.values
                    )}
                  </div>
                }
              />
            </List.Item>
          </div>
        );
      } else {
        return null;
      }
    });
  };

  // 카드 렌더링 함수
  const renderCards = (cards) => {
    return cards.map((card) => (
      <Card key={card.id} cardInfo={card.structValue} />
    ));
  };

  // 엔터 키 이벤트 핸들러
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (!e.target.value) {
        alert("메시지를 입력해주세요.");
        return;
      }

      // 사용자가 입력한 텍스트 쿼리 실행
      textQuery(e.target.value);

      // 입력 필드 초기화
      e.target.value = "";
    }
  };

  return (
    <div style={{ height: 600, width: 700, border: "2px solid black" }}>
      <div style={{ height: 547, width: "100%", overflow: "auto" }}>
        <List>{renderMessage(messagesFromRedux)}</List>
      </div>
      <input
        style={{
          margin: 0,
          width: "100%",
          height: 50,
          padding: "5px",
          fontSize: "1rem",
          border: "1px solid #ccc",
          backgroundColor: "rgba(204, 204, 204, 0.1)",
        }}
        placeholder="Send a message..."
        onKeyPress={handleKeyPress}
        type="text"
      />
    </div>
  );
}

export default Chatbot;
