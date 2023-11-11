// export const loadGoogleMapsAPI = (callback) => {
//     const existingScript = document.getElementById('googleMaps');
//     console.log('existingScript: ', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
//
//     if (!existingScript) {
//         const script = document.createElement('script');
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
//         script.id = 'googleMaps';
//         document.body.appendChild(script);
//
//         script.onload = () => {
//             if (callback) callback();
//         };
//     }
//
//     if (existingScript && callback) callback();
// };
// utils/loadGoogleMapsAPI.ts
export const loadGoogleMapsAPI = (callback?: () => void) => { // Note the use of the optional callback parameter
    const existingScript = document.getElementById('googleMaps');
    console.log('existingScript: ', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

    if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.id = 'googleMaps';
        document.body.appendChild(script);

        script.onload = () => {
            if (callback) callback(); // Only call the callback if it's provided
        };
    } else if (existingScript && callback) {
        callback(); // Call the callback immediately if the script is already loaded
    }
};
