import "./ping.css";
import {useRef, useState} from "react";

export default function PingerPonger() {
    const inputEl = useRef<any>(null);
    const [ping, setPing] = useState<any>(null);
    const onButtonClick = () => {

        const url = inputEl.current.value;
        const start = new Date();


        fetch(url)
            // @ts-ignore
            .then((data) => setPing(new Date() - start, data))
            .catch(() => {
                // @ts-ignore
                setPing(new Date() - start);
            });
    };

    return (
        <div className="pinger">
            <input ref={inputEl} type="text"/>
            <button onClick={onButtonClick}>Проверить</button>
            {ping ? <p>Пинг: {ping} мс</p> : null}
        </div>
    );
}