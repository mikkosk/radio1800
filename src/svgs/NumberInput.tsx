import React, { useEffect, useState } from 'react';

const NumberInput: React.FC<{date: number,  changeDate: (value: string) => boolean}> = ({date, changeDate}) => {
    const [value, setValue] = useState<number | null>(date);
    const getCheckedDate = (value: string) => { 
        if(!changeDate(value)) {
            setValue(date);
        }
    };

    useEffect(() => {
        setValue(date);
    }, [date]);
    return(
        <div>
            <svg viewBox="0 0 229 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="button-box-1">
                <rect id="box" width="229" height="79" fill="black"/>
                <rect id="input-background" x="11" y="9" width="209" height="61"/>
                <foreignObject x="11" y="9" width="209" height="61">
                    <input className="number-input" type="number" onChange={({target}) => setValue(Number(target.value) || null)} onBlur={({target}) => {getCheckedDate(target.value);}} value={value || ""}></input>
                </foreignObject>
                    <g id="ornate">
                        <path d="M23.2515 21.073L1.43087 19.5995L14.2961 1.12019L23.2515 21.073Z" fill="black"/>
                        <path d="M206.109 58.8841L227.964 59.7113L215.651 78.5632L206.109 58.8841Z" fill="black"/>
                        <path d="M207.339 22.0099L214.501 1.3454L228.945 18.6186L207.339 22.0099Z" fill="black"/>
                        <path d="M23.1454 57.6993L14.5696 77.8182L1.35654 59.586L23.1454 57.6993Z" fill="black"/>
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default NumberInput;