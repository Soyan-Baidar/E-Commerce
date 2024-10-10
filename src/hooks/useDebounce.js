import { useState, useEffect } from "react";

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue = 1000] = useState(value);

    useEffect (() => {
        const handler = setTimeout(() => {
            console.log("Calleeddd...")
            setDebouncedValue(value);
        },delay);

        return () => {
            clearTimeout(handler);
        };


    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;