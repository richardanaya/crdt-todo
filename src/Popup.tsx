import styled from "styled-components";

interface IPopupProps {
  title: string;
  children: React.ReactNode;
  visible: boolean;
  onRequestClose: () => void;
}

const FullScreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: black;
  padding: 30px;
  border-radius: 10px;
  z-index: 101;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  text-align: left;
  margin: 0;
`;

const Content = styled.div`
  text-align: left;
  flex-grow: 1;
`;

export function Popup(props: IPopupProps) {
  return (
    <>
      <FullScreenOverlay
        style={{ display: props.visible ? "block" : "none" }}
        onClick={props.onRequestClose}
      ></FullScreenOverlay>
      <PopupContainer style={{ display: props.visible ? "block" : "none" }}>
        <Title>{props.title}</Title>
        <Content>{props.children}</Content>
      </PopupContainer>
    </>
  );
}
