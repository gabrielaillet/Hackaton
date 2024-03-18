import checkLogoWrong from "./assets/check_circleWrong.svg";
import checkLogoTrue from "./assets/check_circleTrue.svg"
export function AlignedButton({ onClick,isCurrentSentenceAlign }) {
  return (
    <div className="wrapperButtonAlign" onClick={() => onClick()}>
      <div className="layoutButtonAlign">
        <img
          src={isCurrentSentenceAlign?checkLogoTrue:checkLogoWrong}
          width="32"
          height="32"
          style={{backgroundColor:"#CCC",borderRadius:40}}
        />
        <div className="staticText">Aligned</div>
      </div>
    </div>
  );
}
