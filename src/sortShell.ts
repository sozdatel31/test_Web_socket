import {dataMessage} from "./workFolder/App";


export let ShellSort = (arr: Array<dataMessage>) => {
    let arr1 = arr.map(m => m.value)
    const l = arr1.length;
    let gap = Math.floor(l / 2);
    while (gap >= 1) {
        for (let i = gap; i < l; i++) {
            const current = arr1[i];
            let j = i;
            while (j > 0 && arr1[j - gap] > current) {
                arr1[j] = arr1[j - gap];
                j -= gap;
            }
            arr1[j] = current;
        }
        gap = Math.floor(gap / 2);
    }

    return arr1;
};