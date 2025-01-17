import { useEffect } from 'react';

const TidioChat = () => {
  useEffect(() => {
    // Load Tidio Chat script
    const script = document.createElement('script');
    script.src = '//code.tidio.co/YOUR_TIDIO_KEY.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default TidioChat;