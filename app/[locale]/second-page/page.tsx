import Link from 'next/link'

// @ts-ignore
export default function Page({ params: { lng } }) {
	return (
		<>
			<h1>Hi from second page!</h1>
			<Link href={`/${lng}`}>
				back
			</Link>
		</>
	)
}
