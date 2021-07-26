import "./ping.css";
import {useRef, useState} from "react";

export default function PingerPonger() {
    const inputEl = useRef<any>(null);
    const [ping, setPing] = useState<number | null>(null);
    let [error, setError] = useState<number>(0);

    const onButtonClick = () => {

        const url = inputEl.current.value;
        const startTime = new Date().getTime();
        setError(0)
        fetch(url, {method: "HEAD"})
            .then((data) => {
                const timeAfterAnswer = new Date().getTime()
                setPing(timeAfterAnswer - startTime)
                setError(data.status);
            })
            .catch(() => {
                const timeAfterAnswer = new Date().getTime()
            setPing(timeAfterAnswer - startTime);});
    };

    return (
        <div className="pinger">
            <div>Пингователь</div>
            <input ref={inputEl} type="text" className="input"/>
            <button onClick={onButtonClick} className="but">Проверить</button>
            {error? <div>Запрос некорректен</div> : ping? <p>Пинг: {ping} мс</p> : ""}
        </div>
    );
}