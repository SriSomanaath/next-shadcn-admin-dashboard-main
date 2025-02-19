export const getApiBaseUrl = () => {
    return process.env.NEXTAUTH_URL || 
           'https://dvtoolstaging.bigvision.ai/dvtools_be';  // fallback URL, this is safe side[this can be exposed but not the browser]
};

// we might be using the env url's in client and server components which will return undefined so to avoid that I wrote this //sreenath[07-09-25]