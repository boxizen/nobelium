import Link from 'next/link'

const TagItem = ({ tag }) => (
  <Link href={`/tag/${encodeURIComponent(tag)}`}>
    <p className="mr-1-full rounded-sm px-2 py-1 border leading-none text-xs dark:border-gray-600">
      {tag}
    </p>
  </Link>
)

export default TagItem
