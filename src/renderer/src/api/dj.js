import request from "@/utils/request";
export async function getDjCatlist() {
    return request({
        url:"/dj/catelist"
    })
}

export async function getDjPersonalizeRecommend(limit = 10) {
    const data = await request({
        url:`/dj/personalize/recommend?limit=${limit}`
    })
    return data
}