function verifyme(inRoute, outRoute, companyName, companyLogoLink) {
    const VERIFYME_API = `http://localhost:8080/verifyme/api/${companyName}/call`;

    return {
        api: VERIFYME_API,
        verify: async function () {
            const response = await fetch(VERIFYME_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inRoute, outRoute, companyName, companyLogoLink }),
            });

            return response.json();
        },
    };
}

module.exports = verifyme;
