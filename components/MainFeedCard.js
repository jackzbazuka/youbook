import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/clientApp'

export default function FeedCard({
	docID,
	description,
	videoURL,
	videoCategory,
	videoThumbnail,
	views,
	username,
	createdAt,
}) {
	const formattedDate = createdAt.toDate().toString().split(' ').slice(1, 4)
	formattedDate[0] = [
		formattedDate[1],
		(formattedDate[1] = formattedDate[0]),
	][0]

	async function watchOnYoutube(e) {
		e.preventDefault()
		window.open(videoURL, '_blank')
		const docRef = doc(db, 'posts', docID)
		await updateDoc(docRef, {
			views: views + 1,
		})
	}

	return (
		<div className='h-48 w-full my-5 p-5 flex flex-row bg-gray-800 lg:hover:scale-102 transition-all duration-300 rounded-3xl'>
			<div className='w-2/3 flex flex-col'>
				<div className='h-1/5 text-xs flex flex-row justify-start items-center gap-1'>
					<span className='px-2 py-1 text-white rounded-xl bg-gray-900'>
						{videoCategory}
					</span>
					<span className='px-2 py-1 text-gray-300'>
						Posted by <span className='font-bold'>{username}</span>{' '}
						on {formattedDate.join(' ')}
					</span>
				</div>
				<div className='h-3/5 pt-3 text-base text-white'>
					{description}
				</div>
				<div className='h-1/5 flex flex-row justify-start items-center gap-5'>
					<button
						onClick={watchOnYoutube}
						className='text-gray-300 hover:text-indigo-600 transition-all outline-none'>
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
								d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
							/>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
					</button>
				</div>
			</div>
			<div className='w-1/3 flex flex-col justify-center'>
				<img
					src={videoThumbnail}
					className='h-40 border border-transparent hover:border-white hover:cursor-pointer rounded-xl transition-all'
					onClick={watchOnYoutube}
				/>
			</div>
		</div>
	)
}
