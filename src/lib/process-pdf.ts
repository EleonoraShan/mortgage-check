import pdfToText from "react-pdftotext"


export const processDocument = async (file: File) => {
  const pdfText = await pdfToText(file)
 return pdfText
}
