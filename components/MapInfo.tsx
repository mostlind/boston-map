import * as React from "react";
import { createPortal } from "react-dom";
import { css } from "emotion";

type Info = {
  name: string;
  image: string;
  address: string;
  description: string;
  completed: boolean;
  coords: [number, number];
};

type MapInfoProps = { info: Info };

function googleMapsDirectionUrl(coords) {
  if (!coords) return "";
  console.log(coords);
  let [long, lat] = coords;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`;
}

const tranformOpen = css`
  box-shadow: #555 -2px -2px 30px;
  transform: translateY(-25vh);
`;

const tranformExtended = css`
  box-shadow: #555 -2px -2px 30px;
  transform: translateY(-75vh);
`;

const tranformClosed = css`
  box-shadow: none;
  transform: translateY(0vh);
`;

const directionsButton = css`
  color: white;
  text-decoration: none;
  display: inline-block;
  background-color: steelblue;
  margin: 1em;
  padding: 0.5em 1em;
  border-radius: 10px 10px;
  transition: background-color 300ms ease-out;
  &:hover {
    background-color: #333;
  }
`;

const stateToClass = {
  closed: tranformClosed,
  open: tranformOpen,
  extended: tranformExtended
};

const header = css`
  background-color: steelblue;
  padding: 0.5em 1em;
  border-top-left-radius: 10px 10px;
  border-top-right-radius: 10px 10px;
  color: white;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const roundTop = css`
  border-top-left-radius: 10px 10px;
  border-top-right-radius: 10px 10px;
`;

export default class MapInfo extends React.Component {
  state = {
    openState: "closed"
  };
  constructor(props) {
    super(props);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps.info.name && !prevState.open
      ? { openState: "open" }
      : null;
  }

  render() {
    const {
      name,
      image,
      address,
      description,
      completed,
      coords
    } = this.props.info;
    return (
      <div className={"map-info"}>
        <div className={`${roundTop} ${stateToClass[this.state.openState]}`}>
          <div
            onClick={() =>
              this.setState({
                openState: this.state.openState === "open" ? "extended" : "open"
              })
            }
            className={header}
          >
            <h1>{name}</h1>
            <span
              onClick={e => {
                this.setState({ openState: "closed" });
                e.stopPropagation();
              }}
            >
              X
            </span>
          </div>
          <a
            className={directionsButton}
            target="_blank"
            href={googleMapsDirectionUrl(coords)}
          >
            Directions
          </a>
          <img src={image} />
          <h5>{address}</h5>
          <p>{description}</p>
        </div>
      </div>
    );
  }
}
