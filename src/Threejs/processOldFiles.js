// import fs from 'fs';
// import path from 'path';

// Function to check if the file has expired based on the name
const processOldFiles = (fileName) => {
  const datePattern = /^(\d{4}_\d{2}_\d{2}_\d{2}_\d{2}_\d{2})/;  // Regex to extract timestamp from the beginning
  const match = fileName.match(datePattern);

  if (!match) return false;  // Return false if no date is found in the name

  const fileTimestamp = match[1].replace(/_/g, '-');  // Replace underscores with hyphens for date parsing
  const fileDate = new Date(fileTimestamp.slice(0, 10) + 'T' + fileTimestamp.slice(11).replace(/-/g, ':'));

  const currentDate = new Date();
  const diffInDays = (currentDate - fileDate) / (1000 * 60 * 60 * 24);  // Calculate the difference in days

   if (diffInDays >= 3) {
    return 1;
    } else {
    return 0;
    }
 
 }  // Return true if the file is older than 3 days


 
export default processOldFiles;