import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";

const useSessionChecker = (inactiveTimeoutMinutes) => {
    const inactiveTimeout = inactiveTimeoutMinutes * 60000;
    const [sessionActive, setSessionActive] = useState(true);
    const [isInactive, setIsInactive] = useState(false);
    const timeoutId = useRef(null);
    const lastCheckTime = useRef(Date.now());

    const MIN_CHECK_INTERVAL = 60000;
    const MAX_RETRY_ATTEMPTS = 3;
    const RETRY_DELAY = 5000;

    const checkSession = useCallback(async (retryCount = 0) => {
        const now = Date.now();
        if (now - lastCheckTime.current < MIN_CHECK_INTERVAL) {
            return;
        }
        lastCheckTime.current = now;

        try {
            const response = await axios.get("/check-session");
            setSessionActive(response.data.authenticated);
        } catch (error) {
            console.error("Error checking session:", error);
            if (error.response && error.response.status === 401) {
                setSessionActive(false);
            } else if (retryCount < MAX_RETRY_ATTEMPTS) {
                setTimeout(() => checkSession(retryCount + 1), RETRY_DELAY);
            }
        }
    }, []);

    const resetTimeout = useCallback(() => {
        clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(
            () => setIsInactive(true),
            inactiveTimeout,
        );
    }, [inactiveTimeout]);

    const handleActivity = useCallback(() => {
        if (isInactive) {
            setIsInactive(false);
            checkSession();
        }
        resetTimeout();
    }, [isInactive, checkSession, resetTimeout]);

    const debouncedHandleActivity = useCallback(debounce(handleActivity, 300), [
        handleActivity,
    ]);

    useEffect(() => {
        const events = [
            "mousemove",
            "mousedown",
            "keydown",
            "touchstart",
            "scroll",
        ];

        events.forEach((event) =>
            window.addEventListener(event, debouncedHandleActivity),
        );

        resetTimeout();

        return () => {
            events.forEach((event) =>
                window.removeEventListener(event, debouncedHandleActivity),
            );
            clearTimeout(timeoutId.current);
        };
    }, [debouncedHandleActivity, resetTimeout]);

    useEffect(() => {
        if (isInactive) {
            checkSession();
        }
    }, [isInactive, checkSession]);

    return { sessionActive };
};

export default useSessionChecker;
