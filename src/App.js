import "./App.css";
import { useEffect, useState } from "react";
import { getChunks } from "./function";
import { creatJsonOutputData } from "./function";
import help from "./assets/Align_Help.png";
import logo from "./assets/circle-info-solid.svg";
import close from "./assets/x-solid.svg";
import { lexingRegexes } from "proskomma-core";
import XRegExp from "xregexp";
const plse = require("./assets/TIT_align_juxta_psle.json");
const jxt = require("./assets/Titus_ChatGPT_English_JUXTA.json");

function App() {
  const mainRegex = XRegExp.union(lexingRegexes.map((x) => x[2]));
  console.log(plse);
  const [open, setOpen] = useState(true);
  const [zoomLeft, setZoomLeft] = useState(24);
  const [zoomRigth, setZoomRigth] = useState(24);
  const [left, setLeft] = useState("none");
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const [currentChuncksId, setCurrentChuncksId] = useState("none");
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

  const myFunctionPlusTrue = () => {
    if (left) {
      setZoomLeft((prev) => prev + 2);
      console.log(zoomLeft);
    }
    if (!left) {
      setZoomRigth((prev) => prev + 2);
      console.log(zoomLeft);
    }
  };
  const myFunctionMinusFalse = () => {
    if (left) {
      setZoomLeft((prev) => prev - 2);
      console.log(zoomLeft);
    }
    if (!left) {
      setZoomRigth((prev) => prev - 2);
      console.log(zoomLeft);
    }
  };
  const myFunctionControlFalse = () => {
    setCtrlPressed(false);
  };
  const myFunctionControlTrue = () => {
    setCtrlPressed(true);
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Control") {
        event.preventDefault();
        myFunctionControlTrue();
      }
      if (ctrlPressed && event.key === ";") {
        event.preventDefault();
        myFunctionPlusTrue();
      }
      if (ctrlPressed && event.key === "'") {
        event.preventDefault();

        myFunctionMinusFalse();
      }
    };
    const keyUphandler = (event) => {
      if (event.key === "Control") {
        event.preventDefault();
        myFunctionControlFalse();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUphandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [ctrlPressed, zoomLeft, left]);
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
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
            if (currentBlockid != 0) {
              modifyPLSE();
              setCurrentBlockId((prev) => prev - 1);
            }
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
            if (currentBlockid != plse.blocks.length - 1) {
              modifyPLSE();
              setCurrentBlockId((prev) => prev + 1);
            }
          }}
        >
          block suivant
        </div>
      </div>
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          height: "90%",
          zIndex: 0,
        }}
      >
        <div
          className="diva"
          onMouseOver={() => {
            setLeft(true);
          }}
          onClick={() => {
            modifyPLSE();
            setCurrentChuncksId("none");
          }}
          style={{ overflowY: "scroll", flex: 1, resize: "horizontal" }}
        >
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
                onClick={(e) => {
                  e.stopPropagation();
                  modifyPLSE();
                  setcurrentSentenceId(ids);
                  setCurrentChuncksId(c.checksum);
                }}
              >
                <div
                  fontSize={zoomLeft}
                  id={c.checksum}
                  data-isSelected={currentChuncksId === c.checksum}
                  className="sentences"
                  style={{ fontSize: zoomLeft }}
                >
                  {c.gloss}
                </div>
              </div>
            ))
          )}
        </div>
        <div
          className="divb"
          id="wrapper"
          onClick={() => {
            modifyPLSE();
          }}
          onMouseOver={() => {
            setLeft(false);
          }}
          style={{ overflowY: "scroll", flex: 1 }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", margin: 15 }}>
            {XRegExp.match(
              plse.blocks[currentBlockid].tradText,
              mainRegex,
              "all"
            )
              .map((w) => {
                if (
                  XRegExp(
                    "([\\p{Letter}\\p{Number}\\p{Mark}\\u2060]{1,127})"
                  ).test(w)
                ) {
                  return [w, true];
                } else {
                  return [w, false];
                }
              })
              .map((wt, id) =>
                wt[1] ? (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentChuncksId != "none") {
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
                      }
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      if (currentChuncksId != "none") {
                        setElemSelected([id, [...currentWords]]);
                      }
                    }}
                    onMouseUp={(e) => {
                      e.stopPropagation();
                      if (currentChuncksId != "none") {
                        setElemSelected("none");
                      }
                    }}
                    onMouseOver={(e) => {
                      e.stopPropagation();
                      if (currentChuncksId != "none") {
                        if (elemSelected != "none") {
                          let p = [...currentWords];
                          let t = [...idsWord];
                          for (let wid = 0; wid < currentWords.length; wid++) {
                            if (
                              elemSelected[1].indexOf(currentWords[wid]) < 0 &&
                              (currentWords[wid] < elemSelected[0] ||
                                currentWords[wid] > id)
                            ) {
                              t.push(currentWords[wid]);

                              p.splice(p.indexOf(currentWords[wid]), 1);
                            }
                          }
                          setIdsWord(t);
                          setCurrentWords(p);

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
                      }
                    }}
                    // onMouseOver={() => {
                    //   console.log(ctrlPressed)
                    //   if (ctrlPressed) {
                    //
                    className="Word"
                    id="Word"
                    style={{ fontSize: zoomRigth }}
                    data-selected={currentWords.includes(id)}
                    data-ctrl={ctrlPressed}
                    data-notSelectedBuHover={hoverNotSelectedWord.includes(id)}
                    data-notCLicable={
                      !currentWords.includes(id) && !idsWord.includes(id)
                    }
                  >
                    {wt[0]}
                  </div>
                ) : (
                  <div className="notUsedWord" style={{ fontSize: zoomRigth }}>
                    {wt[0]}
                  </div>
                )
              )}
          </div>
        </div>
      </div>
      <div style={{ position: "fixed", bottom: 60, right: 60 }}>
        <div data-isClosed={open} className="imageWrapper">
          <div className="image" data-isClosed={open}>
            <div
              style={{
                flexDirection: "column",
                justifyContent: "flex-end",
                display: "flex",
                background: "#ebebeb",
                borderRadius: 10,
              }}
            >
              <img
                style={{
                  alignSelf: "flex-end",
                  marginTop: 16,
                  marginRight: 16,
                }}
                onClick={() => {
                  console.log("nothing!");
                  setOpen(false);
                }}
                src={close}
                width="24"
                height="24"
                alt="logo"
              />
              <img src={help} width={1290} height={450} />
            </div>
          </div>
          <img
            onClick={() => setOpen((prev) => !prev)}
            src={logo}
            width="40"
            height="40"
            style={{ position: "fixed", bottom: 35, right: 35 }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
