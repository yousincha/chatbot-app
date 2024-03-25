import React from "react";
import { Card } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

const { Meta } = Card;

function CardComponent(props) {
  // props.cardInfo가 존재하는지 확인합니다.
  if (!props.cardInfo) {
    return null; // cardInfo가 없으면 아무것도 렌더링하지 않습니다.
  }

  // props.cardInfo.fields가 존재하는지 확인합니다.
  if (!props.cardInfo.fields) {
    return null; // fields가 없으면 아무것도 렌더링하지 않습니다.
  }

  // 필요한 필드들을 확인하고 값이 있는지 확인한 후에 렌더링합니다.
  const title = props.cardInfo.fields.stack?.stringValue || "";
  const description = props.cardInfo.fields.description?.stringValue || "";
  const imageUrl = props.cardInfo.fields.image?.stringValue || "";
  const linkUrl = props.cardInfo.fields.link?.stringValue || "";

  return (
    <Card
      style={{ width: 200 }}
      cover={<img alt={description} src={imageUrl} />} // 이미지 크기를 지정합니다.
      actions={[
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
