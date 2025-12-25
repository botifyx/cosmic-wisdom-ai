import { UserContext } from '../types';

const parseUserAgent = (): { browser: string; os: string; device: string } => {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';
    let device = 'Desktop';

    if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(ua)) {
        device = 'Mobile';
    }

    if (/windows phone/i.test(ua)) os = 'Windows Phone';
    else if (/android/i.test(ua)) os = 'Android';
    else if (/iPad|iPhone|iPod/.test(ua)) os = 'iOS';
    else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
    else if (/windows/i.test(ua)) os = 'Windows';
    else if (/linux/i.test(ua)) os = 'Linux';

    if (ua.indexOf("Firefox") > -1) browser = "Firefox";
    else if (ua.indexOf("SamsungBrowser") > -1) browser = "Samsung Browser";
    else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
    else if (ua.indexOf("Trident") > -1) browser = "Internet Explorer";
    else if (ua.indexOf("Edge") > -1) browser = "Edge";
    else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
    else if (ua.indexOf("Safari") > -1) browser = "Safari";

    return { browser, os, device };
}

const getGeolocation = async (): Promise<UserContext['geolocation']> => {
    const fallback = {
        city: 'Mountain View',
        region: 'California',
        country: 'United States',
        latitude: 37.422,
        longitude: -122.084,
        ip: '8.8.8.8',
    };

    const endpoints = [
        'https://ipwho.is/',
        'https://ipapi.co/json/'
    ];

    for (const url of endpoints) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2500);
            
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            
            if (!response.ok) continue;
            const data = await response.json();
            
            // Handle different API response structures
            if (url.includes('ipwho')) {
                if (!data.success) continue;
                return {
                    city: data.city,
                    region: data.region,
                    country: data.country,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    ip: data.ip,
                };
            } else {
                return {
                    city: data.city,
                    region: data.region,
                    country: data.country_name,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    ip: data.ip,
                };
            }
        } catch (e) {
            console.debug(`Geo-node ${url} unavailable, trying next...`);
        }
    }

    console.debug("All geo-nodes failed, using celestial fallback.");
    return fallback;
};

export const getUserContextInfo = async (): Promise<UserContext> => {
    const [userAgent, geolocation] = await Promise.all([
        Promise.resolve(parseUserAgent()),
        getGeolocation()
    ]);
    return { userAgent, geolocation };
};