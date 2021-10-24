import axios from 'axios'

export default async function handler(req, res) {
    const {
        method,
        query: { videoID },
    } = req

    if (method === 'GET') {
        const YOUTUBE_VIDEO_ENDPOINT =
            'https://www.googleapis.com/youtube/v3/videos?part=snippet'
        const YOUTUBE_CATEGORY_ENDPOINT =
            'https://youtube.googleapis.com/youtube/v3/videoCategories?part=id'

        const videoQuery = `${YOUTUBE_VIDEO_ENDPOINT}&id=${videoID}&key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`
        const videoResult = await axios.get(videoQuery)
        const videoThumbnail =
            videoResult.data.items[0].snippet.thumbnails.high.url
        const videoCategoryId = videoResult.data.items[0].snippet.categoryId

        const categoryQuery = `${YOUTUBE_CATEGORY_ENDPOINT}&id=${videoCategoryId}&key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`
        const categoryResult = (await axios.get(categoryQuery)).data.items[0]
            .snippet.title

        res.status(200).json({ videoThumbnail, categoryResult })
    } else {
        res.status(405).end()
    }
}
