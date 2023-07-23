import {http} from "../utils/http";

async function autoCheckStatusApi(cluster) {
    const url = '/api/auto/check/status'
    const response = await http.get(url,{
        headers: {
            'Cluster': cluster,
        }
    })
    return response.data
}

async function enableAutoCheckRunApi(cluster, enable) {
    let e = 0
    if (enable) {
        e = 1
    }
    const url = `/api/auto/check/run?enable=${e}`
    const response = await http.get(url,{
        headers: {
            'Cluster': cluster,
        }
    })
    return response.data
}

async function enableAutoCheckUpdateVersionApi(cluster, enable) {
    let e = 0
    if (enable) {
        e = 1
    }
    const url = `/api/auto/check/version?enable=${e}`
    const response = await http.get(url,{
        headers: {
            'Cluster': cluster,
        }
    })
    return response.data
}

export {
    autoCheckStatusApi,
    enableAutoCheckRunApi,
    enableAutoCheckUpdateVersionApi,
}