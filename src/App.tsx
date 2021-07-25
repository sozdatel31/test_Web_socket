import React, {useState} from 'react';

import './App.css';
import {ShellSort} from "./sortShell";
import PingerPonger from "./ss/pingerPonger";

let socket: WebSocket;

let stat1: Array<dataMessage> = []

export type dataMessage = {
    "id": number,
    "value": number
}

function App() {

    const [openStat, setOpenStat] = useState(false)
    const [avarege, setAvarege] = useState<number>(0)
    const [mediana, setMediana] = useState<number>(0)
    const [deviation, setDeviation] = useState<number | undefined>(0)
    const [mode, setMode] = useState<number | string>(0)

    function getMode(arr: Array<number>) {
        let
            key, result = [],
            count: any = {}, max = -1,
            nomodeMsg = "The array hasn't mode.",
            nomodeFlag = true
        ;
        arr.forEach((item) => {
            if (!(item in count)) count[item] = 0;
            count[item]++
            max = max < count[item] ? count[item] : max;
        });
        if (max <= 1) return nomodeMsg;
        for (key in count) {
            if (count[key] === max) {
                result.push(key)
            } else {
                nomodeFlag = false
            }
        }
        return nomodeFlag ? nomodeMsg : setMode(result[0]);
    }

    function StandardDeviation(numbersArr: Array<dataMessage>) {
        //--CALCULATE AVAREGE--
        let total = 0;
        let meanVal = 0;
        for (let i = 0; i < numbersArr.length; i++) {
            total += numbersArr[i].value;
            meanVal = total / numbersArr.length;
        }
        setAvarege(meanVal)
        console.log(`avarege:  ${meanVal}`)

        //--CALCULATE AVAREGE--

        //--CALCULATE STANDARD DEVIATION--
        let SDprep = 0;
        let SDresult;
        for (let j = 0; j < numbersArr.length; j++) {
            SDprep += Math.pow(((numbersArr[j].value) - meanVal), 2);
        }
        SDresult = Math.sqrt(SDprep / (numbersArr.length));
        //--CALCULATE STANDARD DEVIATION--
        console.log(`standard deviation:  ${SDresult}`)
        setDeviation(SDresult)
    }

    function findMedianAndMode(data: Array<dataMessage>) {

        let m = ShellSort(data)
        console.log(`"mode:" ${getMode(m)}`)
        let middle = Math.floor((m.length - 1) / 2); // NB: operator precedence
        if (m.length % 2) {
            console.log(`"median:" ${m[middle]}`)

            return setMediana(m[middle]);
        } else {
            console.log(`"median:" ${(m[middle] + m[middle + 1]) / 2.0}`)
            return setMediana((m[middle] + m[middle + 1]) / 2.0);
        }
    }

    function openWaterfall() {
        socket = new WebSocket("wss://trade.trademux.net:8800/?password=1234")
        socket.addEventListener("message", (ev) => stat1.push(JSON.parse(ev.data)))
    }

    function closeWaterfall() {
        socket.close()
    }

    function openStatistic() {
        setOpenStat(true)
        findMedianAndMode(stat1)
        StandardDeviation(stat1)
    }

    return (
        <div className="App">
            <button onClick={() => openStatistic()}>Статистика</button>
            {openStat ? <div>
                <div>Среднее: {avarege}</div>
                <div>Отклонение: {deviation}</div>
                <div>Мода: {mode}</div>
                <div>Медиана: {mediana}</div>
            </div> : ""}

            <button onClick={openWaterfall}>send request</button>
            <button onClick={closeWaterfall}>close</button>
            <button onClick={() => findMedianAndMode(stat1)}>median, mode</button>
            <button onClick={() => StandardDeviation(stat1)}>Deviation, Avarege</button>
            <PingerPonger/>
        </div>
    );
}

export default App;
