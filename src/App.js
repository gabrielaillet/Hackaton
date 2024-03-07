import "./App.css";
import SplitPane from "react-split-pane";
import { useEffect, useState } from "react";
import { getChunks } from "./function";
import { creatJsonOutputData } from "./function";
import help from "./assets/Align_Help.png";
import logo from "./assets/circle-info-solid.svg";
import close from "./assets/x-solid.svg";
const plse = require("./assets/TIT_align_juxta_psle.json");
const jxt = require("./assets/Titus_ChatGPT_English_JUXTA.json");

function App() {
  const [open, setOpen] = useState(true);
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const [currentChuncksId, setCurrentChuncksId] = useState(
    jxt.sentences[0].chunks[0].checksum
  );
  const [elemSelected, setElemSelected] = useState("none");
  const [currentBlockid, setCurrentBlockId] = useState(0);
  const [blocksSentenceId, setBlockSentenceId] = useState(
    plse.blocks[0].sentences
  );
  const [currentSetenceId, setcurrentSentenceId] = useState(
    blocksSentenceId[0]
  );

  const [currentWords, setCurrentWords] = useState([]);
  const [idsWord, setIdsWord] = useState([]);

  const [hoverNotSelectedWord, setHoverNotSelectedWord] = useState([]);
  const modifyPLSE = () => {
    if (plse.blocks[currentBlockid].alignments.length > 0) {
      for (let i = 0; i < plse.blocks[currentBlockid].alignments.length; i++) {
        if (
          currentChuncksId ===
          plse.blocks[currentBlockid].alignments[i].md5Chunck
        ) {
          plse.blocks[currentBlockid].alignments[i] = {
            sentences: currentSetenceId,
            words: currentWords,
            md5Chunck: currentChuncksId,
          };
          return;
        }
      }
      plse.blocks[currentBlockid].alignments.push({
        sentences: currentSetenceId,
        words: currentWords,
        md5Chunck: currentChuncksId,
      });
    } else {
      plse.blocks[currentBlockid].alignments.push({
        sentences: currentSetenceId,
        words: currentWords,
        md5Chunck: currentChuncksId,
      });
    }
  };

  useEffect(() => {
    if (currentChuncksId != "") {
      for (let i = 0; i < plse.blocks[currentBlockid].alignments.length; i++) {
        if (
          currentChuncksId ===
          plse.blocks[currentBlockid].alignments[i].md5Chunck
        ) {
          setCurrentWords(plse.blocks[currentBlockid].alignments[i].words);
          return;
        }
      }
    }
    setCurrentWords([]);
  }, [currentChuncksId]);

  useEffect(() => {
    let tabl = [];
    for (
      let i = 0;
      i <= plse.blocks[currentBlockid].tradText.split(" ").length;
      i++
    ) {
      tabl.push(i);
    }
    for (let i = 0; i < plse.blocks[currentBlockid].alignments.length; i++) {
      plse.blocks[currentBlockid].alignments[i].words.map((w) => {
        tabl.splice(tabl.indexOf(w), 1);
      });
    }
    setIdsWord(tabl);
    setBlockSentenceId(plse.blocks[currentBlockid].sentences);
    setCurrentChuncksId(
      jxt.sentences[plse.blocks[currentBlockid].sentences[0]].chunks[0].checksum
    );
  }, [currentBlockid]);

  const myFunctionTrue = () => {
    setCtrlPressed(true);
  };
  const myFunctionFalse = () => {
    setCtrlPressed(false);
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Control") {
        event.preventDefault();
        myFunctionTrue();
      }
    };
    const keyUphandler = (event) => {
      if (event.key === "Control") {
        event.preventDefault();
        myFunctionFalse();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUphandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);
  return (
    <div style={{ margin: 20,height:'100vh' }}>
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
          margin: 20,
        }}
      >
        <div
          className="Button"
          onClick={() => {
            modifyPLSE();
            setCurrentBlockId((prev) => prev - 1);
          }}
        >
          block precedent
        </div>
        <div style={{ fontSize: "2em" }}>
          {currentBlockid + 1}/{plse.blocks.length}
        </div>

        <div
          className="Button"
          onClick={() => {
            modifyPLSE();
            setCurrentBlockId((prev) => prev + 1);
          }}
        >
          block suivant
        </div>
      </div>
      <div style={{ flexDirection: "row", display: "flex",height:'100%' }}>
    <div className="diva" style={{ overflowY: 'scroll', flex: 1 }}>
          {blocksSentenceId.map((ids) =>
            jxt.sentences[ids].chunks.map((c) => (
              <div
                className="sentencesWrapper"
                onMouseEnter={() => {
                  if (c.checksum != currentChuncksId) {
                    for (
                      let i = 0;
                      i < plse.blocks[currentBlockid].alignments.length;
                      i++
                    ) {
                      if (
                        c.checksum ===
                        plse.blocks[currentBlockid].alignments[i].md5Chunck
                      ) {
                        console.log(
                          plse.blocks[currentBlockid].alignments[i].words
                        );

                        setHoverNotSelectedWord(
                          plse.blocks[currentBlockid].alignments[i].words
                        );
                      }
                    }
                  }
                }}
                onMouseLeave={() => {
                  setHoverNotSelectedWord([]);
                }}
                data-hasBeenDone={JSON.stringify(
                  plse.blocks[currentBlockid].alignments
                    .map(
                      (a) => a.md5Chunck === c.checksum && a.words.length > 0
                    )
                    .indexOf(true) >= 0
                )}
                data-isSelected={currentChuncksId === c.checksum}
                onClick={() => {
                  modifyPLSE();
                  setcurrentSentenceId(ids);
                  setCurrentChuncksId(c.checksum);
                }}
              >
                <div
                  id={c.checksum}
                  data-isSelected={currentChuncksId === c.checksum}
                  className="sentences"
                >
                  {c.gloss}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="divb" id="wrapper" style={{ overflowY: 'scroll', flex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", margin: 15 }}>
            {plse.blocks[currentBlockid].tradText.split(" ").map((w, id) => (
              <p
                onClick={() => {
                  if (idsWord.includes(id)) {
                    if (!currentWords.includes(id)) {
                      setCurrentWords((prev) => {
                        let prev2 = [...prev];
                        prev2.push(id);
                        return prev2;
                      });
                      setIdsWord((prev) => {
                        let prevIdsWord = [...prev];
                        prevIdsWord.splice(prevIdsWord.indexOf(id), 1);
                        return prevIdsWord;
                      });
                    } else {
                    }
                  } else {
                    if (currentWords.includes(id)) {
                      setIdsWord((prev) => {
                        let prev2 = [...prev];
                        prev2.push(id);
                        return prev2;
                      });
                      setCurrentWords((prev) => {
                        let prevIdsWord = [...prev];
                        prevIdsWord.splice(prevIdsWord.indexOf(id), 1);
                        return prevIdsWord;
                      });
                    }
                  }
                }}
                onMouseDown={() => {
                  setElemSelected([id, [...currentWords]]);
                }}
                onMouseUp={() => {
                  setElemSelected("none");
                }}
                onMouseOver={() => {
                  if (elemSelected != "none") {
                    for (let wid = 0; wid < currentWords.length; wid++) {
                      if (
                        elemSelected[1].indexOf(currentWords[wid]) < 0 &&
                        (currentWords[wid] < elemSelected[0] ||
                          currentWords[wid] > id)
                      ) {
                        setIdsWord((prev) => {
                          let prev2 = [...prev];
                          prev2.push(currentWords[wid]);
                          return prev2;
                        });
                        setCurrentWords((prev) => {
                          let prevIdsWord = [...prev];
                          prevIdsWord.splice(wid, 1);
                          return prevIdsWord;
                        });
                      }
                    }
                    for (let i = elemSelected[0]; i <= id; i++) {
                      if (idsWord.includes(i)) {
                        if (!currentWords.includes(i)) {
                          setCurrentWords((prev) => {
                            let prev2 = [...prev];
                            prev2.push(i);
                            return prev2;
                          });
                          setIdsWord((prev) => {
                            let prevIdsWord = [...prev];
                            prevIdsWord.splice(prevIdsWord.indexOf(i), 1);
                            return prevIdsWord;
                          });
                        } else {
                        }
                      }
                    }
                  }
                }}
                // onMouseOver={() => {
                //   console.log(ctrlPressed)
                //   if (ctrlPressed) {
                //
                className="Word"
                id="Word"
                data-selected={currentWords.includes(id)}
                data-ctrl={ctrlPressed}
                data-notSelectedBuHover={hoverNotSelectedWord.includes(id)}
                data-notCLicable={
                  !currentWords.includes(id) && !idsWord.includes(id)
                }
              >
                {w}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: "fixed", bottom: 60, right: 60 }}>
        {open ? (
          <>
          <div
            style={{
              flexDirection: "column",
              justifyContent: "flex-end", 
              display: "flex",
              background: "#ebebeb",
              borderRadius:10,
            }}
          >
            <img
              style={{ alignSelf: "flex-end",marginTop:16,marginRight:16}}
              onClick={() => setOpen(false)}
              src={close}
              width="24"
              height="24"
              alt="logo"
            />
            <img src={help} height={307} width={581}/>
           
          </div>
           <img
           onClick={() => setOpen(false)}
           src={logo}
           width="40"
           height="40"
y           style={{position: "fixed", bottom: 35, right: 35 }}
         /></>
        ) : (
          <img
            onClick={() => setOpen(true)}
            src={logo}
            style={{position: "fixed", bottom: 35, right: 35}}
            width="40"
            height="40"
            alt="logo"
            
          />
        )}
      </div>
    </div>
  );
}

export default App;
