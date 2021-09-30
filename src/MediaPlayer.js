import PlayerAPI from 'ibm-video-streaming-web-player-api';
import React, { useEffect, useRef, useState } from 'react';

const MediaPlayer = ({ id, src, thumbnail }) => {
  const playerRef = useRef(null);
  const [viewer, setViewer] = useState(false);
  const [playerContentAvailable, setPlayerContentAvailable] = useState(false);

  const rootUrl = encodeURIComponent(window.location.origin);
  const srcUpdated = src
    ? `${src}?api-target-origin=${rootUrl}&showtitle=true&allowfullscreen=false&volume=50`
    : '';

  useEffect(() => {
    try {
      if (!playerRef.current) {
        return;
      }

      const onError = (event) => {
        const { name, message } = event;
        switch (name) {
          case 'autoplayRejected':
            throw new Error(message);
          // no default
        }
      };

      const onContentAvailable = (data) => {
        if (data === 'contentAvailable') {
          setPlayerContentAvailable(true);
        }
      };

      const v = PlayerAPI(playerRef.current?.id);
      v.addListener('contentAvailable', onContentAvailable);
      v.addListener('error', onError);

      setViewer(v);

      return () => {
        v.removeListener('contentAvailable', onContentAvailable);
        v.removeListener('error', onError);
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }, [playerRef]);

  const onPlay = () => viewer?.callMethod?.('play');
  const onPause = () => viewer?.callMethod?.('pause');

  if (!src) {
    return null;
  }

  return (
    <div style={{ width: 800, height: 450, margin: 40, position: 'relative' }}>
      <iframe
        ref={playerRef}
        id={id}
        title={id}
        src={srcUpdated}
        allowFullScreen={false}
        frameBorder='0'
        sandbox='allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation'
        width='800px'
        height='450px'
      />
      <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
        <img
          style={{ objectFit: 'cover', width: '100%', height: '100%', }}
          src={thumbnail}
          alt=''
        />
      </div>
      <p>
        {playerContentAvailable ? 'content is available' : 'loading...'}
      </p>
      <div style={{ paddingTop: 10 }}>
        <button onClick={onPlay} disabled={!playerContentAvailable}>
          play
        </button>
        <button onClick={onPause} disabled={!playerContentAvailable}>
          pause
        </button>
      </div>
    </div>
  );
};

export default MediaPlayer;
