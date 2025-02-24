import React, { useState } from 'react';
import "./App.css"

const tiles = [ "1m", "9m", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "1s", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", "東", "南", "西", "北", "白", "発", "中"]

const doraTable = {
  "1m": "9m",
  "9m": "1m",
  "1p": "2p",
  "2p": "3p",
  "3p": "4p",
  "4p": "5p",
  "5p": "6p",
  "6p": "7p",
  "7p": "8p",
  "8p": "9p",
  "9p": "1p",
  "1s": "2s",
  "2s": "3s",
  "3s": "4s",
  "4s": "5s",
  "5s": "6s",
  "6s": "7s",
  "7s": "8s",
  "8s": "9s",
  "9s": "1s",
  "東": "南",
  "南": "西",
  "西": "北",
  "北": "東",
  "白": "発",
  "発": "中",
  "中": "白",
}

function makeTileImgURL(tileName) {
  const base = import.meta.env.BASE_URL

  let imgURL;
  if (tileName.endsWith("m")) {
    imgURL = base + `/manzu2_1/p_ms${parseInt(tileName)}_1.gif`;
  } else if (tileName.endsWith("p")) {
    imgURL = base + `/pinzu2_1/p_ps${parseInt(tileName)}_1.gif`;
  } else if (tileName.endsWith("s")) {
    imgURL = base + `/sozu2_1/p_ss${parseInt(tileName)}_1.gif`;
  } else {
    switch (tileName) {
      case "東":
        imgURL = base + "/tupai2_1/p_ji_e_1.gif";
        break;
      case "南":
        imgURL = base + "/tupai2_1/p_ji_s_1.gif";
        break;
      case "西":
        imgURL = base + "/tupai2_1/p_ji_w_1.gif";
        break;
      case "北":
        imgURL = base + "/tupai2_1/p_ji_n_1.gif";
        break;
      case "白":
        imgURL = base + "/tupai2_1/p_no_1.gif";
        break;
      case "発":
        imgURL = base + "/tupai2_1/p_ji_h_1.gif";
        break;
      case "中":
        imgURL = base + "/tupai2_1/p_ji_c_1.gif";
        break;
      default:
    }
  }
  return imgURL
}

function App() {
  const [doraDisplayTiles, setDoraDisplayTiles] = useState([]);

  const handleTileClick = (doraDisplay) => {
    if (doraDisplayTiles.length < 10 && !exhaustedTiles.has(doraDisplay)) {
      setDoraDisplayTiles([...doraDisplayTiles, doraDisplay]);
    }
  };

  let doraDisplayCount = Array(27).fill(0);
  let exhaustedTiles = new Set();
  for (const doraDisplay of doraDisplayTiles) {
    const idx = tiles.findIndex((tile) => tile === doraDisplay);
    doraDisplayCount[idx] += 1;
    if (doraDisplayCount[idx] >= 4) {
      exhaustedTiles.add(doraDisplay);
    }
  }

  const handleSelectedTileClick = (removeIdx) => {
    let newSelectedTiles = [...doraDisplayTiles];
    newSelectedTiles.splice(removeIdx, 1);
    setDoraDisplayTiles(newSelectedTiles);
  };

  const isGodRegionTile = Array(27).fill(false);
  for (const doraDisplay of doraDisplayTiles) {
    let dora = doraTable[doraDisplay];
    let doraDisplayIdx = tiles.findIndex((tile) => tile === doraDisplay);
    let doraIdx = tiles.findIndex((tile) => { return tile === dora });
    isGodRegionTile[doraDisplayIdx] = true;
    isGodRegionTile[doraIdx] = true;
  }

  let godRegionTiles = [];
  for (let idx = 0; idx < 27; idx++) {
    if (isGodRegionTile[idx]) {
      godRegionTiles.push(tiles[idx]);
    }
  }

  return (
    <div className="app-container">
      <h1>領域牌可視化ツール</h1>
      <div className="tile-container">
        <h2>ドラ表示牌選択</h2>
        <p>牌をクリックしてドラ表示牌を追加してください。</p>
        {tiles.map((tile) => (
          <button
            key={tile}
            className={exhaustedTiles.has(tile) ? "exhausted-tile" : ""}
          >
            <img
              src={makeTileImgURL(tile)}
              onClick={() => handleTileClick(tile)}
            />
          </button>
        ))}
      </div>
      <div className="selected-tiles-container">
        <h2>ドラ表示牌</h2>
        <div>
          {doraDisplayTiles.map((tile, index) => (
            <button
              key={index}
            >
              <img
                src={makeTileImgURL(tile)}
                onClick={() => handleSelectedTileClick(index)} // Click handler for selected tiles
              />
            </button>
          ))}
        </div>
      </div>
      <div className="god-region-tiles-continer">
        <h2>領域牌: ({godRegionTiles.length} 枚)</h2>
        <div>
          {godRegionTiles.map((tile, index) => (
            <img
              src={makeTileImgURL(tile)}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App
