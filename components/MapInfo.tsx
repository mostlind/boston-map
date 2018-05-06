import * as React from "react";
import { createPortal } from "react-dom";
import { css } from "emotion";

type Info = {
  name: string;
  image: string;
  address: string;
  description: string;
  completed: boolean;
};

type MapInfoProps = { info: Info };

const header = css`
  background-color: steelblue;
  padding: 0.5em 1em;
  border-top-left-radius: 10px 10px;
  border-top-right-radius: 10px 10px;
  color: white;
`;

const roundTop = css`
  border-top-left-radius: 10px 10px;
  border-top-right-radius: 10px 10px;
`;

export default (props: MapInfoProps) => {
  const { name, image, address, description, completed } = props.info;
  return createPortal(
    <div className={roundTop}>
      <h1 className={header}>{name}</h1>
      <img src={image} />
      <h5>{address}</h5>
      <p>{description}</p>
    </div>,
    document.getElementById("map-info")
  );
};
