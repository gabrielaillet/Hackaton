export function parseJson(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing JSON", error);
      return null;
    }
  }
  
  export function getOriginalSource(data, sentenceIndex = 0) {
    if (data.sentences && data.sentences[sentenceIndex]) {
      return data.sentences[sentenceIndex].originalSource;
    }
    return [];
  }
  
export function getChunks(data, sentenceIndex = 0) {
    if (data.sentences && data.sentences[sentenceIndex]) {
      return data.sentences[sentenceIndex].chunks;
    }
    return [];
  }
  
 export function getSourceString(data, sentenceIndex = 0) {
    if (data.sentences && data.sentences[sentenceIndex]) {
      return data.sentences[sentenceIndex].sourceString;
    }
    return "";
  }
  
  export function getChecksum(data) {
    return data.checksum || "";
  }
  
  export function getBookCode(data) {
    return data.bookcode || "";
  }
  
  export function getBlocks(data) {
    return data.blocks || [];
  }
  
  export function getSentencesFromBlock(data, blockIndex = 0) {
    const blocks = getBlocks(data);
    if (blocks[blockIndex]) {
      return blocks[blockIndex].sentences || [];
    }
    return [];
  }
  
  export function getHashJxlSentenceFromBlock(data, blockIndex = 0) {
    const blocks = getBlocks(data);
    if (blocks[blockIndex]) {
      return blocks[blockIndex].hashJxlSentence || "";
    }
    return "";
  }
  export function addSentence(jsonData,hashJxlSentence, PSLE, alignment=[]) {
    const sentence = {
        hashJxlSentence,
        PSLE,
        alignment: alignment
    };
    jsonData.sentences.push(sentence);
}

export function addAlignmentToLastSentence(jsonData,words, checksumChunck) {
    if (jsonData.sentences.length === 0) {
        console.log("No sentences available to add alignment.");
        return;
    }
    const lastSentence = jsonData.sentences[jsonData.sentences.length - 1];
    lastSentence.alignment.push({ words, checksumChunck });
}

export function creatJsonOutputData(jxtl){
    let output = {sentences:[]}
    jxtl.sentences.map(s => output.sentences.push({
        hashJxlSentence:s.checksum,
        "PSLE": [],
        "alignment": []
    }))
    return output
}


// export function saveJsonToFile(jsonData,filename) {
//     const jsonString = JSON.stringify(jsonData, null, 2);
//     fs.writeFile(filename, jsonString, 'utf8', (err) => {
//         if (err) {
//             console.log('An error occurred while writing JSON Object to File.');
//             return console.log(err);
//         }
//         console.log('JSON file has been saved.');
//     });
// }



