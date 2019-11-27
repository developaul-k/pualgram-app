import React, { useState, useCallback } from 'react';

const useClientNode = () => {
  const [node, setNode] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) setTimeout(() => setNode(node), 0);
  }, []);
  return [node, ref];
};

export default useClientNode;
