import React from 'react';
import ReactDOM from 'react-dom';
import MediaPlayer from './MediaPlayer';

ReactDOM.render(
  <MediaPlayer
    id="issue-10"
    thumbnail="https://place-hold.it/1080x720?text=ISSUE_10"
    src="https://video.ibm.com/embed/recorded/130908580"
  />,
  document.getElementById('root')
);
