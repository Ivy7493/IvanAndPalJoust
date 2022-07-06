import { initJoin } from "./join.js";
import { initStart } from "./start.js";
import { initGame } from "./game.js";
import { initLose } from "./lose.js";

//====='PAGE' SWITCHING ON SPA=====//
const allPages = document.querySelectorAll(".page");
let currPage = "";
let activePage = null;

export function setPage(p) {
    if(["game", "join", "start", "win", "lose"].indexOf(p) > -1) //Page types
    {
        currPage = p;
        allPages.forEach(x => {
            x.disabled = true; //TODO: Check
            x.classList.add("disabled");
        });
        activePage = document.querySelector("." + p + "Page"); //enable current page

        activePage.classList.remove("disabled");

        if (p == "join")
            initJoin();
        if (p == "start")
            initStart();
        if (p == "game")
            initGame();
        if (p == "lose")
            initLose();
    }
}