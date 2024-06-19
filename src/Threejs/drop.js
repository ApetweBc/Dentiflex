import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function Dropzone({ onFilesAccepted }) {
  const onDrop = useCallback((acceptedFiles) => {
    onFilesAccepted(acceptedFiles);
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ['.stl'],
    multiple: true,
    maxFiles: 1,
    type: 'application/octet-stream',
  });

  return (
    <div {...getRootProps()} style={{ border: '2px dashed #cccccc', padding: '20px', textAlign: 'center' }}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag and drop some files here, or click to select files (STL file)</p>
      )}
    </div>
  );
}

Dropzone.propTypes = {
  onFilesAccepted: PropTypes.func.isRequired,
};
