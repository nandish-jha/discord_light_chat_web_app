import React from 'react'
import PostTitle from './postTitle'
import PostData from './postData'

export default function post ({ post }) {
  return (
    <div className='bg-gray-50 p-5 border my-1 rounded-md'>
      <PostTitle title={post.topic} id={post.id} />
      <PostData data={post.data} />
    </div>
  )
}
