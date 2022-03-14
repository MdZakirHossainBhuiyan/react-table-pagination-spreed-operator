import React, { useEffect, useState } from 'react';
import _ from "lodash";

const pageSize = 10;

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedPosts, setPaginatedPosts] = useState([]);

    useEffect(() => {
        fetch(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=0`)
        .then(res => res.json())
        .then(data => setPosts(data.hits))
        setPaginatedPosts(_(posts).slice(0).take(pageSize).value())
    },[])

    console.log('postInfo', posts);
    const pageCount = posts ? Math.ceil(posts.length/pageSize) : 0;
    if(pageCount === 1) return null;

    const pages = _.range(1, pageCount+1);

    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
        const startIndex = (pageNumber-1)*pageSize;
        const paginatedPost = _(posts).slice(startIndex).take(pageSize).value();
        setPaginatedPosts(paginatedPost);
    }

    return (
        <div>
            <h3 className='text-center mt-5 mb-3 text-primary'>Posts List</h3>

            <table className='table container'>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>URL</th>
                        <th>Created at</th>
                        <th>Author</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        paginatedPosts.map(post => (
                            <tr>
                                <td>{post.title}</td>
                                <td>{post.url}</td>
                                <td>{post.created_at}</td>
                                <td>{post.author}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <div className='container d-flex justify-content-center align-items-center'>
                <nav className='d-flex justify-content-center'>
                    <ul className='pagination'>
                        {
                            pages.map(page => (
                                <li className={page === currentPage ? "page-item active" : "page-item"}>
                                    <p onClick={() => handlePagination(page)} className='page-link m-1'>{page}</p>
                                </li>
                            ))
                        }
                    </ul>
                </nav>
                <p>{(currentPage*10)-9} - {currentPage*10} of {posts.length} posts</p>
            </div>

        </div>
    );
};

export default Posts;