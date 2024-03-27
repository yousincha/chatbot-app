import React from "react";
import { Card } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

const { Meta } = Card;

function CardComponent(props) {
  // props.cardInfo가 존재하는지 확인
  if (!props.cardInfo) {
    return null; // cardInfo가 없을 때
  }

  // props.cardInfo.fields가 존재하는지 확인
  if (!props.cardInfo.fields) {
    return null; // fields가 없을 때
  }

  // 값 확인 후 렌더링
  const title = props.cardInfo.fields.stack?.stringValue || "";
  const description = props.cardInfo.fields.description?.stringValue || "";
  const imageUrl = props.cardInfo.fields.image?.stringValue || "";
  const linkUrl = props.cardInfo.fields.link?.stringValue || "";

  return (
    <Card
      style={{ width: 200 }}
      cover={<img alt={description} src={imageUrl} />} // 이미지 크기를 지정
      actions={[
        // _blank 사용시 새 탭에서 연결, _self 사용시 현재 탭에서 연결
        <a target="_blank" rel="noopener noreferrer" href={linkUrl}>
          <EllipsisOutlined key="ellipsis" />
        </a>,
      ]}
    >
      <Meta title={title} description={description} />
    </Card>
  );
}

export default CardComponent;
