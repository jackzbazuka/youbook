import { useState, useEffect, useContext } from 'react'
import urlParser from 'js-video-url-parser/lib/base'
import 'js-video-url-parser/lib/provider/youtube'
import { useRouter } from 'next/router'
import {
	collection,
	query,
	where,
	orderBy,
	doc,
	getDocs,
	addDoc,
	deleteDoc,
	serverTimestamp,
} from 'firebase/firestore'
import axios from 'axios'
import { db } from '@/lib/clientApp'
import { UserContext } from '@/components/Layout'
import FeedCard from '@/components/FeedCard'
import Loading from '@/components/Loading'

export default function Profile() {
	const data = useContext(UserContext)
	const router = useRouter()
	const [posts, setPosts] = useState([])
	const [description, setDescription] = useState('')
	const [videoURL, setVideoURL] = useState('')
	const [loadingData, setLoadingData] = useState(true)
	const [update, setUpdate] = useState(true)

	useEffect(async () => {
		if (!data.user) {
			router.push('/')
		} else {
			const postsRef = collection(db, 'posts')
			const q = query(
				postsRef,
				where('uid', '==', data?.user?.uid),
				orderBy('createdAt')
			)
			const temp = []
			const querySnapshot = await getDocs(q)
			querySnapshot.forEach((doc) => {
				temp.push({ docID: doc.id, ...doc.data() })
			})
			setPosts(temp)
			setLoadingData(false)
		}
	}, [update])

	const createPost = async (e) => {
		e.preventDefault()
		const videoID = videoURL.split('/').at(-1).split('?').at(0)
		const res = (
			await axios.get('/api/dune', {
				params: {
					videoID,
				},
			})
		).data
		const postsRef = collection(db, 'posts')
		await addDoc(postsRef, {
			uid: data.user.uid,
			username: data.user.displayName,
			description: description,
			videoURL: videoURL,
			videoCategory: res.categoryResult,
			videoThumbnail: res.videoThumbnail,
			createdAt: serverTimestamp(),
			views: 0,
		})
		setDescription('')
		setVideoURL('')
		setUpdate(!update)
		setLoadingData(true)
	}

	const deletePost = async (e, postID) => {
		e.preventDefault()
		const postsRef = collection(db, 'posts')
		deleteDoc(doc(postsRef, postID))
		setUpdate(!update)
		setLoadingData(true)
	}

	return (
		<div className='w-full'>
			{data.user && !data.loading && (
				<div className='w-full'>
					<div className='w-full my-10 px-5 py-8 bg-gray-800 flex flex-row gap-2 text-sm rounded-3xl'>
						<input
							type='text'
							autoComplete='false'
							required
							maxLength={50}
							name='Description'
							placeholder='Description'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className='w-3/6 px-3 py-2 text-white border-2 border-transparent focus:border-red-800 bg-gray-900 outline-none rounded-xl transition-all'
						/>
						<input
							type='text'
							autoComplete='false'
							required
							maxLength={50}
							name='url'
							placeholder='Video URL'
							value={videoURL}
							onChange={(e) => setVideoURL(e.target.value)}
							className='w-2/6 px-3 py-2 text-white border-2 border-transparent focus:border-red-800 bg-gray-900 outline-none rounded-xl transition-all'
						/>
						<button
							onClick={createPost}
							className='w-1/6 text-white bg-red-700 hover:bg-red-800 outline-none rounded-xl transition-all'
						>
							Post
						</button>
					</div>
					{loadingData ? (
						<Loading />
					) : posts.length === 0 ? (
						<div className='flex flex-col justify-center items-center mt-48'>
							<span className='text-gray-500'>
								No posts found
							</span>
						</div>
					) : (
						<div className='mt-14'>
							{posts.map((post) => (
								<FeedCard
									key={post.docID}
									deletePost={deletePost}
									{...post}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	)
}
