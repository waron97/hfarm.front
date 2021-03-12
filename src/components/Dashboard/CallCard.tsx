import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkIcon } from '../../utils/icons';
import { Call, FavoriteEditor, User } from '../../utils/Types';
import { UserContext } from '../Auth/Auth';

function CallCard(props: Call) {
  const taskbarBackgroundColor = props.type === 'internal' ? 'blue' : 'orange';
  const ctx = useContext(UserContext);
  const user: User | undefined = ctx?.user;
  const editFavorites: FavoriteEditor | undefined = ctx?.editFavorites;

  const isFavorite = user?.favorites?.includes(props.id);

  return (
    <div className="call-card text-left">
      <div
        className="call-taskbar"
        style={{ backgroundColor: taskbarBackgroundColor }}
      >
        {props.type}
        <div
          className={
            isFavorite ? 'bookmark-icon bookmark-selected' : 'bookmark-icon'
          }
          onClick={() => {
            if (isFavorite && user) {
              // setIsFavorite(false);
              editFavorites && editFavorites('remove', props.id);
              return;
            }
            // setIsFavorite(true);
            editFavorites && editFavorites('add', props.id);
          }}
        >
          <BookmarkIcon />
        </div>
      </div>
      <div className="body p-3">
        <div>
          <h2>{props.title}</h2>
        </div>
        {props.type === 'external' && (
          <div>
            <span>{props.clientId}</span>
          </div>
        )}
        <div>
          <span>{props.timePosted.toLocaleDateString()}</span>
        </div>
      </div>
      <div className="button-apply">
        <button className="btn btn-primary">
          <Link to={`/call/${props.id}`}>Apply</Link>
        </button>
      </div>
    </div>
  );
}

export default CallCard;
