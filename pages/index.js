import { useState, useEffect } from 'react'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from 'lib/clientApp'
import MainFeedCard from 'components/MainFeedCard'
import Loading from 'components/Loading'

export default function Home() {
	const [posts, setPosts] = useState([])
	const [results, setResults] = useState([])
	const [search, setSearch] = useState('')
	const [isSortRecent, setIssortRecent] = useState(true)
	const [loadingData, setLoadingData] = useState(true)

	useEffect(async () => {
		const postsRef = collection(db, 'posts')
		const q = query(postsRef, orderBy('createdAt', 'desc'))
		const temp = []
		const querySnapshot = await getDocs(q)
		querySnapshot.forEach((doc) => {
			temp.push({ docID: doc.id, ...doc.data() })
		})
		setPosts(temp)
		setResults(temp)
		setLoadingData(false)
	}, [])

	useEffect(() => {
		if (search.length > 0) {
			const tempSearch = search.trim()
			const match = posts.filter(
				(post) =>
					post.description
						.toLowerCase()
						.match(`^${tempSearch.toLowerCase()}`) !== null
			)
			setResults(match)
		} else {
			setIssortRecent(true)
			setResults(posts)
		}
	}, [search])

	const sortRecent = () => {
		setIssortRecent(true)
		const temp = results.sort((a, b) => {
			return b.createdAt - a.createdAt
		})
		setResults(temp)
	}

	const sortViews = () => {
		setIssortRecent(false)
		const temp = results.sort((a, b) => {
			return b.views - a.views
		})
		setResults(temp)
	}

	return (
		<div>
			{loadingData ? (
				<Loading />
			) : (
				<div className='m-1'>
					<div className='my-10 p-1 flex flex-row gap-3 text-sm text-white'>
						<button
							onClick={sortRecent}
							className={`${
								isSortRecent
									? `text-gray-800 bg-gray-300`
									: `text-gray-300 bg-gray-800 hover:text-white`
							} p-2 rounded-xl relative group transition-all`}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
						</button>
						<button
							onClick={sortViews}
							className={`${
								isSortRecent
									? `text-gray-300 bg-gray-800 hover:text-white`
									: `text-black bg-gray-300`
							} p-2 rounded-xl relative group transition-all`}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
								/>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
								/>
							</svg>
						</button>
						<input
							type='text'
							placeholder='Search'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className='px-3 py-2 w-full border-2 border-transparent focus:border-red-800 bg-gray-800 outline-none rounded-xl transition-all'
						/>
					</div>
					{results.length === 0 ? (
						<div className='flex flex-col justify-center items-center mt-48'>
							<span className='text-gray-500'>
								No posts found
							</span>
						</div>
					) : (
						<div className='m-1'>
							{results.map((post) => (
								<MainFeedCard key={post.docID} {...post} />
							))}
						</div>
					)}
				</div>
			)}
		</div>
	)
}
