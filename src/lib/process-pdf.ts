import pdfToText from "react-pdftotext"


export const processDocument = async (file: File) => {
  return pdfToText(file)
}
