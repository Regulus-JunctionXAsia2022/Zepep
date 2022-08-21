/**
 * Copyright (c) 2022 ZEP Co., LTD
 */

import "zep-script";
import { ScriptPlayer } from "zep-script";

// API
const API = "https://port-0-zepep-backend-13082024l71h3zsw.gksl1.cloudtype.app/api/v1";

// type
export type ChildMessage =
  | {
      type: "updateFriendship";
      name: string;
      friendship: number;
      id: number;
    }
  | { type: "close" }
  | { type: "initialize" }
  | { type: "show" }
  | { type: "hide" }
  | { type: "checkHide" };

// delay number
const STATE_INIT = 3000;
const STATE_READY = 3001;
const STATE_PLAYING = 3002;
const STATE_END = 3005;
const SPRITE_WIDTH = Math.round(500 / 7);
const SPRITE_HEIGHT = Math.round(356 / 5);

// load sprite
let sit_ani = ScriptApp.loadSpritesheet("pet.png", SPRITE_WIDTH, SPRITE_HEIGHT, [0, 1], 8);
let left_ani = ScriptApp.loadSpritesheet(
  "pet.png",
  SPRITE_WIDTH,
  SPRITE_HEIGHT,
  [12, 13, 14, 15],
  8
);
let up_ani = ScriptApp.loadSpritesheet("pet.png", SPRITE_WIDTH, SPRITE_HEIGHT, [8, 9, 10, 11], 8);
let down_ani = ScriptApp.loadSpritesheet(
  "pet.png",
  SPRITE_WIDTH,
  SPRITE_HEIGHT,
  [2, 3, 4, 5, 6, 7],
  8
);
let right_ani = ScriptApp.loadSpritesheet(
  "pet.png",
  SPRITE_WIDTH,
  SPRITE_HEIGHT,
  [20, 21, 22, 23],
  8
);
let zzz_ani = ScriptApp.loadSpritesheet("pet.png", SPRITE_WIDTH, SPRITE_HEIGHT, [28, 29, 30], 8);

// sound

let _players = ScriptApp.players;
let _state = STATE_INIT;
let _stateTimer = 0;

function startApp() {
  ScriptApp.showCenterLabel(`Welcome to Zepep world !`);
  startState(STATE_READY);
}

function startState(state) {
  _state = state;
  _stateTimer = 0;

  switch (_state) {
    case STATE_INIT:
      startApp();
      break;
    case STATE_READY:
      ScriptApp.showCenterLabel(`Zepep is coming soon !`);
      break;
    case STATE_PLAYING:
      break;
    case STATE_END:
      // Clear all objects in the map
      ScriptMap.clearAllObjects();
      break;
  }
}

// App이 최초로 시작될 때
ScriptApp.onInit.Add(function () {
  // 이 시점에 App에는 플레이어들이 참가하지 않은 상태
  // App의 나머지 필요한 부분을 초기화시킨다.
});

// 플레이어가 모두 입장한 뒤에 한번 호출
ScriptApp.onStart.Add(function () {
  // App에서 원하는 플레이어 속성값을 부여할 수 있다.
  startState(STATE_INIT);
});

// 플레이어가 들어올 때
ScriptApp.onJoinPlayer.Add(function (player) {
  // 해당하는 모든 플레이어가 이 이벤트를 통해 App에 입장
  _players = ScriptApp.players;

  for (let i in _players) {
    let p = _players[i];

    p.tag = {
      previousX: p.tileX,
      previousY: p.tileY,
      previousDir: p.dir,
      widget: null,
      hide: true,
    };
  }

  // 플레이어 속성이 변경되었으므로 호출해서 실제 반영해준다.
  player.sendUpdated();
});

// 플레이어가 떠날 때
ScriptApp.onLeavePlayer.Add(function (player) {
  // 플레이어가 단순히 중간에 나갔을 때
  // App이 종료될 때에서 이 이벤트를 통해 모두 App에서 퇴장합니다.

  ScriptMap.putObject(player.tileX, player.tileY, null);

  if (player.tag.widget) {
    player.tag.widget.destroy();
    player.tag.widget = null;
  }

  player.moveSpeed = 60;
  player.sendUpdated();
});

// 매 20ms(0.02초) 마다 실행
ScriptApp.onUpdate.Add(function (dt) {
  _stateTimer += dt;
  switch (_state) {
    case STATE_INIT:
      if (_stateTimer >= 5) startState(STATE_READY);
      break;
    case STATE_READY:
      if (_stateTimer >= 3) startState(STATE_PLAYING);
      break;
    case STATE_PLAYING:
      if (_stateTimer < 0.3) return;
      for (let i in _players) {
        let p = _players[i];



        

        if(p.tag.hide) {ScriptMap.putObject(p.tileX, p.tileY, null);} 
        else {
            ScriptMap.putObject(p.tag.previousX, p.tag.previousY, null)

            if (
                p.tag.previousX !== p.tileX ||
                p.tag.previousY !== p.tileY ||
                p.tag.previousDir !== p.dir
            ) {
                if (p.tag.previousDir % 4 === 1) {
                    ScriptMap.putObject(p.tag.previousX, p.tag.previousY, left_ani, {
                        overlap: true,
                        moveSpeed: 80,
                    });
                    ScriptMap.playObjectAnimation(p.tag.previousX, p.tag.previousY, "#" + left_ani.id, -1);
                    ScriptMap.moveObject(p.tag.previousX, p.tag.previousY, p.tileX, p.tileY, 0.3);
                }

                if (p.tag.previousDir % 4 === 2) {
                    ScriptMap.putObject(p.tag.previousX, p.tag.previousY, up_ani, {
                        overlap: true,
                        moveSpeed: 80,
                    });
                    ScriptMap.playObjectAnimation(p.tag.previousX, p.tag.previousY, "#" + up_ani.id, -1);
                    ScriptMap.moveObject(p.tag.previousX, p.tag.previousY, p.tileX, p.tileY, 0.3);
                }

                if (p.tag.previousDir % 4 === 3) {
                    ScriptMap.putObject(p.tag.previousX, p.tag.previousY, right_ani, {
                        overlap: true,
                        moveSpeed: 80,
                    });
                    ScriptMap.playObjectAnimation(p.tag.previousX, p.tag.previousY, "#" + right_ani.id, -1);
                    ScriptMap.moveObject(p.tag.previousX, p.tag.previousY, p.tileX, p.tileY, 0.3);
                }

                if (p.tag.previousDir % 4 === 0) {
                    ScriptMap.putObject(p.tag.previousX, p.tag.previousY, down_ani, {
                    overlap: true,
                    moveSpeed: 80,
                    });
                    ScriptMap.playObjectAnimation(p.tag.previousX, p.tag.previousY, "#" + down_ani.id, -1);
                    ScriptMap.moveObject(p.tag.previousX, p.tag.previousY, p.tileX, p.tileY, 0.3);
                }

                p.tag.previousX = p.tileX;
                p.tag.previousY = p.tileY;
                p.tag.previousDir = p.dir;
            } else {
                ScriptMap.putObject(p.tag.previousX, p.tag.previousY, sit_ani, {
                    overlap: true,
                });

                ScriptApp.addOnKeyDown(81, function(){
                    ScriptMap.putObject(p.tag.previousX, p.tag.previousY, null)
                    ScriptMap.putObject(p.tag.previousX, p.tag.previousY, zzz_ani, {
                        overlap: true});
                    ScriptMap.playObjectAnimation(p.tag.previousX, p.tag.previousY, "#" + zzz_ani.id, 10);
                })
        

            }


            
        }
        p.sendUpdated();
      }
      _stateTimer = 0;
      break;
    case STATE_END:
      break;
  }
});

// App이 종료될 때
ScriptApp.onDestroy.Add(function () {
  // 이미 모든 플레이어가 App에서 나간 상태
  // App을 나머지를 정리한다.

  ScriptMap.clearAllObjects();
});

// 사이드바 앱이 터치(클릭)되었을 때 동작하는 함수
ScriptApp.onSidebarTouched.Add(function (p) {
  p.tag.widget = p.showWidget("index.html", "sidebar", 300, 510);

  p.tag.widget.onMessage.Add(function (player: ScriptPlayer, data: ChildMessage) {
    switch (data.type) {
      case "initialize":
        ScriptApp.httpGet(`${API}/zepep/my/?user_id=${"Regulus"}`, null, (response) => {
          player.tag.widget.sendMessage({
            result: "success",
            type: data.type,
            data: JSON.parse(response),
          });
        });
        break;
      case "close":
        player.tag.widget.destroy();
        player.tag.widget = null;
        break;
      case "updateFriendship":
        ScriptApp.httpPost(
          `${API}/zepep/${data.id}`,
          null,
          {
            name: data.name,
            user_id: "Regulus",
            friendship: data.friendship.toString(),
          },
          (response) => {
            player.tag.widget.sendMessage({
              result: "success",
              type: "updateFriendship",
              data: JSON.parse(response),
            });
          }
        );
        break;
      case "show":
        player.tag.hide = false;
        break;
      case "hide":
        player.tag.hide = true;
        break;
      case "checkHide":
        player.tag.widget.sendMessage({
          result: "success",
          type: "checkHide",
          data: {
            hide: player.tag.hide,
          },
        });
        break;
      default:
        break;
    }
  });
});
