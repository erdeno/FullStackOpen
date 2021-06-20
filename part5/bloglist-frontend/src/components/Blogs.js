/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types'
import Blog from './Blog'

const Blogs = ({
  blogs,
  like,
  user,
  handleDelete,
}) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  return (
    <>
      <h2>blogs</h2>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          like={like}
          user={user}
          handleDelete={handleDelete}
        />
      ))}
    </>
  )
}

Blog.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  like: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}
export default Blogs
