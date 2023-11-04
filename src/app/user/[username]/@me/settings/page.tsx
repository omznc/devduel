export default function Page() {
	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-start gap-4'>
			<div
				className={
					'flex w-fit max-w-full flex-col items-center gap-8 text-center'
				}
			>
				<h2 className='fit-text bg-colored after:bg-blue-500 after:opacity-60'>
					{'Settings'}
				</h2>
			</div>
		</div>
	);
}
