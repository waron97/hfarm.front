import React, { useContext, useEffect, useState } from 'react';
import { getUserPosts } from '../../utils/JobCallApi';
import { Call } from '../../utils/Types';
import { UserContext } from '../Auth/Auth';
import Spinner from '../Spinner.tsx/Spinner';
import './myposts.scss';

function MyPosts() {
  const [posts, setPosts] = useState<Call[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const ctx = useContext(UserContext);
  useEffect(() => {
    setLoading(true);
    if (ctx) {
      getUserPosts(ctx.user)
        .then((data) => {
          setPosts(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Non è stato possibile ottenere i tuoi post');
          setLoading(false);
        });
    }
  }, []);
  const postNodes = posts.map((post) => (
    <tr key={post.id}>
      <td>{post.title}</td>
      <td>{post.timePosted.toLocaleDateString()}</td>
      <td>{post.applications?.length}</td>
      <td className="no-linebreak">
        <a href={`/call/${post.id}`}>Vai a call</a>
      </td>
    </tr>
  ));
  if (loading) return <Spinner />;
  return (
    <div className="user-posts text-left p-4">
      <h1 className="text-center mb-3">Post</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-striped table-responsive-sm">
        <thead className="thead-dark">
          <tr>
            <th>Titolo</th>
            <th>Data</th>
            <th>Candidature</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{posts && postNodes}</tbody>
      </table>
    </div>
  );
}

export default MyPosts;
