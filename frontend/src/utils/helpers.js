export const sendFileToDownload = (fileName, fileContent) => {
  const url = window.URL.createObjectURL(new Blob([fileContent]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};
