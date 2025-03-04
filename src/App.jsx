import React, { useState } from 'react';
import "./App.css"

const manzu_tiles = ["1m", "9m"]
const pinzu_tiles = ["1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p"]
const souzu_tiles = ["1s", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s"]
const tupai_tiles = ["東", "南", "西", "北", "白", "発", "中"]
const tiles = [...manzu_tiles, ...pinzu_tiles, ...souzu_tiles, ...tupai_tiles]

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

const darumaList = [
  {
    "value": "manzu-disable",
    "label": "萬子ドラ無効",
  },
  {
    "value": "pinzu-disable",
    "label": "筒子ドラ無効",
  },
  {
    "value": "souzu-disable",
    "label": "索子ドラ無効",
  },
  {
    "value": "other",
    "label": "その他",
  },
]

function DarumaSelectRadio({darumaDsc, checked, onDarumaSelect}) {
  return (<>
    <input
      type="radio"
      id={`daruma-select-${darumaDsc.value}`}
      name="daruma"
      value={darumaDsc.value}
      checked={checked}
      onChange={onDarumaSelect}
    />
    <label htmlFor={`daruma-select-${darumaDsc.value}`}>{darumaDsc.label}</label>
  </>)
}

function OutOfRegionToggle({includeProhibited, handleSetIncludeProhibited}) {
  return <label className="toggle-container">
    領域牌以外を含めて表示
    <input
      type="checkbox"
      checked={includeProhibited}
      onChange={handleSetIncludeProhibited}
    />
    <span className="slider"></span>
  </label>
}

function GodRegionTiles({tiles, isGodRegionTile, includeOutOfRegion}) {
  function Empty() {
    return <></>
  }
  return (<div>
    {tiles.map((tile, index) => (
      isGodRegionTile[index] || includeOutOfRegion
        ? (<div key={index} className="god-region-tile-container">
          <img
            className={includeOutOfRegion && !isGodRegionTile[index] ? "out-of-region-tile" : ""}
            src={makeTileImgURL(tile)}
          />
          {includeOutOfRegion && !isGodRegionTile[index] ? <div className="cancel-mark"></div> : <></>}
        </div>)
        : <Empty key={index}/>
    ))}
  </div>)
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

  const [selectedDaruma, setSelectedDaruma] = useState("other");
  function onDarumaSelect(event) {
    setSelectedDaruma(event.target.value)
  }

  const [includeOutOfRegion, setIncludeOutOfRegion] = useState(false);
  function handleSetIncludeOutOfRegion(event) {
    setIncludeOutOfRegion(event.target.checked)
  }

  const isGodRegionTile = Array(27).fill(false);
  for (const doraDisplay of doraDisplayTiles) {
    let dora = doraTable[doraDisplay];
    let doraDisplayIdx = tiles.findIndex((tile) => tile === doraDisplay);
    let doraIdx = tiles.findIndex((tile) => { return tile === dora });
    // Skip disabled dora
    if (selectedDaruma == "manzu-disable" && manzu_tiles.includes(doraDisplay)
      || selectedDaruma == "pinzu-disable" && pinzu_tiles.includes(doraDisplay)
      || selectedDaruma == "souzu-disable" && souzu_tiles.includes(doraDisplay)) {
      continue;
    }
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
        <h2>ダルマ効果</h2>
        <div className="daruma-select-container">
          {
            darumaList.map(darumaDsc => (
              <DarumaSelectRadio
                key={darumaDsc.value}
                darumaDsc={darumaDsc}
                checked={darumaDsc.value == selectedDaruma}
                onDarumaSelect={onDarumaSelect}
              />
            ))
          }
        </div>
      <div className="selected-tiles-container">
        <h2>ドラ表示牌: ({doraDisplayTiles.length} 枚)</h2>
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
      <div className="god-region-tiles-container">
        <h2>領域牌: ({godRegionTiles.length} 枚)</h2>
        <OutOfRegionToggle
          includeProhibited={includeOutOfRegion}
          handleSetIncludeProhibited={handleSetIncludeOutOfRegion}
        />
        <GodRegionTiles
          tiles={tiles}
          isGodRegionTile={isGodRegionTile}
          includeOutOfRegion={includeOutOfRegion}
        />
      </div>
    </div>
  );
}

export default App
