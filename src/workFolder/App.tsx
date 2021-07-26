import React, {useState} from 'react';
import './App.css';
import {ShellSort} from "../sortShell";
import PingerPonger from "./pingerPonger";

let socket: WebSocket;

let stat1: Array<dataMessage> = []

export type dataMessage = {
    "id": number,
    "value": number
}
type TargetType = {
    mode: number | null,
    avarege: number,
    // mediana: number,
    deviation: number | undefined
}

function App() {
    const [target, setTarget] = useState<TargetType>({
        mode: 0,
        avarege: 0,
        // mediana: 0,
        deviation: 0
    })
    const [openStat, setOpenStat] = useState(false)
    const [modeObj, setModeObj] = useState({
        count: {} as { [key: string]: number },
        max: -1,
        mode: null as null | number
    })
    const saveMode = (data: number) => {
        if (!(data in modeObj.count))
            modeObj.count[data] = 0;
        modeObj.count[data]++
        if (modeObj.count[data] > modeObj.max) {
            modeObj.max = modeObj.count[data]
            modeObj.mode = data;
        }
        setModeObj({...modeObj})
    }
//-----------------------------------------------
    const [avaregeAndDeviation, setAvaregeAndDeviation] = useState({
        total: 0, meanVal: 0,
        count: 0, SDprep: 0, SDresult: undefined as undefined | number,
    })
    const saveAvaregeAndDeviation = (data: number) => {
        avaregeAndDeviation.count++;
        avaregeAndDeviation.total += data
        avaregeAndDeviation.meanVal = avaregeAndDeviation.total / avaregeAndDeviation.count;
        avaregeAndDeviation.SDprep += Math.pow((data - avaregeAndDeviation.meanVal), 2);
        avaregeAndDeviation.SDresult = Math.sqrt((avaregeAndDeviation.SDprep / (avaregeAndDeviation.count)));
        setAvaregeAndDeviation({...avaregeAndDeviation})
    }
//------------------------------------------------
// Не смог оптимизировать расчёт медианы
    // function findMedianAndMode(data: Array<dataMessage>) {
    //
    //     let m = ShellSort(data)
    //
    //     let middle = Math.floor((m.length - 1) / 2); // NB: operator precedence
    //     if (m.length % 2) {
    //         // console.log(`"median:" ${m[middle]}`)
    //         return m[middle];
    //     } else {
    //         // console.log(`"median:" ${(m[middle] + m[middle + 1]) / 2.0}`)
    //         return (m[middle] + m[middle + 1]) / 2.0;
    //     }
    // }
    function statOpen() {
        setOpenStat(true)
        setTarget({
            // mediana: findMedianAndMode(stat1),
            mode: modeObj.mode,
            avarege: avaregeAndDeviation.meanVal,
            deviation: avaregeAndDeviation.SDresult
        })
    }
//------------------------------------------------
    function openWaterfall() {
        socket = new WebSocket("wss://trade.trademux.net:8800/?password=1234")
        socket.addEventListener("message", (ev) => {
            const data = JSON.parse(ev.data);
            stat1.push(data)
            saveMode(data.value)
            saveAvaregeAndDeviation(data.value)
        })
    }

    function closeWaterfall() {
        socket.close()
    }
//------------------------------------------------
    return (
        <div className="App">
            <button className="but" onClick={openWaterfall}>Старт</button>
            <button disabled={!modeObj.mode} className="but" onClick={() => statOpen()}>Статистика</button>
            {openStat ? <div>
                <div> Среднее: {target.avarege}  </div>
                <div> Стандартное отклонение: {target.deviation}  </div>
                <div> Мода: {target.mode}  </div>
                {/*<div> Медиана: {target.mediana} </div>*/}
            </div> : ""
            }
            <PingerPonger/>
        </div>
    );
}

export default App;