const prompts = require('prompts');
const fetch = require('node-fetch');
const { exec, spawn } = require('child_process');
const maxResults = 10;
const copyTorrentLink = true;
const executeTorrentLink = true;
const trackers = [
    'udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce',
    'udp%3A%2F%2Ftracker.openbittorrent.com%3A6969%2Fannounce',
    'udp%3A%2F%2F9.rarbg.to%3A2710%2Fannounce',
    'udp%3A%2F%2F9.rarbg.me%3A2780%2Fannounce',
    'udp%3A%2F%2F9.rarbg.to%3A2730%2Fannounce',
    'udp%3A%2F%2Ftracker.opentrackr.org%3A1337',
    'http%3A%2F%2Fp4p.arenabg.com%3A1337%2Fannounce',
    'udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce',
    'udp%3A%2F%2Ftracker.tiny-vps.com%3A6969%2Fannounce',
    'udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce'
];
const categories = {
    "0": ["All"],
    "100": ["Audio"],
    "200": ["Video"],
    "300": ["Applications"],
    "400": ["Games"],
    "500": ["Porn"],
    "600": ["Other"],
    "101": ["Music", "Audio"],
    "102": ["Audio books", "Audio"],
    "103": ["Sound clips", "Audio"],
    "104": ["FLAC", "Audio"],
    "199": ["Other", "Audio"],
    "201": ["Movies", "Video"],
    "202": ["Movies DVDR", "Video"],
    "203": ["Music videos", "Video"],
    "204": ["Movie clips", "Video"],
    "205": ["TV shows", "Video"],
    "206": ["Handheld", "Video"],
    "207": ["HD - Movies", "Video"],
    "208": ["HD - TV shows", "Video"],
    "209": ["3D", "Video"],
    "299": ["Other", "Video"],
    "301": ["Windows", "Applications"],
    "302": ["Mac", "Applications"],
    "303": ["UNIX", "Applications"],
    "304": ["Windows", "Applications"],
    "305": ["Handheld", "Applications"],
    "306": ["IOS (iPad/iPhone)", "Applications"],
    "307": ["Android", "Applications"],
    "399": ["Other OS", "Applications"],
    "401": ["PC", "Games"],
    "402": ["Mac", "Games"],
    "403": ["PSx", "Games"],
    "404": ["XBOX360", "Games"],
    "405": ["Wii", "Games"],
    "406": ["Handheld", "Games"],
    "407": ["IOS (iPad/iPhone)", "Games"],
    "408": ["Android", "Games"],
    "499": ["Other", "Games"],
    "501": ["Movies", "Porn"],
    "502": ["Movies DVDR", "Porn"],
    "503": ["Pictures", "Porn"],
    "504": ["Games", "Porn"],
    "505": ["HD - Movies", "Porn"],
    "506": ["Movie clips", "Porn"],
    "599": ["Other", "Porn"],
    "601": ["E-books", "Other"],
    "602": ["Comics", "Other"],
    "604": ["Pictures", "Other"],
    "605": ["Covers", "Other"],
    "606": ["Physibles", "Other"],
    "699": ["Other", "Other"]
};
const apis = [
    "https://apibay.org",
    "https://thepiratebay.gl/api.php?url="
];
let apisChecked = 1;
let api = "https://apibay.org";
let foundApi = false;

(async () => {
    findApi()
    async function findApi() {
        if (!apis[apisChecked]) {
            console.log(`None of the ${apis.length} domains are online`);
            return process.exit(1);
        }
        const split = apis[apisChecked].split("/");
        const domain = `${split[0]}//${split[2]}`
        console.log(`Scanning domain: ${domain}`);
        await fetch(domain).then(() => {
            console.log(`Online domain found: ${domain}`)
            api = apis[apisChecked];
        }).catch(() => {
            console.log(`Offline domain found: ${domain}`)
            apisChecked += 1;
            return findApi()
        })
    }

    const { askSearch } = await prompts({
        type: 'text',
        message: 'Search query',
        name: 'askSearch',
        validate: validate => !validate ? "No search query provided" : true
    });
    
    const { askCategory } = await prompts({
        type: 'select',
        name: 'askCategory',
        message: 'Category',
        choices: [
            { title: "All", value: "0" },
            { title: "Audio", value: "100" },
            { title: "Video", value: "200" },
            { title: "Applications", value: "300" },
            { title: "Games", value: "400" },
            { title: "Porn", value: "500" },
            { title: "Other", value: "600" },
        ]
    });

    if (askCategory[0] === "0") {
        const { askSpecificCategory } = await prompts({
            type: 'select',
            name: 'askSpecificCategory',
            message: 'Specific category',
            choices: [
                { title: "All", value: "0" },
                { title: "Audio: Music", value: "101" },
                { title: "Audio: Audio books", value: "102" },
                { title: "Audio: Sound clips", value: "103" },
                { title: "Audio: FLAC", value: "104" },
                { title: "Audio: Other", value: "199" },
                { title: "Video: Movies", value: "201" },
                { title: "Video: Movies DVDR", value: "202" },
                { title: "Video: Music videos", value: "203" },
                { title: "Video: Movie clips", value: "204" },
                { title: "Video: TV shows", value: "205" },
                { title: "Video: Handheld", value: "206" },
                { title: "Video: HD - Movies", value: "207" },
                { title: "Video: HD - TV shows", value: "208" },
                { title: "Video: 3D", value: "209" },
                { title: "Video: Other", value: "299" },
                { title: "Applications: Windows", value: "301" },
                { title: "Applications: Mac", value: "302" },
                { title: "Applications: UNIX", value: "303" },
                { title: "Applications: Handheld", value: "304" },
                { title: "Applications: IOS (iPad/iPhone)", value: "305" },
                { title: "Applications: Android", value: "306" },
                { title: "Applications: Other OS", value: "399" },
                { title: "Games: PC", value: "401" },
                { title: "Games: Mac", value: "402" },
                { title: "Games: PSx", value: "403" },
                { title: "Games: XBOX360", value: "404" },
                { title: "Games: Wii", value: "405" },
                { title: "Games: Handheld", value: "406" },
                { title: "Games: IOS (iPad/iPhone)", value: "407" },
                { title: "Games: Android", value: "408" },
                { title: "Games: Other", value: "499" },
                { title: "Porn: Movies", value: "501" },
                { title: "Porn: Movies DVDR", value: "502" },
                { title: "Porn: Pictures", value: "503" },
                { title: "Porn: Games", value: "504" },
                { title: "Porn: HD - Movies", value: "505" },
                { title: "Porn: Movie clips", value: "506" },
                { title: "Porn: Other", value: "599" },
                { title: "Other: E-books", value: "601" },
                { title: "Other: Comics", value: "602" },
                { title: "Other: Pictures", value: "603" },
                { title: "Other: Covers", value: "604" },
                { title: "Other: Physibles", value: "605" },
                { title: "Other: Other", value: "699" }
            ]
        });

        cat = askSpecificCategory;
    } else {
        cat = askCategory;
    }

    //console.log(`Making request "https://apibay.org?q=${decodeURIComponent(askSearch)}&cat=${cat}"`);

    await fetch(`${api}/q.php?q=${decodeURIComponent(askSearch)}&cat=${cat}`).then(async res => {
        if (res.status !== 200) return console.log(`Returned status ${res.status}`);
        let data = await res.text();
        if (JSON.parse(data)) {
            data = JSON.parse(data);
            let choicesArray = [ ];
            let resultsReached = false;
            data.forEach(async oneResult => {
                if (resultsReached) return;
                let size = oneResult.size*9.3132257461548E-10;
                size = size.toString().substring(0, 4);

                let categoryViewed = categories[oneResult.category][0];
                if (categories[oneResult.category][1]) { categoryViewed = `${categories[oneResult.category][1]}: ${categories[oneResult.category][0]}` };
                choicesArray.push({ title: `${categoryViewed} - ${oneResult.name} - ${size} GB`, value: `["${oneResult.info_hash}", "${oneResult.name}"]` });

                if (choicesArray.length === maxResults) {
                    resultsReached = true;
                    const { askResult } = await prompts({
                        type: 'select',
                        name: 'askResult',
                        message: 'Results',
                        choices: choicesArray
                    });

                    let selectedResult = JSON.parse(askResult);
                    if (copyTorrentLink) {
                        const clip = spawn('clip');
                        clip.stdin.write(`magnet:?xt=urn:btih:${selectedResult[0]}&dn=${encodeURIComponent(selectedResult[1])}&tr=${trackers.join("&tr=")}`);
                        clip.stdin.end();
                    }
                    if (executeTorrentLink) exec(`start magnet:?xt=urn:btih:${selectedResult[0]}&dn=${encodeURIComponent(selectedResult[1])}&tr=${trackers.join("&tr=")}`);
                }
            });
        } else {
            console.log(`Could not parse text:\n${data}`)
        }
    });
})();