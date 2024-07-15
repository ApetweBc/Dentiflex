import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

export default function Model() {
  const router = useRouter();
  const { model } = router.query;
  const [modelData, setModelData] = useState(null);

  
  useEffect(() => {
    if (model) {
      // Convert the JSON string to a JavaScript object
      try {
        const parsedModel = JSON.parse(model);
        setModelData(parsedModel);
        console.log("Model data:", parsedModel.material.color);
      } catch (e) {
        console.error("Failed to parse model JSON:", e);
      }
    }
  }, [model]);

  if (!modelData) {
    return <div>Loading...</div>;
  }
 
 
    
  return (
    <div>
      <h1 className="text-2xl font-bold text-center">Model {model}</h1>
      <div className="mt-4">
        <h2 className="text-xl">Rotation Values:</h2>
        <p>X: {modelData.material.color}</p>
      
      </div>
    </div>
  );
}
