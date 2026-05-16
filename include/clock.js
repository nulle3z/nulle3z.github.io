// CSS类名：clock
// 使用：<div id=“clock”></div>

// clock.js 引入方法
/* 
    <li><div id="clock"></div></li>
    <script src="./include/clock.js"></script>
 */
 
// 正常时间
/*
window.onload = () =>
{
    const clockElement = document.getElementById('clock');
    function updateClock() {
        let now = new Date();

        let hours   = String(now.getHours()).padStart(2,'0');
        let minutes = String(now.getMinutes()).padStart(2,'0');  
        let seconds = String(now.getSeconds()).padStart(2,'0');

        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
        setTimeout(updateClock, 1000);
    }
    updateClock();
};
*/

// UNIX 时间
const clock = document.getElementById("clock");
function updateUnixTime()
{
    const unixTimestamp = Math.floor(Date.now() / 1000);
    clock.textContent = unixTimestamp; // .toLocaleString();
}
updateUnixTime(); setInterval(updateUnixTime, 1000);

// 正常显示 UNIX 时间
// clock.title = "UNIX Timestamp (seconds since 1970-01-01 UTC)";
