<template>
    <div class="page">
        <div class="head">

            <div class="cover" style="opacity: 0;">
                <img :src="vocaloidRank[0].cover" alt="" class="main"
                    @load="($event) => { $event.target.parentElement.style.opacity = '1' }" />
                <img :src="vocaloidRank[0].cover" alt="" class="blur" />
                <Icon icon="simple-icons:billboard" class="icon"/>
            </div>
        </div>

        <div class="ranks">
            <div class="rank" v-for="rank in vocaloidRank">
                <div class="rank-count" :class="{'first':rank?.rank == 1,'second':rank?.rank == 2,'third':rank?.rank == 3}">
                    {{ rank?.rank.padStart(2,"0") }}
                    <div class="tendence">
                            <div class="inc ted" v-if="rank?.rankChange > 0" style="color: rgb(245, 43, 21)">
                                <Icon icon="icon-park-solid:up-one" class="ico" />
                               <span>{{ rank?.rankChange }}</span>
                            </div>
                            <div class="inc ted" v-if="rank?.rankChange < 0" style="color: rgb(25, 114, 223);">
                                <Icon icon="icon-park-solid:down-one" class="ico"/>
                               <span>{{ rank?.rankChange }}</span>
                            </div>
                            <div class="eq ted" v-if="rank?.rankChange === 0">
                                <Icon icon="humbleicons:minus" class="ico"/>
                                <span>{{ rank?.rankChange }}</span>
                            </div>
                        </div>
                </div>
                <img :src="rank?.cover" alt="" class="rank-cover">
                <div class="detial">
                    <h2 class="name text-limit">{{ rank?.name }}</h2>
                    <span class="artist">{{ rank?.artist }}</span>
                </div>
            </div>


        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { onBeforeMount } from 'vue';
import { Icon } from '@iconify/vue';
import { onActivated } from 'vue';
import Song_Small from '@/components/Song_Small.vue';
import { player } from '@/main';
const vocaloidRank = ref([
    {
        "name": "ダイダイダイダイダイキライ",
        "artist": "雨良 Amala",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000231/500x_image231956.jpg",
        "url": "https://www.nicovideo.jp/watch/sm44759275",
        "rank": "1",
        "last": "1",
        "chartsIn": "チャートイン：6",
        "match": [
            {
                "id": 2686166750,
                "name": "ダイダイダイダイダイキライ",
                "artists": [
                    {
                        "id": 59372743,
                        "name": "雨良 Amala",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 266356602,
                    "name": "ダイダイダイダイダイキライ",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1742313600000,
                    "size": 3,
                    "copyrightId": 7003,
                    "status": 1,
                    "picId": 109951170626550050,
                    "mark": 0
                },
                "duration": 156711,
                "copyrightId": 7003,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "超级超级超级讨厌"
                ],
                "mvid": 22735013,
                "fee": 8,
                "rUrl": null,
                "mark": 17180139520
            },
            {
                "id": 2686166008,
                "name": "ダイダイダイダイダイキライ (Self Cover)",
                "artists": [
                    {
                        "id": 59372743,
                        "name": "雨良 Amala",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 266356602,
                    "name": "ダイダイダイダイダイキライ",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1742313600000,
                    "size": 3,
                    "copyrightId": 7003,
                    "status": 1,
                    "picId": 109951170626550050,
                    "mark": 0
                },
                "duration": 155908,
                "copyrightId": 7003,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 17180139520
            },
            {
                "id": 2686166751,
                "name": "ダイダイダイダイダイキライ (Instrumental)",
                "artists": [
                    {
                        "id": 51065737,
                        "name": "AMALA",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 266356602,
                    "name": "ダイダイダイダイダイキライ",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1742313600000,
                    "size": 3,
                    "copyrightId": 7003,
                    "status": 1,
                    "picId": 109951170626550050,
                    "mark": 0
                },
                "duration": 156085,
                "copyrightId": 7003,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 17180139520
            }
        ]
    },
    {
        "name": "テレパシ",
        "artist": "DECO*27",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000230/500x_image230877.jpg",
        "url": "https://www.nicovideo.jp/watch/sm44661043",
        "rank": "2",
        "last": "3",
        "chartsIn": "チャートイン：10",
        "match": [
            {
                "id": 2672829798,
                "name": "テレパシ",
                "artists": [
                    {
                        "id": 14001,
                        "name": "DECO*27",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 159692,
                        "name": "初音ミク",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 262102778,
                    "name": "テレパシ",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1740153600000,
                    "size": 1,
                    "copyrightId": 743010,
                    "status": 1,
                    "transNames": [
                        "心灵感应"
                    ],
                    "picId": 109951170461213140,
                    "mark": 0
                },
                "duration": 137746,
                "copyrightId": 743010,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "心灵感应"
                ],
                "mvid": 22725688,
                "fee": 8,
                "rUrl": null,
                "mark": 270464
            },
            {
                "id": 2639291583,
                "name": "モニタリング",
                "artists": [
                    {
                        "id": 14001,
                        "name": "DECO*27",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 159692,
                        "name": "初音ミク",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 251617453,
                    "name": "モニタリング",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1732291200000,
                    "size": 2,
                    "copyrightId": 743010,
                    "status": 1,
                    "transNames": [
                        "视奸"
                    ],
                    "picId": 109951170067309380,
                    "mark": 0
                },
                "duration": 176800,
                "copyrightId": 743010,
                "status": 0,
                "alias": [
                    "Monitoring"
                ],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "监视"
                ],
                "mvid": 22663994,
                "fee": 8,
                "rUrl": null,
                "mark": 270464
            },
            {
                "id": 432486474,
                "name": "妄想感傷代償連盟",
                "artists": [
                    {
                        "id": 14001,
                        "name": "DECO*27",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 159692,
                        "name": "初音ミク",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 34886308,
                    "name": "GHOST",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1474992000000,
                    "size": 13,
                    "copyrightId": 729012,
                    "status": 1,
                    "picId": 18495984602893576,
                    "mark": 0
                },
                "duration": 270000,
                "copyrightId": 729012,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "妄想感伤代偿联盟"
                ],
                "mvid": 5397146,
                "fee": 8,
                "rUrl": null,
                "mark": 17180139520
            }
        ]
    },
    {
        "name": "散財讃歌",
        "artist": "Adeliae",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000233/500x_image233486.jpg",
        "url": "https://www.nicovideo.jp/watch/sm44894862",
        "rank": "3",
        "last": "-",
        "chartsIn": "チャートイン：1",
        "match": [
            {
                "id": 2135490450,
                "name": "スタグフレーションガール (feat. 重音テト)",
                "artists": [
                    {
                        "id": 47715608,
                        "name": "Adeliae",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 1141075,
                        "name": "重音テト",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 188893160,
                    "name": "スタグフレーションガール",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1711900800000,
                    "size": 1,
                    "copyrightId": 743010,
                    "status": 1,
                    "picId": 109951169410331090,
                    "mark": 0
                },
                "duration": 132446,
                "copyrightId": 743010,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "停滞性膨胀女孩"
                ],
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 270464
            },
            {
                "id": 2689851540,
                "name": "Microwave (feat. 初音ミク)",
                "artists": [
                    {
                        "id": 47715608,
                        "name": "Adeliae",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 159692,
                        "name": "初音ミク",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 267539937,
                    "name": "Microwave",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1744128000000,
                    "size": 0,
                    "copyrightId": 743010,
                    "status": 1,
                    "picId": 109951170672984140,
                    "mark": 0
                },
                "duration": 201500,
                "copyrightId": 743010,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 270464
            },
            {
                "id": 2048235934,
                "name": "讃歌",
                "artists": [
                    {
                        "id": 21308,
                        "name": "スピッツ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 165842870,
                    "name": "ひみつスタジオ",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1684252800000,
                    "size": 13,
                    "copyrightId": 7003,
                    "status": 1,
                    "transNames": [
                        "秘密工作室"
                    ],
                    "picId": 109951168619866700,
                    "mark": 0
                },
                "duration": 225600,
                "copyrightId": 7003,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "赞歌"
                ],
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 17180139520
            }
        ]
    },
    {
        "name": "V.S",
        "artist": "大漠波新",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000233/500x_image233487.jpg",
        "url": "https://www.nicovideo.jp/watch/sm44902292",
        "rank": "4",
        "last": "-",
        "chartsIn": "チャートイン：1",
        "match": [
            {
                "id": 2695602084,
                "name": "V.S",
                "artists": [
                    {
                        "id": 54421622,
                        "name": "大漠波新",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 269205176,
                    "name": "V.S",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1745337600000,
                    "size": 1,
                    "copyrightId": 1418220,
                    "status": 1,
                    "picId": 109951170771862460,
                    "mark": 0
                },
                "duration": 211720,
                "copyrightId": 1418220,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 537141248
            },
            {
                "id": 2120430309,
                "name": "のだ",
                "artists": [
                    {
                        "id": 54421622,
                        "name": "大漠波新",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 53009171,
                        "name": "ずんだもん",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 159692,
                        "name": "初音ミク",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 1141075,
                        "name": "重音テト",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 184050408,
                    "name": "のだ",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1703085648927,
                    "size": 1,
                    "copyrightId": 0,
                    "status": 1,
                    "picId": 109951169282597760,
                    "mark": 0
                },
                "duration": 177485,
                "copyrightId": 0,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 22598930,
                "fee": 0,
                "rUrl": null,
                "mark": 262144
            },
            {
                "id": 2144269430,
                "name": "あいのうた",
                "artists": [
                    {
                        "id": 54421622,
                        "name": "大漠波新",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 159692,
                        "name": "初音ミク",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 1141075,
                        "name": "重音テト",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 191766931,
                    "name": "あいのうた",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1694395839614,
                    "size": 1,
                    "copyrightId": 0,
                    "status": 1,
                    "picId": 109951169484480540,
                    "mark": 0
                },
                "duration": 184766,
                "copyrightId": 0,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "爱之歌"
                ],
                "mvid": 0,
                "fee": 0,
                "rUrl": null,
                "mark": 262144
            }
        ]
    },
    {
        "name": "<img src=\"/scale/jackets/00000158/202x_P2_G3857502W.JPG\" alt=\"ＤＥＣＯ＊２７ 「ＴＲＡＮＳＦＯＲＭ」\">",
        "artist": "DECO*27",
        "cover": "https://billboard-japan.com/scale/jackets/00000158/202x_P2_G3857502W.JPG",
        "url": "/goods/detail/743322",
        "rank": "5",
        "last": "4",
        "chartsIn": "チャートイン：23"
    },
    {
        "name": "メズマライザー",
        "artist": "サツキ",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000215/500x_image215887.jpg",
        "url": "https://www.nicovideo.jp/watch/sm43708803",
        "rank": "6",
        "last": "2",
        "chartsIn": "チャートイン：39",
        "match": [
            {
                "id": 2156450569,
                "name": "メズマライザー",
                "artists": [
                    {
                        "id": 159692,
                        "name": "初音ミク",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 1141075,
                        "name": "重音テト",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 47041447,
                        "name": "サツキ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 196074727,
                    "name": "Circus‘s Detail",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1714195130225,
                    "size": 14,
                    "copyrightId": 2707442,
                    "status": 1,
                    "picId": 109951169594103020,
                    "mark": 0
                },
                "duration": 157013,
                "copyrightId": 2707442,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "催眠者"
                ],
                "mvid": 14726164,
                "fee": 0,
                "rUrl": null,
                "mark": 262144
            },
            {
                "id": 2153390036,
                "name": "メズマライザー (feat. 初音ミク&重音テト)",
                "artists": [
                    {
                        "id": 47041447,
                        "name": "サツキ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 159692,
                        "name": "初音ミク",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 1141075,
                        "name": "重音テト",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 194937319,
                    "name": "メズマライザー",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1715875200000,
                    "size": 1,
                    "copyrightId": 743010,
                    "status": 1,
                    "picId": 109951169568777740,
                    "mark": 0
                },
                "duration": 156972,
                "copyrightId": 743010,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "催眠师"
                ],
                "mvid": 14726164,
                "fee": 8,
                "rUrl": null,
                "mark": 270464
            },
            {
                "id": 2619927296,
                "name": "メズマライザー (feat. 初音ミク&重音テト)",
                "artists": [
                    {
                        "id": 47041447,
                        "name": "サツキ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 245787327,
                    "name": "Circus's Detail",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1724947200000,
                    "size": 17,
                    "copyrightId": 743010,
                    "status": 1,
                    "picId": 109951169896870200,
                    "mark": 0
                },
                "duration": 156972,
                "copyrightId": 743010,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 270464
            }
        ]
    },
    {
        "name": "テトリス",
        "artist": "柊マグネタイト",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000225/500x_image225969.jpg",
        "url": "https://www.nicovideo.jp/watch/sm44301514",
        "rank": "7",
        "last": "5",
        "chartsIn": "チャートイン：25",
        "match": [
            {
                "id": 2648491185,
                "name": "テトリス",
                "artists": [
                    {
                        "id": 37281800,
                        "name": "柊マグネタイト",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 1141075,
                        "name": "重音テト",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 254434247,
                    "name": "テトリス",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1732636800000,
                    "size": 1,
                    "copyrightId": 754016,
                    "status": 1,
                    "picId": 109951170171871200,
                    "mark": 0
                },
                "duration": 142588,
                "copyrightId": 754016,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "俄罗斯方块"
                ],
                "mvid": 22663012,
                "fee": 8,
                "rUrl": null,
                "mark": 17180139520
            },
            {
                "id": 2686854469,
                "name": "雑魚",
                "artists": [
                    {
                        "id": 37281800,
                        "name": "柊マグネタイト",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 266583041,
                    "name": "雑魚",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1742918400000,
                    "size": 1,
                    "copyrightId": 754016,
                    "status": 1,
                    "picId": 109951170632856400,
                    "mark": 0
                },
                "duration": 207999,
                "copyrightId": 754016,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 22725327,
                "fee": 8,
                "rUrl": null,
                "mark": 17180139520
            },
            {
                "id": 2678626434,
                "name": "ざぁこ",
                "artists": [
                    {
                        "id": 37281800,
                        "name": "柊マグネタイト",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 201393,
                        "name": "歌愛ユキ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 0,
                    "name": "",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 0,
                    "size": 0,
                    "copyrightId": 0,
                    "status": 0,
                    "picId": 109951170565897120,
                    "mark": 0
                },
                "duration": 207647,
                "copyrightId": 2707442,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "小杂鱼"
                ],
                "mvid": 22735568,
                "fee": 0,
                "rUrl": null,
                "mark": 262272
            }
        ]
    },
    {
        "name": "抜錨",
        "artist": "ナナホシ管弦楽団",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000210/500x_image210560.jpg",
        "url": "https://www.nicovideo.jp/watch/sm33360604",
        "rank": "8",
        "last": "-",
        "chartsIn": "チャートイン：3",
        "match": [
            {
                "id": 1830037405,
                "name": "シル・ヴ・プレジデント",
                "artists": [
                    {
                        "id": 37609983,
                        "name": "P丸様。",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 776030,
                        "name": "ナナホシ管弦楽団",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 124619153,
                    "name": "Sunny!!",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1615910400000,
                    "size": 15,
                    "copyrightId": 7003,
                    "status": 1,
                    "picId": 109951165810845340,
                    "mark": 0
                },
                "duration": 190493,
                "copyrightId": 7003,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "如果我成为大统领"
                ],
                "mvid": 14292218,
                "fee": 8,
                "rUrl": null,
                "mark": 17180139520
            },
            {
                "id": 1391439399,
                "name": "抜錨",
                "artists": [
                    {
                        "id": 776030,
                        "name": "ナナホシ管弦楽団",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 190523,
                        "name": "巡音ルカ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 81699061,
                    "name": "パワード・ワード・ワールド",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1510416000000,
                    "size": 8,
                    "copyrightId": 1418220,
                    "status": 0,
                    "picId": 109951167815723120,
                    "mark": 0
                },
                "duration": 204000,
                "copyrightId": 1418220,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 17717010432
            },
            {
                "id": 2065967992,
                "name": "抜錨 (feat. 巡音ルカ)",
                "artists": [
                    {
                        "id": 776030,
                        "name": "ナナホシ管弦楽団",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 190523,
                        "name": "巡音ルカ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 170107168,
                    "name": "初音ミク「マジカルミライ 2023」OFFICIAL ALBUM",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1690300800000,
                    "size": 0,
                    "copyrightId": 743010,
                    "status": 1,
                    "picId": 109951168754104980,
                    "mark": 0
                },
                "duration": 203000,
                "copyrightId": 743010,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "起航"
                ],
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 270464
            }
        ]
    },
    {
        "name": "オーバーライド",
        "artist": "吉田夜世",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000210/500x_image210689.jpg",
        "url": "https://www.nicovideo.jp/watch/sm43083649",
        "rank": "9",
        "last": "7",
        "chartsIn": "チャートイン：55",
        "match": [
            {
                "id": 2105374808,
                "name": "オーバーライド",
                "artists": [
                    {
                        "id": 54327744,
                        "name": "吉田夜世",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 1141075,
                        "name": "重音テト",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 180361623,
                    "name": "オーバーライド",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1701187200000,
                    "size": 1,
                    "copyrightId": 1418220,
                    "status": 1,
                    "transNames": [
                        "覆写"
                    ],
                    "picId": 109951169135087460,
                    "alia": [
                        "Override"
                    ],
                    "mark": 0
                },
                "duration": 138533,
                "copyrightId": 1418220,
                "status": 0,
                "alias": [
                    "OVERRIDE"
                ],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "覆写"
                ],
                "mvid": 22718615,
                "fee": 8,
                "rUrl": null,
                "mark": 17180139520
            },
            {
                "id": 2669755611,
                "name": "オーバーライド (Cover) [オリジナル歌手：吉田夜世]",
                "artists": [
                    {
                        "id": 47502610,
                        "name": "Mobile Melody Series",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 260937115,
                    "name": "Piano Relax Music vol.116",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1737648000000,
                    "size": 0,
                    "copyrightId": 1418220,
                    "status": 1,
                    "picId": 109951170428550500,
                    "mark": 0
                },
                "duration": 39412,
                "copyrightId": 1418220,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 270336
            },
            {
                "id": 2674343716,
                "name": "オーバーライド（カラオケ）[Originally Performed By 吉田夜世]",
                "artists": [
                    {
                        "id": 94661684,
                        "name": "カラオケまねきねこ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 262577131,
                    "name": "オーバーライド（カラオケ）[吉田夜世]",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1738771200000,
                    "size": 12,
                    "copyrightId": 754016,
                    "status": 1,
                    "picId": 109951170475818850,
                    "mark": 0
                },
                "duration": 143529,
                "copyrightId": 754016,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 270336
            }
        ]
    },
    {
        "name": "キティ",
        "artist": "ツミキ",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000233/500x_image233488.jpg",
        "url": "https://www.nicovideo.jp/watch/sm44914060",
        "rank": "10",
        "last": "-",
        "chartsIn": "チャートイン：1",
        "match": [
            {
                "id": 2076886698,
                "name": "シャットダウン・シティ",
                "artists": [
                    {
                        "id": 13645301,
                        "name": "ツミキ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 58309821,
                        "name": "DREAMERS",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 159692,
                        "name": "初音ミク",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 173396527,
                    "name": "シャットダウン・シティ",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1694102400000,
                    "size": 1,
                    "copyrightId": 1416336,
                    "status": 1,
                    "picId": 109951168870932560,
                    "alia": [
                        "DREAMERSのオムニバスCD『龍宮城』に書き下ろされた楽曲。"
                    ],
                    "mark": 0
                },
                "duration": 237746,
                "copyrightId": 1416336,
                "status": 0,
                "alias": [
                    "DREAMERSのオムニバスCD『龍宮城』に書き下ろされた楽曲。"
                ],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "终止・城市"
                ],
                "mvid": 0,
                "fee": 1,
                "rUrl": null,
                "mark": 17180139520
            },
            {
                "id": 2661739658,
                "name": "ヒミツのキティ",
                "artists": [
                    {
                        "id": 47520437,
                        "name": "ばたんキュン",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 258395446,
                    "name": "ヒミツのキティ",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1735660800000,
                    "size": 0,
                    "copyrightId": 1418220,
                    "status": 1,
                    "picId": 109951170334329800,
                    "mark": 0
                },
                "duration": 202736,
                "copyrightId": 1418220,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 537141248
            },
            {
                "id": 404543615,
                "name": "REFLEXIVITY",
                "artists": [
                    {
                        "id": 16266,
                        "name": "daniwellP",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 159692,
                        "name": "初音ミク",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 34515111,
                    "name": "CATS RULE THE WORLD",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1443801600000,
                    "size": 15,
                    "copyrightId": 743010,
                    "status": 0,
                    "picId": 109951164186080400,
                    "mark": 0
                },
                "duration": 142712,
                "copyrightId": 743010,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 270464
            }
        ]
    },
    {
        "name": "D/N/A",
        "artist": "Azari",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000232/500x_image232288.jpg",
        "url": "https://www.nicovideo.jp/watch/sm44817818",
        "rank": "11",
        "last": "9",
        "chartsIn": "チャートイン：5",
        "match": [
            {
                "id": 2693426774,
                "name": "D/N/A",
                "artists": [
                    {
                        "id": 49837848,
                        "name": "Azari",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 268705743,
                    "name": "D/N/A",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1744560000000,
                    "size": 1,
                    "copyrightId": 7002,
                    "status": 1,
                    "picId": 109951170712050450,
                    "mark": 0
                },
                "duration": 132800,
                "copyrightId": 7002,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 17717010432
            },
            {
                "id": 2695910914,
                "name": "D/N/A",
                "artists": [
                    {
                        "id": 49837848,
                        "name": "Azari",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 48153027,
                        "name": "25時、ナイトコードで。",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 54405247,
                        "name": "宵崎奏",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 160154,
                        "name": "鏡音リン",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 94531572,
                        "name": "朝比奈まふゆ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 94530703,
                        "name": "東雲絵名",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 94530704,
                        "name": "暁山瑞希",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 0,
                    "name": "",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 0,
                    "size": 0,
                    "copyrightId": 0,
                    "status": 0,
                    "picId": 109951170731443790,
                    "mark": 0
                },
                "duration": 129590,
                "copyrightId": 2707442,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "DNA"
                ],
                "mvid": 0,
                "fee": 0,
                "rUrl": null,
                "mark": 262272
            },
            {
                "id": 2697951498,
                "name": "D/N/A【初音ミク, 鏡音リン, 巡音ルカ, MEIKO】",
                "artists": [
                    {
                        "id": 49837848,
                        "name": "Azari",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 159692,
                        "name": "初音ミク",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 160154,
                        "name": "鏡音リン",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 1120148,
                        "name": "MEIKO",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 190523,
                        "name": "巡音ルカ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 269871245,
                    "name": "D/N/A",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1742473367494,
                    "size": 0,
                    "copyrightId": 2707442,
                    "status": 1,
                    "transNames": [
                        "D/N/A"
                    ],
                    "picId": 109951170819939000,
                    "mark": 0
                },
                "duration": 128016,
                "copyrightId": 2707442,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "D/N/A"
                ],
                "mvid": 0,
                "fee": 0,
                "rUrl": null,
                "mark": 262272
            }
        ]
    },
    {
        "name": "ゾンビアタック",
        "artist": "DIVELA",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000233/500x_image233489.jpg",
        "url": "https://www.nicovideo.jp/watch/sm44907235",
        "rank": "12",
        "last": "-",
        "chartsIn": "チャートイン：1"
    },
    {
        "name": "千本桜",
        "artist": "黒うさ",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000181/500x_image181529.jpg",
        "url": "https://www.nicovideo.jp/watch/sm15630734",
        "rank": "13",
        "last": "15",
        "chartsIn": "チャートイン：15",
        "match": [
            {
                "id": 26096272,
                "name": "千本桜",
                "artists": [
                    {
                        "id": 14610,
                        "name": "黒うさP",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 159692,
                        "name": "初音ミク",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 2386546,
                    "name": "千本桜",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1330444800000,
                    "size": 1,
                    "copyrightId": 743010,
                    "status": 1,
                    "transNames": [
                        "千本樱"
                    ],
                    "picId": 109951164270676620,
                    "mark": 0
                },
                "duration": 252467,
                "copyrightId": 743010,
                "status": 0,
                "alias": [
                    "千本樱"
                ],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "千本樱"
                ],
                "mvid": 5363602,
                "fee": 1,
                "rUrl": null,
                "mark": 17180139520
            },
            {
                "id": 22677433,
                "name": "千本桜",
                "artists": [
                    {
                        "id": 14610,
                        "name": "黒うさP",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 159692,
                        "name": "初音ミク",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 2080190,
                    "name": "初音ミク 5thバースデーベスト ～impacts～",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1343750400007,
                    "size": 19,
                    "copyrightId": 0,
                    "status": 1,
                    "picId": 109951169042224690,
                    "mark": 0
                },
                "duration": 245746,
                "copyrightId": 663018,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "千本樱"
                ],
                "mvid": 462269,
                "fee": 0,
                "rUrl": null,
                "mark": 17180131328
            },
            {
                "id": 26209798,
                "name": "千本桜",
                "artists": [
                    {
                        "id": 14610,
                        "name": "黒うさP",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 159692,
                        "name": "初音ミク",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 160154,
                        "name": "鏡音リン",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 190527,
                        "name": "鏡音レン",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 190523,
                        "name": "巡音ルカ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 12095248,
                        "name": "KAITO",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 1120148,
                        "name": "MEIKO",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 2422084,
                    "name": "5th Anniversary Best",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1362499200007,
                    "size": 17,
                    "copyrightId": 0,
                    "status": 1,
                    "picId": 2444214348571696,
                    "mark": 0
                },
                "duration": 245395,
                "copyrightId": 663018,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "千本樱"
                ],
                "mvid": 5403168,
                "fee": 0,
                "rUrl": null,
                "mark": 262144
            }
        ]
    },
    {
        "name": "WOLF",
        "artist": "バルーン",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000233/500x_image233169.jpg",
        "url": "https://www.nicovideo.jp/watch/sm44886492",
        "rank": "14",
        "last": "11",
        "chartsIn": "チャートイン：2",
        "match": [
            {
                "id": 2653133261,
                "name": "WOLF",
                "artists": [
                    {
                        "id": 12323255,
                        "name": "須田景凪",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 784134,
                        "name": "ヒトリエ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 255825104,
                    "name": "WOLF",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1733846400000,
                    "size": 1,
                    "copyrightId": 457010,
                    "status": 1,
                    "picId": 109951170220597730,
                    "mark": 0
                },
                "duration": 177835,
                "copyrightId": 457010,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 270464
            },
            {
                "id": 2695649984,
                "name": "WOLF",
                "artists": [
                    {
                        "id": 12323255,
                        "name": "須田景凪",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 269216977,
                    "name": "WOLF",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1745337600000,
                    "size": 1,
                    "copyrightId": 457010,
                    "status": 1,
                    "picId": 109951170729025400,
                    "mark": 0
                },
                "duration": 177834,
                "copyrightId": 457010,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 270464
            },
            {
                "id": 1466020944,
                "name": "WOLF（クリスタルサウンドVer）(「SUITS/スーツ」より)[カバー]",
                "artists": [
                    {
                        "id": 36165934,
                        "name": "快眠サウンド研究所",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 93056052,
                    "name": "ヒーリング効果ですぐに眠くなる快眠魔法の音楽シリーズ「最新JPOPSONGS2020」VOL.4",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1596038400000,
                    "size": 11,
                    "copyrightId": 457010,
                    "status": 1,
                    "transNames": [
                        "Healing sound JPOP2020 Vol.4"
                    ],
                    "picId": 109951165174973310,
                    "mark": 0
                },
                "duration": 99500,
                "copyrightId": 457010,
                "status": 0,
                "alias": [
                    "WOLF [Cover]"
                ],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 139392
            }
        ]
    },
    {
        "name": "雑魚",
        "artist": "柊マグネタイト",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000231/500x_image231698.jpg",
        "url": "https://www.nicovideo.jp/watch/sm44747244",
        "rank": "15",
        "last": "14",
        "chartsIn": "チャートイン：7",
        "match": [
            {
                "id": 2686854469,
                "name": "雑魚",
                "artists": [
                    {
                        "id": 37281800,
                        "name": "柊マグネタイト",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 266583041,
                    "name": "雑魚",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1742918400000,
                    "size": 1,
                    "copyrightId": 754016,
                    "status": 1,
                    "picId": 109951170632856400,
                    "mark": 0
                },
                "duration": 207999,
                "copyrightId": 754016,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 22725327,
                "fee": 8,
                "rUrl": null,
                "mark": 17180139520
            },
            {
                "id": 2678626434,
                "name": "ざぁこ",
                "artists": [
                    {
                        "id": 37281800,
                        "name": "柊マグネタイト",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 201393,
                        "name": "歌愛ユキ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 0,
                    "name": "",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 0,
                    "size": 0,
                    "copyrightId": 0,
                    "status": 0,
                    "picId": 109951170565897120,
                    "mark": 0
                },
                "duration": 207647,
                "copyrightId": 2707442,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "小杂鱼"
                ],
                "mvid": 22735568,
                "fee": 0,
                "rUrl": null,
                "mark": 262272
            }
        ]
    },
    {
        "name": "アンノウン・マザーグース",
        "artist": "wowaka",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000185/500x_image185488.jpg",
        "url": "https://www.nicovideo.jp/watch/sm31791630",
        "rank": "16",
        "last": "16",
        "chartsIn": "チャートイン：75",
        "match": [
            {
                "id": 502455381,
                "name": "アンノウン・マザーグース",
                "artists": [
                    {
                        "id": 15823,
                        "name": "wowaka",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 159692,
                        "name": "初音ミク",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 36037546,
                    "name": "Re:Start",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1504022400000,
                    "size": 24,
                    "copyrightId": 0,
                    "status": 0,
                    "picId": 109951163014923060,
                    "alia": [
                        "HATSUNE MIKU 10th Anniversary Album"
                    ],
                    "mark": 0
                },
                "duration": 279400,
                "copyrightId": 663018,
                "status": 0,
                "alias": [
                    "Unknown Mother-Goose"
                ],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "不为人知的鹅妈妈童谣（Unknown Mother-Goose）"
                ],
                "mvid": 5647073,
                "fee": 0,
                "rUrl": null,
                "mark": 17180131328
            },
            {
                "id": 1346104315,
                "name": "アンノウン・マザーグース",
                "artists": [
                    {
                        "id": 159692,
                        "name": "初音ミク",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 15823,
                        "name": "wowaka",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 75791881,
                    "name": "初音ミク「マジカルミライ 2018」LIVE",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1545840000000,
                    "size": 33,
                    "copyrightId": 663018,
                    "status": 0,
                    "picId": 109951163909680700,
                    "alia": [
                        "初音未来《魔法未来2018》演唱会"
                    ],
                    "mark": 0
                },
                "duration": 280981,
                "copyrightId": 663018,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "Unknown Mother-Goose（不为人知的鹅妈妈童谣）"
                ],
                "mvid": 0,
                "fee": 0,
                "rUrl": null,
                "mark": 262144
            },
            {
                "id": 2011844480,
                "name": "初音ミク-アンノウン・マザーグース2020大阪（现実逃避P / 嵐笑HHHT remix）",
                "artists": [
                    {
                        "id": 55213044,
                        "name": "嵐笑HT",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 157576481,
                    "name": "アンノウン・マザーグース2020大阪 wowaka/初音ミク",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1672761600000,
                    "size": 1,
                    "copyrightId": 0,
                    "status": 1,
                    "picId": 109951168207948770,
                    "mark": 0
                },
                "duration": 312494,
                "copyrightId": 0,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 0,
                "rUrl": null,
                "mark": 128
            }
        ]
    },
    {
        "name": "聖人君子でありたい",
        "artist": "しゃいと",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000233/500x_image233490.jpg",
        "url": "https://www.nicovideo.jp/watch/sm44886341",
        "rank": "17",
        "last": "-",
        "chartsIn": "チャートイン：1",
        "match": [
            {
                "id": 1819360270,
                "name": "ありえない二人",
                "artists": [
                    {
                        "id": 33820450,
                        "name": "兮子",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 94453599,
                    "name": "伝えたいこと",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1598495903145,
                    "size": 7,
                    "copyrightId": 0,
                    "status": 0,
                    "transNames": [
                        "《想要传达的事情》独白专辑"
                    ],
                    "picId": 109951165273468290,
                    "alia": [
                        "《想要传达的事情》人声专辑"
                    ],
                    "mark": 0
                },
                "duration": 174065,
                "copyrightId": 0,
                "status": 0,
                "alias": [
                    "不可能的两人"
                ],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 17180139584
            },
            {
                "id": 1474334844,
                "name": "優しい詩.",
                "artists": [
                    {
                        "id": 33820450,
                        "name": "兮子",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 94453599,
                    "name": "伝えたいこと",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1598495903145,
                    "size": 7,
                    "copyrightId": 0,
                    "status": 0,
                    "transNames": [
                        "《想要传达的事情》独白专辑"
                    ],
                    "picId": 109951165273468290,
                    "alia": [
                        "《想要传达的事情》人声专辑"
                    ],
                    "mark": 0
                },
                "duration": 236250,
                "copyrightId": 0,
                "status": 0,
                "alias": [
                    "温柔的诗."
                ],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 17180139584
            },
            {
                "id": 28381868,
                "name": "君との契約",
                "artists": [
                    {
                        "id": 17432,
                        "name": "松田彬人",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 2785099,
                    "name": "TVアニメ 中二病でも恋がしたい!戀 オリジナルサウンドトラック",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1396368000000,
                    "size": 0,
                    "copyrightId": 2706441,
                    "status": 1,
                    "picId": 5983542278489607,
                    "alia": [
                        "TV动画《中二病也要谈恋爱》原创音乐"
                    ],
                    "mark": 0
                },
                "duration": 93000,
                "copyrightId": 2706441,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 0,
                "rUrl": null,
                "mark": 9007199254872064
            }
        ]
    },
    {
        "name": "フォニイ",
        "artist": "ツミキ",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000175/500x_image175158.jpg",
        "url": "https://www.nicovideo.jp/watch/sm38833751",
        "rank": "18",
        "last": "20",
        "chartsIn": "チャートイン：100",
        "match": [
            {
                "id": 1900172235,
                "name": "フォニイ",
                "artists": [
                    {
                        "id": 47893107,
                        "name": "可不",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 13645301,
                        "name": "ツミキ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 136979508,
                    "name": "KAF+YOU KAFU COMPILATION ALBUM シンメトリー",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1637683200000,
                    "size": 8,
                    "copyrightId": 457010,
                    "status": 1,
                    "transNames": [
                        "KAF+YOU KAFU COMPILATION ALBUM SYMMETRY"
                    ],
                    "picId": 109951168567590910,
                    "mark": 0
                },
                "duration": 189884,
                "copyrightId": 457010,
                "status": 0,
                "alias": [
                    "phony"
                ],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "伪物"
                ],
                "mvid": 14576057,
                "fee": 1,
                "rUrl": null,
                "mark": 17180139520
            },
            {
                "id": 1921502668,
                "name": "フォニイ (Cover) [メロディー] [オリジナル歌手：ツミキ]",
                "artists": [
                    {
                        "id": 47502610,
                        "name": "Mobile Melody Series",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 140619040,
                    "name": "Mobile Melody Series Full omnibus vol.45",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1644508800000,
                    "size": 5,
                    "copyrightId": 1418220,
                    "status": 1,
                    "picId": 109951167064785340,
                    "mark": 0
                },
                "duration": 188264,
                "copyrightId": 1418220,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 8,
                "rUrl": null,
                "mark": 139264
            },
            {
                "id": 2696008950,
                "name": "フォニイ (Game size.)",
                "artists": [
                    {
                        "id": 0,
                        "name": "Fussy Eaters",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 49076193,
                        "name": "星乃一歌",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 94531582,
                        "name": "神代類",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 54405247,
                        "name": "宵崎奏",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 160154,
                        "name": "鏡音リン",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 269340945,
                    "name": "フォニイ",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1743446210225,
                    "size": 1,
                    "copyrightId": 2707442,
                    "status": 1,
                    "picId": 109951170732139470,
                    "mark": 0
                },
                "duration": 142994,
                "copyrightId": 2707442,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "Phony"
                ],
                "mvid": 0,
                "fee": 0,
                "rUrl": null,
                "mark": 262272
            }
        ]
    },
    {
        "name": "スカーレット",
        "artist": "Fumin",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000233/500x_image233491.jpg",
        "url": "https://www.nicovideo.jp/watch/sm44905013",
        "rank": "19",
        "last": "-",
        "chartsIn": "チャートイン：1",
        "match": [
            {
                "id": 491686974,
                "name": "誓い(リパブリック讃歌/アメリカ民謡)",
                "artists": [
                    {
                        "id": 12532835,
                        "name": "小杉保夫",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 35792318,
                    "name": "五星戦隊ダイレンジャー COMPLETE SONG COLLECTION",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 872092800007,
                    "size": 17,
                    "copyrightId": 0,
                    "status": 0,
                    "picId": 18548761162563584,
                    "alia": [
                        "超级战队 五星战队大连者 歌曲全集"
                    ],
                    "mark": 0
                },
                "duration": 219765,
                "copyrightId": 0,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 0,
                "rUrl": null,
                "mark": 262144
            },
            {
                "id": 1335819371,
                "name": "航行する移民船団 (交響曲宇宙戦艦ヤマト・第三楽章)",
                "artists": [
                    {
                        "id": 14243,
                        "name": "羽田健太郎",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 962327,
                        "name": "NHK交響楽団",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 74989370,
                    "name": "宇宙戦艦ヤマト 復活篇 ディレクターズカット オリジナル・サウンドトラック",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1346169600000,
                    "size": 47,
                    "copyrightId": -1,
                    "status": 0,
                    "picId": 109951163751373340,
                    "alia": [
                        "导演剪辑版《宇宙战舰大和号 复活篇》原声集"
                    ],
                    "mark": 0
                },
                "duration": 105200,
                "copyrightId": 0,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 0,
                "rUrl": null,
                "mark": 262144
            },
            {
                "id": 1355979599,
                "name": "大阪で生まれた女",
                "artists": [
                    {
                        "id": 15829,
                        "name": "渥美二郎",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 78276593,
                    "name": "ニューミュージック ベストカバーズ",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1464105600000,
                    "size": 10,
                    "copyrightId": 1416148,
                    "status": 1,
                    "picId": 109951163968528530,
                    "mark": 0
                },
                "duration": 292946,
                "copyrightId": 1416160,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 1,
                "rUrl": null,
                "mark": 17180139520
            }
        ]
    },
    {
        "name": "熱異常",
        "artist": "いよわ",
        "cover": "https://billboard-japan.com/scale/rankinfo/00000217/500x_image217090.jpg",
        "url": "https://www.nicovideo.jp/watch/sm41193299",
        "rank": "20",
        "last": "18",
        "chartsIn": "チャートイン：18",
        "match": [
            {
                "id": 1991191322,
                "name": "熱異常 (feat. 足立レイ)",
                "artists": [
                    {
                        "id": 36112698,
                        "name": "いよわ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 54418589,
                        "name": "足立レイ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 153583379,
                    "name": "熱異常 (feat. 足立レイ)",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1666368000000,
                    "size": 1,
                    "copyrightId": 1418220,
                    "status": 1,
                    "picId": 109951167985679070,
                    "mark": 0
                },
                "duration": 239999,
                "copyrightId": 1418220,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "热异常"
                ],
                "mvid": 14573916,
                "fee": 8,
                "rUrl": null,
                "mark": 17717010432
            },
            {
                "id": 2162863673,
                "name": "熱異常 (Game size.)",
                "artists": [
                    {
                        "id": 48153027,
                        "name": "25時、ナイトコードで。",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 12095248,
                        "name": "KAITO",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 36112698,
                        "name": "いよわ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 0,
                    "name": "",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 0,
                    "size": 0,
                    "copyrightId": 0,
                    "status": 0,
                    "picId": 109951169869289570,
                    "mark": 0
                },
                "duration": 121719,
                "copyrightId": 2707442,
                "status": 0,
                "alias": [
                    "游戏《世界计划：缤纷舞台》收录曲"
                ],
                "rtype": 0,
                "ftype": 0,
                "transNames": [
                    "热异常"
                ],
                "mvid": 22601599,
                "fee": 0,
                "rUrl": null,
                "mark": 262272
            },
            {
                "id": 2600758557,
                "name": "熱異常 (Shannon Remix)",
                "artists": [
                    {
                        "id": 31045024,
                        "name": "シャノン",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 36112698,
                        "name": "いよわ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    {
                        "id": 54418589,
                        "name": "足立レイ",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    }
                ],
                "album": {
                    "id": 239894182,
                    "name": "熱異常",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": null,
                        "alias": [],
                        "albumSize": 0,
                        "picId": 0,
                        "fansGroup": null,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                        "img1v1": 0,
                        "trans": null
                    },
                    "publishTime": 1691566416915,
                    "size": 1,
                    "copyrightId": 2707442,
                    "status": 1,
                    "picId": 109951169706848320,
                    "mark": 0
                },
                "duration": 229065,
                "copyrightId": 2707442,
                "status": 0,
                "alias": [],
                "rtype": 0,
                "ftype": 0,
                "mvid": 0,
                "fee": 0,
                "rUrl": null,
                "mark": 262272
            }
        ]
    }
])
const cacheTime = 2 * 60 * 1000
onBeforeMount(() => {
    console.log('1111')
    const cache = JSON.parse(localStorage.getItem('_billboard_cache') || null)
    if(!cache || Date.now() - cache?.time > cacheTime || !cache?.time){
        window.api.getBillboardVocaloidRank().then(
         data => {
             vocaloidRank.value = data
             localStorage.setItem('_billboard_cache',JSON.stringify({
                time:Date.now(),
                data
             }))
             
         }
     )
    }
    else{
        vocaloidRank.value = cache?.data
    }
    console.log(vocaloidRank.value)

})
function resetImageResolution(url, resolution) {
    return url.replace(/\/(\d+x)(?=_image)/, `/${resolution}x`)
}
function play(id){
    player.playInsertTracks(id,[],{})
}
</script>
<style scoped>
.head {
    width: 92%;
    height: 17rem;
    display: flex;
    align-items: center;
    justify-content: left;
    position: relative;

    .cover {
        height: 100%;
        aspect-ratio: 1/1;
        position: relative;
        display: flex;
        justify-content: center;
        transition: .3s ease;
    }

    .cover .main {
        width: 100%;
        height: 100%;
        position: absolute;
        border-radius: 5%;
    }

    .cover .blur {
        width: 95%;
        aspect-ratio: 1/1;
        position: absolute;
        border-radius: 5%;
        z-index: -1;
        filter: blur(15px);
        bottom: -1rem;
        opacity: 0.5;
    }
    .cover img{
        position: absolute;
        object-fit: cover;
    }
    .cover .icon{
        z-index: 2;
        width: 9rem;
        height: 9rem;
        position: absolute;
        left: 1rem;
        bottom: calc(1rem - 3.5rem);
    }
}
.ranks{
    width: 92%;
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.rank{
    display: flex;
    flex-direction: row;
    width: 100%;
    height: fit-content;
    align-items: center;
    justify-content: left;
    font-family: 'misans';
    background-color: var(--component-diff);
    box-sizing: border-box;
    padding: 0.5rem 1rem;
    border-radius: var(--br-2);
    box-shadow: var(--shadow);
    .rank-cover{
        width: 8rem;
        height: 8rem;
        aspect-ratio: 1/1;
        object-fit: cover;
        border-radius: var(--br-2);
        transition: all .3s ease-in-out;
    }
    .rank-cover:hover{
        transform: scale(1.05);
    }
    .rank-count{
        font-size: 3rem;
        font-weight: bold;
        color: var(--text-o-2);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0;
        margin-right: 1rem;
    }
    .detial{
        display: flex;
        flex-direction: column;
        flex: 1;
        margin-left: 1rem;
        .name{
            max-width: 20rem;
            font-size: 1.5rem;
        }

        .artist{
            font-size: 1rem;
            color: var(--text-o-4);
        }
    }
}

.tendence{
    
    .ted{
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-radius: var(--br-1);
        font-size: 1.1rem;
        font-weight: bold;

        .ico{
            width: 2em;
            height: 2em;
            color: inherit;
        }

        .inc .ico{
            color: rgb(245, 43, 21);
        }
        .dec{
            color: rgb(25, 114, 223);
        }
    }
}
.first{
    color: gold !important;
}
.second{
    color: rgb(255, 162, 0) !important;
}
.third{
    color: rgb(37, 197, 250) !important;
}
</style>