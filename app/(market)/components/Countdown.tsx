"use client"

import { useState, useEffect } from 'react';
import Skeleton from '@/app/components/Skeleton';

// Countdown component for events in the HeroBanner
export default function Countdown({ targetDate }: { targetDate: Date }){
    const [timer, updateTimer] = useState({ // local timer
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const [loaded, setLoaded] = useState(false); // local loading state

    const interval = () => {
        const timeUntil = targetDate.getTime();
        const distance = timeUntil - new Date().getTime(), timeout = setTimeout(interval, 1000);

        if (distance < 0){
            clearTimeout(timeout);
            updateTimer({
                days: 0, 
                hours: 0, 
                minutes: 0, 
                seconds: 0
            });
            return;
        } else{
            updateTimer({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }
    };

    useEffect(() => {
        if(!loaded) setLoaded(true); // once the local timer has been initialized, the component can be considered as loaded
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timer]);

    useEffect(() => {
        (async() => {
            interval();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(loaded ? <>
        <div className="timer-block">
            <span id="countdown-days" className="timer-block-number">{timer.days}</span>
            <span className="timer-block-value">days</span>
        </div>
        
        <div className="timer-block">
            <span id="countdown-hours" className="timer-block-number">{timer.hours}</span>
            <span className="timer-block-value">hours</span>
        </div>
        <div className="timer-block">
            <span id="countdown-minutes" className="timer-block-number">{timer.minutes}</span>
            <span className="timer-block-value">minutes</span>
        </div>
        <div className="timer-block">
            <span id="countdown-seconds" className="timer-block-number">{timer.seconds}</span>
            <span className="timer-block-value">seconds</span>
        </div>
    </>:<>
        <Skeleton classes="flex"><div className="timer-block">
            <span id="countdown-days" className="timer-block-number">{timer.days}</span>
            <span className="timer-block-value">days</span>
        </div></Skeleton>
        
        <Skeleton classes="flex"><div className="timer-block">
            <span id="countdown-hours" className="timer-block-number">{timer.hours}</span>
            <span className="timer-block-value">hours</span>
        </div></Skeleton>
        <Skeleton classes="flex"><div className="timer-block">
            <span id="countdown-minutes" className="timer-block-number">{timer.minutes}</span>
            <span className="timer-block-value">minutes</span>
        </div></Skeleton>
        <Skeleton classes="flex"><div className="timer-block">
            <span id="countdown-seconds" className="timer-block-number">{timer.seconds}</span>
            <span className="timer-block-value">seconds</span>
        </div></Skeleton>
    </>);
}