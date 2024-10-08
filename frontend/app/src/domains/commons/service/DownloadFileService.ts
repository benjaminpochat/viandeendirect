export class DownloadFileService {
    public static produceDownloadPdfFile(pdfByteArray: void | Blob, fileName: string) {
        const blob = new Blob([pdfByteArray], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        link.click()
        URL.revokeObjectURL(url)
    }
}